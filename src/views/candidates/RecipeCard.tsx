import { useTranslation } from "react-i18next";
import type { Recommended } from "../../../domain/recommendation/recommend";
import type { Targets } from "../../../domain/recommendation/types";
import type { BundleRecipe, CalcBundle, TextBundle } from "../../../shared/bundle";
import { StatusMarker } from "../../components/StatusMarker";
import { boundaryNote, formatNumber } from "../../format/format";
import { effortKey } from "../../i18n/engineCodes";
import { ViewLink } from "../../navigation/ViewLink";
import { adjustmentItems, allergenNotices, cardReasons, gapReasons, missedBound, targetBounds, targetLines } from "./display";
import { boundText, listText, minutesText, nutrientText, preciseNutrientText, rangeText, reasonText, type TextContext } from "./texts";
import { Icon } from "../../components/icons/Icon";
import { NutrientLine } from "../../components/NutrientLine";
import { nutrientBar } from "../nutritionBar";

/** Each nutrient keeps one pastel for its target band; the label, not the color, tells them apart (ADR-037 D1, ADR-041 D2). */
const BAND: Readonly<Record<"kcal" | "protein" | "fat" | "carbohydrate", string>> = {
  kcal: "bg-butter",
  protein: "bg-mint",
  fat: "bg-lilac",
  carbohydrate: "bg-sky",
};

export interface RecipeCardProps {
  readonly entry: Recommended;
  readonly recipe: BundleRecipe;
  readonly calc: CalcBundle;
  readonly text: TextBundle;
  readonly targets: Targets;
  readonly context: TextContext;
  /** Candidates show the reason line; alternatives show every gap. */
  readonly mode: "candidate" | "alternative";
  readonly compare?: { readonly checked: boolean; readonly disabled: boolean; readonly onToggle: () => void };
  readonly onExclude?: () => void;
  /** Not shown in an earlier set of this page (ADR-041 D4). */
  readonly isNew?: boolean;
}

/** A candidate card (docs/en/SPEC.md §7, docs/en/UI_DESIGN.md §3.2). */
export function RecipeCard({ entry, recipe, calc, text, targets, context, mode, compare, onExclude, isNew = false }: RecipeCardProps) {
  const { t } = useTranslation();
  const { locale } = context;
  const texts = text.recipes[entry.recipe];
  const name = texts?.name ?? entry.recipe;
  const headingId = `card-${entry.recipe}`;
  const { fit, nutrition } = entry.solution;
  const adjustments = adjustmentItems(entry, recipe);
  const { allergens, unknownFoods } = allergenNotices(entry.solution.nutrition, calc);
  const reasons = (mode === "candidate" ? cardReasons(entry.reasons) : gapReasons(entry.reasons))
    .map((reason) => reasonText(reason, fit.nutrients, context))
    .filter((reason) => reason !== undefined);
  const required = entry.reasons.find((reason) => reason.code === "uses_required_foods");

  const adjustmentText = adjustments.map((item) => {
    switch (item.kind) {
      case "amount": {
        const format = (value: number) => (item.unit === "g" ? t("unit.gram", { value: formatNumber(locale, value) }) : formatNumber(locale, value));
        return t("card.adjustedAmount", { food: context.foodName(item.food), from: format(item.from), to: format(item.to) });
      }
      case "side_off":
        return t(item.forced ? "card.sideOffForced" : "card.sideOff", { side: texts?.sides[item.side] ?? item.side });
      case "substitution":
        return t("card.substitution", { note: texts?.substitutions[item.substitution]?.note ?? item.substitution });
    }
  });

  return (
    <article aria-labelledby={headingId} className="panel flex flex-col gap-3 p-4">
      <div className="flex items-start gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-surface-muted">
          <Icon name={entry.attributes.proteinGroup} size={26} />
        </span>
        <div className="flex flex-col gap-1">
          <h3 id={headingId} tabIndex={-1} className="m-0 text-lg font-extrabold leading-snug">
            <ViewLink to={{ name: "detail", recipe: entry.recipe }} className="text-text underline decoration-1 underline-offset-4">
              {name}
            </ViewLink>
          </h3>
          <p className="m-0 flex items-start gap-1 text-sm text-muted">
            <Icon name="time" size={18} className="mt-0.5" />
            {t("card.minutesEffort", { minutes: minutesText(t, locale, entry.minutes), effort: t(`effort.${effortKey(entry.effort)}`), cuisine: t(`cuisine.${entry.attributes.cuisine}`) })}
          </p>
          {isNew && (
            <p className="m-0">
              <span className="chip bg-sun text-sm font-bold text-on-sun">
                <Icon name="search" size={16} />
                {t("card.newToYou")}
              </span>
            </p>
          )}
        </div>
      </div>
      <p className="m-0">
        <StatusMarker status={fit.tier} label={t(`tier.${fit.tier}`)} />
      </p>
      {adjustments.length > 0 && (
        <p className="m-0 text-sm">
          <span className="chip mr-2 font-semibold">{t("card.adjusted")}</span>
          {listText(t, adjustmentText)}
        </p>
      )}

      <dl aria-label={t("card.nutrientsLabel")} className="m-0 flex flex-col gap-3">
        {targetLines(entry).map(({ target, nutrient, fit: line }) => {
          const value = nutrition.perServing[nutrient];
          const range = nutrition.ranges[nutrient];
          const bound = line === undefined || value === null ? undefined : missedBound(targets, line);
          const note = bound === undefined || value === null ? undefined : boundaryNote(nutrient, value, bound);
          const valueText = note === undefined || value === null ? nutrientText(t, locale, nutrient, value) : preciseNutrientText(t, locale, nutrient, value);
          const bar = line === undefined ? undefined : nutrientBar(nutrient, value, note !== undefined, range ?? undefined, targetBounds(targets, target));
          return (
            <NutrientLine key={target} label={t(`target.${target}`)} value={valueText} bar={bar} fill={BAND[target]} size="card">
              {line === undefined ? (
                <span>{t("status.noTarget")}</span>
              ) : (
                <>
                  <StatusMarker status={line.status} label={note === undefined ? undefined : t(`status.${note}`)} />
                  <span>{boundText(t, locale, targets, line)}</span>
                </>
              )}
              {range?.shown === true && <span className="text-muted">{rangeText(t, locale, nutrient, range.low, range.high)}</span>}
            </NutrientLine>
          );
        })}
      </dl>

      {reasons.length > 0 &&
        (mode === "candidate" ? (
          <p className="m-0 rounded-2xl bg-surface-muted px-3 py-2 text-sm">{listText(t, reasons)}</p>
        ) : (
          <div>
            <p className="m-0 text-sm font-medium">{t("card.gapsLabel")}</p>
            <ul className="m-0 list-disc pl-6">
              {reasons.map((reason) => (
                <li key={reason}>{reason}</li>
              ))}
            </ul>
          </div>
        ))}
      {required?.code === "uses_required_foods" && <p className="m-0 text-sm">{t("card.requiredUsed", { foods: listText(t, required.foods.map(context.foodName)) })}</p>}

      <div className="flex flex-wrap gap-2 text-sm">
        {nutrition.class !== "exact" && (
          <span className="rounded border border-border px-2 py-0.5">
            <Icon name="info" size={18} className="mr-1 inline align-[-3px]" />
            {t(`card.uncertainty.${nutrition.class}`)}
          </span>
        )}
        {allergens.length > 0 && (
          <span className="rounded border border-warning px-2 py-0.5">
            <Icon name="warning" size={18} className="mr-1 inline align-[-3px]" />
            {t("card.allergens", {
              list: listText(
                t,
                allergens.map((item) => (item.confidence === "contains" ? t(`allergen.names.${item.allergen}`) : t("card.allergenMay", { name: t(`allergen.names.${item.allergen}`) }))),
              ),
            })}
          </span>
        )}
        {unknownFoods.length > 0 && (
          <span className="rounded border border-warning px-2 py-0.5">
            <Icon name="warning" size={18} className="mr-1 inline align-[-3px]" />
            {t("card.allergenUnknown")}
          </span>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <ViewLink to={{ name: "detail", recipe: entry.recipe }} className="btn-outline">
          <span aria-hidden="true">{t("candidates.detailsShort")}</span>
          <span className="sr-only">{t("candidates.details", { recipe: name })}</span>
        </ViewLink>
        {compare !== undefined && (
          <label className="flex min-h-10 items-center gap-2">
            <input type="checkbox" checked={compare.checked} disabled={compare.disabled} onChange={compare.onToggle} className="size-5 accent-primary" />
            <span aria-hidden="true">{t("candidates.compareSelect")}</span>
            <span className="sr-only">{t("candidates.compareSelectNamed", { recipe: name })}</span>
          </label>
        )}
        {onExclude !== undefined && (
          <button type="button" onClick={onExclude} className="btn-secondary">
            <span aria-hidden="true">{t("candidates.excludeShort")}</span>
            <span className="sr-only">{t("candidates.exclude", { recipe: name })}</span>
          </button>
        )}
      </div>
    </article>
  );
}
