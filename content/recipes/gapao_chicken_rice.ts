import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "gapao_chicken_rice",
  texts: {
    name: { ja: "鶏むね肉のガパオライス", en: "Chicken breast gapao rice", es: "Arroz gapao con pechuga de pollo" },
    summary: {
      ja: "タイのガパオをヒントに、細かく刻んだ鶏むね肉と野菜をナンプラーとオイスターソースで炒め、バジルを加えます。目玉焼きと一緒にご飯にのせます。",
      en: "Inspired by Thai gapao: finely chopped chicken breast and vegetables stir-fried with fish sauce and oyster sauce, finished with basil, served over rice with a fried egg.",
      es: "Inspirado en el gapao tailandés: pechuga de pollo picada y verduras salteadas con salsa de pescado y salsa de ostras, terminadas con albahaca, sobre arroz con un huevo frito.",
    },
  },
  cuisine: "southeast_asian",
  goals: ["bulk"],
  mainProteinGroup: "chicken",
  tags: [],
  minutes: 15,
  effort: 1,
  equipment: ["stove", "frying_pan"],
  servings: 1,
  ingredients: [
    {
      key: "chicken",
      food: "chicken_breast",
      grams: 180,
      state: "raw",
      cooking: "stir_fry",
      role: "main_protein",
      adjust: { kind: "grams", min: 140, max: 220, step: 20 },
      note: {
        ja: "成分表に炒めた鶏むね肉の値がないため、生の値で計算しています。",
        en: "The tables have no value for stir-fried chicken breast, so the raw value is used.",
        es: "Las tablas no tienen un valor para la pechuga de pollo salteada, así que se usa el valor en crudo.",
      },
    },
    { key: "oil", food: "vegetable_oil", grams: 4, state: "as_is", measure: { unit: "tsp", quantity: 1 }, role: "fat", linkedTo: "chicken" },
    { key: "garlic", food: "garlic", grams: 5, state: "raw", measure: { unit: "clove", quantity: 1 }, role: "seasoning", linkedTo: "chicken" },
    { key: "chili", food: "chili_pepper_powder", grams: 1, state: "as_is", role: "seasoning" },
    { key: "fish_sauce", food: "fish_sauce", grams: 8, state: "as_is", measure: { unit: "tsp", quantity: 1.5 }, role: "seasoning", linkedTo: "chicken" },
    { key: "oyster", food: "oyster_sauce", grams: 9, state: "as_is", measure: { unit: "tsp", quantity: 1.5 }, role: "seasoning", linkedTo: "chicken" },
    { key: "sugar", food: "sugar", grams: 3, state: "as_is", measure: { unit: "tsp", quantity: 1 }, role: "seasoning", linkedTo: "chicken" },
    { key: "onion", food: "onion", grams: 40, state: "stir_fry", role: "vegetable" },
    { key: "red_pepper", food: "red_pepper", grams: 40, state: "stir_fry", role: "vegetable" },
    { key: "basil", food: "basil", grams: 5, state: "raw", role: "vegetable" },
    { key: "egg", food: "egg", grams: 50, state: "fry_egg", measure: { unit: "piece", quantity: 1 }, role: "other" },
    { key: "oil_egg", food: "vegetable_oil", grams: 3, state: "as_is", measure: { unit: "tsp", quantity: 0.75 }, role: "fat", includedIn: "egg" },
    { key: "rice", food: "rice_cooked", grams: 280, state: "as_is", role: "main_carb", adjust: { kind: "grams", min: 200, max: 320, step: 40 } },
  ],
  sides: [],
  steps: [
    {
      key: "prep",
      text: {
        ja: "鶏むね肉を包丁で5mm角程度に細かく刻みます。にんにくはみじん切り、玉ねぎと赤ピーマンは1cm角に切ります。",
        en: "Chop the chicken breast finely with a knife, into pieces of about 5 mm. Finely chop the garlic and dice the onion and red pepper into 1 cm pieces.",
        es: "Pica la pechuga a cuchillo en trozos de unos 5 mm. Pica fino el ajo y corta la cebolla y el pimiento rojo en dados de 1 cm.",
      },
    },
    {
      key: "egg",
      text: {
        ja: "フライパンに卵用の油を中火で熱し、目玉焼きを作って取り出します。",
        en: "Heat the oil for the egg in a frying pan over medium heat, fry the egg, and set it aside.",
        es: "Calienta en una sartén a fuego medio el aceite del huevo, fríe el huevo y resérvalo.",
      },
    },
    {
      key: "stir_fry",
      text: {
        ja: "同じフライパンに油とにんにく、一味唐辛子を入れて中火にかけ、香りが出たら鶏肉を加え、ほぐしながら4〜5分、色が完全に変わるまで炒めます。玉ねぎと赤ピーマンを加えて2分炒め、ナンプラー、オイスターソース、砂糖で調味し、火を止めてバジルを混ぜます。",
        en: "Put the oil, garlic, and ground chili in the same pan over medium heat. When fragrant, add the chicken and stir-fry for 4–5 minutes, breaking it up, until it has completely changed color. Add the onion and red pepper, stir-fry for 2 minutes, season with the fish sauce, oyster sauce, and sugar, turn off the heat, and stir in the basil.",
        es: "Pon en la misma sartén el aceite, el ajo y la guindilla molida a fuego medio. Cuando huela, añade el pollo y saltéalo 4-5 minutos, deshaciéndolo, hasta que cambie de color por completo. Añade la cebolla y el pimiento rojo, saltea 2 minutos, sazona con la salsa de pescado, la salsa de ostras y el azúcar, apaga el fuego y mezcla la albahaca.",
      },
    },
    {
      key: "serve",
      text: {
        ja: "ご飯を器に盛り、炒めたものと目玉焼きをのせます。",
        en: "Put the rice in a bowl and top with the stir-fry and the fried egg.",
        es: "Pon el arroz en un plato y coloca encima el salteado y el huevo frito.",
      },
    },
  ],
  safetyNotes: [
    {
      key: "mince_doneness",
      text: {
        ja: "細かく刻んだ肉は中心まで火を通してください。ピンク色が残らないよう、ほぐしながら炒めます。",
        en: "Cook finely chopped meat through, breaking it up until no pink remains.",
        es: "Cocina bien la carne picada, deshaciéndola hasta que no quede nada rosado.",
      },
    },
    {
      key: "soft_yolk",
      text: {
        ja: "黄身がやわらかい卵は、妊娠中の方、乳幼児、高齢の方、体調のすぐれない方には向きません。その場合は黄身まで固まるまで加熱してください。",
        en: "Eggs with runny yolks are not recommended for pregnant people, young children, older adults, or anyone unwell; for them, cook until the yolks are firm.",
        es: "Los huevos con la yema líquida no se recomiendan para embarazadas, niños pequeños, personas mayores o enfermas; en esos casos, cocínalos hasta que la yema esté firme.",
      },
    },
  ],
  substitutions: [],
};
