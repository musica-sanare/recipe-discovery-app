/**
 * Traceable basis of every calculated value (docs/NUTRITION_CALCULATION.md §5–§7,
 * SPEC §15): food codes, data versions, cooking states, reasons, and the assumptions
 * behind each counted ingredient. Texts come from the UI catalogs; only codes are here.
 */
import type { Notation } from "../../shared/composition.ts";
import type { BundleRecipe } from "../../shared/bundle.ts";
import type { EngineData, Nutrient } from "./data.ts";
import { KCAL_PER_GRAM_FAT, type IngredientNutrition, type NotCounted, type Reason, type RecipeNutrition, type UncertaintyClass } from "./engine.ts";

type BundleIngredient = BundleRecipe["ingredients"][number];

/** Recipe fields the basis needs beyond the calculation. */
export interface BasisRecipe {
  readonly ingredients: readonly Pick<BundleIngredient, "key" | "role" | "measure">[];
  readonly substitutions: readonly Pick<BundleRecipe["substitutions"][number], "key" | "measure">[];
}

export type Assumption =
  /** Oil not contained in an oil-cooked value is counted in full (ADR-022). */
  | { readonly code: "oil_counted_in_full" }
  /** Listed but already contained in another ingredient's cooked value, for example frying oil or a coating (§5 rule 3). */
  | { readonly code: "included_in_cooked_value"; readonly ingredient: string }
  /** The tables remove parts after cooking while the recipe states the raw edible mass (§5 rule 5). */
  | { readonly code: "parts_removed_after_cooking" }
  /** Fried and slow-frying bands use this energy per gram of fat (ADR-028 decision B). */
  | { readonly code: "energy_from_fat"; readonly kcalPerGram: number }
  /** "A pinch" is a display aid; the calculation uses the stated grams (ADR-028 decision D). */
  | { readonly code: "pinch_as_stated_grams"; readonly grams: number };

export interface IngredientBasis {
  readonly key: string;
  readonly food: string;
  readonly code: string;
  readonly state: IngredientNutrition["state"];
  readonly cooking: IngredientNutrition["cooking"];
  readonly substitution: string | undefined;
  /** Workbook update date of the composition data. */
  readonly dataVersion: string;
  readonly ratePercent: number | undefined;
  readonly grams: number;
  readonly effectiveGrams: number;
  readonly counted: boolean;
  readonly notCounted: NotCounted | undefined;
  readonly class: UncertaintyClass;
  readonly reasons: readonly Reason[];
  readonly notations: Readonly<Partial<Record<Nutrient, Notation>>>;
  readonly assumptions: readonly Assumption[];
}

export interface RecipeBasis {
  readonly versions: EngineData["versions"];
  readonly ingredients: readonly IngredientBasis[];
}

function assumptionsFor(nutrition: IngredientNutrition, role: BundleIngredient["role"] | undefined, measure: BundleIngredient["measure"]): Assumption[] {
  const assumptions: Assumption[] = [];
  if (nutrition.includedIn !== undefined) assumptions.push({ code: "included_in_cooked_value", ingredient: nutrition.includedIn });
  if (nutrition.counted && role === "fat") assumptions.push({ code: "oil_counted_in_full" });
  if (nutrition.reasons.includes("post_cooking_refuse")) assumptions.push({ code: "parts_removed_after_cooking" });
  if (nutrition.reasons.includes("fried") || nutrition.reasons.includes("slow_frying")) assumptions.push({ code: "energy_from_fat", kcalPerGram: KCAL_PER_GRAM_FAT });
  if (measure?.unit === "pinch") assumptions.push({ code: "pinch_as_stated_grams", grams: nutrition.grams });
  return assumptions;
}

/** The basis of a calculated recipe, in ingredient order. */
export function nutritionBasis(recipe: BasisRecipe, nutrition: RecipeNutrition, data: Pick<EngineData, "versions">): RecipeBasis {
  const authored = new Map(recipe.ingredients.map((ingredient) => [ingredient.key, ingredient]));
  const substitutions = new Map(recipe.substitutions.map((substitution) => [substitution.key, substitution]));
  return {
    versions: data.versions,
    ingredients: nutrition.ingredients.map((ingredient): IngredientBasis => {
      const source = authored.get(ingredient.key);
      const substituted = ingredient.substitution === undefined ? undefined : substitutions.get(ingredient.substitution);
      const measure = substituted?.measure ?? source?.measure;
      return {
        key: ingredient.key,
        food: ingredient.food,
        code: ingredient.code,
        state: ingredient.state,
        cooking: ingredient.cooking,
        substitution: ingredient.substitution,
        dataVersion: data.versions.composition.workbookUpdated,
        ratePercent: ingredient.ratePercent,
        grams: ingredient.grams,
        effectiveGrams: ingredient.effectiveGrams,
        counted: ingredient.counted,
        notCounted: ingredient.notCounted,
        class: ingredient.class,
        reasons: ingredient.reasons,
        notations: ingredient.notations,
        assumptions: assumptionsFor(ingredient, source?.role, measure),
      };
    }),
  };
}
