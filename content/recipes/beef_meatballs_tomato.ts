import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "beef_meatballs_tomato",
  texts: {
    name: { ja: "牛ひき肉と豆腐のミートボール トマト煮", en: "Beef and tofu meatballs in tomato sauce", es: "Albóndigas de ternera y tofu en salsa de tomate" },
    summary: {
      ja: "スペインのアルボンディガスをヒントに、牛ひき肉に木綿豆腐を合わせたミートボールをトマトソースで煮込みます。パンを添えます。",
      en: "Inspired by Spanish albóndigas: meatballs of ground beef and firm tofu simmered in tomato sauce, with bread.",
      es: "Inspirado en las albóndigas españolas: albóndigas de carne picada de ternera y tofu firme guisadas en salsa de tomate, con pan.",
    },
  },
  cuisine: "spanish",
  goals: ["bulk"],
  mainProteinGroup: "beef",
  tags: [],
  minutes: 30,
  effort: 3,
  equipment: ["stove", "frying_pan"],
  servings: 1,
  ingredients: [
    {
      key: "beef",
      food: "beef_mince",
      grams: 120,
      state: "grill",
      cooking: "simmer",
      role: "main_protein",
      adjust: { kind: "grams", min: 80, max: 160, step: 20 },
      note: {
        ja: "成分表に煮込んだ牛ひき肉の値がないため、焼いた値で計算しています。",
        en: "The tables have no value for simmered ground beef, so the pan-fried value is used.",
        es: "Las tablas no tienen un valor para la carne picada guisada, así que se usa el valor a la sartén.",
      },
    },
    {
      key: "tofu",
      food: "tofu_firm",
      grams: 100,
      state: "raw",
      cooking: "simmer",
      measure: { unit: "block", quantity: 1 / 3 },
      role: "main_protein",
      linkedTo: "beef",
      note: {
        ja: "成分表に加熱した豆腐の値がないため、加熱前の値で計算しています。",
        en: "The tables have no value for cooked tofu, so the uncooked value is used.",
        es: "Las tablas no tienen un valor para el tofu cocinado, así que se usa el valor sin cocinar.",
      },
    },
    { key: "panko", food: "panko", grams: 10, state: "as_is", measure: { unit: "tbsp", quantity: 3 }, role: "other", linkedTo: "beef" },
    { key: "salt", food: "salt", grams: 1, state: "as_is", measure: { unit: "pinch", quantity: 2 }, role: "seasoning", linkedTo: "beef" },
    { key: "pepper", food: "black_pepper", grams: 0.2, state: "as_is", measure: { unit: "pinch", quantity: 1 }, role: "seasoning", linkedTo: "beef" },
    { key: "onion", food: "onion", grams: 60, state: "raw", cooking: "simmer", measure: { unit: "piece", quantity: 0.25 }, role: "vegetable" },
    { key: "garlic", food: "garlic", grams: 5, state: "raw", measure: { unit: "clove", quantity: 1 }, role: "seasoning" },
    { key: "tomato_canned", food: "tomato_canned", grams: 200, state: "as_is", measure: { unit: "can", quantity: 0.5 }, role: "vegetable" },
    { key: "parsley", food: "parsley", grams: 2, state: "raw", role: "vegetable" },
    { key: "bread", food: "bread", grams: 120, state: "as_is", measure: { unit: "slice", quantity: 2 }, role: "main_carb", adjust: { kind: "count", unitGrams: 60, min: 1, max: 3 } },
  ],
  sides: [
    { key: "bread", label: { ja: "パン", en: "Bread", es: "Pan" }, ingredients: ["bread"], solverMayRemove: true },
  ],
  steps: [
    {
      key: "prep",
      text: {
        ja: "木綿豆腐をキッチンペーパーで包んで10分置き、水気を切ります。玉ねぎとにんにくはみじん切りにします。",
        en: "Wrap the firm tofu in paper towels for 10 minutes to drain. Finely chop the onion and garlic.",
        es: "Envuelve el tofu firme en papel de cocina 10 minutos para escurrirlo. Pica fino la cebolla y el ajo.",
      },
    },
    {
      key: "shape",
      text: {
        ja: "ボウルに牛ひき肉、豆腐、パン粉、塩、こしょうを入れてよく練り、6個に丸めます。",
        en: "Knead the ground beef, tofu, panko, salt, and pepper together in a bowl and shape into 6 balls.",
        es: "Amasa en un bol la carne picada, el tofu, el panko, la sal y la pimienta, y forma 6 bolas.",
      },
    },
    {
      key: "brown",
      text: {
        ja: "フライパンを中火で熱し、ミートボールを転がしながら全体に焼き色がつくまで5分焼いて取り出します。",
        en: "Heat a frying pan over medium heat and brown the meatballs all over for 5 minutes, turning them, then take them out.",
        es: "Calienta una sartén a fuego medio y dora las albóndigas por todos lados durante 5 minutos, dándoles la vuelta; después sácalas.",
      },
    },
    {
      key: "sauce",
      text: {
        ja: "同じフライパンに玉ねぎ、にんにく、トマト缶、水50mLを入れて煮立てます。ミートボールを戻してふたをし、弱めの中火で10分煮込みます。",
        en: "Put the onion, garlic, canned tomatoes, and 50 mL of water in the same pan and bring to a boil. Return the meatballs, cover, and simmer over medium-low heat for 10 minutes.",
        es: "Pon la cebolla, el ajo, el tomate en lata y 50 mL de agua en la misma sartén y llévalo a ebullición. Devuelve las albóndigas, tapa y guisa a fuego medio-bajo 10 minutos.",
      },
    },
    {
      key: "serve",
      text: {
        ja: "器に盛り、刻んだパセリを散らします。",
        en: "Transfer to a plate and scatter the chopped parsley.",
        es: "Sírvelo en un plato y esparce el perejil picado.",
      },
    },
    {
      key: "bread",
      side: "bread",
      text: {
        ja: "パンを添えます。",
        en: "Serve with the bread.",
        es: "Acompáñalo con el pan.",
      },
    },
  ],
  safetyNotes: [
    {
      key: "meatball_doneness",
      text: {
        ja: "ミートボールは中心まで火を通してください。1個を半分に切り、中にピンク色が残っていないことを確かめます。",
        en: "Cook the meatballs through. Cut one in half and check that no pink remains inside.",
        es: "Cocina bien las albóndigas. Corta una por la mitad y comprueba que no quede nada rosado por dentro.",
      },
    },
  ],
  substitutions: [],
};
