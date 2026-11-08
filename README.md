English | [日本語](README.ja.md)

# Recipe Discovery

Recipe Discovery helps people who track their nutrition (for example for strength training or body composition goals) discover dishes they would not have thought of on their own. Users set nutrition targets and practical conditions, then compare candidate recipes and adjust amounts. Nutrition values are this app's own deterministic estimates, calculated from 日本食品標準成分表（八訂）増補2023年 (MEXT) and explicit ingredient amounts; no AI is used. The app supports Japanese, English, Spanish, and French.

**Status:** Release 16, with 150 recipes in four languages, is deployed at https://recipe-discovery.apps.musica-sanare.com (Phase 18, UI refresh, with dependency updates; [Release readiness](docs/working/RELEASE_READINESS.md)). License: [MIT](LICENSE), except the MEXT-derived data in `data/composition/` ([Data sources](docs/en/DATA_SOURCES.md)). To report a security problem, see the [security policy](SECURITY.md).

## Quick start

Requires Node.js `>=24.15.0` and npm.

```bash
npm ci
```

```bash
npm run dev
```

`npm run check` runs lint, type-check, the license check, tests, and the production build, which includes content validation. All commands: [Local development](docs/en/DEVELOPMENT.md).

## Documentation

- [Documentation index](docs/en/README.md)
- [Product specification](docs/en/SPEC.md) · [Nutrition calculation](docs/en/NUTRITION_CALCULATION.md) · [Data sources and attribution](docs/en/DATA_SOURCES.md)
