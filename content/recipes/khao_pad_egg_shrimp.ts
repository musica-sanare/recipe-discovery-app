import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "khao_pad_egg_shrimp",
  texts: {
    name: { ja: "卵とえびのカオパット", en: "Khao pad with egg and shrimp", es: "Khao pad de huevo y gambas" },
    summary: {
      ja: "タイの炒めご飯カオパットを、卵と卵白、えびでボリュームを出して作ります。ライムときゅうりを添えます。",
      en: "Thai khao pad fried rice made hearty with eggs, egg whites, and shrimp, served with lime and cucumber.",
      es: "Arroz frito tailandés khao pad, contundente con huevos, claras y gambas, servido con lima y pepino.",
    },
  },
  cuisine: "southeast_asian",
  goals: ["bulk"],
  mainProteinGroup: "egg",
  tags: [],
  minutes: 15,
  effort: 1,
  equipment: ["stove", "frying_pan"],
  servings: 1,
  ingredients: [
    { key: "egg", food: "egg", grams: 100, state: "scramble", measure: { unit: "piece", quantity: 2 }, role: "main_protein", adjust: { kind: "count", unitGrams: 50, min: 2, max: 3 } },
    { key: "oil_egg", food: "vegetable_oil", grams: 5, state: "as_is", measure: { unit: "tsp", quantity: 1.25 }, role: "fat", includedIn: "egg" },
    {
      key: "egg_white",
      food: "egg_white",
      grams: 150,
      state: "raw",
      cooking: "scramble",
      role: "main_protein",
      note: {
        ja: "成分表に炒めた卵白の値がないため、生の値で計算しています。",
        en: "The tables have no value for scrambled egg white, so the raw value is used.",
        es: "Las tablas no tienen un valor para la clara revuelta, así que se usa el valor en crudo.",
      },
    },
    {
      key: "shrimp",
      food: "shrimp",
      grams: 80,
      state: "raw",
      cooking: "stir_fry",
      role: "other",
      note: {
        ja: "成分表に炒めたえびの値がないため、生の値で計算しています。",
        en: "The tables have no value for stir-fried shrimp, so the raw value is used.",
        es: "Las tablas no tienen un valor para las gambas salteadas, así que se usa el valor en crudo.",
      },
    },
    { key: "oil", food: "vegetable_oil", grams: 4, state: "as_is", measure: { unit: "tsp", quantity: 1 }, role: "fat" },
    { key: "onion", food: "onion", grams: 40, state: "stir_fry", role: "vegetable" },
    { key: "green_onion", food: "green_onion", grams: 10, state: "raw", role: "vegetable" },
    { key: "fish_sauce", food: "fish_sauce", grams: 10, state: "as_is", measure: { unit: "tsp", quantity: 2 }, role: "seasoning" },
    { key: "oyster", food: "oyster_sauce", grams: 6, state: "as_is", measure: { unit: "tsp", quantity: 1 }, role: "seasoning" },
    { key: "sugar", food: "sugar", grams: 2, state: "as_is", role: "seasoning" },
    { key: "lime", food: "lime_juice", grams: 5, state: "as_is", measure: { unit: "tsp", quantity: 1 }, role: "seasoning" },
    { key: "cucumber", food: "cucumber", grams: 50, state: "raw", measure: { unit: "piece", quantity: 0.5 }, role: "vegetable" },
    { key: "rice", food: "rice_cooked", grams: 300, state: "as_is", role: "main_carb", adjust: { kind: "grams", min: 250, max: 350, step: 50 } },
  ],
  sides: [],
  steps: [
    {
      key: "prep",
      text: {
        ja: "えびは背わたを取ります。玉ねぎは粗みじん、青ねぎは小口切り、きゅうりは輪切りにします。卵と卵白を合わせてよく溶きます。",
        en: "Devein the shrimp. Coarsely chop the onion, slice the green onion thinly, and slice the cucumber into rounds. Beat the eggs and egg whites together well.",
        es: "Quita el intestino a las gambas. Pica la cebolla en trozos, corta la cebolleta en rodajas finas y el pepino en rodajas. Bate bien juntos los huevos y las claras.",
      },
    },
    {
      key: "egg",
      text: {
        ja: "フライパンに卵用の油を強めの中火で熱し、卵液を入れて大きく混ぜ、固まったら取り出します。",
        en: "Heat the oil for the eggs in a frying pan over medium-high heat, add the egg mixture, stir in large strokes, and take it out once set.",
        es: "Calienta en una sartén a fuego medio-alto el aceite de los huevos, añade el huevo batido, remueve con movimientos amplios y sácalo cuando cuaje.",
      },
    },
    {
      key: "stir_fry",
      text: {
        ja: "同じフライパンに油を熱し、玉ねぎとえびを炒めます。えびの色が変わったらご飯を加えてほぐしながら炒め、ナンプラー、オイスターソース、砂糖で調味します。卵を戻して混ぜ、青ねぎを加えます。",
        en: "Heat the oil in the same pan and stir-fry the onion and shrimp. When the shrimp change color, add the rice and stir-fry, breaking it up, then season with the fish sauce, oyster sauce, and sugar. Return the eggs, toss, and add the green onion.",
        es: "Calienta el aceite en la misma sartén y saltea la cebolla y las gambas. Cuando las gambas cambien de color, añade el arroz y saltéalo, soltándolo, y sazona con la salsa de pescado, la salsa de ostras y el azúcar. Devuelve el huevo, mezcla y añade la cebolleta.",
      },
    },
    {
      key: "serve",
      text: {
        ja: "器に盛り、きゅうりを添えて、ライム果汁をかけて食べます。",
        en: "Plate it with the cucumber and squeeze the lime juice over before eating.",
        es: "Sírvelo con el pepino y rocía con el zumo de lima antes de comer.",
      },
    },
  ],
  safetyNotes: [
    {
      key: "shrimp_doneness",
      text: {
        ja: "えびは全体が赤くなり、身が白く不透明になるまで加熱してください。",
        en: "Cook the shrimp until they are pink all over and the flesh is white and opaque.",
        es: "Cocina las gambas hasta que estén rosadas por completo y la carne esté blanca y opaca.",
      },
    },
    {
      key: "egg_set",
      text: {
        ja: "卵は固まるまで加熱してください。",
        en: "Cook the eggs until set.",
        es: "Cocina los huevos hasta que cuajen.",
      },
    },
  ],
  substitutions: [],
};
