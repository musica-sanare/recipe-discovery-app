import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "beef_stuffed_peppers_rice",
  texts: {
    name: { ja: "牛もも肉のピーマン肉詰め トマトソース", en: "Green peppers stuffed with lean beef in tomato sauce", es: "Pimientos verdes rellenos de ternera con salsa de tomate" },
    summary: {
      ja: "細かく刻んだ牛もも肉、炒めた玉ねぎ、ご飯を混ぜてピーマンに詰め、トマトソースをかけてトースターで焼きます。ご飯を添えます。",
      en: "Green peppers stuffed with finely chopped lean beef, sautéed onion, and rice, topped with tomato sauce and baked in a toaster oven, with rice.",
      es: "Pimientos verdes rellenos de ternera magra picada, cebolla sofrita y arroz, cubiertos con salsa de tomate y gratinados en el horno tostador, con arroz.",
    },
  },
  cuisine: "western",
  goals: ["maintain"],
  mainProteinGroup: "beef",
  tags: [],
  minutes: 40,
  effort: 3,
  equipment: ["oven_toaster", "stove", "frying_pan"],
  servings: 1,
  ingredients: [
    {
      key: "beef",
      food: "beef_round",
      grams: 150,
      state: "grill",
      role: "main_protein",
      adjust: { kind: "grams", min: 120, max: 180, step: 30 },
      note: {
        ja: "包丁で細かく刻み、詰めてから焼いた牛もも肉として、焼いた値で計算しています。",
        en: "Chopped with a knife, stuffed, and baked, so the grilled value of beef round is used.",
        es: "Picada a cuchillo, rellena y gratinada, así que se usa el valor de la ternera de pierna asada.",
      },
    },
    {
      key: "peppers",
      food: "green_pepper",
      grams: 120,
      state: "raw",
      cooking: "grill",
      measure: { unit: "piece", quantity: 4 },
      role: "vegetable",
      note: {
        ja: "成分表に焼いたピーマンの値がないため、生の値で計算しています。",
        en: "The tables have no value for grilled green pepper, so the raw value is used.",
        es: "Las tablas no tienen un valor para el pimiento verde asado, así que se usa el valor en crudo.",
      },
    },
    { key: "onion", food: "onion", grams: 40, state: "stir_fry", role: "vegetable" },
    { key: "oil_onion", food: "vegetable_oil", grams: 3, state: "as_is", measure: { unit: "tsp", quantity: 0.75 }, role: "fat", includedIn: "onion" },
    { key: "filling_rice", food: "rice_cooked", grams: 60, state: "as_is", role: "other" },
    { key: "egg_white", food: "egg_white", grams: 30, state: "raw", cooking: "grill", role: "other" },
    { key: "tomato", food: "tomato_canned", grams: 100, state: "as_is", measure: { unit: "can", quantity: 0.25 }, role: "vegetable" },
    { key: "salt", food: "salt", grams: 1, state: "as_is", measure: { unit: "pinch", quantity: 2 }, role: "seasoning" },
    { key: "rice", food: "rice_cooked", grams: 150, state: "as_is", role: "main_carb", adjust: { kind: "grams", min: 100, max: 200, step: 50 } },
  ],
  sides: [
    { key: "rice", label: { ja: "ご飯", en: "Rice", es: "Arroz" }, ingredients: ["rice"], solverMayRemove: true },
  ],
  steps: [
    {
      key: "onion",
      text: {
        ja: "玉ねぎをみじん切りにし、フライパンに油を中火で熱して3分ほど炒め、冷まします。",
        en: "Finely chop the onion, sauté it in the oil in a frying pan over medium heat for about 3 minutes, and let it cool.",
        es: "Pica fino la cebolla, sofríela en el aceite en una sartén a fuego medio unos 3 minutos y deja que se enfríe.",
      },
    },
    {
      key: "filling",
      text: {
        ja: "牛もも肉を包丁で細かく刻み、玉ねぎ、詰め物用のご飯、卵白、塩の半量と混ぜます。ピーマンを縦半分に切って種を取り、具をすき間なく詰めます。",
        en: "Finely chop the beef with a knife and mix it with the onion, the rice for the filling, the egg white, and half of the salt. Halve the peppers lengthwise, remove the seeds, and pack the filling in firmly.",
        es: "Pica la ternera a cuchillo y mézclala con la cebolla, el arroz del relleno, la clara y la mitad de la sal. Corta los pimientos por la mitad a lo largo, quítales las semillas y rellénalos bien.",
      },
    },
    {
      key: "bake",
      text: {
        ja: "耐熱皿に並べ、トマト缶を残りの塩と混ぜてかけます。トースターで15〜18分焼き、1個を切って中まで火が通っていることを確かめます。",
        en: "Arrange them in a heatproof dish and pour over the canned tomatoes mixed with the rest of the salt. Bake in the toaster oven for 15–18 minutes and cut one open to check that it is cooked through.",
        es: "Colócalos en una fuente para horno y vierte por encima el tomate de lata mezclado con el resto de la sal. Gratínalos en el horno tostador 15-18 minutos y abre uno para comprobar que esté bien hecho por dentro.",
      },
    },
    {
      key: "rice",
      side: "rice",
      text: { ja: "ご飯を添えます。", en: "Serve with the rice.", es: "Acompáñalo con el arroz." },
    },
  ],
  safetyNotes: [
    {
      key: "mince_doneness",
      text: {
        ja: "肉詰めは中心まで火を通してください。1個を切って、中にピンク色が残っていないことを確かめます。",
        en: "Cook the stuffed peppers through. Cut one open and check that no pink remains inside.",
        es: "Cocina bien los pimientos rellenos. Abre uno y comprueba que no quede nada rosado por dentro.",
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
