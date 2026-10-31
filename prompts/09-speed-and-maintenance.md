# Prompt 09 — Phase 9: recommendation speed and maintenance

You are the lead engineer for Recipe Discovery. Read `CLAUDE.md` and every document under `docs/en/` and `docs/working/` before making changes. Phase 0 to Phase 8 results are in `docs/working/DECISIONS.md` (in particular ADR-016, ADR-017, ADR-018, ADR-029 D4, ADR-030 D10; "Stage 5.4 E2E suite and phone-class timing", "Stage 6.2 recommendation speed: plan and baseline" and "optimization", "Stage 8.4 release 4 preparation" to "Phase 8 acceptance"; "Open questions"). Communicate with the owner in Japanese; write repository files in English.

## Starting point
- Branch `dev`; release 4 was deployed on 2026-10-25 from commit `2bcbb9b` (version `5a4ae857-f25e-4bdc-8db1-2246c280aeef`), recorded in `05ca4ea`; release 3 (`7b66ca3`) is the rollback target. The owner creates branches and pushes unless they allow Claude to push for a specific step.
- Content version `2026-10-25.2`: 86 recipes and 94 foods in `ja`, `en`, and `es`, unchanged in Phase 8. `npm run check` (680 tests), `npm run test:e2e` (107 passed, 1 skipped), and CI pass.
- Speed: on 2026-10-25 a full recommendation took 87.6–87.8 ms (cut) and 80.5–82.5 ms (bulk) median at a 4× CPU slowdown, p90 98.9–100.4 ms, against the ADR-030 D10 threshold of about 100 ms; release 3's code measured right after on the same machine gave the same range, so the difference from the release 3 record (82 ms) is the measuring environment. `npm run bench:recommendation` (Node): bulk 15.1 ms on 86 recipes (23,041 grid states). Stage 6.2 applied O1 (solver grid loop) and O2 (engine allocations) and left O3 (reusing engine probes across searches), O4 (grid pruning), and a worker unused. The library cannot grow (Phase 7 option) until the recommendation is faster.
- Maintenance: the ADR-016 re-check of `i18next` (pinned 26.4.7; latest 26.5.10 of 2026-10-24 10:15 UTC) and `react-i18next` (pinned 17.0.20; latest 17.1.8 of 2026-10-24 12:39 UTC) is due after 2026-10-26 12:40 UTC (open question 16; deferred for releases 1 to 4). ADR-017: on 2026-10-25 `typescript-eslint` 8.72.0 still declares peer `typescript >=4.8.4 <6.1.0` (TypeScript 7.0.2 is the latest). The optional iPhone check of release 4 (`docs/working/RELEASE_READINESS.md` §4, including "Copy as text" and the print preview) may be reported by the owner at any time.
- Tools: gitleaks 8.30.1 is installed through Homebrew. Wrangler was installed in an earlier session's scratch directory and is not available; reinstall it as in `docs/en/DEPLOYMENT.md` §3 and `docs/working/DECISIONS.md` "Fourth production deployment" (version, integrity, `--ignore-scripts`, `npm audit` with overrides, global state compared before and after) only after the owner approves the download.
- The MEXT workbook and explanation PDF are in `data/raw/mext/` (outside Git).

## Goal
Give the recommendation enough margin under the ADR-030 D10 threshold for a larger library, without changing any result, and bring the dependencies up to date under ADR-016 and ADR-017. A release follows only if something users receive changes, and only after the owner's explicit approval.

## Working rules
- Work in stages. Each stage starts with the intended changes and affected files, and ends with checks, a Japanese summary (changed files, decisions, commands and results, 要確認, next stage), and a commit proposal with the full message and file list written in the message itself. Commit only after the owner approves that specific commit.
- A performance change leaves every engine output identical: the engine snapshot, `test/node/solver-results.test.ts`, the scenario snapshot, and the determinism and locale invariance tests pass without updates, and a scratch comparison of many requests (as in Stage 6.2, with a check that it detects an injected change) is identical before and after. The domain stays pure, deterministic, and locale-free; any cache is explicit input or output, never hidden module state.
- Timing: browser timings vary with the machine and the day, so every comparison measures the baseline commit and the changed commit on the same machine in the same session, alone (no parallel builds or tests), and reports 1×, 4×, and 6× with median and p90.
- A dependency upgrade is its own commit (ADR-016); new tools and versions follow ADR-016 and ADR-018 and are recorded in `docs/working/DECISIONS.md` with sources and the date.
- `docs/en/` changes update the `docs/ja/` translation and its source line in the same commit; run the "Checks" of the shared rules' ADOPTING.md before proposing a commit.
- Verify UI changes in the browser preview (desktop width and 375 px, three locales) and report what was and was not checked.
- No deployment, account, token, or external service without the owner's explicit approval of that specific action.

## Stages

### 9.1 Dependency maintenance
1. After 2026-10-26 12:40 UTC, re-check ADR-016: if no release of `i18next` or `react-i18next` followed within 48 hours, move both to the latest versions together (peer ranges, install scripts, `npm audit`, `npm run check`, `npm run test:e2e`) as their own commit, and update ADR-016's exceptions and open question 16. Otherwise record the new date.
2. Report `npm outdated` for every other dependency with release dates; propose updates under ADR-016 (one commit per coherent group) and wait for approval.
3. Report the state of ADR-017 (TypeScript 7 support in a stable `typescript-eslint`).

### 9.2 Recommendation speed: plan and baseline
1. Profile a full recommendation in Node (`--cpu-prof`) and in the browser (`npm run test:e2e:timing`) on the 86 recipes and on a synthetic library of about 130 recipes built for the measurement only (not published content); report where the time goes (solver grid, engine calls, selection, UI rendering).
2. Propose options with their expected gain, risk, and how equality is proven, for example: O3 reusing engine probes across searches of one pool request (re-suggestion, relaxation) through an explicit cache; precomputing per-recipe data that does not depend on the request when the bundle loads; O4 pruning the grid with a proof that the optimum is unchanged; moving the search to a Web Worker (keeps the page responsive, does not shorten the computation; reconsider the Stage 5.4 decision); or coarser grids for the heaviest recipes (`beef_steak_potatoes` has about a quarter of the grid states; changes results, so it needs an ADR, snapshot diffs, and the owner's approval). Propose a target (for example a median and p90 at 4× on the current library, and an estimate for about 120 recipes) and wait for approval.

### 9.3 Recommendation speed: implementation
1. Commit any new equality test or snapshot before optimizing.
2. Implement the approved options; every test listed in the working rules passes unchanged; record the timings against the baseline measured in the same session.
3. If the owner agrees, update ADR-030 D10, `docs/en/ARCHITECTURE.md` §6, and `docs/en/UI_DESIGN.md` §4 (with their Japanese translations) with the new numbers, and the ADR-023 note on how many grid states new recipes may add.

### 9.4 Release 5 (only if needed)
1. If 9.1 or 9.3 changes what users receive: `docs/working/RELEASE_READINESS.md` for release 5, `npm ci`, `npm run check`, `npm run test:e2e`, `npm audit`, the phone-class timing (with release 4 measured alongside), and the history secret scan on the release commit.
2. A deployment proposal (commit, Wrangler version and its install scripts, rollback to release 4) for the owner's explicit approval; deploy and run the post-deployment checks of `docs/en/DEPLOYMENT.md` §3 only after that approval.

## Out of scope
- New recipes or foods (a later phase once the speed margin exists), new features, opt-in storage, meal planning, AI, accounts, server-side storage, analytics.
- Engine behavior changes (results, formulas, tolerances, bands, thresholds, rounding) without an ADR and the owner's approval.
- Any deployment, account, token, or external service without the owner's explicit approval.

## Acceptance
- ADR-016 is re-checked and the pins are updated or their next re-check is recorded; other dependencies are current or their exceptions are recorded; the ADR-017 state is recorded.
- The approved speed target is met on the current library, measured against a same-session baseline, with every snapshot, equality, determinism, and locale invariance test unchanged.
- The documents that state the timing and the threshold are updated as approved.
- `npm run check`, `npm run test:e2e`, and CI pass; release 5 is deployed only if needed and only after the owner's approval.
