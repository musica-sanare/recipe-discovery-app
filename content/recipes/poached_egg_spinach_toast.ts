import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "poached_egg_spinach_toast",
  texts: {
    name: { ja: "ポーチドエッグとほうれん草のオープンサンド", en: "Open sandwich with poached eggs and spinach", es: "Tosta de huevos escalfados y espinacas" },
    summary: {
      ja: "トーストにソテーしたほうれん草、チーズ、ポーチドエッグをのせた朝食向けの一皿です。",
      en: "Toast topped with sautéed spinach, cheese, and poached eggs: a quick breakfast.",
      es: "Tostada con espinacas salteadas, queso y huevos escalfados: un desayuno rápido.",
    },
  },
  cuisine: "western",
  goals: ["maintain"],
  mainProteinGroup: "egg",
  tags: ["breakfast"],
  minutes: 10,
  effort: 2,
  equipment: ["stove", "frying_pan", "pot", "oven_toaster"],
  servings: 1,
  ingredients: [
    { key: "bread", food: "bread", grams: 60, state: "as_is", measure: { unit: "slice", quantity: 1 }, role: "main_carb", adjust: { kind: "count", unitGrams: 60, min: 1, max: 2 } },
    { key: "egg", food: "egg", grams: 100, state: "poach", measure: { unit: "piece", quantity: 2 }, role: "main_protein", adjust: { kind: "count", unitGrams: 50, min: 1, max: 3 } },
    {
      key: "vinegar",
      food: "rice_vinegar",
      grams: 15,
      state: "as_is",
      measure: { unit: "tbsp", quantity: 1 },
      role: "other",
      includedIn: "egg",
      note: {
        ja: "ゆで湯に加えるもので、食べる量には含めません。",
        en: "Added to the poaching water; it is not eaten, so it is not counted.",
        es: "Se añade al agua de escalfar; no se come, así que no se cuenta.",
      },
    },
    { key: "spinach", food: "spinach", grams: 80, state: "stir_fry", role: "vegetable" },
    { key: "oil", food: "olive_oil", grams: 4, state: "as_is", measure: { unit: "tsp", quantity: 1 }, role: "fat", includedIn: "spinach" },
    { key: "cheese", food: "mozzarella", grams: 30, state: "as_is", role: "main_protein" },
    { key: "salt", food: "salt", grams: 0.5, state: "as_is", measure: { unit: "pinch", quantity: 1 }, role: "seasoning" },
    { key: "pepper", food: "black_pepper", grams: 0.2, state: "as_is", measure: { unit: "pinch", quantity: 1 }, role: "seasoning" },
  ],
  sides: [],
  steps: [
    {
      key: "poach",
      text: {
        ja: "鍋に湯を沸かして酢を加え、火を弱めて卵を1個ずつそっと割り入れ、白身が固まるまで3〜4分ゆでて取り出します。",
        en: "Bring water to a simmer with the vinegar, gently crack in the eggs one at a time, and poach for 3 to 4 minutes until the whites are set.",
        es: "Lleva agua con el vinagre a un hervor suave, casca los huevos de uno en uno con cuidado y escálfalos de 3 a 4 minutos hasta que cuajen las claras.",
      },
    },
    {
      key: "spinach",
      text: {
        ja: "ほうれん草をオリーブ油でしんなりするまで炒め、塩をふります。",
        en: "Sauté the spinach in olive oil until wilted and season with salt.",
        es: "Saltea las espinacas en aceite de oliva hasta que se ablanden y sálalas.",
      },
    },
    {
      key: "toast",
      text: {
        ja: "食パンにチーズをのせてトースターで焼きます。",
        en: "Top the bread with the cheese and toast it in the toaster oven.",
        es: "Pon el queso sobre el pan y tuéstalo en el horno tostador.",
      },
    },
    {
      key: "assemble",
      text: {
        ja: "ほうれん草とポーチドエッグをのせ、こしょうをふります。",
        en: "Add the spinach and poached eggs and finish with pepper.",
        es: "Añade las espinacas y los huevos escalfados y termina con pimienta.",
      },
    },
  ],
  safetyNotes: [
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
