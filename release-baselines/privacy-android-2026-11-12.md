# Android measurement privacy publication — November 12, 2026

Published at 10:28 p.m. America/Chicago with the user's authorization to update
the privacy policy and required Google Play disclosures.

## Published pages

- https://streampicks.app/privacy-policy/
- https://streampicks.app/data-deletion/

The policy explains Android-only Google and TikTok conversion measurement,
selected event types, app-instance and network identifiers, disabled advertising
IDs, provider sharing, and privacy/deletion requests. It removes obsolete claims
that TikTok/Meta SDKs are present on iOS and references to an ad-measurement
settings screen and adult opt-in that the current implementation does not have.
The iPhone description reflects its existing SKAdNetwork integration. This
publication changes no app binary, native dependency, or iOS configuration.

The two pages were edited from the then-live pages. The released version was
cloned from the current production Hosting version with only these paths replaced:

- `/privacy-policy/index.html`
- `/data-deletion/index.html`

Firebase project/site: `streamdraft-a5cd3`.

- Prior/rollback version: `f91033d99eea1ad9`.
- Published version: `3d2e92ad53a96886`.
- Release: `projects/417226550740/sites/streamdraft-a5cd3/channels/live/releases/1794544134316000`.
- Release time: `2026-11-13T04:28:54.316Z`.
- Total files: 5,107; 5,105 unchanged. The entire file map and Hosting configuration
  were verified before and after release. No backend deployment occurred.
- Both public pages returned HTTP 200 with exactly the reviewed uncompressed
  SHA-256 content. Preview browser review and a live screenshot were captured.

## Google Play review

Reviewed the `app.streampicks.mobile` app in developer account
`5966039880280834577`, app ID `4975595404056374726`, signed in through Chrome's
Tay profile (`karnestaylor@yahoo.com`).

The existing Data safety declaration already covered the affected data. No form
answers or Play submissions were changed:

| Data type | Existing collection | Existing sharing |
| --- | --- | --- |
| User IDs | Required; includes advertising or marketing | Advertising or marketing |
| Device or other IDs | Required; includes advertising or marketing | Advertising or marketing |
| App interactions | Required; includes advertising or marketing | Advertising or marketing |
| Approximate location | Required; analytics and advertising or marketing | Advertising or marketing |
| Purchase history | Optional purchase data; includes advertising or marketing | Advertising or marketing |
| Diagnostics | Includes advertising or marketing | Advertising or marketing |

All above collection was declared non-ephemeral. Existing unrelated purposes
and data categories were retained. Purchase data can be optional because a user
can choose not to purchase; region-dependent automatic collection is not an
optional choice available to every user.

Also verified:

- Advertising ID: **No**, matching the SDK configuration and merged manifest.
- Contains ads: **No**, because the new SDK measures acquisition and does not
  display ads in the app.
- Privacy URL: `https://streampicks.app/privacy-policy/`.
- Account and partial-data deletion URLs: `https://streampicks.app/data-deletion/`.
- Encryption in transit: Yes.
- App content: no pending declarations; policy status displayed no policy issues.

There was a separate account-level notice to declare trader status by February
2027. It is unrelated to this SDK update and was not completed or attested here.

## Release boundary and evidence

The Android integration remains off by default and has not been released to
players. A policy update is not consent and does not validate jurisdiction or age
eligibility. Before enabling production measurement, confirm applicable consent,
minor and opt-out requirements and an operational way to honor requests. The
current time-zone proxy does not establish a user's actual residence. No in-app
opt-out control is promised by these pages.

App source/notes: `C:\Users\tkarnes\dev\sp-android-tiktok-1112` on
`codex/android-tiktok-events-1112`.

Local evidence (ignored app worktree directory):
`work/privacy-update/hosting-record.json`, `play-*-before.txt`,
`play-final-preview.txt`, `play-ad-id.txt`, `play-ads.txt`, and
`play-policy-url.txt`. The record contains the full prior Hosting file map and
configuration, and the reviewed page hashes. No credentials are stored in these
publication records.

Screenshot:
`C:\Users\tkarnes\.codex\visualizations\2026\11\13\01a1d2d0-b2c8-7a91-a9e1-a41b05854b58\privacy-policy-android-live.png`.

## Official references used for the disclosure review

- [Google Play Data safety requirements](https://support.google.com/googleplay/android-developer/answer/10787469?hl=en)
- [Firebase Android data disclosure guidance](https://firebase.google.com/docs/android/play-data-disclosure)
- [Google Play User Data policy](https://support.google.com/googleplay/android-developer/answer/10144311?hl=en)

Do not deploy this whole checkout over production. Future site changes must
preserve the then-live Hosting version's files and routing, including the portal.
