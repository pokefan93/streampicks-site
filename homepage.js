(() => {
"use strict";

document.documentElement.classList.add("enhanced");

const mobileMenu = document.querySelector(".mobile-menu");
mobileMenu.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => { mobileMenu.open = false; }));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && mobileMenu.open) {
    mobileMenu.open = false;
    mobileMenu.querySelector("summary").focus();
  }
});
window.matchMedia("(min-width: 900px)").addEventListener("change", (event) => {
  if (event.matches) mobileMenu.open = false;
});

const modeTabs = Array.from(document.querySelectorAll("[data-mode]"));
function setMode(tab) {
  modeTabs.forEach((candidate) => {
    const selected = candidate === tab;
    candidate.setAttribute("aria-selected", String(selected));
    candidate.tabIndex = selected ? 0 : -1;
    const panel = document.getElementById(candidate.getAttribute("aria-controls"));
    panel.classList.toggle("is-active", selected);
    panel.hidden = !selected;
  });
}
modeTabs.forEach((tab, index) => {
  tab.addEventListener("click", () => setMode(tab));
  tab.addEventListener("keydown", (event) => {
    let next;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (index + 1) % modeTabs.length;
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (index + modeTabs.length - 1) % modeTabs.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = modeTabs.length - 1;
    if (next === undefined) return;
    event.preventDefault();
    setMode(modeTabs[next]);
    modeTabs[next].focus();
  });
});
setMode(modeTabs[0]);

const prints = {
  "mrbeast": {
    "name": "MrBeast",
    "original": "/assets/images/homepage/cards/mrbeast-lv2.webp",
    "full": "/assets/images/homepage/cards/mrbeast-lv3.webp",
    "title": "Beast Mode",
    "level": 3,
    "originalLevel": 2,
    "genre": "Comedy",
    "cosmeticOnly": false
  },
  "markiplier": {
    "name": "Markiplier",
    "original": "/assets/images/homepage/cards/markiplier-lv2.webp",
    "full": "/assets/images/homepage/cards/markiplier-lv3.webp",
    "title": "Crimson Phantom",
    "level": 3,
    "originalLevel": 2,
    "genre": "Gaming",
    "cosmeticOnly": false
  },
  "mkbhd": {
    "name": "MKBHD",
    "original": "/assets/images/homepage/cards/mkbhd-lv2.webp",
    "full": "/assets/images/homepage/cards/mkbhd-lv3.webp",
    "title": "Frost Circuit",
    "level": 3,
    "originalLevel": 2,
    "genre": "Tech",
    "cosmeticOnly": false
  },
  "jaidenanimations": {
    "name": "JaidenAnimations",
    "original": "/assets/images/homepage/cards/jaidenanimations-lv2.webp",
    "full": "/assets/images/homepage/cards/jaidenanimations-lv3.webp",
    "title": "Amethyst Inkmancer",
    "level": 3,
    "originalLevel": 2,
    "genre": "Animation",
    "cosmeticOnly": false
  },
  "nickdigiovanni": {
    "name": "NickDiGiovanni",
    "original": "/assets/images/homepage/cards/nickdigiovanni-lv2.webp",
    "full": "/assets/images/homepage/cards/nickdigiovanni-lv3.webp",
    "title": "Saffron Sovereign",
    "level": 3,
    "originalLevel": 2,
    "genre": "Food",
    "cosmeticOnly": false
  },
  "jcole": {
    "name": "J. Cole",
    "original": "/assets/images/homepage/cards/jcole-lv2.webp",
    "full": "/assets/images/homepage/cards/jcole-lv3.webp",
    "title": "Copper Reverie",
    "level": 3,
    "originalLevel": 2,
    "genre": "Music",
    "cosmeticOnly": false
  },
  "king": {
    "name": "Stream King",
    "original": "/assets/images/homepage/cards/streamking-lv3.webp",
    "full": "/assets/images/homepage/cards/streamking-lv3.webp",
    "title": "Royal Edition",
    "level": 3,
    "originalLevel": 3,
    "genre": "Gaming",
    "cosmeticOnly": true
  },
  "queen": {
    "name": "Stream Queen",
    "original": "/assets/images/homepage/cards/streamqueen-lv3.webp",
    "full": "/assets/images/homepage/cards/streamqueen-lv3.webp",
    "title": "Royal Edition",
    "level": 3,
    "originalLevel": 3,
    "genre": "Beauty",
    "cosmeticOnly": true
  }
};
let selectedPrint = "full-art";
const printButtons = Array.from(document.querySelectorAll("[data-print]"));
function applyPrint(style) {
  selectedPrint = style;
  printButtons.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.print === style)));
  document.querySelector(".gallery-cards").classList.toggle("is-standard", style === "standard");
  Object.entries(prints).forEach(([key, print]) => {
    if (print.cosmeticOnly) return;
    const fullArt = style === "full-art";
    const level = fullArt ? print.level : print.originalLevel;
    const button = document.querySelector(`.art-card-button[data-card="${key}"]`);
    const content = document.getElementById(`card-template-${key}${fullArt ? "" : "-standard"}`).content.cloneNode(true);
    content.querySelector("img").id = `gallery-${key}`;
    button.querySelector(".gallery-image").replaceChildren(content);
    document.getElementById(`${key}-card-meta`).textContent = `Lv.${level} · ${print.genre}`;
    document.getElementById(`${key}-print-name`).textContent = `${fullArt ? print.title : "Level 2"} ↗`;
    button.setAttribute("aria-label", `View ${print.name}’s level ${level} card and abilities`);
  });
}
printButtons.forEach((button) => button.addEventListener("click", () => applyPrint(button.dataset.print)));

const artDialog = document.getElementById("art-dialog");
document.querySelectorAll("[data-card]").forEach((button) => button.addEventListener("click", () => {
  const print = prints[button.dataset.card];
  const fullArt = print.cosmeticOnly || (button.dataset.cardStyle || selectedPrint) === "full-art";
  const level = fullArt ? print.level : print.originalLevel;
  const content = document.getElementById(`card-template-${button.dataset.card}${fullArt ? "" : "-standard"}`).content.cloneNode(true);
  document.getElementById("dialog-card").replaceChildren(content);
  const card = document.querySelector("#dialog-card .game-card");
  const image = card.querySelector("img");
  image.id = "dialog-art";
  document.getElementById("art-dialog-title").textContent = print.name;
  document.getElementById("art-dialog-print").textContent = print.cosmeticOnly ? "Royal Edition · Secret Full Art collectible" : `${fullArt ? print.title : "Level 2"} · Lv.${level} · ${print.genre}`;
  document.querySelector(".dialog-note").textContent = print.cosmeticOnly
    ? "Card Club collectible. This card cannot be used in an Arena deck."
    : "Vibe icons show attack cost. Read each effect for how + and × damage works.";
  artDialog.showModal();
}));
document.getElementById("close-art-dialog").addEventListener("click", () => artDialog.close());
artDialog.addEventListener("click", (event) => {
  if (event.target !== artDialog) return;
  const rect = artDialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) artDialog.close();
});

const arenaShots = {
  rooftop: { key: "arena-rooftop", title: "Rooftop · Attack in action", alt: "A real Arena battle on the rooftop board, with an attack striking Ninja for 20 damage." },
  stadium: { key: "arena-stadium", title: "Stadium arena", alt: "A real Arena battle in the stadium, with creator cards, support cards, and the next turn starting." },
  crown: { key: "arena-crown", title: "Crown arena", alt: "A real Arena battle on the golden Crown board, with active creators, benched cards, and a hand of support cards." },
};
const arenaPairs = { rooftop: ["rooftop", "crown"], stadium: ["stadium", "rooftop"], crown: ["crown", "stadium"] };
document.querySelectorAll("[data-arena]").forEach((button) => button.addEventListener("click", () => {
  document.querySelectorAll("[data-arena]").forEach(candidate => candidate.setAttribute("aria-pressed", String(candidate === button)));
  document.querySelectorAll("#arena-screens .app-screen").forEach((screen, index) => {
    const shot = arenaShots[arenaPairs[button.dataset.arena][index]];
    screen.dataset.screenshot = shot.key;
    screen.dataset.screenshotTitle = shot.title;
    screen.setAttribute("aria-label", `Enlarge ${shot.title.toLowerCase()} screenshot`);
    screen.querySelector("img").src = `/assets/images/homepage/screenshots/${shot.key}.webp`;
    screen.querySelector("img").alt = shot.alt;
    screen.querySelector(".screen-label").textContent = shot.title;
  });
}));
const screenshotDialog = document.getElementById("screenshot-dialog");
document.querySelectorAll("[data-screenshot]").forEach((button) => button.addEventListener("click", () => {
  const image = document.getElementById("screenshot-dialog-image");
  image.src = button.querySelector("img").src;
  image.alt = button.querySelector("img").alt;
  document.getElementById("screenshot-dialog-title").textContent = button.dataset.screenshotTitle;
  document.getElementById("screenshot-dialog-caption").textContent = button.dataset.screenshot.startsWith("league-") ? "App screen with example League scores and stats" : "In-game Arena screenshot";
  screenshotDialog.showModal();
}));
document.getElementById("close-screenshot-dialog").addEventListener("click", () => screenshotDialog.close());
screenshotDialog.addEventListener("click", (event) => {
  if (event.target !== screenshotDialog) return;
  const rect = screenshotDialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) screenshotDialog.close();
});

const genres = {
  gaming: ["Gaming", "Big plays. New levels. Creators who know their way around a controller."],
  music: ["Music", "The tracks on repeat. The voices you love. Put a little music in your collection."],
  tech: ["Tech", "The latest gear. The next big idea. Creators who keep you curious."],
  comedy: ["Comedy", "Good timing. Great punchlines. Your next favorite laugh, on a card."],
  sports: ["Sports", "Big moments. Bigger energy. Bring your favorites into the game."],
  beauty: ["Beauty", "Fresh looks. Signature style. A collection with a little extra color."],
  education: ["Education", "New discoveries. Good questions. Creators who make you think."],
  food: ["Food", "Your next craving. Your next recipe. A lineup with plenty of flavor."],
  lifestyle: ["Lifestyle", "Everyday adventures. New perspectives. Find a little inspiration."],
  business: ["Business", "Big ideas. Smart moves. Creators with a different kind of game plan."],
  animation: ["Animation", "Original stories. Bold characters. A whole world of imagination."],
  commentary: ["Commentary", "Hot topics. Fresh takes. Creators who get the conversation going."],
};
document.querySelectorAll("[data-genre]").forEach((button) => button.addEventListener("click", () => {
  const genre = button.dataset.genre;
  const [name, copy] = genres[genre];
  document.querySelectorAll("[data-genre]").forEach((candidate) => candidate.setAttribute("aria-pressed", String(candidate === button)));
  const image = document.getElementById("genre-pack");
  image.src = `/assets/images/homepage/${genre}-pack.webp`;
  image.alt = `${name} genre pack`;
  document.getElementById("genre-name").textContent = name;
  document.getElementById("genre-copy").textContent = copy;
}));

// The existing script.js owns newsletter validation and the Turnstile/API contract.

})();
