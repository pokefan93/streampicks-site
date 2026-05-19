"use strict";

/* ============================================================
   StreamPicks marketing site — vanilla JS
   - IntersectionObserver reveals
   - Smooth anchor scrolling
   - Newsletter form (Turnstile + /api/waitlist contract)
   - Year stamp
   ============================================================ */

const MAX_EMAIL_LENGTH = 254;
const WAITLIST_ENDPOINT = "/api/waitlist";
const TURNSTILE_ACTION = "waitlist_signup";
const TURNSTILE_SITE_KEY = String(
  (window.STREAMPICKS_PUBLIC_CONFIG && window.STREAMPICKS_PUBLIC_CONFIG.turnstileSiteKey) || ""
).trim();

/* ---------- Year stamp ---------- */
const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = String(new Date().getFullYear());
}

/* ---------- Reveal on scroll ---------- */
const revealEls = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window && revealEls.length > 0) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
  );

  revealEls.forEach((el, i) => {
    el.style.setProperty("--reveal-delay", `${Math.min(i * 60, 240)}ms`);
    observer.observe(el);
  });
} else {
  revealEls.forEach((el) => el.classList.add("is-visible"));
}

/* ---------- Smooth anchor scroll (header-offset aware) ---------- */
const siteHeader = document.querySelector(".site-header");
document.querySelectorAll(".js-scroll").forEach((link) => {
  link.addEventListener("click", (event) => {
    const hash = link.getAttribute("href");
    if (!hash || !hash.startsWith("#")) return;
    const target = document.querySelector(hash);
    if (!target) return;

    event.preventDefault();
    const headerOffset = siteHeader ? siteHeader.getBoundingClientRect().height + 8 : 0;
    const top = target.getBoundingClientRect().top + window.scrollY - headerOffset;
    window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  });
});

/* ---------- Creator tile flip ---------- */
/* Each .creator-tile (excluding the CTA) toggles .is-flipped on click.
   Buttons handle keyboard activation natively (Enter / Space). */
document.querySelectorAll(".creator-tile").forEach((tile) => {
  if (tile.classList.contains("creator-tile--cta")) return;
  if (!(tile instanceof HTMLButtonElement)) return;
  tile.addEventListener("click", () => {
    const flipped = tile.classList.toggle("is-flipped");
    tile.setAttribute("aria-pressed", flipped ? "true" : "false");
  });
});

/* ---------- Creator gallery filter ---------- */
/* Toggles aria-pressed on chips + .hidden on tiles whose data-genre
   doesn't match. Tiles marked data-keep-visible always stay (e.g. CTA tile). */
const creatorFilterChips = document.querySelectorAll(".creator-filter__chip");
const creatorGrid = document.getElementById("creator-grid");
const creatorFilterStatus = document.getElementById("creator-filter-status");

if (creatorFilterChips.length > 0 && creatorGrid) {
  const tileItems = creatorGrid.querySelectorAll(":scope > li");

  function applyCreatorFilter(filter) {
    let visible = 0;
    tileItems.forEach((li) => {
      const tile = li.querySelector(".creator-tile");
      if (!tile) return;
      const keep = tile.dataset.keepVisible === "true";
      const matches = filter === "all" || tile.dataset.genre === filter;
      const show = keep || matches;
      li.hidden = !show;
      if (matches && !keep) visible += 1;
    });

    creatorFilterChips.forEach((chip) => {
      const active = chip.dataset.filter === filter;
      chip.classList.toggle("is-active", active);
      chip.setAttribute("aria-pressed", active ? "true" : "false");
    });

    if (creatorFilterStatus) {
      creatorFilterStatus.textContent =
        filter === "all"
          ? `Showing all ${visible} creators.`
          : `Showing ${visible} ${filter} creator${visible === 1 ? "" : "s"}.`;
    }
  }

  creatorFilterChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const filter = chip.dataset.filter || "all";
      applyCreatorFilter(filter);
    });
  });
}

/* ---------- Newsletter form ---------- */
const waitlistForm = document.getElementById("waitlist-form");
const emailInput = document.getElementById("email");
const honeypotInput = document.getElementById("company");
const turnstileShell = document.getElementById("turnstile-shell");
const turnstileWidgetEl = document.getElementById("turnstile-widget");
const turnstileTokenInput = document.getElementById("turnstile-token");
const turnstileMessageEl = document.getElementById("turnstile-message");
const formMessage = document.getElementById("form-message");
const submitBtn = waitlistForm ? waitlistForm.querySelector('button[type="submit"]') : null;

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

function initTurnstile() {
  if (!turnstileShell || !turnstileWidgetEl || !turnstileTokenInput) {
    return { enabled: false, ensureReady: async () => true, isReady: () => true, getToken: () => "", reset: () => {} };
  }

  if (!TURNSTILE_SITE_KEY) {
    turnstileShell.hidden = true;
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

if (waitlistForm && emailInput && honeypotInput && turnstileTokenInput && formMessage && submitBtn) {
  let submitting = false;
  const ts = initTurnstile();

  waitlistForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (submitting) return;

    const email = emailInput.value.trim();

    if (!isValidEmail(email)) {
      setFormMessage("Enter a valid email address.", "error");
      emailInput.setAttribute("aria-invalid", "true");
      return;
    }
    emailInput.setAttribute("aria-invalid", "false");

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
    setFormMessage("Sending…", "");

    try {
      const res = await fetch(WAITLIST_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          company: honeypotInput.value,
          turnstileToken: ts.getToken()
        })
      });

      const payload = await res.json().catch(() => ({}));
      if (!res.ok || !payload.ok) {
        throw new Error(payload.error || "request-failed");
      }

      if (payload.alreadySubscribed) {
        setFormMessage("You're already on the list. We'll keep you posted.", "success");
      } else {
        setFormMessage("You're in. Watch your inbox for launch updates.", "success");
      }
      waitlistForm.reset();
      ts.reset();
    } catch (err) {
      const code = err instanceof Error ? err.message : "request-failed";
      if (
        code === "captcha-required" ||
        code === "captcha-failed" ||
        code === "captcha-action-mismatch" ||
        code === "captcha-hostname-mismatch"
      ) {
        setTurnstileMessage("Security check failed. Please try again.", "error");
        ts.reset();
        setFormMessage("", "");
      } else if (code === "rate-limited") {
        setFormMessage("Too many attempts. Please wait a bit and try again.", "error");
      } else {
        setFormMessage("Something went wrong. Please try again in a moment.", "error");
      }
    } finally {
      submitting = false;
      submitBtn.disabled = false;
      submitBtn.removeAttribute("aria-busy");
    }
  });
}
