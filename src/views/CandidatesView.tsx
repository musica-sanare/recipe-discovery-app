import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import type { Recommended } from "../../domain/recommendation/recommend";
import { MIN_CANDIDATES } from "../../domain/recommendation/recommend";
import type { Relaxation } from "../../domain/recommendation/relax";
import { ViewHeading } from "../components/ViewHeading";
import { formatNumber, formatNutrientRange } from "../format/format";
import { useNavigation } from "../navigation/context";
import { ViewLink } from "../navigation/ViewLink";
import { useAppState, useLoadedContent } from "../state/context";
import { differentType, excludeOne, search } from "../state/recommendation";
import { MAX_COMPARE, type SearchState } from "../state/reducer";
import { RecipeCard } from "./candidates/RecipeCard";
import { exclusionText, listText, minutesText, relaxationText } from "./candidates/texts";
import { defaultDraft, draftToRequest, relaxedDraft } from "./targets/draft";
import { contradictionMessage } from "./targets/errors";
import { useTextContext } from "./useTextContext";
import { Icon, Illustration } from "../components/icons/Icon";

/** Candidates, close alternatives, re-suggestion, and the exceptional states (docs/en/UI_DESIGN.md §3.2, ADR-030 D5, D7). */
export function CandidatesView({ search: current }: { readonly search: SearchState }) {
  const { t } = useTranslation();
  const { navigated, navigate } = useNavigation();
  const { calc, text, data } = useLoadedContent();
  const { state, dispatch } = useAppState();
  const context = useTextContext();
  const { locale } = context;
  const [announcement, setAnnouncement] = useState("");
  // The element to focus after the next render: a new card, or the heading after a new search.
  const focusTarget = useRef<string | undefined>(undefined);
  const [showHeld, setShowHeld] = useState(false);

  const recipes = useMemo(() => new Map(calc.recipes.map((recipe) => [recipe.id, recipe])), [calc]);
  const { selection, pool } = current;
  const request = pool.request;
  const byId = new Map(selection.candidates.map((entry) => [entry.recipe, entry]));
  const candidates = current.order.flatMap((id) => {
    const entry = byId.get(id);
    return entry ? [entry] : [];
  });
  const name = (recipe: string) => text.recipes[recipe]?.name ?? recipe;

  useLayoutEffect(() => {
    if (focusTarget.current === undefined) return;
    document.getElementById(focusTarget.current)?.focus();
    focusTarget.current = undefined;
  });

  const onDifferentType = () => {
    const result = differentType(current);
    if (!result.ok) return;
    dispatch({ type: "resuggested", ...result.value });
    setShowHeld(false);
    const first = result.value.selection.candidates[0];
    if (first === undefined) {
      setAnnouncement(t("candidates.allShown"));
      return;
    }
    setAnnouncement(t("candidates.announce", { count: result.value.selection.candidates.length }));
    focusTarget.current = `card-${first.recipe}`;
  };

  const onExclude = (recipe: string) => {
    const result = excludeOne(current, recipe);
    if (!result.ok) return;
    dispatch({ type: "resuggested", ...result.value });
    const fresh = result.value.selection.candidates.find((entry) => !current.order.includes(entry.recipe));
    setAnnouncement(fresh === undefined ? t("candidates.announce", { count: result.value.selection.candidates.length }) : t("candidates.replaced", { old: name(recipe), new: name(fresh.recipe) }));
    const index = current.order.indexOf(recipe);
    const nextFocus = fresh?.recipe ?? current.order.filter((id) => id !== recipe)[Math.max(0, index - 1)];
    focusTarget.current = nextFocus === undefined ? "main" : `card-${nextFocus}`;
  };

  const onRelax = (relaxation: Relaxation) => {
    const draft = relaxedDraft(state.draft ?? defaultDraft(), relaxation);
    const result = search(draftToRequest(draft), data);
    if (!result.ok) return;
    dispatch({ type: "draftChanged", draft });
    dispatch({ type: "searched", pool: result.value.pool, selection: result.value.selection });
    setAnnouncement(t("candidates.announce", { count: result.value.selection.candidates.length }));
    focusTarget.current = "view-heading";
  };

  const conditionParts = [
    t("candidates.targetKcal", { range: formatNutrientRange(locale, "ENERC_KCAL", request.targets.kcal.min, request.targets.kcal.max) }),
    request.targets.proteinMin === undefined ? undefined : t("candidates.targetProtein", { value: formatNumber(locale, request.targets.proteinMin) }),
    request.targets.fatMax === undefined ? undefined : t("candidates.targetFat", { value: formatNumber(locale, request.targets.fatMax) }),
    request.targets.carbohydrate === undefined ? undefined : t("candidates.targetCarbohydrate", { range: formatNutrientRange(locale, "CHOCDF-", request.targets.carbohydrate.min, request.targets.carbohydrate.max) }),
    request.conditions.maxMinutes === undefined ? undefined : t("candidates.withinMinutes", { minutes: minutesText(t, locale, request.conditions.maxMinutes) }),
    t("candidates.servings", { count: request.servings }),
  ].filter((part) => part !== undefined);

  const card = (entry: Recommended, mode: "candidate" | "alternative") => {
    const recipe = recipes.get(entry.recipe);
    if (recipe === undefined) return null;
    const checked = state.compare.includes(entry.recipe);
    return (
      <li key={entry.recipe}>
        <RecipeCard
          entry={entry}
          recipe={recipe}
          calc={calc}
          text={text}
          targets={request.targets}
          context={context}
          mode={mode}
          {...(mode === "candidate"
            ? {
                compare: {
                  checked,
                  disabled: !checked && state.compare.length >= MAX_COMPARE,
                  onToggle: () => {
                    dispatch({ type: "toggledCompare", recipe: entry.recipe });
                  },
                },
                onExclude: () => {
                  onExclude(entry.recipe);
                },
              }
            : {})}
        />
      </li>
    );
  };

  const alternatives = selection.alternatives;
  const fewer = candidates.length < MIN_CANDIDATES;
  const exclusions = selection.exclusions.filter((item) => item.count > 0);
  const equipmentLimited = request.conditions.equipment !== undefined;
  const noEquipmentOption = !selection.relaxations.some((relaxation) => relaxation.constraint === "equipment");
  const warnings = pool.contradictions.filter((contradiction) => contradiction.severity === "warning");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <ViewHeading title={t("nav.views.candidates")} focusOnMount={navigated} />
        <ViewLink to={{ name: "targets" }} className="text-primary underline">
          {t("candidates.editConditions")}
        </ViewLink>
      </div>
      <p className="m-0 text-sm text-muted">
        {t("candidates.conditionsSummary", { list: listText(t, conditionParts) })}
      </p>
      <p className="sr-only" aria-live="polite">
        {announcement}
      </p>

      {warnings.map((contradiction) => (
        <p key={contradiction.severity} className="m-0 notice-warning">
          <Icon name="warning" size={18} className="mr-1 inline align-[-3px]" />
          {contradictionMessage(contradiction, t, locale)}
        </p>
      ))}

      {current.notice === "all_shown" && (
        <div role="status" className="flex flex-col items-start gap-2 rounded-2xl bg-sky p-4">
          <p className="m-0">{current.heldAlternatives.length > 0 || selection.candidates.length === 0 ? t("candidates.allShown") : t("candidates.allShownRepeat")}</p>
          {current.heldAlternatives.length > 0 && (
            <button
              type="button"
              aria-expanded={showHeld}
              onClick={() => {
                setShowHeld((shown) => !shown);
              }}
              className="btn-outline"
            >
              {t("candidates.showAlternatives")}
            </button>
          )}
          <ViewLink to={{ name: "targets" }} className="text-primary underline">
            {t("candidates.editConditions")}
          </ViewLink>
        </div>
      )}

      {candidates.length === 0 ? (
        <section aria-labelledby="none-heading" className="panel flex flex-col items-center gap-2 p-6 text-center">
          <Illustration name="no_results" className="w-48" />
          <h2 id="none-heading" className="m-0 text-xl font-extrabold">
            {t("candidates.noneHeading")}
          </h2>
          <p className="m-0">{t("candidates.noneMet")}</p>
        </section>
      ) : (
        <>
          <h2 id="candidates-heading" className="m-0 text-xl font-extrabold">
            {t("candidates.listHeading", { label: t("candidates.listLabel"), count: t("candidates.count", { count: candidates.length }) })}
          </h2>
          <ol aria-labelledby="candidates-heading" className="m-0 grid list-none gap-4 p-0 md:grid-cols-2 xl:grid-cols-3">
            {candidates.map((entry) => card(entry, "candidate"))}
          </ol>
          <button type="button" onClick={onDifferentType} className="self-start btn-outline">
            {t("candidates.differentType")}
          </button>
          <div className="sticky bottom-0 z-10 -mx-4 border-t border-surface-muted bg-bg">
            <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-3 px-4 py-3">
              <button
                type="button"
                disabled={state.compare.length < 2}
                onClick={() => {
                  navigate({ name: "comparison" });
                }}
                className="btn-primary"
              >
                {t("candidates.compareButton", { count: state.compare.length })}
              </button>
              <span className="text-sm">{state.compare.length >= MAX_COMPARE ? t("candidates.compareLimit") : t("candidates.compareHint")}</span>
            </div>
          </div>
        </>
      )}

      {showHeld && current.heldAlternatives.length > 0 && (
        <section aria-labelledby="held-heading" className="flex flex-col gap-2">
          <h2 id="held-heading" className="m-0 text-xl font-extrabold">
            {t("candidates.alternativesHeading")}
          </h2>
          <ol className="m-0 grid list-none gap-4 p-0 md:grid-cols-2 xl:grid-cols-3">{current.heldAlternatives.map((entry) => card(entry, "alternative"))}</ol>
        </section>
      )}

      {alternatives.length > 0 && (
        <section aria-labelledby="alternatives-heading" className="flex flex-col gap-2 border-t-2 border-surface-muted pt-4">
          <h2 id="alternatives-heading" className="m-0 text-xl font-extrabold">
            {t("candidates.alternativesHeading")}
          </h2>
          <p className="m-0 text-sm text-muted">{t("candidates.alternativesHint")}</p>
          <ol className="m-0 grid list-none gap-4 p-0 md:grid-cols-2 xl:grid-cols-3">{alternatives.map((entry) => card(entry, "alternative"))}</ol>
        </section>
      )}

      {fewer && selection.relaxations.length > 0 && (
        <section aria-labelledby="relax-heading" className="flex flex-col gap-2">
          <h2 id="relax-heading" className="m-0 text-xl font-extrabold">
            {t("candidates.relaxHeading")}
          </h2>
          <ul className="m-0 flex list-none flex-col gap-2 p-0">
            {selection.relaxations.map((relaxation) => {
              const texts = relaxationText(relaxation, context);
              return (
                <li key={JSON.stringify(relaxation)} className="panel flex flex-wrap items-center justify-between gap-2 p-4">
                  <span>{t("candidates.relaxItem", { action: texts.action, gains: texts.gains })}</span>
                  <button
                    type="button"
                    onClick={() => {
                      onRelax(relaxation);
                    }}
                    className="btn-primary"
                    aria-label={`${t("candidates.apply")}: ${texts.action}`}
                  >
                    {t("candidates.apply")}
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {fewer && equipmentLimited && noEquipmentOption && (
        <p className="m-0 notice-warning">
          {t("candidates.reviewEquipment")}{" "}
          <ViewLink to={{ name: "targets" }} className="text-primary underline">
            {t("candidates.reviewConditions")}
          </ViewLink>
        </p>
      )}

      {fewer && exclusions.length > 0 && (
        <section aria-labelledby="exclusions-heading" className="flex flex-col gap-2">
          <h2 id="exclusions-heading" className="m-0 text-xl font-extrabold">
            {t("candidates.exclusionsHeading")}
          </h2>
          <p className="m-0 text-sm text-muted">{t("candidates.exclusionsHint")}</p>
          <ul className="m-0 list-disc pl-6">
            {exclusions.map((exclusion) => (
              <li key={JSON.stringify(exclusion.item)}>{exclusionText(exclusion, context)}</li>
            ))}
          </ul>
        </section>
      )}

      <div className="flex flex-col gap-2 text-sm text-muted">
        <p className="m-0">{t("disclaimer.estimates")}</p>
        <p className="m-0">{t("disclaimer.allergens")}</p>
        <p className="m-0">{t("disclaimer.strictControl")}</p>
      </div>

    </div>
  );
}
