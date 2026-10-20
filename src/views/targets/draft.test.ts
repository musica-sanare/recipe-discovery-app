import { describe, expect, it } from "vitest";
import { presetTargets } from "../../../domain/recommendation/validate";
import { defaultDraft, draftToRequest, parseNumber, stepped, withNumber, withPreset, type TargetsDraft } from "./draft";

describe("parseNumber", () => {
  it.each([
    ["35", 35],
    ["35.5", 35.5],
    ["35,5", 35.5],
    ["３５", 35],
    [" 600 ", 600],
    ["", undefined],
    ["   ", undefined],
  ] as const)("%j → %s", (text, expected) => {
    expect(parseNumber(text)).toBe(expected);
  });

  it.each(["abc", "1e3", "12a", "1.2.3", "--1"])("%j is not a number", (text) => {
    expect(parseNumber(text)).toBeNaN();
  });
});

describe("presets", () => {
  it("fill the four target fields with the ADR-025 values and mark them unedited", () => {
    for (const preset of ["cut", "maintain", "bulk"] as const) {
      const request = draftToRequest(withPreset(defaultDraft(), preset));
      expect(request.targets).toEqual(presetTargets(preset));
    }
  });

  it("are marked edited when a target differs and unedited again when it is restored", () => {
    const edited = withNumber(defaultDraft("cut"), "proteinMin", "40");
    expect(edited.edited).toBe(true);
    expect(withNumber(edited, "proteinMin", "35").edited).toBe(false);
    expect(withNumber(defaultDraft("cut"), "maxMinutes", "20").edited).toBe(false);
  });
});

describe("steppers", () => {
  it("move by one step and stay within INPUT_LIMITS", () => {
    expect(stepped("600", "kcalMax", 1)).toBe("610");
    expect(stepped("35", "proteinMin", -1)).toBe("34");
    expect(stepped("2000", "kcalMax", 1)).toBe("2000");
    expect(stepped("0", "fatMax", -1)).toBe("0");
    expect(stepped("", "maxMinutes", 1)).toBe("5");
    expect(stepped("abc", "servings", -1)).toBe("20");
    expect(stepped("33", "maxMinutes", 1)).toBe("40");
  });
});

describe("draftToRequest", () => {
  const draft: TargetsDraft = {
    ...defaultDraft("cut"),
    numbers: { kcalMin: "500", kcalMax: "650", proteinMin: "35,5", fatMax: "", carbohydrateMin: "60", carbohydrateMax: "", maxMinutes: "20", servings: "2" },
    effort: 2,
    cuisines: ["japanese", "spanish"],
    equipmentMode: "choose",
    equipment: ["stove", "frying_pan"],
    required: [{ key: "group:chicken", foods: ["chicken_breast", "chicken_thigh"] }, { key: "egg", foods: ["egg"] }],
    excluded: [{ key: "group:pork", foods: ["pork_fillet", "pork_leg"] }, { key: "potato", foods: ["potato"] }],
    allergens: ["wheat", "milk"],
  };

  it("passes every value through unchanged", () => {
    expect(draftToRequest(draft)).toEqual({
      targets: { kcal: { min: 500, max: 650 }, proteinMin: 35.5, carbohydrate: { min: 60, max: 400 } },
      servings: 2,
      conditions: {
        maxMinutes: 20,
        equipment: ["stove", "frying_pan"],
        excludedFoods: ["pork_fillet", "pork_leg", "potato"],
        excludedAllergens: ["wheat", "milk"],
        requiredFoods: [["chicken_breast", "chicken_thigh"], ["egg"]],
        effort: 2,
        cuisines: ["japanese", "spanish"],
      },
    });
  });

  it("maps the equipment modes", () => {
    expect(draftToRequest({ ...draft, equipmentMode: "no_limit" }).conditions.equipment).toBeUndefined();
    expect(draftToRequest({ ...draft, equipmentMode: "microwave_only" }).conditions.equipment).toEqual(["microwave"]);
  });

  it("leaves invalid numbers as NaN for the engine to report", () => {
    const request = draftToRequest({ ...draft, numbers: { ...draft.numbers, kcalMin: "", fatMax: "x" } });
    expect(request.targets.kcal.min).toBeNaN();
    expect(request.targets.fatMax).toBeNaN();
  });
});
