English | [日本語](../ja/DEVELOPMENT.md) · [Docs index](README.md)

# Local Development

This guide is for developers who work on Recipe Discovery on their own machine. It covers setup, the npm commands, CI, the repository layout, and the steps for adding recipes and UI text. No accounts, API keys, or secrets are needed, and nothing in this guide creates remote resources.

## Prerequisites

- Node.js `>=24.15.0` (`.nvmrc` pins 24)
- npm (bundled with Node; the committed `package-lock.json` is authoritative)

## Setup

> [!WARNING]
> Do not install with `--omit=optional`. The platform binaries come from optional dependencies.

```bash
npm ci
```

`.npmrc` enables `engine-strict` and `strict-allow-scripts` ([DECISIONS.md](../working/DECISIONS.md) ADR-018). If an install fails with `ESTRICTALLOWSCRIPTS`, a dependency introduced an install script. Review what it does, then record a decision in `package.json` `allowScripts` and in ADR-018.

## Commands

### Daily work

| Command | Purpose |
|---|---|
| `npm run dev` | Generate the content bundles, then start the Vite dev server on http://localhost:5173 (no CSP; see ADR-018). Rerun `npm run content:build` after changing content |
| `npm run check` | Lint, type-check, license check, tests, and build in sequence |
| `npm test` | Vitest (Node by default; UI tests use jsdom per file; `test/ui/` runs the app on the repository content) |
| `npm run lint` | ESLint with type-aware rules and module boundaries |
| `npm run typecheck` | TypeScript project build without emit |
| `npm run validate:content` | Content validation only (`tools/content/validate.ts`); prints one line per problem with file, recipe or food, field, and rule |

### Build and preview

| Command | Purpose |
|---|---|
| `npm run build` | Validate content, generate the content bundles, type-check, then build to `dist/` (details below) |
| `npm run content:build` | Write the content bundles to `generated/content/` and print their sizes (ADR-027) |
| `npm run preview` | Serve `dist/` with the production security headers (http://localhost:4173) |
| `npm run check:licenses` | Check the licenses of every package in `package-lock.json` against `tools/licenses.ts` (details below) |

- `npm run build` also writes the generated `_headers` and `third-party-licenses.txt` to `dist/`. The license file comes from Vite `build.license` and is linked from the about page.
- `npm run check:licenses` allows MIT, ISC, Apache-2.0, BSD, and 0BSD in production. Development dependencies may also use MPL-2.0, BlueOak-1.0.0, MIT-0, CC0-1.0, and CC-BY-4.0.

### End-to-end tests and timing

| Command | Purpose |
|---|---|
| `npm run test:e2e` | Playwright on the production build with headers (details below) |
| `npm run test:e2e:timing` | Phone-class timing with CPU throttling (project `timing`, Chromium); writes `test-results/timing.json` |
| `npm run bench:recommendation` | Node timing of a full search on the repository recipes and on an in-memory synthetic library of 180 recipes (details below) |

- `npm run test:e2e` runs `npm run build && npm run preview` on port 4174. Its projects are `desktop-chromium`, `mobile-chromium`, and `mobile-webkit`, and every spec runs in every locale (`e2e/`).
- Install the browsers once, into the user cache outside the repository:

  ```bash
  npx playwright install --only-shell chromium webkit
  ```

- With `TIMING_LIBRARY=synthetic`, `npm run test:e2e:timing` uses a network stub that serves the synthetic library of `tools/synthetic-library.ts` instead of the content bundles. The numbers go to `test-results/timing-synthetic.json`.
- The synthetic library of `npm run bench:recommendation` (`tools/synthetic-library.ts`) adds recipes spread evenly over the library again under new IDs. It is never published. Background: [DECISIONS.md](../working/DECISIONS.md) "Stage 6.2", "Stage 9.2", "Stage 10.1 expansion plan".

### Data and evaluation

| Command | Purpose |
|---|---|
| `npm run data:extract` | Regenerate `data/composition/foods.json` from the MEXT workbook in `data/raw/` ([DATA_SOURCES.md](DATA_SOURCES.md) "Extraction") |
| `npm run data:verify-cooking` | macOS only: check `data/composition/cooking.json` against the MEXT explanation PDF text ([DATA_SOURCES.md](DATA_SOURCES.md) "Cooking tables") |
| `npm run report:composition` | Per recipe and ingredient, from the nutrition engine: exact, approximation (with the ADR-028 reasons), hard to estimate, not counted, fried; fails when a cooked state has no weight change rate |
| `npm run eval:coverage` | How many validation recipes meet representative targets with default and adjusted amounts, computed by the recommendation engine ([DECISIONS.md](../working/DECISIONS.md) "Stage 0.6", "Stage 3.7") |
| `npm run eval:ai` | On demand, never in CI: runs the 240 cases of `data/ai-evaluation/conditions.json` through the AI endpoint core and checks the ADR-034 D4 thresholds. `--adapter parser` (default) runs the deterministic parser; `--adapter expected` is a fake that returns the expected outputs and checks the pipeline. `--split dev` is for tuning and `--split holdout` decides acceptance (default `all`). Options: `--locale ja` and `--intent <id>` (repeatable), `--cases` (one line per case), `--json` ([DECISIONS.md](../working/DECISIONS.md) "Stage 12.3 evaluation set and script", "Stage 12.4 deterministic parser") |

### Browser previews

`.claude/launch.json` has two configurations:
- `preview`: the production build with headers, port 4173.
- `dev`: the Vite dev server, port 5173. Engine modules can be imported in the page for measurements.

Timing numbers from a hidden or background tab are not reliable.

## Deployment and CI

There is no local deploy command. A push to `main`, which only the owner makes, is a production deploy: Cloudflare Workers Builds builds it and runs `platform/cloudflare/deploy.ts` ([DEPLOYMENT.md](DEPLOYMENT.md) §3).

CI (`.github/workflows/ci.yml`, GitHub Actions on `ubuntu-24.04`) runs on pushes to `dev` and `main` and on pull requests:
- One job runs `npm ci` and `npm run check`.
- Another job runs `npm run test:e2e`, after `npx playwright install --with-deps --only-shell chromium webkit`.
- CI has read-only permissions, no secrets, and no deployment. The Playwright report is uploaded only when E2E fails and is kept for 7 days. Actions are pinned to commit SHAs.

## Layout (current)

```text
index.html, src/        UI (React, Tailwind CSS; docs/en/UI_DESIGN.md): i18n/ typed ja/en/es/fr catalogs and engine code lists,
                        format/ locale formatting, navigation/ History API views, state/ reducer and engine calls,
                        views/ screens, testing/ axe-core helper
shared/                 Schemas (Zod), constants, and types shared by UI, domain, content, and tools; the free-text
                        conditions contract (suggestion.ts, ADR-034), parser and word lists (freeText/), search
                        normalization (search.ts)
server/ai/              Core of the free-text conditions pipeline, adapter interface, fake adapter (reshaped in
                        Stage 12.4)
domain/nutrition/       Pure, locale-free nutrition engine (ADR-028); tests next to the code
domain/recommendation/  Pure, locale-free recommendation engine (ADR-029); tests next to the code
domain/shopping/        Pure, locale-free shopping list aggregation (ADR-032); tests next to the code
content/                Food dictionary (foods.ts), recipes (recipes/, one file per recipe), glossary (glossary.ts),
                        content version (version.ts); TypeScript, validated at build time
platform/               Hosting-specific output: security headers (headers.ts), Cloudflare config (cloudflare/)
tools/                  Build-time tools run directly by Node (TypeScript type stripping)
generated/content/      Content bundles written by tools/build-content.ts (git-ignored)
data/composition/       Extraction manifest and the tracked composition subset
data/ai-evaluation/     Evaluation set of the free-text conditions (ADR-034 D4), read by tools/ai-evaluation/
data/raw/               Original source files, such as the MEXT workbook (git-ignored)
test/node/              Node-side tests
test/ui/                jsdom tests of the app on the repository content (tsconfig.ui.json)
docs/, prompts/         Documentation and phase prompts
```

- `domain/` may import only `shared/` (and content in tests); `eslint.config.js` enforces this.
- Tools and repository tests obtain engine input from the in-memory calculation bundle (`tools/content/repository.ts`).
- Files under `tools/` run with Node's built-in TypeScript type stripping. So they use only erasable syntax (`erasableSyntaxOnly`) and import local modules with the `.ts` extension.

## Adding content

1. Add foods to `content/foods.ts` with codes from `node tools/extract-composition.ts --search <regex>`. Add the codes (and cooked/raw pairs with transcribed rates) to `data/composition/` as described in [DATA_SOURCES.md](DATA_SOURCES.md).
2. Add a recipe file under `content/recipes/` and register it in `recipes` in `content/recipes/index.ts`. Do not register it in `validationRecipes`, the fixed set that tests of reviewed counts use. The schema is `shared/content.ts` (ADR-026):
   - give steps and safety notes keys;
   - list what is served with the dish under `sides`;
   - link seasonings to the ingredient they scale with (`linkedTo`);
   - give every recipe at least one adjustable ingredient or solver-removable side.
3. Write `ja`, `en`, `es`, and `fr` texts; follow `content/glossary.ts` and [CONTENT_POLICY.md](CONTENT_POLICY.md). Serving steps do not name sides; the UI lists the sides that are on.
4. Update `CONTENT_VERSION` in `content/version.ts`.
5. Run `npm run validate:content` (also part of `npm run build`). It checks schemas, locales, IDs, references, cooking states, adjustment bounds, links, sides, substitutions, allergens, safety notes, protein groups, tags, glossary use, forbidden expressions, and the version. When adding a rule, add a failing fixture to `tools/content/validate.test.ts`.

## Adding UI text

1. Add the key and Japanese text to `src/i18n/messages/ja.ts`.
2. Add the same key to `en.ts`, `es.ts`, and `fr.ts`. The type checker fails until all four match, and a test rejects blank strings.
3. Use `t("your.key")`; never hard-code UI strings in components.
4. Texts for engine codes are keyed by the code: input errors, contradictions, statuses, reasons, exclusions, relaxations, uncertainty, assumptions, units, allergens, cuisines, equipment. `src/i18n/engineCodes.ts` lists every code, and `src/i18n/engineCodes.test.ts` requires an entry in each locale. A new code in an engine union fails the type check until it is added to the list.
5. Counts use `_one` and `_other` keys in every locale. `src/i18n/policy.test.ts` applies the forbidden expressions of `content/glossary.ts` to the catalogs.
6. Format numbers with `src/format/format.ts` (values from `roundForDisplay`, separators from `Intl`).
