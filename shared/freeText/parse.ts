/**
 * Deterministic free-text conditions parser (ADR-034, revised again): reads foods, group
 * words, negations, a time limit, equipment, and cuisines from the user's text and
 * returns the same output shape the validation of `shared/suggestion.ts` checks. No AI,
 * no network: the same text, locale, and dictionary always give the same result. Text
 * it does not recognize is ignored, never guessed.
 */
import type { CalcBundle, TextBundle } from "../bundle.ts";
import { CUISINES, EQUIPMENT, type Equipment, type ProteinGroup } from "../content.ts";
import type { Locale } from "../locales.ts";
import { normalizeForSearch } from "../search.ts";
import { SUGGEST_LIMITS, type OutOfScopeTopic, type ProviderOutput } from "../suggestion.ts";
import { FOOD_GROUP_WORDS, FOOD_GROUPS, type Lexicon } from "./lexicon.ts";

/** A dictionary food with its names and aliases in the request locale. */
export interface ParserFood {
  readonly id: string;
  readonly terms: readonly string[];
  readonly proteinGroup?: ProteinGroup;
}

export function parserFoods(calc: CalcBundle, text: TextBundle): ParserFood[] {
  return calc.foods.flatMap((food) => {
    const texts = text.foods[food.id];
    if (texts === undefined) return [];
    return [{ id: food.id, terms: [texts.name, ...texts.aliases], ...(food.proteinGroup === undefined ? {} : { proteinGroup: food.proteinGroup }) }];
  });
}

interface Term {
  readonly text: string;
  readonly foods: readonly string[];
  /** A group word wins over a food name of the same length. */
  readonly group: boolean;
}

interface Span {
  readonly start: number;
  readonly end: number;
}

interface FoodMatch extends Span {
  readonly foods: readonly string[];
}

/** Spaces in `ja` are not word boundaries; everywhere else, letters and digits make a word. */
const isWordChar = (char: string | undefined) => char !== undefined && /[\p{L}\p{N}]/u.test(char);
const isHiragana = (text: string) => /^[ぁ-ゖー]+$/u.test(text);

function normalize(lexicon: Lexicon, text: string): string {
  let kept = text.normalize("NFC").replace(/[’‘`´]/g, "'");
  for (const [word, spelling] of lexicon.keepApart) kept = kept.replace(new RegExp(word, "giu"), spelling);
  return normalizeForSearch(lexicon.locale, kept).replace(/\s+/g, " ");
}

/** A name without its qualifier in parentheses: "Lentils (boiled)" is also "lentils". */
const withoutQualifier = (name: string) => name.replace(/[（(][^）)]*[）)]/g, "").trim();

/** Whether `term` matches `text` at `start`, with word boundaries outside `ja` and an optional plural ending. */
function matchEnd(locale: Locale, text: string, start: number, term: string, prefix = false): number | undefined {
  if (!text.startsWith(term, start)) return undefined;
  if (locale === "ja") {
    // A short kana word inside a longer kana run is part of another word ("作ったら" is not "たら").
    if (term.length <= 2 && isHiragana(term) && start > 0 && isHiragana(text.charAt(start - 1))) return undefined;
    return start + term.length;
  }
  if (isWordChar(text[start - 1]) && isWordChar(term[0])) return undefined;
  let end = start + term.length;
  if (prefix) {
    while (isWordChar(text[end])) end += 1;
    return end;
  }
  for (const ending of ["", "s", "es", "x"]) {
    if (text.startsWith(ending, end) && !(isWordChar(text[end + ending.length]) && isWordChar(term.at(-1)))) return end + ending.length;
  }
  return undefined;
}

/** Every start of each term in `text`, with its end. */
function findAll(locale: Locale, text: string, terms: readonly string[], prefix = false): Span[] {
  const spans: Span[] = [];
  for (const term of terms) {
    for (let index = text.indexOf(term); index !== -1; index = text.indexOf(term, index + 1)) {
      const end = matchEnd(locale, text, index, term, prefix);
      if (end !== undefined) spans.push({ start: index, end });
    }
  }
  return spans.sort((a, b) => a.start - b.start || b.end - a.end);
}

function buildTerms(locale: Locale, foods: readonly ParserFood[], lexicon: Lexicon): Term[] {
  const byText = new Map<string, Set<string>>();
  for (const food of foods) {
    for (const raw of food.terms.flatMap((term) => [term, withoutQualifier(term)])) {
      const text = normalize(lexicon, raw);
      if (text !== "") byText.set(text, (byText.get(text) ?? new Set()).add(food.id));
    }
  }
  // Singular forms outside `ja` ("chickpea" for "chickpeas"); a plural is matched by `matchEnd`.
  if (locale !== "ja") {
    for (const [text, ids] of [...byText]) {
      const singular = text.replace(/(?<=\p{L}{3})(?:es|s|x)$/u, "");
      if (singular !== text && !byText.has(singular)) byText.set(singular, ids);
    }
  }
  const known = new Set(foods.map((food) => food.id));
  const terms: Term[] = [...byText].map(([text, ids]) => ({ text, foods: [...ids], group: false }));
  // Other words of the lexicon are read whole, so a food name inside them is not a food (東南アジア is not アジ).
  const otherWords = [...lexicon.notFoods, ...Object.values(lexicon.cuisines).flat(), ...Object.values(lexicon.equipment).flat()];
  for (const phrase of otherWords) terms.push({ text: normalize(lexicon, phrase), foods: [], group: false });
  for (const word of FOOD_GROUP_WORDS) {
    const definition = FOOD_GROUPS[word];
    const ids =
      "foods" in definition
        ? definition.foods.filter((id) => known.has(id))
        : foods.filter((food) => food.proteinGroup === definition.proteinGroup && !(definition.except ?? []).includes(food.id)).map((food) => food.id);
    if (ids.length === 0) continue;
    for (const raw of lexicon.groups[word]) terms.push({ text: normalize(lexicon, raw), foods: ids, group: true });
  }
  return terms;
}

/** Longest match first at each position; at the same length a group word wins. */
function matchFoods(locale: Locale, text: string, terms: readonly Term[]): FoodMatch[] {
  const matches: FoodMatch[] = [];
  let position = 0;
  while (position < text.length) {
    let best: { end: number; term: Term } | undefined;
    if (locale === "ja" || !isWordChar(text[position - 1])) {
      for (const term of terms) {
        const end = matchEnd(locale, text, position, term.text);
        if (end === undefined) continue;
        if (best === undefined || end > best.end || (end === best.end && term.group && !best.term.group)) best = { end, term };
      }
    }
    if (best === undefined) {
      position += 1;
    } else {
      if (best.term.foods.length > 0) matches.push({ start: position, end: best.end, foods: best.term.foods });
      position = best.end;
    }
  }
  return matches;
}

/** The text with the given spans blanked, so their words are not read again. */
function mask(text: string, spans: readonly Span[]): string {
  let result = text;
  for (const span of spans) result = result.slice(0, span.start) + " ".repeat(span.end - span.start) + result.slice(span.end);
  return result;
}

function clauseBreaks(locale: Locale, text: string, lexicon: Lexicon): number[] {
  const breaks = [...text.matchAll(/[,、，。.;；!！?？\n]/g)].map((match) => match.index);
  return [...breaks, ...findAll(locale, text, lexicon.clauseBreaks).map((span) => span.start)].sort((a, b) => a - b);
}

function clauseOf(position: number, breaks: readonly number[]): number {
  return breaks.filter((index) => index < position).length;
}

function isNegated(span: Span, negations: readonly Span[], breaks: readonly number[], lexicon: Lexicon): boolean {
  const clause = clauseOf(span.start, breaks);
  return negations.some((cue) => clauseOf(cue.start, breaks) === clause && (lexicon.negationPosition === "before" ? cue.end <= span.start : cue.start >= span.end));
}

/** Whether the text between two foods says "or". In `ja`, the one-kana か must stand alone ("レンズ豆かひよこ豆"). */
function joinsAlternatives(locale: Locale, gap: string, orWords: readonly string[]): boolean {
  const between = gap.trim();
  if (locale !== "ja") return findAll(locale, between, orWords).length > 0;
  return orWords.some((word) => (word.length === 1 ? between === word : between.includes(word)));
}

function readMinutes(locale: Locale, text: string, lexicon: Lexicon): number | undefined {
  const candidates: { start: number; minutes: number }[] = [];
  for (const [units, factor] of [
    [lexicon.minuteUnits, 1],
    [lexicon.hourUnits, 60],
  ] as const) {
    for (const match of text.matchAll(/(\d+(?:[.,]\d+)?) ?/g)) {
      const after = match.index + match[0].length;
      const value = Number(match[1]?.replace(",", "."));
      if (units.some((unit) => matchEnd(locale, text, after, unit) !== undefined)) candidates.push({ start: match.index, minutes: Math.round(value * factor) });
    }
  }
  for (const [phrase, minutes] of lexicon.durations) {
    for (const span of findAll(locale, text, [normalize(lexicon, phrase)])) candidates.push({ start: span.start, minutes });
  }
  const first = candidates.sort((a, b) => a.start - b.start)[0];
  if (first === undefined) return undefined;
  const { min, max } = SUGGEST_LIMITS.maxMinutes;
  return first.minutes >= min && first.minutes <= max ? first.minutes : undefined;
}

/** Allergies first; then health, recipe generation, and instructions, which outrank a nutrition word in the same request. */
const TOPIC_ORDER: readonly OutOfScopeTopic[] = ["allergens", "other", "targets"];

/** Reads `input` with the word list of its locale (`lexicon.locale`). */
export function parseConditions(input: string, lexicon: Lexicon, foods: readonly ParserFood[]): ProviderOutput {
  const { locale } = lexicon;
  const text = normalize(lexicon, input);
  const cues = (words: readonly string[], prefix = false) => findAll(locale, text, words.map((word) => normalize(lexicon, word)), prefix);

  for (const topic of TOPIC_ORDER) {
    if (cues(lexicon.outOfScope[topic], true).length > 0) return { kind: "out_of_scope", topic };
  }

  const foodMatches = matchFoods(locale, text, buildTerms(locale, foods, lexicon));
  const rest = mask(text, foodMatches);
  const breaks = clauseBreaks(locale, rest, lexicon);
  const negations = findAll(locale, rest, lexicon.negation.map((word) => normalize(lexicon, word)));
  const orWords = lexicon.or.map((word) => normalize(lexicon, word));

  const excluded: string[] = [];
  const required: string[][] = [];
  let previous: FoodMatch | undefined;
  for (const match of foodMatches) {
    if (isNegated(match, negations, breaks, lexicon)) {
      excluded.push(...match.foods);
      continue;
    }
    const last = required.at(-1);
    if (previous !== undefined && last !== undefined && clauseOf(previous.start, breaks) === clauseOf(match.start, breaks) && joinsAlternatives(locale, rest.slice(previous.end, match.start), orWords)) {
      last.push(...match.foods);
    } else {
      required.push([...match.foods]);
    }
    previous = match;
  }

  const excludedSet = new Set(excluded);
  const requiredFoods = required
    .map((item) => [...new Set(item)].filter((food) => !excludedSet.has(food)).slice(0, SUGGEST_LIMITS.foodsPerItem))
    .filter((item) => item.length > 0)
    .slice(0, SUGGEST_LIMITS.requiredItems);

  const equipment = new Set<Equipment>();
  for (const item of EQUIPMENT) {
    for (const span of findAll(locale, rest, lexicon.equipment[item].map((word) => normalize(lexicon, word)))) {
      if (isNegated(span, negations, breaks, lexicon)) continue;
      equipment.add(item);
      // A pan or a pot is used on the stove (rule of the evaluation set).
      if (item === "pot" || item === "frying_pan" || item === "deep_pan") equipment.add("stove");
    }
  }
  const cuisineSpans = CUISINES.map((cuisine) => findAll(locale, rest, lexicon.cuisines[cuisine].map((word) => normalize(lexicon, word)), true));
  // A cuisine word inside a longer one of another cuisine is part of it ("occidental" in "África occidental").
  const insideLonger = (span: Span) => cuisineSpans.flat().some((other) => other.start <= span.start && other.end >= span.end && other.end - other.start > span.end - span.start);
  const cuisines = CUISINES.filter((_, index) => cuisineSpans[index]?.some((span) => !insideLonger(span)));
  const maxMinutes = readMinutes(locale, rest, lexicon);

  return {
    kind: "conditions",
    conditions: {
      requiredFoods,
      excludedFoods: [...excludedSet].slice(0, SUGGEST_LIMITS.excludedFoods),
      ...(maxMinutes === undefined ? {} : { maxMinutes }),
      ...(equipment.size === 0 ? {} : { equipment: EQUIPMENT.filter((item) => equipment.has(item)) }),
      cuisines,
    },
  };
}
