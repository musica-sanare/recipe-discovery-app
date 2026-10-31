import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "sardine_kabayaki_rice",
  texts: {
    name: { ja: "いわしの蒲焼き丼", en: "Sardine kabayaki rice bowl", es: "Bol de arroz con sardinas kabayaki" },
    summary: {
      ja: "開いたいわしに片栗粉をまぶしてフライパンで焼き、甘辛いたれをからめてご飯にのせます。せん切りキャベツを添えます。",
      en: "Butterflied sardines dusted with potato starch, pan-fried, glazed with a sweet soy sauce, and served over rice with shredded cabbage.",
      es: "Sardinas abiertas espolvoreadas con fécula de patata, hechas en la sartén, glaseadas con salsa de soja dulce y servidas sobre arroz con col en tiras.",
    },
  },
  cuisine: "japanese",
  goals: ["bulk"],
  mainProteinGroup: "fish",
  tags: [],
  minutes: 20,
  effort: 2,
  equipment: ["stove", "frying_pan"],
  servings: 1,
  ingredients: [
    {
      key: "sardine",
      food: "sardine",
      grams: 240,
      state: "grill",
      cooking: "saute",
      measure: { unit: "piece", quantity: 4 },
      role: "main_protein",
      adjust: { kind: "grams", min: 180, max: 280, step: 20 },
      note: {
        ja: "成分表にフライパンで焼いたいわしの値がないため、丸ごと焼いた値で計算しています。焼いた後に頭や骨を除いた値なので、開いた身では近似になります。",
        en: "The tables have no value for pan-fried sardine, so the value for whole grilled sardine is used. That value is for the fish after removing the head and bones, so for butterflied fillets it is an approximation.",
        es: "Las tablas no tienen un valor para la sardina hecha en la sartén, así que se usa el valor de la sardina entera asada. Ese valor es el del pescado sin cabeza ni espinas tras asarlo, así que para la sardina abierta es una aproximación.",
      },
    },
    { key: "starch", food: "potato_starch", grams: 6, state: "as_is", measure: { unit: "tsp", quantity: 2 }, role: "coating", linkedTo: "sardine" },
    { key: "oil", food: "vegetable_oil", grams: 5, state: "as_is", measure: { unit: "tsp", quantity: 1.25 }, role: "fat", linkedTo: "sardine" },
    { key: "soy_sauce", food: "soy_sauce", grams: 12, state: "as_is", measure: { unit: "tsp", quantity: 2 }, role: "seasoning", linkedTo: "sardine" },
    { key: "mirin", food: "mirin", grams: 12, state: "as_is", measure: { unit: "tsp", quantity: 2 }, role: "seasoning", linkedTo: "sardine" },
    { key: "sugar", food: "sugar", grams: 4, state: "as_is", role: "seasoning", linkedTo: "sardine" },
    { key: "cabbage", food: "cabbage", grams: 50, state: "raw", role: "vegetable" },
    { key: "rice", food: "rice_cooked", grams: 240, state: "as_is", role: "main_carb", adjust: { kind: "grams", min: 160, max: 280, step: 40 } },
  ],
  sides: [],
  steps: [
    {
      key: "prep",
      text: {
        ja: "いわしは頭と内臓を除いて手開きにし、中骨を取ります。水気を拭いて片栗粉を薄くまぶします。しょうゆ、みりん、砂糖を混ぜておきます。キャベツはせん切りにします。",
        en: "Remove the heads and guts of the sardines, open them by hand, and take out the backbones. Pat them dry and dust lightly with the potato starch. Mix the soy sauce, mirin, and sugar. Shred the cabbage.",
        es: "Quita la cabeza y las tripas a las sardinas, ábrelas con las manos y retira la espina central. Sécalas y espolvoréalas ligeramente con la fécula. Mezcla la salsa de soja, el mirin y el azúcar. Corta la col en tiras finas.",
      },
    },
    {
      key: "fry",
      text: {
        ja: "フライパンに油を中火で熱し、いわしを身の側から2〜3分焼き、裏返して2分焼きます。たれを加えて煮からめます。",
        en: "Heat the oil in a frying pan over medium heat and cook the sardines flesh side down for 2–3 minutes, then turn and cook for 2 minutes. Add the sauce and toss to glaze.",
        es: "Calienta el aceite en una sartén a fuego medio y haz las sardinas por el lado de la carne 2-3 minutos; dales la vuelta y cocínalas 2 minutos más. Añade la salsa y remueve para glasearlas.",
      },
    },
    {
      key: "serve",
      text: {
        ja: "ご飯を器に盛り、キャベツといわしをのせ、残ったたれをかけます。",
        en: "Put the rice in a bowl, top with the cabbage and sardines, and pour the remaining sauce over.",
        es: "Pon el arroz en un bol, coloca encima la col y las sardinas y vierte el resto de la salsa.",
      },
    },
  ],
  safetyNotes: [
    {
      key: "fish_doneness",
      text: {
        ja: "魚は中心まで白く不透明になるまで焼いてください。",
        en: "Cook the fish until it is white and opaque in the center.",
        es: "Cocina el pescado hasta que esté blanco y opaco en el centro.",
      },
    },
    {
      key: "fish_bones",
      text: {
        ja: "開いたいわしにも小骨が残っていることがあります。食べるときは骨に注意してください。",
        en: "Butterflied sardines may still have small bones; take care when eating.",
        es: "Las sardinas abiertas pueden tener alguna espina pequeña; ten cuidado al comerlas.",
      },
    },
  ],
  substitutions: [],
};
