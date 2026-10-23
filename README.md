# StreamPicks website

Static marketing and support website at https://streampicks.app, hosted by Firebase Hosting in `streamdraft-a5cd3`.

## October 23 homepage refinement

`styles/refinement.css` is the final, homepage-scoped presentation layer in the marketing build. It unifies navy, ivory, and mint surfaces, heading sizes, spacing, controls, and responsive layouts while retaining the existing StreamPicksDisplay fonts and original game imagery. The homepage now introduces collecting and gameplay before the latest updates; the player portal follows the card gallery. Desktop navigation includes a download action and tracks the current section. Image dialogs contain background scrolling and restore the prior position on close.

Run `npm run build:marketing` to regenerate the landing bundles. The asset builder preserves image attribute formatting when values are unchanged. Check 320–1440px layouts, mobile navigation, keyboard tabs, card/pack/genre controls, image dialogs, video controls, and FAQ before publishing. Publish only the reviewed homepage and its two generated bundles through the current Hosting-version clone workflow below; keep the portal, legal pages, and live configuration intact.

Published after user review on October 23, 2026 at 20:54:24 UTC by promoting the exact reviewed Firebase Hosting version `44b5398137624684`. The three served homepage files matched their approved SHA-256 hashes. All 5,102 other hosted files and the complete Hosting configuration were preserved; 16 portal, press, legal, support, and shared-resource routes retained their pre-release response hashes. Rollback version: `9d6f7ea78865796b`. Release details are in `release-records/homepage-polish-2026-10-23.json`.

The homepage uses the app's StreamPicks font, supplied crown and wordmark, and the headline “Your feed. Now playable.” `styles/site-shell.css` and `site-shell.js` provide the shared marketing header, footer, mobile navigation, player portal entry, and social links. `styles/site-polish.css` and `site-polish.js` provide the homepage's current packs, player gateway, and community presentation. The existing gameplay preview and card interactions remain in `homepage.js`. Assets live in `assets/images/homepage/`, `assets/images/features/`, and `assets/images/packs-20261020/`. The legal documents retain their existing shared `styles.css`, `styles/tokens.css`, and `terms.css`; homepage stylesheets are not loaded by them. Store links point to Apple app `6760561274` and Android package `app.streampicks.mobile`.

Hero and gallery cards use complete exports of the app's actual `src/components/arena/ArenaCard.tsx`, including its frames, typography, Vibe icons, attacks, passives, and footer. The gallery switches between real Level 2 cards and Level 3 Full Art cards, including their different stats. Stream King and Stream Queen open the app's Royal Edition cosmetic card; combat stats are not printed on these collectibles. Selecting any card opens a larger preview with catalog-backed accessible text.

The Arena section contains native gameplay captures from October 4, 2026: a rooftop attack, a stadium battle, and the Crown board. Background selectors show different pairs and every image can be enlarged. The League section contains the current production `LeagueScreen`/`MatchupTab` and `DraftCreatorSheet` components rendered with example accounts and scores, clearly labeled as examples. Native services were replaced only for these isolated renders; the layouts, icons, and font transform come from the app. These are not proof of live multiplayer or current creator performance.

Images live in `assets/images/homepage/cards/` and `assets/images/homepage/screenshots/`. Card faces and League renders use lossless WebP; native Arena images are resized to 780 × 1688 and encoded losslessly. `assets/data/card-renders.json` records the renderer source hashes, effective definition hashes, and image hashes. `assets/data/featured-cards.json` records the source-derived accessible card rules. Run `node scripts/sync-homepage-cards.cjs`, optionally passing the app repository path, to synchronize both homepage variants. The script rejects changed renderer dependencies, definitions, or image exports; recapture the actual app component first when those change. The isolated capture build, React Native Web adapters, source screenshots, and preservation checks for this revision are in `output/app-screens-2026-10-05/`, which is excluded from Hosting. Recheck responsive previews after syncing.

Before publishing, check the homepage, store links, mobile navigation, game mode tabs, artwork previews, genre browser, newsletter validation, and recovery pages. The existing `script.js` and `site-config.js` still own the newsletter's Turnstile and `/api/waitlist` contract. Compare feature limits with the app repository's `functions/src/premiumBenefits.json` and `src/lib/premiumOffer.ts`. Current subscription pricing is shown in the app.

For the player portal release, use the isolated package workflow below. Do not deploy the dirty primary website checkout or point production Hosting at a portal-only build. Hosting retains the existing share and form rewrites. The current share function is maintained by the StreamPicks app repository; a website refresh must not redeploy that backend from this directory. Source files, development previews, and old receipt examples are excluded from Hosting.

Preserve the currently published EULA, Terms, Privacy Policy, data-deletion and takedown pages, drop-rate disclosures, and their shared styles when refreshing marketing. Check their file hashes against the live site before and after deployment. Existing uncommitted files may already match production; a Git diff alone does not establish what is live.

During the October 5 integration, EULA, Terms, Privacy, data deletion, support, and takedown files were restored byte-for-byte from the currently published site. The takedown script and support stylesheet were restored the same way. No legal text was rewritten. `output/approved-homepage-2026-10-05/` contains the published hashes and recoverable pre-integration source files and is excluded from Hosting. The pre-existing local drop-rate correction was preserved. The homepage FAQ, creator disclosure, footer, and newsletter markup retain the pre-integration source wording. Existing anchor URLs from legal pages, including `#mailing-list`, remain available.

The approved homepage was published to `https://streampicks.app/` on October 5, 2026, with a Hosting-only deployment to `streamdraft-a5cd3`. The isolated release used the existing published drop-rate page, leaving the unrelated local correction untouched. All 159 deployed files matched the release manifest on the live custom domain, and all 14 protected legal, support, disclosure, script, and shared-style files matched their pre-deployment live hashes. Desktop and 390-pixel phone checks covered card level controls, screenshot previews, Arena backgrounds, mobile navigation, and EULA/Terms links. `output/hosting-publish-2026-10-05/` contains the release manifest, live comparisons, browser checks, and screenshots; it is excluded from Hosting.

## Player portal integration

The portal source and backend are maintained in `pokefan93/streamdraft`, under `web-player/`. Build the agreed full Git commit there with production Firebase configuration and the `/account/` asset/router base. The website repository packages that build with the complete existing site; it does not deploy the backend. Keep private keys, Turnstile secrets, tokens, and environment files outside this repository and the public build.

`release-baselines/production-2026-10-18.json` records the October 12 production Hosting version `757bf4352c4df34b`, captured on October 18. Its 159 ordinary static files were checked against the deployed Hosting file hashes. The two reserved `/__/firebase/init.*` entries are managed by Firebase. This branch reconciles published bytes, including the published legal documents, rather than the unrelated local edits in the primary checkout. The baseline config retains the deployed Cloud Run rewrites.

Prepare a new release directory with Node 24:

```sh
node scripts/prepare-player-portal-release.cjs \
  --portal-dist /absolute/path/to/streamdraft/web-player/dist \
  --portal-commit FULL_REVIEWED_STREAMDRAFT_COMMIT_SHA \
  --exchange-service VERIFIED_EXCHANGE_CLOUD_RUN_SERVICE \
  --output .cache/portal-release/releases/RELEASE_NAME
```

The optional exchange service creates `/api/portal-app-check`; omit it when the agreed portal uses the direct function URL. The script refuses an existing output directory, source drift, symlinks, private paths, source maps, and credential-file extensions. It emits a `site/` directory, Hosting-only `firebase.json`, and a release manifest outside the public directory. Every existing static file is preserved byte-for-byte. The portal receives a scoped content security policy, popup-compatible headers, revalidated HTML/catalog/stable-file responses, and immutable caching for hashed JavaScript/CSS bundles, fonts, artwork, and the card renderer's CanvasKit runtime. Artwork and `card-runtime/*.wasm` filenames are checked against their actual content hashes before immutable caching is enabled, and the runtime is served as `application/wasm`. Only the `/account` policy adds `'wasm-unsafe-eval'`, which lets the self-hosted CanvasKit compile without permitting `eval()`; the marketing pages keep their existing headers.

`.gitattributes` disables line-ending conversion so a Windows checkout keeps the published bytes the baseline check requires.

The first package leaves the homepage unchanged. After production attestation and real-account checks pass, create a second package from the same portal build with `--announce`; it adds a **My collection** link to desktop and mobile navigation. Verify both navigation layouts before publishing that second package.

Before either Hosting deployment, confirm the agreed backend is live, inspect the production build configuration, test `/account/` and a deep route locally, and verify the current live Hosting version has not changed since the approved baseline or the immediately preceding portal release. Run `firebase deploy --only hosting --project streamdraft-a5cd3` from the prepared release directory only. After publishing, verify the served portal asset hashes, App Check exchange, sign-in/account persistence, all protected baseline hashes, and neighboring marketing/share routes. Keep release manifests and the prior Hosting version identity for rollback.

Adding a new website feature does not authorize changing global Firebase Auth/App Check enforcement, paid plans, or unrelated website/backend configuration.


## October 20, 2026: media room and feature tour

The homepage and `/press/` use the exact Regular, Medium, and Bold StreamPicksDisplay files bundled in the app, through `styles/brand-font.css`. `styles/feature-explorer.css` and `feature-explorer.js` add a keyboard accessible tour of Career, Aura Workshop, and Trending Picks; the later homepage polish gives the player portal its own section. The existing card gallery, League/Arena controls, newsletter, store links, and account navigation remain available. The support page also loads the app font.

The press room has a quick factsheet, short and extended copyable descriptions, six filterable screenshot downloads with previews, individual logos and character assets, and a rebuilt ZIP media kit. Press goes to `hello@streampicks.app`, player help to `support@streampicks.app`, and collaborations to `partnerships@streampicks.app`. It avoids hard-coded regional subscription prices and distinguishes the minimum player age from store ratings.

Media provenance is in `assets/data/website-media-sources.json`. Native collection, Workshop, battle, and deck captures come from the October 16 promotional capture build; only the iOS status area is cropped. Fictional sample accounts and promotional display names are disclosed. Career and pack screens are the existing supplied press assets. Website visuals use actual game art; no app screens are image generated.

Release this refresh by cloning the current Firebase Hosting version in CREATED state and populating only the reviewed marketing/support/media paths. Verify the entire resulting file map and configuration before finalizing and releasing. This preserves the already deployed `/account/` renderer and all unrelated files without rebuilding or downloading the portal. Never deploy this checkout directly with its older root Firebase config. Capture the current live version again immediately before release, refuse unexpected changes, and record the previous version as rollback target. Legal documents, shared legal styles, form scripts, association files, backend routes, and portal artifacts must remain byte-identical.


## October 20 homepage polish

The homepage, press room, support page, and 404 share the same supplied crown and wordmark, navigation shell, Player sign in action, and full social footer through `styles/site-shell.css` and `site-shell.js`. The homepage has a dedicated player portal gateway, six current pack-art previews (five progression tiers plus the special Mega-Viral pack), a community section with all six social accounts, and refreshed Plus/FAQ copy. `assets/data/site-links.json` records the destinations and their verification sources. Font Awesome brand icon attribution is retained in source and `assets/icons/socials/LICENSE.txt`.

All fourteen featured card faces were recaptured from the current native ArenaCard component through the app's production web adapters. Captures use lossless transparent exports at 2x resolution, downsampled into lossless 640x928 WebP files. The app's exact fonts are loaded; static reduced-effects rendering is used. The card exports, definitions, and accessible descriptions are verified together by `scripts/sync-homepage-cards.cjs`; it now works from tracked metadata without depending on an untracked preview directory. Re-run the content validation and recapture images when the renderer or definitions change.

The marketing pass links to the existing `/account/` portal. It does not rebuild portal assets or change authentication, deck saving, or backend routes. Players use their existing app sign-in method; the page explains the portal's collection/deck/progress scope.


## October 20 visual and performance pass

The landing page leads with “Your feed. Now playable.” and gives packs, battles, card art, and community their own visual treatment. `styles/art-direction.css` provides the shared presentation accents. The player portal, six social links, store destinations, existing legal text, and form contracts remain available.

Run `npm ci` and `npm run build:marketing` after changing landing styles, interaction scripts, card exports, or other marketing artwork. The build emits one minified landing stylesheet and one interaction bundle, responsive WebP previews, and `assets/data/marketing-assets.json` with original and preview hashes. It leaves full-quality app exports and press downloads unchanged. Enlarged cards and screenshots load those originals on demand. After `scripts/sync-homepage-cards.cjs`, rebuild marketing assets so the gallery templates and all preview sources stay aligned. Review the 320-pixel phone layout, keyboard controls, and modal images after rebuilding.

`preview/marketing-share.html` is the browser-rendered source for the 1200x630 social sharing image. It uses the actual brand assets, app font, and game card exports; development previews remain excluded from Hosting. No animation framework or continuous animation runs on the landing page.


## October 20, 2026: Career, Aura Workshop, and video

The homepage's `#latest` section highlights Career Mode and Aura Workshop using actual game screens. The deeper feature tour covers Career chapters, objectives, star chests, and rematches, plus Aura exchanges, saved cosmetic looks, and free re-equipping of already unlocked looks. The rules were checked against `functions/src/arenaV1/career.ts`, `functions/src/arenaV1/cardWorkshop.ts`, and the app's Workshop and Career UI on October 20.

`styles/game-updates.css` and `game-updates.js` are included by `npm run build:marketing` in the existing landing CSS/JS bundles. The Career Short and newer developer update were published to the official StreamPicks YouTube channel on October 19. `assets/data/website-media-sources.json` records their public URLs, timestamps, and local poster provenance. No YouTube script, iframe, thumbnail request, or video download runs before the visitor presses play. A tap replaces the local poster with a privacy-enhanced YouTube iframe, starts inline playback, and exposes a Close video button. Switching video removes any active iframe. The direct YouTube link remains a fallback without JavaScript. The homepage meta CSP allows only the exact additional frame origin `https://www.youtube-nocookie.com`; Hosting headers, portal policy, and legal/form files retain their published bytes.
