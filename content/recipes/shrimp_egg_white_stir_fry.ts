import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "shrimp_egg_white_stir_fry",
  texts: {
    name: { ja: "えびと卵白の中華炒め", en: "Chinese-style shrimp and egg white stir-fry", es: "Salteado chino de gambas y claras", fr: "Sauté de crevettes aux blancs d'œufs à la chinoise" },
    summary: {
      ja: "中華のえびと卵の炒め物をヒントに、卵白を多めに使い、えびとねぎをしょうがの香りでふんわり炒めます。ご飯を添えます。",
      en: "Inspired by Chinese shrimp and egg stir-fries: plenty of egg white, shrimp, and leek stir-fried until fluffy with ginger, with rice.",
      es: "Inspirado en los salteados chinos de gambas y huevo: abundantes claras, gambas y puerro salteados con jengibre hasta quedar esponjosos, con arroz.",
      fr: "Inspiré des sautés chinois de crevettes aux œufs : beaucoup de blancs d'œufs, des crevettes et du poireau japonais sautés jusqu'à être moelleux, au gingembre, avec du riz.",
    },
  },
  cuisine: "chinese",
  goals: ["cut"],
  mainProteinGroup: "egg",
  tags: [],
  minutes: 10,
  effort: 1,
  equipment: ["stove", "frying_pan"],
  servings: 1,
  ingredients: [
    {
      key: "egg_white",
      food: "egg_white",
      grams: 165,
      state: "raw",
      cooking: "stir_fry",
      measure: { unit: "piece", quantity: 5 },
      role: "main_protein",
      adjust: { kind: "count", unitGrams: 33, min: 3, max: 7 },
      note: {
        ja: "成分表に加熱した卵白の値がないため、生の値で計算しています。残った黄身は別の料理に使えます。市販の液卵白でも作れます。",
        en: "The tables have no value for cooked egg white, so the raw value is used. Use the leftover yolks in another dish, or use liquid egg white from a carton.",
        es: "Las tablas no tienen un valor para la clara cocinada, así que se usa el valor en crudo. Usa las yemas que sobren en otro plato, o usa clara de huevo líquida envasada.",
        fr: "Les tables n'ont pas de valeur pour le blanc d'œuf cuit ; la valeur à l'état cru est donc utilisée. Utilisez les jaunes restants dans un autre plat, ou prenez du blanc d'œuf liquide en brique.",
      },
    },
    { key: "egg", food: "egg", grams: 50, state: "scramble", measure: { unit: "piece", quantity: 1 }, role: "main_protein", adjust: { kind: "count", unitGrams: 50, min: 1, max: 2 } },
    { key: "oil", food: "vegetable_oil", grams: 4, state: "as_is", measure: { unit: "tsp", quantity: 1 }, role: "fat", linkedTo: "egg_white" },
    {
      key: "shrimp",
      food: "shrimp",
      grams: 80,
      state: "raw",
      cooking: "stir_fry",
      role: "main_protein",
      note: {
        ja: "成分表に炒めたえびの値がないため、生の値で計算しています。殻と背わたを除いた重さです。",
        en: "The tables have no value for stir-fried shrimp, so the raw value is used. Weight after removing the shells and veins.",
        es: "Las tablas no tienen un valor para las gambas salteadas, así que se usa el valor en crudo. Peso sin cáscara ni intestino.",
        fr: "Les tables n'ont pas de valeur pour les crevettes sautées ; la valeur à l'état cru est donc utilisée. Poids après retrait de la carapace et de la veine.",
      },
    },
    { key: "long_onion", food: "long_onion", grams: 20, state: "raw", role: "vegetable" },
    { key: "ginger", food: "ginger", grams: 3, state: "raw", role: "seasoning" },
    { key: "salt", food: "salt", grams: 0.8, state: "as_is", measure: { unit: "pinch", quantity: 2 }, role: "seasoning" },
    { key: "starch", food: "potato_starch", grams: 2, state: "as_is", role: "seasoning" },
    { key: "rice", food: "rice_cooked", grams: 150, state: "as_is", role: "main_carb", adjust: { kind: "grams", min: 100, max: 250, step: 25 } },
  ],
  sides: [
    { key: "rice", label: { ja: "ご飯", en: "Rice", es: "Arroz", fr: "Riz" }, ingredients: ["rice"], solverMayRemove: true },
  ],
  steps: [
    {
      key: "prep",
      text: {
        ja: "えびの殻と背わたを除いて片栗粉をまぶします。ねぎは斜め薄切り、しょうがはせん切りにします。卵と卵白は塩を加えて溶きほぐします。",
        en: "Peel and devein the shrimp and coat them with the potato starch. Thinly slice the leek on the diagonal and cut the ginger into thin strips. Beat the egg and egg whites with the salt.",
        es: "Pela las gambas, quítales el intestino y espolvoréalas con la fécula de patata. Corta el puerro en láminas finas al bies y el jengibre en tiras finas. Bate el huevo y las claras con la sal.",
        fr: "Décortiquez les crevettes, retirez la veine et enrobez-les de fécule. Émincez finement le poireau japonais en biais et taillez le gingembre en fines lanières. Battez l'œuf et les blancs d'œufs avec le sel.",
      },
    },
    {
      key: "shrimp",
      text: {
        ja: "フライパンに油を中火で熱し、しょうがとえびを2〜3分、えびが赤くなるまで炒めます。ねぎを加えてさっと炒めます。",
        en: "Heat the oil in a frying pan over medium heat and stir-fry the ginger and shrimp for 2–3 minutes until the shrimp turn pink. Add the leek and stir-fry briefly.",
        es: "Calienta el aceite en una sartén a fuego medio y saltea el jengibre y las gambas 2-3 minutos hasta que se pongan rosadas. Añade el puerro y saltea un momento.",
        fr: "Faites chauffer l'huile dans une poêle à feu moyen et faites sauter le gingembre et les crevettes 2 à 3 minutes, jusqu'à ce que les crevettes deviennent roses. Ajoutez le poireau japonais et faites sauter brièvement.",
      },
    },
    {
      key: "eggs",
      text: {
        ja: "卵液を流し入れ、大きく混ぜながら固まるまで炒めます。",
        en: "Pour in the eggs and stir in large folds until set.",
        es: "Vierte el huevo batido y remueve con movimientos amplios hasta que cuaje.",
        fr: "Versez les œufs et remuez à grands gestes jusqu'à ce qu'ils soient pris.",
      },
    },
    {
      key: "rice",
      side: "rice",
      text: {
        ja: "ご飯を添えます。",
        en: "Serve with the rice.",
        es: "Acompáñalo con el arroz.",
        fr: "Servez avec le riz.",
      },
    },
  ],
  safetyNotes: [
    {
      key: "shrimp_doneness",
      text: {
        ja: "えびは全体が赤くなり、身が白く不透明になるまで加熱してください。",
        en: "Cook the shrimp until they are pink all over and the flesh is white and opaque.",
        es: "Cocina las gambas hasta que estén rosadas por completo y la carne esté blanca y opaca.",
        fr: "Faites cuire les crevettes jusqu'à ce qu'elles soient roses partout et que leur chair soit blanche et opaque.",
      },
    },
    {
      key: "egg_set",
      text: {
        ja: "卵は固まるまで加熱してください。",
        en: "Cook the eggs until set.",
        es: "Cocina los huevos hasta que cuajen.",
        fr: "Faites cuire les œufs jusqu'à ce qu'ils soient pris.",
      },
    },
  ],
  substitutions: [],
};
