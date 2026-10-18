/**
 * Recommendation input built from the calculation bundle (ADR-027, ADR-029): the
 * nutrition engine data plus what the filters and diversification need.
 */
import type { BundleRecipe, CalcBundle } from "../../shared/bundle.ts";
import type { AllergenLink, ProteinGroup } from "../../shared/content.ts";
import { engineDataFromBundle, type EngineData } from "../nutrition/data.ts";

export interface RecommendationFood {
  readonly allergens: "unknown" | readonly AllergenLink[];
  readonly proteinGroup: ProteinGroup | undefined;
}

export interface RecommendationData {
  readonly engine: EngineData;
  readonly foods: ReadonlyMap<string, RecommendationFood>;
  /** Sorted by recipe ID so that every later step starts from a stable order. */
  readonly recipes: readonly BundleRecipe[];
}

export function recommendationDataFromBundle(calc: CalcBundle): RecommendationData {
  return {
    engine: engineDataFromBundle(calc),
    foods: new Map(calc.foods.map((food) => [food.id, { allergens: food.allergens, proteinGroup: food.proteinGroup }])),
    recipes: [...calc.recipes].sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0)),
  };
}
