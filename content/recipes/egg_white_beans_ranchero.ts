import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "egg_white_beans_ranchero",
  texts: {
    name: { ja: "卵白と豆のウエボス・ランチェロス風", en: "Huevos rancheros-style egg whites with beans", es: "Claras y frijoles al estilo huevos rancheros" },
    summary: {
      ja: "メキシコの朝食ウエボス・ランチェロスをヒントに、トマトと豆のソースで卵と卵白を煮ます。トルティーヤの代わりにパンを添えます。",
      en: "Inspired by the Mexican breakfast huevos rancheros: an egg and egg whites cooked in a tomato and bean sauce, with bread instead of tortillas.",
      es: "Inspirado en el desayuno mexicano de huevos rancheros: huevo y claras cocinados en una salsa de tomate y alubias rojas, con pan en lugar de tortillas.",
    },
  },
  cuisine: "latin_american",
  goals: ["maintain"],
  mainProteinGroup: "egg",
  tags: ["breakfast"],
  minutes: 15,
  effort: 1,
  equipment: ["stove", "frying_pan"],
  servings: 1,
  ingredients: [
    {
      key: "egg",
      food: "egg",
      grams: 50,
      state: "poach",
      measure: { unit: "piece", quantity: 1 },
      role: "main_protein",
      adjust: { kind: "count", unitGrams: 50, min: 1, max: 2 },
      note: {
        ja: "ソースの中で黄身まで固めて加熱するため、成分表のポーチドエッグの値で計算しています。",
        en: "The egg is cooked in the sauce until the yolk is firm, so the poached egg value is used.",
        es: "El huevo se cocina en la salsa hasta que la yema esté firme, así que se usa el valor del huevo escalfado.",
      },
    },
    {
      key: "egg_white",
      food: "egg_white",
      grams: 99,
      state: "raw",
      cooking: "simmer",
      measure: { unit: "piece", quantity: 3 },
      role: "main_protein",
      adjust: { kind: "count", unitGrams: 33, min: 2, max: 6 },
      note: {
        ja: "成分表に加熱した卵白の値がないため、生の値で計算しています。残った黄身は別の料理に使えます。市販の液卵白でも作れます。",
        en: "The tables have no value for cooked egg white, so the raw value is used. Use the leftover yolks in another dish, or use liquid egg white from a carton.",
        es: "Las tablas no tienen un valor para la clara cocinada, así que se usa el valor en crudo. Usa las yemas que sobren en otro plato, o usa clara de huevo líquida envasada.",
      },
    },
    { key: "olive_oil", food: "olive_oil", grams: 4, state: "as_is", measure: { unit: "tsp", quantity: 1 }, role: "fat" },
    { key: "onion", food: "onion", grams: 30, state: "raw", cooking: "simmer", role: "vegetable" },
    { key: "tomato_canned", food: "tomato_canned", grams: 150, state: "as_is", role: "vegetable" },
    { key: "beans", food: "kidney_beans", grams: 80, state: "as_is", role: "other" },
    { key: "chili_powder", food: "chili_powder", grams: 1, state: "as_is", measure: { unit: "tsp", quantity: 0.5 }, role: "seasoning" },
    { key: "salt", food: "salt", grams: 0.5, state: "as_is", measure: { unit: "pinch", quantity: 1 }, role: "seasoning" },
    { key: "coriander", food: "coriander", grams: 2, state: "raw", role: "vegetable" },
    { key: "bread", food: "bread", grams: 60, state: "as_is", measure: { unit: "slice", quantity: 1 }, role: "main_carb", adjust: { kind: "count", unitGrams: 60, min: 1, max: 3 } },
  ],
  sides: [
    { key: "bread", label: { ja: "パン", en: "Bread", es: "Pan" }, ingredients: ["bread"], solverMayRemove: true },
  ],
  steps: [
    {
      key: "sauce",
      text: {
        ja: "フライパンにオリーブオイルを中火で熱し、みじん切りにした玉ねぎを2分炒めます。トマト缶、汁を切った豆、チリパウダー、塩を加えて3分煮ます。",
        en: "Heat the olive oil in a frying pan over medium heat and stir-fry the finely chopped onion for 2 minutes. Add the canned tomatoes, drained beans, chili powder, and salt and simmer for 3 minutes.",
        es: "Calienta el aceite de oliva en una sartén a fuego medio y saltea la cebolla picada fina 2 minutos. Añade el tomate en lata, las alubias escurridas, el chile en polvo y la sal y cuece 3 minutos.",
      },
    },
    {
      key: "eggs",
      text: {
        ja: "卵白を回し入れて軽く混ぜ、ソースの中央にくぼみを作って卵を割り入れます。ふたをして弱めの中火で5〜6分、卵白と黄身が固まるまで加熱します。",
        en: "Pour in the egg whites and stir gently, make a well in the center of the sauce, and crack in the egg. Cover and cook over medium-low heat for 5–6 minutes until the whites and the yolk are set.",
        es: "Vierte las claras y remueve un poco, haz un hueco en el centro de la salsa y añade el huevo. Tapa y cocina a fuego medio-bajo 5-6 minutos hasta que las claras y la yema cuajen.",
      },
    },
    {
      key: "serve",
      text: {
        ja: "刻んだパクチーを散らします。",
        en: "Sprinkle with the chopped cilantro.",
        es: "Espolvorea el cilantro picado.",
      },
    },
    {
      key: "bread",
      side: "bread",
      text: {
        ja: "トーストしたパンを添えます。",
        en: "Serve with the toasted bread.",
        es: "Acompáñalo con el pan tostado.",
      },
    },
  ],
  safetyNotes: [
    {
      key: "egg_set",
      text: {
        ja: "卵は黄身まで固まるまで加熱してください。",
        en: "Cook the eggs until the yolk is set too.",
        es: "Cocina los huevos hasta que también la yema cuaje.",
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
