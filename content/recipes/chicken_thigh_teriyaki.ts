import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "chicken_thigh_teriyaki",
  texts: {
    name: { ja: "皮なし鶏ももの照り焼き", en: "Skinless chicken thigh teriyaki", es: "Muslo de pollo sin piel al teriyaki" },
    summary: {
      ja: "皮を除いた鶏もも肉を、しょうゆとみりんの甘辛いたれで照り焼きにします。",
      en: "Skinless chicken thigh glazed with a sweet and savory soy sauce and mirin sauce.",
      es: "Muslo de pollo sin piel glaseado con una salsa agridulce de soja y mirin.",
    },
  },
  cuisine: "japanese",
  goals: ["maintain"],
  mainProteinGroup: "chicken",
  tags: [],
  minutes: 20,
  effort: 2,
  equipment: ["stove", "frying_pan"],
  servings: 1,
  ingredients: [
    { key: "chicken", food: "chicken_thigh", grams: 180, state: "grill", cooking: "saute", role: "main_protein", adjust: { kind: "grams", min: 140, max: 240, step: 10 } },
    { key: "oil", food: "vegetable_oil", grams: 3, state: "as_is", measure: { unit: "tsp", quantity: 0.75 }, role: "fat", linkedTo: "chicken" },
    { key: "soy_sauce", food: "soy_sauce", grams: 15, state: "as_is", measure: { unit: "tbsp", quantity: 0.75 }, role: "seasoning", linkedTo: "chicken" },
    { key: "mirin", food: "mirin", grams: 15, state: "as_is", measure: { unit: "tbsp", quantity: 0.75 }, role: "seasoning", linkedTo: "chicken" },
    { key: "sake", food: "cooking_sake", grams: 10, state: "as_is", measure: { unit: "tsp", quantity: 2 }, role: "seasoning", linkedTo: "chicken" },
    { key: "sugar", food: "sugar", grams: 3, state: "as_is", measure: { unit: "tsp", quantity: 1 }, role: "seasoning", linkedTo: "chicken" },
    { key: "cabbage", food: "cabbage", grams: 60, state: "raw", role: "vegetable" },
    { key: "rice", food: "rice_cooked", grams: 180, state: "as_is", role: "main_carb", adjust: { kind: "grams", min: 100, max: 280, step: 10 } },
  ],
  sides: [
    { key: "rice", label: { ja: "ご飯", en: "Rice", es: "Arroz" }, ingredients: ["rice"], solverMayRemove: true },
    { key: "cabbage", label: { ja: "せん切りキャベツ", en: "Shredded cabbage", es: "Repollo en juliana" }, ingredients: ["cabbage"], solverMayRemove: false },
  ],
  steps: [
    {
      key: "prep",
      text: {
        ja: "鶏もも肉の余分な脂を取り除き、厚みを均一にします。",
        en: "Trim excess fat from the chicken thigh and even out its thickness.",
        es: "Retira la grasa sobrante del muslo y deja un grosor uniforme.",
      },
    },
    {
      key: "cabbage",
      side: "cabbage",
      text: {
        ja: "キャベツをせん切りにします。",
        en: "Finely shred the cabbage.",
        es: "Corta el repollo en juliana fina.",
      },
    },
    {
      key: "cook",
      text: {
        ja: "フライパンに油を中火で熱し、鶏肉を片面5分ずつ焼きます。",
        en: "Heat the oil in a frying pan over medium heat and cook the chicken for 5 minutes on each side.",
        es: "Calienta el aceite en una sartén a fuego medio y cocina el pollo 5 minutos por cada lado.",
      },
    },
    {
      key: "glaze",
      text: {
        ja: "しょうゆ、みりん、料理酒、砂糖を加え、とろみがつくまで煮からめます。",
        en: "Add the soy sauce, mirin, cooking sake, and sugar, and coat the chicken until the sauce thickens.",
        es: "Añade la salsa de soja, el mirin, el sake de cocina y el azúcar, y baña el pollo hasta que la salsa espese.",
      },
    },
    {
      key: "serve",
      text: {
        ja: "切り分けて器に盛ります。",
        en: "Slice and transfer to a plate.",
        es: "Córtalo y emplátalo.",
      },
    },
  ],
  safetyNotes: [
    {
      key: "chicken_doneness",
      text: {
        ja: "鶏肉は中心まで火を通してください。切り口に赤みがなく、肉汁が透明になっていることを確認します。",
        en: "Cook chicken all the way through. Check that the center is no longer pink and the juices run clear.",
        es: "Cocina el pollo completamente. Comprueba que el centro ya no esté rosado y que los jugos salgan transparentes.",
      },
    },
  ],
  substitutions: [],
};
