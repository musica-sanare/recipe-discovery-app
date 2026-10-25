/**
 * Extracted food composition data (docs/en/DATA_SOURCES.md, docs/en/NUTRITION_CALCULATION.md §3).
 * Component identifiers are kept as published by MEXT so every value stays traceable.
 */
import * as z from "zod/mini";

export const NUTRIENT_IDS = [
  "ENERC_KCAL",
  "PROT-",
  "PROTCAA",
  "FAT-",
  "FATNLEA",
  "CHOAVLDF-",
  "CHOCDF-",
  "FIB-",
  "NACL_EQ",
] as const;

export type NutrientId = (typeof NUTRIENT_IDS)[number];

/**
 * How a source value was written: `measured` (plain number), `zero` ("0"), `trace` ("Tr"),
 * `estimated` ("(x)"), `estimated_zero` ("(0)"), `estimated_trace` ("(Tr)"), `unmeasured` ("-").
 */
export const NOTATIONS = ["measured", "zero", "trace", "estimated", "estimated_zero", "estimated_trace", "unmeasured"] as const;

export type Notation = (typeof NOTATIONS)[number];

export const compositionValueSchema = z.union([
  z.object({ value: z.number(), notation: z.enum(["measured", "zero", "trace", "estimated", "estimated_zero", "estimated_trace"]) }),
  z.object({ value: z.null(), notation: z.literal("unmeasured") }),
]);

export type CompositionValue = z.infer<typeof compositionValueSchema>;

export const compositionSourceSchema = z.object({
  title: z.string(),
  url: z.string(),
  workbookUpdated: z.string(),
  sha256: z.string(),
  sheet: z.string(),
});

export type CompositionSource = z.infer<typeof compositionSourceSchema>;

export const compositionFoodSchema = z.object({
  code: z.string().check(z.regex(/^\d{5}$/)),
  nameJa: z.string(),
  refuse: compositionValueSchema,
  nutrients: z.record(z.enum(NUTRIENT_IDS), compositionValueSchema),
});

export type CompositionFood = z.infer<typeof compositionFoodSchema>;

export const compositionSubsetSchema = z.object({
  source: compositionSourceSchema,
  /** Sorted by food code; codes are unique. */
  foods: z.array(compositionFoodSchema).check(
    z.refine((foods) => foods.every((food, i) => i === 0 || (foods[i - 1]?.code ?? "") < food.code), "Foods must be sorted by unique code"),
  ),
});

export type CompositionSubset = z.infer<typeof compositionSubsetSchema>;
