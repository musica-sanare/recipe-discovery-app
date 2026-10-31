import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "salmon_milk_potato_chowder",
  texts: {
    name: { ja: "生鮭とじゃがいもの牛乳チャウダー", en: "Chum salmon and potato milk chowder", es: "Sopa cremosa de salmón keta y patata con leche", fr: "Chaudrée de saumon kéta et pommes de terre au lait" },
    summary: {
      ja: "生鮭、じゃがいも、玉ねぎ、にんじんを煮て、牛乳でまろやかなチャウダーにします。パンを添えます。作り置きできます。",
      en: "Chum salmon, potato, onion, and carrot simmered and finished with milk into a mild chowder, with bread. It keeps well.",
      es: "Salmón keta, patata, cebolla y zanahoria cocidos y terminados con leche en una sopa cremosa y suave, con pan. Se puede preparar por adelantado.",
      fr: "Saumon kéta, pomme de terre, oignon et carotte mijotés puis finis au lait en une chaudrée douce, avec du pain. Elle se conserve bien.",
    },
  },
  cuisine: "western",
  goals: ["bulk"],
  mainProteinGroup: "fish",
  tags: ["batch"],
  minutes: 30,
  effort: 2,
  equipment: ["stove", "pot"],
  servings: 1,
  ingredients: [
    { key: "salmon", food: "chum_salmon", grams: 180, state: "simmer", role: "main_protein", adjust: { kind: "grams", min: 140, max: 220, step: 20 } },
    { key: "potato", food: "potato", grams: 250, state: "simmer", measure: { unit: "piece", quantity: 2 }, role: "main_carb", adjust: { kind: "grams", min: 200, max: 300, step: 50 } },
    { key: "onion", food: "onion", grams: 50, state: "stir_fry", role: "vegetable" },
    { key: "oil_onion", food: "vegetable_oil", grams: 4, state: "as_is", measure: { unit: "tsp", quantity: 1 }, role: "fat", includedIn: "onion" },
    { key: "carrot", food: "carrot", grams: 40, state: "boil", role: "vegetable" },
    { key: "milk", food: "milk", grams: 250, state: "as_is", role: "other" },
    { key: "salt", food: "salt", grams: 1.5, state: "as_is", measure: { unit: "pinch", quantity: 3 }, role: "seasoning" },
    { key: "bread", food: "bread", grams: 90, state: "as_is", measure: { unit: "slice", quantity: 1.5 }, role: "main_carb", adjust: { kind: "grams", min: 60, max: 120, step: 30 } },
  ],
  sides: [
    { key: "bread", label: { ja: "パン", en: "Bread", es: "Pan", fr: "Pain" }, ingredients: ["bread"], solverMayRemove: true },
  ],
  steps: [
    {
      key: "prep",
      text: {
        ja: "生鮭をひと口大に切ります。じゃがいもは2cm角、にんじんは1cm角、玉ねぎは1cm角に切ります。",
        en: "Cut the salmon into bite-size pieces. Dice the potatoes into 2 cm pieces and the carrot and onion into 1 cm pieces.",
        es: "Corta el salmón en trozos pequeños. Corta las patatas en dados de 2 cm y la zanahoria y la cebolla en dados de 1 cm.",
        fr: "Coupez le saumon en bouchées. Coupez les pommes de terre en dés de 2 cm, et la carotte et l'oignon en dés de 1 cm.",
      },
    },
    {
      key: "simmer",
      text: {
        ja: "鍋に油を中火で熱して玉ねぎを3分炒め、じゃがいも、にんじん、水200mLを加えて、ふたをして10分煮ます。",
        en: "Heat the oil in a pot over medium heat, sauté the onion for 3 minutes, add the potatoes, carrot, and 200 mL of water, cover, and simmer for 10 minutes.",
        es: "Calienta el aceite en una olla a fuego medio, sofríe la cebolla 3 minutos, añade las patatas, la zanahoria y 200 mL de agua, tapa y cuece 10 minutos.",
        fr: "Faites chauffer l'huile dans une casserole à feu moyen, faites revenir l'oignon 3 minutes, ajoutez les pommes de terre, la carotte et 200 mL d'eau, couvrez et laissez mijoter 10 minutes.",
      },
    },
    {
      key: "salmon",
      text: {
        ja: "鮭を加えて5分煮て、身が不透明になるまで火を通します。牛乳と塩を加え、弱火で沸騰させないように温めます。",
        en: "Add the salmon and simmer for 5 minutes, until opaque. Add the milk and salt and warm over low heat without letting it boil.",
        es: "Añade el salmón y cuece 5 minutos, hasta que esté opaco. Añade la leche y la sal y calienta a fuego bajo sin que llegue a hervir.",
        fr: "Ajoutez le saumon et laissez mijoter 5 minutes, jusqu'à ce qu'il soit opaque. Ajoutez le lait et le sel, et réchauffez à feu doux sans laisser bouillir.",
      },
    },
    {
      key: "serve",
      text: { ja: "器に盛ります。", en: "Serve in a bowl.", es: "Sírvela en un cuenco.", fr: "Servez dans un bol." },
    },
    {
      key: "bread",
      side: "bread",
      text: { ja: "パンを添えます。", en: "Serve with the bread.", es: "Acompáñalo con el pan.", fr: "Servez avec le pain." },
    },
  ],
  safetyNotes: [
    {
      key: "salmon_doneness",
      text: {
        ja: "鮭は中心まで火を通してください。身がほぐれやすく、不透明になっていれば煮上がりです。",
        en: "Cook the salmon through; it is done when it is opaque and flakes easily.",
        es: "Cocina el salmón por completo: está hecho cuando es opaco y se desmenuza con facilidad.",
        fr: "Faites cuire le saumon à cœur ; il est cuit quand sa chair est opaque et s'effeuille facilement.",
      },
    },
    {
      key: "fish_bones",
      text: {
        ja: "切り身にも小骨が残っていることがあります。食べるときは骨に注意してください。",
        en: "Fillets may still have small bones; take care when eating.",
        es: "Los filetes pueden tener alguna espina pequeña; ten cuidado al comerlos.",
        fr: "Les filets peuvent encore contenir de petites arêtes ; faites attention en mangeant.",
      },
    },
    {
      key: "cooling",
      text: {
        ja: "作り置きする場合は、浅い容器に移して早めに冷まし、冷蔵庫で保存してください。食べるときは中心まで十分に温め直します。",
        en: "To keep leftovers, transfer them to a shallow container, cool them quickly, and refrigerate. Reheat until piping hot throughout before eating.",
        es: "Si guardas sobras, pásalas a un recipiente poco hondo, enfríalas rápido y guárdalas en el refrigerador. Antes de comer, recaliéntalas hasta que estén bien calientes por dentro.",
        fr: "Pour conserver les restes, mettez-les dans un récipient peu profond, faites-les refroidir rapidement et placez-les au réfrigérateur. Avant de les manger, réchauffez-les jusqu'à ce qu'ils soient bien chauds à cœur.",
      },
    },
  ],
  substitutions: [],
};
