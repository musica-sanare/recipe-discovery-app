import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "chicken_breast_tomato_simmer",
  texts: {
    name: { ja: "鶏むね肉とズッキーニのトマト煮", en: "Chicken breast and zucchini in tomato sauce", es: "Pechuga de pollo y calabacín en salsa de tomate", fr: "Blanc de poulet et courgette à la sauce tomate" },
    summary: {
      ja: "スペインの家庭料理をヒントに、鶏むね肉とズッキーニをパプリカの香るトマトソースで煮ます。パンを添えます。",
      en: "Inspired by Spanish home cooking: chicken breast and zucchini simmered in a tomato sauce with paprika, with bread.",
      es: "Inspirado en la cocina casera española: pechuga de pollo y calabacín guisados en salsa de tomate con pimentón, con pan.",
      fr: "Inspiré de la cuisine familiale espagnole : blanc de poulet et courgette mijotés dans une sauce tomate au paprika, avec du pain.",
    },
  },
  cuisine: "spanish",
  goals: ["maintain"],
  mainProteinGroup: "chicken",
  tags: [],
  minutes: 25,
  effort: 2,
  equipment: ["stove", "frying_pan"],
  servings: 1,
  ingredients: [
    {
      key: "chicken",
      food: "chicken_breast",
      grams: 180,
      state: "raw",
      cooking: "simmer",
      role: "main_protein",
      adjust: { kind: "grams", min: 140, max: 260, step: 20 },
      note: {
        ja: "成分表に煮込んだ鶏むね肉の値がないため、生の値で計算しています。",
        en: "The tables have no value for stewed chicken breast, so the raw value is used.",
        es: "Las tablas no tienen un valor para la pechuga de pollo guisada, así que se usa el valor en crudo.",
        fr: "Les tables n'ont pas de valeur pour le blanc de poulet mijoté ; la valeur à l'état cru est donc utilisée.",
      },
    },
    { key: "olive_oil", food: "olive_oil", grams: 5, state: "as_is", measure: { unit: "tsp", quantity: 1.25 }, role: "fat", linkedTo: "chicken" },
    { key: "salt", food: "salt", grams: 1, state: "as_is", measure: { unit: "pinch", quantity: 2 }, role: "seasoning", linkedTo: "chicken" },
    { key: "paprika", food: "paprika_powder", grams: 2, state: "as_is", measure: { unit: "tsp", quantity: 1 }, role: "seasoning", linkedTo: "chicken" },
    { key: "zucchini", food: "zucchini", grams: 100, state: "raw", cooking: "simmer", measure: { unit: "piece", quantity: 0.5 }, role: "vegetable" },
    { key: "onion", food: "onion", grams: 60, state: "raw", cooking: "simmer", measure: { unit: "piece", quantity: 0.25 }, role: "vegetable" },
    { key: "garlic", food: "garlic", grams: 5, state: "raw", measure: { unit: "clove", quantity: 1 }, role: "seasoning" },
    { key: "tomato_canned", food: "tomato_canned", grams: 200, state: "as_is", measure: { unit: "can", quantity: 0.5 }, role: "vegetable" },
    { key: "bread", food: "bread", grams: 120, state: "as_is", measure: { unit: "slice", quantity: 2 }, role: "main_carb", adjust: { kind: "count", unitGrams: 60, min: 1, max: 3 } },
  ],
  sides: [
    { key: "bread", label: { ja: "パン", en: "Bread", es: "Pan", fr: "Pain" }, ingredients: ["bread"], solverMayRemove: true },
  ],
  steps: [
    {
      key: "prep",
      text: {
        ja: "鶏むね肉をひと口大のそぎ切りにし、塩とパプリカをまぶします。ズッキーニは1cm幅の半月切り、玉ねぎは薄切りにし、にんにくはつぶします。",
        en: "Cut the chicken breast into bite-size slices and coat with the salt and paprika. Cut the zucchini into 1 cm half-moons, thinly slice the onion, and crush the garlic.",
        es: "Corta la pechuga de pollo en lonchas pequeñas y cúbrelas con la sal y el pimentón. Corta el calabacín en medias lunas de 1 cm, la cebolla en láminas finas y machaca el ajo.",
        fr: "Coupez le blanc de poulet en tranches de la taille d'une bouchée et enrobez-les de sel et de paprika. Coupez la courgette en demi-rondelles de 1 cm, émincez finement l'oignon et écrasez l'ail.",
      },
    },
    {
      key: "brown",
      text: {
        ja: "フライパンにオリーブオイルとにんにくを入れて中火にかけ、鶏肉の両面に焼き色をつけます。",
        en: "Put the olive oil and garlic in a frying pan over medium heat and brown the chicken on both sides.",
        es: "Pon el aceite de oliva y el ajo en una sartén a fuego medio y dora el pollo por ambos lados.",
        fr: "Mettez l'huile d'olive et l'ail dans une poêle à feu moyen et faites dorer le poulet des deux côtés.",
      },
    },
    {
      key: "simmer",
      text: {
        ja: "玉ねぎ、ズッキーニ、トマト缶を加えて煮立て、ふたをして弱めの中火で10分煮込みます。",
        en: "Add the onion, zucchini, and canned tomatoes, bring to a boil, cover, and simmer over medium-low heat for 10 minutes.",
        es: "Añade la cebolla, el calabacín y el tomate en lata, lleva a ebullición, tapa y guisa a fuego medio-bajo 10 minutos.",
        fr: "Ajoutez l'oignon, la courgette et les tomates en conserve, portez à ébullition, couvrez et laissez mijoter 10 minutes à feu moyen-doux.",
      },
    },
    {
      key: "serve",
      text: {
        ja: "器に盛ります。",
        en: "Transfer to a plate.",
        es: "Sírvelo en un plato.",
        fr: "Dressez sur une assiette.",
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
      key: "chicken_doneness",
      text: {
        ja: "鶏肉は中心まで火を通してください。切り口にピンク色が残っていれば、さらに加熱します。",
        en: "Cook chicken through. If any pink remains when you cut it, cook it longer.",
        es: "Cocina bien el pollo. Si queda algo rosado al cortarlo, cocínalo más tiempo.",
        fr: "Faites cuire le poulet à cœur. S'il reste du rose à la découpe, prolongez la cuisson.",
      },
    },
  ],
  substitutions: [],
};
