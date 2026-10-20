/**
 * Ingredient search over the food dictionary of the active text bundle (ADR-030 D6,
 * docs/ARCHITECTURE.md §4). Names and aliases are search data only; a choice always
 * resolves to locale-neutral food IDs.
 */
import type { CalcBundle, TextBundle } from "../../../shared/bundle";
import type { ProteinGroup } from "../../../shared/content";
import type { Locale } from "../../../shared/locales";
import type { FoodChoice } from "./draft";

export interface FoodOption extends FoodChoice {
  readonly kind: "food" | "group";
  /** For a group: the group whose label the UI shows. */
  readonly group?: ProteinGroup;
  /** For a food: its display name. */
  readonly name?: string;
  /** Normalized names and aliases. */
  readonly terms: readonly string[];
}

/**
 * `ja`: NFKC, katakana folded to hiragana; `en`: NFKC and case folding; `es`: NFKC, case
 * and accent folding. Every locale also folds case and width, which never hurts matching.
 */
export function normalizeForSearch(locale: Locale, text: string): string {
  let result = text.normalize("NFKC").toLowerCase().trim();
  if (locale === "ja") result = result.replace(/[ァ-ヶ]/g, (char) => String.fromCharCode(char.charCodeAt(0) - 0x60));
  if (locale === "es") result = result.normalize("NFD").replace(/\p{M}/gu, "").normalize("NFC");
  return result;
}

/** One option per food, plus "any cut" options for protein groups with more than one food. */
export function foodOptions(calc: CalcBundle, text: TextBundle, groupLabel: (group: ProteinGroup) => string): FoodOption[] {
  const locale = text.locale;
  const foods = calc.foods.flatMap((food): FoodOption[] => {
    const texts = text.foods[food.id];
    if (texts === undefined) return [];
    return [{ key: food.id, kind: "food", foods: [food.id], name: texts.name, terms: [texts.name, ...texts.aliases].map((term) => normalizeForSearch(locale, term)) }];
  });
  const groups = new Map<ProteinGroup, string[]>();
  for (const food of calc.foods) {
    if (food.proteinGroup !== undefined) groups.set(food.proteinGroup, [...(groups.get(food.proteinGroup) ?? []), food.id]);
  }
  const groupOptions = [...groups].flatMap(([group, ids]): FoodOption[] => {
    if (ids.length < 2) return [];
    const memberTerms = foods.filter((option) => ids.includes(option.key)).flatMap((option) => option.terms);
    return [{ key: `group:${group}`, kind: "group", group, foods: [...ids].sort(), terms: [normalizeForSearch(locale, groupLabel(group)), ...memberTerms] }];
  });
  return [...groupOptions, ...foods];
}

/**
 * Options matching the query by substring. Groups first, then names that start with the
 * query, then the rest, each in a stable order. Already chosen options are left out.
 */
export function searchFoods(options: readonly FoodOption[], locale: Locale, query: string, chosen: ReadonlySet<string>, limit = 8): FoodOption[] {
  const needle = normalizeForSearch(locale, query);
  if (needle === "") return [];
  const scored = options.flatMap((option, index) => {
    if (chosen.has(option.key) || !option.terms.some((term) => term.includes(needle))) return [];
    const prefix = option.terms.some((term) => term.startsWith(needle));
    return [{ option, rank: (option.kind === "group" ? 0 : 2) + (prefix ? 0 : 1), index }];
  });
  return scored
    .sort((a, b) => a.rank - b.rank || a.index - b.index)
    .slice(0, limit)
    .map((entry) => entry.option);
}
