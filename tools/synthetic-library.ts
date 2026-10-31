/**
 * A synthetic, larger recipe library for speed measurements only (Phase 9 Stage 9.2,
 * ADR-030 D10): recipes spread evenly over the library are added again under new IDs,
 * so the average grid size stays close to the library's. It exists only in memory or in
 * a test's network stub and is never published.
 */
import type { CalcBundle, TextBundle } from "../shared/bundle.ts";

/** The library size used for the measurements. */
export const SYNTHETIC_TOTAL = 180;

const copyId = (id: string) => `${id}_copy`;

/** IDs of the recipes copied to reach `total`: every (n / extra)-th recipe, starting at the first. */
export function copiedRecipeIds(ids: readonly string[], total: number = SYNTHETIC_TOTAL): string[] {
  const extra = total - ids.length;
  if (extra <= 0 || extra > ids.length) throw new Error(`Cannot reach ${String(total)} recipes from ${String(ids.length)}`);
  return Array.from({ length: extra }, (_, index) => ids[Math.floor((index * ids.length) / extra)] ?? "");
}

export function syntheticCalc(calc: CalcBundle, total: number = SYNTHETIC_TOTAL): CalcBundle {
  const copied = new Set(copiedRecipeIds(calc.recipes.map((recipe) => recipe.id), total));
  const copies = calc.recipes.filter((recipe) => copied.has(recipe.id)).map((recipe) => ({ ...recipe, id: copyId(recipe.id) }));
  return { ...calc, recipes: [...calc.recipes, ...copies] };
}

/** The text bundle matching `syntheticCalc`: each copy reuses the texts of its original. */
export function syntheticText(text: TextBundle, calc: CalcBundle, total: number = SYNTHETIC_TOTAL): TextBundle {
  const recipes = { ...text.recipes };
  for (const id of copiedRecipeIds(calc.recipes.map((recipe) => recipe.id), total)) {
    const texts = text.recipes[id];
    if (texts) recipes[copyId(id)] = texts;
  }
  return { ...text, recipes };
}
