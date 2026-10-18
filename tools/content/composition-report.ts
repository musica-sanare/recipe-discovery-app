/**
 * Composition coverage report (Phase 1 Stage 1.3): for each recipe ingredient, how
 * its nutrition is obtained — exact, approximation (with reasons), or hard to
 * estimate — and whether it is fried or not counted. The classification comes from
 * the calculation itself (docs/NUTRITION_CALCULATION.md §5–§7).
 */
import { calculateIngredient, type ApproximationReason, type NutritionData } from "../../domain/nutrition/calculate.ts";
import type { Recipe } from "../../shared/content.ts";
import { isFriedIngredient } from "../../shared/recipe.ts";

export type CoverageClass = "exact" | "approximation" | "hard_to_estimate" | "not_counted";

export interface IngredientCoverage {
  readonly key: string;
  readonly food: string;
  readonly state: string;
  readonly code: string;
  readonly cooking: string | undefined;
  readonly coverage: CoverageClass;
  readonly reasons: readonly (ApproximationReason | "slow_frying")[];
  readonly fried: boolean;
  readonly includedIn: string | undefined;
}

export interface RecipeCoverage {
  readonly recipeId: string;
  readonly ingredients: readonly IngredientCoverage[];
  readonly counts: Readonly<Record<CoverageClass | "fried", number>>;
}

/** Throws, naming the recipe and ingredient, when a cooked state lacks its weight change rate. */
export function compositionCoverage(recipe: Recipe, data: NutritionData): RecipeCoverage {
  const ingredients = recipe.ingredients.map((ingredient): IngredientCoverage => {
    let result;
    try {
      result = calculateIngredient(ingredient, data);
    } catch (error) {
      throw new Error(`${recipe.id} › ingredients.${ingredient.key}: ${error instanceof Error ? error.message : String(error)}`, { cause: error });
    }
    const counted = ingredient.includedIn === undefined;
    const hard = ingredient.estimate !== undefined;
    return {
      key: ingredient.key,
      food: ingredient.food,
      state: ingredient.state,
      code: result.code,
      cooking: ingredient.cooking,
      coverage: !counted ? "not_counted" : hard ? "hard_to_estimate" : result.mapping,
      reasons: [...result.reasons, ...(ingredient.estimate ? [ingredient.estimate] : [])],
      fried: counted && isFriedIngredient(ingredient),
      includedIn: ingredient.includedIn,
    };
  });
  const counts = { exact: 0, approximation: 0, hard_to_estimate: 0, not_counted: 0, fried: 0 };
  for (const ingredient of ingredients) {
    counts[ingredient.coverage] += 1;
    if (ingredient.fried) counts.fried += 1;
  }
  return { recipeId: recipe.id, ingredients, counts };
}

const LABELS: Record<CoverageClass, string> = {
  exact: "exact",
  approximation: "approximation",
  hard_to_estimate: "hard to estimate",
  not_counted: "not counted",
};

function describe(ingredient: IngredientCoverage): string {
  const parts = [LABELS[ingredient.coverage]];
  if (ingredient.reasons.length > 0) parts.push(`(${ingredient.reasons.join(", ")})`);
  if (ingredient.fried) parts.push("[fried]");
  if (ingredient.includedIn !== undefined) parts.push(`(included in ${ingredient.includedIn})`);
  return parts.join(" ");
}

function summary(counts: RecipeCoverage["counts"]): string {
  return `exact ${String(counts.exact)}, approximation ${String(counts.approximation)}, hard to estimate ${String(counts.hard_to_estimate)}, not counted ${String(counts.not_counted)}, fried ${String(counts.fried)}`;
}

/** Plain-text report: one block per recipe, then library totals. Deterministic. */
export function formatCompositionReport(report: readonly RecipeCoverage[]): string {
  const lines: string[] = [];
  const totals = { exact: 0, approximation: 0, hard_to_estimate: 0, not_counted: 0, fried: 0 };
  for (const recipe of report) {
    lines.push(`${recipe.recipeId}: ${summary(recipe.counts)}`);
    for (const ingredient of recipe.ingredients) {
      const state = `${ingredient.state} ${ingredient.code}${ingredient.cooking ? `, cooked: ${ingredient.cooking}` : ""}`;
      lines.push(`  ${ingredient.key.padEnd(15)} ${ingredient.food.padEnd(24)} ${state.padEnd(30)} ${describe(ingredient)}`);
    }
    for (const key of Object.keys(totals) as (keyof typeof totals)[]) totals[key] += recipe.counts[key];
  }
  const withUncertainty = report.filter((recipe) => recipe.counts.approximation + recipe.counts.hard_to_estimate + recipe.counts.fried > 0).length;
  lines.push("", `Total (${String(report.length)} recipes): ${summary(totals)}`, `Recipes with an approximation, hard-to-estimate, or fried ingredient: ${String(withUncertainty)}`);
  return lines.join("\n");
}
