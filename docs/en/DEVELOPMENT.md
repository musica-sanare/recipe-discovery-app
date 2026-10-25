English | [日本語](../ja/DEVELOPMENT.md) · [Docs index](README.md)

# Local Development

## Prerequisites
- Node.js `>=24.15.0` (`.nvmrc` pins 24)
- npm (bundled with Node; the committed `package-lock.json` is authoritative)

No accounts, API keys, or secrets are needed. Nothing in this guide creates remote resources.

## Setup

```bash
npm ci
```

`.npmrc` enables `engine-strict` and `strict-allow-scripts` ([DECISIONS.md](../working/DECISIONS.md) ADR-018). If an install fails with `ESTRICTALLOWSCRIPTS`, a dependency introduced an install script: review what it does and record a decision in `package.json` `allowScripts` and in ADR-018. Do not install with `--omit=optional` (platform binaries come from optional dependencies).

## Commands

| Command | Purpose |
|---|---|
| `npm run dev` | Generate the content bundles, then start the Vite dev server on http://localhost:5173 (no CSP; see ADR-018). Rerun `npm run content:build` after changing content |
| `npm run content:build` | Write the content bundles to `generated/content/` and print their sizes (ADR-027) |
| `npm run build` | Validate content, generate the content bundles, type-check, then build to `dist/` including the generated `_headers` and `third-party-licenses.txt` (Vite `build.license`, linked from the about page) |
| `npm run report:composition` | Per recipe and ingredient, from the nutrition engine: exact, approximation (with the ADR-028 reasons), hard to estimate, not counted, fried; fails when a cooked state has no weight change rate |
| `npm run validate:content` | Content validation only (`tools/content/validate.ts`); prints one line per problem with file, recipe or food, field, and rule |
| `npm run preview` | Serve `dist/` with the production security headers (http://localhost:4173) |
| `npm run lint` | ESLint with type-aware rules and module boundaries |
| `npm run typecheck` | TypeScript project build without emit |
| `npm test` | Vitest (Node by default; UI tests use jsdom per file; `test/ui/` runs the app on the repository content) |
| `npm run check` | Lint, type-check, license check, tests, and build in sequence |
| `npm run check:licenses` | Licenses of every package in `package-lock.json` against `tools/licenses.ts` (production: MIT, ISC, Apache-2.0, BSD, 0BSD; development also MPL-2.0, BlueOak-1.0.0, MIT-0, CC0-1.0, CC-BY-4.0) |
| `npm run test:e2e` | Playwright on the production build with headers (`npm run build && npm run preview` on port 4174): projects `desktop-chromium`, `mobile-chromium`, `mobile-webkit`; every spec in `ja`, `en`, and `es` (`e2e/`). Browsers: `npx playwright install --only-shell chromium webkit` (user cache, outside the repository) |
| `npm run test:e2e:timing` | Phone-class timing with CPU throttling (project `timing`, Chromium); writes `test-results/timing.json`. With `TIMING_LIBRARY=synthetic`, a network stub serves the synthetic library of `tools/synthetic-library.ts` instead of the content bundles and the numbers go to `test-results/timing-synthetic.json` |
| `npm run data:extract` | Regenerate `data/composition/foods.json` from the MEXT workbook in `data/raw/` ([DATA_SOURCES.md](DATA_SOURCES.md) "Extraction") |
| `npm run eval:coverage` | How many validation recipes meet representative targets with default and adjusted amounts, computed by the recommendation engine ([DECISIONS.md](../working/DECISIONS.md) "Stage 0.6", "Stage 3.7") |
| `npm run bench:recommendation` | Node timing of a full search on the repository recipes and on an in-memory synthetic library of 130 recipes (`tools/synthetic-library.ts`: recipes spread evenly over the library added again under new IDs; never published) ([DECISIONS.md](../working/DECISIONS.md) "Stage 6.2", "Stage 9.2") |
| `npm run data:verify-cooking` | macOS only: check `data/composition/cooking.json` against the MEXT explanation PDF text ([DATA_SOURCES.md](DATA_SOURCES.md) "Cooking tables") |

Browser previews: `.claude/launch.json` has `preview` (the production build with headers, port 4173) and `dev` (the Vite dev server, port 5173; engine modules can be imported in the page for measurements). Timing numbers from a hidden or background tab are not reliable.

There is intentionally no deploy script; deployment follows [DEPLOYMENT.md](DEPLOYMENT.md) after the owner's approval.

CI (`.github/workflows/ci.yml`, GitHub Actions on `ubuntu-24.04`) runs `npm ci` and `npm run check` in one job and `npm run test:e2e` with `npx playwright install --with-deps --only-shell chromium webkit` in another, on pushes to `dev` and `main` and on pull requests. It has read-only permissions, no secrets, and no deployment; the Playwright report is uploaded only when E2E fails (kept 7 days). Actions are pinned to commit SHAs.

## Layout (current)

```text
index.html, src/        UI (React, Tailwind CSS; docs/en/UI_DESIGN.md): i18n/ typed ja/en/es catalogs and engine code lists,
                        format/ locale formatting, navigation/ History API views, state/ reducer and engine calls,
                        views/ screens, testing/ axe-core helper
shared/                 Schemas, constants, and types shared by UI, domain, content, and tools
domain/nutrition/       Pure, locale-free nutrition engine (ADR-028); tests next to the code
domain/recommendation/  Pure, locale-free recommendation engine (ADR-029); tests next to the code
domain/shopping/        Pure, locale-free shopping list aggregation (ADR-032); tests next to the code
content/                Food dictionary, recipes, glossary, content version (TypeScript, validated at build time)
platform/               Hosting-specific output (security headers)
tools/                  Build-time tools run directly by Node (TypeScript type stripping)
generated/content/      Content bundles written by tools/build-content.ts (git-ignored)
data/composition/       Extraction manifest and the tracked composition subset
data/raw/               Original source files (git-ignored)
test/node/              Node-side tests
test/ui/                jsdom tests of the app on the repository content (tsconfig.ui.json)
docs/, prompts/         Documentation and phase prompts
```

`domain/` may import only `shared/` (and content in tests); `eslint.config.js` enforces this. Tools and repository tests obtain engine input from the in-memory calculation bundle (`tools/content/repository.ts`). Files under `tools/` run with Node's built-in TypeScript type stripping, so they use only erasable syntax (`erasableSyntaxOnly`) and import local modules with the `.ts` extension.

## Adding content
1. Add foods to `content/foods.ts` with codes from `node tools/extract-composition.ts --search <regex>`; add the codes (and cooked/raw pairs with transcribed rates) to `data/composition/` as described in [DATA_SOURCES.md](DATA_SOURCES.md).
2. Add a recipe file under `content/recipes/` and register it in `recipes` in `content/recipes/index.ts` (not in `validationRecipes`, the fixed set that tests of reviewed counts use). The schema is `shared/content.ts` (ADR-026): give steps and safety notes keys, list what is served with the dish under `sides`, link seasonings to the ingredient they scale with (`linkedTo`), and give every recipe at least one adjustable ingredient or solver-removable side.
3. Write `ja`, `en`, and `es` texts; follow `content/glossary.ts` and [CONTENT_POLICY.md](CONTENT_POLICY.md). Serving steps do not name sides; the UI lists the sides that are on.
4. Update `CONTENT_VERSION` in `content/version.ts`.
5. `npm run validate:content` (also part of `npm run build`) checks schemas, locales, IDs, references, cooking states, adjustment bounds, links, sides, substitutions, allergens, safety notes, protein groups, tags, glossary use, forbidden expressions, and the version. When adding a rule, add a failing fixture to `tools/content/validate.test.ts`.

## Adding UI text
1. Add the key and Japanese text to `src/i18n/messages/ja.ts`.
2. Add the same key to `en.ts` and `es.ts`; the type checker fails until all three match, and a test rejects blank strings.
3. Use `t("your.key")`; never hard-code UI strings in components.
4. Texts for engine codes (input errors, contradictions, statuses, reasons, exclusions, relaxations, uncertainty, assumptions, units, allergens, cuisines, equipment) are keyed by the code; `src/i18n/engineCodes.ts` lists every code and `src/i18n/engineCodes.test.ts` requires an entry in each locale. A new code in an engine union fails the type check until it is added to the list.
5. Counts use `_one` and `_other` keys in every locale. `src/i18n/policy.test.ts` applies the forbidden expressions of `content/glossary.ts` to the catalogs.
6. Format numbers with `src/format/format.ts` (values from `roundForDisplay`, separators from `Intl`).
