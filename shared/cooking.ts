/**
 * Cooking data transcribed from the MEXT explanation PDF, tables 12-14
 * (docs/DATA_SOURCES.md "Cooking tables", docs/NUTRITION_CALCULATION.md §5-6).
 * `rawCode` pairs each cooked food with its raw counterpart; the pairing is this
 * project's, the numbers are MEXT's.
 */
import * as z from "zod/mini";

const foodCode = z.string().check(z.regex(/^\d{5}$/));

export const COOKING_METHODS = [
  "boil",
  "simmer",
  "steam",
  "microwave",
  "grill",
  "stir_fry",
  "saute",
  "deep_fry",
  "tempura",
  "tonkatsu",
  "karaage",
  "rice_cook",
  "poach",
  "fry_egg",
  "scramble",
] as const;

export type CookingMethod = (typeof COOKING_METHODS)[number];

export const weightChangeRateSchema = z.object({
  code: foodCode,
  rawCode: foodCode,
  method: z.enum(COOKING_METHODS),
  /** Mass after cooking as % of the raw food (for coated fried foods: of the raw main food). */
  ratePercent: z.number().check(z.positive()),
  /** Coated fried foods only: mass after cooking as % of the raw food plus coating. */
  coatedBasisPercent: z.optional(z.number().check(z.positive())),
  /** Parts removed after cooking (for example egg shell); the rate then includes them. */
  postCookingRefuse: z.optional(z.string()),
  page: z.number().check(z.int(), z.positive()),
});

const coatingSchema = z.object({
  flour: z.number(),
  flourType: z.string(),
  breadcrumbs: z.nullable(z.number()),
  egg: z.nullable(z.number()),
});

export const fryingFatSchema = z.object({
  code: foodCode,
  cookedMass: z.number(),
  mainMass: z.number(),
  coatedMass: z.nullable(z.number()),
  coating: z.nullable(coatingSchema),
  /** Table 13 "A": fat change (g) per 100 g of raw main food. */
  fatChangeFromMain: z.number(),
  /** Table 13 "B": per 100 g of raw main food plus coating flour. */
  fatChangeFromCoated: z.nullable(z.number()),
  /** Table 13 "C": per 100 g of cooked food (fat of the coating not considered). */
  fatChangePer100gCooked: z.nullable(z.number()),
  page: z.number().check(z.int(), z.positive()),
});

export const stirFryFatSchema = z.object({
  code: foodCode,
  cookedMass: z.number(),
  mainMass: z.number(),
  oilUsed: z.number(),
  /** Table 14 "A": fat change (g) per 100 g of raw food. */
  fatChangeFromMain: z.number(),
  /** Table 14 "B": per 100 g of raw food plus the oil used. */
  fatChangeFromMainAndOil: z.number(),
  /** Table 14 "C": per 100 g of cooked food. */
  fatChangePer100gCooked: z.number(),
  page: z.number().check(z.int(), z.positive()),
});

export const cookingDataSchema = z.object({
  source: z.object({ title: z.string(), url: z.string(), sha256: z.string(), transcribed: z.string() }),
  weightChangeRates: z.array(weightChangeRateSchema),
  fryingFat: z.array(fryingFatSchema),
  stirFryFat: z.array(stirFryFatSchema),
});

export type CookingData = z.infer<typeof cookingDataSchema>;
