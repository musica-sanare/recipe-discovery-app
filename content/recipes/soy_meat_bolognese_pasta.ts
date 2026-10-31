import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "soy_meat_bolognese_pasta",
  texts: {
    name: { ja: "大豆ミートのボロネーゼ", en: "Soy mince bolognese", es: "Boloñesa de soja texturizada" },
    summary: {
      ja: "イタリアのボロネーゼをヒントに、ひき肉の代わりに大豆ミートを玉ねぎ、にんじん、トマトで煮込みます。スパゲッティにかけます。作り置きできます。",
      en: "Inspired by Italian bolognese: soy mince instead of minced meat, simmered with onion, carrot, and tomato, over spaghetti. The sauce keeps well.",
      es: "Inspirado en la boloñesa italiana: soja texturizada en lugar de carne picada, guisada con cebolla, zanahoria y tomate, sobre espaguetis. La salsa se puede preparar por adelantado.",
    },
  },
  cuisine: "western",
  goals: ["bulk"],
  mainProteinGroup: "soy",
  tags: ["batch"],
  minutes: 25,
  effort: 2,
  equipment: ["stove", "frying_pan", "pot"],
  servings: 1,
  ingredients: [
    {
      key: "soy_meat",
      food: "soy_meat",
      grams: 80,
      state: "raw",
      cooking: "simmer",
      role: "main_protein",
      adjust: { kind: "grams", min: 50, max: 100, step: 10 },
      note: {
        ja: "成分表に戻して加熱した大豆ミートの値がないため、乾燥品の値で計算しています。",
        en: "The tables have no value for rehydrated, cooked soy mince, so the value of the dry product is used.",
        es: "Las tablas no tienen un valor para la soja texturizada rehidratada y cocinada, así que se usa el valor del producto seco.",
      },
    },
    { key: "oil", food: "olive_oil", grams: 5, state: "as_is", measure: { unit: "tsp", quantity: 1.25 }, role: "fat", linkedTo: "soy_meat" },
    { key: "onion", food: "onion", grams: 60, state: "stir_fry", role: "vegetable" },
    { key: "oil_onion", food: "olive_oil", grams: 3, state: "as_is", measure: { unit: "tsp", quantity: 0.75 }, role: "fat", includedIn: "onion" },
    {
      key: "carrot",
      food: "carrot",
      grams: 40,
      state: "raw",
      cooking: "simmer",
      role: "vegetable",
      note: {
        ja: "成分表に煮込んだにんじんの値がないため、生の値で計算しています。",
        en: "The tables have no value for stewed carrot, so the raw value is used.",
        es: "Las tablas no tienen un valor para la zanahoria guisada, así que se usa el valor en crudo.",
      },
    },
    { key: "garlic", food: "garlic", grams: 5, state: "raw", measure: { unit: "clove", quantity: 1 }, role: "seasoning" },
    { key: "tomato", food: "tomato_canned", grams: 200, state: "as_is", measure: { unit: "can", quantity: 0.5 }, role: "vegetable" },
    { key: "soy_sauce", food: "soy_sauce", grams: 6, state: "as_is", measure: { unit: "tsp", quantity: 1 }, role: "seasoning", linkedTo: "soy_meat" },
    {
      key: "pasta",
      food: "pasta",
      grams: 140,
      state: "boil",
      role: "main_carb",
      adjust: { kind: "grams", min: 80, max: 160, step: 20 },
      note: {
        ja: "乾麺の重さです。成分表のゆでたパスタの値は、塩を加えた湯でゆでたものです。",
        en: "The weight is the dry weight. The table value for boiled pasta is for pasta cooked in salted water.",
        es: "El peso es en seco. El valor de la tabla para la pasta cocida es el de la pasta hervida en agua con sal.",
      },
    },
  ],
  sides: [],
  steps: [
    {
      key: "soak",
      text: {
        ja: "大豆ミートを熱湯に5分ほどつけて戻し、ざるにあけて水気をしっかり絞ります。",
        en: "Soak the soy mince in boiling water for about 5 minutes, drain it in a sieve, and squeeze out the water well.",
        es: "Remoja la soja texturizada en agua hirviendo unos 5 minutos, escúrrela en un colador y exprime bien el agua.",
      },
    },
    {
      key: "saute",
      text: {
        ja: "玉ねぎ、にんじん、にんにくをみじん切りにします。フライパンにオリーブ油を中火で熱し、野菜を5分ほど炒めます。",
        en: "Finely chop the onion, carrot, and garlic. Heat the olive oil in a frying pan over medium heat and sauté the vegetables for about 5 minutes.",
        es: "Pica fino la cebolla, la zanahoria y el ajo. Calienta el aceite de oliva en una sartén a fuego medio y sofríe las verduras unos 5 minutos.",
      },
    },
    {
      key: "simmer",
      text: {
        ja: "大豆ミートを加えて炒め、トマト缶をつぶしながら加えます。しょうゆを入れ、ときどき混ぜながら弱めの中火で10分ほど煮詰めます。",
        en: "Add the soy mince and stir, then add the canned tomatoes, crushing them. Add the soy sauce and simmer over medium-low heat for about 10 minutes, stirring now and then.",
        es: "Añade la soja texturizada y remueve; después añade el tomate de lata, aplastándolo. Agrega la salsa de soja y cuece a fuego medio-bajo unos 10 minutos, removiendo de vez en cuando.",
      },
    },
    {
      key: "pasta",
      text: {
        ja: "その間に、スパゲッティを塩を加えた湯で袋の表示時間どおりにゆで、湯を切ります。",
        en: "Meanwhile, boil the spaghetti in salted water for the time on the package and drain.",
        es: "Mientras tanto, cuece los espaguetis en agua con sal el tiempo que indique el paquete y escúrrelos.",
      },
    },
    {
      key: "serve",
      text: {
        ja: "スパゲッティを器に盛り、ソースをかけます。",
        en: "Plate the spaghetti and spoon the sauce over.",
        es: "Sirve los espaguetis y pon la salsa por encima.",
      },
    },
  ],
  safetyNotes: [
    {
      key: "hot_water",
      text: {
        ja: "熱湯を扱うときは、やけどに注意してください。",
        en: "Take care not to scald yourself with the boiling water.",
        es: "Ten cuidado de no quemarte con el agua hirviendo.",
      },
    },
    {
      key: "cooling",
      text: {
        ja: "作り置きする場合は、浅い容器に移して早めに冷まし、冷蔵庫で保存してください。食べるときは中心まで十分に温め直します。",
        en: "To keep leftovers, transfer them to a shallow container, cool them quickly, and refrigerate. Reheat until piping hot throughout before eating.",
        es: "Si guardas sobras, pásalas a un recipiente poco hondo, enfríalas rápido y guárdalas en el refrigerador. Antes de comer, recaliéntalas hasta que estén bien calientes por dentro.",
      },
    },
  ],
  substitutions: [],
};
