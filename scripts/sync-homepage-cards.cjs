/* Publish the app-rendered card faces with catalog-backed accessible text. */
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const root = path.resolve(__dirname, "..");
const appRoot = path.resolve(
  process.argv[2] || path.join(root, "../../streamdraft"),
);
const hash = (value) => crypto.createHash("sha256").update(value).digest("hex");
const ts = require(require.resolve("typescript", { paths: [appRoot] }));
const previousLoader = require.extensions[".ts"];
require.extensions[".ts"] = (module, file) =>
  module._compile(
    ts.transpileModule(fs.readFileSync(file, "utf8"), {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
        esModuleInterop: true,
      },
    }).outputText,
    file,
  );
const catalog = require(
  path.join(appRoot, "functions/src/arenaV1/cardCatalog.ts"),
);
const types = require(
  path.join(appRoot, "functions/src/arenaV1/clientTypes.ts"),
);
const notation = require(
  path.join(appRoot, "src/lib/arena/attackDamageNotation.ts"),
);
require.extensions[".ts"] = previousLoader;

const metadata = JSON.parse(
  fs.readFileSync(path.join(root, "assets/data/featured-cards.json"), "utf8"),
)
  .cards.filter(
    (card) => card.level === 3 && !["king", "queen"].includes(card.key),
  )
  .map((card) => ({ key: card.key, cardId: card.cardId, title: card.title }));
metadata.push(
  { key: "king", cardId: "streamking_lv3", title: "Royal Edition" },
  { key: "queen", cardId: "streamqueen_lv3", title: "Royal Edition" },
);
const rendered = JSON.parse(
  fs.readFileSync(path.join(root, "assets/data/card-renders.json"), "utf8"),
);
// A catalog refresh must never silently put new rules beside an older image.
for (const source of rendered.sourceFiles) {
  if (hash(fs.readFileSync(path.join(appRoot, source.file))) !== source.sha256)
    throw new Error(
      "App card renderer changed; recapture cards before syncing: " +
        source.file,
    );
}
const cards = metadata.flatMap((meta) =>
  (["king", "queen"].includes(meta.key) ? [3] : [3, 2]).map((level) => {
    const cardId = meta.cardId.replace("_lv3", "_lv" + level);
    const def = catalog.getCreatorCardDef(cardId);
    const capture = rendered.cards.find((card) => card.cardId === cardId);
    if (
      !def ||
      !capture ||
      hash(JSON.stringify(def)) !== capture.definitionSha256
    )
      throw new Error("Missing or stale app-rendered card: " + cardId);
    if (hash(fs.readFileSync(path.join(root, capture.file))) !== capture.sha256)
      throw new Error("Card export changed: " + capture.file);
    const cosmeticOnly = Boolean(def.cosmeticOnly);
    return {
      key: meta.key,
      cardId,
      name: def.displayName,
      level,
      genre: def.genre,
      genreLabel: types.GENRE_LABELS[def.genre],
      rarity: def.rarity,
      title: cosmeticOnly
        ? "Royal Edition"
        : level === 3
          ? meta.title
          : "Level 2",
      image: "/" + capture.file + "?v=" + capture.sha256.slice(0, 12),
      cosmeticOnly,
      hp: cosmeticOnly ? null : def.hp,
      retreatCost: cosmeticOnly ? null : def.retreatCost,
      weakness: cosmeticOnly
        ? null
        : {
            label: types.GENRE_LABELS[types.WEAKNESS_CHART[def.genre]],
            bonus: 20,
          },
      attacks: cosmeticOnly
        ? []
        : def.attacks.map((attack) => ({
            id: attack.id,
            name: attack.name,
            vibeCost: attack.vibeCost,
            damage: attack.damage,
            damageLabel: notation.formatAttackDamage(attack),
            damageAccessible: notation.attackDamageAccessibilityText(attack),
            description: attack.description || "",
          })),
      passive:
        cosmeticOnly || !def.passive
          ? null
          : {
              id: def.passive.id,
              name: def.passive.name,
              description: def.passive.description,
            },
    };
  }),
);
const cardFor = (key, standard = false) =>
  cards.find(
    (card) =>
      card.key === key &&
      card.level === (standard && !["king", "queen"].includes(key) ? 2 : 3),
  );
function versionCardImages(html) {
  return html.replace(
    /src="(\/assets\/images\/homepage\/cards\/[^"?]+)(?:\?[^\"]*)?"/g,
    (match, imagePath) => {
      const capture = rendered.cards.find(
        (card) => "/" + card.file === imagePath,
      );
      if (!capture) throw new Error("Untracked card image: " + imagePath);
      return `src="${imagePath}?v=${capture.sha256.slice(0, 12)}"`;
    },
  );
}
fs.writeFileSync(
  path.join(root, "assets/data/featured-cards.json"),
  JSON.stringify(
    { renderer: rendered.renderer, sources: rendered.sourceFiles, cards },
    null,
    2,
  ) + "\n",
);
const e = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        char
      ],
  );
function description(card) {
  if (card.cosmeticOnly)
    return `${card.name}. Royal Edition. Secret Full Art. Cosmetic collectible; cannot be used in Arena.`;
  return (
    `${card.name}. Level ${card.level}. ${card.genreLabel}. ${card.hp} HP. ` +
    card.attacks
      .map(
        (a) =>
          `${a.name}: ${a.vibeCost} Vibe, ${a.damageAccessible} damage. ${a.description}`,
      )
      .join(" ") +
    (card.passive
      ? ` Passive ${card.passive.name}: ${card.passive.description}`
      : "") +
    ` Weakness: ${card.weakness.label}, +${card.weakness.bonus} damage. Retreat: ${card.retreatCost} Vibe.`
  );
}
function cardMarkup(card, imageId = "", eager = false) {
  return `<span class="game-card" data-card-id="${e(card.cardId)}"><img${imageId ? ` id="${e(imageId)}"` : ""} src="${card.image}" alt="${e(card.name)} — level ${card.level} ${card.cosmeticOnly ? "Royal Edition collectible" : card.level === 3 ? "Full Art game card" : "game card"}" width="640" height="928" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} /><span class="card-description">${e(description(card))}</span></span>`;
}
const prints = Object.fromEntries(
  metadata.map((meta) => {
    const full = cardFor(meta.key),
      standard = cardFor(meta.key, true);
    return [
      meta.key,
      {
        name: full.name,
        original: standard.image,
        full: full.image,
        title: full.title,
        level: full.level,
        originalLevel: standard.level,
        genre: full.genreLabel,
        cosmeticOnly: full.cosmeticOnly,
      },
    ];
  }),
);
for (const preview of [false, true]) {
  const htmlPath = path.join(
    root,
    preview ? "preview/wondervale-direction/index.html" : "index.html",
  );
  const jsPath = path.join(
    root,
    preview ? "preview/wondervale-direction/design.js" : "homepage.js",
  );
  if (preview && (!fs.existsSync(htmlPath) || !fs.existsSync(jsPath))) continue;
  let html = fs.readFileSync(htmlPath, "utf8");
  for (const [key, slot] of [
    ["mkbhd", "left"],
    ["markiplier", "right"],
    ["mrbeast", "feature"],
  ]) {
    const card = cardFor(key);
    const pattern = new RegExp(
      '<figure class="print-card hero-' + slot + '">[\\s\\S]*?</figure>',
    );
    if (!pattern.test(html)) throw new Error("Missing hero card " + key);
    html = html.replace(
      pattern,
      `<figure class="print-card hero-${slot}"><button class="hero-card-button" type="button" data-card="${key}" data-card-style="full-art" aria-label="View ${e(card.name)}’s level 3 card and abilities">${cardMarkup(card, "", key === "mrbeast")}</button></figure>`,
    );
  }
  for (const meta of metadata.slice(0, 6)) {
    const card = cardFor(meta.key);
    const pattern = new RegExp(
      '<button\\s+class="art-card-button"[^>]*data-card="' +
        meta.key +
        '"[\\s\\S]*?</button>',
    );
    if (!pattern.test(html))
      throw new Error("Missing gallery card " + meta.key);
    html = html.replace(
      pattern,
      `<button class="art-card-button" type="button" data-card="${meta.key}" aria-label="View ${e(card.name)}’s level 3 card and abilities"><span class="gallery-image">${cardMarkup(card, "gallery-" + meta.key)}</span><span class="gallery-card-info"><strong>${e(card.name)}</strong><small id="${meta.key}-card-meta">Lv.3 · ${e(card.genreLabel)}</small><span id="${meta.key}-print-name">${e(card.title)} <span aria-hidden="true">↗</span></span></span></button>`,
    );
  }
  html = html
    .replace(
      'aria-label="Choose artwork style"',
      'aria-label="Choose card level"',
    )
    .replace(
      'data-print="standard">Original art',
      'data-print="standard">Level 2',
    )
    .replace(
      'data-print="full-art">Full Art',
      'data-print="full-art">Level 3 Full Art',
    );
  html = html.replace(
    /<p class="gallery-note">[\s\S]*?<\/p>/,
    '<p class="gallery-note">Real Level 2 and Level 3 Full Art cards from the game. Select a card to read its attacks and passive.</p>',
  );
  for (const key of ["king", "queen"])
    html = html.replace(
      new RegExp('(<small id="' + key + '-print-name">)[\\s\\S]*?</small>'),
      "$1Royal Edition ↗</small>",
    );
  for (const key of ["king", "queen"]) {
    const card = cardFor(key);
    html = html.replace(
      new RegExp('<img[^>]*id="gallery-' + key + '"[^>]*>'),
      `<img id="gallery-${key}" src="${card.image}" alt="${e(card.name)}" width="640" height="928" loading="lazy" />`,
    );
  }
  const templates =
    "<!-- Featured card templates -->\n" +
    cards
      .map(
        (card) =>
          `<template id="card-template-${card.key}${card.level === 2 ? "-standard" : ""}">${cardMarkup(card)}</template>`,
      )
      .join("\n") +
    "\n<!-- End featured card templates -->\n";
  html = html.replace(
    /<!-- Featured card templates -->[\s\S]*?<!-- End featured card templates -->\s*/g,
    "",
  );
  html = html.replace(
    /<dialog\s+class="art-dialog"/,
    templates + '<dialog class="art-dialog"',
  );
  fs.writeFileSync(htmlPath, versionCardImages(html));
  const js = fs
    .readFileSync(jsPath, "utf8")
    .replace(
      /const prints = \{[\s\S]*?\n\s*\};/,
      "const prints = " + JSON.stringify(prints, null, 2) + ";",
    );
  fs.writeFileSync(jsPath, js);
}
const pressPath = path.join(root, "press/index.html");
fs.writeFileSync(
  pressPath,
  versionCardImages(fs.readFileSync(pressPath, "utf8")),
);
console.log(
  "Synced 12 playable app-rendered cards and 2 Royal Edition collectibles.",
);
