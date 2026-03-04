"use strict";

const waitlistForm = document.getElementById("waitlist-form");
const emailInput = document.getElementById("email");
const formMessage = document.getElementById("form-message");
const yearEl = document.getElementById("year");
const root = document.documentElement;
const parallaxElements = document.querySelectorAll("[data-parallax]");

const STAR_COUNT = 26;
const MAX_EMAIL_LENGTH = 254;
const SHOOT_STARTS = [
  { left: "8%", top: "14%" },
  { left: "30%", top: "6%" },
  { left: "54%", top: "19%" },
];

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

  // deterministic stars so it doesnt jump around on refresh
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

  // if you ever add page transitions later, call this cleanup before unmount
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

// auto year so i dont gotta remember to update footer every jan lol
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

const revealElements = document.querySelectorAll(".reveal");

// simple scroll reveal, just enough motion so it doesnt feel stiff
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
    targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

// quick email check so ppl dont submit random junk
function isValidEmail(email) {
  if (!email || email.length > MAX_EMAIL_LENGTH) {
    return false;
  }
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(email);
}

if (waitlistForm && emailInput && formMessage) {
  waitlistForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const email = emailInput.value.trim();

    if (!isValidEmail(email)) {
      formMessage.textContent = "Enter a valid email address to join the waitlist.";
      formMessage.classList.remove("success");
      formMessage.classList.add("error");
      emailInput.setAttribute("aria-invalid", "true");
      return;
    }

    emailInput.setAttribute("aria-invalid", "false");
    formMessage.textContent = "You are on the list. We will send launch updates soon.";
    formMessage.classList.remove("error");
    formMessage.classList.add("success");

    // backend hookup goes here later when we wire teh real waitlist api
    // fetch("https://your-api.example.com/waitlist", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ email })
    // })

    waitlistForm.reset();
  });
}
