import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "tuna_chickpea_salad",
  texts: {
    name: { ja: "ツナとひよこ豆のサラダ", en: "Tuna and chickpea salad", es: "Ensalada de atún y garbanzos", fr: "Salade de thon et pois chiches" },
    summary: {
      ja: "地中海のサラダをヒントに、ツナ缶、ひよこ豆、きゅうり、トマトをレモンとオリーブオイルで和えます。火を使わずに作れます。パンを添えます。",
      en: "Inspired by Mediterranean salads: canned tuna, chickpeas, cucumber, and tomato dressed with lemon and olive oil. No cooking needed; served with bread.",
      es: "Inspirado en las ensaladas mediterráneas: atún en lata, garbanzos, pepino y tomate aliñados con limón y aceite de oliva. Sin cocinar; con pan.",
      fr: "Inspirée des salades méditerranéennes : thon en conserve, pois chiches, concombre et tomate assaisonnés de citron et d'huile d'olive. Sans cuisson ; servie avec du pain.",
    },
  },
  cuisine: "mediterranean",
  goals: ["cut"],
  mainProteinGroup: "fish",
  tags: ["no_cook", "breakfast"],
  minutes: 10,
  effort: 1,
  equipment: [],
  servings: 1,
  ingredients: [
    {
      key: "tuna",
      food: "tuna_canned",
      grams: 140,
      state: "as_is",
      measure: { unit: "can", quantity: 2 },
      role: "main_protein",
      adjust: { kind: "count", unitGrams: 70, min: 1, max: 3 },
      note: {
        ja: "汁を切った重さです（1缶約70g）。",
        en: "Drained weight (about 70 g per can).",
        es: "Peso escurrido (unos 70 g por lata).",
        fr: "Poids égoutté (environ 70 g par boîte).",
      },
    },
    { key: "chickpeas", food: "chickpeas", grams: 100, state: "as_is", role: "other" },
    { key: "cucumber", food: "cucumber", grams: 60, state: "raw", measure: { unit: "piece", quantity: 0.5 }, role: "vegetable" },
    { key: "tomato", food: "tomato", grams: 80, state: "raw", measure: { unit: "piece", quantity: 0.5 }, role: "vegetable" },
    { key: "onion", food: "onion", grams: 20, state: "raw", role: "vegetable" },
    { key: "parsley", food: "parsley", grams: 2, state: "raw", role: "vegetable" },
    { key: "lemon", food: "lemon_juice", grams: 10, state: "as_is", measure: { unit: "tsp", quantity: 2 }, role: "seasoning" },
    { key: "olive_oil", food: "olive_oil", grams: 4, state: "as_is", measure: { unit: "tsp", quantity: 1 }, role: "fat" },
    { key: "salt", food: "salt", grams: 0.5, state: "as_is", measure: { unit: "pinch", quantity: 1 }, role: "seasoning" },
    { key: "bread", food: "bread", grams: 60, state: "as_is", measure: { unit: "slice", quantity: 1 }, role: "main_carb", adjust: { kind: "count", unitGrams: 60, min: 1, max: 2 } },
  ],
  sides: [
    { key: "bread", label: { ja: "パン", en: "Bread", es: "Pan", fr: "Pain" }, ingredients: ["bread"], solverMayRemove: true },
  ],
  steps: [
    {
      key: "cut",
      text: {
        ja: "きゅうりとトマトを1cm角に切り、玉ねぎは薄切りにして水に5分さらし、水気を切ります。パセリは刻みます。",
        en: "Cut the cucumber and tomato into 1 cm dice. Thinly slice the onion, soak it in water for 5 minutes, and drain. Chop the parsley.",
        es: "Corta el pepino y el tomate en dados de 1 cm. Corta la cebolla en láminas finas, déjala 5 minutos en agua y escúrrela. Pica el perejil.",
        fr: "Coupez le concombre et la tomate en dés de 1 cm. Émincez finement l'oignon, faites-le tremper 5 minutes dans l'eau et égouttez-le. Hachez le persil.",
      },
    },
    {
      key: "toss",
      text: {
        ja: "ボウルに汁を切ったツナとひよこ豆、野菜を入れ、レモン果汁、オリーブオイル、塩で和えます。",
        en: "Put the drained tuna and chickpeas and the vegetables in a bowl and dress with the lemon juice, olive oil, and salt.",
        es: "Pon el atún y los garbanzos escurridos y las verduras en un bol y alíñalos con el zumo de limón, el aceite de oliva y la sal.",
        fr: "Mettez le thon et les pois chiches égouttés et les légumes dans un saladier, et assaisonnez avec le jus de citron, l'huile d'olive et le sel.",
      },
    },
    {
      key: "bread",
      side: "bread",
      text: {
        ja: "パンを添えます。",
        en: "Serve with the bread.",
        es: "Acompáñalo con el pan.",
        fr: "Servez avec le pain.",
      },
    },
  ],
  safetyNotes: [
    {
      key: "no_cook",
      text: {
        ja: "加熱しない料理なので、ツナ缶とひよこ豆は開封後すぐに使い、作ったらすぐに食べてください。",
        en: "As nothing is cooked, use the tuna and chickpeas right after opening and eat the salad straight away.",
        es: "Como no se cocina nada, usa el atún y los garbanzos nada más abrirlos y come la ensalada enseguida.",
        fr: "Comme rien n'est cuit, utilisez le thon et les pois chiches dès l'ouverture et mangez la salade aussitôt.",
      },
    },
    {
      key: "opened_can",
      text: {
        ja: "開けた缶詰の残りは缶から別の容器に移して冷蔵し、早めに食べてください。",
        en: "Move any leftover canned food to another container, refrigerate it, and eat it soon.",
        es: "Pasa la conserva que sobre a otro recipiente, guárdala en el refrigerador y consúmela pronto.",
        fr: "Transférez le reste des conserves dans un autre récipient, placez-le au réfrigérateur et consommez-le rapidement.",
      },
    },
    {
      key: "wash_raw",
      text: {
        ja: "生で食べる野菜とハーブは、流水でよく洗ってください。",
        en: "Wash raw vegetables and herbs well under running water.",
        es: "Lava bien con agua corriente las verduras y hierbas que se comen crudas.",
        fr: "Lavez bien sous l'eau courante les légumes et les herbes consommés crus.",
      },
    },
  ],
  substitutions: [],
};
