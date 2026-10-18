/**
 * Hard filters with per-constraint exclusion counts (ADR-029 D7, docs/SPEC.md §5, §12).
 * Allergens are never rescued; an excluded food may be removed by switching off the
 * side that holds it or by a substitution, and the forced state is checked again.
 */
import type { BundleRecipe } from "../../shared/bundle.ts";
import type { RecommendationFood } from "./data.ts";
import type { ConstraintItem, Conditions, ExclusionCount, ForcedState, RecipeId } from "./types.ts";

type Ingredient = BundleRecipe["ingredients"][number];
type Substitution = BundleRecipe["substitutions"][number];

/** The recipe fields the filters read. */
export interface FilterRecipe {
  readonly id: RecipeId;
  readonly minutes: number;
  readonly equipment: BundleRecipe["equipment"];
  readonly ingredients: readonly Pick<Ingredient, "key" | "food" | "linkedTo">[];
  readonly sides: readonly Pick<BundleRecipe["sides"][number], "key" | "ingredients">[];
  readonly substitutions: readonly Pick<Substitution, "key" | "ingredient" | "food" | "minutesDelta">[];
}

export interface RecipeCheck {
  /** Items the recipe fails, in the order of `compareItems`. */
  readonly failed: readonly ConstraintItem[];
  readonly forced: ForcedState;
  /** Minutes after forced substitutions. */
  readonly minutes: number;
}

export interface EligibleRecipe<R extends FilterRecipe> {
  readonly recipe: R;
  readonly forced: ForcedState;
  readonly minutes: number;
}

export interface FilterResult<R extends FilterRecipe> {
  readonly eligible: readonly EligibleRecipe<R>[];
  readonly exclusions: readonly ExclusionCount[];
}

const CONSTRAINT_ORDER: readonly ConstraintItem["constraint"][] = ["sessionExcluded", "maxMinutes", "equipment", "allergen", "excludedFood", "requiredFood"];

function itemKey(item: ConstraintItem): string {
  switch (item.constraint) {
    case "equipment":
      return item.equipment;
    case "allergen":
      return item.allergen;
    case "excludedFood":
      return item.food;
    case "requiredFood":
      return String(item.index).padStart(6, "0");
    case "maxMinutes":
    case "sessionExcluded":
      return "";
  }
}

export function compareItems(a: ConstraintItem, b: ConstraintItem): number {
  const order = CONSTRAINT_ORDER.indexOf(a.constraint) - CONSTRAINT_ORDER.indexOf(b.constraint);
  if (order !== 0) return order;
  const [x, y] = [itemKey(a), itemKey(b)];
  return x < y ? -1 : x > y ? 1 : 0;
}

const sameItem = (a: ConstraintItem, b: ConstraintItem) => compareItems(a, b) === 0;

function containsAllergen(food: RecommendationFood | undefined, allergen: Conditions["excludedAllergens"][number]): boolean {
  // Unknown allergen information, or a food missing from the dictionary, counts as "may contain" (ADR-008).
  if (food === undefined || food.allergens === "unknown") return true;
  return food.allergens.some((link) => link.allergen === allergen);
}

/** Every hard-constraint item one recipe fails, and the state forced by excluded foods. */
export function checkRecipe(
  recipe: FilterRecipe,
  conditions: Conditions,
  sessionExcluded: ReadonlySet<RecipeId>,
  foods: ReadonlyMap<string, RecommendationFood>,
): RecipeCheck {
  const failed: ConstraintItem[] = [];
  const excludedFoods = new Set(conditions.excludedFoods);
  const sideOf = new Map(recipe.sides.flatMap((side) => side.ingredients.map((key): [string, string] => [key, side.key])));
  const sidesOff = new Set<string>();
  const substitutions = new Map<string, Pick<Substitution, "key" | "food" | "minutesDelta">>();

  for (const ingredient of recipe.ingredients) {
    if (!excludedFoods.has(ingredient.food)) continue;
    const side = sideOf.get(ingredient.key) ?? (ingredient.linkedTo === undefined ? undefined : sideOf.get(ingredient.linkedTo));
    if (side !== undefined) {
      sidesOff.add(side);
      continue;
    }
    const substitution = recipe.substitutions.find((candidate) => candidate.ingredient === ingredient.key && !excludedFoods.has(candidate.food));
    if (substitution) substitutions.set(ingredient.key, substitution);
    else failed.push({ constraint: "excludedFood", food: ingredient.food });
  }

  const isOff = (ingredient: Pick<Ingredient, "key" | "linkedTo">) => {
    const side = sideOf.get(ingredient.key) ?? (ingredient.linkedTo === undefined ? undefined : sideOf.get(ingredient.linkedTo));
    return side !== undefined && sidesOff.has(side);
  };

  const minutes = recipe.minutes + [...substitutions.values()].reduce((sum, substitution) => sum + (substitution.minutesDelta ?? 0), 0);
  if (conditions.maxMinutes !== undefined && minutes > conditions.maxMinutes) failed.push({ constraint: "maxMinutes" });

  if (conditions.equipment !== undefined) {
    const available = new Set(conditions.equipment);
    for (const equipment of recipe.equipment) if (!available.has(equipment)) failed.push({ constraint: "equipment", equipment });
  }

  // Allergens: every authored ingredient, whether its side is on or off, plus forced substitutes.
  const allergenFoods = [...recipe.ingredients.map((ingredient) => ingredient.food), ...[...substitutions.values()].map((substitution) => substitution.food)];
  for (const allergen of conditions.excludedAllergens) {
    if (allergenFoods.some((food) => containsAllergen(foods.get(food), allergen))) failed.push({ constraint: "allergen", allergen });
  }

  // Required foods: authored ingredients that stay in the forced state, not substitutes.
  const present = new Set(recipe.ingredients.filter((ingredient) => !isOff(ingredient) && !substitutions.has(ingredient.key)).map((ingredient) => ingredient.food));
  conditions.requiredFoods.forEach((item, index) => {
    if (!item.some((food) => present.has(food))) failed.push({ constraint: "requiredFood", index });
  });

  if (sessionExcluded.has(recipe.id)) failed.push({ constraint: "sessionExcluded" });

  const unique = failed.sort(compareItems).filter((item, index, all) => index === 0 || !sameItem(item, all[index - 1] ?? item));
  return {
    failed: unique,
    forced: { sidesOff: [...sidesOff].sort(), substitutions: [...substitutions.values()].map((substitution) => substitution.key).sort() },
    minutes,
  };
}

/** Items the conditions make active; equipment items appear only when a recipe fails them. */
function activeItems(conditions: Conditions, sessionExcluded: ReadonlySet<RecipeId>): ConstraintItem[] {
  return [
    ...(sessionExcluded.size > 0 ? [{ constraint: "sessionExcluded" } as const] : []),
    ...(conditions.maxMinutes === undefined ? [] : [{ constraint: "maxMinutes" } as const]),
    ...conditions.excludedAllergens.map((allergen) => ({ constraint: "allergen", allergen }) as const),
    ...conditions.excludedFoods.map((food) => ({ constraint: "excludedFood", food }) as const),
    ...conditions.requiredFoods.map((_, index) => ({ constraint: "requiredFood", index }) as const),
  ];
}

/** Recipes that pass every hard constraint, in input order, and the exclusion count of every active item. */
export function applyHardFilters<R extends FilterRecipe>(
  recipes: readonly R[],
  conditions: Conditions,
  sessionExcluded: ReadonlySet<RecipeId>,
  foods: ReadonlyMap<string, RecommendationFood>,
): FilterResult<R> {
  const eligible: EligibleRecipe<R>[] = [];
  const counts: { item: ConstraintItem; count: number; onlyThis: number }[] = activeItems(conditions, sessionExcluded).map((item) => ({ item, count: 0, onlyThis: 0 }));
  for (const recipe of recipes) {
    const check = checkRecipe(recipe, conditions, sessionExcluded, foods);
    if (check.failed.length === 0) {
      eligible.push({ recipe, forced: check.forced, minutes: check.minutes });
      continue;
    }
    for (const item of check.failed) {
      let entry = counts.find((candidate) => sameItem(candidate.item, item));
      if (!entry) {
        entry = { item, count: 0, onlyThis: 0 };
        counts.push(entry);
      }
      entry.count += 1;
      if (check.failed.length === 1) entry.onlyThis += 1;
    }
  }
  return { eligible, exclusions: counts.sort((a, b) => compareItems(a.item, b.item)) };
}
