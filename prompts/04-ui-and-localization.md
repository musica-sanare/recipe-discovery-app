# Prompt 04 — Phase 4: UI and localization

You are the lead engineer for Recipe Discovery. Read `CLAUDE.md` and every document under `docs/` before making changes. Phase 0 to Phase 3 results are in `docs/DECISIONS.md` ("Stage 0.1" to "Stage 3.7" logs, "Phase 3 acceptance"; ADR-005, ADR-007, ADR-015, ADR-016, ADR-018, ADR-025 to ADR-029; "Open questions"). Communicate with the owner in Japanese; write repository files in English.

## Starting point
- Branch `dev`; Phase 3 ended with commit `2fd68b9` ("docs: record Phase 3 completion"). The owner creates branches and pushes.
- `domain/nutrition` (ADR-028) calculates a recipe state: `calculateNutrition`, `roundForDisplay`, `nutritionBasis`; one recalculation takes about 0.02 ms in Node.
- `domain/recommendation` (ADR-029) is complete and locale-free: `recommendationDataFromBundle(calc)`, `evaluatePool(request, data)` (validation, contradictions, hard filters, solver; about 4–19 ms for 20–60 recipes in Node), and `selectCandidates(pool, session, seed)` (candidates, close alternatives, relaxations, exclusion counts, tier counts, typed reason codes; under 0.2 ms). `presetTargets`, `INPUT_LIMITS`, and the typed `InputError` and `Contradiction` values are exported for the UI. Browsers were not measured (open question 17).
- `src/` has the app shell only: typed `ja`/`en`/`es` catalogs (`src/i18n/messages/`, `ja` defines the type), locale detection and the stored locale preference, the language switcher, document language metadata, content bundle loading with zod validation and a retry state (`src/content/`), and the versions in the footer. `npm run dev` serves it; `.claude/launch.json` has a `preview` configuration (`vite preview` with the production headers).
- Dependencies are minimal (ADR-018). Tailwind CSS, a router, axe-core, and Playwright are not installed; each is added only in the phase that needs it, after checking ADR-016 and the install-script policy.
- Open questions that this phase decides or must keep in view: 5 (browser storage), 9 and 13 (Spanish and English review), 14 (aliases per locale), 16 (`i18next` pins), 17 (browser timing), 19 (input limits and contradiction thresholds on the targets screen), 20 (combined equipment relaxation), and the Stage 3.7 observation that "show a different type" can return only close alternatives when few recipes meet the targets.

## Goal
Build the complete MVP user flow in `ja`, `en`, and `es`: targets and conditions, candidates, comparison, recipe detail with adjustment and recalculation, re-suggestion, and every exceptional state of `docs/SPEC.md` §12. The UI calls the engines and turns their codes and numbers into localized texts and locale-formatted values; it never changes a calculated value. Do not change engine behavior, formulas, tolerances, or content except where a stage below says so and the owner approves.

## Working rules
- Work in stages. Each stage ends with checks, a Japanese summary (changed files, decisions, commands and results, 要確認, next stage), and a commit proposal with the full message and file list written in the message itself. Commit only after the owner approves that specific commit.
- At the start of the phase, re-check ADR-016 (`i18next`/`react-i18next` pins; the agreed re-check time is after 2026-10-19 21:24 UTC) and ADR-017 (TypeScript 7 support in `typescript-eslint`) and report. A dependency upgrade is its own commit.
- Every new dependency: verify the current stable version, peer ranges, and install scripts (ADR-016, ADR-018); record the decision with sources and the date in `docs/DECISIONS.md`. No external fonts, scripts, images, analytics, or services at runtime; the CSP stays `'self'` only.
- UI strings live only in the catalogs with typed keys; components and domain code contain no user-facing text. Every reason code, status, input error, contradiction, relaxation, exclusion item, uncertainty reason, assumption code, unit, and allergen has a catalog entry in all three locales. Use plural forms where a count appears.
- Format numbers with `Intl` from the displayed (rounded) values of `roundForDisplay`; fit statuses come from the engine, never from rounded values. When a rounded value looks like it meets a bound that the full value misses, show the one-decimal value with "just below the target" (`docs/NUTRITION_CALCULATION.md` §8).
- Follow `docs/CONTENT_POLICY.md` in every locale: values are estimates; the allergen disclaimer is always visible with allergen features; presets are examples; the targets screen notes that people under medical or dietitian guidance should follow it; no health or efficacy wording. Extend the forbidden-expression check to the UI catalogs.
- Translations: Claude drafts `en` and `es`; the owner reviews the diff (ADR-007). Safety-relevant texts (allergen warnings, disclaimers, doneness, frying cautions) are short, plain, and back-translated in the summary for the owner.
- Targets, conditions, and session state stay in memory and never go into URLs (ADR-015). Nothing except the locale preference is stored unless the owner decides otherwise (open question 5).
- Semantic HTML, keyboard operation, visible focus, labelled controls, correct `lang`, statuses not by color alone, reduced motion, mobile first. Verify changes in the browser preview (desktop and 375 px mobile width, all three locales) and report what was and was not checked.

## Stages

### 4.1 UI design proposal (owner review before implementation)
Propose and wait for approval:
1. **Screens and flow** (`docs/SPEC.md` §4, §7): targets and conditions (quick and advanced), candidates (3–5 cards, select up to 3 to compare), comparison, recipe detail with adjustment, re-suggestion, and the exceptional states. Describe each screen's content and states as text wireframes for mobile and desktop.
2. **Navigation and state**: whether to use a router (and which), which views get a URL (for example a recipe detail by ID, never targets or conditions), what happens on reload or back navigation when the in-memory state is gone, and where the pool and session live (React state, a reducer, or a small store).
3. **Styling**: Tailwind CSS (ADR-014 candidate) or plain CSS as now; layout system, color tokens with sufficient contrast, status markers that do not rely on color.
4. **Catalog structure**: namespaces and keys for statuses, reason codes, input errors, contradictions, relaxations, exclusion items, uncertainty reasons and assumptions, household units with plurals (`piece` shows the number alone in `en` and `es`, ADR-026), allergen names (glossary), disclaimers, and attribution (「日本食品標準成分表（八訂）増補2023年から引用」 followed by the localized equivalent).
5. **Decisions to propose, each with options and a recommendation**:
   - Card reason line: which reason code is shown first, and how many.
   - Input: number fields and steppers for targets with `INPUT_LIMITS`, preset selection, how contradictions (blocking and warning) and input errors are shown, and whether the limits or thresholds need to change (open question 19; changing them needs an ADR).
   - Ingredient autocomplete for required and excluded foods: locale-aware normalization (`docs/ARCHITECTURE.md` §4), aliases (open question 14), any-of groups for required foods (for example "chicken": all chicken cuts), and the "not supported" state.
   - Relaxation display, including whether combined equipment options are needed (open question 20; changing the engine needs an ADR).
   - "Show a different type" when only close alternatives remain (Stage 3.7 observation): message and controls.
   - Adjustment controls: servings, steppers on the authored grid, whole units, sides on and off, substitutions from the recipe's list, "fit to my targets" (the Phase 3 solver), and how differences from the previous state are shown ("protein +8 g").
   - Seed for "show a different type": starts at 0 and increments (ADR-029 D6) or another rule.
   - Browser storage of targets and viewed recipes (open question 5): none, or opt-in local storage with a clear control; privacy impact.
   - Where the recommendation runs (main thread or a worker), with a plan to measure it in browsers including a phone-class device profile (open question 17).
   - Accessibility test tooling: axe-core in Vitest with jsdom for the three locales in this phase; Playwright stays in Phase 5 unless the owner decides otherwise.
6. **Dependencies**: each proposed package with version, purpose, size impact, and install-script review.

### 4.2 Foundation
1. Approved dependencies, layout shell, navigation, and state container.
2. Formatting helpers in `src/` (numbers, units, ranges, gaps, percentages) on top of `roundForDisplay`, with tests in all three locales (for example the decimal comma in Spanish).
3. Catalog skeleton for every code listed in the working rules, with a test that every engine code has a key in each locale.

### 4.3 Targets and conditions
1. Quick inputs (preset, maximum time) and the collapsible advanced section (kcal, protein, fat, carbohydrate, effort, cuisines, excluded ingredients, allergens, equipment, required ingredients).
2. Validation messages from `InputError`; contradictions from `checkContradictions` before searching; the medical guidance notice; presets labelled as examples.
3. Tests: every input error and contradiction has a message in each locale; keyboard operation; values reach `evaluatePool` unchanged.

### 4.4 Candidates, comparison, re-suggestion, exceptional states
1. Candidate cards (`docs/SPEC.md` §7): name, time, effort, the four nutrients against the targets with status text and marker, ranges when shown, the "adjusted" badge with its summary, the reason line, the uncertainty badge, the allergen notice, required ingredients used.
2. Comparison of 2–3 candidates side by side.
3. Re-suggestion: "show a different type", "exclude this one", relaxation options with their gains; close alternatives clearly separated with their gaps; no candidates with exclusion counts; content failure with retry.
4. Tests for each state, including the empty pool, fewer than three, blocked contradictions, and exhaustion.

### 4.5 Recipe detail and adjustment
1. Ingredients with grams and the authored household measure (labels and plurals from the catalogs), food mapping (food name, code, state), per-ingredient and per-serving nutrition, ranges, uncertainty reasons, assumptions, incompleteness ("unknown", never zero), data versions, attribution, and the estimates and allergen disclaimers.
2. Steps (side steps hidden when the side is off, amount notes from `atLeastGrams`), safety notes including substitution changes, substitutions from the recipe's list.
3. Adjustment with instant recalculation through the nutrition engine, differences from the previous state, status changes, and "fit to my targets".
4. Tests: switching the locale never changes a displayed value's underlying number; recalculation matches `calculateNutrition` for the same state.

### 4.6 Localization review
1. Complete `en` and `es` drafts for every new key; glossary consistency; the forbidden-expression check over the UI catalogs; back-translations of safety-relevant texts for the owner.
2. Layout with long Spanish strings at 375 px; document language metadata per locale.

### 4.7 Accessibility, browser checks, acceptance
1. Automated accessibility checks in `ja`, `en`, and `es` for every screen and exceptional state.
2. Browser preview checks of the full flow on desktop and mobile widths in the three locales, with screenshots or recorded observations; console and network clean; production headers with `npm run preview`.
3. Browser timing of a full recommendation, a re-suggestion, and a recalculation (open question 17); record the numbers, the browser, the device or profile, and the date.
4. Record the storage decision (open question 5) and update the documentation (`docs/ARCHITECTURE.md`, `docs/DEVELOPMENT.md`).

## Out of scope
- Engine behavior changes beyond what the owner approves with an ADR; new formulas, tolerances, or bands.
- Authoring the remaining recipes toward about 60 (decided with the owner before Phase 5).
- The Playwright E2E suite, CI, the deployment runbook, and any deployment (Phase 5), unless the owner decides otherwise in 4.1.
- Any external service, analytics, or AI.

## Acceptance
- The full flow (targets → conditions → candidates → comparison → detail → adjustment → re-suggestion) works on mobile and desktop in `ja`, `en`, and `es`, including every exceptional state of `docs/SPEC.md` §12.
- Every engine code and every UI string exists in the three locales (type check and tests); the forbidden-expression check covers the UI catalogs.
- Displayed values come from the engines and are formatted per locale; switching the locale changes no underlying value.
- Accessibility checks pass in the three locales; keyboard operation and visible focus are verified.
- Browser timing is measured and recorded; the storage decision is recorded.
- `npm run check` (lint, type-check, tests, content validation, build) passes.
