import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "beef_shimeji_bowl",
  texts: {
    name: { ja: "牛もも肉としめじの甘辛炒め丼", en: "Sweet and savory beef and shimeji rice bowl", es: "Bol de arroz con ternera y setas shimeji agridulces" },
    summary: {
      ja: "赤身の牛もも肉としめじ、玉ねぎを、にんにくの効いた甘辛だれで炒めてご飯にのせます。",
      en: "Lean beef, shimeji mushrooms, and onion stir-fried in a garlicky sweet soy sauce and served over rice.",
      es: "Ternera magra, setas shimeji y cebolla salteadas en una salsa dulce de soja con ajo, servidas sobre arroz.",
    },
  },
  cuisine: "korean",
  goals: ["bulk"],
  tags: [],
  minutes: 20,
  effort: 2,
  equipment: ["stove", "frying_pan"],
  servings: 1,
  ingredients: [
    {
      key: "beef",
      food: "beef_round",
      grams: 180,
      state: "raw",
      cooking: "stir_fry",
      role: "main_protein",
      adjust: { min: 140, max: 240, step: 10 },
      note: {
        ja: "成分表に炒めた牛もも肉の値がないため、生の値で計算しています。",
        en: "The tables have no value for stir-fried beef round, so the raw value is used.",
        es: "Las tablas no tienen un valor para la ternera salteada, así que se usa el valor en crudo.",
      },
    },
    { key: "shimeji", food: "shimeji", grams: 80, state: "stir_fry", role: "vegetable" },
    { key: "onion", food: "onion", grams: 60, state: "stir_fry", measure: { unit: "piece", quantity: 0.25 }, role: "vegetable" },
    { key: "oil_vegetables", food: "vegetable_oil", grams: 7, state: "as_is", role: "fat", includedIn: "shimeji" },
    { key: "oil_beef", food: "vegetable_oil", grams: 3, state: "as_is", measure: { unit: "tsp", quantity: 0.75 }, role: "fat" },
    { key: "garlic", food: "garlic", grams: 5, state: "raw", measure: { unit: "clove", quantity: 1 }, role: "seasoning" },
    { key: "soy_sauce", food: "soy_sauce", grams: 18, state: "as_is", measure: { unit: "tbsp", quantity: 1 }, role: "seasoning" },
    { key: "sugar", food: "sugar", grams: 6, state: "as_is", measure: { unit: "tsp", quantity: 2 }, role: "seasoning" },
    { key: "mirin", food: "mirin", grams: 10, state: "as_is", measure: { unit: "tsp", quantity: 2 }, role: "seasoning" },
    { key: "sesame_oil", food: "sesame_oil", grams: 3, state: "as_is", role: "fat" },
    { key: "green_onion", food: "green_onion", grams: 5, state: "raw", role: "vegetable" },
    { key: "rice", food: "rice_cooked", grams: 250, state: "as_is", role: "main_carb", adjust: { min: 150, max: 350, step: 10 } },
  ],
  steps: [
    {
      ja: "牛肉を細切りにし、しょうゆ、砂糖、みりん、すりおろしたにんにくをもみ込みます。しめじは小房に分け、玉ねぎは薄切りにします。",
      en: "Cut the beef into strips and rub in the soy sauce, sugar, mirin, and grated garlic. Separate the shimeji and thinly slice the onion.",
      es: "Corta la ternera en tiras y mézclala con la salsa de soja, el azúcar, el mirin y el ajo rallado. Separa las shimeji y corta la cebolla en láminas finas.",
    },
    {
      ja: "フライパンに野菜用の油を中火で熱し、しめじと玉ねぎを3分炒めて取り出します。",
      en: "Heat the oil for the vegetables in a frying pan over medium heat, stir-fry the shimeji and onion for 3 minutes, and set them aside.",
      es: "Calienta el aceite para las verduras en una sartén a fuego medio, saltea las shimeji y la cebolla 3 minutos y resérvalas.",
    },
    {
      ja: "残りの油で牛肉を色が変わるまで炒め、野菜を戻してたれごと炒め合わせます。",
      en: "Stir-fry the beef in the remaining oil until browned, return the vegetables, and toss everything with the marinade.",
      es: "Saltea la ternera con el resto del aceite hasta que se dore, devuelve las verduras y mezcla todo con el adobo.",
    },
    {
      ja: "ごま油を回しかけ、ご飯にのせて青ねぎを散らします。",
      en: "Drizzle with sesame oil, spoon over the rice, and scatter the green onion.",
      es: "Rocía con aceite de sésamo, sírvelo sobre el arroz y esparce la cebolleta.",
    },
  ],
  safetyNotes: [
    {
      ja: "細切りにした牛肉は、色が完全に変わるまで炒めてください。",
      en: "Stir-fry the beef strips until they are browned all over.",
      es: "Saltea las tiras de ternera hasta que estén doradas por completo.",
    },
  ],
  substitutions: [],
};
