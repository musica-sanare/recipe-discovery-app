/**
 * Applying conditions read from free text to the form (ADR-034 D6, revised again). The
 * user applies or discards them; applying adds foods and cuisines to what is already
 * chosen and replaces the time limit and the equipment, and never touches targets or
 * allergens.
 */
import type { CalcBundle } from "../../../shared/bundle";
import type { Suggestion } from "../../../shared/suggestion";
import type { FoodChoice, TargetsDraft } from "./draft";

/** A required item as a form choice: a whole protein group keeps its group chip; anything else lists its foods. */
export function choiceOf(foods: readonly string[], calc: CalcBundle): FoodChoice {
  const sorted = [...foods].sort();
  const group = calc.foods.find((food) => food.id === sorted[0])?.proteinGroup;
  if (group !== undefined) {
    const members = calc.foods.filter((food) => food.proteinGroup === group).map((food) => food.id).sort();
    if (members.length > 1 && members.join() === sorted.join()) return { key: `group:${group}`, foods: members };
  }
  return { key: sorted.length === 1 ? (sorted[0] ?? "") : `any:${sorted.join("+")}`, foods: sorted };
}

/** Whether applying shows changes inside the advanced section, which should then be opened. */
export function touchesAdvanced(suggestion: Suggestion): boolean {
  return suggestion.requiredFoods.length > 0 || suggestion.excludedFoods.length > 0 || suggestion.equipment !== undefined || suggestion.cuisines.length > 0;
}

export function applySuggestion(draft: TargetsDraft, suggestion: Suggestion, calc: CalcBundle): TargetsDraft {
  const requiredKeys = new Set(draft.required.map((choice) => choice.key));
  const required = [...draft.required];
  for (const item of suggestion.requiredFoods) {
    const choice = choiceOf(item, calc);
    if (!requiredKeys.has(choice.key)) {
      required.push(choice);
      requiredKeys.add(choice.key);
    }
  }
  const alreadyExcluded = new Set(draft.excluded.flatMap((choice) => choice.foods));
  const excluded = [...draft.excluded, ...suggestion.excludedFoods.filter((food) => !alreadyExcluded.has(food)).map((food) => ({ key: food, foods: [food] }))];
  return {
    ...draft,
    required,
    excluded,
    numbers: suggestion.maxMinutes === undefined ? draft.numbers : { ...draft.numbers, maxMinutes: String(suggestion.maxMinutes) },
    ...(suggestion.equipment === undefined ? {} : { equipmentMode: "choose" as const, equipment: suggestion.equipment }),
    cuisines: [...new Set([...draft.cuisines, ...suggestion.cuisines])],
  };
}
