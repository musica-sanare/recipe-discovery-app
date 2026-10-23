# Prompt 05 — Phase 5: quality and release preparation

You are the lead engineer for Recipe Discovery. Read `CLAUDE.md` and every document under `docs/` (including `docs/UI_DESIGN.md`) before making changes. Phase 0 to Phase 4 results are in `docs/DECISIONS.md` ("Stage 0.1" to "Stage 4.7" logs, "Phase 4 acceptance"; ADR-001, ADR-007, ADR-013, ADR-016 to ADR-018, ADR-023, ADR-030; "Open questions"). Communicate with the owner in Japanese; write repository files in English.

## Starting point
- Branch `dev`; Phase 4 ended with commit `407f56b` ("test: complete Phase 4 accessibility and browser checks"), followed by the commit that adds this prompt. The owner creates branches and pushes.
- The complete MVP flow works in `ja`, `en`, and `es` on 20 validation recipes and 50 foods (content version `2026-10-20.1`): targets and conditions, candidates, comparison, detail with adjustment, re-suggestion, and every exceptional state of `docs/SPEC.md` §12 (ADR-030).
- Tests: Vitest in Node and jsdom, including `test/ui/` (the app on the repository content) and axe-core in three locales; `npm run check` passes with 590 tests. There is no E2E suite, no CI, no deployment configuration beyond `platform/headers.ts` and the generated `dist/_headers`, and no about page.
- `.claude/launch.json` has `preview` (production build with headers, port 4173) and `dev` (port 5173). Browser timings on a desktop are recorded (Stage 4.7); timings from a hidden or background tab are not reliable.
- The MEXT workbook and explanation PDF are in `data/raw/mext/` (outside Git); content expansion needs them for `npm run data:extract` and `npm run data:verify-cooking`.
- Open questions this phase decides or must keep in view: 3 (evidence for the assumed error bands), 6 (2015 English edition), 7 and 8 (legal applicability, 要確認 for release), 9 and 13 (English and Spanish review), 10 (raw eggs and regional food safety), 11 and 12 (allergen lists), 16 (`i18next`/`react-i18next` pins), 17 (phone-class timing and the worker decision of ADR-030 D10), 21 (katakana long-vowel search). Other items carried from Phase 4: the about page (ADR-013, `docs/CONTENT_POLICY.md` §5), the engine taking longer inside the UI than when called alone (about 25 ms against 7 ms, Stage 4.7), per-ingredient values rounded to whole grams in the detail view (a finer breakdown needs an ADR), and the comparison caption scrolling with its table.

## Goal
Make the MVP releasable: the content set of about 60 recipes (ADR-023) authored and reviewed, an E2E suite on desktop and mobile in three locales, verified security headers and scans, CI, README, and a deployment runbook. `docs/SPEC.md` §15 acceptance criteria pass, and known risks and manual checks are listed. Deploying, creating accounts, or connecting external services happens only after the owner's explicit approval of that specific action.

## Working rules
- Work in stages. Each stage ends with checks, a Japanese summary (changed files, decisions, commands and results, 要確認, next stage), and a commit proposal with the full message and file list written in the message itself. Commit only after the owner approves that specific commit.
- At the start of the phase, re-check ADR-016 (the `i18next`/`react-i18next` pins; the next re-check is after 2026-10-25 18:00 UTC, "ADR-016 re-check before Phase 5" in `docs/DECISIONS.md`) and ADR-017 (TypeScript 7 support in `typescript-eslint`) and report. A dependency upgrade is its own commit.
- Every new dependency or tool (for example Playwright and its browsers, Wrangler, a secret scanner): verify the current stable version, peer ranges, install scripts, and downloads (ADR-016, ADR-018); record the decision with sources and the date in `docs/DECISIONS.md`. No external fonts, scripts, images, analytics, or services at runtime; the CSP stays `'self'` only.
- External services (CI, Cloudflare): verify current official documentation, limits, and prices, and mark anything unverified as 要確認. Do not create accounts, tokens, projects, or deployments without the owner's explicit approval. No secrets in the repository or in the browser bundle.
- Content: recipes are original (`docs/CONTENT_POLICY.md` §1); the recipe list is approved by the owner before texts and translations are written; every recipe follows the food safety, allergen, and health-expression rules; `en` and `es` are drafted by Claude and reviewed by the owner (ADR-007) with back-translations of safety-relevant texts. Nutrition snapshot changes are explained per recipe and approved.
- Engines: no behavior, formula, tolerance, band, threshold, or rounding change without an ADR and the owner's approval. Moving the recommendation to a worker (ADR-030 D10) is a UI change; it still needs the owner's decision.
- Verify UI changes in the browser preview (desktop and 375 px, three locales) and report what was and was not checked.

## Stages

### 5.1 Release plan (owner review before implementation)
Propose and wait for approval:
1. **Content expansion**: how many recipes to add toward about 60 and how they satisfy ADR-023 (goals, protein groups, quick share, fried share, adjustability); new foods and composition codes; batches and review points; how open questions 10, 11, and 12 are handled for the new content.
2. **E2E**: Playwright version, browsers, install and download review; projects for desktop and mobile in `ja`, `en`, and `es`; the flows and exceptional states covered; long Spanish strings and locale switching; keyboard and focus checks; axe in a real browser (including color contrast); how the suite runs against `npm run preview` with the production headers.
3. **Phone-class timing** (open question 17): CPU throttling profile, scenarios (full recommendation, re-suggestion, recalculation), and the threshold of ADR-030 D10; options if the threshold is exceeded (worker, or investigating why the engine is slower inside the UI).
4. **Security and privacy checks**: header and CSP verification in E2E, `npm audit` policy, secret scanning of the whole Git history before any release (tool and install review), license check of dependencies, and the privacy statement (no analytics, no storage except the locale preference).
5. **About page**: attribution (ADR-013), data versions, estimates and allergen disclaimers, what the app does not do (no medical advice, no allergen guarantee), and the localized texts.
6. **CI**: provider and plan (cost and limits 要確認), what runs (lint, type-check, tests, content validation, build, E2E), caching, and how the install-script policy applies; no deployment from CI unless approved.
7. **Deployment**: Cloudflare static assets (ADR-001) — the assets-only configuration that Stage 0.1 could not verify, SPA fallback for `/recipes/<id>`, `_headers`, cache rules for hashed assets; notes for other static hosts; the runbook. Nothing is deployed in this stage.
8. **Remaining items**: the katakana long-vowel search (open question 21), the comparison caption, the per-ingredient rounding question, and which open questions must be closed before release versus listed as known limitations.

### 5.2 Content expansion
1. Owner approval of the new recipe list and foods; composition extraction and cooking-rate transcription with checks (`docs/DATA_SOURCES.md`).
2. Recipes in batches with `ja`, `en`, and `es` texts, safety notes, allergen links, adjustment bounds, and sides; content validation; nutrition snapshot diffs explained and approved; `npm run eval:coverage` and the recommendation scenario snapshot re-run and explained.
3. Owner review of the English and Spanish texts (open question 13 and the new content), with back-translations of safety-relevant texts.

### 5.3 About page and remaining UI items
1. About page with the attribution, versions, disclaimers, and privacy statement in three locales; reachable from the header or footer; axe checks.
2. The approved remaining items from 5.1.8.

### 5.4 E2E suite and phone-class timing
1. Playwright projects for desktop and mobile in three locales: the full flow, every exceptional state, locale switching, long strings, keyboard operation and visible focus, reload and back navigation, deep links, and axe with color contrast.
2. Production headers and CSP checked on the served pages and bundles; no request leaves the origin.
3. Phone-class timing of a full recommendation, a re-suggestion, and a recalculation; record the numbers, the profile, and the date; apply the owner's decision on ADR-030 D10.

### 5.5 Security, dependency, and secret checks
1. `npm audit`, dependency licenses, and a secret scan of the whole history; findings and their handling recorded.
2. Re-check of `docs/CONTENT_POLICY.md` across all content and UI catalogs (forbidden expressions, allergen wording, presets as examples).

### 5.6 CI, README, deployment runbook
1. CI configuration as approved (no secrets; no deployment unless approved).
2. README (what the app is, local setup, commands, data handling, attribution, limitations) and the deployment runbook (Cloudflare first, other static hosts).

### 5.7 Release readiness
1. `docs/SPEC.md` §15 acceptance criteria checked one by one with evidence.
2. Known risks, manual checks, and open questions that remain as limitations, listed for the owner.
3. A deployment proposal (what, where, how to roll back) for the owner's explicit approval; the deployment itself happens only after that approval.

## Out of scope
- Features beyond the MVP (`docs/SPEC.md` §3), AI, accounts, server-side storage, analytics.
- Engine changes not approved with an ADR.
- Any deployment, account, token, or external service without the owner's explicit approval.

## Acceptance
- About 60 recipes meet ADR-023 and pass content validation; their texts are reviewed in three locales; snapshot changes are approved.
- The E2E suite passes on desktop and mobile in `ja`, `en`, and `es`, including every exceptional state, locale switching, keyboard operation, and axe with color contrast.
- Production headers and CSP are verified; `npm audit`, the license check, and the history secret scan are clean or their findings are handled.
- Phone-class timing is measured and the ADR-030 D10 decision is recorded.
- CI runs the agreed checks; README and the deployment runbook exist.
- `docs/SPEC.md` §15 criteria pass; known risks and manual checks are listed; deployment waits for the owner's approval.
