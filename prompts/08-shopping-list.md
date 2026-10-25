# Prompt 08 — Phase 8: shopping list

You are the lead engineer for Recipe Discovery. Read `CLAUDE.md` and every document under `docs/en/` and `docs/working/` before making changes. Phase 0 to Phase 7 results are in `docs/working/DECISIONS.md` (in particular ADR-015, ADR-026, ADR-029, ADR-030; "Stage 7.1 expansion plan" to "Phase 7 acceptance"; "Open questions"). Communicate with the owner in Japanese; write repository files in English.

## Starting point
- Branch `dev`; release 3 was deployed on 2026-10-25 from commit `c3b4911` (version `992ce5ff-56e4-4cf3-85d8-7b8ff6f37ab5`), recorded in `26a18f0`, followed by the commit that adds this prompt. The owner creates branches and pushes.
- Content version `2026-10-25.2`: 86 recipes and 94 foods in `ja`, `en`, and `es`. `npm run check` (643 tests), `npm run test:e2e` (98 passed, 1 skipped), and CI pass.
- `docs/en/SPEC.md` §3 lists shopping lists as outside the MVP. The app stores nothing but the locale preference (ADR-015, ADR-030 D9); recipe state (servings, adjusted amounts, sides, substitutions) lives in the session only.
- Speed: a full recommendation takes about 82 ms at a 4× CPU slowdown (p90 about 93 ms) against the ADR-030 D10 threshold of about 100 ms. This phase adds no recipes; any new computation must stay off the recommendation path.
- Open maintenance outside this phase: the ADR-016 re-check of `i18next` and `react-i18next` (not before 2026-10-26 12:40 UTC, open question 16); it may be done between stages as its own commit and redeployment. The optional iPhone check of release 3 (`docs/working/RELEASE_READINESS.md` §4) may be reported by the owner at any time.
- Tools: gitleaks and Wrangler were installed in an earlier session's scratch directory and are not available to a new session; reinstall them as described in `docs/en/DEPLOYMENT.md` and `docs/working/DECISIONS.md` "Stage 5.5" and "Stage 6.6" (versions, checksums, install scripts) only after the owner approves the downloads.

## Goal
Let a user turn one or more recipes into a shopping list in `ja`, `en`, and `es`: the amounts follow each recipe's current state (servings, adjusted amounts, sides switched on or off, substitutions), the same food is combined deterministically across recipes, and the list can be checked off, copied as text, or printed, without accounts, server-side storage, or external services. A release follows only after the owner's explicit approval.

## Working rules
- Work in stages. Each stage starts with the intended changes and affected files, and ends with checks, a Japanese summary (changed files, decisions, commands and results, 要確認, next stage), and a commit proposal with the full message and file list written in the message itself. Commit only after the owner approves that specific commit.
- Keep the layers separate: the aggregation is a pure, deterministic, locale-free module (no locale parameter, like `domain/nutrition`); names, units, and formatting come from the content texts and UI catalogs; the UI only calls the module and renders. Nutrition values and the recommendation engine stay unchanged.
- No new storage, cookies, analytics, or external services unless the owner approves an ADR that states the purpose and privacy impact (ADR-015). Clipboard and print are user-initiated browser features and send nothing.
- New UI strings in three locales with typed keys; `en` and `es` are drafted by Claude and reviewed by the owner with a review sheet, as in Stages 6.3 and 7.2; Spanish follows `docs/en/CONTENT_POLICY.md` §6.
- Allergen and food safety statements keep their current rules: the list makes no allergen or safety claims of its own.
- Verify UI changes in the browser preview (desktop width and 375 px, three locales) and report what was and was not checked. Measure `npm run test:e2e:timing` before release to show that the recommendation path did not slow down.
- No deployment, account, token, or external service without the owner's explicit approval of that specific action.

## Stages

### 8.1 Design (owner review before implementation)
Propose and wait for approval:
1. **Scope change**: the `docs/en/SPEC.md` §3 change and a new ADR for the shopping list.
2. **Entry points**: from which views recipes are added (detail view, comparison, candidate cards), how many recipes, and how the list shows which recipes and servings it came from.
3. **Amounts and combination rules**: which amount is listed (the authored food and state, with grams after scaling, adjustment, sides, and substitutions); how the same food in different states is combined or kept apart (for example cooked rice and dry pasta, raw and canned tomatoes); household measures; rounding for display only; ingredients counted as "included in" another value (cooking oil in stir-fried values) and frying oil.
4. **Pantry items**: whether seasonings and oils are listed, marked as "you may already have", or optional; the deterministic rule that decides it (for example the ingredient role).
5. **Persistence and privacy**: session only (recommended default), or an opt-in local storage with an ADR (ADR-015, ADR-030 D9); what happens on reload and on language change.
6. **Output**: checklist on screen, copy as text, print styles; the exact text format in three locales; no sharing service.
7. **UI**: views and navigation, accessibility (checkboxes, live regions, focus), empty and error states, and the `docs/en/UI_DESIGN.md` changes.

### 8.2 Domain module
The aggregation module with unit tests (combination rules, scaling, sides, substitutions, ordering, determinism, locale independence) and a snapshot over representative selections of the repository recipes.

### 8.3 UI and localization
Views, catalogs in three locales, copy and print, accessibility checks (axe in three locales), E2E on desktop and mobile in three locales; owner review of the English and Spanish strings; browser check.

### 8.4 Release 4
1. Release readiness: `docs/working/RELEASE_READINESS.md` for release 4, `npm ci`, `npm run check`, `npm run test:e2e`, `npm audit`, the phone-class timing, and the history secret scan on the release commit (tools reinstalled after the owner approves the downloads).
2. A deployment proposal (commit, Wrangler version and its install scripts, rollback to release 3) for the owner's explicit approval; deploy and run the post-deployment checks of `docs/en/DEPLOYMENT.md` §3 only after that approval.

## Out of scope
- Prices, stores, package sizes or purchase units (no data source), stock tracking, meal planning, accounts, server-side storage, sharing services, analytics, AI.
- Changes to nutrition calculation, the recommendation engine, or the recipe content, except text fixes the owner approves.
- Any deployment, account, token, or external service without the owner's explicit approval.

## Acceptance
- The approved ADR and `docs/en/SPEC.md` change are recorded; the aggregation module is deterministic and locale-free and covered by tests and a snapshot.
- A user can build a list from the approved entry points, check items off, copy it, and print it in `ja`, `en`, and `es` on desktop and mobile; new strings are reviewed in three locales; accessibility checks pass.
- Nutrition snapshots and the recommendation scenario snapshot are unchanged; a full recommendation stays within about 100 ms at 4×.
- `npm run check`, `npm run test:e2e`, and CI pass; release 4 is deployed only after the owner's approval.
