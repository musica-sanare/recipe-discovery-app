[Docs index](../en/README.md)

# Implementation Plan — Recipe Discovery

Status: **Draft (2026-10-18)**. Each phase ends with checks, a summary to the owner in Japanese, and a commit proposal; a commit is made only after the owner approves it. A prompt file for each phase (`prompts/`) is written and reviewed before that phase starts.

| Phase | Prompt file |
|---|---|
| 0 — Validation and foundation | `prompts/00-validation-and-foundation.md` |
| 1 — Content model and build pipeline | `prompts/01-content-model-and-pipeline.md` |
| 2 — Nutrition engine | `prompts/02-nutrition-engine.md` |
| 3 — Recommendation engine | `prompts/03-recommendation-engine.md` |
| 4 — UI and localization | `prompts/04-ui-and-localization.md` |
| 5 — Quality and release preparation | `prompts/05-quality-and-release.md` |
| 6 — Post-release maintenance | `prompts/06-post-release-maintenance.md` |
| 7 — Content expansion | `prompts/07-content-expansion.md` |
| 8 — Shopping list | `prompts/08-shopping-list.md` |
| 9 — Recommendation speed and maintenance | `prompts/09-speed-and-maintenance.md` |
| 10 — Library expansion | `prompts/10-library-expansion.md` |

`prompts/FIRST_MESSAGE.md` is the kickoff message for a new Claude Code session.

## Phase 0 — Validation and foundation

Status: **Complete (2026-10-18)**. Results: [DECISIONS.md](DECISIONS.md) "Stage 0.1" to "Stage 0.7" logs and ADR-016 to ADR-025. Items still open are listed in [DECISIONS.md](DECISIONS.md) "Open questions".

Goal: confirm the technical hypotheses that the specification depends on, and set up a minimal, reproducible toolchain.

Foundation:
- Verify current versions and compatibility of the candidate stack (React, Vite, TypeScript, i18next, Tailwind CSS, Zod, Vitest, Playwright, axe-core, ESLint) and the Cloudflare static-assets setup; record them in [DECISIONS.md](DECISIONS.md).
- npm with a committed lockfile, Node version pinning, install-script allowlist policy, strict TypeScript, lint, type-check, test, and build scripts. No deploy script.
- Minimal app shell with `ja`/`en`/`es` message catalogs and the language switcher.

Validation (each item ends with a recorded result and, where needed, an ADR):
1. **Source columns**: compare `PROT-`/`PROTCAA` and `FAT-`/`FATNLEA` on the foods used by the validation recipes; decide the carbohydrate column ([NUTRITION_CALCULATION.md](../en/NUTRITION_CALCULATION.md) §2).
2. **Cooking data**: check how to extract Table 12 (weight change rates) and Tables 13–14 from the PDF; list which representative food × method pairs are exact, approximate, or hard to estimate.
3. **Extraction script**: read the workbook from `data/raw/`, verify its checksum, write the subset with notation flags ([DATA_SOURCES.md](../en/DATA_SOURCES.md)).
4. **Validation recipes**: author about 20 representative recipes (structured, three locales) and calculate them; review each ingredient's contribution.
5. **Calculation cross-check**: compare a few recipes with an independent calculation from the source values.
6. **Recipe count and adjustment**: rerun the coverage evaluation with the real recipes (fixed vs bounded adjustment, with diversity and required ingredients); propose the initial recipe count and the adjustment scope for the MVP.
7. **Localization**: prototype the food dictionary with names and aliases in three locales, locale-aware search normalization, and the locale invariance test.
8. **Rounding and tolerance**: propose values based on the validation recipes.

Acceptance:
- Reproducible install and build from the lockfile; lint, type-check, tests, and build pass.
- Each validation item has a recorded result; open items are listed as 要確認.
- The owner has decided the provisional items in [SPEC.md](../en/SPEC.md) §16 that Phase 0 is responsible for.

## Phase 1 — Content model and build pipeline

Status: **Complete (2026-10-18)**. Results: [DECISIONS.md](DECISIONS.md) "Stage 1.1" to "Stage 1.5" logs, ADR-024 (revised), ADR-026, and ADR-027. Items still open are listed in [DECISIONS.md](DECISIONS.md) "Open questions".

- Content schemas (food, recipe, ingredient, substitution, adjustment rules, allergen links, localized texts, glossary).
- Build-time validation: schemas, references, locale completeness, allergen links, adjustment bounds.
- Policy lint for forbidden expressions in three locales.
- Composition subset integration and versioned content bundle.

Acceptance: invalid content fails the build with clear messages; tests cover each validation rule.

## Phase 2 — Nutrition engine

Status: **Complete (2026-10-18)**. Results: [DECISIONS.md](DECISIONS.md) "Phase 2 start" and "Stage 2.1" to "Stage 2.6" logs, and ADR-028. Items still open are listed in [DECISIONS.md](DECISIONS.md) "Open questions".

- Pure `domain/nutrition`: formulas (c4, c5), cooking states, notation handling, uncertainty classes, ranges, rounding for display.
- Nutrition snapshot tests for all recipes; locale invariance test.

Acceptance: formula, notation, uncertainty, and invariance tests pass; snapshots reviewed.

## Phase 3 — Recommendation engine

Status: **Complete (2026-10-19)**. Results: [DECISIONS.md](DECISIONS.md) "Phase 3 start" and "Stage 3.1" to "Stage 3.7" logs, "Phase 3 acceptance", and ADR-029. Items still open are listed in [DECISIONS.md](DECISIONS.md) "Open questions".

- Hard filters, fit tiers, tolerance, diversification, seeded re-suggestion, bounded adjustment solver, substitutions, relaxation suggestions, contradiction checks.
- Deterministic reason data for message templates.

Acceptance: determinism and edge-case tests (empty, few, ties, contradictions, required ingredients, allergens with unknown data) pass.

## Phase 4 — UI and localization

Status: **Complete (2026-10-20)**, except the phone-class timing (open question 17). Results: [UI_DESIGN.md](../en/UI_DESIGN.md), ADR-030, and [DECISIONS.md](DECISIONS.md) "Phase 4 start", "Stage 4.1" to "Stage 4.7" logs, and "Phase 4 acceptance".

- Targets and conditions screen (quick and advanced), candidates, comparison, detail, adjustment, re-suggestion, exceptional states.
- Localized UI and content in `ja`, `en`, `es`; formatting; document language metadata; accessibility.
- Household unit labels in the UI catalogs, with plural forms; `piece` shows the number alone in `en` and `es` (ADR-026; moved from Phase 1 Stage 1.4).
- Decide browser storage of targets and viewed recipes.

Acceptance: the full flow works on mobile and desktop in three locales; accessibility checks pass in three locales.

## Phase 5 — Quality and release preparation

Status: **Complete (2026-10-24)**: deployed at https://recipe-discovery.musica-sanare.workers.dev after the owner's approval. Manual checks on real devices, screen readers, and forced colors remain ([RELEASE_READINESS.md](RELEASE_READINESS.md) §4). Logs: [DECISIONS.md](DECISIONS.md) "Phase 5 start" to "Production deployment".

- E2E tests (desktop and mobile, three locales, long strings, locale switching, exceptional states).
- Security headers and CSP verification; dependency and secret scans.
- MVP content set authored and reviewed (translations, allergens, food safety).
- CI configuration, README, and deployment runbook (Cloudflare first, with notes for other static hosts).
- Deploy only after the owner's explicit approval.

Acceptance: SPEC §15 acceptance criteria pass; known risks and manual checks are listed.

## Phase 6 — Post-release maintenance

Status: **Complete (2026-10-24)**: release 2 deployed after the owner's approval. The ADR-016 re-check of `i18next` and `react-i18next` remains as maintenance (not before 2026-10-26 05:53 UTC). Logs: [DECISIONS.md](DECISIONS.md) "Manual checks" to "Phase 6 acceptance". The owner chose post-release maintenance (option A) over more content, features outside the MVP, and AI; more content is a Phase 7 candidate.

- Manual checks of [RELEASE_READINESS.md](RELEASE_READINESS.md) §4 recorded and their findings handled; ADR-016 re-check of `i18next` and `react-i18next` (not before 2026-10-26 05:53 UTC).
- Recommendation speed: profiling and optimizations that leave every engine output identical, with a library of about 100 recipes as the target (ADR-030 D10).
- Review of the English and Spanish texts accepted without review for the release (open questions 9 and 13).
- Egg- and soy-based recipes that fit the presets better ([DECISIONS.md](DECISIONS.md) "Stage 5.2 batch 1").
- Evidence for the assumed error bands (open question 3); any band change needs an ADR and the owner's approval.
- Release readiness and a redeployment after the owner's approval.

Acceptance: manual check results recorded; dependency pins updated or re-scheduled; a full recommendation of about 100 recipes within about 100 ms at 4× with unchanged snapshots; the remaining texts reviewed or listed with the owner's decision; changed recipes validated with approved snapshot diffs and ADR-023 still met; error band evidence recorded; checks and CI pass.

## Phase 7 — Content expansion

Status: **Complete (2026-10-25)**: both batches added (86 recipes) and release 3 deployed after the owner's approval. Logs: [DECISIONS.md](DECISIONS.md) "Stage 7.1 expansion plan" to "Third production deployment". The owner chose more content (option B) over shopping lists, opt-in storage, meal planning, and AI; shopping lists are a Phase 8 candidate.

- Expansion plan: cuisine values for dishes missing today (for example Latin American, Mediterranean, Southeast Asian; ADR-026 and ADR-029), the recipe list for two batches, new foods and their composition codes, the revised ADR-023 library size, and food safety decisions.
- Batch 1 and batch 2 of about 13 original recipes each, aimed at the gaps of release 2: cuisines (29 of 60 recipes are Japanese), dishes of ≤ 10 minutes (5), batch cooking (4), breakfast (5), grilling (4), and steaming (5).
- Per batch: foods and cooking rates with checks, texts in three locales with the owner's review, content validation, approved snapshot diffs, coverage, and the speed measurement against the 100 ms threshold of ADR-030 D10.
- Release 3 after the owner's approval.

Acceptance: about 26 new recipes validated and reviewed in three locales with approved snapshot diffs; ADR-023 met as revised; the planned gaps narrowed; a full recommendation within about 100 ms at 4× or the owner's decision on how to proceed; checks and CI pass.

## Phase 8 — Shopping list

Status: **Complete (2026-10-25)**: release 4 deployed after the owner's approval. Logs: [DECISIONS.md](DECISIONS.md) "Stage 8.1 shopping list design" to "Phase 8 acceptance" (ADR-032, [SPEC.md](../en/SPEC.md) §18). Shopping lists were the Phase 8 candidate named when the owner chose Phase 7; they were outside the MVP in [SPEC.md](../en/SPEC.md) §3, so the phase started with a scope change and an ADR. The ADR-016 re-check of `i18next` and `react-i18next` remains as maintenance (not before 2026-10-26 12:40 UTC).

- Design: entry points, amounts and combination rules, pantry items, persistence and privacy (ADR-015, ADR-030 D9), output (checklist, copy, print), and UI, approved before implementation.
- A pure, deterministic, locale-free aggregation module with tests; UI and localization in three locales with the owner's review; accessibility and E2E checks.
- No change to nutrition values, the recommendation engine, or the recipe content; the recommendation stays within the ADR-030 D10 threshold.
- Release 4 after the owner's approval.

Acceptance: approved ADR and SPEC change; the module covered by tests and a snapshot; lists built, checked off, copied, and printed in three locales on desktop and mobile; nutrition and scenario snapshots unchanged; checks and CI pass.

## Phase 9 — Recommendation speed and maintenance

Status: **Complete (2026-10-31)**: releases 5 (speed) and 6 (dependencies) deployed after the owner's approval. Logs: [DECISIONS.md](DECISIONS.md) "Phase 9 start" to "Phase 9 acceptance". The owner chose recommendation speed and maintenance (option A) over more recipes, opt-in storage, and meal planning or AI: a full recommendation is near the ADR-030 D10 threshold (p90 about 99–100 ms at 4×, [RELEASE_READINESS.md](RELEASE_READINESS.md) §3), which blocks a larger library, and the ADR-016 re-check is due after 2026-10-26 12:40 UTC.

- Dependency maintenance: the ADR-016 re-check of `i18next` and `react-i18next`, the other dependencies under ADR-016, and the ADR-017 state.
- Recommendation speed: profiling on the current library and a synthetic larger one, options with their equality proof and a target approved by the owner, then the implementation with every engine output unchanged, measured against a same-session baseline.
- Release 5 only if users receive a change, after the owner's approval.

Acceptance: ADR-016 re-checked and dependencies current or excepted; the approved speed target met with every snapshot and equality test unchanged; timing documents updated as approved; checks and CI pass.

## Phase 10 — Library expansion

Status: **In progress (2026-10-31)**: the expansion plan is approved ([DECISIONS.md](DECISIONS.md) "Phase 10 start", "Stage 10.1 expansion plan", ADR-023 revised); batch 1 is next. The owner chose more recipes first, then AI assistance (Phase 11 candidate), over opt-in storage and meal planning: Phase 9 left room under the ADR-030 D10 threshold for about 130 recipes (ADR-023 note).

- Expansion plan: about 44 original recipes in three batches (about 130 in total), aimed at the remaining gaps (cuisine balance, effort 3, grilling, steaming, very quick, batch cooking, breakfast, no-cook, microwave-only, bulk, and egg- and soy-based dishes that meet a preset), new foods, the revised ADR-023 size, and the synthetic library size for measurements.
- Per batch: foods and cooking rates with checks, texts in three locales with the owner's review, content validation, approved snapshot diffs, coverage, and the speed measured against the previous batch in the same session.
- Release 7 after the owner's approval; at the end, a draft prompt for Phase 11 (AI assistance) for the owner's review.

Acceptance: about 44 new recipes validated and reviewed in three locales with approved snapshot diffs; ADR-023 met as revised; the planned gaps narrowed; a full recommendation within about 80 ms p90 at 4× or the owner's decision; checks and CI pass; the Phase 11 prompt drafted.

## Later (not MVP)

Optional AI features (structured parsing of free-text input, explanation text; the owner chose AI assistance as the Phase 11 candidate after Phase 10, 2026-10-31), browser history features, meal planning. Each needs its own design, evaluation in three locales, and approval.
