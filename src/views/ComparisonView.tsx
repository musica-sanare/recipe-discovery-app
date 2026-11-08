import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { NutrientBar } from "../components/NutrientBar";
import { StatusMarker } from "../components/StatusMarker";
import { ViewHeading } from "../components/ViewHeading";
import { boundaryNote } from "../format/format";
import { effortKey } from "../i18n/engineCodes";
import { useNavigation } from "../navigation/context";
import { ViewLink } from "../navigation/ViewLink";
import { useAppState, useLoadedContent } from "../state/context";
import type { SearchState } from "../state/reducer";
import { adjustmentItems, allergenNotices, missedBound, targetBounds, targetLines } from "./candidates/display";
import { boundText, listText, minutesText, nutrientText, preciseNutrientText, rangeText } from "./candidates/texts";
import { nutrientBar, shownLargest, TARGET_BAND } from "./nutritionBar";
import { useTextContext } from "./useTextContext";

/** Two or three candidates side by side (docs/en/UI_DESIGN.md §3.3). */
export function ComparisonView({ search }: { readonly search: SearchState }) {
  const { t } = useTranslation();
  const { navigated } = useNavigation();
  const { calc, text } = useLoadedContent();
  const { state, dispatch } = useAppState();
  const { locale } = useTextContext();
  const recipes = new Map(calc.recipes.map((recipe) => [recipe.id, recipe]));
  const entries = state.compare.flatMap((id) => {
    const entry = search.selection.candidates.find((candidate) => candidate.recipe === id);
    const recipe = recipes.get(id);
    return entry && recipe ? [{ entry, recipe, name: text.recipes[id]?.name ?? id }] : [];
  });

  const back = (
    <ViewLink to={{ name: "candidates" }} className="text-primary underline">
      {t("nav.backToCandidates")}
    </ViewLink>
  );

  if (entries.length < 2) {
    return (
      <div className="flex flex-col gap-4">
        <ViewHeading title={t("nav.views.comparison")} focusOnMount={navigated} />
        <p className="m-0">{t("comparison.tooFew")}</p>
        {back}
      </div>
    );
  }

  const targets = search.pool.request.targets;
  const cell = "border-b border-border px-3 py-2 align-top wrap-anywhere";
  const header = "border-b border-border bg-surface-muted px-2 py-2 text-left align-top text-sm font-medium wrap-anywhere lg:px-3 lg:text-base";
  const rows: { readonly key: string; readonly label: string; readonly note?: string; readonly cells: readonly ReactNode[] }[] = [
    { key: "time", label: t("comparison.time"), cells: entries.map(({ entry }) => minutesText(t, locale, entry.minutes)) },
    { key: "effort", label: t("comparison.effort"), cells: entries.map(({ entry }) => t(`effort.${effortKey(entry.effort)}`)) },
    { key: "cuisine", label: t("comparison.cuisine"), cells: entries.map(({ entry }) => t(`cuisine.${entry.attributes.cuisine}`)) },
    ...(["kcal", "protein", "fat", "carbohydrate"] as const).map((target) => {
      const lines = entries.map(({ entry }) => {
        const line = targetLines(entry).find((candidate) => candidate.target === target);
        if (line === undefined) return undefined;
        const value = entry.solution.nutrition.perServing[line.nutrient];
        const bound = line.fit === undefined || value === null ? undefined : missedBound(targets, line.fit);
        const note = bound === undefined || value === null ? undefined : boundaryNote(line.nutrient, value, bound);
        return { ...line, value, range: entry.solution.nutrition.ranges[line.nutrient], note };
      });
      const rowLargest = Math.max(...lines.map((line) => (line === undefined ? 0 : shownLargest(line.nutrient, line.value, line.note !== undefined, line.range ?? undefined))));
      // The target is the same for every recipe, so the row header names it once.
      const fit = lines.find((line) => line?.fit !== undefined)?.fit;
      return {
        key: target,
        label: t(`target.${target}`),
        note: fit === undefined ? t("status.noTarget") : boundText(t, locale, targets, fit),
        cells: lines.map((line) => {
          if (line === undefined) return null;
          const { nutrient, value, range, note } = line;
          const bar = line.fit === undefined ? undefined : nutrientBar(nutrient, value, note !== undefined, range ?? undefined, targetBounds(targets, target), rowLargest);
          return (
            <div className="flex flex-col gap-1">
              <span className="text-lg font-extrabold tabular-nums leading-tight">{note === undefined || value === null ? nutrientText(t, locale, nutrient, value) : preciseNutrientText(t, locale, nutrient, value)}</span>
              {bar !== undefined && <NutrientBar geometry={bar} fill={TARGET_BAND[target]} />}
              {line.fit !== undefined && (
                <span className="text-[0.8125rem]">
                  <StatusMarker status={line.fit.status} label={note === undefined ? undefined : t(`status.${note}`)} />
                </span>
              )}
              {range?.shown === true && <span className="text-[0.8125rem] text-muted">{rangeText(t, locale, nutrient, range.low, range.high)}</span>}
            </div>
          );
        }),
      };
    }),
    { key: "adjusted", label: t("comparison.adjusted"), cells: entries.map(({ entry, recipe }) => (adjustmentItems(entry, recipe).length > 0 ? t("comparison.yes") : t("comparison.no"))) },
    {
      key: "uncertainty",
      label: t("comparison.uncertainty"),
      cells: entries.map(({ entry }) => (entry.solution.nutrition.class === "exact" ? t("comparison.exact") : t(`card.uncertainty.${entry.solution.nutrition.class}`))),
    },
    {
      key: "allergens",
      label: t("comparison.allergens"),
      cells: entries.map(({ entry }) => {
        const { allergens, unknownFoods } = allergenNotices(entry.solution.nutrition, calc);
        const names = allergens.map((item) => (item.confidence === "contains" ? t(`allergen.names.${item.allergen}`) : t("card.allergenMay", { name: t(`allergen.names.${item.allergen}`) })));
        return listText(t, [...names, ...(unknownFoods.length > 0 ? [t("card.allergenUnknown")] : [])]);
      }),
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <ViewHeading title={t("nav.views.comparison")} focusOnMount={navigated} />
        {back}
      </div>
      {/* The table scrolls inside its own region on narrow screens; the page never scrolls sideways.
          The visible caption stays outside the region so that it does not scroll with the table. */}
      <p id="comparison-caption" className="-mb-2 text-sm text-muted">
        {t("comparison.caption")}
      </p>
      <div role="region" aria-labelledby="comparison-caption" tabIndex={0} className="panel overflow-x-auto">
        {/* Fixed columns: equal recipe columns give bars of equal length, and row headers keep their width in WebKit. */}
        <table className={`w-full table-fixed border-collapse ${entries.length === 3 ? "min-w-[35.75rem]" : "min-w-[26.25rem]"}`}>
          <caption className="sr-only">{t("comparison.caption")}</caption>
          <thead>
            <tr>
              <th scope="col" className={`${header} sticky left-0 w-[7.25rem] lg:w-44`}>
                {t("comparison.item")}
              </th>
              {entries.map(({ entry, name }) => (
                <th key={entry.recipe} scope="col" className={header}>
                  <ViewLink to={{ name: "detail", recipe: entry.recipe }} className="text-primary underline">
                    {name}
                  </ViewLink>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.key}>
                <th scope="row" className={`${header} sticky left-0`}>
                  {row.label}
                  {row.note !== undefined && <span className="block text-[0.8125rem] font-normal">{row.note}</span>}
                </th>
                {row.cells.map((content, index) => (
                  <td key={entries[index]?.entry.recipe ?? index} className={cell}>
                    {content}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
        {entries.map(({ entry, name }) => (
          <li key={entry.recipe}>
            <button
              type="button"
              onClick={() => {
                dispatch({ type: "toggledCompare", recipe: entry.recipe });
              }}
              className="btn-secondary text-sm"
            >
              {t("comparison.remove", { recipe: name })}
            </button>
          </li>
        ))}
      </ul>
      <div className="flex flex-col gap-2 text-sm text-muted">
        <p className="m-0">{t("disclaimer.estimates")}</p>
        <p className="m-0">{t("disclaimer.allergens")}</p>
      </div>
    </div>
  );
}
