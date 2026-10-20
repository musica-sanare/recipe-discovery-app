import { describe, expect, it } from "vitest";
import type { ReasonData } from "../../../domain/recommendation/reasons";
import { orderInPlace } from "../../state/reducer";
import { cardReasons, gapReasons } from "./display";

describe("card reason line (ADR-030 D12)", () => {
  const all: ReasonData[] = [
    { code: "meets_with_adjustment" },
    { code: "within_effort" },
    { code: "quick", minutes: 15 },
    { code: "uses_required_foods", foods: ["egg"] },
    { code: "matches_cuisine" },
    { code: "lowest_among_candidates", nutrient: "FAT-", value: 8 },
  ];

  it("shows at most two reasons in the decided order, without the required foods", () => {
    expect(cardReasons(all).map((reason) => reason.code)).toEqual(["lowest_among_candidates", "matches_cuisine"]);
    expect(cardReasons(all.filter((reason) => reason.code !== "lowest_among_candidates")).map((reason) => reason.code)).toEqual(["matches_cuisine", "quick"]);
  });

  it("falls back to the fit reason", () => {
    expect(cardReasons([{ code: "meets_all_targets" }, { code: "uses_required_foods", foods: ["egg"] }])).toEqual([{ code: "meets_all_targets" }]);
  });

  it("lists every gap for close alternatives", () => {
    const gaps: ReasonData[] = [
      { code: "near_target", target: "fat", gap: 1.2 },
      { code: "range_straddles", target: "kcal" },
      { code: "quick", minutes: 10 },
      { code: "unknown_value", target: "carbohydrate" },
    ];
    expect(gapReasons(gaps).map((reason) => reason.code)).toEqual(["near_target", "range_straddles", "unknown_value"]);
  });
});

describe("orderInPlace", () => {
  it("puts the new recipe in the removed card's place", () => {
    expect(orderInPlace(["a", "b", "c", "d"], ["a", "c", "d", "x"])).toEqual(["a", "x", "c", "d"]);
  });

  it("drops a card that has no replacement and appends extra new ones", () => {
    expect(orderInPlace(["a", "b", "c"], ["a", "c"])).toEqual(["a", "c"]);
    expect(orderInPlace(["a"], ["a", "y", "z"])).toEqual(["a", "y", "z"]);
  });
});
