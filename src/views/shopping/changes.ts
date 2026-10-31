/**
 * Shopping list changes for the reducer: the items whose check must be cleared because
 * their total changed (ADR-032 D5). The reducer has no content, so views compute this.
 */
import { buildShoppingList, changedItemKeys, type ShoppingEntry, type ShoppingRecipe } from "../../../domain/shopping/list";
import type { AppAction, ShoppingListState } from "../../state/reducer";

function uncheck(recipes: readonly ShoppingRecipe[], current: ShoppingListState, next: readonly ShoppingEntry[]): readonly string[] {
  const before = buildShoppingList(current.entries, recipes);
  const after = buildShoppingList(next, recipes);
  if (!before.ok || !after.ok) return current.checked;
  return changedItemKeys(before.value, after.value);
}

export function savedAction(recipes: readonly ShoppingRecipe[], current: ShoppingListState, entry: ShoppingEntry): AppAction {
  const exists = current.entries.some((candidate) => candidate.recipe === entry.recipe);
  const next = exists ? current.entries.map((candidate) => (candidate.recipe === entry.recipe ? entry : candidate)) : [...current.entries, entry];
  return { type: "shoppingSaved", entry, uncheck: uncheck(recipes, current, next) };
}

export function removedAction(recipes: readonly ShoppingRecipe[], current: ShoppingListState, recipe: string): AppAction {
  return { type: "shoppingRemoved", recipe, uncheck: uncheck(recipes, current, current.entries.filter((entry) => entry.recipe !== recipe)) };
}

/** Recipe states compare by value; key order in `amounts` and list order do not matter. */
export function sameState(a: ShoppingEntry["state"], b: ShoppingEntry["state"]): boolean {
  const sorted = (items: readonly string[]) => [...items].sort().join("\n");
  const amountKeys = new Set([...Object.keys(a.amounts), ...Object.keys(b.amounts)]);
  return (
    a.servings === b.servings &&
    sorted(a.sidesOff) === sorted(b.sidesOff) &&
    sorted(a.substitutions) === sorted(b.substitutions) &&
    [...amountKeys].every((key) => a.amounts[key] === b.amounts[key])
  );
}
