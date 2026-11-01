# Prompt 16 — Phase 16: Polish and bundle size

You are the lead engineer for Recipe Discovery. Read `CLAUDE.md` and every document under `docs/en/` and `docs/working/` before making changes. Phase 0 to Phase 15 results are in `docs/working/DECISIONS.md` (in particular ADR-030 D9 and D10, ADR-033, ADR-034, ADR-036, ADR-037, ADR-038; "Bundle-size warning accepted"; "Phase 14 acceptance"; "Phase 15 acceptance"; "Release 12 and twelfth production deployment"; "Open questions"). Every locale requirement means four locales: `ja`, `en`, `es`, and `fr`. Communicate with the owner in Japanese; write repository files in English.

## Starting point
- Branch `dev`; release 12 (Phase 15, French-speaking cuisines) was deployed on 2026-11-01 by Workers Builds from `cc1bf80`, merged into `main` as `4a265dd`; `dc0f099` (release 11) is the rollback target. The owner pushes, merges `dev` into `main` by hand, and a merge into `main` deploys ([DEPLOYMENT.md](../docs/en/DEPLOYMENT.md) §3). Claude never deploys and never runs Wrangler.
- Content version `2026-11-01.2`: 150 recipes and 139 foods in four locales. `npm run check` (1,003 tests), `npm run test:e2e` (164 passed, 1 skipped), and CI pass.
- Bundle: one JavaScript bundle of 568,294 bytes (release 12) that holds all four UI catalogs (`src/i18n/resources.ts` imports `src/i18n/messages/{ja,en,es,fr}.ts`), the free-text word lists of every locale (`shared/freeText/lexicon.ts`), and the icon and illustration data; Vite warns above 500 kB. The owner accepted the warning in release 8 and named per-locale loading as a later option ("Bundle-size warning accepted"). Content text bundles are already per locale (`text-<locale>-*.json`); the calculation bundle is shared.
- Open after Phase 14: no logo in the header (not in the ADR-037 icon list); the detail view's nutrition stays a list while candidate cards use colored nutrient tiles ("Phase 14 acceptance").
- Speed: a full recommendation takes about 61–64 ms median and about 68–73 ms p90 at a 4× CPU slowdown on 150 recipes ("Release 12 preparation"); the ADR-030 D10 threshold is about 100 ms p90 at 4×.
- Maintenance: open question 22 (`minimatch`) and ADR-017 (TypeScript 7 support in `typescript-eslint`) are re-checked at the start of the phase; ADR-016 applies to every dependency.

## Goal
Load only the UI catalog and free-text word list of the active locale so the startup bundle drops below Vite's 500 kB warning, add an original logo to the header, and show the detail view's nutrition as tiles consistent with the candidate cards, without changing any calculation, ranking, content, or stored data. A release follows only after the owner's merge into `main`.

## Fixed constraints
- No engine, formula, rounding, fit status, ranking, content, food ID, or saved-record change; determinism, locale invariance, and every engine, scenario, solver-result, and digest snapshot stay unchanged.
- Per-locale loading: the first render shows the stored or detected locale without a flash of another language or of message keys; switching the language keeps today's behavior (same view, same values, `lang` updated) with a loading state if the catalog is not yet loaded; a failed catalog load shows the existing retry state. No runtime fallback to another locale for missing keys: catalogs stay complete in four locales (type check and tests). The CSP and the security headers stay as they are (`'self'` only); new chunks are same-origin assets with the immutable cache rule.
- The logo is original SVG drawn in the repository under ADR-037 (two-tone, `currentColor` or tokens, no text inside the SVG, readable in light, dark, and forced colors); the product name stays HTML text. No third-party artwork or fonts.
- Nutrition tiles in the detail view keep every value, unit, estimate label, range, approximation reason, and "just below the target" detail of today ([NUTRITION_CALCULATION.md](../docs/en/NUTRITION_CALCULATION.md) §7–§9); colors are never the only carrier of meaning; the token contrast test covers every new pair.
- Accessibility stays at WCAG 2.2 AA in four locales (axe-core in jsdom and real browsers), no horizontal overflow at 320 and 375 px, reduced motion respected.
- No new dependency unless the owner approves it under ADR-016.

## Working rules
- Work in stages. Each stage starts with the intended changes and affected files, and ends with checks, a Japanese summary (changed files, decisions, commands and results, 要確認, next stage), and a commit proposal with the full message and file list written in the message itself. Commit only after the owner approves that specific commit; check the current branch before every commit.
- Verify current official documentation (Vite code splitting and `import()`, i18next and react-i18next resource loading) before relying on it; record the source and the date checked in `docs/working/DECISIONS.md`; mark anything unverified as 要確認.
- Report the JavaScript chunk sizes (raw and gzip) after each stage and measure `npm run test:e2e:timing` against release 12 in the same session (alternating, 1×, 4×, and 6×, median and p90). Startup and language switching are measured as well if the stage changes them.
- Verify UI changes in the browser (desktop width and 375 px, light and dark, at least `fr` and `ja`) and report what was and was not checked.
- Every change to `docs/en/` updates `docs/ja/` and its source line in the same commit.

## Stages

### 16.1 Plan (owner review before implementation)
Propose and wait for approval:
1. **Per-locale loading**: the split (UI catalog per locale, free-text lexicon per locale, possibly the icon data), how the first locale is chosen and loaded before the first render, the loading and failure states, the effect on the E2E suite and the timing tests, and the expected chunk sizes. Options with trade-offs (for example a dynamic `import()` per locale before rendering versus i18next lazy backends) and a recommendation; the ADR text (revising ADR-030 and closing "Bundle-size warning accepted").
2. **Logo**: two or three original directions as local mockups in light, dark, and forced colors at header size, with a recommendation.
3. **Detail nutrition tiles**: a mockup of the detail view at 375 px and desktop width showing how ranges, approximation notes, and the target comparison fit the tiles.

### 16.2 Per-locale loading
Implementation with tests (first render per locale, switching, failure and retry, no message keys shown), E2E updated, chunk sizes and timing reported; [ARCHITECTURE.md](../docs/en/ARCHITECTURE.md) and its translation.

### 16.3 Logo and detail nutrition tiles
Implementation with tests and screenshots; [UI_DESIGN.md](../docs/en/UI_DESIGN.md) and its translation; contrast test extended.

### 16.4 Release 13
1. Release readiness as for release 12 ([RELEASE_READINESS.md](../docs/working/RELEASE_READINESS.md)): `npm ci`, `npm run check`, `npm run test:e2e`, `npm audit`, the phone-class timing with release 12 measured alongside, and the secret scan.
2. The owner approves and merges `dev` into `main`, which deploys; Claude runs the post-deployment checks of [DEPLOYMENT.md](../docs/en/DEPLOYMENT.md) §3 plus a cold load in `fr` and a language switch in production, and records release 13.

## Out of scope
- New features, recipes, or foods; engine changes; the custom domain and the repository publication (Phase 17).
- Any deployment, account, token, or external service.

## Acceptance
- The owner's decisions of 16.1 are recorded with an ADR; no JavaScript chunk loaded at startup exceeds Vite's 500 kB warning, or the owner has accepted the remaining size.
- Calculations, rankings, snapshots, and stored data are unchanged; the first render and language switching work in four locales without message keys or another language flashing.
- The header shows the original logo; the detail view shows nutrition tiles with every value, range, and note of today.
- Accessibility checks pass in four locales; `npm run check`, `npm run test:e2e`, and CI pass; release 13 is deployed only by the owner's merge into `main`.
