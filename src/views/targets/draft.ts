/**
 * The targets and conditions form (docs/en/UI_DESIGN.md §3.1, §7). Fields hold the text the
 * user typed; `draftToRequest` turns them into the engine request without changing any
 * value. Invalid numbers become NaN so that the engine reports `invalid_number`.
 */
import type { Relaxation } from "../../../domain/recommendation/relax";
import type { FoodId, PoolRequest, Preset } from "../../../domain/recommendation/types";
import { INPUT_LIMITS, presetTargets } from "../../../domain/recommendation/validate";
import type { Allergen, Cuisine, Equipment } from "../../../shared/content";

export const NUMBER_FIELDS = ["kcalMin", "kcalMax", "proteinMin", "fatMax", "carbohydrateMin", "carbohydrateMax", "maxMinutes", "servings"] as const;
export type NumberField = (typeof NUMBER_FIELDS)[number];

export type EquipmentMode = "no_limit" | "microwave_only" | "choose";

/** A chosen ingredient: one food, or every food of a protein group. */
export interface FoodChoice {
  readonly key: string;
  readonly foods: readonly FoodId[];
}

export interface TargetsDraft {
  readonly preset: Preset;
  /** The four target fields no longer equal the preset's values. */
  readonly edited: boolean;
  readonly numbers: Readonly<Record<NumberField, string>>;
  readonly effort: 1 | 2 | 3 | undefined;
  readonly cuisines: readonly Cuisine[];
  readonly equipmentMode: EquipmentMode;
  readonly equipment: readonly Equipment[];
  readonly required: readonly FoodChoice[];
  readonly excluded: readonly FoodChoice[];
  readonly allergens: readonly Allergen[];
}

export const DEFAULT_PRESET: Preset = "maintain";

function presetNumbers(preset: Preset): Pick<Record<NumberField, string>, "kcalMin" | "kcalMax" | "proteinMin" | "fatMax"> {
  const targets = presetTargets(preset);
  return {
    kcalMin: String(targets.kcal.min),
    kcalMax: String(targets.kcal.max),
    proteinMin: targets.proteinMin === undefined ? "" : String(targets.proteinMin),
    fatMax: targets.fatMax === undefined ? "" : String(targets.fatMax),
  };
}

export function defaultDraft(preset: Preset = DEFAULT_PRESET): TargetsDraft {
  return {
    preset,
    edited: false,
    numbers: { ...presetNumbers(preset), carbohydrateMin: "", carbohydrateMax: "", maxMinutes: "", servings: "1" },
    effort: undefined,
    cuisines: [],
    equipmentMode: "no_limit",
    equipment: [],
    required: [],
    excluded: [],
    allergens: [],
  };
}

/** Choosing a preset overwrites the four target fields (docs/en/UI_DESIGN.md §3.1). */
export function withPreset(draft: TargetsDraft, preset: Preset): TargetsDraft {
  return { ...draft, preset, edited: false, numbers: { ...draft.numbers, ...presetNumbers(preset) } };
}

export function withNumber(draft: TargetsDraft, field: NumberField, text: string): TargetsDraft {
  const numbers = { ...draft.numbers, [field]: text };
  const preset = presetNumbers(draft.preset);
  const edited = (Object.keys(preset) as (keyof typeof preset)[]).some((key) => numbers[key].trim() !== preset[key]);
  return { ...draft, numbers, edited };
}

/**
 * Parses a typed number: full-width digits are folded (NFKC) and a decimal comma is
 * accepted, so "35,5" and "３５" read as numbers in every locale. Empty is undefined;
 * anything else that is not a number is NaN.
 */
export function parseNumber(text: string): number | undefined {
  const normalized = text.normalize("NFKC").trim().replace(",", ".");
  if (normalized === "") return undefined;
  return /^[+-]?(\d+\.?\d*|\.\d+)$/.test(normalized) ? Number(normalized) : Number.NaN;
}

const STEPS: Readonly<Record<NumberField, number>> = {
  kcalMin: 10,
  kcalMax: 10,
  proteinMin: 1,
  fatMax: 1,
  carbohydrateMin: 5,
  carbohydrateMax: 5,
  maxMinutes: 5,
  servings: 1,
};

const LIMITS: Readonly<Record<NumberField, { readonly min: number; readonly max: number }>> = {
  kcalMin: INPUT_LIMITS.kcal,
  kcalMax: INPUT_LIMITS.kcal,
  proteinMin: INPUT_LIMITS.proteinMin,
  fatMax: INPUT_LIMITS.fatMax,
  carbohydrateMin: INPUT_LIMITS.carbohydrate,
  carbohydrateMax: INPUT_LIMITS.carbohydrate,
  maxMinutes: INPUT_LIMITS.maxMinutes,
  servings: INPUT_LIMITS.servings,
};

export function limitsOf(field: NumberField): { readonly min: number; readonly max: number; readonly step: number } {
  return { ...LIMITS[field], step: STEPS[field] };
}

/**
 * A stepper press: one step up or down from the typed value, clamped to the input
 * limits. An empty or invalid field starts from the nearest limit.
 */
export function stepped(text: string, field: NumberField, direction: 1 | -1): string {
  const { min, max, step } = limitsOf(field);
  const value = parseNumber(text);
  if (value === undefined || Number.isNaN(value)) return String(direction > 0 ? min : max);
  const next = Math.round((value + direction * step) / step) * step;
  return String(Math.min(max, Math.max(min, next)));
}

const EQUIPMENT_FOR_MODE: Readonly<Record<Exclude<EquipmentMode, "choose">, readonly Equipment[] | undefined>> = {
  no_limit: undefined,
  microwave_only: ["microwave"],
};

/**
 * The engine request. A carbohydrate range with one side left empty uses the input
 * limit for that side; targets left empty are not set.
 */
export function draftToRequest(draft: TargetsDraft): PoolRequest {
  const read = (field: NumberField) => parseNumber(draft.numbers[field]);
  const number = (field: NumberField) => read(field) ?? Number.NaN;
  const proteinMin = read("proteinMin");
  const fatMax = read("fatMax");
  const carbohydrateMin = read("carbohydrateMin");
  const carbohydrateMax = read("carbohydrateMax");
  const maxMinutes = read("maxMinutes");
  const equipment = draft.equipmentMode === "choose" ? draft.equipment : EQUIPMENT_FOR_MODE[draft.equipmentMode];
  const hasCarbohydrate = carbohydrateMin !== undefined || carbohydrateMax !== undefined;

  return {
    targets: {
      kcal: { min: number("kcalMin"), max: number("kcalMax") },
      ...(proteinMin === undefined ? {} : { proteinMin }),
      ...(fatMax === undefined ? {} : { fatMax }),
      ...(hasCarbohydrate ? { carbohydrate: { min: carbohydrateMin ?? INPUT_LIMITS.carbohydrate.min, max: carbohydrateMax ?? INPUT_LIMITS.carbohydrate.max } } : {}),
    },
    servings: number("servings"),
    conditions: {
      ...(maxMinutes === undefined ? {} : { maxMinutes }),
      ...(equipment === undefined ? {} : { equipment }),
      excludedFoods: draft.excluded.flatMap((choice) => choice.foods),
      excludedAllergens: draft.allergens,
      requiredFoods: draft.required.map((choice) => choice.foods),
      ...(draft.effort === undefined ? {} : { effort: draft.effort }),
      cuisines: draft.cuisines,
    },
  };
}

/**
 * The draft with one relaxation applied (ADR-029 D8, ADR-030 D7). A group choice that
 * loses one of its foods is split into its remaining foods, so no chip names a group
 * that is no longer complete.
 */
export function relaxedDraft(draft: TargetsDraft, relaxation: Relaxation): TargetsDraft {
  switch (relaxation.constraint) {
    case "maxMinutes":
      return { ...draft, numbers: { ...draft.numbers, maxMinutes: String(relaxation.to) } };
    case "equipment": {
      const current = draft.equipmentMode === "choose" ? draft.equipment : (EQUIPMENT_FOR_MODE[draft.equipmentMode] ?? []);
      return { ...draft, equipmentMode: "choose", equipment: [...new Set([...current, relaxation.add])] };
    }
    case "requiredFood":
      return { ...draft, required: draft.required.filter((_, index) => index !== relaxation.index) };
    case "excludedFood":
      return {
        ...draft,
        excluded: draft.excluded.flatMap((choice) => {
          if (!choice.foods.includes(relaxation.food)) return [choice];
          return choice.foods.filter((food) => food !== relaxation.food).map((food) => ({ key: food, foods: [food] }));
        }),
      };
  }
}
