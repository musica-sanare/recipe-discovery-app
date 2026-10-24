import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "pork_fillet_mustard_saute",
  texts: {
    name: { ja: "豚ヒレ肉のソテー 粒マスタードソース", en: "Pork tenderloin with wholegrain mustard sauce", es: "Solomillo de cerdo con salsa de mostaza en grano" },
    summary: {
      ja: "脂の少ない豚ヒレ肉を焼き、粒マスタードとレモンのソースで仕上げます。",
      en: "Lean pork tenderloin, pan-seared and finished with a wholegrain mustard and lemon sauce.",
      es: "Solomillo de cerdo magro a la sartén con una salsa de mostaza en grano y limón.",
    },
  },
  cuisine: "western",
  goals: ["cut"],
  mainProteinGroup: "pork",
  tags: [],
  minutes: 20,
  effort: 2,
  equipment: ["stove", "frying_pan", "pot"],
  servings: 1,
  ingredients: [
    { key: "pork", food: "pork_fillet", grams: 160, state: "grill", cooking: "saute", role: "main_protein", adjust: { kind: "grams", min: 120, max: 220, step: 10 } },
    { key: "oil", food: "olive_oil", grams: 4, state: "as_is", measure: { unit: "tsp", quantity: 1 }, role: "fat", linkedTo: "pork" },
    { key: "salt", food: "salt", grams: 1, state: "as_is", role: "seasoning", linkedTo: "pork" },
    { key: "pepper", food: "black_pepper", grams: 0.2, state: "as_is", measure: { unit: "pinch", quantity: 1 }, role: "seasoning", linkedTo: "pork" },
    { key: "mustard", food: "grain_mustard", grams: 10, state: "as_is", measure: { unit: "tsp", quantity: 2 }, role: "seasoning", linkedTo: "pork" },
    { key: "soy_sauce", food: "soy_sauce", grams: 3, state: "as_is", measure: { unit: "tsp", quantity: 0.5 }, role: "seasoning", linkedTo: "pork" },
    { key: "lemon", food: "lemon_juice", grams: 5, state: "as_is", measure: { unit: "tsp", quantity: 1 }, role: "seasoning", linkedTo: "pork" },
    { key: "spinach", food: "spinach", grams: 80, state: "boil", role: "vegetable" },
    { key: "rice", food: "rice_cooked", grams: 150, state: "as_is", role: "main_carb", adjust: { kind: "grams", min: 100, max: 250, step: 10 } },
  ],
  sides: [
    { key: "rice", label: { ja: "ご飯", en: "Rice", es: "Arroz" }, ingredients: ["rice"], solverMayRemove: true },
    { key: "spinach", label: { ja: "ゆでほうれん草", en: "Boiled spinach", es: "Espinacas hervidas" }, ingredients: ["spinach"], solverMayRemove: false },
  ],
  steps: [
    {
      key: "prep",
      text: {
        ja: "豚ヒレ肉を2cm厚さに切り、塩とこしょうをふります。",
        en: "Cut the pork tenderloin into 2 cm medallions and season with salt and pepper.",
        es: "Corta el solomillo en medallones de 2 cm y salpimiéntalos.",
      },
    },
    {
      key: "spinach",
      side: "spinach",
      text: {
        ja: "ほうれん草をゆでて水にとり、水気を絞って食べやすく切ります。",
        en: "Boil the spinach, cool it in water, squeeze out the water, and cut it into short lengths.",
        es: "Hierve las espinacas, enfríalas en agua, exprímelas bien y córtalas en trozos.",
      },
    },
    {
      key: "cook",
      text: {
        ja: "フライパンにオリーブ油を中火で熱し、豚肉を片面3〜4分ずつ焼きます。",
        en: "Heat the olive oil in a frying pan over medium heat and cook the pork for 3 to 4 minutes on each side.",
        es: "Calienta el aceite de oliva en una sartén a fuego medio y cocina el cerdo de 3 a 4 minutos por cada lado.",
      },
    },
    {
      key: "sauce",
      text: {
        ja: "火を止めて粒マスタード、しょうゆ、レモン果汁を加えてからめます。",
        en: "Turn off the heat, add the mustard, soy sauce, and lemon juice, and coat the pork.",
        es: "Apaga el fuego, añade la mostaza, la salsa de soja y el zumo de limón, y baña el cerdo.",
      },
    },
  ],
  safetyNotes: [
    {
      key: "pork_doneness",
      text: {
        ja: "豚肉は中心まで火を通してください。切り口に赤みがなく、肉汁が透明になっていることを確認します。",
        en: "Cook pork all the way through. Check that the center is no longer pink and the juices run clear.",
        es: "Cocina el cerdo completamente. Comprueba que el centro ya no esté rosado y que los jugos salgan transparentes.",
      },
    },
  ],
  substitutions: [],
};
