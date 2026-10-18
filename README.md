# Recipe Discovery

Recipe Discovery helps people who track their nutrition (for example for strength training or body composition goals) discover dishes they would not have thought of on their own. Users set nutrition targets and practical conditions (time, effort, preferences, exclusions), then compare several candidate recipes side by side. Nutrition values are calculated deterministically from food composition data and explicit ingredient amounts, never self-reported by AI.

The app supports Japanese, English, and Spanish (`ja`, `en`, `es`) from the MVP.

## Status

Planning. No application code exists yet. The product specification and design documents are the current baseline:

| Document | Contents |
|---|---|
| [`docs/SPEC.md`](docs/SPEC.md) | Product requirements, user experience, MVP scope, acceptance criteria |
| [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) | Technical structure and responsibilities |
| [`docs/NUTRITION_CALCULATION.md`](docs/NUTRITION_CALCULATION.md) | Nutrition calculation rules and uncertainty handling |
| [`docs/CONTENT_POLICY.md`](docs/CONTENT_POLICY.md) | Recipe authoring, allergens, food safety, health expressions, translations |
| [`docs/DATA_SOURCES.md`](docs/DATA_SOURCES.md) | External data sources, terms, attribution, and handling rules |
| [`docs/DECISIONS.md`](docs/DECISIONS.md) | Verification log and architecture decision records |
| [`docs/IMPLEMENTATION_PLAN.md`](docs/IMPLEMENTATION_PLAN.md) | Phased plan from validation to MVP |

Contributor and AI-assistant rules are in [`CLAUDE.md`](CLAUDE.md).

## Data attribution

Nutrition values will be calculated from the Standard Tables of Food Composition in Japan published by the Ministry of Education, Culture, Sports, Science and Technology (MEXT): 日本食品標準成分表（八訂）増補2023年. See `docs/DATA_SOURCES.md`.

## License

Not chosen yet. The repository is private.
