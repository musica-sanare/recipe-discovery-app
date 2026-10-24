import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "beef_mince_bibimbap",
  texts: {
    name: { ja: "牛ひき肉とナムルのビビンバ丼", en: "Ground beef bibimbap with namul", es: "Bibimbap de carne picada con namul" },
    summary: {
      ja: "甘辛く炒めた牛ひき肉と、もやし、にんじん、ほうれん草のナムルをご飯にのせて混ぜて食べます。",
      en: "Sweet and savory ground beef with bean sprout, carrot, and spinach namul over rice, mixed before eating.",
      es: "Carne picada salteada en salsa dulce y salada con namul de brotes de soja, zanahoria y espinacas sobre arroz, para mezclar antes de comer.",
    },
  },
  cuisine: "korean",
  goals: ["bulk"],
  mainProteinGroup: "beef",
  tags: [],
  minutes: 20,
  effort: 2,
  equipment: ["stove", "frying_pan", "pot"],
  servings: 1,
  ingredients: [
    { key: "beef", food: "beef_mince", grams: 120, state: "grill", cooking: "stir_fry", role: "main_protein", adjust: { kind: "grams", min: 80, max: 180, step: 20 } },
    { key: "garlic", food: "garlic", grams: 5, state: "raw", measure: { unit: "clove", quantity: 1 }, role: "seasoning", linkedTo: "beef" },
    { key: "soy_sauce", food: "soy_sauce", grams: 12, state: "as_is", measure: { unit: "tsp", quantity: 2 }, role: "seasoning", linkedTo: "beef" },
    { key: "sugar", food: "sugar", grams: 4.5, state: "as_is", measure: { unit: "tsp", quantity: 1.5 }, role: "seasoning", linkedTo: "beef" },
    { key: "doubanjiang", food: "doubanjiang", grams: 3, state: "as_is", measure: { unit: "tsp", quantity: 0.5 }, role: "seasoning", linkedTo: "beef" },
    { key: "bean_sprouts", food: "bean_sprouts", grams: 80, state: "boil", role: "vegetable" },
    { key: "carrot", food: "carrot", grams: 40, state: "boil", role: "vegetable" },
    { key: "spinach", food: "spinach", grams: 60, state: "boil", role: "vegetable" },
    { key: "sesame_oil", food: "sesame_oil", grams: 4, state: "as_is", measure: { unit: "tsp", quantity: 1 }, role: "fat" },
    { key: "salt", food: "salt", grams: 0.8, state: "as_is", measure: { unit: "pinch", quantity: 2 }, role: "seasoning" },
    { key: "rice", food: "rice_cooked", grams: 280, state: "as_is", role: "main_carb", adjust: { kind: "grams", min: 180, max: 380, step: 10 } },
  ],
  sides: [],
  steps: [
    {
      key: "namul",
      text: {
        ja: "鍋に湯を沸かし、細切りのにんじんを2分、もやしを1分、ほうれん草を1分ゆでます。ほうれん草は水にとって絞り、4cm長さに切ります。水気を切った野菜をごま油と塩で和えます。",
        en: "Bring a pot of water to a boil and cook the carrot strips for 2 minutes, the bean sprouts for 1 minute, and the spinach for 1 minute. Cool the spinach in water, squeeze it dry, and cut it into 4 cm lengths. Toss the drained vegetables with the sesame oil and salt.",
        es: "Lleva a ebullición una olla con agua y cuece la zanahoria en tiras 2 minutos, los brotes de soja 1 minuto y las espinacas 1 minuto. Enfría las espinacas en agua, escúrrelas bien y córtalas en trozos de 4 cm. Mezcla las verduras escurridas con el aceite de sésamo y la sal.",
      },
    },
    {
      key: "beef",
      text: {
        ja: "フライパンを中火で熱し、油をひかずに牛ひき肉とみじん切りのにんにくを炒めます。肉の色が変わったら、しょうゆ、砂糖、豆板醤を加えて汁気がなくなるまで炒めます。",
        en: "Heat a frying pan over medium heat and stir-fry the ground beef and chopped garlic without oil. When the meat has browned, add the soy sauce, sugar, and doubanjiang and cook until the liquid is gone.",
        es: "Calienta una sartén a fuego medio y saltea la carne picada con el ajo picado sin aceite. Cuando la carne se dore, añade la salsa de soja, el azúcar y el doubanjiang y cocina hasta que no quede líquido.",
      },
    },
    {
      key: "serve",
      text: {
        ja: "ご飯にナムルと牛ひき肉をのせます。",
        en: "Top the rice with the namul and the beef.",
        es: "Cubre el arroz con el namul y la carne.",
      },
    },
  ],
  safetyNotes: [
    {
      key: "mince_doneness",
      text: {
        ja: "ひき肉は中心まで火を通してください。ピンク色が残らないよう、ほぐしながら炒めます。",
        en: "Cook ground meat through, breaking it up until no pink remains.",
        es: "Cocina bien la carne picada, deshaciéndola hasta que no quede nada rosado.",
      },
    },
  ],
  substitutions: [],
};
