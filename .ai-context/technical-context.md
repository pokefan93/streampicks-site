# Technical Context

## Current reality

The website is currently a static site and should remain lightweight unless there is a compelling reason to change that.

The website is hosted through Firebase Hosting and is intended to live in the same Firebase project as the main StreamPicks app backend so it can eventually share:
- Firebase Auth
- Firestore
- Cloud Functions
- shared product identity
- future account-linked pages
- future share landing pages

## Technical direction

Short-term:
- preserve the existing static site structure where possible
- improve copy, layout, hierarchy, and polish
- do not add unnecessary dependencies
- do not introduce heavy framework complexity without strong justification

Medium-term:
- register the website as a Web App in the same Firebase project
- support login/account-linked pages
- support public share destinations
- support creator/profile/rank-related public pages

## Coding expectations

Any AI coding agent should:
- inspect the current repo before making assumptions
- prefer minimal and high-confidence changes
- preserve working behavior
- avoid unnecessary stack migrations
- keep the site easy to maintain