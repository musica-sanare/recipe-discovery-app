import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "pork_kimchi_tofu",
  texts: {
    name: { ja: "豚ヒレ肉のキムチ炒めと豆腐", en: "Pork tenderloin and kimchi stir-fry with tofu", es: "Salteado de solomillo de cerdo y kimchi con tofu", fr: "Sauté de filet mignon de porc au kimchi et tofu" },
    summary: {
      ja: "韓国のトゥブキムチをヒントに、豚ヒレ肉と白菜キムチを炒め、温めた豆腐に添えます。ご飯を添えます。",
      en: "Inspired by Korean dubu kimchi: pork tenderloin stir-fried with napa cabbage kimchi, served next to warm tofu, with rice.",
      es: "Inspirado en el dubu kimchi coreano: solomillo de cerdo salteado con kimchi de col china, servido junto a tofu caliente, con arroz.",
      fr: "Inspiré du dubu kimchi coréen : filet mignon de porc sauté au kimchi de chou chinois, servi à côté de tofu chaud, avec du riz.",
    },
  },
  cuisine: "korean",
  goals: ["cut"],
  mainProteinGroup: "pork",
  tags: [],
  minutes: 15,
  effort: 1,
  equipment: ["stove", "frying_pan"],
  servings: 1,
  ingredients: [
    {
      key: "pork",
      food: "pork_fillet",
      grams: 140,
      state: "raw",
      cooking: "stir_fry",
      role: "main_protein",
      adjust: { kind: "grams", min: 100, max: 180, step: 20 },
      note: {
        ja: "成分表に炒めた豚ヒレ肉の値がないため、生の値で計算しています。",
        en: "The tables have no value for stir-fried pork tenderloin, so the raw value is used.",
        es: "Las tablas no tienen un valor para el solomillo de cerdo salteado, así que se usa el valor en crudo.",
        fr: "Les tables n'ont pas de valeur pour le filet mignon de porc sauté ; la valeur à l'état cru est donc utilisée.",
      },
    },
    { key: "oil", food: "vegetable_oil", grams: 2, state: "as_is", measure: { unit: "tsp", quantity: 0.5 }, role: "fat", linkedTo: "pork" },
    { key: "kimchi", food: "kimchi", grams: 100, state: "as_is", role: "vegetable" },
    { key: "onion", food: "onion", grams: 40, state: "stir_fry", role: "vegetable" },
    { key: "sugar", food: "sugar", grams: 2, state: "as_is", role: "seasoning" },
    { key: "soy_sauce", food: "soy_sauce", grams: 3, state: "as_is", measure: { unit: "tsp", quantity: 0.5 }, role: "seasoning" },
    {
      key: "tofu",
      food: "tofu_firm",
      grams: 100,
      state: "raw",
      cooking: "boil",
      measure: { unit: "block", quantity: 1 / 3 },
      role: "other",
      note: {
        ja: "成分表にゆでた豆腐の値がないため、生の値で計算しています。",
        en: "The tables have no value for boiled tofu, so the raw value is used.",
        es: "Las tablas no tienen un valor para el tofu hervido, así que se usa el valor en crudo.",
        fr: "Les tables n'ont pas de valeur pour le tofu bouilli ; la valeur à l'état cru est donc utilisée.",
      },
    },
    { key: "green_onion", food: "green_onion", grams: 10, state: "raw", role: "vegetable" },
    { key: "rice", food: "rice_cooked", grams: 150, state: "as_is", role: "main_carb", adjust: { kind: "grams", min: 100, max: 200, step: 50 } },
  ],
  sides: [
    { key: "rice", label: { ja: "ご飯", en: "Rice", es: "Arroz", fr: "Riz" }, ingredients: ["rice"], solverMayRemove: true },
  ],
  steps: [
    {
      key: "prep",
      text: {
        ja: "豚ヒレ肉を5mm厚さに切ります。玉ねぎは薄切り、キムチは大きければざく切り、青ねぎは小口切りにします。",
        en: "Slice the pork tenderloin 5 mm thick. Thinly slice the onion, roughly chop the kimchi if the pieces are large, and slice the green onion thinly.",
        es: "Corta el solomillo de cerdo en rodajas de 5 mm. Corta la cebolla en láminas finas, trocea el kimchi si los trozos son grandes y corta la cebolleta en rodajas finas.",
        fr: "Coupez le filet mignon en tranches de 5 mm. Émincez finement l'oignon, coupez grossièrement le kimchi si les morceaux sont gros et émincez finement l'oignon vert.",
      },
    },
    {
      key: "tofu",
      text: {
        ja: "豆腐を4等分に切り、湯を沸かした鍋で弱火で3分ほど温め、湯を切って器に並べます。",
        en: "Cut the tofu into 4 pieces, warm it in a pot of simmering water over low heat for about 3 minutes, drain, and arrange it on a plate.",
        es: "Corta el tofu en 4 trozos, caliéntalo en una olla con agua a fuego bajo unos 3 minutos, escúrrelo y colócalo en un plato.",
        fr: "Coupez le tofu en 4 morceaux, réchauffez-le environ 3 minutes à feu doux dans une casserole d'eau frémissante, égouttez-le et disposez-le sur une assiette.",
      },
    },
    {
      key: "stir_fry",
      text: {
        ja: "フライパンに油を中火で熱し、豚肉を炒めます。色が変わったら玉ねぎとキムチを加えて2〜3分炒め、砂糖としょうゆで調味します。",
        en: "Heat the oil in a frying pan over medium heat and stir-fry the pork. When it changes color, add the onion and kimchi, stir-fry for 2–3 minutes, and season with the sugar and soy sauce.",
        es: "Calienta el aceite en una sartén a fuego medio y saltea el cerdo. Cuando cambie de color, añade la cebolla y el kimchi, saltea 2-3 minutos y sazona con el azúcar y la salsa de soja.",
        fr: "Faites chauffer l'huile dans une poêle à feu moyen et faites sauter le porc. Quand il change de couleur, ajoutez l'oignon et le kimchi, faites sauter 2 à 3 minutes et assaisonnez avec le sucre et la sauce soja.",
      },
    },
    {
      key: "serve",
      text: {
        ja: "豆腐の横に盛り、青ねぎを散らします。",
        en: "Plate it next to the tofu and scatter the green onion over.",
        es: "Sírvelo junto al tofu y esparce la cebolleta por encima.",
        fr: "Dressez à côté du tofu et parsemez d'oignon vert.",
      },
    },
    {
      key: "rice",
      side: "rice",
      text: { ja: "ご飯を添えます。", en: "Serve with the rice.", es: "Acompáñalo con el arroz.", fr: "Servez avec le riz." },
    },
  ],
  safetyNotes: [
    {
      key: "pork_doneness",
      text: {
        ja: "豚肉は中心まで火を通してください。切り口に赤みがないことを確認します。",
        en: "Cook the pork through. Check that no pink remains when you cut it.",
        es: "Cocina bien el cerdo. Comprueba que no quede nada rosado al cortarlo.",
        fr: "Faites cuire le porc à cœur. Vérifiez qu'il ne reste pas de rose à la découpe.",
      },
    },
  ],
  substitutions: [],
};
