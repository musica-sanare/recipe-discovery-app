# Prompt 19 — Phase 19: theme switch and polish

You are the lead engineer for Recipe Discovery. Read `CLAUDE.md` and every document under `docs/en/` and `docs/working/` before making changes. Phase 0 to Phase 18 results are in `docs/working/DECISIONS.md` (in particular ADR-016, ADR-030, ADR-035, ADR-036, ADR-037, ADR-039, ADR-041; "Phase 18 acceptance", "Releases by fast-forward", "Release 16 and sixteenth production deployment"; "Open questions"). Every locale requirement means four locales: `ja`, `en`, `es`, and `fr`. Communicate with the owner in Japanese; write repository files in English.

## Starting point
- Branch `dev` at `66ac39e` or later. Release 16 is deployed from `ef03259`, and `6e2ce04` (release 15) is the rollback target. A release is the owner's fast-forward of `main` to a `dev` commit that passed CI, which deploys ([DEPLOYMENT.md](../docs/en/DEPLOYMENT.md) §3). Claude never deploys, pushes, or runs Wrangler.
- Content version `2026-11-01.2`: 150 recipes and 139 foods in four locales. `npm run check` (65 test files, 1,050 tests), `npm run test:e2e` (227 passed, 1 skipped by design), and CI pass. The E2E guard accepts no CSP report.
- Startup chunk `index-*.js` 467.33 kB (gzip 142.72 kB), 32.7 kB below Vite's 500 kB warning (ADR-039). Only the locale catalogs are split off; every view is in the startup chunk.
- `i18next` 27 and `react-i18next` 18 are deferred under ADR-016 exception 2 until after 2026-11-09 14:25 UTC, as their own stage outside this phase. It changes the bundle, so report in Stage 19.1 whether it should come before Stage 19.4.
- The theme follows the OS setting: dark tokens sit under `@media (prefers-color-scheme: dark)` in `src/styles.css`, and `test/node/styles.test.ts` reads them from that block. Stored data today: the locale preference and the opt-in saved conditions (ADR-036).

## Findings to start from
- The owner asked for an in-app theme switch; it was left out of Phase 18 only because it needs a stored-data decision (ADR-041 D6). The owner skipped the display typeface because of its license work; it stays out.
- `src/views/ComparisonView.tsx` still shows the table of Phase 14: the value, the range, and the status as plain cells, without the nutrition bars of cards and the detail view.
- In the two-column detail view from `lg`, the ingredient table in the left column is narrower and scrolls sideways inside its region at 1024–1280 px; the fat column is cut at 1280 px (Stage 18.3).
- ADR-041's aim of shorter candidate cards was never measured under equal conditions: the screenshots of Stages 18.2 and 18.3 used different presets and device scales.
- The startup chunk has little room left for new features.

## Goal
Let users choose system, light, or dark; make the comparison view and the desktop ingredient table consistent with Phase 18; measure the card height; and win back room in the startup chunk; without changing any calculation, ranking, content, or meaning.

## Fixed constraints
- No engine, formula, rounding, fit status, ranking, content, food ID, or calculated value changes. Determinism, locale invariance, and every engine, scenario, solver-result, and digest snapshot stay unchanged. Every value, unit, estimate label, range, approximation reason, unknown value, and "just below the target" detail shown today stays visible ([NUTRITION_CALCULATION.md](../docs/en/NUTRITION_CALCULATION.md) §7–§9).
- Colors never carry meaning alone; allergen and safety notices keep their wording, icon, and look of their own (ADR-041 D2). Bars are drawn only from displayed numbers, stay decorative, and are hidden in forced colors and print.
- No allergen-safety or health wording changes; no health or efficacy claims. Every new string exists in four catalogs with typed keys.
- WCAG 2.2 AA in four locales and all three theme choices; `test/node/styles.test.ts` covers every token pair in both schemes. No horizontal page overflow at 320 and 375 px; forced colors and `prefers-reduced-motion` respected; print stays readable.
- CSP and headers unchanged (`'self'` only, no inline script or style element): anything that runs before the first paint must be a same-origin file. No external service, analytics, tracker, or cookie.
- Stored data: the theme choice is a new `localStorage` key and needs the owner's decision and an ADR; nothing leaves the browser. Choosing "system" stores nothing. Every access is wrapped as in `src/i18n/localePreference.ts`, and the app works when storage fails. The about page's privacy text is updated in four locales.
- No new dependency unless the owner approves it under ADR-016. No web font.
- No JavaScript chunk loaded at startup exceeds Vite's 500 kB warning; report raw and gzip sizes of every changed chunk and asset. A view loaded later has a loading and a failure state like the locale chunks (ADR-039), and the phone-class timing threshold of ADR-030 D10 holds.

## Working rules
- Work in stages. Each stage starts with the intended changes and affected files, and ends with checks, a Japanese summary (changed files, decisions, commands and results, 要確認, next stage), and a commit proposal with the full message and file list written in the message itself. Commit only after the owner approves that specific commit; check the current branch before every commit, because other sessions and the owner may share this checkout.
- Verify current official documentation (Tailwind CSS v4 `@custom-variant`, CSS `color-scheme`, React `lazy`, Vite code splitting) before relying on it; record the source and the date checked in `docs/working/DECISIONS.md`; mark anything unverified as 要確認.
- Verify every UI change in the browser at 320 px, 375 px, and desktop width, in light and dark mode, in at least `ja` and `fr`, in Chromium and WebKit (a WebKit-only layout bug reached production in release 15). Share screenshots and report what was and was not checked. Playwright screenshots in WebKit trigger a CSP report of their own ("Release 16 and sixteenth production deployment").
- Measure `npm run test:e2e:timing` against release 16 when a stage changes startup or rendering cost.
- Every change to `docs/en/` updates `docs/ja/` and its source line in the same commit.

## Stages

### 19.1 Direction (owner review before implementation)
Propose and wait for approval:
1. **Theme switch**: where the control sits at 320 px and on desktop (the header already wraps in `fr`), its labels and accessible name in four locales, the storage key, and how the stored choice applies before the first paint without an inline script (a classic same-origin script in `<head>` against applying it in `src/main.tsx`), with the flash measured and the cache rule of a non-hashed file stated. How the dark tokens apply to both the OS setting and the choice without two copies drifting apart, and how the contrast test reads them. Give the ADR text, revising ADR-041 D6 and ADR-030 D9.
2. **Comparison view**: a mockup with the nutrition bars at 375 px and desktop, in light and dark mode, and the target bounds it would show.
3. **Desktop ingredient table**: two or three options (for example a column ratio, a wider page, a full-width table below the two columns, or fewer visible columns) with trade-offs.
4. **Card height**: measure release 14 against the current build with the same preset, locale, and width; report the result, and propose changes only if the cards did not get shorter.
5. **Bundle**: what the startup chunk contains and what could load later (for example the comparison, shopping list, and about views), the expected saving, and a target, with the risk to the first view and the order relative to `i18next` 27.
6. The order of the following stages and what is left out.

### 19.2 Theme switch
The approved control, storage, and early application; the ADR; the contrast test; unit, UI, and E2E tests (the three choices, a reload, storage failure, a change of the OS setting while on "system", and the stored keys); the about page text; [UI_DESIGN.md](../docs/en/UI_DESIGN.md) §5 and [SPEC.md](../docs/en/SPEC.md) §3 and §13 with their translations.

### 19.3 Comparison view and ingredient table
The approved layouts with tests and screenshots; UI_DESIGN §3.3 and §3.4 with the translation.

### 19.4 Startup chunk
The approved splitting with loading and failure states in four locales, E2E tests for a failed chunk, sizes, and timing against release 16; [ARCHITECTURE.md](../docs/en/ARCHITECTURE.md) and an ADR if the loading model changes.

### 19.5 Release 17
1. Release readiness as for release 16 ([RELEASE_READINESS.md](../docs/working/RELEASE_READINESS.md)): `npm ci`, `npm run check`, `npm run test:e2e`, `npm audit`, the phone-class timing, and the secret scan.
2. The owner fast-forwards `main` to the release commit after CI passes, which deploys; Claude runs the post-deployment checks of [DEPLOYMENT.md](../docs/en/DEPLOYMENT.md) §3 on both URLs plus the three theme choices in `ja` and `fr` at 375 px in production, and records release 17.

## Out of scope
- A display typeface or any web font (owner, 2026-11-08).
- New features beyond these, new recipes or foods, engine changes, and any change to calculated values or ranking.
- `i18next` 27 and `react-i18next` 18 (their own stage), and AI features of any kind.
- External services, analytics, accounts, deployments, and any Cloudflare or GitHub setting change.

## Acceptance
- The owner's decisions of 19.1 are recorded, with an ADR for the stored theme choice.
- Users can choose system, light, or dark in four locales; the choice survives a reload and applies without a visible flash; "system" stores nothing; the app works when storage fails.
- The comparison view and the desktop ingredient table follow the approved layouts, with no value or text lost.
- The card height is measured and recorded; the startup chunk meets the approved target and stays under 500 kB.
- Calculations, rankings, snapshots, and every shown value, range, and note are unchanged; CSP and headers are unchanged.
- Accessibility checks pass in four locales and every theme choice; `npm run check`, `npm run test:e2e`, and CI pass; release 17 is deployed only by the owner's fast-forward of `main`.
