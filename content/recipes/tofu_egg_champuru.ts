import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "tofu_egg_champuru",
  texts: {
    name: { ja: "豆腐と卵のチャンプルー", en: "Tofu and egg champuru", es: "Champuru de tofu y huevo" },
    summary: {
      ja: "沖縄の炒め物。焼き色をつけた木綿豆腐とキャベツ、卵を炒め合わせます。",
      en: "An Okinawan stir-fry of browned firm tofu, cabbage, and egg.",
      es: "Un salteado de Okinawa con tofu firme dorado, repollo y huevo.",
    },
  },
  cuisine: "okinawan",
  goals: ["maintain"],
  tags: ["quick"],
  minutes: 15,
  effort: 2,
  equipment: ["stove", "frying_pan"],
  servings: 1,
  ingredients: [
    {
      key: "tofu",
      food: "tofu_firm",
      grams: 200,
      state: "raw",
      cooking: "stir_fry",
      measure: { unit: "piece", quantity: 0.67 },
      role: "main_protein",
      adjust: { min: 150, max: 300, step: 50 },
      note: {
        ja: "成分表に加熱した豆腐の値がないため、加熱前の値で計算しています。",
        en: "The tables have no value for cooked tofu, so the uncooked value is used.",
        es: "Las tablas no tienen un valor para el tofu cocinado, así que se usa el valor sin cocinar.",
      },
    },
    { key: "oil_tofu", food: "vegetable_oil", grams: 5, state: "as_is", measure: { unit: "tsp", quantity: 1.25 }, role: "fat" },
    { key: "cabbage", food: "cabbage", grams: 100, state: "stir_fry", role: "vegetable" },
    { key: "oil_cabbage", food: "vegetable_oil", grams: 5, state: "as_is", role: "fat", includedIn: "cabbage" },
    { key: "egg", food: "egg", grams: 100, state: "scramble", measure: { unit: "piece", quantity: 2 }, role: "main_protein" },
    { key: "oil_egg", food: "vegetable_oil", grams: 5, state: "as_is", role: "fat", includedIn: "egg" },
    { key: "soy_sauce", food: "soy_sauce", grams: 8, state: "as_is", measure: { unit: "tsp", quantity: 1.5 }, role: "seasoning" },
    { key: "stock", food: "chinese_stock_granules", grams: 2, state: "as_is", role: "seasoning" },
    { key: "pepper", food: "black_pepper", grams: 0.2, state: "as_is", measure: { unit: "pinch", quantity: 1 }, role: "seasoning" },
    { key: "rice", food: "rice_cooked", grams: 150, state: "as_is", role: "main_carb", adjust: { min: 0, max: 250, step: 10 } },
  ],
  steps: [
    {
      ja: "木綿豆腐をキッチンペーパーで包んで10分置き、水気を切ってから手で大きくちぎります。",
      en: "Wrap the firm tofu in paper towels for 10 minutes to drain, then tear it into large pieces.",
      es: "Envuelve el tofu firme en papel de cocina 10 minutos para escurrirlo y luego desmenúzalo en trozos grandes.",
    },
    {
      ja: "豆腐用の油で豆腐を焼き色がつくまで焼いて取り出します。",
      en: "Brown the tofu in its oil and set it aside.",
      es: "Dora el tofu en su aceite y resérvalo.",
    },
    {
      ja: "キャベツ用の油でざく切りのキャベツを2分炒め、豆腐を戻して、しょうゆ、中華だし、こしょうで味を付けます。",
      en: "Stir-fry the chopped cabbage in its oil for 2 minutes, return the tofu, and season with soy sauce, stock granules, and pepper.",
      es: "Saltea el repollo troceado en su aceite 2 minutos, devuelve el tofu y sazona con salsa de soja, caldo en gránulos y pimienta.",
    },
    {
      ja: "卵用の油を足して溶き卵を流し入れ、卵が固まるまで大きく混ぜます。ご飯を添えます。",
      en: "Add the oil for the egg, pour in the beaten eggs, and fold until the eggs are set. Serve with rice.",
      es: "Añade el aceite del huevo, vierte los huevos batidos y remueve hasta que cuajen. Sírvelo con arroz.",
    },
  ],
  safetyNotes: [
    {
      ja: "卵は固まるまで加熱してください。",
      en: "Cook the eggs until set.",
      es: "Cocina los huevos hasta que cuajen.",
    },
  ],
  substitutions: [],
};
