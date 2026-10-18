import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "chicken_mapo_tofu",
  texts: {
    name: { ja: "鶏ひき肉の麻婆豆腐", en: "Mapo tofu with ground chicken", es: "Mapo tofu con pollo picado" },
    summary: {
      ja: "豚ひき肉の代わりに鶏ひき肉を使い、豆板醤の辛さを効かせた麻婆豆腐です。",
      en: "Mapo tofu made with ground chicken instead of pork, spiced with doubanjiang.",
      es: "Mapo tofu hecho con pollo picado en lugar de cerdo y picante con doubanjiang.",
    },
  },
  cuisine: "chinese",
  goals: ["maintain"],
  mainProteinGroup: "chicken",
  tags: [],
  minutes: 20,
  effort: 2,
  equipment: ["stove", "frying_pan"],
  servings: 1,
  ingredients: [
    {
      key: "chicken",
      food: "chicken_mince",
      grams: 100,
      state: "raw",
      cooking: "stir_fry",
      role: "main_protein",
      adjust: { kind: "grams", min: 80, max: 160, step: 10 },
      note: {
        ja: "成分表の鶏ひき肉の焼いた値は油を使わない調理のため、生の値で計算しています。",
        en: "The tables' cooked ground chicken was pan-cooked without oil, so the raw value is used.",
        es: "El pollo picado cocinado de las tablas se hizo sin aceite, así que se usa el valor en crudo.",
      },
    },
    {
      key: "tofu",
      food: "tofu_silken",
      grams: 200,
      state: "raw",
      cooking: "simmer",
      measure: { unit: "block", quantity: 2 / 3 },
      role: "main_protein",
      adjust: { kind: "grams", min: 150, max: 300, step: 50 },
    },
    { key: "oil", food: "vegetable_oil", grams: 4, state: "as_is", measure: { unit: "tsp", quantity: 1 }, role: "fat", linkedTo: "chicken" },
    { key: "leek", food: "long_onion", grams: 30, state: "raw", role: "vegetable" },
    { key: "garlic", food: "garlic", grams: 5, state: "raw", measure: { unit: "clove", quantity: 1 }, role: "seasoning" },
    { key: "ginger", food: "ginger", grams: 5, state: "raw", measure: { unit: "knob", quantity: 0.5 }, role: "seasoning" },
    { key: "doubanjiang", food: "doubanjiang", grams: 8, state: "as_is", measure: { unit: "tsp", quantity: 1.5 }, role: "seasoning", linkedTo: "tofu" },
    { key: "soy_sauce", food: "soy_sauce", grams: 8, state: "as_is", measure: { unit: "tsp", quantity: 1.5 }, role: "seasoning", linkedTo: "tofu" },
    { key: "sugar", food: "sugar", grams: 2, state: "as_is", role: "seasoning", linkedTo: "tofu" },
    { key: "stock", food: "chinese_stock_granules", grams: 2, state: "as_is", role: "seasoning", linkedTo: "tofu" },
    { key: "starch", food: "potato_starch", grams: 6, state: "as_is", measure: { unit: "tsp", quantity: 2 }, role: "other", linkedTo: "tofu" },
    { key: "sesame_oil", food: "sesame_oil", grams: 3, state: "as_is", role: "fat", linkedTo: "tofu" },
    { key: "rice", food: "rice_cooked", grams: 180, state: "as_is", role: "main_carb", adjust: { kind: "grams", min: 100, max: 280, step: 10 } },
  ],
  sides: [
    { key: "rice", label: { ja: "ご飯", en: "Rice", es: "Arroz" }, ingredients: ["rice"], solverMayRemove: true },
  ],
  steps: [
    {
      key: "prep",
      text: {
        ja: "豆腐を2cm角に切ります。長ねぎ、にんにく、しょうがはみじん切りにします。",
        en: "Cut the tofu into 2 cm cubes. Finely chop the leek, garlic, and ginger.",
        es: "Corta el tofu en dados de 2 cm. Pica fino el puerro, el ajo y el jengibre.",
      },
    },
    {
      key: "stir_fry",
      text: {
        ja: "フライパンに油を中火で熱し、にんにく、しょうが、豆板醤を炒め、香りが出たら鶏ひき肉を加えて色が変わるまで炒めます。",
        en: "Heat the oil over medium heat and stir-fry the garlic, ginger, and doubanjiang. When fragrant, add the ground chicken and cook until no longer pink.",
        es: "Calienta el aceite a fuego medio y sofríe el ajo, el jengibre y el doubanjiang. Cuando huela, añade el pollo picado y cocínalo hasta que no quede rosado.",
      },
    },
    {
      key: "simmer",
      text: {
        ja: "水150ml、しょうゆ、砂糖、中華だしを加えて煮立て、豆腐を入れて3分煮ます。",
        en: "Add 150 ml of water, the soy sauce, sugar, and stock granules, bring to a boil, add the tofu, and simmer for 3 minutes.",
        es: "Añade 150 ml de agua, la salsa de soja, el azúcar y el caldo en gránulos, lleva a ebullición, incorpora el tofu y cuece 3 minutos.",
      },
    },
    {
      key: "thicken",
      text: {
        ja: "長ねぎを加え、同量の水で溶いた片栗粉でとろみをつけ、ごま油を回しかけます。",
        en: "Add the leek, thicken with the starch mixed with an equal amount of water, and drizzle with sesame oil.",
        es: "Añade el puerro, espesa con la fécula disuelta en la misma cantidad de agua y rocía con aceite de sésamo.",
      },
    },
  ],
  safetyNotes: [
    {
      key: "mince_doneness",
      text: {
        ja: "ひき肉は中心まで火を通してください。ピンク色が残らないよう、ほぐしながら炒めます。",
        en: "Cook ground meat through, breaking it up until no pink remains.",
        es: "Cocina bien la carne picada, deshaciéndola hasta que no quede nada rosado.",
      },
    },
  ],
  substitutions: [],
};
