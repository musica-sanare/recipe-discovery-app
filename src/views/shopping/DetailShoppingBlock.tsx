import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { RecipeState } from "../../../domain/nutrition/amounts";
import { SHOPPING_LIST_MAX_RECIPES } from "../../../domain/shopping/list";
import { ViewLink } from "../../navigation/ViewLink";
import { useAppState, useLoadedContent } from "../../state/context";
import { removedAction, sameState, savedAction } from "./changes";
import { servingsText } from "./text";

/**
 * The detail view's shopping list block (docs/en/UI_DESIGN.md §3.4, ADR-032 D2): adds the
 * current state, or updates and removes the copied entry. The list never follows the
 * detail by itself.
 */
export function DetailShoppingBlock({ recipe, recipeState }: { readonly recipe: string; readonly recipeState: RecipeState }) {
  const { t } = useTranslation();
  const { calc, text } = useLoadedContent();
  const { state, dispatch } = useAppState();
  const [announcement, setAnnouncement] = useState("");
  const list = state.shoppingList;
  const entry = list.entries.find((candidate) => candidate.recipe === recipe);
  const full = entry === undefined && list.entries.length >= SHOPPING_LIST_MAX_RECIPES;
  const save = (message: string) => {
    dispatch(savedAction(calc.recipes, list, { recipe, state: recipeState }));
    setAnnouncement(message);
  };

  return (
    <section aria-labelledby="shopping-heading" className="flex flex-col gap-3 print:hidden">
      <h2 id="shopping-heading" className="m-0 text-xl font-bold">
        {t("shopping.detailHeading")}
      </h2>
      {entry === undefined ? (
        <div className="flex flex-col items-start gap-2">
          <button
            type="button"
            className="rounded bg-accent px-4 py-2 text-on-accent disabled:cursor-not-allowed disabled:opacity-60"
            disabled={full}
            aria-describedby={full ? "shopping-full" : undefined}
            onClick={() => {
              save(t("shopping.added"));
            }}
          >
            {t("shopping.add")}
          </button>
          {full && (
            <p id="shopping-full" className="m-0 text-sm text-muted">
              {t("shopping.full", { max: SHOPPING_LIST_MAX_RECIPES })}
            </p>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-start gap-2">
          <p className="m-0">
            {t("shopping.inList", { servings: servingsText(t, entry.state.servings) })}{" "}
            <ViewLink to={{ name: "shoppingList" }} className="text-accent underline">
              {t("shopping.viewList")}
            </ViewLink>
          </p>
          {!sameState(entry.state, recipeState) && (
            <>
              <p className="m-0 text-sm text-muted">{t("shopping.differs")}</p>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  className="rounded bg-accent px-4 py-2 text-on-accent"
                  onClick={() => {
                    save(t("shopping.updated"));
                  }}
                >
                  {t("shopping.update")}
                </button>
                <button
                  type="button"
                  className="rounded border border-border px-4 py-2"
                  onClick={() => {
                    dispatch(removedAction(calc.recipes, list, recipe));
                    setAnnouncement(t("shopping.removed", { name: text.recipes[recipe]?.name ?? recipe }));
                  }}
                >
                  {t("shopping.remove")}
                </button>
              </div>
            </>
          )}
        </div>
      )}
      <p className="sr-only" aria-live="polite">
        {announcement}
      </p>
    </section>
  );
}
