# Prompt 03 — Phase 3: recommendation engine

You are the lead engineer for Recipe Discovery. Read `CLAUDE.md` and every document under `docs/` before making changes. Phase 0 to Phase 2 results are in `docs/DECISIONS.md` ("Stage 0.1" to "Stage 2.6" logs, "Phase 2 acceptance"; ADR-009, ADR-023 to ADR-028; "Open questions"). Communicate with the owner in Japanese; write repository files in English.

## Starting point
- Branch `dev`; Phase 2 ended with commit `1267ac9` ("docs: record Phase 2 completion"). The owner creates branches and pushes.
- `domain/nutrition` is the complete nutrition engine (ADR-028): `resolveAmounts` and `calculateNutrition(recipe, state, data)` with a `RecipeState` (servings, sides switched off, chosen amounts, substitutions), per-serving values, per-serving ranges with a "shown" flag, classes, reasons, incompleteness, `roundForDisplay`, and `nutritionBasis`. One recalculation takes about 0.02 ms in Node (Stage 2.5).
- Engine input comes from the calculation bundle (`engineDataFromBundle`); tools and repository tests use `tools/content/repository.ts`.
- `tools/evaluate-coverage.ts` is an evaluation-only version of fit and adjustment: provisional presets, tolerance (±10 %, protein −3 g), a full grid search over adjustable ingredients and solver-removable sides, the best status first and then the smallest relative change. It uses point values only, not ranges.
- Relevant rules: target fit and tolerance (`docs/NUTRITION_CALCULATION.md` §9, ADR-025), bounded adjustment and sides (§10, ADR-024, ADR-026), ranking and re-suggestion (`docs/SPEC.md` §5, §6, §8, §12), allergens (ADR-008, `docs/CONTENT_POLICY.md` §2), discovery-first ranking and required ingredients (ADR-009), library composition (ADR-023).

## Goal
Build `domain/recommendation`: a pure, deterministic, locale-free engine that turns validated user targets and conditions into 3–5 diverse candidates with fit status, adjusted amounts, and reason data, plus re-suggestion, relaxation suggestions, and contradiction checks. It calls `domain/nutrition` and nothing in `src/`, i18n, `tools/`, or platform code. Do not build UI, message texts, or locale formatting in this phase.

## Working rules
- Work in stages. Each stage ends with checks, a Japanese summary (changed files, decisions, commands and results, 要確認, next stage), and a commit proposal with the full message and file list shown in the message itself. Commit only after the owner approves that specific commit.
- At the start of the phase, re-check ADR-016 (pinned `i18next`/`react-i18next`; open question 16) and ADR-017 (TypeScript 7 support in `typescript-eslint`) and report. A dependency upgrade is its own commit.
- Fit status is always evaluated on full-precision values and ranges, never on rounded ones (§8). Changing tolerance, presets, a band, or a threshold needs the owner's approval and an ADR.
- Changes to the nutrition engine are allowed only when the recommendation engine needs them; they keep the Phase 2 snapshot unchanged or explain every difference for approval.
- Reason data are typed codes and numbers (for example "meets the protein target with the lowest fat among the candidates"); texts come from the UI catalogs in Phase 4. No health or efficacy wording anywhere (`docs/CONTENT_POLICY.md` §4).
- Measure performance with the real recipes and with a synthetic library of about 60 recipes (ADR-023) and record the numbers, the machine, and the date in `docs/DECISIONS.md`.

## Stages

### 3.1 Design proposal (owner review before implementation)
Propose the API and types, and wait for approval:
1. **Input**: targets (preset or custom: kcal range, protein minimum, fat maximum, optional carbohydrate range), servings, conditions (maximum time, effort, cuisine preferences, excluded ingredients, allergen exclusion, equipment, required ingredients), recipes already shown or excluded in the session, and a re-suggestion seed. Validation errors as typed values.
2. **Output**: candidates with status per nutrient and overall, the chosen recipe state (adjusted amounts, sides), the nutrition result, the change from the default amounts, and reason data; "close alternatives" when fewer than 3 meet the targets; per-constraint exclusion counts and relaxation options with resulting counts; contradiction results.
3. **Decisions to propose, each with options and a recommendation**:
   - Status per nutrient from a range: inside and the range shown → met only if the whole range is inside; straddling a bound → near (§9); how a range that is not shown is treated.
   - A nutrient that is unknown (unmeasured value) for a recipe: never "met"; whether it is "near", "not met", or a separate "unknown" status.
   - Overall status and tiers from per-nutrient statuses, including the optional carbohydrate range.
   - Solver: search space (grid and sides, as in the evaluation tool, or a smarter search with the same result), objective (best tier, then smallest relative change; definition of the change), tie-breaking, whether ranges are part of the objective, and whether substitutions are ever chosen by the solver (recommendation: no; the user chooses them).
   - Diversification: the attributes (main protein group, cuisine, cooking method — recipes have no authored cooking method yet; derive it or add it to the content schema), the selection rule (for example greedy maximal difference with a stable order), and the role of soft preferences (effort, cuisine) and their weights.
   - Seeded re-suggestion: the pseudo-random generator, seed handling, and how "show a different type" and "exclude this one" interact with the shown set; the state stays in memory (no storage, no URLs; ADR-015).
   - Hard filters: excluded ingredients and required ingredients against substitutions (an excluded ingredient that a substitution can replace), allergens with `unknown` and `may_contain` (always excluded, ADR-008), equipment and time with substitutions that change minutes.
   - Relaxation suggestions: which constraints are relaxed (time, effort, a required or excluded ingredient, an allergen is never relaxed automatically), how counts are computed, and their order.
   - Contradiction checks before searching (for example a protein minimum whose energy alone exceeds the kcal maximum; carbohydrate and kcal ranges that cannot both hold) and their thresholds.
   - Fried dishes with wide ranges (open question 18): confirm that they become "near" rather than "met" by design, or propose an alternative for the owner.

### 3.2 Input validation, hard filters, contradiction checks
1. Typed validation of targets and conditions; contradiction checks as approved.
2. Hard filters with per-constraint exclusion counts.
3. Tests for every rule, including allergens with unknown data, required ingredients that leave no recipe, and contradictory targets.

### 3.3 Fit evaluation
1. Per-nutrient and overall status from point values and ranges, tolerance, unknown nutrients.
2. Tests at every boundary (exactly on a bound, inside tolerance, outside, a range straddling a bound, full precision versus rounded display).

### 3.4 Bounded adjustment solver
1. The approved search and objective on top of `calculateNutrition`; sides only when `solverMayRemove`; whole units; linked ingredients through the nutrition engine.
2. Tests: bounds, steps, whole units, linked ingredients, sides, minimal change, ties, determinism, no in-bounds solution (closest solution as "near" with the remaining gaps).
3. Compare with `npm run eval:coverage` on the 20 recipes and explain every difference (ranges now count).

### 3.5 Ranking, diversification, re-suggestion
1. Tiers, diversification, preferences, stable ordering, seeded "show a different type", "exclude this one".
2. Tests: ties, the same input and seed give the same candidates and order, different seeds give reproducible different sets, shown recipes are not repeated until the pool is exhausted.

### 3.6 Few or no candidates, relaxation, reason data
1. Close alternatives with the unmet gaps; relaxation options with resulting counts; reason data for candidates and exclusions.
2. Tests: empty pool, fewer than 3, relaxation counts recomputed exactly, no allergen relaxation.

### 3.7 Integration, performance, acceptance
1. Scenario tests with the 20 recipes (the eight scenarios of Stage 0.6 and the personas of `docs/SPEC.md` §2); locale invariance (no locale in any signature; identical results with each text bundle).
2. Switch `tools/evaluate-coverage.ts` to the recommendation engine, or retire it with the owner's approval; explain any change in its output.
3. Measure a full recommendation and a "show a different type" with the 20 recipes and a synthetic 60-recipe library; record the results.

## Out of scope
- UI, message templates and texts, locale formatting, household unit labels, browser storage (Phase 4).
- Authoring the remaining recipes toward about 60 (decided with the owner before Phase 5); a synthetic library for performance tests only is allowed and is never shipped.
- Any deployment, external service, analytics, or AI.

## Acceptance
- Determinism and edge-case tests pass: empty, few, ties, contradictions, required ingredients, allergens with unknown data (`docs/IMPLEMENTATION_PLAN.md` Phase 3).
- Fit evaluation, solver, diversification, re-suggestion, relaxation, and locale invariance tests pass.
- Scenario results on the 20 recipes are reviewed by the owner, with differences from Stage 0.6 / Stage 1.1 explained.
- Performance is measured and recorded.
- `npm run check` (lint, type-check, tests, content validation, build) passes.
