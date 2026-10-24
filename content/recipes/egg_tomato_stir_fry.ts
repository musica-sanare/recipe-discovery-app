import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "egg_tomato_stir_fry",
  texts: {
    name: { ja: "卵とトマトの炒め物", en: "Egg and tomato stir-fry", es: "Salteado de huevo y tomate" },
    summary: {
      ja: "ふんわり炒めた卵と、さっと火を通したトマトを合わせる中国の家庭料理。ご飯を添えます。",
      en: "A Chinese home-style dish of fluffy scrambled eggs and briefly cooked tomato, served with rice.",
      es: "Un plato casero chino de huevos revueltos esponjosos y tomate apenas cocinado, servido con arroz.",
    },
  },
  cuisine: "chinese",
  goals: ["maintain"],
  mainProteinGroup: "egg",
  tags: [],
  minutes: 10,
  effort: 1,
  equipment: ["stove", "frying_pan"],
  servings: 1,
  ingredients: [
    { key: "egg", food: "egg", grams: 150, state: "scramble", measure: { unit: "piece", quantity: 3 }, role: "main_protein", adjust: { kind: "count", unitGrams: 50, min: 2, max: 4 } },
    { key: "oil_egg", food: "vegetable_oil", grams: 5, state: "as_is", role: "fat", linkedTo: "egg", includedIn: "egg" },
    {
      key: "tomato",
      food: "tomato",
      grams: 150,
      state: "raw",
      cooking: "stir_fry",
      measure: { unit: "piece", quantity: 1 },
      role: "vegetable",
      note: {
        ja: "成分表に加熱したトマトの値がないため、生の値で計算しています。",
        en: "The tables have no value for cooked tomato, so the raw value is used.",
        es: "Las tablas no tienen un valor para el tomate cocinado, así que se usa el valor en crudo.",
      },
    },
    { key: "oil_tomato", food: "vegetable_oil", grams: 3, state: "as_is", role: "fat" },
    { key: "green_onion", food: "green_onion", grams: 5, state: "raw", role: "vegetable" },
    { key: "sugar", food: "sugar", grams: 3, state: "as_is", measure: { unit: "tsp", quantity: 1 }, role: "seasoning" },
    { key: "salt", food: "salt", grams: 1, state: "as_is", measure: { unit: "pinch", quantity: 2 }, role: "seasoning", linkedTo: "egg" },
    { key: "rice", food: "rice_cooked", grams: 200, state: "as_is", role: "main_carb", adjust: { kind: "grams", min: 100, max: 300, step: 10 } },
  ],
  sides: [
    { key: "rice", label: { ja: "ご飯", en: "Rice", es: "Arroz" }, ingredients: ["rice"], solverMayRemove: true },
  ],
  steps: [
    {
      key: "prep",
      text: {
        ja: "トマトをくし形に切ります。卵は塩を加えて溶きほぐします。",
        en: "Cut the tomato into wedges. Beat the eggs with the salt.",
        es: "Corta el tomate en gajos. Bate los huevos con la sal.",
      },
    },
    {
      key: "egg",
      text: {
        ja: "フライパンに卵用の油を強めの中火で熱し、溶き卵を流し入れて大きく混ぜ、固まったら取り出します。",
        en: "Heat the oil for the eggs in a frying pan over medium-high heat, pour in the eggs, fold them in large curds, and take them out once set.",
        es: "Calienta el aceite de los huevos en una sartén a fuego medio-alto, vierte los huevos, remuévelos en grumos grandes y sácalos cuando cuajen.",
      },
    },
    {
      key: "tomato",
      text: {
        ja: "トマト用の油を足してトマトを1分炒め、砂糖を加えます。卵を戻して炒め合わせ、青ねぎを散らします。",
        en: "Add the oil for the tomato, stir-fry the tomato for 1 minute, and add the sugar. Return the eggs, toss together, and scatter the green onion.",
        es: "Añade el aceite del tomate, saltea el tomate 1 minuto y agrega el azúcar. Devuelve los huevos, mezcla y esparce la cebolleta.",
      },
    },
    {
      key: "serve",
      text: {
        ja: "器に盛ります。",
        en: "Transfer to a plate.",
        es: "Sírvelo en un plato.",
      },
    },
  ],
  safetyNotes: [
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
