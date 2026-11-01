import { describe, expect, it } from "vitest";
import type { Contradiction, InputError } from "../../../domain/recommendation/types";
import { SUPPORTED_LOCALES } from "../../../shared/locales";
import { createTestI18n } from "../../testing/i18n";
import { contradictionMessage, errorTarget, inputErrorMessage } from "./errors";

const ERRORS: readonly InputError[] = [
  { code: "invalid_number", field: "proteinMin", value: Number.NaN },
  { code: "out_of_range", field: "kcal.max", value: 5000, min: 100, max: 2000 },
  { code: "inverted_bound", field: "carbohydrate", min: 80, max: 40 },
  { code: "unknown_food", field: "excludedFoods", food: "lobster" },
  { code: "empty_required_item", index: 0 },
  { code: "required_and_excluded", index: 0, foods: ["egg"] },
  { code: "unknown_recipe", field: "shown", recipe: "x" },
  { code: "invalid_servings", servings: 0 },
  { code: "invalid_seed", seed: -1 },
];

const CONTRADICTIONS: readonly Contradiction[] = [
  { code: "minimum_energy_exceeds_kcal_max", severity: "blocking", minimumKcal: 1234, minimumKcalWithTolerance: 1200, kcalMax: 600 },
  { code: "minimum_energy_exceeds_kcal_max", severity: "warning", minimumKcal: 480, minimumKcalWithTolerance: 460, kcalMax: 600 },
];

describe.each(SUPPORTED_LOCALES)("messages in %s", (locale) => {
  const { t } = createTestI18n(locale);

  it.each(ERRORS)("input error $code has a complete message", (error) => {
    const message = inputErrorMessage(error, t, locale);
    expect(message).not.toMatch(/\{\{|inputError\.|inputField\./);
    expect(message.length).toBeGreaterThan(10);
  });

  it.each(CONTRADICTIONS)("contradiction $severity has a complete message with formatted numbers", (contradiction) => {
    const message = contradictionMessage(contradiction, t, locale);
    expect(message).not.toMatch(/\{\{|contradiction\./);
    expect(message).toContain(contradiction.severity === "blocking" ? { ja: "1,230", en: "1,230", es: "1230", fr: "1\u202f230" }[locale] : "480");
  });
});

describe("error placement", () => {
  it("places every error on a field of the form", () => {
    expect(ERRORS.map(errorTarget)).toEqual(["proteinMin", "kcalMax", "carbohydrateMax", "excluded", "required", "required", "form", "servings", "form"]);
  });
});
