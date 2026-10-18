import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "chicken_lemon_herb_grill",
  texts: {
    name: { ja: "鶏むね肉のレモンハーブグリル", en: "Lemon-herb grilled chicken breast", es: "Pechuga de pollo a la plancha con limón y hierbas" },
    summary: {
      ja: "レモンとにんにくで下味をつけた鶏むね肉を焼き、ゆでブロッコリーとご飯を添えます。",
      en: "Chicken breast marinated with lemon and garlic, grilled and served with boiled broccoli and rice.",
      es: "Pechuga de pollo marinada con limón y ajo, a la plancha, con brócoli hervido y arroz.",
    },
  },
  cuisine: "western",
  goals: ["cut"],
  tags: [],
  minutes: 20,
  effort: 1,
  equipment: ["stove", "frying_pan", "pot"],
  servings: 1,
  ingredients: [
    { key: "chicken", food: "chicken_breast", grams: 150, state: "grill", role: "main_protein", adjust: { min: 120, max: 220, step: 10 } },
    { key: "oil", food: "olive_oil", grams: 4, state: "as_is", measure: { unit: "tsp", quantity: 1 }, role: "fat" },
    { key: "lemon", food: "lemon_juice", grams: 10, state: "as_is", measure: { unit: "tsp", quantity: 2 }, role: "seasoning" },
    { key: "garlic", food: "garlic", grams: 3, state: "raw", measure: { unit: "clove", quantity: 0.5 }, role: "seasoning" },
    { key: "salt", food: "salt", grams: 1, state: "as_is", role: "seasoning" },
    { key: "pepper", food: "black_pepper", grams: 0.2, state: "as_is", measure: { unit: "pinch", quantity: 1 }, role: "seasoning" },
    { key: "parsley", food: "parsley", grams: 2, state: "raw", role: "seasoning" },
    { key: "broccoli", food: "broccoli", grams: 100, state: "boil", role: "vegetable" },
    { key: "rice", food: "rice_cooked", grams: 150, state: "as_is", role: "main_carb", adjust: { min: 0, max: 250, step: 10 } },
  ],
  steps: [
    {
      ja: "鶏むね肉を厚さ1.5cmほどに開き、レモン果汁、すりおろしたにんにく、塩、こしょうをもみ込んで10分置きます。",
      en: "Butterfly the chicken breast to about 1.5 cm thick. Rub in the lemon juice, grated garlic, salt, and pepper, and leave for 10 minutes.",
      es: "Abre la pechuga en libro hasta unos 1,5 cm de grosor. Úntala con el zumo de limón, el ajo rallado, la sal y la pimienta, y déjala reposar 10 minutos.",
    },
    {
      ja: "ブロッコリーを小房に分け、沸騰した湯で2分ほどゆでて湯を切ります。",
      en: "Cut the broccoli into florets, boil for about 2 minutes, and drain.",
      es: "Separa el brócoli en ramilletes, hiérvelo unos 2 minutos y escúrrelo.",
    },
    {
      ja: "フライパンにオリーブ油を中火で熱し、鶏肉を片面4分ずつ焼きます。ふたをして弱火で2〜3分蒸し焼きにします。",
      en: "Heat the olive oil in a frying pan over medium heat and cook the chicken for 4 minutes on each side. Cover and cook over low heat for 2 to 3 more minutes.",
      es: "Calienta el aceite de oliva en una sartén a fuego medio y cocina el pollo 4 minutos por cada lado. Tapa y cocina a fuego bajo 2 o 3 minutos más.",
    },
    {
      ja: "切ってパセリを散らし、ブロッコリーとご飯を添えます。",
      en: "Slice, sprinkle with parsley, and serve with the broccoli and rice.",
      es: "Córtalo en tiras, espolvorea el perejil y sírvelo con el brócoli y el arroz.",
    },
  ],
  safetyNotes: [
    {
      ja: "鶏肉は中心まで火を通してください。切り口に赤みがなく、肉汁が透明になっていることを確認します。",
      en: "Cook chicken all the way through. Check that the center is no longer pink and the juices run clear.",
      es: "Cocina el pollo completamente. Comprueba que el centro ya no esté rosado y que los jugos salgan transparentes.",
    },
  ],
  substitutions: [
    {
      ingredient: "chicken",
      food: "pork_fillet",
      state: "grill",
      ratio: 1,
      note: { ja: "豚ヒレ肉でも同じ手順で作れます。", en: "Pork tenderloin works with the same steps.", es: "El solomillo de cerdo funciona con los mismos pasos." },
    },
  ],
};
