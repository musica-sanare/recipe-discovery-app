import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "natto_egg_white_omelette",
  texts: {
    name: { ja: "納豆と卵白のオムレツ", en: "Natto and egg white omelette", es: "Omelet de claras con natto", fr: "Omelette de blancs d'œufs au natto" },
    summary: {
      ja: "納豆と青ねぎを、卵と卵白のオムレツで包みます。ご飯を添えます。",
      en: "An omelette of egg and egg whites folded around natto and green onion, with rice.",
      es: "Una omelet de huevo y claras rellena de natto y cebolleta, con arroz.",
      fr: "Une omelette d'œuf et de blancs d'œufs repliée sur du natto et de l'oignon vert, avec du riz.",
    },
  },
  cuisine: "japanese",
  goals: ["maintain"],
  mainProteinGroup: "egg",
  tags: ["breakfast"],
  minutes: 10,
  effort: 1,
  equipment: ["stove", "frying_pan"],
  servings: 1,
  ingredients: [
    { key: "egg", food: "egg", grams: 50, state: "scramble", measure: { unit: "piece", quantity: 1 }, role: "main_protein", adjust: { kind: "count", unitGrams: 50, min: 1, max: 2 } },
    {
      key: "egg_white",
      food: "egg_white",
      grams: 132,
      state: "raw",
      cooking: "scramble",
      measure: { unit: "piece", quantity: 4 },
      role: "main_protein",
      adjust: { kind: "count", unitGrams: 33, min: 2, max: 6 },
      note: {
        ja: "成分表に加熱した卵白の値がないため、生の値で計算しています。残った黄身は別の料理に使えます。市販の液卵白でも作れます。",
        en: "The tables have no value for cooked egg white, so the raw value is used. Use the leftover yolks in another dish, or use liquid egg white from a carton.",
        es: "Las tablas no tienen un valor para la clara cocinada, así que se usa el valor en crudo. Usa las yemas que sobren en otro plato, o usa clara de huevo líquida envasada.",
        fr: "Les tables n'ont pas de valeur pour le blanc d'œuf cuit ; la valeur à l'état cru est donc utilisée. Utilisez les jaunes restants dans un autre plat, ou prenez du blanc d'œuf liquide en brique.",
      },
    },
    { key: "oil", food: "vegetable_oil", grams: 3, state: "as_is", measure: { unit: "tsp", quantity: 0.75 }, role: "fat" },
    { key: "natto", food: "natto", grams: 40, state: "as_is", measure: { unit: "piece", quantity: 1 }, role: "main_protein", note: { ja: "1パック約40gです。付属のたれは使いません。", en: "One pack is about 40 g. The sauce packet is not used.", es: "Un envase pesa unos 40 g. No se usa el sobre de salsa.", fr: "Une barquette pèse environ 40 g. Le sachet de sauce n'est pas utilisé." } },
    { key: "green_onion", food: "green_onion", grams: 5, state: "raw", role: "vegetable" },
    { key: "soy_sauce", food: "soy_sauce", grams: 3, state: "as_is", measure: { unit: "tsp", quantity: 0.5 }, role: "seasoning" },
    { key: "rice", food: "rice_cooked", grams: 150, state: "as_is", role: "main_carb", adjust: { kind: "grams", min: 100, max: 250, step: 25 } },
  ],
  sides: [
    { key: "rice", label: { ja: "ご飯", en: "Rice", es: "Arroz", fr: "Riz" }, ingredients: ["rice"], solverMayRemove: true },
  ],
  steps: [
    {
      key: "filling",
      text: {
        ja: "納豆にしょうゆと刻んだ青ねぎを混ぜます。卵と卵白はよく溶きほぐします。",
        en: "Mix the natto with the soy sauce and chopped green onion. Beat the egg and egg whites well.",
        es: "Mezcla el natto con la salsa de soja y la cebolleta picada. Bate bien el huevo y las claras.",
        fr: "Mélangez le natto avec la sauce soja et l'oignon vert haché. Battez bien l'œuf et les blancs d'œufs.",
      },
    },
    {
      key: "omelette",
      text: {
        ja: "フライパンに油を中火で熱して卵液を流し入れ、大きく混ぜて半熟になったら弱火にします。片側に納豆をのせて折りたたみ、ふたをして1〜2分、中まで固まるまで焼きます。",
        en: "Heat the oil in a frying pan over medium heat, pour in the eggs, and stir in large folds; when half set, turn to low heat. Put the natto on one side, fold the omelette over, cover, and cook for 1–2 minutes until set inside.",
        es: "Calienta el aceite en una sartén a fuego medio, vierte el huevo batido y remueve con movimientos amplios; cuando esté a medio cuajar, baja a fuego bajo. Pon el natto en un lado, dobla la omelet, tapa y cocina 1-2 minutos hasta que cuaje por dentro.",
        fr: "Faites chauffer l'huile dans une poêle à feu moyen, versez les œufs et remuez à grands gestes ; quand ils sont à moitié pris, passez à feu doux. Posez le natto d'un côté, repliez l'omelette, couvrez et faites cuire 1 à 2 minutes jusqu'à ce que l'intérieur soit pris.",
      },
    },
    {
      key: "rice",
      side: "rice",
      text: {
        ja: "ご飯を添えます。",
        en: "Serve with the rice.",
        es: "Acompáñalo con el arroz.",
        fr: "Servez avec le riz.",
      },
    },
  ],
  safetyNotes: [
    {
      key: "egg_set",
      text: {
        ja: "卵は中まで固まるまで加熱してください。",
        en: "Cook the eggs until set inside.",
        es: "Cocina los huevos hasta que cuajen por dentro.",
        fr: "Faites cuire les œufs jusqu'à ce que l'intérieur soit pris.",
      },
    },
  ],
  substitutions: [],
};
