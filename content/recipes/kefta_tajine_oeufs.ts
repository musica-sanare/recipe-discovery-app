import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "kefta_tajine_oeufs",
  texts: {
    name: { ja: "ケフタのタジン（牛赤身のミートボールと落とし卵）", en: "Kefta tagine (lean beef meatballs with eggs)", es: "Tajín de kefta (albóndigas de ternera magra con huevos)", fr: "Tajine de kefta aux œufs" },
    summary: {
      ja: "モロッコの煮込みをヒントに、牛もも肉をひいて作るミートボールをトマトソースで煮て、卵を落とします。黄身はやわらかく仕上げます。フランスパンを添えます。",
      en: "Inspired by the Moroccan dish: meatballs of freshly ground lean beef simmered in tomato sauce with eggs poached on top; the yolks stay soft. With baguette.",
      es: "Inspirado en el plato marroquí: albóndigas de ternera magra recién picada guisadas en salsa de tomate con huevos escalfados encima; las yemas quedan blandas. Con pan de barra.",
      fr: "Inspiré du plat marocain : boulettes de bœuf maigre haché à la maison, mijotées dans une sauce tomate avec des œufs pochés dessus ; les jaunes restent coulants. Avec de la baguette.",
    },
  },
  cuisine: "north_african",
  goals: ["bulk"],
  mainProteinGroup: "beef",
  tags: [],
  minutes: 35,
  effort: 2,
  equipment: ["stove", "frying_pan"],
  servings: 1,
  ingredients: [
    {
      key: "beef",
      food: "beef_round",
      grams: 160,
      state: "boil",
      role: "main_protein",
      adjust: { kind: "grams", min: 120, max: 200, step: 20 },
      note: {
        ja: "牛もも肉をフードプロセッサーか包丁でひいて使います。煮込んだ値は、ゆでた牛もも肉の値です。",
        en: "Grind the lean beef in a food processor or chop it finely with a knife. The simmered meatballs use the value of boiled lean beef.",
        es: "Pica la ternera magra con una picadora o muy fina con un cuchillo. Las albóndigas guisadas usan el valor de la ternera magra hervida.",
        fr: "Hachez le bœuf maigre au robot ou finement au couteau. Les boulettes mijotées utilisent la valeur du bœuf maigre bouilli.",
      },
    },
    { key: "salt", food: "salt", grams: 1.2, state: "as_is", measure: { unit: "pinch", quantity: 2.5 }, role: "seasoning", linkedTo: "beef" },
    { key: "egg", food: "egg", grams: 100, state: "poach", measure: { unit: "piece", quantity: 2 }, role: "main_protein", adjust: { kind: "count", unitGrams: 50, min: 1, max: 2 } },
    { key: "olive_oil", food: "olive_oil", grams: 5, state: "as_is", measure: { unit: "tsp", quantity: 1.25 }, role: "fat" },
    { key: "onion", food: "onion", grams: 50, state: "boil", measure: { unit: "piece", quantity: 0.25 }, role: "vegetable" },
    { key: "garlic", food: "garlic", grams: 5, state: "raw", measure: { unit: "clove", quantity: 1 }, role: "seasoning" },
    { key: "tomato_canned", food: "tomato_canned", grams: 200, state: "as_is", measure: { unit: "can", quantity: 0.5 }, role: "vegetable" },
    {
      key: "paprika",
      food: "paprika_powder",
      grams: 1,
      state: "as_is",
      measure: { unit: "tsp", quantity: 0.5 },
      role: "seasoning",
      note: {
        ja: "成分表にクミンがないため、パプリカと一味唐辛子で香りをつけます。",
        en: "The tables have no cumin, so paprika and ground chili pepper are used.",
        es: "Las tablas no tienen comino, así que se usan pimentón y guindilla molida.",
        fr: "Les tables n'ont pas de cumin ; le paprika et le piment rouge moulu le remplacent.",
      },
    },
    { key: "chili", food: "chili_pepper_powder", grams: 0.2, state: "as_is", measure: { unit: "pinch", quantity: 1 }, role: "seasoning" },
    { key: "parsley", food: "parsley", grams: 3, state: "raw", role: "vegetable" },
    { key: "coriander", food: "coriander", grams: 3, state: "raw", role: "vegetable" },
    { key: "bread", food: "baguette", grams: 80, state: "as_is", role: "main_carb", adjust: { kind: "grams", min: 40, max: 120, step: 40 } },
  ],
  sides: [{ key: "bread", label: { ja: "フランスパン", en: "Baguette", es: "Pan de barra", fr: "Baguette" }, ingredients: ["bread"], solverMayRemove: true }],
  steps: [
    {
      key: "kefta",
      text: {
        ja: "牛もも肉をひき、塩、半量のパプリカパウダー、刻んだパセリとパクチーの半量を混ぜて、直径3cmに丸めます。",
        en: "Grind the beef and mix it with the salt, half the paprika, and half the chopped parsley and coriander. Shape into 3 cm balls.",
        es: "Pica la ternera y mézclala con la sal, la mitad del pimentón y la mitad del perejil y el cilantro picados. Forma bolas de 3 cm.",
        fr: "Hachez le bœuf et mélangez-le avec le sel, la moitié du paprika et la moitié du persil et de la coriandre ciselés. Formez des boulettes de 3 cm.",
      },
    },
    {
      key: "sauce",
      text: {
        ja: "フライパンにオリーブオイルを中火で熱し、みじん切りの玉ねぎとにんにくを2分炒めます。トマト缶、残りのパプリカパウダー、一味唐辛子、水50mlを加えて煮立てます。",
        en: "Heat the olive oil in a frying pan over medium heat and stir-fry the chopped onion and garlic for 2 minutes. Add the canned tomatoes, the rest of the paprika, the ground chili pepper, and 50 ml of water and bring to a boil.",
        es: "Calienta el aceite de oliva en una sartén a fuego medio y saltea la cebolla y el ajo picados 2 minutos. Añade el tomate en lata, el resto del pimentón, la guindilla molida y 50 ml de agua y lleva a ebullición.",
        fr: "Faites chauffer l'huile d'olive dans une poêle à feu moyen et faites revenir l'oignon et l'ail hachés 2 minutes. Ajoutez les tomates en conserve, le reste du paprika, le piment moulu et 50 ml d'eau et portez à ébullition.",
      },
    },
    {
      key: "simmer",
      text: {
        ja: "ミートボールを並べ入れ、ふたをして弱めの中火で12分、途中で転がしながら煮ます。",
        en: "Add the meatballs in one layer, cover, and simmer over medium-low heat for 12 minutes, turning them once or twice.",
        es: "Coloca las albóndigas en una sola capa, tapa y cuece a fuego medio-bajo 12 minutos, dándoles la vuelta una o dos veces.",
        fr: "Disposez les boulettes en une seule couche, couvrez et laissez mijoter 12 minutes à feu moyen-doux en les retournant une ou deux fois.",
      },
    },
    {
      key: "eggs",
      text: {
        ja: "すき間に卵を割り入れ、ふたをして弱火で5〜6分、白身が固まるまで煮ます。残りのハーブを散らします。",
        en: "Crack the eggs into the gaps, cover, and cook over low heat for 5 to 6 minutes, until the whites are set. Scatter the rest of the herbs on top.",
        es: "Casca los huevos en los huecos, tapa y cocina a fuego bajo de 5 a 6 minutos, hasta que las claras cuajen. Reparte el resto de las hierbas por encima.",
        fr: "Cassez les œufs dans les espaces libres, couvrez et laissez cuire 5 à 6 minutes à feu doux, jusqu'à ce que les blancs soient pris. Parsemez du reste des herbes.",
      },
    },
    { key: "bread", side: "bread", text: { ja: "フランスパンを添えます。", en: "Serve with the baguette.", es: "Acompáñalo con el pan de barra.", fr: "Servez avec la baguette." } },
  ],
  safetyNotes: [
    {
      key: "meatball_doneness",
      text: {
        ja: "ミートボールは中心まで火を通してください。1個を半分に切り、中にピンク色が残っていないことを確かめます。",
        en: "Cook the meatballs through. Cut one in half and check that no pink remains inside.",
        es: "Cocina bien las albóndigas. Corta una por la mitad y comprueba que no quede nada rosado por dentro.",
        fr: "Faites cuire les boulettes à cœur. Coupez-en une en deux et vérifiez qu'il ne reste plus de rose à l'intérieur.",
      },
    },
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
