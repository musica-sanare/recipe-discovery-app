import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "chakchouka",
  texts: {
    name: { ja: "シャクシュカ（パプリカとトマトの落とし卵）", en: "Chakchouka (eggs poached in peppers and tomato)", es: "Chakchouka (huevos escalfados en pimientos y tomate)", fr: "Chakchouka" },
    summary: {
      ja: "チュニジアの朝ごはんをヒントに、パプリカ、ピーマン、トマトのソースに卵白と卵を落として煮ます。黄身はやわらかく仕上げます。フランスパンを添えます。",
      en: "Inspired by a Tunisian breakfast: egg whites and eggs poached in a sauce of red and green peppers and tomato; the yolks stay soft. With baguette.",
      es: "Inspirada en un desayuno tunecino: claras y huevos escalfados en una salsa de pimientos rojos y verdes y tomate; las yemas quedan blandas. Con pan de barra.",
      fr: "Inspirée d'un petit-déjeuner tunisien : des blancs d'œufs et des œufs pochés dans une sauce aux poivrons rouges et verts et à la tomate ; les jaunes restent coulants. Avec de la baguette.",
    },
  },
  cuisine: "north_african",
  goals: ["maintain"],
  mainProteinGroup: "egg",
  tags: ["breakfast"],
  minutes: 20,
  effort: 1,
  equipment: ["stove", "frying_pan"],
  servings: 1,
  ingredients: [
    { key: "egg", food: "egg", grams: 100, state: "poach", measure: { unit: "piece", quantity: 2 }, role: "main_protein", adjust: { kind: "count", unitGrams: 50, min: 2, max: 3 } },
    {
      key: "egg_white",
      food: "egg_white",
      grams: 100,
      state: "raw",
      cooking: "poach",
      role: "main_protein",
      adjust: { kind: "grams", min: 50, max: 150, step: 50 },
      note: {
        ja: "成分表に加熱した卵白の値がないため、生の値で計算しています。",
        en: "The tables have no value for cooked egg white, so the raw value is used.",
        es: "Las tablas no tienen un valor para la clara cocinada, así que se usa el valor en crudo.",
        fr: "Les tables n'ont pas de valeur pour le blanc d'œuf cuit ; la valeur à l'état cru est donc utilisée.",
      },
    },
    { key: "red_pepper", food: "red_pepper", grams: 70, state: "stir_fry", measure: { unit: "piece", quantity: 0.5 }, role: "vegetable" },
    { key: "green_pepper", food: "green_pepper", grams: 50, state: "stir_fry", measure: { unit: "piece", quantity: 1.5 }, role: "vegetable" },
    { key: "onion", food: "onion", grams: 50, state: "stir_fry", measure: { unit: "piece", quantity: 0.25 }, role: "vegetable" },
    { key: "olive_oil", food: "olive_oil", grams: 5, state: "as_is", measure: { unit: "tsp", quantity: 1.25 }, role: "fat", includedIn: "red_pepper" },
    { key: "garlic", food: "garlic", grams: 5, state: "raw", measure: { unit: "clove", quantity: 1 }, role: "seasoning" },
    { key: "tomato_canned", food: "tomato_canned", grams: 150, state: "as_is", measure: { unit: "can", quantity: 1 / 3 }, role: "vegetable" },
    {
      key: "paprika",
      food: "paprika_powder",
      grams: 1,
      state: "as_is",
      measure: { unit: "tsp", quantity: 0.5 },
      role: "seasoning",
      note: {
        ja: "成分表にハリッサやクミンがないため、パプリカと一味唐辛子で香りと辛みをつけます。",
        en: "The tables have no harissa or cumin, so paprika and ground chili pepper are used.",
        es: "Las tablas no tienen harissa ni comino, así que se usan pimentón y guindilla molida.",
        fr: "Les tables n'ont ni harissa ni cumin ; le paprika et le piment rouge moulu les remplacent.",
      },
    },
    { key: "chili", food: "chili_pepper_powder", grams: 0.3, state: "as_is", measure: { unit: "pinch", quantity: 1 }, role: "seasoning" },
    { key: "salt", food: "salt", grams: 1, state: "as_is", measure: { unit: "pinch", quantity: 2 }, role: "seasoning" },
    { key: "coriander", food: "coriander", grams: 2, state: "raw", role: "vegetable" },
    { key: "bread", food: "baguette", grams: 60, state: "as_is", role: "main_carb", adjust: { kind: "grams", min: 40, max: 100, step: 20 } },
  ],
  sides: [{ key: "bread", label: { ja: "フランスパン", en: "Baguette", es: "Pan de barra", fr: "Baguette" }, ingredients: ["bread"], solverMayRemove: true }],
  steps: [
    {
      key: "prep",
      text: {
        ja: "パプリカとピーマンは細切り、玉ねぎは薄切りにし、にんにくはみじん切りにします。",
        en: "Slice the red and green peppers into strips, thinly slice the onion, and chop the garlic.",
        es: "Corta los pimientos rojos y verdes en tiras, la cebolla en láminas finas y pica el ajo.",
        fr: "Taillez les poivrons rouges et verts en lanières, émincez finement l'oignon et hachez l'ail.",
      },
    },
    {
      key: "sauce",
      text: {
        ja: "フライパンにオリーブオイルを中火で熱し、玉ねぎ、パプリカ、ピーマン、にんにくを5分炒めます。トマト缶、パプリカパウダー、一味唐辛子、塩を加え、5分煮詰めます。",
        en: "Heat the olive oil in a frying pan over medium heat and stir-fry the onion, peppers, and garlic for 5 minutes. Add the canned tomatoes, paprika, ground chili pepper, and salt and cook down for 5 minutes.",
        es: "Calienta el aceite de oliva en una sartén a fuego medio y saltea la cebolla, los pimientos y el ajo 5 minutos. Añade el tomate en lata, el pimentón, la guindilla molida y la sal y deja reducir 5 minutos.",
        fr: "Faites chauffer l'huile d'olive dans une poêle à feu moyen et faites revenir l'oignon, les poivrons et l'ail 5 minutes. Ajoutez les tomates en conserve, le paprika, le piment moulu et le sel et laissez réduire 5 minutes.",
      },
    },
    {
      key: "eggs",
      text: {
        ja: "ソースに卵白を回し入れ、くぼみを作って卵を割り入れ、ふたをして弱火で5〜6分、白身が固まるまで煮ます。刻んだパクチーを散らします。",
        en: "Pour the egg whites over the sauce, make hollows, and crack the eggs into them. Cover and cook over low heat for 5 to 6 minutes, until the whites are set. Sprinkle with the chopped coriander.",
        es: "Vierte las claras sobre la salsa, haz huecos y casca los huevos en ellos. Tapa y cocina a fuego bajo de 5 a 6 minutos, hasta que las claras cuajen. Espolvorea con el cilantro picado.",
        fr: "Versez les blancs d'œufs sur la sauce, creusez des puits et cassez-y les œufs. Couvrez et faites cuire 5 à 6 minutes à feu doux, jusqu'à ce que les blancs soient pris. Parsemez de coriandre ciselée.",
      },
    },
    { key: "bread", side: "bread", text: { ja: "フランスパンを添えます。", en: "Serve with the baguette.", es: "Acompáñalo con el pan de barra.", fr: "Servez avec la baguette." } },
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
