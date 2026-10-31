import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "mackerel_can_tomato_salad",
  texts: {
    name: { ja: "さば水煮缶とトマトのサラダ", en: "Canned mackerel and tomato salad", es: "Ensalada de caballa en lata y tomate", fr: "Salade de maquereau en conserve et tomate" },
    summary: {
      ja: "火を使わず、さばの水煮缶とトマト、玉ねぎをレモン汁で和えます。パンを添えます。",
      en: "No cooking needed: canned mackerel, tomato, and onion tossed with lemon juice, with bread.",
      es: "Sin cocinar: caballa en lata, tomate y cebolla aliñados con zumo de limón, con pan.",
      fr: "Sans cuisson : maquereau en conserve, tomate et oignon mélangés au jus de citron, avec du pain.",
    },
  },
  cuisine: "western",
  goals: ["maintain"],
  mainProteinGroup: "fish",
  tags: ["no_cook"],
  minutes: 8,
  effort: 1,
  equipment: [],
  servings: 1,
  ingredients: [
    {
      key: "mackerel",
      food: "mackerel_canned",
      grams: 140,
      state: "as_is",
      measure: { unit: "can", quantity: 1 },
      role: "main_protein",
      adjust: { kind: "grams", min: 100, max: 190, step: 10 },
      note: {
        ja: "汁気を切った重さです（1缶の固形量は約140〜190g）。",
        en: "Drained weight (one can holds about 140–190 g of fish).",
        es: "Peso escurrido (una lata contiene unos 140-190 g de pescado).",
        fr: "Poids égoutté (une boîte contient environ 140 à 190 g de poisson).",
      },
    },
    { key: "tomato", food: "tomato", grams: 120, state: "raw", measure: { unit: "piece", quantity: 1 }, role: "vegetable" },
    { key: "onion", food: "onion", grams: 30, state: "raw", role: "vegetable" },
    { key: "parsley", food: "parsley", grams: 2, state: "raw", role: "vegetable" },
    { key: "lemon_juice", food: "lemon_juice", grams: 10, state: "as_is", measure: { unit: "tsp", quantity: 2 }, role: "seasoning" },
    { key: "pepper", food: "black_pepper", grams: 0.2, state: "as_is", measure: { unit: "pinch", quantity: 1 }, role: "seasoning" },
    { key: "bread", food: "bread", grams: 120, state: "as_is", measure: { unit: "slice", quantity: 2 }, role: "main_carb", adjust: { kind: "count", unitGrams: 60, min: 1, max: 3 } },
  ],
  sides: [
    { key: "bread", label: { ja: "パン", en: "Bread", es: "Pan", fr: "Pain" }, ingredients: ["bread"], solverMayRemove: true },
  ],
  steps: [
    {
      key: "prep",
      text: {
        ja: "トマトをひと口大に切り、玉ねぎは薄切りにして水に5分さらし、水気を絞ります。パセリはみじん切りにします。",
        en: "Cut the tomato into bite-size pieces. Thinly slice the onion, soak it in water for 5 minutes, and squeeze it dry. Finely chop the parsley.",
        es: "Corta el tomate en trozos pequeños. Corta la cebolla en láminas finas, déjala 5 minutos en agua y escúrrela bien. Pica fino el perejil.",
        fr: "Coupez la tomate en bouchées. Émincez finement l'oignon, faites-le tremper 5 minutes dans l'eau et pressez-le. Hachez finement le persil.",
      },
    },
    {
      key: "mix",
      text: {
        ja: "さばの汁気を切って大きくほぐし、トマト、玉ねぎ、レモン汁、こしょうとさっくり和えます。",
        en: "Drain the mackerel, break it into large flakes, and gently toss with the tomato, onion, lemon juice, and pepper.",
        es: "Escurre la caballa, desmenúzala en trozos grandes y mézclala con cuidado con el tomate, la cebolla, el zumo de limón y la pimienta.",
        fr: "Égouttez le maquereau, émiettez-le en gros morceaux et mélangez-le délicatement avec la tomate, l'oignon, le jus de citron et le poivre.",
      },
    },
    {
      key: "serve",
      text: {
        ja: "器に盛り、パセリを散らします。",
        en: "Transfer to a plate and scatter the parsley.",
        es: "Sírvelo en un plato y esparce el perejil.",
        fr: "Dressez sur une assiette et parsemez de persil.",
      },
    },
    {
      key: "bread",
      side: "bread",
      text: {
        ja: "パンを添えます。",
        en: "Serve with the bread.",
        es: "Acompáñalo con el pan.",
        fr: "Servez avec le pain.",
      },
    },
  ],
  safetyNotes: [
    {
      key: "opened_can",
      text: {
        ja: "開けた缶詰の残りは缶から別の容器に移して冷蔵し、早めに食べてください。",
        en: "Move any leftover canned fish to another container, refrigerate it, and eat it soon.",
        es: "Pasa el pescado en lata que sobre a otro recipiente, guárdalo en el refrigerador y consúmelo pronto.",
        fr: "Transférez le reste du poisson en conserve dans un autre récipient, placez-le au réfrigérateur et consommez-le rapidement.",
      },
    },
  ],
  substitutions: [],
};
