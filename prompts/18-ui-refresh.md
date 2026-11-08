# Prompt 18 — Phase 18: UI refresh (dark mode, character, modern feel)

You are the lead engineer for Recipe Discovery. Read `CLAUDE.md` and every document under `docs/en/` and `docs/working/` before making changes. Phase 0 to Phase 17 results are in `docs/working/DECISIONS.md` (in particular ADR-016, ADR-030, ADR-036, ADR-037, ADR-039, ADR-040; "Phase 14 acceptance", "Phase 16 acceptance", "Phase 17 acceptance", "Phase 16 open items closed"; "Open questions"). Every locale requirement means four locales: `ja`, `en`, `es`, and `fr`. Communicate with the owner in Japanese; write repository files in English.

## Starting point
- Branch `dev` at `f8123ce` or later. Release 14 (Phase 17) was deployed on 2026-11-03 by Workers Builds from `cf4ef7e`, merged into `main` as `0a5afff`; `4768cad` (release 13) is the rollback target. The site is https://recipe-discovery.apps.musica-sanare.com, and `workers.dev` stays reachable (ADR-040). The owner pushes and merges `dev` into `main` by hand, and a merge into `main` deploys ([DEPLOYMENT.md](../docs/en/DEPLOYMENT.md) §3). Claude never deploys and never runs Wrangler.
- Content version `2026-11-01.2`: 150 recipes and 139 foods in four locales. `npm run check` (64 test files, 1,023 tests), `npm run test:e2e` (194 passed, 1 skipped by design), and CI pass.
- Visual identity: "soft pop" (ADR-037; [UI_DESIGN.md](../docs/en/UI_DESIGN.md) §5 "Visual identity"). Tokens in `src/styles.css` (`@theme`, dark values under `prefers-color-scheme: dark`), contrast checked by `test/node/styles.test.ts`. Icons, illustrations, and the logo are original SVG data in `src/components/icons/`. System fonts only; no web font. The theme follows the OS setting; there is no in-app switch.
- The owner's view (2026-11-08): dark mode is hard to read, and the app lacks character, playfulness, and a modern feel.

## Findings to start from
Claude checked production at 375 px in dark mode and at desktop width in light mode on 2026-11-08 (targets view, candidates after a default search, and the detail view of `beef_potato_tomato_stew`).

- Dark surfaces barely separate: `bg` `#191815` and `surface` `#23211D` are close in lightness, and `--shadow-soft` is `none` in dark mode, so panels and cards blend into the page.
- The dark pastels read as muddy brown and maroon (`butter` `#3A3120`, `peach` `#3E2620`); the nutrient tiles lose their hue and look dirty.
- **The fat tile and the allergen warning share one color**: `peach` and `warning-surface` are both `#3E2620` in dark mode (and `#FCE3DA` in light). A nutrient tile and a safety notice should not look alike.
- The dark base has a warm brown cast that makes the whole page look dull.
- Small `muted` text (12 px, for example the estimate range "推定の幅") sits on tinted tiles and is hard to read, although the pairs pass the contrast test.
- Layout bug in every mode: in the detail view's "Adjust" section at 375 px, the [+] stepper button wraps to the next line, because the label has `min-w-40` (`src/views/DetailView.tsx`, the stepper row).
- Loading shows only the text "コンテンツを読み込んでいます…" on an empty page.
- Candidate cards are tall on phones: four tiles, the time chip, the approximation chip, the allergen notice, and three actions per card.

## Goal
Make dark mode comfortable to read and give the app more character, playfulness, and a modern feel, in light and dark mode and in four locales, without changing any calculation, ranking, content, or meaning. A release follows only after the owner's merge into `main`.

## Fixed constraints
- No engine, formula, rounding, fit status, ranking, content, food ID, or calculated value changes. Determinism, locale invariance, and every engine, scenario, solver-result, and digest snapshot stay unchanged. Every value, unit, estimate label, range, approximation reason, unknown value, and "just below the target" detail shown today stays visible ([NUTRITION_CALCULATION.md](../docs/en/NUTRITION_CALCULATION.md) §7–§9).
- Colors never carry meaning alone: statuses keep their marker shapes and texts; nutrients are named by labels; allergen and safety notices keep their wording, their icon, and a look of their own, distinct from nutrient tiles and decoration.
- No allergen-safety or health wording changes; no health or efficacy claims in any new text, illustration, badge, or animation ([CONTENT_POLICY.md](../docs/en/CONTENT_POLICY.md)). Playful texts stay neutral about food and bodies; every new string exists in four catalogs with typed keys.
- WCAG 2.2 AA in four locales and both color schemes: 4.5:1 for text, 3:1 for markers, borders of controls, and focus rings; `test/node/styles.test.ts` covers every new token pair; axe-core in jsdom and in real browsers. No horizontal overflow at 320 and 375 px; forced colors keep every control and status visible; `prefers-reduced-motion` stops every new animation; print stays readable.
- CSP and headers unchanged (`'self'` only): no CDN, no external font, image, or script. Any new asset is a same-origin file under the immutable cache rule.
- Assets are original or under a license compatible with ADR-031 and recorded with its source; no third-party artwork or recipe photos. A web font, if the owner chooses one, is self-hosted, subset, and under the SIL Open Font License or similar, and its size is reported.
- No JavaScript chunk loaded at startup exceeds Vite's 500 kB warning (ADR-039); report raw and gzip sizes of every changed chunk and asset.
- Stored data: today only the locale preference and the opt-in saved conditions (ADR-036). A stored theme preference is a new `localStorage` key and needs the owner's decision and an ADR; nothing leaves the browser.
- No new dependency unless the owner approves it under ADR-016 (animation libraries included; prefer CSS).
- No analytics, trackers, or cookies.

## Working rules
- Work in stages. Each stage starts with the intended changes and affected files, and ends with checks, a Japanese summary (changed files, decisions, commands and results, 要確認, next stage), and a commit proposal with the full message and file list written in the message itself. Commit only after the owner approves that specific commit; check the current branch before every commit.
- Verify current official documentation (Tailwind CSS v4 theming and `@custom-variant`, CSS `color-mix()` and `light-dark()` support, `backdrop-filter`, View Transitions if used, font subsetting tools) before relying on it; record the source and the date checked in `docs/working/DECISIONS.md`; mark anything unverified as 要確認.
- Verify every UI change in the browser at 320 px, 375 px, and desktop width, in light and dark mode, in at least `ja` and `fr` (the longest texts), and with reduced motion and forced colors where the stage touches them. Share screenshots of before and after, and report what was and was not checked.
- Measure `npm run test:e2e:timing` against release 14 when a stage changes rendering cost (motion, new SVGs, chart drawing); the ADR-030 D10 threshold stays.
- Every change to `docs/en/` updates `docs/ja/` and its source line in the same commit.

## Stages

### 18.1 Direction (owner review before implementation)
Propose and wait for approval:
1. **Dark mode palette**: a revised dark token set with surface steps, a separate dark warning color, and tile colors that keep their hue. Show the current and proposed palettes side by side on the targets view, a candidate card, and the detail nutrition at 375 px, with the contrast of every pair.
2. **Character and modern feel**: two or three directions as local mockups in light and dark mode. Each direction covers the header, the targets heading, a candidate card, the detail nutrition, and one empty or loading state. Candidates to choose from:
   - a display typeface for headings and numbers only (self-hosted Latin subset, Japanese stays on system fonts), with its license and size;
   - small original illustrations or badges per main protein or cuisine group;
   - a "discovery" touch on "show a different type" (for example a short dice or shuffle motion) and a "new this session" mark for recipes not yet shown in the session (memory only, ADR-030 D9);
   - a short confirmation motion when an adjustment makes a target met, and values that count up on change;
   - skeleton or illustrated loading states instead of the bare loading text;
   - nutrition as bars against the target range (a bullet chart per nutrient) as an alternative to the four tiles, with the same text values and ranges, to shorten candidate cards;
   - a translucent, blurred bottom bar and header;
   - an in-app theme switch (system, light, dark), which needs the stored-data decision above;
   - the two-column desktop detail view with a sticky nutrition and adjustment column (planned earlier, never built; UI_DESIGN §3.4).
   Give trade-offs (accessibility, bundle size, effort, risk to meaning) and a recommendation, and the ADR text revising ADR-037.
3. The order of the following stages and what is left out.

### 18.2 Dark mode and the stepper fix
The approved dark tokens, the separate warning color in both schemes, the readable small text on tiles, and the stepper row fix at 320 and 375 px. Contrast test extended; UI tests; [UI_DESIGN.md](../docs/en/UI_DESIGN.md) §5 and its translation.

### 18.3 Character and components
The approved typeface, illustrations or badges, nutrition presentation, loading states, and layout changes, with tests and screenshots; UI_DESIGN §3 and §5 and the translation; the catalogs of four locales for any new text.

### 18.4 Motion and finish
The approved motion with `prefers-reduced-motion` respected, forced colors, print, and the E2E suite updated (accessibility, flow, states, and the stored keys if a theme preference is stored).

### 18.5 Release 15
1. Release readiness as for release 14 ([RELEASE_READINESS.md](../docs/working/RELEASE_READINESS.md)): `npm ci`, `npm run check`, `npm run test:e2e`, `npm audit`, the phone-class timing with release 14 measured alongside if rendering changed, and the secret scan.
2. The owner approves and merges `dev` into `main`, which deploys; Claude runs the post-deployment checks of [DEPLOYMENT.md](../docs/en/DEPLOYMENT.md) §3 on both URLs plus light and dark mode in `ja` and `fr` at 375 px in production, and records release 15.

## Out of scope
- New features beyond presentation, new recipes or foods, engine changes, and any change to calculated values or ranking.
- Recipe photos or AI-generated images; AI features of any kind.
- External services, analytics, accounts, deployments, and any Cloudflare or GitHub setting change.
- The Spanish and French native review (open questions 9 and 23).

## Acceptance
- The owner's decisions of 18.1 are recorded with an ADR revising ADR-037.
- In dark mode, panels and cards separate visibly from the page, nutrient tiles keep their hue, and the allergen notice no longer shares a color with any nutrient tile; the same holds in light mode for the notice. Before and after screenshots are recorded.
- The stepper row does not wrap its buttons at 320 and 375 px in four locales.
- The approved character and modern-feel changes are in place in four locales and both color schemes, with reduced motion and forced colors respected.
- Calculations, rankings, snapshots, and every shown value, range, and note are unchanged; no startup chunk exceeds 500 kB; CSP and headers are unchanged.
- Accessibility checks pass in four locales; `npm run check`, `npm run test:e2e`, and CI pass; release 15 is deployed only by the owner's merge into `main`.
