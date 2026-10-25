[Docs index](../en/README.md)

# Release Readiness — Recipe Discovery

Status: **Release 5 deployed (2026-10-25)** at https://recipe-discovery.musica-sanare.workers.dev from commit `5709506` (Cloudflare Workers static assets, version `3f566ec5-7948-488c-b7ac-cace55a24d34`): the Phase 9 recommendation speed-up on top of release 4, content version `2026-10-25.2` (unchanged). The post-deployment checks passed ([DECISIONS.md](DECISIONS.md) "Fifth production deployment"). Release 4 (`2bcbb9b`, version `5a4ae857-f25e-4bdc-8db1-2246c280aeef`) is the rollback target. Update this document for every release; release 1 is recorded in [DECISIONS.md](DECISIONS.md) ("Stage 5.1 release plan" to "Manual checks"), release 2 in "Stage 6.6" and "Second production deployment", release 3 in "Stage 7.4" and "Third production deployment", release 4 in "Stage 8.4" and "Fourth production deployment", release 5 in "Stage 9.4".

Commit hashes in this document are those after the history rewrite of 2026-10-25; older records in [DECISIONS.md](DECISIONS.md) use the earlier hashes ("History rewrite (2026-10-25)").

| Release | Commit | Content version | Status |
|---|---|---|---|
| 1 (MVP) | `ed511a0` | `2026-10-24.3` | Deployed 2026-10-24 (version `0f4696e0…`); replaced by release 2 |
| 2 (Phase 6) | `7144d06` | `2026-10-24.8` | Deployed 2026-10-24 13:18 UTC (version `81bc7642…`); replaced by release 3 |
| 3 (Phase 7) | `7b66ca3` | `2026-10-25.2` | Deployed 2026-10-25 02:44 UTC (version `992ce5ff…`); replaced by release 4 |
| 4 (Phase 8) | `2bcbb9b` | `2026-10-25.2` | Deployed 2026-10-25 09:02 UTC (version `5a4ae857…`); replaced by release 5 |
| 5 (Phase 9) | `5709506` | `2026-10-25.2` | Deployed 2026-10-25 12:26 UTC (version `3f566ec5…`) |

## 0. What changes in release 5

| Stage | Change | Visible to users |
|---|---|---|
| 9.2 | Synthetic library and browser timing variant for measurements (`tools/`, `e2e/`) | — |
| 9.3 | Recommendation speed-up with every result unchanged: target-independent solver results precomputed after the first view, incremental grid prediction, pruning by the relative change, reused number formatters ([DECISIONS.md](DECISIONS.md) "Stage 9.3 P+O3" to "Stage 9.3 precomputation after the first view") | A search and a recalculation respond faster (§3); the same candidates, amounts, and values as release 4 |

Unchanged: every engine output (all snapshots, the recommendation digests, and a scratch comparison of 5,760 requests identical), the recipe content and its version, the UI texts and layout, the security headers (`platform/`), the dependencies and the lockfile (the `i18next` and `react-i18next` pins stay; §2).

## 1. Acceptance criteria ([SPEC.md](../en/SPEC.md) §15 and §18)

Checked on `73c3f18` (the Stage 9.4 changes are documentation only) on 2026-10-25: `npm ci`, `npm run check` (lint, type-check, license check, 54 test files with 689 tests, content validation, production build), `npm run test:e2e` (107 passed, 1 skipped by design), and `npm audit` (0 vulnerabilities, also with `--omit=dev`) pass.

| Criterion | Result | Evidence |
|---|---|---|
| The complete flow works on mobile and desktop without AI | Met | `e2e/flow.spec.ts` on `desktop-chromium`, `mobile-chromium`, and `mobile-webkit` in `ja`, `en`, `es`; no AI code or service exists (ADR-004) |
| The same input and data always produce the same candidates, order, and nutrition values | Met | `test/node/engine.test.ts` "determinism"; scenario snapshot, `test/node/solver-results.test.ts`, and `test/node/recommendation-digests.test.ts` unchanged by the Phase 9 optimizations; `test/node/solver-precomputed.test.ts` |
| Internal nutrition values are identical in `ja`, `en`, and `es` | Met | `test/node/engine.test.ts` and `test/node/recommendation-scenarios.test.ts` "locale invariance" (unchanged, including the type-level signature checks) |
| All UI strings and published content exist in the three locales | Met | Unchanged since release 4: catalog types, `src/i18n/messages.test.ts`, `src/i18n/engineCodes.test.ts`; content validation in `npm run build` |
| Every nutrition value is traceable; unmeasured values are never zero; approximations are shown | Met | Unchanged since release 4 (engine snapshot identical) |
| An active allergen filter excludes matching or unknown ingredients; the disclaimer is always visible | Met | `domain/recommendation/filters.test.ts`; unchanged filters |
| No content contains health or efficacy claims | Met | Content validation (`forbidden-expression`), `src/i18n/policy.test.ts` |
| Attribution to the source tables is shown | Met | Footer, detail view, and about page (`test/ui/about.test.tsx`, `e2e/flow.spec.ts`) |
| Shopping list (§18) | Met | Unchanged since release 4 (`domain/shopping/list.test.ts`, `test/ui/shopping.test.tsx`, `e2e/shopping.spec.ts`) |
| A full recommendation within about 100 ms at 4× (ADR-030 D10) | Met | About 52–54 ms median at 4× (§3) |
| Lint, type-check, unit tests, content validation, E2E, accessibility in three locales, and the production build pass | Met locally | Commands above. CI: §2 |

## 2. Release blockers

| Item | Status | What is needed |
|---|---|---|
| CI on the release commit | **Passed** | Both jobs (`check`, `e2e`) passed on `5709506` after Claude pushed `dev` at the owner's request (owner's report, 2026-10-25) |
| Secret scan of the release history | **Passed** on `73c3f18` | gitleaks 8.30.1 (Homebrew, still the latest): `gitleaks git --log-opts=--all --redact` (118 commits, 2.99 MB), `gitleaks dir` on the tracked files (`git archive HEAD`, 3.1 MB) and on `dist/` (1.0 MB): no leaks (2026-10-25 11:53 UTC). No commit touches `data/raw`, `*.xlsx`, `*.pdf`, or `.env*`. Repeat if commits other than documentation follow |
| `i18next` / `react-i18next` pins (open question 16) | **Deferred** (owner decision for releases 1 to 5) | Not a release condition (ADR-016 release-burst exception). The earliest re-check is 2026-10-26 12:40 UTC; the owner chose to prepare release 5 without waiting for it (2026-10-25). An update is its own commit and redeployment |

## 3. Known limitations (released as documented)

| Item | Reference | Mitigation in the app |
|---|---|---|
| Error bands for fried, slow-frying, and parts removed after cooking are assumptions; the bands of raw and related cooked values are set per nutrient from the evidence (Stage 6.5) | Open question 3, [NUTRITION_CALCULATION.md](../en/NUTRITION_CALCULATION.md) §7, ADR-028 (revised) | Values are labelled estimates; ranges and reasons are shown |
| Cooking tables were transcribed by hand from the PDF; group-level rates are not used | Open question 2, [DATA_SOURCES.md](../en/DATA_SOURCES.md) | Automated cross-checks (`npm run data:verify-cooking`, 88 entries; `test/node/cooking-data.test.ts`) |
| English food names have no official reference (2015 English edition not checked) | Open question 6 | Names are the app's own translations |
| Applicability of the Health Promotion Act, the Pharmaceutical and Medical Device Act, and allergen labelling rules; copyright of recipes | Open questions 7, 8 | The stricter policy is applied ([CONTENT_POLICY.md](../en/CONTENT_POLICY.md)); recipes are original |
| No native Spanish reviewer | Open question 9 | The owner reviews with Claude's findings and back-translations (all texts reviewed, including the shopping list); regional vocabulary rules of [CONTENT_POLICY.md](../en/CONTENT_POLICY.md) §6 |
| Allergens of processed seasonings follow typical ingredients, not product labels | Open question 12 | Unknown or varying items are treated as "may contain"; the disclaimer asks users to check labels |
| Two recipes meet no preset (`tortilla_espanola`, `mackerel_salt_grill_daikon`); several cooked foods use raw values as approximations | [DECISIONS.md](DECISIONS.md) "Stage 6.4", "Stage 7.3" | Goal labels follow the best-fitting preset; the approximation and its band are shown |
| Egg- and soy-based dishes rarely meet the preset fat limits | [DECISIONS.md](DECISIONS.md) "Stage 5.2 batch 1" | Goal labels follow the best-fitting preset; fit status and reasons are shown |
| A full recommendation takes about 52–54 ms at a 4× CPU slowdown (p90 about 56–62 ms) and about 78–83 ms at 6× on the measuring machine on 2026-10-25; no real phone measured | ADR-030 D10 (revised, updated in Stage 9.3), below | Release 4's code measured alternately on the same machine takes 79–86 ms at 4×; a synthetic library of 130 recipes stays at about 62–70 ms ([DECISIONS.md](DECISIONS.md) "Stage 9.3 browser timing") |
| After the first view, the precomputation of the solver results occupies the main thread once (about 40–70 ms at 4×); an input in that time waits for it | [DECISIONS.md](DECISIONS.md) "Stage 9.3 precomputation after the first view" | The form appears as fast as in release 4; a search before the precomputation ends gives the same result without the speed-up |
| Shopping list: memory only, lost on reload; amounts are edible portions or weights as sold, not purchase amounts; frying oil follows the recipe amount and depends on the pan; household measure totals only for one unit; copying falls back to a text area where the Clipboard API is missing or refused | [SPEC.md](../en/SPEC.md) §18, ADR-032 | Notes in the list (basis, frying oil) and the reload notice; no data leaves the browser |
| Not checked by hand: a real print dialog and paper output, the Clipboard API on real phones | [DECISIONS.md](DECISIONS.md) "Stage 8.3" | Print styles checked with print media emulation in E2E; the copy fallback tested in jsdom and E2E stubs |
| WebKit reports a `style-src-attr` CSP violation for every `<select>` | "Stage 5.4" | Browser behavior on a page without inline styles; the CSP is unchanged |
| Not checked by hand: Android with Chrome, screen readers (VoiceOver, NVDA, Narrator), and Windows forced colors (§4) | [DECISIONS.md](DECISIONS.md) "Manual checks" | Automated: `mobile-chromium` E2E, axe-core in jsdom and in real browsers in three locales, status markers with distinct shapes and texts (ADR-030 D3) |
| License | [ADR-031](DECISIONS.md), [LICENSE](../../LICENSE) | MIT for the repository; `data/composition/` is used and shared under the MEXT terms ([DATA_SOURCES.md](../en/DATA_SOURCES.md) "License of the extracted data") |

Phone-class timing of release 5 (`npm run test:e2e:timing` on `73c3f18`, alternating with release 4's code `2bcbb9b` extracted with `git archive` and run with the same `node_modules` (the lockfile is unchanged), 2026-10-25 11:51–11:53 UTC, Chromium 156, 15 runs; median / p90, ms; rounds 2 and 3, a first round under a load average of 30–63 was discarded): search cut 13.3 / 15.7 and 13.1 / 15.8 (1×), 53.5 / 61.3 and 54.2 / 62.3 (4×), 83.2 / 97.9 and 80.3 / 95.6 (6×); search bulk 12.5 / 14.3 and 12.3 / 15.1, 52.6 / 56.2 and 51.6 / 56.6, 80.0 / 86.8 and 77.9 / 86.2; maintain with tofu required 7.3 / 7.7 and 7.2 / 7.5, 29.3 / 31.2 and 29.6 / 31.8, 44.0 / 51.0 and 44.5 / 49.2; bulk at ≤ 15 min 8.7 / 9.6 and 8.9 / 10.6, 36.2 / 38.4 and 36.5 / 42.7, 65.1 / 69.1 and 55.0 / 64.8; re-suggestion 5.0 / 5.3 and 5.1 / 5.5, 21.0 / 23.8 and 20.9 / 22.3, 39.2 / 42.3 and 31.2 / 35.5; recalculation 2.2 / 2.4 and 2.4 / 2.7, 9.6 / 10.6 and 9.6 / 10.2, 18.6 / 21.3 and 14.9 / 15.3. Release 4 in the same rounds: search cut 86.4 / 98.8 and 81.6 / 92.7, bulk 78.9 / 88.6 and 80.5 / 91.6 at 4×. `npm run bench:recommendation` (Node, median): cut 8.2 ms and bulk 7.9 ms on the 86 recipes, 11.1 and 11.5 ms on the synthetic 130 (release 4: about 15 ms on the 86 recipes).

## 4. Manual checks

Release 1 (owner, 2026-10-24, [DECISIONS.md](DECISIONS.md) "Manual checks"): iPhone with Safari and the about page and disclaimers in three languages without findings; Android, screen readers, and forced colors not checked (§3).

Releases 2 to 5 (optional, after deployment): on an iPhone, the cuisine choices on the targets view in Spanish (nine values), a search with the Southeast Asian cuisine preferred, the detail pages of a new recipe in each language (for example `beef_pho_rice_noodles`, `tofu_sasami_steamed`), for release 4 adding two recipes to the shopping list, checking items off, "Copy as text" (pasting into a notes app), and the print preview, and for release 5 the time from tapping "Find recipes" to the candidates with the default targets.

## 5. Deployment proposal (approved and deployed on 2026-10-25)

| Item | Proposal |
|---|---|
| What | The Stage 9.4 release commit `5709506` (documentation after `73c3f18`), built with `npm ci && npm run build`; `compatibility_date` was already the deployment date (2026-10-25), so no further commit was needed; content version `2026-10-25.2`; `dist/` has 9 files and about 1.0 MB |
| Where | The existing Cloudflare Workers project `recipe-discovery` on the owner's account (https://recipe-discovery.musica-sanare.workers.dev); nothing new is created |
| How | [DEPLOYMENT.md](../en/DEPLOYMENT.md) §3: Wrangler 4.152.0 (still the latest on 2026-10-25 11:54 UTC; dependencies `esbuild` 0.28.2, `workerd` 1.20261019.1, `miniflare` 5.20261019.2-beta, unchanged since release 4) installed after the owner approves the download into a new folder of the session scratch directory with `npm install --ignore-scripts --save-exact`, its integrity checked against the registry; `npm audit` there, with the `undici` override if still needed (release 4: 7.30.1); global npm state compared before and after; `wrangler whoami` confirmed by the owner; dry run, then deploy with `WRANGLER_SEND_METRICS=false`; post-deployment checks of [DEPLOYMENT.md](../en/DEPLOYMENT.md) §3 plus a default search at 375 px in three locales |
| Rollback | Redeploy release 4 (`2bcbb9b`) with the same steps; whether `wrangler rollback` applies to an assets-only Worker remains 要確認 |
| Cost | Static assets are free and unlimited (*Verified* 2026-10-25, [DECISIONS.md](DECISIONS.md) "Third production deployment"); re-checked on the deployment day |
| Data and privacy | Unchanged: no user data leaves the browser; no analytics; only the locale preference is stored; the shopping list stays in memory (ADR-015, ADR-030 D9, ADR-032 D5) |
| Owner actions | Push and report CI; approve the Wrangler download; approve this proposal; confirm the account shown by `wrangler whoami`; approve the deployment |
| Claude actions after approval | Install Wrangler, run the dry run and the deployment only as approved, then the post-deployment checks, and record the results here and in [DECISIONS.md](DECISIONS.md) |

## 6. Sign-off

| Step | Release | Date | By |
|---|---|---|---|
| Acceptance criteria checked | 1 | 2026-10-24 | Claude |
| Release blockers resolved | 1 | 2026-10-24 | Owner (open questions 13 and 16 by decision; CI passed) and Claude (open question 11, secret scan) |
| Deployment proposal approved (up to the dry run) | 1 | 2026-10-24 | Owner; dry run passed |
| Production deployment approved | 1 | 2026-10-24 | Owner (account [account name] confirmed with `wrangler whoami`) |
| Deployed and checked | 1 | 2026-10-24 | Claude: `ed511a0`, version `0f4696e0…` ([DECISIONS.md](DECISIONS.md) "Production deployment") |
| Manual checks (§4) | 1 | 2026-10-24 | Owner: iPhone and the about page without findings; Android, screen readers, and forced colors accepted as not checked |
| Acceptance criteria checked | 2 | 2026-10-24 | Claude |
| Release blockers resolved | 2 | 2026-10-24 | Owner (CI passed; open question 16 deferred) and Claude (secret scan) |
| Deployment proposal approved (up to the dry run) | 2 | 2026-10-24 | Owner; dry run passed |
| Production deployment approved | 2 | 2026-10-24 | Owner (account [account name] confirmed with `wrangler whoami`) |
| Deployed and checked | 2 | 2026-10-24 | Claude: `7144d06`, version `81bc7642…` ([DECISIONS.md](DECISIONS.md) "Second production deployment") |
| Acceptance criteria checked | 3 | 2026-10-25 | Claude |
| Release blockers resolved | 3 | 2026-10-25 | Owner (CI passed; open question 16 deferred) and Claude (secret scan) |
| Deployment proposal approved | 3 | 2026-10-25 | Owner; dry run passed |
| Production deployment approved | 3 | 2026-10-25 | Owner (account [account name] confirmed with `wrangler whoami`) |
| Deployed and checked | 3 | 2026-10-25 | Claude: `7b66ca3`, version `992ce5ff…` ([DECISIONS.md](DECISIONS.md) "Third production deployment") |
| Acceptance criteria checked | 4 | 2026-10-25 | Claude (§1) |
| Release blockers resolved | 4 | 2026-10-25 | Owner (CI passed; open question 16 deferred) and Claude (secret scan) |
| Deployment proposal approved | 4 | 2026-10-25 | Owner (Wrangler download approved; dry run passed) |
| Production deployment approved | 4 | 2026-10-25 | Owner (account [account name] confirmed with `wrangler whoami`) |
| Deployed and checked | 4 | 2026-10-25 | Claude: `2bcbb9b`, version `5a4ae857…` ([DECISIONS.md](DECISIONS.md) "Fourth production deployment") |
| Acceptance criteria checked | 5 | 2026-10-25 | Claude (§1) |
| Release blockers resolved | 5 | 2026-10-25 | Owner (CI passed; open question 16 deferred) and Claude (secret scan) |
| Deployment proposal approved | 5 | 2026-10-25 | Owner (Wrangler download approved; dry run passed) |
| Production deployment approved | 5 | 2026-10-25 | Owner (account [account name] confirmed with `wrangler whoami`) |
| Deployed and checked | 5 | 2026-10-25 | Claude: `5709506`, version `3f566ec5…` ([DECISIONS.md](DECISIONS.md) "Fifth production deployment") |
