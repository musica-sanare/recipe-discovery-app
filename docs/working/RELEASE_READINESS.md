# Release Readiness — Recipe Discovery

Status: **Release 3 deployed (2026-10-25)** at https://recipe-discovery.musica-sanare.workers.dev from commit `c3b4911` (Cloudflare Workers static assets, version `992ce5ff-56e4-4cf3-85d8-7b8ff6f37ab5`), content version `2026-10-25.2`. The post-deployment checks passed (`docs/DECISIONS.md` "Third production deployment"). Release 2 (`edd7afe`, version `81bc7642-f8fb-4290-a1ed-5f096a363074`) is the rollback target. Update this document for every release; release 1 is recorded in `docs/DECISIONS.md` ("Stage 5.1 release plan" to "Manual checks"), release 2 in "Stage 6.6" and "Second production deployment", release 3 in "Stage 7.4".

| Release | Commit | Content version | Status |
|---|---|---|---|
| 1 (MVP) | `66473f7` | `2026-10-24.3` | Deployed 2026-10-24 (version `0f4696e0…`); replaced by release 2 |
| 2 (Phase 6) | `edd7afe` | `2026-10-24.8` | Deployed 2026-10-24 13:18 UTC (version `81bc7642…`); replaced by release 3 |
| 3 (Phase 7) | `c3b4911` | `2026-10-25.2` | Deployed 2026-10-25 02:44 UTC (version `992ce5ff…`) |

## 0. What changes in release 3

| Stage | Change | Visible to users |
|---|---|---|
| 7.1–7.2 | Cuisine values Latin American, Mediterranean, and Southeast Asian (ADR-026 revised); 12 foods; 13 recipes (`docs/DECISIONS.md` "Stage 7.2") | Three more cuisine choices; Latin American, Mediterranean, and Southeast Asian dishes; checkboxes no longer shrink next to long labels |
| 7.3 | 4 foods; 13 recipes, mostly Japanese, Chinese, and Korean (`docs/DECISIONS.md` "Stage 7.3") | More quick, batch-cooking, breakfast, steamed, and microwave-only dishes |
| All | 86 recipes and 94 foods (release 2: 60 and 78); new safety note for raw vegetables and herbs; content policy for raw dishes and Spanish dish names (`docs/CONTENT_POLICY.md` §3, §6) | More candidates for every preset (met: cut 23 → 35, maintain 41 → 65, bulk 30 → 41) |

Unchanged: the engines (no formula, band, tolerance, or rounding change), the security headers (`platform/`), the dependencies and the lockfile. The UI changes only by the three cuisine choices and the checkbox layout fix.

## 1. Acceptance criteria (`docs/SPEC.md` §15)

Checked on commit `09449fd` with the Stage 7.4 changes (content version `2026-10-25.2`, 86 recipes, 94 foods) on 2026-10-25: `npm ci`, `npm run check` (lint, type-check, license check, 47 test files with 643 tests, content validation, production build; three full runs), `npm run test:e2e` (98 passed, 1 skipped by design), and `npm audit` (0 vulnerabilities, also with `--omit=dev`) pass.

| Criterion | Result | Evidence |
|---|---|---|
| The complete flow (targets → conditions → candidates → comparison → detail → adjustment → re-suggestion) works on mobile and desktop without AI | Met | `e2e/flow.spec.ts` on `desktop-chromium`, `mobile-chromium`, and `mobile-webkit` in `ja`, `en`, `es`; no AI code or service exists (ADR-004) |
| The same input and data always produce the same candidates, order, and nutrition values | Met | `test/node/engine.test.ts` "determinism"; scenario snapshot `test/node/recommendation-scenarios.test.ts`; solver results at full precision `test/node/solver-results.test.ts`; `domain/recommendation/*.test.ts` |
| Internal nutrition values are identical in `ja`, `en`, and `es` | Met | `test/node/engine.test.ts` "locale invariance"; `test/node/recommendation-scenarios.test.ts` "locale invariance"; `test/ui/candidates.test.tsx` and `e2e/flow.spec.ts` "locale switching" |
| All UI strings and published content exist in the three locales (build time) | Met | Type check of the catalogs, `src/i18n/messages.test.ts`, `src/i18n/engineCodes.test.ts` (including the new cuisine values); content validation (locale completeness) in `npm run build` |
| Every nutrition value is traceable to food codes, data version, cooking state, and assumptions | Met | Basis in the detail view (`test/ui/detail.test.tsx`), `test/node/engine.test.ts` "states the assumptions of every recipe in the basis"; engine snapshot with the 26 new recipes |
| Unmeasured values are never zero; approximations and hard-to-estimate items are always shown | Met | `domain/nutrition/engine.test.ts`; approximation reasons in the detail view and the composition report (86 recipes: exact 600, approximation 116, hard to estimate 2, not counted 31, fried 5) |
| An active allergen filter excludes recipes with matching or unknown ingredients; the disclaimer is always visible | Met | `domain/recommendation/filters.test.ts` "allergens (best effort, never rescued)"; disclaimer on the targets, candidates, comparison, detail, and about views; fish sauce links shrimp as "may contain" |
| No content contains health or efficacy claims | Met | Content validation (`forbidden-expression`), `src/i18n/policy.test.ts`; owner review of the new texts (Stages 7.2 and 7.3) |
| Attribution to the source tables is shown | Met | Footer, detail view, and about page (`test/ui/about.test.tsx`, `e2e/flow.spec.ts`) |
| Lint, type-check, unit tests, content validation, E2E, accessibility in three locales, and the production build pass | Met locally | Commands above; axe-core in jsdom and in real browsers with color contrast in light and dark. CI: §2 |

## 2. Release blockers

| Item | Status | What is needed |
|---|---|---|
| CI on the release commit | **Passed** | Both jobs (`check`, `e2e`) passed on `c3b4911` (owner's report, 2026-10-25) |
| Secret scan of the release history | **Passed** on `09449fd` | gitleaks 8.30.1 (the Stage 6.6 binary, identical to the archive with SHA-256 `b40ab0ae…`; still the latest release on 2026-10-25): `gitleaks git --log-opts=--all --redact` (87 commits, 2.49 MB), `gitleaks dir` on the tracked files (2.04 MB) and on `dist/` (1.03 MB): no leaks (2026-10-25 02:19 UTC). No commit touches `data/raw`, `*.xlsx`, `*.pdf`, or `.env*`. Repeat if commits other than documentation follow |
| `i18next` / `react-i18next` pins (open question 16) | **Deferred** (owner decision for releases 1 and 2) | Not a release condition (ADR-016 release-burst exception). The burst continued (`i18next` 26.5.10 at 2026-10-24 10:15 UTC, `react-i18next` 17.1.8 at 12:39 UTC), so the re-check is not before 2026-10-26 12:40 UTC; an update is its own commit and redeployment |

## 3. Known limitations (released as documented)

| Item | Reference | Mitigation in the app |
|---|---|---|
| Error bands for fried, slow-frying, and parts removed after cooking are assumptions; the bands of raw and related cooked values are set per nutrient from the evidence (Stage 6.5) | Open question 3, `docs/NUTRITION_CALCULATION.md` §7, ADR-028 (revised) | Values are labelled estimates; ranges and reasons are shown |
| Cooking tables were transcribed by hand from the PDF; group-level rates are not used | Open question 2, `docs/DATA_SOURCES.md` | Automated cross-checks (`npm run data:verify-cooking`, 88 entries; `test/node/cooking-data.test.ts`) |
| English food names have no official reference (2015 English edition not checked) | Open question 6 | Names are the app's own translations |
| Applicability of the Health Promotion Act, the Pharmaceutical and Medical Device Act, and allergen labelling rules; copyright of recipes | Open questions 7, 8 | The stricter policy is applied (`docs/CONTENT_POLICY.md`); recipes are original |
| No native Spanish reviewer | Open question 9 | The owner reviews with Claude's findings and back-translations (all texts reviewed); peninsular food vocabulary with Latin American aliases, words with a different Latin American meaning avoided, allergen names with both regional names, dish names by region (`docs/CONTENT_POLICY.md` §6) |
| Allergens of processed seasonings (cooking sake, wholegrain mustard, stock granules, karaage mix, curry powder, miso, chili powder, fish sauce) follow typical ingredients, not product labels | Open question 12 | Unknown or varying items are treated as "may contain"; the disclaimer asks users to check labels |
| Two recipes meet no preset: `tortilla_espanola` (slow-fried in olive oil) and `mackerel_salt_grill_daikon` (oily fish); cooked egg white, many cooked meats, and boiled rice noodles have no table value, so raw values are used as approximations | `docs/DECISIONS.md` "Stage 6.4", "Stage 7.3" | Goal labels follow the best-fitting preset; the approximation and its band are shown |
| A full recommendation takes about 82 ms at a 4× CPU slowdown (p90 about 93 ms) and about 123 ms at 6× (release 2: about 73 and 112–123 ms); little margin is left under the 100 ms threshold; no real phone measured | ADR-030 D10 (revised), §1 | Main thread within the threshold at 4×; a speed-up (for example Stage 6.2 option O3) is needed before the library grows further |
| WebKit reports a `style-src-attr` CSP violation for every `<select>` | "Stage 5.4" | Browser behavior on a page without inline styles; the CSP is unchanged |
| Not checked by hand: Android with Chrome, screen readers (VoiceOver, NVDA, Narrator), and Windows forced colors (§4) | `docs/DECISIONS.md` "Manual checks" | Automated: `mobile-chromium` E2E, axe-core in jsdom and in real browsers in three locales, status markers with distinct shapes and texts (ADR-030 D3) |
| License of the repository not chosen | README | Repository stays private |

Phone-class timing of release 3 (`npm run test:e2e:timing`, 2026-10-25 02:1x UTC; median / p90, ms): search cut 20.1 / 23.9 (1×), 82.2 / 92.8 (4×), 123.4 / 142.0 (6×); search bulk 19.1 / 23.3, 78.5 / 92.0, 117.0 / 133.4; maintain with tofu required 9.5 / 12.8, 38.7 / 44.6, 60.2 / 64.9; bulk at ≤ 15 min 12.0 / 14.7, 47.5 / 56.9, 89.4 / 111.2; re-suggestion 5.0 / 5.6, 20.5 / 21.9, 34.5 / 53.9; recalculation 2.6 / 2.8, 11.3 / 12.0, 19.3 / 21.7. The 86 recipes have 23,041 solver states (release 2: 20,921).

## 4. Manual checks

Release 1 (owner, 2026-10-24, `docs/DECISIONS.md` "Manual checks"): iPhone with Safari and the about page and disclaimers in three languages without findings; Android, screen readers, and forced colors not checked (§3).

Release 2 and release 3 (optional, after deployment): on an iPhone, the cuisine choices on the targets view in Spanish (nine values), a search with the Southeast Asian cuisine preferred, and the detail pages of a new recipe in each language (for example `beef_pho_rice_noodles`, `tofu_sasami_steamed`).

## 5. Deployment proposal (approved and deployed on 2026-10-25)

| Item | Proposal |
|---|---|
| What | The Stage 7.4 release commit (documentation after `09449fd`), built with `npm ci && npm run build`; content version `2026-10-25.2`; `dist/` has 9 files and about 1.03 MB |
| Where | The existing Cloudflare Workers project `recipe-discovery` on the owner's account (https://recipe-discovery.musica-sanare.workers.dev); nothing new is created |
| How | `docs/DEPLOYMENT.md` §3: Wrangler 4.152.0 (still the latest on 2026-10-25 02:19 UTC), the Stage 6.6 installation in the session scratch directory (installed with `--ignore-scripts`, `undici` 7.30.1 override, `npm audit` 0); `npm audit` there again on the deployment day; `wrangler whoami` confirmed by the owner; `compatibility_date` unchanged; dry run, then deploy with `WRANGLER_SEND_METRICS=false`; post-deployment checks, including the release 3 changes (§0) |
| Rollback | Redeploy release 2 (`edd7afe`) with the same steps; whether `wrangler rollback` applies to an assets-only Worker remains 要確認 |
| Cost | Static assets are free and unlimited (*Verified* 2026-10-24); re-checked on the deployment day |
| Data and privacy | Unchanged: no user data leaves the browser; no analytics; only the locale preference is stored (ADR-015, ADR-030 D9) |
| Owner actions | Report CI; approve this proposal; confirm the account shown by `wrangler whoami`; approve the deployment |
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
| Acceptance criteria checked | 2 | 2026-10-24 | Claude |
| Release blockers resolved | 2 | 2026-10-24 | Owner (CI passed; open question 16 deferred) and Claude (secret scan) |
| Deployment proposal approved (up to the dry run) | 2 | 2026-10-24 | Owner; dry run passed |
| Production deployment approved | 2 | 2026-10-24 | Owner (account [account name] confirmed with `wrangler whoami`) |
| Deployed and checked | 2 | 2026-10-24 | Claude: `edd7afe`, version `81bc7642…` (`docs/DECISIONS.md` "Second production deployment") |
| Acceptance criteria checked | 3 | 2026-10-25 | Claude (§1) |
| Release blockers resolved | 3 | 2026-10-25 | Owner (CI passed; open question 16 deferred) and Claude (secret scan) |
| Deployment proposal approved | 3 | 2026-10-25 | Owner; dry run passed |
| Production deployment approved | 3 | 2026-10-25 | Owner (account [account name] confirmed with `wrangler whoami`) |
| Deployed and checked | 3 | 2026-10-25 | Claude: `c3b4911`, version `992ce5ff…` (`docs/DECISIONS.md` "Third production deployment") |
