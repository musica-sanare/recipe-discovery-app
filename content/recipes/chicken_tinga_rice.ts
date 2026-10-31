import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "chicken_tinga_rice",
  texts: {
    name: { ja: "鶏むね肉のティンガ ご飯添え", en: "Chicken tinga with rice", es: "Tinga de pollo con arroz" },
    summary: {
      ja: "メキシコのティンガをヒントに、ゆでてほぐした鶏むね肉をトマト、玉ねぎ、チリパウダーで煮込みます。赤いんげん豆、ご飯、アボカドを添えます。作り置きできます。",
      en: "Inspired by Mexican tinga: poached, shredded chicken breast stewed with tomato, onion, and chili powder, with red kidney beans, rice, and avocado. It keeps well.",
      es: "Inspirado en la tinga mexicana: pechuga de pollo cocida y desmenuzada, guisada con tomate, cebolla y chile en polvo, con alubias rojas, arroz y aguacate. Se puede preparar por adelantado.",
    },
  },
  cuisine: "latin_american",
  goals: ["bulk"],
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
      grams: 180,
      state: "raw",
      cooking: "simmer",
      role: "main_protein",
      adjust: { kind: "grams", min: 140, max: 220, step: 20 },
      note: {
        ja: "成分表に煮た鶏むね肉の値がないため、生の値で計算しています。",
        en: "The tables have no value for stewed chicken breast, so the raw value is used.",
        es: "Las tablas no tienen un valor para la pechuga de pollo guisada, así que se usa el valor en crudo.",
      },
    },
    { key: "tomato", food: "tomato_canned", grams: 200, state: "as_is", measure: { unit: "can", quantity: 0.5 }, role: "vegetable" },
    { key: "onion", food: "onion", grams: 60, state: "stir_fry", role: "vegetable" },
    { key: "oil_onion", food: "vegetable_oil", grams: 4, state: "as_is", measure: { unit: "tsp", quantity: 1 }, role: "fat", includedIn: "onion" },
    { key: "garlic", food: "garlic", grams: 5, state: "raw", measure: { unit: "clove", quantity: 1 }, role: "seasoning" },
    { key: "chili", food: "chili_powder", grams: 3, state: "as_is", measure: { unit: "tsp", quantity: 1 }, role: "seasoning" },
    { key: "paprika", food: "paprika_powder", grams: 2, state: "as_is", measure: { unit: "tsp", quantity: 1 }, role: "seasoning" },
    { key: "salt", food: "salt", grams: 0.5, state: "as_is", measure: { unit: "pinch", quantity: 1 }, role: "seasoning" },
    { key: "beans", food: "kidney_beans", grams: 80, state: "as_is", role: "other" },
    { key: "avocado", food: "avocado", grams: 30, state: "raw", role: "vegetable" },
    { key: "coriander", food: "coriander", grams: 5, state: "raw", role: "vegetable" },
    { key: "lime", food: "lime_juice", grams: 5, state: "as_is", measure: { unit: "tsp", quantity: 1 }, role: "seasoning" },
    { key: "rice", food: "rice_cooked", grams: 250, state: "as_is", role: "main_carb", adjust: { kind: "grams", min: 200, max: 300, step: 50 } },
  ],
  sides: [],
  steps: [
    {
      key: "poach",
      text: {
        ja: "鍋に水400mLを沸かし、鶏むね肉を入れて弱火で12分ほど、中心まで火が通るまでゆでます。取り出してフォークでほぐします。ゆで汁は100mL取っておきます。",
        en: "Bring 400 mL of water to a boil in a pot, add the chicken breast, and simmer over low heat for about 12 minutes, until cooked through. Take it out and shred it with forks. Keep 100 mL of the cooking liquid.",
        es: "Lleva a ebullición 400 mL de agua en una olla, añade la pechuga y cuécela a fuego bajo unos 12 minutos, hasta que esté bien hecha. Sácala y desmenúzala con tenedores. Reserva 100 mL del caldo.",
      },
    },
    {
      key: "sauce",
      text: {
        ja: "鍋の湯を捨てて油を中火で熱し、薄切りの玉ねぎとにんにくを炒めます。チリパウダーとパプリカパウダーを加えて混ぜ、トマト缶、ゆで汁、塩を加えて5分煮ます。",
        en: "Pour out the water, heat the oil in the pot over medium heat, and sauté the sliced onion and garlic. Stir in the chili powder and paprika, add the canned tomatoes, the reserved liquid, and the salt, and simmer for 5 minutes.",
        es: "Tira el agua, calienta el aceite en la olla a fuego medio y sofríe la cebolla en láminas y el ajo. Añade el chile en polvo y el pimentón, después el tomate de lata, el caldo reservado y la sal, y cuece 5 minutos.",
      },
    },
    {
      key: "stew",
      text: {
        ja: "鶏肉を戻し、汁気が少なくなるまで弱めの中火で5分ほど煮込みます。",
        en: "Return the chicken and simmer over medium-low heat for about 5 minutes, until the sauce thickens.",
        es: "Devuelve el pollo y cuece a fuego medio-bajo unos 5 minutos, hasta que la salsa espese.",
      },
    },
    {
      key: "serve",
      text: {
        ja: "ご飯、汁を切った赤いんげん豆と一緒に盛り、薄切りのアボカドとパクチーをのせ、ライム果汁をかけます。",
        en: "Plate it with the rice and the drained kidney beans, top with sliced avocado and cilantro, and squeeze the lime juice over.",
        es: "Sírvelo con el arroz y las alubias rojas escurridas, pon encima el aguacate en láminas y el cilantro, y rocía con el zumo de lima.",
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
