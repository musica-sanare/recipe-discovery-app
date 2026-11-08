English | [日本語](../ja/UI_DESIGN.md) · [Docs index](README.md)

# UI Design — Recipe Discovery

This document describes the user interface of Recipe Discovery: views and flow, screen wireframes and states, navigation and state, styling, message catalogs, and input and adjustment details. It is for anyone who builds or reviews a screen. The UI changes no engine behavior: every value and status shown comes from `domain/nutrition` (ADR-028), `domain/recommendation` (ADR-029), and, for the shopping list, `domain/shopping`.

Status: **Accepted (owner, 2026-10-19, Stage 4.1)** for the MVP user interface (Phase 4). The shopping list (Phase 8, ADR-032, accepted 2026-10-25) adds §3.7. Decisions and their alternatives: [DECISIONS.md](../working/DECISIONS.md) ADR-030.

## 1. Principles

- The UI turns engine codes and numbers into localized texts and locale-formatted values. It never computes, adjusts, or re-rounds a nutrition value or a fit status.
- Numbers are formatted with `Intl` from the values of `roundForDisplay`; statuses come from the engine's full-precision fit ([NUTRITION_CALCULATION.md](NUTRITION_CALCULATION.md) §8).
- Targets, conditions, and session state stay in memory. They never appear in URLs or in `history.state`. Nothing except the locale preference is stored unless the user turns on saved conditions, which keeps the targets form on the device (ADR-015, ADR-030 D9, ADR-036).
- Every status has a text and a marker shape in addition to its color.
- Mobile first: one column below 768 px; wider layouts add columns but keep the same order of content for screen readers.

## 2. Views and flow

```mermaid
flowchart LR
    targets["Targets and conditions"] -->|"search"| candidates["Candidates"]
    candidates -->|"edit conditions"| targets
    candidates -->|"select 2–3"| comparison["Comparison"]
    comparison -->|"back"| candidates
    candidates -->|"open"| detail["Recipe detail (adjustment)"]
    detail -->|"add / update"| shopping["Shopping list"]
    shopping -->|"recipe link"| detail
    header["Header link (list not empty)"] --> shopping
```

| View | URL | Content after reload |
|---|---|---|
| Targets and conditions | `/` | Preset defaults, or the saved conditions with a notice when saving is on (ADR-036) |
| Candidates | `/` (history entry with the view name only) | Targets view with the notice "Your conditions are not kept after reloading"; with saving on, the notice says only that search results and the shopping list are not kept |
| Comparison | `/` (history entry with the view name only) | Same as candidates |
| Recipe detail | `/recipes/<id>` | The recipe at its default amounts with no fit status; a link to the targets view |
| About | `/about` | The same page (it needs no search); reached from the footer |
| Shopping list | `/` (history entry with the view name only) | Targets view with the reload notice, which also says that the shopping list is not kept |

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
│ Tagline        (hero art ≥ 640) │
│ (i) If you follow advice from a │
│     doctor or dietitian, …      │
│                                 │
│ ╭ panel: Example targets ─────╮ │
│ │ "Examples, not recommendations"│
│ │ ( ) Cut example 450–650 kcal │ │
│ │ (•) Maintain … (tinted card) │ │
│ │ ( ) Bulk …                   │ │
│ ╰─────────────────────────────╯ │
│ Max. cooking time [20] min [-][+]│
│                                 │
│ ╭ sky: > Describe in your own words╮
│ │ [text…]  [Read conditions]   │ │
│ ╰─────────────────────────────╯ │
│ ╭ panel: > More conditions ───╮ │
│ │ ◎ Targets per meal           │ │
│ │   Energy [450]–[650] kcal    │ │
│ │   Protein min. [35] g …      │ │
│ │   Servings [1] [-][+]        │ │
│ │ ◎ Cooking                    │ │
│ │   Effort · Cuisine · Equipment│ │
│ │ ◎ Foods                      │ │
│ │   Use these / Leave out chips│ │
│ │ ◎ Allergens                  │ │
│ │   (!) best effort …  [ ]egg …│ │
│ ╰─────────────────────────────╯ │
│ [(!) warning / (x) cannot search]│
│ ╭ butter: ◎ Save on this device╮ │
│ │ [ ] Save these targets and … │ │
│ │   [ ] Also save the allergens│ │
│ │ "Stays in this browser; …"   │ │
│ ╰─────────────────────────────╯ │
├─────────────────────────────────┤
│ [ ◎ Find recipes ] (sticky bar) │
└─────────────────────────────────┘
```
Desktop (≥ 1024 px): the same order in one column, with the hero illustration next to the heading and the groups inside "More conditions" in two or three columns; from 768 px the search button is a normal button below the form. Icons marked ◎ are the decorative two-tone icons of ADR-037.

States:
- Input errors (`InputError`) appear next to their field (`aria-describedby`) on blur and on submit; on submit, focus moves to an error summary that links to each field.
- A blocking contradiction disables nothing but stops the search and shows an alert with the numbers (for example "protein 60 g alone is about 240 kcal…"); a warning appears above the button and the search runs.
- Free-text conditions (ADR-034, revised again): a collapsible field below the time limit. "Read conditions" parses the text in the browser and shows what was read as a labelled list; nothing changes until "Apply", which adds foods and cuisines and replaces the time limit and equipment, then opens "More conditions" if it changed something there. A declined topic shows a message (allergens with a button that moves focus to the allergen choices); nothing recognized shows "no conditions found". Targets and allergens are never read. The result is announced in a polite live region.
- Saved conditions (ADR-036): a fieldset "Save on this device" above the search button. Its checkbox saves the form at once when turned on and deletes the record when turned off. While it is on, a second checkbox adds the allergen choices, and a "delete saved conditions" button deletes the record. A note says that the conditions stay in this browser, are sent nowhere, and can be seen by anyone who uses the browser. "Find recipes" saves the form as typed, before validation. After a reload, a restored record fills the form without searching, and a status at the top says so, with the number of items left out because the content no longer has them and its own delete button. "Deleted" and "could not be saved on this device" appear in a status inside the fieldset.
- Changing a preset overwrites the four target fields; editing a field afterwards keeps the chosen preset's label with "(edited)".
- Content loading and the content error with retry appear in place of the form.

### 3.2 Candidates

Mobile:
```
┌─────────────────────────────────┐
│ h1 Candidates (5)  [Edit conditions]│
│ Summary: 450–650 kcal, P ≥ 35 … │
├─────────────────────────────────┤
│ ╭ card (panel) ───────────────╮ │
│ │ [◎] h3 Lemon-herb chicken    │ │
│ │     ◷ 25 min · effort 2 · …  │ │
│ │     (★ New to you)           │ │
│ │ ✓ Meets all targets          │ │
│ │ Adjusted: chicken 120→160 g  │ │
│ │ Energy  [··(▓─●▓)··] 520 kcal│ │
│ │ ✓ in range  target 450–650   │ │
│ │ Protein [····(▓●▓▓▓]    43 g │ │
│ │ ✓ in range  min. 35 g        │ │
│ │ Fat 8 g … · Carb. 52 g …     │ │
│ │ ( Lowest fat of these )      │ │
│ │ (i) includes approx. (!) allergens│
│ │ (Details) [☐ Compare] (Exclude)│
│ ╰─────────────────────────────╯ │
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
Desktop: cards in a grid of two or three columns; the comparison bar stays at the bottom. Each card shows the main protein group's icon and the four nutrients as labelled lines (Stage 18.3, ADR-041 D4; revised in Stage 19.3): the label, a bar when the nutrient has a target, and the value on one row, then the status, the target or "no target", and the estimate range. When the inside of a card is narrower than 17 rem, the bar takes its own row below the label and the value. Statuses keep their marker shapes and texts.

- **Nutrition bar**: the target band in the nutrient's pastel (energy butter, protein mint, fat lilac, carbohydrate sky) with edges in `muted` on the sides the user set; the estimate range as a line when it is shown; the value as a dot. The scale runs from zero to 1.25 times the largest number among the value, the range, and the target (`src/views/nutritionBar.ts`); in the comparison view, the largest number of the whole row. The bar is drawn from the displayed numbers, so a value with "just below the target" sits left of the band. It is decorative (`aria-hidden`) and hidden in forced colors and in print; no bar is drawn without a target or for an unknown value.
- **"New to you"**: a sun-colored chip under the time line on candidates that no earlier set of this page showed. The first set of a page has none. The list of shown recipes lives in memory (`seen` in `src/state/reducer.ts`) and survives a new search, not a reload.

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
│ │ Energy   │520 kcal│610 kcal│  │
│ │ 450–650  │[·(●)·] │[·(─●)] │  │
│ │          │ ✓ met  │ ✓ met  │  │
│ │ Protein  │ 43 g … │ 36 g … │  │
│ │ Fat      │ 8 g …  │ 14 g … │  │
│ │ Carb.    │ 52 g … │ 70 g … │  │
│ │ Adjusted │ yes    │ no     │  │
│ │ Approx.  │ yes    │ no     │  │
│ │          │[Details]│[Details]│ │
│ └──────────┴────────┴────────┘  │
└─────────────────────────────────┘
```
Desktop: the same table without horizontal scrolling.

Nutrient rows (Stage 19.3):
- Each cell holds the value, the bar when a target is set, the status with "just below" or "just above" as on the cards, and the shown range. Unknown values have no bar.
- The row header names the target once, or "no target", because every recipe has the same target.
- The bars of a row share one scale, so their positions can be compared.
- Columns are fixed: the row headers are 116 px wide on phones and 176 px from `lg`, and the recipe columns are equal and at least 152 px wide.

### 3.4 Recipe detail and adjustment

Mobile:
```
┌─────────────────────────────────┐
│ h1 Recipe name    [Back]        │
│ 25 min · effort 2 · stove, pan  │
│ (!) Allergens: egg (contains) … │
├─────────────────────────────────┤
│ Per serving (estimates)         │
│ Energy                 520 kcal │
│ [······(▓▓─●▓▓▓)······]         │
│ ✓ in range  target …  500–540   │
│ Protein 43 g … Fat 8 g …        │
│ Carbs 52 g  Salt 1.8 g          │
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
│ Shopping list                   │
│ [Add to shopping list]          │
│ (after adding: In the list      │
│  (2 servings) · View the list;  │
│  [Update the list] [Remove] when│
│  the amounts differ)            │
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
Desktop (Stage 18.3, ADR-041 D4): from `lg`, the nutrition section moves to a right column of up to 22 rem and sticks below the header while the page scrolls, when the window is at least 48 rem high. The allergen notice, the adjustment, and the shopping list stay in the left column, so the values stay in view next to the steppers. The ingredients, the steps, the safety notes, and the basis follow below both columns at full width (Stage 19.3), so the ingredient table shows every column without scrolling from 1024 px. The DOM order is the order of the mobile layout. Only the nutrition sticks: a sticky adjustment would hide a focused stepper under the nutrition panel when moving backwards (WCAG 2.4.11).

States:
- Without a search (direct link or reload): default amounts, no fit statuses, no "fit to my targets".
- An invalid adjustment state cannot be reached through the controls (steppers follow the authored grid and bounds); engine errors are still mapped to messages.
- Nutrition lines (Stage 18.3, replacing the tiles of Stage 16.3): one line per nutrient as on the candidate cards, with the value at 24 px. Each line holds the value, the bar when a target is set, the status marker and text, the target or "no target", and the range; the label, not the color, names the nutrient. Salt equivalent has no target and no bar. The change summary keeps a transparent border, so forced colors draw its edge.
- Unknown values show "unknown" with the ingredients that lack data on their line, never zero, and no bar.
- When a rounded value looks like it meets a bound that the full value misses, the value is shown to one decimal with "just below the target" (or "just above").
- Shopping list (ADR-032): a section of its own after the adjustment section, available with and without a search.
  - "Add to shopping list" copies the current state (servings, amounts, sides, substitutions) into the list.
  - Afterwards the block shows "In the shopping list (2 servings)" with a link to the list. When the current state differs from the list entry, it offers "Update the list" and "Remove from the list".
  - With 10 recipes in the list, the add button is disabled and the reason is shown.
  - Adding, updating, and removing are announced in the live region; focus stays on the block.

### 3.5 Shared elements

- Header: the logo and the app name (one link to the targets view; the logo is decorative), a link to the shopping list with its recipe count, the language switcher, and the theme choice (system, light, or dark). The link appears only while the list has a recipe and may use a shorter label at narrow widths.
- Footer: attribution, content and composition versions, and a link to the about page.
- Comparison table (§3.3) and the ingredient table of the detail view (§3.4): the visible caption sits above the scrolling region and labels it. The table keeps a visually hidden `caption`, so the caption no longer scrolls with the table.
- The estimates disclaimer appears on candidates, comparison, and detail views. The allergen disclaimer appears wherever allergen features appear.
- A live region announces search results, replacements, and recalculations.

### 3.6 About

- `h1` "About this app" and a link to the targets view.
- Then sections with `h2` headings:
  - what the app does ("What this app does") and that it follows fixed rules without AI;
  - how nutrition values are calculated: estimates, cooked values and weight change rates, approximations and hard-to-estimate items, ranges, unmeasured values shown as unknown, strict-control note;
  - source and data versions (attribution as in the footer);
  - allergens: the allergen disclaimer, unknown treated as "may contain";
  - health: not medical advice, presets as examples, medical guidance;
  - what the app does not do;
  - privacy: no analytics, cookies, ads, or external requests; the language choice is stored, the theme when the user chooses light or dark, and the targets and conditions only when the user turns on saving (allergens only with their own checkbox); otherwise they stay in memory; they never enter the URL;
  - open-source licenses, with a link to `/third-party-licenses.txt`, generated by `build.license` (Vite).
- No contact address ([DECISIONS.md](../working/DECISIONS.md) "Stage 5.1 release plan" P7).

### 3.7 Shopping list

Rules for items, amounts, combination, sections, and order: [SPEC.md](SPEC.md) §18 and ADR-032. The view only renders what `domain/shopping` returns, with names from the active text bundle and numbers from `src/format/`.

Mobile:
```
┌─────────────────────────────────┐
│ h1 Shopping list      [Back]    │
│ From 2 recipes                  │
│ ┌ Lemon-herb chicken breast ──┐ │
│ │ 2 servings · amounts adjusted│ │
│ │                    [Remove] │ │
│ └─────────────────────────────┘ │
│ ┌ Tofu champuru ──────────────┐ │
│ │ 1 serving · 1 side off      │ │
│ │                    [Remove] │ │
│ └─────────────────────────────┘ │
│ [Copy as text] [Print] [Clear all]│
│ (i) Amounts are the edible      │
│ portion or the weight as sold.  │
├─────────────────────────────────┤
│ h2 Ingredients                  │
│ ☐ Chicken breast, skinless 300 g│
│   > Per recipe                  │
│ ☐ Egg 100 g (2)                 │
│ ☐ Cooked white rice 360 g       │
│ h2 Check whether you have       │
│ ☐ Soy sauce 18 g (1 tbsp)       │
│ ☐ Frying oil: vegetable oil 500 g│
│   The amount depends on the pan.│
└─────────────────────────────────┘
```
Desktop (≥ 1024 px): the recipes, actions, and note in a left column, the two sections on the right; the reading order stays the same.

- Recipes: the name links to its detail, which opens in the state of the list entry; the summary names the servings and the changes (amounts adjusted, sides switched off, substitutions). "Remove" takes the recipe out of the list.
- Items: a native checkbox whose label is the food name and amount; a checked item is struck through and keeps its place. An item from two or more recipes has a "Per recipe" disclosure (`details`) with each recipe's amount. Frying oil carries its note.
- Copy as text: the Clipboard API with the text below; the result is announced in the live region. If the API is missing or fails, a read-only text area with the whole text appears, selected, with an instruction to copy it by hand. When every item is checked, the button is disabled and the reason is shown.
- Print: `window.print()`; the print styles hide the header, the buttons, and the disclosures and print the title, the recipes with servings, the note, and every item with an empty box, whatever its check.
- Clear all: a second, inline confirmation ("Clear the list?" with "Clear" and "Cancel"); focus moves to the confirmation, then to the `h1`.
- Focus: after "Remove", focus moves to the next recipe's "Remove", else the previous one, else the `h1`. The live region announces removals and clearing.
- Empty: "No recipes yet. You can add them from a recipe's detail." with a link to the targets view.
- The view shows no nutrition values, allergen notices, or disclaimers of its own; the footer is unchanged.

Copied text (plain text, `\n` line breaks, `- ` bullets in every locale; numbers formatted with `Intl`; a section without unchecked items is left out; final wording in the Stage 8.3 review):
```
Shopping list (2 recipes)
- Lemon-herb grilled chicken breast (2 servings)
- Tofu champuru (1 serving)

[Ingredients]
- Chicken breast, skinless 300 g
- Egg 100 g (2)

[Check whether you have]
- Soy sauce 18 g (1 tbsp)
- Frying oil: vegetable oil 500 g

Amounts are the edible portion (without skin, bones, or shells) or the weight as sold.
```
Japanese and Spanish use the same structure, for example `買い物リスト（2品）`, `[手元にあるか確認するもの]`, `- 卵 100 g（2個）`, `- しょうゆ（濃口） 18 g（大さじ1）`; `Lista de la compra (2 recetas)`, `[Comprueba si ya lo tienes]`, `- Huevo 100 g (2)`, `- Salsa de soja 18 g (1 cucharada)`.

## 4. Navigation and state

- No router library (ADR-030 D2). `src/navigation/` wraps the History API with the views `targets`, `candidates`, `comparison`, `detail` (with a recipe ID), `about`, and `shoppingList`.
- Only the detail view (`/recipes/<id>`) and the about page (`/about`) have their own paths. The others use `/` with the view name in `history.state`.
- `popstate` restores the view. If the view needs a search that is no longer in memory, the targets view is shown with the notice.
- Application state lives in one `useReducer` behind a context (`src/state/`). No store library. The state holds:
  - the request, the evaluated pool, the session, the seed, the displayed set, and the comparison selection;
  - per-recipe adjustment states;
  - the shopping list: recipe IDs with their copied states in the order added, and the checked items;
  - the saved-conditions status: whether the stored record was read, saving on or off, allergens included or not, and the current notice. The record is read once after the content loads (`src/state/useRestoreSavedConditions.ts`); the targets view writes and deletes it (`src/state/savedConditions.ts`).
- A new search resets everything except the targets draft and the shopping list.
- The pool is recomputed only when the request changes. "Show a different type", "exclude this one", and comparison use `selectCandidates` on the same pool.
- The seed starts at 0 for every new search and increases by 1 for each "show a different type" (ADR-029 D6).
- The recommendation runs on the main thread. Phone-class timing is measured against a threshold of about 100 ms at a 4× CPU slowdown (ADR-030 D10, revised).
  - Release 7 with 130 recipes: about 54–59 ms median and 62–66 ms p90 ([DECISIONS.md](../working/DECISIONS.md) "Phase 10 acceptance").
  - Earlier: about 80 ms in Stage 5.4; about 50 ms after Phase 9 Stage 9.3.
- The solver results that do not depend on the targets are added to the engine data after the first view is shown.

## 5. Styling

- Tailwind CSS v4 through `@tailwindcss/vite`, with design tokens defined in CSS (`@theme`) (ADR-030 D3). No external fonts; system font stacks per script (Japanese and Latin).
- Breakpoints: base (mobile) and `md` 768 px, `lg` 1024 px.
- Color tokens meet WCAG 2.2 AA (4.5:1 for text, 3:1 for markers and focus rings) against their backgrounds; a test checks the token pairs because jsdom cannot compute contrast.
- Status markers: met ✓ (filled circle), near ◐ (half circle), not met ✕ (outlined), unknown ? (dashed); always with text.
- Visible focus ring on every interactive element; `prefers-reduced-motion` disables transitions.

### Visual identity (Phases 14 and 18)

The "soft pop" direction (ADR-037): the calm, warm base of a fresh market with pastel accents, two-tone icons, and colored tiles for the nutrition numbers. Stage 14.2 applied the tokens below, a 14 px default radius, and the base component utilities in `src/styles.css` (`btn-primary`, `btn-lg`, `btn-secondary`, `btn-outline`, `panel`, `notice-warning`, `chip`); `warning` and `warning-surface` stayed as tokens equal to `near` and `peach` until Stage 18.2 gave them values of their own. Stage 14.3 added the icons and illustrations in `src/components/icons/`: the shapes are data (`iconData.ts`, `illustrationData.ts`), drawn by `Icon` and `Illustration` in `Icon.tsx`. Stage 14.4 applied the identity to every view: panels, two-tone icons, SVG status markers, colored nutrient tiles on candidate cards, illustrations, and the three layout changes. "More conditions" is grouped under targets per meal, cooking (effort, cuisines, equipment), foods, and allergens; the time limit stays outside as a quick input. The wireframes of §3 show the new layout (updated in Stage 14.5).

Stage 18.2 (ADR-041) revised the dark palette and separated the warning from the nutrients. Dark mode has a cool ink base with three surface steps instead of the warm brown base. Panels and cards have a hairline `edge` in both schemes and a dark shadow in dark mode. The fat tile moved from `peach` to `lilac`, and notices use their own `warning`, `warning-surface`, and `warning-edge`, so no nutrient tile shares a color with an allergen or safety notice. Small texts on tiles (ranges, targets, "no target", missing foods) use `text` at 13 px instead of `muted` at 12 px.

| Token | Light | Dark | Use |
|---|---|---|---|
| `bg` | `#FBF6EE` | `#0F1114` | Page background |
| `surface` | `#FFFFFF` | `#21252C` | Panels, cards, inputs |
| `surface-muted` | `#F1EADF` | `#2D323B` | Unselected choices, collapsed sections, the track of nutrition bars |
| `edge` | `#E6DDCF` | `#343944` | Hairline around panels and cards; decorative |
| `text` | `#2A2722` | `#F1F3F5` | Body text, small text on colored fills, outlines of icons and illustrations |
| `muted` | `#5F584D` | `#C3CAD4` | Hints and secondary text |
| `border` | `#8A8174` | `#8A93A1` | Input and button borders |
| `primary` | `#2E6B3A` | `#8FDC9F` | Main action, selected choice, brand |
| `on-primary` | `#FFFFFF` | `#0E2414` | Text on `primary` |
| `accent` | `#C2452E` | `#FF9A7E` | Tomato coral: illustrations and small accents |
| `mint`, `butter`, `sky`, `lilac` | `#E2F0DF`, `#FFEDB8`, `#DCEBFB`, `#ECE6FB` | `#123A2B`, `#3B3108`, `#11304D`, `#2F2550` | Pastel fills: target bands of the nutrition bars (protein, energy, carbohydrate, fat), icon fills, sections |
| `peach` | `#FCE3DA` | `#4A2416` | Decoration only: icon and illustration fills |
| `sun` | `#F2B33D` | `#F5C04A` | Decoration only; text on it uses `on-sun` (`#2A2722`, `#1F1A10`) |
| `met`, `near`, `not-met` | `#23692E`, `#9A5300`, `#B3261E` | `#86E09A`, `#F7BD63`, `#FF9B93` | Status texts and markers |
| `warning`, `warning-surface`, `warning-edge` | `#8A4700`, `#FFDCC6`, `#B35F00` | `#FFC46B`, `#4B1D1D`, `#FFB347` | Allergen and safety notices only: text, fill, and left edge |
| `focus` | `#1E5FCC` | `#8AB4F8` | Focus ring |

- Contrast (checked 2026-11-08, `test/node/styles.test.ts`): text on `bg` 13.8:1 (light) and 17.0:1 (dark); `text` on every pastel and `surface-muted` at least 12.2:1 and 11.3:1; `muted` on `surface-muted` 5.9:1 and 7.8:1; `on-primary` on `primary` 6.4:1 and 10.1:1; every status color on `surface` and on each pastel at least 4.78:1 (`near` on `lilac`, light) and 6.22:1 (`not-met` on `mint`, dark); `warning` on `warning-surface` 5.5:1 and 9.0:1; `warning-edge` on `surface` 4.6:1 and 8.6:1; `border` on `surface` 3.8:1 and 5.0:1; `focus` on `bg` 5.5:1 and 9.0:1. In dark mode `surface` stands at 1.23:1 from `bg` (1.10:1 before).
- Pastels carry no meaning by themselves: nutrients are told apart by their labels, and statuses keep their texts and marker shapes. The test also keeps `warning-surface` at least 0.04 apart in OKLab from every nutrient fill (the light pastels are about 0.06 apart from each other).
- Type: system fonts (no web font). Body 16 px with line height 1.6; hints 13–14 px; `h1` 32 px weight 900 with a short three-color bar below it; `h2` 22 px and `h3` 18 px weight 800; nutrition numbers 28 px weight 800 with `tabular-nums`.
- Shape: inputs and small tiles 14–16 px radius; panels and cards 24 px; buttons and chips fully rounded. Panels and cards have a hairline `edge` and a soft shadow (a deeper one in dark mode); the main action has a solid 5 px shadow in the text color that shrinks when pressed.
- Icons: original two-tone SVG on a 24 px grid, 1.8 px round strokes in `currentColor` with pastel fills; decorative ones are `aria-hidden`, meaningful ones have a label from the catalogs; no text inside. Set: protein groups (chicken, pork, beef, fish, egg, soy), equipment (`EQUIPMENT`), time, effort, servings, actions (search, save, delete, compare, shopping list, copy, print, back, language, close), notices (warning, information), and the four status markers redrawn with their current shapes. No icons for cuisines, nutrients, or allergens.
- Logo (Stage 16.3): the original "discovery bowl", a bowl with a sprout under a rising sun, drawn like the icons on a 32 px grid with 2.2 px strokes (`LOGO` in `iconData.ts`, `Logo` in `Icon.tsx`). 28 px in the header, decorative, no text inside; the product name stays HTML text. In forced colors the outlines take the link color.
- Illustrations: next to the targets heading (smaller or hidden on phones), in the empty and exceptional states (no candidates, empty shopping list, recipe not found, content error), and next to the about heading. Decorative, without text.
- Motion (Stage 18.4, ADR-041 D5): CSS only, applied through `motion-safe:`, so `prefers-reduced-motion` shows every element in its final state at once. No motion carries meaning: each one repeats what a text already says.
  - A small press on buttons (Phase 14).
  - Cards deal in when they enter the candidates (280 ms: fade, a 10 px rise, and a slight turn, 60 ms apart). Cards kept by "exclude this one" do not move. This replaces the card fade of ADR-037 D5, which was never built.
  - After an adjustment in the detail view, each value whose displayed number changed gets a 4 px ring in `sun` that fades out over 1.2 s; the change summary below lists the same differences in words.
  - A status that the last adjustment turned into "met" pops once (420 ms); the change summary names the status change.
  - Values never count up: the numbers shown are always calculated values (owner, 2026-11-08).
- Loading (Stage 18.3): a panel with the targets illustration and the loading text (`role="status"`), then a skeleton of a card in `surface-muted` that is hidden from assistive technology.
- Theme choice (Stage 19.2, ADR-042): a native select in the header offers system (the default), light, and dark. `data-theme` on the root element holds a choice; without it, the page follows the OS setting through CSS alone. In `src/styles.css`, `@custom-variant dark` expands the one block of dark tokens under `@variant dark` to both the OS setting and the choice, and `color-scheme` follows the choice. The dark tokens apply on screen only, so print always uses the light tokens. `public/theme-init.js`, a classic same-origin script in `<head>`, applies the stored choice before the first paint; `src/main.tsx` applies it again in case that file failed to load. Both selects in the header are 32 px high, set with `height`, because WebKit ignores `min-height` and padding on a select.
- Translucent bars (Stage 18.3): the header sticks to the top from `md` (on phones it stays in the flow, because it wraps to two or three rows), and the bottom bars of the candidates and the targets view are translucent. The `glass` utility keeps the page color at 85 % with a 14 px blur and `saturate(1.4)`, written with and without the `-webkit-` prefix. Without `backdrop-filter`, and in forced colors (`Canvas`), the bars are opaque. From `md`, `scroll-padding-top` keeps focused and linked elements below the header (WCAG 2.4.11).
- Layout changes: "More conditions" opens when restored saved values are inside it; the targets form is grouped under the headings targets, time and effort, foods, and allergens; on phones, "Find recipes" stays at the bottom of the screen. The flow of views does not change.

## 6. Catalog structure

`ja` defines the type; `en`, `es`, and `fr` must match (`src/i18n/messages/`). New namespaces:

| Namespace | Keys |
|---|---|
| `nav` | View names, back links, reload notice, not-found |
| `saved` | The save switch, the allergen checkbox, the shared-browser note, the delete button, and the restored, dropped, deleted, and write-failed notices |
| `targets` | Preset names and "example" labels, fields, units, help, the medical guidance notice, the search button, error summary |
| `conditions` | Time, effort levels, cuisines (`CUISINES`), equipment (`EQUIPMENT`) and equipment modes, required and excluded foods, food groups, autocomplete states (no match = "not supported") |
| `inputError` | One key per `InputError` code, with the field names and limits as values |
| `contradiction` | `minimum_energy_exceeds_kcal_max` blocking and warning |
| `status` | `met`, `near`, `not_met`, `unknown`, target-less, "just below/above the target" |
| `reason` | One key per `ReasonData` code, with targets and attributes as sub-keys |
| `exclusion` | One key per `ConstraintItem`, with plural counts |
| `relaxation` | One key per `Relaxation` constraint, with gains as plural counts |
| `candidates`, `comparison`, `detail`, `adjust` | View texts, adjustment summary, differences, status changes |
| `shopping` | Header link, detail block, view texts, recipe summaries, section names, frying oil label and note, edible portion note, copy, print, and clear texts, announcements, the copied text's title and section labels, empty state |
| `nutrient` | Display names of the five nutrients and their units |
| `uncertainty` | Classes and reasons (`raw_value_for_cooking`, `related_cooked_value`, `post_cooking_refuse`, `fried`, `slow_frying`, `estimated_source_value`), notations (trace, estimated) |
| `assumption` | `oil_counted_in_full`, `included_in_cooked_value`, `parts_removed_after_cooking`, `energy_from_fat`, `pinch_as_stated_grams`, energy versus 4P + 9F + 4C |
| `unit` | Household units (`HOUSEHOLD_UNITS`) with plural forms; `piece` shows the number alone in `en`, `es`, and `fr` (ADR-026); grams, kcal, minutes |
| `allergen` | Names of all `ALLERGENS` (glossary terms) and the confidence levels |
| `disclaimer` | Estimates, allergens, strict control (P4: weigh and check labels) |
| `attribution` | The MEXT wording in Japanese in every locale, followed by the localized equivalent, the data version, and "this app's own calculations" |

- Counts use i18next plural suffixes (`_one`, `_other`). Every locale defines both keys because `ja` defines the catalog type; Japanese plural rules select `_other` only, so both hold the same Japanese text. French plural rules also put 0 and 1.5 in `_one`; household units pass only 1 or 2 as the count, so they need no other form.
- Household units choose the singular up to one unit ("1/2 clove", "1 1/2 cloves"); quantities are shown as fractions of twelfths ("1/2", "1 1/2"; Japanese "1と1/2", Spanish "1 y 1/2", French "1 et 1/2").
- A test requires a key for every engine code (input errors, contradictions, statuses, reasons, constraint items, relaxations, uncertainty reasons, assumptions, units, allergens, cuisines, equipment) in each locale.
- The forbidden-expression check of `content/glossary.ts` is extended to the UI catalogs.

## 7. Input details

- Number fields: `<input type="text" inputmode="numeric">` with a visible unit, steppers (buttons with labels such as "increase protein minimum"), and values validated by `validatePoolRequest` with `INPUT_LIMITS` (unchanged, ADR-030 D4). Empty optional fields mean "no target".
- Ingredient autocomplete: the ARIA 1.2 combobox pattern over the food dictionary of the active text bundle. Normalization: `ja` NFKC and katakana-to-hiragana folding; `en` case folding; `es` case and accent folding; `fr` case and accent folding, with `œ`/`æ` as `oe`/`ae`. Matches names and aliases (ADR-030 D6). Results list the food's display name; no match shows "not supported".
- Food groups: the protein groups (`PROTEIN_GROUPS`) are offered as "chicken (any cut)" and so on. A group as a required item is one any-of item; a group as an exclusion adds every food of the group.
- Equipment: "no limit" (default), "microwave only", or "choose" with checkboxes (ADR-030 D7).

## 8. Adjustment details

- Servings stepper (1–20), steppers on the authored grid for grams and whole units, side switches, substitution radio buttons from the recipe's list, "fit to my targets" (applies the solver state of the pool entry; without a search it is hidden), and "reset to default".
- Each stepper row puts the label in a column that wraps and keeps the decrease button, the value, and the increase button together on one line, down to 320 px in four locales (Stage 18.2; checked by `e2e/flow.spec.ts`).
- Every change recalculates with `calculateNutrition` and shows the difference from the previous state as the difference of the displayed (rounded) values, for example "protein +8 g, energy +60 kcal", and each status change (ADR-030 D8).
- Side steps are hidden when the side is off; amount notes appear from `atLeastGrams`; safety notes follow substitutions.
- A scaled count that is fractional is shown with one decimal in the ingredient list (ADR-028 F).
