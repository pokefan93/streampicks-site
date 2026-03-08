"use strict";

const root = document.documentElement;
const body = document.body;
const header = document.querySelector("[data-site-header]");
const nav = document.querySelector("[data-site-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");

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

function initFontLoadingState() {
  if (!root.classList.contains("wf-loading")) {
    return;
  }

  window.setTimeout(() => {
    root.classList.remove("wf-loading");
  }, 3000);
}

initMenu();
initHeaderState();
initFontLoadingState();
