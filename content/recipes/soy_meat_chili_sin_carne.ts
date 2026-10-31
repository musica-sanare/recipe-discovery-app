import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "soy_meat_chili_sin_carne",
  texts: {
    name: { ja: "大豆ミートのチリ・シン・カルネ", en: "Chili sin carne with soy mince", es: "Chili sin carne con soja texturizada", fr: "Chili sin carne au haché de soja" },
    summary: {
      ja: "チリ・コン・カルネのひき肉を大豆ミートに置き換え、赤いんげん豆とトマトでチリパウダーをきかせて煮込みます。ご飯にかけます。作り置きできます。",
      en: "Chili con carne with soy mince in place of minced meat, simmered with red kidney beans, tomato, and chili powder, over rice. It keeps well.",
      es: "Chili con carne con soja texturizada en lugar de carne picada, guisado con alubias rojas, tomate y chile en polvo, sobre arroz. Se puede preparar por adelantado.",
      fr: "Un chili con carne avec du haché de soja à la place de la viande hachée, mijoté avec des haricots rouges, de la tomate et du chili en poudre, sur du riz. Il se conserve bien.",
    },
  },
  cuisine: "latin_american",
  goals: ["bulk"],
  mainProteinGroup: "soy",
  tags: ["batch"],
  minutes: 30,
  effort: 2,
  equipment: ["stove", "pot"],
  servings: 1,
  ingredients: [
    {
      key: "soy_meat",
      food: "soy_meat",
      grams: 70,
      state: "raw",
      cooking: "simmer",
      role: "main_protein",
      adjust: { kind: "grams", min: 50, max: 90, step: 10 },
      note: {
        ja: "成分表に戻して加熱した大豆ミートの値がないため、乾燥品の値で計算しています。",
        en: "The tables have no value for rehydrated, cooked soy mince, so the value of the dry product is used.",
        es: "Las tablas no tienen un valor para la soja texturizada rehidratada y cocinada, así que se usa el valor del producto seco.",
        fr: "Les tables n'ont pas de valeur pour le haché de soja réhydraté et cuit ; la valeur du produit sec est donc utilisée.",
      },
    },
    { key: "beans", food: "kidney_beans", grams: 120, state: "as_is", role: "other" },
    { key: "tomato", food: "tomato_canned", grams: 200, state: "as_is", measure: { unit: "can", quantity: 0.5 }, role: "vegetable" },
    { key: "onion", food: "onion", grams: 60, state: "stir_fry", role: "vegetable" },
    { key: "oil_onion", food: "vegetable_oil", grams: 4, state: "as_is", measure: { unit: "tsp", quantity: 1 }, role: "fat", includedIn: "onion" },
    { key: "garlic", food: "garlic", grams: 5, state: "raw", measure: { unit: "clove", quantity: 1 }, role: "seasoning" },
    { key: "chili", food: "chili_powder", grams: 4, state: "as_is", role: "seasoning" },
    { key: "paprika", food: "paprika_powder", grams: 2, state: "as_is", measure: { unit: "tsp", quantity: 1 }, role: "seasoning" },
    { key: "salt", food: "salt", grams: 0.5, state: "as_is", measure: { unit: "pinch", quantity: 1 }, role: "seasoning" },
    { key: "rice", food: "rice_cooked", grams: 250, state: "as_is", role: "main_carb", adjust: { kind: "grams", min: 200, max: 300, step: 50 } },
  ],
  sides: [],
  steps: [
    {
      key: "soak",
      text: {
        ja: "大豆ミートを熱湯に5分ほどつけて戻し、ざるにあけて水気をしっかり絞ります。",
        en: "Soak the soy mince in boiling water for about 5 minutes, drain it in a sieve, and squeeze out the water well.",
        es: "Remoja la soja texturizada en agua hirviendo unos 5 minutos, escúrrela en un colador y exprime bien el agua.",
        fr: "Faites tremper le haché de soja environ 5 minutes dans de l'eau bouillante, égouttez-le dans une passoire et pressez-le bien.",
      },
    },
    {
      key: "saute",
      text: {
        ja: "鍋に油を中火で熱し、みじん切りの玉ねぎとにんにくを5分ほど炒めます。大豆ミート、チリパウダー、パプリカパウダーを加えて炒め合わせます。",
        en: "Heat the oil in a pot over medium heat and sauté the chopped onion and garlic for about 5 minutes. Add the soy mince, chili powder, and paprika and stir.",
        es: "Calienta el aceite en una olla a fuego medio y sofríe la cebolla y el ajo picados unos 5 minutos. Añade la soja texturizada, el chile en polvo y el pimentón y remueve.",
        fr: "Faites chauffer l'huile dans une cocotte à feu moyen et faites revenir l'oignon et l'ail hachés environ 5 minutes. Ajoutez le haché de soja, le chili en poudre et le paprika, et mélangez.",
      },
    },
    {
      key: "simmer",
      text: {
        ja: "トマト缶、汁を切った赤いんげん豆、水100mL、塩を加え、ときどき混ぜながら弱めの中火で10分ほど煮込みます。",
        en: "Add the canned tomatoes, the drained kidney beans, 100 mL of water, and the salt and simmer over medium-low heat for about 10 minutes, stirring now and then.",
        es: "Añade el tomate de lata, las alubias rojas escurridas, 100 mL de agua y la sal y cuece a fuego medio-bajo unos 10 minutos, removiendo de vez en cuando.",
        fr: "Ajoutez les tomates en conserve, les haricots rouges égouttés, 100 mL d'eau et le sel, et laissez mijoter environ 10 minutes à feu moyen-doux, en remuant de temps en temps.",
      },
    },
    {
      key: "serve",
      text: { ja: "ご飯を器に盛り、チリをかけます。", en: "Put the rice on a plate and spoon the chili over.", es: "Pon el arroz en un plato y sirve el chili por encima.", fr: "Mettez le riz sur une assiette et nappez-le de chili." },
    },
  ],
  safetyNotes: [
    {
      key: "hot_water",
      text: {
        ja: "熱湯を扱うときは、やけどに注意してください。",
        en: "Take care not to scald yourself with the boiling water.",
        es: "Ten cuidado de no quemarte con el agua hirviendo.",
        fr: "Attention à ne pas vous ébouillanter avec l'eau bouillante.",
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
