import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { buildShoppingList, type ShoppingItem, type ShoppingSection } from "../../domain/shopping/list";
import { ViewHeading } from "../components/ViewHeading";
import { useNavigation } from "../navigation/context";
import { ViewLink } from "../navigation/ViewLink";
import { useAppState, useLoadedContent } from "../state/context";
import { removedAction } from "./shopping/changes";
import { amountText, entrySummary, itemName, shoppingText, uncheckedCount } from "./shopping/text";
import { useTextContext } from "./useTextContext";

const SECTIONS: readonly ShoppingSection[] = ["ingredients", "pantry"];

/** The shopping list (docs/en/UI_DESIGN.md §3.7, ADR-032): it only renders what `domain/shopping` returns. */
export function ShoppingListView() {
  const { t } = useTranslation();
  const { navigated } = useNavigation();
  const { calc, text } = useLoadedContent();
  const { state, dispatch } = useAppState();
  const { locale, foodName } = useTextContext();
  const { entries, checked } = state.shoppingList;
  const built = useMemo(() => buildShoppingList(entries, calc.recipes), [entries, calc]);
  const [announcement, setAnnouncement] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [fallbackText, setFallbackText] = useState<string | undefined>(undefined);
  // The element to focus after the next render (removal, clearing); a ref, so focusing causes no render.
  const focusTarget = useRef<string | undefined>(undefined);
  const fallback = useRef<HTMLTextAreaElement>(null);
  const recipeName = (recipe: string) => text.recipes[recipe]?.name ?? recipe;

  useLayoutEffect(() => {
    if (focusTarget.current === undefined) return;
    document.getElementById(focusTarget.current)?.focus();
    focusTarget.current = undefined;
  });

  useLayoutEffect(() => {
    if (fallbackText !== undefined) fallback.current?.select();
  }, [fallbackText]);

  const back =
    state.search === undefined ? (
      <ViewLink to={{ name: "targets" }} className="text-primary underline print:hidden">
        {t("nav.toTargets")}
      </ViewLink>
    ) : (
      <ViewLink to={{ name: "candidates" }} className="text-primary underline print:hidden">
        {t("nav.backToCandidates")}
      </ViewLink>
    );
  const title = t("nav.views.shoppingList");

  if (entries.length === 0 || !built.ok) {
    return (
      <div className="flex flex-col gap-4">
        <ViewHeading title={title} focusOnMount={navigated} />
        <p className="m-0">{t("shopping.empty")}</p>
        <p className="m-0">
          <ViewLink to={{ name: "targets" }} className="text-primary underline">
            {t("nav.toTargets")}
          </ViewLink>
        </p>
        <p className="sr-only" aria-live="polite">
          {announcement}
        </p>
      </div>
    );
  }

  const list = built.value;
  const remaining = uncheckedCount(list, checked);
  const copy = async () => {
    const content = shoppingText({ t, locale, foodName, recipeName, entries, list, checked });
    try {
      // Throws where the Clipboard API is missing or refused; the text area is the fallback.
      await navigator.clipboard.writeText(content);
      setFallbackText(undefined);
      setAnnouncement(t("shopping.copied", { count: remaining }));
    } catch {
      setFallbackText(content);
      setAnnouncement(t("shopping.copyFailed"));
    }
  };
  const remove = (recipe: string) => {
    const index = entries.findIndex((entry) => entry.recipe === recipe);
    const neighbour = entries[index + 1] ?? entries[index - 1];
    dispatch(removedAction(calc.recipes, state.shoppingList, recipe));
    setFallbackText(undefined);
    setAnnouncement(t("shopping.removed", { name: recipeName(recipe) }));
    focusTarget.current = neighbour === undefined ? "view-heading" : `shopping-remove-${neighbour.recipe}`;
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <ViewHeading title={title} focusOnMount={navigated} />
        {back}
      </div>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
        <div className="flex flex-col gap-4">
          <section aria-labelledby="shopping-recipes-heading" className="flex flex-col gap-3">
            <h2 id="shopping-recipes-heading" className="m-0 text-xl font-bold">
              {t("shopping.fromRecipes", { count: entries.length })}
            </h2>
            <ul className="m-0 flex list-none flex-col gap-3 p-0">
              {entries.map((entry) => (
                <li key={entry.recipe} className="flex flex-col gap-1 rounded border border-border p-3">
                  <ViewLink
                    to={{ name: "detail", recipe: entry.recipe }}
                    className="font-medium text-primary underline print:text-text print:no-underline"
                    onNavigate={() => {
                      dispatch({ type: "adjusted", recipe: entry.recipe, state: entry.state });
                    }}
                  >
                    {recipeName(entry.recipe)}
                  </ViewLink>
                  <span className="text-sm text-muted">{entrySummary(t, entry)}</span>
                  <button
                    id={`shopping-remove-${entry.recipe}`}
                    type="button"
                    className="self-end rounded border border-border px-3 py-1 print:hidden"
                    aria-label={t("shopping.removeRecipeLabel", { name: recipeName(entry.recipe) })}
                    onClick={() => {
                      remove(entry.recipe);
                    }}
                  >
                    {t("shopping.removeRecipe")}
                  </button>
                </li>
              ))}
            </ul>
          </section>
          <div className="flex flex-col items-start gap-2 print:hidden">
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                className="btn-primary"
                disabled={remaining === 0}
                aria-describedby={remaining === 0 ? "shopping-all-checked" : undefined}
                onClick={() => {
                  void copy();
                }}
              >
                {t("shopping.copy")}
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  window.print();
                }}
              >
                {t("shopping.print")}
              </button>
              {!confirming && (
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => {
                    setConfirming(true);
                    focusTarget.current = "shopping-clear-yes";
                  }}
                >
                  {t("shopping.clear")}
                </button>
              )}
            </div>
            {remaining === 0 && (
              <p id="shopping-all-checked" className="m-0 text-sm text-muted">
                {t("shopping.allChecked")}
              </p>
            )}
            {confirming && (
              <div role="group" aria-labelledby="shopping-clear-question" className="flex flex-wrap items-center gap-3 rounded border-2 border-warning p-3">
                <p id="shopping-clear-question" className="m-0">
                  {t("shopping.clearConfirm")}
                </p>
                <button
                  id="shopping-clear-yes"
                  type="button"
                  className="btn-primary"
                  onClick={() => {
                    dispatch({ type: "shoppingCleared" });
                    setConfirming(false);
                    setFallbackText(undefined);
                    setAnnouncement(t("shopping.cleared"));
                    focusTarget.current = "view-heading";
                  }}
                >
                  {t("shopping.clearYes")}
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => {
                    setConfirming(false);
                  }}
                >
                  {t("shopping.cancel")}
                </button>
              </div>
            )}
            {fallbackText !== undefined && (
              <label className="flex w-full flex-col gap-1">
                <span className="text-sm">{t("shopping.copyFallbackLabel")}</span>
                <textarea ref={fallback} readOnly value={fallbackText} rows={8} className="w-full rounded border border-border bg-surface p-2 font-mono text-sm" />
              </label>
            )}
          </div>
          <p className="m-0 text-sm text-muted">{t("shopping.basisNote")}</p>
        </div>
        <div className="flex flex-col gap-6">
          {SECTIONS.map((section) => {
            const items = list.items.filter((item) => item.section === section);
            if (items.length === 0) return null;
            return (
              <section key={section} aria-labelledby={`shopping-${section}-heading`} className="flex flex-col gap-2">
                <h2 id={`shopping-${section}-heading`} className="m-0 text-xl font-bold">
                  {t(`shopping.sections.${section}`)}
                </h2>
                <ul className="m-0 flex list-none flex-col gap-2 p-0">
                  {items.map((item) => (
                    <ItemRow
                      key={item.key}
                      item={item}
                      checked={checked.includes(item.key)}
                      name={itemName(t, foodName, item)}
                      amount={amountText(t, locale, item.grams, item.measure)}
                      contributions={item.contributions.map((contribution) => t("shopping.contribution", { recipe: recipeName(contribution.recipe), amount: amountText(t, locale, contribution.grams, contribution.measure) }))}
                      onChange={(value) => {
                        dispatch({ type: "shoppingChecked", item: item.key, checked: value });
                      }}
                    />
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      </div>
      <p className="sr-only" aria-live="polite">
        {announcement}
      </p>
    </div>
  );
}

interface ItemRowProps {
  readonly item: ShoppingItem;
  readonly checked: boolean;
  readonly name: string;
  readonly amount: string;
  readonly contributions: readonly string[];
  readonly onChange: (checked: boolean) => void;
}

function ItemRow({ item, checked, name, amount, contributions, onChange }: ItemRowProps) {
  const { t } = useTranslation();
  const id = `shopping-item-${item.key.replace(":", "-")}`;
  return (
    <li className="flex flex-col gap-1">
      <div className="flex items-start gap-3">
        <input
          id={id}
          type="checkbox"
          className="mt-1 size-5 shrink-0 print:hidden"
          checked={checked}
          onChange={(event) => {
            onChange(event.target.checked);
          }}
        />
        <span aria-hidden="true" className="hidden print:inline">
          ☐
        </span>
        <label htmlFor={id} className={checked ? "text-muted line-through print:text-text print:no-underline" : undefined}>
          {name} {amount}
        </label>
      </div>
      {item.frying && <p className="m-0 ml-8 text-sm text-muted">{t("shopping.fryingNote")}</p>}
      {contributions.length > 1 && (
        <details className="ml-8 text-sm print:hidden">
          <summary className="cursor-pointer text-primary">{t("shopping.perRecipe")}</summary>
          <ul className="m-0 mt-1 flex list-none flex-col gap-1 p-0">
            {contributions.map((contribution) => (
              <li key={contribution}>{contribution}</li>
            ))}
          </ul>
        </details>
      )}
    </li>
  );
}
