import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "salmon_tomato_pasta",
  texts: {
    name: { ja: "サーモンのソテーとトマトパスタ", en: "Sautéed salmon with tomato spaghetti", es: "Salmón a la sartén con espaguetis al tomate" },
    summary: {
      ja: "サーモンをソテーし、にんにくとバジルのトマトソースのスパゲッティと合わせます。",
      en: "Sautéed salmon with spaghetti in a garlic and basil tomato sauce.",
      es: "Salmón a la sartén con espaguetis en salsa de tomate con ajo y albahaca.",
    },
  },
  cuisine: "western",
  goals: ["bulk"],
  mainProteinGroup: "fish",
  tags: [],
  minutes: 25,
  effort: 2,
  equipment: ["stove", "frying_pan", "pot"],
  servings: 1,
  ingredients: [
    { key: "salmon", food: "salmon", grams: 120, state: "saute", role: "main_protein", adjust: { kind: "grams", min: 100, max: 180, step: 10 } },
    { key: "oil_salmon", food: "olive_oil", grams: 6, state: "as_is", measure: { unit: "tsp", quantity: 1.5 }, role: "fat", linkedTo: "salmon", includedIn: "salmon" },
    { key: "pasta", food: "pasta", grams: 100, state: "boil", role: "main_carb", adjust: { kind: "grams", min: 80, max: 140, step: 10 } },
    { key: "tomato", food: "tomato_canned", grams: 200, state: "as_is", measure: { unit: "can", quantity: 0.5 }, role: "vegetable" },
    { key: "garlic", food: "garlic", grams: 5, state: "raw", measure: { unit: "clove", quantity: 1 }, role: "seasoning" },
    { key: "oil_sauce", food: "olive_oil", grams: 6, state: "as_is", measure: { unit: "tsp", quantity: 1.5 }, role: "fat" },
    { key: "basil", food: "basil", grams: 3, state: "raw", role: "seasoning" },
    { key: "salt", food: "salt", grams: 1.5, state: "as_is", role: "seasoning" },
    { key: "pepper", food: "black_pepper", grams: 0.2, state: "as_is", measure: { unit: "pinch", quantity: 1 }, role: "seasoning" },
  ],
  sides: [],
  steps: [
    {
      key: "pasta",
      text: {
        ja: "たっぷりの湯でスパゲッティを袋の表示時間どおりにゆでます。",
        en: "Cook the spaghetti in plenty of boiling water for the time on the package.",
        es: "Cuece los espaguetis en abundante agua hirviendo el tiempo indicado en el paquete.",
      },
    },
    {
      key: "sauce",
      text: {
        ja: "別のフライパンにソース用のオリーブ油とつぶしたにんにくを入れて弱火にかけ、香りが出たらトマト缶をつぶしながら加えて8分煮詰め、塩で味を調えます。",
        en: "Warm the sauce oil with crushed garlic over low heat. When fragrant, add the canned tomatoes, crushing them, simmer for 8 minutes, and season with salt.",
        es: "Calienta a fuego bajo el aceite de la salsa con el ajo machacado. Cuando suelte su aroma, añade el tomate en lata aplastándolo, cuece 8 minutos y sala.",
      },
    },
    {
      key: "salmon",
      text: {
        ja: "サーモン用のオリーブ油でサーモンを片面3分ずつ焼きます。",
        en: "Sauté the salmon in its olive oil for 3 minutes on each side.",
        es: "Cocina el salmón a la sartén en su aceite de oliva 3 minutos por cada lado.",
      },
    },
    {
      key: "serve",
      text: {
        ja: "ゆで上がったスパゲッティをソースにからめて皿に盛り、サーモンをのせてバジルとこしょうを散らします。",
        en: "Toss the drained spaghetti in the sauce, plate it, top with the salmon, and finish with basil and pepper.",
        es: "Mezcla los espaguetis escurridos con la salsa, sírvelos con el salmón encima y termina con albahaca y pimienta.",
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
  ],
  substitutions: [],
};
