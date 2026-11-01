import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { RecipeState } from "../../../domain/nutrition/amounts";
import { SHOPPING_LIST_MAX_RECIPES } from "../../../domain/shopping/list";
import { ViewLink } from "../../navigation/ViewLink";
import { useAppState, useLoadedContent } from "../../state/context";
import { removedAction, sameState, savedAction } from "./changes";
import { servingsText } from "./text";
import { Icon } from "../../components/icons/Icon";

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
    <section aria-labelledby="shopping-heading" className="panel flex flex-col gap-3 p-4 print:hidden">
      <h2 id="shopping-heading" className="m-0 flex items-center gap-2 text-xl font-extrabold">
        <Icon name="shopping" size={26} />
        {t("shopping.detailHeading")}
      </h2>
      {entry === undefined ? (
        <div className="flex flex-col items-start gap-2">
          <button
            type="button"
            className="btn-primary"
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
            <ViewLink to={{ name: "shoppingList" }} className="text-primary underline">
              {t("shopping.viewList")}
            </ViewLink>
          </p>
          {!sameState(entry.state, recipeState) && (
            <>
              <p className="m-0 text-sm text-muted">{t("shopping.differs")}</p>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => {
                    save(t("shopping.updated"));
                  }}
                >
                  {t("shopping.update")}
                </button>
                <button
                  type="button"
                  className="btn-secondary"
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
