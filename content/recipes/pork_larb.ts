import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "pork_larb",
  texts: {
    name: { ja: "豚もも肉のラープ", en: "Pork larb", es: "Larb de cerdo" },
    summary: {
      ja: "タイやラオスのラープをヒントに、炒めた豚もも肉をライム、ナンプラー、ハーブで和えます。レタスで包んで食べます。ご飯を添えます。",
      en: "Inspired by Thai and Lao larb: stir-fried lean pork dressed with lime, fish sauce, and herbs, eaten wrapped in lettuce, with rice.",
      es: "Inspirado en el larb de Tailandia y Laos: cerdo magro salteado aliñado con lima, salsa de pescado y hierbas, para comer envuelto en lechuga, con arroz.",
    },
  },
  cuisine: "southeast_asian",
  goals: ["cut"],
  mainProteinGroup: "pork",
  tags: [],
  minutes: 15,
  effort: 1,
  equipment: ["stove", "frying_pan"],
  servings: 1,
  ingredients: [
    {
      key: "pork",
      food: "pork_leg",
      grams: 160,
      state: "raw",
      cooking: "stir_fry",
      role: "main_protein",
      adjust: { kind: "grams", min: 120, max: 200, step: 20 },
      note: {
        ja: "成分表に炒めた豚もも肉の値がないため、生の値で計算しています。",
        en: "The tables have no value for stir-fried pork leg, so the raw value is used.",
        es: "Las tablas no tienen un valor para la pierna de cerdo salteada, así que se usa el valor en crudo.",
      },
    },
    { key: "oil", food: "vegetable_oil", grams: 2, state: "as_is", measure: { unit: "tsp", quantity: 0.5 }, role: "fat", linkedTo: "pork" },
    { key: "fish_sauce", food: "fish_sauce", grams: 8, state: "as_is", measure: { unit: "tsp", quantity: 1.5 }, role: "seasoning", linkedTo: "pork" },
    { key: "lime", food: "lime_juice", grams: 15, state: "as_is", measure: { unit: "tbsp", quantity: 1 }, role: "seasoning" },
    { key: "sugar", food: "sugar", grams: 1, state: "as_is", role: "seasoning" },
    { key: "onion", food: "onion", grams: 30, state: "raw", role: "vegetable" },
    { key: "green_onion", food: "green_onion", grams: 5, state: "raw", role: "vegetable" },
    { key: "coriander", food: "coriander", grams: 5, state: "raw", role: "vegetable" },
    { key: "lettuce", food: "lettuce", grams: 60, state: "raw", role: "vegetable" },
    { key: "cucumber", food: "cucumber", grams: 50, state: "raw", measure: { unit: "piece", quantity: 0.5 }, role: "vegetable" },
    { key: "rice", food: "rice_cooked", grams: 150, state: "as_is", role: "main_carb", adjust: { kind: "grams", min: 100, max: 250, step: 25 } },
  ],
  sides: [
    { key: "rice", label: { ja: "ご飯", en: "Rice", es: "Arroz" }, ingredients: ["rice"], solverMayRemove: true },
  ],
  steps: [
    {
      key: "prep",
      text: {
        ja: "豚もも肉を包丁で5mm角程度に細かく刻みます。玉ねぎは薄切り、青ねぎとパクチーは刻み、きゅうりは斜め薄切りにします。",
        en: "Chop the pork finely with a knife, into pieces of about 5 mm. Thinly slice the onion, chop the green onion and cilantro, and slice the cucumber thinly on the diagonal.",
        es: "Pica el cerdo a cuchillo en trozos de unos 5 mm. Corta la cebolla en láminas finas, pica la cebolleta y el cilantro y corta el pepino en rodajas finas al bies.",
      },
    },
    {
      key: "stir_fry",
      text: {
        ja: "フライパンに油を中火で熱し、豚肉をほぐしながら4〜5分、色が完全に変わるまで炒めます。",
        en: "Heat the oil in a frying pan over medium heat and stir-fry the pork for 4–5 minutes, breaking it up, until it has completely changed color.",
        es: "Calienta el aceite en una sartén a fuego medio y saltea el cerdo 4-5 minutos, deshaciéndolo, hasta que cambie de color por completo.",
      },
    },
    {
      key: "dress",
      text: {
        ja: "火を止めてナンプラー、ライム果汁、砂糖を加えて混ぜ、少し冷ましてから玉ねぎ、青ねぎ、パクチーと和えます。",
        en: "Turn off the heat, stir in the fish sauce, lime juice, and sugar, let it cool a little, and toss with the onion, green onion, and cilantro.",
        es: "Apaga el fuego, añade la salsa de pescado, el zumo de lima y el azúcar, deja enfriar un poco y mézclalo con la cebolla, la cebolleta y el cilantro.",
      },
    },
    {
      key: "serve",
      text: {
        ja: "レタスときゅうりと一緒に器に盛り、レタスで包んで食べます。",
        en: "Plate with the lettuce and cucumber and eat wrapped in the lettuce leaves.",
        es: "Sírvelo con la lechuga y el pepino y cómelo envuelto en las hojas de lechuga.",
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
      key: "mince_doneness",
      text: {
        ja: "細かく刻んだ肉は中心まで火を通してください。ピンク色が残らないよう、ほぐしながら炒めます。",
        en: "Cook finely chopped meat through, breaking it up until no pink remains.",
        es: "Cocina bien la carne picada, deshaciéndola hasta que no quede nada rosado.",
      },
    },
    {
      key: "wash_raw",
      text: {
        ja: "生で食べる野菜とハーブは、流水でよく洗ってください。",
        en: "Wash raw vegetables and herbs well under running water.",
        es: "Lava bien con agua corriente las verduras y hierbas que se comen crudas.",
      },
    },
  ],
  substitutions: [],
};
