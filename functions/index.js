"use strict";

const crypto = require("node:crypto");
const admin = require("firebase-admin");
const logger = require("firebase-functions/logger");
const { defineSecret } = require("firebase-functions/params");
const { onRequest } = require("firebase-functions/v2/https");

admin.initializeApp();

const db = admin.firestore();
const turnstileSecretKey = defineSecret("TURNSTILE_SECRET_KEY");
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
const WAITLIST_COLLECTION = "waitlistEmails";
const RATE_LIMIT_COLLECTION = "waitlistRateLimits";
const HONEYPOT_FIELD = "company";
const TURNSTILE_TOKEN_FIELD = "turnstileToken";
const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const TURNSTILE_ACTION = "waitlist_signup";
const SHORT_WINDOW_MS = 10 * 60 * 1000;
const SHORT_WINDOW_LIMIT = 6;
const SHORT_BLOCK_MS = 30 * 60 * 1000;
const DAY_WINDOW_MS = 24 * 60 * 60 * 1000;
const DAY_WINDOW_LIMIT = 20;
const DAY_BLOCK_MS = 24 * 60 * 60 * 1000;
const MAX_USER_AGENT_LENGTH = 300;
const ALLOWED_ORIGIN_HOSTS = new Set([
  "streampicks.app",
  "www.streampicks.app",
  "streamdraft-a5cd3.web.app",
  "streamdraft-a5cd3.firebaseapp.com",
  "localhost",
  "127.0.0.1"
]);

function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

function normalizeText(value, maxLength) {
  return String(value || "").trim().slice(0, maxLength);
}

function buildHash(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function buildWaitlistId(email) {
  return buildHash(email);
}

function parseRequestBody(req) {
  if (req.body && typeof req.body === "object") {
    return req.body;
  }

  if (typeof req.body === "string" && req.body.trim()) {
    try {
      return JSON.parse(req.body);
    } catch (error) {
      return null;
    }
  }

  return {};
}

function getClientIp(req) {
  const forwardedFor = String(req.get("x-forwarded-for") || "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean)[0];

  return forwardedFor || String(req.ip || "").trim() || "unknown";
}

function getRequestHostname(req) {
  return String(req.get("host") || "")
    .toLowerCase()
    .split(":")[0];
}

function isOriginAllowed(req) {
  const origin = req.get("origin");
  if (!origin) {
    return true;
  }

  try {
    const originUrl = new URL(origin);
    const requestHostname = getRequestHostname(req);
    const originHostname = originUrl.hostname.toLowerCase();

    return originHostname === requestHostname || ALLOWED_ORIGIN_HOSTS.has(originHostname);
  } catch (error) {
    return false;
  }
}

async function consumeRateLimit(ipHash) {
  const nowMs = Date.now();
  const rateLimitRef = db.collection(RATE_LIMIT_COLLECTION).doc(ipHash);

  return db.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(rateLimitRef);
    const data = snapshot.exists ? snapshot.data() || {} : {};

    const currentBlockedUntilMs = Number(data.blockedUntilMs || 0);
    if (currentBlockedUntilMs > nowMs) {
      return {
        ok: false,
        retryAfterSeconds: Math.max(1, Math.ceil((currentBlockedUntilMs - nowMs) / 1000))
      };
    }

    let shortWindowStartedAtMs = Number(data.shortWindowStartedAtMs || 0);
    let shortWindowCount = Number(data.shortWindowCount || 0);
    if (nowMs - shortWindowStartedAtMs >= SHORT_WINDOW_MS) {
      shortWindowStartedAtMs = nowMs;
      shortWindowCount = 0;
    }

    let dayWindowStartedAtMs = Number(data.dayWindowStartedAtMs || 0);
    let dayWindowCount = Number(data.dayWindowCount || 0);
    if (nowMs - dayWindowStartedAtMs >= DAY_WINDOW_MS) {
      dayWindowStartedAtMs = nowMs;
      dayWindowCount = 0;
    }

    shortWindowCount += 1;
    dayWindowCount += 1;

    let blockedUntilMs = 0;
    if (dayWindowCount > DAY_WINDOW_LIMIT) {
      blockedUntilMs = nowMs + DAY_BLOCK_MS;
    } else if (shortWindowCount > SHORT_WINDOW_LIMIT) {
      blockedUntilMs = nowMs + SHORT_BLOCK_MS;
    }

    transaction.set(
      rateLimitRef,
      {
        ipHash,
        shortWindowStartedAtMs,
        shortWindowCount,
        dayWindowStartedAtMs,
        dayWindowCount,
        blockedUntilMs,
        updatedAtMs: nowMs,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      },
      { merge: true }
    );

    if (blockedUntilMs > nowMs) {
      return {
        ok: false,
        retryAfterSeconds: Math.max(1, Math.ceil((blockedUntilMs - nowMs) / 1000))
      };
    }

    return { ok: true };
  });
}

async function verifyTurnstileToken(token, clientIp, expectedHostname) {
  const secret = String(turnstileSecretKey.value() || "").trim();
  if (!secret) {
    throw new Error("turnstile-secret-missing");
  }

  const response = await fetch(TURNSTILE_VERIFY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      secret,
      response: token,
      remoteip: clientIp,
      idempotency_key: crypto.randomUUID()
    })
  });

  if (!response.ok) {
    throw new Error(`turnstile-siteverify-http-${response.status}`);
  }

  const payload = await response.json();
  if (!payload || !payload.success) {
    return {
      ok: false,
      error: "captcha-failed",
      details: Array.isArray(payload && payload["error-codes"]) ? payload["error-codes"] : []
    };
  }

  if (payload.action && payload.action !== TURNSTILE_ACTION) {
    return {
      ok: false,
      error: "captcha-action-mismatch"
    };
  }

  if (payload.hostname) {
    const hostname = String(payload.hostname).toLowerCase();
    if (hostname !== expectedHostname && !ALLOWED_ORIGIN_HOSTS.has(hostname)) {
      return {
        ok: false,
        error: "captcha-hostname-mismatch"
      };
    }
  }

  return { ok: true };
}

exports.waitlistSignup = onRequest(
  {
    region: "us-central1",
    secrets: [turnstileSecretKey]
  },
  async (req, res) => {
    res.set("Cache-Control", "no-store");

    if (req.method !== "POST") {
      res.status(405).json({
        ok: false,
        error: "method-not-allowed"
      });
      return;
    }

    if (!isOriginAllowed(req)) {
      res.status(403).json({
        ok: false,
        error: "forbidden-origin"
      });
      return;
    }

    const contentType = String(req.get("content-type") || "").toLowerCase();
    if (!contentType.includes("application/json")) {
      res.status(415).json({
        ok: false,
        error: "unsupported-media-type"
      });
      return;
    }

    const body = parseRequestBody(req);
    if (!body) {
      res.status(400).json({
        ok: false,
        error: "invalid-json"
      });
      return;
    }

    if (normalizeText(body[HONEYPOT_FIELD], 120)) {
      logger.warn("waitlistSignup honeypot triggered", {
        path: req.path || "/api/waitlist"
      });

      res.status(400).json({
        ok: false,
        error: "invalid-request"
      });
      return;
    }

    const email = normalizeEmail(body.email);
    const turnstileToken = normalizeText(body[TURNSTILE_TOKEN_FIELD], 2048);
    if (!EMAIL_REGEX.test(email)) {
      res.status(400).json({
        ok: false,
        error: "invalid-email"
      });
      return;
    }

    if (!turnstileToken) {
      res.status(400).json({
        ok: false,
        error: "captcha-required"
      });
      return;
    }

    const clientIp = getClientIp(req);
    const requestHostname = getRequestHostname(req);
    const ipHash = buildHash(clientIp);
    const waitlistId = buildWaitlistId(email);
    const waitlistRef = db.collection(WAITLIST_COLLECTION).doc(waitlistId);
    const submittedAt = admin.firestore.FieldValue.serverTimestamp();
    const userAgent = normalizeText(req.get("user-agent"), MAX_USER_AGENT_LENGTH);

    try {
      const rateLimit = await consumeRateLimit(ipHash);
      if (!rateLimit.ok) {
        if (rateLimit.retryAfterSeconds) {
          res.set("Retry-After", String(rateLimit.retryAfterSeconds));
        }

        res.status(429).json({
          ok: false,
          error: "rate-limited"
        });
        return;
      }

      const turnstileResult = await verifyTurnstileToken(turnstileToken, clientIp, requestHostname);
      if (!turnstileResult.ok) {
        res.status(400).json({
          ok: false,
          error: turnstileResult.error
        });
        return;
      }

      const snapshot = await waitlistRef.get();

      if (snapshot.exists) {
        await waitlistRef.set(
          {
            updatedAt: submittedAt,
            submitCount: admin.firestore.FieldValue.increment(1),
            lastSourcePath: req.path || "/api/waitlist",
            lastSubmitIpHash: ipHash,
            lastUserAgent: userAgent
          },
          { merge: true }
        );

        res.status(200).json({
          ok: true,
          alreadySubscribed: true
        });
        return;
      }

      await waitlistRef.set({
        email,
        emailLower: email,
        source: "website",
        sourcePath: req.path || "/api/waitlist",
        firstSubmitIpHash: ipHash,
        lastSubmitIpHash: ipHash,
        lastUserAgent: userAgent,
        submitCount: 1,
        createdAt: submittedAt,
        updatedAt: submittedAt
      });

      res.status(200).json({
        ok: true,
        alreadySubscribed: false
      });
    } catch (error) {
      logger.error("waitlistSignup failed", {
        message: error instanceof Error ? error.message : String(error)
      });

      res.status(500).json({
        ok: false,
        error: "internal"
      });
    }
  }
);
