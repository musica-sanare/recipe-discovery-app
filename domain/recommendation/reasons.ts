/**
 * Reason data for displayed recipes (ADR-029): typed codes and numbers that the UI
 * turns into localized texts in Phase 4. Facts about the calculation and the user's
 * own targets only; no health or efficacy wording exists here (docs/CONTENT_POLICY.md §4).
 */
import { isQuick } from "../../shared/recipe.ts";
import type { TargetKey } from "./fit.ts";
import type { PoolEntry } from "./pool.ts";
import { ATTRIBUTE_KEYS, type Attributes } from "./select.ts";
import type { FoodId, PoolRequest } from "./types.ts";

export type ReasonData =
  | { readonly code: "meets_all_targets" }
  | { readonly code: "meets_with_adjustment" }
  | { readonly code: "near_target"; readonly target: TargetKey; readonly gap: number }
  | { readonly code: "misses_target"; readonly target: TargetKey; readonly gap: number }
  | { readonly code: "unknown_value"; readonly target: TargetKey }
  | { readonly code: "range_straddles"; readonly target: TargetKey }
  | { readonly code: "highest_among_candidates"; readonly nutrient: "PROT-"; readonly value: number }
  | { readonly code: "lowest_among_candidates"; readonly nutrient: "FAT-"; readonly value: number }
  | { readonly code: "new_attribute"; readonly attribute: keyof Attributes }
  | { readonly code: "matches_cuisine" }
  | { readonly code: "within_effort" }
  | { readonly code: "quick"; readonly minutes: number }
  | { readonly code: "uses_required_foods"; readonly foods: readonly FoodId[] };

export interface ReasonContext {
  readonly request: PoolRequest;
  /** The other recipes met by the targets in the same set (for comparisons). */
  readonly candidates: readonly PoolEntry[];
  /** Attributes of the previous set; empty on the first request. */
  readonly previous: readonly Attributes[];
}

/** The single best value among the candidates, or undefined when it is shared or there is no comparison. */
function uniqueExtreme(entries: readonly PoolEntry[], value: (entry: PoolEntry) => number | null, best: "max" | "min"): PoolEntry | undefined {
  const known = entries.flatMap((entry) => {
    const amount = value(entry);
    return amount === null ? [] : [{ entry, amount }];
  });
  if (known.length < 2 || known.length !== entries.length) return undefined;
  const sorted = [...known].sort((a, b) => (best === "max" ? b.amount - a.amount : a.amount - b.amount));
  const [first, second] = sorted;
  return first && second && first.amount !== second.amount ? first.entry : undefined;
}

export function reasonsFor(entry: PoolEntry, context: ReasonContext): ReasonData[] {
  const { request, candidates, previous } = context;
  const { fit, changes, sidesOff, nutrition } = entry.solution;
  const reasons: ReasonData[] = [];
  const adjusted = changes.length > 0 || sidesOff.length > 0;
  if (fit.tier === "met") reasons.push({ code: adjusted ? "meets_with_adjustment" : "meets_all_targets" });

  for (const nutrient of fit.nutrients) {
    if (nutrient.status === "unknown") reasons.push({ code: "unknown_value", target: nutrient.target });
    else if (nutrient.status === "near") reasons.push({ code: "near_target", target: nutrient.target, gap: nutrient.gap ?? 0 });
    else if (nutrient.status === "not_met") reasons.push({ code: "misses_target", target: nutrient.target, gap: nutrient.gap ?? 0 });
    if (nutrient.basis === "range" && nutrient.position.startsWith("straddles")) reasons.push({ code: "range_straddles", target: nutrient.target });
  }

  if (fit.tier === "met" && candidates.some((candidate) => candidate.recipe === entry.recipe)) {
    const protein = request.targets.proteinMin === undefined ? undefined : uniqueExtreme(candidates, (candidate) => candidate.solution.nutrition.perServing["PROT-"], "max");
    if (protein?.recipe === entry.recipe) reasons.push({ code: "highest_among_candidates", nutrient: "PROT-", value: nutrition.perServing["PROT-"] ?? 0 });
    const fat = request.targets.fatMax === undefined ? undefined : uniqueExtreme(candidates, (candidate) => candidate.solution.nutrition.perServing["FAT-"], "min");
    if (fat?.recipe === entry.recipe) reasons.push({ code: "lowest_among_candidates", nutrient: "FAT-", value: nutrition.perServing["FAT-"] ?? 0 });
  }

  if (previous.length > 0) {
    for (const attribute of ATTRIBUTE_KEYS) {
      if (!previous.some((other) => other[attribute] === entry.attributes[attribute])) reasons.push({ code: "new_attribute", attribute });
    }
  }

  const { conditions } = request;
  if (conditions.cuisines.includes(entry.attributes.cuisine)) reasons.push({ code: "matches_cuisine" });
  if (conditions.effort !== undefined && entry.effort <= conditions.effort) reasons.push({ code: "within_effort" });
  if (isQuick(entry)) reasons.push({ code: "quick", minutes: entry.minutes });

  const required = new Set(conditions.requiredFoods.flat());
  const used = [
    ...new Set(
      nutrition.ingredients
        .filter((ingredient) => !ingredient.switchedOff && ingredient.substitution === undefined && required.has(ingredient.food))
        .map((ingredient) => ingredient.food),
    ),
  ].sort();
  if (used.length > 0) reasons.push({ code: "uses_required_foods", foods: used });
  return reasons;
}
