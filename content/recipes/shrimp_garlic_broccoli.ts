import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "shrimp_garlic_broccoli",
  texts: {
    name: { ja: "えびとブロッコリーのガーリック炒め", en: "Garlic shrimp and broccoli", es: "Gambas al ajillo con brócoli" },
    summary: {
      ja: "スペインのガンバス・アル・アヒージョをヒントに、少ない油でえびとブロッコリーをにんにくと炒めます。パンを添えます。",
      en: "Inspired by Spanish gambas al ajillo: shrimp and broccoli stir-fried with garlic in a little oil, with bread.",
      es: "Inspirado en las gambas al ajillo: gambas y brócoli salteados con ajo y poco aceite, con pan.",
    },
  },
  cuisine: "spanish",
  goals: ["cut"],
  mainProteinGroup: "fish",
  tags: [],
  minutes: 15,
  effort: 1,
  equipment: ["stove", "frying_pan"],
  servings: 1,
  ingredients: [
    {
      key: "shrimp",
      food: "shrimp",
      grams: 180,
      state: "raw",
      cooking: "stir_fry",
      role: "main_protein",
      adjust: { kind: "grams", min: 120, max: 260, step: 20 },
      note: {
        ja: "成分表に炒めたえびの値がないため、生の値で計算しています。殻と背わたを除いた重さです。",
        en: "The tables have no value for stir-fried shrimp, so the raw value is used. Weight after removing the shells and veins.",
        es: "Las tablas no tienen un valor para las gambas salteadas, así que se usa el valor en crudo. Peso sin cáscara ni intestino.",
      },
    },
    { key: "oil_shrimp", food: "olive_oil", grams: 4, state: "as_is", measure: { unit: "tsp", quantity: 1 }, role: "fat", linkedTo: "shrimp" },
    { key: "garlic", food: "garlic", grams: 10, state: "raw", measure: { unit: "clove", quantity: 2 }, role: "seasoning", linkedTo: "shrimp" },
    { key: "salt", food: "salt", grams: 1, state: "as_is", measure: { unit: "pinch", quantity: 2 }, role: "seasoning", linkedTo: "shrimp" },
    { key: "broccoli", food: "broccoli", grams: 120, state: "stir_fry", role: "vegetable" },
    { key: "oil_broccoli", food: "olive_oil", grams: 6, state: "as_is", role: "fat", includedIn: "broccoli" },
    { key: "parsley", food: "parsley", grams: 2, state: "raw", role: "vegetable" },
    { key: "bread", food: "bread", grams: 60, state: "as_is", measure: { unit: "slice", quantity: 1 }, role: "main_carb", adjust: { kind: "count", unitGrams: 60, min: 1, max: 3 } },
  ],
  sides: [
    { key: "bread", label: { ja: "パン", en: "Bread", es: "Pan" }, ingredients: ["bread"], solverMayRemove: true },
  ],
  steps: [
    {
      key: "prep",
      text: {
        ja: "えびの殻をむいて背わたを取り、水気をふきます。ブロッコリーは小房に分け、にんにくは薄切りにします。",
        en: "Peel and devein the shrimp and pat them dry. Cut the broccoli into florets and thinly slice the garlic.",
        es: "Pela las gambas, quítales el intestino y sécalas. Separa el brócoli en ramilletes y corta el ajo en láminas finas.",
      },
    },
    {
      key: "broccoli",
      text: {
        ja: "フライパンにブロッコリー用のオリーブオイルを中火で熱し、ブロッコリーと水大さじ2を入れてふたをし、3分蒸し焼きにして取り出します。",
        en: "Heat the olive oil for the broccoli in a frying pan over medium heat, add the broccoli and 2 tbsp of water, cover, steam-fry for 3 minutes, and set it aside.",
        es: "Calienta el aceite de oliva del brócoli en una sartén a fuego medio, añade el brócoli y 2 cucharadas de agua, tapa, cocina 3 minutos y resérvalo.",
      },
    },
    {
      key: "shrimp",
      text: {
        ja: "えび用のオリーブオイルとにんにくを入れて弱火で香りを出し、えびを加えて中火で全体が赤くなるまで炒めます。ブロッコリーを戻して塩で味を付けます。",
        en: "Warm the garlic in the olive oil for the shrimp over low heat until fragrant, add the shrimp, and stir-fry over medium heat until they turn pink all over. Return the broccoli and season with salt.",
        es: "Calienta el ajo en el aceite de oliva de las gambas a fuego bajo hasta que suelte aroma, añade las gambas y saltéalas a fuego medio hasta que estén rosadas por completo. Devuelve el brócoli y sazona con sal.",
      },
    },
    {
      key: "serve",
      text: {
        ja: "器に盛り、刻んだパセリを散らします。",
        en: "Transfer to a plate and scatter the chopped parsley.",
        es: "Sírvelo en un plato y esparce el perejil picado.",
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
      key: "shrimp_doneness",
      text: {
        ja: "えびは全体が赤くなり、身が白く不透明になるまで加熱してください。",
        en: "Cook the shrimp until they are pink all over and the flesh is white and opaque.",
        es: "Cocina las gambas hasta que estén rosadas por completo y la carne esté blanca y opaca.",
      },
    },
  ],
  substitutions: [],
};
