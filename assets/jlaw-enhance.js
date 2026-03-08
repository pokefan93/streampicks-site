"use strict";

(function initJlawEnhancements() {
  const root = document.documentElement;
  const body = document.body;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const TRANSITION_KEY = "jlaw-transition";

  function buildProgressBar() {
    if (document.querySelector(".jlaw-progress")) {
      return;
    }

    const progress = document.createElement("div");
    progress.className = "jlaw-progress";
    progress.setAttribute("aria-hidden", "true");

    const bar = document.createElement("span");
    bar.className = "jlaw-progress__bar";
    progress.appendChild(bar);
    document.body.appendChild(progress);
  }

  function buildTransitionOverlay() {
    if (document.querySelector(".jlaw-transition")) {
      return;
    }

    const transition = document.createElement("div");
    transition.className = "jlaw-transition";
    transition.setAttribute("aria-hidden", "true");

    const liveLogo = document.querySelector('img[alt="J.LAW"], img[alt="JLaw"], img[src*="J.LAW_White"], img[src*="JLAW_White"]');
    if (liveLogo) {
      const logo = liveLogo.cloneNode(true);
      logo.className = "jlaw-transition__logo";
      logo.removeAttribute("sizes");
      logo.removeAttribute("srcset");
      transition.appendChild(logo);
    }

    body.appendChild(transition);
  }

  function updateScrollProgress() {
    const maxScroll = Math.max(1, root.scrollHeight - window.innerHeight);
    const progress = Math.min(1, Math.max(0, window.scrollY / maxScroll));
    root.style.setProperty("--jlaw-scroll-progress", progress.toFixed(4));
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

  function beginLeave(url) {
    if (reduceMotion) {
      window.location.href = url;
      return;
    }

    body.classList.add("jlaw-is-leaving");
    sessionStorage.setItem(TRANSITION_KEY, "1");
    window.setTimeout(() => {
      window.location.href = url;
    }, 220);
  }

  function initPageTransitions() {
    if (!reduceMotion && sessionStorage.getItem(TRANSITION_KEY) === "1") {
      body.classList.add("jlaw-is-entering");
      sessionStorage.removeItem(TRANSITION_KEY);
      window.setTimeout(() => {
        body.classList.remove("jlaw-is-entering");
      }, 180);
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

        const nextUrl = new URL(link.href, window.location.href);
        if (nextUrl.href === window.location.href) {
          return;
        }

        event.preventDefault();
        beginLeave(nextUrl.href);
      });
    });
  }

  buildProgressBar();
  buildTransitionOverlay();
  updateScrollProgress();
  initPageTransitions();

  window.addEventListener("scroll", updateScrollProgress, { passive: true });
  window.addEventListener("resize", updateScrollProgress);
})();
