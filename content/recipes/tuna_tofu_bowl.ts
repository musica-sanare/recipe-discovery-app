import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "tuna_tofu_bowl",
  texts: {
    name: { ja: "ツナと豆腐のサラダ丼", en: "Tuna and tofu salad rice bowl", es: "Bol de arroz con ensalada de atún y tofu" },
    summary: {
      ja: "火を使わず、ツナ缶と豆腐、レタスをご飯にのせて、しょうゆとごま油で仕上げます。",
      en: "No cooking needed: canned tuna, tofu, and lettuce over rice with soy sauce and sesame oil.",
      es: "Sin cocinar: atún en lata, tofu y lechuga sobre arroz con salsa de soja y aceite de sésamo.",
    },
  },
  cuisine: "japanese",
  goals: ["cut"],
  mainProteinGroup: "fish",
  tags: ["no_cook"],
  minutes: 8,
  effort: 1,
  equipment: [],
  servings: 1,
  ingredients: [
    {
      key: "tuna",
      food: "tuna_canned",
      grams: 140,
      state: "as_is",
      measure: { unit: "can", quantity: 2 },
      role: "main_protein",
      adjust: { kind: "count", unitGrams: 70, min: 1, max: 3 },
      note: {
        ja: "汁気を切った重さです（小缶1つ約70g）。",
        en: "Drained weight (about 70 g per small can).",
        es: "Peso escurrido (unos 70 g por lata pequeña).",
      },
    },
    { key: "tofu", food: "tofu_silken", grams: 150, state: "raw", measure: { unit: "block", quantity: 0.5 }, role: "main_protein" },
    { key: "lettuce", food: "lettuce", grams: 40, state: "raw", role: "vegetable" },
    { key: "green_onion", food: "green_onion", grams: 5, state: "raw", role: "vegetable" },
    { key: "soy_sauce", food: "soy_sauce", grams: 8, state: "as_is", measure: { unit: "tsp", quantity: 1.5 }, role: "seasoning" },
    { key: "sesame_oil", food: "sesame_oil", grams: 3, state: "as_is", role: "fat" },
    { key: "rice", food: "rice_cooked", grams: 150, state: "as_is", role: "main_carb", adjust: { kind: "grams", min: 100, max: 250, step: 10 } },
  ],
  sides: [],
  steps: [
    {
      key: "prep",
      text: {
        ja: "ツナ缶の汁気を切ります。豆腐は水気を軽く切ってひと口大に切ります。",
        en: "Drain the tuna. Lightly drain the tofu and cut it into bite-size cubes.",
        es: "Escurre el atún. Escurre ligeramente el tofu y córtalo en dados.",
      },
    },
    {
      key: "assemble",
      text: {
        ja: "器にご飯を盛り、ちぎったレタス、豆腐、ツナをのせます。",
        en: "Put the rice in a bowl and top with torn lettuce, tofu, and tuna.",
        es: "Pon el arroz en un bol y cúbrelo con la lechuga troceada, el tofu y el atún.",
      },
    },
    {
      key: "finish",
      text: {
        ja: "しょうゆとごま油をかけ、青ねぎを散らします。",
        en: "Drizzle with soy sauce and sesame oil and scatter the green onion.",
        es: "Rocía con salsa de soja y aceite de sésamo y esparce la cebolleta.",
      },
    },
  ],
  safetyNotes: [
    {
      key: "no_cook",
      text: {
        ja: "加熱しない料理なので、豆腐とツナ缶は開封後すぐに使い、作ったらすぐに食べてください。",
        en: "As nothing is cooked, use the tofu and tuna right after opening and eat the bowl straight away.",
        es: "Como no se cocina nada, usa el tofu y el atún nada más abrirlos y come el bol enseguida.",
      },
    },
  ],
  substitutions: [],
};
