"use strict";

const RECEIPT_FIXTURES = window.STREAMPICKS_RECEIPT_FIXTURES || {};

const RECEIPT_CONFIG = {
  featuredReceiptId: window.STREAMPICKS_RECEIPT_FEATURED_ID || "called-it-heatseeker",
  homepageUrl: "/",
  installUrl: "/#waitlist",
  makePicksUrl: "/#how-it-works",
  plusUrl: "/#premium",
  deepLinkBaseUrl: "",
  // TODO: Flip this to true only after the native apps are configured for
  // universal links / app links and the placeholder well-known files are
  // replaced with real native identifiers.
  universalLinksReady: false
};

const dom = {
  canonical: document.getElementById("receipt-canonical"),
  headerCta: document.getElementById("receipt-header-cta"),
  kicker: document.getElementById("receipt-kicker"),
  title: document.getElementById("receipt-title"),
  subtitle: document.getElementById("receipt-subtitle"),
  note: document.getElementById("receipt-note"),
  chipList: document.getElementById("receipt-chip-list"),
  badge: document.getElementById("receipt-badge"),
  state: document.getElementById("receipt-state"),
  impactValue: document.getElementById("receipt-impact-value"),
  impactLabel: document.getElementById("receipt-impact-label"),
  actorName: document.getElementById("receipt-actor-name"),
  actorMeta: document.getElementById("receipt-actor-meta"),
  facts: document.getElementById("receipt-facts"),
  storyTitle: document.getElementById("receipt-story-title"),
  storyBody: document.getElementById("receipt-story-body"),
  stakesTitle: document.getElementById("receipt-stakes-title"),
  stakesBody: document.getElementById("receipt-stakes-body"),
  plusKicker: document.getElementById("receipt-plus-kicker"),
  plusTitle: document.getElementById("receipt-plus-title"),
  plusCopy: document.getElementById("receipt-plus-copy"),
  plusCta: document.getElementById("receipt-plus-cta"),
  primaryCta: document.getElementById("primary-cta"),
  secondaryCta: document.getElementById("secondary-cta"),
  mobileTitle: document.getElementById("receipt-mobile-title"),
  mobileCopy: document.getElementById("receipt-mobile-copy"),
  mobileCta: document.getElementById("receipt-mobile-cta")
};

function resolveReceiptId() {
  const params = new URLSearchParams(window.location.search);
  const queryId = params.get("receipt") || params.get("id");
  if (queryId) {
    return queryId.trim();
  }

  const segments = window.location.pathname.split("/").filter(Boolean);
  if (segments[0] === "r" && segments[1] && segments[1] !== "index.html") {
    return decodeURIComponent(segments[1]);
  }

  return RECEIPT_CONFIG.featuredReceiptId;
}

function buildFallbackReceipt(receiptId) {
  return {
    id: receiptId,
    variant: "receipt",
    tone: "heat",
    state: "Web fallback",
    kicker: "Shared Receipt",
    badge: "Receipt",
    title: "This Receipt is not available on web yet.",
    subtitle:
      "The shared URL still works as a StreamPicks landing page, but this specific receipt needs the app or a real receipt payload to render.",
    chips: ["Shared proof", "App fallback", "Get StreamPicks"],
    impactValue: "App",
    impactLabel: "view this receipt",
    actorName: "StreamPicks Viewer",
    actorMeta: "Open the app or get StreamPicks to keep the rivalry going.",
    facts: [
      { label: "Receipt ID", value: receiptId },
      { label: "Current state", value: "No receipt payload found" },
      { label: "Next move", value: "Get the app and make your own picks" }
    ],
    storyTitle: "The canonical receipt URL is still doing its job.",
    storyBody:
      "This link gives the shared object a public home on the web so it can still drive curiosity, installs, and conversion when the app is not already open.",
    stakesTitle: "The website is part of the receipts system.",
    stakesBody:
      "Receipts need a clean web fallback so shared URLs still explain what happened, show why it matters, and push viewers into the app.",
    plusKicker: "Play harder with StreamPicks+",
    plusTitle: "Serious players want sharper reads, deeper control, and premium flex.",
    plusCopy:
      "StreamPicks+ is where stronger signal and more premium receipts should eventually land.",
    plusCtaLabel: "Get Plus Updates",
    metaTitle: "Shared StreamPicks Receipt | Web fallback",
    metaDescription:
      "This shared StreamPicks receipt fell back to the website. Get StreamPicks to make your own calls and receipts.",
    socialAlt: "StreamPicks shared receipt fallback page."
  };
}

function resolveReceipt(receiptId) {
  return RECEIPT_FIXTURES[receiptId] || buildFallbackReceipt(receiptId);
}

function buildCanonicalUrl(receiptId) {
  const url = new URL(window.location.href);
  url.pathname = `/r/${encodeURIComponent(receiptId)}`;
  url.search = "";
  url.hash = "";
  return url.toString();
}

function updateMetaTag(selector, attribute, value) {
  let tag = document.querySelector(selector);
  if (!tag) {
    tag = document.createElement("meta");
    const match = selector.match(/\[(name|property)="([^"]+)"\]/);
    if (match) {
      tag.setAttribute(match[1], match[2]);
    }
    document.head.appendChild(tag);
  }
  tag.setAttribute(attribute, value);
}

function updateMetadata(receipt, canonicalUrl) {
  document.title = receipt.metaTitle;
  if (dom.canonical) {
    dom.canonical.setAttribute("href", canonicalUrl);
  }

  updateMetaTag('meta[name="description"]', "content", receipt.metaDescription);
  updateMetaTag('meta[property="og:title"]', "content", receipt.metaTitle);
  updateMetaTag('meta[property="og:description"]', "content", receipt.metaDescription);
  updateMetaTag('meta[property="og:url"]', "content", canonicalUrl);
  updateMetaTag('meta[property="og:image:alt"]', "content", receipt.socialAlt);
  updateMetaTag('meta[name="twitter:title"]', "content", receipt.metaTitle);
  updateMetaTag('meta[name="twitter:description"]', "content", receipt.metaDescription);
}

function setText(node, value) {
  if (node) {
    node.textContent = value;
  }
}

function setLink(node, label, href) {
  if (!node) {
    return;
  }
  node.textContent = label;
  node.setAttribute("href", href);
}

function renderChipList(items) {
  if (!dom.chipList) {
    return;
  }
  dom.chipList.innerHTML = "";
  items.forEach((item) => {
    const chip = document.createElement("li");
    chip.textContent = item;
    dom.chipList.appendChild(chip);
  });
}

function renderFacts(facts) {
  if (!dom.facts) {
    return;
  }
  dom.facts.innerHTML = "";
  facts.forEach((fact) => {
    const term = document.createElement("dt");
    term.textContent = fact.label;
    const value = document.createElement("dd");
    value.textContent = fact.value;
    dom.facts.appendChild(term);
    dom.facts.appendChild(value);
  });
}

function buildPrimaryCta(receipt, canonicalUrl) {
  if (RECEIPT_CONFIG.universalLinksReady) {
    return {
      label: "Open in app",
      href: canonicalUrl
    };
  }

  if (RECEIPT_CONFIG.deepLinkBaseUrl) {
    return {
      label: "Open in app",
      href: `${RECEIPT_CONFIG.deepLinkBaseUrl}${encodeURIComponent(receipt.id)}`
    };
  }

  if (receipt.variant === "intel_receipt") {
    return {
      label: "See Premium",
      href: RECEIPT_CONFIG.plusUrl
    };
  }

  return {
    label: "Get StreamPicks",
    href: RECEIPT_CONFIG.installUrl
  };
}

function buildSecondaryCta(receipt) {
  if (receipt.variant === "intel_receipt") {
    return {
      label: "Make your own picks",
      href: RECEIPT_CONFIG.makePicksUrl
    };
  }

  return {
    label: "Make your own picks",
    href: RECEIPT_CONFIG.makePicksUrl
  };
}

function buildReceiptNote() {
  if (RECEIPT_CONFIG.universalLinksReady || RECEIPT_CONFIG.deepLinkBaseUrl) {
    return "Shared from StreamPicks. This same link can open the app when it is installed.";
  }
  return "Shared from StreamPicks. Get the app to make your own calls, climbs, and receipts.";
}

function normalizePlusLabel(label) {
  if (!label || label === "Get Plus Updates" || label === "Get StreamPicks+") {
    return "See Premium";
  }
  return label;
}

function renderReceipt(receipt) {
  const canonicalUrl = buildCanonicalUrl(receipt.id);
  const primaryCta = buildPrimaryCta(receipt, canonicalUrl);
  const secondaryCta = buildSecondaryCta(receipt);

  document.body.dataset.receiptTone = receipt.tone;

  setText(dom.kicker, receipt.kicker);
  setText(dom.title, receipt.title);
  setText(dom.subtitle, receipt.subtitle);
  setText(dom.note, buildReceiptNote());
  renderChipList(receipt.chips || []);

  setText(dom.badge, receipt.badge);
  setText(dom.state, receipt.state);
  setText(dom.impactValue, receipt.impactValue);
  setText(dom.impactLabel, receipt.impactLabel);
  setText(dom.actorName, receipt.actorName);
  setText(dom.actorMeta, receipt.actorMeta);
  renderFacts(receipt.facts || []);

  setText(dom.storyTitle, receipt.storyTitle);
  setText(dom.storyBody, receipt.storyBody);
  setText(dom.stakesTitle, receipt.stakesTitle);
  setText(dom.stakesBody, receipt.stakesBody);

  setText(dom.plusKicker, receipt.plusKicker);
  setText(dom.plusTitle, receipt.plusTitle);
  setText(dom.plusCopy, receipt.plusCopy);
  setLink(dom.plusCta, normalizePlusLabel(receipt.plusCtaLabel), RECEIPT_CONFIG.plusUrl);

  setLink(dom.primaryCta, primaryCta.label, primaryCta.href);
  setLink(dom.secondaryCta, secondaryCta.label, secondaryCta.href);
  setLink(dom.headerCta, primaryCta.label, primaryCta.href);
  setLink(dom.mobileCta, primaryCta.label, primaryCta.href);

  setText(dom.mobileTitle, receipt.badge);
  setText(dom.mobileCopy, receipt.state);

  updateMetadata(receipt, canonicalUrl);
}

const receiptId = resolveReceiptId();
renderReceipt(resolveReceipt(receiptId));
