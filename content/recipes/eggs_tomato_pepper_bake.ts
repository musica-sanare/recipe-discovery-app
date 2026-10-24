import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "eggs_tomato_pepper_bake",
  texts: {
    name: { ja: "卵とトマト、ピーマンのトースター焼き", en: "Baked eggs with tomato and green pepper", es: "Huevos al horno con tomate y pimiento verde" },
    summary: {
      ja: "スペインの家庭料理をヒントに、炒めた野菜とトマトに卵を落としてオーブントースターで焼きます。パンを添えます。",
      en: "Inspired by Spanish home cooking: eggs baked in a toaster oven on sautéed vegetables and tomato, with bread.",
      es: "Inspirado en la cocina casera española: huevos al horno sobre verduras salteadas y tomate, con pan.",
    },
  },
  cuisine: "spanish",
  goals: ["maintain"],
  mainProteinGroup: "egg",
  tags: [],
  minutes: 20,
  effort: 2,
  equipment: ["stove", "frying_pan", "oven_toaster"],
  servings: 1,
  ingredients: [
    {
      key: "egg",
      food: "egg",
      grams: 150,
      state: "poach",
      cooking: "grill",
      measure: { unit: "piece", quantity: 3 },
      role: "main_protein",
      adjust: { kind: "count", unitGrams: 50, min: 2, max: 4 },
      note: {
        ja: "成分表に焼いた卵の値がないため、ポーチドエッグの値で計算しています。",
        en: "The tables have no value for baked eggs, so the poached-egg value is used.",
        es: "Las tablas no tienen un valor para huevos al horno, así que se usa el valor del huevo escalfado.",
      },
    },
    { key: "green_pepper", food: "green_pepper", grams: 60, state: "stir_fry", measure: { unit: "piece", quantity: 2 }, role: "vegetable" },
    { key: "onion", food: "onion", grams: 50, state: "stir_fry", role: "vegetable" },
    { key: "oil_vegetables", food: "olive_oil", grams: 6, state: "as_is", measure: { unit: "tsp", quantity: 1.5 }, role: "fat", includedIn: "green_pepper" },
    { key: "tomato_canned", food: "tomato_canned", grams: 150, state: "as_is", role: "vegetable" },
    { key: "garlic", food: "garlic", grams: 5, state: "raw", measure: { unit: "clove", quantity: 1 }, role: "seasoning" },
    { key: "salt", food: "salt", grams: 1, state: "as_is", measure: { unit: "pinch", quantity: 2 }, role: "seasoning" },
    { key: "bread", food: "bread", grams: 60, state: "as_is", measure: { unit: "slice", quantity: 1 }, role: "main_carb", adjust: { kind: "count", unitGrams: 60, min: 1, max: 3 } },
  ],
  sides: [
    { key: "bread", label: { ja: "パン", en: "Bread", es: "Pan" }, ingredients: ["bread"], solverMayRemove: true },
  ],
  steps: [
    {
      key: "prep",
      text: {
        ja: "ピーマンは細切り、玉ねぎは薄切りにし、にんにくはみじん切りにします。",
        en: "Cut the green peppers into strips, thinly slice the onion, and finely chop the garlic.",
        es: "Corta los pimientos verdes en tiras, la cebolla en láminas finas y pica fino el ajo.",
      },
    },
    {
      key: "vegetables",
      text: {
        ja: "フライパンにオリーブオイルとにんにくを入れて中火にかけ、ピーマンと玉ねぎを3分炒めます。トマト缶と塩を加えて3分煮詰めます。",
        en: "Put the olive oil and garlic in a frying pan over medium heat and stir-fry the peppers and onion for 3 minutes. Add the canned tomatoes and salt and cook down for 3 minutes.",
        es: "Pon el aceite de oliva y el ajo en una sartén a fuego medio y saltea los pimientos y la cebolla 3 minutos. Añade el tomate en lata y la sal y deja reducir 3 minutos.",
      },
    },
    {
      key: "bake",
      text: {
        ja: "耐熱皿に移してくぼみを作り、卵を割り入れます。オーブントースターで白身が白く固まるまで8〜10分焼きます。",
        en: "Transfer to an ovenproof dish, make hollows, and crack in the eggs. Bake in a toaster oven for 8–10 minutes until the whites are opaque and set.",
        es: "Pásalo a una fuente apta para horno, haz huecos y casca los huevos dentro. Hornea en un horno tostador 8-10 minutos hasta que las claras estén opacas y cuajadas.",
      },
    },
    {
      key: "serve",
      text: {
        ja: "熱いうちに食卓に出します。",
        en: "Serve hot.",
        es: "Sírvelo caliente.",
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
      key: "soft_yolk",
      text: {
        ja: "黄身がやわらかい卵は、妊娠中の方、乳幼児、高齢の方、体調のすぐれない方には向きません。その場合は黄身まで固まるまで加熱してください。",
        en: "Eggs with runny yolks are not recommended for pregnant people, young children, older adults, or anyone unwell; for them, cook until the yolks are firm.",
        es: "Los huevos con la yema líquida no se recomiendan para embarazadas, niños pequeños, personas mayores o enfermas; en esos casos, cocínalos hasta que la yema esté firme.",
      },
    },
    {
      key: "hot_dish",
      text: {
        ja: "焼き上がった耐熱皿はとても熱いので、ミトンを使って取り出してください。",
        en: "The baked dish is very hot; use oven gloves to take it out.",
        es: "La fuente sale muy caliente; usa manoplas para sacarla.",
      },
    },
  ],
  substitutions: [],
};
