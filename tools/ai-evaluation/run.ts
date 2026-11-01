/**
 * Runs the evaluation set through an answer function and the runtime validation of
 * `shared/suggestion.ts`, one case at a time in a fixed order, so a rejected output
 * counts as no output.
 */
import { foods } from "../../content/foods.ts";
import { forbiddenExpressions } from "../../content/glossary.ts";
import { LEXICONS } from "../../shared/freeText/lexicon/index.ts";
import { parseConditions, type ParserFood } from "../../shared/freeText/parse.ts";
import type { Locale } from "../../shared/locales.ts";
import { validateProviderOutput, type ValidationContext } from "../../shared/suggestion.ts";
import type { EvaluationSet } from "./cases.ts";
import type { CaseResult } from "./metrics.ts";

export const repositoryContext: ValidationContext = { foodIds: new Set(foods.map((food) => food.id)), forbiddenExpressions };

/** The serialized output for a request text, as the UI would validate it. */
export type Answer = (text: string, locale: Locale) => string;

export function runEvaluation(set: EvaluationSet, answer: Answer, locales: readonly Locale[], context: ValidationContext = repositoryContext): CaseResult[] {
  return set.intents.flatMap((intent) => locales.map((locale) => ({ intent: intent.id, locale, result: validateProviderOutput(answer(intent.texts[locale].trim(), locale), context) })));
}

/** The parser's dictionary of a locale from the repository foods (the browser builds the same from the bundles). */
export function parserFoodsOf(locale: Locale): ParserFood[] {
  return foods.map((food) => ({ id: food.id, terms: [food.names[locale], ...food.aliases[locale]], ...(food.proteinGroup === undefined ? {} : { proteinGroup: food.proteinGroup }) }));
}

/** The deterministic parser (ADR-034, revised again). */
export const parserAnswer: Answer = (text, locale) => JSON.stringify(parseConditions(text, LEXICONS[locale], parserFoodsOf(locale)));

/** Answers every case with its expected output: checks the pipeline, not the parser. An unknown text gets no output. */
export function expectedAnswers(set: EvaluationSet): Answer {
  const answers = new Map(set.intents.flatMap((intent) => Object.values(intent.texts).map((text) => [text.trim(), JSON.stringify(intent.expected)] as const)));
  return (text) => answers.get(text) ?? "";
}
