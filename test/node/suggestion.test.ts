import { describe, expect, it } from "vitest";
import { foods } from "../../content/foods.ts";
import { forbiddenExpressions } from "../../content/glossary.ts";
import { INPUT_LIMITS } from "../../domain/recommendation/validate.ts";
import { CUISINES, EQUIPMENT } from "../../shared/content.ts";
import { SUPPORTED_LOCALES } from "../../shared/locales.ts";
import {
  ERROR_STATUS,
  SUGGEST_ERRORS,
  SUGGEST_LIMITS,
  fallback,
  interpretResponse,
  suggestRequestSchema,
  validateProviderOutput,
  type ValidationContext,
} from "../../shared/suggestion.ts";
import * as z from "zod/mini";

// Contract, output validation, and fallback of the AI free-text conditions (ADR-034).
const context: ValidationContext = { foodIds: new Set(foods.map((food) => food.id)), forbiddenExpressions };
const conditions = { requiredFoods: [["chicken_breast"]], excludedFoods: ["cod"], maxMinutes: 20, cuisines: ["japanese"] };
const output = (value: unknown) => validateProviderOutput(JSON.stringify(value), context);
const rejection = (value: unknown) => {
  const result = output(value);
  return result.ok ? undefined : result.reason;
};

describe("suggestion request", () => {
  const parse = (value: unknown) => z.safeParse(suggestRequestSchema, value).success;

  it.each(SUPPORTED_LOCALES)("accepts free text in %s", (locale) => {
    expect(parse({ text: "鶏むね肉で20分以内、辛くないもの", locale })).toBe(true);
  });

  it("limits the trimmed text to 200 code points", () => {
    expect(parse({ text: `  ${"鶏".repeat(SUGGEST_LIMITS.textLength)}  `, locale: "ja" })).toBe(true);
    expect(parse({ text: "鶏".repeat(SUGGEST_LIMITS.textLength + 1), locale: "ja" })).toBe(false);
    expect(parse({ text: "🍗".repeat(SUGGEST_LIMITS.textLength), locale: "en" })).toBe(true);
  });

  it("rejects blank text, unknown locales, and any other field", () => {
    expect(parse({ text: "   ", locale: "en" })).toBe(false);
    expect(parse({ text: "chickpeas", locale: "de" })).toBe(false);
    expect(parse({ text: "chickpeas", locale: "en", targets: { kcal: { min: 400, max: 600 } } })).toBe(false);
    expect(parse({ text: "chickpeas", locale: "en", excludedAllergens: ["egg"] })).toBe(false);
  });
});

describe("provider output validation", () => {
  it("accepts conditions with dictionary food IDs and every enum value", () => {
    const all = { ...conditions, equipment: [...EQUIPMENT], cuisines: [...CUISINES] };
    expect(output({ kind: "conditions", conditions: all })).toEqual({ ok: true, value: { kind: "conditions", conditions: all } });
  });

  it("accepts every dictionary food ID without a forbidden-expression match", () => {
    const ids = [...context.foodIds];
    for (let start = 0; start < ids.length; start += SUGGEST_LIMITS.excludedFoods) {
      expect(rejection({ kind: "conditions", conditions: { requiredFoods: [], excludedFoods: ids.slice(start, start + SUGGEST_LIMITS.excludedFoods), cuisines: [] } })).toBeUndefined();
    }
  });

  it("accepts each out-of-scope topic", () => {
    for (const topic of ["allergens", "targets", "other"]) expect(rejection({ kind: "out_of_scope", topic })).toBeUndefined();
  });

  it("removes duplicates deterministically", () => {
    const result = output({ kind: "conditions", conditions: { requiredFoods: [["chickpeas", "chickpeas"]], excludedFoods: ["cod", "cod"], equipment: ["pot", "pot"], cuisines: ["spanish", "spanish"] } });
    expect(result).toEqual({ ok: true, value: { kind: "conditions", conditions: { requiredFoods: [["chickpeas"]], excludedFoods: ["cod"], equipment: ["pot"], cuisines: ["spanish"] } } });
  });

  it("rejects food IDs outside the dictionary", () => {
    expect(rejection({ kind: "conditions", conditions: { ...conditions, excludedFoods: ["whale"] } })).toBe("unknown_food");
    expect(rejection({ kind: "conditions", conditions: { ...conditions, requiredFoods: [["chicken_breast", "dodo"]] } })).toBe("unknown_food");
  });

  it("rejects a food that is both required and excluded", () => {
    expect(rejection({ kind: "conditions", conditions: { ...conditions, excludedFoods: ["chicken_breast"] } })).toBe("contradiction");
  });

  it.each([
    ["targets", { kind: "conditions", conditions: { ...conditions, targets: { kcal: { min: 400, max: 600 } } } }],
    ["proteinMin", { kind: "conditions", conditions: { ...conditions, proteinMin: 30 } }],
    ["excludedAllergens", { kind: "conditions", conditions: { ...conditions, excludedAllergens: ["egg"] } }],
    ["temperature", { kind: "conditions", conditions: { ...conditions, temperatureC: 170 } }],
    ["cooking time", { kind: "conditions", conditions: { ...conditions, cooking_time: 10 } }],
    ["health statement", { kind: "out_of_scope", topic: "other", healthClaim: "x" }],
    ["free text", { kind: "out_of_scope", topic: "allergens", message: "x" }],
    ["nested nutrition", { kind: "conditions", conditions: { ...conditions, extra: [{ kcal: 500 }] } }],
  ])("rejects a forbidden field: %s", (_, value) => {
    expect(rejection(value)).toBe("forbidden_field");
  });

  it.each([
    ["an unknown field", { kind: "conditions", conditions: { ...conditions, servings: 2 } }],
    ["an unknown kind", { kind: "recipe", conditions }],
    ["an unknown enum value", { kind: "conditions", conditions: { ...conditions, equipment: ["grill"] } }],
    ["an unknown topic", { kind: "out_of_scope", topic: "weather" }],
    ["minutes below the engine minimum", { kind: "conditions", conditions: { ...conditions, maxMinutes: 4 } }],
    ["minutes above the engine maximum", { kind: "conditions", conditions: { ...conditions, maxMinutes: 241 } }],
    ["fractional minutes", { kind: "conditions", conditions: { ...conditions, maxMinutes: 12.5 } }],
    ["minutes as text", { kind: "conditions", conditions: { ...conditions, maxMinutes: "20" } }],
    ["null minutes", { kind: "conditions", conditions: { ...conditions, maxMinutes: null } }],
    ["an empty required item", { kind: "conditions", conditions: { ...conditions, requiredFoods: [[]] } }],
    ["an empty equipment list", { kind: "conditions", conditions: { ...conditions, equipment: [] } }],
    ["too many required items", { kind: "conditions", conditions: { ...conditions, requiredFoods: Array.from({ length: 6 }, () => ["egg"]) } }],
    ["too many foods in an item", { kind: "conditions", conditions: { ...conditions, requiredFoods: [Array.from({ length: SUGGEST_LIMITS.foodsPerItem + 1 }, () => "egg")] } }],
    ["too many excluded foods", { kind: "conditions", conditions: { ...conditions, excludedFoods: Array.from({ length: SUGGEST_LIMITS.excludedFoods + 1 }, () => "cod") } }],
    ["a missing field", { kind: "conditions", conditions: { requiredFoods: [], excludedFoods: [] } }],
    ["a non-slug ID", { kind: "conditions", conditions: { ...conditions, excludedFoods: ["Cod fillet"] } }],
    ["an array", [{ kind: "out_of_scope", topic: "other" }]],
    ["null", null],
  ])("rejects %s as a schema failure", (_, value) => {
    expect(rejection(value)).toBe("schema");
  });

  it("rejects text that is not JSON and an output over the length limit", () => {
    expect(validateProviderOutput("Here are your conditions: chicken", context)).toEqual({ ok: false, reason: "not_json" });
    expect(validateProviderOutput(" ".repeat(SUGGEST_LIMITS.outputLength + 1), context)).toEqual({ ok: false, reason: "too_long" });
  });

  it.each([
    ["ja", "脂肪燃焼"],
    ["en", "fat burning"],
    ["es", "quema grasa"],
    ["fr", "perte de poids"],
  ])("rejects a forbidden expression in %s anywhere in the raw output", (_, expression) => {
    expect(validateProviderOutput(JSON.stringify({ kind: "out_of_scope", topic: "other" }) + expression, context)).toEqual({ ok: false, reason: "forbidden_expression" });
    expect(rejection({ kind: "out_of_scope", topic: expression })).toBe("forbidden_expression");
  });

  it("keeps the minute limits equal to the engine's input limits", () => {
    expect(SUGGEST_LIMITS.maxMinutes).toEqual(INPUT_LIMITS.maxMinutes);
  });
});

describe("response interpretation and fallback", () => {
  it("returns a valid suggestion for confirmation", () => {
    expect(interpretResponse(200, { kind: "conditions", conditions }, context)).toEqual({ kind: "suggestion", suggestion: conditions });
  });

  it("points out-of-scope requests to a localized message", () => {
    expect(interpretResponse(200, { kind: "out_of_scope", topic: "allergens" }, context)).toEqual({ kind: "out_of_scope", topic: "allergens", messageKey: "ai.outOfScope.allergens" });
  });

  it.each(SUGGEST_ERRORS)("falls back on the endpoint error %s", (error) => {
    expect(interpretResponse(ERROR_STATUS[error], { kind: "error", error }, context)).toEqual({ kind: "fallback", failure: error, messageKey: `ai.error.${error}` });
  });

  it("falls back when the response fails validation in the browser", () => {
    const invalid = fallback("invalid_output");
    expect(interpretResponse(200, { kind: "conditions", conditions: { ...conditions, excludedFoods: ["whale"] } }, context)).toEqual(invalid);
    expect(interpretResponse(200, { kind: "conditions", conditions: { ...conditions, kcal: 500 } }, context)).toEqual(invalid);
    expect(interpretResponse(200, "<!doctype html>", context)).toEqual(invalid);
    expect(interpretResponse(200, undefined, context)).toEqual(invalid);
    expect(interpretResponse(500, { kind: "conditions", conditions }, context)).toEqual(invalid);
  });

  it("treats a missing endpoint as disabled and an empty suggestion as nothing found", () => {
    expect(interpretResponse(404, "Not Found", context)).toEqual(fallback("disabled"));
    expect(interpretResponse(200, { kind: "conditions", conditions: { requiredFoods: [], excludedFoods: [], cuisines: [] } }, context)).toEqual(fallback("empty"));
  });

  it("gives every failure a message key", () => {
    expect(fallback("offline")).toEqual({ kind: "fallback", failure: "offline", messageKey: "ai.error.offline" });
    expect(fallback("timeout").messageKey).toBe("ai.error.timeout");
  });
});
