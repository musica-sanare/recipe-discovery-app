/**
 * Evaluation set of the AI free-text conditions (ADR-034 D4): fixed intents, each with
 * one locale-neutral expected output and one request text per locale, so cross-locale
 * consistency is measured on the same intents.
 */
import { readFileSync } from "node:fs";
import * as z from "zod/mini";
import { nonBlank, slug } from "../../shared/content.ts";
import { providerOutputSchema } from "../../shared/suggestion.ts";

export const CASES_PATH = new URL("../../data/ai-evaluation/conditions.json", import.meta.url);

export const CATEGORIES = ["single_food", "required_items", "time", "exclusion", "equipment", "cuisine", "combined", "no_condition", "out_of_scope"] as const;

const reviewStatus = z.enum(["pending", "reviewed"]);

export const evaluationSetSchema = z.strictObject({
  version: z.number().check(z.int(), z.positive()),
  source: nonBlank,
  review: z.strictObject({ ja: reviewStatus, en: reviewStatus, es: reviewStatus, fr: reviewStatus }),
  /** The mapping rules the expected outputs follow; the provider prompt states the same rules. */
  rules: z.array(nonBlank),
  intents: z.array(
    z.strictObject({
      id: slug,
      category: z.enum(CATEGORIES),
      expected: providerOutputSchema,
      texts: z.strictObject({ ja: nonBlank, en: nonBlank, es: nonBlank, fr: nonBlank }),
      note: z.optional(nonBlank),
    }),
  ),
});
export type EvaluationSet = z.infer<typeof evaluationSetSchema>;
export type Intent = EvaluationSet["intents"][number];

export function loadEvaluationSet(path: URL = CASES_PATH): EvaluationSet {
  return z.parse(evaluationSetSchema, JSON.parse(readFileSync(path, "utf8")));
}

export const SPLITS = ["all", "dev", "holdout"] as const;
export type Split = (typeof SPLITS)[number];

/**
 * The parser is tuned on `dev` only, and `holdout` decides acceptance (ADR-034 D4, revised
 * again). Intents alternate by their position in the file, so both halves cover every
 * category; the split never depends on the results.
 */
export function splitIntents(set: EvaluationSet, split: Split): EvaluationSet {
  if (split === "all") return set;
  return { ...set, intents: set.intents.filter((_, index) => (index % 2 === 0) === (split === "dev")) };
}
