import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "carbonnade_flamande",
  texts: {
    name: { ja: "カルボナード・フラマンド（牛赤身肉のビール煮込み）", en: "Carbonnade flamande (lean beef braised in beer)", es: "Carbonnade flamande (ternera magra guisada en cerveza)", fr: "Carbonnade flamande" },
    summary: {
      ja: "ベルギー・フランドル地方の煮込みをヒントに、牛もも肉と炒めた玉ねぎをビールとマスタードでじっくり煮ます。ゆでたじゃがいもを添えます。",
      en: "Inspired by the Flemish stew of Belgium: lean beef and sautéed onions braised slowly in beer with mustard, with boiled potatoes.",
      es: "Inspirado en el guiso flamenco de Bélgica: ternera magra y cebolla rehogada guisadas despacio en cerveza con mostaza, con patatas cocidas.",
      fr: "Inspirée du plat mijoté flamand de Belgique : bœuf maigre et oignons revenus, cuits longuement dans la bière avec de la moutarde, avec des pommes de terre à l'eau.",
    },
  },
  cuisine: "western",
  goals: ["maintain"],
  mainProteinGroup: "beef",
  tags: ["batch"],
  minutes: 100,
  effort: 2,
  equipment: ["stove", "pot"],
  servings: 1,
  ingredients: [
    { key: "beef", food: "beef_round", grams: 150, state: "boil", role: "main_protein", adjust: { kind: "grams", min: 110, max: 190, step: 20 } },
    { key: "salt", food: "salt", grams: 1.2, state: "as_is", measure: { unit: "pinch", quantity: 2.5 }, role: "seasoning", linkedTo: "beef" },
    { key: "pepper", food: "black_pepper", grams: 0.2, state: "as_is", measure: { unit: "pinch", quantity: 1 }, role: "seasoning", linkedTo: "beef" },
    { key: "oil_beef", food: "vegetable_oil", grams: 3, state: "as_is", measure: { unit: "tsp", quantity: 0.75 }, role: "fat" },
    { key: "onion", food: "onion", grams: 100, state: "stir_fry", measure: { unit: "piece", quantity: 0.5 }, role: "vegetable" },
    { key: "oil_onion", food: "vegetable_oil", grams: 3, state: "as_is", measure: { unit: "tsp", quantity: 0.75 }, role: "fat", includedIn: "onion" },
    { key: "beer", food: "beer", grams: 150, state: "as_is", role: "other" },
    { key: "mustard", food: "dijon_mustard", grams: 8, state: "as_is", measure: { unit: "tsp", quantity: 1.5 }, role: "seasoning" },
    { key: "sugar", food: "sugar", grams: 3, state: "as_is", measure: { unit: "tsp", quantity: 1 }, role: "seasoning" },
    { key: "vinegar", food: "wine_vinegar", grams: 5, state: "as_is", measure: { unit: "tsp", quantity: 1 }, role: "seasoning" },
    { key: "thyme", food: "thyme", grams: 0.3, state: "as_is", measure: { unit: "pinch", quantity: 1 }, role: "seasoning" },
    { key: "potato", food: "potato", grams: 200, state: "simmer", measure: { unit: "piece", quantity: 1.5 }, role: "main_carb", adjust: { kind: "grams", min: 150, max: 250, step: 50 } },
    { key: "parsley", food: "parsley", grams: 2, state: "raw", role: "vegetable" },
  ],
  sides: [{ key: "potato", label: { ja: "ゆでたじゃがいも", en: "Boiled potatoes", es: "Patatas cocidas", fr: "Pommes de terre à l'eau" }, ingredients: ["potato"], solverMayRemove: true }],
  steps: [
    {
      key: "prep",
      text: {
        ja: "牛もも肉を3cm角に切り、塩とこしょうをまぶします。玉ねぎは薄切りにします。",
        en: "Cut the beef into 3 cm cubes and season with the salt and pepper. Thinly slice the onion.",
        es: "Corta la ternera en dados de 3 cm y salpimiéntala. Corta la cebolla en láminas finas.",
        fr: "Coupez le bœuf en cubes de 3 cm, salez et poivrez. Émincez finement l'oignon.",
      },
    },
    {
      key: "brown",
      text: {
        ja: "鍋に牛肉用の油を強めの中火で熱し、牛肉の表面を焼いて取り出します。玉ねぎ用の油を足し、玉ねぎを中火で10分、色づくまで炒めます。",
        en: "Heat the oil for the beef in a pot over medium-high heat, brown the beef on all sides, and set it aside. Add the oil for the onion and stir-fry the onion over medium heat for 10 minutes, until golden.",
        es: "Calienta en una olla el aceite para la ternera a fuego medio-alto, dora la carne por todos lados y retírala. Añade el aceite para la cebolla y rehoga la cebolla a fuego medio 10 minutos, hasta que se dore.",
        fr: "Faites chauffer l'huile pour le bœuf dans une cocotte à feu moyen-vif, faites dorer la viande sur toutes les faces et réservez-la. Ajoutez l'huile pour l'oignon et faites revenir l'oignon 10 minutes à feu moyen, jusqu'à ce qu'il soit doré.",
      },
    },
    {
      key: "braise",
      text: {
        ja: "牛肉を戻し、ビール、マスタード、砂糖、タイムを加えて煮立てます。ふたをして弱火で70〜80分、肉がやわらかくなるまで煮込みます。途中で水分が少なくなったら水を足します。",
        en: "Return the beef, add the beer, mustard, sugar, and thyme, and bring to a boil. Cover and cook over low heat for 70 to 80 minutes, until the beef is tender. Add a little water if it gets dry.",
        es: "Vuelve a poner la carne, añade la cerveza, la mostaza, el azúcar y el tomillo y lleva a ebullición. Tapa y cuece a fuego bajo de 70 a 80 minutos, hasta que la carne esté tierna. Añade un poco de agua si se seca.",
        fr: "Remettez la viande, ajoutez la bière, la moutarde, le sucre et le thym et portez à ébullition. Couvrez et laissez cuire 70 à 80 minutes à feu doux, jusqu'à ce que la viande soit tendre. Ajoutez un peu d'eau si nécessaire.",
      },
    },
    {
      key: "finish",
      text: {
        ja: "ぶどう酢を加えて味を調え、刻んだパセリを散らします。",
        en: "Stir in the vinegar to finish and sprinkle with the chopped parsley.",
        es: "Añade el vinagre para terminar y espolvorea con el perejil picado.",
        fr: "Ajoutez le vinaigre pour finir et parsemez de persil haché.",
      },
    },
    {
      key: "potato",
      side: "potato",
      text: {
        ja: "煮込んでいる間に、じゃがいもの皮をむいて4等分にし、水からやわらかくなるまで15分ほどゆでて添えます。",
        en: "While the beef braises, peel the potatoes, cut them into quarters, and boil them from cold water for about 15 minutes, until tender. Serve alongside.",
        es: "Mientras se guisa la carne, pela las patatas, córtalas en cuartos y cuécelas partiendo de agua fría unos 15 minutos, hasta que estén tiernas. Sírvelas al lado.",
        fr: "Pendant la cuisson de la viande, pelez les pommes de terre, coupez-les en quatre et faites-les cuire environ 15 minutes en partant d'eau froide, jusqu'à ce qu'elles soient tendres. Servez à côté.",
      },
    },
  ],
  safetyNotes: [
    {
      key: "alcohol",
      text: {
        ja: "煮込んでも、ビールのアルコールは一部残ることがあります。",
        en: "Some of the alcohol in the beer may remain after braising.",
        es: "Parte del alcohol de la cerveza puede quedar después de guisar.",
        fr: "Une partie de l'alcool de la bière peut subsister après la cuisson.",
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
