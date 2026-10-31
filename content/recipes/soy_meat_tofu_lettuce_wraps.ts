import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "soy_meat_tofu_lettuce_wraps",
  texts: {
    name: { ja: "大豆ミートと豆腐のレタス包み", en: "Soy mince and tofu lettuce wraps", es: "Soja texturizada y tofu en hojas de lechuga" },
    summary: {
      ja: "中華のひき肉のレタス包みをヒントに、大豆ミートと木綿豆腐をしいたけ、オイスターソースで炒めます。レタスで包んで食べます。ご飯を添えます。",
      en: "Inspired by Chinese minced-meat lettuce cups: soy mince and firm tofu stir-fried with shiitake and oyster sauce, eaten wrapped in lettuce, with rice.",
      es: "Inspirado en los rollitos chinos de lechuga con carne picada: soja texturizada y tofu firme salteados con shiitake y salsa de ostras, para comer envueltos en lechuga, con arroz.",
    },
  },
  cuisine: "chinese",
  goals: ["cut"],
  mainProteinGroup: "soy",
  tags: [],
  minutes: 15,
  effort: 1,
  equipment: ["stove", "frying_pan"],
  servings: 1,
  ingredients: [
    {
      key: "soy_meat",
      food: "soy_meat",
      grams: 50,
      state: "raw",
      cooking: "stir_fry",
      role: "main_protein",
      adjust: { kind: "grams", min: 30, max: 70, step: 10 },
      note: {
        ja: "成分表に戻して加熱した大豆ミートの値がないため、乾燥品の値で計算しています。",
        en: "The tables have no value for rehydrated, cooked soy mince, so the value of the dry product is used.",
        es: "Las tablas no tienen un valor para la soja texturizada rehidratada y cocinada, así que se usa el valor del producto seco.",
      },
    },
    {
      key: "tofu",
      food: "tofu_firm",
      grams: 150,
      state: "raw",
      cooking: "stir_fry",
      measure: { unit: "block", quantity: 0.5 },
      role: "other",
      note: {
        ja: "成分表に炒めた豆腐の値がないため、生の値で計算しています。",
        en: "The tables have no value for stir-fried tofu, so the raw value is used.",
        es: "Las tablas no tienen un valor para el tofu salteado, así que se usa el valor en crudo.",
      },
    },
    { key: "oil", food: "vegetable_oil", grams: 3, state: "as_is", measure: { unit: "tsp", quantity: 0.75 }, role: "fat", linkedTo: "soy_meat" },
    { key: "oyster", food: "oyster_sauce", grams: 9, state: "as_is", measure: { unit: "tsp", quantity: 1.5 }, role: "seasoning", linkedTo: "soy_meat" },
    { key: "soy_sauce", food: "soy_sauce", grams: 6, state: "as_is", measure: { unit: "tsp", quantity: 1 }, role: "seasoning", linkedTo: "soy_meat" },
    { key: "garlic", food: "garlic", grams: 3, state: "raw", measure: { unit: "clove", quantity: 0.5 }, role: "seasoning" },
    { key: "ginger", food: "ginger", grams: 3, state: "raw", role: "seasoning" },
    { key: "long_onion", food: "long_onion", grams: 20, state: "raw", cooking: "stir_fry", role: "vegetable" },
    { key: "shiitake", food: "shiitake", grams: 30, state: "stir_fry", measure: { unit: "piece", quantity: 2 }, role: "vegetable" },
    { key: "lettuce", food: "lettuce", grams: 80, state: "raw", role: "vegetable" },
    { key: "rice", food: "rice_cooked", grams: 150, state: "as_is", role: "main_carb", adjust: { kind: "grams", min: 100, max: 200, step: 50 } },
  ],
  sides: [
    { key: "rice", label: { ja: "ご飯", en: "Rice", es: "Arroz" }, ingredients: ["rice"], solverMayRemove: true },
  ],
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
      key: "prep",
      text: {
        ja: "豆腐はキッチンペーパーで包んで水気を切ります。ねぎ、しいたけ、にんにく、しょうがはみじん切りにします。レタスは1枚ずつはがして洗い、水気を切ります。",
        en: "Wrap the tofu in paper towels to drain it. Finely chop the leek, shiitake, garlic, and ginger. Separate the lettuce leaves, wash them, and drain.",
        es: "Envuelve el tofu en papel de cocina para escurrirlo. Pica fino el puerro, las setas shiitake, el ajo y el jengibre. Separa las hojas de lechuga, lávalas y escúrrelas.",
      },
    },
    {
      key: "stir_fry",
      text: {
        ja: "フライパンに油を中火で熱し、にんにく、しょうが、ねぎ、しいたけを炒めます。豆腐を手でくずし入れ、大豆ミートを加えて3〜4分炒め、オイスターソースとしょうゆで調味します。",
        en: "Heat the oil in a frying pan over medium heat and stir-fry the garlic, ginger, leek, and shiitake. Crumble in the tofu by hand, add the soy mince, stir-fry for 3–4 minutes, and season with the oyster sauce and soy sauce.",
        es: "Calienta el aceite en una sartén a fuego medio y saltea el ajo, el jengibre, el puerro y las setas. Desmenuza el tofu con las manos, añade la soja texturizada, saltea 3-4 minutos y sazona con la salsa de ostras y la salsa de soja.",
      },
    },
    {
      key: "serve",
      text: {
        ja: "器に盛り、レタスで包んで食べます。",
        en: "Plate it and eat it wrapped in the lettuce leaves.",
        es: "Sírvelo y cómelo envuelto en las hojas de lechuga.",
      },
    },
    {
      key: "rice",
      side: "rice",
      text: { ja: "ご飯を添えます。", en: "Serve with the rice.", es: "Acompáñalo con el arroz." },
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
      key: "wash_raw",
      text: {
        ja: "生で食べる野菜とハーブは、流水でよく洗ってください。",
        en: "Wash raw vegetables and herbs well under running water.",
        es: "Lava bien con agua corriente las verduras y hierbas que se comen crudas.",
      },
    },
  ],
  substitutions: [],
};
