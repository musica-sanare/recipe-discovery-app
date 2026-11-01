/**
 * Opt-in saved targets and conditions (ADR-036): one versioned `localStorage` record,
 * written only after the user turns saving on. The record is locale-free: numbers as
 * typed, food choices by key, and codes. Every storage failure is ignored.
 */
import * as z from "zod/mini";
import type { CalcBundle } from "../../shared/bundle";
import { ALLERGENS, CUISINES, EQUIPMENT, PROTEIN_GROUPS, type Allergen, type Cuisine, type Equipment, type ProteinGroup } from "../../shared/content";
import { defaultDraft, NUMBER_FIELDS, withNumber, type EquipmentMode, type FoodChoice, type NumberField, type TargetsDraft } from "../views/targets/draft";

export const SAVED_CONDITIONS_STORAGE_KEY = "recipe-discovery.conditions";
export const SAVED_CONDITIONS_VERSION = 1;

const GROUP_PREFIX = "group:";
const MAX_TEXT = 64;
const MAX_ITEMS = 100;

const text = z.string().check(z.maxLength(MAX_TEXT));
const list = z.array(text).check(z.maxLength(MAX_ITEMS));

const versionSchema = z.object({ version: z.number().check(z.int()) });

/**
 * Cuisines, equipment, and allergens are plain strings here, so that a value removed by a
 * later release is dropped with a notice instead of invalidating the whole record.
 */
const savedConditionsSchema = z.object({
  version: z.literal(SAVED_CONDITIONS_VERSION),
  preset: z.enum(["cut", "maintain", "bulk"]),
  numbers: z.object(Object.fromEntries(NUMBER_FIELDS.map((field) => [field, text])) as Record<NumberField, typeof text>),
  effort: z.optional(z.union([z.literal(1), z.literal(2), z.literal(3)])),
  cuisines: list,
  equipmentMode: z.enum(["no_limit", "microwave_only", "choose"]),
  equipment: list,
  required: list,
  excluded: list,
  /** Present only when the user also chose to save allergens. */
  allergens: z.optional(list),
});

export type SavedConditions = z.infer<typeof savedConditionsSchema>;

export type SavedConditionsRead =
  | { readonly kind: "none" }
  | { readonly kind: "saved"; readonly record: SavedConditions }
  /** A record from a newer release (after a rollback): ignored and kept. */
  | { readonly kind: "unsupported" };

export interface DroppedItem {
  readonly kind: "food" | "cuisine" | "equipment" | "allergen";
  readonly value: string;
}

type ConditionsStorage = Pick<Storage, "getItem" | "setItem" | "removeItem">;

function browserStorage(): ConditionsStorage | undefined {
  try {
    return globalThis.localStorage;
  } catch {
    return undefined;
  }
}

/** An invalid record is deleted without a notice (ADR-036 D5). */
export function readSavedConditions(storage: ConditionsStorage | undefined = browserStorage()): SavedConditionsRead {
  let raw: string | null | undefined;
  try {
    raw = storage?.getItem(SAVED_CONDITIONS_STORAGE_KEY);
  } catch {
    return { kind: "none" };
  }
  if (raw === null || raw === undefined) return { kind: "none" };

  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    value = undefined;
  }
  const version = versionSchema.safeParse(value);
  if (version.success && version.data.version > SAVED_CONDITIONS_VERSION) return { kind: "unsupported" };
  const record = savedConditionsSchema.safeParse(value);
  if (record.success) return { kind: "saved", record: record.data };
  deleteSavedConditions(storage);
  return { kind: "none" };
}

/** Returns false when the browser refused the write (blocked storage, quota). */
export function writeSavedConditions(record: SavedConditions, storage: ConditionsStorage | undefined = browserStorage()): boolean {
  if (storage === undefined) return false;
  try {
    storage.setItem(SAVED_CONDITIONS_STORAGE_KEY, JSON.stringify(record));
    return true;
  } catch {
    return false;
  }
}

export function deleteSavedConditions(storage: ConditionsStorage | undefined = browserStorage()): void {
  try {
    storage?.removeItem(SAVED_CONDITIONS_STORAGE_KEY);
  } catch {
    // Nothing more can be done; the next read deletes or ignores the record again.
  }
}

export function recordFromDraft(draft: TargetsDraft, includeAllergens: boolean): SavedConditions {
  return {
    version: SAVED_CONDITIONS_VERSION,
    preset: draft.preset,
    numbers: { ...draft.numbers },
    ...(draft.effort === undefined ? {} : { effort: draft.effort }),
    cuisines: [...draft.cuisines],
    equipmentMode: draft.equipmentMode,
    equipment: [...draft.equipment],
    required: draft.required.map((choice) => choice.key),
    excluded: draft.excluded.map((choice) => choice.key),
    ...(includeAllergens ? { allergens: [...draft.allergens] } : {}),
  };
}

/** Writes the form as typed; false when the browser refused the write. */
export function saveDraft(draft: TargetsDraft, allergens: boolean, storage: ConditionsStorage | undefined = browserStorage()): boolean {
  return writeSavedConditions(recordFromDraft(draft, allergens), storage);
}

function isOneOf<T extends string>(values: readonly T[], value: string): value is T {
  return (values as readonly string[]).includes(value);
}

/** Group choices as offered by the ingredient search: groups with more than one food. */
function groupFoods(calc: CalcBundle): ReadonlyMap<ProteinGroup, readonly string[]> {
  const groups = new Map<ProteinGroup, string[]>();
  for (const food of calc.foods) {
    if (food.proteinGroup !== undefined) groups.set(food.proteinGroup, [...(groups.get(food.proteinGroup) ?? []), food.id]);
  }
  return new Map([...groups].filter(([, ids]) => ids.length > 1).map(([group, ids]) => [group, [...ids].sort()]));
}

/**
 * The form for a saved record against the current content. Values that no longer exist
 * are left out and reported; a group key is expanded to the group's current foods.
 */
export function draftFromRecord(record: SavedConditions, calc: CalcBundle): { readonly draft: TargetsDraft; readonly dropped: readonly DroppedItem[] } {
  const dropped: DroppedItem[] = [];
  const known = <T extends string>(kind: DroppedItem["kind"], values: readonly T[], items: readonly string[]): T[] =>
    items.flatMap((value) => {
      if (isOneOf(values, value)) return [value];
      dropped.push({ kind, value });
      return [];
    });

  const foodIds = new Set(calc.foods.map((food) => food.id));
  const groups = groupFoods(calc);
  const choices = (keys: readonly string[]): FoodChoice[] =>
    keys.flatMap((key) => {
      const group = key.startsWith(GROUP_PREFIX) ? key.slice(GROUP_PREFIX.length) : undefined;
      const foods = group === undefined ? (foodIds.has(key) ? [key] : undefined) : isOneOf(PROTEIN_GROUPS, group) ? groups.get(group) : undefined;
      if (foods !== undefined) return [{ key, foods }];
      dropped.push({ kind: "food", value: key });
      return [];
    });

  const withNumbers = NUMBER_FIELDS.reduce((draft, field) => withNumber(draft, field, record.numbers[field]), defaultDraft(record.preset));
  const equipmentMode: EquipmentMode = record.equipmentMode;
  const draft: TargetsDraft = {
    ...withNumbers,
    effort: record.effort,
    cuisines: known<Cuisine>("cuisine", CUISINES, record.cuisines),
    equipmentMode,
    equipment: known<Equipment>("equipment", EQUIPMENT, record.equipment),
    required: choices(record.required),
    excluded: choices(record.excluded),
    allergens: known<Allergen>("allergen", ALLERGENS, record.allergens ?? []),
  };
  return { draft, dropped };
}
