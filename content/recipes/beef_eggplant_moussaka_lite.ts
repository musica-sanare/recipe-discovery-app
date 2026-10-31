import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "beef_eggplant_moussaka_lite",
  texts: {
    name: { ja: "牛もも肉となすのムサカ風", en: "Moussaka-style beef and eggplant bake", es: "Berenjenas con ternera al estilo musaca", fr: "Gratin de bœuf et d'aubergine façon moussaka" },
    summary: {
      ja: "ギリシャのムサカをヒントに、焼いたなす、じゃがいも、刻んだ牛もも肉のトマト煮を重ね、ヨーグルトと卵白のソースをのせてトースターで焼きます。パンを添えます。",
      en: "Inspired by Greek moussaka: grilled eggplant, potato, and chopped lean beef simmered with tomato, layered and topped with a yogurt and egg white sauce, then baked in a toaster oven. With bread.",
      es: "Inspirado en la musaca griega: berenjena asada, patata y ternera magra picada guisada con tomate, en capas y cubiertas con una salsa de yogur y clara, gratinadas en el horno tostador. Con pan.",
      fr: "Inspiré de la moussaka grecque : aubergine grillée, pomme de terre et bœuf maigre haché mijoté à la tomate, montés en couches et nappés d'une sauce au yaourt et au blanc d'œuf, puis gratinés au four grille-pain. Avec du pain.",
    },
  },
  cuisine: "mediterranean",
  goals: ["maintain"],
  mainProteinGroup: "beef",
  tags: [],
  minutes: 40,
  effort: 3,
  equipment: ["oven_toaster", "stove", "frying_pan", "microwave"],
  servings: 1,
  ingredients: [
    {
      key: "beef",
      food: "beef_round",
      grams: 160,
      state: "raw",
      cooking: "simmer",
      role: "main_protein",
      adjust: { kind: "grams", min: 120, max: 200, step: 20 },
      note: {
        ja: "成分表に煮込んだ牛もも肉の値がないため、生の値で計算しています。",
        en: "The tables have no value for stewed beef round, so the raw value is used.",
        es: "Las tablas no tienen un valor para la ternera de pierna guisada, así que se usa el valor en crudo.",
        fr: "Les tables n'ont pas de valeur pour la tende de tranche de bœuf mijotée ; la valeur à l'état cru est donc utilisée.",
      },
    },
    {
      key: "eggplant",
      food: "eggplant",
      grams: 150,
      state: "raw",
      cooking: "grill",
      measure: { unit: "piece", quantity: 2 },
      role: "vegetable",
      note: {
        ja: "成分表に焼いたなすの値がないため、生の値で計算しています。",
        en: "The tables have no value for grilled eggplant, so the raw value is used.",
        es: "Las tablas no tienen un valor para la berenjena asada, así que se usa el valor en crudo.",
        fr: "Les tables n'ont pas de valeur pour l'aubergine grillée ; la valeur à l'état cru est donc utilisée.",
      },
    },
    { key: "oil", food: "olive_oil", grams: 3, state: "as_is", measure: { unit: "tsp", quantity: 0.75 }, role: "fat" },
    { key: "onion", food: "onion", grams: 50, state: "stir_fry", role: "vegetable" },
    { key: "tomato", food: "tomato_canned", grams: 150, state: "as_is", role: "vegetable" },
    { key: "garlic", food: "garlic", grams: 3, state: "raw", measure: { unit: "clove", quantity: 0.5 }, role: "seasoning" },
    { key: "salt", food: "salt", grams: 1, state: "as_is", measure: { unit: "pinch", quantity: 2 }, role: "seasoning" },
    { key: "yogurt", food: "yogurt_nonfat", grams: 80, state: "as_is", role: "other" },
    {
      key: "egg_white",
      food: "egg_white",
      grams: 50,
      state: "raw",
      cooking: "grill",
      role: "other",
      note: {
        ja: "成分表に焼いた卵白の値がないため、生の値で計算しています。",
        en: "The tables have no value for baked egg white, so the raw value is used.",
        es: "Las tablas no tienen un valor para la clara gratinada, así que se usa el valor en crudo.",
        fr: "Les tables n'ont pas de valeur pour le blanc d'œuf gratiné ; la valeur à l'état cru est donc utilisée.",
      },
    },
    { key: "potato", food: "potato", grams: 200, state: "microwave", measure: { unit: "piece", quantity: 1.5 }, role: "main_carb", adjust: { kind: "grams", min: 150, max: 300, step: 50 } },
    { key: "bread", food: "bread", grams: 60, state: "as_is", measure: { unit: "slice", quantity: 1 }, role: "main_carb", adjust: { kind: "grams", min: 30, max: 90, step: 30 } },
  ],
  sides: [
    { key: "bread", label: { ja: "パン", en: "Bread", es: "Pan", fr: "Pain" }, ingredients: ["bread"], solverMayRemove: true },
  ],
  steps: [
    {
      key: "potato",
      text: {
        ja: "じゃがいもを皮つきのままラップで包み、600Wで4〜5分、竹串がすっと通るまで加熱します。皮をむいて1cm厚さに切ります。",
        en: "Wrap the potato, skin on, in plastic wrap and microwave at 600 W for 4–5 minutes, until a skewer goes in easily. Peel it and slice it 1 cm thick.",
        es: "Envuelve la patata con piel en film y caliéntala a 600 W durante 4-5 minutos, hasta que un palillo entre con facilidad. Pélala y córtala en rodajas de 1 cm.",
        fr: "Enveloppez la pomme de terre non pelée dans du film alimentaire et faites-la cuire 4 à 5 minutes à 600 W, jusqu'à ce qu'une brochette s'y enfonce facilement. Pelez-la et coupez-la en tranches de 1 cm.",
      },
    },
    {
      key: "eggplant",
      text: {
        ja: "なすを1cm厚さの輪切りにし、オリーブ油の半量を塗って、トースターで8分ほど焼きます。",
        en: "Slice the eggplant into 1 cm rounds, brush with half of the olive oil, and cook in the toaster oven for about 8 minutes.",
        es: "Corta la berenjena en rodajas de 1 cm, úntalas con la mitad del aceite de oliva y ásalas en el horno tostador unos 8 minutos.",
        fr: "Coupez l'aubergine en rondelles de 1 cm, badigeonnez-les avec la moitié de l'huile d'olive et faites-les cuire environ 8 minutes au four grille-pain.",
      },
    },
    {
      key: "sauce",
      text: {
        ja: "牛もも肉を包丁で細かく刻みます。フライパンに残りのオリーブ油を中火で熱し、みじん切りの玉ねぎとにんにくを炒め、牛肉を加えてほぐしながら色が完全に変わるまで炒めます。トマト缶と塩を加え、弱めの中火で8分ほど煮詰めます。",
        en: "Finely chop the beef with a knife. Heat the rest of the olive oil in a frying pan over medium heat, sauté the chopped onion and garlic, add the beef, and stir-fry, breaking it up, until it has completely changed color. Add the canned tomatoes and salt and simmer over medium-low heat for about 8 minutes.",
        es: "Pica la ternera a cuchillo. Calienta el resto del aceite de oliva en una sartén a fuego medio, sofríe la cebolla y el ajo picados, añade la ternera y saltéala, deshaciéndola, hasta que cambie de color por completo. Añade el tomate de lata y la sal y cuece a fuego medio-bajo unos 8 minutos.",
        fr: "Hachez finement le bœuf au couteau. Faites chauffer le reste de l'huile d'olive dans une poêle à feu moyen, faites revenir l'oignon et l'ail hachés, ajoutez le bœuf et faites-le sauter en l'émiettant jusqu'à ce qu'il ait complètement changé de couleur. Ajoutez les tomates en conserve et le sel et laissez mijoter environ 8 minutes à feu moyen-doux.",
      },
    },
    {
      key: "layer",
      text: {
        ja: "耐熱皿にじゃがいも、なす、ミートソースの順に重ねます。ヨーグルトと卵白を混ぜて上に広げます。",
        en: "Layer the potato, eggplant, and meat sauce in a heatproof dish. Mix the yogurt and egg white and spread it over the top.",
        es: "Coloca en capas la patata, la berenjena y la salsa de carne en una fuente para horno. Mezcla el yogur y la clara y extiéndelo por encima.",
        fr: "Disposez en couches la pomme de terre, l'aubergine et la sauce à la viande dans un plat allant au four. Mélangez le yaourt et le blanc d'œuf et étalez-le sur le dessus.",
      },
    },
    {
      key: "bake",
      text: {
        ja: "トースターで10〜12分、表面の卵白が固まって焼き色がつくまで焼きます。",
        en: "Bake in the toaster oven for 10–12 minutes, until the egg white topping is set and browned.",
        es: "Gratina en el horno tostador 10-12 minutos, hasta que la cobertura de clara cuaje y se dore.",
        fr: "Faites gratiner 10 à 12 minutes au four grille-pain, jusqu'à ce que la couche de blanc d'œuf soit prise et dorée.",
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
      key: "mince_doneness",
      text: {
        ja: "細かく刻んだ肉は中心まで火を通してください。ピンク色が残らないよう、ほぐしながら炒めます。",
        en: "Cook finely chopped meat through, breaking it up until no pink remains.",
        es: "Cocina bien la carne picada, deshaciéndola hasta que no quede nada rosado.",
        fr: "Faites bien cuire la viande hachée en l'émiettant, jusqu'à ce qu'il ne reste plus de rose.",
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
    {
      key: "hot_dish",
      text: {
        ja: "焼き上がった耐熱皿はとても熱いので、ミトンを使って取り出してください。",
        en: "The baked dish is very hot; use oven gloves to take it out.",
        es: "La fuente sale muy caliente; usa manoplas para sacarla.",
        fr: "Le plat sort très chaud ; utilisez des maniques pour le sortir.",
      },
    },
  ],
  substitutions: [],
};
