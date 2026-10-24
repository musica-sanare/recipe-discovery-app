import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "cod_vegetable_hot_pot",
  texts: {
    name: { ja: "たらと野菜のスープ鍋", en: "Cod and vegetable hot pot", es: "Olla caliente de bacalao y verduras" },
    summary: {
      ja: "たらと豆腐、キャベツ、しいたけを昆布のいらないスープで煮て、レモンじょうゆで食べます。ご飯を添えます。",
      en: "Cod, tofu, cabbage, and shiitake simmered in a simple broth and eaten with lemon soy sauce, with rice.",
      es: "Bacalao, tofu, repollo y shiitake cocidos en un caldo sencillo y servidos con salsa de soja y limón, con arroz.",
    },
  },
  cuisine: "japanese",
  goals: ["cut"],
  mainProteinGroup: "fish",
  tags: [],
  minutes: 20,
  effort: 1,
  equipment: ["stove", "pot"],
  servings: 1,
  ingredients: [
    {
      key: "cod",
      food: "cod",
      grams: 200,
      state: "raw",
      cooking: "simmer",
      measure: { unit: "piece", quantity: 2 },
      role: "main_protein",
      adjust: { kind: "grams", min: 140, max: 280, step: 20 },
      note: {
        ja: "成分表に煮たたらの値がないため、生の値で計算しています。切り身1切れ約100gです。",
        en: "The tables have no value for simmered cod, so the raw value is used. One fillet is about 100 g.",
        es: "Las tablas no tienen un valor para el bacalao cocido, así que se usa el valor en crudo. Un filete pesa unos 100 g.",
      },
    },
    {
      key: "tofu",
      food: "tofu_firm",
      grams: 100,
      state: "raw",
      cooking: "simmer",
      measure: { unit: "block", quantity: 1 / 3 },
      role: "main_protein",
      note: {
        ja: "成分表に加熱した豆腐の値がないため、加熱前の値で計算しています。",
        en: "The tables have no value for cooked tofu, so the uncooked value is used.",
        es: "Las tablas no tienen un valor para el tofu cocinado, así que se usa el valor sin cocinar.",
      },
    },
    { key: "cabbage", food: "cabbage", grams: 100, state: "boil", role: "vegetable" },
    { key: "shiitake", food: "shiitake", grams: 40, state: "boil", measure: { unit: "piece", quantity: 3 }, role: "vegetable" },
    { key: "long_onion", food: "long_onion", grams: 40, state: "raw", cooking: "boil", role: "vegetable" },
    { key: "sake", food: "cooking_sake", grams: 15, state: "as_is", measure: { unit: "tbsp", quantity: 1 }, role: "seasoning" },
    { key: "soy_sauce", food: "soy_sauce", grams: 12, state: "as_is", measure: { unit: "tsp", quantity: 2 }, role: "seasoning", linkedTo: "cod" },
    { key: "lemon_juice", food: "lemon_juice", grams: 10, state: "as_is", measure: { unit: "tsp", quantity: 2 }, role: "seasoning", linkedTo: "cod" },
    { key: "rice", food: "rice_cooked", grams: 180, state: "as_is", role: "main_carb", adjust: { kind: "grams", min: 100, max: 300, step: 10 } },
  ],
  sides: [
    { key: "rice", label: { ja: "ご飯", en: "Rice", es: "Arroz" }, ingredients: ["rice"], solverMayRemove: true },
  ],
  steps: [
    {
      key: "prep",
      text: {
        ja: "たらを3等分に切ります。豆腐は4等分、キャベツはざく切り、長ねぎは斜め切りにし、しいたけは軸を取ります。しょうゆとレモン汁を混ぜてたれを作ります。",
        en: "Cut the cod into three pieces. Quarter the tofu, roughly chop the cabbage, slice the long onion on the diagonal, and remove the shiitake stems. Mix the soy sauce and lemon juice for the dipping sauce.",
        es: "Corta el bacalao en tres trozos. Corta el tofu en cuartos, trocea el repollo, corta el puerro japonés en diagonal y quita los pies de los shiitake. Mezcla la salsa de soja y el zumo de limón para la salsa.",
      },
    },
    {
      key: "simmer",
      text: {
        ja: "鍋に水500mLと料理酒を入れて煮立て、キャベツ、しいたけ、長ねぎを入れて3分煮ます。たらと豆腐を加え、弱めの中火で5分煮ます。",
        en: "Bring 500 mL of water and the cooking sake to a boil in a pot, add the cabbage, shiitake, and long onion, and simmer for 3 minutes. Add the cod and tofu and simmer over medium-low heat for 5 minutes.",
        es: "Lleva a ebullición 500 mL de agua y el sake de cocina en una olla, añade el repollo, los shiitake y el puerro japonés y cuece 3 minutos. Agrega el bacalao y el tofu y cuece a fuego medio-bajo 5 minutos.",
      },
    },
    {
      key: "serve",
      text: {
        ja: "取り分けて、たれをつけて食べます。",
        en: "Serve into bowls and eat with the dipping sauce.",
        es: "Sirve en cuencos y acompaña con la salsa.",
      },
    },
  ],
  safetyNotes: [
    {
      key: "fish_doneness",
      text: {
        ja: "魚は中心まで白く不透明になるまで煮てください。",
        en: "Simmer the fish until it is white and opaque in the center.",
        es: "Cuece el pescado hasta que esté blanco y opaco en el centro.",
      },
    },
  ],
  substitutions: [],
};
