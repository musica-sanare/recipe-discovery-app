[Docs index](../en/README.md)

# Release Readiness — Recipe Discovery

Status: **Release 4 in preparation (2026-10-25)**: the Phase 8 shopping list on top of release 3, content version `2026-10-25.2` (unchanged). Release 3 (`7b66ca3`, Cloudflare Workers static assets version `992ce5ff-56e4-4cf3-85d8-7b8ff6f37ab5`) is deployed at https://recipe-discovery.musica-sanare.workers.dev and is the rollback target. Update this document for every release; release 1 is recorded in [DECISIONS.md](DECISIONS.md) ("Stage 5.1 release plan" to "Manual checks"), release 2 in "Stage 6.6" and "Second production deployment", release 3 in "Stage 7.4" and "Third production deployment", release 4 in "Stage 8.4".

Commit hashes in this document are those after the history rewrite of 2026-10-25; older records in [DECISIONS.md](DECISIONS.md) use the earlier hashes ("History rewrite (2026-10-25)").

| Release | Commit | Content version | Status |
|---|---|---|---|
| 1 (MVP) | `ed511a0` | `2026-10-24.3` | Deployed 2026-10-24 (version `0f4696e0…`); replaced by release 2 |
| 2 (Phase 6) | `7144d06` | `2026-10-24.8` | Deployed 2026-10-24 13:18 UTC (version `81bc7642…`); replaced by release 3 |
| 3 (Phase 7) | `7b66ca3` | `2026-10-25.2` | Deployed 2026-10-25 02:44 UTC (version `992ce5ff…`) |
| 4 (Phase 8) | the Stage 8.4 commit | `2026-10-25.2` | In preparation |

## 0. What changes in release 4

| Stage | Change | Visible to users |
|---|---|---|
| 8.1 | Shopping lists added to the scope ([SPEC.md](../en/SPEC.md) §18, ADR-032) | — |
| 8.2 | `domain/shopping`: a pure, locale-free aggregation; the household measure rule moved to `shared/measure.ts` (detail view unchanged) | — |
| 8.3 | Shopping list view, a "Shopping list" section in the recipe detail, a header link, copy as text, print styles, clearing with confirmation; texts in `ja`, `en`, `es` | Users can add recipes in their current state, check items off, copy, and print; the reload notice and the about page's privacy section mention the list |

Unchanged: the nutrition and recommendation engines (all snapshots identical), the recipe content and its version, the security headers (`platform/`), the dependencies and the lockfile (the `i18next` and `react-i18next` pins stay; §2). Since release 3 the repository also gained the docs restructure, the Japanese doc translations, and the MIT license (ADR-031), none of which changes the app.

## 1. Acceptance criteria ([SPEC.md](../en/SPEC.md) §15 and §18)

Checked on `80304ee` with the Stage 8.4 changes (documentation only) on 2026-10-25: `npm ci`, `npm run check` (lint, type-check, license check, 51 test files with 680 tests, content validation, production build), `npm run test:e2e` (107 passed, 1 skipped by design), and `npm audit` (0 vulnerabilities, also with `--omit=dev`) pass.

| Criterion | Result | Evidence |
|---|---|---|
| The complete flow works on mobile and desktop without AI | Met | `e2e/flow.spec.ts` on `desktop-chromium`, `mobile-chromium`, and `mobile-webkit` in `ja`, `en`, `es`; no AI code or service exists (ADR-004) |
| The same input and data always produce the same candidates, order, and nutrition values | Met | `test/node/engine.test.ts` "determinism"; scenario snapshot `test/node/recommendation-scenarios.test.ts` (unchanged); `test/node/solver-results.test.ts` |
| Internal nutrition values are identical in `ja`, `en`, and `es` | Met | `test/node/engine.test.ts` and `test/node/recommendation-scenarios.test.ts` "locale invariance"; locale switching in `test/ui/` and `e2e/flow.spec.ts` |
| All UI strings and published content exist in the three locales | Met | Catalog types, `src/i18n/messages.test.ts`, `src/i18n/engineCodes.test.ts`; content validation in `npm run build`; the `shopping` texts reviewed by the owner (Stage 8.3) |
| Every nutrition value is traceable; unmeasured values are never zero; approximations are shown | Met | Unchanged since release 3 (engine snapshot identical) |
| An active allergen filter excludes matching or unknown ingredients; the disclaimer is always visible | Met | `domain/recommendation/filters.test.ts`; the shopping list makes no allergen statement of its own (ADR-032 D7) |
| No content contains health or efficacy claims | Met | Content validation (`forbidden-expression`), `src/i18n/policy.test.ts` including the new catalogs |
| Attribution to the source tables is shown | Met | Footer, detail view, and about page (`test/ui/about.test.tsx`, `e2e/flow.spec.ts`) |
| Shopping list (§18): a deterministic, locale-free aggregation covered by tests and a snapshot | Met | `domain/shopping/list.test.ts`, `test/node/shopping.test.ts` and its snapshot |
| Shopping list (§18): add from the detail, check off, copy, and print in three locales on desktop and mobile; accessibility | Met | `test/ui/shopping.test.tsx` (axe-core in three locales), `e2e/shopping.spec.ts` (three projects × three locales, print media emulation), `e2e/accessibility.spec.ts` (light and dark) |
| Shopping list (§18): nutrition and scenario snapshots unchanged; a full recommendation within about 100 ms at 4× | Met | Snapshots unchanged in `npm run check`; timing in §3 |
| Lint, type-check, unit tests, content validation, E2E, accessibility in three locales, and the production build pass | Met locally | Commands above. CI: §2 |

## 2. Release blockers

| Item | Status | What is needed |
|---|---|---|
| CI on the release commit | **Open** | Both jobs (`check`, `e2e`) on the pushed release commit (the owner pushes and reports) |
| Secret scan of the release history | **Passed** on `80304ee` | gitleaks 8.30.1 (Homebrew): `gitleaks git --log-opts=--all --redact` (105 commits, 2.87 MB), `gitleaks dir` on the tracked files (`git archive HEAD`, 2.30 MB) and on `dist/` (1.05 MB): no leaks (2026-10-25 07:47 UTC). No commit touches `data/raw`, `*.xlsx`, `*.pdf`, or `.env*`. Repeat if commits other than documentation follow |
| `i18next` / `react-i18next` pins (open question 16) | **Deferred** (owner decision for releases 1 to 4) | Not a release condition (ADR-016 release-burst exception). The earliest re-check is 2026-10-26 12:40 UTC; the owner chose to release 4 without it (2026-10-25). An update is its own commit and redeployment |

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
| A full recommendation takes about 88 ms at a 4× CPU slowdown (p90 about 99–100 ms) on the measuring machine on 2026-10-25; little margin is left under the 100 ms threshold; no real phone measured | ADR-030 D10 (revised), below | Release 3's code measured on the same machine and day gives the same range (85 ms, p90 99 ms), so Phase 8 did not slow the recommendation; a speed-up (for example Stage 6.2 option O3) is needed before the library grows |
| Shopping list: memory only, lost on reload; amounts are edible portions or weights as sold, not purchase amounts; frying oil follows the recipe amount and depends on the pan; household measure totals only for one unit; copying falls back to a text area where the Clipboard API is missing or refused | [SPEC.md](../en/SPEC.md) §18, ADR-032 | Notes in the list (basis, frying oil) and the reload notice; no data leaves the browser |
| Not checked by hand: a real print dialog and paper output, the Clipboard API on real phones | [DECISIONS.md](DECISIONS.md) "Stage 8.3" | Print styles checked with print media emulation in E2E; the copy fallback tested in jsdom and E2E stubs |
| WebKit reports a `style-src-attr` CSP violation for every `<select>` | "Stage 5.4" | Browser behavior on a page without inline styles; the CSP is unchanged |
| Not checked by hand: Android with Chrome, screen readers (VoiceOver, NVDA, Narrator), and Windows forced colors (§4) | [DECISIONS.md](DECISIONS.md) "Manual checks" | Automated: `mobile-chromium` E2E, axe-core in jsdom and in real browsers in three locales, status markers with distinct shapes and texts (ADR-030 D3) |
| License | [ADR-031](DECISIONS.md), [LICENSE](../../LICENSE) | MIT for the repository; `data/composition/` is used and shared under the MEXT terms ([DATA_SOURCES.md](../en/DATA_SOURCES.md) "License of the extracted data") |

Phone-class timing of release 4 (`npm run test:e2e:timing` on `80304ee`, 2026-10-25 07:45 UTC, Chromium 156, 15 runs; median / p90, ms; second run in brackets): search cut 21.5 / 26.5 (1×), 87.8 / 100.4 [87.6 / 98.9] (4×), 131.3 / 150.3 (6×); search bulk 20.2 / 24.1, 82.5 / 93.9 [80.5 / 93.7], 120.1 / 139.8; maintain with tofu required 10.5 / 13.4, 41.0 / 47.2, 60.6 / 69.2; bulk at ≤ 15 min 12.7 / 16.2, 50.3 / 58.7, 73.6 / 78.3; re-suggestion 5.8 / 6.3, 22.7 / 24.1, 32.6 / 35.5; recalculation 2.9 / 3.3, 12.8 / 14.2, 18.1 / 19.3. Release 3's code (`7b66ca3`) on the same machine right after: search cut 85.0 / 99.4 and bulk 86.2 / 114.0 at 4×. `npm run bench:recommendation` (Node, median): bulk 15.1 ms (release 3: 14.7 ms).

## 4. Manual checks

Release 1 (owner, 2026-10-24, [DECISIONS.md](DECISIONS.md) "Manual checks"): iPhone with Safari and the about page and disclaimers in three languages without findings; Android, screen readers, and forced colors not checked (§3).

Releases 2 to 4 (optional, after deployment): on an iPhone, the cuisine choices on the targets view in Spanish (nine values), a search with the Southeast Asian cuisine preferred, the detail pages of a new recipe in each language (for example `beef_pho_rice_noodles`, `tofu_sasami_steamed`), and for release 4 adding two recipes to the shopping list, checking items off, "Copy as text" (pasting into a notes app), and the print preview.

## 5. Deployment proposal (for the owner's approval)

| Item | Proposal |
|---|---|
| What | The Stage 8.4 release commit (documentation after `80304ee`) plus a commit that sets `compatibility_date` to the deployment date, built with `npm ci && npm run build`; content version `2026-10-25.2`; `dist/` has 9 files and about 1.05 MB |
| Where | The existing Cloudflare Workers project `recipe-discovery` on the owner's account (https://recipe-discovery.musica-sanare.workers.dev); nothing new is created |
| How | [DEPLOYMENT.md](../en/DEPLOYMENT.md) §3: Wrangler 4.152.0 (the latest on 2026-10-25 07:29 UTC; integrity `sha512-lmXTF1sC…dHeA==`) installed after the owner approves the download into the session scratch directory with `--ignore-scripts` (install scripts of `esbuild` 0.28.2 and `workerd` 1.20261019.1 are `node install.js`, not needed with the optional platform packages); `npm audit` there, with overrides if needed (release 3: `undici` 7.30.1); `wrangler whoami` confirmed by the owner; dry run, then deploy with `WRANGLER_SEND_METRICS=false`; post-deployment checks of [DEPLOYMENT.md](../en/DEPLOYMENT.md) §3 plus adding two recipes to the shopping list, the list view, and copying at 375 px |
| Rollback | Redeploy release 3 (`7b66ca3`) with the same steps; whether `wrangler rollback` applies to an assets-only Worker remains 要確認 |
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
| Release blockers resolved | 4 | — | Open: CI (owner); secret scan passed (Claude); open question 16 deferred (owner, 2026-10-25) |
| Deployment proposal approved | 4 | — | Open |
| Production deployment approved | 4 | — | Open |
| Deployed and checked | 4 | — | Open |
