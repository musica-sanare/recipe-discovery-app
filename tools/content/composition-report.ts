/**
 * Composition coverage report (Phase 1 Stage 1.3, migrated to the engine in Stage
 * 2.6): for each recipe ingredient at the default state, how its nutrition is
 * obtained — exact, approximation, or hard to estimate, with the engine's reasons
 * (ADR-028) — and whether it is fried or not counted.
 */
import { defaultState, type AmountRecipe } from "../../domain/nutrition/amounts.ts";
import type { EngineData } from "../../domain/nutrition/data.ts";
import { calculateNutrition, type Reason, type UncertaintyClass } from "../../domain/nutrition/engine.ts";

export type CoverageClass = UncertaintyClass | "not_counted";

export interface IngredientCoverage {
  readonly key: string;
  readonly food: string;
  readonly state: string;
  readonly code: string;
  readonly cooking: string | undefined;
  readonly coverage: CoverageClass;
  readonly reasons: readonly Reason[];
  readonly fried: boolean;
  readonly includedIn: string | undefined;
}

export interface RecipeCoverage {
  readonly recipeId: string;
  readonly ingredients: readonly IngredientCoverage[];
  readonly counts: Readonly<Record<CoverageClass | "fried", number>>;
}

/** Throws, naming the recipe and ingredient, when a cooked state lacks its weight change rate. */
export function compositionCoverage(recipe: AmountRecipe & { readonly id: string }, data: EngineData): RecipeCoverage {
  let result;
  try {
    result = calculateNutrition(recipe, defaultState(recipe), data);
  } catch (error) {
    throw new Error(`${recipe.id} › ${error instanceof Error ? error.message : String(error)}`, { cause: error });
  }
  if (!result.ok) throw new Error(`${recipe.id} › invalid default state: ${JSON.stringify(result.errors)}`);
  const ingredients = result.value.ingredients.map(
    (ingredient): IngredientCoverage => ({
      key: ingredient.key,
      food: ingredient.food,
      state: ingredient.state,
      code: ingredient.code,
      cooking: ingredient.cooking,
      coverage: ingredient.counted ? ingredient.class : "not_counted",
      reasons: ingredient.reasons,
      fried: ingredient.counted && ingredient.fried,
      includedIn: ingredient.includedIn,
    }),
  );
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
