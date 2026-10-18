/**
 * Selects foods and nutrient columns from the rows of the MEXT whole-table sheet.
 * Columns are located by the component identifier row (for example `ENERC_KCAL`)
 * and the Japanese header labels, not by fixed positions.
 */
import { NUTRIENT_IDS, type CompositionFood, type NutrientId } from "../../shared/composition.ts";
import { parseCompositionValue } from "./notation.ts";

const compact = (text: string) => text.replace(/\s/gu, "");

interface Layout {
  readonly firstDataRow: number;
  readonly code: number;
  readonly name: number;
  readonly refuse: number;
  readonly nutrients: Readonly<Record<NutrientId, number>>;
}

function findColumn(rows: readonly (readonly string[])[], label: string, lastRow: number): number {
  for (const row of rows.slice(0, lastRow + 1)) {
    const index = row.findIndex((cell) => compact(cell) === label);
    if (index >= 0) {
      return index;
    }
  }
  throw new Error(`Header not found: ${label}`);
}

export function detectLayout(rows: readonly (readonly string[])[]): Layout {
  const idRow = rows.findIndex((row) => row.some((cell) => cell.trim() === "ENERC_KCAL"));
  const ids = rows[idRow];
  if (idRow < 0 || !ids) {
    throw new Error("Component identifier row not found");
  }
  const byId = (id: string) => {
    const index = ids.findIndex((cell) => cell.trim() === id);
    if (index < 0) {
      throw new Error(`Component identifier not found: ${id}`);
    }
    return index;
  };
  const nutrients = Object.fromEntries(NUTRIENT_IDS.map((id) => [id, byId(id)])) as Record<NutrientId, number>;
  return {
    firstDataRow: idRow + 1,
    code: findColumn(rows, "食品番号", idRow),
    name: findColumn(rows, "食品名", idRow),
    refuse: byId("REFUSE"),
    nutrients,
  };
}

export interface FoodRow {
  readonly code: string;
  readonly nameJa: string;
}

export function listFoods(rows: readonly (readonly string[])[]): FoodRow[] {
  const layout = detectLayout(rows);
  return rows
    .slice(layout.firstDataRow)
    .map((row) => ({ code: (row[layout.code] ?? "").trim(), nameJa: (row[layout.name] ?? "").trim() }))
    .filter((food) => /^\d{5}$/.test(food.code));
}

export function extractFoods(rows: readonly (readonly string[])[], codes: readonly string[]): CompositionFood[] {
  const layout = detectLayout(rows);
  const wanted = new Set(codes);
  const foods = new Map<string, CompositionFood>();
  for (const row of rows.slice(layout.firstDataRow)) {
    const code = (row[layout.code] ?? "").trim();
    if (!wanted.has(code)) {
      continue;
    }
    if (foods.has(code)) {
      throw new Error(`Duplicate food code: ${code}`);
    }
    const cell = (index: number) => {
      try {
        return parseCompositionValue(row[index] ?? "");
      } catch (error) {
        throw new Error(`Food ${code}, column ${String(index)}: ${error instanceof Error ? error.message : String(error)}`, { cause: error });
      }
    };
    foods.set(code, {
      code,
      nameJa: (row[layout.name] ?? "").replace(/\u3000/g, " ").trim(),
      refuse: cell(layout.refuse),
      nutrients: Object.fromEntries(NUTRIENT_IDS.map((id) => [id, cell(layout.nutrients[id])])) as CompositionFood["nutrients"],
    });
  }
  const missing = codes.filter((code) => !foods.has(code));
  if (missing.length > 0) {
    throw new Error(`Food codes not found in the workbook: ${missing.join(", ")}`);
  }
  // Sorted output keeps diffs stable for review.
  return [...foods.values()].sort((a, b) => (a.code < b.code ? -1 : 1));
}
