# Claude Code first message — Recipe Discovery

Read `CLAUDE.md` and all documents under `docs/` (`SPEC.md`, `ARCHITECTURE.md`, `NUTRITION_CALCULATION.md`, `CONTENT_POLICY.md`, `DATA_SOURCES.md`, `IMPLEMENTATION_PLAN.md`, `DECISIONS.md`, `DEVELOPMENT.md`).

We are building Recipe Discovery: a static web app in Japanese, English, and Spanish (`ja`, `en`, `es`) that helps nutrition-conscious users discover and compare curated recipes that fit their nutrition targets and conditions.

Language policy: communicate with the owner in Japanese at all times; write all repository files in English.

Key decisions (details in `docs/DECISIONS.md`):
- Curated, repository-managed recipes with deterministic amount adjustment and substitutions; no database or admin UI in the MVP.
- Nutrition is calculated deterministically from the MEXT food composition tables; values are estimates with traceable basis and visible uncertainty.
- Food identity is locale-neutral; calculations never depend on the locale.
- No AI at runtime in the MVP.
- Best-effort allergen exclusion without any safety guarantee; no health claims.
- Static hosting on Cloudflare with platform-specific parts isolated.
- Every commit needs the owner's explicit approval; after approval Claude may create exactly that commit. Branch operations and pushes are done by the owner.

Continue with the current phase in `docs/IMPLEMENTATION_PLAN.md` using its prompt file under `prompts/`. Start by reporting the repository state and the intended changes for the next stage, then wait for approval.
