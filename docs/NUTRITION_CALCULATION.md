# Nutrition Calculation — Recipe Discovery

Status: **Draft (2026-10-18)**. Formulas quoted from the source tables are *Verified* (read in the official PDF on 2026-10-18; see `docs/DECISIONS.md` "Verification log"). Column choices, rounding, tolerances, and thresholds are *Provisional* until Phase 0 and Phase 2 confirm them with real data. Changing anything here needs the owner's approval and an ADR (CLAUDE.md Part B, principle 5).

## 1. Source data

- Standard Tables of Food Composition in Japan 2020 (Eighth Revised Edition), Updated and Enlarged Version 2023 (日本食品標準成分表（八訂）増補2023年), MEXT. Workbook version: updated 2026-03-27 (includes errata). Handling rules and attribution: `docs/DATA_SOURCES.md`.
- *Verified*: all values are per 100 g of edible portion. The edible portion is the food as purchased minus the parts normally discarded; the refuse rate is the discarded share in mass %.
- *Verified*: the tables list 2,538 foods, including cooked forms (for example boiled, grilled, stir-fried, sautéed, deep-fried, tempura, breaded and fried, steamed, microwaved).

## 2. Nutrients and source columns (*Provisional*, ADR-011)

| Displayed nutrient | Column (component identifier) | Reason |
|---|---|---|
| Energy (kcal) | `ENERC_KCAL` | Complete for all 2,538 foods |
| Protein | `PROT-` (たんぱく質) | Nearly complete (1 unmeasured); close to common nutrition labels |
| Fat | `FAT-` (脂質) | Nearly complete (1 unmeasured); close to common nutrition labels |
| Carbohydrate | To be decided in Phase 0: `CHOAVLDF-` (差引き法による利用可能炭水化物) or `CHOCDF-` (炭水化物) | Both nearly complete; they differ in meaning (available carbohydrate vs total) |
| Salt equivalent (optional) | `NACL_EQ` | Nearly complete |

Measured facts from the workbook (2026-10-18): the amino-acid-based protein column `PROTCAA` is unmeasured for 422 foods (17%) and estimated for 1,263; where both exist it is a median 15% lower than `PROT-`. The triacylglycerol-equivalent fat column `FATNLEA` is unmeasured for 436 foods (17%) and a median 8% lower than `FAT-`.

Consequence: the source energy values are computed from component-based values, so the displayed energy will generally not equal 4 × protein + 9 × fat + 4 × carbohydrate. The detail view explains this.

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
3. Cooking oil for stir-frying and sautéing: the authored amount of oil is counted as fully consumed (conservative for fat). Using the per-food oil data of Table 14 is a possible refinement.

## 6. Fried foods (ADR-010)

Fried recipes are allowed in the MVP and always labelled as estimates.

| Case | Calculation | Display |
|---|---|---|
| Cooked fried form exists for the food and method (example: tempura of farmed Atlantic salmon) | Cooked value with (c4) | "Estimate: fried foods vary with oil absorption" |
| No fried form | Raw value plus an oil absorption assumption derived from Table 13 for a similar food | Same note, plus a **range** |
| Frying oil in the pan | Not counted; only absorbed oil is counted | Assumption shown in the basis |

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

1. Carbohydrate column (`CHOAVLDF-` or `CHOCDF-`) and its display name in three locales.
2. How to extract Table 12 (weight change rates) and Tables 13–14 reliably from the PDF.
3. Whether to use the chapter 3 group-level rates of change for missing cooked forms.
4. Tolerance, rounding, and range threshold values (validated with the Phase 0 recipes).
5. Expected accuracy versus real cooking cannot be quantified without measurement; the UI states the limits instead.
