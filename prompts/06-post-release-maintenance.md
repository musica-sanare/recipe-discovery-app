# Prompt 06 — Phase 6: post-release maintenance

You are the lead engineer for Recipe Discovery. Read `CLAUDE.md` and every document under `docs/` (including `docs/UI_DESIGN.md`, `docs/DEPLOYMENT.md`, and `docs/RELEASE_READINESS.md`) before making changes. Phase 0 to Phase 5 results are in `docs/DECISIONS.md` ("Stage 0.1" to "Production deployment" logs; ADR-016, ADR-018, ADR-023, ADR-025, ADR-028, ADR-030; "Open questions"). Communicate with the owner in Japanese; write repository files in English.

## Starting point
- Branch `dev`; the MVP was deployed on 2026-10-24 from commit `66473f7` to https://recipe-discovery.musica-sanare.workers.dev (version `0f4696e0-d896-4626-b486-03c53d2cac1b`), recorded in `2de3807`, followed by the commit that adds this prompt. The owner creates branches and pushes.
- Content version `2026-10-24.3`: 60 recipes and 77 foods in `ja`, `en`, and `es`. `npm run check` (627 tests), `npm run test:e2e` (98 passed, 1 skipped), and CI pass.
- Remaining from Phase 5: the manual checks of `docs/RELEASE_READINESS.md` §4 items 1–3 and 5 (the owner reports the results), and open question 16 (`i18next`/`react-i18next` pins). On 2026-10-24 08:48 UTC both packages were still releasing (`i18next` 26.5.8 and `react-i18next` 17.1.6 at 05:5x UTC that day), so the earliest re-check is after 2026-10-26 05:53 UTC, and later if further releases follow.
- Known limitations this phase works on (`docs/RELEASE_READINESS.md` §3): egg- and soy-based recipes rarely meet the preset fat limits ("Stage 5.2 batch 1"); the assumed error bands (open question 3, `docs/NUTRITION_CALCULATION.md` §7); a full recommendation takes about 81 ms at a 4× CPU slowdown and grows with the library (ADR-030 D10, "Stage 5.4"); the English and Spanish texts the owner accepted without review (open questions 9 and 13: 20 validation recipes with 194 localized texts, 50 Phase 0 foods, 406 UI catalog keys outside `about.*`).
- gitleaks and Wrangler are not installed. When a stage needs them, reinstall them as in `docs/DEPLOYMENT.md` §3 and `docs/DECISIONS.md` "Stage 5.5": check the current version under ADR-016, the checksum, and the install scripts under ADR-018, in the session scratch directory outside the repository.
- The MEXT workbook and explanation PDF are in `data/raw/mext/` (outside Git).

## Goal
Make the released MVP more reliable and prepare it for a larger library, without new features: record the manual checks, update the pinned dependencies, make the recommendation fast enough for about 100 recipes without changing any result, review the remaining English and Spanish texts, improve the egg- and soy-based recipes, and research the evidence for the assumed error bands. A redeployment follows only after the owner's explicit approval.

## Working rules
- Work in stages. Each stage starts with the intended changes and affected files, and ends with checks, a Japanese summary (changed files, decisions, commands and results, 要確認, next stage), and a commit proposal with the full message and file list written in the message itself. Commit only after the owner approves that specific commit.
- A dependency upgrade is its own commit (ADR-016). New tools follow ADR-016 and ADR-018 and are recorded in `docs/DECISIONS.md` with sources and the date.
- Engines: no behavior, formula, tolerance, band, threshold, or rounding change without an ADR and the owner's approval (CLAUDE.md Part B, principle 5). A performance change must leave every engine output identical: the engine snapshot, the scenario snapshot, and the determinism and locale invariance tests pass without updates.
- Content: recipe changes follow `docs/CONTENT_POLICY.md`; the list of changed recipes and new foods is approved before texts are written; nutrition snapshot diffs are explained per recipe and approved; `en` and `es` are drafted by Claude and reviewed by the owner with back-translations of safety-relevant texts (ADR-007). Update `CONTENT_VERSION` with every content change.
- Verify UI changes in the browser preview (desktop width and 375 px, three locales) and report what was and was not checked.
- No deployment, account, token, or external service without the owner's explicit approval of that specific action.

## Stages

### 6.1 Manual checks and dependency re-check
1. Record the owner's results of `docs/RELEASE_READINESS.md` §4 items 1–3 and 5 there and in `docs/DECISIONS.md`; propose fixes for any finding (each fix is its own stage item with a browser check).
2. Re-check ADR-016 after the date above: if no release of `i18next` or `react-i18next` followed within 48 hours, move both to the latest versions together (peer ranges, install scripts, `npm audit`, `npm run check`, `npm run test:e2e`) as their own commit, and update ADR-016's list of exceptions. Otherwise record the new date. Also report the state of ADR-017 (TypeScript 7 support in `typescript-eslint`).

### 6.2 Recommendation speed (no change in results)
1. Profile a full recommendation in Node and in the browser (`npm run test:e2e:timing`) on the 60 recipes and on a synthetic library of about 100 recipes built for the measurement only (not published content).
2. Propose optimizations with their expected gain, for example work repeated per search (bundle conversion, per-recipe nutrition at default amounts, solver grids), caching keyed by recipe and state, or a narrower solver search that provably returns the same optimum. Wait for approval.
3. Implement the approved changes; every snapshot and determinism test passes unchanged. Record the new timings (1×, 4×, 6×) and, if the owner agrees, update ADR-030 D10 and `docs/ARCHITECTURE.md` §6. Target: a full recommendation of about 100 recipes within about 100 ms at 4×.

### 6.3 English and Spanish review
1. Propose review batches (for example safety notes and allergen texts first, then the validation recipes, the Phase 0 foods and aliases, and the UI catalogs) with the size of each.
2. Per batch: list the texts with Claude's findings (terminology against `content/glossary.ts`, neutral Spanish, regional aliases, consistency with batches 1–3) and back-translations of safety-relevant texts; the owner reviews; fixes are content or catalog changes only, with no change in calculated values.
3. Update open questions 9 and 13 and `docs/RELEASE_READINESS.md` §3.

### 6.4 Egg- and soy-based recipes
1. Report how each egg- and soy-based recipe fits the presets after adjustment and which ingredient drives the fat.
2. Propose changes per recipe (for example egg whites for part of the whole eggs, less cooking oil, leaner sides, wider adjustment bounds that still cook well, or a goal label that matches the best-fitting preset), new foods with composition codes and cooking rates, and the effect on ADR-023 composition. Wait for approval.
3. Implement as in Stage 5.2: extraction and transcription with checks, texts in three locales, safety notes, allergens, content validation, snapshot diffs explained and approved, `npm run eval:coverage` and the scenario snapshot re-run.

### 6.5 Evidence for the error bands (open question 3)
1. Research what the source tables and other primary sources say about the variation behind each band of `docs/NUTRITION_CALCULATION.md` §7 (for example the chapter 3 rates of change by cooking, the spread of Table 13 oil absorption and Table 14 fat change, and published measurements). Distinguish verified facts from assumptions; cite page numbers.
2. Report the findings with options (keep the bands and record the evidence; change a band with an ADR and the resulting snapshot diff). Nothing in the engine changes without the owner's approval.

### 6.6 Release
1. Release readiness for the new version: `docs/RELEASE_READINESS.md` updated, `npm run check`, `npm run test:e2e`, `npm audit`, and the history secret scan on the release commit; the phone-class timing re-run.
2. A redeployment proposal (commit, Wrangler version and its install scripts, rollback) for the owner's explicit approval; deploy and run the post-deployment checks of `docs/DEPLOYMENT.md` §3 only after that approval.

## Out of scope
- More recipes beyond the changes of 6.4 (Phase 7 candidate, after 6.2 and 6.3), features outside the MVP (`docs/SPEC.md` §3), opt-in storage, meal planning, shopping lists, AI, accounts, server-side storage, analytics.
- Engine behavior changes not approved with an ADR.
- Any deployment, account, token, or external service without the owner's explicit approval.

## Acceptance
- The manual check results are recorded and their findings are fixed or listed as limitations.
- ADR-016 is re-checked and the pins are updated or their next re-check is recorded.
- A full recommendation on a library of about 100 recipes takes about 100 ms or less at 4×, with every snapshot and determinism test unchanged.
- The remaining English and Spanish texts are reviewed, or the remaining part is listed with the owner's decision.
- The changed egg- and soy-based recipes pass content validation, their snapshot diffs are approved, and ADR-023 composition rules still hold.
- The evidence for each error band is recorded, and any change is approved with an ADR.
- `npm run check`, `npm run test:e2e`, and CI pass; a redeployment happens only after the owner's approval.
