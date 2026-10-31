import { describe, expect, it } from "vitest";
import { fixtureCalc } from "../../content/bundleFixtures";
import { defaultDraft } from "./draft";
import { applySuggestion, choiceOf, touchesAdvanced } from "./freeText";

describe("conditions read from free text", () => {
  it("keeps a whole protein group as a group choice and lists other sets", () => {
    expect(choiceOf(["chicken_thigh", "chicken_breast"], fixtureCalc)).toEqual({ key: "group:chicken", foods: ["chicken_breast", "chicken_thigh"] });
    expect(choiceOf(["potato"], fixtureCalc)).toEqual({ key: "potato", foods: ["potato"] });
    expect(choiceOf(["potato", "egg"], fixtureCalc)).toEqual({ key: "any:egg+potato", foods: ["egg", "potato"] });
  });

  it("adds foods and cuisines, replaces the time and equipment, and leaves targets and allergens alone", () => {
    const draft = { ...defaultDraft(), allergens: ["egg" as const], cuisines: ["japanese" as const], required: [{ key: "potato", foods: ["potato"] }] };
    const next = applySuggestion(draft, { requiredFoods: [["potato"], ["chicken_breast", "chicken_thigh"]], excludedFoods: ["egg"], maxMinutes: 20, equipment: ["microwave"], cuisines: ["korean"] }, fixtureCalc);
    expect(next.required).toEqual([
      { key: "potato", foods: ["potato"] },
      { key: "group:chicken", foods: ["chicken_breast", "chicken_thigh"] },
    ]);
    expect(next.excluded).toEqual([{ key: "egg", foods: ["egg"] }]);
    expect(next.numbers).toEqual({ ...draft.numbers, maxMinutes: "20" });
    expect(next).toMatchObject({ equipmentMode: "choose", equipment: ["microwave"], cuisines: ["japanese", "korean"], allergens: ["egg"], preset: draft.preset, edited: false });
  });

  it("keeps the time and equipment when the text does not state them", () => {
    const draft = { ...defaultDraft(), numbers: { ...defaultDraft().numbers, maxMinutes: "45" }, equipmentMode: "microwave_only" as const };
    const next = applySuggestion(draft, { requiredFoods: [], excludedFoods: ["egg"], cuisines: [] }, fixtureCalc);
    expect(next.numbers.maxMinutes).toBe("45");
    expect(next.equipmentMode).toBe("microwave_only");
    expect(applySuggestion(next, { requiredFoods: [], excludedFoods: ["egg"], cuisines: [] }, fixtureCalc).excluded).toEqual([{ key: "egg", foods: ["egg"] }]);
  });

  it("opens the advanced section only for conditions shown there", () => {
    expect(touchesAdvanced({ requiredFoods: [], excludedFoods: [], maxMinutes: 20, cuisines: [] })).toBe(false);
    expect(touchesAdvanced({ requiredFoods: [], excludedFoods: [], cuisines: ["korean"] })).toBe(true);
  });
});
