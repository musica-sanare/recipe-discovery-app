import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "harira_boeuf",
  texts: {
    name: { ja: "ハリラ（牛肉とレンズ豆、ひよこ豆のトマトスープ）", en: "Harira (tomato soup with beef, lentils, and chickpeas)", es: "Harira (sopa de tomate con ternera, lentejas y garbanzos)", fr: "Harira au bœuf" },
    summary: {
      ja: "モロッコのスープをヒントに、本来の羊肉の代わりに牛もも肉を使い、レンズ豆、ひよこ豆、トマト、セロリ、ハーブで煮ます。フランスパンを添えます。",
      en: "Inspired by the Moroccan soup, made with lean beef instead of lamb: simmered with lentils, chickpeas, tomato, celery, and herbs. With baguette.",
      es: "Inspirada en la sopa marroquí, con ternera magra en lugar de cordero: cocida con lentejas, garbanzos, tomate, apio y hierbas. Con pan de barra.",
      fr: "Inspirée de la soupe marocaine, préparée avec du bœuf maigre au lieu de l'agneau : mijotée avec des lentilles, des pois chiches, de la tomate, du céleri et des herbes. Avec de la baguette.",
    },
  },
  cuisine: "north_african",
  goals: ["maintain"],
  mainProteinGroup: "beef",
  tags: ["batch"],
  minutes: 50,
  effort: 2,
  equipment: ["stove", "pot"],
  servings: 1,
  ingredients: [
    { key: "beef", food: "beef_round", grams: 100, state: "boil", role: "main_protein", adjust: { kind: "grams", min: 80, max: 140, step: 20 } },
    { key: "salt", food: "salt", grams: 1.2, state: "as_is", measure: { unit: "pinch", quantity: 2.5 }, role: "seasoning", linkedTo: "beef" },
    { key: "olive_oil", food: "olive_oil", grams: 4, state: "as_is", measure: { unit: "tsp", quantity: 1 }, role: "fat" },
    { key: "onion", food: "onion", grams: 50, state: "boil", measure: { unit: "piece", quantity: 0.25 }, role: "vegetable" },
    {
      key: "celery",
      food: "celery",
      grams: 30,
      state: "raw",
      cooking: "simmer",
      measure: { unit: "stalk", quantity: 1 / 3 },
      role: "vegetable",
      note: {
        ja: "成分表に煮込んだセロリの値がないため、生の値で計算しています。",
        en: "The tables have no value for stewed celery, so the raw value is used.",
        es: "Las tablas no tienen un valor para el apio guisado, así que se usa el valor en crudo.",
        fr: "Les tables n'ont pas de valeur pour le céleri mijoté ; la valeur à l'état cru est donc utilisée.",
      },
    },
    { key: "ginger", food: "ginger", grams: 3, state: "raw", measure: { unit: "knob", quantity: 0.25 }, role: "seasoning" },
    {
      key: "paprika",
      food: "paprika_powder",
      grams: 0.5,
      state: "as_is",
      measure: { unit: "pinch", quantity: 2 },
      role: "seasoning",
      note: {
        ja: "成分表にターメリックやクミンがないため、パプリカとしょうがで香りをつけます。",
        en: "The tables have no turmeric or cumin, so paprika and ginger are used.",
        es: "Las tablas no tienen cúrcuma ni comino, así que se usan pimentón y jengibre.",
        fr: "Les tables n'ont ni curcuma ni cumin ; le paprika et le gingembre les remplacent.",
      },
    },
    { key: "tomato_canned", food: "tomato_canned", grams: 150, state: "as_is", measure: { unit: "can", quantity: 1 / 3 }, role: "vegetable" },
    { key: "lentils", food: "lentils", grams: 100, state: "as_is", role: "other" },
    { key: "chickpeas", food: "chickpeas", grams: 60, state: "as_is", role: "other" },
    { key: "flour", food: "wheat_flour", grams: 5, state: "as_is", measure: { unit: "tsp", quantity: 1.5 }, role: "other" },
    { key: "coriander", food: "coriander", grams: 4, state: "raw", role: "vegetable" },
    { key: "parsley", food: "parsley", grams: 4, state: "raw", role: "vegetable" },
    { key: "lemon", food: "lemon_juice", grams: 10, state: "as_is", measure: { unit: "tsp", quantity: 2 }, role: "seasoning" },
    { key: "bread", food: "baguette", grams: 40, state: "as_is", role: "main_carb", adjust: { kind: "grams", min: 40, max: 80, step: 20 } },
  ],
  sides: [{ key: "bread", label: { ja: "フランスパン", en: "Baguette", es: "Pan de barra", fr: "Baguette" }, ingredients: ["bread"], solverMayRemove: true }],
  steps: [
    {
      key: "prep",
      text: {
        ja: "牛もも肉を1.5cm角に切り、塩をまぶします。玉ねぎとセロリはみじん切りにし、しょうがはすりおろします。パクチーとパセリは刻みます。",
        en: "Cut the beef into 1.5 cm cubes and season with the salt. Finely chop the onion and celery and grate the ginger. Chop the coriander and parsley.",
        es: "Corta la ternera en dados de 1,5 cm y sálala. Pica finamente la cebolla y el apio y ralla el jengibre. Pica el cilantro y el perejil.",
        fr: "Coupez le bœuf en dés de 1,5 cm et salez-le. Hachez finement l'oignon et le céleri et râpez le gingembre. Ciselez la coriandre et le persil.",
      },
    },
    {
      key: "brown",
      text: {
        ja: "鍋にオリーブオイルを中火で熱し、牛肉、玉ねぎ、セロリ、しょうが、パプリカパウダーを3分炒めます。",
        en: "Heat the olive oil in a pot over medium heat and stir-fry the beef, onion, celery, ginger, and paprika for 3 minutes.",
        es: "Calienta el aceite de oliva en una olla a fuego medio y saltea la ternera, la cebolla, el apio, el jengibre y el pimentón 3 minutos.",
        fr: "Faites chauffer l'huile d'olive dans une casserole à feu moyen et faites revenir le bœuf, l'oignon, le céleri, le gingembre et le paprika 3 minutes.",
      },
    },
    {
      key: "simmer",
      text: {
        ja: "トマト缶、汁を切ったひよこ豆、水400mlを加えて煮立て、ふたをして弱火で30分煮ます。レンズ豆と半量のハーブを加えて5分煮ます。",
        en: "Add the canned tomatoes, the drained chickpeas, and 400 ml of water, bring to a boil, cover, and cook over low heat for 30 minutes. Add the lentils and half the herbs and cook for 5 minutes.",
        es: "Añade el tomate en lata, los garbanzos escurridos y 400 ml de agua, lleva a ebullición, tapa y cuece a fuego bajo 30 minutos. Añade las lentejas y la mitad de las hierbas y cuece 5 minutos.",
        fr: "Ajoutez les tomates en conserve, les pois chiches égouttés et 400 ml d'eau, portez à ébullition, couvrez et laissez cuire 30 minutes à feu doux. Ajoutez les lentilles et la moitié des herbes et laissez cuire 5 minutes.",
      },
    },
    {
      key: "thicken",
      text: {
        ja: "薄力粉を水大さじ2で溶いて加え、混ぜながら2〜3分煮てとろみをつけます。火を止めてレモン果汁を加え、残りのハーブを散らします。",
        en: "Mix the flour with 2 tablespoons of water, stir it in, and cook for 2 to 3 minutes, stirring, until the soup thickens slightly. Turn off the heat, add the lemon juice, and scatter the rest of the herbs on top.",
        es: "Disuelve la harina en 2 cucharadas de agua, añádela y cuece de 2 a 3 minutos, removiendo, hasta que la sopa espese un poco. Apaga el fuego, añade el zumo de limón y reparte el resto de las hierbas por encima.",
        fr: "Délayez la farine dans 2 cuillères à soupe d'eau, incorporez-la et laissez cuire 2 à 3 minutes en remuant, jusqu'à ce que la soupe épaississe légèrement. Éteignez le feu, ajoutez le jus de citron et parsemez du reste des herbes.",
      },
    },
    { key: "bread", side: "bread", text: { ja: "フランスパンを添えます。", en: "Serve with the baguette.", es: "Acompáñalo con el pan de barra.", fr: "Servez avec la baguette." } },
  ],
  safetyNotes: [
    {
      key: "cooling",
      text: {
        ja: "作り置きする場合は、浅い容器に移して早めに冷まし、冷蔵庫で保存してください。食べるときは中心まで十分に温め直します。",
        en: "To keep leftovers, transfer them to a shallow container, cool them quickly, and refrigerate. Reheat until piping hot throughout before eating.",
        es: "Si guardas sobras, pásalas a un recipiente poco hondo, enfríalas rápido y guárdalas en el refrigerador. Antes de comer, recaliéntalas hasta que estén bien calientes por dentro.",
        fr: "Pour conserver les restes, mettez-les dans un récipient peu profond, faites-les refroidir rapidement et placez-les au réfrigérateur. Avant de les manger, réchauffez-les jusqu'à ce qu'ils soient bien chauds à cœur.",
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
