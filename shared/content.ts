/**
 * Provisional content format for foods and recipes (Phase 0 Stage 0.4; refined in
 * Phase 1). Content is authored as TypeScript in `content/` and validated with
 * these schemas. Food identity is locale-neutral; every text exists in ja/en/es.
 */
import * as z from "zod/mini";
import { COOKING_METHODS } from "./cooking.ts";

const nonBlank = z.string().check(z.refine((text) => text.trim() !== "", "Text must not be blank"));
const slug = z.string().check(z.regex(/^[a-z][a-z0-9]*(?:_[a-z0-9]+)*$/));
const foodCode = z.string().check(z.regex(/^\d{5}$/));

export const localizedTextSchema = z.object({ ja: nonBlank, en: nonBlank, es: nonBlank });
export type LocalizedText = z.infer<typeof localizedTextSchema>;

export const localizedListSchema = z.object({ ja: z.array(nonBlank), en: z.array(nonBlank), es: z.array(nonBlank) });

/**
 * Japanese allergen categories (docs/CONTENT_POLICY.md §2): 9 mandatory items
 * and 20 recommended items as of April 2026.
 */
export const MANDATORY_ALLERGENS = ["shrimp", "crab", "walnut", "wheat", "buckwheat", "egg", "milk", "peanut", "cashew"] as const;
export const RECOMMENDED_ALLERGENS = [
  "almond",
  "abalone",
  "squid",
  "salmon_roe",
  "orange",
  "kiwifruit",
  "beef",
  "sesame",
  "salmon",
  "mackerel",
  "soybean",
  "chicken",
  "banana",
  "pork",
  "macadamia",
  "peach",
  "yam",
  "apple",
  "gelatin",
  "pistachio",
] as const;
export const ALLERGENS = [...MANDATORY_ALLERGENS, ...RECOMMENDED_ALLERGENS] as const;
export type Allergen = (typeof ALLERGENS)[number];

/**
 * `contains`: the food is or always includes the allergen. `may_contain`: products vary.
 * A food whose allergen information is not reviewed uses `allergens: "unknown"` and is
 * excluded by every allergen filter.
 */
export const allergenLinkSchema = z.object({ allergen: z.enum(ALLERGENS), confidence: z.enum(["contains", "may_contain"]) });

/** States a food can be used in: `raw`, `as_is` (eaten as sold, e.g. cooked rice, canned tuna), or a cooking method. */
export const FOOD_STATES = ["raw", "as_is", ...COOKING_METHODS] as const;
export type FoodState = (typeof FOOD_STATES)[number];

export const foodSchema = z.object({
  id: slug,
  names: localizedTextSchema,
  aliases: localizedListSchema,
  /** Food code per state. Cooked states need a weight change rate in data/composition/cooking.json. */
  composition: z.partialRecord(z.enum(FOOD_STATES), foodCode).check(z.refine((map) => Object.keys(map).length > 0, "At least one state")),
  allergens: z.union([z.literal("unknown"), z.array(allergenLinkSchema)]),
  /** Optional note shown with the food (for example availability abroad). */
  note: z.optional(localizedTextSchema),
});
export type Food = z.infer<typeof foodSchema>;

export const HOUSEHOLD_UNITS = ["piece", "tbsp", "tsp", "clove", "slice", "pinch", "knob"] as const;
export type HouseholdUnit = (typeof HOUSEHOLD_UNITS)[number];

export const INGREDIENT_ROLES = ["main_protein", "main_carb", "vegetable", "fat", "seasoning", "coating", "other"] as const;

export const recipeIngredientSchema = z.object({
  /** Unique within the recipe. */
  key: slug,
  food: slug,
  /** Raw edible grams (state `raw` or a cooking method) or grams as sold (`as_is`). */
  grams: z.number().check(z.positive()),
  /** State whose composition is used for the calculation. */
  state: z.enum(FOOD_STATES),
  /**
   * How the ingredient is actually cooked when that differs from `state` because the
   * tables have no value for it (for example boiled chicken breast calculated from raw).
   * The calculation then classifies the ingredient as an approximation.
   */
  cooking: z.optional(z.enum(COOKING_METHODS)),
  measure: z.optional(z.object({ unit: z.enum(HOUSEHOLD_UNITS), quantity: z.number().check(z.positive()) })),
  role: z.enum(INGREDIENT_ROLES),
  adjust: z.optional(z.object({ min: z.number().check(z.gte(0)), max: z.number().check(z.positive()), step: z.number().check(z.positive()) })),
  /**
   * Key of the ingredient whose cooked value already includes this one (frying oil,
   * coating). Such ingredients are listed but not counted again
   * (docs/NUTRITION_CALCULATION.md §5 rule 3).
   */
  includedIn: z.optional(slug),
  note: z.optional(localizedTextSchema),
});
export type RecipeIngredient = z.infer<typeof recipeIngredientSchema>;

export const CUISINES = ["japanese", "chinese", "korean", "western", "spanish", "okinawan"] as const;
export const GOALS = ["cut", "maintain", "bulk"] as const;
export const EQUIPMENT = ["stove", "microwave", "oven_toaster", "pot", "frying_pan", "deep_pan"] as const;

export const recipeSchema = z.object({
  id: slug,
  texts: z.object({ name: localizedTextSchema, summary: localizedTextSchema }),
  cuisine: z.enum(CUISINES),
  goals: z.array(z.enum(GOALS)).check(z.minLength(1)),
  tags: z.array(z.enum(["quick", "batch", "fried", "no_cook", "breakfast"])),
  minutes: z.number().check(z.int(), z.positive()),
  effort: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  equipment: z.array(z.enum(EQUIPMENT)),
  servings: z.number().check(z.int(), z.positive()),
  ingredients: z.array(recipeIngredientSchema).check(z.minLength(1)),
  steps: z.array(localizedTextSchema).check(z.minLength(1)),
  safetyNotes: z.array(localizedTextSchema),
  substitutions: z.array(
    z.object({ ingredient: slug, food: slug, state: z.enum(FOOD_STATES), ratio: z.number().check(z.positive()), note: localizedTextSchema }),
  ),
});
export type Recipe = z.infer<typeof recipeSchema>;
