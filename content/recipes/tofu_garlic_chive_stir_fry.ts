import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "tofu_garlic_chive_stir_fry",
  texts: {
    name: { ja: "豆腐とにらのナンプラー炒め", en: "Tofu and garlic chive stir-fry with fish sauce", es: "Salteado de tofu y cebollino chino con salsa de pescado" },
    summary: {
      ja: "東南アジアの炒め物をヒントに、木綿豆腐、卵白、にらをにんにくとナンプラーで炒めます。ご飯を添えます。",
      en: "Inspired by Southeast Asian stir-fries: firm tofu, egg whites, and garlic chives stir-fried with garlic and fish sauce, with rice.",
      es: "Inspirado en los salteados del sudeste asiático: tofu firme, claras y cebollino chino salteados con ajo y salsa de pescado, con arroz.",
    },
  },
  cuisine: "southeast_asian",
  goals: ["maintain"],
  mainProteinGroup: "soy",
  tags: [],
  minutes: 10,
  effort: 1,
  equipment: ["stove", "frying_pan"],
  servings: 1,
  ingredients: [
    {
      key: "tofu",
      food: "tofu_firm",
      grams: 250,
      state: "raw",
      cooking: "stir_fry",
      role: "main_protein",
      adjust: { kind: "grams", min: 150, max: 350, step: 50 },
      note: {
        ja: "成分表に加熱した豆腐の値がないため、加熱前の値で計算しています。",
        en: "The tables have no value for cooked tofu, so the uncooked value is used.",
        es: "Las tablas no tienen un valor para el tofu cocinado, así que se usa el valor sin cocinar.",
      },
    },
    { key: "oil", food: "vegetable_oil", grams: 3, state: "as_is", measure: { unit: "tsp", quantity: 0.75 }, role: "fat", linkedTo: "tofu" },
    { key: "fish_sauce", food: "fish_sauce", grams: 8, state: "as_is", measure: { unit: "tsp", quantity: 1.5 }, role: "seasoning", linkedTo: "tofu" },
    {
      key: "egg_white",
      food: "egg_white",
      grams: 99,
      state: "raw",
      cooking: "stir_fry",
      measure: { unit: "piece", quantity: 3 },
      role: "main_protein",
      adjust: { kind: "count", unitGrams: 33, min: 2, max: 6 },
      note: {
        ja: "成分表に加熱した卵白の値がないため、生の値で計算しています。残った黄身は別の料理に使えます。市販の液卵白でも作れます。",
        en: "The tables have no value for cooked egg white, so the raw value is used. Use the leftover yolks in another dish, or use liquid egg white from a carton.",
        es: "Las tablas no tienen un valor para la clara cocinada, así que se usa el valor en crudo. Usa las yemas que sobren en otro plato, o usa clara de huevo líquida envasada.",
      },
    },
    { key: "chives", food: "garlic_chives", grams: 80, state: "stir_fry", role: "vegetable" },
    { key: "oil_chives", food: "vegetable_oil", grams: 4, state: "as_is", measure: { unit: "tsp", quantity: 1 }, role: "fat", includedIn: "chives" },
    { key: "garlic", food: "garlic", grams: 5, state: "raw", measure: { unit: "clove", quantity: 1 }, role: "seasoning" },
    { key: "sugar", food: "sugar", grams: 1, state: "as_is", role: "seasoning" },
    { key: "rice", food: "rice_cooked", grams: 150, state: "as_is", role: "main_carb", adjust: { kind: "grams", min: 100, max: 250, step: 25 } },
  ],
  sides: [
    { key: "rice", label: { ja: "ご飯", en: "Rice", es: "Arroz" }, ingredients: ["rice"], solverMayRemove: true },
  ],
  steps: [
    {
      key: "prep",
      text: {
        ja: "豆腐をキッチンペーパーで包んで水気を拭き、ひと口大にちぎります。にらは4cm長さに切り、にんにくは薄切りにします。",
        en: "Pat the tofu dry with paper towels and tear it into bite-size pieces. Cut the garlic chives into 4 cm lengths and thinly slice the garlic.",
        es: "Seca el tofu con papel de cocina y pártelo con las manos en trozos pequeños. Corta el cebollino chino en trozos de 4 cm y el ajo en láminas finas.",
      },
    },
    {
      key: "tofu",
      text: {
        ja: "フライパンに油を中火で熱し、豆腐を焼き色がつくまで3分焼きます。端に寄せて、空いたところに卵白を入れ、固まるまで炒めます。",
        en: "Heat the oil in a frying pan over medium heat and cook the tofu for 3 minutes until browned. Push it to one side, pour the egg whites into the space, and stir-fry until set.",
        es: "Calienta el aceite en una sartén a fuego medio y dora el tofu 3 minutos. Apártalo a un lado, vierte las claras en el hueco y saltéalas hasta que cuajen.",
      },
    },
    {
      key: "chives",
      text: {
        ja: "にんにくとにらを加えて1分炒め、ナンプラーと砂糖で味をつけます。",
        en: "Add the garlic and garlic chives, stir-fry for 1 minute, and season with the fish sauce and sugar.",
        es: "Añade el ajo y el cebollino chino, saltea 1 minuto y sazona con la salsa de pescado y el azúcar.",
      },
    },
    {
      key: "rice",
      side: "rice",
      text: {
        ja: "ご飯を添えます。",
        en: "Serve with the rice.",
        es: "Acompáñalo con el arroz.",
      },
    },
  ],
  safetyNotes: [
    {
      key: "egg_set",
      text: {
        ja: "卵は固まるまで加熱してください。",
        en: "Cook the eggs until set.",
        es: "Cocina los huevos hasta que cuajen.",
      },
    },
  ],
  substitutions: [],
};
