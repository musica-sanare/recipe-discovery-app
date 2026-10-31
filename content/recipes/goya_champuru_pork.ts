import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "goya_champuru_pork",
  texts: {
    name: { ja: "豚ヒレ肉のゴーヤーチャンプルー", en: "Goya champuru with pork tenderloin", es: "Goya champuru con solomillo de cerdo" },
    summary: {
      ja: "沖縄のゴーヤーチャンプルーを、豚ヒレ肉、ゴーヤー、卵で作ります。ご飯を添えます。",
      en: "Okinawan goya champuru made with pork tenderloin, bitter melon, and egg, with rice.",
      es: "Goya champuru de Okinawa preparado con solomillo de cerdo, melón amargo y huevo, con arroz.",
    },
  },
  cuisine: "okinawan",
  goals: ["maintain"],
  mainProteinGroup: "pork",
  tags: [],
  minutes: 15,
  effort: 1,
  equipment: ["stove", "frying_pan"],
  servings: 1,
  ingredients: [
    {
      key: "pork",
      food: "pork_fillet",
      grams: 120,
      state: "raw",
      cooking: "stir_fry",
      role: "main_protein",
      adjust: { kind: "grams", min: 100, max: 160, step: 20 },
      note: {
        ja: "成分表に炒めた豚ヒレ肉の値がないため、生の値で計算しています。",
        en: "The tables have no value for stir-fried pork tenderloin, so the raw value is used.",
        es: "Las tablas no tienen un valor para el solomillo de cerdo salteado, así que se usa el valor en crudo.",
      },
    },
    { key: "oil", food: "vegetable_oil", grams: 3, state: "as_is", measure: { unit: "tsp", quantity: 0.75 }, role: "fat", linkedTo: "pork" },
    { key: "goya", food: "bitter_melon", grams: 150, state: "stir_fry", measure: { unit: "piece", quantity: 0.5 }, role: "vegetable" },
    { key: "oil_goya", food: "vegetable_oil", grams: 7, state: "as_is", measure: { unit: "tsp", quantity: 1.75 }, role: "fat", includedIn: "goya" },
    { key: "egg", food: "egg", grams: 50, state: "scramble", measure: { unit: "piece", quantity: 1 }, role: "other" },
    { key: "oil_egg", food: "vegetable_oil", grams: 2, state: "as_is", measure: { unit: "tsp", quantity: 0.5 }, role: "fat", includedIn: "egg" },
    { key: "soy_sauce", food: "soy_sauce", grams: 6, state: "as_is", measure: { unit: "tsp", quantity: 1 }, role: "seasoning" },
    { key: "salt", food: "salt", grams: 0.5, state: "as_is", measure: { unit: "pinch", quantity: 1 }, role: "seasoning" },
    { key: "rice", food: "rice_cooked", grams: 200, state: "as_is", role: "main_carb", adjust: { kind: "grams", min: 150, max: 250, step: 50 } },
  ],
  sides: [
    { key: "rice", label: { ja: "ご飯", en: "Rice", es: "Arroz" }, ingredients: ["rice"], solverMayRemove: true },
  ],
  steps: [
    {
      key: "prep",
      text: {
        ja: "ゴーヤーを縦半分に切ってわたと種をスプーンで取り、5mm厚さに切ります。豚ヒレ肉は5mm厚さに切ります。卵は溶きほぐします。",
        en: "Halve the bitter melon lengthwise, scoop out the pith and seeds with a spoon, and slice it 5 mm thick. Slice the pork tenderloin 5 mm thick. Beat the egg.",
        es: "Corta el melón amargo por la mitad a lo largo, quita la pulpa blanca y las semillas con una cuchara y córtalo en rodajas de 5 mm. Corta el solomillo de cerdo en rodajas de 5 mm. Bate el huevo.",
      },
    },
    {
      key: "egg",
      text: {
        ja: "フライパンに卵用の油を中火で熱し、卵を入れて大きく混ぜ、固まったら取り出します。",
        en: "Heat the oil for the egg in a frying pan over medium heat, add the egg, stir in large strokes, and take it out once set.",
        es: "Calienta en una sartén a fuego medio el aceite del huevo, añade el huevo, remueve con movimientos amplios y sácalo cuando cuaje.",
      },
    },
    {
      key: "stir_fry",
      text: {
        ja: "同じフライパンに油を熱して豚肉を炒め、色が変わったらゴーヤー用の油とゴーヤーを加えて3〜4分炒めます。しょうゆと塩で調味し、卵を戻して混ぜます。",
        en: "Heat the oil in the same pan and stir-fry the pork. When it changes color, add the oil for the bitter melon and the bitter melon, and stir-fry for 3–4 minutes. Season with the soy sauce and salt, return the egg, and toss.",
        es: "Calienta el aceite en la misma sartén y saltea el cerdo. Cuando cambie de color, añade el aceite del melón amargo y el melón amargo, y saltea 3-4 minutos. Sazona con la salsa de soja y la sal, devuelve el huevo y mezcla.",
      },
    },
    {
      key: "serve",
      text: { ja: "器に盛ります。", en: "Plate it.", es: "Sírvelo en un plato." },
    },
    {
      key: "rice",
      side: "rice",
      text: { ja: "ご飯を添えます。", en: "Serve with the rice.", es: "Acompáñalo con el arroz." },
    },
  ],
  safetyNotes: [
    {
      key: "pork_doneness",
      text: {
        ja: "豚肉は中心まで火を通してください。切り口に赤みがないことを確認します。",
        en: "Cook the pork through. Check that no pink remains when you cut it.",
        es: "Cocina bien el cerdo. Comprueba que no quede nada rosado al cortarlo.",
      },
    },
    {
      key: "egg_set",
      text: {
        ja: "卵は固まるまで加熱してください。",
        en: "Cook the eggs until set.",
        es: "Cocina los huevos hasta que cuajen.",
      },
    },
  ],
  substitutions: [],
};
