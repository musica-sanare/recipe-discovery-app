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

### Stage 1.2 content validation (2026-10-18)
- `tools/content/validate.ts` checks 17 rules (schema, locale, unique-id, registry, reference, cooking-state, adjustment, link, side, substitution, allergen, safety-note, protein-group, tag, glossary, forbidden-expression, version). Each problem names the file, the recipe or food, the field, and the rule. `npm run build` runs it first, so `npm run check` does too.
- `tools/content/validate.test.ts` has a valid fixture and one broken copy per case (30 cases, every rule covered); each case must produce exactly one issue of its rule. The per-recipe checks of `test/node/content.test.ts` moved into the tool; that file now only requires the repository content to pass, so the test count fell from 361 to 169 without losing checks.
- New checks beyond Phase 0: grid and whole-unit consistency, links, sides, step references, substitution references, protein groups, `no_cook` consistency, recipe files not registered in the index, duplicate allergens. Safety notes are now required only for meat, fish, eggs, or fried recipes (all 20 recipes have them).
- Verified on 2026-10-18: injecting an off-grid amount and a wrong protein group into a recipe made `npm run build` fail with two messages naming the file, recipe, field, and rule.

### Stage 1.3 composition coverage report (2026-10-18)
- `npm run report:composition` (`tools/content/composition-report.ts`) classifies every recipe ingredient with the calculation's own result: exact, approximation with reasons, hard to estimate (`estimate`), or not counted (`includedIn`), plus a fried flag. A cooked state without a weight change rate fails with the recipe and ingredient named; `npm run build` already rejects it through the `cooking-state` validation rule.
- *Measured* (20 recipes): 144 exact, 13 approximations, 2 hard to estimate, 17 not counted, 5 fried ingredients; 15 recipes have at least one approximated, hard-to-estimate, or fried ingredient (as in Stage 0.7). The approximations are 9 raw values for an untabulated method, 3 grilled values for sautéed meat, and 1 removal after cooking (peeled microwaved potato).
- The calculation reports both raw values and related cooked values as `cooking_not_tabulated`, while `docs/NUTRITION_CALCULATION.md` §7 gives them different error bands (−15 % to +5 % versus ±5 %). Phase 2 needs to distinguish them when it implements ranges.

### Stage 1.4 content bundle (2026-10-18)
- Owner decisions: generation by a script with Vite `?url` hashing (option A), only the displayed nutrient columns in the calculation bundle, and household unit labels moved to Phase 4.
- *Measured* bundle sizes (`npm run content:build`, 20 recipes, 50 foods): calculation 65.6 KiB (gzip 6.6 KiB); text `ja` 27.0 KiB (7.1), `en` 23.0 KiB (6.0), `es` 24.5 KiB (6.7). At about 60 recipes the text bundles would be roughly three times larger (estimate).
- *Measured*: validating in the browser with `zod/mini` raised the app JavaScript from 272.5 kB (gzip 85.9 kB) to 309.9 kB (gzip 97.8 kB).
- Calculating every recipe from the bundle's composition values and rates gives the same totals as the source data for the five displayed nutrients and the same approximation reasons (`tools/content/bundle.test.ts`).
- Verified on 2026-10-18 with `vite preview` (production headers): the page fetched `calc-<hash>.json` and `text-ja-<hash>.json`, showed the content and composition versions in the footer, and switching to Spanish fetched only `text-es-<hash>.json` and showed the date as "27 de marzo de 2026"; no console errors. Screenshots and layout were not checked because the preview pane was hidden.

### Stage 1.5 migration and Phase 1 acceptance (2026-10-18)
- Migration: the 20 validation recipes and the food dictionary were migrated in Stage 1.1 (commit `9ddf73d`). The nutrition snapshot is unchanged since Phase 0 (no differences to explain). `npm run eval:coverage` runs and reproduces the Stage 1.1 results.
- Acceptance checks:
  - Invalid content fails `npm run build` with clear messages: a blank Spanish recipe name gave `content/recipes/tortilla_espanola.ts › tortilla_espanola › texts.name.es: text is blank [locale]`. Every rule has a failing fixture (Stage 1.2).
  - Bundles: two runs of `npm run content:build` produced byte-identical files; the browser validates them before use; sizes are recorded (Stage 1.4); versions are shown in the footer.
  - `npm run check` (lint, type-check, 191 tests, content validation, build) passes.
- Layout check with `vite preview` at 375 × 812 px (Spanish): no horizontal overflow (page width 375 px), and the footer with both versions wraps correctly. The error state was checked in UI tests only, not in a browser.

### Phase 2 start (2026-10-18)
- Re-check of ADR-016 (npm registry, 11:56 UTC): no `i18next` release after 26.5.2 (2026-10-17 21:24 UTC) and no `react-i18next` release after 17.1.0 (2026-10-17 19:01 UTC). Less than 48 hours have passed since the burst, so the pins stay; re-check after 2026-10-19 21:24 UTC.
- Re-check of ADR-017 (npm registry): `typescript` latest is 7.0.2 and the latest 6.x is 6.0.3; `typescript-eslint` 8.71.2 (latest) and 8.71.3-alpha.13 (canary) still declare peer `typescript >=4.8.4 <6.1.0`. TypeScript stays at `~6.0.3`.

### Stage 2.1 engine design (2026-10-18)
- The owner approved the engine design and decisions A–G (ADR-028).
- *Measured* (20 recipes, counted ingredients, displayed nutrients): no `( )` estimated values and no unmeasured values; non-measured notations are `0` (181 values), `Tr` (7, all fat), and `(0)` (10). Approximation triggers: 9 raw values for an untabulated method, 3 related cooked values (grilled for sautéed), 1 removal after cooking, 2 slow-frying ingredients. 9 ingredients use the "pinch" measure (pepper 0.2–0.3 g, salt 0.5 g). The library has 1 substitution.
- Expected snapshot impact (to be confirmed in Stage 2.5): default-state point values of the displayed nutrients are unchanged; the non-displayed columns (`PROTCAA`, `FATNLEA`, `CHOAVLDF-`, `FIB-`) leave the snapshot because the engine reads the calculation bundle; ranges, classes, and incompleteness are added. Ingredients with a tabulated fried form move from exact to approximation (decision G).

### Stage 2.2 amount resolution (2026-10-18)
- `domain/nutrition/amounts.ts`: `resolveAmounts(recipe, state)` applies substitutions, chosen amounts, links, sides switched off, and servings scaling (ADR-028). Invalid states return all errors as typed values in a stable order (`invalid_servings`, `unknown_side`, `unknown_substitution`, `conflicting_substitutions`, `unknown_ingredient`, `not_adjustable`, `invalid_number`, `out_of_bounds`, `off_grid`, `not_whole_units`).
- The recipe parameter is a structural subset that both content recipes and calculation-bundle recipes satisfy.
- A linked ingredient outside a side follows its leader to 0 g when the leader's side is off, and is marked `switchedOff`.
- Tests (`domain/nutrition/amounts.test.ts`, 21 cases): every rule, invalid states, determinism across reordered input, and all 20 repository recipes at default state resolve to their authored grams. The Phase 0 calculation and `tools/evaluate-coverage.ts` are unchanged until Stage 2.6.

### Stage 2.3 calculation and uncertainty (2026-10-18)
- `domain/nutrition/data.ts` (`engineDataFromBundle`) and `domain/nutrition/engine.ts` (`calculateNutrition`): (c4), (c5), notations, `includedIn`, sides switched off, the reasons, classes, and bands of ADR-028, per-serving ranges with the display thresholds, and incompleteness. A fried ingredient whose fat is unmeasured has no energy or fat range.
- Tests: `domain/nutrition/engine.test.ts` (21 cases on hand-made composition data: every formula, reason, band, combination, threshold boundary, and unmeasured case) and `test/node/engine.test.ts` (repository content through the in-memory calculation bundle).
- *Measured* (20 recipes, default state, calculation bundle): per-serving values of the five displayed nutrients equal the Phase 0 calculation to nine decimals. Counted reasons: 9 `raw_value_for_cooking`, 3 `related_cooked_value`, 1 `post_cooking_refuse`, 3 `fried`, 2 `slow_frying`, 0 `estimated_source_value`. Recipe classes: 5 exact, 14 approximation, 1 hard to estimate. Ranges shown: energy in 11 recipes, protein in 9, fat in 6, carbohydrate in 1, salt in none. The widest are the fried dishes (tonkatsu 835–1,034 kcal and 27.4–49.4 g fat per serving; karaage 654–755 kcal; salmon tempura 546–662 kcal).

### Stage 2.4 display rounding and basis (2026-10-18)
- `domain/nutrition/rounding.ts`: `roundForDisplay(nutrient, value)` rounds half up to the ADR-025 unit (10 kcal; 1 g; 0.1 g salt) after reducing the quotient to 12 significant digits, so binary noise cannot cross a half step (1.15 g → 1.2 g). Unknown stays `null`; no locale formatting.
- `domain/nutrition/basis.ts`: `nutritionBasis(recipe, nutrition, data)` lists per ingredient the food ID, code, state, cooking method, substitution, composition data version, weight change rate, grams, class, reasons, notations, and assumption codes: `oil_counted_in_full` (counted ingredients with role `fat`, ADR-022), `included_in_cooked_value`, `parts_removed_after_cooking`, `energy_from_fat` (9 kcal/g), and `pinch_as_stated_grams`. Texts for these codes belong to the UI catalogs (Phase 4).
- *Measured* (20 recipes, default state): 17 oils counted in full (all `fat` ingredients are olive, sesame, or vegetable oil), 17 ingredients contained in another cooked value, 1 removal after cooking, 5 fried or slow-fried ingredients with the energy factor, 9 pinches.

### Stage 2.5 snapshot, locale invariance, determinism, performance (2026-10-18)
- New snapshot (`test/node/__snapshots__/engine.test.ts.snap`): per recipe at the default state, the class, per-serving values and ranges of the five displayed nutrients (two decimals; "shown" marks ranges above the threshold), the reasons of counted ingredients, and incompleteness.
- Difference from the Phase 0 snapshot (`nutrition.test.ts.snap`), explained to the owner per recipe and nutrient: the per-serving values of `ENERC_KCAL`, `PROT-`, `FAT-`, `CHOCDF-`, and `NACL_EQ` are identical for all 20 recipes (0 of 100 values differ). The columns `PROTCAA`, `FATNLEA`, `CHOAVLDF-`, and `FIB-` are not in the new snapshot because the engine reads only the displayed nutrients of the calculation bundle (ADR-011, ADR-027); the Phase 0 snapshot keeps them until Stage 2.6. Classes, reasons, ranges, and incompleteness are new (Stage 2.3 log).
- Locale invariance: `calculateNutrition` takes `(recipe, state, data)` (type-level test); every recipe gives identical results with each text bundle loaded, and content reduced to any single locale's texts builds a byte-identical calculation bundle.
- Determinism: deep-equal results across runs and with foods, composition values, and rates in reverse bundle order; reversing the ingredient order changes neither per-serving values nor ranges (to nine decimals) nor classes.
- *Measured* recalculation time (Apple M1, MacBookPro17,1, 16 GB, macOS, Node.js 24.19.0; median of 31 batches after warm-up; scratch script, not in the repository): one recalculation of the largest recipe (`chicken_mapo_tofu`, 13 ingredients) 0.017–0.019 ms; all 20 recipes at the default state 0.27–0.28 ms; first cold pass over all 20 recipes 2.1 ms; `engineDataFromBundle` 0.10 ms cold. Browsers were not measured.

### Stage 2.6 migration of consumers (2026-10-18)
- The owner approved the Stage 2.5 snapshot differences (2026-10-18).
- `tools/content/repository.ts` loads the content and tracked composition data (`repositoryBundleInput`) and builds the engine input from the in-memory calculation bundle (`repositoryEngine`). `tools/build-content.ts` uses the same loader; its four bundles are byte-identical to the previous output.
- `npm run eval:coverage` now evaluates every candidate with `calculateNutrition` (states with grams or whole counts, sides switched off) instead of per-gram contributions and its own amount resolution. Its output is identical to the previous run, character for character.
- `npm run report:composition` now classifies with the engine. Differences from the Stage 1.3 output: `cooking_not_tabulated` became `raw_value_for_cooking` (9 ingredients) or `related_cooked_value` (3); the tabulated fried ingredients (karaage, tonkatsu, salmon tempura) moved from exact to approximation with reason `fried` (ADR-028 G). Totals: exact 141 (was 144), approximation 16 (13), hard to estimate 2, not counted 17, fried 5.
- Engine errors name the ingredient (`ingredients.<key>: …`); the report adds the recipe.
- Removed: `domain/nutrition/calculate.ts` (Phase 0 calculation), `test/node/nutrition.test.ts` and its snapshot, and `test/node/nutritionData.ts`. The hand cross-checks and counting tests moved to `test/node/engine.test.ts`; formula, notation, and unmeasured-value tests live in `domain/nutrition/engine.test.ts`; locale invariance and the snapshot moved in Stage 2.5. The bundle test now checks that the bundle carries the source values, refuse rates, and weight change rates unchanged and covers every food state the recipes use, instead of comparing two Phase 0 calculations. The non-displayed columns (`PROTCAA`, `FATNLEA`, `CHOAVLDF-`, `FIB-`) stay in `data/composition/` but are no longer calculated per recipe.

### Phase 2 acceptance (2026-10-18)
- Amount resolution, formula, notation, uncertainty, range, rounding, locale invariance, and determinism tests pass (`domain/nutrition/*.test.ts`, `test/node/engine.test.ts`).
- The snapshot of all 20 recipes was reviewed and approved by the owner; every difference from Phase 0 is explained in the Stage 2.5 log (no point value changed).
- Recalculation time is measured and recorded (Stage 2.5).
- `npm run check` (lint, type-check, 250 tests, content validation, build) passes; `npm run eval:coverage` and `npm run report:composition` run, with their output changes explained in the Stage 2.6 log.

### Phase 3 start (2026-10-18)
- Re-check of ADR-016 (npm registry, 12:54 UTC): no `i18next` release after 26.5.2 (2026-10-17 21:24 UTC) and no `react-i18next` release after 17.1.0 (2026-10-17 19:01 UTC). The agreed re-check time (2026-10-19 21:24 UTC) has not passed, so the pins stay; re-check at the first stage that starts after it.
- Re-check of ADR-017 (npm registry): `typescript` latest is 7.0.2 (`next` is 7.1.0-dev) and the latest 6.x is 6.0.3; `typescript-eslint` 8.71.2 (latest) and 8.71.3-alpha.13 (canary) still declare peer `typescript >=4.8.4 <6.1.0`. TypeScript stays at `~6.0.3`.

### Stage 3.1 recommendation design (2026-10-18)
- The owner approved the design and decisions D1–D10 as recommended (ADR-029).
- *Measured* (20 recipes, scratch scripts, not in the repository): the solver search space of `tools/evaluate-coverage.ts` (grid × subsets of solver-removable sides) has 11,793 states in total, at most 5,376 for one recipe (`beef_steak_potatoes`); evaluating all of them with `calculateNutrition` takes 164 ms per pass (Apple M1, Node.js 24.19.0).
- *Measured*: for fixed sides and substitutions, per-serving values and range bounds of energy, protein, fat, and carbohydrate are linear in each adjustable amount; a model from one engine call per adjustable ingredient reproduces all 11,793 states with a maximum absolute error of 5.7e-13.
- *Measured* effect of evaluating shown ranges (ADR-029 D1) instead of point values, with bounded adjustment (met / near): S1 cut 10/0 → 9/1; S3 maintain 11/4 → 11/5; S4 bulk 7/4 → 7/6; S2 8/0 unchanged; S8 5/4 → 5/5. Fried recipes with ranges (point values in parentheses): karaage cut near (met), maintain and bulk met; tonkatsu cut not met, maintain and bulk near (not met); salmon tempura cut not met, maintain near (near), bulk near (not met); tortilla not met for every preset.
- Derived cooking-method families of the 20 recipes (ADR-029 D5): grill 2, simmer 3, steam 1, stir_fry 4, pan 5, fry 4, no_cook 1.

### Stage 3.2 input validation, contradictions, hard filters (2026-10-18)
- `domain/recommendation/types.ts` (request, session, errors, contradictions, constraint items), `data.ts` (`recommendationDataFromBundle`, recipes in ID order), `validate.ts` (`presetTargets`, `validatePoolRequest`, `validateSession`, `checkContradictions`), and `filters.ts` (`checkRecipe`, `applyHardFilters`). `shared/content.ts` now exports the `Cuisine`, `Equipment`, and `AllergenLink` types.
- Details settled within ADR-029: an empty required item is the input error `empty_required_item`; `required_and_excluded` names the item index and its foods (raised only when every food of the item is excluded); valid input is returned with sorted, de-duplicated lists, while `previous` and `keep` keep their order. Exclusion counts list every active item, including items that exclude nothing; equipment items appear only when they exclude a recipe, because the condition is the available equipment. A food missing from the dictionary counts as "may contain" for every allergen. Allergens are checked on every authored ingredient (sides on or off) and on foods brought in by a forced substitution. A required food that a forced side switch-off removes no longer counts.
- Tests: `domain/recommendation/validate.test.ts` and `filters.test.ts` (32 cases on hand-made data: limits, inverted bounds, unknown foods and recipes, seeds, normalization, contradiction thresholds on both sides, time and equipment boundaries, allergens with `contains`, `may_contain`, and unknown data, rescue of excluded foods by sides, leaders' sides, and substitutions with minutes, required foods, counts) and `test/node/recommendation.test.ts` (8 cases on the 20 recipes).
- *Measured* (20 recipes): the eligible counts equal the Stage 0.6 scenarios (≤ 20 min 13; egg excluded 14; any chicken required 6; any tofu required 3; ≤ 25 min 15). Excluding cooked rice switches off the rice side of 14 recipes and excludes 2 whose rice belongs to the dish. Requiring tofu and salmon together leaves no recipe. No food in the dictionary has unknown allergen information, so the unknown case is covered by the unit tests only.

### Stage 3.3 fit evaluation (2026-10-19)
- `domain/recommendation/fit.ts`: `evaluateFit(nutrition, targets)` gives per-nutrient status (`met`, `near`, `not_met`, `unknown`), basis (point or shown range), position (inside, below the minimum, above the maximum, straddling one or both bounds), the point value, the gap from the point value, and the gap divided by the tolerance width; and the overall tier with near and not-met counts and the gap score (ADR-029 D1–D3). `compareFits` orders fits by D3. The tolerance constants live in `validate.ts`.
- Details settled within ADR-029: a range covering both bounds is `straddles_both`; a positive gap on a zero-width tolerance (for example a fat maximum of 0 g) has the ratio Infinity; tolerance limits are computed as bound × (1 ± 10 %) in floating point, without an epsilon.
- Tests: `domain/recommendation/fit.test.ts` (20 cases: exactly on a bound, inside and on the limit of the tolerance, outside, the protein shortfall, open sides, full precision versus rounded display (34.6 g shown as 35 g is near), ranges not shown, ranges inside, touching, straddling, partly in the tolerance zone, beyond it, a fried fat range, unknown values, the order of targets, tiers, gap scores, and `compareFits`) and two repository tests with a snapshot of every recipe and preset at default amounts (`test/node/__snapshots__/recommendation.test.ts.snap`).
- *Measured* (20 recipes, default amounts, met / near / not met): with ranges ignored the counts equal Stage 0.7 at ±10 % (cut 6/2/12, maintain 4/2/14, bulk 2/1/17). With shown ranges: cut 6/3/11, maintain 3/4/13, bulk 0/4/16. Differences: cut — karaage not met → near (energy and fat ranges reach the tolerance zone); maintain — karaage met → near (energy and fat ranges straddle the maximum), salmon tempura not met → near; bulk — tonkatsu not met → near, beef steak with potatoes met → near (energy range straddles 750 kcal), beef and shimeji bowl met → near (protein range straddles 45 g). Bounded adjustment (Stage 3.4) moves some of these back to met (Stage 3.1 log).

### Stage 3.4 bounded adjustment solver (2026-10-19)
- `domain/recommendation/solver.ts`: `solve(input, data)` (ADR-029 D4: linear model per side combination, engine recalculation of the chosen state, exhaustive fallback when the engine's fit differs) and `solveExhaustive` (reference and fallback). Input: recipe, targets, servings, the state forced by excluded foods, and locked sides (sides holding a required food). Output: recipe state, engine result, fit, fit of the forced default state, relative change, amount changes in state units (grams or whole units), sides the solver switched off, and the method used.
- Engine change (exports only, no behavior change; the nutrition snapshot is unchanged): `RANGE_EPSILON` (`domain/nutrition/engine.ts`) and `substitutedAdjust` (`domain/nutrition/amounts.ts`) are exported, so the linear model decides "shown" exactly as the engine does and uses the bounds of forced substitutions.
- Details settled within ADR-029: grid values are min + i × step; a default amount that is off the grid (possible with a substitution's own bounds) is added as a candidate; relative change is measured against the forced default state, a side switched off by the solver adds 1 per ingredient, and ingredients already at 0 g are ignored; cost ties use a margin of 1e-9; the solver searches at the requested servings (per-serving values do not depend on them, ADR-028 F).
- Tests: `domain/recommendation/solver.test.ts` (12 cases on hand-made data: default kept, smallest relative change, linked ingredients, solver-removed side, locked and forced sides, closest near state with its gap, whole units, ties, a fried range moved inside, forced substitution bounds, servings, determinism and equality with the exhaustive search) and repository tests: linear equals exhaustive for all 20 recipes × 3 presets, also with cooked rice excluded (no fallback); met and near counts per scenario; a snapshot of the chosen adjustments.
- *Measured* (Apple M1, Node.js 24.19.0, median of 7 runs, scratch script): one preset over the 20 recipes takes 6.7 ms with `solve` and 72 ms with `solveExhaustive`.
- Comparison with `npm run eval:coverage` (point values; met / near after adjustment → solver with ranges): S1 cut 10/0 → 9/1; S2 8/0 → 8/0; S3 maintain 11/4 → 11/5; S4 bulk 7/4 → 7/6; S5 cut without egg 10/0 → 9/1; S6 chicken required 5/1 → 5/1; S7 tofu required 1/1 → 1/1; S8 bulk ≤ 25 min 5/4 → 5/5. Every difference comes from evaluating shown ranges:
  - Karaage for cut (S1, S5): met → near; its fat range straddles 15 g at every in-bounds amount (closest: chicken 200 → 150 g).
  - The added near results are recipes whose point values reach near but not met, or whose ranges straddle a bound at every amount.
  - Recipes met in both with different amounts: the evaluation tool's state has a smaller (or equal, with a smaller amount vector) relative change but a shown range straddling a bound, so the solver takes the next state whose ranges are inside: boiled chicken for cut (rice 450 → 480 g became chicken 450 → 480 g and rice 450 → 510 g; protein range) and maintain (rice 690 → 720 g); pork mustard sauté for maintain (pork 160 → 200 g became pork 170 g and rice 180 g); karaage for maintain (default became chicken 200 → 150 g; energy and fat ranges); for bulk, chicken and broccoli stir-fry (chicken 170 g added), teriyaki (200 g / 280 g became 210 g / 270 g), karaage (230 g became 240 g with rice 200 g), pork ginger (210 g became 200 g with rice 220 g), beef steak with potatoes (default became beef 210 g; energy range straddles 750 kcal), and beef and shimeji bowl (default became beef 200 g; protein range straddles 45 g).

### Stage 3.5 ranking, diversification, re-suggestion (2026-10-19)
- `shared/recipe.ts`: `methodFamily(recipe, proteinGroupOf)` and `METHOD_FAMILIES` (ADR-029 D5). `domain/recommendation/select.ts`: `fnv1a`, `mix32` (MurmurHash3 finalizer), `seededKey`, `preferenceScore`, `diversityGain`, `selectDiverse`. `domain/recommendation/recommend.ts`: `evaluatePool` (validation, contradictions, hard filters, solver per eligible recipe, attributes, preference) and `selectCandidates` (session, seed, kept cards, exhaustion).
- Details settled within ADR-029: `rice_cook` belongs to the `simmer` family; the main protein is the first `main_protein` ingredient whose food is in the recipe's group. The seeded key is `mix32(mix32(seed) XOR fnv1a(recipeId))`. Locked sides are those holding any food of any required item. Session exclusions are applied by `selectCandidates`: tier counts leave them out, and the exclusion item counts every excluded recipe (`onlyThis`: those that passed the hard filters). Kept cards stay first while they still meet the targets; the free slots (5 minus kept) are filled from unshown met recipes; the set is exhausted when fewer than min(3, free slots) unshown met recipes remain and shown ones outside the previous set exist; then unshown recipes come first and shown ones fill the rest.
- Tests: `domain/recommendation/select.test.ts` (11 cases: FNV-1a reference values, the mix, seeded keys, preferences, diversity gain, greedy order with taken attributes, preference and change tie-breaks, seeded ties, pool-order independence, small pools) and 10 repository tests (method families equal the Stage 3.1 log; five distinct met candidates with five methods for cut; same input and seed give equal results; 30 seeds give several reproducible sets; no repeats until exhausted; "exclude this one" keeps the other cards; a cuisine preference; a blocking contradiction; invalid sessions; required rice keeps its side on).
- *Measured* (20 recipes, cut, seeds 0, 1, 2): the first set has 5 recipes with 5 methods and 3 protein groups; "show a different type" gives the other 4 met recipes; the next request is exhausted and returns the first set again. 30 seeds give 4 distinct first sets.

### Stage 3.6 few or no candidates, relaxation, reason data (2026-10-19)
- `domain/recommendation/pool.ts` now holds `evaluatePool` and the pool entry (moved from `recommend.ts`, which re-exports it), with solutions memoized per recipe, forced state, and locked sides. `relax.ts`: `suggestRelaxations` and `countFor`. `reasons.ts`: `reasonsFor`. `selectCandidates` returns close alternatives, relaxations, and reason data for every displayed recipe.
- Details settled within ADR-029:
  - Close alternatives fill the set up to 3 recipes when fewer than 3 meet the targets: near recipes before not-met ones (`compareFits`), then the smaller relative change, the seeded order, and the ID; unshown recipes come before shown ones. Not-met recipes are included so that the user sees the gaps; an empty pool gives none.
  - Relaxations are computed when fewer than 3 eligible recipes (without the user's exclusions) meet the targets. The time option is the smallest recipe time above the limit that adds a met recipe, otherwise the smallest that adds a near one. Equipment options add one missing piece of equipment. Gains are differences in met and near counts from the same filters and solver; options without a gain are omitted.
  - Reason codes: `meets_all_targets`, `meets_with_adjustment`, `near_target` and `misses_target` (with the gap from the point value), `unknown_value`, `range_straddles`, `highest_among_candidates` (protein, when a protein minimum is set) and `lowest_among_candidates` (fat, when a fat maximum is set) only for a unique extreme among at least two candidates, `new_attribute` (only after a previous set), `matches_cuisine`, `within_effort`, `quick`, `uses_required_foods`. ADR-029 also listed lowest energy and carbohydrate; they are left out because energy and carbohydrate targets are ranges, where "lowest" is not a merit.
- Tests: 7 repository tests (alternatives in fit order; none when three meet; an empty pool with exclusion counts and two relaxations whose gains equal separate runs; the time option at 20 minutes with exact gains; every gain of a mixed case recomputed by separate runs, with user exclusions kept and no allergen option; reason codes for candidates and for a second set; gaps and straddling ranges for alternatives).
- *Measured* (20 recipes): maintain with tofu required gives 1 candidate (tuna and tofu bowl), alternatives mapo tofu (near) and champuru (not met), and the relaxation "remove the tofu requirement: +10 met, +4 near". Bulk at ≤ 15 minutes gives 2 candidates and "allow 20 minutes: +3 met, +3 near". With only a microwave available, egg excluded, and rice excluded for cut, no single extra piece of equipment adds a recipe, because the recipes that would fit need both a stove and a pan; only "allow rice: +1 met" is offered.
- 要確認 (open question 20, below): one-constraint relaxation cannot suggest combinations such as "stove and frying pan"; whether the UI needs combined equipment options is decided with the conditions screen in Phase 4.

### Stage 3.7 integration, locale invariance, performance (2026-10-19)
- `test/node/recommendation-scenarios.test.ts`: the eight Stage 0.6 scenarios and the four personas of `docs/SPEC.md` §2 (P1 500–650 kcal, protein ≥ 35 g, fat ≤ 15 g, ≤ 20 min; P2 bulk preset with effort 1 preferred; P3 maintain preset with 4 servings; P4 450–550 kcal, protein ≥ 35 g, fat ≤ 10 g), each with the first set (tiers, candidates with statuses, adjustments, and reason codes, alternatives, relaxations, exclusions) and the next "show a different type" set, in a snapshot for owner review; P3 gives the same candidates, amounts, and per-serving values as one serving.
- Locale invariance: `evaluatePool`, `selectCandidates`, `validatePoolRequest`, `solve`, and `reasonsFor` take no locale (type-level tests), and the twelve scenarios give deep-equal pools, first sets, and next sets with each text bundle loaded and with content reduced to any single locale's texts.
- `npm run eval:coverage` now runs the recommendation engine (`evaluatePool`) instead of its own fit and grid search. Output changes, all from evaluating shown ranges (Stage 3.3 and 3.4 logs): met with default amounts S3 4 → 3 (karaage), S4 2 → 0 (beef steak with potatoes, beef and shimeji bowl), S6 3 → 2 (karaage), S8 1 → 0 (beef and shimeji bowl); met after adjustment S1 10 → 9 and S5 10 → 9 (karaage); near after adjustment S1 0 → 1, S3 4 → 5, S4 4 → 6, S5 0 → 1, S8 4 → 5; the adjusted amounts of the recipes listed in the Stage 3.4 log.
- *Measured* (Apple M1, MacBookPro17,1, Node.js 24.19.0, median of 15 runs after warm-up; scratch script, not in the repository; the synthetic library is three copies of the 20 recipes with new IDs and is never shipped). Full recommendation (`evaluatePool` and `selectCandidates`): 20 recipes 6.8–8.0 ms for cut and bulk, 3.8–6.5 ms with relaxation (tofu required; bulk at ≤ 15 minutes); 60 recipes 18.7–19.1 ms for cut and bulk, 3.5–3.8 ms for the filtered requests. "Show a different type" (`selectCandidates` on the same pool): 0.01–0.12 ms. The first call including `recommendationDataFromBundle` takes 6.7 ms. Browsers and phones were not measured (open question 17).
- Observation for owner review: with P4 only 5 recipes meet the targets and all appear in the first set, so "show a different type" returns no candidate; the close alternatives (2 near recipes, then not met) fill the set.

### Phase 3 acceptance (2026-10-19)
- The owner reviewed and approved the scenario snapshot of Stage 3.7 (2026-10-19), including the P4 behavior, the fit snapshot (Stage 3.3), and the adjustment snapshot (Stage 3.4); differences from Stage 0.6 and Stage 1.1 are explained in the Stage 3.3, 3.4, and 3.7 logs.
- Determinism and edge cases pass: empty pools, fewer than three candidates, ties (solver, diversification, seeded order), contradictions, required ingredients that leave no recipe, and allergens with unknown data (unit tests, because no dictionary food has unknown data).
- Fit evaluation, solver, diversification, re-suggestion, relaxation, and locale invariance tests pass (`domain/recommendation/*.test.ts`, `test/node/recommendation.test.ts`, `test/node/recommendation-scenarios.test.ts`).
- Performance is measured and recorded (Stage 3.4 and 3.7 logs).
- Substitutions: the solver never chooses them (ADR-029 D4); excluded foods may force one (D7). Offering the authored substitutions to the user belongs to the detail view in Phase 4, which recalculates them with the nutrition engine.
- `npm run check` (lint, type-check, 359 tests, content validation, build) passes; `npm run eval:coverage` runs on the recommendation engine with its output changes explained in the Stage 3.7 log.

### Phase 4 start (2026-10-19)
- Re-check of ADR-016 (npm registry, 02:50 UTC): no `i18next` release after 26.5.2 (2026-10-17 21:24 UTC) and no `react-i18next` release after 17.1.0 (2026-10-17 19:01 UTC). The agreed re-check time (2026-10-19 21:24 UTC) has not passed, so the pins stay; re-check at the first stage that starts after it, and propose any upgrade as its own commit.
- Re-check of ADR-017 (npm registry): `typescript` latest is 7.0.2 (`next` is 7.1.0-dev.20261018.1) and the latest 6.x is 6.0.3; `typescript-eslint` 8.71.2 (latest) and 8.71.3-alpha.14 (canary) still declare peer `typescript >=4.8.4 <6.1.0`. TypeScript stays at `~6.0.3`.
- The owner decided that the English and Spanish texts of Phase 1 (open question 13) are reviewed together with the UI once the prototype is largely complete, and that Phase 4 proceeds without waiting for that review.

### Stage 4.1 UI design (2026-10-19)
- The owner approved the UI design and decisions D1–D13 as recommended (ADR-030, `docs/UI_DESIGN.md`).
- *Verified* (npm registry, 2026-10-19): `tailwindcss` 4.3.3 and `@tailwindcss/vite` 4.3.3 (both released 2026-07-16, no later release); `@tailwindcss/vite` declares peer `vite ^5.2.0 || ^6 || ^7 || ^8` and depends on `@tailwindcss/node` and `@tailwindcss/oxide` 4.3.3; `@tailwindcss/node` pins `lightningcss` 1.32.0 (Vite 8.3.4 uses 1.33.0, so both are installed). `axe-core` 4.14.0 (released 2026-10-05; previous 4.13.0 on 2026-08-05), no dependencies, license MPL-2.0 (development only, not shipped). No release burst for any of them.
- *Measured* (trial install in a scratch directory with `strict-allow-scripts=true`, npm 11.17.0, macOS arm64, 2026-10-19): the only install script among these packages and their dependencies is `fsevents@2.3.3`, already denied (ADR-018). Native code comes from platform-specific optional dependencies with prebuilt binaries: `@tailwindcss/oxide-darwin-arm64` (2.8 MB) and `lightningcss-darwin-arm64` (8.1 MB for 1.32.0). Installed sizes: `axe-core` 3.3 MB, `tailwindcss` 0.9 MB, `@tailwindcss/node` 0.2 MB. `npm audit`: 0 vulnerabilities. Tailwind runs at build time only; the browser receives one generated CSS file served from `'self'`.
- Repository facts used by the design: 9 foods have an empty alias list in at least one locale (open question 14); no search normalization exists yet in `src/` or `shared/`; recipe equipment combinations are mostly a stove with a frying pan (7) or with a frying pan and a pot (4), and one recipe needs a microwave only.

### Stage 4.2 foundation (2026-10-19)
- Added `tailwindcss` 4.3.3, `@tailwindcss/vite` 4.3.3, and `axe-core` 4.14.0 as development dependencies (Stage 4.1 log). `npm install` under `strict-allow-scripts` reported no new install script; `npm audit`: 0 vulnerabilities.
- *Measured* (`vite build`): app JavaScript 309.9 kB (gzip 97.8 kB) → 346.7 kB (gzip 108.8 kB), now including the nutrition and recommendation engines; CSS 1.5 kB (gzip 0.7 kB) → 12.2 kB (gzip 3.4 kB) with the Tailwind base styles.
- Layout shell, navigation (`src/navigation/`, ADR-030 D2), and state (`src/state/`: `reducer.ts`, `recommendation.ts` for the engine calls, `context.ts`, `providers.tsx`). Details settled within ADR-030:
  - "Exclude this one" keeps the seed; only "show a different type" increases it (D13). Both add the set on screen to `shown` and `previous`.
  - A re-suggestion without any recipe that meets the targets keeps the set and sets the notice `all_shown`; an exhausted result that still has candidates replaces the set and shows the same notice (D5). Comparison selections not on screen are dropped.
  - After a reload, candidates and comparison redirect to the targets view (`history.replaceState`) and the notice stays until the user leaves the targets view.
  - The initial view after a page load does not take focus; every later view focuses its `h1` and sets the document title.
- Color tokens in `src/styles.css` (`@theme`, default palette removed; light and dark); `test/node/styles.test.ts` checks 18 foreground and background pairs per scheme against WCAG 2.2 AA.
- Formatting (`src/format/format.ts`): values from `roundForDisplay`, separators and range formats from `Intl` (`ja` 500～540, `en` 500–540, `es` 500-540; Spanish decimal comma). A non-zero gap that rounds to zero is shown up to one decimal finer; differences are those of displayed values (ADR-030 D8); household quantities are reduced twelfths with a localized mixed-number template, singular up to one unit.
- Catalogs: entries for every engine code in `ja`, `en`, and `es` (`src/i18n/engineCodes.ts` lists the codes with a compile-time exhaustiveness check, verified by removing a code; `src/i18n/engineCodes.test.ts` requires the entries). Plural keys `_one` and `_other` exist in every locale. The forbidden-expression matcher moved to `shared/policy.ts` and also checks the UI catalogs (`src/i18n/policy.test.ts`); content validation output is unchanged.
- Accessibility: `src/testing/axe.ts` runs axe-core in jsdom without the contrast rule; the targets view, the reload notice, the not-found detail, and the content error state have no violations in `ja`, `en`, and `es`; a sanity test confirms that axe reports real violations in jsdom.
- Browser check (`npm run preview` with production headers, built-in browser, 2026-10-19): deep link `/recipes/<id>`, link navigation with focus on the `h1`, the back button, and the reload fallback with its notice work; desktop (dark) and 375 px (light) widths in `ja`, `en`, and `es` have no horizontal overflow; the language select was given a visible border after the check; no console messages; every request goes to the same origin. Not checked: a real phone, screen readers, and forced-colors mode.

### Stage 4.3 start (2026-10-19, 23:49 UTC)
- Re-check of ADR-016 (npm registry): `i18next` 26.5.3 was published on 2026-10-19 17:24 UTC, the fourth release since 26.5.0 (2026-10-17 18:59 UTC) within about 46 hours, so the burst continues and the pins stay. `react-i18next` has no release after 17.1.0 (2026-10-17 19:01 UTC). Re-check after 2026-10-21 17:24 UTC (48 hours after 26.5.3) and move both packages together if no further release follows.
- Re-check of ADR-017: `typescript-eslint` 8.72.0 (latest, 2026-10-19 17:08 UTC, weekly cadence) and 8.72.1-alpha.1 (canary) still declare peer `typescript >=4.8.4 <6.1.0`; TypeScript stays at `~6.0.3`. The lockfile has 8.71.2; moving to 8.72.0 is a separate dependency commit.

### Stage 4.3 targets and conditions (2026-10-20)
- `src/views/TargetsView.tsx` with `src/views/targets/` (`draft.ts`: form text to engine request; `errors.ts`: placement and wording of engine input errors and contradictions; `foodSearch.ts`: options and normalized search), `src/components/NumberField.tsx` (text input with labelled steppers), and `src/components/FoodPicker.tsx` (ARIA 1.2 combobox with list autocomplete and automatic selection of the first option). The form draft lives in the reducer, so it survives view changes but not reloads.
- Details settled within ADR-030:
  - Numbers are typed as text; full-width digits and a decimal comma are accepted. Empty optional targets are not set; an invalid number reaches the engine as NaN so that `validatePoolRequest` reports `invalid_number`. A carbohydrate range with one side empty uses the input limit (0 or 400 g) for that side.
  - Steppers move by 10 kcal, 1 g (protein, fat), 5 g (carbohydrate), 5 minutes, and 1 serving, clamped to `INPUT_LIMITS`.
  - The preset stays selected until a target differs from it; then the form shows the preset name with "(edited)".
  - Contradictions are checked live with `checkContradictions` once the targets are numbers; the search runs only through `evaluatePool`, and a blocking contradiction shows an alert that receives focus. Input errors appear at their fields and in a focused summary with links; the advanced section opens when an error is inside it.
  - Units are part of the visible label ("Protein minimum (g)"), so the accessible name includes them.
  - Protein groups with more than one food are offered as "(any cut or kind)" options; groups are listed first.
- Tests: `draft.test.ts`, `foodSearch.test.ts`, `errors.test.ts` (every input error and both contradiction severities have a complete message in each locale), and `TargetsView.test.tsx` (presets, steppers, values reaching the engine unchanged, the kept draft, error summary and focus, inverted range, warning and blocking contradictions, keyboard autocomplete, "not supported", accent folding, group items, axe in `ja`, `en`, and `es`). The UI test fixtures now contain four foods.
- Browser check (`npm run preview`, built-in browser, 2026-10-20): the form at 375 px in `ja` and `es` (advanced section open, no element wider than the viewport) and at desktop width in dark mode; keyboard selection of an ingredient, a search that opens the candidates view with focus on its heading and no targets in the URL, back navigation with the draft kept, Spanish accent folding ("papá" finds "Patata"), and chosen ingredients relabelled after a language switch; no console messages. Found: Japanese searches by reading fail when the dictionary has no kana alias ("とうふ" and "トーフ" do not find tofu; "豆腐" does) — open question 21. The advanced section closes after a language switch (the view remounts while the text bundle loads); the draft is kept.

### Dependency update: typescript-eslint 8.72.0 (2026-10-20)
- `typescript-eslint` 8.71.2 → 8.72.0 (latest, released 2026-10-19 17:08 UTC; weekly cadence since 8.71.0, so no release burst under ADR-016). Peer ranges unchanged: `eslint ^8.57.0 || ^9.0.0 || ^10.0.0`, `typescript >=4.8.4 <6.1.0` (ADR-017 unchanged). `npm install` under `strict-allow-scripts` reported no new install script; `npm audit`: 0 vulnerabilities; `npm run lint` reports no new problem.

### Stage 4.4 candidates, comparison, re-suggestion, exceptional states (2026-10-20)
- `src/views/CandidatesView.tsx`, `src/views/candidates/` (`RecipeCard.tsx`; `display.ts`: reason selection, nutrient lines, adjustment items, allergen notices; `texts.ts`: localized reasons, bounds, exclusions, relaxations), `src/views/ComparisonView.tsx`, `src/components/StatusMarker.tsx`, `src/views/useTextContext.ts`, `src/i18n/useLocale.ts`. `relaxedDraft` (`src/views/targets/draft.ts`) applies a relaxation to the form and searches again.
- Details settled within ADR-030:
  - Cards show the required ingredients used on their own line, so the reason line (D12) leaves out `uses_required_foods`. A gap reason of zero is not shown (its straddling range has its own reason); the direction of a gap comes from the fit position.
  - The card's allergen notice lists the allergens of the ingredients in the shown state (frying oil and coatings included, sides that are off excluded), "contains" first; foods without reviewed information are named as such. No card says that a recipe has no allergens; the allergen disclaimer is on every result view.
  - Adjustment summaries list the solver's amount changes and sides switched off, then sides and substitutions forced by excluded foods.
  - "Exclude this one" keeps the cards in place (`orderInPlace` in `src/state/reducer.ts`) and focuses the new card; "show a different type" focuses the first new card. A re-suggestion without a recipe that meets the targets keeps the set, and its alternatives open from "show close alternatives" (D5).
  - Exclusion counts and relaxations appear when fewer than 3 recipes meet the targets; the equipment review message appears when equipment is limited and no equipment relaxation exists (D7). Applying a relaxation splits an excluded group into its remaining foods.
  - The comparison is a table with row headers, scrolling inside its own region on narrow screens; the compare bar sticks to the bottom of the candidates view.
- Tests: `src/views/candidates/display.test.ts` and `test/ui/candidates.test.tsx`, a new jsdom project (`tsconfig.ui.json`) that runs the app on the repository content: five cut candidates, re-suggestion until all are shown, in-place exclusion with focus, P4 (set kept, alternatives on request), tofu required (alternatives with gaps, relaxation applied), nothing meeting the targets (exclusion counts, equipment review), comparison with the limit of three, the same digits after switching to Spanish, and axe in `ja`, `en`, and `es` for candidates with alternatives and relaxations, and for the comparison.
- Browser check (`npm run preview`, built-in browser, 2026-10-20): cut candidates at 375 px in `ja` (five cards, no horizontal overflow; the comparison of three recipes scrolls inside its region, 512 px of content in 341 px) and the P4 flow at desktop width in dark mode in `es`; no console messages. The time from pressing "Buscar recetas" to the end of the next task, rendering included, was about 170 ms once on the Apple M1 (a rough observation, not the Stage 4.7 measurement). Shown ranges now carry their unit after this check. Not checked in the browser: English, the tofu and empty cases (jsdom only), a real phone, screen readers.

### Stage 4.5 recipe detail and adjustment (2026-10-20)
- `src/views/DetailView.tsx` and `src/views/detail/model.ts`. Every value comes from `calculateNutrition`, `nutritionBasis`, and `evaluateFit` on the current state; the state is kept per recipe in the reducer.
- Details settled within ADR-030:
  - Starting state: after a search, the state shown on the candidate card (the solver's state, with sides and substitutions forced by excluded foods); otherwise the authored default at the recipe's servings, without fit statuses or "fit to my targets". "Reset" returns to the default with the forced changes; "fit to my targets" returns to the solver's state at the chosen servings. Forced sides and substitutions cannot be undone in the detail view.
  - Steppers move on the authored grid or by whole units within the bounds after a substitution (`substitutedAdjust`); the value shown is in the state unit at the authored servings, labelled with those servings when they are not 1. The default value is the authored amount times the substitution ratio (ADR-028 A); a test checks it against `resolveAmounts` for every repository recipe, and every stepped state is accepted by the engine.
  - Differences after each change are those of the displayed per-serving values (D8), listed for energy, protein, fat, carbohydrate, and salt when they change, with status changes, and announced in a live region. Per-serving values do not change with servings (ADR-028 F), so a servings change reports no difference.
  - The ingredient table shows the engine's amounts for the whole recipe at the chosen servings, then the total and the per-serving row, all with the ADR-025 display rounding (small contributions can read 0 g); ingredients contained in another cooked value and sides switched off show why they are not counted. A household measure is shown scaled with the grams only while it stays a multiple of 1/12; otherwise grams alone.
  - Steps of a side that is off are hidden with a count; step notes appear from `atLeastGrams` (no repository recipe has one yet); a chosen substitution replaces step texts and safety notes and adds its own. The recipe name stays the authored one after a substitution.
  - The basis lists approximation reasons per counted ingredient, assumptions, unknown values with their ingredients, the energy note, the data and content versions with the workbook SHA-256 prefix, and the attribution.
- Tests: `test/node/detail-model.test.ts` (defaults against `resolveAmounts`, grid steps, every stepped state valid, hidden side steps, substitution texts and notes, scaled measures) and `test/ui/detail.test.tsx` (displayed values equal `calculateNutrition` for the default and a changed state, the difference of the displayed values, servings, reset, side and substitution, the same digits after switching to Spanish, the starting state and "fit to my targets" after a search, axe in `ja`, `en`, and `es` before and after a change).
- Browser check (`npm run preview`, built-in browser, 2026-10-20): karaage at 375 px in `ja` (no element wider than the viewport outside the ingredient table, which scrolls in its region), the tuna and tofu bowl after a cut search at desktop width in dark mode in `en` (amount change with differences and the live announcement), and the lemon-herb chicken with the pork substitution at 375 px in `es`; no console messages. Fixed after the check: the "included in cooked value" assumption named the wrong ingredient; an empty equipment line for no-cook recipes; "no target" for carbohydrate. Not checked: a real phone, screen readers.

### Stage 4.6 localization review (2026-10-20)
- Language switch: `useContent` now loads the new locale's text bundle before `i18next` changes the language (`prepare`, called by the language switcher), so the views stay mounted with their open sections, focus, and the detail view's differences; a test checks that the advanced section stays open and no loading state appears. This fixes the Stage 4.3 observation.
- UI glossary: `src/i18n/uiGlossary.ts` lists UI terms (estimate, allergen, side, substitution, approximation, ingredients you want and leave out, target, servings, effort, equipment, composition tables, nutrition labels, composition data), and `src/i18n/policy.test.ts` applies it together with `content/glossary.ts` to every catalog key, except the MEXT attribution wording, which stays Japanese in every locale. Fixed by the check: English "ingredient you leave out" used consistently (was "left out" and "avoid"); the relaxation of a required ingredient now names "the ingredients you want" in English and Spanish; the contradiction basis says "approximated" in English.
- Review of the `en` and `es` catalogs: reason texts no longer put a capitalized nutrient name in the middle of a sentence (for example `es` "{{target}}: faltan … para el objetivo"); Spanish `simmer` is "Cocido". The forbidden-expression check over the catalogs passes in the three locales.
- Document language metadata: `<html lang>` follows the locale; language names in the switcher and the Japanese MEXT wording carry their own `lang`.
- Layout with long Spanish strings at 375 px (`npm run preview`, built-in browser, 2026-10-20): targets form with the advanced section open, candidates with alternatives, relaxations, and exclusion counts (tofu required), cut candidates with three selected and the compare bar, the comparison, and (Stage 4.5) the detail view: no element wider than the viewport outside the table regions, which scroll inside themselves; no console messages. The comparison caption scrolls with its table.
- Not done here: owner review of the English and Spanish texts of Phase 1 and Phase 4 (open question 13, planned with the prototype review); a katakana long-vowel mark still does not match a reading written with う (open question 21 note).

### Stage 4.7 accessibility, browser checks, timing (2026-10-20)
- Accessibility: `test/ui/accessibility.test.tsx` adds axe-core checks in `ja`, `en`, and `es` for the blocked contradiction, the "all shown" notice with the held alternatives open (P4), the state where nothing meets the targets (exclusion counts, equipment review), and the recipe detail after a search with statuses. Together with the Stage 4.2–4.5 tests, every view and exceptional state of `docs/SPEC.md` §12 is checked in the three locales; color contrast is covered by the token test. Keyboard operation is tested for the steppers, the ingredient combobox, focus after view changes, re-suggestion, and exclusion; visible focus is the global `:focus-visible` ring (checked in the browser in Stage 4.2).
- Full flow in the browser (`npm run preview`, production build and headers, built-in browser Chromium 152, Apple M1, 2026-10-20): targets with the advanced section open → search → "show a different type" → "exclude this one" → comparison of two → detail → amount change with differences and a status change → back, in `ja`, `en`, and `es`, at desktop width and at 375 px, light and dark: no element wider than the viewport outside the table regions, no console messages, every request to the same origin (page, script, style, calculation bundle, and the text bundle of each locale). `curl -I` on a deep link returned the CSP (`'self'` only, `frame-ancestors 'none'`), `X-Content-Type-Options`, `Referrer-Policy`, and `Permissions-Policy`.
- *Measured* timing (open question 17; same machine and browser; the tab in front; medians):
  - Engine modules imported in the page (`npm run dev`, 15 runs after warm-up): full recommendation (`evaluatePool` and `selectCandidates`) cut 6.6 ms, bulk 6.3 ms, tofu required 6.1 ms, bulk at ≤ 15 minutes 3.5 ms; the first call 25.9 ms; `recommendationDataFromBundle` 0.1 ms; re-suggestion 0.015 ms; one recalculation of `chicken_mapo_tofu` 0.017 ms; all 20 recipes 0.23 ms.
  - In the production UI (click to committed and laid-out DOM, without paint, 9 runs): search 27 ms, of which `search()` 25 ms (measured with temporary marks that are not committed); "show a different type" 2.2 ms; one amount change in the detail view 3.1 ms. The engine takes longer inside the UI than when called alone (about 25 ms against 7 ms); the cause was not investigated.
  - A background tab gave 55–127 ms for the same search, so measurements from a hidden or background tab are not used.
  - Not measured: a phone or a phone-class CPU profile; the built-in browser offers no CPU throttling. With a 4–6× slower phone CPU the search would take roughly 100–160 ms (estimate), above the 50 ms of ADR-030 D10.
- ADR-030 D10 outcome: the recommendation stays on the main thread for now; desktop timings are below 50 ms. Whether a worker is needed is decided with a phone-class measurement (open question 17).

### Phase 4 acceptance (2026-10-20)
- The full flow (targets → conditions → candidates → comparison → detail → adjustment → re-suggestion) works on mobile and desktop widths in `ja`, `en`, and `es`, including every exceptional state of `docs/SPEC.md` §12 (Stage 4.4, 4.7 logs; jsdom tests and the browser).
- Every engine code and UI string exists in the three locales (type check, `src/i18n/engineCodes.test.ts`, `src/i18n/messages.test.ts`); the forbidden-expression and glossary checks cover the UI catalogs (`src/i18n/policy.test.ts`).
- Displayed values come from the engines and are formatted per locale; switching the locale changes no underlying value (`test/ui/candidates.test.tsx`, `test/ui/detail.test.tsx`).
- Accessibility checks pass in the three locales; keyboard operation and visible focus are verified (Stage 4.7 log).
- Browser timing is measured and recorded on a desktop; a phone-class measurement is still open (open question 17). The storage decision is recorded (ADR-030 D9).
- `npm run check` (lint, type-check, 590 tests, content validation, build) passes.

### ADR-016 re-check before Phase 5 (2026-10-23, 22:24 UTC)
- npm registry: `i18next` latest is 26.5.7 (26.5.5 and 26.5.6 on 2026-10-22, 26.5.7 on 2026-10-23 17:46 UTC); `react-i18next` latest is 17.1.5 (17.1.3 on 2026-10-22, 17.1.4 and 17.1.5 on 2026-10-23, the last at 18:00 UTC), peer `i18next >= 26.2.0`. Releases continue within 48 hours, so the burst exception still applies and the pins stay (`i18next` 26.4.7, `react-i18next` 17.0.20). Re-check after 2026-10-25 18:00 UTC and move both packages together, as their own commit, if no further release follows.

### Phase 5 start (2026-10-23, 23:00 UTC)
- Re-check of ADR-016 (npm registry): no release since the previous log (`i18next` 26.5.7, `react-i18next` 17.1.5). The agreed re-check time (2026-10-25 18:00 UTC) has not passed, so the pins stay (open question 16). Other packages behind latest under ADR-016: `vite` 8.3.4 → 8.3.5 (released 2026-10-21 06:38 UTC, no burst), proposed as its own commit; `@types/node` stays on 24.x (ADR-018).
- Re-check of ADR-017 (npm registry): `typescript` latest is 7.0.2 (`beta` 7.1.0-beta; latest 6.x is 6.0.3); `typescript-eslint` 8.72.0 (latest) and 8.72.1-alpha.8 (canary) still declare peer `typescript >=4.8.4 <6.1.0`. TypeScript stays at `~6.0.3`.

### Stage 5.1 release plan (2026-10-23)
The owner approved the plan below as recommended (P1–P10) and the egg rule in P3. Facts were checked on 2026-10-23 from the npm registry, download hosts (HEAD requests only), the MEXT workbook, and the cited official pages.

- **P1. Library composition** (ADR-023): add 40 recipes to the 20 validation recipes (cut 7, maintain 9, bulk 5; chicken 6, pork 4, beef 2, fish 5, egg 2, soy 1; 13 quick; 4 fried: `chicken_thigh_karaage`, `pork_fillet_tonkatsu`, `salmon_tempura`, `tortilla_espanola`). Planned additions: cut +13, maintain +12, bulk +15; chicken +4, pork +6, beef +8, fish +6, egg +7, soy +9; about 22 quick; at most 3 fried (7 of 60, about 12 %); 4–5 more microwave-only or no-cook recipes.
- **P2. Batches**: batch 1 (13: soy 5, egg 4, beef 4), batch 2 (13: beef 4, pork 4, fish 3, soy 2), batch 3 (14: chicken 4, pork 2, fish 3, egg 3, soy 2). Each batch: owner approval of the recipe list and foods → extraction and cooking-rate transcription with checks → texts in three locales, safety notes, allergens, bounds → content validation → nutrition snapshot diff explained and approved → `npm run eval:coverage` and the scenario snapshot re-run. The owner reviews the `en` and `es` texts per batch (open question 13), with back-translations of safety-relevant texts. Candidate foods (codes from the workbook; the final list is approved per batch): natto 04046, atsuage 04039, aburaage 04040, edamame 06015, soy milk 04052, boiled egg 12005, imported beef round 11076/11270, beef mince 11089/11272, pork mince 11163/11280, chicken sasami 11227/11229/11228, chub mackerel 10154/10156, canned mackerel 10164, horse mackerel 10008/10010, swordfish 10085/10398, whiteleg shrimp 10415, Japanese flying squid 10345/10347, oatmeal 01004, boiled udon 01039, boiled Chinese noodles 01048, sweet potato 02045/02046, plain yogurt 13025. Cooked pairs without a Table 12 rate are approximations under ADR-028.
- **P3. Open questions 10–12**: eggs with soft or runny yolks are allowed and always carry the `soft_yolk` safety note; raw-egg dishes stay excluded (`docs/CONTENT_POLICY.md` §3). Open question 11 is closed before release by comparing the lists with the CAA figure. New recipes avoid processed seasonings whose allergens vary by product; where one is used, its typical ingredients are linked as `may_contain` and listed under open question 12.
- **P4. E2E**: `@playwright/test` 1.64.1 (released 2026-10-14; 1.64.0 on 2026-10-07; Node `>=20`; Apache-2.0) and `@axe-core/playwright` 4.14.0 (released 2026-10-15; depends on `axe-core ~4.14.0`; MPL-2.0, development only). Registry metadata shows no install, preinstall, or postinstall script in `@playwright/test`, `playwright`, `playwright-core`, or `@axe-core/playwright`, and `playwright` has no optional dependencies; the install under `strict-allow-scripts` confirms this when the packages are added. Browsers: Chromium headless shell 156.0.8078.4 and WebKit 27.2 (`playwright-core` `browsers.json`), downloaded after the owner's approval to the user cache outside the repository; archive sizes 103.8 MB and 82.7 MB on macOS arm64, 125.8 MB and 108.1 MB on Linux x64; ffmpeg 1.4 MB on macOS (whether it is installed with these browsers by default: 要確認). Projects `desktop-chromium` (1280×800), `mobile-chromium` (375×812, touch), and `mobile-webkit` (iPhone class), each running the tests in `ja`, `en`, and `es`, against `npm run build && npm run preview` (port 4173, production headers). Coverage: the full flow, every exceptional state of `docs/SPEC.md` §12, locale switching and detection, no horizontal overflow at 375 px with long Spanish strings, keyboard operation and visible focus, reload, back, deep links, axe WCAG 2.2 AA with color contrast in light and dark, headers and CSP on documents and assets, no CSP violation event, and no request to another origin.
- **P5. Phone-class timing** (open question 17, ADR-030 D10): `mobile-chromium` with CDP `Emulation.setCPUThrottlingRate` at 4× and 6×; click to laid-out DOM; median and p90 of 15 runs; scenarios: full recommendation (cut, bulk, tofu required, bulk at ≤ 15 minutes), re-suggestion, recalculation. If the 4× median of a full recommendation is at most 50 ms, it stays on the main thread. Otherwise the UI overhead is investigated first (hypotheses: unwarmed first call, about 26 ms alone in Stage 4.7; conversion of the bundle per search), then the owner decides on a worker. 6× is recorded for reference; the gap between headless throttling and real phones is a known limitation, and a real-device check is a manual item.
- **P6. Security and privacy**: headers and CSP in E2E; `npm audit` with no known vulnerability in production dependencies and every development finding recorded with its handling; a dependency-free `tools/check-licenses.ts` that compares the licenses of every lockfile package with an allowlist (MIT, ISC, Apache-2.0, BSD-2-Clause, BSD-3-Clause, 0BSD; MPL-2.0 for development only); how bundled licenses such as React's are shown (about page or a generated `dist/THIRD_PARTY_LICENSES.txt`) is 要確認. Secret scan: `gitleaks` 8.30.1 (released 2026-03-21, MIT; Homebrew bottle 8.30.1 or the GitHub release, 7.9 MB for darwin arm64, with a checksum file), not an npm dependency, installed only after the owner approves the download; `gitleaks git --redact` over the whole history and `gitleaks dir` over the working tree, plus `git log --all -- data/raw` to confirm that no source file entered the history. `secretlint` 13.0.7 was rejected because it does not scan Git history. Privacy statement: no analytics, cookies, or external requests; only the locale preference is stored; targets and conditions stay in memory.
- **P7. About page**: its own path `/about`, linked from the footer (ADR-030 D2, revised). Contents: MEXT attribution in the requested wording with its localized equivalent, data and content versions, values as this app's own estimates not endorsed by MEXT, ranges and approximations and unmeasured values, the allergen disclaimer, no medical advice and presets as examples, what the app does not do, privacy, and open-source licenses. Texts in the typed catalogs with the forbidden-expression check and axe. No contact address.
- **P8. CI**: GitHub Actions on Linux runners for pushes to `dev` and pull requests; no secrets and no deployment. *Verified* (https://docs.github.com/en/billing/concepts/product-billing/github-actions, https://docs.github.com/en/actions/reference/limits): private repositories include 2,000 minutes per month on GitHub Free and 3,000 on GitHub Pro; usage is blocked when the quota is used up and no payment method is on file; jobs may run up to 6 hours; cache storage is 10 GB per repository. The owner's plan and the run time per workflow (estimate about 10 minutes) are 要確認. Steps: `npm ci` under `strict-allow-scripts`, lint, type-check, tests, content validation, build, E2E with `playwright install --with-deps` for Chromium and WebKit; npm and browser caches.
- **P9. Deployment** (ADR-001): *Verified* (https://developers.cloudflare.com/workers/static-assets/routing/single-page-application/, updated 2026-10-12): the SPA example has `name`, `compatibility_date`, and `assets` with `directory` and `not_found_handling = "single-page-application"`, without `main`; a request that matches no file receives `/index.html` with 200, including missing asset paths. *Verified* (https://developers.cloudflare.com/workers/static-assets/headers/, updated 2026-09-22): default `Cache-Control: public, max-age=0, must-revalidate` with an ETag; `_headers` up to 100 rules and 2,000 characters per line. Not stated: whether `_headers` applies to the SPA fallback response (要確認 after a deployment, with `curl`). Plan: `platform/cloudflare/wrangler.jsonc` passed with `--config`; `_headers` adds `Cache-Control: public, max-age=31536000, immutable` for hashed `/assets/*`. Wrangler (4.152.0; 4.151.2, 4.151.3, and 4.152.0 between 2026-10-19 and 2026-10-22) is not added to the repository; its version is checked when a deployment is approved. The runbook covers Cloudflare, notes for other static hosts (SPA fallback, headers), and rollback. Nothing is deployed before the owner's approval.
- **P10. Remaining items**: katakana long-vowel search (open question 21) — the Japanese search normalization also matches a katakana `ー` read as the preceding vowel and, after o- and e-row kana, as う and い (トーフ → とおふ, とうふ), with tests; no engine change. The comparison caption becomes sticky. Per-ingredient values stay rounded to whole grams (no ADR). Closed before release: open questions 9 and 13 (English and Spanish review), 11, 16, 17. Listed as known limitations: 2, 3, 6, 7, 8, 12. Dependency updates (`vite` 8.3.5; `i18next` and `react-i18next` after the re-check) are separate commits.

### Dependency update: vite 8.3.5 (2026-10-23)
- `vite` 8.3.4 → 8.3.5 (latest, released 2026-10-21 06:38 UTC; no other release since 8.3.4 on 2026-10-08, so no burst under ADR-016). Dependency ranges move to `postcss ^8.5.30` and `rolldown ~1.2.14`, both already satisfied by the installed versions; the optional `@vitejs/devtools` peer range widens to `^0.7.1 || ^0.8.0`. Only `vite` changed in the lockfile; `npm install` under `strict-allow-scripts` reported no new install script; `npm audit`: 0 vulnerabilities; `npm run check` passes (590 tests).

### Stage 5.2 batch 1 (2026-10-23)
- The owner approved the batch 1 list (13 recipes: soy 5, egg 4, beef 4) and its foods. Content version `2026-10-23.1`: 61 foods, 33 recipes.
- Composition: 16 codes added to `data/composition/manifest.json` (01004, 01039, 01047, 01048, 04039, 04046, 04052, 06016, 06214, 06215, 06245, 06246, 06291, 06292, 11089, 11272); `npm run data:extract` wrote 112 foods.
- Cooking data, transcribed from rendered pages of the explanation PDF: Table 12 rates 01048 boil 190 % (p. 39), 06215 boil 87 % (p. 47), 06246 stir-fry 96 % (p. 48), 06292 boil 84 % (p. 49), 11272 grill 65 % (p. 57); Table 14 for 06246 (cooked 96 g, main 100 g, oil 5.0 g, fat change 3.9 / −1.1 g, 4.1 g per 100 g cooked; p. 67). `npm run data:verify-cooking`: 66/66 entries verified. Pre-boiled udon (01039) and boiled shelled edamame (06016) are used as sold, so they need no rate.
- Foods: `atsuage`, `natto` (sauce and mustard packets not counted, stated in its note), `soy_milk`, `edamame`, `beef_mince`, `udon_boiled`, `chinese_noodles` (wheat; egg `may_contain`), `oatmeal` (wheat `may_contain` for cross-contact), `green_pepper`, `bean_sprouts`, `carrot`.
- Changes from the approved list: the meatballs combine ground beef with firm tofu, because ground beef alone (fat 21.1 g per 100 g) exceeds every preset fat limit; the microwave egg porridge pierces the yolks and carries an `egg_burst` note besides `soft_yolk`.
- Goal labels follow the preset each recipe fits best after adjustment (owner, Q2): met — `natto_tofu_rice_bowl` (maintain, bulk), `soy_milk_udon_tofu` (maintain, bulk), `beef_pepper_stir_fry` (maintain, bulk), `tofu_steak_mushroom_sauce` (maintain), `egg_drop_chinese_noodles` (maintain); near — `atsuage_ginger_saute`, `edamame_tofu_fried_rice`, `beef_mince_bibimbap`, `beef_meatballs_tomato` (bulk), `soft_egg_oatmeal_bowl` (maintain), `beef_lemon_saute_salad` (cut); not met — `egg_tomato_stir_fry`, `eggs_tomato_pepper_bake` (maintain). Eggs (protein 12.2 g, fat 10.2 g per 100 g) and soy foods (firm tofu 7.0 g and 4.9 g) give about as much fat as protein, so egg- and soy-based dishes rarely meet the preset fat limits; the validation recipes based on them (`tofu_egg_champuru`, `tortilla_espanola`, `poached_egg_spinach_toast`) meet no preset either. ADR-023 goal counts use the labels; the met counts are reported per batch, and batches 2 and 3 favor lean pork, fish, and chicken dishes that meet cut.
- Tests (owner, Q1, option B): tests of reviewed counts and statuses run on the 20 validation recipes (`validationRecipes` in `content/recipes/index.ts`, `validationBundleInput()` in `tools/content/repository.ts`): `test/node/recommendation.test.ts`, the reason and assumption counts in `test/node/engine.test.ts`, the Stage 1.3 totals in `test/node/composition-report.test.ts`, and the UI tests on repository content (`test/ui/repositoryContent.ts`, `test/ui/detail.test.tsx`). The engine snapshot and the scenario snapshot (renamed "scenarios on the repository recipes") cover the whole library.
- Snapshot diffs: the engine snapshot only adds the 13 new recipes (the 20 existing entries are unchanged). The scenario snapshot gains new recipes in the first sets of P2, P3, S3, S4, S7, and S8 (`natto_tofu_rice_bowl`, `soy_milk_udon_tofu`, `tofu_steak_mushroom_sauce`) and in the next sets (`beef_pepper_stir_fry`, `egg_drop_chinese_noodles`); S7 (tofu required) now has 4 met candidates and no relaxation instead of 1 met and 2 alternatives; exclusion counts grow with the library. No change is caused by an engine change.
- `npm run eval:coverage` (33 recipes, met after adjustment / near): S1 cut 9/5, S2 cut ≤ 20 min 8/4, S3 maintain 16/9, S4 bulk 10/13, S5 cut without egg 9/4, S6 chicken required 5/1, S7 tofu required 4/2, S8 bulk ≤ 25 min 8/11. `npm run report:composition`: exact 229, approximation 32, hard to estimate 2, not counted 22, fried 5.
- Browser check (`npm run preview`, built-in browser, 2026-10-23): the 13 new detail pages at 375 px in `ja`, `en`, and `es` and at desktop width in `en` (`es` for one page) have no element wider than the viewport outside the table regions; a maintain search lists `natto_tofu_rice_bowl` first, as in the scenario snapshot; no console messages; every request to the same origin. Not checked: dark mode, the comparison view with new recipes, and every new recipe at desktop width in `ja` and `es`.
- Review: the owner reviewed the `en` and `es` texts of batch 1, with back-translations of the new safety notes (`egg_burst`, `meatball_doneness`, `beef_doneness`, `hot_oil`, `hot_water`, `hot_dish`), and approved the commit (2026-10-24).

### Stage 5.2 batch 2 (2026-10-24)
- The owner approved the batch 2 list (13 recipes: beef 4, pork 4, fish 3, soy 2) and its foods. Content version `2026-10-24.1`: 68 foods, 46 recipes.
- Composition: 12 codes added (06086, 06087, 06116, 06247, 06248, 06413, 10085, 10345, 10347, 10398, 10415, 17061); `npm run data:extract` wrote 124 foods.
- Cooking data, transcribed from rendered pages of the explanation PDF: Table 12 rates 06087 boil 88 % (p. 45; the post-cooking trim of the stem base is not recorded, as for spinach 06268), 06248 stir-fry 96 % (p. 48), 06413 stir-fry 89 % (p. 49), 10398 grill 65 % (p. 53), 10347 grill 70 % (p. 56); Table 14 for 06248 (96 g, 100 g, 5.0 g, 3.9 / −1.1 g, 4.1 g; p. 67) and 06413 (89 g, 100 g, 5.0 g, 2.4 / −2.6 g, 2.7 g; p. 67). `npm run data:verify-cooking`: 73/73 entries verified. `bean_sprouts` gains its stir-fried value (06413).
- Foods: `swordfish`, `shrimp` (allergen shrimp, raw value only), `squid` (allergen squid), `komatsuna` (with a note that spinach or bok choy may replace it, values remain komatsuna's), `red_pepper`, `zucchini`, `curry_powder` (no listed allergen: spices only; products with added flour exist, so this is a best-effort assumption like open question 12).
- Fit after adjustment (labels unchanged from the approved list): met — `beef_shabu_lemon_soy`, `beef_broccoli_microwave`, `pork_leg_sprout_garlic`, `pork_fillet_tomato_zucchini`, `pork_leg_vegetables_microwave`, `swordfish_lemon_herb`, `shrimp_garlic_broccoli`, `squid_red_pepper_stir_fry` (cut), `beef_potato_tomato_stew`, `beef_komatsuna_udon`, `pork_fillet_curry_rice` (bulk); near — `tofu_komatsuna_ankake_bowl` (maintain, protein range straddles 30 g), `tofu_edamame_dry_curry` (bulk, protein range straddles 45 g; edamame raised from 80 to 120 g and tofu oil lowered from 4 to 2 g while tuning). Most lean meat and seafood recipes also meet the other presets after adjustment; labels keep the designed goal when it is met (batch 1 rule).
- Library (46 recipes): cut 16, maintain 18, bulk 16; chicken 6, pork 8, beef 10, fish 8, egg 6, soy 8; 37 quick, 4 fried, 4 microwave-only, 2 no-cook. Batch 3 needs chicken +2 and egg +2 for ADR-023.
- Snapshot diffs: the engine snapshot only adds the 13 new recipes. In the scenario snapshot, the new lean recipes enter the first sets of P1, P2, P3, S1, S2, S3, S4, S5, and S8 (`beef_broccoli_microwave`, `squid_red_pepper_stir_fry`, `pork_leg_sprout_garlic`, `beef_komatsuna_udon`, `shrimp_garlic_broccoli`, `pork_fillet_curry_rice`, `beef_potato_tomato_stew`) and replace some validation recipes, whose positions follow from diversification (ADR-029); met counts roughly double (for example P1 8 → 16 met); exclusion counts grow with the library. No change is caused by an engine change.
- `npm run eval:coverage` (46 recipes, met after adjustment / near): S1 cut 18/8, S2 cut ≤ 20 min 17/6, S3 maintain 27/10, S4 bulk 20/15, S5 cut without egg 16/6, S6 chicken required 5/1, S7 tofu required 4/3, S8 bulk ≤ 25 min 17/13. `npm run report:composition`: exact 317, approximation 49, hard to estimate 2, not counted 27, fried 5.
- Browser check (`npm run preview`, built-in browser, 2026-10-24): the 13 new detail pages at desktop width and at 375 px in `ja`, `en`, and `es` have no element wider than the viewport outside the table regions; the shrimp recipe shows shrimp in the allergen line; one page checked in dark mode; no console messages; every request to the same origin. Not checked: the comparison view with new recipes.
- Review: back-translations of the new safety notes (`beef_doneness` variants, `even_heating` variants, `cooling`, `fish_doneness`, `shrimp_doneness`, `squid_doneness`) are given to the owner with the commit proposal.

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
- Viewed recipes are remembered only in memory for the session; nothing is stored in the browser (ADR-030 D9).

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
- Decision: no accounts; targets and conditions stay in the browser and are not put in URLs. Browser storage of targets or history: none in the MVP (ADR-030 D9).

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

## ADR-027: Content bundle format
- Status: **Accepted** (owner, 2026-10-18, Stage 1.4)
- Decision: `tools/build-content.ts` writes `generated/content/calc.json` (locale-neutral) and `text-ja.json`, `text-en.json`, `text-es.json`; the files are generated at build time and not committed. `src/main.tsx` imports them with `?url`, so Vite emits them with a content hash in the name; `assetsInlineLimit` keeps JSON out of `data:` URLs, which `connect-src 'self'` would block.
  - Every bundle carries `schemaVersion` (`BUNDLE_SCHEMA_VERSION`, bumped on incompatible changes), the content version, and the composition versions (workbook update date and SHA-256, explanation PDF SHA-256).
  - The calculation bundle has foods (ID, codes per state, allergens, protein group), the composition values of `ENERC_KCAL`, `PROT-`, `FAT-`, `CHOCDF-`, `NACL_EQ` with notations and the refuse rate, weight change rates (removal after cooking as a flag only), and recipes without texts. It contains no Japanese, English, or Spanish text.
  - Text bundles key every text by food ID, recipe ID, and step, safety note, side, ingredient, and substitution keys.
  - The browser validates each bundle with the `zod/mini` schemas in `shared/bundle.ts`, checks that the text bundle matches the locale, versions, and keys of the calculation bundle (`bundleMismatches`), and shows the error state with a retry action otherwise.
- Rationale: plain static JSON that any host can serve (ADR-001); content hashes allow long caching; translations cannot affect the data the calculation uses.
- Alternatives: a custom Vite plugin that emits hashed files and serves them in development (more code); content as dynamically imported JavaScript modules (simpler, but executable code instead of JSON).

## ADR-028: Nutrition engine design, approximation reasons, and error bands
- Status: **Accepted** (owner, 2026-10-18, Stage 2.1)
- API (`domain/nutrition`, no locale parameter):
  - `engineDataFromBundle(calc)` turns the calculation bundle into lookup maps (foods, composition of the five displayed nutrients, weight change rates, versions).
  - `resolveAmounts(recipe, state, data)` and `calculateRecipe(recipe, state, data)` take a recipe state: `servings`, `sidesOff` (side keys), `amounts` (grams for `grams` adjustment, a count for `count` adjustment, keyed by ingredient), and `substitutions` (substitution keys).
  - Invalid user states (amount outside the bounds or off the grid, a non-integer count, an unknown key) return a typed error result. Data inconsistencies (missing food code or weight change rate) throw, because build-time validation rules them out.
  - Output per ingredient: resolved grams, effective grams, food code, state, cooking method, weight change rate, counted or the reason it is not (`included_in`, `side_off`), class, reasons, notations, amounts, error band, assumptions. Per recipe: totals, per-serving values, per-nutrient ranges with a "shown" flag, incompleteness (ingredient keys with unmeasured values per nutrient), and the basis (content version, workbook date and SHA-256, explanation PDF SHA-256).
- Reasons, classes, and bands (resolves open question 15; `docs/NUTRITION_CALCULATION.md` §7):

  | Reason | Trigger | Class | Band |
  |---|---|---|---|
  | `raw_value_for_cooking` | `cooking` set, state `raw` | approximation | −15 % to +5 % of every nutrient |
  | `related_cooked_value` | `cooking` set, state is a cooking method | approximation | ±5 % |
  | `post_cooking_refuse` | weight change rate removes parts after cooking | approximation | ±5 % |
  | `fried` | fried state or fried cooking method | approximation | ±30 % of fat and of the energy from that fat |
  | `slow_frying` | `estimate: "slow_frying"` | hard to estimate | 0 to +50 % of fat and of the energy from that fat |
  | `estimated_source_value` | `( )` value in a displayed nutrient | approximation | none |

- Decisions:
  - **A. Substitutions** are applied during amount resolution in Phase 2 (food, state, cooking, ratio, bounds; reasons are re-evaluated for the new food). Offering and choosing substitutions stays in Phase 3 (`domain/recommendation`). Links keep their proportion because the leader's default scales with the ratio.
  - **B. Energy from fat** in the fried and slow-frying bands uses 9 kcal/g. This is an *assumption*, stated in the basis.
  - **C. Notations**: `( )` estimated values give the approximation reason `estimated_source_value` with no band. `Tr`, `(0)`, and `(Tr)` count as 0 and are flags only (class unchanged).
  - **D. Household measures** such as "a pinch" do not make an ingredient hard to estimate: the recipe states grams, and the measure is a display aid. The basis notes this.
  - **E. Tools and tests** obtain engine input from the in-memory calculation bundle (`buildCalcBundle` then `engineDataFromBundle`), so they test exactly what the browser uses. Hand cross-checks keep computing independently from `data/composition/`.
  - **F. Servings**: `amounts` and adjustment bounds refer to the authored servings; a servings change multiplies all resolved grams afterwards. Per-serving values therefore do not depend on servings. A scaled count may be fractional; the display is decided in Phase 4.
  - **G. Combination**: bands of several reasons on one ingredient add up, except that `slow_frying` replaces the `fried` band. The class is the most severe of the reasons (exact < approximation < hard to estimate), so an ingredient with a tabulated fried form is an approximation. Bands are summed per nutrient; whether a range is shown is decided on the per-serving range, with threshold twice the display unit (20 kcal; 2 g for protein, fat, and carbohydrate; 0.2 g for salt, ADR-025).
- Rationale: one pure engine shared by the browser and the tools; the two §7 bands for untabulated cooking can now apply separately; no new numbers except the stated energy factor.
- Alternatives: substitutions only in Phase 3 (the detail view could not recalculate them in Phase 2); trace and estimated values as approximations with an invented band; "a pinch" as hard to estimate (contradicts the authored grams); computing tools from the full source subset (would not test the browser's data).
- Evidence: verification log "Stage 1.3" and "Stage 2.1 engine design".

## ADR-029: Recommendation engine design
- Status: **Accepted** (owner, 2026-10-18, Stage 3.1)
- API (`domain/recommendation`, pure, deterministic, no locale parameter; nutrition values only from `calculateNutrition`):
  - `recommendationDataFromBundle(calc)`: engine data plus food allergens and protein groups, and the bundle recipes. No change to `domain/nutrition` is needed.
  - `evaluatePool(request, data)`: input validation, contradiction checks, hard filters, and the solver for targets, servings, and conditions. `selectCandidates(pool, session, seed)`: tiers, diversification, seeded order, close alternatives, and relaxation options. The split lets re-suggestion reuse the solver results.
  - Targets: kcal range (required), optional protein minimum, fat maximum, and carbohydrate range; `presetTargets` returns the ADR-025 presets. Conditions: hard `maxMinutes`, available `equipment`, `excludedFoods`, `excludedAllergens`, `requiredFoods` (each item an any-of set of food IDs); soft `effort` (preferred maximum) and `cuisines`. Session: `shown`, `excluded`, `previous` (the set on screen), `keep` (cards kept when one is replaced). Recipe `goals` are not used for ranking.
  - Input errors are typed values (`invalid_number`, `out_of_range`, `inverted_bound`, `unknown_food`, `required_and_excluded`, `unknown_recipe`, `invalid_servings`, `invalid_seed`). Provisional input limits: kcal 100–2,000, protein 0–200 g, fat 0–150 g, carbohydrate 0–400 g, minutes 5–240, servings an integer 1–20.
  - Output: candidates (met tier, up to 5) and close alternatives, each with the chosen recipe state, the engine result, per-nutrient and overall fit, the fit at default amounts, amount changes, sides switched off, states forced by excluded foods, relative change, diversity attributes, and reason data (typed codes and numbers; texts in Phase 4); contradictions; per-constraint exclusion counts (`count` and `onlyThis`); relaxation options; tier counts; an `exhausted` flag.
- Decisions:
  - **D1. Ranges**: when a range is shown, the status is evaluated on the range: entirely inside → met; touching or straddling a bound, or partly inside the tolerance zone → near; entirely outside the tolerance zone → not met. A range that is not shown is evaluated as its point value. Bounds and tolerance limits are inclusive; comparisons use full precision without an epsilon. Gaps are reported from the point value.
  - **D2. Unknown nutrient** (unmeasured counted value): per-nutrient status `unknown`; the overall tier treats it as not met, so it is never met and never described as close.
  - **D3. Overall status and tiers**: the worst status among the set targets (kcal always; protein, fat, carbohydrate when set; salt is never a target). Within the near tier, fewer near nutrients first, then the smaller sum of gap ÷ tolerance width; within the not-met tier, fewer not-met nutrients first, then the same gap sum.
  - **D4. Solver**: the search space of the evaluation tool (every grid combination × every subset of solver-removable sides), except that sides forced off by excluded foods stay off and sides containing a required food stay on. A linear model per side combination (one engine call per adjustable ingredient) scores the grid; the chosen state is recalculated with the engine and its fit is taken from that result; if it differs from the prediction, that recipe falls back to the exhaustive search. A test requires identical choices to the exhaustive search. Objective: tier, then the D3 order, then the smallest relative change Σ|g − g₀| / g₀ over changeable ingredients (as in the evaluation tool), then fewer sides off, then the lexicographically smallest amounts in authored ingredient order. The solver never chooses substitutions.
  - **D5. Diversification**: attributes main protein group, cuisine, and a cooking-method family derived in `shared/recipe.ts` (no schema change): fried recipe → `fry`; `no_cook` tag → `no_cook`; otherwise the main protein ingredient of the recipe's group by `cooking ?? state`: `grill`; `simmer` (boil, simmer, poach); `steam` (steam, microwave); `stir_fry`; `pan` (saute, scramble, fry_egg); raw or as sold → `no_cook`. Greedy selection within the best tier with a lexicographic key, no weights: (1) the number of attributes whose value is not yet among the chosen and previous recipes, (2) preference score (cuisine match +1, effort at most the preferred level +1), (3) smaller relative change, (4) seeded order.
  - **D6. Re-suggestion**: the seeded order is `mix32(seed, fnv1a(recipeId))` with the recipe ID as the final tie-break, so adding or removing recipes does not reorder the others; the UI supplies the seed (0 first, +1 for "show a different type"); the domain never calls `Math.random`. "Show a different type" adds the current set to `shown` and `previous`; when fewer than 3 unshown recipes meet the targets, the result sets `exhausted` and selects again from all except the previous set. "Exclude this one" adds to `excluded`, keeps the other cards (`keep`), and fills only the free slot. State stays in memory (ADR-015).
  - **D7. Hard filters**: allergens exclude a recipe when any ingredient (including frying oil, coatings, and sides) has `contains`, `may_contain`, or unknown allergen information, with no rescue by sides or substitutions. An excluded food that appears only in user-switchable sides switches those sides off; one that a substitution replaces applies that substitution; the forced state is reported and time, equipment, and allergens are checked again on it; otherwise the recipe is excluded. Required foods must appear in the default ingredients (not through a substitution). Time and equipment use the full recipe (ADR-026); equipment must be a subset of the available equipment.
  - **D8. Relaxation**: offered when fewer than 3 recipes meet the targets; one constraint at a time: the smallest authored recipe time that adds a met recipe, one more piece of equipment, removing one required food, removing one excluded food. Allergens and recipes excluded by the user are never relaxed. Counts are recomputed exactly (filters again on the cached solver results). Order: more met recipes gained, then more near recipes gained, then the fixed constraint order; options with no gain are not returned.
  - **D9. Contradictions**, before searching, with the general factors 4 kcal/g for protein and carbohydrate (an *assumption*; table energy differs, median +4 %): blocking (no search) when 4 × (protein minimum − 3) + 4 × 0.9 × carbohydrate minimum > 1.1 × kcal maximum; warning (search runs) when 4 × protein minimum + 4 × carbohydrate minimum ≥ 0.8 × kcal maximum. An inverted bound is an input error, not a contradiction.
  - **D10. Fried dishes** (open question 18): wide fried ranges giving "near" instead of "met" is intended; the bands stay as in ADR-028.
- Rationale: one pure engine for the browser and the tools; statuses never claim more certainty than the shown range allows; the linear model keeps the exhaustive result while avoiding about 0.5 s per request at 60 recipes in Node (more on phones); a lexicographic order is explainable by the reason data.
- Alternatives: point-based "met" with a range guard (changes ADR-025 and `docs/NUTRITION_CALCULATION.md` §9); `unknown` as near or not met; exhaustive engine calls only; a weighted preference score; an authored `method` field; a PRNG stream; rebuilding the whole set on "exclude this one"; rescuing allergen recipes by switching sides off; excluding every recipe that contains an excluded food.
- Evidence: verification log "Stage 3.1 recommendation design".

## ADR-030: MVP user interface design
- Status: **Accepted** (owner, 2026-10-19, Stage 4.1)
- Screens, wireframes, navigation, state, styling, and catalog structure: `docs/UI_DESIGN.md`. The UI changes no engine behavior, formula, tolerance, limit, or threshold.
- Decisions:
  - **D1. Views**: targets and conditions (quick inputs and a collapsible advanced section), candidates (3–5 cards, up to 3 selected for comparison), comparison, and recipe detail with adjustment; every exceptional state of `docs/SPEC.md` §12 is a state of these views.
  - **D2. Navigation**: no router library; a small History API wrapper in `src/navigation/`. Only the recipe detail has its own path (`/recipes/<id>`); the other views use `/` with the view name in `history.state`. Targets and conditions are never in the URL or in `history.state`. After a reload, candidates and comparison fall back to the targets view with a notice; the detail view shows the recipe at its default amounts without fit statuses. State lives in one `useReducer` behind a context; no store library. Revised (owner, 2026-10-23, Stage 5.1 P7): the about page also has its own path (`/about`).
  - **D3. Styling**: Tailwind CSS v4 (`tailwindcss`, `@tailwindcss/vite`) with tokens in CSS, system fonts only, WCAG 2.2 AA contrast checked by a test over the token pairs, and status markers with distinct shapes and texts.
  - **D4. Input limits and contradiction thresholds** (open question 19): unchanged (`INPUT_LIMITS`, ADR-029 D9). Input errors appear at their fields and in a summary on submit; a blocking contradiction stops the search with an explanation; a warning is shown and the search runs.
  - **D5. "Show a different type" when no new recipe meets the targets** (Stage 3.7 observation): the current set stays on screen with a notice that every recipe meeting the targets has been shown, plus "show close alternatives" and "change conditions". A result with only alternatives does not replace the set.
  - **D6. Ingredient input** (open question 14): an ARIA combobox over the active locale's names and aliases, normalized per locale (`docs/ARCHITECTURE.md` §4); no match shows "not supported". Aliases stay optional because names are always searchable. Protein groups are offered as "any cut" items: a required group is one any-of item; an excluded group adds every food of the group.
  - **D7. Relaxation and equipment** (open question 20): no engine change. Relaxation options are listed with their met and near gains and an "apply" action. Equipment is chosen as "no limit" (default), "microwave only", or individual items; when no single relaxation exists, the UI suggests reviewing the equipment and links to that field.
  - **D8. Adjustment**: servings, steppers on the authored grid and whole units, side switches, substitutions from the recipe's list, "fit to my targets" (the pool entry's solver state; only after a search), and reset. Differences from the previous state are the differences of the displayed (rounded) values, so that the shown numbers add up, and status changes are listed.
  - **D9. Browser storage** (open question 5): nothing except the locale preference is stored in the MVP. Opt-in storage of targets or viewed recipes may be proposed later with its own privacy review.
  - **D10. Where the recommendation runs** (open question 17): the main thread. Stage 4.7 measures a full recommendation, a re-suggestion, and a recalculation in the browser, including a phone-class CPU throttling profile if the browser offers one; a worker is proposed only if a full recommendation exceeds about 50 ms there.
  - **D11. Accessibility tests**: `axe-core` in Vitest with jsdom for every view and state in `ja`, `en`, and `es`; color contrast is covered by the token test because jsdom cannot compute it. Playwright stays in Phase 5.
  - **D12. Card reason line**: at most two reasons besides the fit status, in this order: `highest_among_candidates` / `lowest_among_candidates`, `uses_required_foods`, `new_attribute`, `matches_cuisine`, `quick`, `within_effort`; when none applies, `meets_all_targets` or `meets_with_adjustment`. Close alternatives show all their gap reasons (`near_target`, `misses_target`, `unknown_value`, `range_straddles`).
  - **D13. Seed**: 0 for every new search, +1 for each "show a different type" (ADR-029 D6).
- Dependencies (verification log "Stage 4.1 UI design"): `tailwindcss` 4.3.3 and `@tailwindcss/vite` 4.3.3 (dev), `axe-core` 4.14.0 (dev). No new install script; no router.
- Alternatives: React Router or wouter (more than two views with URLs are not needed, and targets must stay out of URLs); plain CSS (the owner's other apps use Tailwind); opt-in local storage (privacy review not needed for the MVP flow); a worker from the start (Node timings are far below a frame budget); combined equipment relaxation in the engine (needs an ADR-029 change for one rare case); differences of full-precision values (shown numbers would not add up).

---

## Open questions (要確認)

1. ~~Carbohydrate column (ADR-011)~~: `CHOCDF-` accepted. Localized display names are set with the UI catalogs (Phase 4).
2. Extraction method for Tables 12–14 from the PDF; use of chapter 3 group-level rates for missing cooked forms.
3. ~~Tolerance, display rounding, and range threshold values~~: ADR-025. Evidence for the assumed error bands is still needed.
4. ~~Initial recipe count and the scope of automatic adjustment~~: accepted in ADR-023 and ADR-024 (Stage 0.6); portion rules and linked seasonings are designed in Phase 1/3.
5. ~~Browser storage of targets and viewed recipes~~: nothing except the locale preference in the MVP (ADR-030 D9).
6. Whether the 2015 English edition's names and food codes can serve as a reference for English names.
7. Applicability of the Health Promotion Act and the Pharmaceutical and Medical Device Act to this app; applicability of allergen labelling rules (policy already applies the stricter interpretation).
8. Copyright status of recipes under Japanese law (primary sources not checked).
9. Spanish review capacity (ADR-007).
10. Raw-egg dishes and other regionally sensitive food safety rules across the three locales. Eggs: decided (owner, 2026-10-23, Stage 5.1 P3) — soft or runny yolks are allowed with the `soft_yolk` note; raw-egg dishes stay excluded. Other regional rules are reviewed per batch in Stage 5.2.
11. Allergen item lists in `shared/content.ts` derived from CAA change notes and municipal notices; confirm against the CAA figure (Stage 0.4 log).
12. Best-effort allergen lists for cooking sake, wholegrain mustard, Chinese-style stock granules, and karaage coating mix are based on typical ingredients, not product labels (Stage 0.6 log).
13. Owner review of the English and Spanish texts added or rewritten in Phase 1: split steps, side labels, and the substitution step texts (Stage 1.1 log, ADR-007). Deferred by the owner to a review together with the UI once the prototype is largely complete ("Phase 4 start").
14. ~~Whether every food must have at least one search alias per locale~~: aliases stay optional (ADR-030 D6).
15. ~~Phase 2 must distinguish raw values from related cooked values for the error bands~~: separate reasons `raw_value_for_cooking` and `related_cooked_value` (ADR-028).
16. Re-check the `i18next`/`react-i18next` pins after 2026-10-25 18:00 UTC (ADR-016, "ADR-016 re-check before Phase 5").
17. Recommendation and recalculation time on phones: desktop browser timings are recorded (Stage 4.7); a phone or a phone-class CPU profile (for example Playwright with CPU throttling in Phase 5) decides whether the recommendation moves to a worker (ADR-030 D10). Method and threshold: "Stage 5.1 release plan" P5.
18. ~~Fried dishes with wide ranges become "near"~~: intended (ADR-029 D10). The fried and slow-frying bands remain assumptions (open question 3).
19. ~~Provisional input limits and contradiction thresholds~~: unchanged (ADR-030 D4).
20. ~~Combined equipment relaxation~~: no engine change; equipment modes and a link to the equipment field instead (ADR-030 D7).
21. ~~Japanese search by reading~~: the owner approved adding hiragana readings as Japanese aliases (2026-10-20); 26 foods gained readings in content version 2026-10-20.1, and `test/node/food-search.test.ts` checks reading search. A long-vowel mark typed in katakana ("トーフ") still does not match a reading written with う ("とうふ"); the approved fix is "Stage 5.1 release plan" P10.
