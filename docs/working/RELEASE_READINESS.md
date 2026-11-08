[Docs index](../en/README.md)

# Release Readiness — Recipe Discovery

Status: **Release 16 deployed (2026-11-08)** at https://recipe-discovery.apps.musica-sanare.com and https://recipe-discovery.musica-sanare.workers.dev from commit `ef03259`, the first release by fast-forward: `main` and `dev` point to the same commit (ADR-035, revised; [DECISIONS.md](DECISIONS.md) "Releases by fast-forward"). It adds the dependency updates after release 15 and the WebKit legend fix. The post-deployment checks passed on both URLs ([DECISIONS.md](DECISIONS.md) "Release 16 and sixteenth production deployment"). `6e2ce04` (release 15) is the rollback target. Release 15 was deployed (2026-11-08) at https://recipe-discovery.apps.musica-sanare.com and https://recipe-discovery.musica-sanare.workers.dev from commit `394704b`, merged into `main` as `6e2ce04` and deployed by Workers Builds: the UI refresh of Phase 18 (ADR-041) on top of release 14. The post-deployment checks passed on both URLs ([DECISIONS.md](DECISIONS.md) "Release 15 and fifteenth production deployment"). `0a5afff` (release 14) is the rollback target. Release 14 was deployed (2026-11-03) at https://recipe-discovery.apps.musica-sanare.com and https://recipe-discovery.musica-sanare.workers.dev from commit `cf4ef7e`, merged into `main` as `0a5afff` and deployed by Workers Builds: the app of release 13 on the public hostname (Phase 17, ADR-040). The post-deployment checks passed on both URLs ([DECISIONS.md](DECISIONS.md) "Release 14 and fourteenth production deployment"). `4768cad` (release 13) is the rollback target. Release 13 was deployed at https://recipe-discovery.musica-sanare.workers.dev from commit `84c2e41`, merged into `main` as `4768cad` and deployed by Workers Builds: per-locale UI catalogs and free-text word lists, the header logo, and the detail nutrition tiles (Phase 16, ADR-039) on top of release 12. The post-deployment checks passed ([DECISIONS.md](DECISIONS.md) "Release 13 and thirteenth production deployment"). `4a265dd` (release 12) was its rollback target. Release 12 was deployed from commit `cc1bf80`, merged into `main` as `4a265dd` and deployed by Workers Builds: 20 recipes from France and French-speaking regions with three new cuisine values (Phase 15, ADR-038) on top of release 11 ([DECISIONS.md](DECISIONS.md) "Release 12 and twelfth production deployment"); `dc0f099` (release 11) was its rollback target. Release 11 was deployed from commit `04134e0`, merged into `main` as `dc0f099` and deployed by Workers Builds: the "soft pop" redesign of Phase 14 (ADR-037) on top of release 10 ([DECISIONS.md](DECISIONS.md) "Release 11 and eleventh production deployment"); `a93902d` (release 10) was its rollback target. Release 10 was deployed at https://recipe-discovery.musica-sanare.workers.dev from commit `6288bd7`, merged into `main` as `a93902d` (version `d0574e40…`) and deployed by Workers Builds: the opt-in saved conditions of Phase 13 (ADR-036) on top of release 9. The post-deployment checks passed ([DECISIONS.md](DECISIONS.md) "Release 10 and tenth production deployment"). `f296aaf` (release 9) is the rollback target. Release 9 was deployed at https://recipe-discovery.musica-sanare.workers.dev from commit `9a5120c`, merged into `main` as `f296aaf` (version `9f5b65ef-b9f8-44d7-8f19-b55c79b2893d`) and deployed by Cloudflare Workers Builds (ADR-035): the free-text conditions of Phase 12, read by a deterministic parser in the browser (ADR-034, revised twice), on top of release 8. The post-deployment checks passed ([DECISIONS.md](DECISIONS.md) "Release 9 and ninth production deployment"). `36e5e3e` (version `4f323282…`, the first Workers Builds deployment, the same app as release 8) is the rollback target. Update this document for every release; release 1 is recorded in [DECISIONS.md](DECISIONS.md) ("Stage 5.1 release plan" to "Manual checks"), release 2 in "Stage 6.6" and "Second production deployment", release 3 in "Stage 7.4" and "Third production deployment", release 4 in "Stage 8.4" and "Fourth production deployment", release 5 in "Stage 9.4" and "Fifth production deployment", release 6 in "Release 6 preparation" and "Sixth production deployment", release 7 in "Release 7 preparation" and "Seventh production deployment", release 8 in "Release 8 preparation" and "Eighth production deployment", release 9 in "First Workers Builds deployment" and "Release 9 and ninth production deployment".

Commit hashes in this document are those after the history rewrite of 2026-10-25; older records in [DECISIONS.md](DECISIONS.md) use the earlier hashes ("History rewrite (2026-10-25)").

| Release | Commit | Content version | Status |
|---|---|---|---|
| 1 (MVP) | `ed511a0` | `2026-10-24.3` | Deployed 2026-10-24 (version `0f4696e0…`); replaced by release 2 |
| 2 (Phase 6) | `7144d06` | `2026-10-24.8` | Deployed 2026-10-24 13:18 UTC (version `81bc7642…`); replaced by release 3 |
| 3 (Phase 7) | `7b66ca3` | `2026-10-25.2` | Deployed 2026-10-25 02:44 UTC (version `992ce5ff…`); replaced by release 4 |
| 4 (Phase 8) | `2bcbb9b` | `2026-10-25.2` | Deployed 2026-10-25 09:02 UTC (version `5a4ae857…`); replaced by release 5 |
| 5 (Phase 9) | `5709506` | `2026-10-25.2` | Deployed 2026-10-25 12:26 UTC (version `3f566ec5…`); replaced by release 6 |
| 6 (Phase 9, dependencies) | `b113983` | `2026-10-25.2` | Deployed 2026-10-31 01:41 UTC (version `4607ad0c…`); replaced by release 7 |
| 7 (Phase 10) | `cb086c1` | `2026-10-31.7` | Deployed 2026-10-31 06:09 UTC (version `fa07a331…`); replaced by release 8 |
| 8 (Phase 11) | `2aa0c7b` | `2026-10-31.8` | Deployed 2026-10-31 11:08 UTC (version `54ef9ecc…`); replaced by `36e5e3e` (same app, first Workers Builds deployment, version `4f323282…`) |
| 9 (Phase 12) | `9a5120c` (merged as `f296aaf`) | `2026-10-31.8` | Deployed by Workers Builds 2026-10-31 about 23:32 UTC (version `9f5b65ef…`); replaced by release 10 |
| 10 (Phase 13) | `6288bd7` (merged as `a93902d`) | `2026-10-31.8` | Deployed by Workers Builds 2026-11-01 (version `d0574e40…`); replaced by release 11 |
| 11 (Phase 14) | `04134e0` (merged as `dc0f099`) | `2026-10-31.8` | Deployed by Workers Builds 2026-11-01 after the merge at 04:55 UTC; replaced by release 12 |
| 12 (Phase 15) | `cc1bf80` (merged as `4a265dd`) | `2026-11-01.2` | Deployed by Workers Builds 2026-11-01 after the merge at 08:03 UTC; replaced by release 13 |
| 13 (Phase 16) | `84c2e41` (merged as `4768cad`) | `2026-11-01.2` | Deployed by Workers Builds 2026-11-01 after the merge at 11:24 UTC; replaced by release 14 |
| 14 (Phase 17) | `cf4ef7e` (merged as `0a5afff`) | `2026-11-01.2` | Deployed by Workers Builds 2026-11-03 after the merge at 09:12 UTC; replaced by release 15 |
| 15 (Phase 18) | `394704b` (merged as `6e2ce04`) | `2026-11-01.2` | Deployed by Workers Builds 2026-11-08 after the merge at 03:26 UTC; replaced by release 16 |
| 16 (Phase 18 follow-up) | `ef03259` (`main` fast-forwarded) | `2026-11-01.2` | Deployed by Workers Builds 2026-11-08 after the push at about 06:40 UTC |

## 0. What changes in release 16

| Change | Visible to users |
|---|---|
| Dependency updates: minor and patch releases of the build and test tools, `i18next` 26.7.2, `react-i18next` 17.1.13, and `jsdom` 31 ([DECISIONS.md](DECISIONS.md) "ADR-016 dependency update after release 15") | None intended; the startup chunk grows to 467 kB |
| The legends of the targets panels stay inside their panels in WebKit ("Phase 18 legend fix") | The preset and saved-conditions headings on Safari |
| Releases fast-forward `main` to `dev` ("Releases by fast-forward") | None |

## 0a. What changed in release 15

| Stage | Change | Visible to users |
|---|---|---|
| 18.2 | A cool ink dark palette with surface steps, the fat tile on `lilac`, and warning colors of their own in both schemes; small texts on tiles in `text` at 13 px; the stepper row fixed at 320 and 375 px ([DECISIONS.md](DECISIONS.md) "Stage 18.2") | Readable dark mode; allergen notices look different from every nutrient |
| 18.3 | Nutrition as lines with a bar against the target on cards and in the detail view; the "new to you" mark (memory only); an illustrated loading state; a translucent header (sticky from `md`) and bottom bars; from `lg`, the detail nutrition in a sticky right column ("Stage 18.3") | Shorter cards, one new text in four locales, a two-column detail view on desktop |
| 18.4 | Cards deal in, changed values get a short highlight, a newly met status pops; nothing moves with reduced motion ("Stage 18.4") | Motion |

Unchanged: the engines, formulas, rounding, ranking, and every calculated value and existing text; the content and its version (`2026-11-01.2`); stored data (the locale preference and the opt-in saved conditions); the security headers (`platform/`); the dependencies.

## 0b. What changed in release 14

| Stage | Change | Visible to users |
|---|---|---|
| 17.2 | `routes` attaches the Workers Custom Domain `recipe-discovery.apps.musica-sanare.com`; `workers_dev` stays on and `preview_urls` off (ADR-040) | The app at the new URL; the locale preference and saved conditions of `workers.dev` are not available there (per origin) |

Unchanged: `dist/`, the app, the content and its version (`2026-11-01.2`), the headers, and the dependencies. The only file outside the docs that changed since release 13 is `platform/cloudflare/wrangler.jsonc`.

## 0c. What changed in release 13

| Stage | Change | Visible to users |
|---|---|---|
| 16.2 | UI catalogs and free-text word lists load per locale, one chunk each (ADR-039); the startup chunk drops from 568,294 to 457,369 bytes ([DECISIONS.md](DECISIONS.md) "Stage 16.2 per-locale loading") | A short loading status on a language switch; an error with a retry if a chunk cannot be loaded |
| 16.3 | The original "discovery bowl" logo in the header; the detail view's nutrition as tiles, with the ingredients that lack data for an unknown value ("Stage 16.3 logo and detail nutrition tiles") | The new header and detail nutrition in four locales |

Unchanged: the engines, formulas, rounding, ranking, and every calculated value; the content and its version (`2026-11-01.2`); recipe and food IDs; the saved-conditions record; the security headers (`platform/`); the dependencies except `react-i18next` 17.1.10 ("Dependency update: react-i18next 17.1.10").

## 0d. What changed in release 12

| Stage | Change | Visible to users |
|---|---|---|
| 15.1 | Cuisine values `french`, `north_african`, and `west_african` (ADR-038) | Three new cuisine choices in four locales; the free text reads them |
| 15.2–15.3 | 20 original recipes from France, Belgium, Switzerland, Québec, the Maghreb, and West Africa, and 22 foods; content version `2026-11-01.2` ([DECISIONS.md](DECISIONS.md) "Stage 15.2 batch 1: recipes", "Stage 15.3 batch 2: recipes") | New candidates and detail pages; 150 recipes in total |
| 15.2 | CONTENT_POLICY §3 rules for marinades and for wine and beer | Notes on the recipes concerned |

## 1. Acceptance criteria ([SPEC.md](../en/SPEC.md) §15 and §18)

Release 16 was checked on `d099d10` on 2026-11-08 (06:14–06:17 UTC): `npm ci`, `npm run check` (65 test files with 1,050 tests), `npm run test:e2e` (227 passed, 1 skipped by design), and `npm audit --omit=dev` (0 vulnerabilities); `npm audit` reports the 10 moderate findings of the accepted `minimatch` advisory; the phone-class timing of the new lockfile against the old is within the machine's variation ([DECISIONS.md](DECISIONS.md) "Release 16 and sixteenth production deployment").

Release 15 was checked on `c4aef83` on 2026-11-08 (about 03:16–03:19 UTC): `npm ci`, `npm run check` (65 test files with 1,050 tests, content validation, production build), `npm run test:e2e` (215 passed, 1 skipped by design; new: the stepper rows per locale at 320 and 375 px, motion, reduced motion, and forced colors), and `npm audit --omit=dev` (0 vulnerabilities); `npm audit` reports the 10 moderate findings of the accepted `minimatch` advisory. The phone-class timing against release 14 shows the search at 4× about 2–6 ms slower (about 70–74 ms median for cut), within the ADR-030 D10 threshold ([DECISIONS.md](DECISIONS.md) "Stage 18.3", "Stage 18.4"). `npm outdated` lists newer versions of several dependencies (要確認, "Release 15 preparation").

Release 14 was checked on `cf4ef7e` on 2026-11-03 (09:43–09:47 UTC): `npm ci`, `npm run check` (64 test files with 1,023 tests, content validation, production build), `npm run test:e2e` (194 passed, 1 skipped by design), and `npm audit --omit=dev` (0 vulnerabilities); `npm audit` reports the same 12 moderate findings of the accepted `minimatch` advisory. The timing was not repeated: only the deployment config changed.

Release 13 was checked on `95f0c44` on 2026-11-01 (10:40–10:55 UTC): `npm ci`, `npm run check` (64 test files with 1,023 tests, content validation of 139 foods and 150 recipes, production build without the chunk-size warning), `npm run test:e2e` (194 passed, 1 skipped by design; first render and language switch per locale, chunk failures and retries, axe-core with color contrast in real browsers), and `npm audit --omit=dev` (0 vulnerabilities); `npm audit` reports the same 12 moderate findings of the accepted `minimatch` advisory; `npm outdated` lists only the recorded exceptions (`typescript`, `@types/node`). The phone-class timing against release 12 shows the search unchanged (69.6–70.3 ms median for cut at 4×, p90 at most 78.4 ms) and a language switch about 10–25 ms slower for the extra chunk ([DECISIONS.md](DECISIONS.md) "Release 13 preparation").

Release 12 was checked on `974d037` on 2026-11-01 (07:39–07:46 UTC): `npm ci`, `npm run check` (62 test files with 1,003 tests, content validation of 139 foods and 150 recipes, production build), `npm run test:e2e` (164 passed, 1 skipped by design), and `npm audit --omit=dev` (0 vulnerabilities); `npm audit` reports the same 12 moderate findings of the accepted `minimatch` advisory; `npm outdated` lists only the recorded exceptions (`typescript`, `@types/node`). Phase 15 adds 20 recipes and 22 foods and does not change the engines; the phone-class timing against release 11 shows about 1–3 ms more for a search at 4× (62.7–64.3 ms median for cut), within the ADR-030 D10 threshold ([DECISIONS.md](DECISIONS.md) "Release 12 preparation"). New rows: the cuisine values `french`, `north_african`, and `west_african` in the UI catalogs and the free-text parser (`test/node/free-text-parser.test.ts`).

Release 11 was checked on `63bfab1` on 2026-11-01 (04:47–04:51 UTC): `npm ci`, `npm run check` (62 test files with 996 tests, content validation of 117 foods and 130 recipes, production build), `npm run test:e2e` (164 passed, 1 skipped by design; axe-core with color contrast in real browsers in four locales and both modes), and `npm audit --omit=dev` (0 vulnerabilities); `npm audit` reports the same 12 moderate findings of the accepted `minimatch` advisory; `npm outdated` lists only the recorded exceptions (`typescript`, `@types/node`). Stage 14.5 checked 320 px, print, forced colors, reduced motion, and the keyboard path, and measured the phone-class timing against release 10: about 2–4 ms more for a search at 4× (63.6–66.5 ms median for cut), within the ADR-030 D10 threshold ([DECISIONS.md](DECISIONS.md) "Stage 14.5 quality").

Release 10 was checked on `a5e9230` on 2026-11-01 (01:42–01:45 UTC): `npm ci`, `npm run check` (61 test files with 884 tests, content validation of 117 foods and 130 recipes, production build), `npm run test:e2e` (164 passed, 1 skipped by design), and `npm audit --omit=dev` (0 vulnerabilities); `npm audit` reports the same 12 moderate findings of the accepted `minimatch` advisory; `npm outdated` lists the recorded exceptions and `i18next` 26.6.0 ("Phase 13 start: saved conditions"). The phone-class timing was not repeated: Phase 13 does not change the engines and adds one `localStorage` read after the content loads. Stored keys after each flow on the production build (`vite preview`, built-in browser): with saving off, after a search, a detail page, and adding to the shopping list, only `recipe-discovery.locale`; with saving on and the allergen checkbox, one `recipe-discovery.conditions` record holding the form as typed and `allergens: ["wheat"]`; after turning saving off, only the locale key again; no cookies, no session storage, no requests to another origin, no console errors. New rows: saved conditions per locale in `e2e/savedConditions.spec.ts` and `test/ui/savedConditions.test.tsx`.

Release 9 was checked on `9a5120c` on 2026-10-31 (23:15–23:25 UTC): `npm ci`, `npm run check` (59 test files with 838 tests, content validation of 117 foods and 130 recipes, production build), `npm run test:e2e` (152 passed, 1 skipped by design), and `npm audit --omit=dev` (0 vulnerabilities); `npm audit` reports the same 12 moderate findings of the accepted `minimatch` advisory. The phone-class timing was not repeated: Phase 12 does not change the engines, and the free-text field runs only when the user presses "read". The rows below were written for release 8 and still hold; rows that release 9 changes say so.

Release 8 was checked on `c2d56d0` on 2026-10-31 (10:41–10:45 UTC): `npm ci`, `npm run check` (lint, type-check, license check, 54 test files with 747 tests, content validation of 117 foods and 130 recipes, production build), `npm run test:e2e` (140 passed, 1 skipped by design), and `npm audit --omit=dev` (0 vulnerabilities). `npm audit` with the development dependencies reports 12 moderate findings, all from the accepted `minimatch` advisory (open question 22, unchanged). `npm outdated` lists only the recorded exceptions (`typescript` 6.0.3 against 7.0.2, ADR-017; `@types/node` 24.19.2, ADR-018).

| Criterion | Result | Evidence |
|---|---|---|
| The complete flow works on mobile and desktop without AI | Met | `e2e/flow.spec.ts` on `desktop-chromium`, `mobile-chromium`, and `mobile-webkit` in `ja`, `en`, `es`, and `fr`; a French search and detail page checked at 1280 px and 375 px in the built-in browser; no AI code or service exists (ADR-004). Release 9: the free-text field per locale in E2E, and in production at 375 px in French |
| The same input and data always produce the same candidates, order, and nutrition values | Met | Determinism tests; no snapshot changed in Phase 11 or 12; the parser is pure and tested for identical results on repeated input |
| Internal nutrition values are identical in every locale | Met | "locale invariance" in `test/node/engine.test.ts` and `test/node/recommendation-scenarios.test.ts` over `SUPPORTED_LOCALES`; candidates and detail values unchanged through ja → fr → ja (`test/ui/candidates.test.tsx`, `test/ui/detail.test.tsx`); the E2E flow switches ja → en → es → fr → ja with unchanged digits |
| All UI strings and published content exist in every locale | Met | Content validation (`locale`) for 117 foods and 130 recipes; catalog type and tests; the French texts reviewed by the owner with back-translated safety notes |
| Every nutrition value is traceable; unmeasured values are never zero; approximations are shown | Met | Engine and content values unchanged |
| An active allergen filter excludes matching or unknown ingredients; the disclaimer is always visible | Met | Engine unchanged; French disclaimer and allergen names reviewed |
| No content contains health or efficacy claims | Met | Content validation (`forbidden-expression`) with the French list, `src/i18n/policy.test.ts` |
| Attribution to the source tables is shown | Met | Footer, detail view, and about page in every locale (`test/ui/about.test.tsx`, `e2e/flow.spec.ts`) |
| Shopping list (§18) | Met | `e2e/shopping.spec.ts` in every locale |
| A full recommendation within about 100 ms at 4× (ADR-030 D10) | Met | 57.6 ms (cut) and 55.1 ms (bulk) median at 4× (§3) |
| Lint, type-check, unit tests, content validation, E2E, accessibility in every locale, and the production build pass | Met locally | Commands above. CI: §2 |

## 2. Release blockers

| Item | Status | What is needed |
|---|---|---|
| CI on the release commit (release 16) | **Passed** | Both jobs passed on `ef03259` (owner's report, 2026-11-08) |
| Secret scan of the release history (release 16) | **Passed** on `d099d10` | gitleaks 8.30.1: `gitleaks git --log-opts=--all --redact` (209 commits, 5.24 MB) and `gitleaks dir --redact` on the tracked files (3.94 MB): no leaks (2026-11-08 06:17 UTC) |
| CI on the release commit (release 15) | **Passed** | Both jobs passed on `394704b` (owner's report, 2026-11-08) |
| Secret scan of the release history (release 15) | **Passed** on `c4aef83` | gitleaks 8.30.1: `gitleaks git --log-opts=--all --redact` (203 commits, 5.19 MB) and `gitleaks dir --redact` on the tracked files (`git archive HEAD`, 3.92 MB): no leaks (2026-11-08 03:19 UTC) |
| CI on the release commit (release 14) | **Passed** | Both jobs passed on `cf4ef7e` (owner's report, 2026-11-08); the Workers Builds build of `0a5afff` passed (owner's report, 2026-11-03) |
| Secret scan of the release history (release 14) | **Passed** on `cf4ef7e` | gitleaks 8.30.1: `gitleaks git --log-opts=--all --redact` (195 commits, 5.08 MB): no leaks (2026-11-03 09:46 UTC) |
| CI on the release commit (release 13) | **Passed** | Both jobs passed on `84c2e41` (owner's report, 2026-11-01) |
| Secret scan of the release history (release 13) | **Passed** on `95f0c44` | gitleaks 8.30.1: `gitleaks git --log-opts=--all --redact` (187 commits, 5.01 MB) and `gitleaks dir --redact` on the tracked files (`git archive HEAD`, 3.79 MB): no leaks (2026-11-01 10:40 UTC). The only `.env*` path in the history is the removed `.env.example` of Phase 12 with placeholders |
| CI on the release commit (release 12) | **Passed** | Both jobs passed on `cc1bf80` (owner's report, 2026-11-01) |
| Secret scan of the release history (release 12) | **Passed** on `974d037` | gitleaks 8.30.1: `gitleaks git --log-opts=--all --redact` (180 commits, 4.91 MB) and `gitleaks dir --redact` on the tracked files (`git archive HEAD`, 3.72 MB): no leaks (2026-11-01 07:46 UTC). The only `.env*` path in the history is the removed `.env.example` of Phase 12 with placeholders |
| CI on the release commit (release 11) | **Passed** | Both jobs passed on `04134e0` (owner's report, 2026-11-01) |
| Secret scan of the release history (release 11) | **Passed** on `63bfab1` | gitleaks 8.30.1: `gitleaks git --log-opts=--all --redact` (173 commits, 4.57 MB) and `gitleaks dir --redact` on the tracked files (`git archive HEAD`, 3.44 MB): no leaks (2026-11-01 04:51 UTC). The only `.env*` path in the history is the removed `.env.example` of Phase 12 with placeholders |
| CI on the release commit (release 10) | **Passed** | Both jobs passed on `6288bd7` (owner's report, 2026-11-01) |
| Secret scan of the release history (release 10) | **Passed** on `a5e9230` | gitleaks 8.30.1: `gitleaks git --log-opts=--all --redact` (163 commits, 4.46 MB) and `gitleaks dir --redact` on the tracked files (`git archive HEAD`, 3.37 MB): no leaks (2026-11-01 01:45 UTC). The only `.env*` path in the history is the removed `.env.example` of Phase 12 with placeholders |
| CI on the release commit (release 9) | **Passed** | Both jobs passed on `9a5120c` (owner's report, 2026-11-01) |
| Secret scan of the release history (release 9) | **Passed** on `9a5120c` | gitleaks 8.30.1: `gitleaks git --log-opts=--all --redact` (157 commits, 4.38 MB) and `gitleaks dir --redact` on the tracked files (`git archive HEAD`, 3.30 MB): no leaks (2026-10-31 23:15 UTC) |
| CI on the release commit | **Passed** | Both jobs passed on `2aa0c7b` after the owner pushed `dev` (owner's report, 2026-10-31) |
| Secret scan of the release history | **Passed** on `c2d56d0` | gitleaks 8.30.1 (Homebrew): `gitleaks git --log-opts=--all --redact` (143 commits, 4.07 MB), `gitleaks dir --redact` on the tracked files (`git archive HEAD`, 3.10 MB scanned): no leaks (2026-10-31 10:41 UTC). No commit touches `data/raw`, `*.xlsx`, `*.pdf`, or `.env*`. Repeat if commits other than documentation follow |
| `minimatch` advisory in the development dependencies (open question 22) | **Accepted** (owner, 2026-10-31) | Not a release condition: development only, not in the bundle |

## 3. Known limitations (released as documented)

| Item | Reference | Mitigation in the app |
|---|---|---|
| Error bands for fried, slow-frying, and parts removed after cooking are assumptions; the bands of raw and related cooked values are set per nutrient from the evidence (Stage 6.5) | Open question 3, [NUTRITION_CALCULATION.md](../en/NUTRITION_CALCULATION.md) §7, ADR-028 (revised) | Values are labelled estimates; ranges and reasons are shown |
| Cooking tables were transcribed by hand from the PDF; group-level rates are not used | Open question 2, [DATA_SOURCES.md](../en/DATA_SOURCES.md) | Automated cross-checks (`npm run data:verify-cooking`, 104 entries since Phase 15; `test/node/cooking-data.test.ts`) |
| English food names have no official reference (2015 English edition not checked) | Open question 6 | Names are the app's own translations |
| Applicability of the Health Promotion Act, the Pharmaceutical and Medical Device Act, and allergen labelling rules; copyright of recipes | Open questions 7, 8 | The stricter policy is applied ([CONTENT_POLICY.md](../en/CONTENT_POLICY.md)); recipes are original |
| No native French reviewer | Open question 23 | The owner reviews with Claude's findings and back-translations (all French texts reviewed in three batches); French text rules of [CONTENT_POLICY.md](../en/CONTENT_POLICY.md) §6 |
| No native Spanish reviewer | Open question 9 | The owner reviews with Claude's findings and back-translations (all texts reviewed, including the shopping list); regional vocabulary rules of [CONTENT_POLICY.md](../en/CONTENT_POLICY.md) §6 |
| Allergens of processed seasonings follow typical ingredients, not product labels | Open question 12 | Unknown or varying items are treated as "may contain"; the disclaimer asks users to check labels |
| 18 recipes meet no preset with the default conditions, most of them near on fat because a shown range touches the bound (list and counts: [DECISIONS.md](DECISIONS.md) "Phase 10 start"; Phase 15 adds `galette_complete` and `croque_monsieur`, near for maintain; earlier records named only `tortilla_espanola` and `mackerel_salt_grill_daikon`); several cooked foods use raw values as approximations | [DECISIONS.md](DECISIONS.md) "Stage 6.4", "Stage 7.3", "Phase 10 start", "Stage 15.3 batch 2: recipes" | Goal labels follow the best-fitting preset; the approximation and its band are shown |
| Egg- and soy-based dishes meet the cut preset less often than other groups: in release 7, 6 of 20 egg and 3 of 20 soy recipes meet it (release 6: 2 of 13 and 0 of 13); after Phase 15, 6 of 22 and 3 of 20 | [DECISIONS.md](DECISIONS.md) "Stage 5.2 batch 1", "Stage 10.4 batch 3: recipes" | Goal labels follow the best-fitting preset; fit status and reasons are shown |
| A full recommendation takes about 52–55 ms at a 4× CPU slowdown (p90 about 56–64 ms) and about 78–83 ms at 6× on the measuring machine (2026-10-25 and 2026-10-31); with the 130 recipes of release 7, about 54–59 ms median and 62–66 ms p90 at 4× and 81–90 ms median at 6× (2026-10-31); release 8: 57.6 ms (cut) and 55.1 ms (bulk) median at 4×; no real phone measured | ADR-030 D10 (revised, updated in Stage 9.3), ADR-023 (revised before Phase 10 batch 3), below | Release 4's code measured alternately on the same machine takes 79–86 ms at 4×; a synthetic library of 130 recipes stays at about 62–70 ms ([DECISIONS.md](DECISIONS.md) "Stage 9.3 browser timing") |
| Since release 13 the UI catalog and the free-text word list of each locale are a separate chunk loaded before the first render and before a language switch; a failed load shows an error with a retry. The retry of a failed `import()` was checked in Chromium and WebKit, and once in Firefox (2026-11-08; Firefox is not in the E2E projects) | ADR-039, [DECISIONS.md](DECISIONS.md) "Stage 16.2 per-locale loading", "Phase 16 open items closed" | At startup the retry reloads the page; on a switch the current language stays |
| Free text: elliptical alternatives ("Chicken thigh or breast") read only the full name; words outside the word lists are not read; the `es` and `fr` word lists have no native reviewer | [DECISIONS.md](DECISIONS.md) "Stage 12.4 deterministic parser", open questions 9 and 23 | The conditions found are shown before anything is applied; the user can discard them or edit the form |
| After the first view, the precomputation of the solver results occupies the main thread once (about 40–70 ms at 4×); an input in that time waits for it | [DECISIONS.md](DECISIONS.md) "Stage 9.3 precomputation after the first view" | The form appears as fast as in release 4; a search before the precomputation ends gives the same result without the speed-up |
| Shopping list: memory only, lost on reload; amounts are edible portions or weights as sold, not purchase amounts; frying oil follows the recipe amount and depends on the pan; household measure totals only for one unit; copying falls back to a text area where the Clipboard API is missing or refused | [SPEC.md](../en/SPEC.md) §18, ADR-032 | Notes in the list (basis, frying oil) and the reload notice; no data leaves the browser |
| Not checked by hand: a real print dialog and paper output, the Clipboard API on real phones | [DECISIONS.md](DECISIONS.md) "Stage 8.3" | Print styles checked with print media emulation in E2E; the copy fallback tested in jsdom and E2E stubs |
| WebKit reports a `style-src-attr` CSP violation for every `<select>` | "Stage 5.4" | Browser behavior on a page without inline styles; the CSP is unchanged |
| Not checked by hand: Android with Chrome, screen readers (VoiceOver, NVDA, Narrator), and Windows forced colors (§4) | [DECISIONS.md](DECISIONS.md) "Manual checks" | Automated: `mobile-chromium` E2E, axe-core in jsdom and in real browsers in three locales, status markers with distinct shapes and texts (ADR-030 D3) |
| License | [ADR-031](DECISIONS.md), [LICENSE](../../LICENSE) | MIT for the repository; `data/composition/` is used and shared under the MEXT terms ([DATA_SOURCES.md](../en/DATA_SOURCES.md) "License of the extracted data") |

Phone-class timing of release 8 (`npm run test:e2e:timing` on `c2d56d0`, one round, 2026-10-31 10:44 UTC, Chromium 156, 15 runs; median / p90, ms): search cut 14.4 / 16.1 (1×), 57.6 / 63.5 (4×), 86.2 / 95.2 (6×); search bulk 13.5 / 15.5, 55.1 / 65.0, 83.4 / 97.0; maintain with tofu required at 4× 30.2 / 35.7; bulk at ≤ 15 min at 4× 36.6 / 41.7; re-suggestion at 4× 19.2; recalculation at 4× 8.5. Within the ranges of release 7 below; Phase 11 does not change the engines.

Phone-class timing of release 7 (`npm run test:e2e:timing` on `5671d66`, alternating with release 6's code `b113983` extracted with `git archive` and run with the same `node_modules` (the lockfile is unchanged), three rounds, 2026-10-31 05:41–05:46 UTC, 1-minute load average 2.1–3.9 at each start, Chromium 156, 15 runs; median / p90, ms; range over the rounds): search cut 14.3–15.0 / 15.8–16.1 (1×), 57.0–59.2 / 61.9–66.2 (4×), 85.2–90.3 / 95.6–99.9 (6×); search bulk 13.2–13.5 / 15.8–15.9, 54.2–57.4 / 63.4–65.5, 81.6–86.8 / 95.4–99.6; maintain with tofu required at 4× 29.2–35.1 / 34.8–41.3; bulk at ≤ 15 min at 4× 36.0–38.9 / 40.2–46.5; re-suggestion at 4× 18.8–20.3; recalculation at 4× 8.2–8.4. Release 6 in the same rounds: search cut 49.7–55.0 / 58.6–60.1 and bulk 49.5–51.0 / 54.1–61.6 at 4×, cut 76.9–84.3 at 6×; re-suggestion 18.5–19.1 and recalculation 8.4–9.1 at 4×. The 44 recipes add about 5–8 ms to a full search at 4×; the re-suggestion and the recalculation do not change.

Release 6 (2026-10-31, alternating with release 5): search cut 55.1 ms and bulk 54.6 ms median at 4× against 53.8 and 51.8 ms for release 5 ([DECISIONS.md](DECISIONS.md) "Release 6 preparation").

Release 5 (2026-10-25, alternating with release 4): search cut 53.5–54.2 ms and bulk 51.6–52.6 ms median at 4× against 81.6–86.4 and 78.9–80.5 ms for release 4 ([DECISIONS.md](DECISIONS.md) "Stage 9.4 release 5 preparation").

## 4. Manual checks

Release 1 (owner, 2026-10-24, [DECISIONS.md](DECISIONS.md) "Manual checks"): iPhone with Safari and the about page and disclaimers in three languages without findings; Android, screen readers, and forced colors not checked (§3).

Releases 2 to 6 (optional, after deployment): on an iPhone, the cuisine choices on the targets view in Spanish (nine values), a search with the Southeast Asian cuisine preferred, the detail pages of a new recipe in each language (for example `beef_pho_rice_noodles`, `tofu_sasami_steamed`), for release 4 adding two recipes to the shopping list, checking items off, "Copy as text" (pasting into a notes app), and the print preview, for release 5 the time from tapping "Find recipes" to the candidates with the default targets, for release 6 the targets view, a search, and the language switch in the three languages, and for release 7 a search preferring Korean or Mediterranean dishes and the detail pages of a few new recipes in each language (for example `gyeran_jjim_egg_white_shrimp`, `pulpo_gallega_potatoes`, `tofu_soy_meat_napa_steam`), and for release 8 the targets view, a search, a detail page, and the shopping list in French.

Release 9 (optional, after deployment): on an iPhone, the free-text field in each language: type a request, read, apply, and search; a request about allergies and its pointer to the allergen field.

Release 10 (optional, after deployment): on an iPhone with Safari, turn saving on, search, close and reopen the tab, and see the form restored; then turn saving off. Safari may delete the record after seven days without a visit (ADR-036, limits).

Release 15 (optional, after deployment): on an iPhone in light and dark mode, a search, "show a different type" and "exclude this one" (the deal-in and the "new to you" mark), a detail page with an adjustment (the highlight), and the dark allergen notice; with Reduce Motion turned on in iOS, the same without motion; on a desktop browser, the two-column detail view.

Release 11 (optional, after deployment): on an iPhone in light and dark mode, the targets view (the search bar at the bottom while scrolling), a candidate card's tiles, the detail page, and the shopping list; on Windows, high contrast mode if available.

## 5. Deployment (release 16, deployed on 2026-11-08)

Release 16: the first release by fast-forward. The owner pushed `dev` and fast-forwarded `main` to `ef03259`, and Workers Builds deployed it. Claude ran the post-deployment checks of [DEPLOYMENT.md](../en/DEPLOYMENT.md) §3 on both URLs and the app in Chromium and WebKit in production. Rollback: revert on `dev` and fast-forward `main`, or for urgency the dashboard rollback to `6e2ce04` (release 15). Cost: Workers Free. Data and privacy: unchanged.


Release 15: the owner merged `dev` (`394704b`) into `main` (`6e2ce04`), and Workers Builds deployed it. Claude ran the post-deployment checks of [DEPLOYMENT.md](../en/DEPLOYMENT.md) §3 on both URLs plus a search, a card, a detail page with an adjustment, "not found", and a language switch in light and dark mode in `ja` and `fr` at 375 px in production. Rollback: revert on `dev` and merge again, or for urgency the dashboard rollback to `0a5afff` (release 14). Cost: Workers Free. Data and privacy: unchanged; the "new to you" list stays in memory.


Release 14: the owner merged `dev` (`cf4ef7e`) into `main` (`0a5afff`), and Workers Builds deployed it and attached the custom domain. Claude ran the post-deployment checks of [DEPLOYMENT.md](../en/DEPLOYMENT.md) §3 on both URLs and the certificate of the new hostname; the check found the Cloudflare Web Analytics beacon injected on the new hostname, which the owner disabled for the zone (ADR-040). Rollback: revert on `dev` and merge again, or for urgency the dashboard rollback to `4768cad` (release 13); the custom domain may then need removing in the dashboard ([DEPLOYMENT.md](../en/DEPLOYMENT.md) "Public hostname"). Cost: Workers Free; the owner checks Billing the next day. Data and privacy: unchanged; no analytics.

Release 13: the owner merged `dev` (`84c2e41`) into `main` (`4768cad`), and Workers Builds deployed it. Claude ran the post-deployment checks of [DEPLOYMENT.md](../en/DEPLOYMENT.md) §3 plus a cold load in French in fresh Chromium and WebKit contexts and a language switch in production. Rollback: revert on `dev` and merge again, or for urgency the dashboard rollback to `4a265dd` (release 12). Data and privacy: unchanged.

Release 12: the owner merged `dev` (`cc1bf80`) into `main` (`4a265dd`), and Workers Builds deployed it. Claude ran the post-deployment checks of [DEPLOYMENT.md](../en/DEPLOYMENT.md) §3 plus a French search and new detail pages in production. Rollback: revert on `dev` and merge again, or for urgency the dashboard rollback to `dc0f099` (release 11). Data and privacy: unchanged.

Release 11: the owner merged `dev` (`04134e0`) into `main` (`dc0f099`) after CI passed, and Workers Builds deployed it. Claude ran the post-deployment checks of [DEPLOYMENT.md](../en/DEPLOYMENT.md) §3 and looked at the new design in production. Rollback: revert on `dev` and merge again, or for urgency the dashboard rollback to `a93902d` (release 10, version `d0574e40…`). Data and privacy: unchanged.

Release 10: the owner merged `dev` (`6288bd7`) into `main` (`a93902d`), and Workers Builds deployed it (version `d0574e40…`). Claude ran the post-deployment checks of [DEPLOYMENT.md](../en/DEPLOYMENT.md) §3 and the saved-conditions flow in production. Rollback: revert on `dev` and merge again, or for urgency the dashboard rollback to `f296aaf` (release 9, version `9f5b65ef…`). Data and privacy: saved conditions stay in the browser by the user's choice (ADR-036); nothing is sent.

Since ADR-035, a release is the owner's merge into `main`; Workers Builds builds and deploys it ([DEPLOYMENT.md](../en/DEPLOYMENT.md) §3). Nobody runs Wrangler locally. Release 9: the owner approved the release after the checks of §1 and §2 and merged `dev` (`9a5120c`) into `main` (`f296aaf`). Rollback: revert on `dev` and merge again, or for urgency the dashboard rollback to `36e5e3e` (version `4f323282…`); whether the dashboard rollback restores static assets remains 要確認. Cost: static assets are free and unlimited; one build of a few minutes on Workers Free. Data and privacy: unchanged; the free text stays in the browser and is not stored.

## Release 8 deployment proposal (approved and deployed on 2026-10-31)

| Item | Proposal |
|---|---|
| What | The release 8 preparation commit `2aa0c7b` (documentation only on top of `c2d56d0`, which passed §1), built with `npm ci && npm run build`; content version `2026-10-31.8`; `dist/` has 10 files and about 1.5 MB. `compatibility_date` is already 2026-10-31, so no further commit |
| Where | The existing Cloudflare Workers project `recipe-discovery` on the owner's account (https://recipe-discovery.musica-sanare.workers.dev); nothing new is created |
| How | [DEPLOYMENT.md](../en/DEPLOYMENT.md) §3 with Wrangler **4.156.0**, still the latest on 2026-10-31 (registry metadata), the version of releases 6 and 7. The release 7 installation in the session scratch directory is reused: its `package-lock.json` integrity (`sha512-kVLAShuL…fRuQ==`) matches the registry, its install scripts were never run, and `npm audit` there reports 0 vulnerabilities. Nothing is downloaded. `wrangler whoami` shown to the owner; dry run, then deploy with `WRANGLER_SEND_METRICS=false`; post-deployment checks of [DEPLOYMENT.md](../en/DEPLOYMENT.md) §3 plus the calculation bundle's content version, a French text bundle, and a search and a detail page at 375 px in `fr` |
| Rollback | Redeploy release 7 (`cb086c1`) with the same steps; whether `wrangler rollback` applies to an assets-only Worker remains 要確認 |
| Cost | Static assets are free and unlimited (re-checked on the deployment day) |
| Data and privacy | Unchanged: no user data leaves the browser; no analytics; only the locale preference is stored (now possibly `fr`); the shopping list stays in memory (ADR-015, ADR-030 D9, ADR-032 D5) |
| Owner actions | Approve the preparation commit; push `dev` and report CI (or ask Claude to push); confirm the account shown by `wrangler whoami` |
| Claude actions after approval | Create the approved commit, run the dry run and the deployment, then the post-deployment checks, and record the results here and in [DECISIONS.md](DECISIONS.md) |

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
| Acceptance criteria checked | 8 | 2026-10-31 | Claude (§1) |
| Release blockers resolved | 8 | 2026-10-31 | Owner (CI passed; `minimatch` accepted) and Claude (secret scan) |
| Deployment proposal approved | 8 | 2026-10-31 | Owner (Wrangler reused, nothing downloaded; dry run passed) |
| Production deployment approved | 8 | 2026-10-31 | Owner; Claude identified the account and project as those of release 7 (`wrangler whoami`, `wrangler deployments list`) |
| Deployed and checked | 8 | 2026-10-31 | Claude: `2aa0c7b`, version `54ef9ecc…` ([DECISIONS.md](DECISIONS.md) "Eighth production deployment") |
| Acceptance criteria checked | 9 | 2026-11-01 | Claude (§1) |
| Release blockers resolved | 9 | 2026-11-01 | Owner (CI passed) and Claude (secret scan; `minimatch` unchanged) |
| Production deployment approved | 9 | 2026-11-01 | Owner (merged `dev` into `main`, `f296aaf`) |
| Deployed and checked | 9 | 2026-11-01 | Workers Builds; checked by Claude ([DECISIONS.md](DECISIONS.md) "Release 9 and ninth production deployment") |
| Acceptance criteria checked | 10 | 2026-11-01 | Claude (§1) |
| Release blockers resolved | 10 | 2026-11-01 | Owner (CI passed; new texts accepted) and Claude (secret scan; `minimatch` unchanged) |
| Production deployment approved | 10 | 2026-11-01 | Owner (merged `dev` into `main`, `a93902d`) |
| Deployed and checked | 10 | 2026-11-01 | Workers Builds; checked by Claude ([DECISIONS.md](DECISIONS.md) "Release 10 and tenth production deployment") |
| Acceptance criteria checked | 11 | 2026-11-01 | Claude (§1) |
| Release blockers resolved | 11 | 2026-11-01 | Owner (CI passed) and Claude (secret scan; `minimatch` unchanged) |
| Production deployment approved | 11 | 2026-11-01 | Owner (merged `dev` into `main`, `dc0f099`) |
| Deployed and checked | 11 | 2026-11-01 | Workers Builds; checked by Claude ([DECISIONS.md](DECISIONS.md) "Release 11 and eleventh production deployment") |
| Acceptance criteria checked | 12 | 2026-11-01 | Claude (§1) |
| Release blockers resolved | 12 | 2026-11-01 | Owner (CI passed) and Claude (secret scan; `minimatch` unchanged) |
| Production deployment approved | 12 | 2026-11-01 | Owner (merged `dev` into `main`, `4a265dd`) |
| Deployed and checked | 12 | 2026-11-01 | Workers Builds; checked by Claude ([DECISIONS.md](DECISIONS.md) "Release 12 and twelfth production deployment") |
| Acceptance criteria checked | 13 | 2026-11-01 | Claude (§1) |
| Release blockers resolved | 13 | 2026-11-01 | Owner (CI passed) and Claude (secret scan; `minimatch` unchanged) |
| Production deployment approved | 13 | 2026-11-01 | Owner (merged `dev` into `main`, `4768cad`) |
| Deployed and checked | 13 | 2026-11-01 | Workers Builds; checked by Claude ([DECISIONS.md](DECISIONS.md) "Release 13 and thirteenth production deployment") |
| Acceptance criteria checked | 14 | 2026-11-03 | Claude (§1) |
| Release blockers resolved | 14 | 2026-11-03 | Owner (CI passed, reported 2026-11-08) and Claude (secret scan; `minimatch` unchanged) |
| Production deployment approved | 14 | 2026-11-03 | Owner (merged `dev` into `main`, `0a5afff`) |
| Deployed and checked | 14 | 2026-11-03 | Workers Builds; checked by Claude ([DECISIONS.md](DECISIONS.md) "Release 14 and fourteenth production deployment") |
