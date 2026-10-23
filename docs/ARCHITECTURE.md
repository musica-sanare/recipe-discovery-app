# Architecture — Recipe Discovery

Status: **Draft (2026-10-18)**. The structure below is the intended direction (`docs/DECISIONS.md` ADR-001 to ADR-014). Exact package versions, file names, and the data model details are confirmed in Phase 0 and Phase 1; anything not yet verified is marked *Proposed*.

## 1. Overview

The MVP is a **static single-page application** with all content prepared at build time and all calculation done in the browser.

```
Repository content (recipes, food dictionary, translations)
        │                       MEXT workbook (outside Git)
        │                               │ extraction script
        ▼                               ▼
  Build-time pipeline: validate content ──► extracted composition subset (tracked)
        │  (schemas, locale completeness, food mappings, allergens, policy lint,
        │   nutrition regression snapshots)
        ▼
  Static assets: app bundle + versioned content JSON
        │
        ▼
  Browser: UI ─► recommendation engine ─► nutrition engine (pure, locale-free)
```

- No application server, database, admin UI, or AI in the MVP (ADR-002, ADR-004).
- Hosting: Cloudflare static assets, with platform-specific configuration isolated (ADR-001).

## 2. Layers and responsibilities

| Layer | Responsibility | Must not depend on |
|---|---|---|
| `domain/nutrition` | Amount resolution for a recipe state (servings, sides, linked ingredients, chosen substitutions), per-ingredient and per-recipe nutrition, cooking-state handling, uncertainty classification, ranges, rounding for display values (ADR-028) | UI, i18n, locale, platform, network |
| `domain/recommendation` | Hard filters, fit evaluation, fit tiers, diversification, seeded re-suggestion, bounded adjustment solver, substitution suggestions, relaxation suggestions, contradiction checks | UI, i18n, locale, platform, network |
| `shared` | Content schemas and types, IDs, units, constants used by build tools, domain, and UI | UI, platform |
| `content/` (data) | Recipes, food dictionary, allergen links, substitutions, localized texts, glossary | — |
| `tools/` (build time) | Composition extraction, content validation, policy lint, nutrition snapshots, header generation | UI |
| `src/` (UI) | React app, navigation, i18n, formatting, state, accessibility (`docs/UI_DESIGN.md`) | Platform-specific APIs |
| `platform/` | Hosting configuration (Cloudflare) and generated security headers | Domain logic |

Boundaries are enforced with lint import restrictions and a boundary test, as in the owner's other projects.

*Proposed* directory layout:

```text
src/                    UI (React)
domain/nutrition/       Pure nutrition engine
domain/recommendation/  Pure ranking, diversity, adjustment
shared/                 Schemas (Zod), types, units, constants
content/recipes/        One file per recipe (structured, localized texts)
content/foods.ts        Food dictionary (locale-neutral IDs, mappings, names, aliases, allergens)
content/glossary.ts     Translation glossary and forbidden expressions
data/composition/       Extracted composition subset (generated, tracked) + manifest
data/raw/               MEXT workbook (git-ignored)
tools/                  Extraction, validation, lint, snapshots
platform/cloudflare/    Hosting config and header output
test/, e2e/             Tests
docs/                   Documentation
```

## 3. Data model (outline)

Details are finalized in Phase 1 and documented in `docs/NUTRITION_CALCULATION.md` and the content schemas.

- **Food**: locale-neutral `id` (stable slug); `composition` references (food code and data version per cooking state, for example `raw` and `grilled`); weight change rates per cooking method; refuse rate; allergen links with confidence (`contains`, `may_contain`, `unknown`); localized `names` and search `aliases` for `ja`, `en`, `es`.
- **Recipe**: `id`; time; effort; cuisine; goals; main protein group; tags; equipment; servings; ingredients; sides; keyed steps and food safety notes; substitutions; localized texts. "Quick" and "fried" are derived.
- **RecipeIngredient**: food ID; raw edible grams; cooking state and method; household measure (unit and quantity); role; adjustment bounds (grams or whole units); `linkedTo` leader; hard-to-estimate marker.
- **Side**: localized label, ingredients, and whether "fit to my targets" may switch it off.
- **Substitution**: from food to food with a ratio, optional bounds, and replaced step texts and safety notes.
- Schema: `shared/content.ts` (ADR-026).
- **Composition subset**: per food code, the selected nutrient values with their notation flags (`measured`, `estimated`, `trace`, `zero`, `unmeasured`), source version, and checksum manifest.

## 4. Localization

- Library: the owner's established approach (i18next with typed TypeScript message catalogs) is the candidate; confirmed in Phase 0 (ADR-005).
- UI catalogs: `ja` defines the message type; `en` and `es` must match it at compile time.
- Content: every recipe and food carries `ja`, `en`, and `es` texts; the build fails on missing or blank entries.
- **Food identity is separate from translation** (ADR-006). Ingredients reference locale-neutral food IDs; names and aliases are display and search data only. Nutrition functions do not accept a locale parameter, enforced by their types.
- Search normalization per locale: Unicode NFKC and hiragana/katakana folding for `ja`; case folding for `en`; case and accent folding for `es`. Aliases cover regional terms (for example `patata` / `papa`).
- Household units are display labels per locale (大さじ / tbsp / cucharada). Amounts are stored in grams; a tablespoon is defined as 15 mL.
- Formatting uses `Intl` APIs. Values are formatted only at the presentation layer.
- Locale detection and persistence (*Proposed*, same pattern as the owner's other apps): stored locale preference if valid, otherwise the first supported language in `navigator.languages`, otherwise `ja`. Only the locale preference is stored.

## 5. Build-time pipeline

1. **Extraction**: a script reads the MEXT workbook from `data/raw/` (git-ignored), checks its SHA-256 against the manifest, and writes only the food codes referenced by the food dictionary and only the selected columns, with notation flags. Output and manifest are tracked (`docs/DATA_SOURCES.md`).
2. **Content validation**: schemas; unique IDs; every ingredient maps to a food and every food to composition data; locale completeness; adjustment bounds valid; substitutions valid; allergen links present (or explicitly `unknown`).
3. **Policy lint**: forbidden health or efficacy expressions in all locales (`docs/CONTENT_POLICY.md`).
4. **Nutrition snapshots**: per-recipe calculated values are stored as test snapshots so that data or formula changes produce a reviewable diff.
5. **Content bundles** (ADR-027): `tools/build-content.ts` writes a locale-neutral calculation bundle and one text bundle per locale to `generated/content/` (git-ignored); Vite adds a content hash to each file name.
6. **Header generation**: security headers are defined once and written in the hosting platform's format.

## 6. Recommendation flow (browser)

1. Load the calculation bundle and the text bundle of the active locale (static, content-hashed), validate them with `zod/mini` and against each other, and show the error state with a retry action when a bundle is unreachable or invalid (`src/content/`). Switching the locale loads only its text bundle, before the language changes, so the views stay mounted.
2. Validate user inputs; detect contradictory targets (`src/views/TargetsView.tsx` with `domain/recommendation`).
3. Hard filters → fit evaluation (default amounts, then bounded adjustment) → fit tiers → diversification → stable ordering, on the main thread (ADR-030 D10).
4. Render candidates and deterministic reason texts from the typed catalogs (`src/views/candidates/`).
5. Recalculate on every adjustment in the detail view (`src/views/DetailView.tsx`). Measured in the browser (Stage 4.7): a full recommendation about 25 ms inside the UI on a desktop, a re-suggestion about 2 ms and a recalculation about 3 ms from click to layout; phones are not measured yet (open question 17).
6. State stays in memory (`src/state/`, ADR-015, ADR-030 D9); only the recipe detail has its own URL (`src/navigation/`, ADR-030 D2).

## 7. Platform independence

- The production output is a plain static build (`dist/`). Only `platform/cloudflare/` and the generated header file are Cloudflare-specific.
- No Cloudflare runtime APIs are used by domain, content, or UI code. Tests run in Node.
- The MVP does not need a Worker. A future server feature (for example optional AI) must define its HTTP contract in `shared/` and keep the provider-specific implementation in a thin adapter.
- The deployment runbook will describe how to serve the same `dist/` from another static host.

## 8. Security and privacy

- Strict Content-Security-Policy (`'self'` only), `X-Content-Type-Options: nosniff`, `Referrer-Policy`, restrictive `Permissions-Policy`, `frame-ancestors 'none'`.
- No third-party scripts, fonts, or images at runtime.
- No user data leaves the browser in the MVP. Targets and conditions are never put in URLs.
- Dependency install scripts are governed by an allowlist policy (Phase 0).

## 9. Testing strategy

- Unit tests for the nutrition and recommendation engines (determinism, rounding, uncertainty, adjustment bounds, diversity, relaxation suggestions, contradictions).
- **Locale invariance test**: every recipe calculated under each locale context yields identical internal values.
- Content validation and policy lint run in CI and in the build.
- Nutrition snapshot tests.
- UI tests with jsdom (`src/**/*.test.tsx` with fixtures; `test/ui/` with the repository content); accessibility checks (axe-core, without the contrast rule) in `ja`, `en`, and `es` for every view and exceptional state, and a contrast test over the color tokens (`test/node/styles.test.ts`).
- E2E tests on desktop and mobile viewports, including long Spanish strings and locale switching.

## 10. Not in the MVP

D1 or any database, admin UI and authentication, application server, AI provider, analytics. Their absence is intentional (ADR-002, ADR-004, ADR-015).
