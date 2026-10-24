import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "beef_potato_tomato_stew",
  texts: {
    name: { ja: "牛もも肉とじゃがいものトマト煮", en: "Beef and potato stew in tomato", es: "Guiso de ternera y patatas con tomate" },
    summary: {
      ja: "スペインの煮込みをヒントに、角切りの牛もも肉とじゃがいもをトマトで煮込みます。パンを添えます。",
      en: "Inspired by Spanish stews: cubes of lean beef and potato simmered in tomato, with bread.",
      es: "Inspirado en los guisos españoles: dados de ternera magra y patata guisados en tomate, con pan.",
    },
  },
  cuisine: "spanish",
  goals: ["bulk"],
  mainProteinGroup: "beef",
  tags: ["batch"],
  minutes: 35,
  effort: 2,
  equipment: ["stove", "pot"],
  servings: 1,
  ingredients: [
    {
      key: "beef",
      food: "beef_round",
      grams: 220,
      state: "raw",
      cooking: "simmer",
      role: "main_protein",
      adjust: { kind: "grams", min: 160, max: 280, step: 20 },
      note: {
        ja: "成分表に煮込んだ牛もも肉の値がないため、生の値で計算しています。",
        en: "The tables have no value for stewed beef round, so the raw value is used.",
        es: "Las tablas no tienen un valor para la ternera guisada, así que se usa el valor en crudo.",
      },
    },
    { key: "olive_oil", food: "olive_oil", grams: 5, state: "as_is", measure: { unit: "tsp", quantity: 1.25 }, role: "fat", linkedTo: "beef" },
    { key: "salt", food: "salt", grams: 1.5, state: "as_is", measure: { unit: "pinch", quantity: 3 }, role: "seasoning", linkedTo: "beef" },
    { key: "potato", food: "potato", grams: 250, state: "simmer", measure: { unit: "piece", quantity: 2 }, role: "main_carb", adjust: { kind: "grams", min: 150, max: 400, step: 50 } },
    {
      key: "onion",
      food: "onion",
      grams: 80,
      state: "raw",
      cooking: "simmer",
      measure: { unit: "piece", quantity: 1 / 3 },
      role: "vegetable",
      note: {
        ja: "成分表に煮込んだ玉ねぎの値がないため、生の値で計算しています。",
        en: "The tables have no value for stewed onion, so the raw value is used.",
        es: "Las tablas no tienen un valor para la cebolla guisada, así que se usa el valor en crudo.",
      },
    },
    { key: "garlic", food: "garlic", grams: 5, state: "raw", measure: { unit: "clove", quantity: 1 }, role: "seasoning" },
    { key: "tomato_canned", food: "tomato_canned", grams: 200, state: "as_is", measure: { unit: "can", quantity: 0.5 }, role: "vegetable" },
    { key: "pepper", food: "black_pepper", grams: 0.2, state: "as_is", measure: { unit: "pinch", quantity: 1 }, role: "seasoning" },
    { key: "parsley", food: "parsley", grams: 2, state: "raw", role: "vegetable" },
    { key: "bread", food: "bread", grams: 60, state: "as_is", measure: { unit: "slice", quantity: 1 }, role: "main_carb", adjust: { kind: "count", unitGrams: 60, min: 1, max: 3 } },
  ],
  sides: [
    { key: "bread", label: { ja: "パン", en: "Bread", es: "Pan" }, ingredients: ["bread"], solverMayRemove: true },
  ],
  steps: [
    {
      key: "prep",
      text: {
        ja: "牛肉を3cm角に切って塩をふります。じゃがいもは皮をむいて4等分に、玉ねぎはくし形に切り、にんにくはつぶします。",
        en: "Cut the beef into 3 cm cubes and season with the salt. Peel the potatoes and cut them into quarters, cut the onion into wedges, and crush the garlic.",
        es: "Corta la ternera en dados de 3 cm y sálala. Pela las patatas y córtalas en cuartos, corta la cebolla en gajos y machaca el ajo.",
      },
    },
    {
      key: "brown",
      text: {
        ja: "鍋にオリーブオイルとにんにくを入れて中火にかけ、牛肉の表面全体に焼き色をつけます。",
        en: "Put the olive oil and garlic in a pot over medium heat and brown the beef on all sides.",
        es: "Pon el aceite de oliva y el ajo en una olla a fuego medio y dora la ternera por todos los lados.",
      },
    },
    {
      key: "simmer",
      text: {
        ja: "玉ねぎ、じゃがいも、トマト缶、水150mLを加えて煮立て、ふたをして弱火で25分、じゃがいもがやわらかくなるまで煮込みます。こしょうで味を調えます。",
        en: "Add the onion, potatoes, canned tomatoes, and 150 mL of water, bring to a boil, cover, and simmer over low heat for 25 minutes until the potatoes are tender. Season with pepper.",
        es: "Añade la cebolla, las patatas, el tomate en lata y 150 mL de agua, lleva a ebullición, tapa y guisa a fuego bajo 25 minutos hasta que las patatas estén tiernas. Sazona con pimienta.",
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
      key: "beef_doneness",
      text: {
        ja: "牛肉は赤い部分がなくなるまで煮てください。",
        en: "Simmer the beef until no red remains.",
        es: "Cuece la ternera hasta que no quede nada rojo.",
      },
    },
    {
      key: "cooling",
      text: {
        ja: "作り置きする場合は、浅い容器に移して早めに冷まし、冷蔵庫で保存してください。食べるときは中心まで十分に温め直します。",
        en: "To keep leftovers, transfer them to a shallow container, cool them quickly, and refrigerate. Reheat until piping hot throughout before eating.",
        es: "Si guardas sobras, pásalas a un recipiente poco hondo, enfríalas rápido y guárdalas en el refrigerador. Antes de comer, recaliéntalas hasta que estén bien calientes por dentro.",
      },
    },
  ],
  substitutions: [],
};
