import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "vegetable_omelette_bread",
  texts: {
    name: { ja: "野菜たっぷりオムレツ", en: "Vegetable-packed omelette", es: "Tortilla francesa con muchas verduras" },
    summary: {
      ja: "ゆでたほうれん草と玉ねぎを卵で包み、トマトとパンを添えた朝食向きの一皿です。",
      en: "Blanched spinach and onion folded into eggs, with tomato and bread: a breakfast plate.",
      es: "Espinacas y cebolla escaldadas envueltas en huevo, con tomate y pan: un plato de desayuno.",
    },
  },
  cuisine: "western",
  goals: ["maintain"],
  mainProteinGroup: "egg",
  tags: ["breakfast"],
  minutes: 15,
  effort: 2,
  equipment: ["stove", "frying_pan", "pot"],
  servings: 1,
  ingredients: [
    { key: "egg", food: "egg", grams: 150, state: "scramble", measure: { unit: "piece", quantity: 3 }, role: "main_protein", adjust: { kind: "count", unitGrams: 50, min: 2, max: 4 } },
    { key: "oil_egg", food: "vegetable_oil", grams: 7.5, state: "as_is", role: "fat", linkedTo: "egg", includedIn: "egg" },
    { key: "spinach", food: "spinach", grams: 60, state: "boil", role: "vegetable" },
    { key: "onion", food: "onion", grams: 40, state: "boil", role: "vegetable" },
    { key: "salt", food: "salt", grams: 1, state: "as_is", measure: { unit: "pinch", quantity: 2 }, role: "seasoning", linkedTo: "egg" },
    { key: "pepper", food: "black_pepper", grams: 0.2, state: "as_is", measure: { unit: "pinch", quantity: 1 }, role: "seasoning", linkedTo: "egg" },
    { key: "tomato", food: "tomato", grams: 80, state: "raw", measure: { unit: "piece", quantity: 0.5 }, role: "vegetable" },
    { key: "bread", food: "bread", grams: 120, state: "as_is", measure: { unit: "slice", quantity: 2 }, role: "main_carb", adjust: { kind: "count", unitGrams: 60, min: 1, max: 3 } },
  ],
  sides: [
    { key: "bread", label: { ja: "パン", en: "Bread", es: "Pan" }, ingredients: ["bread"], solverMayRemove: true },
  ],
  steps: [
    {
      key: "prep",
      text: {
        ja: "ほうれん草を3cm長さに切り、玉ねぎは薄切りにします。卵は塩とこしょうを加えて溶きほぐします。",
        en: "Cut the spinach into 3 cm lengths and thinly slice the onion. Beat the eggs with the salt and pepper.",
        es: "Corta las espinacas en trozos de 3 cm y la cebolla en láminas finas. Bate los huevos con la sal y la pimienta.",
      },
    },
    {
      key: "vegetables",
      text: {
        ja: "鍋に湯を沸かし、玉ねぎを2分、ほうれん草を加えて1分ゆでます。水気をよく切ります。",
        en: "Bring a pot of water to a boil and cook the onion for 2 minutes, then add the spinach for 1 minute. Drain well.",
        es: "Lleva a ebullición una olla con agua y cuece la cebolla 2 minutos; añade las espinacas 1 minuto. Escúrrelas bien.",
      },
    },
    {
      key: "omelette",
      text: {
        ja: "フライパンに卵用の油を中火で熱して溶き卵を流し入れ、大きく混ぜて半熟になったら野菜をのせ、半分に折って卵が固まるまで焼きます。",
        en: "Heat the oil for the eggs in a frying pan over medium heat, pour in the eggs, and stir in large curds; when half set, add the vegetables, fold in half, and cook until the eggs are set.",
        es: "Calienta el aceite de los huevos en una sartén a fuego medio, vierte los huevos y remueve en grumos grandes; cuando estén a medio cuajar, pon las verduras, dobla por la mitad y cocina hasta que el huevo cuaje.",
      },
    },
    {
      key: "serve",
      text: {
        ja: "くし形に切ったトマトと一緒に器に盛ります。",
        en: "Plate with the tomato cut into wedges.",
        es: "Sírvelo con el tomate cortado en gajos.",
      },
    },
    {
      key: "bread",
      side: "bread",
      text: {
        ja: "パンをトーストして添えます。",
        en: "Toast the bread and serve it alongside.",
        es: "Tuesta el pan y sírvelo al lado.",
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
