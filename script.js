"use strict";

const waitlistForm = document.getElementById("waitlist-form");
const emailInput = document.getElementById("email");
const waitlistHoneypotInput = document.getElementById("company");
const turnstileShell = document.getElementById("turnstile-shell");
const turnstileWidgetEl = document.getElementById("turnstile-widget");
const turnstileTokenInput = document.getElementById("turnstile-token");
const turnstileMessageEl = document.getElementById("turnstile-message");
const formMessage = document.getElementById("form-message");
const waitlistSubmitButton = waitlistForm ? waitlistForm.querySelector('button[type="submit"]') : null;
const yearEl = document.getElementById("year");
const root = document.documentElement;
const siteHeader = document.querySelector(".site-header");
const parallaxElements = document.querySelectorAll("[data-parallax]");
const glowCards = document.querySelectorAll(".card, .feature-card, .phone-screen, .plus-shell, .waitlist-wrap");
const heroCrownEl = document.querySelector(".hero-logo-icon");
const heroWordmarkEl = document.querySelector(".hero-logo-wordmark");
const footerWordmarkEl = document.querySelector(".footer-wordmark");

const STAR_COUNT = 26;
const MAX_EMAIL_LENGTH = 254;
const WAITLIST_ENDPOINT = "/api/waitlist";
const TURNSTILE_ACTION = "waitlist_signup";
const TURNSTILE_SITE_KEY = String(
  window.STREAMPICKS_PUBLIC_CONFIG && window.STREAMPICKS_PUBLIC_CONFIG.turnstileSiteKey
    ? window.STREAMPICKS_PUBLIC_CONFIG.turnstileSiteKey
    : ""
).trim();
const SHOOT_STARTS = [
  { left: "8%", top: "14%" },
  { left: "30%", top: "6%" },
  { left: "54%", top: "19%" },
];
const SECRET_SETTINGS = {
  holdMs: [850, 900, 1300],
};

function makeRand(seed) {
  let s = (seed * 1664525 + 1013904223) >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0x100000000;
  };
}

function initStarfield() {
  const field = document.getElementById("starfield");
  if (!field) {
    return;
  }

  const rand = makeRand(77);
  const phase = makeRand(13);

  // Keep the decorative star positions stable between refreshes.
  const stars = Array.from({ length: STAR_COUNT }, (_, i) => ({
    id: i,
    left: rand() * 95,
    top: rand() * 95,
    size: 1.2 + rand() * 1.4,
    peakOpacity: 0.18 + rand() * 0.48,
    duration: 2600 + rand() * 2800,
  }));

  stars.forEach((star) => {
    const el = document.createElement("span");
    const lowOpacity = star.peakOpacity * 0.07;
    const startPhase = phase();
    el.className = "star";
    el.style.left = `${star.left}%`;
    el.style.top = `${star.top}%`;
    el.style.width = `${star.size}px`;
    el.style.height = `${star.size}px`;
    el.style.setProperty("--peak-opacity", star.peakOpacity.toFixed(3));
    el.style.setProperty("--low-opacity", lowOpacity.toFixed(3));
    el.style.animationDuration = `${Math.round(star.duration)}ms`;
    el.style.animationDelay = `${Math.round(-star.duration * startPhase)}ms`;
    field.appendChild(el);
  });

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) {
    return;
  }

  const shootingEls = SHOOT_STARTS.map((pos, i) => {
    const slot = document.createElement("div");
    slot.className = "shooting-star-slot";
    slot.style.left = pos.left;
    slot.style.top = pos.top;
    slot.setAttribute("data-slot", String(i));

    const wrap = document.createElement("div");
    wrap.className = "shoot-wrap";

    const line = document.createElement("div");
    line.className = "shoot-line";
    wrap.appendChild(line);
    slot.appendChild(wrap);
    field.appendChild(slot);
    return slot;
  });

  let cancelled = false;
  let slotIdx = 0;
  const pending = [];

  function fire() {
    if (cancelled) {
      return;
    }

    const idx = slotIdx % SHOOT_STARTS.length;
    slotIdx += 1;
    const slot = shootingEls[idx];

    if (typeof slot.getAnimations === "function") {
      slot.getAnimations().forEach((anim) => anim.cancel());
    }
    slot.style.opacity = "0";
    slot.style.transform = "translate(0px, 0px)";

    slot.animate(
      [
        { opacity: 0, offset: 0 },
        { opacity: 0.88, offset: 0.15 },
        { opacity: 0, offset: 1 },
      ],
      {
        duration: 540,
        easing: "ease-out",
        fill: "forwards",
      }
    );

    slot.animate(
      [
        { transform: "translate(0px, 0px)" },
        { transform: "translate(165px, 82px)" },
      ],
      {
        duration: 540,
        easing: "ease-out",
        fill: "forwards",
      }
    );

    const t = setTimeout(fire, 3800 + Math.random() * 5200);
    pending.push(t);
  }

  const t0 = setTimeout(fire, 1400 + Math.random() * 2600);
  pending.push(t0);

  window.addEventListener("beforeunload", () => {
    cancelled = true;
    pending.forEach((timerId) => clearTimeout(timerId));
  });
}

initStarfield();

function initScrollEffects() {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) {
    root.style.setProperty("--scroll-progress", "0");
    return;
  }

  let rafId = null;
  const maxParallaxShift = 44;

  function update() {
    rafId = null;
    const scrollTop = window.scrollY || root.scrollTop || 0;
    const maxScroll = Math.max(1, root.scrollHeight - window.innerHeight);
    const progress = Math.min(1, Math.max(0, scrollTop / maxScroll));

    root.style.setProperty("--scroll-progress", progress.toFixed(4));

    parallaxElements.forEach((el) => {
      const speed = Number(el.getAttribute("data-parallax")) || 0.06;
      const y = Math.max(-maxParallaxShift, Math.min(maxParallaxShift, -scrollTop * speed));
      el.style.setProperty("--parallax-y", `${y.toFixed(2)}px`);
    });
  }

  function requestUpdate() {
    if (rafId !== null) {
      return;
    }
    rafId = window.requestAnimationFrame(update);
  }

  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);
  requestUpdate();
}

initScrollEffects();

function initCardSpotlight() {
  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (!canHover || glowCards.length === 0) {
    return;
  }

  glowCards.forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const bounds = card.getBoundingClientRect();
      const x = ((event.clientX - bounds.left) / bounds.width) * 100;
      const y = ((event.clientY - bounds.top) / bounds.height) * 100;
      card.style.setProperty("--spot-x", `${x.toFixed(2)}%`);
      card.style.setProperty("--spot-y", `${y.toFixed(2)}%`);
    });

    card.addEventListener("pointerleave", () => {
      card.style.setProperty("--spot-x", "50%");
      card.style.setProperty("--spot-y", "50%");
    });
  });
}

initCardSpotlight();

function initSecretReveal() {
  if (!heroCrownEl || !heroWordmarkEl || !footerWordmarkEl) {
    return;
  }

  const secretTargets = [heroCrownEl, heroWordmarkEl, footerWordmarkEl];
  secretTargets.forEach((target) => target.classList.add("secret-gesture-target"));

  // Keep the easter egg phrase encoded so it is not obvious in page source.
  const secretChars = [73, 32, 108, 111, 118, 101, 32, 66, 101, 99];
  let secretStage = 0;
  let holdTimerId = null;
  let chipEl = null;

  function decodeSecret() {
    return secretChars.map((code) => String.fromCharCode(code)).join("");
  }

  function clearHoldTimer() {
    if (holdTimerId !== null) {
      window.clearTimeout(holdTimerId);
      holdTimerId = null;
    }
  }

  function resetSecretSequence() {
    clearHoldTimer();
    secretStage = 0;
  }

  function startHold(event, targetIndex) {
    if (event.cancelable) {
      event.preventDefault();
    }

    if (targetIndex !== secretStage) {
      resetSecretSequence();
      return;
    }

    clearHoldTimer();
    holdTimerId = window.setTimeout(() => {
      completeHold(targetIndex);
    }, SECRET_SETTINGS.holdMs[targetIndex]);
  }

  function completeHold(targetIndex) {
    if (secretStage !== targetIndex) {
      resetSecretSequence();
      return;
    }

    const isFinalStage = targetIndex === SECRET_SETTINGS.holdMs.length - 1;
    if (isFinalStage) {
      showSecretChip();
      resetSecretSequence();
      return;
    }

    secretStage += 1;
    clearHoldTimer();
  }

  function showSecretChip() {
    if (!chipEl) {
      chipEl = document.createElement("div");
      chipEl.id = "secret-chip";
      chipEl.className = "secret-chip";
      chipEl.setAttribute("aria-live", "polite");
      chipEl.setAttribute("role", "status");
      document.body.appendChild(chipEl);
    }

    chipEl.textContent = decodeSecret();
    chipEl.classList.add("is-visible");
  }

  function stopHold() {
    clearHoldTimer();
  }

  secretTargets.forEach((target, index) => {
    target.addEventListener("touchstart", (event) => {
      startHold(event, index);
    }, { passive: false });
    target.addEventListener("mousedown", (event) => {
      startHold(event, index);
    });
    target.addEventListener("touchend", stopHold);
    target.addEventListener("touchcancel", stopHold);
    target.addEventListener("mouseup", stopHold);
    target.addEventListener("mouseleave", stopHold);
    target.addEventListener("contextmenu", (event) => {
      event.preventDefault();
    });
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      resetSecretSequence();
    }
  });
}

initSecretReveal();

if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  revealElements.forEach((section, index) => {
    const delay = Math.min(index * 70, 280);
    section.style.setProperty("--reveal-delay", `${delay}ms`);
    revealObserver.observe(section);
  });
} else {
  revealElements.forEach((section) => {
    section.classList.add("is-visible");
  });
}

document.querySelectorAll(".js-scroll").forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href");
    if (!targetId || !targetId.startsWith("#")) {
      return;
    }

    const targetEl = document.querySelector(targetId);
    if (!targetEl) {
      return;
    }

    event.preventDefault();
    const headerOffset = siteHeader ? siteHeader.getBoundingClientRect().height + 8 : 0;
    const targetTop = targetEl.getBoundingClientRect().top + window.scrollY - headerOffset;
    window.scrollTo({ top: Math.max(0, targetTop), behavior: "smooth" });
  });
});

function isValidEmail(email) {
  if (!email || email.length > MAX_EMAIL_LENGTH) {
    return false;
  }
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(email);
}

function setWaitlistMessage(message, state) {
  if (!formMessage) {
    return;
  }

  formMessage.textContent = message;
  formMessage.classList.remove("error", "success");

  if (state) {
    formMessage.classList.add(state);
  }
}

function setTurnstileMessage(message, state) {
  if (!turnstileMessageEl) {
    return;
  }

  turnstileMessageEl.textContent = message;
  turnstileMessageEl.classList.remove("error", "success");

  if (state) {
    turnstileMessageEl.classList.add(state);
  }
}

function clearTurnstileMessage() {
  setTurnstileMessage("", "");
}

function initTurnstile() {
  if (!turnstileShell || !turnstileWidgetEl || !turnstileTokenInput) {
    return {
      enabled: false,
      isReady: true,
      getToken: () => "",
      reset: () => {}
    };
  }

  if (!TURNSTILE_SITE_KEY) {
    turnstileShell.hidden = true;
    return {
      enabled: false,
      isReady: true,
      getToken: () => "",
      reset: () => {}
    };
  }

  let widgetId = null;
  let widgetReady = false;

  const apiReady = new Promise((resolve) => {
    function renderWidget() {
      if (!window.turnstile || widgetId !== null) {
        return;
      }

      widgetId = window.turnstile.render(turnstileWidgetEl, {
        sitekey: TURNSTILE_SITE_KEY,
        action: TURNSTILE_ACTION,
        callback(token) {
          turnstileTokenInput.value = token;
          clearTurnstileMessage();
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

      widgetReady = true;
      resolve();
    }

    if (window.turnstile) {
      renderWidget();
      return;
    }

    const existingScript = document.querySelector('script[data-turnstile-script="true"]');
    if (!existingScript) {
      const script = document.createElement("script");
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      script.dataset.turnstileScript = "true";
      script.addEventListener("load", renderWidget, { once: true });
      script.addEventListener("error", () => {
        setTurnstileMessage("Security check failed to load. Please refresh and try again.", "error");
      }, { once: true });
      document.head.appendChild(script);
      return;
    }

    existingScript.addEventListener("load", renderWidget, { once: true });
  });

  return {
    enabled: true,
    isReady() {
      return widgetReady;
    },
    async ensureReady() {
      await apiReady;
      return widgetReady;
    },
    getToken() {
      return turnstileTokenInput.value.trim();
    },
    reset() {
      turnstileTokenInput.value = "";
      clearTurnstileMessage();
      if (window.turnstile && widgetId !== null) {
        window.turnstile.reset(widgetId);
      }
    }
  };
}

if (
  waitlistForm &&
  emailInput &&
  waitlistHoneypotInput &&
  turnstileTokenInput &&
  formMessage &&
  waitlistSubmitButton
) {
  let isSubmittingWaitlist = false;
  const turnstileState = initTurnstile();

  waitlistForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (isSubmittingWaitlist) {
      return;
    }

    const email = emailInput.value.trim();

    if (!isValidEmail(email)) {
      setWaitlistMessage("Enter a valid email address to join the waitlist.", "error");
      emailInput.setAttribute("aria-invalid", "true");
      return;
    }

    emailInput.setAttribute("aria-invalid", "false");

    if (turnstileState.enabled) {
      await turnstileState.ensureReady();

      if (!turnstileState.isReady()) {
        setTurnstileMessage("Security check is still loading. Please wait a moment.", "error");
        return;
      }

      if (!turnstileState.getToken()) {
        setTurnstileMessage("Please complete the security check first.", "error");
        return;
      }
    }

    isSubmittingWaitlist = true;
    waitlistSubmitButton.disabled = true;
    waitlistSubmitButton.setAttribute("aria-busy", "true");
    setWaitlistMessage("Joining the waitlist...", "");

    try {
      const response = await fetch(WAITLIST_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          company: waitlistHoneypotInput.value,
          turnstileToken: turnstileState.getToken()
        })
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok || !payload.ok) {
        throw new Error(payload.error || "request-failed");
      }

      if (payload.alreadySubscribed) {
        setWaitlistMessage("You're already on the list. We'll keep you posted.", "success");
      } else {
        setWaitlistMessage("You're on the list. We'll send early access and launch updates soon.", "success");
      }

      waitlistForm.reset();
      turnstileState.reset();
    } catch (error) {
      const errorCode = error instanceof Error ? error.message : "request-failed";

      if (errorCode === "captcha-required" || errorCode === "captcha-failed" || errorCode === "captcha-action-mismatch" || errorCode === "captcha-hostname-mismatch") {
        setTurnstileMessage("Security check failed. Please try again.", "error");
        turnstileState.reset();
        setWaitlistMessage("", "");
      } else if (errorCode === "rate-limited") {
        setWaitlistMessage("Too many attempts right now. Please wait a bit and try again.", "error");
      } else {
        setWaitlistMessage("Something went wrong. Please try again in a moment.", "error");
      }
    } finally {
      isSubmittingWaitlist = false;
      waitlistSubmitButton.disabled = false;
      waitlistSubmitButton.removeAttribute("aria-busy");
    }
  });
}
