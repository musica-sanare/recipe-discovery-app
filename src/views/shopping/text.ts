/**
 * Localized texts of the shopping list (docs/en/UI_DESIGN.md §3.7, ADR-032 D6). Items and
 * amounts come from `domain/shopping`; this module only formats them.
 */
import type { TFunction } from "i18next";
import type { ShoppingEntry, ShoppingItem, ShoppingList } from "../../../domain/shopping/list";
import type { Measure } from "../../../shared/content";
import type { Locale } from "../../../shared/locales";
import { formatGrams, formatQuantity, householdPluralCount } from "../../format/format";
import { listText } from "../candidates/texts";

export function householdText(t: TFunction, locale: Locale, measure: Measure): string {
  return t(`unit.household.${measure.unit}`, {
    count: householdPluralCount(measure.quantity),
    amount: formatQuantity(locale, measure.quantity, (whole, fraction) => t("unit.mixedFraction", { whole, fraction })),
  });
}

/** "300 g", or "100 g (2)" with the household measure. */
export function amountText(t: TFunction, locale: Locale, grams: number, measure: Measure | undefined): string {
  const gramsText = t("unit.gram", { value: formatGrams(locale, grams) });
  return measure === undefined ? gramsText : t("shopping.amountWithMeasure", { grams: gramsText, measure: householdText(t, locale, measure) });
}

export function itemName(t: TFunction, foodName: (food: string) => string, item: Pick<ShoppingItem, "food" | "frying">): string {
  return item.frying ? t("shopping.fryingOil", { food: foodName(item.food) }) : foodName(item.food);
}

export function servingsText(t: TFunction, servings: number): string {
  return t("candidates.servings", { count: servings });
}

/** "2 servings, amounts adjusted, 1 side off". */
export function entrySummary(t: TFunction, entry: ShoppingEntry): string {
  const { state } = entry;
  const parts = [servingsText(t, state.servings)];
  if (Object.keys(state.amounts).length > 0) parts.push(t("shopping.adjusted"));
  if (state.sidesOff.length > 0) parts.push(t("shopping.sidesOff", { count: state.sidesOff.length }));
  if (state.substitutions.length > 0) parts.push(t("shopping.substituted", { count: state.substitutions.length }));
  return listText(t, parts);
}

interface ListTextInput {
  readonly t: TFunction;
  readonly locale: Locale;
  readonly foodName: (food: string) => string;
  readonly recipeName: (recipe: string) => string;
  readonly entries: readonly ShoppingEntry[];
  readonly list: ShoppingList;
  readonly checked: readonly string[];
}

/** The copied text: plain text with `- ` bullets; checked items and empty sections are left out. */
export function shoppingText({ t, locale, foodName, recipeName, entries, list, checked }: ListTextInput): string {
  const lines = [t("shopping.textTitle", { count: entries.length })];
  for (const entry of entries) lines.push(`- ${t("shopping.textRecipe", { name: recipeName(entry.recipe), servings: servingsText(t, entry.state.servings) })}`);
  for (const section of ["ingredients", "pantry"] as const) {
    const items = list.items.filter((item) => item.section === section && !checked.includes(item.key));
    if (items.length === 0) continue;
    lines.push("", `[${t(`shopping.sections.${section}`)}]`);
    for (const item of items) lines.push(`- ${itemName(t, foodName, item)} ${amountText(t, locale, item.grams, item.measure)}`);
  }
  lines.push("", t("shopping.basisNote"));
  return lines.join("\n");
}

/** How many items the copied text lists. */
export function uncheckedCount(list: ShoppingList, checked: readonly string[]): number {
  return list.items.filter((item) => !checked.includes(item.key)).length;
}
