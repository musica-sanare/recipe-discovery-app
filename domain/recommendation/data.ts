/**
 * Recommendation input built from the calculation bundle (ADR-027, ADR-029): the
 * nutrition engine data plus what the filters and diversification need, and the solver
 * results that do not depend on a request (Phase 9 Stage 9.3).
 */
import type { BundleRecipe, CalcBundle } from "../../shared/bundle.ts";
import type { AllergenLink, ProteinGroup } from "../../shared/content.ts";
import { engineDataFromBundle, type EngineData } from "../nutrition/data.ts";
import { precompute, type Precomputed } from "./solver.ts";

export interface RecommendationFood {
  readonly allergens: "unknown" | readonly AllergenLink[];
  readonly proteinGroup: ProteinGroup | undefined;
}

export interface RecommendationData {
  readonly engine: EngineData;
  readonly foods: ReadonlyMap<string, RecommendationFood>;
  /** Sorted by recipe ID so that every later step starts from a stable order. */
  readonly recipes: readonly BundleRecipe[];
  /** By recipe ID; computed once here so that every search reuses it. */
  readonly precomputed: ReadonlyMap<string, Precomputed>;
}

/**
 * With `precompute: false` the data has no precomputed solver results, so the UI can show
 * its first view before computing them (`withPrecomputed`). Searches give the same results
 * with or without them; they are only faster with them.
 */
export function recommendationDataFromBundle(calc: CalcBundle, { precompute: withResults = true }: { readonly precompute?: boolean } = {}): RecommendationData {
  const data: RecommendationData = {
    engine: engineDataFromBundle(calc),
    foods: new Map(calc.foods.map((food) => [food.id, { allergens: food.allergens, proteinGroup: food.proteinGroup }])),
    recipes: [...calc.recipes].sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0)),
    precomputed: new Map(),
  };
  return withResults ? withPrecomputed(data) : data;
}

/** The same data with the precomputed solver results of every recipe; the engine data and foods are shared. */
export function withPrecomputed(data: RecommendationData): RecommendationData {
  return { ...data, precomputed: new Map(data.recipes.map((recipe) => [recipe.id, precompute(recipe, data.engine)])) };
}
