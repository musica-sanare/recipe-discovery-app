# UI Design — Recipe Discovery

Status: **Accepted (owner, 2026-10-19, Stage 4.1)**. Decisions and their alternatives: `docs/DECISIONS.md` ADR-030. This document describes the screens, navigation, state, styling, and catalog structure of the MVP user interface (Phase 4). It does not change any engine behavior; every value and status shown comes from `domain/nutrition` (ADR-028) and `domain/recommendation` (ADR-029).

## 1. Principles

- The UI turns engine codes and numbers into localized texts and locale-formatted values. It never computes, adjusts, or re-rounds a nutrition value or a fit status.
- Numbers are formatted with `Intl` from the values of `roundForDisplay`; statuses come from the engine's full-precision fit (`docs/NUTRITION_CALCULATION.md` §8).
- Targets, conditions, and session state stay in memory. They never appear in URLs or in `history.state`, and nothing except the locale preference is stored (ADR-015, ADR-030 D9).
- Every status has a text and a marker shape in addition to its color.
- Mobile first: one column below 768 px; wider layouts add columns but keep the same order of content for screen readers.

## 2. Views and flow

```
Targets and conditions ──search──► Candidates ──select 2–3──► Comparison
         ▲                            │   ▲                        │
         │ edit conditions            │   └──────── back ──────────┘
         └────────────────────────────┤
                                      └──open──► Recipe detail (adjustment)
```

| View | URL | Content after reload |
|---|---|---|
| Targets and conditions | `/` | Preset defaults (nothing is restored) |
| Candidates | `/` (history entry with the view name only) | Targets view with the notice "Your conditions are not kept after reloading" |
| Comparison | `/` (history entry with the view name only) | Same as candidates |
| Recipe detail | `/recipes/<id>` | The recipe at its default amounts with no fit status; a link to the targets view |
| About | `/about` | The same page (it needs no search); reached from the footer |

- The browser back button moves between views through history entries that carry only the view name and, for the detail view, the recipe ID.
- An unknown recipe ID shows a "recipe not found" state with a link to the targets view.
- Focus moves to the view's `h1` after each view change, and the document title includes the view name.

## 3. Screens (text wireframes)

### 3.1 Targets and conditions

Mobile (375 px):
```
┌─────────────────────────────────┐
│ Recipe Discovery   [Language ▾] │
├─────────────────────────────────┤
│ h1 Targets and conditions       │
│ (i) If you follow advice from a │
│     doctor or dietitian, …      │
│                                 │
│ Example targets (presets)       │
│ (•) Cut example 450–650 kcal …  │
│ ( ) Maintain …  ( ) Bulk …      │
│ "Examples, not recommendations" │
│                                 │
│ Max. cooking time [20] min [-][+]│
│                                 │
│ > More conditions (collapsible) │
│   Energy [450]–[650] kcal       │
│   Protein min. [35] g           │
│   Fat max. [15] g               │
│   Carbohydrate [  ]–[  ] g      │
│   Servings [1] [-][+]           │
│   Effort ( )any ( )1 ( )2 ( )3  │
│   Cuisine [ ]Japanese [ ]Chinese│
│   Equipment (•)no limit         │
│     ( )microwave only ( )choose │
│   Use these foods [search…] chips│
│   Leave out foods [search…] chips│
│   Allergens [ ]egg [ ]milk …    │
│   (!) Allergen info is best …   │
│                                 │
│ [(!) warning / (x) cannot search]│
│ [        Find recipes         ] │
└─────────────────────────────────┘
```
Desktop (≥ 1024 px): the same form in two columns (targets left, conditions right); the search button and the contradiction message sit below both columns.

States:
- Input errors (`InputError`) appear next to their field (`aria-describedby`) on blur and on submit; on submit, focus moves to an error summary that links to each field.
- A blocking contradiction disables nothing but stops the search and shows an alert with the numbers (for example "protein 60 g alone is about 240 kcal…"); a warning appears above the button and the search runs.
- Changing a preset overwrites the four target fields; editing a field afterwards keeps the chosen preset's label with "(edited)".
- Content loading and the content error with retry appear in place of the form.

### 3.2 Candidates

Mobile:
```
┌─────────────────────────────────┐
│ h1 Candidates (5)  [Edit conditions]│
│ Summary: 450–650 kcal, P ≥ 35 … │
├─────────────────────────────────┤
│ ┌ card ───────────────────────┐ │
│ │ h2 Lemon-herb chicken breast │ │
│ │ 25 min · effort 2 · Japanese │ │
│ │ ✓ Meets all targets          │ │
│ │ Adjusted: chicken 120→160 g  │ │
│ │ Energy 520 kcal ✓ in range   │ │
│ │ Protein 43 g ✓ min. 35       │ │
│ │ Fat 8 g ✓ max. 15            │ │
│ │ Carbohydrate 52 g – no target│ │
│ │ Lowest fat of these          │ │
│ │ ◐ includes approx. (!) allergens│
│ │ [Details] [☐ Compare] [Exclude]│
│ └─────────────────────────────┘ │
│ … more cards …                  │
│ [Show a different type]         │
│ [Compare (2)]  (sticky bar)     │
│                                 │
│ ── Close alternatives           │
│ card … fat 4 g over             │
│                                 │
│ ── If you relax a condition     │
│ Up to 30 min: +4 meet, +1 near  │
│ [Apply]                         │
│                                 │
│ Values are estimates …          │
└─────────────────────────────────┘
```
Desktop: cards in a grid of two or three columns; the comparison bar stays at the bottom.

States:
- **Three to five candidates**: cards only.
- **Fewer than three**: the candidates, then a separated "close alternatives" section whose cards show the gaps (`near_target`, `misses_target`, `unknown_value`, `range_straddles`).
- **None**: a message, the exclusion counts per hard constraint ("time limit: 7 recipes"), and the relaxation options with their gains; plus the alternatives when the pool is not empty.
- **Exhausted** ("show a different type" finds no new recipe that meets the targets): the current set stays on screen with the notice "All recipes that meet your targets have been shown" and the actions "show close alternatives" and "change conditions" (ADR-030 D5).
- **Exclude this one**: the card is replaced in place; the others keep their position; focus moves to the new card's heading.
- Relaxation "apply" changes that one condition, runs the search again, and announces the new count in a live region.

### 3.3 Comparison

Mobile: a table with one column per recipe (2–3), horizontally scrollable within its own container with the nutrient names as sticky row headers; the page itself never scrolls horizontally.
```
┌─────────────────────────────────┐
│ h1 Compare       [Back]         │
│ ┌──────────┬────────┬────────┐  │
│ │          │ Recipe A│ Recipe B│ │
│ │ Time     │ 25 min │ 15 min │  │
│ │ Energy   │ 520 ✓  │ 610 ✓  │  │
│ │ Protein  │ 43 ✓   │ 36 ✓   │  │
│ │ Fat      │ 8 ✓    │ 14 ✓   │  │
│ │ Carb.    │ 52     │ 70     │  │
│ │ Adjusted │ yes    │ no     │  │
│ │ Approx.  │ yes    │ no     │  │
│ │          │[Details]│[Details]│ │
│ └──────────┴────────┴────────┘  │
└─────────────────────────────────┘
```
Desktop: the same table without horizontal scrolling.

### 3.4 Recipe detail and adjustment

Mobile:
```
┌─────────────────────────────────┐
│ h1 Recipe name    [Back]        │
│ 25 min · effort 2 · stove, pan  │
│ (!) Allergens: egg (contains) … │
├─────────────────────────────────┤
│ Per serving (estimates)         │
│ Energy 520 kcal ✓ (500–540)     │
│ Protein 43 g ✓                  │
│ Fat 8 g ✓ · Carbohydrate 52 g   │
│ Since last change: protein +8 g │
│ Status: fat near → met          │
├─────────────────────────────────┤
│ Adjust                          │
│ Servings [2] [-][+]             │
│ Chicken breast [160] g [-][+]   │
│ Eggs [2] [-][+]                 │
│ Side: rice [on/off]             │
│ Substitute: ( )none ( )thigh    │
│ [Fit to my targets] [Reset]     │
├─────────────────────────────────┤
│ Ingredients (2 servings)        │
│ Chicken breast 320 g (2)        │
│   Food: young chicken breast,   │
│   skinless, raw · 11220 ·       │
│   raw value used (approx.)      │
│   protein … g / fat … g         │
│ …                               │
├─────────────────────────────────┤
│ Steps 1. … 2. … (amount notes)  │
│ Safety notes …                  │
├─────────────────────────────────┤
│ How this is calculated (toggle) │
│ Approximations, assumptions,    │
│ unknown values; energy note     │
│ Source: 日本食品標準成分表（八訂）│
│ 増補2023年から引用 + translation │
│ Data 2026-03-27 · content …     │
└─────────────────────────────────┘
```
Desktop: two columns; the nutrition summary and adjustment controls stay in a sticky right column while ingredients and steps scroll on the left.

States:
- Without a search (direct link or reload): default amounts, no fit statuses, no "fit to my targets".
- An invalid adjustment state cannot be reached through the controls (steppers follow the authored grid and bounds); engine errors are still mapped to messages.
- Unknown values show "unknown" with the ingredients that lack data, never zero.
- When a rounded value looks like it meets a bound that the full value misses, the value is shown to one decimal with "just below the target" (or "just above").

### 3.5 Shared elements

- Header: app name, language switcher. Footer: attribution, content and composition versions, and a link to the about page.

### 3.6 About

- `h1` "About this app" and a link to the targets view, then sections with `h2` headings: what the app does ("What this app does") and that it follows fixed rules without AI; how nutrition values are calculated (estimates, cooked values and weight change rates, approximations and hard-to-estimate items, ranges, unmeasured values shown as unknown, strict-control note); source and data versions (attribution as in the footer); allergens (the allergen disclaimer, unknown treated as "may contain"); health (not medical advice, presets as examples, medical guidance); what the app does not do; privacy (no analytics, cookies, ads, or external requests; only the language choice is stored; targets and conditions stay in memory and never enter the URL); open-source licenses with a link to `/third-party-licenses.txt`, generated by `build.license` (Vite).
- No contact address (docs/DECISIONS.md "Stage 5.1 release plan" P7).
- Comparison table (§3.3) and the ingredient table of the detail view (§3.4): the visible caption sits above the scrolling region and labels it; the table keeps a visually hidden `caption`, so the caption no longer scrolls with the table.
- The estimates disclaimer appears on candidates, comparison, and detail views; the allergen disclaimer appears wherever allergen features appear.
- A live region announces search results, replacements, and recalculations.

## 4. Navigation and state

- No router library (ADR-030 D2). `src/navigation/` wraps the History API: views `targets`, `candidates`, `comparison`, `detail` (with a recipe ID), and `about`. Only the detail view (`/recipes/<id>`) and the about page (`/about`) have their own paths; the others use `/` with the view name in `history.state`. `popstate` restores the view; if the view needs a search that is no longer in memory, the targets view is shown with the notice.
- Application state lives in one `useReducer` behind a context (`src/state/`): the request, the evaluated pool, the session, the seed, the displayed set, the comparison selection, and per-recipe adjustment states. No store library.
- The pool is recomputed only when the request changes; "show a different type", "exclude this one", and comparison use `selectCandidates` on the same pool.
- The seed starts at 0 for every new search and increases by 1 for each "show a different type" (ADR-029 D6).
- The recommendation runs on the main thread; phone-class timing is measured in Stage 5.4 (about 80 ms at a 4× CPU slowdown) against a threshold of about 100 ms (ADR-030 D10, revised).

## 5. Styling

- Tailwind CSS v4 through `@tailwindcss/vite`, with design tokens defined in CSS (`@theme`) (ADR-030 D3). No external fonts; system font stacks per script (Japanese and Latin).
- Breakpoints: base (mobile) and `md` 768 px, `lg` 1024 px.
- Color tokens meet WCAG 2.2 AA (4.5:1 for text, 3:1 for markers and focus rings) against their backgrounds; a test checks the token pairs because jsdom cannot compute contrast.
- Status markers: met ✓ (filled circle), near ◐ (half circle), not met ✕ (outlined), unknown ? (dashed); always with text.
- Visible focus ring on every interactive element; `prefers-reduced-motion` disables transitions.

## 6. Catalog structure

`ja` defines the type; `en` and `es` must match (`src/i18n/messages/`). New namespaces:

| Namespace | Keys |
|---|---|
| `nav` | View names, back links, reload notice, not-found |
| `targets` | Preset names and "example" labels, fields, units, help, the medical guidance notice, the search button, error summary |
| `conditions` | Time, effort levels, cuisines (`CUISINES`), equipment (`EQUIPMENT`) and equipment modes, required and excluded foods, food groups, autocomplete states (no match = "not supported") |
| `inputError` | One key per `InputError` code, with the field names and limits as values |
| `contradiction` | `minimum_energy_exceeds_kcal_max` blocking and warning |
| `status` | `met`, `near`, `not_met`, `unknown`, target-less, "just below/above the target" |
| `reason` | One key per `ReasonData` code, with targets and attributes as sub-keys |
| `exclusion` | One key per `ConstraintItem`, with plural counts |
| `relaxation` | One key per `Relaxation` constraint, with gains as plural counts |
| `candidates`, `comparison`, `detail`, `adjust` | View texts, adjustment summary, differences, status changes |
| `nutrient` | Display names of the five nutrients and their units |
| `uncertainty` | Classes and reasons (`raw_value_for_cooking`, `related_cooked_value`, `post_cooking_refuse`, `fried`, `slow_frying`, `estimated_source_value`), notations (trace, estimated) |
| `assumption` | `oil_counted_in_full`, `included_in_cooked_value`, `parts_removed_after_cooking`, `energy_from_fat`, `pinch_as_stated_grams`, energy versus 4P + 9F + 4C |
| `unit` | Household units (`HOUSEHOLD_UNITS`) with plural forms; `piece` shows the number alone in `en` and `es` (ADR-026); grams, kcal, minutes |
| `allergen` | Names of all `ALLERGENS` (glossary terms) and the confidence levels |
| `disclaimer` | Estimates, allergens, strict control (P4: weigh and check labels) |
| `attribution` | The MEXT wording in Japanese in every locale, followed by the localized equivalent, the data version, and "this app's own calculations" |

- Counts use i18next plural suffixes (`_one`, `_other`). Every locale defines both keys because `ja` defines the catalog type; Japanese plural rules select `_other` only, so both hold the same Japanese text.
- Household units choose the singular up to one unit ("1/2 clove", "1 1/2 cloves"); quantities are shown as fractions of twelfths ("1/2", "1 1/2"; Japanese "1と1/2", Spanish "1 y 1/2").
- A test requires a key for every engine code (input errors, contradictions, statuses, reasons, constraint items, relaxations, uncertainty reasons, assumptions, units, allergens, cuisines, equipment) in each locale.
- The forbidden-expression check of `content/glossary.ts` is extended to the UI catalogs.

## 7. Input details

- Number fields: `<input type="text" inputmode="numeric">` with a visible unit, steppers (buttons with labels such as "increase protein minimum"), and values validated by `validatePoolRequest` with `INPUT_LIMITS` (unchanged, ADR-030 D4). Empty optional fields mean "no target".
- Ingredient autocomplete: the ARIA 1.2 combobox pattern over the food dictionary of the active text bundle. Normalization: `ja` NFKC and katakana-to-hiragana folding; `en` case folding; `es` case and accent folding. Matches names and aliases (ADR-030 D6). Results list the food's display name; no match shows "not supported".
- Food groups: the protein groups (`PROTEIN_GROUPS`) are offered as "chicken (any cut)" and so on. A group as a required item is one any-of item; a group as an exclusion adds every food of the group.
- Equipment: "no limit" (default), "microwave only", or "choose" with checkboxes (ADR-030 D7).

## 8. Adjustment details

- Servings stepper (1–20), steppers on the authored grid for grams and whole units, side switches, substitution radio buttons from the recipe's list, "fit to my targets" (applies the solver state of the pool entry; without a search it is hidden), and "reset to default".
- Every change recalculates with `calculateNutrition` and shows the difference from the previous state as the difference of the displayed (rounded) values, for example "protein +8 g, energy +60 kcal", and each status change (ADR-030 D8).
- Side steps are hidden when the side is off; amount notes appear from `atLeastGrams`; safety notes follow substitutions.
- A scaled count that is fractional is shown with one decimal in the ingredient list (ADR-028 F).
