import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "squid_red_pepper_stir_fry",
  texts: {
    name: { ja: "いかとパプリカの甘辛炒め", en: "Spicy-sweet squid and red pepper stir-fry", es: "Salteado dulce y picante de calamar y pimiento rojo" },
    summary: {
      ja: "韓国の家庭料理をヒントに、いかとパプリカ、玉ねぎを豆板醤入りの甘辛だれで炒めます。ご飯を添えます。",
      en: "Inspired by Korean home cooking: squid, red pepper, and onion stir-fried in a sweet chili bean sauce, with rice.",
      es: "Inspirado en la cocina casera coreana: calamar, pimiento rojo y cebolla salteados en una salsa dulce de pasta de habas picante, con arroz.",
    },
  },
  cuisine: "korean",
  goals: ["cut"],
  mainProteinGroup: "fish",
  tags: [],
  minutes: 15,
  effort: 2,
  equipment: ["stove", "frying_pan"],
  servings: 1,
  ingredients: [
    {
      key: "squid",
      food: "squid",
      grams: 200,
      state: "raw",
      cooking: "stir_fry",
      role: "main_protein",
      adjust: { kind: "grams", min: 150, max: 300, step: 50 },
      note: {
        ja: "成分表に炒めたいかの値がないため、生の値で計算しています。内臓と軟骨を除いた重さです。",
        en: "The tables have no value for stir-fried squid, so the raw value is used. Weight after removing the innards and cartilage.",
        es: "Las tablas no tienen un valor para el calamar salteado, así que se usa el valor en crudo. Peso sin vísceras ni pluma.",
      },
    },
    { key: "oil_squid", food: "vegetable_oil", grams: 3, state: "as_is", measure: { unit: "tsp", quantity: 0.75 }, role: "fat", linkedTo: "squid" },
    { key: "red_pepper", food: "red_pepper", grams: 80, state: "stir_fry", measure: { unit: "piece", quantity: 2 / 3 }, role: "vegetable" },
    { key: "onion", food: "onion", grams: 60, state: "stir_fry", measure: { unit: "piece", quantity: 0.25 }, role: "vegetable" },
    { key: "oil_vegetables", food: "vegetable_oil", grams: 7, state: "as_is", role: "fat", includedIn: "red_pepper" },
    { key: "garlic", food: "garlic", grams: 5, state: "raw", measure: { unit: "clove", quantity: 1 }, role: "seasoning", linkedTo: "squid" },
    { key: "doubanjiang", food: "doubanjiang", grams: 4, state: "as_is", measure: { unit: "tsp", quantity: 2 / 3 }, role: "seasoning", linkedTo: "squid" },
    { key: "soy_sauce", food: "soy_sauce", grams: 8, state: "as_is", measure: { unit: "tsp", quantity: 1.5 }, role: "seasoning", linkedTo: "squid" },
    { key: "sugar", food: "sugar", grams: 4.5, state: "as_is", measure: { unit: "tsp", quantity: 1.5 }, role: "seasoning", linkedTo: "squid" },
    { key: "sesame_oil", food: "sesame_oil", grams: 2, state: "as_is", role: "fat" },
    { key: "rice", food: "rice_cooked", grams: 200, state: "as_is", role: "main_carb", adjust: { kind: "grams", min: 100, max: 300, step: 10 } },
  ],
  sides: [
    { key: "rice", label: { ja: "ご飯", en: "Rice", es: "Arroz" }, ingredients: ["rice"], solverMayRemove: true },
  ],
  steps: [
    {
      key: "prep",
      text: {
        ja: "いかの胴は1cm幅の輪切りに、足は2本ずつに切ります。パプリカは細切り、玉ねぎはくし形に切り、にんにくはすりおろして、豆板醤、しょうゆ、砂糖と混ぜます。",
        en: "Cut the squid body into 1 cm rings and the tentacles into pairs. Cut the red pepper into strips and the onion into wedges. Grate the garlic and mix it with the doubanjiang, soy sauce, and sugar.",
        es: "Corta el cuerpo del calamar en anillas de 1 cm y los tentáculos de dos en dos. Corta el pimiento rojo en tiras y la cebolla en gajos. Ralla el ajo y mézclalo con el doubanjiang, la salsa de soja y el azúcar.",
      },
    },
    {
      key: "vegetables",
      text: {
        ja: "フライパンに野菜用の油を強めの中火で熱し、玉ねぎとパプリカを2分炒めて取り出します。",
        en: "Heat the oil for the vegetables in a frying pan over medium-high heat, stir-fry the onion and red pepper for 2 minutes, and set them aside.",
        es: "Calienta el aceite de las verduras en una sartén a fuego medio-alto, saltea la cebolla y el pimiento rojo 2 minutos y resérvalos.",
      },
    },
    {
      key: "squid",
      text: {
        ja: "いか用の油を足し、いかを白く不透明になるまで2分炒めます。野菜を戻してたれを加え、手早く炒め合わせます。",
        en: "Add the oil for the squid and stir-fry the squid for 2 minutes until white and opaque. Return the vegetables, add the sauce, and toss quickly.",
        es: "Añade el aceite del calamar y saltea el calamar 2 minutos hasta que esté blanco y opaco. Devuelve las verduras, añade la salsa y mezcla rápidamente.",
      },
    },
    {
      key: "serve",
      text: {
        ja: "ごま油を回しかけます。",
        en: "Drizzle with the sesame oil.",
        es: "Rocía con el aceite de sésamo.",
      },
    },
  ],
  safetyNotes: [
    {
      key: "squid_doneness",
      text: {
        ja: "いかは身が白く不透明になるまで加熱してください。",
        en: "Cook the squid until the flesh is white and opaque.",
        es: "Cocina el calamar hasta que la carne esté blanca y opaca.",
      },
    },
  ],
  substitutions: [],
};
