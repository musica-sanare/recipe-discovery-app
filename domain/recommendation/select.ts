/**
 * Seeded order, preferences, and diverse selection (ADR-029 D5, D6). Pure: the seed
 * comes from the caller, and the order of a recipe depends only on the seed and its ID,
 * so adding or removing recipes does not reorder the others.
 */
import type { Cuisine, ProteinGroup } from "../../shared/content.ts";
import type { MethodFamily } from "../../shared/recipe.ts";
import type { Conditions, RecipeId } from "./types.ts";

export interface Attributes {
  readonly proteinGroup: ProteinGroup;
  readonly cuisine: Cuisine;
  readonly method: MethodFamily;
}

export const ATTRIBUTE_KEYS: readonly (keyof Attributes)[] = ["proteinGroup", "cuisine", "method"];

/** 32-bit FNV-1a over UTF-16 code units. */
export function fnv1a(text: string): number {
  let hash = 0x811c9dc5;
  for (let index = 0; index < text.length; index++) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

/** The MurmurHash3 finalizer: a bijective 32-bit mix. */
export function mix32(value: number): number {
  let hash = value >>> 0;
  hash ^= hash >>> 16;
  hash = Math.imul(hash, 0x85ebca6b);
  hash ^= hash >>> 13;
  hash = Math.imul(hash, 0xc2b2ae35);
  hash ^= hash >>> 16;
  return hash >>> 0;
}

/** Position of a recipe in the order for a seed (lower first); ties fall back to the ID. */
export function seededKey(seed: number, recipe: RecipeId): number {
  return mix32(mix32(seed) ^ fnv1a(recipe));
}

/** Soft preferences (ADR-029 D5): cuisine match +1, effort at most the preferred level +1. */
export function preferenceScore(recipe: { readonly cuisine: Cuisine; readonly effort: 1 | 2 | 3 }, conditions: Pick<Conditions, "cuisines" | "effort">): number {
  const cuisine = conditions.cuisines.includes(recipe.cuisine) ? 1 : 0;
  const effort = conditions.effort !== undefined && recipe.effort <= conditions.effort ? 1 : 0;
  return cuisine + effort;
}

export interface Selectable {
  readonly recipe: RecipeId;
  readonly attributes: Attributes;
  readonly preference: number;
  readonly relativeChange: number;
}

const CHANGE_EPSILON = 1e-9;

/** Attribute values not yet among the taken ones. */
export function diversityGain(attributes: Attributes, taken: readonly Attributes[]): number {
  return ATTRIBUTE_KEYS.filter((key) => !taken.some((other) => other[key] === attributes[key])).length;
}

/**
 * Greedy selection (ADR-029 D5): each pick has the most attribute values not yet among
 * the taken recipes (the chosen ones plus `taken`, for example the previous set), then
 * the higher preference score, the smaller relative change, the seeded order, and the ID.
 */
export function selectDiverse<T extends Selectable>(pool: readonly T[], count: number, taken: readonly Attributes[], seed: number): T[] {
  const remaining = [...pool];
  const chosen: T[] = [];
  const takenNow = [...taken];
  while (chosen.length < count && remaining.length > 0) {
    let bestIndex = 0;
    for (let index = 1; index < remaining.length; index++) {
      const candidate = remaining[index];
      const best = remaining[bestIndex];
      if (candidate && best && compareForPick(candidate, best, takenNow, seed) < 0) bestIndex = index;
    }
    const [pick] = remaining.splice(bestIndex, 1);
    if (!pick) break;
    chosen.push(pick);
    takenNow.push(pick.attributes);
  }
  return chosen;
}

function compareForPick(a: Selectable, b: Selectable, taken: readonly Attributes[], seed: number): number {
  const gain = diversityGain(b.attributes, taken) - diversityGain(a.attributes, taken);
  if (gain !== 0) return gain;
  if (a.preference !== b.preference) return b.preference - a.preference;
  if (Math.abs(a.relativeChange - b.relativeChange) > CHANGE_EPSILON) return a.relativeChange - b.relativeChange;
  const order = seededKey(seed, a.recipe) - seededKey(seed, b.recipe);
  if (order !== 0) return order;
  return a.recipe < b.recipe ? -1 : a.recipe > b.recipe ? 1 : 0;
}
