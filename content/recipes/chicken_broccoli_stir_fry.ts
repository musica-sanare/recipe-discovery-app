import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "chicken_broccoli_stir_fry",
  texts: {
    name: { ja: "鶏むね肉とブロッコリーの中華炒め", en: "Chinese-style chicken and broccoli stir-fry", es: "Salteado chino de pollo y brócoli", fr: "Sauté de poulet et de brocoli à la chinoise" },
    summary: {
      ja: "片栗粉をまぶした鶏むね肉とブロッコリーを、にんにく風味の中華だれで手早く炒めます。",
      en: "Chicken breast coated in potato starch and broccoli, quickly stir-fried in a garlicky Chinese-style sauce.",
      es: "Pechuga de pollo rebozada en fécula y brócoli, salteados rápidamente en una salsa china con ajo.",
      fr: "Blanc de poulet enrobé de fécule de pomme de terre et brocoli, sautés rapidement dans une sauce chinoise à l'ail.",
    },
  },
  cuisine: "chinese",
  goals: ["cut"],
  mainProteinGroup: "chicken",
  tags: [],
  minutes: 15,
  effort: 2,
  equipment: ["stove", "frying_pan"],
  servings: 1,
  ingredients: [
    {
      key: "chicken",
      food: "chicken_breast",
      grams: 150,
      state: "raw",
      cooking: "stir_fry",
      role: "main_protein",
      adjust: { kind: "grams", min: 120, max: 220, step: 10 },
      note: {
        ja: "成分表に炒めた鶏むね肉の値がないため、生の値で計算しています。",
        en: "The tables have no value for stir-fried chicken breast, so the raw value is used.",
        es: "Las tablas no tienen un valor para la pechuga salteada, así que se usa el valor en crudo.",
        fr: "Les tables n'ont pas de valeur pour le blanc de poulet sauté ; la valeur à l'état cru est donc utilisée.",
      },
    },
    { key: "starch", food: "potato_starch", grams: 6, state: "as_is", measure: { unit: "tsp", quantity: 2 }, role: "coating", linkedTo: "chicken" },
    { key: "broccoli", food: "broccoli", grams: 120, state: "stir_fry", role: "vegetable" },
    {
      key: "oil_broccoli",
      food: "vegetable_oil",
      grams: 6,
      state: "as_is",
      measure: { unit: "tsp", quantity: 1.5 },
      role: "fat",
      includedIn: "broccoli",
    },
    { key: "oil_chicken", food: "vegetable_oil", grams: 4, state: "as_is", measure: { unit: "tsp", quantity: 1 }, role: "fat", linkedTo: "chicken" },
    { key: "garlic", food: "garlic", grams: 3, state: "raw", measure: { unit: "clove", quantity: 0.5 }, role: "seasoning", linkedTo: "chicken" },
    { key: "soy_sauce", food: "soy_sauce", grams: 9, state: "as_is", measure: { unit: "tsp", quantity: 1.5 }, role: "seasoning", linkedTo: "chicken" },
    { key: "sake", food: "cooking_sake", grams: 10, state: "as_is", measure: { unit: "tsp", quantity: 2 }, role: "seasoning", linkedTo: "chicken" },
    { key: "sugar", food: "sugar", grams: 2, state: "as_is", role: "seasoning", linkedTo: "chicken" },
    { key: "stock", food: "chinese_stock_granules", grams: 2, state: "as_is", role: "seasoning", linkedTo: "chicken" },
    { key: "sesame_oil", food: "sesame_oil", grams: 2, state: "as_is", role: "fat", linkedTo: "chicken" },
    { key: "rice", food: "rice_cooked", grams: 150, state: "as_is", role: "main_carb", adjust: { kind: "grams", min: 100, max: 250, step: 10 } },
  ],
  sides: [
    { key: "rice", label: { ja: "ご飯", en: "Rice", es: "Arroz", fr: "Riz" }, ingredients: ["rice"], solverMayRemove: true },
  ],
  steps: [
    {
      key: "prep",
      text: {
        ja: "鶏むね肉をひと口大のそぎ切りにし、片栗粉をまぶします。ブロッコリーは小房に分けます。",
        en: "Cut the chicken breast into bite-size slices and coat with potato starch. Cut the broccoli into florets.",
        es: "Corta la pechuga en trozos pequeños al bies y rebózalos con la fécula. Separa el brócoli en ramilletes.",
        fr: "Coupez le blanc de poulet en tranches de la taille d'une bouchée et enrobez-les de fécule de pomme de terre. Détaillez le brocoli en fleurettes.",
      },
    },
    {
      key: "sauce",
      text: {
        ja: "しょうゆ、料理酒、砂糖、中華だし、すりおろしたにんにくを混ぜてたれを作ります。",
        en: "Mix the soy sauce, cooking sake, sugar, stock granules, and grated garlic to make the sauce.",
        es: "Mezcla la salsa de soja, el sake de cocina, el azúcar, el caldo en gránulos y el ajo rallado para la salsa.",
        fr: "Mélangez la sauce soja, le saké de cuisine, le sucre, le bouillon en granulés et l'ail râpé pour faire la sauce.",
      },
    },
    {
      key: "sear",
      text: {
        ja: "フライパンに鶏肉用の油を中火で熱し、鶏肉を両面焼いて取り出します。",
        en: "Heat the oil for the chicken in a frying pan over medium heat, brown the chicken on both sides, and set it aside.",
        es: "Calienta en una sartén el aceite para el pollo a fuego medio, dora el pollo por ambos lados y resérvalo.",
        fr: "Faites chauffer l'huile du poulet dans une poêle à feu moyen, faites dorer le poulet des deux côtés et réservez-le.",
      },
    },
    {
      key: "stir_fry",
      text: {
        ja: "残りの油でブロッコリーを2分炒め、鶏肉とたれを戻し入れて、鶏肉に火が通るまで1〜2分炒めます。仕上げにごま油を回しかけます。",
        en: "Stir-fry the broccoli in the remaining oil for 2 minutes, return the chicken with the sauce, and stir-fry for 1 to 2 minutes until the chicken is cooked through. Finish with the sesame oil.",
        es: "Saltea el brócoli en el resto del aceite 2 minutos, devuelve el pollo con la salsa y saltea 1 o 2 minutos hasta que el pollo esté bien hecho. Termina con el aceite de sésamo.",
        fr: "Faites sauter le brocoli 2 minutes dans le reste d'huile, remettez le poulet avec la sauce et faites sauter 1 à 2 minutes, jusqu'à ce que le poulet soit cuit à cœur. Terminez avec l'huile de sésame.",
      },
    },
  ],
  safetyNotes: [
    {
      key: "chicken_doneness",
      text: {
        ja: "鶏肉は中心まで火を通してください。切り口に赤みがないことを確認します。",
        en: "Cook chicken all the way through. Check that the center is no longer pink.",
        es: "Cocina el pollo completamente. Comprueba que el centro ya no esté rosado.",
        fr: "Faites cuire le poulet à cœur. Vérifiez que le centre n'est plus rosé.",
      },
    },
  ],
  substitutions: [],
};
