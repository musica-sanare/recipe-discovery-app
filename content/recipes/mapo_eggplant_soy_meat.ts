import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "mapo_eggplant_soy_meat",
  texts: {
    name: { ja: "大豆ミートの麻婆なす", en: "Mapo eggplant with soy mince", es: "Berenjena mapo con soja texturizada" },
    summary: {
      ja: "中華の麻婆茄子を、ひき肉の代わりに大豆ミートで作り、木綿豆腐も加えます。豆板醤のきいたとろみのあるたれでまとめます。ご飯を添えます。",
      en: "Chinese mapo eggplant made with soy mince instead of minced meat, plus firm tofu, in a thickened sauce with doubanjiang, with rice.",
      es: "Berenjena mapo china preparada con soja texturizada en lugar de carne picada y con tofu firme, en una salsa espesada con doubanjiang, con arroz.",
    },
  },
  cuisine: "chinese",
  goals: ["maintain"],
  mainProteinGroup: "soy",
  tags: [],
  minutes: 20,
  effort: 2,
  equipment: ["stove", "frying_pan"],
  servings: 1,
  ingredients: [
    {
      key: "soy_meat",
      food: "soy_meat",
      grams: 50,
      state: "raw",
      cooking: "stir_fry",
      role: "main_protein",
      adjust: { kind: "grams", min: 30, max: 60, step: 10 },
      note: {
        ja: "成分表に戻して加熱した大豆ミートの値がないため、乾燥品の値で計算しています。",
        en: "The tables have no value for rehydrated, cooked soy mince, so the value of the dry product is used.",
        es: "Las tablas no tienen un valor para la soja texturizada rehidratada y cocinada, así que se usa el valor del producto seco.",
      },
    },
    { key: "eggplant", food: "eggplant", grams: 150, state: "stir_fry", measure: { unit: "piece", quantity: 2 }, role: "vegetable" },
    { key: "oil_eggplant", food: "vegetable_oil", grams: 7, state: "as_is", measure: { unit: "tsp", quantity: 1.75 }, role: "fat", includedIn: "eggplant" },
    {
      key: "tofu",
      food: "tofu_firm",
      grams: 100,
      state: "raw",
      cooking: "simmer",
      measure: { unit: "block", quantity: 1 / 3 },
      role: "other",
      note: {
        ja: "成分表に煮た豆腐の値がないため、生の値で計算しています。",
        en: "The tables have no value for simmered tofu, so the raw value is used.",
        es: "Las tablas no tienen un valor para el tofu cocido, así que se usa el valor en crudo.",
      },
    },
    { key: "long_onion", food: "long_onion", grams: 20, state: "raw", cooking: "stir_fry", role: "vegetable" },
    { key: "garlic", food: "garlic", grams: 3, state: "raw", measure: { unit: "clove", quantity: 0.5 }, role: "seasoning" },
    { key: "ginger", food: "ginger", grams: 3, state: "raw", role: "seasoning" },
    { key: "doubanjiang", food: "doubanjiang", grams: 6, state: "as_is", measure: { unit: "tsp", quantity: 1 }, role: "seasoning" },
    { key: "soy_sauce", food: "soy_sauce", grams: 6, state: "as_is", measure: { unit: "tsp", quantity: 1 }, role: "seasoning" },
    { key: "sugar", food: "sugar", grams: 2, state: "as_is", role: "seasoning" },
    { key: "stock", food: "chinese_stock_granules", grams: 2, state: "as_is", role: "seasoning" },
    { key: "starch", food: "potato_starch", grams: 3, state: "as_is", measure: { unit: "tsp", quantity: 1 }, role: "other" },
    { key: "sesame_oil", food: "sesame_oil", grams: 2, state: "as_is", measure: { unit: "tsp", quantity: 0.5 }, role: "fat" },
    { key: "rice", food: "rice_cooked", grams: 180, state: "as_is", role: "main_carb", adjust: { kind: "grams", min: 150, max: 240, step: 30 } },
  ],
  sides: [
    { key: "rice", label: { ja: "ご飯", en: "Rice", es: "Arroz" }, ingredients: ["rice"], solverMayRemove: true },
  ],
  steps: [
    {
      key: "soak",
      text: {
        ja: "大豆ミートを熱湯に5分ほどつけて戻し、ざるにあけて水気をしっかり絞ります。",
        en: "Soak the soy mince in boiling water for about 5 minutes, drain it in a sieve, and squeeze out the water well.",
        es: "Remoja la soja texturizada en agua hirviendo unos 5 minutos, escúrrela en un colador y exprime bien el agua.",
      },
    },
    {
      key: "prep",
      text: {
        ja: "なすを乱切りにし、豆腐は2cm角に切ります。ねぎ、にんにく、しょうがはみじん切りにします。片栗粉を水大さじ1で溶きます。",
        en: "Cut the eggplant into chunks and the tofu into 2 cm cubes. Finely chop the leek, garlic, and ginger. Mix the potato starch with 1 tablespoon of water.",
        es: "Corta la berenjena en trozos irregulares y el tofu en dados de 2 cm. Pica fino el puerro, el ajo y el jengibre. Disuelve la fécula en 1 cucharada de agua.",
      },
    },
    {
      key: "stir_fry",
      text: {
        ja: "フライパンに油を中火で熱し、なすを4〜5分炒めます。にんにく、しょうが、豆板醤を加えて香りが出るまで炒め、大豆ミートを加えて炒め合わせます。",
        en: "Heat the oil in a frying pan over medium heat and stir-fry the eggplant for 4–5 minutes. Add the garlic, ginger, and doubanjiang, stir-fry until fragrant, then add the soy mince and toss.",
        es: "Calienta el aceite en una sartén a fuego medio y saltea la berenjena 4-5 minutos. Añade el ajo, el jengibre y el doubanjiang, saltea hasta que huela y añade la soja texturizada.",
      },
    },
    {
      key: "simmer",
      text: {
        ja: "水150mL、中華だし、しょうゆ、砂糖、豆腐を加えて3分煮ます。水溶き片栗粉でとろみをつけ、ねぎとごま油を加えます。",
        en: "Add 150 mL of water, the stock granules, soy sauce, sugar, and tofu and simmer for 3 minutes. Thicken with the starch mixture and add the leek and sesame oil.",
        es: "Añade 150 mL de agua, el caldo granulado, la salsa de soja, el azúcar y el tofu, y cuece 3 minutos. Espesa con la fécula disuelta y añade el puerro y el aceite de sésamo.",
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
      key: "hot_water",
      text: {
        ja: "熱湯を扱うときは、やけどに注意してください。",
        en: "Take care not to scald yourself with the boiling water.",
        es: "Ten cuidado de no quemarte con el agua hirviendo.",
      },
    },
    {
      key: "hot_sauce",
      text: {
        ja: "とろみのついたあんは冷めにくく、やけどしやすいので注意してください。",
        en: "Thickened sauce stays hot for a long time; take care not to burn yourself.",
        es: "La salsa espesada tarda en enfriarse; ten cuidado de no quemarte.",
      },
    },
  ],
  substitutions: [],
};
