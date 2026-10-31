import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "octopus_chickpea_salad",
  texts: {
    name: { ja: "たことひよこ豆のレモンサラダ", en: "Octopus and chickpea lemon salad", es: "Ensalada de pulpo y garbanzos al limón", fr: "Salade citronnée de poulpe et pois chiches" },
    summary: {
      ja: "地中海地方のたこのサラダをヒントに、ゆでだこ、ひよこ豆、生野菜をレモンとオリーブ油で和えます。火を使いません。パンを添えます。",
      en: "Inspired by Mediterranean octopus salads: boiled octopus, chickpeas, and raw vegetables dressed with lemon and olive oil. No cooking. With bread.",
      es: "Inspirado en las ensaladas de pulpo del Mediterráneo: pulpo cocido, garbanzos y verduras crudas aliñados con limón y aceite de oliva. Sin cocinar. Con pan.",
      fr: "Inspirée des salades de poulpe méditerranéennes : poulpe cuit, pois chiches et légumes crus assaisonnés de citron et d'huile d'olive. Sans cuisson. Avec du pain.",
    },
  },
  cuisine: "mediterranean",
  goals: ["cut"],
  mainProteinGroup: "fish",
  tags: ["no_cook"],
  minutes: 10,
  effort: 1,
  equipment: [],
  servings: 1,
  ingredients: [
    { key: "octopus", food: "octopus_boiled", grams: 150, state: "as_is", role: "main_protein", adjust: { kind: "grams", min: 100, max: 200, step: 25 } },
    { key: "chickpeas", food: "chickpeas", grams: 100, state: "as_is", role: "other" },
    { key: "tomato", food: "tomato", grams: 80, state: "raw", measure: { unit: "piece", quantity: 0.5 }, role: "vegetable" },
    { key: "cucumber", food: "cucumber", grams: 60, state: "raw", measure: { unit: "piece", quantity: 0.5 }, role: "vegetable" },
    { key: "red_pepper", food: "red_pepper", grams: 30, state: "raw", role: "vegetable" },
    { key: "onion", food: "onion", grams: 15, state: "raw", role: "vegetable" },
    { key: "parsley", food: "parsley", grams: 5, state: "raw", role: "seasoning" },
    { key: "oil", food: "olive_oil", grams: 6, state: "as_is", measure: { unit: "tsp", quantity: 1.5 }, role: "fat" },
    { key: "lemon", food: "lemon_juice", grams: 15, state: "as_is", measure: { unit: "tbsp", quantity: 1 }, role: "seasoning" },
    { key: "salt", food: "salt", grams: 0.5, state: "as_is", measure: { unit: "pinch", quantity: 1 }, role: "seasoning" },
    { key: "bread", food: "bread", grams: 60, state: "as_is", measure: { unit: "slice", quantity: 1 }, role: "main_carb", adjust: { kind: "grams", min: 30, max: 90, step: 30 } },
  ],
  sides: [
    { key: "bread", label: { ja: "パン", en: "Bread", es: "Pan", fr: "Pain" }, ingredients: ["bread"], solverMayRemove: true },
  ],
  steps: [
    {
      key: "prep",
      text: {
        ja: "ゆでだこをひと口大のそぎ切りにします。ひよこ豆は汁を切ります。トマトと赤ピーマンは1cm角、きゅうりは半月切り、玉ねぎはみじん切り、パセリは刻みます。",
        en: "Slice the boiled octopus into bite-size pieces. Drain the chickpeas. Dice the tomato and red pepper into 1 cm pieces, cut the cucumber into half-moons, and finely chop the onion and parsley.",
        es: "Corta el pulpo cocido en trozos pequeños. Escurre los garbanzos. Corta el tomate y el pimiento rojo en dados de 1 cm, el pepino en medias lunas y pica fino la cebolla y el perejil.",
        fr: "Coupez le poulpe cuit en bouchées. Égouttez les pois chiches. Coupez la tomate et le poivron rouge en dés de 1 cm, le concombre en demi-rondelles, et hachez finement l'oignon et le persil.",
      },
    },
    {
      key: "dress",
      text: {
        ja: "ボウルにオリーブ油、レモン果汁、塩を混ぜ、すべての材料を加えて和えます。",
        en: "Mix the olive oil, lemon juice, and salt in a bowl, add all the other ingredients, and toss.",
        es: "Mezcla el aceite de oliva, el zumo de limón y la sal en un bol, añade el resto de los ingredientes y remueve.",
        fr: "Mélangez l'huile d'olive, le jus de citron et le sel dans un saladier, ajoutez tous les autres ingrédients et mélangez.",
      },
    },
    {
      key: "serve",
      text: { ja: "器に盛ります。", en: "Plate the salad.", es: "Sirve la ensalada en un plato.", fr: "Dressez la salade." },
    },
    {
      key: "bread",
      side: "bread",
      text: { ja: "パンを添えます。", en: "Serve with the bread.", es: "Acompáñalo con el pan.", fr: "Servez avec le pain." },
    },
  ],
  safetyNotes: [
    {
      key: "no_cook",
      text: {
        ja: "加熱しない料理なので、ゆでだこは冷蔵で保存されたものを表示の期限内に使い、作ったらすぐに食べてください。",
        en: "As nothing is cooked, use boiled octopus that has been kept refrigerated and is within the date on the package, and eat the salad straight away.",
        es: "Como no se cocina nada, usa pulpo cocido que se haya conservado en el refrigerador y esté dentro de la fecha del envase, y come la ensalada enseguida.",
        fr: "Comme rien n'est cuit, utilisez du poulpe cuit conservé au réfrigérateur et dont la date indiquée sur l'emballage n'est pas dépassée, et mangez la salade aussitôt.",
      },
    },
    {
      key: "wash_raw",
      text: {
        ja: "生で食べる野菜とハーブは、流水でよく洗ってください。",
        en: "Wash raw vegetables and herbs well under running water.",
        es: "Lava bien con agua corriente las verduras y hierbas que se comen crudas.",
        fr: "Lavez bien sous l'eau courante les légumes et les herbes consommés crus.",
      },
    },
  ],
  substitutions: [],
};
