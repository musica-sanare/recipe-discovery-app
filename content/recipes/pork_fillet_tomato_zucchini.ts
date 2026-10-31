import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "pork_fillet_tomato_zucchini",
  texts: {
    name: { ja: "豚ヒレのソテー トマトとズッキーニのソース", en: "Pork tenderloin with tomato and zucchini sauce", es: "Solomillo de cerdo con salsa de tomate y calabacín", fr: "Filet mignon de porc sauce tomate et courgette" },
    summary: {
      ja: "焼いた豚ヒレ肉に、にんにくの効いたトマトとズッキーニのソースをかけます。パンを添えます。",
      en: "Seared pork tenderloin topped with a garlicky tomato and zucchini sauce, with bread.",
      es: "Solomillo de cerdo dorado con una salsa de tomate y calabacín con ajo, con pan.",
      fr: "Filet mignon de porc saisi, nappé d'une sauce tomate et courgette bien aillée, avec du pain.",
    },
  },
  cuisine: "western",
  goals: ["cut"],
  mainProteinGroup: "pork",
  tags: [],
  minutes: 20,
  effort: 2,
  equipment: ["stove", "frying_pan"],
  servings: 1,
  ingredients: [
    {
      key: "pork",
      food: "pork_fillet",
      grams: 180,
      state: "grill",
      cooking: "saute",
      role: "main_protein",
      adjust: { kind: "grams", min: 140, max: 240, step: 10 },
      note: {
        ja: "成分表にソテーした豚ヒレ肉の値がないため、焼いた値で計算しています。",
        en: "The tables have no value for sautéed pork tenderloin, so the grilled value is used.",
        es: "Las tablas no tienen un valor para el solomillo de cerdo salteado, así que se usa el valor a la parrilla.",
        fr: "Les tables n'ont pas de valeur pour le filet mignon de porc poêlé ; la valeur grillée est donc utilisée.",
      },
    },
    { key: "oil_pork", food: "olive_oil", grams: 3, state: "as_is", measure: { unit: "tsp", quantity: 0.75 }, role: "fat", linkedTo: "pork" },
    { key: "salt", food: "salt", grams: 1, state: "as_is", measure: { unit: "pinch", quantity: 2 }, role: "seasoning", linkedTo: "pork" },
    { key: "pepper", food: "black_pepper", grams: 0.2, state: "as_is", measure: { unit: "pinch", quantity: 1 }, role: "seasoning", linkedTo: "pork" },
    {
      key: "zucchini",
      food: "zucchini",
      grams: 100,
      state: "raw",
      cooking: "saute",
      measure: { unit: "piece", quantity: 0.5 },
      role: "vegetable",
      note: {
        ja: "成分表に加熱したズッキーニの値がないため、生の値で計算しています。",
        en: "The tables have no value for cooked zucchini, so the raw value is used.",
        es: "Las tablas no tienen un valor para el calabacín cocinado, así que se usa el valor en crudo.",
        fr: "Les tables n'ont pas de valeur pour la courgette cuite ; la valeur à l'état cru est donc utilisée.",
      },
    },
    { key: "oil_sauce", food: "olive_oil", grams: 2, state: "as_is", measure: { unit: "tsp", quantity: 0.5 }, role: "fat" },
    { key: "garlic", food: "garlic", grams: 5, state: "raw", measure: { unit: "clove", quantity: 1 }, role: "seasoning" },
    { key: "tomato_canned", food: "tomato_canned", grams: 150, state: "as_is", role: "vegetable" },
    { key: "bread", food: "bread", grams: 60, state: "as_is", measure: { unit: "slice", quantity: 1 }, role: "main_carb", adjust: { kind: "count", unitGrams: 60, min: 1, max: 3 } },
  ],
  sides: [
    { key: "bread", label: { ja: "パン", en: "Bread", es: "Pan", fr: "Pain" }, ingredients: ["bread"], solverMayRemove: true },
  ],
  steps: [
    {
      key: "prep",
      text: {
        ja: "豚ヒレ肉を厚さ2cmに切り、塩とこしょうをふります。ズッキーニは1cm角に切り、にんにくはみじん切りにします。",
        en: "Cut the pork tenderloin into 2 cm thick slices and season with salt and pepper. Cut the zucchini into 1 cm cubes and finely chop the garlic.",
        es: "Corta el solomillo de cerdo en medallones de 2 cm y salpimiéntalo. Corta el calabacín en dados de 1 cm y pica fino el ajo.",
        fr: "Coupez le filet mignon en tranches de 2 cm d'épaisseur, salez et poivrez. Coupez la courgette en cubes de 1 cm et hachez finement l'ail.",
      },
    },
    {
      key: "sear",
      text: {
        ja: "フライパンに豚肉用のオリーブオイルを中火で熱し、豚肉を片面3分ずつ焼いて器に盛ります。",
        en: "Heat the olive oil for the pork in a frying pan over medium heat, sear the pork for 3 minutes on each side, and transfer it to a plate.",
        es: "Calienta el aceite de oliva del cerdo en una sartén a fuego medio, dora el cerdo 3 minutos por cada lado y pásalo a un plato.",
        fr: "Faites chauffer l'huile d'olive du porc dans une poêle à feu moyen, saisissez le porc 3 minutes de chaque côté et mettez-le sur une assiette.",
      },
    },
    {
      key: "sauce",
      text: {
        ja: "ソース用のオリーブオイルでにんにくとズッキーニを2分炒め、トマト缶を加えて3分煮詰め、豚肉にかけます。",
        en: "Stir-fry the garlic and zucchini in the olive oil for the sauce for 2 minutes, add the canned tomatoes, cook down for 3 minutes, and pour over the pork.",
        es: "Saltea el ajo y el calabacín 2 minutos con el aceite de oliva de la salsa, añade el tomate en lata, deja reducir 3 minutos y viértelo sobre el cerdo.",
        fr: "Faites sauter l'ail et la courgette 2 minutes dans l'huile d'olive de la sauce, ajoutez les tomates en conserve, laissez réduire 3 minutes et versez sur le porc.",
      },
    },
    {
      key: "bread",
      side: "bread",
      text: {
        ja: "パンを添えます。",
        en: "Serve with the bread.",
        es: "Acompáñalo con el pan.",
        fr: "Servez avec le pain.",
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
  ],
  substitutions: [],
};
