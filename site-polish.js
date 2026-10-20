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
