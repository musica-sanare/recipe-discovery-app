import { describe, expect, it } from "vitest";
import { RULES, formatIssue, validateContent, type ContentInput, type Rule } from "./validate.ts";

const text = (ja: string, en: string, es: string) => ({ ja, en, es });
const noAliases = { ja: [], en: [], es: [] };

/** A minimal valid content set; each test breaks one rule. */
function fixture() {
  return {
    foods: [
      {
        id: "chicken",
        names: text("鶏肉", "Chicken", "Pollo"),
        aliases: noAliases,
        composition: { raw: "11220", grill: "11288" },
        allergens: [{ allergen: "chicken", confidence: "contains" }],
        proteinGroup: "chicken",
      },
      { id: "egg", names: text("卵", "Egg", "Huevo"), aliases: noAliases, composition: { raw: "12004" }, allergens: [{ allergen: "egg", confidence: "contains" }], proteinGroup: "egg" },
      { id: "rice", names: text("ご飯", "Rice", "Arroz"), aliases: noAliases, composition: { as_is: "01088" }, allergens: [] },
      { id: "cabbage", names: text("キャベツ", "Cabbage", "Repollo"), aliases: noAliases, composition: { raw: "06061" }, allergens: [] },
      { id: "salt", names: text("塩", "Salt", "Sal"), aliases: noAliases, composition: { as_is: "17012" }, allergens: [] },
    ] as Record<string, unknown>[],
    recipe: {
      id: "test_recipe",
      texts: { name: text("焼き鳥", "Grilled chicken", "Pollo a la plancha"), summary: text("鶏肉を焼きます。", "Grilled chicken.", "Pollo a la plancha.") },
      cuisine: "japanese",
      goals: ["cut"],
      mainProteinGroup: "chicken",
      tags: [] as string[],
      minutes: 20,
      effort: 1,
      equipment: ["stove"],
      servings: 1,
      ingredients: [
        { key: "chicken", food: "chicken", grams: 150, state: "grill", role: "main_protein", adjust: { kind: "grams", min: 120, max: 200, step: 10 } },
        { key: "egg", food: "egg", grams: 100, state: "raw", measure: { unit: "piece", quantity: 2 }, role: "main_protein", adjust: { kind: "count", unitGrams: 50, min: 1, max: 3 } },
        { key: "salt", food: "salt", grams: 1, state: "as_is", role: "seasoning", linkedTo: "chicken" },
        { key: "cabbage", food: "cabbage", grams: 60, state: "raw", role: "vegetable" },
        { key: "rice", food: "rice", grams: 150, state: "as_is", role: "main_carb", adjust: { kind: "grams", min: 100, max: 250, step: 10 } },
      ] as Record<string, unknown>[],
      sides: [
        { key: "rice", label: text("ご飯", "Rice", "Arroz"), ingredients: ["rice"], solverMayRemove: true },
        { key: "cabbage", label: text("キャベツ", "Cabbage", "Repollo"), ingredients: ["cabbage"], solverMayRemove: false },
      ] as Record<string, unknown>[],
      steps: [
        { key: "cook", text: text("鶏肉を中火で焼きます。", "Cook the chicken over medium heat.", "Cocina el pollo a fuego medio.") },
        { key: "cabbage", side: "cabbage", text: text("キャベツを切ります。", "Cut the cabbage.", "Corta el repollo.") },
      ] as Record<string, unknown>[],
      safetyNotes: [{ key: "doneness", text: text("中心まで火を通します。", "Cook through.", "Cocina por completo.") }] as Record<string, unknown>[],
      substitutions: [] as Record<string, unknown>[],
    },
  };
}

type Fixture = ReturnType<typeof fixture>;

function input(content: Fixture, overrides: Partial<ContentInput> = {}): ContentInput {
  return {
    foods: content.foods,
    recipes: [{ file: "content/recipes/test_recipe.ts", recipe: content.recipe }],
    unregisteredFiles: [],
    glossary: [text("中火", "medium heat", "fuego medio")],
    forbiddenExpressions: { ja: ["痩せ"], en: ["burn fat"], es: ["quema grasa"] },
    compositionCodes: new Set(["11220", "11288", "12004", "01088", "06061", "17012"]),
    ratedCodes: new Set(["11288"]),
    contentVersion: "2026-10-18.1",
    ...overrides,
  };
}

const ingredient = (content: Fixture, key: string): Record<string, unknown> => {
  const found = content.recipe.ingredients.find((entry) => entry["key"] === key);
  if (!found) throw new Error(key);
  return found;
};

interface Case {
  readonly name: string;
  readonly rule: Rule;
  readonly field: string;
  readonly breakIt: (content: Fixture) => Partial<ContentInput> | undefined;
}

const cases: readonly Case[] = [
  { name: "a value outside the schema", rule: "schema", field: "effort", breakIt: (c) => void (c.recipe.effort = 4) },
  { name: "a missing Spanish text", rule: "locale", field: "texts.name.es", breakIt: (c) => void Reflect.deleteProperty(c.recipe.texts.name, "es") },
  { name: "a blank Japanese step", rule: "locale", field: "steps.0.text.ja", breakIt: (c) => void ((c.recipe.steps[0]?.["text"] as ReturnType<typeof text>).ja = " ") },
  { name: "a duplicate food id", rule: "unique-id", field: "id", breakIt: (c) => void c.foods.push({ ...c.foods[4] }) },
  { name: "a duplicate step key", rule: "unique-id", field: "steps", breakIt: (c) => void c.recipe.steps.push({ key: "cook", text: text("盛ります。", "Plate.", "Emplata.") }) },
  { name: "a file name that differs from the id", rule: "registry", field: "id", breakIt: (c) => ({ recipes: [{ file: "content/recipes/other_name.ts", recipe: c.recipe }] }) },
  { name: "an unregistered recipe file", rule: "registry", field: "(file)", breakIt: () => ({ unregisteredFiles: ["content/recipes/orphan.ts"] }) },
  { name: "an unknown food", rule: "reference", field: "ingredients.salt.food", breakIt: (c) => void (ingredient(c, "salt")["food"] = "pepper") },
  { name: "includedIn pointing to a missing ingredient", rule: "reference", field: "ingredients.salt.includedIn", breakIt: (c) => void (ingredient(c, "salt")["includedIn"] = "oil") },
  { name: "a step for a missing side", rule: "reference", field: "steps.cabbage.side", breakIt: (c) => void (c.recipe.steps[1] = { ...c.recipe.steps[1], side: "salad" }) },
  { name: "a state the food does not have", rule: "cooking-state", field: "ingredients.chicken.state", breakIt: (c) => void (ingredient(c, "chicken")["state"] = "boil") },
  {
    name: "a cooking method the tables already have",
    rule: "cooking-state",
    field: "ingredients.chicken.cooking",
    breakIt: (c) => void Object.assign(ingredient(c, "chicken"), { state: "raw", cooking: "grill" }),
  },
  { name: "a food code that was not extracted", rule: "cooking-state", field: "composition.raw", breakIt: () => ({ compositionCodes: new Set(["11288", "12004", "01088", "06061", "17012"]) }) },
  { name: "a cooked code without a weight change rate", rule: "cooking-state", field: "composition.grill", breakIt: () => ({ ratedCodes: new Set() }) },
  { name: "a default amount off the grid", rule: "adjustment", field: "ingredients.chicken.adjust", breakIt: (c) => void (ingredient(c, "chicken")["grams"] = 155) },
  { name: "a count that differs from its measure", rule: "adjustment", field: "ingredients.egg.adjust", breakIt: (c) => void (ingredient(c, "egg")["measure"] = { unit: "piece", quantity: 3 }) },
  { name: "an adjustable vegetable", rule: "adjustment", field: "ingredients.cabbage.adjust", breakIt: (c) => void (ingredient(c, "cabbage")["adjust"] = { kind: "grams", min: 40, max: 80, step: 10 }) },
  {
    name: "a recipe with nothing to adjust",
    rule: "adjustment",
    field: "ingredients",
    breakIt: (c) => {
      for (const entry of c.recipe.ingredients) delete entry["adjust"];
      delete ingredient(c, "salt")["linkedTo"];
      c.recipe.sides = c.recipe.sides.filter((side) => side["key"] !== "rice");
      return undefined;
    },
  },
  {
    name: "a step note below the default amount",
    rule: "adjustment",
    field: "steps.cook.notes",
    breakIt: (c) => void (c.recipe.steps[0] = { ...c.recipe.steps[0], notes: [{ ingredient: "chicken", atLeastGrams: 100, text: text("大きいフライパンを使います。", "Use a larger pan.", "Usa una sartén más grande.") }] }),
  },
  { name: "a link to a fixed ingredient", rule: "link", field: "ingredients.salt.linkedTo", breakIt: (c) => void (ingredient(c, "salt")["linkedTo"] = "cabbage") },
  { name: "an ingredient in two sides", rule: "side", field: "sides", breakIt: (c) => void (c.recipe.sides[1] = { ...c.recipe.sides[1], ingredients: ["cabbage", "rice"] }) },
  { name: "a vegetable side the solver may remove", rule: "side", field: "sides.cabbage.solverMayRemove", breakIt: (c) => void (c.recipe.sides[1] = { ...c.recipe.sides[1], solverMayRemove: true }) },
  {
    name: "a substitution for a counted ingredient without bounds",
    rule: "substitution",
    field: "substitutions.chicken_egg.adjust",
    breakIt: (c) => void c.recipe.substitutions.push({ key: "chicken_egg", ingredient: "egg", food: "chicken", state: "grill", ratio: 1, note: text("鶏肉でも作れます。", "Works with chicken.", "También con pollo.") }),
  },
  { name: "a duplicate allergen", rule: "allergen", field: "allergens", breakIt: (c) => void (c.foods[0] = { ...c.foods[0], allergens: [{ allergen: "chicken", confidence: "contains" }, { allergen: "chicken", confidence: "may_contain" }] }) },
  { name: "chicken without a safety note", rule: "safety-note", field: "safetyNotes", breakIt: (c) => void (c.recipe.safetyNotes = []) },
  { name: "a main protein group of no main protein", rule: "protein-group", field: "mainProteinGroup", breakIt: (c) => void (c.recipe.mainProteinGroup = "pork") },
  { name: "a no_cook recipe with a cooked ingredient", rule: "tag", field: "ingredients.chicken", breakIt: (c) => void (c.recipe.tags = ["no_cook"]) },
  { name: "a glossary term translated differently", rule: "glossary", field: "steps.0.text.en", breakIt: (c) => void ((c.recipe.steps[0]?.["text"] as ReturnType<typeof text>).en = "Cook the chicken over moderate heat.") },
  { name: "a health claim", rule: "forbidden-expression", field: "texts.summary.en", breakIt: (c) => void (c.recipe.texts.summary.en = "Grilled chicken to burn fat.") },
  { name: "a content version in another format", rule: "version", field: "CONTENT_VERSION", breakIt: () => ({ contentVersion: "2026-10-18" }) },
];

describe("validateContent", () => {
  it("accepts the valid fixture", () => {
    expect(validateContent(input(fixture()))).toEqual([]);
  });

  it.each(cases.map((entry) => [entry.name, entry] as const))("reports %s", (_, entry) => {
    const content = fixture();
    const issues = validateContent(input(content, entry.breakIt(content)));
    expect(issues.map((issue) => `${issue.rule} ${issue.field}`)).toEqual([`${entry.rule} ${entry.field}`]);
  });

  it("has a failing fixture for every rule", () => {
    expect(new Set(cases.map((entry) => entry.rule))).toEqual(new Set(RULES));
  });

  it("names the file, the subject, the field, and the rule", () => {
    const content = fixture();
    content.recipe.mainProteinGroup = "pork";
    const [issue] = validateContent(input(content));
    expect(issue && formatIssue(issue)).toBe("content/recipes/test_recipe.ts › test_recipe › mainProteinGroup: no main protein food belongs to pork [protein-group]");
  });
});
