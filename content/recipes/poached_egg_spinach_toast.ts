import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "poached_egg_spinach_toast",
  texts: {
    name: { ja: "ポーチドエッグとほうれん草のオープンサンド", en: "Open sandwich with poached eggs and spinach", es: "Pan tostado con huevos escalfados y espinacas" },
    summary: {
      ja: "トーストにゆでたほうれん草、チーズ、炒めた卵白、ポーチドエッグをのせた朝食向けの一皿です。",
      en: "Toast topped with blanched spinach, cheese, scrambled egg whites, and poached eggs: a quick breakfast.",
      es: "Pan tostado con espinacas escaldadas, queso, claras revueltas y huevos escalfados: un desayuno rápido.",
    },
  },
  cuisine: "western",
  goals: ["maintain"],
  mainProteinGroup: "egg",
  tags: ["breakfast"],
  minutes: 15,
  effort: 2,
  equipment: ["stove", "frying_pan", "pot", "oven_toaster"],
  servings: 1,
  ingredients: [
    { key: "bread", food: "bread", grams: 60, state: "as_is", measure: { unit: "slice", quantity: 1 }, role: "main_carb", adjust: { kind: "count", unitGrams: 60, min: 1, max: 3 } },
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
    {
      key: "egg_white",
      food: "egg_white",
      grams: 99,
      state: "raw",
      cooking: "scramble",
      measure: { unit: "piece", quantity: 3 },
      role: "main_protein",
      adjust: { kind: "count", unitGrams: 33, min: 2, max: 6 },
      note: {
        ja: "成分表に加熱した卵白の値がないため、生の値で計算しています。残った黄身は別の料理に使えます。市販の液卵白でも作れます。",
        en: "The tables have no value for cooked egg white, so the raw value is used. Use the leftover yolks in another dish, or use liquid egg white from a carton.",
        es: "Las tablas no tienen un valor para la clara cocinada, así que se usa el valor en crudo. Usa las yemas que sobren en otro plato, o usa clara de huevo líquida envasada.",
      },
    },
    { key: "oil", food: "olive_oil", grams: 2, state: "as_is", measure: { unit: "tsp", quantity: 0.5 }, role: "fat", linkedTo: "egg_white" },
    { key: "spinach", food: "spinach", grams: 80, state: "boil", role: "vegetable" },
    { key: "cheese", food: "mozzarella", grams: 15, state: "as_is", role: "main_protein" },
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
        es: "Lleva agua con el vinagre a un hervor suave, añade los huevos de uno en uno con cuidado y escálfalos de 3 a 4 minutos hasta que cuajen las claras.",
      },
    },
    {
      key: "spinach",
      text: {
        ja: "ほうれん草を1分ゆでて水にとり、水気を絞って3cm長さに切り、塩をふります。",
        en: "Boil the spinach for 1 minute, cool it in water, squeeze it dry, cut it into 3 cm lengths, and season with salt.",
        es: "Hierve las espinacas 1 minuto, enfríalas en agua, exprímelas bien, córtalas en trozos de 3 cm y sálalas.",
      },
    },
    {
      key: "egg_white",
      text: {
        ja: "フライパンにオリーブ油を中火で熱し、溶いた卵白を流し入れて、白く固まるまで炒めます。",
        en: "Heat the olive oil in a frying pan over medium heat, pour in the beaten egg whites, and stir until they are white and set.",
        es: "Calienta el aceite de oliva en una sartén a fuego medio, vierte las claras batidas y remueve hasta que estén blancas y cuajadas.",
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
        ja: "ほうれん草、炒めた卵白、ポーチドエッグをのせ、こしょうをふります。",
        en: "Add the spinach, scrambled egg whites, and poached eggs and finish with pepper.",
        es: "Añade las espinacas, las claras revueltas y los huevos escalfados y termina con pimienta.",
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
