import { useMemo, useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import type { RecipeState } from "../../domain/nutrition/amounts";
import { nutritionBasis } from "../../domain/nutrition/basis";
import type { Nutrient } from "../../domain/nutrition/data";
import { calculateNutrition, type RecipeNutrition } from "../../domain/nutrition/engine";
import { evaluateFit, TARGET_NUTRIENT, type Fit } from "../../domain/recommendation/fit";
import type { BundleRecipe } from "../../shared/bundle";
import { StatusMarker } from "../components/StatusMarker";
import { ViewHeading } from "../components/ViewHeading";
import { boundaryNote, displayedDifference, formatDifference, formatGrams, formatNumber, formatPercent, formatQuantity, householdPluralCount } from "../format/format";
import { effortKey } from "../i18n/engineCodes";
import { useNavigation } from "../navigation/context";
import { ViewLink } from "../navigation/ViewLink";
import { useAppState, useLoadedContent } from "../state/context";
import { allergenNotices, missedBound } from "./candidates/display";
import { boundText, listText, minutesText, nutrientText, preciseNutrientText, rangeText } from "./candidates/texts";
import {
  adjustableAmounts,
  defaultRecipeState,
  recipeMinutes,
  scaledMeasure,
  shownSafetyNotes,
  shownSteps,
  startingState,
  steppedAmount,
  steppedServings,
  withSide,
  withSubstitution,
} from "./detail/model";
import { DetailShoppingBlock } from "./shopping/DetailShoppingBlock";
import { useTextContext } from "./useTextContext";
import { Icon, Illustration } from "../components/icons/Icon";

const SHOWN_NUTRIENTS: readonly Nutrient[] = ["ENERC_KCAL", "PROT-", "FAT-", "CHOCDF-", "NACL_EQ"];
const TABLE_NUTRIENTS: readonly Nutrient[] = ["ENERC_KCAL", "PROT-", "FAT-", "CHOCDF-"];
/**
 * Nutrient tiles keep the pastels of the candidate cards; the label, not the color, tells
 * them apart (ADR-037 D1, ADR-041 D2). Energy spans the row, the other four follow two (phones) or
 * four (from `md`) to a row. Salt equivalent has no target.
 */
const TILE: Readonly<Partial<Record<Nutrient, string>>> = {
  ENERC_KCAL: "col-span-2 bg-butter md:col-span-4",
  "PROT-": "bg-mint",
  "FAT-": "bg-lilac",
  "CHOCDF-": "bg-sky",
  NACL_EQ: "bg-surface-muted",
};

function Section({ id, title, children }: { readonly id: string; readonly title: string; readonly children: ReactNode }) {
  return (
    <section aria-labelledby={id} className="panel flex flex-col gap-3 p-4">
      <h2 id={id} className="m-0 text-xl font-extrabold">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Stepper({ label, value, onStep, decrease, increase }: { readonly label: string; readonly value: string; readonly onStep: (direction: 1 | -1) => void; readonly decrease: string; readonly increase: string }) {
  const button = "flex size-10 items-center justify-center rounded border border-border bg-surface-muted text-lg leading-none";
  return (
    // The label wraps inside its column, so the buttons never wrap away from the value (ADR-041).
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
      <span className="font-medium break-words">{label}</span>
      <span className="flex items-center gap-2">
        <button
          type="button"
          className={button}
          aria-label={decrease}
          onClick={() => {
            onStep(-1);
          }}
        >
          −
        </button>
        <output className="min-w-16 text-center" aria-live="off">
          {value}
        </output>
        <button
          type="button"
          className={button}
          aria-label={increase}
          onClick={() => {
            onStep(1);
          }}
        >
          +
        </button>
      </span>
    </div>
  );
}

/** Recipe detail with adjustment and instant recalculation (docs/en/UI_DESIGN.md §3.4, ADR-030 D8). */
export function DetailView({ recipe: recipeId }: { readonly recipe: string }) {
  const { t } = useTranslation();
  const { navigated } = useNavigation();
  const { calc, text, data } = useLoadedContent();
  const { state, dispatch } = useAppState();
  const { locale } = useTextContext();
  const recipe = useMemo(() => calc.recipes.find((candidate) => candidate.id === recipeId), [calc, recipeId]);
  const texts = text.recipes[recipeId];
  const search = state.search;
  const [previous, setPrevious] = useState<{ readonly nutrition: RecipeNutrition; readonly fit: Fit | undefined } | undefined>(undefined);
  const [announcement, setAnnouncement] = useState("");

  const back =
    search === undefined ? (
      <ViewLink to={{ name: "targets" }} className="text-primary underline">
        {t("nav.toTargets")}
      </ViewLink>
    ) : (
      <ViewLink to={{ name: "candidates" }} className="text-primary underline">
        {t("nav.backToCandidates")}
      </ViewLink>
    );

  if (recipe === undefined || texts === undefined) {
    return (
      <div className="flex flex-col items-start gap-4">
        <Illustration name="not_found" className="w-48" />
        <ViewHeading title={t("nav.notFound")} focusOnMount={navigated} />
        {back}
      </div>
    );
  }

  const entry = search?.pool.entries.find((candidate) => candidate.recipe === recipeId);
  const servings = search?.pool.request.servings ?? recipe.servings;
  const recipeState = state.adjustments[recipeId] ?? startingState(entry, servings);
  const calculated = calculateNutrition(recipe, recipeState, data.engine);
  const targets = search?.pool.request.targets;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <ViewHeading title={texts.name} focusOnMount={navigated} />
          {back}
        </div>
        <p className="m-0">{texts.summary}</p>
        <p className="m-0 text-sm text-muted">
          {t("detail.meta", { minutes: minutesText(t, locale, recipeMinutes(recipe, recipeState)), effort: t(`effort.${effortKey(recipe.effort)}`), cuisine: t(`cuisine.${recipe.cuisine}`) })}
        </p>
        {recipe.equipment.length > 0 && <p className="m-0 text-sm text-muted">{t("detail.equipment", { list: listText(t, recipe.equipment.map((item) => t(`equipment.${item}`))) })}</p>}
      </div>
      <p className="sr-only" aria-live="polite">
        {announcement}
      </p>
      {calculated.ok ? (
        <DetailBody
          recipe={recipe}
          recipeState={recipeState}
          nutrition={calculated.value}
          fit={targets === undefined ? undefined : evaluateFit(calculated.value, targets)}
          previous={previous}
          onChange={(next, before) => {
            const after = calculateNutrition(recipe, next, data.engine);
            dispatch({ type: "adjusted", recipe: recipeId, state: next });
            setPrevious(before);
            if (after.ok) {
              const changes = differenceTexts(t, locale, before.nutrition, after.value);
              setAnnouncement(t("adjust.recalculated", { list: changes.length > 0 ? listText(t, changes) : t("detail.noChange") }));
            }
          }}
          onReset={() => defaultRecipeState(entry, servings)}
          solverState={entry?.solution.state}
        />
      ) : (
        <div role="alert" className="flex flex-col items-start gap-2 rounded border-2 border-not-met p-3">
          <p className="m-0">{t("detail.calculationError")}</p>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => {
              dispatch({ type: "adjusted", recipe: recipeId, state: undefined });
            }}
          >
            {t("adjust.reset")}
          </button>
        </div>
      )}
    </div>
  );
}

/** "protein +8 g" for every shown nutrient whose displayed value changed (ADR-030 D8). */
function differenceTexts(t: ReturnType<typeof useTranslation>["t"], locale: ReturnType<typeof useTextContext>["locale"], before: RecipeNutrition, after: RecipeNutrition): string[] {
  return SHOWN_NUTRIENTS.flatMap((nutrient) => {
    if (!displayedDifference(nutrient, before.perServing[nutrient], after.perServing[nutrient])) return [];
    const difference = formatDifference(locale, nutrient, before.perServing[nutrient], after.perServing[nutrient]) ?? "";
    const value = nutrient === "ENERC_KCAL" ? t("unit.kcal", { value: difference }) : t("unit.gram", { value: difference });
    return [`${t(`nutrient.${nutrient}`)} ${value}`];
  });
}

interface BodyProps {
  readonly recipe: BundleRecipe;
  readonly recipeState: RecipeState;
  readonly nutrition: RecipeNutrition;
  readonly fit: Fit | undefined;
  readonly previous: { readonly nutrition: RecipeNutrition; readonly fit: Fit | undefined } | undefined;
  readonly onChange: (next: RecipeState, before: { readonly nutrition: RecipeNutrition; readonly fit: Fit | undefined }) => void;
  readonly onReset: () => RecipeState;
  readonly solverState: RecipeState | undefined;
}

function DetailBody({ recipe, recipeState, nutrition, fit, previous, onChange, onReset, solverState }: BodyProps) {
  const { t } = useTranslation();
  const { calc, text, data } = useLoadedContent();
  const { state } = useAppState();
  const context = useTextContext();
  const { locale, foodName } = context;
  const texts = text.recipes[recipe.id];
  const targets = state.search?.pool.request.targets;
  const basis = nutritionBasis(recipe, nutrition, data.engine);
  const change = (next: RecipeState) => {
    onChange(next, { nutrition, fit });
  };
  const servingsText = t("candidates.servings", { count: recipeState.servings });
  const { allergens, unknownFoods } = allergenNotices(nutrition, calc);
  const steps = shownSteps(recipe, recipeState, nutrition);
  const safety = shownSafetyNotes(recipe, recipeState);
  const ingredientName = (key: string) => {
    const ingredient = nutrition.ingredients.find((candidate) => candidate.key === key);
    return ingredient === undefined ? key : foodName(ingredient.food);
  };

  const changes = previous === undefined ? [] : differenceTexts(t, locale, previous.nutrition, nutrition);
  const statusChanges =
    previous?.fit === undefined || fit === undefined
      ? []
      : fit.nutrients.flatMap((line) => {
          const before = previous.fit?.nutrients.find((candidate) => candidate.target === line.target);
          return before === undefined || before.status === line.status
            ? []
            : [t("detail.statusChange", { target: t(`target.${line.target}`), from: t(`status.${before.status}`), to: t(`status.${line.status}`) })];
        });

  return (
    <>
      {(allergens.length > 0 || unknownFoods.length > 0) && (
        <div className="flex flex-col gap-1 notice-warning">
          {allergens.length > 0 && (
            <p className="m-0">
              <Icon name="warning" size={18} className="mr-1 inline align-[-3px]" />
              {t("card.allergens", {
                list: listText(
                  t,
                  allergens.map((item) => (item.confidence === "contains" ? t(`allergen.names.${item.allergen}`) : t("card.allergenMay", { name: t(`allergen.names.${item.allergen}`) }))),
                ),
              })}
            </p>
          )}
          {unknownFoods.length > 0 && <p className="m-0">{t("card.allergenUnknown")}</p>}
          <p className="m-0 text-sm">{t("disclaimer.allergens")}</p>
        </div>
      )}

      <Section id="nutrition-heading" title={t("detail.perServing")}>
        <dl className="m-0 grid grid-cols-2 gap-2 md:grid-cols-4">
          {SHOWN_NUTRIENTS.map((nutrient) => {
            const value = nutrition.perServing[nutrient];
            const range = nutrition.ranges[nutrient];
            const line = fit?.nutrients.find((candidate) => TARGET_NUTRIENT[candidate.target] === nutrient);
            const bound = line === undefined || targets === undefined ? undefined : missedBound(targets, line);
            const note = bound === undefined || value === null ? undefined : boundaryNote(nutrient, value, bound);
            return (
              <div key={nutrient} className={`flex flex-col gap-0.5 rounded-2xl border border-transparent p-3 ${TILE[nutrient] ?? ""}`}>
                <dt className="text-sm">{t(`nutrient.${nutrient}`)}</dt>
                <dd className="m-0 flex flex-col items-start gap-0.5 text-sm">
                  <span className="text-[1.75rem] font-extrabold tabular-nums leading-tight">{note === undefined || value === null ? nutrientText(t, locale, nutrient, value) : preciseNutrientText(t, locale, nutrient, value)}</span>
                  {range?.shown === true && <span className="text-[0.8125rem]">{rangeText(t, locale, nutrient, range.low, range.high)}</span>}
                  {value === null && nutrition.incomplete[nutrient].length > 0 && (
                    <span className="text-[0.8125rem]">{t("detail.missingFoods", { list: listText(t, nutrition.incomplete[nutrient].map(ingredientName)) })}</span>
                  )}
                  {fit !== undefined && line === undefined && nutrient !== "NACL_EQ" && <span className="text-[0.8125rem]">{t("status.noTarget")}</span>}
                  {line !== undefined && targets !== undefined && (
                    <>
                      <StatusMarker status={line.status} label={note === undefined ? undefined : t(`status.${note}`)} />
                      <span className="text-[0.8125rem]">{boundText(t, locale, targets, line)}</span>
                    </>
                  )}
                </dd>
              </div>
            );
          })}
        </dl>
        {fit === undefined && <p className="m-0 text-sm text-muted">{t("detail.noSearch")}</p>}
        {previous !== undefined && (
          <div className="rounded-2xl border border-transparent bg-surface-muted p-3 text-sm">
            <p className="m-0">{changes.length > 0 ? t("detail.changes", { list: listText(t, changes) }) : t("detail.noChange")}</p>
            {statusChanges.length > 0 && <p className="m-0">{t("detail.statusChanges", { list: listText(t, statusChanges) })}</p>}
          </div>
        )}
        <p className="m-0 text-sm text-muted">{t("disclaimer.estimates")}</p>
      </Section>

      <Section id="adjust-heading" title={t("detail.adjustHeading")}>
        <Stepper
          label={t("adjust.servings")}
          value={servingsText}
          decrease={t("adjust.decrease", { field: t("adjust.servings") })}
          increase={t("adjust.increase", { field: t("adjust.servings") })}
          onStep={(direction) => {
            change({ ...recipeState, servings: steppedServings(recipeState.servings, direction) });
          }}
        />
        {adjustableAmounts(recipe, recipeState).map(({ ingredient, adjust, value }) => {
          const name = ingredientName(ingredient.key);
          const label = recipe.servings === 1 ? name : t("adjust.amountPerAuthored", { food: name, count: recipe.servings });
          const shown = adjust.kind === "grams" ? t("unit.gram", { value: formatNumber(locale, value) }) : formatNumber(locale, value);
          return (
            <Stepper
              key={ingredient.key}
              label={label}
              value={shown}
              decrease={t("adjust.decrease", { field: name })}
              increase={t("adjust.increase", { field: name })}
              onStep={(direction) => {
                change({ ...recipeState, amounts: { ...recipeState.amounts, [ingredient.key]: steppedAmount(adjust, value, direction) } });
              }}
            />
          );
        })}
        {recipe.sides.length > 0 && (
          <fieldset className="flex flex-col gap-1 rounded border border-border p-3">
            <legend className="px-1 font-medium">{t("adjust.sidesLegend")}</legend>
            {recipe.sides.map((side) => {
              const forced = state.search?.pool.entries.find((candidate) => candidate.recipe === recipe.id)?.forced.sidesOff.includes(side.key) ?? false;
              return (
                <label key={side.key} className="flex min-h-10 items-center gap-2">
                  <input
                    type="checkbox"
                    className="size-5 accent-primary"
                    checked={!recipeState.sidesOff.includes(side.key)}
                    disabled={forced}
                    onChange={(event) => {
                      change(withSide(recipeState, side.key, event.target.checked));
                    }}
                  />
                  <span>
                    {texts?.sides[side.key] ?? side.key}
                    {forced && <span className="text-sm text-muted"> {t("detail.parenthetical", { text: "", note: t("adjust.sideForcedOff") }).trim()}</span>}
                  </span>
                </label>
              );
            })}
          </fieldset>
        )}
        {[...new Set(recipe.substitutions.map((substitution) => substitution.ingredient))].map((ingredientKey) => {
          const options = recipe.substitutions.filter((substitution) => substitution.ingredient === ingredientKey);
          const forced = state.search?.pool.entries.find((candidate) => candidate.recipe === recipe.id)?.forced.substitutions ?? [];
          const isForced = options.some((option) => forced.includes(option.key));
          const current = options.find((option) => recipeState.substitutions.includes(option.key))?.key;
          const authored = recipe.ingredients.find((ingredient) => ingredient.key === ingredientKey);
          return (
            <fieldset key={ingredientKey} className="flex flex-col gap-1 rounded border border-border p-3">
              <legend className="px-1 font-medium">
                {t("detail.labelled", { label: t("adjust.substitutionLegend"), text: authored === undefined ? ingredientKey : foodName(authored.food) })}
              </legend>
              {isForced && <p className="m-0 text-sm text-muted">{t("adjust.substitutionForced")}</p>}
              {[undefined, ...options.map((option) => option.key)].map((key) => (
                <label key={key ?? "none"} className="flex min-h-10 items-center gap-2">
                  <input
                    type="radio"
                    name={`substitution-${ingredientKey}`}
                    className="size-5 accent-primary"
                    checked={current === key}
                    disabled={isForced}
                    onChange={() => {
                      change(withSubstitution(recipe, recipeState, ingredientKey, key));
                    }}
                  />
                  <span>{key === undefined ? t("adjust.substitutionNone") : (texts?.substitutions[key]?.note ?? key)}</span>
                </label>
              ))}
            </fieldset>
          );
        })}
        <div className="flex flex-wrap gap-3">
          {solverState !== undefined && (
            <button
              type="button"
              className="btn-primary"
              onClick={() => {
                change({ ...solverState, servings: recipeState.servings });
              }}
            >
              {t("adjust.fit")}
            </button>
          )}
          <button
            type="button"
            className="btn-secondary"
            onClick={() => {
              change({ ...onReset(), servings: recipeState.servings });
            }}
          >
            {t("adjust.reset")}
          </button>
        </div>
        {solverState !== undefined && <p className="m-0 text-sm text-muted">{t("adjust.fitHint")}</p>}
      </Section>

      <DetailShoppingBlock recipe={recipe.id} recipeState={recipeState} />

      <Section id="ingredients-heading" title={t("detail.ingredientsHeading", { servings: servingsText })}>
        {/* The visible caption stays outside the scrolling region so that it does not scroll with the table. */}
        <p id="ingredients-caption" className="m-0 text-sm text-muted">
          {t("detail.ingredientsCaption", { servings: servingsText })}
        </p>
        <div role="region" aria-labelledby="ingredients-caption" tabIndex={0} className="overflow-x-auto rounded border border-border">
          <table className="w-full min-w-[40rem] border-collapse text-sm">
            <caption className="sr-only">{t("detail.ingredientsCaption", { servings: servingsText })}</caption>
            <thead>
              <tr className="bg-surface-muted text-left">
                <th scope="col" className="px-2 py-2">
                  {t("detail.ingredientColumn")}
                </th>
                <th scope="col" className="px-2 py-2">
                  {t("detail.amountColumn")}
                </th>
                <th scope="col" className="px-2 py-2">
                  {t("detail.sourceColumn")}
                </th>
                {TABLE_NUTRIENTS.map((nutrient) => (
                  <th key={nutrient} scope="col" className="px-2 py-2 text-right">
                    {t(`nutrient.${nutrient}`)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {nutrition.ingredients
                .filter((ingredient) => !ingredient.switchedOff || ingredient.notCounted !== "side_off")
                .map((ingredient) => {
                  const measure = scaledMeasure(recipe, ingredient);
                  const note = texts?.ingredientNotes[ingredient.key];
                  const measureText =
                    measure === undefined
                      ? undefined
                      : t(`unit.household.${measure.unit}`, {
                          count: householdPluralCount(measure.quantity),
                          amount: formatQuantity(locale, measure.quantity, (whole, fraction) => t("unit.mixedFraction", { whole, fraction })),
                        });
                  return (
                    <tr key={ingredient.key} className="border-t border-border align-top">
                      <th scope="row" className="px-2 py-2 text-left font-medium">
                        {foodName(ingredient.food)}
                        {ingredient.substitution !== undefined && <span className="block text-muted">{t("detail.substitutedFrom")}</span>}
                        {note !== undefined && <span className="block font-normal text-muted">{note}</span>}
                      </th>
                      <td className="px-2 py-2">
                        {t("unit.gram", { value: formatGrams(locale, ingredient.grams) })}
                        {measureText !== undefined && measureText.trim() !== "" && <span className="block text-muted">{measureText}</span>}
                      </td>
                      <td className="px-2 py-2">
                        <span className="block">{t("detail.foodCode", { code: ingredient.code })}</span>
                        <span className="block text-muted">
                          {t(`foodState.${ingredient.state}`)}
                          {ingredient.ratePercent !== undefined && ` · ${t("detail.weightChange", { rate: formatPercent(locale, ingredient.ratePercent / 100) })}`}
                        </span>
                        {ingredient.class !== "exact" && <span className="block">{t(`uncertainty.class.${ingredient.class}`)}</span>}
                      </td>
                      {ingredient.counted ? (
                        TABLE_NUTRIENTS.map((nutrient) => (
                          <td key={nutrient} className="px-2 py-2 text-right">
                            {nutrientText(t, locale, nutrient, ingredient.amounts[nutrient])}
                          </td>
                        ))
                      ) : (
                        <td colSpan={TABLE_NUTRIENTS.length} className="px-2 py-2 text-muted">
                          {ingredient.notCounted === "included_in"
                            ? t("detail.notCounted.included_in", { ingredient: ingredientName(ingredient.includedIn ?? "") })
                            : t("detail.notCounted.side_off")}
                        </td>
                      )}
                    </tr>
                  );
                })}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-border font-medium">
                <th scope="row" colSpan={3} className="px-2 py-2 text-left">
                  {t("detail.total", { servings: servingsText })}
                </th>
                {TABLE_NUTRIENTS.map((nutrient) => (
                  <td key={nutrient} className="px-2 py-2 text-right">
                    {nutrientText(t, locale, nutrient, nutrition.total[nutrient])}
                  </td>
                ))}
              </tr>
              <tr className="font-medium">
                <th scope="row" colSpan={3} className="px-2 py-2 text-left">
                  {t("detail.perServingRow")}
                </th>
                {TABLE_NUTRIENTS.map((nutrient) => (
                  <td key={nutrient} className="px-2 py-2 text-right">
                    {nutrientText(t, locale, nutrient, nutrition.perServing[nutrient])}
                  </td>
                ))}
              </tr>
            </tfoot>
          </table>
        </div>
      </Section>

      <Section id="steps-heading" title={t("detail.stepsHeading")}>
        <ol className="m-0 flex list-decimal flex-col gap-2 pl-6">
          {steps.steps.map((step) => {
            const stepTexts = texts?.steps[step.key];
            const replaced = step.substitution === undefined ? undefined : texts?.substitutions[step.substitution]?.stepTexts[step.key];
            return (
              <li key={step.key}>
                {replaced ?? stepTexts?.text ?? step.key}
                {step.notes.map((index) => (
                  <span key={index} className="block text-sm text-muted">
                    {stepTexts?.notes[index]}
                  </span>
                ))}
              </li>
            );
          })}
        </ol>
        {steps.hidden > 0 && <p className="m-0 text-sm text-muted">{t("detail.sideStepHidden", { count: steps.hidden })}</p>}
      </Section>

      {safety.length > 0 && (
        <Section id="safety-heading" title={t("detail.safetyHeading")}>
          <ul className="m-0 flex list-none flex-col gap-2 p-0">
            {safety.map((item) => (
              <li key={`${item.key}-${item.substitution ?? ""}`} className="notice-warning">
                <Icon name="warning" size={18} className="mr-1 inline align-[-3px]" />
                {item.substitution === undefined ? texts?.safetyNotes[item.key] : (texts?.substitutions[item.substitution]?.safetyNotes[item.key] ?? texts?.safetyNotes[item.key])}
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Section id="basis-heading" title={t("detail.basisHeading")}>
        <p className="m-0">{t("detail.basisIntro")}</p>
        <BasisLists basis={basis} nutrition={nutrition} ingredientName={ingredientName} />
        <p className="m-0">{t("assumption.energyFromTable")}</p>
        <p className="m-0 text-sm text-muted">
          {t("detail.dataVersion", { date: basis.versions.composition.workbookUpdated, sha: basis.versions.composition.workbookSha256.slice(0, 12), content: basis.versions.contentVersion })}
        </p>
        <p className="m-0 text-sm">
          <span lang="ja">{t("attribution.source")}</span> {t("attribution.sourceTranslation")} {t("attribution.ownCalculation")}
        </p>
        <p className="m-0 text-sm text-muted">{t("disclaimer.strictControl")}</p>
      </Section>
    </>
  );
}

function BasisLists({ basis, nutrition, ingredientName }: { readonly basis: ReturnType<typeof nutritionBasis>; readonly nutrition: RecipeNutrition; readonly ingredientName: (key: string) => string }) {
  const { t } = useTranslation();
  const { locale } = useTextContext();
  const labelled = (label: string, text: string) => t("detail.labelled", { label, text });
  const reasons = basis.ingredients.filter((ingredient) => ingredient.counted && ingredient.reasons.length > 0);
  const assumptions = basis.ingredients.flatMap((ingredient) =>
    ingredient.assumptions.map((assumption) => {
      switch (assumption.code) {
        case "included_in_cooked_value":
          return labelled(ingredientName(ingredient.key), t("assumption.included_in_cooked_value", { ingredient: ingredientName(assumption.ingredient) }));
        case "energy_from_fat":
          return labelled(ingredientName(ingredient.key), t("assumption.energy_from_fat", { kcalPerGram: formatNumber(locale, assumption.kcalPerGram) }));
        case "pinch_as_stated_grams":
          return labelled(ingredientName(ingredient.key), t("assumption.pinch_as_stated_grams", { grams: t("unit.gram", { value: formatGrams(locale, assumption.grams) }) }));
        case "oil_counted_in_full":
        case "parts_removed_after_cooking":
          return labelled(ingredientName(ingredient.key), t(`assumption.${assumption.code}`));
      }
    }),
  );
  const incomplete = SHOWN_NUTRIENTS.filter((nutrient) => nutrition.incomplete[nutrient].length > 0);
  const anyRange = SHOWN_NUTRIENTS.some((nutrient) => nutrition.ranges[nutrient]?.shown === true);

  return (
    <>
      {reasons.length > 0 && (
        <div>
          <h3 className="m-0 text-base font-bold">{t("detail.reasonsHeading")}</h3>
          <ul className="m-0 list-disc pl-6">
            {reasons.map((ingredient) => (
              <li key={ingredient.key}>
                {labelled(ingredientName(ingredient.key), ingredient.reasons.map((reason) => t(`uncertainty.reason.${reason}`)).join(" "))}
              </li>
            ))}
          </ul>
          {anyRange && <p className="m-0 text-sm text-muted">{t("detail.rangeExplained")}</p>}
        </div>
      )}
      {assumptions.length > 0 && (
        <div>
          <h3 className="m-0 text-base font-bold">{t("detail.assumptionsHeading")}</h3>
          <ul className="m-0 list-disc pl-6">
            {assumptions.map((assumption) => (
              <li key={assumption}>{assumption}</li>
            ))}
          </ul>
        </div>
      )}
      {incomplete.length > 0 && (
        <div>
          <h3 className="m-0 text-base font-bold">{t("detail.incompleteHeading")}</h3>
          <ul className="m-0 list-disc pl-6">
            {incomplete.map((nutrient) => (
              <li key={nutrient}>
                {t("detail.parenthetical", { text: t("uncertainty.incomplete", { nutrient: t(`nutrient.${nutrient}`) }), note: listText(t, nutrition.incomplete[nutrient].map(ingredientName)) })}
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
