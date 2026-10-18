# Project instructions for Claude Code

## Product
Build **Recipe Discovery**, a responsive web app that helps nutrition-conscious users (initially strength training and body composition) discover and compare recipes that fit their nutrition targets and practical conditions. The main value is widening the user's repertoire with dishes they would not have thought of, backed by transparent, deterministic nutrition calculations.

This file has two parts:
- **Part A** contains rules shared with the owner's other web apps (language, Git, engineering, verification). They come from the owner's established workflow.
- **Part B** contains principles specific to Recipe Discovery. Do not carry rules from other projects into Part B, and do not weaken Part B with rules from elsewhere.

## Read first
Before changing code or content, read:
- `docs/SPEC.md`
- `docs/ARCHITECTURE.md`
- `docs/NUTRITION_CALCULATION.md`
- `docs/CONTENT_POLICY.md`
- `docs/DATA_SOURCES.md`
- `docs/IMPLEMENTATION_PLAN.md`
- `docs/DECISIONS.md`
- `docs/DEVELOPMENT.md`

If any path does not exist, report it rather than silently inventing its contents.

---

# Part A — Shared rules

## Language policy (mandatory)
- All communication with the project owner in Claude Code conversations must be in Japanese, including questions, progress updates, explanations, test summaries, and handoff notes.
- All repository documentation and prose intended to live in the repository must be written in English, including Markdown docs, README, architecture notes, ADRs, setup instructions, and source comments.
- Source-code comments and docstrings must be in English. Prefer clear naming over comments; do not add redundant comments.
- Discuss the work with the owner in Japanese even when repository artifacts are written in English.

## Git and commit conventions

### Approval and repository hygiene
- The repository is private.
- Commits require the owner's explicit approval each time. After the owner approves a specific proposed commit (message and file list), Claude may stage and create exactly that commit. An approval covers only the commit that was reviewed.
- The owner performs branch creation, remote configuration, and pushes. Never push, create or switch branches, change remotes, rewrite history, or deploy unless the owner explicitly asks for that specific action.
- Never commit secrets, `.env` files, personal data, real API tokens, or generated credentials. Include `.env.example` with placeholders only when environment variables exist.
- Never commit original third-party data files (for example the MEXT Excel workbook). Only extracted subsets allowed by `docs/DATA_SOURCES.md` are tracked.
- Keep commits focused. Do not mix unrelated changes.
- Before proposing a commit, review the full working-tree diff and the complete list of files to be committed (including new, untracked files), and confirm that no secrets, generated files, raw source data, or unrelated changes are included.
- Before any public release, inspect the complete repository history and scan for secrets.

### Commit message format
- Write commit messages in English.
- Subject line: a Conventional Commits prefix (`feat:`, `fix:`, `docs:`, `test:`, `refactor:`, `chore:`, etc.) followed by a concise summary in the imperative mood, preferably 50 characters or fewer in total.
- Body: always contains these three sections, in this order:
  1. `Change:` what changed.
  2. `Reason:` why the change was necessary or what problem it addresses.
  3. `Handoff:` follow-up work, unresolved issues, known limitations, or other information the next contributor needs. Write `None.` when there is nothing to hand off.
- Keep each section concise: enough to understand what changed, why, and what comes next, without reopening the original conversation.

### Referencing documentation instead of duplicating it
- When details are already recorded in documentation, ADRs, or source code, point to them (file path plus heading or ADR number) instead of repeating them.
- Only reference files and headings that exist in the commit being made and actually contain the information.
- References support the message; they do not replace it. The message alone must still convey the summary of the change and its reason.

### Proposing a commit
- Show the complete commit message (subject and full body) together with the list of files to be committed.
- Wait for the owner's explicit approval. Then either the owner commits, or Claude creates exactly the approved commit and reports its hash.

## Engineering rules
- Use TypeScript strict mode (see `docs/DECISIONS.md` for the exact compiler options once the toolchain is set up).
- Use the package manager and lockfile selected during foundation setup; do not switch later without approval.
- Keep UI, domain logic, content data, build-time tooling, and any platform or AI integration separated.
- Add or update tests for behavior changes.
- Run lint, type-check, tests, content validation, and production build after meaningful changes.
- Do not claim a command passed unless it was actually run and its result was checked.
- Do not silently suppress TypeScript errors, lint rules, or failing tests. Avoid `any`; if it is necessary, document why.
- Handle loading, empty, validation-error, and failure states.
- Use semantic HTML, keyboard-accessible controls, visible focus, and responsive layouts.
- Do not add analytics, trackers, cookies, or external services without documenting the purpose and privacy impact and getting approval.
- Keep all secrets out of source control and browser bundles.
- Prefer the smallest understandable implementation over unnecessary abstractions.

## Dependencies and current documentation
- Before choosing framework or tool versions or platform capabilities, verify current official documentation and compatibility. Prefer stable releases. Record important choices, sources, and the date checked in `docs/DECISIONS.md`.
- Do not assume free tiers, limits, prices, or terms from memory. Distinguish verified facts from assumptions and mark unverified items `要確認`.
- Dependency install scripts must be reviewed explicitly (allowlist policy, recorded in `docs/DECISIONS.md` during Phase 0).
- Do not create external accounts, API keys, paid resources, or deployments without explicit approval.

## Workflow
- Work one phase at a time as described in `docs/IMPLEMENTATION_PLAN.md`.
- Start each phase by stating the intended changes and files affected.
- Inspect existing files before editing.
- After implementation, run relevant checks and summarize in Japanese:
  - changed files
  - decisions made
  - commands/tests run and results
  - known limitations / `要確認` (open items that need the owner's confirmation)
  - next recommended step
- Do not proceed to the next phase until the current phase's acceptance criteria pass.
- If a decision would materially change cost, security, deployment, privacy, data model, or nutrition accuracy, stop and ask before proceeding.
- When several designs are viable, present the options, trade-offs, and a recommendation instead of choosing silently.

---

# Part B — Recipe Discovery principles (non-negotiable)

## Nutrition and recommendation
1. Nutrition values are calculated deterministically from food composition data and explicit ingredient amounts. They are never generated, estimated, or adjusted by AI.
2. Nutrition calculation, target fit evaluation, ranking, diversification, amount adjustment, and substitution are deterministic: the same input and data always produce the same result.
3. Every displayed nutrition value is an estimate. Label it as such and keep its basis traceable (food code, data version, cooking state, assumptions).
4. Never present an uncertain value or an approximate food mapping as exact. Unmeasured values (`-` in the source tables) are unknown, never zero.
5. Follow `docs/NUTRITION_CALCULATION.md`; changing a formula, a source column, or a rounding rule is a decision that needs the owner's approval and an ADR.

## Localization
6. The UI and all content support Japanese, English, and Spanish (`ja`, `en`, `es`) from the MVP. This is part of the owner's product identity, not an optional extra.
7. Localization covers UI strings, recipe names, ingredient names, cooking steps, notes, input and validation messages, error states, and accessibility labels. Keep UI strings out of components and domain logic; use typed keys.
8. Food identity is locale-neutral. Translation never affects calculation: calculation functions do not accept a locale, and switching the language must not change any calculated value.
9. Translations are canonical content stored in the repository. Do not machine-translate at runtime.
10. Format numbers and units according to the selected locale without changing the underlying values.

## Content and data
11. Recipes are original, structured content managed in the repository and validated at build time. Do not copy recipe text or photos from other sources.
12. Original source data files (for example the MEXT Excel workbook) are kept outside Git. Extracted subsets are generated by a script and tracked with their source version and checksum (`docs/DATA_SOURCES.md`).
13. Always show the data attribution required by the data source, and state that values are this app's own calculations.

## Safety and health
14. Allergen filtering is best effort. Never state or imply that a recipe is allergen-free or safe for a person with allergies. Unknown allergen information is treated as "may contain".
15. Do not make health, medical, or efficacy claims (for example "burns fat" or "good for a condition"). Targets are set by the user; presets are examples, not advice.
16. Follow the food safety rules in `docs/CONTENT_POLICY.md` for every recipe.

## AI
17. The MVP does not use AI at runtime. Every core feature must work without AI.
18. If AI is introduced later, it may only produce supplementary text or structured suggestions that the user confirms. It must never produce nutrition values, allergen judgments, health claims, or cooking temperatures and times, and its output must be validated at runtime.

## Platform
19. The MVP is a static site deployed on Cloudflare. Keep platform-specific configuration isolated so the app can move to another host without changing domain, content, or UI code.
20. No user accounts and no server-side storage of user targets, conditions, or history in the MVP.
