import { describe, expect, it } from "vitest";
import { SUPPORTED_LOCALES } from "../../shared/locales";
import * as codes from "./engineCodes";
import { resources } from "./resources";

type Tree = { readonly [key: string]: string | Tree };

function lookup(tree: Tree, path: readonly string[]): string | Tree | undefined {
  let node: string | Tree | undefined = tree;
  for (const key of path) {
    if (node === undefined || typeof node === "string") return undefined;
    node = node[key];
  }
  return node;
}

/** Catalog paths that must exist for each engine code (plural keys need both forms). */
function requiredPaths(): string[][] {
  const each = (prefix: readonly string[], list: readonly (string | number)[]) => list.map((code) => [...prefix, String(code)]);
  const plural = (prefix: readonly string[], list: readonly string[]) => list.flatMap((code) => [[...prefix, `${code}_one`], [...prefix, `${code}_other`]]);
  return [
    ...each(["inputError"], codes.INPUT_ERROR_CODES),
    ...each(["inputField"], codes.INPUT_FIELDS),
    ...codes.CONTRADICTION_CODES.flatMap((code) => each(["contradiction", code], [...codes.CONTRADICTION_SEVERITIES, "basis"])),
    ...each(["status"], codes.NUTRIENT_STATUSES),
    ...each(["tier"], codes.TIERS),
    ...each(["target"], codes.TARGET_KEYS),
    ...each(["nutrient"], codes.NUTRIENTS),
    ...each(["reason"], codes.REASON_CODES),
    ...each(["reason", "near_target"], ["below", "above"]),
    ...each(["reason", "misses_target"], ["below", "above"]),
    ...each(["reason", "new_attribute"], codes.ATTRIBUTES),
    ...plural(["exclusion"], codes.CONSTRAINTS),
    ...each(["relaxation"], codes.RELAXATIONS),
    ...each(["uncertainty", "class"], codes.UNCERTAINTY_CLASSES),
    ...each(["uncertainty", "reason"], codes.UNCERTAINTY_REASONS),
    ...each(["assumption"], codes.ASSUMPTION_CODES),
    ...each(["preset"], codes.PRESETS),
    ...each(["allergen", "names"], codes.ALLERGENS),
    ...each(["allergen", "confidence"], codes.ALLERGEN_CONFIDENCES),
    ...each(["cuisine"], codes.CUISINES),
    ...each(["equipment"], codes.EQUIPMENT),
    ...each(["proteinGroup"], codes.PROTEIN_GROUPS),
    ...each(["methodFamily"], codes.METHOD_FAMILIES),
    ...each(["effort"], codes.EFFORT_LEVELS),
    ...plural(["unit", "household"], codes.HOUSEHOLD_UNITS),
    ...each(["foodState"], codes.FOOD_STATES),
    ...each(["detail", "notCounted"], codes.NOT_COUNTED),
  ];
}

describe("engine codes in the UI catalogs", () => {
  it.each(SUPPORTED_LOCALES)("%s has an entry for every engine code", (locale) => {
    const catalog: Tree = resources[locale].translation;
    const missing = requiredPaths()
      .filter((path) => lookup(catalog, path) === undefined)
      .map((path) => path.join("."));
    expect(missing).toEqual([]);
  });

  it.each(["en", "es", "fr"] as const)("%s shows the number alone for pieces (ADR-026)", (locale) => {
    const household = resources[locale].translation.unit.household;
    expect([household.piece_one, household.piece_other]).toEqual(["{{amount}}", "{{amount}}"]);
  });

  it.each(SUPPORTED_LOCALES)("%s keeps the MEXT attribution wording in Japanese", (locale) => {
    expect(resources[locale].translation.attribution.source).toBe("日本食品標準成分表（八訂）増補2023年から引用");
  });
});
