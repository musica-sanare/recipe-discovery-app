[Docs index](../en/README.md)

# Release Readiness — Recipe Discovery

Status: **Release 7 deployed (2026-10-31)** at https://recipe-discovery.musica-sanare.workers.dev from commit `cb086c1` (Cloudflare Workers static assets, version `fa07a331-787d-4658-979a-01dabd1bd076`): the Phase 10 library expansion (130 recipes, content version `2026-10-31.7`) on top of release 6. The post-deployment checks passed ([DECISIONS.md](DECISIONS.md) "Seventh production deployment"). Release 6 (`b113983`, version `4607ad0c-58b3-4f60-aa7c-cd34befaf238`) is the rollback target. Update this document for every release; release 1 is recorded in [DECISIONS.md](DECISIONS.md) ("Stage 5.1 release plan" to "Manual checks"), release 2 in "Stage 6.6" and "Second production deployment", release 3 in "Stage 7.4" and "Third production deployment", release 4 in "Stage 8.4" and "Fourth production deployment", release 5 in "Stage 9.4" and "Fifth production deployment", release 6 in "Release 6 preparation" and "Sixth production deployment", release 7 in "Release 7 preparation" and "Seventh production deployment".

Commit hashes in this document are those after the history rewrite of 2026-10-25; older records in [DECISIONS.md](DECISIONS.md) use the earlier hashes ("History rewrite (2026-10-25)").

| Release | Commit | Content version | Status |
|---|---|---|---|
| 1 (MVP) | `ed511a0` | `2026-10-24.3` | Deployed 2026-10-24 (version `0f4696e0…`); replaced by release 2 |
| 2 (Phase 6) | `7144d06` | `2026-10-24.8` | Deployed 2026-10-24 13:18 UTC (version `81bc7642…`); replaced by release 3 |
| 3 (Phase 7) | `7b66ca3` | `2026-10-25.2` | Deployed 2026-10-25 02:44 UTC (version `992ce5ff…`); replaced by release 4 |
| 4 (Phase 8) | `2bcbb9b` | `2026-10-25.2` | Deployed 2026-10-25 09:02 UTC (version `5a4ae857…`); replaced by release 5 |
| 5 (Phase 9) | `5709506` | `2026-10-25.2` | Deployed 2026-10-25 12:26 UTC (version `3f566ec5…`); replaced by release 6 |
| 6 (Phase 9, dependencies) | `b113983` | `2026-10-25.2` | Deployed 2026-10-31 01:41 UTC (version `4607ad0c…`); replaced by release 7 |
| 7 (Phase 10) | `cb086c1` | `2026-10-31.7` | Deployed 2026-10-31 06:09 UTC (version `fa07a331…`) |

## 0. What changes in release 7

| Stage | Change | Visible to users |
|---|---|---|
| 10.2–10.4 | 44 new recipes in three batches (86 → 130), each reviewed in `en` and `es` ([DECISIONS.md](DECISIONS.md) "Stage 10.1 expansion plan" to "Stage 10.4 batch 3: recipes") | More candidates: Korean, Mediterranean, Southeast Asian, Latin American, and Okinawan dishes, more breakfast, batch-cooking, microwave-only, and egg and soy dishes that meet the cut preset; candidate sets for the same targets change because more recipes qualify |
| 10.2–10.4 | 23 new foods (94 → 117) with their composition values, 8 weight change rates, and 3 Table 14 rows transcribed from the MEXT PDF ("Stage 10.2 batch 1: foods", "Stage 10.3 batch 2: foods", "Stage 10.4 batch 3: foods") | New ingredients in the ingredient search (for example textured soy protein, octopus, kimchi, napa cabbage, eggplant, okra, milk); existing foods keep their values |
| After batch 3 | "añade los huevos" instead of "casca los huevos" in three Spanish steps ("Spanish 'casca' in three reviewed recipes") | Spanish wording only |

Unchanged: the engines, formulas, tolerances, bands, and rounding; every value of the 86 earlier recipes (the engine and solver-result snapshots only add lines); the UI texts and layout; the security headers (`platform/`); the dependencies. The content bundles grow (calculation bundle 280,701 bytes, text bundles 164–191 KB; `dist/` 9 files, about 1.3 MB against 1.0 MB); the JavaScript bundle is unchanged (496,756 bytes).

## 1. Acceptance criteria ([SPEC.md](../en/SPEC.md) §15 and §18)

Checked on `5671d66` on 2026-10-31 (05:35–05:46 UTC): `npm ci`, `npm run check` (lint, type-check, license check, 54 test files with 703 tests, content validation of 117 foods and 130 recipes, production build), `npm run test:e2e` (107 passed, 1 skipped by design), and `npm audit --omit=dev` (0 vulnerabilities). `npm audit` with the development dependencies reports 12 moderate findings, all from the accepted `minimatch` advisory (open question 22, unchanged: no fixed 10.x; not in the bundle).

| Criterion | Result | Evidence |
|---|---|---|
| The complete flow works on mobile and desktop without AI | Met | `e2e/flow.spec.ts` on `desktop-chromium`, `mobile-chromium`, and `mobile-webkit` in `ja`, `en`, `es` on the 130 recipes; the 44 new detail pages checked at 375 px and 1280 px in three locales (264 views); no AI code or service exists (ADR-004) |
| The same input and data always produce the same candidates, order, and nutrition values | Met | Determinism tests; the engine and solver-result snapshots only add the new recipes; the scenario and digest snapshot changes were reviewed per batch |
| Internal nutrition values are identical in `ja`, `en`, and `es` | Met | `test/node/engine.test.ts` and `test/node/recommendation-scenarios.test.ts` "locale invariance" |
| All UI strings and published content exist in the three locales | Met | Content validation (`locale`) for 117 foods and 130 recipes; catalog tests; the new English and Spanish texts reviewed by the owner with back-translated safety notes |
| Every nutrition value is traceable; unmeasured values are never zero; approximations are shown | Met | Engine unchanged; new raw-value approximations carry an ingredient note; `npm run report:composition` (130 recipes: exact 933, approximation 196, hard to estimate 2) |
| An active allergen filter excludes matching or unknown ingredients; the disclaimer is always visible | Met | Engine unchanged; every new food has allergen links (kimchi and oyster sauce as may contain, open question 12) |
| No content contains health or efficacy claims | Met | Content validation (`forbidden-expression`), `src/i18n/policy.test.ts` |
| Attribution to the source tables is shown | Met | Footer, detail view, and about page (`test/ui/about.test.tsx`, `e2e/flow.spec.ts`) |
| Shopping list (§18) | Met | Unchanged; its snapshot unchanged (`test/ui/shopping.test.tsx`, `e2e/shopping.spec.ts`) |
| A full recommendation within about 100 ms at 4× (ADR-030 D10) | Met | About 54–59 ms median and 62–66 ms p90 at 4× on the 130 recipes (§3) |
| Lint, type-check, unit tests, content validation, E2E, accessibility in three locales, and the production build pass | Met locally | Commands above. CI: §2 |

## 2. Release blockers

| Item | Status | What is needed |
|---|---|---|
| CI on the release commit | **Passed** | Both jobs (`check`, `e2e`) passed on `cb086c1` after the owner pushed `dev` (owner's report, 2026-10-31) |
| Secret scan of the release history | **Passed** on `5671d66` | gitleaks 8.30.1 (Homebrew): `gitleaks git --log-opts=--all --redact` (133 commits, 3.57 MB), `gitleaks dir` on the tracked files (`git archive HEAD`, 2.85 MB scanned) and on `dist/` (1.33 MB): no leaks (2026-10-31 05:38 UTC). No commit touches `data/raw`, `*.xlsx`, `*.pdf`, or `.env*`. Repeat if commits other than documentation follow |
| `minimatch` advisory in the development dependencies (open question 22) | **Accepted** (owner, 2026-10-31) | Not a release condition: development only, not in the bundle; re-checked on 2026-10-31 05:36 UTC (no fixed 10.x; `eslint` and `typescript-eslint` still require ^10) |

## 3. Known limitations (released as documented)

| Item | Reference | Mitigation in the app |
|---|---|---|
| Error bands for fried, slow-frying, and parts removed after cooking are assumptions; the bands of raw and related cooked values are set per nutrient from the evidence (Stage 6.5) | Open question 3, [NUTRITION_CALCULATION.md](../en/NUTRITION_CALCULATION.md) §7, ADR-028 (revised) | Values are labelled estimates; ranges and reasons are shown |
| Cooking tables were transcribed by hand from the PDF; group-level rates are not used | Open question 2, [DATA_SOURCES.md](../en/DATA_SOURCES.md) | Automated cross-checks (`npm run data:verify-cooking`, 99 entries; `test/node/cooking-data.test.ts`) |
| English food names have no official reference (2015 English edition not checked) | Open question 6 | Names are the app's own translations |
| Applicability of the Health Promotion Act, the Pharmaceutical and Medical Device Act, and allergen labelling rules; copyright of recipes | Open questions 7, 8 | The stricter policy is applied ([CONTENT_POLICY.md](../en/CONTENT_POLICY.md)); recipes are original |
| No native Spanish reviewer | Open question 9 | The owner reviews with Claude's findings and back-translations (all texts reviewed, including the shopping list); regional vocabulary rules of [CONTENT_POLICY.md](../en/CONTENT_POLICY.md) §6 |
| Allergens of processed seasonings follow typical ingredients, not product labels | Open question 12 | Unknown or varying items are treated as "may contain"; the disclaimer asks users to check labels |
| 16 recipes meet no preset with the default conditions, most of them near on fat because a shown range touches the bound (list and counts: [DECISIONS.md](DECISIONS.md) "Phase 10 start"; earlier records named only `tortilla_espanola` and `mackerel_salt_grill_daikon`); several cooked foods use raw values as approximations | [DECISIONS.md](DECISIONS.md) "Stage 6.4", "Stage 7.3", "Phase 10 start" | Goal labels follow the best-fitting preset; the approximation and its band are shown |
| Egg- and soy-based dishes meet the cut preset less often than other groups: in release 7, 6 of 20 egg and 3 of 20 soy recipes meet it (release 6: 2 of 13 and 0 of 13) | [DECISIONS.md](DECISIONS.md) "Stage 5.2 batch 1", "Stage 10.4 batch 3: recipes" | Goal labels follow the best-fitting preset; fit status and reasons are shown |
| A full recommendation takes about 52–55 ms at a 4× CPU slowdown (p90 about 56–64 ms) and about 78–83 ms at 6× on the measuring machine (2026-10-25 and 2026-10-31); with the 130 recipes of release 7, about 54–59 ms median and 62–66 ms p90 at 4× and 81–90 ms median at 6× (2026-10-31); no real phone measured | ADR-030 D10 (revised, updated in Stage 9.3), ADR-023 (revised before Phase 10 batch 3), below | Release 4's code measured alternately on the same machine takes 79–86 ms at 4×; a synthetic library of 130 recipes stays at about 62–70 ms ([DECISIONS.md](DECISIONS.md) "Stage 9.3 browser timing") |
| After the first view, the precomputation of the solver results occupies the main thread once (about 40–70 ms at 4×); an input in that time waits for it | [DECISIONS.md](DECISIONS.md) "Stage 9.3 precomputation after the first view" | The form appears as fast as in release 4; a search before the precomputation ends gives the same result without the speed-up |
| Shopping list: memory only, lost on reload; amounts are edible portions or weights as sold, not purchase amounts; frying oil follows the recipe amount and depends on the pan; household measure totals only for one unit; copying falls back to a text area where the Clipboard API is missing or refused | [SPEC.md](../en/SPEC.md) §18, ADR-032 | Notes in the list (basis, frying oil) and the reload notice; no data leaves the browser |
| Not checked by hand: a real print dialog and paper output, the Clipboard API on real phones | [DECISIONS.md](DECISIONS.md) "Stage 8.3" | Print styles checked with print media emulation in E2E; the copy fallback tested in jsdom and E2E stubs |
| WebKit reports a `style-src-attr` CSP violation for every `<select>` | "Stage 5.4" | Browser behavior on a page without inline styles; the CSP is unchanged |
| Not checked by hand: Android with Chrome, screen readers (VoiceOver, NVDA, Narrator), and Windows forced colors (§4) | [DECISIONS.md](DECISIONS.md) "Manual checks" | Automated: `mobile-chromium` E2E, axe-core in jsdom and in real browsers in three locales, status markers with distinct shapes and texts (ADR-030 D3) |
| License | [ADR-031](DECISIONS.md), [LICENSE](../../LICENSE) | MIT for the repository; `data/composition/` is used and shared under the MEXT terms ([DATA_SOURCES.md](../en/DATA_SOURCES.md) "License of the extracted data") |

Phone-class timing of release 7 (`npm run test:e2e:timing` on `5671d66`, alternating with release 6's code `b113983` extracted with `git archive` and run with the same `node_modules` (the lockfile is unchanged), three rounds, 2026-10-31 05:41–05:46 UTC, 1-minute load average 2.1–3.9 at each start, Chromium 156, 15 runs; median / p90, ms; range over the rounds): search cut 14.3–15.0 / 15.8–16.1 (1×), 57.0–59.2 / 61.9–66.2 (4×), 85.2–90.3 / 95.6–99.9 (6×); search bulk 13.2–13.5 / 15.8–15.9, 54.2–57.4 / 63.4–65.5, 81.6–86.8 / 95.4–99.6; maintain with tofu required at 4× 29.2–35.1 / 34.8–41.3; bulk at ≤ 15 min at 4× 36.0–38.9 / 40.2–46.5; re-suggestion at 4× 18.8–20.3; recalculation at 4× 8.2–8.4. Release 6 in the same rounds: search cut 49.7–55.0 / 58.6–60.1 and bulk 49.5–51.0 / 54.1–61.6 at 4×, cut 76.9–84.3 at 6×; re-suggestion 18.5–19.1 and recalculation 8.4–9.1 at 4×. The 44 recipes add about 5–8 ms to a full search at 4×; the re-suggestion and the recalculation do not change.

Release 6 (2026-10-31, alternating with release 5): search cut 55.1 ms and bulk 54.6 ms median at 4× against 53.8 and 51.8 ms for release 5 ([DECISIONS.md](DECISIONS.md) "Release 6 preparation").

Release 5 (2026-10-25, alternating with release 4): search cut 53.5–54.2 ms and bulk 51.6–52.6 ms median at 4× against 81.6–86.4 and 78.9–80.5 ms for release 4 ([DECISIONS.md](DECISIONS.md) "Stage 9.4 release 5 preparation").

## 4. Manual checks

Release 1 (owner, 2026-10-24, [DECISIONS.md](DECISIONS.md) "Manual checks"): iPhone with Safari and the about page and disclaimers in three languages without findings; Android, screen readers, and forced colors not checked (§3).

Releases 2 to 6 (optional, after deployment): on an iPhone, the cuisine choices on the targets view in Spanish (nine values), a search with the Southeast Asian cuisine preferred, the detail pages of a new recipe in each language (for example `beef_pho_rice_noodles`, `tofu_sasami_steamed`), for release 4 adding two recipes to the shopping list, checking items off, "Copy as text" (pasting into a notes app), and the print preview, for release 5 the time from tapping "Find recipes" to the candidates with the default targets, for release 6 the targets view, a search, and the language switch in the three languages, and for release 7 a search preferring Korean or Mediterranean dishes and the detail pages of a few new recipes in each language (for example `gyeran_jjim_egg_white_shrimp`, `pulpo_gallega_potatoes`, `tofu_soy_meat_napa_steam`).

## 5. Deployment proposal (approved and deployed on 2026-10-31)

| Item | Proposal |
|---|---|
| What | The release 7 commit `cb086c1` (`compatibility_date` was already the deployment date, so no further commit), built with `npm ci && npm run build`; content version `2026-10-31.7`; `dist/` has 9 files and about 1.3 MB |
| Where | The existing Cloudflare Workers project `recipe-discovery` on the owner's account (https://recipe-discovery.musica-sanare.workers.dev); nothing new is created |
| How | [DEPLOYMENT.md](../en/DEPLOYMENT.md) §3 with Wrangler **4.156.0**, still the latest on 2026-10-31 05:36 UTC (released 2026-10-29 18:42 UTC, the version used for release 6; no later release, so ADR-016 asks for it); dependencies `esbuild` 0.28.2 and `workerd` 1.20261023.1, both with a `node install.js` install script that is not run, and `miniflare` 5.20261023.3-beta with `undici` 7.30.1. The installation of the earlier session is gone, so it is installed again after the owner approves the download into a new folder of the session scratch directory with `npm install --ignore-scripts --save-exact`; integrity compared with release 6 (`sha512-kVLAShuL…fRuQ==`); `npm audit` there; global npm state compared before and after; `wrangler whoami` confirmed by the owner; dry run, then deploy with `WRANGLER_SEND_METRICS=false`; post-deployment checks of [DEPLOYMENT.md](../en/DEPLOYMENT.md) §3 plus the calculation bundle's content version and recipe count, a default search at 375 px in three locales, and two new detail pages |
| Rollback | Redeploy release 6 (`b113983`) with the same steps; whether `wrangler rollback` applies to an assets-only Worker remains 要確認 |
| Cost | Static assets are free and unlimited (*Verified* 2026-10-25, [DECISIONS.md](DECISIONS.md) "Third production deployment"); re-checked on the deployment day |
| Data and privacy | Unchanged: no user data leaves the browser; no analytics; only the locale preference is stored; the shopping list stays in memory (ADR-015, ADR-030 D9, ADR-032 D5) |
| Owner actions | Push and report CI (or ask Claude to push); approve the Wrangler download; approve this proposal and the `compatibility_date` commit; confirm the account shown by `wrangler whoami`; approve the deployment |
| Claude actions after approval | Install Wrangler, create the approved commit, run the dry run and the deployment only as approved, then the post-deployment checks, and record the results here and in [DECISIONS.md](DECISIONS.md) |

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
| Acceptance criteria checked | 6 | 2026-10-31 | Claude (§1) |
| Release blockers resolved | 6 | 2026-10-31 | Owner (CI passed; `minimatch` accepted) and Claude (secret scan) |
| Deployment proposal approved | 6 | 2026-10-31 | Owner (Wrangler download and the `compatibility_date` commit approved; dry run passed) |
| Production deployment approved | 6 | 2026-10-31 | Owner (account [account name] confirmed with `wrangler whoami`) |
| Deployed and checked | 6 | 2026-10-31 | Claude: `b113983`, version `4607ad0c…` ([DECISIONS.md](DECISIONS.md) "Sixth production deployment") |
| Acceptance criteria checked | 7 | 2026-10-31 | Claude (§1) |
| Release blockers resolved | 7 | 2026-10-31 | Owner (CI passed; `minimatch` accepted) and Claude (secret scan) |
| Deployment proposal approved | 7 | 2026-10-31 | Owner (Wrangler download approved; dry run passed) |
| Production deployment approved | 7 | 2026-10-31 | Owner (account [account name] confirmed with `wrangler whoami`) |
| Deployed and checked | 7 | 2026-10-31 | Claude: `cb086c1`, version `fa07a331…` ([DECISIONS.md](DECISIONS.md) "Seventh production deployment") |
