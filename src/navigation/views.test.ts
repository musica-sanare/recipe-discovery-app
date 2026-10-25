import { describe, expect, it } from "vitest";
import { historyState, pathFor, viewFromLocation } from "./views";

describe("views and URLs (ADR-030 D2)", () => {
  it("gives only the recipe detail and the about page their own paths", () => {
    expect(pathFor({ name: "detail", recipe: "tuna_tofu_bowl" })).toBe("/recipes/tuna_tofu_bowl");
    expect(pathFor({ name: "about" })).toBe("/about");
    expect(["targets", "candidates", "comparison", "shoppingList"].map((name) => pathFor({ name } as never))).toEqual(["/", "/", "/", "/"]);
  });

  it("reads the view from the path and the history entry", () => {
    expect(viewFromLocation("/recipes/tuna_tofu_bowl", null)).toEqual({ name: "detail", recipe: "tuna_tofu_bowl" });
    expect(viewFromLocation("/recipes/tuna_tofu_bowl/", { view: "candidates" })).toEqual({ name: "detail", recipe: "tuna_tofu_bowl" });
    expect(viewFromLocation("/", { view: "comparison" })).toEqual({ name: "comparison" });
    expect(viewFromLocation("/", { view: "shoppingList" })).toEqual({ name: "shoppingList" });
    expect(viewFromLocation("/", { view: "detail" })).toEqual({ name: "targets" });
    expect(viewFromLocation("/", "candidates")).toEqual({ name: "targets" });
    expect(viewFromLocation("/recipes/Bad-ID", null)).toEqual({ name: "targets" });
    expect(viewFromLocation("/unknown", null)).toEqual({ name: "targets" });
    expect(viewFromLocation("/about", null)).toEqual({ name: "about" });
    expect(viewFromLocation("/about/", { view: "candidates" })).toEqual({ name: "about" });
    expect(viewFromLocation("/about/x", null)).toEqual({ name: "targets" });
  });

  it("stores the view name only", () => {
    expect(historyState({ name: "detail", recipe: "x" })).toEqual({ view: "detail" });
  });
});
