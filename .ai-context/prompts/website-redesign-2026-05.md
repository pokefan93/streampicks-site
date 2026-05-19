# StreamPicks Website Redesign — Prompt Package

Written 2026-05-18 after a comprehensive review of the app (`~/dev/streamdraft/`)
and the current site. Hand any of these prompts to Claude (claude.ai) or a
similar design/codegen tool to drive a redesign.

---

## Top of the funnel: what changed since this site was built

The site was built when StreamPicks was **pre-launch waitlist**. The app is now
**live** — version 1.13.22, in both the App Store and Google Play. That single
fact creates almost every gap in the current site:

1. **Hero CTA is wrong.** The site says "Claim your spot before launch."
   The right CTA is "Download on the App Store" / "Get it on Google Play"
   with the waitlist demoted to a secondary path (e.g., for users who want
   launch-news updates or a content-creator opt-in).
2. **No download buttons anywhere.** Add Apple/Google badges in the hero
   and a sticky CTA bar.
3. **No real gameplay imagery.** The phone mockups contain fake UI text.
   The actual app has Arena card battles, pack-opening reveals, and league
   draft boards that are visually distinctive — the site should show them.
4. **Two game modes aren't differentiated.** The app has two pillars: Arena
   (turn-based card battles, Pokemon-TCG-style) and Leagues (fantasy-football-
   style draft and weekly scoring on real creator activity). The site treats
   them as one undifferentiated blob.
5. **The collectible angle is buried.** Rarity tiers (common → rare → epic →
   legendary → fullArt), pack-opening dopamine, cosmetic auras — none of
   this is on the site. It's the most marketable hook.
6. **No social proof, no creator highlights.** No featured-creator gallery,
   no "play with cards of [list of recognizable names]", no testimonials,
   no install count, no rating from the stores.
7. **Premium tier is weak.** StreamPicks Plus (monthly + yearly via
   RevenueCat) gets 5 → 20 daily Arena battles, 1 → 5 active leagues,
   1 → 3 deck slots, 1 → 3 genre slots, all cosmetics. The site mentions
   "more polish, more customization" in vague terms — the redesign should
   surface a concrete comparison table.
8. **Missing required content:**
   - Drop-rate disclosure link (App Store Guideline 3.1.1 — odds are
     published in-app at `/drop-rates`; the marketing site should link or
     mirror this).
   - Disclaimer: *"StreamPicks is an independent fantasy game. Not affiliated
     with, endorsed by, or sponsored by YouTube, any creator, or any related
     brand. Creator names used for entertainment purposes only."*
   - Support contact (email).
   - Age rating / target audience note (the app targets 13+).
9. **Color drift.** App brand cyan is `#19D3F3`; site cyan is `#38dcff`.
   Pick one — preferably the app's value — and align.
10. **404 is unbranded Firebase boilerplate.**

Everything else (the waitlist backend, the receipt landing system, the
deep-link rewrites, the design token architecture, the dark-mode aesthetic,
the Cloudflare Turnstile protection) is solid and worth keeping.

---

## How to use this file

- **PROMPT 1 (the master brief)** is the one to start with. Paste it into a
  fresh Claude conversation. Ask Claude to produce the full site as HTML +
  CSS + JS (no framework — match the current stack). For best results, also
  attach screenshots of 3–5 of your best in-app screens (Arena battle, pack
  opening, a creator card close-up, league draft board, premium screen).
- **PROMPTS 2–9** are tactical — use them to iterate on specific sections
  after the master brief produces a v1. Each is self-contained and assumes
  Claude already has the brand context.
- **APPENDIX A** has the brand facts. Paste it into the conversation if
  Claude seems to be losing context.
- **APPENDIX B** has the technical constraints. Paste it if Claude is
  proposing changes that would break the backend, deep links, or hosting.

---

## PROMPT 1 — Master design brief

> Use this in a fresh Claude conversation. Attach 3–5 in-app screenshots
> if you have them. Ask Claude to deliver a complete static site as a set
> of files.

```
You are redesigning the marketing website for a live mobile game called
StreamPicks. The site lives at https://streampicks.app. I want a complete
redesign delivered as static HTML, CSS, and JavaScript (no React, no
framework — vanilla, matching the existing stack). Use semantic HTML5,
modern CSS (custom properties, container queries where helpful, fluid type
with clamp()), and minimal vanilla JS for interactivity.

WHAT STREAMPICKS IS

StreamPicks is a free-to-play mobile collectible card game built around real
YouTube creators. Players collect cards of their favorite creators across
14+ genres (gaming, music, comedy, sports, tech, beauty, food, education,
fitness, finance, lifestyle, travel, news, entertainment) and play in two
distinct modes:

1. ARENA — A turn-based card battle mode in the spirit of Pokemon TCG.
   Cards have rarity tiers (common, rare, epic, legendary, full-art),
   genre specializations, attacks with stamina and status effects, weakness
   and resistance, and PvP matchmaking with Elo-style rating and seasonal
   ladders. Free players get 5 Arena battles per day; Plus subscribers
   get 20.

2. LEAGUES — A fantasy-football-style mode where you draft a roster of
   creators and score points across a season based on their real-world
   activity (uploads, milestones, metrics). Trade, waive, and climb the
   standings. Free players can be in 1 active league; Plus subscribers
   can be in 5.

Plus the supporting loop: open card packs (with public, App Store-compliant
drop rates), customize cards with cosmetic "auras," join social Teams, see
friends' activity in the Feed, customize your profile with banners and
themes (including a "vibrant" mode where users pick the UI accent color).

TARGET AUDIENCE

Mobile gamers and creator fans, roughly 13–25. Think: people who watch a lot
of YouTube/Twitch, play casual mobile games (Pokemon TCG Pocket, Marvel
Snap, Clash Royale), and enjoy the collect-and-flex loop. The site should
feel premium, game-like, and fandom-driven — not corporate, not crypto,
not a generic SaaS landing page.

MONETIZATION

Free to download. Optional subscription: StreamPicks Plus (monthly +
yearly via RevenueCat). Optional coin packs for accelerating pack-opening.
No pay-to-win — premium gives more daily play, more inventory slots, and
cosmetics. The site should be transparent about this.

LAUNCH STATUS

LIVE. Available now on the App Store and Google Play. The current site
positions this as pre-launch waitlist — that's stale. The new site's
primary CTA is downloading the app. A secondary "join the mailing list"
flow can survive for launch-news subscribers and creator partnerships.

THE PAGES I NEED

1. Home (/) — Primary marketing page. Sections in order:
   - Hero: app name, one-line value prop, Apple + Google download badges
     side by side, hero visual (a 3-up phone mockup showing Arena battle /
     pack opening / league draft, OR a single dramatic phone with looping
     video poster — your call). Include a small "4.X stars on the App Store"
     placeholder line we can swap in.
   - Two-mode explainer: a clear, visually distinct split between ARENA
     (battle, cards, ladders) and LEAGUES (draft, fantasy scoring, trades).
     Each mode gets its own card with its own visual, copy, and a
     "How it works" expandable.
   - The collectible loop: pack opening, rarity tiers (visually show what
     a common vs rare vs epic vs legendary vs full-art card looks like),
     cosmetic auras. Tease the dopamine.
   - Creator gallery (placeholder): "Cards for creators you actually
     watch" — a scrollable grid of creator card backs/silhouettes with
     a "[YOUR CREATOR HERE]" CTA tile at the end. We'll swap in real
     creator imagery later, but the layout should be set up for it.
   - Social layer: Teams, Friends, Feed — quick triptych.
   - StreamPicks Plus: A side-by-side Free vs Plus comparison table.
     Make Plus aspirational but not pushy. Include both monthly and
     yearly prices (placeholder $/€/£ tokens — I'll fill in real values).
   - Daily return hooks: missions, season pass, ladder resets, pack
     timers — give the "there's a reason to come back tomorrow" pitch.
   - Newsletter (NOT waitlist): "Get launch-day creator drops, new pack
     releases, and event news in your inbox." Form posts to /api/waitlist
     (same backend, repurposed) with a small note that it's optional.
   - FAQ: 6–10 questions covering: Is it free? What ages? How are creators
     chosen? Is this affiliated with YouTube? How do I cancel Plus? What
     are drop rates? Where's my data stored? How do I delete my account?
   - Footer with: download badges (again), social links (placeholder),
     legal links, support email, the creator disclaimer (full text in
     APPENDIX A below), copyright.

2. Privacy policy — Reuse the existing /privacy-policy/index.html content
   but restyle in the new brand language. Don't rewrite the legal text.

3. Terms of service — Same as above; restyle existing /terms.html.

4. Data deletion — Same; restyle existing /data-deletion/index.html.

5. Support page (NEW) — Simple page at /support/ with an email link, a
   one-paragraph "what to include in your message" guide, links to
   drop-rates and the legal pages.

6. Drop rates page (NEW) — At /drop-rates/. Publish the per-pack rarity
   percentages and pity-system rules. (I'll provide the exact numbers
   separately; design the page to take a data table + a short FAQ.)

7. 404 page — Replace the generic Firebase boilerplate with a branded
   404 that matches the new design and links back to home + downloads.

8. Receipt landing template — DO NOT CHANGE THE BACKEND. There's an
   existing /r/index.html that renders share receipts via client-side JS.
   The redesign should give /r/ a fresh visual template that matches the
   new brand, but it must still be a single static HTML file with the
   same hooks (data attributes, ID targets) that the existing receipt.js
   reads. I'll give you the existing receipt.js so you can preserve its
   contract.

DESIGN DIRECTION

- Dark mode by default (no light mode). The app's primary background is
  near-black with subtle blue tint (#0B1220). Use that or a close cousin.
- Brand cyan is #19D3F3 (this is the app's official value — the current
  site uses a slightly different #38dcff; align to the app).
- Premium gold accent #F5C638 for Plus-related surfaces.
- Status colors only when meaningful: green #B6FF00 (success), red #FF4D4D
  (warning), yellow #FFD600 (alert).
- Typography: keep the current Avenir Next + Avenir Next Condensed pairing
  (system-installed on iOS/macOS, fallback gracefully on other platforms).
- Motion: tasteful — section reveals via IntersectionObserver, subtle
  parallax on the hero, hover glows on cards. No autoplaying video without
  user interaction. Respect prefers-reduced-motion.
- Imagery: lean into card art and screenshot frames. Avoid stock photos.
  Avoid generic "person on phone" mockups. The hero should show actual
  product surfaces.
- Vibe: premium TCG meets creator-economy energy. Think Marvel Snap's
  marketing site crossed with a high-end fantasy sports app. Not Web3.
  Not corporate. Not minimalist-to-the-point-of-cold.

VOICE / TONE (with examples)

- Concise, declarative, slightly cocky.
- Lead with verbs. Avoid adjective stacks.
- Examples from the app: "Smart matchups beat raw stats." / "Slay the
  leaderboard." / "Battle in Arena." / "Draft creators. Score real points."
- Avoid: "Revolutionize your fandom journey." "The ultimate creator
  experience." Anything with the word "engagement."

TECHNICAL CONSTRAINTS

- Static HTML/CSS/JS only. No framework, no build step. Files are served
  by Firebase Hosting from the repo root.
- Vanilla JS only. Use minimal JS — IntersectionObserver for reveals,
  fetch() for the newsletter form, basic state management for any toggles.
- Keep the existing design tokens architecture (styles/tokens.css). You
  can rewrite the values but keep the file structure so the team's used
  to it.
- Reuse the existing waitlist backend: POST /api/waitlist with body
  {email, company (honeypot), turnstileToken}. Cloudflare Turnstile
  CAPTCHA is required — get the existing site key from script.js.
- Mobile-first responsive. Breakpoints: phone (default), 720px, 1024px.
- Lighthouse targets: Performance 90+, Accessibility 95+, Best Practices
  95+, SEO 95+.
- Accessibility: WCAG 2.1 AA minimum. Visible focus rings, aria-live for
  form messages, semantic landmarks, alt text on all meaningful imagery,
  color contrast 4.5:1 for body text.
- SEO: per-page title/description, OG tags pointing at og-default.png in
  the repo root (already in place), JSON-LD for SoftwareApplication on
  the home page, FAQ schema on the FAQ section.
- Security: keep the current Content-Security-Policy posture (no inline
  scripts beyond what's necessary; Turnstile origin allowed). No third-
  party analytics in v1 — we'll add later.

DELIVERABLE

Produce the complete file set as artifacts I can drop into the repo:
- index.html
- privacy-policy/index.html (restyled)
- terms.html (restyled)
- data-deletion/index.html (restyled)
- support/index.html (new)
- drop-rates/index.html (new, with a placeholder data table)
- 404.html (branded)
- r/index.html (redesigned shell, same JS contract — I'll provide receipt.js)
- styles/tokens.css (rewritten values, same file shape)
- styles.css (rewritten)
- script.js (rewritten, minimal)
- Anything else you need (one extra CSS or JS file is fine, more = ask)

Where you need creator imagery, leave placeholder slots with clear comments
about what should go there. Where you need real pricing or store URLs, use
placeholder tokens like [APP_STORE_URL], [PLAY_STORE_URL], [PLUS_MONTHLY],
[PLUS_YEARLY] so I can find-and-replace later.

Start by asking me any clarifying questions you need. Then deliver a
proposed home page first (HTML + relevant CSS) so I can give feedback
before you build the rest.
```

---

## PROMPT 2 — Hero section refinement

> Use after the master brief if the hero needs work. The two-mode dual CTA
> structure is the hardest thing to nail; this prompt is for that.

```
Refine the home page hero for StreamPicks. The hero needs to do five things
in one screen, on mobile:

1. State the app's name and one-line value prop.
2. Drive App Store + Google Play downloads (mockup for now).
3. Show product (real screenshot or a credible mockup, not a generic phone).
4. Communicate the two game modes (Arena = battle, Leagues = fantasy draft)
   without making the hero feel like a feature list.
5. Pass a 5-second test: a stranger should understand "it's a card game
   with real creators that I can download right now."

Constraints:
- Dark background (#0B1220 or close).
- Cyan accent #19D3F3, premium gold #F5C638 for any premium hint.
- Avenir Next Condensed for the H1, Avenir Next for body.
- The download badges must be official Apple "Download on the App Store"
  and Google "Get it on Google Play" — don't redraw them. Use the
  official badge images, link to placeholder URLs.
- Below the fold on mobile, but visible on desktop: a small "Or join the
  mailing list" link as a secondary path for people not ready to install.

Iterate on 3 variants:

A) Single dramatic phone mockup showing an Arena battle mid-attack, with
   the H1 to the left, badges below the H1.

B) Three-phone fan showing Arena / Pack Opening / Leagues, with the H1
   centered above and badges below.

C) Split hero — H1 + CTAs on the left, an animated card-reveal sequence
   on the right (using CSS animation only — no video, no large GIFs).

For each variant, give me the HTML + the CSS needed. I'll pick one.
```

---

## PROMPT 3 — Two-mode explainer (Arena vs Leagues)

```
Design the section that explains StreamPicks' two distinct game modes. The
challenge: they're genuinely different products bolted into one app, and
the marketing site needs to make each one clear without diluting the other.

ARENA
- Turn-based card battle. Two players (or PvE), each with a deck of
  creator cards.
- Cards have: a base creator (real YouTuber/streamer), rarity tier
  (common → rare → epic → legendary → full-art), genre, attacks with
  stamina costs, status effects, weakness/resistance vs other genres.
- Battles are quick (3–5 min). Ladder ranking with Elo-style rating.
  Seasonal resets. Free players get 5 battles/day, Plus gets 20.
- Cosmetic layer: card "auras" that change how cards feel/look in battle.
- Visual reference: Pokemon TCG Pocket meets Marvel Snap.

LEAGUES
- Fantasy-football-style. Draft a roster of creator cards at season start.
- Cards score points each week based on the real creator's activity:
  uploads, view milestones, subscriber growth, etc.
- Trade, waive, claim from a free-agent pool, climb a season-long
  standings table.
- Free players: 1 active league. Plus: 5.
- Visual reference: a polished version of Yahoo Fantasy / Sleeper.

The section should let a visitor pick which mode resonates and dive
deeper. Don't try to convince them to play both — let the mode speak
for itself.

Constraints:
- Two clearly distinct visual treatments: maybe Arena leans into combat
  iconography (lightning, hex grids, energy meters) while Leagues leans
  into stats (line charts, standings tables, trade tickets).
- Each mode card should have: a 1-line tagline, a 3-sentence explainer,
  a "How a typical session looks" 3-step visual, and a "Show me more"
  link that smooth-scrolls to a deeper sub-section.
- The two cards should be visually balanced so neither mode looks like
  the side dish.

Give me HTML + CSS for the section. Use placeholder imagery slots with
comments describing what goes there.
```

---

## PROMPT 4 — Collectible / pack-opening section

```
Design the section that communicates StreamPicks' collectible loop.
This is the dopamine pitch. The current site doesn't have it at all.

KEY FACTS

- Cards have 5 rarity tiers: common, rare, epic, legendary, full-art.
- Each tier has visibly different card frames (epic gets a special border
  treatment, legendary gets foil effects, full-art is full-bleed creator
  imagery).
- Players open card packs. Pack types: free daily packs that recharge on
  timers (free tier: 3 max, 10-hour timer; Plus: faster + more slots),
  premium packs purchased with coins (the in-app currency).
- Drop rates are publicly disclosed (App Store policy 3.1.1) and there's
  a pity system that guarantees a rare+ pull within X packs.
- Cosmetic "auras" customize cards post-pull.
- Trade and free-agent waivers are a thing in Leagues but not Arena.

WHAT TO BUILD

A section that hits these beats in order:
1. "Open packs. Pull cards. Build your collection." (hero line)
2. Visual: a rarity ladder showing the same creator card at each of the
   5 rarity tiers, side by side. This is the marquee visual.
3. Three quick stats / promises: "[X] creators in the pool", "Drop rates
   published — [link to drop-rates page]", "Pity system guarantees rare+
   every [Y] packs".
4. A short explainer on auras: "Make your cards yours" with 3 example
   aura treatments visually shown.
5. CTA: "See your first pull → Download free".

Constraints:
- The rarity ladder is the single most important visual on this section.
  Make it a CSS-only treatment (no large images) using gradient borders,
  box-shadow glows, and SVG flourishes for the foil/full-art tiers.
- Don't make the page bigger than it needs to be — this is a section,
  not a multi-screen experience.

Give me HTML + CSS, with explicit notes on which colors/effects map to
which rarity tier so a future designer can adjust.
```

---

## PROMPT 5 — Free vs Plus comparison

```
Design a "StreamPicks Plus" comparison section. Goal: be transparent
about what Plus does and doesn't do, while making it aspirational.

CONCRETE DIFFERENCES (use these exact numbers in the table)

| Feature                          | Free       | Plus            |
|----------------------------------|------------|-----------------|
| Arena battles per day            | 5          | 20              |
| Active Leagues                   | 1          | 5               |
| Arena deck slots                 | 1          | 3               |
| Creator genre slots in draft     | 1          | 3               |
| Free pack timer                  | 10h        | Faster          |
| Free pack inventory cap          | 3          | More            |
| Battle Pass rewards              | Free track | Plus track too  |
| Cosmetics & profile flair        | Standard   | All unlocked    |
| Customer support priority        | Standard   | Priority        |

PRICING

Monthly: [PLUS_MONTHLY] (placeholder — I'll fill in actual store price)
Yearly: [PLUS_YEARLY] (placeholder — usually a discount vs 12x monthly)

CONSTRAINTS

- Not a fake countdown. Not a "limited time" lie. Just facts.
- Cancel-anytime should be visible without hunting.
- "Free is the default. Plus is for players who want more." Make that
  honest, not condescending.
- Premium gold accent #F5C638 on the Plus column header, cyan #19D3F3
  on the Free column.
- Mobile: collapse to a card-per-tier layout (Free card stacked above
  Plus card) rather than a horizontal table.

Give me HTML + CSS. Make the table semantic (real <table>, <thead>,
<tbody>, scope="col" headers). Include a tiny note: "Subscriptions auto-
renew. Manage or cancel anytime in your App Store / Play Store account."
```

---

## PROMPT 6 — Creator gallery + disclaimer

```
Design the "Creators in the game" section. This is where we communicate
that StreamPicks isn't built around generic fantasy creators — your
favorites are actually in it.

WHAT WE CAN AND CAN'T SAY (CRITICAL)

We cannot claim endorsement or affiliation. The required disclaimer is:
"StreamPicks is an independent fantasy game. Not affiliated with, endorsed
by, or sponsored by YouTube, any creator, or any related brand. Creator
names used for entertainment purposes only."

This disclaimer MUST appear:
- Once in this section (small but visible).
- Once in the global footer.

What we CAN do:
- Show creator card art (which IS our IP — we drew the cards).
- Reference creator handles / display names factually.
- Categorize creators by genre.
- Use silhouettes / abstracted card backs to suggest "many creators".

WHAT TO BUILD

1. Section heading: "Real creators. Real cards." (or a better variant —
   show me 3 options.)
2. A scrollable grid of card-back / silhouette tiles representing the
   creator roster. ~24 placeholder tiles in a 6x4 grid on desktop, 2-col
   scroll on mobile.
3. A small genre filter chip row above the grid: "All / Gaming / Music /
   Comedy / Sports / Tech / Beauty / Food / Education / Fitness /
   Finance / Lifestyle / Travel / News / Entertainment". Clicking a chip
   filters via vanilla JS (no framework).
4. A CTA tile at the end of the grid: "Want your favorite creator in
   the game? Vote in the app."
5. The disclaimer in a small italic line under the grid.

CONSTRAINTS

- The grid must be keyboard-navigable. Each tile is a focusable element.
- Use CSS grid with auto-fill for responsive behavior.
- Lazy-load images below the fold.
- Default to a card-back design for all tiles until we have approved
  creator art per tile.

Give me HTML + CSS + the small filter JS. Mark every placeholder image
with a clear data-attribute so we can later replace them with real
creator card art (data-creator-handle="...", data-genre="...").
```

---

## PROMPT 7 — FAQ + JSON-LD schema

```
Design the FAQ section for the StreamPicks home page. Six to ten
questions, expand-to-reveal answers (native <details>/<summary> for
accessibility and zero JS).

QUESTIONS TO INCLUDE (rewrite as you see fit — keep the substance)

1. Is StreamPicks free? Yes — free to download and free to play. Plus
   is an optional subscription that adds more daily play, inventory,
   and cosmetics.

2. What ages is it for? 13 and up.

3. Is this affiliated with YouTube or my favorite creator? No.
   StreamPicks is an independent fantasy game. Creator names used for
   entertainment purposes only.

4. How are creators chosen for the game? [BRIEF — we add creators
   based on community feedback, breadth of genre coverage, and active
   audience metrics. New creators added regularly.]

5. What are the card pack drop rates? Published in the app at
   /drop-rates and on this site at /drop-rates. Includes the pity-
   system rules.

6. How do I cancel StreamPicks Plus? Through your App Store or Google
   Play subscription settings. Cancellation is instant; access lasts
   through the end of the current billing period.

7. How do I delete my account and data? Visit the data deletion page,
   or go to Settings → Account → Delete Account in the app.

8. Does the app collect my data? Read the privacy policy for details.
   In short: account info, gameplay stats, and crash logs. No selling
   to third parties.

9. Can I play with friends? Yes — add friends, form Teams, and
   challenge them in Arena.

10. How do I get help? Email [SUPPORT_EMAIL] or visit /support.

CONSTRAINTS

- Use <details>/<summary> — no custom JS. First question can be open
  by default.
- Include JSON-LD FAQPage schema in a <script type="application/ld+json">
  block that mirrors the questions for SEO.
- Style the questions like clickable rows with a chevron indicator.
- Match the brand's dark + cyan palette.

Give me the HTML + CSS + the JSON-LD block.
```

---

## PROMPT 8 — Receipt landing redesign (preserving JS contract)

```
The site has an existing "receipt" share-page system at /r/index.html.
When a player shares a battle result or rank movement, the share link
opens a static page that's themed via JavaScript (receipt.js + receipt-
data.js). The current visual design is OK but doesn't match the new
brand direction.

I'm pasting the existing receipt.js below so you can see what data
attributes and DOM IDs it expects to manipulate. Your job: redesign
the visual shell of /r/index.html so it matches the new brand, BUT
preserve every ID and data-attribute hook that receipt.js reads. If
receipt.js does `document.getElementById('actorName')` to set the
actor name, your new HTML must still have an element with that ID.

[PASTE receipt.js HERE]

[PASTE receipt-data.js HERE for context on what kinds of data flow in]

CONSTRAINTS

- Same file structure: /r/index.html, /r/receipt.js, /r/receipt-data.js,
  /r/receipt.css. You're only redesigning the HTML and CSS.
- The receipt has several "tone" variants (heat, captain, climb, upset,
  streak, scout, team, premium) switched via a data-receipt-tone
  attribute on the <body>. Each tone has its own accent color. Keep
  this contract and design 8 tone treatments.
- The receipt should be highly shareable — strong OG image fallback,
  large readable headline, prominent fact card, brand mark, CTA back
  to the app.
- This is the visual asset most likely to be screenshotted and shared,
  so it should look great as a static image at 1200x630.

Deliverable: new /r/index.html + new /r/receipt.css. Don't touch the JS.
```

---

## PROMPT 9 — Branded 404

```
Design a branded 404 page for streampicks.app. The current /404.html is
Firebase boilerplate.

CONSTRAINTS

- Same dark + cyan palette as the rest of the site.
- One short, on-brand line ("This page took an L." or similar — give me
  3 options).
- Three CTAs: Home, Download (App Store + Play Store badges side by
  side), Support.
- A small illustration / animation slot — keep it CSS-only (no large
  images). A subtle stadium-light glow or a single card flipping is
  enough.
- Must work on mobile.
- Static HTML — no JS required.

Give me the HTML + CSS.
```

---

## APPENDIX A — Brand facts (paste into any prompt that needs them)

```
APP NAME: StreamPicks
DOMAIN: streampicks.app
BUNDLE IDs: app.streampicks.mobile (iOS and Android)
STATUS: Live, version 1.13.22 (as of 2026-05-18)
STORES: App Store + Google Play (URLs: see [APP_STORE_URL] / [PLAY_STORE_URL])

ELEVATOR PITCH (one line):
A free-to-play card game built around real YouTube creators. Collect them,
battle in Arena, draft them in fantasy Leagues, climb the seasonal ladder.

ELEVATOR PITCH (one paragraph):
StreamPicks turns watching creators into a game. Open card packs of your
favorite YouTubers across 14+ genres, battle other fans in turn-based
Arena duels, draft creators into a fantasy League that scores on their
real-world activity, and climb seasonal leaderboards. Free to play; Plus
subscription adds more daily play and cosmetics.

CORE PILLARS:
1. Arena — Turn-based PvP/PvE card battles (5/20 per day free/Plus).
2. Leagues — Fantasy draft scored on real creator activity (1/5 active).
3. Collection — Packs, rarity tiers, drop-rate disclosure, cosmetic auras.
4. Social — Teams, Friends, Feed, share receipts.
5. Personalization — Profile themes, banners, vibrant accent colors.

BRAND COLORS:
Background:    #0B1220 (near-black blue)
Surface:       #121C2E / #1A263D
Text primary:  #FFFFFF
Text muted:    #8FA3C7
Brand cyan:    #19D3F3   (this is the primary accent)
Premium gold:  #F5C638   (Plus surfaces, premium emphasis)
Success:       #B6FF00
Warning:       #FF4D4D
Alert:         #FFD600

TYPOGRAPHY:
Display: "Avenir Next Condensed" → fallback to system sans-serif condensed
Body:    "Avenir Next" → fallback to system sans-serif

REQUIRED DISCLAIMER (must appear on home and footer):
"StreamPicks is an independent fantasy game. Not affiliated with, endorsed
by, or sponsored by YouTube, any creator, or any related brand. Creator
names used for entertainment purposes only."

VOICE:
- Concise, declarative, lightly cocky.
- Lead with verbs.
- No corporate hedging. No web3 language. No "engagement."

GLOSSARY (use these exact words):
- "Arena" (not "battle mode" or "arena mode")
- "Leagues" (not "fantasy league" — just "Leagues")
- "Pack" (not "booster pack")
- "Aura" (not "skin" or "wrap")
- "Plus" / "StreamPicks Plus" (not "premium" or "subscription" in CTAs)
- "Battle" (not "match" or "duel" in player-facing copy)
- "Draft" (not "build a team")
- "Card" (not "creator card" except in first mention per page)
```

---

## APPENDIX B — Technical constraints (paste if Claude proposes changes that risk breaking things)

```
HOSTING: Firebase Hosting. Static files served from the repo root.
firebase.json has rewrites for /api/waitlist → waitlistSignup function,
and for /join/**, /j/**, /league/**, /team/**, /user/**, /creator/**,
/badge/** → shareLanding function. Don't break these rewrites.

CLOUD FUNCTIONS (do not modify):
- POST /api/waitlist — accepts {email, company (honeypot), turnstileToken}.
  Returns {ok: true, alreadySubscribed: bool} on success, structured
  error codes on failure (captcha-required, rate-limited, invalid-email).
  Cloudflare Turnstile is required; existing widget action is
  "waitlist_signup".
- GET /join/**, /league/**, etc. → shareLanding (lives in a separate
  app repo; the website doesn't own this code).

DEEP-LINK FILES (must remain, must not be empty):
- /.well-known/apple-app-site-association
- /.well-known/assetlinks.json
A predeploy guard in firebase.json fails the deploy if either is missing
or contains the literal string "TODO". Don't try to "tidy these up" —
they're production AASA and assetlinks files with real bundle IDs and
SHA fingerprints.

RECEIPT SYSTEM (preserve contract):
The /r/ system uses a static HTML shell whose elements are populated by
client-side JS (receipt.js + receipt-data.js). Redesigning the HTML/CSS
is fine; renaming IDs or restructuring the DOM in ways receipt.js can't
handle is not.

CNAME: streampicks.app (apex) + www.streampicks.app. Don't change.

OG IMAGE: /og-default.png exists at the repo root and is referenced by
the shareLanding function via hardcoded URL. Keep the file at that path.

SECURITY POSTURE:
- Strict Content-Security-Policy on functions (shareLanding sets its own).
- Honeypot field on the waitlist form (field name: "company").
- Cloudflare Turnstile CAPTCHA on the waitlist form.
- No inline scripts unless absolutely necessary; if any are needed, plan
  for CSP-compatible nonces in a future hardening pass.

NO BUILD STEP:
Files are served as-is. No webpack, no Vite, no PostCSS. If you want
SCSS, justify it; default to plain CSS with custom properties.
```

---

## Quick checklist before you ship the redesign

- [ ] App Store + Play Store URLs filled in everywhere `[APP_STORE_URL]` / `[PLAY_STORE_URL]` appears
- [ ] Plus monthly + yearly prices filled in
- [ ] Support email filled in
- [ ] At least 12 real creator card images dropped into the creator gallery
- [ ] At least 1 real Arena battle screenshot dropped into the hero
- [ ] At least 1 real pack-opening screenshot dropped into the collectible section
- [ ] Real drop-rate percentages filled into /drop-rates/ (mirror what the app shows)
- [ ] All 5 predeploy checks still pass:
  - `test -f .well-known/apple-app-site-association`
  - `test -f .well-known/assetlinks.json`
  - `test -f og-default.png`
  - `! grep -q TODO .well-known/apple-app-site-association`
  - `! grep -q TODO .well-known/assetlinks.json`
- [ ] Deploy first to preview channel: `firebase hosting:channel:deploy redesign`
- [ ] Smoke-test on the preview URL: hero loads, downloads link out, waitlist form posts, /r/ template renders, /.well-known/ files return 200 JSON
- [ ] Then `firebase hosting:clone <SITE>:redesign <SITE>:live` or `firebase deploy --only hosting`
