import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "hachis_parmentier",
  texts: {
    name: { ja: "アッシ・パルマンティエ（刻んだ牛肉とマッシュポテトの重ね焼き）", en: "Hachis parmentier (chopped beef and mashed potato bake)", es: "Hachis parmentier (gratinado de ternera picada a cuchillo y puré de patata)", fr: "Hachis parmentier" },
    summary: {
      ja: "フランスの家庭料理をヒントに、ゆでた牛もも肉を細かく刻んでにんじんとトマトで煮詰め、マッシュポテトとエメンタールチーズをのせてトースターで焼きます。",
      en: "Inspired by French home cooking: boiled lean beef, finely chopped and cooked down with carrot and tomato, topped with mashed potato and Emmental and browned in a toaster oven.",
      es: "Inspirado en la cocina casera francesa: ternera magra cocida, picada a cuchillo y reducida con zanahoria y tomate, cubierta de puré de patata y emmental y gratinada en el horno tostador.",
      fr: "Inspiré de la cuisine familiale : bœuf maigre bouilli, haché au couteau et mijoté avec carotte et tomate, recouvert de purée de pommes de terre et d'emmental, puis gratiné au four grille-pain.",
    },
  },
  cuisine: "french",
  goals: ["maintain"],
  mainProteinGroup: "beef",
  tags: ["batch"],
  minutes: 60,
  effort: 3,
  equipment: ["stove", "pot", "frying_pan", "oven_toaster"],
  servings: 1,
  ingredients: [
    { key: "beef", food: "beef_round", grams: 200, state: "boil", role: "main_protein", adjust: { kind: "grams", min: 160, max: 240, step: 20 } },
    { key: "salt_beef", food: "salt", grams: 0.8, state: "as_is", measure: { unit: "pinch", quantity: 1.5 }, role: "seasoning", linkedTo: "beef" },
    { key: "pepper", food: "black_pepper", grams: 0.2, state: "as_is", measure: { unit: "pinch", quantity: 1 }, role: "seasoning", linkedTo: "beef" },
    { key: "onion", food: "onion", grams: 50, state: "stir_fry", measure: { unit: "piece", quantity: 0.25 }, role: "vegetable" },
    { key: "oil_onion", food: "vegetable_oil", grams: 3, state: "as_is", measure: { unit: "tsp", quantity: 0.75 }, role: "fat", includedIn: "onion" },
    { key: "carrot", food: "carrot", grams: 40, state: "boil", role: "vegetable" },
    { key: "tomato_paste", food: "tomato_paste", grams: 10, state: "as_is", measure: { unit: "tbsp", quantity: 0.5 }, role: "seasoning" },
    { key: "thyme", food: "thyme", grams: 0.2, state: "as_is", measure: { unit: "pinch", quantity: 1 }, role: "seasoning" },
    { key: "potato", food: "potato", grams: 300, state: "simmer", measure: { unit: "piece", quantity: 2.5 }, role: "main_carb", adjust: { kind: "grams", min: 200, max: 400, step: 50 } },
    { key: "milk", food: "milk", grams: 50, state: "as_is", role: "other", linkedTo: "potato" },
    { key: "salt_potato", food: "salt", grams: 0.5, state: "as_is", measure: { unit: "pinch", quantity: 1 }, role: "seasoning", linkedTo: "potato" },
    { key: "cheese", food: "emmental", grams: 15, state: "as_is", role: "other" },
  ],
  sides: [],
  steps: [
    {
      key: "beef",
      text: {
        ja: "鍋に湯を沸かし、牛もも肉をかたまりのまま入れて弱めの中火で25分ゆでます。取り出して少し冷まし、包丁で細かく刻みます。",
        en: "Bring a pot of water to a boil, add the beef in one piece, and simmer over medium-low heat for 25 minutes. Take it out, let it cool a little, and chop it finely with a knife.",
        es: "Lleva a ebullición una olla de agua, añade la ternera en una pieza y cuécela a fuego medio-bajo 25 minutos. Sácala, deja que se temple y pícala finamente a cuchillo.",
        fr: "Portez une casserole d'eau à ébullition, ajoutez le bœuf en un seul morceau et laissez frémir 25 minutes à feu moyen-doux. Sortez-le, laissez-le tiédir et hachez-le finement au couteau.",
      },
    },
    {
      key: "potato",
      text: {
        ja: "じゃがいもは皮をむいて4等分にし、鍋に入れてかぶるくらいの水でやわらかくなるまで15分ほどゆでます。湯を捨て、つぶして牛乳と塩を混ぜます。",
        en: "Peel the potatoes, cut them into quarters, and boil them in a pot with water to cover for about 15 minutes, until tender. Drain, mash, and stir in the milk and salt.",
        es: "Pela las patatas, córtalas en cuartos y cuécelas en una olla cubiertas de agua unos 15 minutos, hasta que estén tiernas. Escúrrelas, cháfalas y mézclalas con la leche y la sal.",
        fr: "Pelez les pommes de terre, coupez-les en quatre et faites-les cuire environ 15 minutes dans une casserole d'eau à hauteur, jusqu'à ce qu'elles soient tendres. Égouttez, écrasez et incorporez le lait et le sel.",
      },
    },
    {
      key: "filling",
      text: {
        ja: "玉ねぎとにんじんをみじん切りにします。フライパンに油を中火で熱し、玉ねぎを3分炒めます。刻んだ牛肉を加えて混ぜ、塩、こしょうをふります。",
        en: "Finely chop the onion and carrot. Heat the oil in a frying pan over medium heat and stir-fry the onion for 3 minutes. Add the chopped beef, mix, and season with the salt and pepper.",
        es: "Pica finamente la cebolla y la zanahoria. Calienta el aceite en una sartén a fuego medio y saltea la cebolla 3 minutos. Añade la ternera picada, mezcla y salpimienta.",
        fr: "Hachez finement l'oignon et la carotte. Faites chauffer l'huile dans une poêle à feu moyen et faites revenir l'oignon 3 minutes. Ajoutez le bœuf haché, mélangez, salez et poivrez.",
      },
    },
    {
      key: "simmer",
      text: {
        ja: "にんじん、トマトペースト、タイム、水50mlを加え、水分がほぼなくなるまで弱めの中火で6〜8分煮ます。",
        en: "Add the carrot, tomato paste, thyme, and 50 ml of water and simmer over medium-low heat for 6 to 8 minutes, until the liquid has almost gone.",
        es: "Añade la zanahoria, el concentrado de tomate, el tomillo y 50 ml de agua y cuece a fuego medio-bajo de 6 a 8 minutos, hasta que casi no quede líquido.",
        fr: "Ajoutez la carotte, le concentré de tomate, le thym et 50 ml d'eau et laissez mijoter 6 à 8 minutes à feu moyen-doux, jusqu'à ce que le liquide ait presque disparu.",
      },
    },
    {
      key: "bake",
      text: {
        ja: "耐熱皿にひき肉を敷き、マッシュポテトを広げてチーズを散らします。トースターで8〜10分、焼き色がつくまで焼きます。",
        en: "Spread the beef in an ovenproof dish, cover with the mashed potato, and scatter the cheese on top. Bake in a toaster oven for 8 to 10 minutes, until golden.",
        es: "Extiende la carne en una fuente apta para horno, cúbrela con el puré y reparte el queso por encima. Hornéala en el horno tostador de 8 a 10 minutos, hasta que se dore.",
        fr: "Étalez le bœuf dans un plat allant au four, recouvrez de purée et parsemez de fromage. Faites gratiner 8 à 10 minutes au four grille-pain, jusqu'à ce que le dessus soit doré.",
      },
    },
  ],
  safetyNotes: [
    {
      key: "hot_dish",
      text: {
        ja: "焼き上がった耐熱皿はとても熱いので、ミトンを使って取り出してください。",
        en: "The baked dish is very hot; use oven gloves to take it out.",
        es: "La fuente sale muy caliente; usa manoplas para sacarla.",
        fr: "Le plat sort très chaud ; utilisez des maniques pour le sortir.",
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
