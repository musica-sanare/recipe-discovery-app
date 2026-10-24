import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "edamame_tofu_fried_rice",
  texts: {
    name: { ja: "枝豆と豆腐のチャーハン", en: "Edamame and tofu fried rice", es: "Arroz frito con edamame y tofu" },
    summary: {
      ja: "崩した木綿豆腐と枝豆、卵をご飯と炒め合わせた、たんぱく質の多いチャーハンです。",
      en: "Fried rice with crumbled firm tofu, edamame, and egg.",
      es: "Arroz frito con tofu firme desmenuzado, edamame y huevo.",
    },
  },
  cuisine: "chinese",
  goals: ["bulk"],
  mainProteinGroup: "soy",
  tags: [],
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
      measure: { unit: "block", quantity: 2 / 3 },
      role: "main_protein",
      adjust: { kind: "grams", min: 150, max: 300, step: 50 },
      note: {
        ja: "成分表に加熱した豆腐の値がないため、加熱前の値で計算しています。",
        en: "The tables have no value for cooked tofu, so the uncooked value is used.",
        es: "Las tablas no tienen un valor para el tofu cocinado, así que se usa el valor sin cocinar.",
      },
    },
    { key: "oil_tofu", food: "vegetable_oil", grams: 4, state: "as_is", measure: { unit: "tsp", quantity: 1 }, role: "fat", linkedTo: "tofu" },
    { key: "edamame", food: "edamame", grams: 60, state: "as_is", role: "main_protein" },
    { key: "egg", food: "egg", grams: 50, state: "scramble", measure: { unit: "piece", quantity: 1 }, role: "main_protein", adjust: { kind: "count", unitGrams: 50, min: 1, max: 2 } },
    { key: "oil_egg", food: "vegetable_oil", grams: 5, state: "as_is", role: "fat", linkedTo: "egg", includedIn: "egg" },
    { key: "rice", food: "rice_cooked", grams: 250, state: "as_is", role: "main_carb", adjust: { kind: "grams", min: 150, max: 350, step: 10 } },
    { key: "long_onion", food: "long_onion", grams: 20, state: "raw", role: "vegetable" },
    { key: "soy_sauce", food: "soy_sauce", grams: 8, state: "as_is", measure: { unit: "tsp", quantity: 1.5 }, role: "seasoning", linkedTo: "rice" },
    { key: "salt", food: "salt", grams: 0.5, state: "as_is", measure: { unit: "pinch", quantity: 1 }, role: "seasoning", linkedTo: "rice" },
    { key: "pepper", food: "black_pepper", grams: 0.2, state: "as_is", measure: { unit: "pinch", quantity: 1 }, role: "seasoning", linkedTo: "rice" },
  ],
  sides: [],
  steps: [
    {
      key: "prep",
      text: {
        ja: "木綿豆腐をキッチンペーパーで包んで10分置き、水気を切ります。長ねぎはみじん切りにし、卵は溶きほぐします。",
        en: "Wrap the firm tofu in paper towels for 10 minutes to drain. Finely chop the long onion and beat the egg.",
        es: "Envuelve el tofu firme en papel de cocina 10 minutos para escurrirlo. Pica fino el puerro japonés y bate el huevo.",
      },
    },
    {
      key: "tofu",
      text: {
        ja: "フライパンに豆腐用の油を強めの中火で熱し、豆腐を崩しながら水分が飛ぶまで4分炒めて端に寄せます。",
        en: "Heat the oil for the tofu in a frying pan over medium-high heat, crumble in the tofu, and stir-fry for 4 minutes until dry, then push it to the side.",
        es: "Calienta el aceite del tofu en una sartén a fuego medio-alto, desmenuza el tofu dentro y saltéalo 4 minutos hasta que se seque; después apártalo a un lado.",
      },
    },
    {
      key: "egg",
      text: {
        ja: "卵用の油を足して溶き卵を流し入れ、すぐにご飯を加えて卵とからめながら炒めます。",
        en: "Add the oil for the egg, pour in the beaten egg, immediately add the rice, and stir-fry so the egg coats the grains.",
        es: "Añade el aceite del huevo, vierte el huevo batido, agrega enseguida el arroz y saltea para que el huevo envuelva los granos.",
      },
    },
    {
      key: "finish",
      text: {
        ja: "枝豆と長ねぎを加えて1分炒め、しょうゆ、塩、こしょうで味を調えます。",
        en: "Add the edamame and long onion, stir-fry for 1 minute, and season with soy sauce, salt, and pepper.",
        es: "Añade el edamame y el puerro japonés, saltea 1 minuto y sazona con salsa de soja, sal y pimienta.",
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
