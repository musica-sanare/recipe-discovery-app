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

### Stage 0.2 composition extraction (2026-10-18)
- The extraction tool reads the workbook with a minimal ZIP and SpreadsheetML reader built on `node:zlib` (CRC-checked; stored and deflated entries; no ZIP64), so no spreadsheet dependency is added (ADR-019).
- *Measured*: reading the whole-table sheet and extracting 50 foods takes about 0.25 s; two runs produce byte-identical output.
- *Measured* (50 representative foods): `ENERC_KCAL`, `PROT-`, and `FAT-` have no unmeasured values. `PROTCAA` is unmeasured for the vegetable oils.
- *Measured, relevant to ADR-011*: the difference-method available carbohydrate `CHOAVLDF-` is 3–5 g per 100 g for lean meat, fish, and eggs (for example skinless young chicken breast raw 3.4 g, grilled 4.7 g; chum salmon raw 3.9 g; whole egg raw 3.4 g), while `CHOCDF-` is 0.1–0.4 g for the same foods. The difference method assigns the residual of the other components to carbohydrate. Displaying `CHOAVLDF-` would add several grams of carbohydrate to protein-heavy dishes. To be decided in Stage 0.5 with the validation recipes.
- Skinless young chicken breast (`11220` raw, `11288` grilled) has no boiled form, confirming that boiled chicken breast, a common body-make dish, needs the approximation rule (`docs/NUTRITION_CALCULATION.md` §5).

### Stage 0.3 cooking data (2026-10-18)
- *Verified*: MEXT publishes Tables 12–14 only in the explanation PDF; no machine-readable version was found. The PDF text layer is column-ordered and cannot be parsed into rows reliably; rendered page images are clearly legible.
- Transcribed (ADR-020): 44 weight change rates, 7 rows of Table 13, and 8 rows of Table 14 for the representative foods; all 59 entries pass the text-layer check, and the plausibility tests pass.
- *Measured* protein retention (cooked value × rate / raw value) for non-coated foods: 0.67–1.07; boiled vegetables lose the most (cabbage 0.67, onion 0.71), meat and fish 0.87–1.03.
- *Verified* (Table 14): stir-frying 100 g of raw food with 5.0 g of oil changed fat by +2.7 to +4.9 g for vegetables, mushrooms, and eggs, and by −2.8 g for farmed Atlantic salmon (sauté). Cooked oil-cooked values already include this, which led to the no-double-counting rule (`docs/NUTRITION_CALCULATION.md` §5 rule 3).
- Coverage of representative food × method pairs in the tables:

  | Food | Cooked forms in the tables | Not in the tables (approximation) |
  |---|---|---|
  | Chicken breast, skinless (young) | raw, grilled | boiled, steamed, microwaved, stir-fried |
  | Chicken thigh, skinless (young) | raw, boiled, grilled, karaage | stir-fried |
  | Pork loin, lean | raw only | all cooked forms |
  | Pork leg, without subcutaneous fat | raw, boiled, grilled | stir-fried |
  | Pork fillet, lean | raw, grilled, tonkatsu | boiled |
  | Beef round (imported), without subcutaneous fat | raw, boiled, grilled | stir-fried |
  | Salmon | chum: raw, simmered, grilled; farmed Atlantic (skinless): simmered, steamed, microwaved, grilled, sautéed, tempura | — |
  | Pacific cod | raw, grilled | steamed, simmered |
  | Whole egg | raw, boiled, poached, fried, scrambled, deep-fried | — |
  | Tofu (firm, silken) | uncooked only | all heated forms |
  | Rice, pasta | cooked rice; dry, boiled, and sautéed pasta | — (state the cooked or dry mass) |
  | Potato, skinless | raw, simmered, steamed, microwaved, fried | — |
  | Broccoli | raw, boiled, microwaved, grilled, stir-fried | — |
  | Spinach, cabbage, onion, shimeji | raw, boiled, stir-fried (shimeji also deep-fried and tempura) | microwaved |

### Stage 0.4 validation recipes and food dictionary (2026-10-18)
- Content: 20 original validation recipes (`content/recipes/`) and a food dictionary of 50 foods (`content/foods.ts`), each with `ja`/`en`/`es` texts; the recipe list was approved by the owner before the translations were written. Translations were drafted by Claude for owner review (ADR-007).
- Coverage: goals cut 7, maintain 9, bulk 5 (one recipe has two); cuisines Japanese, Chinese, Korean-style, Western, Spanish, Okinawan; 4 fried dishes, 6 quick dishes, 1 batch recipe, 1 no-cook recipe, 1 breakfast. 12 ingredients in 10 recipes carry a `cooking` method that differs from the tabulated state (9 use the raw value; 3 use the grilled value for pan-sautéed meat).
- Composition subset extended to 96 foods; one more weight change rate transcribed (11291 ground chicken, grilled, 62 %, page 59; text-layer check 60/60).
- Rough per-serving values from an authoring calculator (raw value × mass, or cooked value × mass × weight change rate; not the Phase 2 engine): cut recipes 372–596 kcal and 35–46 g protein; bulk recipes 653–934 kcal; the salmon dishes and the Spanish omelette stay below 30 g protein, which keeps "near" and "not met" cases for Stage 0.6.
- Allergen categories in `shared/content.ts`: the CAA page states that cashew nut became mandatory on 2026-04-01 and that the last change to the recommended items (2024-03-28) added macadamia nut and removed matsutake; municipal notices state that pistachio was added to the recommended items in April 2026. The resulting lists (9 mandatory, 20 recommended) are derived from these statements because the CAA page shows the list only as an image; 要確認 against the CAA figure.
- Checks added: schema, references to foods and extracted codes, weight change rates for every cooked state, a test that `cooking` is only used when the tables lack that method, `includedIn` references, adjustment bounds, substitutions, food safety notes, a glossary consistency test, and a forbidden-expression lint in three locales. Injected forbidden claims in `ja`, `en`, and `es` were detected on 2026-10-18; the glossary test caught one real inconsistency ("residual-heat").

### Stage 0.5 calculation checks (2026-10-18)
- Implemented a minimal pure calculation in `domain/nutrition/calculate.ts`: (c4) and (c5), notation handling (unmeasured → `null`, never zero), `includedIn` exclusion, approximation reasons (`cooking_not_tabulated`, `post_cooking_refuse`), fried flag, per-serving division. It takes no locale.
- Hand cross-check: `chicken_lemon_herb_grill` (protein 43.915 g, fat 7.9865 g, 472.689 kcal per serving) and `tuna_tofu_bowl` (35.051 g, 9.735 g, 454.63 kcal) were computed by hand from `data/composition` and match the function to six decimals (`test/node/nutrition.test.ts`).
- Locale invariance: every recipe calculated from content reduced to a single locale's texts gives identical results for `ja`, `en`, and `es`; the function takes two parameters (recipe, data). A snapshot records per-serving values of all 20 recipes.
- *Measured* column comparison over the 20 recipes (per serving):
  - Amino-acid-based protein (`PROTCAA`) is unmeasured for at least one ingredient in 17 of 20 recipes. With a fallback to `PROT-`, it reads 2.2–9.1 g lower than `PROT-` (median 6.1 g).
  - Triacylglycerol-equivalent fat (`FATNLEA`) is incomplete in 18 of 20 recipes; with the same fallback it reads 0.4–3.6 g lower (median 1.4 g).
  - `CHOAVLDF-` minus `CHOCDF-` ranges from −8.7 to +5.5 g (median +0.6 g). `CHOCDF-` is complete for every recipe.
  - Dietary fiber (`FIB-`) is incomplete in 13 of 20 recipes because some ingredients have no fiber value.
  - 4 × protein + 9 × fat + 4 × carbohydrate (`PROT-`, `FAT-`, `CHOCDF-`) exceeds `ENERC_KCAL` by −0.1 % to +10.0 % (median +4.2 %).
- *Measured* cooking oil (rule 4 in `docs/NUTRITION_CALCULATION.md` §5): Table 14 rows with fat gain show 80–98 % of the pan oil retained (median 88 %). Counting all counted oil instead of 88 % raises fat by 0.3–0.9 g per serving across the 14 recipes with counted oil; the counted oil also includes dressings and finishing oil, which are eaten entirely.

### Stage 0.6 coverage and adjustment (2026-10-18)
`npm run eval:coverage` (`tools/evaluate-coverage.ts`) evaluates the 20 validation recipes with the provisional presets and tolerance (`docs/SPEC.md` §16), comparing default amounts with a grid search inside each recipe's authored bounds (smallest relative change among the best status). Seasonings are not linked yet (Phase 1).

| Scenario | Eligible | Met, fixed | Met, adjusted (near) | Distinct main proteins among met | Library size for ≥ 3 met at 90 %* |
|---|---|---|---|---|---|
| S1 cut | 20 | 6 | 10 (0) | 7 | 9 |
| S2 cut, ≤ 20 min | 13 | 6 | 8 (0) | 7 | 12 |
| S3 maintain | 20 | 4 | 11 (2) | 8 | 8 |
| S4 bulk | 20 | 2 | 7 (4) | 5 | 14 |
| S5 cut, no egg | 6 | 3 | 4 (0) | 4 | 25 |
| S6 maintain, chicken required | 6 | 3 | 5 (0) | 2 | 20 |
| S7 maintain, tofu required | 3 | 0 | 1 (0) | 1 | 105 |
| S8 bulk, ≤ 25 min | 15 | 1 | 5 (4) | 5 | 20 |

\* Binomial estimate with the share of the 20 recipes that met the targets after adjustment; it assumes the library keeps the same mix and is only an order of magnitude.

Findings:
- Bounded adjustment raises the number of recipes that meet the targets by 2–7 per scenario; without it, bulking targets are met by 1–2 recipes.
- Most adjustments change only the staple carbohydrate (rice or potatoes); protein amounts change for bulking and for some cutting cases.
- Some adjusted amounts are unnatural, for example rice 150 → 40 g for the steak, because the authored minimum for rice is 0 g. The adjustment needs portion rules (a carbohydrate is either removed or kept at a minimum portion) in addition to bounds.
- Allergen exclusion is the strongest filter: with egg excluded only 6 of 20 recipes remain, mainly because four seasonings have `allergens: "unknown"` (cooking sake, wholegrain mustard, Chinese-style stock granules, karaage coating mix), used by 10 recipes, and are excluded by every allergen filter.
- Required ingredients depend on how many recipes contain the ingredient (tofu appears in 3 of 20), not on the total number of recipes.
- Follow-up (owner-approved): the four seasonings now have best-effort allergen lists based on their typical ingredients (cooking sake and wholegrain mustard: none of the listed allergens; Chinese-style stock granules: may contain wheat, milk, soybean, sesame, chicken, pork, beef; karaage coating mix: contains wheat, may contain milk, soybean, sesame, chicken). These are general assumptions about typical products, not checked against product labels (要確認). With them, S5 (cut, no egg) has 14 eligible recipes, 6 met with default amounts, and 10 met after adjustment.

### Stage 0.7 provisional values (2026-10-18)
- Tolerance sensitivity at default amounts (met / near / not met over 20 recipes): cut 6/2/12 for ±5 %/−2 g, ±10 %/−3 g, and ±15 %/−5 g alike; maintain 4/0/16, 4/2/14, 4/5/11; bulk 2/0/18, 2/1/17, 2/1/17.
- Approximated or fried ingredients contribute more than 10 % of energy, protein, or fat in 15 of 20 recipes (more than 30 % in 13); in recipes whose main protein is approximated, 76–89 % of the protein comes from it. A share threshold would therefore show ranges for most recipes.
- Rounding the displayed values (kcal to 10, grams to integers) before evaluating fit changed the status in 2 of 60 recipe-preset combinations.

### Phase 1 start (2026-10-18)
- Re-check of ADR-016 (npm registry): no `i18next` release after 26.5.2 and no `react-i18next` release after 17.1.0; about 15 hours since the burst, so the pins stay.
- Re-check of ADR-017 (npm registry): `typescript-eslint` 8.71.2 (latest) and 8.71.3-alpha.13 (canary) still declare peer `typescript >=4.8.4 <6.1.0`; TypeScript stays at `~6.0.3`.

### Stage 1.1 content schema (2026-10-18)
- The owner reviewed the schema proposal and decided: sides instead of a "staple" rule (below), quick derived from ≤ 20 minutes, egg counts for the two recipes without an adjustable ingredient, the slow-frying marker on the tortilla's potato and onion, `mainProteinGroup` by the larger protein source (mapo tofu: chicken; champuru: soy), a date-based content version, and the number alone for `piece` in English and Spanish. Details: ADR-026.
- Migration of the 20 validation recipes: default amounts unchanged, so the nutrition snapshot is identical. 13 recipes are now quick (7 newly, all at 20 minutes). Steps that mixed the dish with its sides were split or reworded so that each side's preparation is its own step; serving lines no longer name sides (the UI lists the sides that are on). The tuna and tofu bowl treats its rice as part of the dish (minimum 100 g), unlike the earlier proposal.
- `npm run eval:coverage` with sides (rice and potatoes only switched off by the solver), whole units, and links: the met counts after adjustment equal Stage 0.6 in every scenario (S1 10, S2 8, S3 11, S4 7, S5 10, S6 5, S7 1, S8 5); "near" rises in S3 (2 → 4), S6 (0 → 1), and S7 (0 → 1) because rice can no longer drop below 100 g per serving. No solution switches a side off. The unnatural steak result (rice 150 → 40 g) became beef 200 → 150 g. Distinct main proteins are now counted by group.

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
- Status: **Accepted** (owner accepted the Stage 0.5 recommendation, 2026-10-18)
- Decision: energy `ENERC_KCAL`; protein `PROT-` (たんぱく質); fat `FAT-` (脂質); carbohydrate `CHOCDF-` (炭水化物, includes dietary fiber). Dietary fiber is not displayed in the MVP. The detail view explains that energy is the table value and differs from 4P + 9F + 4C (median +4 %).
- Evidence: verification log "Stage 0.5 calculation checks". The alternative columns are incomplete for most recipes and would show protein several grams lower than common labels; `CHOAVLDF-` adds residual "carbohydrate" to meat, fish, and eggs (Stage 0.2 log).

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
- Re-check at the start of Stage 0.2 (2026-10-18): no further `i18next`/`react-i18next` releases since the burst; less than a day has passed, so the pins stay (ADR-016).
- Verified locally (2026-10-18): lint, type-check, 17 tests, and build pass; the production build served by `vite preview` sends the CSP, logs no console errors, detects the browser language (`es-419` → `es`), switches locale and persists only the locale preference, and has no horizontal overflow at 375 px.

## ADR-019: Dependency-free workbook reader
- Status: **Accepted** (Stage 0.2, 2026-10-18; within the approved Phase 0 scope)
- Decision: `tools/xlsx/` implements just enough ZIP and SpreadsheetML parsing for the MEXT workbook (shared strings without phonetic runs, inline strings, values, sheet lookup by name). Unexpected structures fail with an error rather than being guessed.
- Rationale: one trusted input file read at build time does not justify a spreadsheet library and its supply-chain surface; the code is small and fully tested with synthetic fixtures.
- Alternatives: a spreadsheet package from npm (more features, more dependencies to review); converting the workbook to CSV by hand (not reproducible).
- Revisit if the workbook format changes in ways the reader cannot handle.

## ADR-020: Hand transcription of cooking tables with automated checks
- Status: **Accepted** (owner, 2026-10-18)
- Decision: transcribe only the needed rows of Tables 12–14 from rendered PDF pages into `data/composition/cooking.json`, cite the page of every entry, and verify with (1) a macOS-only text-layer check and (2) composition-based plausibility tests that run everywhere. Details: `docs/DATA_SOURCES.md` "Cooking tables".
- Alternatives: automated PDF table parsing (new dependency, error-prone on this layout); asking MEXT for machine-readable data (possible in parallel, outcome uncertain); ignoring weight change rates (protein 6–13 % too high for cooked meat).
- Limits: the text-layer check cannot detect a wrong number that also appears elsewhere on the page; the plausibility tests cover that for protein and fat but not for every field (for example coating masses).

## ADR-021: Provisional content format
- Status: **Accepted for Phase 0** (owner, 2026-10-18); refined in Phase 1.
- Decision: content is TypeScript (`content/foods.ts`, one file per recipe in `content/recipes/`, `content/glossary.ts`) typed with and validated by the `zod/mini` schemas in `shared/content.ts`. Recipes state raw edible grams (or grams as sold for `as_is` foods) and the composition state used; `cooking` records the real method when the tables lack it; `includedIn` lists ingredients already contained in another ingredient's cooked value (frying oil, coatings, discarded cooking water additions).
- Rationale: compile-time types plus runtime validation without a parser dependency; diffs are reviewable.
- Imports between repository modules use the `.ts` extension everywhere (`allowImportingTsExtensions` in `tsconfig.base.json`), so the same files work in Vite, Vitest, and Node type stripping.
- Alternatives: JSON (no comments, verbose), YAML (parser dependency).

## ADR-022: Count cooking oil fully when no oil-cooked value is used
- Status: **Accepted** (owner accepted the Stage 0.5 recommendation, 2026-10-18)
- Decision: keep `docs/NUTRITION_CALCULATION.md` §5 rule 4: oil that is not already contained in an oil-cooked value is counted in full and shown as an assumption.
- Rationale: using the Table 14 median retention (88 %) would lower fat by only 0.3–0.9 g per serving in the validation recipes; Table 14 has no meat rows; dressings and finishing oil are eaten entirely.

## ADR-023: Initial recipe library size and composition
- Status: **Accepted** (owner accepted the Stage 0.6 recommendation, 2026-10-18)
- Decision: about 60 recipes for the MVP, with composition rules: each goal (cut, maintain, bulk) has at least 15 recipes; each main protein group (chicken, pork, beef, fish, eggs, soy foods) appears in at least 8 recipes; at least 30 % quick (≤ 20 min); fried dishes at most 15 %; every recipe has at least one adjustable main protein or staple.
- Evidence: Stage 0.6 log. About 60 recipes give ≥ 3 met candidates for the general scenarios with a wide margin (estimated need 8–20), and the per-ingredient rule targets the required-ingredient bottleneck.

## ADR-024: Bounded adjustment in the MVP
- Status: **Accepted** (owner accepted the Stage 0.6 recommendation, 2026-10-18)
- Decision: include deterministic "fit to my targets" in the MVP, limited to the authored adjustable ingredients (main protein, and carbohydrates that are part of the dish or a side). Linked ingredients scale with their leader. The selection keeps the best status and the smallest relative change, as in the evaluation tool.
- Revised (owner, 2026-10-18, Stage 1.1): the "staple is either 0 g or at least a minimum portion" rule is replaced by **sides** (ADR-026). Things served with the dish (rice, boiled potatoes, a vegetable side) can be switched on and off; "fit to my targets" may switch off only sides marked for it (carbohydrate sides) and otherwise keeps a side's amount within its authored range, whose minimum is the smallest natural portion (rice: 100 g per serving). Vegetable sides are switched off only by the user. Carbohydrates that belong to the dish (rice in a rice bowl, pasta, toast) are adjustable within bounds but never removed.
- Evidence: Stage 0.6 log (adjustment roughly doubles the met recipes; unnatural results without portion rules).

## ADR-025: Fit tolerance, display rounding, ranges, and presets
- Status: **Accepted** (owner accepted the Stage 0.7 recommendation, 2026-10-18)
- Tolerance: ±10 % of a bound; protein up to 3 g below its minimum.
- Rounding: kcal to the nearest 10; protein, fat, and carbohydrate to whole grams; salt to 0.1 g. Fit status is computed from full-precision values; contradictions caused by rounding are explained in the detail view.
- Ranges: per-ingredient error bands by approximation reason, summed per nutrient; a range is shown when wider than twice the display unit. Bands and their evidence: `docs/NUTRITION_CALCULATION.md` §7 (two bands are measured, three are assumptions).
- Presets (per meal, labelled as examples): cut 450–650 kcal, protein ≥ 35 g, fat ≤ 15 g; maintain 550–750 kcal, ≥ 30 g, ≤ 20 g; bulk 750–950 kcal, ≥ 45 g, ≤ 30 g. With bounded adjustment, 7–11 of the 20 validation recipes meet each preset (Stage 0.6).
- Evidence: Stage 0.3, 0.6, and 0.7 logs.

## ADR-026: MVP content schema
- Status: **Accepted** (owner, 2026-10-18, Stage 1.1)
- Decision (`shared/content.ts`):
  - **Adjustment**: `adjust` is `{ kind: "grams", min, max, step }` or `{ kind: "count", unitGrams, min, max }` for whole units (eggs, cans, slices); only `main_protein` and `main_carb` ingredients have it, and the default amount lies on the grid. `linkedTo` makes an ingredient scale in proportion to an adjustable leader (one level).
  - **Sides**: `sides` lists things served with the dish, each with a localized label, its ingredients, and `solverMayRemove`. Switching a side off sets its ingredients and their linked ingredients to 0 g. Steps that only prepare a side carry `side` and are hidden when it is off. Cooking time and equipment stay those of the full recipe (a cautious limitation).
  - **Hard to estimate**: `estimate: "slow_frying"` marks cooking that no table value represents (slow frying in a lot of oil); the range rules of `docs/NUTRITION_CALCULATION.md` §7 apply. It does not change the point value.
  - **Household measures**: content stores the unit and quantity (a multiple of 1/12); labels come from the UI catalogs. Units: piece, tbsp, tsp, clove, slice, pinch, knob, block, can, stalk. For `piece`, English and Spanish show the number alone.
  - **Steps and safety notes** have stable keys. Steps may carry notes shown from an amount upward (`atLeastGrams`, whole recipe after scaling).
  - **Substitutions** have keys and may replace step texts and safety notes, add safety notes, change minutes, and give their own bounds.
  - **Metadata**: `mainProteinGroup` (chicken, pork, beef, fish, egg, soy) must match the `proteinGroup` of one main-protein food; authored tags are `batch`, `no_cook`, `breakfast`. "Quick" (≤ 20 minutes) and "fried" are derived (`shared/recipe.ts`).
  - **ADR-023 adjustability**: every recipe has an adjustable ingredient or a side the solver may switch off.
  - **Versioning**: `content/version.ts` holds `CONTENT_VERSION` as `YYYY-MM-DD.n`, updated with every content change; bundle compatibility is a separate schema version (Stage 1.4).
- Rationale: portion rules without unnatural amounts (Stage 0.6), traceable estimates for unrepresented cooking, and derived flags that cannot contradict the minutes or states.
- Alternatives: a "staple" with a removable minimum portion (replaced by sides at the owner's request); semver for content (no meaningful major/minor distinction for content).

---

## Open questions (要確認)

1. ~~Carbohydrate column (ADR-011)~~: `CHOCDF-` accepted. Localized display names are set with the UI catalogs (Phase 4).
2. Extraction method for Tables 12–14 from the PDF; use of chapter 3 group-level rates for missing cooked forms.
3. ~~Tolerance, display rounding, and range threshold values~~: ADR-025. Evidence for the assumed error bands is still needed.
4. ~~Initial recipe count and the scope of automatic adjustment~~: accepted in ADR-023 and ADR-024 (Stage 0.6); portion rules and linked seasonings are designed in Phase 1/3.
5. Browser storage of targets and viewed recipes.
6. Whether the 2015 English edition's names and food codes can serve as a reference for English names.
7. Applicability of the Health Promotion Act and the Pharmaceutical and Medical Device Act to this app; applicability of allergen labelling rules (policy already applies the stricter interpretation).
8. Copyright status of recipes under Japanese law (primary sources not checked).
9. Spanish review capacity (ADR-007).
10. Raw-egg dishes and other regionally sensitive food safety rules across the three locales.
11. Allergen item lists in `shared/content.ts` derived from CAA change notes and municipal notices; confirm against the CAA figure (Stage 0.4 log).
12. Best-effort allergen lists for cooking sake, wholegrain mustard, Chinese-style stock granules, and karaage coating mix are based on typical ingredients, not product labels (Stage 0.6 log).
