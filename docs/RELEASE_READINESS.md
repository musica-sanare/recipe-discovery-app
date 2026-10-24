# Release Readiness — Recipe Discovery MVP

Status: **Ready for the owner's deployment approval (2026-10-24)**. Every acceptance criterion of `docs/SPEC.md` §15 is met, CI passes, and the release blockers are resolved or deferred by the owner (§2). Nothing is deployed. Update this document for every release candidate; decisions behind it are in `docs/DECISIONS.md` ("Stage 5.1 release plan" to "Release blocker decisions").

## 1. Acceptance criteria (`docs/SPEC.md` §15)

Checked on commit `9bf2356` (content version `2026-10-24.3`, 60 recipes, 77 foods) on 2026-10-24: `npm run check` (lint, type-check, license check, 46 test files with 624 tests, content validation, production build), `npm run test:e2e` (98 passed, 1 skipped by design), and `npm audit` (0 vulnerabilities) pass.

| Criterion | Result | Evidence |
|---|---|---|
| The complete flow (targets → conditions → candidates → comparison → detail → adjustment → re-suggestion) works on mobile and desktop without AI | Met | `e2e/flow.spec.ts` on `desktop-chromium`, `mobile-chromium`, and `mobile-webkit` in `ja`, `en`, `es`; no AI code or service exists (ADR-004) |
| The same input and data always produce the same candidates, order, and nutrition values | Met | `test/node/engine.test.ts` "determinism"; scenario snapshot `test/node/recommendation-scenarios.test.ts`; `domain/recommendation/*.test.ts` |
| Internal nutrition values are identical in `ja`, `en`, and `es` | Met | `test/node/engine.test.ts` "locale invariance" (no locale in the engine signature, identical bundle for every locale); `test/ui/candidates.test.tsx` and `e2e/flow.spec.ts` "locale switching" (same digits after switching) |
| All UI strings and published content exist in the three locales (build time) | Met | Type check of the catalogs, `src/i18n/messages.test.ts`, `src/i18n/engineCodes.test.ts`; content validation (locale completeness) in `npm run build` |
| Every nutrition value is traceable to food codes, data version, cooking state, and assumptions | Met | Basis in the detail view (`test/ui/detail.test.tsx`), `test/node/engine.test.ts` "states the assumptions of every recipe in the basis"; engine snapshot |
| Unmeasured values are never zero; approximations and hard-to-estimate items are always shown | Met | `domain/nutrition/engine.test.ts` ("make the nutrient unknown, never zero"), `domain/nutrition/rounding.test.ts`; approximation reasons in the detail view and the composition report |
| An active allergen filter excludes recipes with matching or unknown ingredients; the disclaimer is always visible | Met | `domain/recommendation/filters.test.ts` "allergens (best effort, never rescued)"; disclaimer on the targets, candidates, comparison, detail, and about views (`disclaimer.allergens`); allergen lists match the CAA lists of April 2026 (§2) |
| No content contains health or efficacy claims | Met | Content validation (`forbidden-expression`), `src/i18n/policy.test.ts`; Stage 5.5 content policy re-check |
| Attribution to the source tables is shown | Met | Footer, detail view, and about page (`test/ui/about.test.tsx`, `e2e/flow.spec.ts`) |
| Lint, type-check, unit tests, content validation, E2E, accessibility in three locales, and the production build pass | Met locally | Commands above; axe-core in jsdom (`test/ui/`) and in real browsers with color contrast in light and dark (`e2e/accessibility.spec.ts`). CI has not run yet (§2) |

## 2. Release blockers

These must be resolved before a deployment proposal can be approved (owner decision R2, 2026-10-24).

| Item | Status | What is needed |
|---|---|---|
| Allergen item lists (open question 11) | **Closed** | *Verified* on 2026-10-24 against the Consumer Affairs Agency page (https://www.caa.go.jp/policies/policy/food_labeling/food_sanitation/allergy/) and its PDFs "アレルギー表示とは" (令和8年4月時点) and the notice of 2026-04-01: 9 mandatory items (えび, カシューナッツ, かに, くるみ, 小麦, そば, 卵, 乳, 落花生; cashew with a two-year transition) and 20 recommended items (アーモンド, あわび, いか, いくら, オレンジ, キウイフルーツ, 牛肉, ごま, さけ, さば, 大豆, 鶏肉, バナナ, ピスタチオ, 豚肉, マカダミアナッツ, もも, やまいも, りんご, ゼラチン) match `shared/content.ts` exactly |
| English and Spanish review (open question 13) | **Closed** (owner decision) | The owner accepted the remaining texts as they are for this release (2026-10-24; `docs/DECISIONS.md` "Release blocker decisions"). Not separately reviewed: the 20 validation recipes (194 localized texts), the 50 Phase 0 foods, and the UI catalogs outside `about.*` (406 keys); batches 1–3 and the about page were reviewed with their commits |
| `i18next` / `react-i18next` pins (open question 16) | **Deferred** (owner decision) | Not a release condition: the pins follow the release-burst exception of ADR-016, and the suite and `npm audit` pass with them. Re-check after 2026-10-25 18:00 UTC as maintenance; an update is its own commit and redeployment |
| First CI run | **Passed** | The first two runs failed on effect-timing races (`docs/DECISIONS.md` "CI first run"); both jobs (`check`, `e2e`) passed on `d131546` (owner's report, 2026-10-24) |
| Secret scan of the release history | **Passed** on `d131546` | gitleaks 8.30.1: `gitleaks git --log-opts=--all --redact` (63 commits, 1.94 MB), `gitleaks dir` on the tracked files (1.59 MB) and on `dist/`: no leaks (2026-10-24 08:08 UTC). Repeat on the release commit if commits other than documentation follow |

## 3. Known limitations (released as documented)

| Item | Reference | Mitigation in the app |
|---|---|---|
| Error bands for fried, slow-frying, and some approximations are assumptions | Open question 3, `docs/NUTRITION_CALCULATION.md` §7 | Values are labelled estimates; ranges and reasons are shown |
| Cooking tables were transcribed by hand from the PDF; group-level rates are not used | Open question 2, `docs/DATA_SOURCES.md` | Automated cross-checks (`npm run data:verify-cooking`, `test/node/cooking-data.test.ts`) |
| English food names have no official reference (2015 English edition not checked) | Open question 6 | Names are the app's own translations |
| Applicability of the Health Promotion Act, the Pharmaceutical and Medical Device Act, and allergen labelling rules; copyright of recipes | Open questions 7, 8 | The stricter policy is applied (`docs/CONTENT_POLICY.md`); recipes are original |
| No native Spanish reviewer | Open question 9 | The owner reviews with back-translations; neutral Spanish; regional aliases |
| Allergens of processed seasonings (cooking sake, wholegrain mustard, stock granules, karaage mix, curry powder, miso) follow typical ingredients, not product labels | Open question 12 | Unknown or varying items are treated as "may contain"; the disclaimer asks users to check labels |
| Egg- and soy-based recipes rarely meet the preset fat limits | `docs/DECISIONS.md` "Stage 5.2 batch 1" | Goal labels follow the best-fitting preset; users can set their own targets |
| A full recommendation takes about 80 ms at a 4× CPU slowdown and about 120 ms at 6×; no real phone measured | ADR-030 D10 (revised) | Main thread within the 100 ms threshold at 4×; measure again when the library grows |
| WebKit reports a `style-src-attr` CSP violation for every `<select>` | "Stage 5.4" | Browser behavior on a page without inline styles; the CSP is unchanged |
| License of the repository not chosen | README | Repository stays private |

## 4. Manual checks

Before or right after the first deployment (results recorded here):

1. Real devices: iPhone with Safari and an Android phone with Chrome — the full flow, the language switch, keyboard on the targets form, and timing of a search (compare with ADR-030 D10).
2. Screen readers: VoiceOver (iOS or macOS) on the targets form, error summary, candidates live region, comparison table, and detail view; NVDA or Narrator if a Windows machine is available.
3. Windows high-contrast (forced colors) mode: status markers and focus rings remain visible.
4. Post-deployment checks of `docs/DEPLOYMENT.md` §3 step 6 (headers, deep links, `/about`, asset caching, `_headers` on SPA fallback responses, no external requests).
5. A final read of the about page and disclaimers in the three locales on the deployed site.

## 5. Deployment proposal (for the owner's approval; not deployed)

| Item | Proposal |
|---|---|
| What | The release commit: `dev` with this report (documentation only after `d131546`), built with `npm ci && npm run build`; content version `2026-10-24.3` |
| Where | Cloudflare Workers static assets on the owner's account, project `recipe-discovery`, served first at the free `*.workers.dev` subdomain (owner decision R3); a custom domain can be added later |
| How | `docs/DEPLOYMENT.md` §3: the owner logs in with Wrangler in a browser (no token in the repository); set `compatibility_date`; dry run, then deploy, with an exact Wrangler version; post-deployment checks. Wrangler: latest 4.152.0 (released 2026-10-22 14:43 UTC after 4.151.2 and 4.151.3 on 10-19 and 10-20; Node `>=22`). It is installed only for the deployment, in a scratch directory outside the repository (about 180 MB, mostly `@cloudflare/workerd-darwin-arm64`). Its dependencies `esbuild` and `workerd` have `postinstall` scripts (`node install.js`), which are reviewed before they are allowed (ADR-018); the version choice under ADR-016 is confirmed on the day |
| Rollback | Redeploy the previous release commit with the same steps; Cloudflare's own version rollback is checked at deployment time (`docs/DEPLOYMENT.md` §3) |
| Cost | *Verified* on 2026-10-24: "Requests to static assets are free and unlimited" and no cost for storing assets (https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/, updated 2026-04-23); Free plan limits of 20,000 files per version and 25 MiB per file (https://developers.cloudflare.com/workers/platform/limits/, updated 2026-10-12) are far above `dist/` (9 files, 864 KB). No Worker script, no paid plan |
| Data and privacy | No user data leaves the browser; no analytics; only the locale preference is stored (ADR-015, ADR-030 D9) |
| Owner actions | Approve this proposal (commit, project name, `*.workers.dev` URL, Wrangler version and its install scripts); log in to Cloudflare when Wrangler asks; confirm the deployed URL |
| Claude actions after approval | Run the dry run and the deployment commands only as approved, then the post-deployment checks, and record the results here |

## 6. Sign-off

| Step | Date | By |
|---|---|---|
| Acceptance criteria checked | 2026-10-24 | Claude (commands above) |
| Release blockers resolved | 2026-10-24 | Owner (open questions 13 and 16 by decision; CI passed) and Claude (open question 11, secret scan) |
| Deployment proposal approved (up to the dry run) | 2026-10-24 | Owner; dry run passed (`docs/DECISIONS.md` "Deployment preparation and dry run") |
| Production deployment approved | — | Owner |
| Deployed and checked | — | — |
