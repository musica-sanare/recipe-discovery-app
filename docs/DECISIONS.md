# Architecture Decision Records

Record decisions here as they are verified. Do not claim a decision is verified until the relevant documents or tests have been checked.

Status values: **Accepted** (approved by the owner), **Proposed** (direction agreed, details to be verified), **Needs owner decision**, **Needs verification**.

Facts marked *Verified* were read from the cited source on the stated date. Terms, limits, and prices change; re-check before relying on them for release.

---

## Verification log (checked 2026-10-18)

### Food composition tables (MEXT)
- *Verified*: free use; secondary use in applications must cite 「日本食品標準成分表（八訂）増補2023年から引用（又は出典）」. Source: https://www.mext.go.jp/a_menu/syokuhinseibun/index.htm
- *Verified*: the data workbook and the explanation PDF were updated on 2026-03-27 (errata). Source: https://www.mext.go.jp/a_menu/syokuhinseibun/mext_00001.html
- *Verified* (explanation PDF, chapter 1): values per 100 g edible portion; refuse rate definition; notation `-`, `0`, `Tr`, `(0)`, `(Tr)`, `( )`; cooked forms analysed without seasoning except a few foods; formulas (c1)–(c5); Table 12 (weight change rates), Table 13 (fried foods), Table 14 (stir-fried and sautéed foods); 2,538 foods. Details: `docs/NUTRITION_CALCULATION.md`.
- *Verified* (same PDF): the 2015 edition was published in Japanese and English; an English version of the eighth edition is under consideration.
- *Measured* (workbook, 2026-10-18): no English food-name column; `ENERC_KCAL` complete; `PROT-` and `FAT-` each have 1 unmeasured value; `PROTCAA` and `FATNLEA` are unmeasured for 422 and 436 foods; median differences −15% (protein) and −8% (fat) versus `PROT-`/`FAT-`; skinless young chicken breast has raw and grilled forms but no boiled form.
- *Verified*: the online database is a trial service with a liability disclaimer. Source: https://fooddb.mext.go.jp/

### Other data sources
- *Verified*: USDA FoodData Central data are CC0; API key required; default 1,000 requests/hour/IP. Source: https://fdc.nal.usda.gov/api-guide
- *Verified*: Open Food Facts uses ODbL (database), DbCL (contents), CC BY-SA (images). Source: https://openfoodfacts.github.io/documentation/docs/Product-Opener/api/tutorials/license-be-on-the-legal-side/
- *Secondary source*: no official correspondence table between the eighth edition and FoodData Central (medRxiv preprint, 2026).

### Allergens and health expressions (Japan)
- *Verified*: 9 mandatory allergen items since April 2026 (cashew nut added, two-year transition) and 20 recommended items (pistachio added). Sources: https://www.caa.go.jp/policies/policy/food_labeling/food_sanitation/allergy/ , https://www.city.sendai.jp/sekatsuese-shokuhin/cashew-pistachio.html
- *Verified* (municipal guidance): Health Promotion Act Article 65(1) prohibits significantly false or misleading health-effect representations for foods offered for sale, addressed to "anyone". Source: https://www.city.sapporo.jp/kenko/wellness/syokuiku/hokenjikou/kodaihyouji_kinshi.html . Applicability to this app: 要確認.

### Dietary reference intakes
- *Verified*: Dietary Reference Intakes for Japanese (2025) apply from FY2025 to FY2029. Source: https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/kenkou_iryou/kenkou/eiyou/syokuji_kijyun.html . Not used in the MVP (no target calculation from personal data).

### Workers AI (for later phases only)
- *Verified* (model catalog updated 2026-08-12): no text-generation model explicitly lists Japanese support. Source: https://developers.cloudflare.com/workers-ai/models/

### Pre-study: recipe count and adjustment (toy simulation, 2026-10-18)
A simulation with **placeholder nutrient values (not from the tables)** and randomly composed recipes estimated how often at least 3 recipes meet the targets. With bounded adjustment (main protein ×0.7–1.4, main carbohydrate ×0.5–1.5), around 40 body-make-oriented recipes gave ≥ 3 qualifying candidates in about 90% or more of the cutting, maintenance, and time-limited scenarios; without adjustment, 60–100 recipes were needed, and bulking targets were almost never met. Requiring specific ingredients or diversity reduces the pool substantially. These numbers only indicate orders of magnitude; Phase 0 repeats the evaluation with real recipes.

### Stage 0.1 toolchain (npm registry and official docs, checked 2026-10-18)
- Local: Node.js 24.19.0, npm 11.17.0.
- *Verified* (npm registry): `typescript` latest is 7.0.2 (released 2026-07-08); 6.0.3 was released 2026-04-16. `typescript-eslint` 8.71.2 (latest) and 8.71.3-alpha.10 (canary) both declare peer `typescript >=4.8.4 <6.1.0`.
- *Verified* (package contents): `typescript@7.0.2` exports only `./lib/version.cjs` as its main entry and experimental `./unstable/*` APIs, not the classic compiler API that type-aware lint tooling uses.
- *Verified* (Microsoft TypeScript blog, "Progress on TypeScript 7 – December 2025", https://devblogs.microsoft.com/typescript/progress-on-typescript-7-december-2025): TypeScript 7.0 does not support the existing (Strada) API; tools that depend on it, such as linters, will not work; the new (Corsa) API is a work in progress; TypeScript 6.0 is the bridge release and the last release on the existing codebase; running 6.0 and 7 side by side is suggested during the transition.
- *Secondary sources*: a stable API is expected with TypeScript 7.1; timing unknown.
- *Verified* (npm registry release times): `i18next` 26.5.0, 26.5.1, and 26.5.2 were published within about 2.5 hours on 2026-10-17; `react-i18next` 17.0.21 and 17.1.0 were published on the same day. `i18next` 26.4.7 (2026-10-16) and `react-i18next` 17.0.20 (2026-10-16) are the preceding versions.
- *Verified* (peer and engine ranges): `vitest` 5.0.5 requires Node `^22.12.0 || ^24.0.0 || >=26.0.0` and `vite ^6.4 || ^7 || ^8`; `@vitejs/plugin-react` 6.1.2 requires `vite ^8`; `jsdom` 30.1.3 requires Node `^22.22.2 || ^24.15.0 || >=26.0.0`; `react-i18next` 17.0.20 requires `i18next >=26.2.0` and TypeScript `^5 || ^6 || ^7`; `eslint` 10.13.0 requires Node `^20.19 || ^22.13 || >=24`; `eslint-plugin-react-refresh` 0.5.7 requires `eslint ^9 || ^10`; `@testing-library/react` 16.3.3 supports React 19.
- *Verified* (Cloudflare docs): "Requests to static assets are free and unlimited" (https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/, updated 2026-04-23). SPA fallback uses `assets.not_found_handling: "single-page-application"` (https://developers.cloudflare.com/workers/static-assets/, updated 2026-10-12). `_headers` lives in the assets directory, allows up to 100 rules and 2,000 characters per line, and does not apply to responses generated by Worker code (https://developers.cloudflare.com/workers/static-assets/headers/, updated 2026-09-22).
- *Not verified*: an official example of an assets-only deployment without a Worker script (`assets.directory` without `main`). Verify when deployment is prepared (Phase 5, with approval).

---

## ADR-001: Static site on Cloudflare with low platform lock-in
- Status: **Accepted** (owner, 2026-10-18)
- Decision: the MVP is a static SPA served from Cloudflare static assets. Platform-specific configuration lives only in `platform/cloudflare/` and generated header files; domain, content, and UI code use no Cloudflare APIs. The build output is a plain static `dist/` that any static host can serve. A Vite plugin specific to Workers is not used while no Worker exists.
- Rationale: the owner intends to use Cloudflare but will switch providers if needed.
- Versions and the exact assets configuration are verified in Phase 0.

## ADR-002: Repository-managed content, no database or admin UI in the MVP
- Status: **Accepted** (owner, 2026-10-18)
- Decision: recipes, foods, translations, and allergen links are files in the repository, validated at build time and shipped as static JSON. No D1, no admin UI, no authentication.
- Trade-off: content changes require a build and deployment; in exchange, diffs are reviewable and there is no admin attack surface.

## ADR-003: Curated recipes with deterministic adjustment and substitution
- Status: **Accepted** (owner, 2026-10-18)
- Decision: original structured recipes; bounded amount adjustment and predefined substitutions are deterministic. AI recipe generation is out of scope.
- Open: how much automatic "fit to targets" adjustment is in the MVP (Phase 0).

## ADR-004: No AI at runtime in the MVP
- Status: **Accepted** (owner, 2026-10-18)
- Decision: no AI calls. Reason texts come from deterministic data and message templates; ingredient input uses the dictionary with aliases.
- Later candidates: free-text input structuring and explanation text, each requiring evaluation in three locales (fixed evaluation sets, ID precision/recall, cross-locale consistency, human review), a server endpoint, and approval.

## ADR-005: Japanese, English, and Spanish from the MVP
- Status: **Accepted** (owner, 2026-10-18)
- Decision: `ja`, `en`, `es` for UI and all content, including input, errors, and accessibility. Published content must be complete in all locales (build check). The owner's typed-catalog i18n approach (i18next) is the candidate library, confirmed in Phase 0. Default locale and detection: *Proposed* as in `docs/ARCHITECTURE.md` §4.
- Rationale: multilingual support is part of the owner's identity across web apps.

## ADR-006: Food identity separated from translation
- Status: **Accepted** (owner, 2026-10-18)
- Decision: ingredients reference locale-neutral food IDs mapped to food codes and data versions. Names and aliases are display and search data. Calculation functions take no locale; a locale invariance test is part of the acceptance criteria.

## ADR-007: Translations as canonical repository content
- Status: **Accepted** (owner, 2026-10-18)
- Decision: Claude drafts `en`/`es` at authoring time; the owner reviews diffs and reports issues; translations are committed as canonical content. A glossary keeps terms consistent; safety-relevant texts are back-translated during review.
- Risk: Spanish errors may go unnoticed if review capacity is limited.

## ADR-008: Best-effort allergen exclusion
- Status: **Accepted** (owner, 2026-10-18)
- Decision: allergen links with `contains` / `may_contain` / `unknown`; exclusion removes all three; no guarantee wording anywhere; disclaimer always visible. Details: `docs/CONTENT_POLICY.md` §2.

## ADR-009: Discovery-first ranking; required ingredients as an optional hard filter
- Status: **Accepted** (owner, 2026-10-18)
- Decision: the main value is discovering dishes the user would not think of. Pantry input is not required. Users may optionally specify required ingredients, which act as a hard filter. Candidate sets are diversified deterministically (main protein, cuisine, cooking method); "show a different type" gives a reproducible next set.
- Open: whether viewed recipes are remembered in the browser (with the storage decision, Phase 4).

## ADR-010: Fried foods allowed as labelled estimates
- Status: **Accepted** (owner, 2026-10-18)
- Decision: fried recipes are included. Uncertainty is classified in advance from data availability (cooked fried form exists or not), shown with a note and, where needed, a range. Ranges that straddle a target give "near / uncertain". Details: `docs/NUTRITION_CALCULATION.md` §6.

## ADR-011: Displayed nutrient columns
- Status: **Proposed** (owner agreed to decide after checking real data; 2026-10-18)
- Direction: energy `ENERC_KCAL`, protein `PROT-`, fat `FAT-`; carbohydrate column decided in Phase 0. Evidence: verification log (workbook measurements).

## ADR-012: Source data handling
- Status: **Accepted** (owner, 2026-10-18)
- Decision: the original workbook is never committed; the extracted subset and manifest (URL, update date, SHA-256, script version) are committed. Details: `docs/DATA_SOURCES.md`.

## ADR-013: Attribution
- Status: **Accepted** (owner, 2026-10-18)
- Decision: cite the source with MEXT's requested wording in the detail view and about page, with the data version and a statement that the values are this app's own calculations. No separate inquiry to MEXT is planned.

## ADR-014: Technology stack candidate
- Status: **Proposed** (owner, 2026-10-18)
- Direction: the owner's established stack — TypeScript (strict), React, Vite, i18next with typed catalogs, Tailwind CSS, Zod, Vitest, Playwright, axe-core, ESLint, npm with lockfile and install-script allowlist. Not needed in the MVP: D1, Drizzle, Hono, jose, Cloudflare Access, Workers runtime. Versions and fit are verified in Phase 0.

## ADR-015: No accounts and no server-side user data
- Status: **Accepted** (owner, 2026-10-18)
- Decision: no accounts; targets and conditions stay in the browser and are not put in URLs. Browser storage of targets or history is undecided (Phase 4).

## ADR-016: Dependency version policy
- Status: **Accepted** (owner, 2026-10-18)
- Decision: use the latest stable release of every dependency. Only two exceptions are allowed, each recorded here with its reason and the condition for moving to the latest version:
  1. **Compatibility constraint**: the latest version cannot work with another required tool (for example ADR-017).
  2. **Release burst**: several releases of the same package were published within a short time (about 48 hours) right before installation. Use the last version before the burst and re-check after a few days.
- The lockfile pins exact versions; `package.json` uses caret ranges except where an exception requires a narrower range.
- Current exceptions:
  - TypeScript 6.0.x instead of 7.x (exception 1, ADR-017).
  - `i18next` 26.4.7 and `react-i18next` 17.0.20 pinned exactly (exception 2; see "Stage 0.1 toolchain"). Re-check at the start of Stage 0.2 and move to the latest versions if no further fixes followed.

## ADR-017: TypeScript 6.0 until type-aware linting supports TypeScript 7
- Status: **Accepted** (owner, 2026-10-18)
- Decision: `typescript ~6.0.3` for type-checking and linting.
- Rationale: TypeScript 7 does not provide the compiler API that `typescript-eslint` needs, and no `typescript-eslint` release supports it (verification log "Stage 0.1 toolchain"). Type-aware lint rules (`strictTypeChecked`) are part of the quality baseline.
- Alternatives: TypeScript 6 for linting plus TypeScript 7 for type-checking (two type checkers that can disagree, aliased package installation); TypeScript 7 without type-aware linting (loses safety rules). Both rejected for now.
- Migration trigger: when a stable `typescript-eslint` release supports TypeScript 7, upgrade in a dedicated commit. Check at the start of every phase.

## ADR-018: Install-script policy and Stage 0.1 toolchain
- Status: **Accepted** (owner approved the Stage 0.1 proposal, 2026-10-18)
- `.npmrc`: `engine-strict=true` and `strict-allow-scripts=true`. Any dependency with an install script fails `npm install`/`npm ci` until it is reviewed and listed in `package.json` `allowScripts`. Never use `--dangerously-allow-all-scripts` or approve all scripts at once.
- Measured on 2026-10-18 (npm 11.17.0, macOS): the only package with an install script is `fsevents@2.3.3` (optional dependency of `vite`, macOS only; implicit `node-gyp rebuild`). It ships a prebuilt `fsevents.node`, so the script is not needed; it is denied with `"allowScripts": { "fsevents": false }`. `npm audit` reported 0 vulnerabilities.
- Node: `engines` `>=24.15.0` (required by `jsdom` 30.1.3); `.nvmrc` pins 24. `@types/node` follows the runtime major version (24.x), not the latest types major.
- Dependencies are deliberately minimal for Phase 0: React, i18next/react-i18next, Zod; dev tooling TypeScript, ESLint (`strictTypeChecked`, React Hooks, React Refresh, import boundaries), Vite with `@vitejs/plugin-react`, Vitest with jsdom and Testing Library. Tailwind CSS, Playwright, axe-core, Wrangler, and a router are added in the phase that needs them, each re-checked against ADR-016.
- TypeScript: `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noImplicitOverride`, `noFallthroughCasesInSwitch`, `noUnusedLocals`, `noUnusedParameters`, `verbatimModuleSyntax`; split into `tsconfig.app.json` (browser: `src`, `shared`, `domain`) and `tsconfig.node.json` (configs, `platform`, `test/node`).
- Security headers are defined once in `platform/headers.ts`; the build writes `dist/_headers` (Cloudflare format) and `vite preview` serves the same headers. The dev server has no CSP because React Fast Refresh injects an inline script.
- Verified locally (2026-10-18): lint, type-check, 17 tests, and build pass; the production build served by `vite preview` sends the CSP, logs no console errors, detects the browser language (`es-419` → `es`), switches locale and persists only the locale preference, and has no horizontal overflow at 375 px.

---

## Open questions (要確認)

1. Carbohydrate column and its localized display name (ADR-011).
2. Extraction method for Tables 12–14 from the PDF; use of chapter 3 group-level rates for missing cooked forms.
3. Tolerance, display rounding, and range threshold values (`docs/SPEC.md` §16).
4. Initial recipe count and the scope of automatic adjustment (Phase 0 evaluation with real recipes).
5. Browser storage of targets and viewed recipes.
6. Whether the 2015 English edition's names and food codes can serve as a reference for English names.
7. Applicability of the Health Promotion Act and the Pharmaceutical and Medical Device Act to this app; applicability of allergen labelling rules (policy already applies the stricter interpretation).
8. Copyright status of recipes under Japanese law (primary sources not checked).
9. Spanish review capacity (ADR-007).
10. Raw-egg dishes and other regionally sensitive food safety rules across the three locales.
