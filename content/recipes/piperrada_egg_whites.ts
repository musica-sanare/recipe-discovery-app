import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "piperrada_egg_whites",
  texts: {
    name: { ja: "卵白のピペラーダ", en: "Piperrada with egg whites", es: "Piperrada con claras", fr: "Piperrada aux blancs d'œufs" },
    summary: {
      ja: "スペイン・バスク地方のピペラーダをヒントに、ピーマン、玉ねぎ、トマトを炒め、卵と卵白を加えて炒り卵にします。パンを添えます。",
      en: "Inspired by Basque piperrada: peppers, onion, and tomato stir-fried and scrambled with an egg and egg whites, with bread.",
      es: "Inspirado en la piperrada vasca: pimientos, cebolla y tomate salteados y revueltos con huevo y claras, con pan.",
      fr: "Inspirée de la piperrada basque : poivrons, oignon et tomate sautés puis brouillés avec un œuf et des blancs d'œufs, avec du pain.",
    },
  },
  cuisine: "spanish",
  goals: ["maintain"],
  mainProteinGroup: "egg",
  tags: ["breakfast"],
  minutes: 10,
  effort: 1,
  equipment: ["stove", "frying_pan"],
  servings: 1,
  ingredients: [
    { key: "egg", food: "egg", grams: 50, state: "scramble", measure: { unit: "piece", quantity: 1 }, role: "main_protein", adjust: { kind: "count", unitGrams: 50, min: 1, max: 2 } },
    {
      key: "egg_white",
      food: "egg_white",
      grams: 165,
      state: "raw",
      cooking: "scramble",
      measure: { unit: "piece", quantity: 5 },
      role: "main_protein",
      adjust: { kind: "count", unitGrams: 33, min: 2, max: 6 },
      note: {
        ja: "成分表に加熱した卵白の値がないため、生の値で計算しています。残った黄身は別の料理に使えます。市販の液卵白でも作れます。",
        en: "The tables have no value for cooked egg white, so the raw value is used. Use the leftover yolks in another dish, or use liquid egg white from a carton.",
        es: "Las tablas no tienen un valor para la clara cocinada, así que se usa el valor en crudo. Usa las yemas que sobren en otro plato, o usa clara de huevo líquida envasada.",
        fr: "Les tables n'ont pas de valeur pour le blanc d'œuf cuit ; la valeur à l'état cru est donc utilisée. Utilisez les jaunes restants dans un autre plat, ou prenez du blanc d'œuf liquide en brique.",
      },
    },
    { key: "red_pepper", food: "red_pepper", grams: 80, state: "stir_fry", measure: { unit: "piece", quantity: 2 / 3 }, role: "vegetable" },
    { key: "green_pepper", food: "green_pepper", grams: 40, state: "stir_fry", measure: { unit: "piece", quantity: 1 }, role: "vegetable" },
    { key: "onion", food: "onion", grams: 40, state: "stir_fry", role: "vegetable" },
    { key: "oil_vegetables", food: "olive_oil", grams: 5, state: "as_is", measure: { unit: "tsp", quantity: 1.25 }, role: "fat", includedIn: "red_pepper" },
    { key: "tomato", food: "tomato", grams: 80, state: "raw", cooking: "stir_fry", measure: { unit: "piece", quantity: 0.5 }, role: "vegetable" },
    { key: "salt", food: "salt", grams: 0.5, state: "as_is", measure: { unit: "pinch", quantity: 1 }, role: "seasoning" },
    { key: "bread", food: "bread", grams: 120, state: "as_is", measure: { unit: "slice", quantity: 2 }, role: "main_carb", adjust: { kind: "count", unitGrams: 60, min: 1, max: 3 } },
  ],
  sides: [
    { key: "bread", label: { ja: "パン", en: "Bread", es: "Pan", fr: "Pain" }, ingredients: ["bread"], solverMayRemove: true },
  ],
  steps: [
    {
      key: "vegetables",
      text: {
        ja: "赤パプリカとピーマンを細切り、玉ねぎを薄切り、トマトを1cm角に切ります。フライパンにオリーブオイルを中火で熱し、赤パプリカ、ピーマン、玉ねぎを4分炒めます。",
        en: "Cut the red pepper and green pepper into thin strips, thinly slice the onion, and dice the tomato into 1 cm pieces. Heat the olive oil in a frying pan over medium heat and stir-fry the peppers and onion for 4 minutes.",
        es: "Corta el pimiento rojo y el pimiento verde en tiras finas, la cebolla en láminas finas y el tomate en dados de 1 cm. Calienta el aceite de oliva en una sartén a fuego medio y saltea los pimientos y la cebolla 4 minutos.",
        fr: "Coupez le poivron rouge et le poivron vert en fines lanières, émincez finement l'oignon et coupez la tomate en dés de 1 cm. Faites chauffer l'huile d'olive dans une poêle à feu moyen et faites sauter les poivrons et l'oignon 4 minutes.",
      },
    },
    {
      key: "eggs",
      text: {
        ja: "トマトと塩を加えて1分炒め、溶きほぐした卵と卵白を加えて、固まるまで大きく混ぜながら炒めます。",
        en: "Add the tomato and salt and stir-fry for 1 minute, then add the beaten egg and egg whites and stir in large folds until set.",
        es: "Añade el tomate y la sal y saltea 1 minuto; luego añade el huevo y las claras batidos y remueve con movimientos amplios hasta que cuajen.",
        fr: "Ajoutez la tomate et le sel et faites sauter 1 minute, puis ajoutez l'œuf et les blancs d'œufs battus et remuez à grands gestes jusqu'à ce qu'ils soient pris.",
      },
    },
    {
      key: "bread",
      side: "bread",
      text: {
        ja: "トーストしたパンを添えます。",
        en: "Serve with the toasted bread.",
        es: "Acompáñalo con el pan tostado.",
        fr: "Servez avec le pain grillé.",
      },
    },
  ],
  safetyNotes: [
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
