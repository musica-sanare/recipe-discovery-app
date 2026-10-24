import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "boiled_chicken_negi_salt",
  texts: {
    name: { ja: "ゆで鶏むね肉のねぎ塩だれ", en: "Poached chicken breast with leek and salt sauce", es: "Pechuga de pollo hervida con salsa de puerro y sal" },
    summary: {
      ja: "鶏むね肉をしっとりゆでて、長ねぎとごま油の塩だれをかけます。3食分まとめて作れます。",
      en: "Tender poached chicken breast topped with a leek, sesame oil, and salt sauce. Makes three servings for batch cooking.",
      es: "Pechuga de pollo hervida y jugosa con una salsa de puerro, aceite de sésamo y sal. Rinde tres raciones para cocinar por adelantado.",
    },
  },
  cuisine: "japanese",
  goals: ["cut"],
  mainProteinGroup: "chicken",
  tags: ["batch"],
  minutes: 30,
  effort: 1,
  equipment: ["stove", "pot"],
  servings: 3,
  ingredients: [
    {
      key: "chicken",
      food: "chicken_breast",
      grams: 450,
      state: "raw",
      cooking: "boil",
      role: "main_protein",
      adjust: { kind: "grams", min: 360, max: 600, step: 30 },
      note: {
        ja: "成分表にゆでた皮なし鶏むね肉の値がないため、生の値で計算しています。",
        en: "The tables have no value for boiled skinless chicken breast, so the raw value is used.",
        es: "Las tablas no tienen un valor para la pechuga sin piel hervida, así que se usa el valor en crudo.",
      },
    },
    { key: "leek", food: "long_onion", grams: 60, state: "raw", measure: { unit: "stalk", quantity: 0.5 }, role: "vegetable", linkedTo: "chicken" },
    { key: "sesame_oil", food: "sesame_oil", grams: 12, state: "as_is", measure: { unit: "tbsp", quantity: 1 }, role: "fat", linkedTo: "chicken" },
    { key: "lemon", food: "lemon_juice", grams: 15, state: "as_is", measure: { unit: "tbsp", quantity: 1 }, role: "seasoning", linkedTo: "chicken" },
    { key: "salt", food: "salt", grams: 3, state: "as_is", measure: { unit: "tsp", quantity: 0.5 }, role: "seasoning", linkedTo: "chicken" },
    { key: "stock", food: "chinese_stock_granules", grams: 3, state: "as_is", measure: { unit: "tsp", quantity: 1 }, role: "seasoning", linkedTo: "chicken" },
    { key: "pepper", food: "black_pepper", grams: 0.3, state: "as_is", measure: { unit: "pinch", quantity: 1 }, role: "seasoning", linkedTo: "chicken" },
    { key: "rice", food: "rice_cooked", grams: 450, state: "as_is", role: "main_carb", adjust: { kind: "grams", min: 300, max: 750, step: 30 } },
  ],
  sides: [
    { key: "rice", label: { ja: "ご飯", en: "Rice", es: "Arroz" }, ingredients: ["rice"], solverMayRemove: true },
  ],
  steps: [
    {
      key: "boil",
      text: {
        ja: "鍋にたっぷりの湯を沸かし、鶏むね肉を入れて弱火で5分ゆでます。火を止めてふたをし、そのまま20分置いて余熱で火を通します。",
        en: "Bring plenty of water to a boil, add the chicken breast, and simmer over low heat for 5 minutes. Turn off the heat, cover, and leave for 20 minutes to finish cooking in the residual heat.",
        es: "Lleva a ebullición abundante agua, añade la pechuga y cuece a fuego bajo 5 minutos. Apaga el fuego, tapa y deja reposar 20 minutos para que termine de cocinarse con el calor residual.",
      },
    },
    {
      key: "sauce",
      text: {
        ja: "長ねぎをみじん切りにし、ごま油、レモン果汁、塩、中華だし、こしょうと混ぜてたれを作ります。",
        en: "Finely chop the leek and mix it with the sesame oil, lemon juice, salt, stock granules, and pepper to make the sauce.",
        es: "Pica fino el puerro y mézclalo con el aceite de sésamo, el zumo de limón, la sal, el caldo en gránulos y la pimienta para hacer la salsa.",
      },
    },
    {
      key: "slice",
      text: {
        ja: "鶏肉の中心まで火が通っていることを確かめてから薄く切り、たれをかけて3等分します。",
        en: "Check that the chicken is cooked through, slice it thinly, pour over the sauce, and divide into three servings.",
        es: "Comprueba que el pollo esté bien cocido, córtalo en lonchas finas, vierte la salsa por encima y repártelo en tres raciones.",
      },
    },
    {
      key: "store",
      text: {
        ja: "作り置きする場合は、粗熱を取ってから冷蔵庫で保存します。",
        en: "For batch cooking, let it cool briefly and then refrigerate.",
        es: "Si lo preparas por adelantado, déjalo templar y guárdalo en el frigorífico.",
      },
    },
  ],
  safetyNotes: [
    {
      key: "residual_heat",
      text: {
        ja: "余熱調理では、肉の厚みや量によって火の通りが変わります。中心に赤みが残っていたら、再び加熱してください。",
        en: "When cooking with residual heat, doneness depends on the thickness and amount of meat. If the center is still pink, heat it again.",
        es: "Al cocinar con calor residual, el punto de cocción depende del grosor y la cantidad de carne. Si el centro sigue rosado, vuelve a calentar la carne.",
      },
    },
    {
      key: "storage",
      text: {
        ja: "作り置きは早めに冷まして冷蔵し、食べる前に状態を確かめてください。",
        en: "Cool batch-cooked food quickly, keep it refrigerated, and check it before eating.",
        es: "Enfría rápido la comida preparada por adelantado, mantenla refrigerada y revísala antes de comerla.",
      },
    },
  ],
  substitutions: [],
};
