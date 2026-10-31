import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "lentil_sasami_soup",
  texts: {
    name: { ja: "レンズ豆とささみのトマトスープ", en: "Lentil and chicken tenderloin tomato soup", es: "Sopa de lentejas y solomillo de pollo con tomate", fr: "Soupe de lentilles à la tomate et aux aiguillettes de poulet" },
    summary: {
      ja: "地中海地方のレンズ豆のスープをヒントに、レンズ豆、ささみ、野菜をトマトで煮て、レモンで仕上げます。パンを添えます。作り置きできます。",
      en: "Inspired by Mediterranean lentil soups: lentils, chicken tenderloin, and vegetables simmered with tomato and finished with lemon, with bread. It keeps well.",
      es: "Inspirado en las sopas de lentejas del Mediterráneo: lentejas, solomillo de pollo y verduras cocidos con tomate y terminados con limón, con pan. Se puede preparar por adelantado.",
      fr: "Inspirée des soupes de lentilles méditerranéennes : lentilles, aiguillettes de poulet et légumes mijotés à la tomate et relevés de citron, avec du pain. La soupe se conserve bien.",
    },
  },
  cuisine: "mediterranean",
  goals: ["maintain"],
  mainProteinGroup: "chicken",
  tags: ["batch"],
  minutes: 30,
  effort: 2,
  equipment: ["stove", "pot"],
  servings: 1,
  ingredients: [
    { key: "sasami", food: "chicken_sasami", grams: 120, state: "boil", measure: { unit: "piece", quantity: 2 }, role: "main_protein", adjust: { kind: "grams", min: 100, max: 160, step: 20 } },
    { key: "lentils", food: "lentils", grams: 100, state: "as_is", role: "other" },
    {
      key: "onion",
      food: "onion",
      grams: 50,
      state: "raw",
      cooking: "simmer",
      role: "vegetable",
      note: {
        ja: "成分表に煮込んだ玉ねぎの値がないため、生の値で計算しています。",
        en: "The tables have no value for stewed onion, so the raw value is used.",
        es: "Las tablas no tienen un valor para la cebolla guisada, así que se usa el valor en crudo.",
        fr: "Les tables n'ont pas de valeur pour l'oignon mijoté ; la valeur à l'état cru est donc utilisée.",
      },
    },
    {
      key: "carrot",
      food: "carrot",
      grams: 40,
      state: "raw",
      cooking: "simmer",
      role: "vegetable",
      note: {
        ja: "成分表に煮込んだにんじんの値がないため、生の値で計算しています。",
        en: "The tables have no value for stewed carrot, so the raw value is used.",
        es: "Las tablas no tienen un valor para la zanahoria guisada, así que se usa el valor en crudo.",
        fr: "Les tables n'ont pas de valeur pour la carotte mijotée ; la valeur à l'état cru est donc utilisée.",
      },
    },
    { key: "tomato", food: "tomato_canned", grams: 100, state: "as_is", measure: { unit: "can", quantity: 0.25 }, role: "vegetable" },
    { key: "garlic", food: "garlic", grams: 3, state: "raw", measure: { unit: "clove", quantity: 0.5 }, role: "seasoning" },
    { key: "oil", food: "olive_oil", grams: 5, state: "as_is", measure: { unit: "tsp", quantity: 1.25 }, role: "fat" },
    { key: "paprika", food: "paprika_powder", grams: 1, state: "as_is", measure: { unit: "tsp", quantity: 0.5 }, role: "seasoning" },
    { key: "salt", food: "salt", grams: 1.5, state: "as_is", measure: { unit: "pinch", quantity: 3 }, role: "seasoning" },
    { key: "lemon", food: "lemon_juice", grams: 8, state: "as_is", role: "seasoning" },
    { key: "parsley", food: "parsley", grams: 3, state: "raw", role: "seasoning" },
    { key: "bread", food: "bread", grams: 90, state: "as_is", measure: { unit: "slice", quantity: 1.5 }, role: "main_carb", adjust: { kind: "grams", min: 60, max: 120, step: 30 } },
  ],
  sides: [
    { key: "bread", label: { ja: "パン", en: "Bread", es: "Pan", fr: "Pain" }, ingredients: ["bread"], solverMayRemove: true },
  ],
  steps: [
    {
      key: "prep",
      text: {
        ja: "玉ねぎとにんじんを1cm角に切り、にんにくはみじん切りにします。ささみは筋を取ります。",
        en: "Dice the onion and carrot into 1 cm pieces and finely chop the garlic. Remove the tendons from the chicken tenderloins.",
        es: "Corta la cebolla y la zanahoria en dados de 1 cm y pica fino el ajo. Quita el tendón a los solomillos de pollo.",
        fr: "Coupez l'oignon et la carotte en dés de 1 cm et hachez finement l'ail. Retirez le tendon des aiguillettes de poulet.",
      },
    },
    {
      key: "saute",
      text: {
        ja: "鍋にオリーブ油を中火で熱し、にんにく、玉ねぎ、にんじんを3分ほど炒め、パプリカパウダーを加えて混ぜます。",
        en: "Heat the olive oil in a pot over medium heat, sauté the garlic, onion, and carrot for about 3 minutes, and stir in the paprika.",
        es: "Calienta el aceite de oliva en una olla a fuego medio, sofríe el ajo, la cebolla y la zanahoria unos 3 minutos y añade el pimentón.",
        fr: "Faites chauffer l'huile d'olive dans une casserole à feu moyen, faites revenir l'ail, l'oignon et la carotte environ 3 minutes et incorporez le paprika.",
      },
    },
    {
      key: "simmer",
      text: {
        ja: "トマト缶、レンズ豆、水300mL、塩を加えて煮立てます。ささみを入れ、弱火で10分ほど、ささみの中まで火が通るまで煮ます。",
        en: "Add the canned tomatoes, lentils, 300 mL of water, and the salt and bring to a boil. Add the chicken tenderloins and simmer over low heat for about 10 minutes, until the chicken is cooked through.",
        es: "Añade el tomate de lata, las lentejas, 300 mL de agua y la sal y lleva a ebullición. Agrega los solomillos de pollo y cuece a fuego bajo unos 10 minutos, hasta que el pollo esté bien hecho.",
        fr: "Ajoutez les tomates en conserve, les lentilles, 300 mL d'eau et le sel, et portez à ébullition. Ajoutez les aiguillettes de poulet et laissez mijoter environ 10 minutes à feu doux, jusqu'à ce que le poulet soit cuit à cœur.",
      },
    },
    {
      key: "finish",
      text: {
        ja: "ささみを取り出してほぐし、鍋に戻します。レモン果汁を加え、刻んだパセリを散らします。",
        en: "Take out the chicken, shred it, and return it to the pot. Add the lemon juice and scatter the chopped parsley over.",
        es: "Saca el pollo, desmenúzalo y devuélvelo a la olla. Añade el zumo de limón y esparce el perejil picado.",
        fr: "Sortez le poulet, effilochez-le et remettez-le dans la casserole. Ajoutez le jus de citron et parsemez de persil haché.",
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
      key: "chicken_doneness",
      text: {
        ja: "鶏肉は中心まで火を通してください。切り口にピンク色が残っていれば、さらに加熱します。",
        en: "Cook chicken through. If any pink remains when you cut it, cook it longer.",
        es: "Cocina bien el pollo. Si queda algo rosado al cortarlo, cocínalo más tiempo.",
        fr: "Faites cuire le poulet à cœur. S'il reste du rose à la découpe, prolongez la cuisson.",
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
