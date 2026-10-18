# Prompt 02 — Phase 2: nutrition engine

You are the lead engineer for Recipe Discovery. Read `CLAUDE.md` and every document under `docs/` before making changes. Phase 0 and Phase 1 results are in `docs/DECISIONS.md` ("Stage 0.1" to "Stage 1.5" logs; ADR-011, ADR-022, and ADR-024 to ADR-027; "Open questions"). Communicate with the owner in Japanese; write repository files in English.

## Starting point
- Branch `dev`; Phase 1 ended with commit `64b4c2b` ("docs: record Phase 1 completion"). The owner creates branches and pushes.
- `domain/nutrition/calculate.ts` is the minimal Phase 0 calculation: (c4), (c5), notation handling (unmeasured is `null`, never zero), `includedIn`, and two approximation reasons (`cooking_not_tabulated`, `post_cooking_refuse`). It reads the full source subset (`data/composition/`). `test/node/nutrition.test.ts` holds the hand cross-checks, the locale invariance test, and the per-serving snapshot of all 20 recipes, unchanged since Phase 0.
- The browser receives the calculation bundle (`shared/bundle.ts`, ADR-027): five nutrients (`ENERC_KCAL`, `PROT-`, `FAT-`, `CHOCDF-`, `NACL_EQ`) with notations, the refuse rate, weight change rates with `postCookingRefuse` as a flag only, and recipes without texts. `tools/content/bundle.ts` builds it in memory; `tools/content/bundle.test.ts` shows that the bundle gives the same totals as the source data.
- Amount semantics (ADR-024, ADR-026, `docs/NUTRITION_CALCULATION.md` §10): adjustable ingredients (`grams` grid or `count` whole units), `linkedTo` scaling, sides that are switched off (0 g for the side and its linked ingredients). `tools/evaluate-coverage.ts` has an evaluation-only version of this (`resolve`).
- The MEXT workbook in `data/raw/` is needed only when foods are added; this phase should not need it. If a session runs where `data/raw/` is absent and the workbook is needed, ask the owner.

## Goal
Make `domain/nutrition` the complete, pure, deterministic, locale-free nutrition engine that the browser and the build tools share: amounts for a recipe state, per-ingredient and per-serving values, uncertainty classes, ranges, incompleteness, display rounding, and the traceable basis of every value. It replaces the Phase 0 calculation. Do not build target fit, recommendation, the adjustment solver, or UI in this phase.

## Working rules
- Work in stages. Each stage ends with checks, a Japanese summary (changed files, decisions, commands and results, 要確認, next stage), and a commit proposal with the full message and file list. Commit only after the owner approves that specific commit.
- At the start of the phase, re-check ADR-016 (pinned `i18next`/`react-i18next`; the burst versions may now be safe to adopt) and ADR-017 (TypeScript 7 support in `typescript-eslint`) and report. A dependency upgrade is its own commit.
- Changing a formula, a source column, a rounding rule, or an error band needs the owner's approval and an ADR (CLAUDE.md Part B, principle 5). Record new facts and measurements in `docs/DECISIONS.md` with the date.
- Nutrition snapshot changes are never accepted silently: explain every difference per recipe and nutrient and get the owner's approval.
- The engine takes no locale and imports nothing from `src/`, i18n, `tools/`, or platform code (lint boundaries). Keep it fast enough to recalculate on every user change.

## Stages

### 2.1 Engine design proposal (owner review before implementation)
Propose the API and types, and wait for approval:
1. **Input**: the calculation bundle data (or an adapter that turns it into the engine's lookup maps) and a recipe state: servings, sides switched off, and chosen amounts for adjustable ingredients.
2. **Output**: per ingredient (resolved grams, effective grams, code, state, cooking, counted or not, class, reasons, notations, amounts, band), totals, per serving, ranges, incompleteness (which ingredients have unmeasured values for which nutrient), and the basis (food codes, data versions, cooking states, assumptions).
3. **Reasons and classes**: split `cooking_not_tabulated` into "raw value used" and "related cooked value used" so the two error bands of `docs/NUTRITION_CALCULATION.md` §7 can apply (open question 15). List every reason with its class (exact, approximation, hard to estimate) and its band.
4. **Decisions to propose, each with options and a recommendation**:
   - Where substitutions are applied: in this phase's amount resolution, or in Phase 3 as planned.
   - The factor for "energy from fat" in the fried and slow-frying bands (for example 9 kcal/g); state that it is an assumption.
   - Whether estimated `( )` values and trace values of displayed nutrients count as an approximation reason or only as flags (no error band is defined for them yet).
   - Whether a household measure such as "a pinch" makes an ingredient hard to estimate, given that recipes state grams.
   - How the tools (`evaluate-coverage`, the composition report, snapshot tests) obtain engine input: from the in-memory bundle, so that they test exactly what the browser uses.

### 2.2 Amount resolution
1. A pure function from recipe and state to grams per ingredient: servings scaling, sides switched off, links (amount = default × leader amount / leader default), whole units, and rejection of amounts outside the authored bounds or off the grid with a typed error.
2. Tests for every rule, including an ingredient linked to a leader in a side that is switched off, a counted ingredient, servings changes, and invalid states.

### 2.3 Calculation and uncertainty
1. (c4), (c5), notation handling, `includedIn`, and the reasons and classes approved in 2.1.
2. Ranges per `docs/NUTRITION_CALCULATION.md` §7: per-ingredient error bands by reason, summed per nutrient; a range is reported as shown when wider than twice the display unit (20 kcal; 2 g for protein, fat, and carbohydrate).
3. Incompleteness: a nutrient with any unmeasured counted value is unknown for the recipe, with the ingredients listed; never treated as zero.
4. Tests against hand-calculated values for each formula, reason, band, and threshold, and for unmeasured values.

### 2.4 Display rounding and basis
1. Rounding helpers (ADR-025): kcal to the nearest 10, protein, fat, and carbohydrate to whole grams, salt to 0.1 g; values stay full precision internally. No locale formatting here (that is UI).
2. Basis data for the detail view: per ingredient the food ID, code, state, cooking method, data version, class, reasons, and assumptions (counted oil per ADR-022, absorbed oil, removal after cooking).

### 2.5 Snapshots, locale invariance, determinism, performance
1. Snapshot of all recipes at default state: per-serving point values, ranges, classes, and incompleteness. Explain every difference from the Phase 0 snapshot; get approval.
2. Locale invariance: the engine signature has no locale (type-level), and a test calculates every recipe with the calculation bundle while each text bundle is loaded, giving identical results.
3. Determinism: the same input gives the same output (deep equality across runs and input orderings where order should not matter).
4. Measure the time of one recalculation and of all recipes at default state; record the numbers, the machine, and the date in `docs/DECISIONS.md`.

### 2.6 Migration of consumers
Switch `tools/evaluate-coverage.ts`, `tools/content/composition-report.ts`, and the tests to the new engine; remove the Phase 0 calculation and the evaluation-only amount resolution. `npm run eval:coverage` and `npm run report:composition` must keep working; explain any change in their output.

## Out of scope
- Target fit (met, near, not met), "near / uncertain" for ranges that straddle a target, tolerance, ranking, diversification, the adjustment solver, and relaxation suggestions (Phase 3).
- UI, locale formatting, and household unit labels (Phase 4).
- Authoring the remaining recipes (decided with the owner before Phase 5).
- Any deployment, external service, or AI.

## Acceptance
- Amount resolution, formula, notation, uncertainty, range, rounding, locale invariance, and determinism tests pass.
- The snapshot of all recipes is reviewed and approved by the owner, with every difference from Phase 0 explained.
- Recalculation time is measured and recorded.
- `npm run check` (lint, type-check, tests, content validation, build) passes.
