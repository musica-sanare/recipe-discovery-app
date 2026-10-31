import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "beef_komatsuna_udon",
  texts: {
    name: { ja: "牛肉と小松菜のうどん", en: "Udon with beef and komatsuna", es: "Udon con ternera y komatsuna", fr: "Udon au bœuf et au komatsuna" },
    summary: {
      ja: "しょうゆ味のつゆで牛もも肉と小松菜を煮て、うどんにのせます。",
      en: "Lean beef and komatsuna simmered in a soy-based broth and served over udon.",
      es: "Ternera magra y komatsuna cocidas en un caldo de soja y servidas sobre udon.",
      fr: "Bœuf maigre et komatsuna mijotés dans un bouillon à la sauce soja et servis sur des udon.",
    },
  },
  cuisine: "japanese",
  goals: ["bulk"],
  mainProteinGroup: "beef",
  tags: [],
  minutes: 15,
  effort: 1,
  equipment: ["stove", "pot"],
  servings: 1,
  ingredients: [
    { key: "beef", food: "beef_round", grams: 200, state: "boil", role: "main_protein", adjust: { kind: "grams", min: 140, max: 260, step: 20 } },
    {
      key: "udon",
      food: "udon_boiled",
      grams: 350,
      state: "as_is",
      measure: { unit: "piece", quantity: 1.5 },
      role: "main_carb",
      adjust: { kind: "grams", min: 200, max: 450, step: 50 },
      note: {
        ja: "ゆでうどん1玉約200〜250gです。",
        en: "One portion of pre-boiled udon is about 200–250 g.",
        es: "Una porción de udon precocido pesa unos 200-250 g.",
        fr: "Une portion d'udon précuites pèse environ 200 à 250 g.",
      },
    },
    { key: "komatsuna", food: "komatsuna", grams: 80, state: "boil", role: "vegetable" },
    { key: "soy_sauce", food: "soy_sauce", grams: 24, state: "as_is", measure: { unit: "tbsp", quantity: 4 / 3 }, role: "seasoning" },
    { key: "mirin", food: "mirin", grams: 18, state: "as_is", measure: { unit: "tbsp", quantity: 1 }, role: "seasoning" },
    { key: "long_onion", food: "long_onion", grams: 30, state: "raw", role: "vegetable" },
  ],
  sides: [],
  steps: [
    {
      key: "prep",
      text: {
        ja: "牛肉を食べやすい大きさに切ります。小松菜は5cm長さに、長ねぎは斜め薄切りにします。",
        en: "Cut the beef into bite-size pieces. Cut the komatsuna into 5 cm lengths and thinly slice the long onion on the diagonal.",
        es: "Corta la ternera en trozos pequeños. Corta la komatsuna en trozos de 5 cm y el puerro japonés en láminas finas en diagonal.",
        fr: "Coupez le bœuf en bouchées. Coupez le komatsuna en tronçons de 5 cm et émincez finement le poireau japonais en biais.",
      },
    },
    {
      key: "broth",
      text: {
        ja: "鍋に水450mL、しょうゆ、みりんを入れて中火で煮立て、牛肉を入れて色が完全に変わるまで2分煮ます。アクを取ります。",
        en: "Bring 450 mL of water, the soy sauce, and mirin to a boil in a pot over medium heat, add the beef, and simmer for 2 minutes until it has changed color completely. Skim off the foam.",
        es: "Lleva a ebullición 450 mL de agua, la salsa de soja y el mirin en una olla a fuego medio, añade la ternera y cuécela 2 minutos hasta que cambie de color por completo. Retira la espuma.",
        fr: "Portez à ébullition 450 mL d'eau, la sauce soja et le mirin dans une casserole à feu moyen, ajoutez le bœuf et laissez mijoter 2 minutes, jusqu'à ce qu'il ait complètement changé de couleur. Écumez.",
      },
    },
    {
      key: "udon",
      text: {
        ja: "うどん、小松菜、長ねぎを加えて2分煮ます。",
        en: "Add the udon, komatsuna, and long onion and simmer for 2 minutes.",
        es: "Añade el udon, la komatsuna y el puerro japonés y cuece 2 minutos.",
        fr: "Ajoutez les udon, le komatsuna et le poireau japonais et laissez mijoter 2 minutes.",
      },
    },
    {
      key: "serve",
      text: {
        ja: "どんぶりに盛ります。",
        en: "Transfer to a bowl.",
        es: "Sírvelo en un cuenco.",
        fr: "Servez dans un bol.",
      },
    },
  ],
  safetyNotes: [
    {
      key: "beef_doneness",
      text: {
        ja: "牛肉は赤い部分がなくなるまで煮てください。",
        en: "Simmer the beef until no red remains.",
        es: "Cuece la ternera hasta que no quede nada rojo.",
        fr: "Faites mijoter le bœuf jusqu'à ce qu'il ne reste plus de rouge.",
      },
    },
  ],
  substitutions: [],
};
