/**
 * Runs the evaluation set through the endpoint core with a given adapter, one request at
 * a time in a fixed order. The run stops at the first `budget_spent`.
 */
import { foods } from "../../content/foods.ts";
import { forbiddenExpressions } from "../../content/glossary.ts";
import type { SuggestionAdapter } from "../../server/ai/adapter.ts";
import { fakeAdapter } from "../../server/ai/fake.ts";
import { handleSuggest } from "../../server/ai/suggest.ts";
import { parseConditions, type ParserFood } from "../../shared/freeText/parse.ts";
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
      // Every later request would fail too; the run reports the cases done so far.
      if (result.body.kind === "error" && result.body.error === "budget_spent") return results;
    }
  }
  return results;
}

/** The parser's dictionary of a locale from the repository foods (the browser builds the same from the bundles). */
export function parserFoodsOf(locale: Locale): ParserFood[] {
  return foods.map((food) => ({ id: food.id, terms: [food.names[locale], ...food.aliases[locale]], ...(food.proteinGroup === undefined ? {} : { proteinGroup: food.proteinGroup }) }));
}

/** The deterministic parser (ADR-034, revised again) behind the adapter interface, so its output passes the same validation. */
export function parserAdapter(): SuggestionAdapter {
  return fakeAdapter((request) => ({ output: JSON.stringify(parseConditions(request.text, request.locale, parserFoodsOf(request.locale))) }));
}

/** A fake that answers every case with its expected output: checks the pipeline, not a model. */
export function expectedAnswers(set: EvaluationSet): SuggestionAdapter {
  const answers = new Map(set.intents.flatMap((intent) => Object.values(intent.texts).map((text) => [text.trim(), JSON.stringify(intent.expected)] as const)));
  return fakeAdapter((request) => {
    const output = answers.get(request.text);
    return output === undefined ? { error: "unavailable" } : { output };
  });
}
