/**
 * Input validation and contradiction checks (ADR-029 API and D9). Errors are typed
 * values in a stable order; valid input is returned normalized (sorted, without
 * duplicates) so that equal requests give equal results.
 */
import type { Result } from "../nutrition/amounts.ts";
import type { Bound, Contradiction, InputError, InputField, PoolRequest, Preset, RecipeId, Session, SessionField, Targets } from "./types.ts";

/** ADR-025 presets (per meal; examples, not advice). */
const PRESETS: Readonly<Record<Preset, Targets>> = {
  cut: { kcal: { min: 450, max: 650 }, proteinMin: 35, fatMax: 15 },
  maintain: { kcal: { min: 550, max: 750 }, proteinMin: 30, fatMax: 20 },
  bulk: { kcal: { min: 750, max: 950 }, proteinMin: 45, fatMax: 30 },
};

export function presetTargets(preset: Preset): Targets {
  return PRESETS[preset];
}

/** Provisional input limits (ADR-029; open question 19). */
export const INPUT_LIMITS = {
  kcal: { min: 100, max: 2000 },
  proteinMin: { min: 0, max: 200 },
  fatMax: { min: 0, max: 150 },
  carbohydrate: { min: 0, max: 400 },
  maxMinutes: { min: 5, max: 240 },
  servings: { min: 1, max: 20 },
} as const;

/** Fit tolerance (ADR-025): ±10 % of a bound; protein up to 3 g below its minimum. */
export const TOLERANCE = 0.1;
export const PROTEIN_SHORTFALL = 3;

/** General energy factor for protein and carbohydrate (an assumption; ADR-029 D9). */
export const KCAL_PER_GRAM_PROTEIN_OR_CARBOHYDRATE = 4;
export const CONTRADICTION_WARNING_SHARE = 0.8;

const MAX_SEED = 0xffffffff;

function checkNumber(field: InputField, value: number, limits: Bound, errors: InputError[]): void {
  if (!Number.isFinite(value)) errors.push({ code: "invalid_number", field, value });
  else if (value < limits.min || value > limits.max) errors.push({ code: "out_of_range", field, value, min: limits.min, max: limits.max });
}

function checkBound(field: "kcal" | "carbohydrate", bound: Bound, limits: Bound, errors: InputError[]): void {
  const before = errors.length;
  checkNumber(`${field}.min`, bound.min, limits, errors);
  checkNumber(`${field}.max`, bound.max, limits, errors);
  if (errors.length === before && bound.min > bound.max) errors.push({ code: "inverted_bound", field, min: bound.min, max: bound.max });
}

const sortedUnique = <T extends string>(values: readonly T[]): T[] => [...new Set(values)].sort();

/** Validates targets, servings, and conditions against the food dictionary. */
export function validatePoolRequest(request: PoolRequest, foods: ReadonlySet<string> | ReadonlyMap<string, unknown>): Result<PoolRequest, InputError> {
  const errors: InputError[] = [];
  const { targets, servings, conditions } = request;

  checkBound("kcal", targets.kcal, INPUT_LIMITS.kcal, errors);
  if (targets.proteinMin !== undefined) checkNumber("proteinMin", targets.proteinMin, INPUT_LIMITS.proteinMin, errors);
  if (targets.fatMax !== undefined) checkNumber("fatMax", targets.fatMax, INPUT_LIMITS.fatMax, errors);
  if (targets.carbohydrate !== undefined) checkBound("carbohydrate", targets.carbohydrate, INPUT_LIMITS.carbohydrate, errors);
  if (!Number.isInteger(servings) || servings < INPUT_LIMITS.servings.min || servings > INPUT_LIMITS.servings.max) {
    errors.push({ code: "invalid_servings", servings });
  }
  if (conditions.maxMinutes !== undefined) checkNumber("maxMinutes", conditions.maxMinutes, INPUT_LIMITS.maxMinutes, errors);

  const excludedFoods = sortedUnique(conditions.excludedFoods);
  for (const food of excludedFoods) if (!foods.has(food)) errors.push({ code: "unknown_food", field: "excludedFoods", food });
  const requiredFoods = conditions.requiredFoods.map((item) => sortedUnique(item));
  for (const food of sortedUnique(requiredFoods.flat())) if (!foods.has(food)) errors.push({ code: "unknown_food", field: "requiredFoods", food });
  const excluded = new Set(excludedFoods);
  requiredFoods.forEach((item, index) => {
    if (item.length === 0) errors.push({ code: "empty_required_item", index });
    else if (item.every((food) => excluded.has(food))) errors.push({ code: "required_and_excluded", index, foods: item });
  });

  if (errors.length > 0) return { ok: false, errors };
  return {
    ok: true,
    value: {
      targets,
      servings,
      conditions: {
        ...conditions,
        ...(conditions.equipment === undefined ? {} : { equipment: sortedUnique(conditions.equipment) }),
        excludedFoods,
        excludedAllergens: sortedUnique(conditions.excludedAllergens),
        requiredFoods,
        cuisines: sortedUnique(conditions.cuisines),
      },
    },
  };
}

/** Validates the session and seed against the recipe IDs. `previous` and `keep` keep their order. */
export function validateSession(session: Session, seed: number, recipes: ReadonlySet<RecipeId>): Result<Session, InputError> {
  const errors: InputError[] = [];
  const fields: readonly SessionField[] = ["shown", "excluded", "previous", "keep"];
  for (const field of fields) {
    for (const recipe of sortedUnique(session[field])) if (!recipes.has(recipe)) errors.push({ code: "unknown_recipe", field, recipe });
  }
  if (!Number.isInteger(seed) || seed < 0 || seed > MAX_SEED) errors.push({ code: "invalid_seed", seed });
  if (errors.length > 0) return { ok: false, errors };
  const inOrder = (values: readonly RecipeId[]) => [...new Set(values)];
  return {
    ok: true,
    value: { shown: sortedUnique(session.shown), excluded: sortedUnique(session.excluded), previous: inOrder(session.previous), keep: inOrder(session.keep) },
  };
}

/**
 * A protein and carbohydrate minimum whose energy alone reaches the kcal maximum
 * (ADR-029 D9): blocking when even the tolerance cannot make room, a warning from
 * 80 % of the maximum.
 */
export function checkContradictions(targets: Targets): Contradiction[] {
  const protein = targets.proteinMin ?? 0;
  const carbohydrate = targets.carbohydrate?.min ?? 0;
  if (protein === 0 && carbohydrate === 0) return [];
  const factor = KCAL_PER_GRAM_PROTEIN_OR_CARBOHYDRATE;
  const minimumKcal = factor * protein + factor * carbohydrate;
  const minimumKcalWithTolerance = factor * Math.max(protein - PROTEIN_SHORTFALL, 0) + factor * (1 - TOLERANCE) * carbohydrate;
  const kcalMax = targets.kcal.max;
  const severity =
    minimumKcalWithTolerance > kcalMax * (1 + TOLERANCE) ? "blocking" : minimumKcal >= kcalMax * CONTRADICTION_WARNING_SHARE ? "warning" : undefined;
  return severity === undefined ? [] : [{ code: "minimum_energy_exceeds_kcal_max", severity, minimumKcal, minimumKcalWithTolerance, kcalMax }];
}
