import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "pisto_soft_egg",
  texts: {
    name: { ja: "ピストと落とし卵", en: "Pisto with a poached egg", es: "Pisto con huevo escalfado", fr: "Pisto à l'œuf poché" },
    summary: {
      ja: "スペインの野菜の煮込みピストに、卵白と卵を落として煮ます。黄身はやわらかく仕上げます。パンを添えます。",
      en: "Spanish pisto, a stew of summer vegetables, with egg whites and an egg poached in it; the yolk stays soft. With bread.",
      es: "Pisto de verduras con claras y un huevo escalfados en él; la yema queda blanda. Con pan.",
      fr: "Le pisto espagnol, un ragoût de légumes d'été, avec des blancs d'œufs et un œuf pochés dedans ; le jaune reste moelleux. Avec du pain.",
    },
  },
  cuisine: "spanish",
  goals: ["maintain"],
  mainProteinGroup: "egg",
  tags: [],
  minutes: 25,
  effort: 2,
  equipment: ["stove", "frying_pan"],
  servings: 1,
  ingredients: [
    { key: "egg", food: "egg", grams: 50, state: "poach", measure: { unit: "piece", quantity: 1 }, role: "main_protein", adjust: { kind: "count", unitGrams: 50, min: 1, max: 2 } },
    {
      key: "egg_white",
      food: "egg_white",
      grams: 200,
      state: "raw",
      cooking: "poach",
      role: "main_protein",
      adjust: { kind: "grams", min: 150, max: 250, step: 50 },
      note: {
        ja: "成分表に加熱した卵白の値がないため、生の値で計算しています。",
        en: "The tables have no value for cooked egg white, so the raw value is used.",
        es: "Las tablas no tienen un valor para la clara cocinada, así que se usa el valor en crudo.",
        fr: "Les tables n'ont pas de valeur pour le blanc d'œuf cuit ; la valeur à l'état cru est donc utilisée.",
      },
    },
    {
      key: "zucchini",
      food: "zucchini",
      grams: 150,
      state: "raw",
      cooking: "saute",
      measure: { unit: "piece", quantity: 1 },
      role: "vegetable",
      note: {
        ja: "成分表に炒めたズッキーニの値がないため、生の値で計算しています。",
        en: "The tables have no value for sautéed zucchini, so the raw value is used.",
        es: "Las tablas no tienen un valor para el calabacín salteado, así que se usa el valor en crudo.",
        fr: "Les tables n'ont pas de valeur pour la courgette sautée ; la valeur à l'état cru est donc utilisée.",
      },
    },
    { key: "oil", food: "olive_oil", grams: 3, state: "as_is", measure: { unit: "tsp", quantity: 0.75 }, role: "fat" },
    { key: "red_pepper", food: "red_pepper", grams: 60, state: "stir_fry", role: "vegetable" },
    { key: "onion", food: "onion", grams: 60, state: "stir_fry", role: "vegetable" },
    { key: "oil_veg", food: "olive_oil", grams: 6, state: "as_is", measure: { unit: "tsp", quantity: 1.5 }, role: "fat", includedIn: "onion" },
    { key: "tomato", food: "tomato_canned", grams: 150, state: "as_is", role: "vegetable" },
    { key: "salt", food: "salt", grams: 0.5, state: "as_is", measure: { unit: "pinch", quantity: 1 }, role: "seasoning" },
    { key: "bread", food: "bread", grams: 120, state: "as_is", measure: { unit: "slice", quantity: 2 }, role: "main_carb", adjust: { kind: "grams", min: 60, max: 150, step: 30 } },
  ],
  sides: [
    { key: "bread", label: { ja: "パン", en: "Bread", es: "Pan", fr: "Pain" }, ingredients: ["bread"], solverMayRemove: true },
  ],
  steps: [
    {
      key: "prep",
      text: {
        ja: "玉ねぎ、赤ピーマン、ズッキーニを1.5cm角に切ります。",
        en: "Dice the onion, red pepper, and zucchini into 1.5 cm pieces.",
        es: "Corta la cebolla, el pimiento rojo y el calabacín en dados de 1,5 cm.",
        fr: "Coupez l'oignon, le poivron rouge et la courgette en dés de 1,5 cm.",
      },
    },
    {
      key: "pisto",
      text: {
        ja: "フライパンにオリーブ油を中火で熱し、玉ねぎと赤ピーマンを5分炒めます。ズッキーニと残りのオリーブ油を加えて3分炒め、トマト缶と塩を加えて、弱めの中火で8分ほど煮詰めます。",
        en: "Heat the olive oil in a frying pan over medium heat and sauté the onion and red pepper for 5 minutes. Add the zucchini and the rest of the olive oil and sauté for 3 minutes, then add the canned tomatoes and salt and simmer over medium-low heat for about 8 minutes.",
        es: "Calienta el aceite de oliva en una sartén a fuego medio y sofríe la cebolla y el pimiento rojo 5 minutos. Añade el calabacín y el resto del aceite y sofríe 3 minutos; después añade el tomate de lata y la sal y cuece a fuego medio-bajo unos 8 minutos.",
        fr: "Faites chauffer l'huile d'olive dans une poêle à feu moyen et faites revenir l'oignon et le poivron rouge 5 minutes. Ajoutez la courgette et le reste de l'huile d'olive et faites revenir 3 minutes, puis ajoutez les tomates en conserve et le sel, et laissez mijoter environ 8 minutes à feu moyen-doux.",
      },
    },
    {
      key: "eggs",
      text: {
        ja: "ピストにくぼみを作り、卵白を流し入れて卵を割り入れます。ふたをして弱火で4〜5分、白身が固まり、黄身がやわらかいうちに火を止めます。",
        en: "Make a hollow in the pisto, pour in the egg whites, and crack in the egg. Cover and cook over low heat for 4–5 minutes, until the whites are set and the yolk is still soft.",
        es: "Haz un hueco en el pisto, vierte las claras y añade el huevo encima. Tapa y cocina a fuego bajo 4-5 minutos, hasta que las claras cuajen y la yema siga blanda.",
        fr: "Creusez un puits dans le pisto, versez-y les blancs d'œufs et cassez-y l'œuf. Couvrez et faites cuire 4 à 5 minutes à feu doux, jusqu'à ce que les blancs soient pris et que le jaune reste moelleux.",
      },
    },
    {
      key: "bread",
      side: "bread",
      text: { ja: "パンを添えます。", en: "Serve with the bread.", es: "Acompáñalo con el pan.", fr: "Servez avec le pain." },
    },
  ],
  safetyNotes: [
    {
      key: "white_set",
      text: {
        ja: "白身は完全に固まるまで加熱してください。",
        en: "Cook until the egg whites are completely set.",
        es: "Cocina hasta que las claras cuajen por completo.",
        fr: "Faites cuire jusqu'à ce que les blancs d'œufs soient entièrement pris.",
      },
    },
    {
      key: "soft_yolk",
      text: {
        ja: "黄身がやわらかい卵は、妊娠中の方、乳幼児、高齢の方、体調のすぐれない方には向きません。その場合は黄身まで固まるまで加熱してください。",
        en: "Eggs with runny yolks are not recommended for pregnant people, young children, older adults, or anyone unwell; for them, cook until the yolks are firm.",
        es: "Los huevos con la yema líquida no se recomiendan para embarazadas, niños pequeños, personas mayores o enfermas; en esos casos, cocínalos hasta que la yema esté firme.",
        fr: "Les œufs au jaune coulant sont déconseillés aux femmes enceintes, aux jeunes enfants, aux personnes âgées et aux personnes malades ; pour elles, faites cuire jusqu'à ce que les jaunes soient fermes.",
      },
    },
  ],
  substitutions: [],
};
