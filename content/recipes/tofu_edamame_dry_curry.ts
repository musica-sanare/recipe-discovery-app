import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "tofu_edamame_dry_curry",
  texts: {
    name: { ja: "豆腐と枝豆のドライカレー", en: "Tofu and edamame dry curry", es: "Curri seco de tofu y edamame" },
    summary: {
      ja: "ひき肉の代わりに崩した木綿豆腐を使い、枝豆と野菜をカレー粉で炒めてご飯にのせます。",
      en: "Crumbled firm tofu in place of ground meat, stir-fried with edamame, vegetables, and curry powder, served over rice.",
      es: "Tofu firme desmenuzado en lugar de carne picada, salteado con edamame, verduras y curri en polvo, servido sobre arroz.",
    },
  },
  cuisine: "japanese",
  goals: ["bulk"],
  mainProteinGroup: "soy",
  tags: [],
  minutes: 20,
  effort: 2,
  equipment: ["stove", "frying_pan"],
  servings: 1,
  ingredients: [
    {
      key: "tofu",
      food: "tofu_firm",
      grams: 300,
      state: "raw",
      cooking: "stir_fry",
      measure: { unit: "block", quantity: 1 },
      role: "main_protein",
      adjust: { kind: "grams", min: 200, max: 400, step: 50 },
      note: {
        ja: "成分表に加熱した豆腐の値がないため、加熱前の値で計算しています。",
        en: "The tables have no value for cooked tofu, so the uncooked value is used.",
        es: "Las tablas no tienen un valor para el tofu cocinado, así que se usa el valor sin cocinar.",
      },
    },
    { key: "oil", food: "vegetable_oil", grams: 2, state: "as_is", measure: { unit: "tsp", quantity: 0.5 }, role: "fat", linkedTo: "tofu" },
    { key: "edamame", food: "edamame", grams: 120, state: "as_is", role: "main_protein" },
    { key: "onion", food: "onion", grams: 60, state: "stir_fry", measure: { unit: "piece", quantity: 0.25 }, role: "vegetable" },
    { key: "oil_onion", food: "vegetable_oil", grams: 3, state: "as_is", role: "fat", includedIn: "onion" },
    { key: "carrot", food: "carrot", grams: 40, state: "raw", cooking: "stir_fry", role: "vegetable" },
    { key: "garlic", food: "garlic", grams: 5, state: "raw", measure: { unit: "clove", quantity: 1 }, role: "seasoning" },
    { key: "curry_powder", food: "curry_powder", grams: 6, state: "as_is", measure: { unit: "tbsp", quantity: 0.5 }, role: "seasoning", linkedTo: "tofu" },
    { key: "tomato_canned", food: "tomato_canned", grams: 100, state: "as_is", role: "vegetable" },
    { key: "soy_sauce", food: "soy_sauce", grams: 8, state: "as_is", measure: { unit: "tsp", quantity: 1.5 }, role: "seasoning", linkedTo: "tofu" },
    { key: "salt", food: "salt", grams: 0.5, state: "as_is", measure: { unit: "pinch", quantity: 1 }, role: "seasoning", linkedTo: "tofu" },
    { key: "rice", food: "rice_cooked", grams: 250, state: "as_is", role: "main_carb", adjust: { kind: "grams", min: 150, max: 350, step: 10 } },
  ],
  sides: [],
  steps: [
    {
      key: "prep",
      text: {
        ja: "木綿豆腐をキッチンペーパーで包んで10分置き、水気を切ります。玉ねぎ、にんじん、にんにくはみじん切りにします。",
        en: "Wrap the firm tofu in paper towels for 10 minutes to drain. Finely chop the onion, carrot, and garlic.",
        es: "Envuelve el tofu firme en papel de cocina 10 minutos para escurrirlo. Pica fino la cebolla, la zanahoria y el ajo.",
      },
    },
    {
      key: "vegetables",
      text: {
        ja: "フライパンに玉ねぎ用の油を中火で熱し、玉ねぎ、にんじん、にんにくを3分炒めます。",
        en: "Heat the oil for the onion in a frying pan over medium heat and stir-fry the onion, carrot, and garlic for 3 minutes.",
        es: "Calienta el aceite de la cebolla en una sartén a fuego medio y saltea la cebolla, la zanahoria y el ajo 3 minutos.",
      },
    },
    {
      key: "tofu",
      text: {
        ja: "残りの油を足し、豆腐を崩し入れて水分が飛ぶまで5分炒めます。カレー粉を加えて1分炒めます。",
        en: "Add the remaining oil, crumble in the tofu, and stir-fry for 5 minutes until dry. Add the curry powder and stir-fry for 1 minute.",
        es: "Añade el resto del aceite, desmenuza el tofu dentro y saltéalo 5 minutos hasta que se seque. Agrega el curri y saltea 1 minuto.",
      },
    },
    {
      key: "finish",
      text: {
        ja: "トマト缶、枝豆、しょうゆ、塩を加え、汁気がなくなるまで3分炒め煮にします。",
        en: "Add the canned tomatoes, edamame, soy sauce, and salt and cook, stirring, for 3 minutes until the liquid is gone.",
        es: "Añade el tomate en lata, el edamame, la salsa de soja y la sal y cocina, removiendo, 3 minutos hasta que no quede líquido.",
      },
    },
    {
      key: "serve",
      text: {
        ja: "ご飯にのせます。",
        en: "Spoon over the rice.",
        es: "Sírvelo sobre el arroz.",
      },
    },
  ],
  safetyNotes: [],
  substitutions: [],
};
