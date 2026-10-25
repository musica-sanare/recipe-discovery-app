import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "beef_pho_rice_noodles",
  texts: {
    name: { ja: "牛もも肉のフォー風スープ", en: "Pho-style beef and rice noodle soup", es: "Sopa de fideos de arroz con ternera al estilo pho" },
    summary: {
      ja: "ベトナムのフォーをヒントに、しょうがとナンプラーのスープで牛もも肉の薄切りを煮て、米の麺にのせます。牛肉はスープでしっかり火を通します。",
      en: "Inspired by Vietnamese pho: thinly sliced lean beef cooked in a ginger and fish sauce broth over rice noodles. The beef is cooked through in the broth.",
      es: "Inspirado en el pho vietnamita: ternera magra en lonchas finas cocida en un caldo de jengibre y salsa de pescado sobre fideos de arroz. La ternera se cuece por completo en el caldo.",
    },
  },
  cuisine: "southeast_asian",
  goals: ["cut"],
  mainProteinGroup: "beef",
  tags: [],
  minutes: 20,
  effort: 2,
  equipment: ["stove", "pot"],
  servings: 1,
  ingredients: [
    { key: "beef", food: "beef_round", grams: 140, state: "boil", role: "main_protein", adjust: { kind: "grams", min: 100, max: 180, step: 20 } },
    {
      key: "noodles",
      food: "rice_noodles",
      grams: 80,
      state: "raw",
      cooking: "boil",
      role: "main_carb",
      adjust: { kind: "grams", min: 60, max: 100, step: 10 },
      note: {
        ja: "成分表にゆでたビーフンの値がないため、乾物の値で計算しています。",
        en: "The tables have no value for boiled rice noodles, so the dry value is used.",
        es: "Las tablas no tienen un valor para los fideos de arroz cocidos, así que se usa el valor en seco.",
      },
    },
    { key: "fish_sauce", food: "fish_sauce", grams: 12, state: "as_is", measure: { unit: "tsp", quantity: 2 }, role: "seasoning" },
    { key: "onion", food: "onion", grams: 40, state: "raw", cooking: "simmer", role: "vegetable" },
    { key: "ginger", food: "ginger", grams: 5, state: "raw", measure: { unit: "knob", quantity: 0.5 }, role: "seasoning" },
    { key: "bean_sprouts", food: "bean_sprouts", grams: 60, state: "boil", role: "vegetable" },
    { key: "green_onion", food: "green_onion", grams: 5, state: "raw", role: "vegetable" },
    { key: "coriander", food: "coriander", grams: 5, state: "raw", role: "vegetable" },
    { key: "lime", food: "lime_juice", grams: 10, state: "as_is", measure: { unit: "tsp", quantity: 2 }, role: "seasoning" },
  ],
  sides: [],
  steps: [
    {
      key: "noodles",
      text: {
        ja: "ビーフンを袋の表示どおりにゆでるか湯で戻し、水気を切って器に入れます。",
        en: "Boil or soak the rice noodles as directed on the package, drain, and put them in a bowl.",
        es: "Cuece o remoja los fideos de arroz según las indicaciones del envase, escúrrelos y ponlos en un cuenco.",
      },
    },
    {
      key: "broth",
      text: {
        ja: "鍋に水400ml、薄切りにした玉ねぎとしょうがを入れて煮立て、中火で5分煮ます。ナンプラーで味をととのえます。",
        en: "Put 400 ml of water and the sliced onion and ginger in a pot, bring to a boil, and simmer over medium heat for 5 minutes. Season with the fish sauce.",
        es: "Pon 400 ml de agua y la cebolla y el jengibre en láminas en una olla, lleva a ebullición y cuece a fuego medio 5 minutos. Sazona con la salsa de pescado.",
      },
    },
    {
      key: "beef",
      text: {
        ja: "もやしを加えて1分煮ます。牛肉を1枚ずつ広げて入れ、赤い部分がなくなるまで1〜2分煮ます。",
        en: "Add the bean sprouts and simmer for 1 minute. Add the beef one slice at a time, spreading it out, and simmer for 1–2 minutes until no red remains.",
        es: "Añade los brotes de soja y cuece 1 minuto. Echa la ternera loncha a loncha, extendiéndola, y cuécela 1-2 minutos hasta que no quede nada rojo.",
      },
    },
    {
      key: "serve",
      text: {
        ja: "麺の上に牛肉、もやし、スープをかけ、刻んだ青ねぎとパクチーをのせます。食べる直前にライム果汁をかけます。",
        en: "Pour the beef, bean sprouts, and broth over the noodles and top with the chopped green onion and cilantro. Add the lime juice just before eating.",
        es: "Vierte la ternera, los brotes de soja y el caldo sobre los fideos y añade la cebolleta y el cilantro picados. Echa el zumo de lima justo antes de comer.",
      },
    },
  ],
  safetyNotes: [
    {
      key: "beef_doneness",
      text: {
        ja: "牛肉は生のまま麺にのせず、スープで赤い部分がなくなるまで煮てください。",
        en: "Do not put raw beef on the noodles; simmer it in the broth until no red remains.",
        es: "No pongas la ternera cruda sobre los fideos; cuécela en el caldo hasta que no quede nada rojo.",
      },
    },
    {
      key: "wash_raw",
      text: {
        ja: "生で食べる野菜とハーブは、流水でよく洗ってください。",
        en: "Wash raw vegetables and herbs well under running water.",
        es: "Lava bien con agua corriente las verduras y hierbas que se comen crudas.",
      },
    },
  ],
  substitutions: [],
};
