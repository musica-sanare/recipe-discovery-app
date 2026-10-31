# Prompt 10 — Phase 10: library expansion

You are the lead engineer for Recipe Discovery. Read `CLAUDE.md` and every document under `docs/en/` and `docs/working/` before making changes. Phase 0 to Phase 9 results are in `docs/working/DECISIONS.md` (in particular ADR-023 with its Phase 9 note, ADR-026, ADR-028, ADR-029, ADR-030 D10; "Stage 7.1 expansion plan" to "Phase 7 acceptance" for how content batches are run; "Stage 9.2" to "Phase 9 acceptance"; "Open questions"). Communicate with the owner in Japanese; write repository files in English.

## Starting point
- Branch `dev`; release 6 was deployed on 2026-10-31 from commit `b113983` (version `4607ad0c-58b3-4f60-aa7c-cd34befaf238`), recorded in `07f25c7`, followed by the commit that adds this prompt; release 5 (`5709506`) is the rollback target. The owner creates branches and pushes unless they ask Claude to push.
- Content version `2026-10-25.2`: 86 recipes and 94 foods in `ja`, `en`, and `es`. `npm run check` (689 tests), `npm run test:e2e` (107 passed, 1 skipped), and CI pass.
- Composition (2026-10-31): goals cut 28, maintain 40, bulk 22; main protein chicken 15, pork 14, beef 14, fish 17, soy 13, egg 13; cuisines Japanese 35 (41 %), Western 13, Chinese 11, Spanish 8, Korean 5, Latin American 5, Southeast Asian 4, Mediterranean 3, Okinawan 2; method families simmer 26, stir-fry 18, pan 18, steam 8, grill 7, no-cook 5, fry 4 (fried 5 %); ≤ 10 minutes 11, ≤ 20 minutes 66 (77 %); tags `batch` 11, `breakfast` 9, `no_cook` 4; effort 1: 43, 2: 38, 3: 5; microwave only 11, oven toaster 6, deep pan 3. Known gaps: `tortilla_espanola` and `mackerel_salt_grill_daikon` meet no preset, and egg- and soy-based dishes rarely meet the preset fat limits ([RELEASE_READINESS.md](../docs/working/RELEASE_READINESS.md) §3).
- Speed: a full recommendation takes about 50–55 ms median at a 4× CPU slowdown on the 86 recipes and about 62–70 ms on the synthetic library of 130 (ADR-030 D10 threshold about 100 ms). ADR-023 keeps new recipes within about 400 grid states each; with that, about 130 recipes stay within about 80 ms p90 at 4×. 23,041 grid states today (median 126 per recipe; 15 recipes above 400, the largest `beef_steak_potatoes` with 5,376).
- Measurement tools: `npm run bench:recommendation` and `TIMING_LIBRARY=synthetic npm run test:e2e:timing` use `tools/synthetic-library.ts`, which adds copies up to 130 recipes and fails once the library itself reaches 130; its size moves above the new library size in this phase (for example to 180).
- Equality and snapshots: the engine, scenario, solver-result, and digest snapshots (`test/node/recommendation-digests.test.ts`) cover the repository recipes, so new recipes change them by design; each diff is explained and approved.
- Maintenance: open question 22 (`minimatch` 10.2.6 in the development dependencies, accepted) and ADR-017 (`typescript-eslint` without TypeScript 7 support) are re-checked at the start of the phase; ADR-016 applies to every dependency. Wrangler was installed in an earlier session's scratch directory and is not available; reinstall it only after the owner approves the download, as in [DECISIONS.md](../docs/working/DECISIONS.md) "Sixth production deployment".
- The MEXT workbook and explanation PDF are in `data/raw/mext/` (outside Git); `npm run data:extract` and `npm run data:verify-cooking` need them.

## Goal
Widen the repertoire with about 44 original recipes in three batches (about 130 in total; the number is confirmed in 10.1), aimed at the gaps that remain after Phase 7, while keeping the ADR-023 composition rules and grid limit, the food safety and allergen rules, the three-locale review, and the speed target of Phase 9. A release follows only after the owner's explicit approval.

## Working rules
- Work in stages. Each stage starts with the intended changes and affected files, and ends with checks, a Japanese summary (changed files, decisions, commands and results, 要確認, next stage), and a commit proposal with the full message and file list written in the message itself. Commit only after the owner approves that specific commit.
- Content follows [CONTENT_POLICY.md](../docs/en/CONTENT_POLICY.md): original recipes; food safety notes (doneness checks, frying, eggs, batch cooling, microwave); allergen links, with processed or varying ingredients as `may_contain` and listed under open question 12; no health claims; Spanish vocabulary and dish names per §6. No raw or undercooked meat, poultry, fish, or eggs, unless the owner decides otherwise with a policy change.
- The recipe list and the new foods of a batch are approved before texts are written. `en` and `es` are drafted by Claude and reviewed by the owner with a review sheet, as in Stage 7.2, including back-translations of safety-relevant texts.
- Food mapping: a food without a table value is left out or mapped to a stated approximation with the owner's approval; cooked forms follow [NUTRITION_CALCULATION.md](../docs/en/NUTRITION_CALCULATION.md) §5 and the `cooking-state` validation rule; new cooking rates are transcribed from the PDF with page numbers and checked (`npm run data:verify-cooking`).
- Engines: no behavior, formula, tolerance, band, threshold, or rounding change without an ADR and the owner's approval. A new cuisine value or tag is a schema change (ADR-026) with UI catalog keys in three locales; its effect on diversification (ADR-029) is stated.
- Every new recipe keeps its adjustment grid within about 400 states (ADR-023); a larger grid needs the owner's approval with its timing effect.
- Snapshot diffs (engine, scenario, solver results, digests) are explained per recipe and approved; `npm run eval:coverage` and `npm run report:composition` are re-run per batch. Tests of reviewed counts keep using the validation recipes. The shopping list snapshot stays unchanged unless a recipe it uses changes.
- After each batch, measure `npm run bench:recommendation` and `npm run test:e2e:timing` against the previous batch in the same session (alternating, alone, 1×, 4×, and 6×, median and p90), as in Phase 9. If a full recommendation would exceed about 80 ms p90 at 4× on the real library (the ADR-023 note; ADR-030 D10 threshold about 100 ms), stop and propose options before adding more.
- Verify UI changes in the browser preview (desktop width and 375 px, three locales) and report what was and was not checked.
- `docs/en/` changes update the `docs/ja/` translation and its source line in the same commit; run the "Checks" of the shared rules' ADOPTING.md before proposing a commit.
- No deployment, account, token, or external service without the owner's explicit approval of that specific action.

## Stages

### 10.1 Expansion plan (owner review before implementation)
Propose and wait for approval:
1. **Size and batches**: the number of recipes (about 44 for about 130 in total), three batches of about 15, and the revised ADR-023 library size.
2. **Gaps**: which to narrow and by how much, for example cuisine balance (Japanese below about 35 %; more Korean, Mediterranean, Southeast Asian, Latin American, and Okinawan dishes), effort 3 (5 today), grilling (7) and steaming (8), ≤ 10 minutes (11), batch cooking (11), breakfast (9), no-cook dishes (5), microwave-only dishes (11), oven toaster dishes (6), bulk recipes (22), and egg- and soy-based dishes that meet a preset; any new cuisine value or tag with its ADR text.
3. **Recipe list**: per batch, each dish with goal, main protein, cuisine, time, effort, equipment, method family, tags, the expected grid states, and the gap it fills, and the resulting ADR-023 composition (goals, protein groups, quick share, fried share at most 15 %, no cuisine above half of the library).
4. **Foods**: new foods with composition codes, cooked forms and rates to transcribe, allergen links, regional names and aliases in three locales, and foods without table values with their proposed handling.
5. **Food safety and policy**: dishes that need new safety notes or a policy decision.
6. **Tools**: the new size of the synthetic library in `tools/synthetic-library.ts` (and `docs/en/DEVELOPMENT.md` with its translation).

### 10.2 Batch 1
1. Composition extraction and cooking-rate transcription with checks ([DATA_SOURCES.md](../docs/en/DATA_SOURCES.md)); new foods and, if approved, new cuisine values or tags with their UI keys.
2. Recipes with `ja`, `en`, and `es` texts, safety notes, allergen links, adjustment bounds, sides, and substitutions; content validation; snapshot diffs explained and approved; coverage and composition reports re-run.
3. Owner review of the English and Spanish texts with a review sheet; fixes; speed measurement against the previous library; browser check of the new detail pages; commit.

### 10.3 Batch 2 and 10.4 Batch 3
Same as 10.2, each after the previous batch's commit. After batch 3, check the ADR-023 composition of the whole library and update [RELEASE_READINESS.md](../docs/working/RELEASE_READINESS.md) §3 where a limitation changes.

### 10.5 Release 7
1. Release readiness: [RELEASE_READINESS.md](../docs/working/RELEASE_READINESS.md) for release 7, `npm ci`, `npm run check`, `npm run test:e2e`, `npm audit`, the phone-class timing with release 6 measured alongside, and the history secret scan on the release commit.
2. A deployment proposal (commit, Wrangler version and its install scripts, rollback to release 6) for the owner's explicit approval; deploy and run the post-deployment checks of [DEPLOYMENT.md](../docs/en/DEPLOYMENT.md) §3 only after that approval.

### 10.6 Phase 11 plan
The owner chose AI assistance as the phase after this one. At the end of Phase 10, draft `prompts/11-…` for a new session from ADR-004 ("Later candidates"), principles 17 and 18 of `CLAUDE.md`, and [CONTENT_POLICY.md](../docs/en/CONTENT_POLICY.md) §7, with the questions the owner decides first (which feature, provider and hosting, server endpoint and its privacy, evaluation in three locales, cost); no AI code or account in Phase 10.

## Out of scope
- AI features (Phase 11), opt-in storage, meal planning, accounts, server-side storage, analytics, new UI features.
- Engine behavior changes not approved with an ADR; refinements of the error bands unless the owner adds them.
- Any deployment, account, token, or external service without the owner's explicit approval.

## Acceptance
- About 44 new recipes in three batches pass content validation; their texts are reviewed in three locales; snapshot changes are approved.
- The library meets the ADR-023 rules as revised; the gaps chosen in 10.1 are narrowed as planned.
- A full recommendation stays within about 80 ms p90 at a 4× CPU slowdown on the expanded library (ADR-023 note), or the owner has decided how to proceed.
- `npm run check`, `npm run test:e2e`, and CI pass; release 7 is deployed only after the owner's approval; the Phase 11 prompt is drafted for the owner's review.
