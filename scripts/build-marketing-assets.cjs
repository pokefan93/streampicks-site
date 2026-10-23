/* Generate web previews without changing the app exports or press downloads. */
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const sharp = require("sharp");
const esbuild = require("esbuild");
const root = path.resolve(__dirname, "..");
const output = path.join(root, "assets/images/web");
const sha = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const sources = [];
const add = (file, widths, prefix) => sources.push({ file, widths, prefix });
const cards = JSON.parse(
  fs.readFileSync(path.join(root, "assets/data/card-renders.json")),
).cards;
for (const card of cards) {
  if (sha(fs.readFileSync(path.join(root, card.file))) !== card.sha256)
    throw new Error(
      "Card source differs from its verified export: " + card.file,
    );
  add(card.file, [320, 480, 640], "card");
}
for (const tier of [
  "basic",
  "rare",
  "epic",
  "legendary",
  "viral",
  "viral-plus",
])
  add(`assets/images/packs-20261020/${tier}.webp`, [240, 456], "tier");
for (const genre of [
  "gaming",
  "music",
  "tech",
  "comedy",
  "sports",
  "beauty",
  "education",
  "food",
  "lifestyle",
  "business",
  "animation",
  "commentary",
]) {
  add(`assets/images/homepage/${genre}-pack.webp`, [360], "genre");
  add(`assets/images/homepage/${genre}-crest.webp`, [144], "genre");
}
for (const arena of ["rooftop", "stadium", "crown"])
  add(
    `assets/images/homepage/screenshots/arena-${arena}.webp`,
    [320, 520, 780],
    "screen",
  );
for (const name of ["league-matchup", "league-draft-creator"])
  add(`assets/images/homepage/screenshots/${name}.webp`, [360, 660], "screen");
add("assets/images/features/career-map.webp", [640, 1040], "feature");
add("assets/images/features/workshop.webp", [360, 660], "feature");
add("assets/images/homepage/crew.webp", [480, 840], "art");

function attribute(tag, name, value) {
  const current = tag.match(new RegExp("\\s" + name + '=\"([^\"]*)\"'))?.[1];
  if (current?.trim().replace(/\s+/g, " ") === value.trim().replace(/\s+/g, " "))
    return tag;
  tag = tag.replace(new RegExp("\\s+" + name + '="[^"]*"', "g"), "");
  return tag.replace(/\s*\/?>$/, ` ${name}="${value}" />`);
}
const get = (tag, name) =>
  tag.match(new RegExp("\\s" + name + '="([^"]*)"'))?.[1];

(async () => {
  fs.mkdirSync(output, { recursive: true });
  const previousFile = path.join(root, "assets/data/marketing-assets.json");
  const previous = fs.existsSync(previousFile)
    ? JSON.parse(fs.readFileSync(previousFile))
    : null;
  const assets = {};
  for (const source of sources) {
    const bytes = fs.readFileSync(path.join(root, source.file));
    const originalSha = sha(bytes);
    const cached = previous?.assets["/" + source.file];
    if (
      cached?.sourceSha256 === originalSha &&
      cached.variants.length === source.widths.length &&
      source.widths.every((width) =>
        cached.variants.some((v) => v.width === width),
      ) &&
      cached.variants.every((v) => {
        const file = path.join(root, v.file);
        return fs.existsSync(file) && sha(fs.readFileSync(file)) === v.sha256;
      })
    ) {
      assets["/" + source.file] = cached;
      continue;
    }
    const meta = await sharp(bytes).metadata();
    const variants = [];
    for (const width of source.widths.filter((w) => w <= meta.width)) {
      const file = `assets/images/web/${source.prefix}-${path.basename(source.file, ".webp")}-${width}.webp`;
      const rendered = await sharp(bytes)
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: 92, alphaQuality: 100, effort: 5 })
        .toBuffer();
      fs.writeFileSync(path.join(root, file), rendered);
      variants.push({
        width,
        file: "/" + file,
        bytes: rendered.length,
        sha256: sha(rendered),
      });
    }
    assets["/" + source.file] = {
      sourceSha256: originalSha,
      sourceBytes: bytes.length,
      variants,
    };
  }
  const originalFor = (url) =>
    Object.keys(assets).find(
      (key) =>
        key === url.split("?")[0] ||
        assets[key].variants.some((v) => v.file === url.split("?")[0]),
    ) ||
    Object.keys(previous?.assets || {}).find((key) =>
      previous.assets[key].variants.some((v) => v.file === url.split("?")[0]),
    );
  function transformTag(tag, sizes, template = false) {
    const src = get(tag, "src");
    if (!src) return tag;
    const original = originalFor(src);
    if (!original || !assets[original]) return tag;
    const item = assets[original];
    const version = (v) => v.file + "?v=" + v.sha256.slice(0, 10);
    const fallback =
      item.variants.find((v) => v.width === 480) || item.variants.at(-1);
    const srcset = item.variants
      .map((v) => version(v) + " " + v.width + "w")
      .join(", ");
    if (template) {
      tag = attribute(
        tag,
        "src",
        original + "?v=" + item.sourceSha256.slice(0, 12),
      );
      tag = tag.replace(/\s+(srcset|sizes|data-full-src)="[^"]*"/g, "");
      tag = attribute(tag, "data-preview-src", version(fallback));
      tag = attribute(tag, "data-preview-srcset", srcset);
      tag = attribute(
        tag,
        "data-preview-sizes",
        "(max-width:700px) 42vw, 175px",
      );
    } else {
      tag = attribute(tag, "src", version(fallback));
      tag = attribute(tag, "srcset", srcset);
      tag = attribute(tag, "sizes", sizes);
      tag = attribute(
        tag,
        "data-full-src",
        original + "?v=" + item.sourceSha256.slice(0, 12),
      );
      tag = attribute(tag, "decoding", "async");
    }
    return tag;
  }
  for (const page of [
    "index.html",
    "press/index.html",
    "support/index.html",
    "404.html",
  ]) {
    const file = path.join(root, page);
    let html = fs.readFileSync(file, "utf8");
    html = html.replace(
      /<template\b[^>]*>[\s\S]*?<\/template\s*>|<img\b[^>]*>/g,
      (tag, offset) => {
        if (tag.startsWith("<template"))
          return tag.replace(/<img\b[^>]*>/g, (img) =>
            transformTag(img, "", true),
          );
        const source = get(tag, "src");
        if (!source) return tag;
        const original = originalFor(source);
        if (!original) return tag;
        const section = html.slice(
          html.lastIndexOf("<section", offset),
          offset,
        );
        let sizes = "(max-width:700px) 42vw, 175px";
        if (section.slice(0, 150).includes('class="hero"')) {
          sizes = original.includes("mrbeast")
            ? "(max-width:370px) 180px, (max-width:899px) 210px, (max-width:1100px) 240px, 280px"
            : "(max-width:899px) 150px, 210px";
          if (original.includes("/packs-")) sizes = "100px";
        } else if (section.slice(0, 180).includes("player-gateway"))
          sizes = "(max-width:700px) 28vw, 165px";
        else if (section.slice(0, 180).includes("game-updates"))
          sizes = "(max-width:600px) 120px, (max-width:900px) 210px, 230px";
        else if (original.includes("screenshots/"))
          sizes = "(max-width:700px) 42vw, 250px";
        else if (original.includes("/packs-"))
          sizes = "(max-width:700px) 190px, 226px";
        else if (original.includes("-crest")) sizes = "64px";
        else if (original.includes("-pack")) sizes = "125px";
        else if (original.includes("career-map"))
          sizes = "(max-width:700px) 95vw, 630px";
        else if (original.includes("workshop")) sizes = "280px";
        else if (original.includes("crew"))
          sizes = "(max-width:700px) 300px, 430px";
        else if (page.startsWith("press/"))
          sizes = "(max-width:700px) 200px, 280px";
        return transformTag(tag, sizes);
      },
    );
    fs.writeFileSync(file, html);
  }
  fs.writeFileSync(
    previousFile,
    JSON.stringify(
      {
        description:
          "Responsive website previews. Full-quality sources remain available in enlarged views and media downloads.",
        assets,
      },
      null,
      2,
    ) + "\n",
  );
  const cssSources = [
    "homepage",
    "game-cards",
    "brand-font",
    "feature-explorer",
    "site-shell",
    "site-polish",
    "art-direction",
    "game-updates",
    "refinement",
  ];
  const css = cssSources
    .map((name) =>
      fs.readFileSync(path.join(root, "styles", name + ".css"), "utf8"),
    )
    .join("\n");
  const minified = await esbuild.transform(css, {
    loader: "css",
    minify: true,
    target: ["chrome109", "safari16"],
  });
  fs.writeFileSync(path.join(root, "styles/landing.min.css"), minified.code);
  const accent = await esbuild.transform(
    fs.readFileSync(path.join(root, "styles/art-direction.css"), "utf8"),
    { loader: "css", minify: true, target: ["chrome109", "safari16"] },
  );
  fs.writeFileSync(
    path.join(root, "styles/art-direction.min.css"),
    accent.code,
  );
  const media = Object.fromEntries(
    Object.entries(assets).map(([original, item]) => [
      original,
      {
        src: (() => {
          const v =
            item.variants.find((v) => v.width === 480) || item.variants.at(-1);
          return v.file + "?v=" + v.sha256.slice(0, 10);
        })(),
        srcset: item.variants
          .map(
            (v) => v.file + "?v=" + v.sha256.slice(0, 10) + " " + v.width + "w",
          )
          .join(", "),
        full: original + "?v=" + item.sourceSha256.slice(0, 12),
      },
    ]),
  );
  const helper = `const marketingMedia=${JSON.stringify(media)};\nfunction applyMarketingImage(image,original,sizes){const media=marketingMedia[original];image.src=media?media.src:original;if(media){image.srcset=media.srcset;image.sizes=sizes;image.dataset.fullSrc=media.full;}else{image.removeAttribute('srcset');image.removeAttribute('sizes');image.dataset.fullSrc=original;}}\n`;
  const javascript =
    helper +
    [
      "site-shell.js",
      "feature-explorer.js",
      "site-polish.js",
      "homepage.js",
      "game-updates.js",
    ]
      .map((file) => fs.readFileSync(path.join(root, file), "utf8"))
      .join("\n;\n");
  const bundled = await esbuild.transform(javascript, {
    loader: "js",
    minify: true,
    target: ["es2020"],
  });
  fs.writeFileSync(path.join(root, "landing.min.js"), bundled.code);
  console.log(
    `Built ${Object.keys(assets).length} responsive source groups and one ${Buffer.byteLength(minified.code)}-byte landing stylesheet.`,
  );
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
