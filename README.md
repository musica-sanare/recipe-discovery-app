# Recipe Discovery

Recipe Discovery helps people who track their nutrition (for example for strength training or body composition goals) discover dishes they would not have thought of on their own. Users set nutrition targets and practical conditions (time, effort, equipment, ingredients to use or leave out, allergens), then compare candidate recipes side by side and adjust amounts. Nutrition values are calculated deterministically from food composition data and explicit ingredient amounts; no AI is used.

The app supports Japanese, English, and Spanish (`ja`, `en`, `es`).

## Features

- Targets per meal (energy range, protein minimum, fat maximum, optional carbohydrate range) with example presets, and conditions: cooking time, effort, equipment, cuisines, ingredients to use or leave out, allergens.
- Three to five candidates with fit status, reasons, and adjustments; "show a different type", exclusion, close alternatives, and suggestions to relax conditions when nothing fits.
- Comparison of two or three recipes, and a recipe detail with per-ingredient nutrition, its basis (food codes, data version, cooking state, assumptions), servings, sides, substitutions, and "fit to my targets".
- 60 original recipes and 78 foods (content version `2026-10-24.8`), validated at build time in three languages.
- A static site: no accounts, no server-side storage, no analytics; only the language choice is stored in the browser.

## Status

Phase 6 (post-release maintenance, `docs/IMPLEMENTATION_PLAN.md`) is complete. Release 2 is deployed at https://recipe-discovery.musica-sanare.workers.dev (2026-10-24, content version `2026-10-24.8`); the release record, limitations, and manual checks are in [`docs/RELEASE_READINESS.md`](docs/RELEASE_READINESS.md).

## Local setup

Requirements: Node.js `>=24.15.0` (`.nvmrc` pins 24) and npm. No accounts or secrets are needed.

```bash
npm ci
npm run dev
```

| Command | Purpose |
|---|---|
| `npm run dev` | Development server on http://localhost:5173 |
| `npm run check` | Lint, type-check, license check, unit and UI tests, content validation, production build |
| `npm run test:e2e` | Playwright on the production build (install browsers once with `npx playwright install --only-shell chromium webkit`) |
| `npm run preview` | Serve `dist/` with the production security headers on http://localhost:4173 |

All commands, content authoring, and data tools: [`docs/DEVELOPMENT.md`](docs/DEVELOPMENT.md). CI runs `npm run check` and `npm run test:e2e` on pushes to `dev` and `main` and on pull requests (`.github/workflows/ci.yml`).

## Data handling

- The original MEXT workbook and explanation PDF stay outside Git (`data/raw/` is ignored). Only the extracted subset (`data/composition/foods.json`) and the hand-transcribed cooking tables (`data/composition/cooking.json`) are tracked, with the source checksums in their manifests (`docs/DATA_SOURCES.md`).
- Recipes, food names, and translations are original content in `content/`; nothing is generated or translated at runtime.

## Data attribution

Nutrition values are calculated by this app from 日本食品標準成分表（八訂）増補2023年 (Standard Tables of Food Composition in Japan 2020, Eighth Revised Edition, Updated and Enlarged Version 2023), published by the Ministry of Education, Culture, Sports, Science and Technology (MEXT). They are this app's own estimates and are not endorsed or guaranteed by MEXT. The app shows the attribution in the footer, the recipe detail, and the about page.

## Known limitations

- Every nutrition value is an estimate; some cooked states use related or raw values and some fried foods are hard to estimate (shown in the app). Some error bands are assumptions (`docs/NUTRITION_CALCULATION.md`).
- Allergen information is best effort and may be incomplete; the app never guarantees that a recipe is safe for people with allergies.
- The app gives no medical advice; presets are examples.
- Egg- and soy-based dishes rarely meet the preset fat limits (`docs/DECISIONS.md` "Stage 5.2 batch 1").
- A full recommendation takes about 80 ms with a 4× CPU slowdown and about 120 ms at 6×; real phones are not measured yet (ADR-030 D10).
- Open questions that remain before or after release are listed in `docs/DECISIONS.md` "Open questions".

## Documentation

| Document | Contents |
|---|---|
| [`docs/SPEC.md`](docs/SPEC.md) | Product requirements, MVP scope, acceptance criteria |
| [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) | Technical structure and responsibilities |
| [`docs/UI_DESIGN.md`](docs/UI_DESIGN.md) | Screens, navigation, styling, catalogs |
| [`docs/NUTRITION_CALCULATION.md`](docs/NUTRITION_CALCULATION.md) | Nutrition calculation rules and uncertainty |
| [`docs/CONTENT_POLICY.md`](docs/CONTENT_POLICY.md) | Recipe authoring, allergens, food safety, health expressions, translations |
| [`docs/DATA_SOURCES.md`](docs/DATA_SOURCES.md) | Data sources, terms, attribution, handling |
| [`docs/DECISIONS.md`](docs/DECISIONS.md) | Verification log and architecture decision records |
| [`docs/IMPLEMENTATION_PLAN.md`](docs/IMPLEMENTATION_PLAN.md) | Phased plan |
| [`docs/DEVELOPMENT.md`](docs/DEVELOPMENT.md) | Local setup and commands |
| [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) | Deployment runbook (Cloudflare first, other static hosts) |
| [`docs/RELEASE_READINESS.md`](docs/RELEASE_READINESS.md) | Acceptance criteria with evidence, release blockers, limitations, manual checks, deployment proposal |

Contributor and AI-assistant rules are in [`CLAUDE.md`](CLAUDE.md).

## License

Not chosen yet (要確認, owner decision). The repository is private. Third-party licenses of the bundled dependencies are generated at build time (`dist/third-party-licenses.txt`).
