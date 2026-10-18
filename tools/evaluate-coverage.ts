/**
 * Phase 0 Stage 0.6: how many validation recipes meet representative targets with
 * fixed amounts and with bounded amount adjustment (docs/IMPLEMENTATION_PLAN.md
 * "Phase 0", item 6). Evaluation only; the product's fit and adjustment logic is
 * built in Phase 3.
 *
 *   node tools/evaluate-coverage.ts
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import * as z from "zod/mini";
import { foods } from "../content/foods.ts";
import { recipes } from "../content/recipes/index.ts";
import { calculateRecipe, type NutritionData } from "../domain/nutrition/calculate.ts";
import { compositionSubsetSchema } from "../shared/composition.ts";
import type { Allergen, Recipe } from "../shared/content.ts";
import { cookingDataSchema } from "../shared/cooking.ts";

const dataDir = path.join(import.meta.dirname, "..", "data", "composition");
const readJson = (name: string): unknown => JSON.parse(readFileSync(path.join(dataDir, name), "utf8"));
const data: NutritionData = {
  foods: new Map(foods.map((food) => [food.id, food])),
  composition: new Map(z.parse(compositionSubsetSchema, readJson("foods.json")).foods.map((food) => [food.code, food])),
  rates: new Map(z.parse(cookingDataSchema, readJson("cooking.json")).weightChangeRates.map((rate) => [rate.code, rate])),
};

interface Targets {
  readonly kcal: readonly [number, number];
  readonly proteinMin: number;
  readonly fatMax: number;
}

interface Scenario {
  readonly name: string;
  readonly targets: Targets;
  readonly maxMinutes?: number;
  readonly excludeAllergen?: Allergen;
  /** Any of these foods must appear (for example any chicken cut). */
  readonly requireAnyFood?: readonly string[];
}

// Provisional presets and tolerance (docs/SPEC.md §16).
const CUT: Targets = { kcal: [450, 650], proteinMin: 35, fatMax: 15 };
const MAINTAIN: Targets = { kcal: [550, 750], proteinMin: 30, fatMax: 20 };
const BULK: Targets = { kcal: [750, 950], proteinMin: 45, fatMax: 30 };
const TOLERANCE = 0.1;
const PROTEIN_SHORTFALL = 3;

const scenarios: readonly Scenario[] = [
  { name: "S1 cut", targets: CUT },
  { name: "S2 cut, <=20 min", targets: CUT, maxMinutes: 20 },
  { name: "S3 maintain", targets: MAINTAIN },
  { name: "S4 bulk", targets: BULK },
  { name: "S5 cut, no egg", targets: CUT, excludeAllergen: "egg" },
  { name: "S6 maintain, chicken required", targets: MAINTAIN, requireAnyFood: ["chicken_breast", "chicken_thigh", "chicken_mince"] },
  { name: "S7 maintain, tofu required", targets: MAINTAIN, requireAnyFood: ["tofu_firm", "tofu_silken"] },
  { name: "S8 bulk, <=25 min", targets: BULK, maxMinutes: 25 },
];

type Status = "met" | "near" | "not_met";

interface Point {
  readonly kcal: number;
  readonly protein: number;
  readonly fat: number;
}

function status(point: Point, targets: Targets): Status {
  const [low, high] = targets.kcal;
  const kcal = point.kcal >= low && point.kcal <= high ? "met" : point.kcal >= low * (1 - TOLERANCE) && point.kcal <= high * (1 + TOLERANCE) ? "near" : "not_met";
  const protein = point.protein >= targets.proteinMin ? "met" : point.protein >= targets.proteinMin - PROTEIN_SHORTFALL ? "near" : "not_met";
  const fat = point.fat <= targets.fatMax ? "met" : point.fat <= targets.fatMax * (1 + TOLERANCE) ? "near" : "not_met";
  const all = [kcal, protein, fat];
  return all.includes("not_met") ? "not_met" : all.includes("near") ? "near" : "met";
}

/** Per-serving contribution of each ingredient per gram, so amounts can vary linearly. */
function perGram(recipe: Recipe): Map<string, Point> {
  const result = calculateRecipe(recipe, data);
  const contributions = new Map<string, Point>();
  for (const [index, ingredient] of result.ingredients.entries()) {
    const grams = recipe.ingredients[index]?.grams ?? 1;
    const factor = ingredient.counted ? 1 / grams / recipe.servings : 0;
    contributions.set(ingredient.key, {
      kcal: (ingredient.amounts.ENERC_KCAL ?? 0) * factor,
      protein: (ingredient.amounts["PROT-"] ?? 0) * factor,
      fat: (ingredient.amounts["FAT-"] ?? 0) * factor,
    });
  }
  return contributions;
}

function evaluate(recipe: Recipe, amounts: ReadonlyMap<string, number>, contributions: ReadonlyMap<string, Point>): Point {
  let kcal = 0;
  let protein = 0;
  let fat = 0;
  for (const ingredient of recipe.ingredients) {
    const c = contributions.get(ingredient.key);
    const grams = amounts.get(ingredient.key) ?? ingredient.grams;
    if (c) {
      kcal += c.kcal * grams;
      protein += c.protein * grams;
      fat += c.fat * grams;
    }
  }
  return { kcal, protein, fat };
}

interface Fit {
  readonly status: Status;
  readonly point: Point;
  readonly changes: readonly string[];
}

const RANK: Record<Status, number> = { met: 0, near: 1, not_met: 2 };

/** Grid search inside authored bounds; best status first, then the smallest relative change. */
function bestAdjusted(recipe: Recipe, targets: Targets): Fit {
  const contributions = perGram(recipe);
  const adjustable = recipe.ingredients.filter((ingredient) => ingredient.adjust !== undefined);
  const grids = adjustable.map((ingredient) => {
    const { min, max, step } = ingredient.adjust ?? { min: ingredient.grams, max: ingredient.grams, step: 1 };
    const values: number[] = [];
    for (let value = min; value <= max + 1e-9; value += step) values.push(Number(value.toFixed(6)));
    return values;
  });
  let best: { fit: Fit; cost: number } | undefined;
  const choose = (index: number, amounts: Map<string, number>) => {
    if (index === adjustable.length) {
      const point = evaluate(recipe, amounts, contributions);
      const fitStatus = status(point, targets);
      const cost = adjustable.reduce((sum, ingredient) => sum + Math.abs((amounts.get(ingredient.key) ?? ingredient.grams) - ingredient.grams) / ingredient.grams, 0);
      if (!best || RANK[fitStatus] < RANK[best.fit.status] || (RANK[fitStatus] === RANK[best.fit.status] && cost < best.cost - 1e-9)) {
        const changes = adjustable
          .filter((ingredient) => amounts.get(ingredient.key) !== ingredient.grams)
          .map((ingredient) => `${ingredient.key} ${String(ingredient.grams)}→${String(amounts.get(ingredient.key))}`);
        best = { fit: { status: fitStatus, point, changes }, cost };
      }
      return;
    }
    for (const value of grids[index] ?? []) {
      const ingredient = adjustable[index];
      if (ingredient) amounts.set(ingredient.key, value);
      choose(index + 1, amounts);
    }
  };
  choose(0, new Map());
  if (!best) throw new Error(recipe.id);
  return best.fit;
}

function eligible(recipe: Recipe, scenario: Scenario): boolean {
  if (scenario.maxMinutes !== undefined && recipe.minutes > scenario.maxMinutes) return false;
  if (scenario.requireAnyFood && !recipe.ingredients.some((ingredient) => scenario.requireAnyFood?.includes(ingredient.food))) return false;
  if (scenario.excludeAllergen) {
    const allergen = scenario.excludeAllergen;
    const blocked = recipe.ingredients.some((ingredient) => {
      const food = data.foods.get(ingredient.food);
      return !food || food.allergens === "unknown" || food.allergens.some((link) => link.allergen === allergen);
    });
    if (blocked) return false;
  }
  return true;
}

const mainProtein = (recipe: Recipe) => recipe.ingredients.find((ingredient) => ingredient.role === "main_protein")?.food ?? "?";

/** Smallest library size N with P(X >= 3) >= 0.9 for X ~ Binomial(N, p). */
function neededFor90(p: number): number | null {
  if (p <= 0) return null;
  for (let n = 3; n <= 2000; n++) {
    let below = 0;
    for (let k = 0; k < 3; k++) {
      let comb = 1;
      for (let i = 0; i < k; i++) comb = (comb * (n - i)) / (i + 1);
      below += comb * p ** k * (1 - p) ** (n - k);
    }
    if (1 - below >= 0.9) return n;
  }
  return null;
}

console.log(`Validation recipes: ${String(recipes.length)}. Tolerance ±${String(TOLERANCE * 100)} %, protein −${String(PROTEIN_SHORTFALL)} g.\n`);
for (const scenario of scenarios) {
  const pool = recipes.filter((recipe) => eligible(recipe, scenario));
  const fixed = pool.map((recipe) => ({ recipe, fit: status(evaluate(recipe, new Map(), perGram(recipe)), scenario.targets) }));
  const adjusted = pool.map((recipe) => ({ recipe, fit: bestAdjusted(recipe, scenario.targets) }));
  const metFixed = fixed.filter((entry) => entry.fit === "met");
  const metAdjusted = adjusted.filter((entry) => entry.fit.status === "met");
  const nearAdjusted = adjusted.filter((entry) => entry.fit.status === "near");
  const distinct = new Set(metAdjusted.map((entry) => mainProtein(entry.recipe))).size;
  const p = metAdjusted.length / recipes.length;
  console.log(scenario.name);
  console.log(`  eligible ${String(pool.length)}/${String(recipes.length)}; met fixed ${String(metFixed.length)}; met adjusted ${String(metAdjusted.length)} (near ${String(nearAdjusted.length)}); distinct main proteins among met ${String(distinct)}`);
  console.log(`  share of library met with adjustment ${(p * 100).toFixed(0)} %; library size for >=3 met with 90 % probability ≈ ${String(neededFor90(p) ?? "n/a")}`);
  for (const entry of metAdjusted) {
    const { point, changes } = entry.fit;
    console.log(`    ${entry.recipe.id.padEnd(28)} ${point.kcal.toFixed(0).padStart(4)} kcal P ${point.protein.toFixed(1).padStart(5)} F ${point.fat.toFixed(1).padStart(5)}  ${changes.join(", ") || "(default amounts)"}`);
  }
}
