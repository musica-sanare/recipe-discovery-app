import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "pork_loin_ginger",
  texts: {
    name: { ja: "豚ロース赤身の生姜焼き", en: "Ginger pork with lean pork loin", es: "Cerdo al jengibre con lomo magro" },
    summary: {
      ja: "赤身の豚ロース肉と玉ねぎを、しょうがの効いたたれで焼きます。",
      en: "Lean pork loin and onion cooked in a gingery soy sauce glaze.",
      es: "Lomo de cerdo magro y cebolla cocinados en un glaseado de soja con jengibre.",
    },
  },
  cuisine: "japanese",
  goals: ["maintain"],
  tags: [],
  minutes: 20,
  effort: 2,
  equipment: ["stove", "frying_pan"],
  servings: 1,
  ingredients: [
    {
      key: "pork",
      food: "pork_loin",
      grams: 150,
      state: "raw",
      cooking: "saute",
      role: "main_protein",
      adjust: { min: 120, max: 220, step: 10 },
      note: {
        ja: "成分表には生の豚ロース赤身の値しかないため、生の値で計算しています。",
        en: "The tables only have a raw value for lean pork loin, so the raw value is used.",
        es: "Las tablas solo tienen un valor en crudo para el lomo magro, así que se usa ese valor.",
      },
    },
    { key: "onion", food: "onion", grams: 60, state: "stir_fry", measure: { unit: "piece", quantity: 0.25 }, role: "vegetable" },
    { key: "oil_onion", food: "vegetable_oil", grams: 3, state: "as_is", role: "fat", includedIn: "onion" },
    { key: "oil_pork", food: "vegetable_oil", grams: 3, state: "as_is", measure: { unit: "tsp", quantity: 0.75 }, role: "fat" },
    { key: "ginger", food: "ginger", grams: 10, state: "raw", measure: { unit: "knob", quantity: 1 }, role: "seasoning" },
    { key: "soy_sauce", food: "soy_sauce", grams: 15, state: "as_is", measure: { unit: "tbsp", quantity: 0.75 }, role: "seasoning" },
    { key: "mirin", food: "mirin", grams: 15, state: "as_is", measure: { unit: "tbsp", quantity: 0.75 }, role: "seasoning" },
    { key: "sake", food: "cooking_sake", grams: 10, state: "as_is", measure: { unit: "tsp", quantity: 2 }, role: "seasoning" },
    { key: "cabbage", food: "cabbage", grams: 60, state: "raw", role: "vegetable" },
    { key: "rice", food: "rice_cooked", grams: 180, state: "as_is", role: "main_carb", adjust: { min: 0, max: 280, step: 10 } },
  ],
  steps: [
    {
      ja: "しょうがをすりおろし、しょうゆ、みりん、料理酒と混ぜてたれを作ります。玉ねぎは薄切りにします。",
      en: "Grate the ginger and mix it with the soy sauce, mirin, and cooking sake. Thinly slice the onion.",
      es: "Ralla el jengibre y mézclalo con la salsa de soja, el mirin y el sake de cocina. Corta la cebolla en láminas finas.",
    },
    {
      ja: "フライパンに玉ねぎ用の油を中火で熱し、玉ねぎを3分炒めて取り出します。",
      en: "Heat the oil for the onion in a frying pan over medium heat, stir-fry the onion for 3 minutes, and set it aside.",
      es: "Calienta el aceite para la cebolla en una sartén a fuego medio, saltea la cebolla 3 minutos y resérvala.",
    },
    {
      ja: "残りの油で豚肉を両面焼き、玉ねぎを戻してたれを加え、煮からめます。",
      en: "Cook the pork on both sides in the remaining oil, return the onion, add the sauce, and coat well.",
      es: "Cocina el cerdo por ambos lados con el resto del aceite, devuelve la cebolla, añade la salsa y mezcla bien.",
    },
    {
      ja: "せん切りキャベツとご飯を添えます。",
      en: "Serve with shredded cabbage and rice.",
      es: "Sírvelo con repollo en juliana y arroz.",
    },
  ],
  safetyNotes: [
    {
      ja: "豚肉は中心まで火を通してください。切り口に赤みがないことを確認します。",
      en: "Cook pork all the way through. Check that the center is no longer pink.",
      es: "Cocina el cerdo completamente. Comprueba que el centro ya no esté rosado.",
    },
  ],
  substitutions: [],
};
