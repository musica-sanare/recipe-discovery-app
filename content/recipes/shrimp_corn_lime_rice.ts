import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "shrimp_corn_lime_rice",
  texts: {
    name: { ja: "えびとコーンのライムライス", en: "Shrimp and corn lime rice", es: "Arroz con gambas, maíz y lima" },
    summary: {
      ja: "中南米のライムとパクチーの組み合わせをヒントに、えびとコーンをにんにくで炒め、ご飯と合わせてライムで仕上げます。",
      en: "Inspired by the Latin American pairing of lime and cilantro: shrimp and corn stir-fried with garlic, tossed with rice, and finished with lime.",
      es: "Inspirado en la combinación latinoamericana de lima y cilantro: gambas y maíz salteados con ajo, mezclados con arroz y terminados con lima.",
    },
  },
  cuisine: "latin_american",
  goals: ["cut"],
  mainProteinGroup: "fish",
  tags: [],
  minutes: 15,
  effort: 1,
  equipment: ["stove", "frying_pan"],
  servings: 1,
  ingredients: [
    {
      key: "shrimp",
      food: "shrimp",
      grams: 150,
      state: "raw",
      cooking: "stir_fry",
      role: "main_protein",
      adjust: { kind: "grams", min: 100, max: 200, step: 25 },
      note: {
        ja: "成分表に炒めたえびの値がないため、生の値で計算しています。殻と背わたを除いた重さです。",
        en: "The tables have no value for stir-fried shrimp, so the raw value is used. Weight after removing the shells and veins.",
        es: "Las tablas no tienen un valor para las gambas salteadas, así que se usa el valor en crudo. Peso sin cáscara ni intestino.",
      },
    },
    { key: "oil_shrimp", food: "olive_oil", grams: 3, state: "as_is", measure: { unit: "tsp", quantity: 0.75 }, role: "fat", linkedTo: "shrimp" },
    { key: "salt", food: "salt", grams: 1, state: "as_is", measure: { unit: "pinch", quantity: 2 }, role: "seasoning", linkedTo: "shrimp" },
    { key: "corn", food: "corn_frozen", grams: 60, state: "stir_fry", role: "vegetable" },
    { key: "oil_corn", food: "olive_oil", grams: 3, state: "as_is", measure: { unit: "tsp", quantity: 0.75 }, role: "fat", includedIn: "corn" },
    { key: "garlic", food: "garlic", grams: 5, state: "raw", measure: { unit: "clove", quantity: 1 }, role: "seasoning" },
    { key: "rice", food: "rice_cooked", grams: 180, state: "as_is", role: "main_carb", adjust: { kind: "grams", min: 120, max: 260, step: 20 } },
    { key: "lime", food: "lime_juice", grams: 10, state: "as_is", measure: { unit: "tsp", quantity: 2 }, role: "seasoning" },
    { key: "coriander", food: "coriander", grams: 3, state: "raw", role: "vegetable" },
  ],
  sides: [],
  steps: [
    {
      key: "prep",
      text: {
        ja: "えびの殻と背わたを除き、塩をふります。にんにくはみじん切りにし、パクチーは刻みます。",
        en: "Peel and devein the shrimp and season with the salt. Finely chop the garlic and chop the cilantro.",
        es: "Pela las gambas, quítales el intestino y sálalas. Pica fino el ajo y pica el cilantro.",
      },
    },
    {
      key: "stir_fry",
      text: {
        ja: "フライパンにオリーブオイルとにんにくを入れて中火にかけ、凍ったままのコーンを2分炒めます。えびを加え、2〜3分炒めます。",
        en: "Put the olive oil and garlic in a frying pan over medium heat and stir-fry the frozen corn for 2 minutes. Add the shrimp and stir-fry for 2–3 minutes.",
        es: "Pon el aceite de oliva y el ajo en una sartén a fuego medio y saltea el maíz congelado 2 minutos. Añade las gambas y saltéalas 2-3 minutos.",
      },
    },
    {
      key: "rice",
      text: {
        ja: "ご飯を加えて全体を炒め合わせ、火を止めてライム果汁とパクチーを混ぜます。",
        en: "Add the rice and stir-fry to combine. Turn off the heat and stir in the lime juice and cilantro.",
        es: "Añade el arroz y saltea para mezclar. Apaga el fuego e incorpora el zumo de lima y el cilantro.",
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
