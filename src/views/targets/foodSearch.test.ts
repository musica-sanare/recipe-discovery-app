import { describe, expect, it } from "vitest";
import { fixtureCalc, fixtureText } from "../../content/bundleFixtures";
import { foodOptions, normalizeForSearch, searchFoods } from "./foodSearch";

const label = (group: string) => `group ${group}`;

describe("normalizeForSearch", () => {
  it("folds katakana, width, and case in Japanese", () => {
    expect(normalizeForSearch("ja", "ジャガイモ")).toBe("じゃがいも");
    expect(normalizeForSearch("ja", "ＴＯＦＵ")).toBe("tofu");
  });

  it("folds accents and case in Spanish but not in English", () => {
    expect(normalizeForSearch("es", "Plátano")).toBe("platano");
    expect(normalizeForSearch("en", "Jalapeño")).toBe("jalapeño");
  });
});

describe("searchFoods", () => {
  const options = (locale: "ja" | "en" | "es") => foodOptions(fixtureCalc, fixtureText(locale), label);

  it("offers protein groups with more than one food, resolved to food IDs", () => {
    const groups = options("en").filter((option) => option.kind === "group");
    expect(groups.map((option) => [option.group, option.foods])).toEqual([["chicken", ["chicken_breast", "chicken_thigh"]]]);
  });

  it("matches names and aliases in each locale, groups first", () => {
    expect(searchFoods(options("ja"), "ja", "ジャガ", new Set()).map((option) => option.key)).toEqual(["potato"]);
    expect(searchFoods(options("ja"), "ja", "とり", new Set()).map((option) => option.key)).toEqual(["group:chicken", "chicken_breast"]);
    expect(searchFoods(options("es"), "es", "papa", new Set()).map((option) => option.key)).toEqual(["potato"]);
    expect(searchFoods(options("en"), "en", "chicken", new Set()).map((option) => option.key)).toEqual(["group:chicken", "chicken_breast", "chicken_thigh"]);
  });

  it("leaves out chosen options and returns nothing for an unsupported ingredient", () => {
    expect(searchFoods(options("en"), "en", "chicken", new Set(["group:chicken", "chicken_thigh"])).map((option) => option.key)).toEqual(["chicken_breast"]);
    expect(searchFoods(options("en"), "en", "lobster", new Set())).toEqual([]);
    expect(searchFoods(options("en"), "en", "  ", new Set())).toEqual([]);
  });
});
