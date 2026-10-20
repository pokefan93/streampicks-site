"use strict";

/* ============================================================
   StreamPicks — creator / rights-holder takedown form
   Mirrors the waitlist form's Turnstile + JSON-POST contract,
   but collects the structured takedown fields and posts them
   to /api/takedown. Self-contained: only loaded on /takedown/.
   ============================================================ */

const TAKEDOWN_ENDPOINT = "/api/takedown";
const TURNSTILE_ACTION = "takedown_request";
const MAX_EMAIL_LENGTH = 254;
const TURNSTILE_SITE_KEY = String(
  (window.STREAMPICKS_PUBLIC_CONFIG && window.STREAMPICKS_PUBLIC_CONFIG.turnstileSiteKey) || ""
).trim();

/* ---------- Year stamp ---------- */
const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = String(new Date().getFullYear());
}

const form = document.getElementById("takedown-form");
const honeypotInput = document.getElementById("company");
const turnstileShell = document.getElementById("turnstile-shell");
const turnstileWidgetEl = document.getElementById("turnstile-widget");
const turnstileTokenInput = document.getElementById("turnstile-token");
const turnstileMessageEl = document.getElementById("turnstile-message");
const formMessage = document.getElementById("form-message");
const submitBtn = form ? form.querySelector('button[type="submit"]') : null;

function setFormMessage(text, state) {
  if (!formMessage) return;
  formMessage.textContent = text;
  formMessage.classList.remove("error", "success");
  if (state) formMessage.classList.add(state);
}

function setTurnstileMessage(text, state) {
  if (!turnstileMessageEl) return;
  turnstileMessageEl.textContent = text;
  turnstileMessageEl.classList.remove("error", "success");
  if (state) turnstileMessageEl.classList.add(state);
}

function isValidEmail(email) {
  if (!email || email.length > MAX_EMAIL_LENGTH) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(email);
}

function val(id) {
  const el = document.getElementById(id);
  return el ? String(el.value || "").trim() : "";
}

function checked(id) {
  const el = document.getElementById(id);
  return Boolean(el && el.checked);
}

function flagInvalid(id, invalid) {
  const el = document.getElementById(id);
  if (el) el.setAttribute("aria-invalid", invalid ? "true" : "false");
}

/* ---------- Turnstile (explicit render, same contract as the waitlist) ---------- */
function initTurnstile() {
  if (!turnstileShell || !turnstileWidgetEl || !turnstileTokenInput || !TURNSTILE_SITE_KEY) {
    if (turnstileShell) turnstileShell.hidden = true;
    return { enabled: false, ensureReady: async () => true, isReady: () => true, getToken: () => "", reset: () => {} };
  }

  let widgetId = null;
  let ready = false;

  const apiReady = new Promise((resolve) => {
    function render() {
      if (!window.turnstile || widgetId !== null) return;
      widgetId = window.turnstile.render(turnstileWidgetEl, {
        sitekey: TURNSTILE_SITE_KEY,
        action: TURNSTILE_ACTION,
        theme: "dark",
        callback(token) {
          turnstileTokenInput.value = token;
          setTurnstileMessage("", "");
        },
        "expired-callback"() {
          turnstileTokenInput.value = "";
          setTurnstileMessage("Security check expired. Please try again.", "error");
        },
        "error-callback"() {
          turnstileTokenInput.value = "";
          setTurnstileMessage("Security check failed to load. Please refresh and try again.", "error");
        }
      });
      ready = true;
      resolve();
    }

    if (window.turnstile) {
      render();
      return;
    }

    const existing = document.querySelector('script[data-turnstile-script="true"]');
    if (!existing) {
      const s = document.createElement("script");
      s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      s.async = true;
      s.defer = true;
      s.dataset.turnstileScript = "true";
      s.addEventListener("load", render, { once: true });
      s.addEventListener("error", () => {
        setTurnstileMessage("Security check failed to load. Please refresh and try again.", "error");
      }, { once: true });
      document.head.appendChild(s);
      return;
    }
    existing.addEventListener("load", render, { once: true });
  });

  return {
    enabled: true,
    isReady: () => ready,
    ensureReady: async () => { await apiReady; return ready; },
    getToken: () => turnstileTokenInput.value.trim(),
    reset: () => {
      turnstileTokenInput.value = "";
      setTurnstileMessage("", "");
      if (window.turnstile && widgetId !== null) window.turnstile.reset(widgetId);
    }
  };
}

const ERROR_COPY = {
  "missing-name": "Add your full legal name.",
  "invalid-email": "Enter a valid email address.",
  "invalid-role": "Choose your relationship to the creator.",
  "missing-creator": "Tell us which creator to remove.",
  "invalid-creator-url": "That channel link doesn't look like a valid URL.",
  "invalid-verification-url": "That verification link doesn't look like a valid URL.",
  "invalid-basis": "Choose a basis for the removal.",
  "statement-too-short": "Add a bit more detail in your statement.",
  "missing-signature": "Type your full legal name to sign.",
  "attestation-required": "Please confirm all three attestations.",
  "captcha-required": "Please complete the security check first.",
  "rate-limited": "Too many requests from this network. Please wait a while and try again.",
  "forbidden-origin": "Something went wrong. Please reload the page and try again.",
};

if (form && honeypotInput && turnstileTokenInput && formMessage && submitBtn) {
  let submitting = false;
  const ts = initTurnstile();

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (submitting) return;

    // ---- Client-side validation (mirrors the server, friendlier errors) ----
    const requesterName = val("requesterName");
    const requesterEmail = val("requesterEmail");
    const requesterRole = val("requesterRole");
    const creatorName = val("creatorName");
    const basis = val("basis");
    const statement = val("statement");
    const signature = val("signature");

    const checks = [
      ["requesterName", !requesterName, "Add your full legal name."],
      ["requesterEmail", !isValidEmail(requesterEmail), "Enter a valid email address."],
      ["requesterRole", !requesterRole, "Choose your relationship to the creator."],
      ["creatorName", !creatorName, "Tell us which creator to remove."],
      ["basis", !basis, "Choose a basis for the removal."],
      ["statement", statement.length < 20, "Add at least a sentence or two of detail."],
      ["signature", !signature, "Type your full legal name to sign."],
    ];

    let firstError = null;
    for (const [id, isBad, msg] of checks) {
      flagInvalid(id, isBad);
      if (isBad && !firstError) firstError = { id, msg };
    }
    if (firstError) {
      setFormMessage(firstError.msg, "error");
      const el = document.getElementById(firstError.id);
      if (el && typeof el.focus === "function") el.focus();
      return;
    }

    if (!checked("attestAuthority") || !checked("attestGoodFaith") || !checked("attestAccurate")) {
      setFormMessage("Please confirm all three attestations before submitting.", "error");
      return;
    }

    if (ts.enabled) {
      await ts.ensureReady();
      if (!ts.isReady()) {
        setTurnstileMessage("Security check is still loading. Please wait.", "error");
        return;
      }
      if (!ts.getToken()) {
        setTurnstileMessage("Please complete the security check first.", "error");
        return;
      }
    }

    submitting = true;
    submitBtn.disabled = true;
    submitBtn.setAttribute("aria-busy", "true");
    setFormMessage("Submitting…", "");

    try {
      const res = await fetch(TAKEDOWN_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requesterName,
          requesterEmail,
          requesterRole,
          organization: val("organization"),
          creatorName,
          creatorUrl: val("creatorUrl"),
          inAppReference: val("inAppReference"),
          basis,
          statement,
          verificationUrl: val("verificationUrl"),
          attestAuthority: checked("attestAuthority"),
          attestGoodFaith: checked("attestGoodFaith"),
          attestAccurate: checked("attestAccurate"),
          signature,
          company: honeypotInput.value,
          turnstileToken: ts.getToken()
        })
      });

      const payload = await res.json().catch(() => ({}));
      if (!res.ok || !payload.ok) {
        throw new Error(payload.error || "request-failed");
      }

      form.reset();
      ts.reset();
      setFormMessage(
        "Request received. We'll review it and email you if we need to verify anything. Thank you.",
        "success"
      );
      formMessage.scrollIntoView({ behavior: "smooth", block: "center" });
    } catch (err) {
      const code = err instanceof Error ? err.message : "request-failed";
      if (code.startsWith("captcha")) {
        setTurnstileMessage("Security check failed. Please try again.", "error");
        ts.reset();
        setFormMessage("", "");
      } else if (ERROR_COPY[code]) {
        setFormMessage(ERROR_COPY[code], "error");
      } else {
        setFormMessage("Something went wrong. Please try again in a moment, or email support@streampicks.app.", "error");
      }
    } finally {
      submitting = false;
      submitBtn.disabled = false;
      submitBtn.removeAttribute("aria-busy");
    }
  });
}
