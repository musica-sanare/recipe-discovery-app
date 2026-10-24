import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "swordfish_lemon_herb",
  texts: {
    name: { ja: "めかじきのレモンハーブ焼き", en: "Lemon and herb swordfish", es: "Pez espada al limón y hierbas" },
    summary: {
      ja: "めかじきをにんにくとパセリで焼き、レモン汁で仕上げます。じゃがいもを添えます。",
      en: "Swordfish pan-fried with garlic and parsley and finished with lemon juice, with potatoes.",
      es: "Pez espada a la sartén con ajo y perejil, terminado con zumo de limón, con patatas.",
    },
  },
  cuisine: "western",
  goals: ["cut"],
  mainProteinGroup: "fish",
  tags: [],
  minutes: 15,
  effort: 1,
  equipment: ["stove", "frying_pan", "microwave"],
  servings: 1,
  ingredients: [
    {
      key: "fish",
      food: "swordfish",
      grams: 170,
      state: "grill",
      cooking: "saute",
      measure: { unit: "piece", quantity: 1.5 },
      role: "main_protein",
      adjust: { kind: "grams", min: 120, max: 240, step: 10 },
      note: {
        ja: "成分表にソテーしためかじきの値がないため、焼いた値で計算しています。切り身1切れ約100〜120gです。",
        en: "The tables have no value for pan-fried swordfish, so the grilled value is used. One fillet is about 100–120 g.",
        es: "Las tablas no tienen un valor para el pez espada a la sartén, así que se usa el valor a la parrilla. Un filete pesa unos 100-120 g.",
      },
    },
    { key: "oil_fish", food: "olive_oil", grams: 2, state: "as_is", measure: { unit: "tsp", quantity: 0.5 }, role: "fat", linkedTo: "fish" },
    { key: "garlic", food: "garlic", grams: 5, state: "raw", measure: { unit: "clove", quantity: 1 }, role: "seasoning", linkedTo: "fish" },
    { key: "salt", food: "salt", grams: 1, state: "as_is", measure: { unit: "pinch", quantity: 2 }, role: "seasoning", linkedTo: "fish" },
    { key: "pepper", food: "black_pepper", grams: 0.2, state: "as_is", measure: { unit: "pinch", quantity: 1 }, role: "seasoning", linkedTo: "fish" },
    { key: "lemon_juice", food: "lemon_juice", grams: 10, state: "as_is", measure: { unit: "tsp", quantity: 2 }, role: "seasoning" },
    { key: "parsley", food: "parsley", grams: 3, state: "raw", role: "vegetable" },
    { key: "potato", food: "potato", grams: 250, state: "microwave", measure: { unit: "piece", quantity: 2 }, role: "main_carb", adjust: { kind: "grams", min: 100, max: 350, step: 50 } },
  ],
  sides: [
    { key: "potato", label: { ja: "じゃがいも", en: "Potatoes", es: "Patatas" }, ingredients: ["potato"], solverMayRemove: true },
  ],
  steps: [
    {
      key: "prep",
      text: {
        ja: "めかじきに塩とこしょうをふります。にんにくとパセリはみじん切りにします。",
        en: "Season the swordfish with salt and pepper. Finely chop the garlic and parsley.",
        es: "Salpimienta el pez espada. Pica fino el ajo y el perejil.",
      },
    },
    {
      key: "sear",
      text: {
        ja: "フライパンにオリーブオイルとにんにくを入れて中火にかけ、めかじきを片面3分ずつ、中まで白くなるまで焼きます。",
        en: "Put the olive oil and garlic in a frying pan over medium heat and cook the swordfish for 3 minutes on each side until it is opaque all the way through.",
        es: "Pon el aceite de oliva y el ajo en una sartén a fuego medio y cocina el pez espada 3 minutos por cada lado hasta que esté opaco por dentro.",
      },
    },
    {
      key: "serve",
      text: {
        ja: "器に盛り、レモン汁をかけてパセリを散らします。",
        en: "Transfer to a plate, pour over the lemon juice, and scatter the parsley.",
        es: "Sírvelo en un plato, riega con el zumo de limón y esparce el perejil.",
      },
    },
    {
      key: "potato",
      side: "potato",
      text: {
        ja: "じゃがいもをよく洗い、皮つきのまま1個ずつラップで包んで600Wで5〜6分、竹串がすっと通るまで加熱します。皮をむいて添えます。",
        en: "Scrub the potatoes, wrap each one in plastic wrap with the skin on, and heat at 600 W for 5–6 minutes until a skewer slides in easily. Peel and serve alongside.",
        es: "Lava bien las patatas, envuelve cada una con piel en film y caliéntalas a 600 W durante 5-6 minutos hasta que un palillo entre con facilidad. Pélalas y sírvelas al lado.",
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
    {
      key: "steam",
      text: {
        ja: "加熱直後は蒸気でやけどしやすいので、ラップは奥から手前に向かって外してください。",
        en: "Steam can burn right after heating; peel the wrap away from you.",
        es: "El vapor puede quemar justo después de calentar; retira el film en dirección contraria a ti.",
      },
    },
  ],
  substitutions: [],
};
