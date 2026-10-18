# Nutrition Calculation — Recipe Discovery

Status: **Draft (2026-10-18)**. Formulas quoted from the source tables are *Verified* (read in the official PDF on 2026-10-18; see `docs/DECISIONS.md` "Verification log"). Column choices, rounding, tolerances, and thresholds are *Provisional* until Phase 0 and Phase 2 confirm them with real data. Changing anything here needs the owner's approval and an ADR (CLAUDE.md Part B, principle 5).

## 1. Source data

- Standard Tables of Food Composition in Japan 2020 (Eighth Revised Edition), Updated and Enlarged Version 2023 (日本食品標準成分表（八訂）増補2023年), MEXT. Workbook version: updated 2026-03-27 (includes errata). Handling rules and attribution: `docs/DATA_SOURCES.md`.
- *Verified*: all values are per 100 g of edible portion. The edible portion is the food as purchased minus the parts normally discarded; the refuse rate is the discarded share in mass %.
- *Verified*: the tables list 2,538 foods, including cooked forms (for example boiled, grilled, stir-fried, sautéed, deep-fried, tempura, breaded and fried, steamed, microwaved).

## 2. Nutrients and source columns (ADR-011, accepted 2026-10-18)

| Displayed nutrient | Column (component identifier) | Reason |
|---|---|---|
| Energy (kcal) | `ENERC_KCAL` | Complete for all 2,538 foods |
| Protein | `PROT-` (たんぱく質) | Nearly complete (1 unmeasured); close to common nutrition labels |
| Fat | `FAT-` (脂質) | Nearly complete (1 unmeasured); close to common nutrition labels |
| Carbohydrate | `CHOCDF-` (炭水化物, includes dietary fiber) | Complete for every validation recipe; does not add residual "carbohydrate" to meat, fish, and eggs as `CHOAVLDF-` does |
| Salt equivalent (optional) | `NACL_EQ` | Nearly complete |

Not displayed in the MVP: dietary fiber (`FIB-`, incomplete for 13 of 20 validation recipes) and the component-based columns `PROTCAA`, `FATNLEA`, `CHOAVLDF-` (incomplete for most recipes or misleading for protein-rich foods). They stay in the extracted subset for comparison.

Measured facts (2026-10-18): in the workbook, `PROTCAA` is unmeasured for 422 foods (17%) and a median 15% lower than `PROT-`; `FATNLEA` is unmeasured for 436 foods (17%) and a median 8% lower than `FAT-`. Over the 20 validation recipes, `PROTCAA` (with a fallback) would read 2.2–9.1 g lower protein per serving. Details: `docs/DECISIONS.md` "Stage 0.5 calculation checks".

Energy is the table value, computed by MEXT from component-based values, so it does not equal 4 × protein + 9 × fat + 4 × carbohydrate (the validation recipes differ by −0.1% to +10%, median +4%). The detail view explains this.

## 3. Notation in the source tables and how it is handled

| Notation (verified definition) | Handling |
|---|---|
| `-` unmeasured | **Unknown, never zero.** If it occurs in a displayed nutrient for any ingredient, the recipe value is marked incomplete and the ingredient is listed |
| `0` below 1/10 of the minimum reported amount, or not detected | 0 |
| `Tr` trace: at least 1/10 but below 5/10 of the minimum reported amount | 0 in sums; flagged as trace in the breakdown |
| `(0)` estimated zero; `(Tr)` estimated trace | 0 in sums; flagged as estimated |
| `( )` around a value: borrowed from foreign tables, calculated from recipes, or inferred from similar foods | Used as the value; flagged as estimated |

## 4. Recipe amounts

- Recipes state each ingredient as **raw edible grams** (after removing refuse, before cooking). This is the most reproducible basis.
- Household measures (for example 1 egg, 1 tablespoon) are authored per recipe as display aids with an explicit gram equivalent (for example 1 egg = 50 g edible portion). The source tables contain no household measure table.
- *Verified* formula (c5) for purchase amount, used for optional display:
  `purchase mass (g) = raw edible mass (g) × 100 / (100 − refuse rate %)`.

## 5. Cooked ingredients

*Verified* formulas from the source tables (chapter 1):
- (c1) `weight change rate (%) = mass after cooking / mass before cooking × 100`.
- (c4) Nutrient amount in the whole cooked food:
  `amount = cooked value per 100 g edible × raw edible mass (g) / 100 × weight change rate (%) / 100`.
- Weight change rates are in "Table 12: outline of cooking methods and weight change rates" in the PDF (not in the workbook; extraction method decided in Phase 0).
- The analyses were done without seasonings except for a few foods. Seasonings are therefore always separate ingredients in recipes.

Rules:
1. If the food and cooking method exist in the tables, use the cooked value with (c4). Mapping class: **exact**.
2. If the cooked form does not exist (example: skinless young chicken breast has raw and grilled, but not boiled), use the raw value. Mapping class: **approximation**, with the reason shown. Whether to apply the group-level "rates of change of components by cooking" (chapter 3) is decided in Phase 0.
3. **No double counting of cooking oil.** Cooked values for stir-fried, sautéed, and fried foods already include the oil absorbed during the analysis (Tables 13–14). When such a cooked value is used, the oil used for cooking that food is **not** added as a separate ingredient. *Verified* (Table 14): 100 g of raw vegetables stir-fried with 5.0 g of oil gained 2.7–4.6 g of fat; farmed Atlantic salmon sautéed with 5.0 g of oil lost 2.8 g.
4. Cooking oil when no oil-cooked form is used (raw or other cooked values): the authored amount of oil is counted in full and shown as an assumption (ADR-022). Table 14 indicates 80–98% of pan oil stays in the food; for the validation recipes the difference is 0.3–0.9 g of fat per serving.
5. Weight change rates are relative to the raw edible portion, except where the tables remove parts after cooking (`postCookingRefuse` in `data/composition/cooking.json`, for example the shell of boiled eggs or the peel of steamed potatoes). Those entries are approximations when the recipe states the raw edible mass.
6. For starchy staples, recipes may state the mass in the state the tables provide (cooked rice, boiled or dry pasta); no weight change rate is needed then.

Cooking data: weight change rates and Tables 13–14 rows are transcribed into `data/composition/cooking.json` (`docs/DATA_SOURCES.md` "Cooking tables").

## 6. Fried foods (ADR-010)

Fried recipes are allowed in the MVP and always labelled as estimates.

| Case | Calculation | Display |
|---|---|---|
| Cooked fried form exists for the food and method (example: tempura of farmed Atlantic salmon) | Cooked value with (c4) | "Estimate: fried foods vary with oil absorption" |
| No fried form | Raw value plus an oil absorption assumption derived from Table 13 for a similar food | Same note, plus a **range** |
| Frying oil in the pan | Not counted; only absorbed oil is counted (already included in fried cooked values, §5 rule 3) | Assumption shown in the basis |

A range that straddles a target boundary yields "near / uncertain", never "met".

## 7. Uncertainty classes

| Class | Examples | Display |
|---|---|---|
| Exact | Direct food code match, grams stated, cooked form available | Normal ("estimate" label always applies) |
| Approximation | Similar food used, raw value for a cooked ingredient, household measure conversion, estimated `( )` values | "approx." and reason in the basis |
| Hard to estimate | Absorbed frying oil, "a pinch", liquid discarded after cooking | Assumption stated; range shown when significant |

*Provisional*: show a range when approximation or hard-to-estimate items contribute more than about 10% of a displayed value.

## 8. Per-serving values and rounding

- Internal calculation uses full precision; rounding applies only to displayed values.
- Per-serving values = recipe totals / servings.
- *Provisional* display rounding: kcal to the nearest 10; protein, fat, and carbohydrate to whole grams; salt to 0.1 g.
- Formatting (decimal separator, unit labels) is locale-specific; values are not.

## 9. Target fit

- Each target is a range or a bound. Status per nutrient: **met** (inside), **near** (outside but within tolerance), **not met**.
- *Provisional* tolerance: ±10% of the bound; protein up to 3 g below its minimum.
- Uncertain values: evaluated on the range when a range is shown; straddling a boundary gives "near".

## 10. Bounded amount adjustment

- Only ingredients marked adjustable in the recipe can change, within their authored minimum, maximum, and step. Integer units stay integers.
- Linked ingredients (for example seasonings in the same group) scale proportionally with their group leader.
- The solver searches the allowed grid and picks the solution that meets the targets with the smallest relative change from the default amounts; ties use a stable order. The result is deterministic.
- If no in-bounds solution meets all targets, the closest solution is shown as "near" with the remaining gaps.

## 11. Locale invariance

Nutrition and recommendation functions take no locale input. Tests calculate every recipe in each locale context and require identical internal values (SPEC §15).

## 12. Tests

- Formula tests for (c4) and (c5) against hand-calculated values.
- Notation handling (unknown is never zero; trace and estimated flags).
- Uncertainty classification and range display thresholds.
- Fried-food handling.
- Adjustment solver: bounds, steps, integer units, linked ingredients, minimal change, determinism.
- Snapshot tests of every recipe's calculated values.
- Phase 0 cross-check: compare a few recipes with an independent calculation from the source values (the MEXT online database can combine foods; whether its results can be compared directly is to be checked).

## 13. Open items (要確認)

1. ~~Carbohydrate column~~: `CHOCDF-` (ADR-011). Display names in three locales are set with the UI catalogs.
2. How to extract Table 12 (weight change rates) and Tables 13–14 reliably from the PDF.
3. Whether to use the chapter 3 group-level rates of change for missing cooked forms.
4. Tolerance, rounding, and range threshold values (validated with the Phase 0 recipes).
5. Expected accuracy versus real cooking cannot be quantified without measurement; the UI states the limits instead.
