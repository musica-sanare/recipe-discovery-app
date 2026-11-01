import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "poulet_basquaise",
  texts: {
    name: { ja: "プーレ・バスケーズ（鶏もも肉とパプリカのバスク風煮込み）", en: "Poulet basquaise (Basque-style chicken with peppers)", es: "Poulet basquaise (pollo a la vasca con pimientos)", fr: "Poulet basquaise" },
    summary: {
      ja: "フランス・バスク地方の家庭料理をヒントに、皮なしの鶏もも肉をパプリカ、ピーマン、トマトで煮込みます。ご飯を添えます。",
      en: "Inspired by home cooking in the French Basque Country: skinless chicken thigh stewed with red and green peppers and tomato, with rice.",
      es: "Inspirado en la cocina casera del País Vasco francés: muslo de pollo sin piel guisado con pimientos rojos y verdes y tomate, con arroz.",
      fr: "Inspiré de la cuisine familiale du Pays basque : haut de cuisse de poulet sans peau mijoté avec des poivrons rouges et verts et de la tomate, avec du riz.",
    },
  },
  cuisine: "french",
  goals: ["maintain"],
  mainProteinGroup: "chicken",
  tags: ["batch"],
  minutes: 40,
  effort: 2,
  equipment: ["stove", "frying_pan"],
  servings: 1,
  ingredients: [
    { key: "chicken", food: "chicken_thigh", grams: 150, state: "boil", role: "main_protein", adjust: { kind: "grams", min: 110, max: 190, step: 20 } },
    { key: "salt", food: "salt", grams: 1.5, state: "as_is", measure: { unit: "pinch", quantity: 3 }, role: "seasoning", linkedTo: "chicken" },
    { key: "pepper", food: "black_pepper", grams: 0.2, state: "as_is", measure: { unit: "pinch", quantity: 1 }, role: "seasoning", linkedTo: "chicken" },
    { key: "red_pepper", food: "red_pepper", grams: 70, state: "stir_fry", measure: { unit: "piece", quantity: 0.5 }, role: "vegetable" },
    { key: "green_pepper", food: "green_pepper", grams: 50, state: "stir_fry", measure: { unit: "piece", quantity: 1.5 }, role: "vegetable" },
    { key: "onion", food: "onion", grams: 50, state: "stir_fry", measure: { unit: "piece", quantity: 0.25 }, role: "vegetable" },
    { key: "olive_oil", food: "olive_oil", grams: 6, state: "as_is", measure: { unit: "tsp", quantity: 1.5 }, role: "fat", includedIn: "red_pepper" },
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
        ja: "エスペレット唐辛子の代わりに、パプリカと一味唐辛子で香りと辛みをつけます。",
        en: "Paprika and ground chili pepper stand in for Espelette pepper.",
        es: "El pimentón y la guindilla molida sustituyen al pimiento de Espelette.",
        fr: "Le paprika et le piment rouge moulu remplacent le piment d'Espelette.",
      },
    },
    { key: "chili", food: "chili_pepper_powder", grams: 0.2, state: "as_is", measure: { unit: "pinch", quantity: 1 }, role: "seasoning" },
    { key: "parsley", food: "parsley", grams: 2, state: "raw", role: "vegetable" },
    { key: "rice", food: "rice_cooked", grams: 150, state: "as_is", role: "main_carb", adjust: { kind: "grams", min: 100, max: 250, step: 50 } },
  ],
  sides: [{ key: "rice", label: { ja: "ご飯", en: "Rice", es: "Arroz", fr: "Riz" }, ingredients: ["rice"], solverMayRemove: true }],
  steps: [
    {
      key: "prep",
      text: {
        ja: "鶏もも肉を4等分に切り、塩とこしょうをまぶします。パプリカとピーマンは細切り、玉ねぎは薄切りにし、にんにくはつぶします。",
        en: "Cut the chicken thigh into 4 pieces and season with the salt and pepper. Slice the red and green peppers into strips, thinly slice the onion, and crush the garlic.",
        es: "Corta el muslo de pollo en 4 trozos y salpimiéntalo. Corta los pimientos rojos y verdes en tiras, la cebolla en láminas finas y machaca el ajo.",
        fr: "Coupez le haut de cuisse de poulet en 4 morceaux, salez et poivrez. Taillez les poivrons rouges et verts en lanières, émincez finement l'oignon et écrasez l'ail.",
      },
    },
    {
      key: "vegetables",
      text: {
        ja: "フライパンにオリーブオイルとにんにくを入れて中火にかけ、玉ねぎ、パプリカ、ピーマンを5分炒めます。",
        en: "Heat the olive oil and garlic in a frying pan over medium heat and stir-fry the onion and peppers for 5 minutes.",
        es: "Calienta el aceite de oliva con el ajo en una sartén a fuego medio y saltea la cebolla y los pimientos 5 minutos.",
        fr: "Faites chauffer l'huile d'olive et l'ail dans une poêle à feu moyen et faites revenir l'oignon et les poivrons 5 minutes.",
      },
    },
    {
      key: "simmer",
      text: {
        ja: "トマト缶、パプリカパウダー、一味唐辛子、水50mlを加えて煮立て、鶏肉を入れてふたをし、弱めの中火で20分煮ます。途中で一度上下を返します。",
        en: "Add the canned tomatoes, paprika, ground chili pepper, and 50 ml of water and bring to a boil. Add the chicken, cover, and simmer over medium-low heat for 20 minutes, turning the pieces once.",
        es: "Añade el tomate en lata, el pimentón, la guindilla molida y 50 ml de agua y lleva a ebullición. Incorpora el pollo, tapa y cuece a fuego medio-bajo 20 minutos, dando la vuelta a los trozos una vez.",
        fr: "Ajoutez les tomates en conserve, le paprika, le piment moulu et 50 ml d'eau et portez à ébullition. Ajoutez le poulet, couvrez et laissez mijoter 20 minutes à feu moyen-doux en retournant les morceaux une fois.",
      },
    },
    {
      key: "finish",
      text: {
        ja: "器に盛り、刻んだパセリを散らします。",
        en: "Serve sprinkled with the chopped parsley.",
        es: "Sírvelo con el perejil picado por encima.",
        fr: "Servez parsemé de persil haché.",
      },
    },
    { key: "rice", side: "rice", text: { ja: "ご飯を添えます。", en: "Serve with the rice.", es: "Acompáñalo con el arroz.", fr: "Servez avec le riz." } },
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
