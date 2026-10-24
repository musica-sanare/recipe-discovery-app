import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "tofu_komatsuna_ankake_bowl",
  texts: {
    name: { ja: "豆腐と小松菜のあんかけ丼", en: "Tofu and komatsuna rice bowl with savory glaze", es: "Bol de arroz con tofu y komatsuna en salsa espesa" },
    summary: {
      ja: "木綿豆腐と小松菜を、しょうがの効いたとろみのあんで煮て、ご飯にかけます。",
      en: "Firm tofu and komatsuna simmered in a thickened ginger sauce and poured over rice.",
      es: "Tofu firme y komatsuna cocidos en una salsa espesa de jengibre y servidos sobre arroz.",
    },
  },
  cuisine: "japanese",
  goals: ["maintain"],
  mainProteinGroup: "soy",
  tags: [],
  minutes: 15,
  effort: 1,
  equipment: ["stove", "frying_pan"],
  servings: 1,
  ingredients: [
    {
      key: "tofu",
      food: "tofu_firm",
      grams: 350,
      state: "raw",
      cooking: "simmer",
      measure: { unit: "block", quantity: 7 / 6 },
      role: "main_protein",
      adjust: { kind: "grams", min: 200, max: 450, step: 50 },
      note: {
        ja: "成分表に加熱した豆腐の値がないため、加熱前の値で計算しています。",
        en: "The tables have no value for cooked tofu, so the uncooked value is used.",
        es: "Las tablas no tienen un valor para el tofu cocinado, así que se usa el valor sin cocinar.",
      },
    },
    { key: "komatsuna", food: "komatsuna", grams: 100, state: "boil", role: "vegetable" },
    { key: "ginger", food: "ginger", grams: 5, state: "raw", measure: { unit: "knob", quantity: 0.5 }, role: "seasoning" },
    { key: "soy_sauce", food: "soy_sauce", grams: 12, state: "as_is", measure: { unit: "tsp", quantity: 2 }, role: "seasoning", linkedTo: "tofu" },
    { key: "mirin", food: "mirin", grams: 12, state: "as_is", measure: { unit: "tsp", quantity: 2 }, role: "seasoning", linkedTo: "tofu" },
    { key: "starch", food: "potato_starch", grams: 6, state: "as_is", measure: { unit: "tsp", quantity: 2 }, role: "seasoning", linkedTo: "tofu" },
    { key: "rice", food: "rice_cooked", grams: 200, state: "as_is", role: "main_carb", adjust: { kind: "grams", min: 120, max: 300, step: 10 } },
  ],
  sides: [],
  steps: [
    {
      key: "prep",
      text: {
        ja: "木綿豆腐を2cm角に切ります。小松菜は塩を入れない湯で1分ゆでて水気を絞り、4cm長さに切ります。しょうがはすりおろします。",
        en: "Cut the firm tofu into 2 cm cubes. Boil the komatsuna in unsalted water for 1 minute, squeeze it dry, and cut it into 4 cm lengths. Grate the ginger.",
        es: "Corta el tofu firme en dados de 2 cm. Hierve la komatsuna en agua sin sal 1 minuto, escúrrela bien y córtala en trozos de 4 cm. Ralla el jengibre.",
      },
    },
    {
      key: "simmer",
      text: {
        ja: "フライパンに水200mL、しょうゆ、みりん、しょうがを入れて中火で煮立て、豆腐を入れて3分煮ます。",
        en: "Bring 200 mL of water, the soy sauce, mirin, and ginger to a boil in a frying pan over medium heat, add the tofu, and simmer for 3 minutes.",
        es: "Lleva a ebullición 200 mL de agua, la salsa de soja, el mirin y el jengibre en una sartén a fuego medio, añade el tofu y cuece 3 minutos.",
      },
    },
    {
      key: "thicken",
      text: {
        ja: "小松菜を加え、同量の水で溶いた片栗粉を回し入れて、とろみがつくまで混ぜます。",
        en: "Add the komatsuna, then stir in the potato starch mixed with the same amount of water until the sauce thickens.",
        es: "Añade la komatsuna y luego la fécula disuelta en la misma cantidad de agua, removiendo hasta que la salsa espese.",
      },
    },
    {
      key: "serve",
      text: {
        ja: "ご飯にかけます。",
        en: "Pour over the rice.",
        es: "Viértelo sobre el arroz.",
      },
    },
  ],
  safetyNotes: [],
  substitutions: [],
};
