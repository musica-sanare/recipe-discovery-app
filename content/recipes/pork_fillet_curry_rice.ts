import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "pork_fillet_curry_rice",
  texts: {
    name: { ja: "豚ヒレと野菜のカレー炒めごはん", en: "Curried pork tenderloin and vegetables over rice", es: "Salteado de solomillo de cerdo y verduras al curri con arroz" },
    summary: {
      ja: "豚ヒレ肉と玉ねぎ、パプリカをカレー粉で炒めて、ご飯にのせます。",
      en: "Pork tenderloin, onion, and red pepper stir-fried with curry powder and served over rice.",
      es: "Solomillo de cerdo, cebolla y pimiento rojo salteados con curri en polvo y servidos sobre arroz.",
    },
  },
  cuisine: "japanese",
  goals: ["bulk"],
  mainProteinGroup: "pork",
  tags: [],
  minutes: 20,
  effort: 2,
  equipment: ["stove", "frying_pan"],
  servings: 1,
  ingredients: [
    {
      key: "pork",
      food: "pork_fillet",
      grams: 220,
      state: "raw",
      cooking: "stir_fry",
      role: "main_protein",
      adjust: { kind: "grams", min: 160, max: 280, step: 20 },
      note: {
        ja: "成分表に炒めた豚ヒレ肉の値がないため、生の値で計算しています。",
        en: "The tables have no value for stir-fried pork tenderloin, so the raw value is used.",
        es: "Las tablas no tienen un valor para el solomillo de cerdo salteado, así que se usa el valor en crudo.",
      },
    },
    { key: "oil_pork", food: "vegetable_oil", grams: 4, state: "as_is", measure: { unit: "tsp", quantity: 1 }, role: "fat", linkedTo: "pork" },
    { key: "onion", food: "onion", grams: 80, state: "stir_fry", measure: { unit: "piece", quantity: 1 / 3 }, role: "vegetable" },
    { key: "red_pepper", food: "red_pepper", grams: 60, state: "stir_fry", measure: { unit: "piece", quantity: 0.5 }, role: "vegetable" },
    { key: "oil_vegetables", food: "vegetable_oil", grams: 7, state: "as_is", role: "fat", includedIn: "onion" },
    { key: "curry_powder", food: "curry_powder", grams: 4, state: "as_is", measure: { unit: "tsp", quantity: 2 }, role: "seasoning", linkedTo: "pork" },
    { key: "soy_sauce", food: "soy_sauce", grams: 8, state: "as_is", measure: { unit: "tsp", quantity: 1.5 }, role: "seasoning", linkedTo: "pork" },
    { key: "salt", food: "salt", grams: 0.5, state: "as_is", measure: { unit: "pinch", quantity: 1 }, role: "seasoning", linkedTo: "pork" },
    { key: "rice", food: "rice_cooked", grams: 300, state: "as_is", role: "main_carb", adjust: { kind: "grams", min: 200, max: 400, step: 10 } },
  ],
  sides: [],
  steps: [
    {
      key: "prep",
      text: {
        ja: "豚ヒレ肉を1cm幅に切ります。玉ねぎはくし形に、パプリカは細切りにします。",
        en: "Cut the pork tenderloin into 1 cm slices. Cut the onion into wedges and the red pepper into strips.",
        es: "Corta el solomillo de cerdo en lonchas de 1 cm. Corta la cebolla en gajos y el pimiento rojo en tiras.",
      },
    },
    {
      key: "vegetables",
      text: {
        ja: "フライパンに野菜用の油を中火で熱し、玉ねぎとパプリカを3分炒めて取り出します。",
        en: "Heat the oil for the vegetables in a frying pan over medium heat, stir-fry the onion and red pepper for 3 minutes, and set them aside.",
        es: "Calienta el aceite de las verduras en una sartén a fuego medio, saltea la cebolla y el pimiento rojo 3 minutos y resérvalos.",
      },
    },
    {
      key: "pork",
      text: {
        ja: "豚肉用の油を足して豚肉を色が完全に変わるまで炒め、野菜を戻します。カレー粉、しょうゆ、塩を加えて炒め合わせます。",
        en: "Add the oil for the pork and stir-fry the pork until it has changed color completely, then return the vegetables. Add the curry powder, soy sauce, and salt and toss together.",
        es: "Añade el aceite del cerdo, saltea el cerdo hasta que cambie de color por completo y devuelve las verduras. Agrega el curri, la salsa de soja y la sal y mezcla.",
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
  safetyNotes: [
    {
      key: "pork_doneness",
      text: {
        ja: "豚肉は中心まで火を通してください。切り口に赤みがないことを確認します。",
        en: "Cook the pork through. Check that no pink remains when you cut it.",
        es: "Cocina bien el cerdo. Comprueba que no quede nada rosado al cortarlo.",
      },
    },
  ],
  substitutions: [],
};
