/**
 * Localized texts for engine reason data, exclusions, and relaxations
 * (src/i18n/messages, ADR-030 D7, D12). Numbers come from the engine and are only formatted.
 */
import type { TFunction } from "i18next";
import type { Nutrient } from "../../../domain/nutrition/data";
import { TARGET_NUTRIENT, type NutrientFit } from "../../../domain/recommendation/fit";
import type { ReasonData } from "../../../domain/recommendation/reasons";
import type { Relaxation } from "../../../domain/recommendation/relax";
import type { ExclusionCount, Targets } from "../../../domain/recommendation/types";
import type { Locale } from "../../../shared/locales";
import { formatGap, formatNumber, formatNutrient, formatNutrientRange, formatPrecise } from "../../format/format";

export interface TextContext {
  readonly t: TFunction;
  readonly locale: Locale;
  readonly foodName: (food: string) => string;
  /** The label of a required item by its index in the request. */
  readonly requiredLabel: (index: number) => string;
}

export function listText(t: TFunction, items: readonly string[]): string {
  return items.join(t("common.listSeparator"));
}

export function minutesText(t: TFunction, locale: Locale, minutes: number): string {
  return t("unit.minute", { count: minutes, value: formatNumber(locale, minutes) });
}

/** A nutrient value with its unit, or "unknown" (never zero). */
export function nutrientText(t: TFunction, locale: Locale, nutrient: Nutrient, value: number | null): string {
  const formatted = formatNutrient(locale, nutrient, value);
  if (formatted === null) return t("common.unknown");
  return nutrient === "ENERC_KCAL" ? t("unit.kcal", { value: formatted }) : t("unit.gram", { value: formatted });
}

/** One decimal finer, for values with a boundary note (docs/NUTRITION_CALCULATION.md §8). */
export function preciseNutrientText(t: TFunction, locale: Locale, nutrient: Nutrient, value: number): string {
  return withUnit(t, nutrient, formatPrecise(locale, nutrient, value));
}

/** A shown range with its unit, e.g. "estimated range 560–590 kcal". */
export function rangeText(t: TFunction, locale: Locale, nutrient: Nutrient, low: number, high: number): string {
  return t("card.range", { range: withUnit(t, nutrient, formatNutrientRange(locale, nutrient, low, high)) });
}

function withUnit(t: TFunction, nutrient: Nutrient, value: string): string {
  return nutrient === "ENERC_KCAL" ? t("unit.kcal", { value }) : t("unit.gram", { value });
}

/** The target of a nutrient as set by the user, e.g. "min. 35 g" or "target 450–650 kcal". */
export function boundText(t: TFunction, locale: Locale, targets: Targets, fit: NutrientFit): string {
  const nutrient = TARGET_NUTRIENT[fit.target];
  const range = (bound: { readonly min: number; readonly max: number }) => t("card.boundRange", { range: withUnit(t, nutrient, formatNutrientRange(locale, nutrient, bound.min, bound.max)) });
  switch (fit.target) {
    case "kcal":
      return range(targets.kcal);
    case "carbohydrate":
      return targets.carbohydrate === undefined ? "" : range(targets.carbohydrate);
    case "protein":
      return targets.proteinMin === undefined ? "" : t("card.boundMin", { value: withUnit(t, nutrient, formatNumber(locale, targets.proteinMin)) });
    case "fat":
      return targets.fatMax === undefined ? "" : t("card.boundMax", { value: withUnit(t, nutrient, formatNumber(locale, targets.fatMax)) });
  }
}

/**
 * A reason as text, or undefined when it adds nothing to show: a gap of zero comes with a
 * straddling range, which has its own reason.
 */
export function reasonText(reason: ReasonData, fits: readonly NutrientFit[], context: TextContext): string | undefined {
  const { t, locale } = context;
  switch (reason.code) {
    case "near_target":
    case "misses_target": {
      if (reason.gap === 0) return undefined;
      const position = fits.find((fit) => fit.target === reason.target)?.position;
      const direction = position === "above_max" || position === "straddles_max" ? "above" : "below";
      const nutrient = TARGET_NUTRIENT[reason.target];
      return t(`reason.${reason.code}.${direction}`, { target: t(`target.${reason.target}`), gap: withUnit(t, nutrient, formatGap(locale, nutrient, reason.gap)) });
    }
    case "unknown_value":
    case "range_straddles":
      return t(`reason.${reason.code}`, { target: t(`target.${reason.target}`) });
    case "highest_among_candidates":
    case "lowest_among_candidates":
      return t(`reason.${reason.code}`, { value: nutrientText(t, locale, reason.nutrient, reason.value) });
    case "new_attribute":
      return t(`reason.new_attribute.${reason.attribute}`);
    case "quick":
      return t("reason.quick", { minutes: minutesText(t, locale, reason.minutes) });
    case "uses_required_foods":
      return t("reason.uses_required_foods", { foods: listText(t, reason.foods.map(context.foodName)) });
    case "meets_all_targets":
    case "meets_with_adjustment":
    case "matches_cuisine":
    case "within_effort":
      return t(`reason.${reason.code}`);
  }
}

export function exclusionText(exclusion: ExclusionCount, context: TextContext): string {
  const { t } = context;
  const { item, count } = exclusion;
  switch (item.constraint) {
    case "maxMinutes":
    case "sessionExcluded":
      return t(`exclusion.${item.constraint}`, { count });
    case "equipment":
      return t("exclusion.equipment", { count, equipment: t(`equipment.${item.equipment}`) });
    case "allergen":
      return t("exclusion.allergen", { count, allergen: t(`allergen.names.${item.allergen}`) });
    case "excludedFood":
      return t("exclusion.excludedFood", { count, food: context.foodName(item.food) });
    case "requiredFood":
      return t("exclusion.requiredFood", { count, foods: context.requiredLabel(item.index) });
  }
}

export function relaxationText(relaxation: Relaxation, context: TextContext): { readonly action: string; readonly gains: string } {
  const { t, locale } = context;
  const gains = [
    relaxation.gain.met > 0 ? t("relaxation.gainMet", { count: relaxation.gain.met }) : undefined,
    relaxation.gain.near > 0 ? t("relaxation.gainNear", { count: relaxation.gain.near }) : undefined,
  ].filter((part) => part !== undefined);
  const gainText = listText(t, gains);
  switch (relaxation.constraint) {
    case "maxMinutes":
      return { action: t("relaxation.maxMinutes", { minutes: minutesText(t, locale, relaxation.to) }), gains: gainText };
    case "equipment":
      return { action: t("relaxation.equipment", { equipment: t(`equipment.${relaxation.add}`) }), gains: gainText };
    case "requiredFood":
      return { action: t("relaxation.requiredFood", { foods: context.requiredLabel(relaxation.index) }), gains: gainText };
    case "excludedFood":
      return { action: t("relaxation.excludedFood", { food: context.foodName(relaxation.food) }), gains: gainText };
  }
}
