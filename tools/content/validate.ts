/**
 * Build-time content validation (docs/working/IMPLEMENTATION_PLAN.md "Phase 1"). Pure: the
 * caller passes the content and the composition codes; every problem is returned
 * with the file, the recipe or food, the field, and the rule it breaks.
 */
import * as z from "zod/mini";
import { foodSchema, recipeSchema, type Food, type LocalizedText, type Recipe, type RecipeIngredient } from "../../shared/content.ts";
import { isFried } from "../../shared/recipe.ts";
import { SUPPORTED_LOCALES, type Locale } from "../../shared/locales.ts";
import { forbiddenIn } from "../../shared/policy.ts";

export const RULES = [
  "schema",
  "locale",
  "unique-id",
  "registry",
  "reference",
  "cooking-state",
  "adjustment",
  "link",
  "side",
  "substitution",
  "allergen",
  "safety-note",
  "protein-group",
  "tag",
  "glossary",
  "forbidden-expression",
  "version",
] as const;
export type Rule = (typeof RULES)[number];

export interface Issue {
  readonly file: string;
  /** Recipe or food ID, or the content item checked. */
  readonly subject: string;
  readonly field: string;
  readonly rule: Rule;
  readonly message: string;
}

type Localized<T> = Readonly<Record<Locale, T>>;

export interface ContentInput {
  readonly foods: readonly unknown[];
  readonly recipes: readonly { readonly file: string; readonly recipe: unknown }[];
  /** Files under content/recipes/ that the recipe index does not register. */
  readonly unregisteredFiles: readonly string[];
  readonly glossary: readonly LocalizedText[];
  readonly forbiddenExpressions: Localized<readonly string[]>;
  /** Food codes present in data/composition/foods.json. */
  readonly compositionCodes: ReadonlySet<string>;
  /** Cooked food codes with a weight change rate in data/composition/cooking.json. */
  readonly ratedCodes: ReadonlySet<string>;
  readonly contentVersion: string;
}

export const FOODS_FILE = "content/foods.ts";
export const VERSION_FILE = "content/version.ts";
const LOCALES = SUPPORTED_LOCALES;
/** Protein groups whose recipes need a doneness or handling note (docs/en/CONTENT_POLICY.md §3). */
const SAFETY_GROUPS: ReadonlySet<string> = new Set(["chicken", "pork", "beef", "fish", "egg"]);

export function formatIssue(issue: Issue): string {
  return `${issue.file} › ${issue.subject} › ${issue.field}: ${issue.message} [${issue.rule}]`;
}

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null && !Array.isArray(value);

function pathText(path: readonly PropertyKey[]): string {
  return path.map((part) => String(part)).join(".") || "(root)";
}

/** Objects that carry any of ja/en/es, with their field paths. */
function localizedObjects(value: unknown, path: string[] = []): { path: string; value: Record<string, unknown> }[] {
  if (Array.isArray(value)) return value.flatMap((item, index) => localizedObjects(item, [...path, String(index)]));
  if (!isRecord(value)) return [];
  if (LOCALES.some((locale) => locale in value)) return [{ path: pathText(path), value }];
  return Object.entries(value).flatMap(([key, item]) => localizedObjects(item, [...path, key]));
}

function localeIssues(value: unknown, file: string, subject: string): Issue[] {
  return localizedObjects(value).flatMap(({ path, value: text }) =>
    LOCALES.flatMap((locale) => {
      const entry = text[locale];
      const field = `${path}.${locale}`;
      if (typeof entry === "string") {
        return entry.trim() === "" ? [{ file, subject, field, rule: "locale" as const, message: "text is blank" }] : [];
      }
      if (Array.isArray(entry)) {
        return entry.some((item) => typeof item !== "string" || item.trim() === "")
          ? [{ file, subject, field, rule: "locale" as const, message: "list contains a blank entry" }]
          : [];
      }
      return [{ file, subject, field, rule: "locale" as const, message: `missing ${locale} text` }];
    }),
  );
}

/** Schema problems other than locale ones, which `localeIssues` reports more clearly. */
function schemaIssues(error: z.core.$ZodError, file: string, subject: string): Issue[] {
  return error.issues
    .filter((issue) => !LOCALES.some((locale) => issue.path.at(-1) === locale))
    .map((issue) => ({ file, subject, field: pathText(issue.path), rule: "schema" as const, message: issue.message }));
}

function idOf(value: unknown, fallback: string): string {
  return isRecord(value) && typeof value["id"] === "string" ? value["id"] : fallback;
}

function duplicates(values: readonly string[]): string[] {
  const seen = new Set<string>();
  const repeated = new Set<string>();
  for (const value of values) (seen.has(value) ? repeated : seen).add(value);
  return [...repeated];
}

function foodIssues(food: Food, input: ContentInput): Issue[] {
  const issue = (field: string, rule: Rule, message: string): Issue => ({ file: FOODS_FILE, subject: food.id, field, rule, message });
  const issues: Issue[] = [];
  for (const [state, code] of Object.entries(food.composition)) {
    if (!input.compositionCodes.has(code)) issues.push(issue(`composition.${state}`, "cooking-state", `food code ${code} is not in data/composition/foods.json`));
    if (state !== "raw" && state !== "as_is" && !input.ratedCodes.has(code)) {
      issues.push(issue(`composition.${state}`, "cooking-state", `cooked food code ${code} has no weight change rate in data/composition/cooking.json`));
    }
  }
  if (food.allergens !== "unknown") {
    for (const allergen of duplicates(food.allergens.map((link) => link.allergen))) issues.push(issue("allergens", "allergen", `allergen ${allergen} is listed twice`));
  }
  return issues;
}

function gridIssue(ingredient: RecipeIngredient): string | undefined {
  const { adjust, grams, measure } = ingredient;
  if (!adjust) return undefined;
  if (adjust.min > adjust.max) return `min ${String(adjust.min)} is above max ${String(adjust.max)}`;
  if (adjust.kind === "grams") {
    const steps = (grams - adjust.min) / adjust.step;
    if (grams > adjust.max + 1e-9 || steps < -1e-9 || Math.abs(steps - Math.round(steps)) > 1e-9) {
      return `default ${String(grams)} g is not on the grid ${String(adjust.min)}–${String(adjust.max)} g in steps of ${String(adjust.step)} g`;
    }
    return undefined;
  }
  const units = grams / adjust.unitGrams;
  if (!Number.isInteger(units) || units < adjust.min || units > adjust.max) {
    return `default ${String(grams)} g is not ${String(adjust.min)}–${String(adjust.max)} whole units of ${String(adjust.unitGrams)} g`;
  }
  if (measure && measure.quantity !== units) return `measure quantity ${String(measure.quantity)} differs from the count ${String(units)}`;
  return undefined;
}

function recipeIssues(recipe: Recipe, file: string, foods: ReadonlyMap<string, Food>): Issue[] {
  const issues: Issue[] = [];
  const issue = (field: string, rule: Rule, message: string) => issues.push({ file, subject: recipe.id, field, rule, message });
  const ingredients = new Map(recipe.ingredients.map((ingredient) => [ingredient.key, ingredient]));
  const stepKeys = new Set(recipe.steps.map((step) => step.key));
  const safetyKeys = new Set(recipe.safetyNotes.map((note) => note.key));
  const sideKeys = new Set(recipe.sides.map((side) => side.key));

  const keyLists: [string, string[]][] = [
    ["ingredients", recipe.ingredients.map((ingredient) => ingredient.key)],
    ["steps", recipe.steps.map((step) => step.key)],
    ["safetyNotes", recipe.safetyNotes.map((note) => note.key)],
    ["sides", recipe.sides.map((side) => side.key)],
    ["substitutions", recipe.substitutions.map((substitution) => substitution.key)],
  ];
  for (const [field, keys] of keyLists) for (const key of duplicates(keys)) issue(field, "unique-id", `key ${key} is used twice`);
  for (const key of duplicates(recipe.sides.flatMap((side) => side.ingredients))) issue("sides", "side", `ingredient ${key} belongs to more than one side`);

  for (const ingredient of recipe.ingredients) {
    const field = `ingredients.${ingredient.key}`;
    const food = foods.get(ingredient.food);
    if (!food) {
      issue(`${field}.food`, "reference", `unknown food ${ingredient.food}`);
    } else {
      if (!(ingredient.state in food.composition)) issue(`${field}.state`, "cooking-state", `food ${food.id} has no state ${ingredient.state}`);
      if (ingredient.cooking !== undefined && ingredient.cooking in food.composition) {
        issue(`${field}.cooking`, "cooking-state", `the tables have a ${ingredient.cooking} value for ${food.id}; use it as the state`);
      }
    }
    if (ingredient.includedIn !== undefined) {
      const container = ingredients.get(ingredient.includedIn);
      if (!container || container.includedIn !== undefined) issue(`${field}.includedIn`, "reference", `${ingredient.includedIn} is not a counted ingredient of this recipe`);
    }
    if (ingredient.adjust) {
      if (ingredient.role !== "main_protein" && ingredient.role !== "main_carb") issue(`${field}.adjust`, "adjustment", `role ${ingredient.role} cannot be adjusted`);
      const problem = gridIssue(ingredient);
      if (problem) issue(`${field}.adjust`, "adjustment", problem);
    }
    if (ingredient.linkedTo !== undefined) {
      const leader = ingredients.get(ingredient.linkedTo);
      if (!leader) issue(`${field}.linkedTo`, "link", `unknown ingredient ${ingredient.linkedTo}`);
      else if (!leader.adjust) issue(`${field}.linkedTo`, "link", `leader ${leader.key} is not adjustable`);
      else if (leader.linkedTo !== undefined) issue(`${field}.linkedTo`, "link", `leader ${leader.key} is itself linked`);
      if (ingredient.adjust) issue(`${field}.linkedTo`, "link", "an adjustable ingredient cannot be linked");
    }
  }
  if (!recipe.ingredients.some((ingredient) => ingredient.adjust) && !recipe.sides.some((side) => side.solverMayRemove)) {
    issue("ingredients", "adjustment", "no adjustable ingredient and no side that the solver may switch off (ADR-023)");
  }

  for (const side of recipe.sides) {
    const field = `sides.${side.key}`;
    for (const key of side.ingredients) {
      const ingredient = ingredients.get(key);
      if (!ingredient) issue(`${field}.ingredients`, "reference", `unknown ingredient ${key}`);
      else if (ingredient.role === "main_protein") issue(`${field}.ingredients`, "side", `main protein ${key} cannot be a side`);
    }
    if (side.solverMayRemove && !side.ingredients.some((key) => ingredients.get(key)?.role === "main_carb")) {
      issue(`${field}.solverMayRemove`, "side", "only carbohydrate sides may be switched off by the solver");
    }
  }

  for (const step of recipe.steps) {
    const field = `steps.${step.key}`;
    if (step.side !== undefined && !sideKeys.has(step.side)) issue(`${field}.side`, "reference", `unknown side ${step.side}`);
    for (const note of step.notes ?? []) {
      const ingredient = ingredients.get(note.ingredient);
      if (!ingredient) issue(`${field}.notes`, "reference", `unknown ingredient ${note.ingredient}`);
      else if (note.atLeastGrams <= ingredient.grams) {
        issue(`${field}.notes`, "adjustment", `threshold ${String(note.atLeastGrams)} g does not exceed the default ${String(ingredient.grams)} g`);
      }
    }
  }

  for (const substitution of recipe.substitutions) {
    const field = `substitutions.${substitution.key}`;
    const original = ingredients.get(substitution.ingredient);
    const food = foods.get(substitution.food);
    if (!original) issue(`${field}.ingredient`, "reference", `unknown ingredient ${substitution.ingredient}`);
    if (!food) issue(`${field}.food`, "reference", `unknown food ${substitution.food}`);
    else if (!(substitution.state in food.composition)) issue(`${field}.state`, "cooking-state", `food ${food.id} has no state ${substitution.state}`);
    if (original?.adjust?.kind === "count" && !substitution.adjust) issue(`${field}.adjust`, "substitution", "replacing a counted ingredient needs its own bounds");
    for (const entry of substitution.stepTexts ?? []) if (!stepKeys.has(entry.step)) issue(`${field}.stepTexts`, "reference", `unknown step ${entry.step}`);
    for (const note of substitution.safetyNotes?.replace ?? []) if (!safetyKeys.has(note.key)) issue(`${field}.safetyNotes`, "reference", `unknown safety note ${note.key}`);
    for (const note of substitution.safetyNotes?.add ?? []) if (safetyKeys.has(note.key)) issue(`${field}.safetyNotes`, "unique-id", `added safety note ${note.key} already exists`);
    if (substitution.minutesDelta !== undefined && recipe.minutes + substitution.minutesDelta <= 0) issue(`${field}.minutesDelta`, "substitution", "total minutes must stay positive");
  }

  const groups = recipe.ingredients.filter((ingredient) => ingredient.role === "main_protein").map((ingredient) => foods.get(ingredient.food)?.proteinGroup);
  if (!groups.includes(recipe.mainProteinGroup)) issue("mainProteinGroup", "protein-group", `no main protein food belongs to ${recipe.mainProteinGroup}`);

  const handlesRiskyFood = recipe.ingredients.some((ingredient) => SAFETY_GROUPS.has(foods.get(ingredient.food)?.proteinGroup ?? ""));
  if ((handlesRiskyFood || isFried(recipe)) && recipe.safetyNotes.length === 0) {
    issue("safetyNotes", "safety-note", "meat, fish, eggs, or frying need a food safety note (docs/en/CONTENT_POLICY.md §3)");
  }
  if (recipe.tags.includes("no_cook")) {
    for (const ingredient of recipe.ingredients) {
      if ((ingredient.state !== "raw" && ingredient.state !== "as_is") || ingredient.cooking !== undefined) issue(`ingredients.${ingredient.key}`, "tag", "a no_cook recipe has a cooked ingredient");
    }
  }
  return issues;
}

/** Glossary and forbidden-expression checks for every text of one content item. */
function languageIssues(value: unknown, file: string, subject: string, input: ContentInput): Issue[] {
  const glossary = [...input.glossary].sort((a, b) => b.ja.length - a.ja.length);
  const issues: Issue[] = [];
  for (const { path, value: text } of localizedObjects(value)) {
    if (!LOCALES.every((locale) => typeof text[locale] === "string")) continue;
    const texts = text as Record<Locale, string>;
    let japanese = texts.ja;
    for (const term of glossary) {
      if (!japanese.includes(term.ja)) continue;
      japanese = japanese.replaceAll(term.ja, "");
      for (const locale of LOCALES) {
        if (locale === "ja") continue;
        if (!texts[locale].toLowerCase().includes(term[locale].toLowerCase())) issues.push({ file, subject, field: `${path}.${locale}`, rule: "glossary", message: `"${term.ja}" must be "${term[locale]}"` });
      }
    }
    const found = LOCALES.flatMap((locale) => forbiddenIn(locale, texts[locale], input.forbiddenExpressions[locale]).map((word) => [locale, word] as const));
    for (const [locale, word] of found) issues.push({ file, subject, field: `${path}.${locale}`, rule: "forbidden-expression", message: `contains "${word}" (docs/en/CONTENT_POLICY.md §2, §4)` });
  }
  return issues;
}

export function validateContent(input: ContentInput): Issue[] {
  const issues: Issue[] = [];
  const foods = new Map<string, Food>();

  input.foods.forEach((raw, index) => {
    const subject = idOf(raw, `foods[${String(index)}]`);
    issues.push(...localeIssues(raw, FOODS_FILE, subject));
    const parsed = z.safeParse(foodSchema, raw);
    if (!parsed.success) {
      issues.push(...schemaIssues(parsed.error, FOODS_FILE, subject));
      return;
    }
    if (foods.has(parsed.data.id)) issues.push({ file: FOODS_FILE, subject, field: "id", rule: "unique-id", message: `food id ${subject} is used twice` });
    foods.set(parsed.data.id, parsed.data);
    issues.push(...languageIssues(raw, FOODS_FILE, subject, input));
  });
  for (const food of foods.values()) issues.push(...foodIssues(food, input));

  const recipeIds = new Set<string>();
  input.recipes.forEach(({ file, recipe: raw }, index) => {
    const subject = idOf(raw, `recipes[${String(index)}]`);
    issues.push(...localeIssues(raw, file, subject));
    const parsed = z.safeParse(recipeSchema, raw);
    if (!parsed.success) {
      issues.push(...schemaIssues(parsed.error, file, subject));
      return;
    }
    const recipe = parsed.data;
    if (recipeIds.has(recipe.id)) issues.push({ file, subject, field: "id", rule: "unique-id", message: `recipe id ${recipe.id} is used twice` });
    recipeIds.add(recipe.id);
    if (!file.endsWith(`/${recipe.id}.ts`)) issues.push({ file, subject, field: "id", rule: "registry", message: `file name must be ${recipe.id}.ts` });
    issues.push(...recipeIssues(recipe, file, foods), ...languageIssues(raw, file, subject, input));
  });
  for (const file of input.unregisteredFiles) {
    issues.push({ file, subject: file, field: "(file)", rule: "registry", message: "recipe file is not registered in content/recipes/index.ts" });
  }

  if (!/^\d{4}-\d{2}-\d{2}\.[1-9]\d*$/.test(input.contentVersion)) {
    issues.push({ file: VERSION_FILE, subject: "CONTENT_VERSION", field: "CONTENT_VERSION", rule: "version", message: `"${input.contentVersion}" is not YYYY-MM-DD.n` });
  }
  return issues;
}
