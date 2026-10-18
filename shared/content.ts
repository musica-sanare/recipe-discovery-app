/**
 * Content format for foods and recipes (MVP schema, ADR-026). Content is authored as
 * TypeScript in `content/` and validated with these schemas. Food identity is
 * locale-neutral; every text exists in ja/en/es.
 */
import * as z from "zod/mini";
import { COOKING_METHODS } from "./cooking.ts";

export const nonBlank = z.string().check(z.refine((text) => text.trim() !== "", "Text must not be blank"));
export const slug = z.string().check(z.regex(/^[a-z][a-z0-9]*(?:_[a-z0-9]+)*$/));
export const foodCode = z.string().check(z.regex(/^\d{5}$/));

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

/** Main protein groups used by the library composition rules and diversification (ADR-023). */
export const PROTEIN_GROUPS = ["chicken", "pork", "beef", "fish", "egg", "soy"] as const;
export type ProteinGroup = (typeof PROTEIN_GROUPS)[number];

export const foodSchema = z.object({
  id: slug,
  names: localizedTextSchema,
  aliases: localizedListSchema,
  /** Food code per state. Cooked states need a weight change rate in data/composition/cooking.json. */
  composition: z.partialRecord(z.enum(FOOD_STATES), foodCode).check(z.refine((map) => Object.keys(map).length > 0, "At least one state")),
  allergens: z.union([z.literal("unknown"), z.array(allergenLinkSchema)]),
  proteinGroup: z.optional(z.enum(PROTEIN_GROUPS)),
  /** Optional note shown with the food (for example availability abroad). */
  note: z.optional(localizedTextSchema),
});
export type Food = z.infer<typeof foodSchema>;

/**
 * Household measures are display aids; labels come from the UI catalogs. The quantity
 * is a multiple of 1/12 so that halves, thirds, and quarters are exact (author 2 / 3).
 */
export const HOUSEHOLD_UNITS = ["piece", "tbsp", "tsp", "clove", "slice", "pinch", "knob", "block", "can", "stalk"] as const;
export type HouseholdUnit = (typeof HOUSEHOLD_UNITS)[number];

const positive = z.number().check(z.positive());
const positiveInt = z.number().check(z.int(), z.positive());

export const measureSchema = z.object({
  unit: z.enum(HOUSEHOLD_UNITS),
  quantity: z
    .number()
    .check(
      z.positive(),
      z.refine((quantity) => Math.abs(quantity * 12 - Math.round(quantity * 12)) < 1e-9, "Quantity must be a multiple of 1/12"),
    ),
});
export type Measure = z.infer<typeof measureSchema>;

export const INGREDIENT_ROLES = ["main_protein", "main_carb", "vegetable", "fat", "seasoning", "coating", "other"] as const;

/**
 * Bounds for "fit to my targets" (ADR-024). `grams`: min, min + step, ... up to max.
 * `count`: whole units (for example eggs), grams = count × unitGrams. Removal is
 * expressed only by sides.
 */
export const adjustSchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("grams"), min: positive, max: positive, step: positive }),
  z.object({ kind: z.literal("count"), unitGrams: positive, min: positiveInt, max: positiveInt }),
]);
export type Adjust = z.infer<typeof adjustSchema>;

/**
 * Cooking that no table value represents, so the estimate gets a wider range
 * (docs/NUTRITION_CALCULATION.md §7). `slow_frying`: slow frying in a large amount of oil.
 */
export const ESTIMATE_REASONS = ["slow_frying"] as const;

export const recipeIngredientSchema = z.object({
  /** Unique within the recipe. */
  key: slug,
  food: slug,
  /** Raw edible grams (state `raw` or a cooking method) or grams as sold (`as_is`). */
  grams: positive,
  /** State whose composition is used for the calculation. */
  state: z.enum(FOOD_STATES),
  /**
   * How the ingredient is actually cooked when that differs from `state` because the
   * tables have no value for it (for example boiled chicken breast calculated from raw).
   * The calculation then classifies the ingredient as an approximation.
   */
  cooking: z.optional(z.enum(COOKING_METHODS)),
  measure: z.optional(measureSchema),
  role: z.enum(INGREDIENT_ROLES),
  adjust: z.optional(adjustSchema),
  /** Key of an adjustable ingredient; this one scales in proportion to it (one level only). */
  linkedTo: z.optional(slug),
  estimate: z.optional(z.enum(ESTIMATE_REASONS)),
  /**
   * Key of the ingredient whose cooked value already includes this one (frying oil,
   * coating). Such ingredients are listed but not counted again
   * (docs/NUTRITION_CALCULATION.md §5 rule 3).
   */
  includedIn: z.optional(slug),
  note: z.optional(localizedTextSchema),
});
export type RecipeIngredient = z.infer<typeof recipeIngredientSchema>;

/**
 * Something served with the dish (rice, a vegetable side) that can be switched off.
 * Off sets its ingredients, and the ingredients linked to them, to 0 g.
 */
export const sideSchema = z.object({
  key: slug,
  label: localizedTextSchema,
  ingredients: z.array(slug).check(z.minLength(1)),
  /** True when "fit to my targets" may switch the side off; otherwise only the user may. */
  solverMayRemove: z.boolean(),
});
export type Side = z.infer<typeof sideSchema>;

/** A note shown with a step when an ingredient reaches an amount (whole recipe, after scaling). */
export const stepNoteSchema = z.object({ ingredient: slug, atLeastGrams: positive, text: localizedTextSchema });

export const stepSchema = z.object({
  key: slug,
  text: localizedTextSchema,
  /** The step is hidden when this side is off. */
  side: z.optional(slug),
  notes: z.optional(z.array(stepNoteSchema)),
});
export type Step = z.infer<typeof stepSchema>;

export const safetyNoteSchema = z.object({ key: slug, text: localizedTextSchema });
export type SafetyNote = z.infer<typeof safetyNoteSchema>;

export const substitutionSchema = z.object({
  key: slug,
  /** Key of the replaced ingredient. */
  ingredient: slug,
  food: slug,
  state: z.enum(FOOD_STATES),
  cooking: z.optional(z.enum(COOKING_METHODS)),
  /** New grams = grams × ratio; `grams` bounds scale by the same ratio unless `adjust` is given. */
  ratio: positive,
  adjust: z.optional(adjustSchema),
  measure: z.optional(measureSchema),
  minutesDelta: z.optional(z.number().check(z.int())),
  stepTexts: z.optional(z.array(z.object({ step: slug, text: localizedTextSchema }))),
  safetyNotes: z.optional(z.object({ replace: z.optional(z.array(safetyNoteSchema)), add: z.optional(z.array(safetyNoteSchema)) })),
  note: localizedTextSchema,
});
export type Substitution = z.infer<typeof substitutionSchema>;

export const CUISINES = ["japanese", "chinese", "korean", "western", "spanish", "okinawan"] as const;
export const GOALS = ["cut", "maintain", "bulk"] as const;
export const EQUIPMENT = ["stove", "microwave", "oven_toaster", "pot", "frying_pan", "deep_pan"] as const;
/** Authored tags. "Quick" and "fried" are derived (shared/recipe.ts). */
export const RECIPE_TAGS = ["batch", "no_cook", "breakfast"] as const;

export const recipeSchema = z.object({
  id: slug,
  texts: z.object({ name: localizedTextSchema, summary: localizedTextSchema }),
  cuisine: z.enum(CUISINES),
  goals: z.array(z.enum(GOALS)).check(z.minLength(1)),
  mainProteinGroup: z.enum(PROTEIN_GROUPS),
  tags: z.array(z.enum(RECIPE_TAGS)),
  minutes: positiveInt,
  effort: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  equipment: z.array(z.enum(EQUIPMENT)),
  servings: positiveInt,
  ingredients: z.array(recipeIngredientSchema).check(z.minLength(1)),
  sides: z.array(sideSchema),
  steps: z.array(stepSchema).check(z.minLength(1)),
  safetyNotes: z.array(safetyNoteSchema),
  substitutions: z.array(substitutionSchema),
});
export type Recipe = z.infer<typeof recipeSchema>;
