import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "beef_shimeji_bowl",
  texts: {
    name: { ja: "牛もも肉としめじの甘辛炒め丼", en: "Sweet and savory beef and shimeji rice bowl", es: "Bol de arroz con ternera y setas shimeji en salsa dulce y salada", fr: "Bol de riz au bœuf et aux shimeji, sauce sucrée-salée" },
    summary: {
      ja: "赤身の牛もも肉としめじ、玉ねぎを、にんにくの効いた甘辛だれで炒めてご飯にのせます。",
      en: "Lean beef, shimeji mushrooms, and onion stir-fried in a garlicky sweet and savory soy sauce and served over rice.",
      es: "Ternera magra, setas shimeji y cebolla salteadas en una salsa de soja dulce y salada con ajo, servidas sobre arroz.",
      fr: "Bœuf maigre, champignons shimeji et oignon sautés dans une sauce soja sucrée-salée à l'ail, servis sur du riz.",
    },
  },
  cuisine: "korean",
  goals: ["bulk"],
  mainProteinGroup: "beef",
  tags: [],
  minutes: 20,
  effort: 2,
  equipment: ["stove", "frying_pan"],
  servings: 1,
  ingredients: [
    {
      key: "beef",
      food: "beef_round",
      grams: 180,
      state: "raw",
      cooking: "stir_fry",
      role: "main_protein",
      adjust: { kind: "grams", min: 140, max: 240, step: 10 },
      note: {
        ja: "成分表に炒めた牛もも肉の値がないため、生の値で計算しています。",
        en: "The tables have no value for stir-fried beef round, so the raw value is used.",
        es: "Las tablas no tienen un valor para la ternera salteada, así que se usa el valor en crudo.",
        fr: "Les tables n'ont pas de valeur pour la tende de tranche de bœuf sautée ; la valeur à l'état cru est donc utilisée.",
      },
    },
    { key: "shimeji", food: "shimeji", grams: 80, state: "stir_fry", role: "vegetable" },
    { key: "onion", food: "onion", grams: 60, state: "stir_fry", measure: { unit: "piece", quantity: 0.25 }, role: "vegetable" },
    { key: "oil_vegetables", food: "vegetable_oil", grams: 7, state: "as_is", role: "fat", includedIn: "shimeji" },
    { key: "oil_beef", food: "vegetable_oil", grams: 3, state: "as_is", measure: { unit: "tsp", quantity: 0.75 }, role: "fat", linkedTo: "beef" },
    { key: "garlic", food: "garlic", grams: 5, state: "raw", measure: { unit: "clove", quantity: 1 }, role: "seasoning", linkedTo: "beef" },
    { key: "soy_sauce", food: "soy_sauce", grams: 18, state: "as_is", measure: { unit: "tbsp", quantity: 1 }, role: "seasoning", linkedTo: "beef" },
    { key: "sugar", food: "sugar", grams: 6, state: "as_is", measure: { unit: "tsp", quantity: 2 }, role: "seasoning", linkedTo: "beef" },
    { key: "mirin", food: "mirin", grams: 10, state: "as_is", measure: { unit: "tsp", quantity: 2 }, role: "seasoning", linkedTo: "beef" },
    { key: "sesame_oil", food: "sesame_oil", grams: 3, state: "as_is", role: "fat", linkedTo: "beef" },
    { key: "green_onion", food: "green_onion", grams: 5, state: "raw", role: "vegetable" },
    { key: "rice", food: "rice_cooked", grams: 250, state: "as_is", role: "main_carb", adjust: { kind: "grams", min: 150, max: 350, step: 10 } },
  ],
  sides: [],
  steps: [
    {
      key: "prep",
      text: {
        ja: "牛肉を細切りにし、しょうゆ、砂糖、みりん、すりおろしたにんにくをもみ込みます。しめじは小房に分け、玉ねぎは薄切りにします。",
        en: "Cut the beef into strips and rub in the soy sauce, sugar, mirin, and grated garlic. Separate the shimeji and thinly slice the onion.",
        es: "Corta la ternera en tiras y mézclala con la salsa de soja, el azúcar, el mirin y el ajo rallado. Separa las shimeji y corta la cebolla en láminas finas.",
        fr: "Coupez le bœuf en lanières et frottez-le avec la sauce soja, le sucre, le mirin et l'ail râpé. Séparez les shimeji et émincez finement l'oignon.",
      },
    },
    {
      key: "vegetables",
      text: {
        ja: "フライパンに野菜用の油を中火で熱し、しめじと玉ねぎを3分炒めて取り出します。",
        en: "Heat the oil for the vegetables in a frying pan over medium heat, stir-fry the shimeji and onion for 3 minutes, and set them aside.",
        es: "Calienta el aceite para las verduras en una sartén a fuego medio, saltea las shimeji y la cebolla 3 minutos y resérvalas.",
        fr: "Faites chauffer l'huile des légumes dans une poêle à feu moyen, faites sauter les shimeji et l'oignon 3 minutes et réservez-les.",
      },
    },
    {
      key: "stir_fry",
      text: {
        ja: "残りの油で牛肉を色が変わるまで炒め、野菜を戻してたれごと炒め合わせます。",
        en: "Stir-fry the beef in the remaining oil until browned, return the vegetables, and toss everything with the marinade.",
        es: "Saltea la ternera con el resto del aceite hasta que se dore, devuelve las verduras y mezcla todo con el adobo.",
        fr: "Faites sauter le bœuf dans le reste d'huile jusqu'à ce qu'il soit doré, remettez les légumes et mélangez le tout avec la marinade.",
      },
    },
    {
      key: "serve",
      text: {
        ja: "ごま油を回しかけ、ご飯にのせて青ねぎを散らします。",
        en: "Drizzle with sesame oil, spoon over the rice, and scatter the green onion.",
        es: "Rocía con aceite de sésamo, sírvelo sobre el arroz y esparce la cebolleta.",
        fr: "Arrosez d'huile de sésame, déposez sur le riz et parsemez d'oignon vert.",
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
        fr: "Faites sauter les lanières de bœuf jusqu'à ce qu'elles soient dorées de toutes parts.",
      },
    },
  ],
  substitutions: [],
};
