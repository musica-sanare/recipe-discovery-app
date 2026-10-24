import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "beef_pepper_stir_fry",
  texts: {
    name: { ja: "牛もも肉とピーマンの細切り炒め", en: "Shredded beef and green pepper stir-fry", es: "Salteado de ternera y pimiento verde en tiras" },
    summary: {
      ja: "細切りの牛もも肉とピーマンを、しょうゆとしょうがで手早く炒めます。ご飯を添えます。",
      en: "Thin strips of lean beef and green pepper quickly stir-fried with soy sauce and ginger, served with rice.",
      es: "Tiras finas de ternera magra y pimiento verde salteadas rápidamente con salsa de soja y jengibre, con arroz.",
    },
  },
  cuisine: "chinese",
  goals: ["maintain", "bulk"],
  mainProteinGroup: "beef",
  tags: [],
  minutes: 15,
  effort: 2,
  equipment: ["stove", "frying_pan"],
  servings: 1,
  ingredients: [
    {
      key: "beef",
      food: "beef_round",
      grams: 150,
      state: "raw",
      cooking: "stir_fry",
      role: "main_protein",
      adjust: { kind: "grams", min: 120, max: 220, step: 10 },
      note: {
        ja: "成分表に炒めた牛もも肉の値がないため、生の値で計算しています。",
        en: "The tables have no value for stir-fried beef round, so the raw value is used.",
        es: "Las tablas no tienen un valor para la ternera salteada, así que se usa el valor en crudo.",
      },
    },
    { key: "starch", food: "potato_starch", grams: 3, state: "as_is", measure: { unit: "tsp", quantity: 1 }, role: "coating", linkedTo: "beef" },
    { key: "oil_beef", food: "vegetable_oil", grams: 3, state: "as_is", measure: { unit: "tsp", quantity: 0.75 }, role: "fat", linkedTo: "beef" },
    { key: "green_pepper", food: "green_pepper", grams: 90, state: "stir_fry", measure: { unit: "piece", quantity: 3 }, role: "vegetable" },
    { key: "oil_pepper", food: "vegetable_oil", grams: 4.5, state: "as_is", role: "fat", includedIn: "green_pepper" },
    { key: "ginger", food: "ginger", grams: 5, state: "raw", measure: { unit: "knob", quantity: 0.5 }, role: "seasoning", linkedTo: "beef" },
    { key: "soy_sauce", food: "soy_sauce", grams: 12, state: "as_is", measure: { unit: "tsp", quantity: 2 }, role: "seasoning", linkedTo: "beef" },
    { key: "sake", food: "cooking_sake", grams: 10, state: "as_is", measure: { unit: "tsp", quantity: 2 }, role: "seasoning", linkedTo: "beef" },
    { key: "sugar", food: "sugar", grams: 3, state: "as_is", measure: { unit: "tsp", quantity: 1 }, role: "seasoning", linkedTo: "beef" },
    { key: "rice", food: "rice_cooked", grams: 200, state: "as_is", role: "main_carb", adjust: { kind: "grams", min: 100, max: 300, step: 10 } },
  ],
  sides: [
    { key: "rice", label: { ja: "ご飯", en: "Rice", es: "Arroz" }, ingredients: ["rice"], solverMayRemove: true },
  ],
  steps: [
    {
      key: "prep",
      text: {
        ja: "牛肉を細切りにし、料理酒をもみ込んでから片栗粉をまぶします。ピーマンは細切りにし、しょうがはせん切りにします。",
        en: "Cut the beef into thin strips, rub in the cooking sake, and coat with the potato starch. Cut the green peppers into strips and the ginger into fine matchsticks.",
        es: "Corta la ternera en tiras finas, mézclala con el sake de cocina y rebózala con la fécula de patata. Corta los pimientos verdes en tiras y el jengibre en bastoncitos finos.",
      },
    },
    {
      key: "pepper",
      text: {
        ja: "フライパンにピーマン用の油を強めの中火で熱し、ピーマンを1分炒めて取り出します。",
        en: "Heat the oil for the peppers in a frying pan over medium-high heat, stir-fry the peppers for 1 minute, and set them aside.",
        es: "Calienta el aceite de los pimientos en una sartén a fuego medio-alto, saltea los pimientos 1 minuto y resérvalos.",
      },
    },
    {
      key: "beef",
      text: {
        ja: "牛肉用の油を足し、しょうがと牛肉を色が完全に変わるまで炒めます。ピーマンを戻し、しょうゆと砂糖を加えて炒め合わせます。",
        en: "Add the oil for the beef and stir-fry the ginger and beef until the beef is browned all over. Return the peppers, add the soy sauce and sugar, and toss together.",
        es: "Añade el aceite de la ternera y saltea el jengibre y la ternera hasta que esté dorada por completo. Devuelve los pimientos, añade la salsa de soja y el azúcar y mezcla.",
      },
    },
    {
      key: "serve",
      text: {
        ja: "器に盛ります。",
        en: "Transfer to a plate.",
        es: "Sírvelo en un plato.",
      },
    },
  ],
  safetyNotes: [
    {
      key: "beef_doneness",
      text: {
        ja: "細切りにした牛肉は、色が完全に変わるまで炒めてください。",
        en: "Stir-fry the beef strips until they are browned all over.",
        es: "Saltea las tiras de ternera hasta que estén doradas por completo.",
      },
    },
  ],
  substitutions: [],
};
