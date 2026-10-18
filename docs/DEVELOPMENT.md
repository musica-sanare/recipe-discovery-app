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
| `npm run dev` | Vite dev server on http://localhost:5173 (no CSP; see ADR-018) |
| `npm run build` | Type-check, then build to `dist/` including the generated `_headers` |
| `npm run preview` | Serve `dist/` with the production security headers (http://localhost:4173) |
| `npm run lint` | ESLint with type-aware rules and module boundaries |
| `npm run typecheck` | TypeScript project build without emit |
| `npm test` | Vitest (Node by default; UI tests use jsdom per file) |
| `npm run check` | Lint, type-check, tests, and build in sequence |

There is intentionally no deploy script.

## Layout (current)

```text
index.html, src/        UI (React); src/i18n/ holds the typed ja/en/es catalogs
shared/                 Constants and types shared by UI, domain, and tools
platform/               Hosting-specific output (security headers)
test/node/              Node-side tests
docs/, prompts/         Documentation and phase prompts
```

`domain/` and `tools/` are added in later stages; their import rules are already in `eslint.config.js`.

## Adding UI text
1. Add the key and Japanese text to `src/i18n/messages/ja.ts`.
2. Add the same key to `en.ts` and `es.ts`; the type checker fails until all three match, and a test rejects blank strings.
3. Use `t("your.key")`; never hard-code UI strings in components.
