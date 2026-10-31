/**
 * Runs the evaluation set through the endpoint core with a given adapter, one request at
 * a time (a daily neuron allocation is spent predictably, and the order is fixed).
 */
import { foods } from "../../content/foods.ts";
import { forbiddenExpressions } from "../../content/glossary.ts";
import type { SuggestionAdapter } from "../../server/ai/adapter.ts";
import { fakeAdapter } from "../../server/ai/fake.ts";
import { handleSuggest } from "../../server/ai/suggest.ts";
import type { Locale } from "../../shared/locales.ts";
import type { ValidationContext } from "../../shared/suggestion.ts";
import type { EvaluationSet } from "./cases.ts";
import type { CaseResult } from "./metrics.ts";

export const repositoryContext: ValidationContext = { foodIds: new Set(foods.map((food) => food.id)), forbiddenExpressions };

export async function runEvaluation(set: EvaluationSet, adapter: SuggestionAdapter, locales: readonly Locale[], context: ValidationContext = repositoryContext): Promise<CaseResult[]> {
  const results: CaseResult[] = [];
  for (const intent of set.intents) {
    for (const locale of locales) {
      const result = await handleSuggest({ text: intent.texts[locale], locale }, { adapter, context, enabled: true });
      results.push({ intent: intent.id, locale, result });
    }
  }
  return results;
}

/** A fake that answers every case with its expected output: checks the pipeline, not a model. */
export function expectedAnswers(set: EvaluationSet): SuggestionAdapter {
  const answers = new Map(set.intents.flatMap((intent) => Object.values(intent.texts).map((text) => [text.trim(), JSON.stringify(intent.expected)] as const)));
  return fakeAdapter((request) => {
    const output = answers.get(request.text);
    return output === undefined ? { error: "unavailable" } : { output };
  });
}
