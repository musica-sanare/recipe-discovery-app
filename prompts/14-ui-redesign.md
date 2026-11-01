# Prompt 14 — Phase 14: UI/UX redesign

You are the lead engineer for Recipe Discovery. Read `CLAUDE.md` and every document under `docs/en/` and `docs/working/` before making changes. Phase 0 to Phase 13 results are in `docs/working/DECISIONS.md` (in particular ADR-030 D3, D11, ADR-032 D7, ADR-033, ADR-034 D6, ADR-036; "Phase 13 acceptance"; "Release 10 and tenth production deployment"; "Open questions"). Every locale requirement means four locales: `ja`, `en`, `es`, and `fr`. Communicate with the owner in Japanese; write repository files in English.

## Starting point
- Branch `dev`; release 10 (Phase 13, opt-in saved conditions) was deployed on 2026-11-01 by Workers Builds from `6288bd7`, merged into `main` as `a93902d` (version `d0574e40…`); `f296aaf` (release 9) is the rollback target. The owner pushes, merges `dev` into `main` by hand, and a merge into `main` deploys ([DEPLOYMENT.md](../docs/en/DEPLOYMENT.md) §3).
- Content version `2026-10-31.8`: 130 recipes and 117 foods in four locales. `npm run check` (884 tests), `npm run test:e2e` (164 passed, 1 skipped), and CI pass.
- The current look is a minimal proof of concept: Tailwind CSS v4 with a small token set in `src/styles.css` (ADR-030 D3), system fonts, no icons or illustrations, text-and-shape status markers (`src/components/StatusMarker.tsx`), light and dark color schemes from `prefers-color-scheme`, and print styles for the shopping list. Screen layouts and wireframes are in [UI_DESIGN.md](../docs/en/UI_DESIGN.md).
- Known UX item from Phase 13: restored saved values inside "More conditions" stay in the collapsed section ("Stage 13.3 saved-conditions UI").
- Maintenance: open question 22 (`minimatch`) and ADR-017 (TypeScript 7 support in `typescript-eslint`) are re-checked at the start of the phase. `i18next` 26.6.0 is available ("Phase 13 start: saved conditions"); update it under ADR-016 in its own commit at the start of the phase, with the owner's approval.
- The owner's wish (2026-11-01): a modern design that makes people want to cook and eat, with a healthy feel; cool but pop and playful; suited to the app's purpose (discovering recipes that fit nutrition targets).

## Fixed constraints
- The redesign changes presentation only. Engines, formulas, rounding, fit statuses, ranking, content, food IDs, the saved-conditions record, and every calculated value stay exactly as they are; existing determinism and locale invariance tests keep passing without changed snapshots.
- Original work only (principle 11): icons and illustrations are drawn by Claude as SVG in the repository; no third-party icon sets, stock images, recipe photos, or generated raster images. No AI at runtime.
- The CSP and the security headers stay as they are (`'self'` only, no inline `style` attributes in static markup). Fonts only if self-hosted, with a license that allows embedding and redistribution (for example SIL OFL), recorded with its source; no font or asset from another origin. No new dependency unless the owner approves it under ADR-016.
- Accessibility stays at WCAG 2.2 AA: every color pair passes the token contrast test in light and dark; status is never shown by color alone (text plus a distinct marker shape, ADR-030 D3); visible focus; `prefers-reduced-motion` respected; usable in Windows forced colors; touch targets at least 24 × 24 CSS px (40 px where the current UI has it); axe-core passes in jsdom and in real browsers in four locales.
- Icons and illustrations are decorative unless they carry meaning; decorative ones are `aria-hidden` and meaningful ones have a localized label from the catalogs. No text inside SVGs, so no per-locale artwork.
- No health, medical, or efficacy claims in visual wording or imagery (principle 15): no "fat burning" flames, medical symbols, or before-and-after body images. Allergen and estimate disclaimers stay as visible as today.
- Layouts work at 320–375 px without horizontal page scroll and keep a sensible reading order for screen readers. The shopping list's print output stays usable in black and white.
- Bundle size: report the JavaScript and CSS size after each stage; icons should add little (inline SVG components or one sprite, no icon font).

## Goal
A recognizable, inviting, and consistent visual identity across every view, built from design tokens and original SVG icons and illustrations, without changing any behavior or calculation and without losing accessibility.

## Working rules
- Work in stages. Each stage starts with the intended changes and affected files, and ends with checks, screenshots at 375 px and desktop width in light and dark mode, a Japanese summary (changed files, decisions, commands and results, 要確認, next stage), and a commit proposal with the full message and file list written in the message itself. Commit only after the owner approves that specific commit.
- Design mockups are local files (scratch HTML or the dev server) shown in the built-in browser; nothing is published to an external service.
- Verify current official documentation (Tailwind CSS v4, WCAG 2.2 techniques, a font's license page if one is proposed) before relying on it; record the source and the date checked in `docs/working/DECISIONS.md`; mark anything unverified as 要確認.
- Every change to `docs/en/` updates `docs/ja/` and its source line in the same commit. New UI strings exist in all four locales.

## Stages

### 14.1 Direction (owner review)
1. Three design directions, each as a static mockup of the targets view and a candidate card at 375 px and desktop width, in light and dark mode, with a short description: palette with contrast ratios, type scale, shape language (radius, borders, shadows), icon style, and where illustrations appear. Starting points for discussion: "fresh market" (warm off-white, leafy green and tomato coral, rounded cards, hand-drawn-style food icons), "kitchen lab" (cool slate with a lime or teal accent, large macro numbers, geometric icons), and "bento pop" (compartment-like blocks, pastels with clear outlines, sticker-style icons).
2. Decisions with options, trade-offs, and a recommendation: the direction (or a mix); system fonts or one self-hosted Latin display font for headings (Japanese stays on system fonts); the icon list (for example protein groups, cuisines, equipment, time, effort, nutrients, status, navigation, shopping, save); where illustrations appear (empty states, the about page, the header); motion (none or subtle, off with reduced motion); and the UX scope: tokens and components only, or also layout and flow changes (for example opening "More conditions" when restored values are inside it, clearer grouping of the targets form, sticky actions on phones).
3. Record the decisions as a new ADR (revising ADR-030 D3) and update [UI_DESIGN.md](../docs/en/UI_DESIGN.md) §5 with its translation.

### 14.2 Tokens and base components
1. New tokens in `src/styles.css` (color, type scale, spacing, radius, shadow) for light and dark; the contrast test covers every new pair.
2. Base components restyled or extracted where it reduces duplication: buttons, fieldsets, choices, chips, notices (status, warning, error), cards, steppers, and the status marker. No behavior change; existing UI tests pass unchanged except for intentional markup changes.

### 14.3 Icons and illustrations
1. An original SVG icon set in `src/components/icons/` as small React components using `currentColor`, a consistent grid and stroke, and the decorative or labelled rule above; a test checks that every icon renders, has no text, and has a label when it is not decorative.
2. A few illustrations for empty and exceptional states and the about page, within the same constraints.

### 14.4 Views
1. Apply the design view by view: targets and conditions (including the free-text field and the saved-conditions fieldset), candidates, comparison, recipe detail with adjustment, shopping list (screen and print), about, and the exceptional states of [SPEC.md](../docs/en/SPEC.md) §12.
2. The UX changes the owner chose in 14.1, each with tests.
3. Screenshots of every view at 375 px and desktop width, light and dark, in at least `ja` and `fr` (the longest texts).

### 14.5 Quality
1. axe-core in jsdom and in real browsers in four locales; the token contrast test; a forced-colors check; reduced motion; keyboard paths unchanged; no horizontal overflow at 320 and 375 px; print preview of the shopping list.
2. [UI_DESIGN.md](../docs/en/UI_DESIGN.md) and [ARCHITECTURE.md](../docs/en/ARCHITECTURE.md) updated with their translations; bundle size and the phone-class timing (`npm run test:e2e:timing`) compared with release 10.

### 14.6 Release 11
1. Release readiness as for release 10 ([RELEASE_READINESS.md](../docs/working/RELEASE_READINESS.md)): checks, `npm audit`, the secret scan, and screenshots.
2. The owner approves and merges `dev` into `main`, which deploys; Claude runs the post-deployment checks of [DEPLOYMENT.md](../docs/en/DEPLOYMENT.md) §3 and records release 11.

## Out of scope
- New features, new recipes or foods (Phase 15), changes to calculations, ranking, or content.
- Photos, third-party artwork or icon sets, external fonts or CDNs, analytics, and any request to another origin.
- A design system package or component library dependency, unless the owner approves it under ADR-016.

## Acceptance
- The owner's decisions of 14.1 are recorded, and [UI_DESIGN.md](../docs/en/UI_DESIGN.md) and the affected docs are updated with their translations.
- Every view uses the new tokens, components, and original icons; screenshots at 375 px and desktop width in light and dark mode are reviewed by the owner.
- No calculated value, ranking, or stored data changes (existing tests unchanged); accessibility checks pass in four locales; no horizontal overflow at 320 and 375 px.
- `npm run check`, `npm run test:e2e`, and CI pass; release 11 is deployed only by the owner's merge into `main`.
