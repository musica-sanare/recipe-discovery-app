# Local Development

## Prerequisites
- Node.js `>=24.15.0` (`.nvmrc` pins 24)
- npm (bundled with Node; the committed `package-lock.json` is authoritative)

No accounts, API keys, or secrets are needed. Nothing in this guide creates remote resources.

## Setup

```bash
npm ci
```

`.npmrc` enables `engine-strict` and `strict-allow-scripts` (`docs/DECISIONS.md` ADR-018). If an install fails with `ESTRICTALLOWSCRIPTS`, a dependency introduced an install script: review what it does and record a decision in `package.json` `allowScripts` and in ADR-018. Do not install with `--omit=optional` (platform binaries come from optional dependencies).

## Commands

| Command | Purpose |
|---|---|
| `npm run dev` | Generate the content bundles, then start the Vite dev server on http://localhost:5173 (no CSP; see ADR-018). Rerun `npm run content:build` after changing content |
| `npm run content:build` | Write the content bundles to `generated/content/` and print their sizes (ADR-027) |
| `npm run build` | Validate content, generate the content bundles, type-check, then build to `dist/` including the generated `_headers` |
| `npm run report:composition` | Per recipe and ingredient, from the nutrition engine: exact, approximation (with the ADR-028 reasons), hard to estimate, not counted, fried; fails when a cooked state has no weight change rate |
| `npm run validate:content` | Content validation only (`tools/content/validate.ts`); prints one line per problem with file, recipe or food, field, and rule |
| `npm run preview` | Serve `dist/` with the production security headers (http://localhost:4173) |
| `npm run lint` | ESLint with type-aware rules and module boundaries |
| `npm run typecheck` | TypeScript project build without emit |
| `npm test` | Vitest (Node by default; UI tests use jsdom per file) |
| `npm run check` | Lint, type-check, tests, and build in sequence |
| `npm run data:extract` | Regenerate `data/composition/foods.json` from the MEXT workbook in `data/raw/` (`docs/DATA_SOURCES.md` "Extraction") |
| `npm run eval:coverage` | Phase 0 evaluation: how many validation recipes meet representative targets with fixed and adjusted amounts (`docs/DECISIONS.md` "Stage 0.6") |
| `npm run data:verify-cooking` | macOS only: check `data/composition/cooking.json` against the MEXT explanation PDF text (`docs/DATA_SOURCES.md` "Cooking tables") |

There is intentionally no deploy script.

## Layout (current)

```text
index.html, src/        UI (React); src/i18n/ holds the typed ja/en/es catalogs
shared/                 Schemas, constants, and types shared by UI, domain, content, and tools
domain/nutrition/       Pure, locale-free nutrition engine (ADR-028); tests next to the code
content/                Food dictionary, recipes, glossary, content version (TypeScript, validated at build time)
platform/               Hosting-specific output (security headers)
tools/                  Build-time tools run directly by Node (TypeScript type stripping)
generated/content/      Content bundles written by tools/build-content.ts (git-ignored)
data/composition/       Extraction manifest and the tracked composition subset
data/raw/               Original source files (git-ignored)
test/node/              Node-side tests
docs/, prompts/         Documentation and phase prompts
```

`domain/` may import only `shared/` (and content in tests); `eslint.config.js` enforces this. Tools and repository tests obtain engine input from the in-memory calculation bundle (`tools/content/repository.ts`). Files under `tools/` run with Node's built-in TypeScript type stripping, so they use only erasable syntax (`erasableSyntaxOnly`) and import local modules with the `.ts` extension.

## Adding content
1. Add foods to `content/foods.ts` with codes from `node tools/extract-composition.ts --search <regex>`; add the codes (and cooked/raw pairs with transcribed rates) to `data/composition/` as described in `docs/DATA_SOURCES.md`.
2. Add a recipe file under `content/recipes/` and register it in `content/recipes/index.ts`. The schema is `shared/content.ts` (ADR-026): give steps and safety notes keys, list what is served with the dish under `sides`, link seasonings to the ingredient they scale with (`linkedTo`), and give every recipe at least one adjustable ingredient or solver-removable side.
3. Write `ja`, `en`, and `es` texts; follow `content/glossary.ts` and `docs/CONTENT_POLICY.md`. Serving steps do not name sides; the UI lists the sides that are on.
4. Update `CONTENT_VERSION` in `content/version.ts`.
5. `npm run validate:content` (also part of `npm run build`) checks schemas, locales, IDs, references, cooking states, adjustment bounds, links, sides, substitutions, allergens, safety notes, protein groups, tags, glossary use, forbidden expressions, and the version. When adding a rule, add a failing fixture to `tools/content/validate.test.ts`.

## Adding UI text
1. Add the key and Japanese text to `src/i18n/messages/ja.ts`.
2. Add the same key to `en.ts` and `es.ts`; the type checker fails until all three match, and a test rejects blank strings.
3. Use `t("your.key")`; never hard-code UI strings in components.
