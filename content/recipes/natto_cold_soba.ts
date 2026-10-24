import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "natto_cold_soba",
  texts: {
    name: { ja: "納豆と小松菜の冷たいそば", en: "Cold soba with natto and komatsuna", es: "Soba fría con natto y komatsuna" },
    summary: {
      ja: "冷やしたそばに、納豆とゆでた小松菜をのせて、しょうゆとみりんのつゆをかけます。",
      en: "Chilled soba topped with natto and blanched komatsuna, with a soy and mirin dressing.",
      es: "Soba fría con natto y komatsuna escaldada, con un aliño de salsa de soja y mirin.",
    },
  },
  cuisine: "japanese",
  goals: ["maintain"],
  mainProteinGroup: "soy",
  tags: [],
  minutes: 15,
  effort: 1,
  equipment: ["stove", "pot"],
  servings: 1,
  ingredients: [
    {
      key: "natto",
      food: "natto",
      grams: 90,
      state: "as_is",
      role: "main_protein",
      adjust: { kind: "count", unitGrams: 45, min: 1, max: 3 },
      note: {
        ja: "1パック約45gです。",
        en: "About 45 g per pack.",
        es: "Unos 45 g por envase.",
      },
    },
    {
      key: "soba",
      food: "soba_boiled",
      grams: 250,
      state: "as_is",
      measure: { unit: "piece", quantity: 1.5 },
      role: "main_carb",
      adjust: { kind: "grams", min: 150, max: 350, step: 50 },
      note: {
        ja: "ゆでそばの重さです（1玉約170g）。乾麺を使う場合は、ゆで上がりの重さで考えてください。",
        en: "Weight of boiled soba (about 170 g per portion). If you use dried soba, use the boiled weight.",
        es: "Peso de la soba cocida (unos 170 g por porción). Si usas soba seca, ten en cuenta el peso ya cocido.",
      },
    },
    { key: "komatsuna", food: "komatsuna", grams: 60, state: "boil", role: "vegetable" },
    { key: "soy_sauce", food: "soy_sauce", grams: 18, state: "as_is", measure: { unit: "tbsp", quantity: 1 }, role: "seasoning" },
    { key: "mirin", food: "mirin", grams: 12, state: "as_is", measure: { unit: "tsp", quantity: 2 }, role: "seasoning" },
    { key: "green_onion", food: "green_onion", grams: 5, state: "raw", role: "vegetable" },
  ],
  sides: [],
  steps: [
    {
      key: "dressing",
      text: {
        ja: "小鍋にしょうゆ、みりん、水60mLを入れてひと煮立ちさせ、冷まします。",
        en: "Bring the soy sauce, mirin, and 60 mL of water to a boil in a small pot, then let it cool.",
        es: "Lleva a ebullición la salsa de soja, el mirin y 60 mL de agua en un cazo pequeño y deja que se enfríe.",
      },
    },
    {
      key: "komatsuna",
      text: {
        ja: "小松菜を1分ゆでて水にとり、水気を絞って4cm長さに切ります。",
        en: "Boil the komatsuna for 1 minute, cool it in water, squeeze it dry, and cut it into 4 cm lengths.",
        es: "Hierve la komatsuna 1 minuto, enfríala en agua, escúrrela bien y córtala en trozos de 4 cm.",
      },
    },
    {
      key: "soba",
      text: {
        ja: "そばを湯通しして冷水でしめ、水気をよく切ります。",
        en: "Dip the soba briefly in boiling water, rinse it in cold water, and drain well.",
        es: "Pasa la soba un momento por agua hirviendo, acláralo con agua fría y escúrrelo bien.",
      },
    },
    {
      key: "serve",
      text: {
        ja: "器にそばを盛り、よく混ぜた納豆と小松菜、小口切りの青ねぎをのせて、つゆをかけます。",
        en: "Put the soba in a bowl, top with the well-stirred natto, the komatsuna, and the thinly sliced green onion, and pour over the dressing.",
        es: "Pon la soba en un cuenco, cubre con el natto bien removido, la komatsuna y la cebolleta en rodajas finas, y vierte el aliño.",
      },
    },
  ],
  safetyNotes: [
    {
      key: "buckwheat",
      text: {
        ja: "そばは重いアレルギー症状を起こすことがある食品です。そばを扱った調理器具や湯にも注意してください。",
        en: "Buckwheat can cause severe allergic reactions. Take care with pots, utensils, and water that have been used for soba.",
        es: "El alforfón puede causar reacciones alérgicas graves. Ten cuidado con las ollas, los utensilios y el agua que se hayan usado para la soba.",
      },
    },
  ],
  substitutions: [],
};
