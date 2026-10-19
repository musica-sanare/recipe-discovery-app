# Implementation Plan — Recipe Discovery

Status: **Draft (2026-10-18)**. Each phase ends with checks, a summary to the owner in Japanese, and a commit proposal; a commit is made only after the owner approves it. A prompt file for each phase (`prompts/`) is written and reviewed before that phase starts.

| Phase | Prompt file |
|---|---|
| 0 — Validation and foundation | `prompts/00-validation-and-foundation.md` |
| 1 — Content model and build pipeline | `prompts/01-content-model-and-pipeline.md` |
| 2 — Nutrition engine | `prompts/02-nutrition-engine.md` |
| 3 — Recommendation engine | `prompts/03-recommendation-engine.md` |
| 4–5 | Written before each phase starts |

`prompts/FIRST_MESSAGE.md` is the kickoff message for a new Claude Code session.

## Phase 0 — Validation and foundation

Status: **Complete (2026-10-18)**. Results: `docs/DECISIONS.md` "Stage 0.1" to "Stage 0.7" logs and ADR-016 to ADR-025. Items still open are listed in `docs/DECISIONS.md` "Open questions".

Goal: confirm the technical hypotheses that the specification depends on, and set up a minimal, reproducible toolchain.

Foundation:
- Verify current versions and compatibility of the candidate stack (React, Vite, TypeScript, i18next, Tailwind CSS, Zod, Vitest, Playwright, axe-core, ESLint) and the Cloudflare static-assets setup; record them in `docs/DECISIONS.md`.
- npm with a committed lockfile, Node version pinning, install-script allowlist policy, strict TypeScript, lint, type-check, test, and build scripts. No deploy script.
- Minimal app shell with `ja`/`en`/`es` message catalogs and the language switcher.

Validation (each item ends with a recorded result and, where needed, an ADR):
1. **Source columns**: compare `PROT-`/`PROTCAA` and `FAT-`/`FATNLEA` on the foods used by the validation recipes; decide the carbohydrate column (`docs/NUTRITION_CALCULATION.md` §2).
2. **Cooking data**: check how to extract Table 12 (weight change rates) and Tables 13–14 from the PDF; list which representative food × method pairs are exact, approximate, or hard to estimate.
3. **Extraction script**: read the workbook from `data/raw/`, verify its checksum, write the subset with notation flags (`docs/DATA_SOURCES.md`).
4. **Validation recipes**: author about 20 representative recipes (structured, three locales) and calculate them; review each ingredient's contribution.
5. **Calculation cross-check**: compare a few recipes with an independent calculation from the source values.
6. **Recipe count and adjustment**: rerun the coverage evaluation with the real recipes (fixed vs bounded adjustment, with diversity and required ingredients); propose the initial recipe count and the adjustment scope for the MVP.
7. **Localization**: prototype the food dictionary with names and aliases in three locales, locale-aware search normalization, and the locale invariance test.
8. **Rounding and tolerance**: propose values based on the validation recipes.

Acceptance:
- Reproducible install and build from the lockfile; lint, type-check, tests, and build pass.
- Each validation item has a recorded result; open items are listed as 要確認.
- The owner has decided the provisional items in `docs/SPEC.md` §16 that Phase 0 is responsible for.

## Phase 1 — Content model and build pipeline

Status: **Complete (2026-10-18)**. Results: `docs/DECISIONS.md` "Stage 1.1" to "Stage 1.5" logs, ADR-024 (revised), ADR-026, and ADR-027. Items still open are listed in `docs/DECISIONS.md` "Open questions".

- Content schemas (food, recipe, ingredient, substitution, adjustment rules, allergen links, localized texts, glossary).
- Build-time validation: schemas, references, locale completeness, allergen links, adjustment bounds.
- Policy lint for forbidden expressions in three locales.
- Composition subset integration and versioned content bundle.

Acceptance: invalid content fails the build with clear messages; tests cover each validation rule.

## Phase 2 — Nutrition engine

Status: **Complete (2026-10-18)**. Results: `docs/DECISIONS.md` "Phase 2 start" and "Stage 2.1" to "Stage 2.6" logs, and ADR-028. Items still open are listed in `docs/DECISIONS.md` "Open questions".

- Pure `domain/nutrition`: formulas (c4, c5), cooking states, notation handling, uncertainty classes, ranges, rounding for display.
- Nutrition snapshot tests for all recipes; locale invariance test.

Acceptance: formula, notation, uncertainty, and invariance tests pass; snapshots reviewed.

## Phase 3 — Recommendation engine

Status: **Complete (2026-10-19)**. Results: `docs/DECISIONS.md` "Phase 3 start" and "Stage 3.1" to "Stage 3.7" logs, "Phase 3 acceptance", and ADR-029. Items still open are listed in `docs/DECISIONS.md` "Open questions".

- Hard filters, fit tiers, tolerance, diversification, seeded re-suggestion, bounded adjustment solver, substitutions, relaxation suggestions, contradiction checks.
- Deterministic reason data for message templates.

Acceptance: determinism and edge-case tests (empty, few, ties, contradictions, required ingredients, allergens with unknown data) pass.

## Phase 4 — UI and localization

- Targets and conditions screen (quick and advanced), candidates, comparison, detail, adjustment, re-suggestion, exceptional states.
- Localized UI and content in `ja`, `en`, `es`; formatting; document language metadata; accessibility.
- Household unit labels in the UI catalogs, with plural forms; `piece` shows the number alone in `en` and `es` (ADR-026; moved from Phase 1 Stage 1.4).
- Decide browser storage of targets and viewed recipes.

Acceptance: the full flow works on mobile and desktop in three locales; accessibility checks pass in three locales.

## Phase 5 — Quality and release preparation

- E2E tests (desktop and mobile, three locales, long strings, locale switching, exceptional states).
- Security headers and CSP verification; dependency and secret scans.
- MVP content set authored and reviewed (translations, allergens, food safety).
- CI configuration, README, and deployment runbook (Cloudflare first, with notes for other static hosts).
- Deploy only after the owner's explicit approval.

Acceptance: SPEC §15 acceptance criteria pass; known risks and manual checks are listed.

## Later (not MVP)

Optional AI features (structured parsing of free-text input, explanation text), browser history features, meal planning. Each needs its own design, evaluation in three locales, and approval.
