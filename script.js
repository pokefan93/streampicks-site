"use strict";

/* ============================================================
   StreamPicks marketing site — vanilla JS (no dependencies)
   - Year stamp · header scroll state · mobile drawer (focus-managed)
   - Reveal on scroll · smooth anchor scroll
   - Creator marquee (seamless loop) · Plus price toggle
   - Sticky mobile CTA + back-to-top
   - Newsletter form (Turnstile + /api/waitlist contract)
   ============================================================ */

const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
let prefersReducedMotion = motionPreference.matches;
document.documentElement.classList.add("site-ready");

/* Hero gameplay video — respect reduced-motion (fall back to the poster) */
const heroVideo = document.getElementById("hero-video");
if (heroVideo && prefersReducedMotion) { heroVideo.removeAttribute("autoplay"); heroVideo.pause(); }

/* Year */
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

/* Header scroll state + floating controls */
const siteHeader = document.querySelector(".site-header");
const mobileCta = document.getElementById("mobile-cta");
const toTop = document.getElementById("to-top");
function onScroll() {
  const y = window.scrollY || window.pageYOffset;
  if (siteHeader) siteHeader.classList.toggle("is-stuck", y > 12);
  const show = y > window.innerHeight * 0.6;
  if (mobileCta) {
    const downloads = document.getElementById("get");
    const rect = downloads && downloads.getBoundingClientRect();
    const nearDownloads = rect && rect.top < window.innerHeight && rect.bottom > 0;
    const visible = show && window.innerWidth < 900 && !nearDownloads;
    mobileCta.classList.toggle("is-visible", visible);
    mobileCta.inert = !visible;
  }
  if (toTop) toTop.classList.toggle("is-visible", show);
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();
if (toTop) toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" }));

/* Mobile drawer (focus-managed) */
const navToggle = document.getElementById("nav-toggle");
const navClose = document.getElementById("nav-close");
const mobileNav = document.getElementById("mobile-nav");
function trapTab(e) {
  if (e.key !== "Tab" || !mobileNav || !mobileNav.classList.contains("is-open")) return;
  const f = mobileNav.querySelectorAll('a[href], button:not([disabled])');
  if (!f.length) return;
  const first = f[0], last = f[f.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}
const backgroundInert = new Map();
function setNav(open, restoreFocus = true) {
  if (!mobileNav || !navToggle) return;
  if (open) {
    for (const element of document.body.children) {
      if (element === mobileNav || element.tagName === "SCRIPT") continue;
      backgroundInert.set(element, element.inert);
      element.inert = true;
    }
  } else {
    backgroundInert.forEach((inert, element) => { element.inert = inert; });
    backgroundInert.clear();
  }
  mobileNav.inert = !open;
  mobileNav.setAttribute("aria-hidden", String(!open));
  mobileNav.classList.toggle("is-open", open);
  navToggle.setAttribute("aria-expanded", open ? "true" : "false");
  navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  document.body.style.overflow = open ? "hidden" : "";
  if (open) { (navClose || mobileNav.querySelector("a")).focus(); document.addEventListener("keydown", trapTab); }
  else { document.removeEventListener("keydown", trapTab); if (restoreFocus) navToggle.focus(); onScroll(); }
}
if (navToggle) navToggle.addEventListener("click", () => setNav(!mobileNav.classList.contains("is-open")));
if (navClose) navClose.addEventListener("click", () => setNav(false));
if (mobileNav) mobileNav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setNav(false, false)));
document.addEventListener("keydown", (e) => { if (e.key === "Escape" && mobileNav && mobileNav.classList.contains("is-open")) setNav(false); });
window.matchMedia("(min-width: 900px)").addEventListener("change", (e) => { if (e.matches && mobileNav && mobileNav.classList.contains("is-open")) setNav(false); });

/* Reveal on scroll */
const revealEls = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window && revealEls.length && !prefersReducedMotion) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); } });
  }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
  document.documentElement.classList.add("motion-ready");
  revealEls.forEach((el, i) => { el.style.setProperty("--reveal-delay", `${Math.min(i * 45, 200)}ms`); io.observe(el); });
} else {
  revealEls.forEach((el) => el.classList.add("is-visible"));
}

/* Smooth anchor scroll (header-offset aware) */
document.querySelectorAll(".js-scroll").forEach((link) => {
  link.addEventListener("click", (event) => {
    const hash = link.getAttribute("href");
    if (!hash || !hash.startsWith("#")) return;
    const target = document.querySelector(hash);
    if (!target) return;
    event.preventDefault();
    const offset = siteHeader ? siteHeader.getBoundingClientRect().height + 10 : 0;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
    if (location.hash !== hash) history.pushState(null, "", hash);
    window.scrollTo({ top: Math.max(0, top), behavior: prefersReducedMotion ? "auto" : "smooth" });
  });
});

/* Creator gallery: keyboard-accessible pause control and hidden loop copies. */
const marqueeTrack = document.getElementById("marquee-track");
const marqueeToggle = document.getElementById("marquee-toggle");
function prepareMarquee() {
  if (!marqueeTrack || marqueeTrack.querySelector("[data-loop-copy]")) return;
  Array.from(marqueeTrack.children).forEach((node) => {
    const clone = node.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    clone.dataset.loopCopy = "true";
    marqueeTrack.appendChild(clone);
  });
}
if (!prefersReducedMotion) {
  prepareMarquee();
  if (marqueeToggle) marqueeToggle.hidden = false;
}
if (marqueeToggle && marqueeTrack) marqueeToggle.addEventListener("click", () => {
  const paused = marqueeTrack.classList.toggle("is-paused");
  marqueeToggle.setAttribute("aria-pressed", String(paused));
  marqueeToggle.textContent = paused ? "Play cards" : "Pause cards";
});
motionPreference.addEventListener("change", (event) => {
  prefersReducedMotion = event.matches;
  if (prefersReducedMotion) {
    document.documentElement.classList.remove("motion-ready");
    revealEls.forEach((el) => el.classList.add("is-visible"));
    if (heroVideo) heroVideo.pause();
  }
  if (!prefersReducedMotion) prepareMarquee();
  if (marqueeToggle) marqueeToggle.hidden = prefersReducedMotion;
});

/* Plus monthly / yearly price toggle */
(function priceToggle() {
  const btns = document.querySelectorAll(".plus-toggle__btn");
  if (!btns.length) return;
  const priceEl = document.querySelector("[data-price]");
  const unitEl = document.querySelector("[data-price-unit]");
  const noteEl = document.querySelector("[data-price-note]");
  const plans = {
    monthly: { price: "$7.99", unit: "/mo", note: "Billed monthly · cancel anytime" },
    yearly: { price: "$79.99", unit: "/yr", note: "Billed $79.99 yearly · about $6.67/month" },
  };
  btns.forEach((btn) => btn.addEventListener("click", () => {
    const plan = plans[btn.dataset.plan];
    if (!plan) return;
    btns.forEach((b) => { const on = b === btn; b.classList.toggle("is-active", on); b.setAttribute("aria-pressed", on ? "true" : "false"); });
    if (priceEl) priceEl.textContent = plan.price;
    if (unitEl) unitEl.textContent = plan.unit;
    if (noteEl) noteEl.textContent = plan.note;
  }));
})();

/* ============================================================
   Newsletter form (Turnstile + /api/waitlist)
   ============================================================ */
const MAX_EMAIL_LENGTH = 254;
const WAITLIST_ENDPOINT = "/api/waitlist";
const TURNSTILE_ACTION = "waitlist_signup";
const TURNSTILE_SITE_KEY = String((window.STREAMPICKS_PUBLIC_CONFIG && window.STREAMPICKS_PUBLIC_CONFIG.turnstileSiteKey) || "").trim();

const waitlistForm = document.getElementById("waitlist-form");
const emailInput = document.getElementById("email");
const honeypotInput = document.getElementById("company");
const turnstileShell = document.getElementById("turnstile-shell");
const turnstileWidgetEl = document.getElementById("turnstile-widget");
const turnstileTokenInput = document.getElementById("turnstile-token");
const turnstileMessageEl = document.getElementById("turnstile-message");
const formMessage = document.getElementById("form-message");
const submitBtn = waitlistForm ? waitlistForm.querySelector('button[type="submit"]') : null;

function setFormMessage(text, state) { if (!formMessage) return; formMessage.textContent = text; formMessage.classList.remove("error", "success"); if (state) formMessage.classList.add(state); }
function setTurnstileMessage(text, state) { if (!turnstileMessageEl) return; turnstileMessageEl.textContent = text; turnstileMessageEl.classList.remove("error", "success"); if (state) turnstileMessageEl.classList.add(state); }
function isValidEmail(email) { if (!email || email.length > MAX_EMAIL_LENGTH) return false; return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(email); }

function initTurnstile() {
  if (!turnstileShell || !turnstileWidgetEl || !turnstileTokenInput) return { enabled: false, ensureReady: async () => true, isReady: () => true, getToken: () => "", reset: () => {} };
  if (!TURNSTILE_SITE_KEY) { turnstileShell.hidden = true; return { enabled: false, ensureReady: async () => true, isReady: () => true, getToken: () => "", reset: () => {} }; }
  let widgetId = null, ready = false;
  const apiReady = new Promise((resolve) => {
    function render() {
      if (!window.turnstile || widgetId !== null) return;
      widgetId = window.turnstile.render(turnstileWidgetEl, {
        sitekey: TURNSTILE_SITE_KEY, action: TURNSTILE_ACTION, theme: "dark",
        callback(token) { turnstileTokenInput.value = token; setTurnstileMessage("", ""); },
        "expired-callback"() { turnstileTokenInput.value = ""; setTurnstileMessage("Security check expired. Please try again.", "error"); },
        "error-callback"() { turnstileTokenInput.value = ""; setTurnstileMessage("Security check failed to load. Please refresh and try again.", "error"); },
      });
      ready = true; resolve();
    }
    setTimeout(resolve, 8000); // never hang ensureReady()
    if (window.turnstile) { render(); return; }
    const existing = document.querySelector('script[data-turnstile-script="true"]');
    if (!existing) {
      const s = document.createElement("script");
      s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      s.async = true; s.defer = true; s.dataset.turnstileScript = "true";
      s.addEventListener("load", render, { once: true });
      s.addEventListener("error", () => { setTurnstileMessage("Security check failed to load. Please refresh and try again.", "error"); resolve(); }, { once: true });
      document.head.appendChild(s);
      return;
    }
    existing.addEventListener("load", render, { once: true });
  });
  return {
    enabled: true, isReady: () => ready, ensureReady: async () => { await apiReady; return ready; },
    getToken: () => turnstileTokenInput.value.trim(),
    reset: () => { turnstileTokenInput.value = ""; setTurnstileMessage("", ""); if (window.turnstile && widgetId !== null) window.turnstile.reset(widgetId); },
  };
}

if (waitlistForm && emailInput && honeypotInput && turnstileTokenInput && formMessage && submitBtn) {
  let submitting = false;
  let ts;
  const prepareSecurity = () => { if (!ts) ts = initTurnstile(); return ts; };
  waitlistForm.addEventListener("focusin", prepareSecurity, { once: true });
  if ("IntersectionObserver" in window) {
    const formObserver = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) { prepareSecurity(); formObserver.disconnect(); }
    }, { rootMargin: "200px" });
    formObserver.observe(waitlistForm);
  }
  waitlistForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (submitting) return;
    submitting = true;
    const email = emailInput.value.trim();
    if (!isValidEmail(email)) { setFormMessage("Enter a valid email address.", "error"); emailInput.setAttribute("aria-invalid", "true"); submitting = false; return; }
    emailInput.setAttribute("aria-invalid", "false");
    prepareSecurity();
    if (ts.enabled) {
      await ts.ensureReady();
      if (!ts.isReady()) { setTurnstileMessage("Security check is still loading. Please wait.", "error"); submitting = false; return; }
      if (!ts.getToken()) { setTurnstileMessage("Please complete the security check first.", "error"); submitting = false; return; }
    }
    submitBtn.disabled = true; submitBtn.setAttribute("aria-busy", "true"); setFormMessage("Sending…", "");
    const controller = new AbortController();
    const requestTimeout = setTimeout(() => controller.abort(), 15000);
    try {
      const res = await fetch(WAITLIST_ENDPOINT, { signal: controller.signal, method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, company: honeypotInput.value, turnstileToken: ts.getToken() }) });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok || !payload.ok) throw new Error(payload.error || "request-failed");
      setFormMessage(payload.alreadySubscribed ? "You're already on the list. We'll keep you posted." : "You're in. Watch your inbox for creator drops and game updates.", "success");
      waitlistForm.reset(); ts.reset();
    } catch (err) {
      const code = err instanceof Error ? err.message : "request-failed";
      if (["captcha-required", "captcha-failed", "captcha-action-mismatch", "captcha-hostname-mismatch"].includes(code)) { setTurnstileMessage("Security check failed. Please try again.", "error"); ts.reset(); setFormMessage("", ""); }
      else if (code === "rate-limited") setFormMessage("Too many attempts. Please wait a bit and try again.", "error");
      else setFormMessage("Something went wrong. Please try again in a moment.", "error");
    } finally { clearTimeout(requestTimeout); submitting = false; submitBtn.disabled = false; submitBtn.removeAttribute("aria-busy"); }
  });
}
