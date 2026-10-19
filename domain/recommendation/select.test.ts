import { describe, expect, it } from "vitest";
import { diversityGain, fnv1a, mix32, preferenceScore, seededKey, selectDiverse, type Attributes, type Selectable } from "./select.ts";

const item = (recipe: string, attributes: Attributes, preference = 0, relativeChange = 0): Selectable => ({ recipe, attributes, preference, relativeChange });
const chickenJp: Attributes = { proteinGroup: "chicken", cuisine: "japanese", method: "grill" };

describe("hashes", () => {
  it("match the FNV-1a reference values", () => {
    expect(fnv1a("")).toBe(0x811c9dc5);
    expect(fnv1a("a")).toBe(0xe40c292c);
    expect(fnv1a("foobar")).toBe(0xbf9cf968);
  });

  it("mix 32-bit values and keep zero", () => {
    expect(mix32(0)).toBe(0);
    expect(mix32(1)).not.toBe(1);
    expect(mix32(2 ** 32 - 1)).toBeGreaterThanOrEqual(0);
  });

  it("give a seeded key that depends on the seed and the ID only", () => {
    expect(seededKey(7, "tuna_tofu_bowl")).toBe(seededKey(7, "tuna_tofu_bowl"));
    expect(seededKey(7, "tuna_tofu_bowl")).not.toBe(seededKey(8, "tuna_tofu_bowl"));
    expect(seededKey(7, "tuna_tofu_bowl")).not.toBe(seededKey(7, "tortilla_espanola"));
  });
});

describe("preferenceScore", () => {
  it("adds one for a preferred cuisine and one for effort at most the preferred level", () => {
    const recipe = { cuisine: "japanese", effort: 2 } as const;
    expect(preferenceScore(recipe, { cuisines: [] })).toBe(0);
    expect(preferenceScore(recipe, { cuisines: ["japanese", "korean"] })).toBe(1);
    expect(preferenceScore(recipe, { cuisines: ["western"], effort: 2 })).toBe(1);
    expect(preferenceScore(recipe, { cuisines: ["japanese"], effort: 3 })).toBe(2);
    expect(preferenceScore(recipe, { cuisines: [], effort: 1 })).toBe(0);
  });
});

describe("diversityGain", () => {
  it("counts the attribute values not yet taken", () => {
    expect(diversityGain(chickenJp, [])).toBe(3);
    expect(diversityGain(chickenJp, [{ proteinGroup: "chicken", cuisine: "western", method: "pan" }])).toBe(2);
    expect(diversityGain(chickenJp, [{ ...chickenJp, method: "pan" }, { proteinGroup: "fish", cuisine: "chinese", method: "grill" }])).toBe(0);
  });
});

describe("selectDiverse", () => {
  const pool = [
    item("a_chicken_grill", chickenJp),
    item("b_chicken_pan", { ...chickenJp, method: "pan" }),
    item("c_fish_western", { proteinGroup: "fish", cuisine: "western", method: "pan" }),
    item("d_pork_chinese", { proteinGroup: "pork", cuisine: "chinese", method: "stir_fry" }),
  ];

  it("prefers new attribute values after the first pick", () => {
    // "a" comes first by preference; "c" and "d" each add three new values, "b" adds none after them.
    const preferred = [item("a_chicken_grill", chickenJp, 1), ...pool.slice(1)];
    const ids = selectDiverse(preferred, 4, [], 0).map((entry) => entry.recipe);
    expect(ids[0]).toBe("a_chicken_grill");
    expect(new Set(ids.slice(1, 3))).toEqual(new Set(["c_fish_western", "d_pork_chinese"]));
    expect(ids[3]).toBe("b_chicken_pan");
  });

  it("counts the taken attributes, for example the previous set", () => {
    const picks = selectDiverse(pool, 1, [chickenJp, { proteinGroup: "pork", cuisine: "chinese", method: "stir_fry" }], 0);
    expect(picks.map((entry) => entry.recipe)).toEqual(["c_fish_western"]);
  });

  it("breaks equal gains by preference, then by relative change", () => {
    const fish: Attributes = { proteinGroup: "fish", cuisine: "western", method: "pan" };
    const beef: Attributes = { proteinGroup: "beef", cuisine: "korean", method: "stir_fry" };
    expect(selectDiverse([item("x", fish, 0, 0), item("y", beef, 1, 0.5)], 1, [], 0)[0]?.recipe).toBe("y");
    expect(selectDiverse([item("x", fish, 1, 0.2), item("y", beef, 1, 0.1)], 1, [], 0)[0]?.recipe).toBe("y");
  });

  it("orders full ties by the seed, reproducibly, and differently for some seeds", () => {
    const ties = ["p", "q", "r", "s", "t"].map((id) => item(id, chickenJp));
    const order = (seed: number) => selectDiverse(ties, 5, [], seed).map((entry) => entry.recipe);
    expect(order(3)).toEqual(order(3));
    expect(new Set(Array.from({ length: 10 }, (_, seed) => order(seed).join())).size).toBeGreaterThan(1);
    for (let seed = 0; seed < 10; seed++) {
      const expected = ["p", "q", "r", "s", "t"].sort((a, b) => seededKey(seed, a) - seededKey(seed, b));
      expect(order(seed)).toEqual(expected);
    }
  });

  it("does not depend on the order of the pool", () => {
    expect(selectDiverse([...pool].reverse(), 4, [], 5)).toEqual(selectDiverse(pool, 4, [], 5));
  });

  it("returns fewer than the count when the pool is small", () => {
    expect(selectDiverse(pool.slice(0, 2), 5, [], 0)).toHaveLength(2);
    expect(selectDiverse([], 5, [], 0)).toEqual([]);
  });
});
