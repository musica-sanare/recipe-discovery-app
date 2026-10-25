/**
 * Bounded adjustment solver (docs/en/NUTRITION_CALCULATION.md §10, ADR-024, ADR-026,
 * ADR-029 D4). The search space is every grid combination of the adjustable
 * ingredients times every subset of the sides the solver may switch off. For fixed
 * sides, per-serving values and range bounds are linear in each amount, so a linear
 * model from one engine call per ingredient scores the grid; the chosen state is
 * recalculated with the engine, and the exhaustive search is used when the engine's
 * fit differs from the prediction. Values shown to the user always come from the engine.
 */
import type { BundleRecipe } from "../../shared/bundle.ts";
import type { Adjust } from "../../shared/content.ts";
import { substitutedAdjust, type AmountRecipe, type RecipeState } from "../nutrition/amounts.ts";
import type { EngineData, Nutrient } from "../nutrition/data.ts";
import { NUTRIENTS, RANGE_EPSILON, RANGE_THRESHOLD, calculateNutrition, type Range, type RecipeNutrition } from "../nutrition/engine.ts";
import { compareFits, evaluateFit, fitEvaluator, type Fit } from "./fit.ts";
import type { ForcedState, Targets } from "./types.ts";

export interface SolverRecipe extends AmountRecipe {
  readonly sides: readonly Pick<BundleRecipe["sides"][number], "key" | "ingredients" | "solverMayRemove">[];
}

export interface SolveInput {
  readonly recipe: SolverRecipe;
  readonly targets: Targets;
  readonly servings: number;
  /** Sides switched off and substitutions applied because of excluded foods (ADR-029 D7). */
  readonly forced: ForcedState;
  /** Sides holding a required food; the solver keeps them on. */
  readonly lockedSides: readonly string[];
  /** From `precompute` for the same recipe and engine data; used only where it applies. */
  readonly precomputed?: Precomputed;
}

export interface AmountChange {
  readonly ingredient: string;
  /** In the state unit: grams, or whole units for `count` adjustment; at the authored servings. */
  readonly from: number;
  readonly to: number;
  readonly unit: "g" | "count";
}

export interface Solution {
  readonly state: RecipeState;
  readonly nutrition: RecipeNutrition;
  readonly fit: Fit;
  /** Fit of the forced default state (default amounts, no side switched off by the solver). */
  readonly defaultFit: Fit;
  /** Σ |g − g₀| / g₀ over the changeable ingredients. */
  readonly relativeChange: number;
  readonly changes: readonly AmountChange[];
  /** Sides the solver switched off (forced sides are in `state.sidesOff` only). */
  readonly sidesOff: readonly string[];
  readonly method: "linear" | "exhaustive";
}

type Nutrition = Pick<RecipeNutrition, "perServing" | "ranges">;

/** An adjustable ingredient after forced substitutions. */
interface Adjustable {
  readonly key: string;
  readonly unit: "g" | "count";
  /** State value of the default amount. */
  readonly defaultValue: number;
  /** Grid values, plus the default when it is off the grid; ascending. */
  readonly values: readonly number[];
}

const COST_EPSILON = 1e-9;

function gridValues(adjust: Adjust): number[] {
  if (adjust.kind === "count") return Array.from({ length: adjust.max - adjust.min + 1 }, (_, index) => adjust.min + index);
  const steps = Math.floor((adjust.max - adjust.min) / adjust.step + 1e-9);
  return Array.from({ length: steps + 1 }, (_, index) => adjust.min + index * adjust.step);
}

function adjustables(recipe: SolverRecipe, forced: ForcedState): Adjustable[] {
  const substitutionFor = new Map(
    recipe.substitutions.filter((substitution) => forced.substitutions.includes(substitution.key)).map((substitution) => [substitution.ingredient, substitution]),
  );
  return recipe.ingredients.flatMap((ingredient): Adjustable[] => {
    const substitution = substitutionFor.get(ingredient.key);
    const adjust = substitution ? substitutedAdjust(ingredient.adjust, substitution) : ingredient.adjust;
    if (!adjust) return [];
    const grams = ingredient.grams * (substitution?.ratio ?? 1);
    const defaultValue = adjust.kind === "count" ? grams / adjust.unitGrams : grams;
    const grid = gridValues(adjust);
    const values = grid.some((value) => Math.abs(value - defaultValue) < 1e-9) ? grid : [...grid, defaultValue].sort((a, b) => a - b);
    return [{ key: ingredient.key, unit: adjust.kind === "count" ? "count" : "g", defaultValue, values }];
  });
}

function calculate(recipe: SolverRecipe, state: RecipeState, data: EngineData): RecipeNutrition {
  const result = calculateNutrition(recipe, state, data);
  if (!result.ok) throw new Error(`${JSON.stringify(state)}: ${JSON.stringify(result.errors)}`);
  return result.value;
}

const isDefault = (adjustable: Adjustable, value: number) => Math.abs(value - adjustable.defaultValue) < 1e-9;

/** Vector of per-serving point, low, and high for every nutrient; `null` entries are unknown. */
function vector(nutrition: Nutrition): (number | null)[] {
  return NUTRIENTS.flatMap((nutrient) => {
    const range = nutrition.ranges[nutrient];
    return [nutrition.perServing[nutrient], range?.low ?? null, range?.high ?? null];
  });
}

interface MutableRange {
  low: number;
  high: number;
  shown: boolean;
}

/** Per-serving values and ranges that the linear model overwrites for every grid state. */
interface Scratch {
  readonly perServing: Record<Nutrient, number | null>;
  readonly ranges: Record<Nutrient, Range | null>;
  readonly rangeObjects: Record<Nutrient, MutableRange>;
}

function scratch(): Scratch {
  const perServing = {} as Record<Nutrient, number | null>;
  const ranges = {} as Record<Nutrient, Range | null>;
  const rangeObjects = {} as Record<Nutrient, MutableRange>;
  for (const nutrient of NUTRIENTS) {
    perServing[nutrient] = null;
    ranges[nutrient] = null;
    rangeObjects[nutrient] = { low: 0, high: 0, shown: false };
  }
  return { perServing, ranges, rangeObjects };
}

/**
 * Writes a vector into the scratch object and returns it. The result is only valid
 * until the next call; the fit evaluation reads it at once and keeps numbers only.
 */
function fromVector(values: readonly (number | null)[], into: Scratch): Nutrition {
  for (let index = 0; index < NUTRIENTS.length; index++) {
    const nutrient = NUTRIENTS[index];
    if (nutrient === undefined) continue;
    const point = values[index * 3] ?? null;
    const low = values[index * 3 + 1] ?? null;
    const high = values[index * 3 + 2] ?? null;
    into.perServing[nutrient] = point;
    if (point === null || low === null || high === null) {
      into.ranges[nutrient] = null;
      continue;
    }
    const range = into.rangeObjects[nutrient];
    range.low = low;
    range.high = high;
    range.shown = point - low + (high - point) > RANGE_THRESHOLD[nutrient] + RANGE_EPSILON;
    into.ranges[nutrient] = range;
  }
  return into;
}

interface Candidate {
  readonly sidesOff: readonly string[];
  readonly values: readonly number[];
  readonly fit: Fit;
  readonly cost: number;
}

function compareNumbers(a: readonly number[], b: readonly number[]): number {
  for (let index = 0; index < Math.min(a.length, b.length); index++) {
    const difference = (a[index] ?? 0) - (b[index] ?? 0);
    if (difference !== 0) return difference;
  }
  return a.length - b.length;
}

function compareStrings(a: readonly string[], b: readonly string[]): number {
  const [x, y] = [a.join("\u0000"), b.join("\u0000")];
  return x < y ? -1 : x > y ? 1 : 0;
}

/** ADR-029 D4: fit, then the smaller relative change, then fewer sides off, then the smallest amounts in ingredient order. */
function compareCandidates(a: Candidate, b: Candidate): number {
  const fit = compareFits(a.fit, b.fit);
  if (fit !== 0) return fit;
  if (Math.abs(a.cost - b.cost) > COST_EPSILON) return a.cost - b.cost;
  if (a.sidesOff.length !== b.sidesOff.length) return a.sidesOff.length - b.sidesOff.length;
  return compareStrings(a.sidesOff, b.sidesOff) || compareNumbers(a.values, b.values);
}

interface CostTerm {
  readonly index: number;
  readonly defaultValue: number;
}

/** Active adjustable ingredients with their index in the full value vector. */
interface Active {
  readonly adjustable: Adjustable;
  readonly index: number;
}

type StateFor = (sidesOff: readonly string[], values: readonly number[]) => RecipeState;

type Evaluator = (sidesOff: readonly string[], active: readonly Active[], defaults: readonly number[]) => (values: readonly number[]) => Nutrition;

interface Search {
  readonly best: Candidate;
  readonly adjustables: readonly Adjustable[];
  readonly stateFor: StateFor;
  readonly defaultFit: Fit;
}

/** The parts of a search that depend only on the recipe, the forced state, and the servings. */
interface Prepared {
  readonly all: readonly Adjustable[];
  readonly defaults: readonly number[];
  readonly stateFor: StateFor;
  /** Whether an ingredient is switched off (itself or through its leader) with these sides off. */
  readonly isOffWith: (sidesOff: readonly string[]) => (key: string) => boolean;
  /** Adjustable ingredients that stay on and have more than one value. */
  readonly activeWith: (sidesOff: readonly string[]) => Active[];
}

function prepare(recipe: SolverRecipe, forced: ForcedState, servings: number): Prepared {
  const all = adjustables(recipe, forced);
  const sideOf = new Map(recipe.sides.flatMap((side) => side.ingredients.map((key): [string, string] => [key, side.key])));
  const leaderOf = new Map(recipe.ingredients.map((ingredient) => [ingredient.key, ingredient.linkedTo]));
  const sideOfIngredient = (key: string) => {
    const leader = leaderOf.get(key);
    return sideOf.get(key) ?? (leader === undefined ? undefined : sideOf.get(leader));
  };
  const stateFor: StateFor = (sidesOff, values) => {
    const amounts: Record<string, number> = {};
    all.forEach((adjustable, index) => {
      const value = values[index];
      if (value !== undefined && !isDefault(adjustable, value)) amounts[adjustable.key] = value;
    });
    return { servings, sidesOff: [...new Set([...forced.sidesOff, ...sidesOff])].sort(), amounts, substitutions: forced.substitutions };
  };
  const isOffWith = (sidesOff: readonly string[]) => {
    const off = new Set([...forced.sidesOff, ...sidesOff]);
    return (key: string) => {
      const side = sideOfIngredient(key);
      return side !== undefined && off.has(side);
    };
  };
  const activeWith = (sidesOff: readonly string[]) => {
    const isOff = isOffWith(sidesOff);
    return all.flatMap((adjustable, index): Active[] => (!isOff(adjustable.key) && adjustable.values.length > 1 ? [{ adjustable, index }] : []));
  };
  return { all, defaults: all.map((adjustable) => adjustable.defaultValue), stateFor, isOffWith, activeWith };
}

function search(input: SolveInput, data: EngineData, makeEvaluator: (stateFor: StateFor, baseline: RecipeNutrition) => Evaluator, precomputed?: Precomputed): Search {
  const { recipe, targets, servings, forced, lockedSides } = input;
  const { all, defaults, stateFor, isOffWith, activeWith } = prepare(recipe, forced, servings);
  const removable = recipe.sides
    .filter((side) => side.solverMayRemove && !forced.sidesOff.includes(side.key) && !lockedSides.includes(side.key))
    .map((side) => side.key);

  // Relative change against the forced default state; ingredients already at 0 g cannot change.
  const fitOf = fitEvaluator(targets);
  const baseline = precomputed?.baseline ?? calculate(recipe, stateFor([], defaults), data);
  const defaultFit = fitOf(baseline);
  const baseGrams = new Map(baseline.ingredients.map((ingredient) => [ingredient.key, ingredient.grams]));
  const changeable = [...new Set([...all.map((adjustable) => adjustable.key), ...recipe.sides.filter((side) => removable.includes(side.key)).flatMap((side) => side.ingredients)])].filter(
    (key) => (baseGrams.get(key) ?? 0) > 0,
  );
  const adjustableIndex = new Map(all.map((adjustable, index) => [adjustable.key, index]));

  const evaluator = makeEvaluator(stateFor, baseline);
  let best: Candidate | undefined;
  for (let mask = 0; mask < 2 ** removable.length; mask++) {
    const sidesOff = removable.filter((_, bit) => (mask >> bit) & 1);
    const isOff = isOffWith(sidesOff);
    const active = activeWith(sidesOff);
    const evaluate = evaluator(sidesOff, active, defaults);
    const values = [...defaults];
    // The terms of the relative change in `changeable` order, so that the sum is added
    // in the same order for every state: 1 for a side switched off, or an ingredient.
    const terms = changeable.flatMap((key): (CostTerm | null)[] => {
      if (isOff(key)) return [null];
      const index = adjustableIndex.get(key);
      const adjustable = index === undefined ? undefined : all[index];
      return adjustable && index !== undefined ? [{ index, defaultValue: adjustable.defaultValue }] : [];
    });
    const cost = () => {
      let sum = 0;
      for (const term of terms) {
        sum = term === null ? sum + 1 : sum + Math.abs((values[term.index] ?? term.defaultValue) - term.defaultValue) / term.defaultValue;
      }
      return sum;
    };
    const visit = (depth: number): void => {
      if (depth === active.length) {
        // `values` is copied only when the state becomes the best one.
        const candidate: Candidate = { sidesOff, values, fit: fitOf(evaluate(values)), cost: cost() };
        if (!best || compareCandidates(candidate, best) < 0) best = { ...candidate, values: [...values] };
        return;
      }
      const entry = active[depth];
      if (!entry) return;
      const { adjustable, index } = entry;
      for (const value of adjustable.values) {
        values[index] = value;
        visit(depth + 1);
      }
      values[index] = adjustable.defaultValue;
    };
    visit(0);
  }
  if (!best) throw new Error(`No state for ${JSON.stringify(input.forced)}`);
  return { best, adjustables: all, stateFor, defaultFit };
}

const exhaustiveEvaluator =
  (recipe: SolverRecipe, data: EngineData) =>
  (stateFor: StateFor): Evaluator =>
  (sidesOff) =>
  (values) =>
    calculate(recipe, stateFor(sidesOff, values), data);

interface Slope {
  readonly index: number;
  readonly from: number;
  readonly slope: readonly (number | null)[];
}

/** The linear model of one side combination: the values at the default amounts and one slope per active ingredient. */
export interface LinearModel {
  readonly base: readonly (number | null)[];
  readonly slopes: readonly Slope[];
}

/**
 * The model from engine calls; `baseline` is the engine result of the default amounts
 * with no side switched off by the solver, the state of the combination without sides off.
 */
function linearModel(recipe: SolverRecipe, data: EngineData, stateFor: StateFor, sidesOff: readonly string[], active: readonly Active[], defaults: readonly number[], baseline: RecipeNutrition): LinearModel {
  const at = (values: readonly number[]) => vector(calculate(recipe, stateFor(sidesOff, values), data));
  const base = sidesOff.length === 0 ? vector(baseline) : at(defaults);
  // One probe per ingredient: the first grid value that differs from the default.
  const slopes = active.map(({ adjustable, index }) => {
    const from = adjustable.defaultValue;
    const to = adjustable.values.find((value) => !isDefault(adjustable, value)) ?? from;
    const probe = [...defaults];
    probe[index] = to;
    const slope = at(probe).map((value, entry) => {
      const reference = base[entry];
      return value === null || reference === null || reference === undefined ? null : (value - reference) / (to - from);
    });
    return { index, from, slope };
  });
  return { base, slopes };
}

const sidesKey = (sidesOff: readonly string[]) => sidesOff.join(",");

/**
 * Engine results that do not depend on the targets (Phase 9 Stage 9.3): the default state
 * and the linear model of every combination of solver-removable sides, for servings
 * `PRECOMPUTED_SERVINGS` without forced sides or substitutions. Built once per bundle
 * (`recommendationDataFromBundle`) and passed to `solve` as input; `solve` uses them only
 * for that case, where they equal what it would compute itself.
 */
export interface Precomputed {
  readonly baseline: RecipeNutrition;
  /** By the sides switched off, in authored order. */
  readonly models: ReadonlyMap<string, LinearModel>;
}

export const PRECOMPUTED_SERVINGS = 1;
const UNFORCED: ForcedState = { sidesOff: [], substitutions: [] };

export function precompute(recipe: SolverRecipe, data: EngineData): Precomputed {
  const { defaults, stateFor, activeWith } = prepare(recipe, UNFORCED, PRECOMPUTED_SERVINGS);
  const baseline = calculate(recipe, stateFor([], defaults), data);
  const removable = recipe.sides.filter((side) => side.solverMayRemove).map((side) => side.key);
  const models = new Map<string, LinearModel>();
  for (let mask = 0; mask < 2 ** removable.length; mask++) {
    const sidesOff = removable.filter((_, bit) => (mask >> bit) & 1);
    models.set(sidesKey(sidesOff), linearModel(recipe, data, stateFor, sidesOff, activeWith(sidesOff), defaults, baseline));
  }
  return { baseline, models };
}

/** The precomputed results when they apply to this input. */
function applicable(input: SolveInput): Precomputed | undefined {
  const { forced, servings, precomputed } = input;
  return servings === PRECOMPUTED_SERVINGS && forced.sidesOff.length === 0 && forced.substitutions.length === 0 ? precomputed : undefined;
}

const linearEvaluator =
  (recipe: SolverRecipe, data: EngineData, precomputed: Precomputed | undefined) =>
  (stateFor: StateFor, baseline: RecipeNutrition): Evaluator =>
  (sidesOff, active, defaults) => {
    const { base, slopes } = precomputed?.models.get(sidesKey(sidesOff)) ?? linearModel(recipe, data, stateFor, sidesOff, active, defaults, baseline);
    const predicted: (number | null)[] = base.map(() => null);
    const into = scratch();
    return (values) => {
      for (let entry = 0; entry < base.length; entry++) {
        const value = base[entry] ?? null;
        predicted[entry] = null;
        if (value === null) continue;
        let sum = value;
        let known = true;
        for (const { index, from, slope } of slopes) {
          const rate = slope[entry];
          if (rate === null || rate === undefined) {
            known = false;
            break;
          }
          sum += rate * ((values[index] ?? from) - from);
        }
        if (known) predicted[entry] = sum;
      }
      return fromVector(predicted, into);
    };
  };

function sameFit(a: Fit, b: Fit): boolean {
  return (
    a.tier === b.tier &&
    a.nutrients.every((entry, index) => {
      const other = b.nutrients[index];
      return other !== undefined && entry.status === other.status && entry.position === other.position;
    })
  );
}

function solution(input: SolveInput, found: Search, nutrition: RecipeNutrition, method: Solution["method"]): Solution {
  const { best, adjustables: all, stateFor, defaultFit } = found;
  const state = stateFor(best.sidesOff, best.values);
  const changes = all.flatMap((adjustable, index): AmountChange[] => {
    const value = best.values[index] ?? adjustable.defaultValue;
    const switchedOff = nutrition.ingredients.find((ingredient) => ingredient.key === adjustable.key)?.switchedOff === true;
    return switchedOff || isDefault(adjustable, value) ? [] : [{ ingredient: adjustable.key, from: adjustable.defaultValue, to: value, unit: adjustable.unit }];
  });
  return { state, nutrition, fit: evaluateFit(nutrition, input.targets), defaultFit, relativeChange: best.cost, changes, sidesOff: best.sidesOff, method };
}

/** Evaluates every state with the engine. Used as the reference and as the fallback. */
export function solveExhaustive(input: SolveInput, data: EngineData): Solution {
  const found = search(input, data, exhaustiveEvaluator(input.recipe, data));
  return solution(input, found, calculate(input.recipe, found.stateFor(found.best.sidesOff, found.best.values), data), "exhaustive");
}

/** The ADR-029 D4 solver: linear scoring, engine recalculation, exhaustive fallback. */
export function solve(input: SolveInput, data: EngineData): Solution {
  const usable = applicable(input);
  const found = search(input, data, linearEvaluator(input.recipe, data, usable), usable);
  const nutrition = calculate(input.recipe, found.stateFor(found.best.sidesOff, found.best.values), data);
  if (!sameFit(evaluateFit(nutrition, input.targets), found.best.fit)) return solveExhaustive(input, data);
  return solution(input, found, nutrition, "linear");
}
