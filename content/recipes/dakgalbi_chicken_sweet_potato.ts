import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "dakgalbi_chicken_sweet_potato",
  texts: {
    name: { ja: "鶏もも肉とさつまいものタッカルビ", en: "Dakgalbi with chicken thigh and sweet potato", es: "Dakgalbi de muslo de pollo y boniato", fr: "Dakgalbi de haut de cuisse de poulet et patate douce" },
    summary: {
      ja: "韓国のタッカルビをヒントに、鶏もも肉、さつまいも、キャベツを甘辛いみそだれで炒めます。ご飯を添えます。",
      en: "Inspired by Korean dakgalbi: chicken thigh, sweet potato, and cabbage stir-fried in a sweet and spicy miso sauce, with rice.",
      es: "Inspirado en el dakgalbi coreano: muslo de pollo, boniato y col salteados en una salsa de miso dulce y picante, con arroz.",
      fr: "Inspiré du dakgalbi coréen : haut de cuisse de poulet, patate douce et chou sautés dans une sauce au miso sucrée et pimentée, avec du riz.",
    },
  },
  cuisine: "korean",
  goals: ["maintain"],
  mainProteinGroup: "chicken",
  tags: [],
  minutes: 20,
  effort: 2,
  equipment: ["stove", "frying_pan"],
  servings: 1,
  ingredients: [
    {
      key: "chicken",
      food: "chicken_thigh",
      grams: 160,
      state: "raw",
      cooking: "stir_fry",
      role: "main_protein",
      adjust: { kind: "grams", min: 120, max: 200, step: 20 },
      note: {
        ja: "成分表に炒めた鶏もも肉の値がないため、生の値で計算しています。",
        en: "The tables have no value for stir-fried chicken thigh, so the raw value is used.",
        es: "Las tablas no tienen un valor para el muslo de pollo salteado, así que se usa el valor en crudo.",
        fr: "Les tables n'ont pas de valeur pour le haut de cuisse de poulet sauté ; la valeur à l'état cru est donc utilisée.",
      },
    },
    { key: "oil", food: "vegetable_oil", grams: 3, state: "as_is", measure: { unit: "tsp", quantity: 0.75 }, role: "fat", linkedTo: "chicken" },
    { key: "miso", food: "miso", grams: 8, state: "as_is", role: "seasoning", linkedTo: "chicken" },
    { key: "chili", food: "chili_pepper_powder", grams: 3, state: "as_is", measure: { unit: "tsp", quantity: 1 }, role: "seasoning", linkedTo: "chicken" },
    { key: "soy_sauce", food: "soy_sauce", grams: 9, state: "as_is", measure: { unit: "tsp", quantity: 1.5 }, role: "seasoning", linkedTo: "chicken" },
    { key: "sugar", food: "sugar", grams: 4, state: "as_is", role: "seasoning", linkedTo: "chicken" },
    { key: "garlic", food: "garlic", grams: 5, state: "raw", measure: { unit: "clove", quantity: 1 }, role: "seasoning" },
    { key: "ginger", food: "ginger", grams: 3, state: "raw", role: "seasoning" },
    {
      key: "sweet_potato",
      food: "sweet_potato",
      grams: 100,
      state: "raw",
      cooking: "stir_fry",
      role: "main_carb",
      adjust: { kind: "grams", min: 60, max: 160, step: 20 },
      note: {
        ja: "成分表に炒めたさつまいもの値がないため、生の値で計算しています。",
        en: "The tables have no value for stir-fried sweet potato, so the raw value is used.",
        es: "Las tablas no tienen un valor para el boniato salteado, así que se usa el valor en crudo.",
        fr: "Les tables n'ont pas de valeur pour la patate douce sautée ; la valeur à l'état cru est donc utilisée.",
      },
    },
    { key: "cabbage", food: "cabbage", grams: 120, state: "stir_fry", role: "vegetable" },
    { key: "oil_cabbage", food: "vegetable_oil", grams: 6, state: "as_is", measure: { unit: "tsp", quantity: 1.5 }, role: "fat", includedIn: "cabbage" },
    { key: "onion", food: "onion", grams: 50, state: "stir_fry", role: "vegetable" },
    { key: "rice", food: "rice_cooked", grams: 150, state: "as_is", role: "main_carb", adjust: { kind: "grams", min: 100, max: 200, step: 50 } },
  ],
  sides: [
    { key: "rice", label: { ja: "ご飯", en: "Rice", es: "Arroz", fr: "Riz" }, ingredients: ["rice"], solverMayRemove: true },
  ],
  steps: [
    {
      key: "marinate",
      text: {
        ja: "鶏もも肉をひと口大に切ります。にんにくとしょうがをすりおろし、みそ、一味唐辛子、しょうゆ、砂糖と混ぜて、鶏肉にからめます。",
        en: "Cut the chicken thigh into bite-size pieces. Grate the garlic and ginger, mix them with the miso, ground chili, soy sauce, and sugar, and coat the chicken.",
        es: "Corta el muslo de pollo en trozos pequeños. Ralla el ajo y el jengibre, mézclalos con el miso, la guindilla molida, la salsa de soja y el azúcar, y cubre bien el pollo con la mezcla.",
        fr: "Coupez le poulet en bouchées. Râpez l'ail et le gingembre, mélangez-les avec le miso, le piment moulu, la sauce soja et le sucre, et enrobez-en le poulet.",
      },
    },
    {
      key: "prep",
      text: {
        ja: "さつまいもは皮つきのまま5mm厚さの半月切りにし、キャベツはざく切り、玉ねぎはくし形切りにします。",
        en: "Cut the sweet potato, skin on, into 5 mm half-moons, roughly chop the cabbage, and cut the onion into wedges.",
        es: "Corta el boniato con piel en medias lunas de 5 mm, trocea la col y corta la cebolla en gajos.",
        fr: "Coupez la patate douce avec la peau en demi-rondelles de 5 mm, coupez grossièrement le chou et coupez l'oignon en quartiers.",
      },
    },
    {
      key: "stir_fry",
      text: {
        ja: "フライパンに油を中火で熱し、さつまいもを3分ほど炒めます。鶏肉を加えて炒め、色が変わったらキャベツ、玉ねぎ、残りの油を加え、ふたをして5〜6分蒸し焼きにします。ふたを取り、汁気を飛ばしながら炒め合わせます。",
        en: "Heat the oil in a frying pan over medium heat and stir-fry the sweet potato for about 3 minutes. Add the chicken and stir-fry; when it changes color, add the cabbage, onion, and the rest of the oil, cover, and cook for 5–6 minutes. Uncover and stir-fry until the liquid is reduced.",
        es: "Calienta el aceite en una sartén a fuego medio y saltea el boniato unos 3 minutos. Añade el pollo y saltéalo; cuando cambie de color, añade la col, la cebolla y el resto del aceite, tapa y cocina 5-6 minutos. Destapa y saltea hasta que se reduzca el líquido.",
        fr: "Faites chauffer l'huile dans une poêle à feu moyen et faites sauter la patate douce environ 3 minutes. Ajoutez le poulet et faites sauter ; quand il change de couleur, ajoutez le chou, l'oignon et le reste de l'huile, couvrez et faites cuire 5 à 6 minutes. Retirez le couvercle et faites sauter jusqu'à ce que le liquide ait réduit.",
      },
    },
    {
      key: "serve",
      text: {
        ja: "鶏肉の中まで火が通っていることを確かめて器に盛ります。",
        en: "Check that the chicken is cooked through and plate it.",
        es: "Comprueba que el pollo esté bien hecho y sírvelo.",
        fr: "Vérifiez que le poulet est cuit à cœur et dressez.",
      },
    },
    {
      key: "rice",
      side: "rice",
      text: { ja: "ご飯を添えます。", en: "Serve with the rice.", es: "Acompáñalo con el arroz.", fr: "Servez avec le riz." },
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
