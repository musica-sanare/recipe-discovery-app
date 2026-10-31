import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "greek_egg_white_spinach_omelette",
  texts: {
    name: { ja: "卵白とほうれん草のギリシャ風オムレツ", en: "Greek-style egg white and spinach omelette", es: "Omelet griego de claras y espinacas", fr: "Omelette de blancs d'œufs aux épinards à la grecque" },
    summary: {
      ja: "ほうれん草とフェタチーズのギリシャのオムレツをヒントに、卵白で作り、フェタの代わりにカッテージチーズを包みます。トマトとパンを添えます。",
      en: "Inspired by Greek spinach and feta omelettes: made with egg whites and filled with cottage cheese in place of feta, with tomato and bread.",
      es: "Inspirado en los omelets griegos de espinacas y feta: hecho con claras y relleno de queso cottage en lugar de feta, con tomate y pan.",
      fr: "Inspirée des omelettes grecques aux épinards et à la feta : faite de blancs d'œufs et garnie de cottage cheese à la place de la feta, avec de la tomate et du pain.",
    },
  },
  cuisine: "mediterranean",
  goals: ["cut"],
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
      grams: 250,
      state: "raw",
      cooking: "scramble",
      role: "main_protein",
      adjust: { kind: "grams", min: 200, max: 300, step: 50 },
      note: {
        ja: "成分表に焼いた卵白の値がないため、生の値で計算しています。",
        en: "The tables have no value for cooked egg white, so the raw value is used.",
        es: "Las tablas no tienen un valor para la clara cocinada, así que se usa el valor en crudo.",
        fr: "Les tables n'ont pas de valeur pour le blanc d'œuf cuit ; la valeur à l'état cru est donc utilisée.",
      },
    },
    { key: "oil", food: "olive_oil", grams: 3, state: "as_is", measure: { unit: "tsp", quantity: 0.75 }, role: "fat" },
    {
      key: "spinach",
      food: "spinach",
      grams: 60,
      state: "raw",
      cooking: "saute",
      role: "vegetable",
      note: {
        ja: "成分表に油をほとんど使わずに炒めたほうれん草の値がないため、生の値で計算しています。",
        en: "The tables have no value for spinach cooked with very little oil, so the raw value is used.",
        es: "Las tablas no tienen un valor para las espinacas cocinadas con muy poco aceite, así que se usa el valor en crudo.",
        fr: "Les tables n'ont pas de valeur pour les épinards cuits avec très peu d'huile ; la valeur à l'état cru est donc utilisée.",
      },
    },
    { key: "cottage", food: "cottage_cheese", grams: 50, state: "as_is", measure: { unit: "tbsp", quantity: 3 }, role: "other" },
    { key: "parsley", food: "parsley", grams: 3, state: "raw", role: "seasoning" },
    { key: "tomato", food: "tomato", grams: 60, state: "raw", role: "vegetable" },
    { key: "bread", food: "bread", grams: 120, state: "as_is", measure: { unit: "slice", quantity: 2 }, role: "main_carb", adjust: { kind: "grams", min: 60, max: 150, step: 30 } },
  ],
  sides: [
    { key: "bread", label: { ja: "パン", en: "Bread", es: "Pan", fr: "Pain" }, ingredients: ["bread"], solverMayRemove: true },
  ],
  steps: [
    {
      key: "prep",
      text: {
        ja: "ほうれん草を3cm長さに切り、パセリは刻みます。卵白はボウルでよく溶きほぐします。トマトはくし形に切ります。",
        en: "Cut the spinach into 3 cm lengths and chop the parsley. Beat the egg whites well in a bowl. Cut the tomato into wedges.",
        es: "Corta las espinacas en trozos de 3 cm y pica el perejil. Bate bien las claras en un bol. Corta el tomate en gajos.",
        fr: "Coupez les épinards en tronçons de 3 cm et hachez le persil. Battez bien les blancs d'œufs dans un bol. Coupez la tomate en quartiers.",
      },
    },
    {
      key: "spinach",
      text: {
        ja: "フライパンにオリーブ油を中火で熱し、ほうれん草をしんなりするまで炒めて取り出します。",
        en: "Heat the olive oil in a frying pan over medium heat, stir-fry the spinach until wilted, and take it out.",
        es: "Calienta el aceite de oliva en una sartén a fuego medio, saltea las espinacas hasta que se ablanden y sácalas.",
        fr: "Faites chauffer l'huile d'olive dans une poêle à feu moyen, faites sauter les épinards jusqu'à ce qu'ils tombent et retirez-les.",
      },
    },
    {
      key: "omelette",
      text: {
        ja: "同じフライパンに卵白を流し入れ、弱めの中火で大きく混ぜます。半分ほど固まったら、ほうれん草、カッテージチーズ、パセリをのせて半分に折り、中まで固まるまで焼きます。",
        en: "Pour the egg whites into the same pan and stir in large strokes over medium-low heat. When about half set, add the spinach, cottage cheese, and parsley, fold the omelette in half, and cook until set inside.",
        es: "Vierte las claras en la misma sartén y remueve con movimientos amplios a fuego medio-bajo. Cuando estén medio cuajadas, pon encima las espinacas, el queso cottage y el perejil, dobla el omelet por la mitad y cocínalo hasta que cuaje por dentro.",
        fr: "Versez les blancs d'œufs dans la même poêle et remuez à grands gestes à feu moyen-doux. Quand ils sont à moitié pris, ajoutez les épinards, le cottage cheese et le persil, repliez l'omelette en deux et faites cuire jusqu'à ce que l'intérieur soit pris.",
      },
    },
    {
      key: "serve",
      text: { ja: "トマトと一緒に器に盛ります。", en: "Plate it with the tomato.", es: "Sírvelo con el tomate.", fr: "Dressez avec la tomate." },
    },
    {
      key: "bread",
      side: "bread",
      text: { ja: "パンを添えます。", en: "Serve with the bread.", es: "Acompáñalo con el pan.", fr: "Servez avec le pain." },
    },
  ],
  safetyNotes: [
    {
      key: "egg_set",
      text: {
        ja: "卵は中まで固まるまで加熱してください。",
        en: "Cook the eggs until set inside.",
        es: "Cocina los huevos hasta que cuajen por dentro.",
        fr: "Faites cuire les œufs jusqu'à ce que l'intérieur soit pris.",
      },
    },
  ],
  substitutions: [],
};
