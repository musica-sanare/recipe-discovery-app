import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "huevos_pericos_egg_whites",
  texts: {
    name: { ja: "卵白で作るウエボス・ペリコス", en: "Huevos pericos with egg whites", es: "Huevos pericos con claras" },
    summary: {
      ja: "コロンビアやベネズエラのウエボス・ペリコスをヒントに、卵白と卵をトマトとねぎと一緒に炒り卵にします。アボカドとパンを添えます。",
      en: "Inspired by Colombian and Venezuelan huevos pericos: egg whites and an egg scrambled with tomato and leek, with avocado and bread.",
      es: "Inspirado en los huevos pericos de Colombia y Venezuela: claras y un huevo revueltos con tomate y puerro, con aguacate y pan.",
    },
  },
  cuisine: "latin_american",
  goals: ["maintain"],
  mainProteinGroup: "egg",
  tags: ["breakfast"],
  minutes: 10,
  effort: 1,
  equipment: ["stove", "frying_pan"],
  servings: 1,
  ingredients: [
    {
      key: "egg_white",
      food: "egg_white",
      grams: 200,
      state: "raw",
      cooking: "scramble",
      role: "main_protein",
      adjust: { kind: "grams", min: 150, max: 250, step: 50 },
      note: {
        ja: "成分表に炒めた卵白の値がないため、生の値で計算しています。",
        en: "The tables have no value for scrambled egg white, so the raw value is used.",
        es: "Las tablas no tienen un valor para la clara revuelta, así que se usa el valor en crudo.",
      },
    },
    { key: "egg", food: "egg", grams: 50, state: "scramble", measure: { unit: "piece", quantity: 1 }, role: "main_protein", adjust: { kind: "count", unitGrams: 50, min: 1, max: 2 } },
    { key: "oil", food: "vegetable_oil", grams: 3, state: "as_is", measure: { unit: "tsp", quantity: 0.75 }, role: "fat", includedIn: "egg" },
    {
      key: "tomato",
      food: "tomato",
      grams: 100,
      state: "raw",
      cooking: "saute",
      measure: { unit: "piece", quantity: 0.5 },
      role: "vegetable",
      note: {
        ja: "成分表に炒めたトマトの値がないため、生の値で計算しています。",
        en: "The tables have no value for sautéed tomato, so the raw value is used.",
        es: "Las tablas no tienen un valor para el tomate salteado, así que se usa el valor en crudo.",
      },
    },
    { key: "long_onion", food: "long_onion", grams: 30, state: "raw", cooking: "saute", role: "vegetable" },
    { key: "salt", food: "salt", grams: 0.5, state: "as_is", measure: { unit: "pinch", quantity: 1 }, role: "seasoning" },
    { key: "avocado", food: "avocado", grams: 30, state: "raw", role: "vegetable" },
    { key: "bread", food: "bread", grams: 120, state: "as_is", measure: { unit: "slice", quantity: 2 }, role: "main_carb", adjust: { kind: "grams", min: 60, max: 150, step: 30 } },
  ],
  sides: [],
  steps: [
    {
      key: "prep",
      text: {
        ja: "トマトは1cm角に切り、ねぎは小口切りにします。卵白と卵をボウルでよく溶きます。",
        en: "Dice the tomato into 1 cm pieces and slice the leek thinly. Beat the egg whites and egg well in a bowl.",
        es: "Corta el tomate en dados de 1 cm y el puerro en rodajas finas. Bate bien las claras y el huevo en un bol.",
      },
    },
    {
      key: "saute",
      text: {
        ja: "フライパンに油を中火で熱し、ねぎとトマトを2分ほど炒めて塩をふります。",
        en: "Heat the oil in a frying pan over medium heat, sauté the leek and tomato for about 2 minutes, and sprinkle with the salt.",
        es: "Calienta el aceite en una sartén a fuego medio, saltea el puerro y el tomate unos 2 minutos y echa la sal.",
      },
    },
    {
      key: "scramble",
      text: {
        ja: "卵液を流し入れ、大きく混ぜながら、全体が固まるまで炒めます。",
        en: "Pour in the egg mixture and stir in large strokes until it is set all through.",
        es: "Vierte el huevo batido y remueve con movimientos amplios hasta que cuaje por completo.",
      },
    },
    {
      key: "serve",
      text: {
        ja: "パンと薄切りのアボカドを添えて器に盛ります。",
        en: "Plate it with the bread and sliced avocado.",
        es: "Sírvelo con el pan y el aguacate en láminas.",
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
