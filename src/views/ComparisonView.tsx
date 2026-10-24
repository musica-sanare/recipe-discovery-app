import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { StatusMarker } from "../components/StatusMarker";
import { ViewHeading } from "../components/ViewHeading";
import { effortKey } from "../i18n/engineCodes";
import { useNavigation } from "../navigation/context";
import { ViewLink } from "../navigation/ViewLink";
import { useAppState, useLoadedContent } from "../state/context";
import type { SearchState } from "../state/reducer";
import { adjustmentItems, allergenNotices, targetLines } from "./candidates/display";
import { listText, minutesText, nutrientText, rangeText } from "./candidates/texts";
import { useTextContext } from "./useTextContext";

/** Two or three candidates side by side (docs/UI_DESIGN.md §3.3). */
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
    <ViewLink to={{ name: "candidates" }} className="text-accent underline">
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

  const cell = "border-b border-border px-3 py-2 align-top";
  const header = `${cell} bg-surface-muted text-left font-medium`;
  const rows: { readonly key: string; readonly label: string; readonly cells: readonly ReactNode[] }[] = [
    { key: "time", label: t("comparison.time"), cells: entries.map(({ entry }) => minutesText(t, locale, entry.minutes)) },
    { key: "effort", label: t("comparison.effort"), cells: entries.map(({ entry }) => t(`effort.${effortKey(entry.effort)}`)) },
    { key: "cuisine", label: t("comparison.cuisine"), cells: entries.map(({ entry }) => t(`cuisine.${entry.attributes.cuisine}`)) },
    ...(["kcal", "protein", "fat", "carbohydrate"] as const).map((target) => ({
      key: target,
      label: t(`target.${target}`),
      cells: entries.map(({ entry }) => {
        const line = targetLines(entry).find((candidate) => candidate.target === target);
        if (line === undefined) return null;
        const value = entry.solution.nutrition.perServing[line.nutrient];
        const range = entry.solution.nutrition.ranges[line.nutrient];
        return (
          <div className="flex flex-col">
            <span>{nutrientText(t, locale, line.nutrient, value)}</span>
            {range?.shown === true && <span className="text-sm text-muted">{rangeText(t, locale, line.nutrient, range.low, range.high)}</span>}
            {line.fit === undefined ? <span className="text-sm text-muted">{t("status.noTarget")}</span> : <StatusMarker status={line.fit.status} />}
          </div>
        );
      }),
    })),
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
      <div role="region" aria-labelledby="comparison-caption" tabIndex={0} className="overflow-x-auto rounded border border-border">
        <table className="w-full min-w-[32rem] border-collapse">
          <caption className="sr-only">{t("comparison.caption")}</caption>
          <thead>
            <tr>
              <th scope="col" className={`${header} sticky left-0`}>
                {t("comparison.item")}
              </th>
              {entries.map(({ entry, name }) => (
                <th key={entry.recipe} scope="col" className={header}>
                  <ViewLink to={{ name: "detail", recipe: entry.recipe }} className="text-accent underline">
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
              className="rounded border border-border px-3 py-2 text-sm"
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
