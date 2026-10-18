/**
 * Engine input built from the calculation bundle (ADR-027, ADR-028 decision E), so the
 * browser and the build tools calculate from exactly the same data.
 */
import type { BUNDLE_NUTRIENT_IDS, BundleVersions, CalcBundle } from "../../shared/bundle.ts";
import type { CompositionValue } from "../../shared/composition.ts";
import type { FoodState } from "../../shared/content.ts";

/** Nutrients the engine calculates (ADR-011). */
export type Nutrient = (typeof BUNDLE_NUTRIENT_IDS)[number];

export interface EngineComposition {
  readonly refuse: CompositionValue;
  readonly nutrients: Readonly<Record<Nutrient, CompositionValue>>;
}

export interface EngineRate {
  readonly ratePercent: number;
  /** The tables remove parts after cooking (docs/NUTRITION_CALCULATION.md §5 rule 5). */
  readonly postCookingRefuse: boolean;
}

export interface EngineData {
  /** Food code per state, by food ID. */
  readonly foods: ReadonlyMap<string, Readonly<Partial<Record<FoodState, string>>>>;
  /** Composition by food code. */
  readonly composition: ReadonlyMap<string, EngineComposition>;
  /** Weight change rate by cooked food code. */
  readonly rates: ReadonlyMap<string, EngineRate>;
  readonly versions: Omit<BundleVersions, "schemaVersion">;
}

export function engineDataFromBundle(calc: CalcBundle): EngineData {
  return {
    foods: new Map(calc.foods.map((food) => [food.id, food.composition])),
    composition: new Map(calc.compositionFoods.map((food) => [food.code, { refuse: food.refuse, nutrients: food.nutrients }])),
    rates: new Map(calc.rates.map((rate) => [rate.code, { ratePercent: rate.ratePercent, postCookingRefuse: rate.postCookingRefuse === true }])),
    versions: { contentVersion: calc.contentVersion, composition: calc.composition },
  };
}
