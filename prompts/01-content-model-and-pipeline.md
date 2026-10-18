# Prompt 01 — Phase 1: content model and build pipeline

You are the lead engineer for Recipe Discovery. Read `CLAUDE.md` and every document under `docs/` before making changes; Phase 0 results are in `docs/DECISIONS.md` ("Stage 0.1" to "Stage 0.7" logs, ADR-016 to ADR-025). Communicate with the owner in Japanese; write repository files in English.

## Goal
Turn the provisional Phase 0 content format into the MVP content model, validate all content at build time with clear messages, and ship a versioned, locale-aware content bundle that the browser can load. Do not build the recommendation engine or product UI in this phase.

## Working rules
- Work in stages. Each stage ends with checks, a Japanese summary (changed files, decisions, commands and results, 要確認, next stage), and a commit proposal. Commit only after the owner approves that specific commit.
- At the start of the phase, re-check ADR-016 (pinned `i18next`/`react-i18next`) and ADR-017 (TypeScript 7 support in `typescript-eslint`) and report.
- Propose schema changes before implementing them; schema changes affect every recipe and the nutrition rules.
- Keep the nutrition calculation locale-free and deterministic; keep the existing tests green or update them deliberately with an explanation.

## Stages

### 1.1 Schema proposal (owner review before implementation)
Propose the MVP schemas in `shared/content.ts`, covering at least:
1. **Portion rules and linked ingredients** (ADR-024): staples are either 0 g or at least an authored minimum portion; seasonings and other ingredients can belong to a link group that scales with its leader; integer units (for example whole eggs).
2. **Hard-to-estimate marker** for ingredients whose cooking is not represented by any table value (for example slow frying in a lot of oil), so the range rules of `docs/NUTRITION_CALCULATION.md` §7 can apply.
3. **Household measures**: unit labels come from the UI catalogs in three locales; content stores the unit and quantity only.
4. **Step notes that depend on amounts** (for example "use a larger pan" above a threshold).
5. **Substitutions**: effects on time, steps, or notes.
6. **Recipe metadata** needed by the ADR-023 composition rules (goal suitability, main protein group, quick, fried) and by filters (equipment, time, cuisine).
7. **Content versioning**: a content version and the composition source version carried into the bundle.
List what changes for the 20 existing recipes and how they will be migrated.

### 1.2 Validation tool
1. `tools/validate-content.ts`, run by `npm run build` and `npm run check`, failing with messages that name the file, the recipe or food, the field, and the rule.
2. Rules: schemas; unique IDs; references (foods, composition codes, cooked states with weight change rates, `includedIn`, link groups, substitutions); locale completeness in `ja`/`en`/`es`; adjustment and portion bounds; allergen links; food safety notes; glossary consistency; forbidden expressions (`docs/CONTENT_POLICY.md`).
3. Tests with small invalid fixtures for each rule (not only the real content). Move the content checks in `test/node/content.test.ts` into the tool where that keeps one source of truth.

### 1.3 Composition coverage report
1. A report (part of validation output or a separate command) listing, per recipe, which ingredients are exact, approximations (with reason), fried, or hard to estimate.
2. Fail when a recipe uses a state whose code has no weight change rate, as today.

### 1.4 Content bundle
1. Generate at build time a locale-neutral calculation bundle (foods with only the needed composition fields and flags, rates, recipes without texts) and one text bundle per locale. Measure their sizes.
2. Include the content version and composition source version; name files with a content hash so they can be cached safely.
3. Validate the bundle in the browser with `zod/mini` before use; an invalid or unreachable bundle must lead to the error state, not a crash.
4. Keep everything static and platform-independent (ADR-001).

### 1.5 Migration
Migrate the 20 validation recipes and the food dictionary to the new schemas, keep the nutrition snapshot unchanged unless a schema change intentionally changes values (explain each difference), and keep `npm run eval:coverage` working.

## Out of scope
- Authoring the remaining recipes of the ~60-recipe library (ADR-023); this phase only makes authoring safe and repeatable. When and how the library is authored is decided with the owner before Phase 5.
- The recommendation engine, ranges, adjustment solver, and UI (Phases 2–4).
- Any deployment, external service, or AI.

## Acceptance
- Invalid content fails `npm run build` with clear messages; each validation rule has a failing fixture test.
- The bundle is generated deterministically, validated at load, and sized; its versions are visible.
- The 20 recipes pass validation in the new format; nutrition snapshot differences, if any, are explained and approved.
- Lint, type-check, tests, content validation, and build pass.
