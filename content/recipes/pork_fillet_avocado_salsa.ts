import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "pork_fillet_avocado_salsa",
  texts: {
    name: { ja: "豚ヒレのソテー アボカドサルサ", en: "Pork tenderloin with avocado salsa", es: "Solomillo de cerdo con salsa de aguacate", fr: "Filet mignon de porc et salsa à l'avocat" },
    summary: {
      ja: "中南米のサルサをヒントに、焼いた豚ヒレ肉にアボカド、トマト、パクチーをライムで和えたサルサをのせます。ご飯を添えます。",
      en: "Inspired by Latin American salsas: pan-fried pork tenderloin topped with avocado, tomato, and cilantro dressed with lime, with rice.",
      es: "Inspirado en las salsas latinoamericanas: solomillo de cerdo a la sartén con aguacate, tomate y cilantro aliñados con lima, con arroz.",
      fr: "Inspiré des salsas d'Amérique latine : filet mignon de porc poêlé, garni d'avocat, de tomate et de coriandre assaisonnés au citron vert, avec du riz.",
    },
  },
  cuisine: "latin_american",
  goals: ["cut"],
  mainProteinGroup: "pork",
  tags: [],
  minutes: 20,
  effort: 1,
  equipment: ["stove", "frying_pan"],
  servings: 1,
  ingredients: [
    {
      key: "pork",
      food: "pork_fillet",
      grams: 160,
      state: "grill",
      cooking: "saute",
      role: "main_protein",
      adjust: { kind: "grams", min: 120, max: 220, step: 20 },
      note: {
        ja: "成分表にソテーした豚ヒレ肉の値がないため、焼いた値で計算しています。",
        en: "The tables have no value for sautéed pork tenderloin, so the grilled value is used.",
        es: "Las tablas no tienen un valor para el solomillo de cerdo salteado, así que se usa el valor a la parrilla.",
        fr: "Les tables n'ont pas de valeur pour le filet mignon de porc poêlé ; la valeur grillée est donc utilisée.",
      },
    },
    { key: "olive_oil", food: "olive_oil", grams: 2, state: "as_is", measure: { unit: "tsp", quantity: 0.5 }, role: "fat", linkedTo: "pork" },
    { key: "salt", food: "salt", grams: 1, state: "as_is", measure: { unit: "pinch", quantity: 2 }, role: "seasoning", linkedTo: "pork" },
    { key: "avocado", food: "avocado", grams: 30, state: "raw", measure: { unit: "piece", quantity: 0.25 }, role: "vegetable" },
    { key: "tomato", food: "tomato", grams: 80, state: "raw", measure: { unit: "piece", quantity: 0.5 }, role: "vegetable" },
    { key: "onion", food: "onion", grams: 20, state: "raw", role: "vegetable" },
    { key: "coriander", food: "coriander", grams: 3, state: "raw", role: "vegetable" },
    { key: "lime", food: "lime_juice", grams: 10, state: "as_is", measure: { unit: "tsp", quantity: 2 }, role: "seasoning" },
    { key: "salt_salsa", food: "salt", grams: 0.5, state: "as_is", measure: { unit: "pinch", quantity: 1 }, role: "seasoning" },
    { key: "rice", food: "rice_cooked", grams: 150, state: "as_is", role: "main_carb", adjust: { kind: "grams", min: 100, max: 250, step: 25 } },
  ],
  sides: [
    { key: "rice", label: { ja: "ご飯", en: "Rice", es: "Arroz", fr: "Riz" }, ingredients: ["rice"], solverMayRemove: true },
  ],
  steps: [
    {
      key: "salsa",
      text: {
        ja: "アボカド、トマト、玉ねぎを5mm角に切り、刻んだパクチー、ライム果汁、塩ひとつまみと和えます。",
        en: "Cut the avocado, tomato, and onion into 5 mm dice and toss with the chopped cilantro, lime juice, and a pinch of salt.",
        es: "Corta el aguacate, el tomate y la cebolla en dados de 5 mm y mézclalos con el cilantro picado, el zumo de lima y una pizca de sal.",
        fr: "Coupez l'avocat, la tomate et l'oignon en dés de 5 mm et mélangez-les avec la coriandre hachée, le jus de citron vert et une pincée de sel.",
      },
    },
    {
      key: "sear",
      text: {
        ja: "豚ヒレ肉を厚さ2cmに切って塩をふります。フライパンにオリーブオイルを中火で熱し、片面3分ずつ焼きます。",
        en: "Cut the pork tenderloin into 2 cm thick slices and season with salt. Heat the olive oil in a frying pan over medium heat and cook for 3 minutes on each side.",
        es: "Corta el solomillo de cerdo en medallones de 2 cm y sálalos. Calienta el aceite de oliva en una sartén a fuego medio y cocínalos 3 minutos por cada lado.",
        fr: "Coupez le filet mignon en tranches de 2 cm d'épaisseur et salez-les. Faites chauffer l'huile d'olive dans une poêle à feu moyen et faites cuire 3 minutes de chaque côté.",
      },
    },
    {
      key: "serve",
      text: {
        ja: "器に盛り、サルサをのせます。",
        en: "Plate the pork and spoon the salsa on top.",
        es: "Sirve el cerdo y pon la salsa por encima.",
        fr: "Dressez le porc et nappez-le de salsa.",
      },
    },
    {
      key: "rice",
      side: "rice",
      text: {
        ja: "ご飯を添えます。",
        en: "Serve with the rice.",
        es: "Acompáñalo con el arroz.",
        fr: "Servez avec le riz.",
      },
    },
  ],
  safetyNotes: [
    {
      key: "pork_doneness",
      text: {
        ja: "豚肉は中心まで火を通してください。切り口に赤みがないことを確認します。",
        en: "Cook the pork through. Check that no pink remains when you cut it.",
        es: "Cocina bien el cerdo. Comprueba que no quede nada rosado al cortarlo.",
        fr: "Faites cuire le porc à cœur. Vérifiez qu'il ne reste pas de rose à la découpe.",
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
