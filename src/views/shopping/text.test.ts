import { describe, expect, it } from "vitest";
import type { ShoppingEntry, ShoppingList } from "../../../domain/shopping/list";
import { createI18n } from "../../i18n/createI18n";
import { entrySummary, shoppingText } from "./text";

const names: Record<string, string> = { chicken_breast: "Chicken", egg: "Egg", soy_sauce: "Soy", vegetable_oil: "Oil", salt: "Salt" };
const foodName = (food: string) => names[food] ?? food;
const recipeName = (recipe: string) => (recipe === "a" ? "Recipe A" : "Recipe B");

const entries: ShoppingEntry[] = [
  { recipe: "a", state: { servings: 2, sidesOff: [], amounts: {}, substitutions: [] } },
  { recipe: "b", state: { servings: 1, sidesOff: ["rice"], amounts: { chicken: 160 }, substitutions: ["tofu"] } },
];

const list: ShoppingList = {
  items: [
    { key: "chicken_breast", food: "chicken_breast", frying: false, section: "ingredients", grams: 300, measure: undefined, contributions: [] },
    { key: "egg", food: "egg", frying: false, section: "ingredients", grams: 100, measure: { unit: "piece", quantity: 2 }, contributions: [] },
    { key: "soy_sauce", food: "soy_sauce", frying: false, section: "pantry", grams: 22.5, measure: { unit: "tbsp", quantity: 1.5 }, contributions: [] },
    { key: "vegetable_oil:frying", food: "vegetable_oil", frying: true, section: "pantry", grams: 500, measure: undefined, contributions: [] },
  ],
};

const text = (locale: "ja" | "en" | "es", checked: readonly string[] = []) => shoppingText({ t: createI18n(locale).t, locale, foodName, recipeName, entries, list, checked });

describe("copied text (docs/en/UI_DESIGN.md §3.7)", () => {
  it("lists the recipes, the unchecked items by section, and the basis note in Japanese", () => {
    expect(text("ja").split("\n")).toEqual([
      "買い物リスト（2品）",
      "- Recipe A（2人分）",
      "- Recipe B（1人分）",
      "",
      "[食材]",
      "- Chicken 300 g",
      "- Egg 100 g（2個）",
      "",
      "[手元にあるか確認するもの]",
      "- Soy 22.5 g（大さじ1と1/2）",
      "- 揚げ油：Oil 500 g",
      "",
      "分量は可食部（皮・骨・殻などを除く）または市販品の重さです。",
    ]);
  });

  it("formats numbers and measures per locale in English and Spanish", () => {
    const english = text("en");
    expect(english).toContain("Shopping list (2 recipes)\n- Recipe A (2 servings)");
    expect(english).toContain("- Egg 100 g (2)");
    expect(english).toContain("- Soy 22.5 g (1 1/2 tbsp)");
    expect(english).toContain("- Frying oil: Oil 500 g");
    const spanish = text("es");
    expect(spanish).toContain("Lista de la compra (2 recetas)\n- Recipe A (2 raciones)");
    expect(spanish).toContain("- Soy 22,5 g (1 y 1/2 cucharadas)");
    expect(spanish).toContain("[Comprueba si ya lo tienes]");
  });

  it("leaves out checked items and sections without unchecked items", () => {
    const english = text("en", ["chicken_breast", "egg"]);
    expect(english).not.toContain("[Ingredients]");
    expect(english).not.toContain("Chicken");
    expect(english).toContain("[Check whether you have]");
  });
});

describe("recipe summary", () => {
  it("names the servings and the changes", () => {
    const { t } = createI18n("en");
    expect(entrySummary(t, entries[0] as ShoppingEntry)).toBe("2 servings");
    expect(entrySummary(t, entries[1] as ShoppingEntry)).toBe("1 serving, amounts adjusted, 1 side off, 1 substitution");
  });
});
