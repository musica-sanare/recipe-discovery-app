import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "salmon_tempura",
  texts: {
    name: { ja: "サーモンの天ぷら", en: "Salmon tempura", es: "Tempura de salmón" },
    summary: {
      ja: "サーモンに薄い衣をつけて揚げ、ほうれん草のおひたしとご飯を添えます。揚げ物のため、栄養値は推定の幅が大きくなります。",
      en: "Salmon in a light batter, deep-fried and served with dressed spinach and rice. As a fried dish, its nutrition estimate is less certain.",
      es: "Salmón en un rebozado ligero, frito y servido con espinacas aliñadas y arroz. Al ser una fritura, su estimación nutricional es menos precisa.",
    },
  },
  cuisine: "japanese",
  goals: ["maintain"],
  tags: ["fried"],
  minutes: 25,
  effort: 3,
  equipment: ["stove", "deep_pan", "pot"],
  servings: 1,
  ingredients: [
    { key: "salmon", food: "salmon", grams: 120, state: "tempura", role: "main_protein", adjust: { min: 100, max: 180, step: 10 } },
    { key: "batter", food: "tempura_flour", grams: 11, state: "as_is", measure: { unit: "tbsp", quantity: 1.5 }, role: "coating", includedIn: "salmon" },
    {
      key: "frying_oil",
      food: "vegetable_oil",
      grams: 500,
      state: "as_is",
      role: "fat",
      includedIn: "salmon",
      note: {
        ja: "揚げ油です。吸収される分は天ぷらの値に含まれています。",
        en: "Oil for deep-frying. The absorbed part is included in the tempura value.",
        es: "Aceite para freír. La parte absorbida está incluida en el valor de la tempura.",
      },
    },
    { key: "salt", food: "salt", grams: 0.5, state: "as_is", measure: { unit: "pinch", quantity: 1 }, role: "seasoning" },
    { key: "spinach", food: "spinach", grams: 80, state: "boil", role: "vegetable" },
    { key: "soy_sauce", food: "soy_sauce", grams: 5, state: "as_is", measure: { unit: "tsp", quantity: 1 }, role: "seasoning" },
    { key: "rice", food: "rice_cooked", grams: 180, state: "as_is", role: "main_carb", adjust: { min: 0, max: 280, step: 10 } },
  ],
  steps: [
    {
      ja: "サーモンをひと口大に切り、水気をしっかり拭きます。",
      en: "Cut the salmon into bite-size pieces and pat dry thoroughly.",
      es: "Corta el salmón en trozos pequeños y sécalo bien.",
    },
    {
      ja: "天ぷら粉を冷水で溶き、サーモンにからめて170℃の油で2〜3分揚げます。",
      en: "Mix the tempura flour with cold water, coat the salmon, and deep-fry at 170 °C for 2 to 3 minutes.",
      es: "Mezcla la harina para tempura con agua fría, reboza el salmón y fríelo a 170 °C de 2 a 3 minutos.",
    },
    {
      ja: "ほうれん草をゆでて水気を絞り、しょうゆをかけておひたしにします。",
      en: "Boil the spinach, squeeze out the water, and dress it with soy sauce.",
      es: "Hierve las espinacas, escúrrelas bien y alíñalas con salsa de soja.",
    },
    {
      ja: "天ぷらに塩を添え、おひたしとご飯と一緒に盛り付けます。",
      en: "Serve the tempura with salt, the spinach, and rice.",
      es: "Sirve la tempura con sal, las espinacas y el arroz.",
    },
  ],
  safetyNotes: [
    {
      ja: "揚げ油から目を離さないでください。水気が残っていると油がはねます。",
      en: "Never leave hot oil unattended. Moisture on the food makes the oil spatter.",
      es: "No dejes nunca el aceite caliente sin vigilancia. La humedad en los alimentos hace que el aceite salpique.",
    },
  ],
  substitutions: [],
};
