# StreamPicks website

Static marketing and support website at https://streampicks.app, hosted by Firebase Hosting in `streamdraft-a5cd3`.

The homepage uses the shared `styles.css` and `styles/tokens.css`, with its current presentation in `styles/marketing.css`. The latter is not loaded by the legal documents. Store links point to Apple app `6760561274` and Android package `app.streampicks.mobile`.

Before publishing, check the homepage, store links, mobile navigation, billing toggle, newsletter validation, and recovery pages. Compare feature limits with the app repository's `functions/src/premiumBenefits.json` and `src/lib/premiumOffer.ts`. Subscription prices must be checked against the current store listing.

Deploy website changes with `firebase deploy --only hosting --project streamdraft-a5cd3`. Hosting retains the existing share and form rewrites. The current share function is maintained by the StreamPicks app repository; a website refresh must not redeploy that backend from this directory. Source files, development previews, and old receipt examples are excluded from Hosting.

Preserve the currently published EULA, Terms, Privacy Policy, data-deletion and takedown pages, drop-rate disclosures, and their shared styles when refreshing marketing. Check their file hashes against the live site before and after deployment. Existing uncommitted files may already match production; a Git diff alone does not establish what is live.
