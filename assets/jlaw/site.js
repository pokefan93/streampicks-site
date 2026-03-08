"use strict";

const root = document.documentElement;
const body = document.body;
const header = document.querySelector("[data-site-header]");
const nav = document.querySelector("[data-site-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const progressBar = document.querySelector("[data-progress-bar]");
const pageTransition = document.querySelector("[data-page-transition]");
const revealElements = [...document.querySelectorAll("[data-reveal]")];
const parallaxElements = [...document.querySelectorAll("[data-parallax-media]")];
const interactivePanels = [...document.querySelectorAll(".interactive-panel")];
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
const TRANSITION_KEY = "jlaw-page-transition";

function setMenuState(isOpen) {
  if (!nav || !navToggle) {
    return;
  }

  nav.classList.toggle("is-open", isOpen);
  navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  body.classList.toggle("menu-open", isOpen);
}

function closeMenuOnNavigate() {
  if (!nav) {
    return;
  }

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenuState(false));
  });
}

function initMenu() {
  if (!nav || !navToggle) {
    return;
  }

  navToggle.addEventListener("click", () => {
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";
    setMenuState(!isOpen);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 980) {
      setMenuState(false);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setMenuState(false);
    }
  });

  closeMenuOnNavigate();
}

function initHeaderState() {
  if (!header) {
    return;
  }

  const update = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 12);
  };

  update();
  window.addEventListener("scroll", update, { passive: true });
}

function initMotionMode() {
  if (reduceMotion) {
    revealElements.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  root.classList.add("motion-enhanced");
}

function initFontLoadingState() {
  if (!root.classList.contains("wf-loading")) {
    return;
  }

  window.setTimeout(() => {
    root.classList.remove("wf-loading");
  }, 3000);
}

function initRevealObserver() {
  if (reduceMotion || revealElements.length === 0) {
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.14,
      rootMargin: "0px 0px -10% 0px",
    }
  );

  revealElements.forEach((el) => observer.observe(el));
}

function initScrollEffects() {
  if (!progressBar && parallaxElements.length === 0) {
    return;
  }

  let rafId = null;

  const update = () => {
    rafId = null;

    const scrollTop = window.scrollY || root.scrollTop || 0;
    const maxScroll = Math.max(1, root.scrollHeight - window.innerHeight);
    const progress = Math.min(1, Math.max(0, scrollTop / maxScroll));
    root.style.setProperty("--scroll-progress", progress.toFixed(4));

    if (!reduceMotion) {
      const viewportCenter = window.innerHeight / 2;

      parallaxElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const speed = Number(el.getAttribute("data-parallax-media")) || 0.08;
        const elementCenter = rect.top + rect.height / 2;
        const shift = Math.max(-42, Math.min(42, (viewportCenter - elementCenter) * speed * 0.22));
        el.style.setProperty("--parallax-y", `${shift.toFixed(2)}px`);
      });
    }
  };

  const requestUpdate = () => {
    if (rafId !== null) {
      return;
    }

    rafId = window.requestAnimationFrame(update);
  };

  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);
  requestUpdate();
}

function initInteractivePanels() {
  if (!canHover || reduceMotion || interactivePanels.length === 0) {
    return;
  }

  interactivePanels.forEach((panel) => {
    panel.addEventListener("pointermove", (event) => {
      const bounds = panel.getBoundingClientRect();
      const x = ((event.clientX - bounds.left) / bounds.width) * 100;
      const y = ((event.clientY - bounds.top) / bounds.height) * 100;
      const tiltX = ((50 - y) / 50) * 1.8;
      const tiltY = ((x - 50) / 50) * 1.8;

      panel.style.setProperty("--spot-x", `${x.toFixed(2)}%`);
      panel.style.setProperty("--spot-y", `${y.toFixed(2)}%`);
      panel.style.setProperty("--tilt-x", `${tiltX.toFixed(2)}deg`);
      panel.style.setProperty("--tilt-y", `${tiltY.toFixed(2)}deg`);
    });

    panel.addEventListener("pointerleave", () => {
      panel.style.removeProperty("--spot-x");
      panel.style.removeProperty("--spot-y");
      panel.style.removeProperty("--tilt-x");
      panel.style.removeProperty("--tilt-y");
    });
  });
}

function isInternalLink(link) {
  const href = link.getAttribute("href");
  if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
    return false;
  }

  if (link.target === "_blank" || link.hasAttribute("download")) {
    return false;
  }

  try {
    const url = new URL(link.href, window.location.href);
    return url.origin === window.location.origin;
  } catch {
    return false;
  }
}

function beginPageLeave(url) {
  if (!pageTransition || reduceMotion) {
    window.location.href = url;
    return;
  }

  body.classList.add("is-leaving");
  sessionStorage.setItem(TRANSITION_KEY, "1");
  window.setTimeout(() => {
    window.location.href = url;
  }, 280);
}

function initPageTransitions() {
  if (!pageTransition) {
    return;
  }

  if (!reduceMotion && sessionStorage.getItem(TRANSITION_KEY) === "1") {
    body.classList.add("is-entering");
    sessionStorage.removeItem(TRANSITION_KEY);
    window.requestAnimationFrame(() => {
      window.setTimeout(() => {
        body.classList.remove("is-entering");
      }, 240);
    });
  }

  document.querySelectorAll("a[href]").forEach((link) => {
    link.addEventListener("click", (event) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        !isInternalLink(link)
      ) {
        return;
      }

      const destination = new URL(link.href, window.location.href);
      if (destination.href === window.location.href) {
        return;
      }

      event.preventDefault();
      beginPageLeave(destination.href);
    });
  });
}

initMotionMode();
initMenu();
initHeaderState();
initFontLoadingState();
initRevealObserver();
initScrollEffects();
initInteractivePanels();
initPageTransitions();
