import { describe, expect, it } from "vitest";
import { fixtureCalc } from "../content/bundleFixtures";
import { defaultDraft, draftToRequest, withNumber, withPreset, type TargetsDraft } from "../views/targets/draft";
import {
  deleteSavedConditions,
  draftFromRecord,
  readSavedConditions,
  recordFromDraft,
  SAVED_CONDITIONS_STORAGE_KEY,
  SAVED_CONDITIONS_VERSION,
  writeSavedConditions,
  type SavedConditions,
} from "./savedConditions";

function memoryStorage(initial: Record<string, string> = {}) {
  const data = new Map(Object.entries(initial));
  return {
    data,
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => {
      data.set(key, value);
    },
    removeItem: (key: string) => {
      data.delete(key);
    },
  };
}

const throwingStorage = {
  getItem: (): string | null => {
    throw new Error("blocked");
  },
  setItem: (): void => {
    throw new Error("QuotaExceededError");
  },
  removeItem: (): void => {
    throw new Error("blocked");
  },
};

/** Every field of the form set away from its default. */
const fullDraft: TargetsDraft = {
  ...withNumber(withNumber(withNumber(withNumber(withPreset(defaultDraft(), "cut"), "kcalMax", "600"), "carbohydrateMin", "40"), "maxMinutes", "25"), "servings", "2"),
  effort: 2,
  cuisines: ["korean", "spanish"],
  equipmentMode: "choose",
  equipment: ["stove", "frying_pan"],
  required: [{ key: "group:chicken", foods: ["chicken_breast", "chicken_thigh"] }],
  excluded: [{ key: "potato", foods: ["potato"] }],
  allergens: ["egg", "wheat"],
};

const stored = (record: unknown) => memoryStorage({ [SAVED_CONDITIONS_STORAGE_KEY]: JSON.stringify(record) });

describe("saved conditions record", () => {
  it("round-trips every field of the form", () => {
    const storage = memoryStorage();
    expect(writeSavedConditions(recordFromDraft(fullDraft, true), storage)).toBe(true);
    const read = readSavedConditions(storage);
    if (read.kind !== "saved") throw new Error(`expected a record, got ${read.kind}`);
    const { draft, dropped } = draftFromRecord(read.record, fixtureCalc);
    expect(draft).toEqual(fullDraft);
    expect(dropped).toEqual([]);
  });

  it("restores the same search request as typing the same values", () => {
    const { draft } = draftFromRecord(recordFromDraft(fullDraft, true), fixtureCalc);
    expect(draftToRequest(draft)).toEqual(draftToRequest(fullDraft));
  });

  it("keeps numbers as typed, including invalid ones", () => {
    const typed = withNumber(withNumber(defaultDraft(), "proteinMin", "３５,5"), "fatMax", "abc");
    const { draft } = draftFromRecord(recordFromDraft(typed, false), fixtureCalc);
    expect(draft.numbers).toEqual(typed.numbers);
    expect(draft.edited).toBe(true);
  });

  it("recomputes the edited flag from the preset", () => {
    const { draft } = draftFromRecord(recordFromDraft(withPreset(defaultDraft(), "bulk"), false), fixtureCalc);
    expect(draft.preset).toBe("bulk");
    expect(draft.edited).toBe(false);
  });

  it("leaves allergens out unless the user chose to save them", () => {
    const record = recordFromDraft(fullDraft, false);
    expect(record).not.toHaveProperty("allergens");
    expect(draftFromRecord(record, fixtureCalc).draft.allergens).toEqual([]);
  });

  it("holds no locale and no display text", () => {
    const json = JSON.stringify(recordFromDraft(fullDraft, true));
    expect(json).not.toMatch(/"(ja|en|es|fr)"|locale/);
    expect(Object.keys(JSON.parse(json) as object).sort()).toEqual(
      ["allergens", "cuisines", "effort", "equipment", "equipmentMode", "excluded", "numbers", "preset", "required", "version"].sort(),
    );
  });

  it("drops values that no longer exist and reports them", () => {
    const record: SavedConditions = {
      ...recordFromDraft(fullDraft, true),
      cuisines: ["korean", "atlantean"],
      equipment: ["stove", "hearth"],
      required: ["group:chicken", "group:dragon", "unicorn_fillet"],
      excluded: ["potato", "group:beef"],
      allergens: ["egg", "unknown_allergen"],
    };
    const { draft, dropped } = draftFromRecord(record, fixtureCalc);
    expect(draft.cuisines).toEqual(["korean"]);
    expect(draft.equipment).toEqual(["stove"]);
    expect(draft.required.map((choice) => choice.key)).toEqual(["group:chicken"]);
    expect(draft.excluded.map((choice) => choice.key)).toEqual(["potato"]);
    expect(draft.allergens).toEqual(["egg"]);
    expect(dropped).toEqual([
      { kind: "cuisine", value: "atlantean" },
      { kind: "equipment", value: "hearth" },
      { kind: "food", value: "group:dragon" },
      { kind: "food", value: "unicorn_fillet" },
      // The fixture has no beef food, so the search offers no beef group.
      { kind: "food", value: "group:beef" },
      { kind: "allergen", value: "unknown_allergen" },
    ]);
  });

  it("expands a group key to the group's current foods", () => {
    const calc = { ...fixtureCalc, foods: fixtureCalc.foods.filter((food) => food.id !== "chicken_thigh") };
    const breast = fixtureCalc.foods.find((food) => food.id === "chicken_breast");
    if (breast === undefined) throw new Error("fixture without chicken_breast");
    const withThird = { ...fixtureCalc, foods: [...fixtureCalc.foods, { ...breast, id: "chicken_wing" }] };
    const record = recordFromDraft(fullDraft, false);
    expect(draftFromRecord(record, withThird).draft.required).toEqual([{ key: "group:chicken", foods: ["chicken_breast", "chicken_thigh", "chicken_wing"] }]);
    expect(draftFromRecord(record, calc).dropped).toEqual([{ kind: "food", value: "group:chicken" }]);
  });
});

describe("saved conditions storage", () => {
  it("reads nothing when no record exists", () => {
    expect(readSavedConditions(memoryStorage())).toEqual({ kind: "none" });
    expect(readSavedConditions(undefined)).toEqual({ kind: "none" });
  });

  it.each([
    ["text that is not JSON", "{not json"],
    ["a foreign value", JSON.stringify({ hello: "world" })],
    ["a record with a wrong field", JSON.stringify({ ...recordFromDraft(fullDraft, true), preset: "shred" })],
    ["a record with an oversized value", JSON.stringify({ ...recordFromDraft(fullDraft, true), numbers: { ...fullDraft.numbers, kcalMin: "9".repeat(65) } })],
    ["an older version", JSON.stringify({ ...recordFromDraft(fullDraft, true), version: 0 })],
  ])("deletes %s silently", (_, raw) => {
    const storage = memoryStorage({ [SAVED_CONDITIONS_STORAGE_KEY]: raw });
    expect(readSavedConditions(storage)).toEqual({ kind: "none" });
    expect(storage.data.has(SAVED_CONDITIONS_STORAGE_KEY)).toBe(false);
  });

  it("ignores and keeps a record from a newer version", () => {
    const storage = stored({ version: SAVED_CONDITIONS_VERSION + 1, anything: true });
    expect(readSavedConditions(storage)).toEqual({ kind: "unsupported" });
    expect(storage.data.has(SAVED_CONDITIONS_STORAGE_KEY)).toBe(true);
  });

  it("deletes the record", () => {
    const storage = stored(recordFromDraft(fullDraft, false));
    deleteSavedConditions(storage);
    expect(storage.data.size).toBe(0);
  });

  it("writes only its own key", () => {
    const storage = memoryStorage();
    writeSavedConditions(recordFromDraft(defaultDraft(), false), storage);
    expect([...storage.data.keys()]).toEqual([SAVED_CONDITIONS_STORAGE_KEY]);
  });

  it("survives storage that throws", () => {
    expect(readSavedConditions(throwingStorage)).toEqual({ kind: "none" });
    expect(writeSavedConditions(recordFromDraft(fullDraft, true), throwingStorage)).toBe(false);
    expect(writeSavedConditions(recordFromDraft(fullDraft, true), undefined)).toBe(false);
    expect(() => {
      deleteSavedConditions(throwingStorage);
    }).not.toThrow();
  });
});
