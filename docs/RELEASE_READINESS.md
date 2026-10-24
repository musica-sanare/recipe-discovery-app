# Release Readiness — Recipe Discovery

Status: **Release 2 prepared (Phase 6), not deployed.** The deployed version is release 1: commit `66473f7` at https://recipe-discovery.musica-sanare.workers.dev (Cloudflare Workers static assets, version `0f4696e0-d896-4626-b486-03c53d2cac1b`, deployed 2026-10-24). Release 2 is the release commit of Stage 6.6 with content version `2026-10-24.8`. Update this document for every release; release 1 is recorded in `docs/DECISIONS.md` ("Stage 5.1 release plan" to "Manual checks"), release 2 in "Stage 6.6".

| Release | Commit | Content version | Status |
|---|---|---|---|
| 1 (MVP) | `66473f7` | `2026-10-24.3` | Deployed 2026-10-24 |
| 2 (Phase 6) | Stage 6.6 release commit | `2026-10-24.8` | Prepared; waits for CI and the owner's approval (§2, §5) |

## 0. What changes in release 2

| Stage | Change | Visible to users |
|---|---|---|
| 6.2 | Faster solver with identical results (`docs/DECISIONS.md` "Stage 6.2") | Searches about 20 % faster |
| 6.3 | English and Spanish review of every text released without review (R1–R6) | Fire risk in two frying notes (also Japanese), allergen names with both regional Spanish names, translation fixes |
| 6.4 | Egg whites in five egg- and soy-based recipes | Those recipes meet the maintain preset |
| 6.5 | Error bands of raw and related cooked values per nutrient (ADR-028 revised) | Wider estimate ranges, mostly for fat; some statuses move to "near" |

Unchanged: the security headers (`platform/`), the dependencies and the lockfile, and the structure of the app.

## 1. Acceptance criteria (`docs/SPEC.md` §15)

Checked on commit `2b74b07` with the Stage 6.6 changes (content version `2026-10-24.8`, 60 recipes, 78 foods) on 2026-10-24: `npm ci`, `npm run check` (lint, type-check, license check, 47 test files with 633 tests, content validation, production build), `npm run test:e2e` (98 passed, 1 skipped by design), and `npm audit` (0 vulnerabilities, also with `--omit=dev`) pass.

| Criterion | Result | Evidence |
|---|---|---|
| The complete flow (targets → conditions → candidates → comparison → detail → adjustment → re-suggestion) works on mobile and desktop without AI | Met | `e2e/flow.spec.ts` on `desktop-chromium`, `mobile-chromium`, and `mobile-webkit` in `ja`, `en`, `es`; no AI code or service exists (ADR-004) |
| The same input and data always produce the same candidates, order, and nutrition values | Met | `test/node/engine.test.ts` "determinism"; scenario snapshot `test/node/recommendation-scenarios.test.ts`; solver results at full precision `test/node/solver-results.test.ts`; `domain/recommendation/*.test.ts` |
| Internal nutrition values are identical in `ja`, `en`, and `es` | Met | `test/node/engine.test.ts` "locale invariance"; `test/node/recommendation-scenarios.test.ts` "locale invariance"; `test/ui/candidates.test.tsx` and `e2e/flow.spec.ts` "locale switching" |
| All UI strings and published content exist in the three locales (build time) | Met | Type check of the catalogs, `src/i18n/messages.test.ts`, `src/i18n/engineCodes.test.ts`; content validation (locale completeness) in `npm run build` |
| Every nutrition value is traceable to food codes, data version, cooking state, and assumptions | Met | Basis in the detail view (`test/ui/detail.test.tsx`), `test/node/engine.test.ts` "states the assumptions of every recipe in the basis"; engine snapshot |
| Unmeasured values are never zero; approximations and hard-to-estimate items are always shown | Met | `domain/nutrition/engine.test.ts` ("make the nutrient unknown, never zero", the pinned band table); approximation reasons in the detail view and the composition report |
| An active allergen filter excludes recipes with matching or unknown ingredients; the disclaimer is always visible | Met | `domain/recommendation/filters.test.ts` "allergens (best effort, never rescued)"; disclaimer on the targets, candidates, comparison, detail, and about views; allergen lists match the CAA lists of April 2026 (release 1, open question 11) |
| No content contains health or efficacy claims | Met | Content validation (`forbidden-expression`), `src/i18n/policy.test.ts`; Stage 6.3 review |
| Attribution to the source tables is shown | Met | Footer, detail view, and about page (`test/ui/about.test.tsx`, `e2e/flow.spec.ts`) |
| Lint, type-check, unit tests, content validation, E2E, accessibility in three locales, and the production build pass | Met locally | Commands above; axe-core in jsdom and in real browsers with color contrast in light and dark. CI: §2 |

## 2. Release blockers

| Item | Status | What is needed |
|---|---|---|
| CI on the release commit | **Open** | The owner pushes `dev` and reports both jobs (`check`, `e2e`) |
| Secret scan of the release history | **Passed** on `2b74b07` | gitleaks 8.30.1 (archive SHA-256 `b40ab0ae…`, matching the release checksum file and Stage 5.5): `gitleaks git --log-opts=--all --redact` (79 commits, 2.20 MB), `gitleaks dir` on the tracked files (1.77 MB), on `dist/` (0.87 MB), and on the uncommitted Stage 6.6 changes: no leaks (2026-10-24 12:38 UTC). No commit touches `data/raw`, `*.xlsx`, `*.pdf`, or `.env*`. Repeat if commits other than documentation follow |
| `i18next` / `react-i18next` pins (open question 16) | **Deferred** (owner decision, again for release 2) | Not a release condition (ADR-016 release-burst exception). Re-check not before 2026-10-26 05:53 UTC; an update is its own commit and redeployment |
| Unit test timeout under load | **Fixed** | The locale invariance test of `test/node/recommendation-scenarios.test.ts` (four full runs of every scenario, about 1 s alone) exceeded the 5 s default once in three full runs after `npm ci`; it now has a 20 s timeout. Three further full runs passed |

## 3. Known limitations (released as documented)

| Item | Reference | Mitigation in the app |
|---|---|---|
| Error bands for fried, slow-frying, and parts removed after cooking are assumptions; the bands of raw and related cooked values are set per nutrient from the evidence (Stage 6.5) | Open question 3, `docs/NUTRITION_CALCULATION.md` §7, ADR-028 (revised) | Values are labelled estimates; ranges and reasons are shown |
| Cooking tables were transcribed by hand from the PDF; group-level rates are not used | Open question 2, `docs/DATA_SOURCES.md` | Automated cross-checks (`npm run data:verify-cooking`, `test/node/cooking-data.test.ts`) |
| English food names have no official reference (2015 English edition not checked) | Open question 6 | Names are the app's own translations |
| Applicability of the Health Promotion Act, the Pharmaceutical and Medical Device Act, and allergen labelling rules; copyright of recipes | Open questions 7, 8 | The stricter policy is applied (`docs/CONTENT_POLICY.md`); recipes are original |
| No native Spanish reviewer | Open question 9 | The owner reviews with Claude's findings and back-translations (all texts reviewed in Stage 6.3); peninsular food vocabulary with Latin American aliases, words with a different Latin American meaning avoided, allergen names with both regional names (`docs/CONTENT_POLICY.md` §6) |
| Allergens of processed seasonings (cooking sake, wholegrain mustard, stock granules, karaage mix, curry powder, miso) follow typical ingredients, not product labels | Open question 12 | Unknown or varying items are treated as "may contain"; the disclaimer asks users to check labels |
| `tortilla_espanola` meets no preset (slow-fried in olive oil); cooked egg white has no table value, so five recipes use its raw value as an approximation | `docs/DECISIONS.md` "Stage 6.4" | Goal labels follow the best-fitting preset; the approximation and its band are shown |
| A full recommendation takes about 73 ms at a 4× CPU slowdown and about 112–123 ms at 6× (release 2; release 1: about 80 and 120 ms); no real phone measured | ADR-030 D10 (revised), §1 | Main thread within the 100 ms threshold at 4×; measure again when the library grows |
| WebKit reports a `style-src-attr` CSP violation for every `<select>` | "Stage 5.4" | Browser behavior on a page without inline styles; the CSP is unchanged |
| Not checked by hand: Android with Chrome, screen readers (VoiceOver, NVDA, Narrator), and Windows forced colors (§4) | `docs/DECISIONS.md` "Manual checks" | Automated: `mobile-chromium` E2E, axe-core in jsdom and in real browsers in three locales, status markers with distinct shapes and texts (ADR-030 D3) |
| License of the repository not chosen | README | Repository stays private |

Phone-class timing of release 2 (`npm run test:e2e:timing`, Chrome Headless Shell 156.0.8078.4, 2026-10-24 12:37 UTC; median / p90, ms): search cut 19.2 / 20.6 (1×), 72.8 / 85.0 (4×), 123.3 / 147.6 (6×); search bulk 18.0 / 22.6, 73.6 / 80.3, 112.5 / 122.8; maintain with tofu required 9.1 / 10.6, 38.0 / 44.2, 55.4 / 60.0; bulk at ≤ 15 min 10.5 / 11.3, 45.0 / 50.0, 67.0 / 77.6; re-suggestion 5.1 / 6.1, 20.3 / 23.2, 37.9 / 45.9; recalculation 3.0 / 3.2, 11.9 / 15.4, 24.1 / 29.1. Searches are slower than right after Stage 6.2 (66 ms at 4×) because Stage 6.4 added solver states (19,338 → 20,921).

## 4. Manual checks

Release 1 (owner, 2026-10-24, `docs/DECISIONS.md` "Manual checks"): iPhone with Safari and the about page and disclaimers in three languages without findings; Android, screen readers, and forced colors not checked (§3).

Release 2 (optional, after deployment): on an iPhone, the reworked egg recipes (for example `egg_tomato_stir_fry`), a detail page with a wider fat range (for example `swordfish_lemon_herb`), and the Spanish allergen names on the targets view.

## 5. Deployment proposal (for the owner's approval; not deployed)

| Item | Proposal |
|---|---|
| What | The Stage 6.6 release commit (documentation, one test timeout, and a configuration comment after `2b74b07`), built with `npm ci && npm run build`; content version `2026-10-24.8` |
| Where | The existing Cloudflare Workers project `recipe-discovery` on the owner's account (https://recipe-discovery.musica-sanare.workers.dev); nothing new is created |
| How | `docs/DEPLOYMENT.md` §3: Wrangler 4.152.0 (still the latest on 2026-10-24 12:20 UTC) installed with `--ignore-scripts` in a scratch directory outside the repository; `npm audit` there with an `undici` override if still needed (release 1); `wrangler whoami` confirmed by the owner; `compatibility_date` set to the deployment date; dry run, then deploy with `WRANGLER_SEND_METRICS=false`; post-deployment checks, including the release 2 changes (§0) |
| Rollback | Redeploy release 1 (`66473f7`) with the same steps; whether `wrangler rollback` applies to an assets-only Worker is checked in the current documentation on the deployment day (要確認 since release 1) |
| Cost | Static assets are free and unlimited (*Verified* 2026-10-24 for release 1; re-checked on the deployment day); `dist/` has 9 files and 876 KB |
| Data and privacy | Unchanged: no user data leaves the browser; no analytics; only the locale preference is stored (ADR-015, ADR-030 D9) |
| Owner actions | Report CI; approve this proposal and the Wrangler download; confirm the account shown by `wrangler whoami`; approve the deployment |
| Claude actions after approval | Run the dry run and the deployment only as approved, then the post-deployment checks, and record the results here and in `docs/DECISIONS.md` |

## 6. Sign-off

| Step | Release | Date | By |
|---|---|---|---|
| Acceptance criteria checked | 1 | 2026-10-24 | Claude |
| Release blockers resolved | 1 | 2026-10-24 | Owner (open questions 13 and 16 by decision; CI passed) and Claude (open question 11, secret scan) |
| Deployment proposal approved (up to the dry run) | 1 | 2026-10-24 | Owner; dry run passed |
| Production deployment approved | 1 | 2026-10-24 | Owner (account [account name] confirmed with `wrangler whoami`) |
| Deployed and checked | 1 | 2026-10-24 | Claude: `66473f7`, version `0f4696e0…` (`docs/DECISIONS.md` "Production deployment") |
| Manual checks (§4) | 1 | 2026-10-24 | Owner: iPhone and the about page without findings; Android, screen readers, and forced colors accepted as not checked |
| Acceptance criteria checked | 2 | 2026-10-24 | Claude (§1) |
| Release blockers resolved | 2 | — | CI pending; secret scan passed; open question 16 deferred by the owner |
| Deployment proposal approved | 2 | — | — |
| Deployed and checked | 2 | — | — |
