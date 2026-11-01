# Prompt 15 — Phase 15: French and French-speaking cuisines

You are the lead engineer for Recipe Discovery. Read `CLAUDE.md` and every document under `docs/en/` and `docs/working/` before making changes. Phase 0 to Phase 14 results are in `docs/working/DECISIONS.md` (in particular ADR-023 with its revisions, ADR-026, ADR-028, ADR-029, ADR-030 D10, ADR-033, ADR-037; "Stage 10.1 expansion plan" to "Phase 10 acceptance" and "Phase 11 start: French locale" to "Phase 11 acceptance" for how content batches and French texts are run; "Phase 14 acceptance"; "Release 11 and eleventh production deployment"; "Open questions"). Every locale requirement means four locales: `ja`, `en`, `es`, and `fr`. Communicate with the owner in Japanese; write repository files in English.

## Starting point
- Branch `dev`; release 11 (Phase 14, the "soft pop" redesign) was deployed on 2026-11-01 by Workers Builds from `04134e0`, merged into `main` as `dc0f099`; `a93902d` (release 10) is the rollback target. The owner pushes, merges `dev` into `main` by hand, and a merge into `main` deploys ([DEPLOYMENT.md](../docs/en/DEPLOYMENT.md) §3). Claude never deploys and never runs Wrangler.
- Content version `2026-10-31.8`: 130 recipes and 117 foods in four locales. Cuisines: Japanese 44, Western 19, Chinese 15, Spanish 12, Korean 10, Latin American 9, Mediterranean 8, Southeast Asian 8, Okinawan 5. There is no French, Belgian, Québécois, North African, or West African cuisine value; French dishes so far are counted as Western or Mediterranean. `npm run check` (996 tests), `npm run test:e2e` (164 passed, 1 skipped), and CI pass.
- Speed: a full recommendation takes about 61–67 ms median and about 70 ms p90 at a 4× CPU slowdown on the 130 recipes ("Stage 14.5 quality"); the ADR-030 D10 threshold is about 100 ms p90 at 4×, and ADR-023 (revised before Phase 10 batch 3) uses it as the library limit. New recipes keep their adjustment grid within about 400 states.
- Measurement tools: `npm run bench:recommendation` and `TIMING_LIBRARY=synthetic npm run test:e2e:timing` use `tools/synthetic-library.ts` (`SYNTHETIC_TOTAL = 180`); the library must stay below that size or the constant moves up with [DEVELOPMENT.md](../docs/en/DEVELOPMENT.md) and its translation.
- Equality and snapshots: the engine, scenario, solver-result, and digest snapshots cover the repository recipes, so new recipes change them by design; each diff is explained and approved.
- UI: cuisines appear as text chips and checkboxes (no cuisine icons, ADR-037 D3); a new cuisine value needs catalog keys in four locales and fits the current layout.
- Maintenance: open question 22 (`minimatch`) and ADR-017 (TypeScript 7 support in `typescript-eslint`) are re-checked at the start of the phase; ADR-016 applies to every dependency.
- The MEXT workbook and explanation PDF are in `data/raw/mext/` (outside Git); `npm run data:extract` and `npm run data:verify-cooking` need them.

## Goal
Add original recipes from France and from French-speaking regions (for example Belgium, Switzerland, Québec, North Africa, and West Africa) so that French-speaking users find dishes from their own food cultures, while keeping deterministic calculation from the MEXT tables, the ADR-023 composition rules and grid limit, the food safety and allergen rules, the four-locale review, and the speed threshold. A release follows only after the owner's merge into `main`.

## Fixed constraints
- Original recipes only (principle 11); no copied recipe text, photos, or regional "authentic" claims. Dish names follow the region a dish comes from (ADR-033); French texts use metropolitan vocabulary unless a dish name is regional.
- Nutrition values come only from the MEXT tables (principles 1–5). Ingredients the tables do not cover are left out, replaced by a stated approximation with the owner's approval, or the dish is dropped. Each dish states how many ingredients are approximations before it is approved; a dish that would need too many is dropped.
- No raw or undercooked meat, poultry, fish, or eggs (for example no steak tartare or rare duck breast), unless the owner decides otherwise with a policy change. Food safety notes follow [CONTENT_POLICY.md](../docs/en/CONTENT_POLICY.md).
- No health or efficacy claims (principle 15); allergen links are best effort, with processed or varying ingredients as `may_contain` and listed under open question 12 (principle 14).
- Engines: no behavior, formula, tolerance, band, threshold, or rounding change without an ADR and the owner's approval. A new cuisine value or tag is a schema change (ADR-026) with UI catalog keys in four locales; its effect on diversification (ADR-029 D5) and on the cuisine preference is stated.

## Working rules
- Work in stages. Each stage starts with the intended changes and affected files, and ends with checks, a Japanese summary (changed files, decisions, commands and results, 要確認, next stage), and a commit proposal with the full message and file list written in the message itself. Commit only after the owner approves that specific commit; check the current branch before every commit.
- The recipe list and the new foods of a batch are approved before texts are written. `en`, `es`, and `fr` are drafted by Claude and reviewed by the owner with a review sheet including back-translations of safety-relevant texts (ADR-007, ADR-033; open questions 9 and 23).
- Food mapping: cooked forms follow [NUTRITION_CALCULATION.md](../docs/en/NUTRITION_CALCULATION.md) §5 and the `cooking-state` validation rule; new cooking rates are transcribed from the PDF with page numbers and checked (`npm run data:verify-cooking`).
- Snapshot diffs are explained per recipe and approved; `npm run eval:coverage` and `npm run report:composition` are re-run per batch.
- After each batch, measure `npm run bench:recommendation` and `npm run test:e2e:timing` against the previous library in the same session (alternating, 1×, 4×, and 6×, median and p90). If a full recommendation would exceed about 100 ms p90 at 4×, stop and propose options before adding more.
- Verify UI changes in the browser (desktop width and 375 px, light and dark, at least `fr` and `ja`) and report what was and was not checked.
- Every change to `docs/en/` updates `docs/ja/` and its source line in the same commit.

## Stages

### 15.1 Plan (owner review before implementation)
Propose and wait for approval:
1. **Coverage check**: candidate dishes per region with their ingredients mapped to MEXT food codes; for each, the number of exact, approximated, and missing ingredients and the cooked forms needed. Typical risks: specific cheeses, crème fraîche, duck, rabbit, lamb cuts, couscous semolina, harissa or ras el hanout blends, palm oil, cassava (attiéké), plantain, fonio, peanut paste, and dried fish. Dishes that need too many approximations are dropped.
2. **Cuisine values**: keep the current values (French dishes as Western, Maghreb dishes as Mediterranean) or add new ones (for example `french`, `north_african`, `west_african`), with options, the effect on diversification and on the cuisine filter, the catalog labels in four locales, and the ADR text.
3. **Size and batches**: the number of recipes (for example about 20 in two batches) and the revised ADR-023 library size, within the speed threshold and below the synthetic library size.
4. **Recipe list**: per batch, each dish with region, goal, main protein, cuisine value, time, effort, equipment, method family, tags, the expected grid states, and the approximations, and the resulting ADR-023 composition (goals, protein groups, quick share, fried share at most 15 %, no cuisine above half of the library, Japanese below about 35 %).
5. **Foods**: new foods with composition codes, cooked forms and rates to transcribe, allergen links, names and aliases in four locales (regional French terms included), and foods without table values with their proposed handling.
6. **Food safety and policy**: dishes that need new safety notes or a policy decision (for example eggs in sauces, slow-cooked meats, fried street food).

### 15.2 Batch 1
1. Composition extraction and cooking-rate transcription with checks ([DATA_SOURCES.md](../docs/en/DATA_SOURCES.md)); new foods and, if approved, new cuisine values with their UI keys in four locales.
2. Recipes with `ja`, `en`, `es`, and `fr` texts, safety notes, allergen links, adjustment bounds, sides, and substitutions; content validation; snapshot diffs explained and approved; coverage and composition reports re-run.
3. Owner review of the texts with a review sheet; fixes; speed measurement against the previous library; browser check of the new detail pages and the cuisine filter; commit.

### 15.3 Batch 2
Same as 15.2 after batch 1's commit. Afterwards, check the ADR-023 composition of the whole library and update [RELEASE_READINESS.md](../docs/working/RELEASE_READINESS.md) §3 where a limitation changes.

### 15.4 Release 12
1. Release readiness as for release 11 ([RELEASE_READINESS.md](../docs/working/RELEASE_READINESS.md)): `npm ci`, `npm run check`, `npm run test:e2e`, `npm audit`, the phone-class timing with release 11 measured alongside, and the secret scan.
2. The owner approves and merges `dev` into `main`, which deploys; Claude runs the post-deployment checks of [DEPLOYMENT.md](../docs/en/DEPLOYMENT.md) §3 plus a French search and a new detail page in production, and records release 12.

## Out of scope
- New features, engine changes not approved with an ADR, design changes beyond fitting new cuisine labels (Phase 14 is done), AI features, accounts, server-side storage, analytics.
- Any deployment, account, token, or external service.

## Acceptance
- The owner's decisions of 15.1 are recorded; new recipes pass content validation; their texts are reviewed in four locales; snapshot changes are approved.
- The library meets the ADR-023 rules as revised, and every dish's approximations are stated and approved.
- A full recommendation stays within about 100 ms p90 at a 4× CPU slowdown, or the owner has decided how to proceed.
- `npm run check`, `npm run test:e2e`, and CI pass; release 12 is deployed only by the owner's merge into `main`.
