import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { PROTEIN_GROUPS, type ProteinGroup } from "../../shared/content";
import { useLocale } from "../i18n/useLocale";
import { useAppState, useLoadedContent } from "../state/context";
import type { FoodChoice } from "./targets/draft";
import type { TextContext } from "./candidates/texts";

function groupOf(choice: FoodChoice): ProteinGroup | undefined {
  const group = choice.key.startsWith("group:") ? choice.key.slice("group:".length) : undefined;
  return PROTEIN_GROUPS.find((candidate) => candidate === group);
}

/** Labels for foods and chosen ingredients in the active locale. */
export function useTextContext(): TextContext & { readonly choiceLabel: (choice: FoodChoice) => string } {
  const { t } = useTranslation();
  const locale = useLocale();
  const { text } = useLoadedContent();
  const { state } = useAppState();
  const required = state.draft?.required;

  return useMemo(() => {
    const foodName = (food: string) => text.foods[food]?.name ?? food;
    const choiceLabel = (choice: FoodChoice) => {
      const group = groupOf(choice);
      if (group !== undefined) return t("conditions.foodGroup", { group: t(`proteinGroup.${group}`) });
      return choice.foods.map(foodName).join(t("common.listSeparator"));
    };
    const requiredLabel = (index: number) => {
      const choice = required?.[index];
      return choice === undefined ? "" : choiceLabel(choice);
    };
    return { t, locale, foodName, requiredLabel, choiceLabel };
  }, [t, locale, text, required]);
}
