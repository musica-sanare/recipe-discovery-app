import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "beef_bulgogi",
  texts: {
    name: { ja: "牛もも肉のプルコギ", en: "Lean beef bulgogi", es: "Bulgogi de ternera magra", fr: "Bulgogi de bœuf maigre" },
    summary: {
      ja: "韓国のプルコギをヒントに、牛もも肉をしょうゆ、砂糖、にんにく、ごま油のたれでもみ込み、玉ねぎ、にんじんと炒めます。ご飯を添えます。",
      en: "Inspired by Korean bulgogi: lean beef marinated in soy sauce, sugar, garlic, and sesame oil, stir-fried with onion and carrot, with rice.",
      es: "Inspirado en el bulgogi coreano: ternera magra marinada en salsa de soja, azúcar, ajo y aceite de sésamo, salteada con cebolla y zanahoria, con arroz.",
      fr: "Inspiré du bulgogi coréen : bœuf maigre mariné dans la sauce soja, le sucre, l'ail et l'huile de sésame, sauté avec de l'oignon et de la carotte, avec du riz.",
    },
  },
  cuisine: "korean",
  goals: ["bulk"],
  mainProteinGroup: "beef",
  tags: ["batch"],
  minutes: 20,
  effort: 1,
  equipment: ["stove", "frying_pan"],
  servings: 1,
  ingredients: [
    {
      key: "beef",
      food: "beef_round",
      grams: 200,
      state: "raw",
      cooking: "stir_fry",
      role: "main_protein",
      adjust: { kind: "grams", min: 160, max: 260, step: 20 },
      note: {
        ja: "成分表に炒めた牛もも肉の値がないため、生の値で計算しています。",
        en: "The tables have no value for stir-fried beef round, so the raw value is used.",
        es: "Las tablas no tienen un valor para la ternera salteada, así que se usa el valor en crudo.",
        fr: "Les tables n'ont pas de valeur pour la tende de tranche de bœuf sautée ; la valeur à l'état cru est donc utilisée.",
      },
    },
    { key: "soy_sauce", food: "soy_sauce", grams: 15, state: "as_is", measure: { unit: "tsp", quantity: 2.5 }, role: "seasoning", linkedTo: "beef" },
    { key: "sugar", food: "sugar", grams: 5, state: "as_is", measure: { unit: "tsp", quantity: 1.5 }, role: "seasoning", linkedTo: "beef" },
    { key: "sesame_oil", food: "sesame_oil", grams: 3, state: "as_is", measure: { unit: "tsp", quantity: 0.75 }, role: "fat", linkedTo: "beef" },
    { key: "garlic", food: "garlic", grams: 5, state: "raw", measure: { unit: "clove", quantity: 1 }, role: "seasoning", linkedTo: "beef" },
    { key: "onion", food: "onion", grams: 80, state: "stir_fry", measure: { unit: "piece", quantity: 1 / 3 }, role: "vegetable" },
    { key: "oil_onion", food: "vegetable_oil", grams: 3, state: "as_is", measure: { unit: "tsp", quantity: 0.75 }, role: "fat", includedIn: "onion" },
    { key: "carrot", food: "carrot", grams: 30, state: "raw", cooking: "stir_fry", role: "vegetable" },
    { key: "green_onion", food: "green_onion", grams: 5, state: "raw", role: "vegetable" },
    { key: "rice", food: "rice_cooked", grams: 250, state: "as_is", role: "main_carb", adjust: { kind: "grams", min: 150, max: 350, step: 25 } },
  ],
  sides: [
    { key: "rice", label: { ja: "ご飯", en: "Rice", es: "Arroz", fr: "Riz" }, ingredients: ["rice"], solverMayRemove: true },
  ],
  steps: [
    {
      key: "marinate",
      text: {
        ja: "牛もも肉を細切りにし、しょうゆ、砂糖、すりおろしたにんにく、ごま油をもみ込んで10分置きます。",
        en: "Cut the beef into thin strips and rub in the soy sauce, sugar, grated garlic, and sesame oil. Leave for 10 minutes.",
        es: "Corta la ternera en tiras finas y úntala con la salsa de soja, el azúcar, el ajo rallado y el aceite de sésamo. Déjala reposar 10 minutos.",
        fr: "Coupez le bœuf en fines lanières et frottez-le avec la sauce soja, le sucre, l'ail râpé et l'huile de sésame. Laissez reposer 10 minutes.",
      },
    },
    {
      key: "vegetables",
      text: {
        ja: "玉ねぎを薄切り、にんじんを細切りにします。フライパンに油を中火で熱し、玉ねぎとにんじんを2分炒めます。",
        en: "Thinly slice the onion and cut the carrot into thin strips. Heat the oil in a frying pan over medium heat and stir-fry the onion and carrot for 2 minutes.",
        es: "Corta la cebolla en láminas finas y la zanahoria en tiras finas. Calienta el aceite en una sartén a fuego medio y saltea la cebolla y la zanahoria 2 minutos.",
        fr: "Émincez finement l'oignon et coupez la carotte en fines lanières. Faites chauffer l'huile dans une poêle à feu moyen et faites sauter l'oignon et la carotte 2 minutes.",
      },
    },
    {
      key: "beef",
      text: {
        ja: "牛肉をたれごと加え、強めの中火で3〜4分、肉の色が完全に変わるまで炒めます。刻んだ青ねぎを散らします。",
        en: "Add the beef with its marinade and stir-fry over medium-high heat for 3–4 minutes until the meat has completely changed color. Sprinkle with the chopped green onion.",
        es: "Añade la ternera con su marinada y saltea a fuego medio-alto 3-4 minutos hasta que la carne cambie de color por completo. Espolvorea la cebolleta picada.",
        fr: "Ajoutez le bœuf avec sa marinade et faites sauter 3 à 4 minutes à feu moyen-vif, jusqu'à ce que la viande ait complètement changé de couleur. Parsemez d'oignon vert haché.",
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
      key: "beef_doneness",
      text: {
        ja: "細切りの牛肉は、色が完全に変わるまで炒めてください。",
        en: "Stir-fry the beef strips until they have completely changed color.",
        es: "Saltea las tiras de ternera hasta que cambien de color por completo.",
        fr: "Faites sauter les lanières de bœuf jusqu'à ce qu'elles aient complètement changé de couleur.",
      },
    },
    {
      key: "cooling",
      text: {
        ja: "作り置きする場合は、浅い容器に移して早めに冷まし、冷蔵庫で保存してください。食べるときは中心まで十分に温め直します。",
        en: "To keep leftovers, transfer them to a shallow container, cool them quickly, and refrigerate. Reheat until piping hot throughout before eating.",
        es: "Si guardas sobras, pásalas a un recipiente poco hondo, enfríalas rápido y guárdalas en el refrigerador. Antes de comer, recaliéntalas hasta que estén bien calientes por dentro.",
        fr: "Pour conserver les restes, mettez-les dans un récipient peu profond, faites-les refroidir rapidement et placez-les au réfrigérateur. Avant de les manger, réchauffez-les jusqu'à ce qu'ils soient bien chauds à cœur.",
      },
    },
  ],
  substitutions: [],
};
