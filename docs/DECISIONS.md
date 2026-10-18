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
