import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "beef_sukiyaki_grilled_tofu",
  texts: {
    name: { ja: "牛もも肉と焼き豆腐のすき焼き", en: "Sukiyaki with lean beef and grilled tofu", es: "Sukiyaki de ternera magra y tofu asado", fr: "Sukiyaki au bœuf maigre et au tofu grillé" },
    summary: {
      ja: "牛もも肉、焼き豆腐、しらたき、白菜、ねぎ、しいたけを、しょうゆとみりんの割り下で煮ます。生卵は使いません。ご飯を添えます。",
      en: "Lean beef, grilled tofu, shirataki, napa cabbage, leek, and shiitake simmered in a soy sauce and mirin broth. No raw egg is used. With rice.",
      es: "Ternera magra, tofu asado, shirataki, col china, puerro y shiitake cocidos en un caldo de salsa de soja y mirin. No se usa huevo crudo. Con arroz.",
      fr: "Bœuf maigre, tofu grillé, shirataki, chou chinois, poireau et shiitake mijotés dans un bouillon à la sauce soja et au mirin. Sans œuf cru. Avec du riz.",
    },
  },
  cuisine: "japanese",
  goals: ["bulk"],
  mainProteinGroup: "beef",
  tags: [],
  minutes: 20,
  effort: 2,
  equipment: ["stove", "frying_pan"],
  servings: 1,
  ingredients: [
    { key: "beef", food: "beef_round", grams: 160, state: "boil", role: "main_protein", adjust: { kind: "grams", min: 120, max: 200, step: 20 } },
    {
      key: "tofu",
      food: "grilled_tofu",
      grams: 100,
      state: "raw",
      cooking: "simmer",
      measure: { unit: "block", quantity: 1 / 3 },
      role: "other",
      note: {
        ja: "成分表に煮た焼き豆腐の値がないため、生の値で計算しています。",
        en: "The tables have no value for simmered grilled tofu, so the raw value is used.",
        es: "Las tablas no tienen un valor para el tofu asado cocido, así que se usa el valor en crudo.",
        fr: "Les tables n'ont pas de valeur pour le tofu grillé mijoté ; la valeur à l'état cru est donc utilisée.",
      },
    },
    { key: "shirataki", food: "shirataki", grams: 80, state: "as_is", role: "other" },
    { key: "napa", food: "napa_cabbage", grams: 100, state: "boil", role: "vegetable" },
    { key: "long_onion", food: "long_onion", grams: 40, state: "raw", cooking: "simmer", role: "vegetable" },
    { key: "shiitake", food: "shiitake", grams: 30, state: "boil", measure: { unit: "piece", quantity: 2 }, role: "vegetable" },
    { key: "soy_sauce", food: "soy_sauce", grams: 24, state: "as_is", measure: { unit: "tsp", quantity: 4 }, role: "seasoning" },
    { key: "mirin", food: "mirin", grams: 24, state: "as_is", measure: { unit: "tsp", quantity: 4 }, role: "seasoning" },
    { key: "sugar", food: "sugar", grams: 8, state: "as_is", measure: { unit: "tsp", quantity: 2.5 }, role: "seasoning" },
    { key: "sake", food: "cooking_sake", grams: 15, state: "as_is", measure: { unit: "tbsp", quantity: 1 }, role: "seasoning" },
    { key: "rice", food: "rice_cooked", grams: 250, state: "as_is", role: "main_carb", adjust: { kind: "grams", min: 200, max: 300, step: 50 } },
  ],
  sides: [],
  steps: [
    {
      key: "prep",
      text: {
        ja: "焼き豆腐は4等分、白菜はざく切り、ねぎは斜め切りにし、しいたけは軸を取ります。しらたきは食べやすく切り、熱湯で2分ゆでて水気を切ります。",
        en: "Cut the grilled tofu into 4 pieces, roughly chop the napa cabbage, slice the leek on the diagonal, and remove the shiitake stems. Cut the shirataki into manageable lengths, boil for 2 minutes, and drain.",
        es: "Corta el tofu asado en 4 trozos, trocea la col china, corta el puerro al bies y quita el pie a las setas shiitake. Corta los shirataki en trozos manejables, hiérvelos 2 minutos y escúrrelos.",
        fr: "Coupez le tofu grillé en 4 morceaux, coupez grossièrement le chou chinois, émincez le poireau en biais et retirez le pied des shiitake. Coupez les shirataki en longueurs faciles à manger, faites-les bouillir 2 minutes et égouttez-les.",
      },
    },
    {
      key: "broth",
      text: {
        ja: "フライパンにしょうゆ、みりん、砂糖、料理酒、水100mLを入れて煮立てます。",
        en: "Bring the soy sauce, mirin, sugar, cooking sake, and 100 mL of water to a boil in a frying pan.",
        es: "Lleva a ebullición en una sartén la salsa de soja, el mirin, el azúcar, el sake de cocina y 100 mL de agua.",
        fr: "Portez à ébullition dans une poêle la sauce soja, le mirin, le sucre, le saké de cuisine et 100 mL d'eau.",
      },
    },
    {
      key: "simmer",
      text: {
        ja: "白菜、ねぎ、しいたけ、焼き豆腐、しらたきを並べて中火で5分煮ます。牛肉を広げて入れ、赤い部分がなくなるまで2〜3分煮ます。",
        en: "Arrange the napa cabbage, leek, shiitake, grilled tofu, and shirataki in the pan and simmer over medium heat for 5 minutes. Spread the beef in the pan and simmer for 2–3 minutes, until no red remains.",
        es: "Coloca la col china, el puerro, las setas, el tofu asado y los shirataki en la sartén y cuece a fuego medio 5 minutos. Extiende la ternera y cuécela 2-3 minutos, hasta que no quede nada rojo.",
        fr: "Disposez le chou chinois, le poireau, les shiitake, le tofu grillé et les shirataki dans la poêle et laissez mijoter 5 minutes à feu moyen. Étalez le bœuf dans la poêle et laissez mijoter 2 à 3 minutes, jusqu'à ce qu'il ne reste plus de rouge.",
      },
    },
    {
      key: "serve",
      text: {
        ja: "ご飯と一緒に、取り分けて食べます。",
        en: "Serve from the pan with the rice.",
        es: "Sírvelo de la sartén con el arroz.",
        fr: "Servez directement depuis la poêle, avec le riz.",
      },
    },
  ],
  safetyNotes: [
    {
      key: "beef_doneness",
      text: {
        ja: "薄切りの牛肉は、赤い部分がなくなるまで煮てください。",
        en: "Simmer the beef slices until no red remains.",
        es: "Cuece las lonchas de ternera hasta que no quede nada rojo.",
        fr: "Faites mijoter les tranches de bœuf jusqu'à ce qu'il ne reste plus de rouge.",
      },
    },
    {
      key: "no_raw_egg",
      text: {
        ja: "すき焼きは生卵につけて食べることがありますが、このレシピでは生卵を使いません。",
        en: "Sukiyaki is sometimes eaten dipped in raw egg; this recipe does not use raw egg.",
        es: "El sukiyaki a veces se come mojado en huevo crudo; esta receta no usa huevo crudo.",
        fr: "Le sukiyaki se mange parfois trempé dans un œuf cru ; cette recette n'utilise pas d'œuf cru.",
      },
    },
    {
      key: "hot_water",
      text: {
        ja: "熱湯を扱うときは、やけどに注意してください。",
        en: "Take care not to scald yourself with the boiling water.",
        es: "Ten cuidado de no quemarte con el agua hirviendo.",
        fr: "Attention à ne pas vous ébouillanter avec l'eau bouillante.",
      },
    },
  ],
  substitutions: [],
};
