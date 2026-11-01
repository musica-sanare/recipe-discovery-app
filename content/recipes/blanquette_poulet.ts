import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "blanquette_poulet",
  texts: {
    name: { ja: "鶏むね肉のブランケット（白い煮込み）", en: "Chicken blanquette (creamy white stew)", es: "Blanquette de pollo (guiso blanco)", fr: "Blanquette de poulet" },
    summary: {
      ja: "フランスの白い煮込みをヒントに、鶏むね肉、マッシュルーム、にんじん、玉ねぎを煮て、牛乳と薄力粉でとろみをつけます。ご飯を添えます。",
      en: "Inspired by the French white stew: chicken breast, button mushrooms, carrot, and onion simmered, then thickened with milk and flour. With rice.",
      es: "Inspirado en el guiso blanco francés: pechuga de pollo, champiñones, zanahoria y cebolla cocidos y ligados con leche y harina. Con arroz.",
      fr: "Inspirée de la blanquette traditionnelle : blanc de poulet, champignons de Paris, carotte et oignon mijotés, puis liés au lait et à la farine. Avec du riz.",
    },
  },
  cuisine: "french",
  goals: ["maintain"],
  mainProteinGroup: "chicken",
  tags: ["batch"],
  minutes: 40,
  effort: 2,
  equipment: ["stove", "pot"],
  servings: 1,
  ingredients: [
    {
      key: "chicken",
      food: "chicken_breast",
      grams: 160,
      state: "raw",
      cooking: "simmer",
      role: "main_protein",
      adjust: { kind: "grams", min: 120, max: 200, step: 20 },
      note: {
        ja: "成分表に煮込んだ鶏むね肉の値がないため、生の値で計算しています。",
        en: "The tables have no value for stewed chicken breast, so the raw value is used.",
        es: "Las tablas no tienen un valor para la pechuga de pollo guisada, así que se usa el valor en crudo.",
        fr: "Les tables n'ont pas de valeur pour le blanc de poulet mijoté ; la valeur à l'état cru est donc utilisée.",
      },
    },
    { key: "salt", food: "salt", grams: 1.2, state: "as_is", measure: { unit: "pinch", quantity: 2.5 }, role: "seasoning", linkedTo: "chicken" },
    { key: "pepper", food: "black_pepper", grams: 0.2, state: "as_is", measure: { unit: "pinch", quantity: 1 }, role: "seasoning", linkedTo: "chicken" },
    { key: "mushrooms", food: "button_mushroom", grams: 60, state: "boil", role: "vegetable" },
    { key: "carrot", food: "carrot", grams: 50, state: "boil", measure: { unit: "piece", quantity: 0.25 }, role: "vegetable" },
    { key: "onion", food: "onion", grams: 50, state: "boil", measure: { unit: "piece", quantity: 0.25 }, role: "vegetable" },
    { key: "thyme", food: "thyme", grams: 0.2, state: "as_is", measure: { unit: "pinch", quantity: 1 }, role: "seasoning" },
    { key: "milk", food: "milk", grams: 100, state: "as_is", role: "other" },
    { key: "flour", food: "wheat_flour", grams: 8, state: "as_is", measure: { unit: "tbsp", quantity: 1 }, role: "other" },
    { key: "lemon", food: "lemon_juice", grams: 5, state: "as_is", measure: { unit: "tsp", quantity: 1 }, role: "seasoning" },
    { key: "parsley", food: "parsley", grams: 2, state: "raw", role: "vegetable" },
    { key: "rice", food: "rice_cooked", grams: 150, state: "as_is", role: "main_carb", adjust: { kind: "grams", min: 100, max: 250, step: 50 } },
  ],
  sides: [{ key: "rice", label: { ja: "ご飯", en: "Rice", es: "Arroz", fr: "Riz" }, ingredients: ["rice"], solverMayRemove: true }],
  steps: [
    {
      key: "prep",
      text: {
        ja: "鶏むね肉をひと口大に切り、塩とこしょうをまぶします。マッシュルームは半分に、にんじんは1cm幅の輪切り、玉ねぎはくし形に切ります。",
        en: "Cut the chicken breast into bite-size pieces and season with the salt and pepper. Halve the mushrooms, slice the carrot into 1 cm rounds, and cut the onion into wedges.",
        es: "Corta la pechuga de pollo en trozos pequeños y salpimiéntala. Corta los champiñones por la mitad, la zanahoria en rodajas de 1 cm y la cebolla en gajos.",
        fr: "Coupez le blanc de poulet en bouchées, salez et poivrez. Coupez les champignons en deux, la carotte en rondelles de 1 cm et l'oignon en quartiers.",
      },
    },
    {
      key: "simmer",
      text: {
        ja: "鍋に鶏肉、にんじん、玉ねぎ、タイム、水200mlを入れて煮立て、アクを取ります。ふたをして弱火で15分煮て、マッシュルームを加えてさらに5分煮ます。",
        en: "Put the chicken, carrot, onion, thyme, and 200 ml of water in a pot, bring to a boil, and skim. Cover and cook over low heat for 15 minutes, then add the mushrooms and cook for 5 more minutes.",
        es: "Pon en una olla el pollo, la zanahoria, la cebolla, el tomillo y 200 ml de agua, lleva a ebullición y espuma. Tapa y cuece a fuego bajo 15 minutos; añade los champiñones y cuece 5 minutos más.",
        fr: "Mettez le poulet, la carotte, l'oignon, le thym et 200 ml d'eau dans une casserole, portez à ébullition et écumez. Couvrez et laissez cuire 15 minutes à feu doux, puis ajoutez les champignons et prolongez de 5 minutes.",
      },
    },
    {
      key: "thicken",
      text: {
        ja: "牛乳に薄力粉をよく溶かして加え、混ぜながら弱めの中火で3〜4分、とろみがつくまで煮ます。火を止めてレモン果汁を加え、刻んだパセリを散らします。",
        en: "Whisk the flour into the milk until smooth, add it to the pot, and cook over medium-low heat for 3 to 4 minutes, stirring, until thickened. Turn off the heat, stir in the lemon juice, and sprinkle with the chopped parsley.",
        es: "Disuelve bien la harina en la leche, añádela a la olla y cuece a fuego medio-bajo de 3 a 4 minutos, removiendo, hasta que espese. Apaga el fuego, añade el zumo de limón y espolvorea con el perejil picado.",
        fr: "Délayez la farine dans le lait, versez dans la casserole et laissez cuire 3 à 4 minutes à feu moyen-doux en remuant, jusqu'à ce que la sauce épaississe. Éteignez le feu, ajoutez le jus de citron et parsemez de persil haché.",
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
