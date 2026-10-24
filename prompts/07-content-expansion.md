# Prompt 07 — Phase 7: content expansion

You are the lead engineer for Recipe Discovery. Read `CLAUDE.md` and every document under `docs/` before making changes. Phase 0 to Phase 6 results are in `docs/DECISIONS.md` (in particular ADR-023, ADR-026, ADR-028, ADR-029, ADR-030; "Stage 5.1 release plan" and "Stage 5.2 batch 1" to "batch 3" for how content batches are run; "Stage 6.2" to "Stage 6.6" and "Phase 6 acceptance"; "Open questions"). Communicate with the owner in Japanese; write repository files in English.

## Starting point
- Branch `dev`; release 2 was deployed on 2026-10-24 from commit `edd7afe` (version `81bc7642-f8fb-4290-a1ed-5f096a363074`), recorded in `70cae1c`, followed by the commit that adds this prompt. The owner creates branches and pushes.
- Content version `2026-10-24.8`: 60 recipes and 78 foods in `ja`, `en`, and `es`. `npm run check` (633 tests), `npm run test:e2e` (98 passed, 1 skipped), and CI pass.
- The library is balanced by goal (cut 20, maintain 27, bulk 17) and main protein (chicken, pork, beef, and soy 10 each, fish 11, egg 9), but not by cuisine or occasion: Japanese 29, Western 12, Chinese 8, Spanish 7, Korean 3, Okinawan 1, and no Latin American, Mediterranean, or Southeast Asian dish; 5 recipes take ≤ 10 minutes; 4 are tagged `batch` and 5 `breakfast`; grilling (4) and steaming (5) are rare. The cuisine values are a fixed list in the content schema (ADR-026) and are used by diversification (ADR-029) and the UI catalogs.
- Workbook search on 2026-10-24: kidney beans (04007/04008), chickpeas (04065/04066), avocado (07006), lime juice (07145), coriander leaves (06385), sweet corn (06176, 06378), quinoa (01167), coconut milk (07158), and fish sauce (17107) exist; tortillas do not.
- Speed: a full recommendation takes about 73 ms at a 4× CPU slowdown on 60 recipes (release 2) and was estimated at 92–110 ms for 100 recipes (ADR-030 D10 threshold about 100 ms; "Stage 6.2").
- Open maintenance outside this phase: the ADR-016 re-check of `i18next` and `react-i18next` (not before 2026-10-26 05:53 UTC); it may be done between stages as its own commit.
- The MEXT workbook and explanation PDF are in `data/raw/mext/` (outside Git); `npm run data:extract` and `npm run data:verify-cooking` need them.

## Goal
Widen the repertoire where the library is thin: add about 26 original recipes in two batches (about 86 in total) that bring cuisines missing today, more batch-cooking and breakfast dishes, very quick dishes, and grilled and steamed dishes, while keeping the ADR-023 composition rules, the food safety and allergen rules, the three-locale review, and the speed threshold. A release follows only after the owner's explicit approval.

## Working rules
- Work in stages. Each stage starts with the intended changes and affected files, and ends with checks, a Japanese summary (changed files, decisions, commands and results, 要確認, next stage), and a commit proposal with the full message and file list written in the message itself. Commit only after the owner approves that specific commit.
- Content follows `docs/CONTENT_POLICY.md`: original recipes; food safety notes (doneness checks, frying, eggs, batch cooling, microwave); allergen links, with processed or varying ingredients as `may_contain` and listed under open question 12; no health claims; Spanish vocabulary per §6 (owner decision V1). No raw or undercooked meat, poultry, fish, or eggs (for example no ceviche), unless the owner decides otherwise with a policy change.
- The recipe list and the new foods of a batch are approved before texts are written. `en` and `es` are drafted by Claude and reviewed by the owner with a review sheet, as in Stage 6.3, including back-translations of safety-relevant texts.
- Food mapping: a food without a table value (for example tortillas) is either left out or mapped to a stated approximation with the owner's approval; cooked forms follow `docs/NUTRITION_CALCULATION.md` §5 and the `cooking-state` validation rule; new cooking rates are transcribed from the PDF with page numbers and checked (`npm run data:verify-cooking`).
- Engines: no behavior, formula, tolerance, band, threshold, or rounding change without an ADR and the owner's approval. A new cuisine value is a schema change (ADR-026) with UI catalog keys in three locales; its effect on diversification (ADR-029) is stated.
- Nutrition snapshot diffs are explained per recipe and approved; the scenario snapshot, `npm run eval:coverage`, and `npm run report:composition` are re-run per batch. Tests of reviewed counts keep using the validation recipes.
- After each batch, measure `npm run bench:recommendation` and `npm run test:e2e:timing`; if a full recommendation would exceed about 100 ms at 4×, stop and propose options (for example reusing engine probes across searches, option O3 of Stage 6.2) before adding more.
- Verify UI changes in the browser preview (desktop width and 375 px, three locales) and report what was and was not checked.
- No deployment, account, token, or external service without the owner's explicit approval of that specific action.

## Stages

### 7.1 Expansion plan (owner review before implementation)
Propose and wait for approval:
1. **Cuisines**: whether to add cuisine values (for example `latin_american`, `mediterranean`, `southeast_asian`), their names in three locales, how they enter diversification and the cuisine preference, and the ADR text (ADR-026 revision or a new ADR); or keep the list and classify new dishes into existing values.
2. **Recipe list**: about 26 dishes in two batches of about 13, with goal, main protein, cuisine, time, effort, equipment, method family, and tags, showing which gap each fills (cuisine, ≤ 10 minutes, batch cooking, breakfast, grilling, steaming, microwave only) and the resulting ADR-023 composition (goals, protein groups, quick share, fried share at most 15 %).
3. **Foods**: new foods with composition codes, cooked forms and rates to transcribe, allergen links, regional names and aliases in three locales, and foods without table values with their proposed handling.
4. **ADR-023**: the revised library size and any change to the composition rules.
5. **Food safety and policy**: dishes that need new safety notes or a policy decision (for example regional raw dishes, soft eggs, fried dishes).

### 7.2 Batch 1
1. Composition extraction and cooking-rate transcription with checks (`docs/DATA_SOURCES.md`); new foods and, if approved, the cuisine values with their UI keys.
2. Recipes with `ja`, `en`, and `es` texts, safety notes, allergen links, adjustment bounds, sides, and substitutions; content validation; snapshot diffs explained and approved; coverage and composition reports re-run.
3. Owner review of the English and Spanish texts with a review sheet; fixes; speed measurement; browser check of the new detail pages; commit.

### 7.3 Batch 2
Same as 7.2, after the batch 1 commit. Afterwards, check the ADR-023 composition of the whole library and update `docs/RELEASE_READINESS.md` §3 where a limitation changes.

### 7.4 Release 3
1. Release readiness: `docs/RELEASE_READINESS.md` for release 3, `npm ci`, `npm run check`, `npm run test:e2e`, `npm audit`, the phone-class timing, and the history secret scan on the release commit (tools reinstalled as in Stage 6.6 after the owner approves the downloads).
2. A deployment proposal (commit, Wrangler version and its install scripts, rollback to release 2) for the owner's explicit approval; deploy and run the post-deployment checks of `docs/DEPLOYMENT.md` §3 only after that approval.

## Out of scope
- Features outside the MVP (`docs/SPEC.md` §3): shopping lists (Phase 8 candidate), opt-in storage, meal planning, AI, accounts, server-side storage, analytics.
- Engine behavior changes not approved with an ADR; refinements of the fried band (Stage 6.5) unless the owner adds them.
- Any deployment, account, token, or external service without the owner's explicit approval.

## Acceptance
- About 26 new recipes in two batches pass content validation; their texts are reviewed in three locales; snapshot changes are approved.
- The library meets the ADR-023 rules as revised; the cuisine, ≤ 10 minutes, batch-cooking, breakfast, grilling, and steaming gaps are each narrowed as planned in 7.1.
- A full recommendation stays within about 100 ms at a 4× CPU slowdown, or the owner has decided how to proceed.
- `npm run check`, `npm run test:e2e`, and CI pass; release 3 is deployed only after the owner's approval.
