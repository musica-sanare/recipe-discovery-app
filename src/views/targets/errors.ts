/**
 * Where each engine input error belongs on the targets form (docs/en/UI_DESIGN.md §3.1).
 * The engine validates; the UI only places and words its errors.
 */
import type { TFunction } from "i18next";
import type { Contradiction, InputError, InputField } from "../../../domain/recommendation/types";
import { INPUT_LIMITS } from "../../../domain/recommendation/validate";
import type { Locale } from "../../../shared/locales";
import { formatNumber, formatNutrient } from "../../format/format";
import type { NumberField } from "./draft";

export type FormTarget = NumberField | "required" | "excluded" | "form";

const FIELD_TARGET: Readonly<Record<InputField, NumberField>> = {
  "kcal.min": "kcalMin",
  "kcal.max": "kcalMax",
  proteinMin: "proteinMin",
  fatMax: "fatMax",
  "carbohydrate.min": "carbohydrateMin",
  "carbohydrate.max": "carbohydrateMax",
  maxMinutes: "maxMinutes",
};

export function errorTarget(error: InputError): FormTarget {
  switch (error.code) {
    case "invalid_number":
    case "out_of_range":
      return FIELD_TARGET[error.field];
    case "inverted_bound":
      return error.field === "kcal" ? "kcalMax" : "carbohydrateMax";
    case "invalid_servings":
      return "servings";
    case "unknown_food":
      return error.field === "requiredFoods" ? "required" : "excluded";
    case "empty_required_item":
    case "required_and_excluded":
      return "required";
    case "unknown_recipe":
    case "invalid_seed":
      return "form";
  }
}

/** The ID of the input that an error summary link focuses. */
export function fieldId(target: FormTarget): string {
  return `targets-${target}`;
}

export function inputErrorMessage(error: InputError, t: TFunction, locale: Locale): string {
  switch (error.code) {
    case "invalid_number":
      return t("inputError.invalid_number", { field: t(`inputField.${error.field}`) });
    case "out_of_range":
      return t("inputError.out_of_range", { field: t(`inputField.${error.field}`), min: formatNumber(locale, error.min), max: formatNumber(locale, error.max) });
    case "inverted_bound":
      return t("inputError.inverted_bound", { field: t(`inputField.${error.field}`) });
    case "invalid_servings":
      return t("inputError.invalid_servings", { min: formatNumber(locale, INPUT_LIMITS.servings.min), max: formatNumber(locale, INPUT_LIMITS.servings.max) });
    case "unknown_food":
    case "empty_required_item":
    case "required_and_excluded":
    case "unknown_recipe":
    case "invalid_seed":
      return t(`inputError.${error.code}`);
  }
}

/** The contradiction with the energies of the engine (an assumption of 4 kcal/g, ADR-029 D9), rounded like energy. */
export function contradictionMessage(contradiction: Contradiction, t: TFunction, locale: Locale): string {
  return t(`contradiction.${contradiction.code}.${contradiction.severity}`, {
    minimumKcal: formatNutrient(locale, "ENERC_KCAL", contradiction.minimumKcal),
    kcalMax: formatNumber(locale, contradiction.kcalMax),
  });
}
