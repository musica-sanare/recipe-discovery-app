import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "chicken_chickpea_lemon_stew",
  texts: {
    name: { ja: "鶏むね肉とひよこ豆のレモン煮", en: "Chicken and chickpea lemon stew", es: "Guiso de pollo y garbanzos al limón", fr: "Ragoût de poulet et de pois chiches au citron" },
    summary: {
      ja: "地中海の家庭料理をヒントに、鶏むね肉、ひよこ豆、ズッキーニをにんにくとレモンで煮ます。パンを添えます。",
      en: "Inspired by Mediterranean home cooking: chicken breast, chickpeas, and zucchini simmered with garlic and lemon, with bread.",
      es: "Inspirado en la cocina casera mediterránea: pechuga de pollo, garbanzos y calabacín guisados con ajo y limón, con pan.",
      fr: "Inspiré de la cuisine familiale méditerranéenne : blanc de poulet, pois chiches et courgette mijotés à l'ail et au citron, avec du pain.",
    },
  },
  cuisine: "mediterranean",
  goals: ["maintain"],
  mainProteinGroup: "chicken",
  tags: ["batch"],
  minutes: 30,
  effort: 2,
  equipment: ["stove", "pot"],
  servings: 1,
  ingredients: [
    {
      key: "chicken",
      food: "chicken_breast",
      grams: 160,
      state: "raw",
      cooking: "simmer",
      role: "main_protein",
      adjust: { kind: "grams", min: 120, max: 220, step: 20 },
      note: {
        ja: "成分表に煮込んだ鶏むね肉の値がないため、生の値で計算しています。",
        en: "The tables have no value for stewed chicken breast, so the raw value is used.",
        es: "Las tablas no tienen un valor para la pechuga de pollo guisada, así que se usa el valor en crudo.",
        fr: "Les tables n'ont pas de valeur pour le blanc de poulet mijoté ; la valeur à l'état cru est donc utilisée.",
      },
    },
    { key: "olive_oil", food: "olive_oil", grams: 5, state: "as_is", measure: { unit: "tsp", quantity: 1.25 }, role: "fat", linkedTo: "chicken" },
    { key: "salt", food: "salt", grams: 1.5, state: "as_is", measure: { unit: "pinch", quantity: 3 }, role: "seasoning", linkedTo: "chicken" },
    { key: "onion", food: "onion", grams: 60, state: "raw", cooking: "simmer", measure: { unit: "piece", quantity: 0.25 }, role: "vegetable" },
    { key: "zucchini", food: "zucchini", grams: 80, state: "raw", cooking: "simmer", role: "vegetable" },
    { key: "garlic", food: "garlic", grams: 5, state: "raw", measure: { unit: "clove", quantity: 1 }, role: "seasoning" },
    { key: "chickpeas", food: "chickpeas", grams: 100, state: "as_is", role: "other" },
    { key: "lemon", food: "lemon_juice", grams: 15, state: "as_is", measure: { unit: "tbsp", quantity: 1 }, role: "seasoning" },
    { key: "parsley", food: "parsley", grams: 2, state: "raw", role: "vegetable" },
    { key: "bread", food: "bread", grams: 60, state: "as_is", measure: { unit: "slice", quantity: 1 }, role: "main_carb", adjust: { kind: "count", unitGrams: 60, min: 1, max: 3 } },
  ],
  sides: [
    { key: "bread", label: { ja: "パン", en: "Bread", es: "Pan", fr: "Pain" }, ingredients: ["bread"], solverMayRemove: true },
  ],
  steps: [
    {
      key: "prep",
      text: {
        ja: "鶏むね肉をひと口大に切り、塩をまぶします。玉ねぎは薄切り、ズッキーニは1cm幅の半月切りにし、にんにくはつぶします。",
        en: "Cut the chicken breast into bite-size pieces and season with the salt. Thinly slice the onion, cut the zucchini into 1 cm half-moons, and crush the garlic.",
        es: "Corta la pechuga de pollo en trozos pequeños y sálalos. Corta la cebolla en láminas finas y el calabacín en medias lunas de 1 cm, y machaca el ajo.",
        fr: "Coupez le blanc de poulet en bouchées et salez-le. Émincez finement l'oignon, coupez la courgette en demi-rondelles de 1 cm et écrasez l'ail.",
      },
    },
    {
      key: "brown",
      text: {
        ja: "鍋にオリーブオイルとにんにくを入れて中火にかけ、鶏肉の表面を焼きます。玉ねぎを加えて2分炒めます。",
        en: "Put the olive oil and garlic in a pot over medium heat and brown the chicken. Add the onion and stir-fry for 2 minutes.",
        es: "Pon el aceite de oliva y el ajo en una olla a fuego medio y dora el pollo. Añade la cebolla y saltea 2 minutos.",
        fr: "Mettez l'huile d'olive et l'ail dans une casserole à feu moyen et faites dorer le poulet. Ajoutez l'oignon et faites sauter 2 minutes.",
      },
    },
    {
      key: "simmer",
      text: {
        ja: "ズッキーニ、汁を切ったひよこ豆、水150mlを加えて煮立て、ふたをして弱めの中火で12分煮ます。",
        en: "Add the zucchini, the drained chickpeas, and 150 ml of water, bring to a boil, cover, and simmer over medium-low heat for 12 minutes.",
        es: "Añade el calabacín, los garbanzos escurridos y 150 ml de agua, lleva a ebullición, tapa y cuece a fuego medio-bajo 12 minutos.",
        fr: "Ajoutez la courgette, les pois chiches égouttés et 150 ml d'eau, portez à ébullition, couvrez et laissez mijoter 12 minutes à feu moyen-doux.",
      },
    },
    {
      key: "finish",
      text: {
        ja: "火を止めてレモン果汁を加え、器に盛って刻んだパセリを散らします。",
        en: "Turn off the heat, stir in the lemon juice, and serve sprinkled with the chopped parsley.",
        es: "Apaga el fuego, añade el zumo de limón y sírvelo con el perejil picado por encima.",
        fr: "Éteignez le feu, incorporez le jus de citron et servez parsemé de persil haché.",
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
        ja: "鶏肉は中心まで火を通してください。切り口に赤みがなく、肉汁が透明になっていることを確認します。",
        en: "Cook chicken all the way through. Check that the center is no longer pink and the juices run clear.",
        es: "Cocina el pollo completamente. Comprueba que el centro ya no esté rosado y que los jugos salgan transparentes.",
        fr: "Faites cuire le poulet à cœur. Vérifiez que le centre n'est plus rosé et que le jus qui s'écoule est clair.",
      },
    },
    {
      key: "cooling",
      text: {
        ja: "作り置きする場合は、浅い容器に移して早めに冷まし、冷蔵庫で保存してください。食べるときは中心まで十分に温め直します。",
        en: "To keep leftovers, transfer them to a shallow container, cool them quickly, and refrigerate. Reheat until piping hot throughout before eating.",
        es: "Si guardas sobras, pásalas a un recipiente poco hondo, enfríalas rápido y guárdalas en el refrigerador. Antes de comer, recaliéntalas hasta que estén bien calientes por dentro.",
        fr: "Pour conserver les restes, mettez-les dans un récipient peu profond, faites-les refroidir rapidement et placez-les au réfrigérateur. Avant de les manger, réchauffez-les jusqu'à ce qu'ils soient bien chauds à cœur.",
      },
    },
  ],
  substitutions: [],
};
