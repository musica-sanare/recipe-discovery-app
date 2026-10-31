import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "chicken_breast_soup_curry",
  texts: {
    name: { ja: "鶏むね肉と野菜のスープカレー", en: "Chicken breast and vegetable soup curry", es: "Sopa de curri con pechuga de pollo y verduras", fr: "Soupe au curry, blanc de poulet et légumes" },
    summary: {
      ja: "カレー粉で香りをつけたさらっとしたスープで、鶏むね肉とじゃがいも、野菜を煮ます。ご飯を添えます。",
      en: "Chicken breast, potato, and vegetables simmered in a light broth spiced with curry powder, with rice.",
      es: "Pechuga de pollo, patata y verduras cocidas en un caldo ligero especiado con curri en polvo, con arroz.",
      fr: "Blanc de poulet, pomme de terre et légumes mijotés dans un bouillon léger parfumé au curry en poudre, avec du riz.",
    },
  },
  cuisine: "japanese",
  goals: ["maintain"],
  mainProteinGroup: "chicken",
  tags: [],
  minutes: 30,
  effort: 2,
  equipment: ["stove", "pot"],
  servings: 1,
  ingredients: [
    {
      key: "chicken",
      food: "chicken_breast",
      grams: 160,
      state: "raw",
      cooking: "simmer",
      role: "main_protein",
      adjust: { kind: "grams", min: 120, max: 240, step: 20 },
      note: {
        ja: "成分表に煮込んだ鶏むね肉の値がないため、生の値で計算しています。",
        en: "The tables have no value for stewed chicken breast, so the raw value is used.",
        es: "Las tablas no tienen un valor para la pechuga de pollo guisada, así que se usa el valor en crudo.",
        fr: "Les tables n'ont pas de valeur pour le blanc de poulet mijoté ; la valeur à l'état cru est donc utilisée.",
      },
    },
    { key: "oil", food: "vegetable_oil", grams: 4, state: "as_is", measure: { unit: "tsp", quantity: 1 }, role: "fat", linkedTo: "chicken" },
    { key: "curry_powder", food: "curry_powder", grams: 6, state: "as_is", measure: { unit: "tbsp", quantity: 0.5 }, role: "seasoning", linkedTo: "chicken" },
    { key: "potato", food: "potato", grams: 150, state: "simmer", measure: { unit: "piece", quantity: 1 }, role: "vegetable" },
    { key: "carrot", food: "carrot", grams: 40, state: "boil", role: "vegetable" },
    { key: "onion", food: "onion", grams: 60, state: "raw", cooking: "simmer", measure: { unit: "piece", quantity: 0.25 }, role: "vegetable" },
    { key: "broccoli", food: "broccoli", grams: 60, state: "boil", role: "vegetable" },
    { key: "garlic", food: "garlic", grams: 5, state: "raw", measure: { unit: "clove", quantity: 1 }, role: "seasoning" },
    { key: "ginger", food: "ginger", grams: 5, state: "raw", measure: { unit: "knob", quantity: 0.5 }, role: "seasoning" },
    { key: "soy_sauce", food: "soy_sauce", grams: 6, state: "as_is", measure: { unit: "tsp", quantity: 1 }, role: "seasoning" },
    { key: "salt", food: "salt", grams: 1.5, state: "as_is", measure: { unit: "pinch", quantity: 3 }, role: "seasoning" },
    { key: "rice", food: "rice_cooked", grams: 180, state: "as_is", role: "main_carb", adjust: { kind: "grams", min: 100, max: 300, step: 10 } },
  ],
  sides: [
    { key: "rice", label: { ja: "ご飯", en: "Rice", es: "Arroz", fr: "Riz" }, ingredients: ["rice"], solverMayRemove: true },
  ],
  steps: [
    {
      key: "prep",
      text: {
        ja: "鶏むね肉を大きめのひと口大に切ります。じゃがいもは4等分、にんじんは乱切り、玉ねぎはくし形に切り、ブロッコリーは小房に分けます。にんにくとしょうがはすりおろします。",
        en: "Cut the chicken breast into large bite-size pieces. Quarter the potato, cut the carrot into chunks and the onion into wedges, and separate the broccoli into florets. Grate the garlic and ginger.",
        es: "Corta la pechuga de pollo en trozos grandes. Corta la patata en cuartos, la zanahoria en trozos y la cebolla en gajos, y separa el brócoli en ramilletes. Ralla el ajo y el jengibre.",
        fr: "Coupez le blanc de poulet en grosses bouchées. Coupez la pomme de terre en quatre, la carotte en morceaux et l'oignon en quartiers, et détaillez le brocoli en fleurettes. Râpez l'ail et le gingembre.",
      },
    },
    {
      key: "brown",
      text: {
        ja: "鍋に油を中火で熱し、にんにく、しょうが、カレー粉を30秒炒めて香りを出し、鶏肉を加えて表面の色が変わるまで炒めます。",
        en: "Heat the oil in a pot over medium heat, stir-fry the garlic, ginger, and curry powder for 30 seconds until fragrant, then add the chicken and cook until the surface changes color.",
        es: "Calienta el aceite en una olla a fuego medio, sofríe el ajo, el jengibre y el curri 30 segundos hasta que suelten aroma, y añade el pollo hasta que cambie de color por fuera.",
        fr: "Faites chauffer l'huile dans une casserole à feu moyen, faites revenir l'ail, le gingembre et le curry en poudre 30 secondes jusqu'à ce qu'ils embaument, puis ajoutez le poulet et faites-le cuire jusqu'à ce que sa surface change de couleur.",
      },
    },
    {
      key: "simmer",
      text: {
        ja: "水400mL、じゃがいも、にんじん、玉ねぎを加えて煮立て、ふたをして弱火で15分煮ます。ブロッコリーを加えて3分煮て、しょうゆと塩で味を調えます。",
        en: "Add 400 mL of water, the potato, carrot, and onion, bring to a boil, cover, and simmer over low heat for 15 minutes. Add the broccoli, simmer for 3 minutes, and season with soy sauce and salt.",
        es: "Añade 400 mL de agua, la patata, la zanahoria y la cebolla, lleva a ebullición, tapa y cuece a fuego bajo 15 minutos. Agrega el brócoli, cuece 3 minutos y sazona con salsa de soja y sal.",
        fr: "Ajoutez 400 mL d'eau, la pomme de terre, la carotte et l'oignon, portez à ébullition, couvrez et laissez mijoter 15 minutes à feu doux. Ajoutez le brocoli, laissez mijoter 3 minutes et assaisonnez de sauce soja et de sel.",
      },
    },
    {
      key: "serve",
      text: {
        ja: "スープ皿に盛ります。",
        en: "Ladle into a soup bowl.",
        es: "Sírvelo en un plato hondo.",
        fr: "Servez à la louche dans une assiette creuse.",
      },
    },
  ],
  safetyNotes: [
    {
      key: "chicken_doneness",
      text: {
        ja: "鶏肉は中心まで火を通してください。切り口にピンク色が残っていれば、さらに加熱します。",
        en: "Cook chicken through. If any pink remains when you cut it, cook it longer.",
        es: "Cocina bien el pollo. Si queda algo rosado al cortarlo, cocínalo más tiempo.",
        fr: "Faites cuire le poulet à cœur. S'il reste du rose à la découpe, prolongez la cuisson.",
      },
    },
  ],
  substitutions: [],
};
