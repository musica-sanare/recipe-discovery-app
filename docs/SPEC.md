# Product Specification — Recipe Discovery

Status: **Draft baseline (2026-10-18)**. Items marked *Provisional* are placeholders to be validated in Phase 0 (`docs/IMPLEMENTATION_PLAN.md`); they are not final requirements. Decisions and their status are recorded in `docs/DECISIONS.md`.

## 1. Product goal

Help nutrition-conscious users find dishes that fit their nutrition targets and practical conditions, and that they would not have thought of on their own. The app widens the user's cooking repertoire by presenting several diverse candidates, explaining how each one fits the targets, and letting the user compare, adjust, and choose.

This is not an AI recipe generator. Recipes are curated, structured content; nutrition values are calculated deterministically from food composition data and explicit amounts.

Core values:
- Support nutrition targets such as high protein, low fat, and calorie ranges.
- Calculate nutrition from food composition data and stated amounts, never from AI self-reporting.
- Consider cooking time, effort, preferences, exclusions, and optionally required ingredients.
- Present diverse candidates and explain why each was chosen and how it fits the targets.
- Never present uncertain values or food mappings as exact.
- Be explicit about the limits of allergen filtering; never guarantee allergen safety.

## 2. Target users and scenarios

| Persona | Scenario | Typical conditions |
|---|---|---|
| P1 Office worker in a cutting phase (primary) | Weeknight dinner; wants something new instead of the usual chicken and broccoli | ~500–650 kcal per meal, protein ≥ 35 g, fat ≤ 15 g, ≤ 20 min |
| P2 Student in a bulking phase | Filling, high-protein meals with low effort | ~800 kcal, protein ≥ 45 g, low effort |
| P3 Batch cook | Cooks several servings on the weekend | Multiple servings, interest in storage notes |
| P4 Strict pre-competition dieter (caution) | Tight fat and calorie control | The app's estimates may not be precise enough; the UI must say that strict control requires weighing and checking product labels |

Out of target: people following medically prescribed diets (for example protein restriction for kidney disease, or diabetes management). The target settings show a notice that people under medical or dietitian guidance should follow that guidance.

## 3. Scope

### MVP / P0
- Nutrition targets per meal: presets (cut / maintain / bulk) and custom values.
- Conditions: maximum time, effort, cuisine and style preferences, excluded ingredients, allergen exclusion (best effort), equipment, and optional required ingredients.
- 3–5 diverse candidates per request, with comparison of 2–3 candidates side by side.
- Recipe detail: ingredients with amounts, steps, nutrition breakdown, calculation basis, uncertainty, food safety notes, attribution.
- Serving count changes, bounded amount adjustment, predefined substitutions, and instant recalculation.
- Re-suggestion: "show a different type", "exclude this one", and relaxation suggestions when few candidates exist.
- Japanese, English, and Spanish for UI and all content, with a visible language switcher.
- Exceptional-state UX (section 12).

### Out of scope for MVP
- User accounts, server-side storage, daily or weekly meal planning, shopping lists.
- AI at runtime (recipe generation, free-text parsing, AI explanations, AI substitution suggestions).
- Packaged-product nutrition (barcodes, Open Food Facts), prices, external service integrations, analytics.
- Photos other than original photos owned by the project (none planned for the MVP).
- Regional ingredient availability (only a note where an ingredient may be hard to find).

## 4. User flow

```
Home
 → Targets and conditions (one screen)
     - Quick inputs: target preset, maximum time
     - Advanced (collapsible): kcal/protein/fat/carbohydrate values, effort,
       preferences, exclusions, allergens, equipment, required ingredients
 → Candidates (3–5 cards, diverse; select up to 3 to compare)
     ├→ Comparison view (2–3 candidates side by side)
     └→ Recipe detail
           → Adjust (servings, bounded amounts, substitutions → instant recalculation with differences)
 → Re-suggest (different type / exclude this one / relax a condition)
```

- The flow state stays in memory. Targets and conditions are never put in the URL, so body-related targets do not end up in history or referrers.
- Nothing except the locale preference is stored in the browser in the MVP (section 16, ADR-030 D9).

## 5. Inputs

| Input | Default | Required | Kind |
|---|---|---|---|
| Target preset (cut / maintain / bulk) | maintain | Yes (preset fills the values) | Fills the values below |
| Calories per meal (range) | from preset | Yes | Soft (ranking tier) |
| Protein minimum | from preset | Optional | Soft (ranking tier) |
| Fat maximum | from preset | Optional | Soft (ranking tier) |
| Carbohydrate range | none | Optional | Soft (ranking tier) |
| Servings | 1 | Yes | Calculation basis |
| Maximum cooking time | none | Optional | **Hard** |
| Effort (3 levels) | none | Optional | Soft |
| Cuisine and style preferences | none | Optional | Soft |
| Excluded ingredients | none | Optional | **Hard** |
| Allergen exclusion | none | Optional | **Hard, best effort** (`docs/CONTENT_POLICY.md`) |
| Equipment (for example microwave only) | none | Optional | **Hard** |
| Required ingredients ("ingredients I want to use") | none | Optional | **Hard** (recipes must contain all of them) |

- Nutrition targets are not hard filters: estimation error would make borderline recipes disappear and empty results would become common. Fit tiers are used instead (section 6).
- Preset values are examples, not advice. The app does not calculate targets from body weight or other personal data.
- Ingredient inputs (required, excluded) are chosen from the food dictionary with locale-aware autocomplete, so unsupported ingredients cannot be entered. Search uses localized names and aliases (`docs/ARCHITECTURE.md` "Localization").
- Input validation detects contradictory targets before searching (section 12).

## 6. Ranking, diversity, and re-suggestion

1. Apply hard constraints.
2. For each remaining recipe, evaluate the target fit at the default amounts and, where allowed, with bounded amount adjustment (section 8).
3. Group recipes into fit tiers: all targets met, some targets near (within tolerance), some targets not met.
4. Within the best available tier, select candidates with a deterministic diversification step so that the set varies in main protein source, cuisine, and cooking method. Remaining ties use preference scores, then the smaller amount change, then a seeded order with the recipe ID as the last tie-break.
5. "Show a different type" draws the next diverse set from the same eligible pool with a seeded, reproducible order, excluding candidates already shown in the session.

Tolerance: ADR-025. Fit evaluation with ranges, tiers, the solver objective, diversification (with a derived cooking-method family), preferences as a lexicographic key without weights, the seeded order, hard filters, relaxation, and contradiction checks: ADR-029.

## 7. Candidate card and recipe detail

Candidate card:
- Recipe name, time, effort.
- kcal / protein / fat / carbohydrate per serving, each shown against the target band with a status (met / near / not met; unknown when a source value is unmeasured).
- "Adjusted" badge with the adjustment summary when amounts were adjusted (for example "chicken breast 120 g → 160 g").
- One-line deterministic reason (for example "Meets the protein target with the lowest fat of these candidates").
- Uncertainty badge when the estimate includes approximations; allergen notice when relevant.
- Required ingredients used, when the user specified any.

Recipe detail:
- Ingredients with grams and the authored household measure, each with its food mapping (food name, food code, raw or cooked state).
- Nutrition per ingredient and per serving, with totals.
- Uncertainty details (approximations, assumptions, trace values).
- Steps, food safety notes, substitutions, adjustment controls.
- Attribution: 「日本食品標準成分表（八訂）増補2023年から引用」 plus a statement that the values are this app's own calculated estimates, and the data version.
- Disclaimers: estimates only; allergen filtering is not a guarantee.

## 8. Adjustment, substitution, and recalculation

- All recalculation runs in the browser with deterministic functions and updates instantly, showing differences from the previous state (for example "protein +8 g, fat +3 g") and status changes.
- Servings scale every ingredient.
- Bounded adjustment: each recipe defines which ingredients may change, their minimum and maximum, step size, and linked ingredients (for example seasonings scale with the main ingredient). Integer units are respected (for example whole eggs). Steps may define notes that appear above a threshold (for example "use a larger pan").
- "Fit to my targets" (in the MVP, ADR-024): selects the in-bounds amounts of the main protein and carbohydrate that meet the targets with the smallest change from the default amounts. Sides (rice, potatoes, vegetable sides) can be switched on and off; the solver may switch off carbohydrate sides only, and a side that stays on keeps at least its authored minimum portion (ADR-026).
- Substitutions come only from each recipe's predefined substitution list; they may switch related notes and times.

## 9. Nutrition display and uncertainty

Rules are in `docs/NUTRITION_CALCULATION.md`. User-facing behavior:
- Values are labelled as estimates.
- Each ingredient's contribution, food code, data version, and cooking state are visible.
- Uncertainty classes: exact mapping, approximation (similar food, raw or related cooked value used for a cooked ingredient, fried foods with a tabulated fried form), and hard-to-estimate (slow frying in a lot of oil, fried foods without a tabulated form). Household measures such as "a pinch" are display aids; the calculation uses the stated grams. Approximations are explained; large uncertainty is shown as a range.
- When a value range straddles a target boundary, the status is "near / uncertain", never "met".
- Energy is taken from the source tables and may not equal 4P + 9F + 4C; the detail view explains why.

## 10. Localization

- Locales: `ja`, `en`, `es`. Default and detection behavior follows `docs/ARCHITECTURE.md` "Localization".
- Localized: UI strings, recipe names, ingredient display names and search aliases, steps, notes, substitutions, validation and error messages, accessibility labels, document language metadata.
- Every published recipe and food must have complete content in all three locales; the build fails otherwise. Runtime content fallback is therefore not needed for published content.
- Numbers and units are formatted per locale (for example decimal comma in Spanish). Underlying values never change.
- Calculated nutrition values are identical in every locale.

## 11. Allergens, food safety, and health expressions

Defined in `docs/CONTENT_POLICY.md`. Summary:
- Allergen exclusion is best effort; ingredients with unknown allergen information are treated as "may contain"; the app never claims a recipe is safe for allergic users.
- Every recipe includes the relevant food safety notes (for example cooking meat through; handling hot oil).
- No health, medical, or efficacy claims.

## 12. Exceptional states

| Situation | Behavior |
|---|---|
| No candidates | Show how many recipes each hard constraint excluded and deterministic relaxation options with resulting counts (for example "allow 30 minutes: +4 recipes") |
| Fewer than 3 candidates | Show them, then clearly separated "close alternatives" with the unmet targets (for example "fat +4 g over") |
| Contradictory targets | Detect before searching (for example a protein minimum whose energy alone approaches the calorie maximum) and explain |
| Required ingredients leave too few recipes | Same as no or few candidates, including "remove this required ingredient: +N" |
| Allergen data unknown for an ingredient | Excluded when an allergen filter is active, with the reason shown |
| Content fails to load | Retry action (content is static, so this should be rare) |
| Unsupported ingredient | Not possible through the dictionary input; the autocomplete shows "not supported" when nothing matches |

## 13. Privacy and security

- No accounts and no server-side storage in the MVP; the MVP has no application server.
- Targets and conditions stay in the browser and are not put in URLs.
- No analytics or trackers by default.
- Strict security headers (Content-Security-Policy and related headers) on all responses.
- Any future server endpoint must validate inputs and outputs at runtime and must not log user targets or conditions.

## 14. Accessibility and UX

- Responsive layout for mobile and desktop; mobile-first.
- Semantic HTML, keyboard operation, visible focus, labelled controls, correct `lang` attributes.
- Comparison and nutrition bars must not rely on color alone; values are always available as text.
- Reduced-motion support.
- Accessibility checks run in all three locales.

## 15. MVP acceptance criteria

- The complete flow (targets → conditions → candidates → comparison → detail → adjustment → re-suggestion) works on mobile and desktop without AI.
- The same input and data always produce the same candidates, order, and nutrition values.
- For the same recipe and amounts, internal nutrition values are identical in `ja`, `en`, and `es`.
- All UI strings and all published content exist in the three locales (checked at build time).
- Every nutrition value is traceable to food codes, data version, cooking state, and assumptions.
- Unmeasured source values are never treated as zero; approximations and hard-to-estimate items are always shown.
- An active allergen filter excludes recipes with matching or unknown ingredients, and the disclaimer is always visible.
- No content contains health or efficacy claims (content validation).
- Attribution to the source tables is shown.
- Lint, type-check, unit tests, content validation, E2E tests, accessibility checks in three locales, and the production build pass.

## 16. Provisional and decided values

| Item | Provisional value | Decided in |
|---|---|---|
| Fit tolerance | **decided**: ±10% (protein: up to 3 g below the minimum) (ADR-025) | Phase 0 |
| Display rounding | **decided**: kcal to 10, protein/fat/carbohydrate to whole grams; status from full precision (ADR-025) | Phase 0 |
| Range display rule | **decided**: per-ingredient error bands by reason; range shown when wider than twice the display unit (ADR-025) | Phase 0 |
| Initial recipe count | **decided**: about 60, with composition rules (ADR-023) | Phase 0 |
| Amount adjustment scope | **decided**: main protein and carbohydrate only, with sides that can be switched off (ADR-024, revised in Phase 1) | Phase 0 |
| Browser storage of targets and viewed recipes | **decided**: none in the MVP; only the locale preference is stored (ADR-030) | Phase 4 |
| Preset values | cut 450–650 kcal / P ≥ 35 g / F ≤ 15 g; maintain 550–750 / ≥ 30 / ≤ 20; bulk 750–950 / ≥ 45 / ≤ 30 | Phase 0 (decided, ADR-025) |

## 17. Open questions (要確認)

Tracked in `docs/DECISIONS.md` "Open questions".
