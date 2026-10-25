import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "swordfish_teriyaki",
  texts: {
    name: { ja: "めかじきの照り焼き", en: "Swordfish teriyaki", es: "Pez espada al teriyaki" },
    summary: {
      ja: "めかじきを、しょうゆとみりんの甘辛いたれで照り焼きにします。ゆでたブロッコリーとご飯を添えます。",
      en: "Swordfish glazed with a sweet soy and mirin teriyaki sauce, with boiled broccoli and rice.",
      es: "Pez espada glaseado con una salsa teriyaki dulce de soja y mirin, con brócoli hervido y arroz.",
    },
  },
  cuisine: "japanese",
  goals: ["maintain"],
  mainProteinGroup: "fish",
  tags: [],
  minutes: 20,
  effort: 1,
  equipment: ["stove", "frying_pan", "pot"],
  servings: 1,
  ingredients: [
    {
      key: "fish",
      food: "swordfish",
      grams: 160,
      state: "grill",
      cooking: "saute",
      role: "main_protein",
      adjust: { kind: "grams", min: 120, max: 200, step: 20 },
      note: {
        ja: "成分表にソテーしためかじきの値がないため、焼いた値で計算しています。切り身1切れ約100〜120gです。",
        en: "The tables have no value for sautéed swordfish, so the grilled value is used. One steak is about 100–120 g.",
        es: "Las tablas no tienen un valor para el pez espada salteado, así que se usa el valor a la parrilla. Una rodaja pesa unos 100-120 g.",
      },
    },
    { key: "oil", food: "vegetable_oil", grams: 3, state: "as_is", measure: { unit: "tsp", quantity: 0.75 }, role: "fat", linkedTo: "fish" },
    { key: "soy_sauce", food: "soy_sauce", grams: 12, state: "as_is", measure: { unit: "tsp", quantity: 2 }, role: "seasoning", linkedTo: "fish" },
    { key: "mirin", food: "mirin", grams: 12, state: "as_is", measure: { unit: "tsp", quantity: 2 }, role: "seasoning", linkedTo: "fish" },
    { key: "sugar", food: "sugar", grams: 2, state: "as_is", role: "seasoning", linkedTo: "fish" },
    { key: "broccoli", food: "broccoli", grams: 80, state: "boil", role: "vegetable" },
    { key: "rice", food: "rice_cooked", grams: 250, state: "as_is", role: "main_carb", adjust: { kind: "grams", min: 150, max: 350, step: 25 } },
  ],
  sides: [
    { key: "rice", label: { ja: "ご飯", en: "Rice", es: "Arroz" }, ingredients: ["rice"], solverMayRemove: true },
  ],
  steps: [
    {
      key: "broccoli",
      text: {
        ja: "ブロッコリーを小房に分け、沸騰した湯で2分ほどゆでて湯を切ります。",
        en: "Cut the broccoli into florets, boil for about 2 minutes, and drain.",
        es: "Separa el brócoli en ramilletes, hiérvelo unos 2 minutos y escúrrelo.",
      },
    },
    {
      key: "sear",
      text: {
        ja: "めかじきの水気を拭きます。フライパンに油を中火で熱し、めかじきを片面3分ずつ焼きます。",
        en: "Pat the swordfish dry. Heat the oil in a frying pan over medium heat and cook the swordfish for 3 minutes on each side.",
        es: "Seca el pez espada. Calienta el aceite en una sartén a fuego medio y cocina el pez espada 3 minutos por cada lado.",
      },
    },
    {
      key: "glaze",
      text: {
        ja: "しょうゆ、みりん、砂糖を混ぜて加え、弱めの中火で煮詰めながら、たれを全体にからめます。",
        en: "Mix the soy sauce, mirin, and sugar, add them to the pan, and reduce over medium-low heat, coating the fish with the sauce.",
        es: "Mezcla la salsa de soja, el mirin y el azúcar, añádelos a la sartén y reduce a fuego medio-bajo, cubriendo el pescado con la salsa.",
      },
    },
    {
      key: "serve",
      text: {
        ja: "ブロッコリーと一緒に器に盛ります。",
        en: "Plate with the broccoli.",
        es: "Sírvelo con el brócoli.",
      },
    },
    {
      key: "rice",
      side: "rice",
      text: {
        ja: "ご飯を添えます。",
        en: "Serve with the rice.",
        es: "Acompáñalo con el arroz.",
      },
    },
  ],
  safetyNotes: [
    {
      key: "fish_doneness",
      text: {
        ja: "めかじきは中心まで白くなるまで焼いてください。",
        en: "Cook the swordfish until it is opaque in the center.",
        es: "Cocina el pez espada hasta que esté opaco en el centro.",
      },
    },
  ],
  substitutions: [],
};
