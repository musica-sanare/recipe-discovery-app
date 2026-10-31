/**
 * HTTP contract of the optional AI free-text conditions endpoint (ADR-034), shared by
 * the endpoint and the browser. Provider-neutral: the request holds only the user's
 * free text and the locale, and a suggestion holds only identifiers, enums, and one
 * whole number of minutes. It never holds targets, allergens, nutrition values,
 * health statements, cooking temperatures or times, or any free text. Every output is
 * validated here at runtime; any failure becomes the deterministic fallback (the form
 * stays as it is) with a localized message key.
 */
import * as z from "zod/mini";
import { CUISINES, EQUIPMENT, slug } from "./content.ts";
import { SUPPORTED_LOCALES, type Locale } from "./locales.ts";
import { forbiddenIn } from "./policy.ts";

/** Same-origin path of the endpoint (ADR-034 D3, ADR-001 revised). */
export const SUGGEST_PATH = "/api/suggest-conditions";

export const SUGGEST_LIMITS = {
  /** Unicode code points of the trimmed request text. */
  textLength: 200,
  /** Characters of the raw provider output. */
  outputLength: 4000,
  requiredItems: 5,
  foodsPerItem: 5,
  excludedFoods: 10,
  /** The engine's input limits (domain/recommendation/validate.ts `INPUT_LIMITS`; a test keeps them equal). */
  maxMinutes: { min: 5, max: 240 },
} as const;

/** The endpoint aborts the provider call after this; the browser gives up a little later (ADR-034 D6). */
export const PROVIDER_TIMEOUT_MS = 7000;
export const CLIENT_TIMEOUT_MS = 8000;

const codePoints = (text: string) => Array.from(text).length;

export const suggestRequestSchema = z.strictObject({
  text: z
    .string()
    .check(
      z.refine((text) => text.trim() !== "", "Text must not be blank"),
      z.refine((text) => codePoints(text.trim()) <= SUGGEST_LIMITS.textLength, "Text is too long"),
    ),
  locale: z.enum(SUPPORTED_LOCALES),
});
export type SuggestRequest = z.infer<typeof suggestRequestSchema>;

/** Shaped like the engine's `Conditions`: each required item is an any-of set of food IDs. */
export const suggestionSchema = z.strictObject({
  requiredFoods: z.array(z.array(slug).check(z.minLength(1), z.maxLength(SUGGEST_LIMITS.foodsPerItem))).check(z.maxLength(SUGGEST_LIMITS.requiredItems)),
  excludedFoods: z.array(slug).check(z.maxLength(SUGGEST_LIMITS.excludedFoods)),
  maxMinutes: z.optional(z.number().check(z.int(), z.gte(SUGGEST_LIMITS.maxMinutes.min), z.lte(SUGGEST_LIMITS.maxMinutes.max))),
  /** The equipment the user has; absent means no limit. */
  equipment: z.optional(z.array(z.enum(EQUIPMENT)).check(z.minLength(1), z.maxLength(EQUIPMENT.length))),
  cuisines: z.array(z.enum(CUISINES)).check(z.maxLength(CUISINES.length)),
});
export type Suggestion = z.infer<typeof suggestionSchema>;

/** Requests the feature declines (ADR-034 D1, D4): `allergens` points the user to the allergen field. */
export const OUT_OF_SCOPE_TOPICS = ["allergens", "targets", "other"] as const;
export type OutOfScopeTopic = (typeof OUT_OF_SCOPE_TOPICS)[number];

const conditionsVariant = z.strictObject({ kind: z.literal("conditions"), conditions: suggestionSchema });
const outOfScopeVariant = z.strictObject({ kind: z.literal("out_of_scope"), topic: z.enum(OUT_OF_SCOPE_TOPICS) });

/** What the provider must return (as JSON text). */
export const providerOutputSchema = z.discriminatedUnion("kind", [conditionsVariant, outOfScopeVariant]);
export type ProviderOutput = z.infer<typeof providerOutputSchema>;

export const SUGGEST_ERRORS = ["invalid_request", "disabled", "rate_limited", "budget_spent", "timeout", "refused", "invalid_output", "unavailable"] as const;
export type SuggestError = (typeof SUGGEST_ERRORS)[number];

/** HTTP status per error; a provider output is sent with 200. */
export const ERROR_STATUS: Readonly<Record<SuggestError, number>> = {
  invalid_request: 400,
  disabled: 503,
  rate_limited: 429,
  budget_spent: 503,
  timeout: 504,
  refused: 502,
  invalid_output: 502,
  unavailable: 502,
};

/** The endpoint's JSON response body. */
export const suggestResponseSchema = z.discriminatedUnion("kind", [
  conditionsVariant,
  outOfScopeVariant,
  z.strictObject({ kind: z.literal("error"), error: z.enum(SUGGEST_ERRORS) }),
]);
export type SuggestResponse = z.infer<typeof suggestResponseSchema>;

export interface ValidationContext {
  /** Every food ID of the dictionary (content/foods.ts). */
  readonly foodIds: ReadonlySet<string>;
  /** content/glossary.ts `forbiddenExpressions`; checked in every locale, whatever the request locale. */
  readonly forbiddenExpressions: Readonly<Record<Locale, readonly string[]>>;
}

/** Why an output was rejected; for counts and the evaluation, never shown or logged with user text. */
export type RejectionReason = "too_long" | "forbidden_expression" | "not_json" | "forbidden_field" | "schema" | "unknown_food" | "contradiction";

export type Validated<T> = { readonly ok: true; readonly value: T } | { readonly ok: false; readonly reason: RejectionReason };

/**
 * Key stems that must never appear in an output, even as an unknown field: targets and
 * nutrition, allergens, health, cooking heat and time, and free text. Matched in keys
 * lowercased without non-letters; no allowed key contains one.
 */
const FORBIDDEN_KEY_STEMS = ["target", "kcal", "calor", "energy", "protein", "fat", "carb", "nutri", "allerg", "health", "medic", "claim", "benefit", "temperat", "heat", "cookingtime", "explan", "message", "note", "text", "reason"];

function hasForbiddenKey(value: unknown): boolean {
  if (Array.isArray(value)) return value.some(hasForbiddenKey);
  if (typeof value !== "object" || value === null) return false;
  return Object.entries(value).some(([key, child]) => {
    const normalized = key.toLowerCase().replace(/[^a-z]/g, "");
    return FORBIDDEN_KEY_STEMS.some((stem) => normalized.includes(stem)) || hasForbiddenKey(child);
  });
}

const unique = <T>(items: readonly T[]): T[] => [...new Set(items)];

function normalizeSuggestion(suggestion: Suggestion): Suggestion {
  const { maxMinutes, equipment } = suggestion;
  return {
    requiredFoods: suggestion.requiredFoods.map(unique),
    excludedFoods: unique(suggestion.excludedFoods),
    ...(maxMinutes === undefined ? {} : { maxMinutes }),
    ...(equipment === undefined ? {} : { equipment: unique(equipment) }),
    cuisines: unique(suggestion.cuisines),
  };
}

function checkSuggestion(suggestion: Suggestion, context: ValidationContext): Validated<Suggestion> {
  const required = suggestion.requiredFoods.flat();
  if (![...required, ...suggestion.excludedFoods].every((food) => context.foodIds.has(food))) return { ok: false, reason: "unknown_food" };
  if (required.some((food) => suggestion.excludedFoods.includes(food))) return { ok: false, reason: "contradiction" };
  return { ok: true, value: normalizeSuggestion(suggestion) };
}

/** Validates a parsed value against `schema` (the provider output or the response body). */
export function validateValue<T extends ProviderOutput | SuggestResponse>(value: unknown, context: ValidationContext, schema: z.ZodMiniType<T>): Validated<T> {
  if (hasForbiddenKey(value)) return { ok: false, reason: "forbidden_field" };
  const parsed = z.safeParse(schema, value);
  if (!parsed.success) return { ok: false, reason: "schema" };
  const output = parsed.data;
  if (output.kind !== "conditions") return { ok: true, value: output };
  const checked = checkSuggestion(output.conditions, context);
  return checked.ok ? { ok: true, value: { ...output, conditions: checked.value } } : checked;
}

/** Validates the provider's raw output text: length, forbidden expressions in every locale, JSON, then the value. */
export function validateProviderOutput(text: string, context: ValidationContext): Validated<ProviderOutput> {
  if (text.length > SUGGEST_LIMITS.outputLength) return { ok: false, reason: "too_long" };
  if (SUPPORTED_LOCALES.some((locale) => forbiddenIn(locale, text, context.forbiddenExpressions[locale]).length > 0)) {
    return { ok: false, reason: "forbidden_expression" };
  }
  let value: unknown;
  try {
    value = JSON.parse(text);
  } catch {
    return { ok: false, reason: "not_json" };
  }
  return validateValue(value, context, providerOutputSchema);
}

/** `offline` and `empty` arise only in the browser (no connection; a suggestion without any condition). */
export type SuggestFailure = SuggestError | "offline" | "empty";
/** UI catalog keys (added with the UI in Stage 12.4). */
export type SuggestMessageKey = `ai.error.${SuggestFailure}` | `ai.outOfScope.${OutOfScopeTopic}`;

export type SuggestOutcome =
  | { readonly kind: "suggestion"; readonly suggestion: Suggestion }
  | { readonly kind: "out_of_scope"; readonly topic: OutOfScopeTopic; readonly messageKey: SuggestMessageKey }
  | { readonly kind: "fallback"; readonly failure: SuggestFailure; readonly messageKey: SuggestMessageKey };

/** The deterministic fallback: nothing is applied, and the message explains why. */
export function fallback(failure: SuggestFailure): Extract<SuggestOutcome, { kind: "fallback" }> {
  return { kind: "fallback", failure, messageKey: `ai.error.${failure}` };
}

function isEmpty(suggestion: Suggestion): boolean {
  return suggestion.requiredFoods.length === 0 && suggestion.excludedFoods.length === 0 && suggestion.maxMinutes === undefined && suggestion.equipment === undefined && suggestion.cuisines.length === 0;
}

/**
 * Interprets an endpoint response in the browser, validating it again. A missing
 * endpoint (404) counts as disabled; anything else unexpected is an invalid output.
 */
export function interpretResponse(status: number, body: unknown, context: ValidationContext): SuggestOutcome {
  if (status === 404) return fallback("disabled");
  const validated = validateValue(body, context, suggestResponseSchema);
  if (!validated.ok) return fallback("invalid_output");
  const response = validated.value;
  if (response.kind === "error") return fallback(response.error);
  if (status !== 200) return fallback("invalid_output");
  if (response.kind === "out_of_scope") return { kind: "out_of_scope", topic: response.topic, messageKey: `ai.outOfScope.${response.topic}` };
  return isEmpty(response.conditions) ? fallback("empty") : { kind: "suggestion", suggestion: response.conditions };
}
