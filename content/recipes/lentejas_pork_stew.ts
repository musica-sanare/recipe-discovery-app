import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "lentejas_pork_stew",
  texts: {
    name: { ja: "レンズ豆と豚もも肉の煮込み（レンテハス）", en: "Lentejas: Spanish lentil stew with lean pork", es: "Lentejas con cerdo magro" },
    summary: {
      ja: "スペインの家庭料理レンテハスを、チョリソの代わりに豚もも肉で作ります。レンズ豆、じゃがいも、にんじん、赤ピーマンをパプリカで煮込みます。パンを添えます。作り置きできます。",
      en: "Spanish home-style lentejas made with lean pork instead of chorizo: lentils, potato, carrot, and red pepper stewed with paprika, with bread. It keeps well.",
      es: "Lentejas caseras preparadas con cerdo magro en lugar de chorizo: lentejas, patata, zanahoria y pimiento rojo guisados con pimentón, con pan. Se pueden preparar por adelantado.",
    },
  },
  cuisine: "spanish",
  goals: ["bulk"],
  mainProteinGroup: "pork",
  tags: ["batch"],
  minutes: 35,
  effort: 2,
  equipment: ["stove", "pot"],
  servings: 1,
  ingredients: [
    { key: "pork", food: "pork_leg", grams: 150, state: "boil", role: "main_protein", adjust: { kind: "grams", min: 110, max: 190, step: 20 } },
    { key: "lentils", food: "lentils", grams: 200, state: "as_is", role: "other" },
    { key: "potato", food: "potato", grams: 100, state: "simmer", measure: { unit: "piece", quantity: 1 }, role: "vegetable" },
    { key: "carrot", food: "carrot", grams: 50, state: "boil", role: "vegetable" },
    { key: "onion", food: "onion", grams: 50, state: "stir_fry", role: "vegetable" },
    { key: "oil_onion", food: "olive_oil", grams: 5, state: "as_is", measure: { unit: "tsp", quantity: 1.25 }, role: "fat", includedIn: "onion" },
    {
      key: "red_pepper",
      food: "red_pepper",
      grams: 40,
      state: "raw",
      cooking: "simmer",
      role: "vegetable",
      note: {
        ja: "成分表に煮込んだ赤ピーマンの値がないため、生の値で計算しています。",
        en: "The tables have no value for stewed red pepper, so the raw value is used.",
        es: "Las tablas no tienen un valor para el pimiento rojo guisado, así que se usa el valor en crudo.",
      },
    },
    { key: "garlic", food: "garlic", grams: 5, state: "raw", measure: { unit: "clove", quantity: 1 }, role: "seasoning" },
    { key: "paprika", food: "paprika_powder", grams: 3, state: "as_is", measure: { unit: "tsp", quantity: 1.5 }, role: "seasoning" },
    { key: "tomato", food: "tomato_canned", grams: 80, state: "as_is", role: "vegetable" },
    { key: "salt", food: "salt", grams: 1.5, state: "as_is", measure: { unit: "pinch", quantity: 3 }, role: "seasoning" },
    { key: "bread", food: "bread", grams: 60, state: "as_is", measure: { unit: "slice", quantity: 1 }, role: "main_carb", adjust: { kind: "grams", min: 30, max: 90, step: 30 } },
  ],
  sides: [
    { key: "bread", label: { ja: "パン", en: "Bread", es: "Pan" }, ingredients: ["bread"], solverMayRemove: true },
  ],
  steps: [
    {
      key: "prep",
      text: {
        ja: "豚もも肉を2cm角に切ります。じゃがいもとにんじんは2cm角、赤ピーマンは1cm角、玉ねぎとにんにくはみじん切りにします。",
        en: "Cut the pork into 2 cm cubes. Dice the potato and carrot into 2 cm pieces and the red pepper into 1 cm pieces, and finely chop the onion and garlic.",
        es: "Corta el cerdo en dados de 2 cm. Corta la patata y la zanahoria en dados de 2 cm y el pimiento rojo en dados de 1 cm, y pica fino la cebolla y el ajo.",
      },
    },
    {
      key: "sofrito",
      text: {
        ja: "鍋にオリーブ油を中火で熱し、玉ねぎ、にんにく、赤ピーマンを5分炒めます。火を弱めてパプリカパウダーを加え、焦がさないように混ぜてからトマト缶を加えます。",
        en: "Heat the olive oil in a pot over medium heat and sauté the onion, garlic, and red pepper for 5 minutes. Lower the heat, stir in the paprika without letting it burn, and add the canned tomatoes.",
        es: "Calienta el aceite de oliva en una olla a fuego medio y sofríe la cebolla, el ajo y el pimiento rojo 5 minutos. Baja el fuego, añade el pimentón sin que se queme y agrega el tomate de lata.",
      },
    },
    {
      key: "stew",
      text: {
        ja: "豚肉、じゃがいも、にんじん、水400mLを加えて煮立て、アクを取りながら弱火で15分煮ます。汁を切ったレンズ豆と塩を加え、さらに5分煮ます。",
        en: "Add the pork, potato, carrot, and 400 mL of water, bring to a boil, and simmer over low heat for 15 minutes, skimming. Add the drained lentils and the salt and simmer for 5 more minutes.",
        es: "Añade el cerdo, la patata, la zanahoria y 400 mL de agua, lleva a ebullición y cuece a fuego bajo 15 minutos, espumando. Añade las lentejas escurridas y la sal y cuece 5 minutos más.",
      },
    },
    {
      key: "serve",
      text: { ja: "器に盛ります。", en: "Serve in a bowl.", es: "Sírvelas en un plato hondo." },
    },
    {
      key: "bread",
      side: "bread",
      text: { ja: "パンを添えます。", en: "Serve with the bread.", es: "Acompáñalo con el pan." },
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
