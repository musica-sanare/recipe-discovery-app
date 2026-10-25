import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "salmon_yogurt_cucumber",
  texts: {
    name: { ja: "サーモンのグリル ヨーグルトきゅうりソース", en: "Grilled salmon with yogurt-cucumber sauce", es: "Salmón asado con salsa de yogur y pepino" },
    summary: {
      ja: "地中海のヨーグルトソースをヒントに、トースターで焼いたサーモンに、きゅうりとにんにくのヨーグルトソースを添えます。パンを添えます。",
      en: "Inspired by Mediterranean yogurt sauces: salmon cooked in a toaster oven with a yogurt sauce of cucumber and garlic, with bread.",
      es: "Inspirado en las salsas de yogur mediterráneas: salmón al horno tostador con una salsa de yogur, pepino y ajo, con pan.",
    },
  },
  cuisine: "mediterranean",
  goals: ["maintain"],
  mainProteinGroup: "fish",
  tags: [],
  minutes: 20,
  effort: 1,
  equipment: ["oven_toaster"],
  servings: 1,
  ingredients: [
    { key: "salmon", food: "salmon", grams: 100, state: "grill", role: "main_protein", adjust: { kind: "grams", min: 80, max: 140, step: 20 } },
    { key: "salt", food: "salt", grams: 0.8, state: "as_is", measure: { unit: "pinch", quantity: 2 }, role: "seasoning", linkedTo: "salmon" },
    { key: "yogurt", food: "yogurt_plain", grams: 60, state: "as_is", measure: { unit: "tbsp", quantity: 4 }, role: "other" },
    { key: "cucumber", food: "cucumber", grams: 50, state: "raw", measure: { unit: "piece", quantity: 0.5 }, role: "vegetable" },
    { key: "garlic", food: "garlic", grams: 2, state: "raw", role: "seasoning" },
    { key: "lemon", food: "lemon_juice", grams: 5, state: "as_is", measure: { unit: "tsp", quantity: 1 }, role: "seasoning" },
    { key: "parsley", food: "parsley", grams: 2, state: "raw", role: "vegetable" },
    { key: "bread", food: "bread", grams: 120, state: "as_is", measure: { unit: "slice", quantity: 2 }, role: "main_carb", adjust: { kind: "count", unitGrams: 60, min: 1, max: 3 } },
  ],
  sides: [
    { key: "bread", label: { ja: "パン", en: "Bread", es: "Pan" }, ingredients: ["bread"], solverMayRemove: true },
  ],
  steps: [
    {
      key: "grill",
      text: {
        ja: "サーモンに塩をふり、アルミホイルを敷いたトースターの天板にのせて10〜12分焼きます。",
        en: "Season the salmon with the salt, put it on the foil-lined tray of a toaster oven, and cook for 10–12 minutes.",
        es: "Sala el salmón, ponlo en la bandeja del horno tostador cubierta con papel de aluminio y hornéalo 10-12 minutos.",
      },
    },
    {
      key: "sauce",
      text: {
        ja: "焼いている間に、きゅうりを粗くすりおろして軽く水気を絞ります。ヨーグルト、すりおろしたにんにく、レモン果汁、刻んだパセリと混ぜます。",
        en: "While it cooks, coarsely grate the cucumber and squeeze out some of the liquid. Mix with the yogurt, grated garlic, lemon juice, and chopped parsley.",
        es: "Mientras se hace, ralla el pepino en trozos gruesos y escúrrelo un poco. Mézclalo con el yogur, el ajo rallado, el zumo de limón y el perejil picado.",
      },
    },
    {
      key: "serve",
      text: {
        ja: "サーモンを器に盛り、ソースを添えます。",
        en: "Plate the salmon with the sauce alongside.",
        es: "Sirve el salmón con la salsa al lado.",
      },
    },
    {
      key: "bread",
      side: "bread",
      text: {
        ja: "パンを添えます。",
        en: "Serve with the bread.",
        es: "Acompáñalo con el pan.",
      },
    },
  ],
  safetyNotes: [
    {
      key: "salmon_doneness",
      text: {
        ja: "サーモンは中心まで火を通してください。身がほぐれやすく、不透明になっていれば焼き上がりです。",
        en: "Cook the salmon through; it is done when it is opaque and flakes easily.",
        es: "Cocina el salmón por completo: está hecho cuando es opaco y se desmenuza con facilidad.",
      },
    },
    {
      key: "wash_raw",
      text: {
        ja: "生で食べる野菜とハーブは、流水でよく洗ってください。",
        en: "Wash raw vegetables and herbs well under running water.",
        es: "Lava bien con agua corriente las verduras y hierbas que se comen crudas.",
      },
    },
  ],
  substitutions: [],
};
