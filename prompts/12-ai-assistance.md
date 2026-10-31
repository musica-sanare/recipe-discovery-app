# Prompt 12 — Phase 12: AI assistance

You are the lead engineer for Recipe Discovery. Read `CLAUDE.md` and every document under `docs/en/` and `docs/working/` before making changes. Phase 0 to Phase 11 results are in `docs/working/DECISIONS.md` (in particular ADR-001, ADR-004, ADR-005, ADR-015, ADR-027, ADR-029, ADR-030, ADR-033; the verification log entry "Workers AI (for later phases only)"; "Phase 10 acceptance"; "Phase 11 start: French locale" to "Phase 11 acceptance", including "Bundle-size warning accepted" and "Eighth production deployment"; "Open questions"). ADR-004 and the stable docs written before Phase 11 say "three locales"; since ADR-033 every locale requirement means four: `ja`, `en`, `es`, and `fr`. Communicate with the owner in Japanese; write repository files in English.

## Starting point
- Branch `dev`; release 8 (Phase 11, the French locale) was deployed on 2026-10-31 from commit `2aa0c7b` (version `54ef9ecc-f862-4fa2-ad75-099b56d6a8fe`), recorded in `493b431`, followed by the commit that updates this prompt; release 7 (`cb086c1`) is the rollback target. The owner creates branches and pushes unless they ask Claude to push.
- Content version `2026-10-31.8`: 130 recipes and 117 foods in `ja`, `en`, `es`, and `fr`. `npm run check` (747 tests), `npm run test:e2e` (140 passed, 1 skipped), and CI pass. A full recommendation takes about 55–58 ms median and 64–65 ms p90 at a 4× CPU slowdown (ADR-030 D10 threshold about 100 ms).
- The app is a static single-page application on Cloudflare Workers static assets without any Worker code (ADR-001); no data leaves the browser (ADR-015, [SPEC.md](../docs/en/SPEC.md) §13); the CSP allows only `'self'`; AI at runtime is out of scope ([SPEC.md](../docs/en/SPEC.md) §3, ADR-004).
- Maintenance: open question 22 (`minimatch` 10.2.6 in the development dependencies) and ADR-017 (`typescript-eslint` without TypeScript 7 support) are re-checked at the start of the phase; ADR-016 applies to every dependency, including any SDK this phase may add. Wrangler is not installed in a new session; reinstall it only after the owner approves the download, as in `docs/working/DECISIONS.md` "Seventh production deployment".
- Open after Phase 11: the JavaScript bundle is 522 kB (gzip 155 kB) and Vite warns about chunks over 500 kB; the owner accepted the warning, with per-locale UI catalogs as a later option ("Bundle-size warning accepted"). New UI strings for this phase add to all four catalogs. French has no native reviewer (open question 23), which also limits the human review of the `fr` evaluation.

## Fixed constraints (from CLAUDE.md and the existing decisions)
- Principle 17: every core feature keeps working without AI. The AI feature is optional and has a deterministic fallback; when it fails, is disabled, or is unreachable, the app behaves as release 8.
- Principle 18: AI may only produce supplementary text or structured suggestions that the user confirms. It never produces nutrition values, allergen judgments, health claims, or cooking temperatures and times, and its output is validated at runtime.
- Principles 1, 2, and 8: nutrition, fit, ranking, adjustment, and substitution stay deterministic and locale-free; AI output never feeds a calculation except as user-confirmed input that the existing engines then process (for example food IDs from the dictionary).
- [CONTENT_POLICY.md](../docs/en/CONTENT_POLICY.md) §7: generated text follows §§2–5, is labelled as generated, and is validated at runtime with a deterministic fallback.
- ADR-004 "Later candidates": free-text input structuring and explanation text, each requiring evaluation in every supported locale, now four (fixed evaluation sets, ID precision and recall, cross-locale consistency, human review), a server endpoint, and the owner's approval.
- [ARCHITECTURE.md](../docs/en/ARCHITECTURE.md) §7 and §8: a server feature defines its HTTP contract in `shared/`, keeps the provider-specific code in a thin adapter, validates inputs and outputs at runtime, and never logs user targets or conditions.
- No account, API key, token, paid resource, Worker, or deployment without the owner's explicit approval of that specific action; secrets never enter the repository or the browser bundle.

## Goal
Decide and, if approved, build one optional AI feature that widens access to the app's deterministic core without weakening it, evaluated in `ja`, `en`, `es`, and `fr` before any release.

## Working rules
- Work in stages. Each stage starts with the intended changes and affected files, and ends with checks, a Japanese summary (changed files, decisions, commands and results, 要確認, next stage), and a commit proposal with the full message and file list written in the message itself. Commit only after the owner approves that specific commit.
- Verify current official documentation before proposing a provider, model, SDK, price, limit, data-retention term, or platform capability; record the source and the date checked in `docs/working/DECISIONS.md`; mark anything unverified as 要確認. Do not assume free tiers or prices.
- Tests never call a real provider: the adapter has a fake for unit, UI, and E2E tests; the evaluation against a real provider is a separate, on-demand script whose results are recorded, not a CI job.
- Every change to `docs/en/` updates `docs/ja/` and its source line in the same commit; run the "Checks" of the shared rules' ADOPTING.md before proposing a commit.

## Stages

### 12.1 Decisions before any implementation (owner review)
Propose options with trade-offs and a recommendation for each, and wait for the owner's decisions:
1. **Feature**: (a) free-text conditions: the user types a request such as 「鶏むね肉で20分以内、辛くないもの」 or "something with chickpeas, no fish", and the AI returns structured conditions (food IDs from the dictionary, maximum minutes, equipment, cuisines, excluded foods; never targets or allergens), which the targets view shows for the user to confirm or edit before the deterministic search; (b) explanation text: a short, labelled explanation of why a candidate fits, written only from the deterministic reason data and statuses the engine already returns; (c) another candidate the owner names. Recommend one feature for this phase and state why.
2. **Provider and model**: for example Cloudflare Workers AI (the verification log of 2026-10-18 found no text-generation model that lists Japanese support; re-check) or an external API called from a Worker (for example Anthropic's Claude API). Compare language quality in `ja`, `en`, `es`, and `fr`, structured-output support, data use and retention terms, regions, model versioning and deprecation, latency, and lock-in (ADR-001).
3. **Server endpoint and privacy**: the endpoint's host (a Worker next to the static assets or another host), what is sent (only the free text or the reason data, never body-related targets), what the provider and the endpoint log or retain, rate limiting and abuse handling, the CSP change (`connect-src`), and the changes to ADR-001, ADR-015, [SPEC.md](../docs/en/SPEC.md) §3 and §13, and the privacy statement on the about page.
4. **Evaluation in four locales**: fixed evaluation sets per locale (size, who writes them, how they cover regional vocabulary and aliases, and how `es` and `fr` are reviewed without a native reviewer), metrics (for structuring: food-ID precision and recall, per-field accuracy, rejection of out-of-scope requests; for explanations: forbidden-expression checks, no numbers other than those in the reason data, human review), cross-locale consistency, and the thresholds that must hold before a release.
5. **Cost and limits**: the price per request and any free allowance (verified on the day), the expected volume, a hard budget or quota, what happens when it is reached (the deterministic fallback), and who owns the account, keys, and billing.
6. **UX and failure states**: where the feature appears, the "generated" label in four locales, loading, timeout, refusal, invalid output, and offline states, and how the user confirms or discards the suggestion.

Record the decisions as ADRs (a new ADR for the feature; revisions of ADR-001, ADR-004, and ADR-015 where they change) and update [SPEC.md](../docs/en/SPEC.md) with its translation.

### 12.2 Contract, validation, and fallback
1. The HTTP contract and its runtime schemas in `shared/` (request, response, error), a thin provider adapter behind an interface, and a fake adapter for tests.
2. Output validation: schema, dictionary membership of every food ID, allowed fields only, length limits, forbidden expressions in four locales; any failure falls back to the deterministic behavior with a localized message.
3. Unit tests for the contract, the validation, and the fallback; no network in tests.

### 12.3 Evaluation (needs the owner's approval for any account or key)
1. The evaluation sets in four locales, committed as data with their source and review status.
2. An on-demand evaluation script against the chosen provider, run only after the owner approves the account, key, and expected cost; results recorded in `docs/working/DECISIONS.md` against the thresholds of 12.1.
3. If a threshold fails, propose options (prompt or model changes, a narrower scope, or stopping the feature) before continuing.

### 12.4 UI and localization
The feature in the UI with its label, confirmation, and failure states in `ja`, `en`, `es`, and `fr`; accessibility checks in four locales; E2E with the fake adapter; browser checks at desktop width and 375 px; [UI_DESIGN.md](../docs/en/UI_DESIGN.md) and its translation updated.

### 12.5 Release 9
1. Release readiness as for release 8, plus the endpoint: security headers and CSP, no logging of user input, rate limiting, the budget guard, the fallback with the endpoint disabled, and the secret scan of the history.
2. A deployment proposal (the static assets and the endpoint, the secret setup, the rollback to release 8, and the cost) for the owner's explicit approval; [DEPLOYMENT.md](../docs/en/DEPLOYMENT.md) and its translation updated; deploy and run the post-deployment checks only after that approval.

## Out of scope
- AI that produces or changes nutrition values, allergen information, health statements, cooking temperatures or times, or recipe content.
- AI-generated recipes, AI substitutions, or AI ranking.
- Accounts, server-side storage of user targets, conditions, or history, analytics, and trackers.
- Any account, key, token, paid resource, Worker, or deployment without the owner's explicit approval.

## Acceptance
- The owner's decisions of 12.1 are recorded as ADRs, and [SPEC.md](../docs/en/SPEC.md) and the affected docs are updated with their translations.
- The feature works only as an optional, confirmed suggestion; with the AI disabled or failing, the app behaves as release 8 (tested).
- The evaluation in four locales meets the agreed thresholds, or the owner has decided how to proceed.
- No secret is in the repository or the bundle; the endpoint does not log user input; the budget guard is in place.
- `npm run check`, `npm run test:e2e`, and CI pass; release 9 is deployed only after the owner's approval.
