import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "tajine_poulet_citron",
  texts: {
    name: { ja: "鶏もも肉のタジン、レモンとオリーブ", en: "Chicken tagine with lemon and olives", es: "Tajín de pollo con limón y aceitunas", fr: "Tajine de poulet au citron et aux olives" },
    summary: {
      ja: "モロッコの煮込みをヒントに、皮なしの鶏もも肉、玉ねぎ、にんじんをしょうがとにんにくで煮て、レモンとグリーンオリーブで仕上げます。フランスパンを添えます。",
      en: "Inspired by Moroccan stews: skinless chicken thigh, onion, and carrot simmered with ginger and garlic, finished with lemon and green olives. With baguette.",
      es: "Inspirado en los guisos marroquíes: muslo de pollo sin piel, cebolla y zanahoria cocidos con jengibre y ajo, terminados con limón y aceitunas verdes. Con pan de barra.",
      fr: "Inspiré des plats mijotés marocains : haut de cuisse de poulet sans peau, oignon et carotte cuits au gingembre et à l'ail, relevés de citron et d'olives vertes. Avec de la baguette.",
    },
  },
  cuisine: "north_african",
  goals: ["maintain"],
  mainProteinGroup: "chicken",
  tags: ["batch"],
  minutes: 50,
  effort: 2,
  equipment: ["stove", "pot"],
  servings: 1,
  ingredients: [
    { key: "chicken", food: "chicken_thigh", grams: 150, state: "boil", role: "main_protein", adjust: { kind: "grams", min: 110, max: 190, step: 20 } },
    { key: "salt", food: "salt", grams: 1, state: "as_is", measure: { unit: "pinch", quantity: 2 }, role: "seasoning", linkedTo: "chicken" },
    { key: "pepper", food: "black_pepper", grams: 0.2, state: "as_is", measure: { unit: "pinch", quantity: 1 }, role: "seasoning", linkedTo: "chicken" },
    { key: "olive_oil", food: "olive_oil", grams: 5, state: "as_is", measure: { unit: "tsp", quantity: 1.25 }, role: "fat" },
    { key: "onion", food: "onion", grams: 80, state: "boil", measure: { unit: "piece", quantity: 0.5 }, role: "vegetable" },
    { key: "carrot", food: "carrot", grams: 50, state: "boil", measure: { unit: "piece", quantity: 0.25 }, role: "vegetable" },
    { key: "garlic", food: "garlic", grams: 5, state: "raw", measure: { unit: "clove", quantity: 1 }, role: "seasoning" },
    { key: "ginger", food: "ginger", grams: 5, state: "raw", measure: { unit: "knob", quantity: 0.5 }, role: "seasoning" },
    { key: "paprika", food: "paprika_powder", grams: 0.5, state: "as_is", measure: { unit: "pinch", quantity: 2 }, role: "seasoning" },
    { key: "olives", food: "green_olives", grams: 20, state: "as_is", role: "other" },
    {
      key: "lemon",
      food: "lemon_juice",
      grams: 15,
      state: "as_is",
      measure: { unit: "tbsp", quantity: 1 },
      role: "seasoning",
      note: {
        ja: "成分表に塩レモンやサフランがないため、レモン果汁としょうがで仕上げます。",
        en: "The tables have no preserved lemon or saffron, so lemon juice and ginger are used.",
        es: "Las tablas no tienen limón encurtido ni azafrán, así que se usan zumo de limón y jengibre.",
        fr: "Les tables n'ont ni citron confit ni safran ; le jus de citron et le gingembre les remplacent.",
      },
    },
    { key: "coriander", food: "coriander", grams: 3, state: "raw", role: "vegetable" },
    { key: "parsley", food: "parsley", grams: 2, state: "raw", role: "vegetable" },
    { key: "bread", food: "baguette", grams: 60, state: "as_is", role: "main_carb", adjust: { kind: "grams", min: 40, max: 100, step: 20 } },
  ],
  sides: [{ key: "bread", label: { ja: "フランスパン", en: "Baguette", es: "Pan de barra", fr: "Baguette" }, ingredients: ["bread"], solverMayRemove: true }],
  steps: [
    {
      key: "prep",
      text: {
        ja: "鶏もも肉を4等分に切り、塩とこしょうをまぶします。玉ねぎは薄切り、にんじんは縦4等分に切り、にんにくとしょうがはすりおろします。",
        en: "Cut the chicken thigh into 4 pieces and season with the salt and pepper. Thinly slice the onion, cut the carrot lengthwise into quarters, and grate the garlic and ginger.",
        es: "Corta el muslo de pollo en 4 trozos y salpimiéntalo. Corta la cebolla en láminas finas y la zanahoria a lo largo en cuartos, y ralla el ajo y el jengibre.",
        fr: "Coupez le haut de cuisse de poulet en 4 morceaux, salez et poivrez. Émincez finement l'oignon, coupez la carotte en quatre dans la longueur et râpez l'ail et le gingembre.",
      },
    },
    {
      key: "brown",
      text: {
        ja: "鍋にオリーブオイルを中火で熱し、鶏肉の表面を焼きます。玉ねぎ、にんにく、しょうが、パプリカパウダーを加えて2分炒めます。",
        en: "Heat the olive oil in a pot over medium heat and brown the chicken. Add the onion, garlic, ginger, and paprika and stir-fry for 2 minutes.",
        es: "Calienta el aceite de oliva en una olla a fuego medio y dora el pollo. Añade la cebolla, el ajo, el jengibre y el pimentón y saltea 2 minutos.",
        fr: "Faites chauffer l'huile d'olive dans une cocotte à feu moyen et faites dorer le poulet. Ajoutez l'oignon, l'ail, le gingembre et le paprika et faites revenir 2 minutes.",
      },
    },
    {
      key: "simmer",
      text: {
        ja: "にんじんと水150mlを加えて煮立て、ふたをして弱火で30分煮ます。",
        en: "Add the carrot and 150 ml of water, bring to a boil, cover, and cook over low heat for 30 minutes.",
        es: "Añade la zanahoria y 150 ml de agua, lleva a ebullición, tapa y cuece a fuego bajo 30 minutos.",
        fr: "Ajoutez la carotte et 150 ml d'eau, portez à ébullition, couvrez et laissez cuire 30 minutes à feu doux.",
      },
    },
    {
      key: "finish",
      text: {
        ja: "オリーブとレモン果汁を加えて5分煮ます。器に盛り、刻んだパクチーとパセリを散らします。",
        en: "Add the olives and lemon juice and cook for 5 more minutes. Serve sprinkled with the chopped coriander and parsley.",
        es: "Añade las aceitunas y el zumo de limón y cuece 5 minutos más. Sírvelo con el cilantro y el perejil picados por encima.",
        fr: "Ajoutez les olives et le jus de citron et laissez cuire encore 5 minutes. Servez parsemé de coriandre et de persil hachés.",
      },
    },
    { key: "bread", side: "bread", text: { ja: "フランスパンを添えます。", en: "Serve with the baguette.", es: "Acompáñalo con el pan de barra.", fr: "Servez avec la baguette." } },
  ],
  safetyNotes: [
    {
      key: "chicken_doneness",
      text: {
        ja: "鶏肉は中心まで火を通してください。切り口に赤みがなく、肉汁が透明になっていることを確認します。",
        en: "Cook chicken all the way through. Check that the center is no longer pink and the juices run clear.",
        es: "Cocina el pollo completamente. Comprueba que el centro ya no esté rosado y que los jugos salgan transparentes.",
        fr: "Faites cuire le poulet à cœur. Vérifiez que le centre n'est plus rosé et que le jus qui s'écoule est clair.",
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
