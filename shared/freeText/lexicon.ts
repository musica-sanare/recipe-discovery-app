/**
 * Word lists of the free-text conditions parser (ADR-034, revised again), one per locale
 * in `lexicon/<locale>.ts` so the app loads only the active one (ADR-039 D1). They are canonical repository content like the UI catalogs: Claude drafts them, the
 * owner reviews them (ADR-007, ADR-033). Entries are matched after `normalizeForSearch`
 * of their locale, so case, width, kana, and accents do not matter. Food names come from
 * the food dictionary, not from here; only group words are listed.
 */
import type { Cuisine, Equipment, ProteinGroup } from "../content.ts";
import type { Locale } from "../locales.ts";
import type { OutOfScopeTopic } from "../suggestion.ts";

export const FOOD_GROUP_WORDS = ["chicken", "pork", "beef", "fish", "eggs", "mushrooms"] as const;
export type FoodGroupWord = (typeof FOOD_GROUP_WORDS)[number];

/**
 * The dictionary foods a group word covers: a protein group, minus foods that the group
 * word does not name ("fish" is not shellfish, squid, or octopus), or a list of foods.
 */
export const FOOD_GROUPS: Readonly<Record<FoodGroupWord, { readonly proteinGroup: ProteinGroup; readonly except?: readonly string[] } | { readonly foods: readonly string[] }>> = {
  chicken: { proteinGroup: "chicken" },
  pork: { proteinGroup: "pork" },
  beef: { proteinGroup: "beef" },
  fish: { proteinGroup: "fish", except: ["shrimp", "squid", "octopus_boiled"] },
  eggs: { proteinGroup: "egg" },
  mushrooms: { foods: ["shimeji", "shiitake", "eringi"] },
};

export interface Lexicon {
  /** The locale whose normalization the entries are matched with. */
  readonly locale: Locale;
  /**
   * Words of a request the feature declines, by topic, checked in this order. Matched as
   * word prefixes in `en`, `es`, and `fr` ("allerg" covers allergy and allergic).
   */
  readonly outOfScope: Readonly<Record<OutOfScopeTopic, readonly string[]>>;
  /** Where a negation stands relative to the foods it negates in a clause. */
  readonly negationPosition: "before" | "after";
  readonly negation: readonly string[];
  /** Joins alternatives into one any-of item ("lentils or chickpeas"). */
  readonly or: readonly string[];
  /** Words that end a clause, besides punctuation. */
  readonly clauseBreaks: readonly string[];
  /** Units after a number. */
  readonly minuteUnits: readonly string[];
  readonly hourUnits: readonly string[];
  /** Phrases that state a duration without a digit. */
  readonly durations: readonly (readonly [phrase: string, minutes: number])[];
  readonly equipment: Readonly<Record<Equipment, readonly string[]>>;
  /** Word prefixes in `en`, `es`, and `fr` ("japon" covers japonés and japonaise). */
  readonly cuisines: Readonly<Record<Cuisine, readonly string[]>>;
  readonly groups: Readonly<Record<FoodGroupWord, readonly string[]>>;
  /** Phrases that contain a food name but are not foods (晩ごはん is dinner, not rice). */
  readonly notFoods: readonly string[];
  /** Words that accent folding would merge with another word, with a spelling kept apart (maïs and mais). */
  readonly keepApart: readonly (readonly [word: string, kept: string])[];
}
