# StreamPicks website

Static marketing and support website at https://streampicks.app, hosted by Firebase Hosting in `streamdraft-a5cd3`.

The approved homepage is implemented in `index.html`, `styles/homepage.css`, `styles/game-cards.css`, and `homepage.js`. It uses the app's `assets/branding/StreamPicks-LogoIcon.webp` crown, actual level 3 creator art, and the headline “Real creators. Collect their cards. Play your favorites.” Homepage assets live in `assets/images/homepage/`. The legal documents retain their existing shared `styles.css`, `styles/tokens.css`, and `terms.css`; the homepage stylesheets are not loaded by them. Store links point to Apple app `6760561274` and Android package `app.streampicks.mobile`.

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

The homepage and `/press/` use the exact Regular, Medium, and Bold StreamPicksDisplay files bundled in the app, through `styles/brand-font.css`. `styles/feature-explorer.css` and `feature-explorer.js` add a keyboard accessible four-panel tour of Career, Aura Workshop, Trending Picks, and the web collection. The existing card gallery, League/Arena controls, newsletter, store links, and account navigation remain available. The support page also loads the app font.

The press room has a quick factsheet, short and extended copyable descriptions, six filterable screenshot downloads with previews, individual logos and character assets, and a rebuilt ZIP media kit. Press goes to `hello@streampicks.app`, player help to `support@streampicks.app`, and collaborations to `partnerships@streampicks.app`. It avoids hard-coded regional subscription prices and distinguishes the minimum player age from store ratings.

Media provenance is in `assets/data/website-media-sources.json`. Native collection, Workshop, battle, and deck captures come from the October 16 promotional capture build; only the iOS status area is cropped. Fictional sample accounts and promotional display names are disclosed. Career and pack screens are the existing supplied press assets. Website visuals use actual game art; no app screens are image generated.

Release this refresh by cloning the current Firebase Hosting version in CREATED state and populating only the reviewed marketing/support/media paths. Verify the entire resulting file map and configuration before finalizing and releasing. This preserves the already deployed `/account/` renderer and all unrelated files without rebuilding or downloading the portal. Never deploy this checkout directly with its older root Firebase config. Capture the current live version again immediately before release, refuse unexpected changes, and record the previous version as rollback target. Legal documents, shared legal styles, form scripts, association files, backend routes, and portal artifacts must remain byte-identical.
