import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "kedjenou_poulet",
  texts: {
    name: { ja: "ケジェヌ（鶏もも肉と野菜の油なし蒸し煮）", en: "Kedjenou (chicken and vegetables braised without oil)", es: "Kedjenou (pollo y verduras guisados sin aceite)", fr: "Kedjenou de poulet" },
    summary: {
      ja: "コートジボワールの煮込みをヒントに、皮なしの鶏もも肉、なす、トマト、玉ねぎを油を使わずに鍋で蒸し煮にします。長粒米のご飯を添えます。",
      en: "Inspired by the stew of Côte d'Ivoire: skinless chicken thigh, eggplant, tomato, and onion braised in a closed pot without oil, with long-grain rice.",
      es: "Inspirado en el guiso de Costa de Marfil: muslo de pollo sin piel, berenjena, tomate y cebolla guisados en una olla tapada sin aceite, con arroz largo.",
      fr: "Inspiré du plat ivoirien : haut de cuisse de poulet sans peau, aubergine, tomate et oignon cuits à l'étouffée sans matière grasse, avec du riz long.",
    },
  },
  cuisine: "west_african",
  goals: ["cut"],
  mainProteinGroup: "chicken",
  tags: ["batch"],
  minutes: 50,
  effort: 1,
  equipment: ["stove", "pot"],
  servings: 1,
  ingredients: [
    { key: "chicken", food: "chicken_thigh", grams: 170, state: "boil", role: "main_protein", adjust: { kind: "grams", min: 130, max: 210, step: 20 } },
    { key: "salt", food: "salt", grams: 1.2, state: "as_is", measure: { unit: "pinch", quantity: 2.5 }, role: "seasoning", linkedTo: "chicken" },
    { key: "eggplant", food: "eggplant", grams: 80, state: "boil", measure: { unit: "piece", quantity: 1 }, role: "vegetable" },
    { key: "onion", food: "onion", grams: 60, state: "boil", measure: { unit: "piece", quantity: 0.25 }, role: "vegetable" },
    { key: "tomato_canned", food: "tomato_canned", grams: 150, state: "as_is", measure: { unit: "can", quantity: 1 / 3 }, role: "vegetable" },
    { key: "ginger", food: "ginger", grams: 5, state: "raw", measure: { unit: "knob", quantity: 0.5 }, role: "seasoning" },
    { key: "garlic", food: "garlic", grams: 5, state: "raw", measure: { unit: "clove", quantity: 1 }, role: "seasoning" },
    { key: "chili", food: "chili_pepper_powder", grams: 0.3, state: "as_is", measure: { unit: "pinch", quantity: 1 }, role: "seasoning" },
    { key: "rice", food: "indica_rice_cooked", grams: 150, state: "as_is", role: "main_carb", adjust: { kind: "grams", min: 100, max: 250, step: 50 } },
  ],
  sides: [{ key: "rice", label: { ja: "長粒米のご飯", en: "Long-grain rice", es: "Arroz largo", fr: "Riz long" }, ingredients: ["rice"], solverMayRemove: true }],
  steps: [
    {
      key: "prep",
      text: {
        ja: "鶏もも肉を4等分に切り、塩をまぶします。なすは2cm角、玉ねぎは薄切りにし、しょうがとにんにくはすりおろします。",
        en: "Cut the chicken thigh into 4 pieces and season with the salt. Cut the eggplant into 2 cm pieces, thinly slice the onion, and grate the ginger and garlic.",
        es: "Corta el muslo de pollo en 4 trozos y sálalo. Corta la berenjena en dados de 2 cm, la cebolla en láminas finas y ralla el jengibre y el ajo.",
        fr: "Coupez le haut de cuisse de poulet en 4 morceaux et salez-le. Coupez l'aubergine en dés de 2 cm, émincez finement l'oignon et râpez le gingembre et l'ail.",
      },
    },
    {
      key: "braise",
      text: {
        ja: "厚手の鍋にすべての材料と水50mlを入れ、ふたをしっかり閉めて中火にかけます。煮立ったら弱火にし、40分蒸し煮にします。焦げつかないよう、10分ごとにふたをしたまま鍋を揺すります。",
        en: "Put all the ingredients and 50 ml of water in a heavy pot, close the lid tightly, and set over medium heat. When it boils, turn to low heat and braise for 40 minutes. Shake the closed pot every 10 minutes so nothing sticks.",
        es: "Pon todos los ingredientes y 50 ml de agua en una olla de fondo grueso, tápala bien y ponla a fuego medio. Cuando hierva, pásala a fuego bajo y guisa 40 minutos. Agita la olla tapada cada 10 minutos para que no se pegue.",
        fr: "Mettez tous les ingrédients et 50 ml d'eau dans une cocotte à fond épais, fermez bien le couvercle et posez-la sur feu moyen. À ébullition, passez à feu doux et laissez cuire à l'étouffée 40 minutes. Secouez la cocotte fermée toutes les 10 minutes pour que rien n'attache.",
      },
    },
    { key: "rice", side: "rice", text: { ja: "長粒米のご飯を添えます。", en: "Serve with the long-grain rice.", es: "Acompáñalo con el arroz largo.", fr: "Servez avec le riz long." } },
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
