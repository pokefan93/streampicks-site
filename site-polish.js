"use strict";
const packTiers = [
  ["basic", "Basic", 1],
  ["rare", "Rare", 7],
  ["epic", "Epic", 15],
  ["legendary", "Legendary", 25],
  ["viral", "Viral", 37],
  ["viral-plus", "Mega-Viral", null],
];
document.querySelectorAll("[data-pack-tier]").forEach((button) =>
  button.addEventListener("click", () => {
    const index = packTiers.findIndex((t) => t[0] === button.dataset.packTier);
    if (index < 0) return;
    document
      .querySelectorAll("[data-pack-tier]")
      .forEach((b) => b.setAttribute("aria-pressed", String(b === button)));
    for (const [slot, offset] of [
      ["front", 0],
      ["left", -1],
      ["right", 1],
    ]) {
      const tier =
        packTiers[(index + offset + packTiers.length) % packTiers.length];
      const image = document.getElementById("tier-pack-" + slot);
      applyMarketingImage(
        image,
        "/assets/images/packs-20261020/" + tier[0] + ".webp",
        slot === "front" ? "226px" : "190px",
      );
      image.alt = tier[1] + " pack artwork";
    }
    document.getElementById("tier-pack-name").textContent =
      packTiers[index][1] + " Pack";
    document.getElementById("tier-pack-level").textContent =
      packTiers[index][2] === null
        ? "Special pack · Boosted Mega Viral chance"
        : "Available from player level " + packTiers[index][2];
  }),
);
document
  .querySelectorAll("[data-open-mode]")
  .forEach((link) =>
    link.addEventListener("click", () =>
      document
        .querySelector('[data-mode="' + link.dataset.openMode + '"]')
        .click(),
    ),
  );
document
  .querySelectorAll("[data-open-feature]")
  .forEach((link) =>
    link.addEventListener("click", () =>
      document
        .querySelector('[data-feature="' + link.dataset.openFeature + '"]')
        .click(),
    ),
  );

(() => {
  if (!document.body.classList.contains("landing-page")) return;

  const header = document.querySelector(".marketing-header");
  const sections = [...document.querySelectorAll("main > section")];
  const sectionLinks = [...header.querySelectorAll("nav a")]
    .map((link) => {
      const destination = new URL(link.href);
      const section = document.getElementById(destination.hash.slice(1));
      return destination.origin === location.origin &&
        destination.pathname === location.pathname &&
        sections.includes(section)
        ? { link, section }
        : null;
    })
    .filter(Boolean);

  // Track the section just below the sticky header, including unlinked sections
  // so the navigation never suggests that a previous section is still current.
  if ("IntersectionObserver" in window) {
    let sectionObserver;
    let resizeFrame;
    const markSection = (section) => {
      sectionLinks.forEach(({ link, section: destination }) => {
        if (destination === section) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    };
    const observeSections = () => {
      sectionObserver?.disconnect();
      const intersecting = new Set();
      const top = Math.min(header.offsetHeight + 48, window.innerHeight - 1);
      const bottom = Math.max(0, window.innerHeight - top - 1);
      sectionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) intersecting.add(entry.target);
            else intersecting.delete(entry.target);
          });
          markSection([...sections].reverse().find((section) => intersecting.has(section)));
        },
        { rootMargin: `-${top}px 0px -${bottom}px 0px`, threshold: 0 },
      );
      sections.forEach((section) => sectionObserver.observe(section));
    };
    const scheduleObservation = () => {
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(observeSections);
    };
    observeSections();
    window.addEventListener("resize", scheduleObservation, { passive: true });
    if ("ResizeObserver" in window)
      new ResizeObserver(scheduleObservation).observe(header);
  }

  const dialogs = [...document.querySelectorAll("#art-dialog, #screenshot-dialog")];
  const page = document.documentElement;
  const body = document.body;
  let scrollLock;
  const rememberStyles = (element, properties) =>
    properties.map((property) => [
      property,
      element.style.getPropertyValue(property),
      element.style.getPropertyPriority(property),
    ]);
  const restoreStyles = (element, properties) =>
    properties.forEach(([property, value, priority]) => {
      if (value) element.style.setProperty(property, value, priority);
      else element.style.removeProperty(property);
    });
  const syncDialogScroll = () => {
    if (dialogs.some((dialog) => dialog.open)) {
      if (scrollLock) return;
      const viewportWidth = page.clientWidth;
      const paddingRight = parseFloat(getComputedStyle(body).paddingRight) || 0;
      scrollLock = {
        x: window.scrollX,
        y: window.scrollY,
        body: rememberStyles(body, ["position", "top", "left", "width", "overflow", "padding-right"]),
        page: rememberStyles(page, ["overflow", "scroll-behavior"]),
      };
      page.style.setProperty("scroll-behavior", "auto");
      page.style.setProperty("overflow", "hidden");
      body.style.setProperty("position", "fixed");
      body.style.setProperty("top", `${-scrollLock.y}px`);
      body.style.setProperty("left", `${-scrollLock.x}px`);
      body.style.setProperty("width", "100%");
      body.style.setProperty("overflow", "hidden");
      const scrollbarSpace = Math.max(0, page.clientWidth - viewportWidth);
      if (scrollbarSpace)
        body.style.setProperty("padding-right", `${paddingRight + scrollbarSpace}px`);
    } else if (scrollLock) {
      const previous = scrollLock;
      scrollLock = null;
      restoreStyles(body, previous.body);
      // Restore the viewport before re-enabling the page's smooth scrolling.
      restoreStyles(page, previous.page.filter(([property]) => property !== "scroll-behavior"));
      window.scrollTo(previous.x, previous.y);
      restoreStyles(page, previous.page.filter(([property]) => property === "scroll-behavior"));
    }
  };
  const dialogObserver = new MutationObserver(syncDialogScroll);
  dialogs.forEach((dialog) => {
    dialogObserver.observe(dialog, { attributes: true, attributeFilter: ["open"] });
    dialog.addEventListener("close", syncDialogScroll);
  });
  syncDialogScroll();
})();
