"use strict";

// Package only verified published files plus one explicitly identified portal build.
// This script does not authenticate, modify Firebase, or deploy anything.
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const { parseArgs } = require("node:util");

const { values } = parseArgs({
  options: {
    "portal-dist": { type: "string" },
    "portal-commit": { type: "string" },
    "exchange-service": { type: "string" },
    output: { type: "string" },
    announce: { type: "boolean", default: false },
  },
});

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function sha256(bytes) {
  return crypto.createHash("sha256").update(bytes).digest("hex");
}

function regularFiles(directory, relative = "") {
  return fs.readdirSync(path.join(directory, relative), { withFileTypes: true }).flatMap((entry) => {
    const name = path.posix.join(relative, entry.name);
    assert(!entry.isSymbolicLink(), `Refusing symbolic link: ${name}`);
    if (entry.isDirectory()) return regularFiles(directory, name);
    assert(entry.isFile(), `Refusing non-regular file: ${name}`);
    return [name];
  });
}

function addAccountNavigation(html) {
  const link = '<a href="/account/">My collection</a>';
  const desktop = '<nav class="desktop-nav" aria-label="Primary">';
  const mobile = '<nav aria-label="Mobile">';
  for (const marker of [desktop, mobile]) {
    assert(html.split(marker).length === 2, `Homepage navigation marker must occur once: ${marker}`);
    html = html.replace(marker, marker + link);
  }
  return html;
}

function main() {
  assert(values["portal-dist"] && values["portal-commit"] && values.output,
    "Required: --portal-dist <directory> --portal-commit <full Git SHA> --output <new directory>");
  assert(/^[a-f0-9]{40}$/.test(values["portal-commit"]), "Portal commit must be a full Git SHA.");
  if (values["exchange-service"]) {
    assert(/^[a-z][a-z0-9-]{0,62}$/.test(values["exchange-service"]), "Invalid Cloud Run exchange service name.");
  }

  const source = path.resolve(__dirname, "..");
  const portal = fs.realpathSync(values["portal-dist"]);
  const output = path.resolve(values.output);
  assert(!fs.existsSync(output), "Output already exists; use a new release directory.");
  assert(output !== source && output !== portal && !output.startsWith(portal + path.sep),
    "Output must be separate from source and portal build directories.");

  const baseline = JSON.parse(fs.readFileSync(path.join(source, "release-baselines/production-2026-10-18.json")));
  const portalFiles = regularFiles(portal);
  assert(portalFiles.includes("index.html"), "Portal build lacks index.html.");
  for (const name of portalFiles) {
    assert(!name.split("/").some((part) => part.startsWith(".") || part === "node_modules"),
      `Unexpected private/dependency path in portal build: ${name}`);
    assert(!/\.(?:map|log|pem|key|p12|pfx)$/i.test(name), `Unexpected source map, log or credential file: ${name}`);
  }
  const portalHtml = fs.readFileSync(path.join(portal, "index.html"), "utf8");
  assert(/(?:src|href)=["']\/account\/assets\//.test(portalHtml), "Portal must be built with /account/ as its base.");

  // Validate all source bytes before writing a package. No legal/marketing drift is permitted.
  for (const file of baseline.files) {
    const relative = file.path.replace(/^\//, "");
    assert(!relative.includes("..") && !path.isAbsolute(relative), `Invalid baseline path: ${relative}`);
    const bytes = fs.readFileSync(path.join(source, relative));
    assert(sha256(bytes) === file.sha256, `Published baseline changed: ${relative}`);
  }

  const site = path.join(output, "site");
  fs.mkdirSync(site, { recursive: true });
  for (const file of baseline.files) {
    const relative = file.path.replace(/^\//, "");
    const destination = path.join(site, relative);
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.copyFileSync(path.join(source, relative), destination);
  }
  if (values.announce) {
    const homepage = path.join(site, "index.html");
    fs.writeFileSync(homepage, addAccountNavigation(fs.readFileSync(homepage, "utf8")));
  }
  for (const relative of portalFiles) {
    const destination = path.join(site, "account", relative);
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.copyFileSync(path.join(portal, relative), destination);
  }

  const csp = [
    "default-src 'self'", "base-uri 'self'", "object-src 'none'", "frame-ancestors 'none'",
    "img-src 'self' data: blob:", "font-src 'self' data:", "style-src 'self' 'unsafe-inline'",
    "script-src 'self' https://challenges.cloudflare.com",
    "connect-src 'self' https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://firebaseappcheck.googleapis.com https://firestore.googleapis.com https://us-central1-streamdraft-a5cd3.cloudfunctions.net",
    "frame-src https://challenges.cloudflare.com https://streamdraft-a5cd3.firebaseapp.com",
    "form-action 'self'", "upgrade-insecure-requests",
  ].join("; ");
  const headers = structuredClone(baseline.hostingConfig.headers);
  for (const route of ["/account", "/account/**"]) {
    headers.push({ source: route, headers: [
      { key: "Content-Security-Policy", value: csp },
      { key: "Cache-Control", value: "public, max-age=0, must-revalidate" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
    ] });
  }
  // Only content-hashed bundles get immutable caching; public artwork/catalog files revalidate.
  for (const relative of portalFiles.filter((name) => /^assets\/[^/]+-[A-Za-z0-9_-]{8,}\.(?:js|css)$/.test(name))) {
    headers.push({ source: "/account/" + relative, headers: [
      { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
    ] });
  }
  const rewrites = structuredClone(baseline.hostingConfig.rewrites);
  if (values["exchange-service"]) {
    rewrites.push({ source: "/api/portal-app-check", run: {
      serviceId: values["exchange-service"], region: "us-central1",
    } });
  }
  rewrites.push(
    { source: "/account", destination: "/account/index.html" },
    { source: "/account/**", destination: "/account/index.html" },
  );
  const config = { hosting: {
    site: baseline.projectId,
    public: "site",
    // .well-known association files are deliberately public.
    ignore: ["**/node_modules/**", "**/.DS_Store"],
    headers,
    rewrites,
  } };
  fs.writeFileSync(path.join(output, "firebase.json"), JSON.stringify(config, null, 2) + "\n");
  fs.writeFileSync(path.join(output, ".firebaserc"), JSON.stringify({ projects: { default: baseline.projectId } }, null, 2) + "\n");
  const release = {
    createdAt: new Date().toISOString(), projectId: baseline.projectId,
    baselineVersion: baseline.hostingVersion, portalCommit: values["portal-commit"],
    accountNavigation: values.announce,
    files: regularFiles(site).map((relative) => {
      const bytes = fs.readFileSync(path.join(site, relative));
      return { path: "/" + relative, bytes: bytes.length, sha256: sha256(bytes) };
    }),
  };
  fs.writeFileSync(path.join(output, "release-manifest.json"), JSON.stringify(release, null, 2) + "\n");
  console.log(JSON.stringify({ output, portalCommit: release.portalCommit,
    baselineFiles: baseline.files.length, portalFiles: portalFiles.length,
    files: release.files.length, accountNavigation: release.accountNavigation }));
}

try { main(); } catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
