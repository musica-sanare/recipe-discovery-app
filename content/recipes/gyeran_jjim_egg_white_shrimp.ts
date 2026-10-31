import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "gyeran_jjim_egg_white_shrimp",
  texts: {
    name: { ja: "卵白とえびのレンジケランチム", en: "Microwave gyeran-jjim with egg whites and shrimp", es: "Gyeran-jjim de claras y gambas al microondas" },
    summary: {
      ja: "韓国の蒸し卵ケランチムをヒントに、卵白を多めにした卵液とえびを電子レンジでふんわり蒸します。ご飯を添えます。",
      en: "Inspired by Korean steamed eggs (gyeran-jjim): a mostly egg-white mixture with shrimp, steamed soft in the microwave, with rice.",
      es: "Inspirado en los huevos al vapor coreanos (gyeran-jjim): una mezcla sobre todo de claras con gambas, cocida al vapor en el microondas hasta quedar esponjosa, con arroz.",
    },
  },
  cuisine: "korean",
  goals: ["cut"],
  mainProteinGroup: "egg",
  tags: ["breakfast"],
  minutes: 10,
  effort: 1,
  equipment: ["microwave"],
  servings: 1,
  ingredients: [
    {
      key: "egg_white",
      food: "egg_white",
      grams: 200,
      state: "raw",
      cooking: "steam",
      role: "main_protein",
      adjust: { kind: "grams", min: 150, max: 250, step: 25 },
      note: {
        ja: "成分表に蒸した卵白の値がないため、生の値で計算しています。",
        en: "The tables have no value for steamed egg white, so the raw value is used.",
        es: "Las tablas no tienen un valor para la clara al vapor, así que se usa el valor en crudo.",
      },
    },
    {
      key: "egg",
      food: "egg",
      grams: 50,
      state: "raw",
      cooking: "steam",
      measure: { unit: "piece", quantity: 1 },
      role: "main_protein",
      note: {
        ja: "成分表に蒸した卵の値がないため、生の値で計算しています。",
        en: "The tables have no value for steamed egg, so the raw value is used.",
        es: "Las tablas no tienen un valor para el huevo al vapor, así que se usa el valor en crudo.",
      },
    },
    {
      key: "shrimp",
      food: "shrimp",
      grams: 60,
      state: "raw",
      cooking: "steam",
      role: "other",
      note: {
        ja: "成分表に蒸したえびの値がないため、生の値で計算しています。",
        en: "The tables have no value for steamed shrimp, so the raw value is used.",
        es: "Las tablas no tienen un valor para las gambas al vapor, así que se usa el valor en crudo.",
      },
    },
    { key: "green_onion", food: "green_onion", grams: 10, state: "raw", role: "vegetable" },
    { key: "salt", food: "salt", grams: 1, state: "as_is", measure: { unit: "pinch", quantity: 2 }, role: "seasoning" },
    { key: "sesame_oil", food: "sesame_oil", grams: 2, state: "as_is", measure: { unit: "tsp", quantity: 0.5 }, role: "fat" },
    { key: "rice", food: "rice_cooked", grams: 200, state: "as_is", role: "main_carb", adjust: { kind: "grams", min: 150, max: 250, step: 50 } },
  ],
  sides: [
    { key: "rice", label: { ja: "ご飯", en: "Rice", es: "Arroz" }, ingredients: ["rice"], solverMayRemove: true },
  ],
  steps: [
    {
      key: "mix",
      text: {
        ja: "耐熱の深めの器に卵白、卵、塩、水大さじ3を入れてよく混ぜます。えびは背わたを取って1cm幅に切り、青ねぎは小口切りにします。",
        en: "In a deep heatproof bowl, beat the egg whites, egg, salt, and 3 tablespoons of water well. Devein the shrimp and cut them into 1 cm pieces, and slice the green onion thinly.",
        es: "En un cuenco hondo apto para microondas, bate bien las claras, el huevo, la sal y 3 cucharadas de agua. Quita el intestino a las gambas y córtalas en trozos de 1 cm, y corta la cebolleta en rodajas finas.",
      },
    },
    {
      key: "steam",
      text: {
        ja: "えびと青ねぎの半量を卵液に加えます。ふんわりとラップをかけて600Wで2分加熱し、全体を軽く混ぜてさらに1〜2分、中心まで固まるまで加熱します。",
        en: "Add the shrimp and half of the green onion to the egg mixture. Cover loosely with plastic wrap and microwave at 600 W for 2 minutes, stir gently, and heat for 1–2 more minutes until set in the center.",
        es: "Añade las gambas y la mitad de la cebolleta a la mezcla de huevo. Cubre sin apretar con film y calienta a 600 W durante 2 minutos, remueve con suavidad y calienta 1-2 minutos más, hasta que cuaje en el centro.",
      },
    },
    {
      key: "serve",
      text: {
        ja: "残りの青ねぎをのせ、ごま油をかけます。",
        en: "Top with the rest of the green onion and drizzle with the sesame oil.",
        es: "Pon por encima el resto de la cebolleta y rocía con el aceite de sésamo.",
      },
    },
    {
      key: "rice",
      side: "rice",
      text: { ja: "ご飯を添えます。", en: "Serve with the rice.", es: "Acompáñalo con el arroz." },
    },
  ],
  safetyNotes: [
    {
      key: "custard_set",
      text: {
        ja: "卵液が中心まで固まり、えびの中まで火が通るまで加熱してください。",
        en: "Heat until the egg is set in the center and the shrimp are cooked through.",
        es: "Calienta hasta que el huevo cuaje en el centro y las gambas estén bien hechas.",
      },
    },
    {
      key: "steam",
      text: {
        ja: "加熱直後は蒸気でやけどしやすいので、ラップは奥から手前に向かって外してください。",
        en: "Steam can burn right after heating; peel the wrap away from you.",
        es: "El vapor puede quemar justo después de calentar; retira el film en dirección contraria a ti.",
      },
    },
  ],
  substitutions: [],
};
