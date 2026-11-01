import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "emince_zurichois_porc",
  texts: {
    name: { ja: "豚ヒレ肉のチューリッヒ風クリーム炒め", en: "Zurich-style pork tenderloin with mushroom cream sauce", es: "Solomillo de cerdo a la zuriquesa con salsa de champiñones", fr: "Émincé de porc à la zurichoise" },
    summary: {
      ja: "スイス・チューリッヒの煮込みをヒントに、本来の子牛肉の代わりに豚ヒレ肉を使い、マッシュルーム、白ワイン、少量の生クリームでさっと煮ます。ゆでたじゃがいもを添えます。",
      en: "Inspired by the Zurich classic, made with pork tenderloin instead of veal: quickly cooked with button mushrooms, white wine, and a little cream, with boiled potatoes.",
      es: "Inspirado en el clásico de Zúrich, con solomillo de cerdo en lugar de ternera lechal: cocinado en poco tiempo con champiñones, vino blanco y un poco de nata, con patatas cocidas.",
      fr: "Inspiré du classique zurichois, préparé avec du filet mignon de porc au lieu du veau : cuit rapidement avec des champignons de Paris, du vin blanc et un peu de crème, avec des pommes de terre à l'eau.",
    },
  },
  cuisine: "western",
  goals: ["bulk"],
  mainProteinGroup: "pork",
  tags: [],
  minutes: 25,
  effort: 2,
  equipment: ["stove", "frying_pan", "pot"],
  servings: 1,
  ingredients: [
    {
      key: "pork",
      food: "pork_fillet",
      grams: 200,
      state: "grill",
      cooking: "stir_fry",
      role: "main_protein",
      adjust: { kind: "grams", min: 160, max: 240, step: 20 },
      note: {
        ja: "成分表に炒めた豚ヒレ肉の値がないため、焼いた値で計算しています。",
        en: "The tables have no value for stir-fried pork tenderloin, so the grilled value is used.",
        es: "Las tablas no tienen un valor para el solomillo de cerdo salteado, así que se usa el valor a la plancha.",
        fr: "Les tables n'ont pas de valeur pour le filet mignon de porc sauté ; la valeur du porc grillé est donc utilisée.",
      },
    },
    { key: "salt", food: "salt", grams: 1.2, state: "as_is", measure: { unit: "pinch", quantity: 2.5 }, role: "seasoning", linkedTo: "pork" },
    { key: "pepper", food: "black_pepper", grams: 0.2, state: "as_is", measure: { unit: "pinch", quantity: 1 }, role: "seasoning", linkedTo: "pork" },
    { key: "flour", food: "wheat_flour", grams: 5, state: "as_is", measure: { unit: "tsp", quantity: 1.5 }, role: "other", linkedTo: "pork" },
    { key: "oil_pork", food: "vegetable_oil", grams: 4, state: "as_is", measure: { unit: "tsp", quantity: 1 }, role: "fat" },
    { key: "mushrooms", food: "button_mushroom", grams: 80, state: "stir_fry", role: "vegetable" },
    { key: "onion", food: "onion", grams: 40, state: "stir_fry", measure: { unit: "piece", quantity: 0.25 }, role: "vegetable" },
    { key: "oil_vegetables", food: "vegetable_oil", grams: 4, state: "as_is", measure: { unit: "tsp", quantity: 1 }, role: "fat", includedIn: "mushrooms" },
    { key: "wine", food: "white_wine", grams: 40, state: "as_is", role: "other" },
    { key: "cream", food: "cream", grams: 20, state: "as_is", measure: { unit: "tbsp", quantity: 1.25 }, role: "other" },
    { key: "lemon", food: "lemon_juice", grams: 3, state: "as_is", measure: { unit: "tsp", quantity: 0.5 }, role: "seasoning" },
    { key: "parsley", food: "parsley", grams: 2, state: "raw", role: "vegetable" },
    { key: "potato", food: "potato", grams: 350, state: "simmer", measure: { unit: "piece", quantity: 3 }, role: "main_carb", adjust: { kind: "grams", min: 250, max: 450, step: 50 } },
  ],
  sides: [{ key: "potato", label: { ja: "ゆでたじゃがいも", en: "Boiled potatoes", es: "Patatas cocidas", fr: "Pommes de terre à l'eau" }, ingredients: ["potato"], solverMayRemove: true }],
  steps: [
    {
      key: "potato",
      side: "potato",
      text: {
        ja: "じゃがいもは皮をむいて4等分にし、鍋に入れて水からやわらかくなるまで15分ほどゆでます。",
        en: "Peel the potatoes, cut them into quarters, and boil them from cold water for about 15 minutes, until tender.",
        es: "Pela las patatas, córtalas en cuartos y cuécelas partiendo de agua fría unos 15 minutos, hasta que estén tiernas.",
        fr: "Pelez les pommes de terre, coupez-les en quatre et faites-les cuire environ 15 minutes en partant d'eau froide, jusqu'à ce qu'elles soient tendres.",
      },
    },
    {
      key: "prep",
      text: {
        ja: "豚ヒレ肉を5mm幅の細切りにし、塩とこしょうをふって薄力粉をまぶします。マッシュルームは薄切り、玉ねぎはみじん切りにします。",
        en: "Cut the pork into 5 mm strips, season with the salt and pepper, and dust with the flour. Slice the mushrooms and finely chop the onion.",
        es: "Corta el solomillo en tiras de 5 mm, salpimiéntalo y enharínalo. Lamina los champiñones y pica finamente la cebolla.",
        fr: "Émincez le porc en lanières de 5 mm, salez, poivrez et farinez-le. Émincez les champignons et hachez finement l'oignon.",
      },
    },
    {
      key: "pork",
      text: {
        ja: "フライパンに豚肉用の油を強めの中火で熱し、豚肉を2〜3分炒めて取り出します。",
        en: "Heat the oil for the pork in a frying pan over medium-high heat, stir-fry the pork for 2 to 3 minutes, and set it aside.",
        es: "Calienta en una sartén el aceite para el cerdo a fuego medio-alto, saltea el cerdo de 2 a 3 minutos y retíralo.",
        fr: "Faites chauffer l'huile pour le porc dans une poêle à feu moyen-vif, faites sauter le porc 2 à 3 minutes et réservez-le.",
      },
    },
    {
      key: "sauce",
      text: {
        ja: "野菜用の油を足し、玉ねぎとマッシュルームを中火で3分炒めます。白ワインを加えて半量になるまで煮詰め、生クリームと豚肉を戻して1〜2分煮ます。レモン果汁を加え、刻んだパセリを散らします。",
        en: "Add the oil for the vegetables and stir-fry the onion and mushrooms over medium heat for 3 minutes. Pour in the wine and reduce by half, then add the cream and the pork and simmer for 1 to 2 minutes. Stir in the lemon juice and sprinkle with the chopped parsley.",
        es: "Añade el aceite para las verduras y saltea la cebolla y los champiñones a fuego medio 3 minutos. Vierte el vino y deja reducir a la mitad; añade la nata y el cerdo y cuece de 1 a 2 minutos. Añade el zumo de limón y espolvorea con el perejil picado.",
        fr: "Ajoutez l'huile pour les légumes et faites revenir l'oignon et les champignons 3 minutes à feu moyen. Versez le vin et laissez réduire de moitié, puis ajoutez la crème et le porc et laissez mijoter 1 à 2 minutes. Ajoutez le jus de citron et parsemez de persil haché.",
      },
    },
  ],
  safetyNotes: [
    {
      key: "pork_doneness",
      text: {
        ja: "豚肉は中心まで火を通してください。切り口に赤みがなく、肉汁が透明になっていることを確認します。",
        en: "Cook pork all the way through. Check that the center is no longer pink and the juices run clear.",
        es: "Cocina el cerdo completamente. Comprueba que el centro ya no esté rosado y que los jugos salgan transparentes.",
        fr: "Faites cuire le porc à cœur. Vérifiez que le centre n'est plus rosé et que le jus qui s'écoule est clair.",
      },
    },
    {
      key: "alcohol",
      text: {
        ja: "煮詰めても、ワインのアルコールは一部残ることがあります。",
        en: "Some of the alcohol in the wine may remain after it is reduced.",
        es: "Parte del alcohol del vino puede quedar después de reducirlo.",
        fr: "Une partie de l'alcool du vin peut subsister après réduction.",
      },
    },
  ],
  substitutions: [],
};
