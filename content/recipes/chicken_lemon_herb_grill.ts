import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "chicken_lemon_herb_grill",
  texts: {
    name: { ja: "鶏むね肉のレモンハーブグリル", en: "Lemon-herb grilled chicken breast", es: "Pechuga de pollo a la plancha con limón y hierbas", fr: "Blanc de poulet grillé au citron et aux herbes" },
    summary: {
      ja: "レモンとにんにくで下味をつけた鶏むね肉を焼き、ゆでブロッコリーとご飯を添えます。",
      en: "Chicken breast marinated with lemon and garlic, grilled and served with boiled broccoli and rice.",
      es: "Pechuga de pollo marinada con limón y ajo, a la plancha, con brócoli hervido y arroz.",
      fr: "Blanc de poulet mariné au citron et à l'ail, grillé et servi avec du brocoli bouilli et du riz.",
    },
  },
  cuisine: "western",
  goals: ["cut"],
  mainProteinGroup: "chicken",
  tags: [],
  minutes: 20,
  effort: 1,
  equipment: ["stove", "frying_pan", "pot"],
  servings: 1,
  ingredients: [
    { key: "chicken", food: "chicken_breast", grams: 150, state: "grill", role: "main_protein", adjust: { kind: "grams", min: 120, max: 220, step: 10 } },
    { key: "oil", food: "olive_oil", grams: 4, state: "as_is", measure: { unit: "tsp", quantity: 1 }, role: "fat", linkedTo: "chicken" },
    { key: "lemon", food: "lemon_juice", grams: 10, state: "as_is", measure: { unit: "tsp", quantity: 2 }, role: "seasoning", linkedTo: "chicken" },
    { key: "garlic", food: "garlic", grams: 3, state: "raw", measure: { unit: "clove", quantity: 0.5 }, role: "seasoning", linkedTo: "chicken" },
    { key: "salt", food: "salt", grams: 1, state: "as_is", role: "seasoning", linkedTo: "chicken" },
    { key: "pepper", food: "black_pepper", grams: 0.2, state: "as_is", measure: { unit: "pinch", quantity: 1 }, role: "seasoning", linkedTo: "chicken" },
    { key: "parsley", food: "parsley", grams: 2, state: "raw", role: "seasoning", linkedTo: "chicken" },
    { key: "broccoli", food: "broccoli", grams: 100, state: "boil", role: "vegetable" },
    { key: "rice", food: "rice_cooked", grams: 150, state: "as_is", role: "main_carb", adjust: { kind: "grams", min: 100, max: 250, step: 10 } },
  ],
  sides: [
    { key: "rice", label: { ja: "ご飯", en: "Rice", es: "Arroz", fr: "Riz" }, ingredients: ["rice"], solverMayRemove: true },
    { key: "broccoli", label: { ja: "ゆでブロッコリー", en: "Boiled broccoli", es: "Brócoli hervido", fr: "Brocoli bouilli" }, ingredients: ["broccoli"], solverMayRemove: false },
  ],
  steps: [
    {
      key: "marinate",
      text: {
        ja: "鶏むね肉を厚さ1.5cmほどに開き、レモン果汁、すりおろしたにんにく、塩、こしょうをもみ込んで10分置きます。",
        en: "Butterfly the chicken breast to about 1.5 cm thick. Rub in the lemon juice, grated garlic, salt, and pepper, and leave for 10 minutes.",
        es: "Abre la pechuga en libro hasta unos 1,5 cm de grosor. Úntala con el zumo de limón, el ajo rallado, la sal y la pimienta, y déjala reposar 10 minutos.",
        fr: "Ouvrez le blanc de poulet en portefeuille pour qu'il fasse environ 1,5 cm d'épaisseur. Frottez-le avec le jus de citron, l'ail râpé, le sel et le poivre, et laissez reposer 10 minutes.",
      },
    },
    {
      key: "broccoli",
      side: "broccoli",
      text: {
        ja: "ブロッコリーを小房に分け、沸騰した湯で2分ほどゆでて湯を切ります。",
        en: "Cut the broccoli into florets, boil for about 2 minutes, and drain.",
        es: "Separa el brócoli en ramilletes, hiérvelo unos 2 minutos y escúrrelo.",
        fr: "Détaillez le brocoli en fleurettes, faites-le bouillir environ 2 minutes et égouttez-le.",
      },
    },
    {
      key: "cook",
      text: {
        ja: "フライパンにオリーブ油を中火で熱し、鶏肉を片面4分ずつ焼きます。ふたをして弱火で2〜3分蒸し焼きにします。",
        en: "Heat the olive oil in a frying pan over medium heat and cook the chicken for 4 minutes on each side. Cover and cook over low heat for 2 to 3 more minutes.",
        es: "Calienta el aceite de oliva en una sartén a fuego medio y cocina el pollo 4 minutos por cada lado. Tapa y cocina a fuego bajo 2 o 3 minutos más.",
        fr: "Faites chauffer l'huile d'olive dans une poêle à feu moyen et faites cuire le poulet 4 minutes de chaque côté. Couvrez et poursuivez la cuisson 2 à 3 minutes à feu doux.",
      },
    },
    {
      key: "serve",
      text: {
        ja: "切ってパセリを散らします。",
        en: "Slice and sprinkle with parsley.",
        es: "Córtalo y espolvorea el perejil.",
        fr: "Tranchez et parsemez de persil.",
      },
    },
  ],
  safetyNotes: [
    {
      key: "chicken_doneness",
      text: {
        ja: "鶏肉は中心まで火を通してください。切り口に赤みがなく、肉汁が透明になっていることを確認します。",
        en: "Cook chicken all the way through. Check that the center is no longer pink and the juices run clear.",
        es: "Cocina el pollo completamente. Comprueba que el centro ya no esté rosado y que los jugos salgan transparentes.",
        fr: "Faites cuire le poulet à cœur. Vérifiez que le centre n'est plus rosé et que le jus qui s'écoule est clair.",
      },
    },
  ],
  substitutions: [
    {
      key: "pork_fillet",
      ingredient: "chicken",
      food: "pork_fillet",
      state: "grill",
      ratio: 1,
      stepTexts: [
        {
          step: "marinate",
          text: {
            ja: "豚ヒレ肉を1.5cm厚さに切り、レモン果汁、すりおろしたにんにく、塩、こしょうをもみ込んで10分置きます。",
            en: "Cut the pork tenderloin into slices about 1.5 cm thick. Rub in the lemon juice, grated garlic, salt, and pepper, and leave for 10 minutes.",
            es: "Corta el solomillo de cerdo en medallones de unos 1,5 cm de grosor. Úntalos con el zumo de limón, el ajo rallado, la sal y la pimienta, y déjalos reposar 10 minutos.",
            fr: "Coupez le filet mignon de porc en tranches d'environ 1,5 cm d'épaisseur. Frottez-les avec le jus de citron, l'ail râpé, le sel et le poivre, et laissez reposer 10 minutes.",
          },
        },
        {
          step: "cook",
          text: {
            ja: "フライパンにオリーブ油を中火で熱し、豚肉を片面3〜4分ずつ焼きます。",
            en: "Heat the olive oil in a frying pan over medium heat and cook the pork for 3 to 4 minutes on each side.",
            es: "Calienta el aceite de oliva en una sartén a fuego medio y cocina el cerdo de 3 a 4 minutos por cada lado.",
            fr: "Faites chauffer l'huile d'olive dans une poêle à feu moyen et faites cuire le porc 3 à 4 minutes de chaque côté.",
          },
        },
      ],
      safetyNotes: {
        replace: [
          {
            key: "chicken_doneness",
            text: {
              ja: "豚肉は中心まで火を通してください。切り口に赤みがなく、肉汁が透明になっていることを確認します。",
              en: "Cook pork all the way through. Check that the center is no longer pink and the juices run clear.",
              es: "Cocina el cerdo completamente. Comprueba que el centro ya no esté rosado y que los jugos salgan transparentes.",
              fr: "Faites cuire le porc à cœur. Vérifiez que le centre n'est plus rosé et que le jus qui s'écoule est clair.",
            },
          },
        ],
      },
      note: { ja: "豚ヒレ肉でも作れます。切り方と焼き時間が変わります。", en: "Works with pork tenderloin; the cut and the cooking time change.", es: "También se puede hacer con solomillo de cerdo; cambian el corte y el tiempo de cocción.", fr: "Fonctionne aussi avec du filet mignon de porc ; la découpe et le temps de cuisson changent." },
    },
  ],
};
