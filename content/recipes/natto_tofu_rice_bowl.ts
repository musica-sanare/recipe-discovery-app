import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "natto_tofu_rice_bowl",
  texts: {
    name: { ja: "納豆と豆腐のねぎ和え丼", en: "Natto and tofu rice bowl with green onion", es: "Bol de arroz con natto, tofu y cebolleta" },
    summary: {
      ja: "火を使わず、納豆と木綿豆腐を青ねぎとしょうゆで和えて、ご飯にのせます。",
      en: "No cooking needed: natto and firm tofu tossed with green onion and soy sauce, served over rice.",
      es: "Sin cocinar: natto y tofu firme mezclados con cebolleta y salsa de soja, servidos sobre arroz.",
    },
  },
  cuisine: "japanese",
  goals: ["maintain", "bulk"],
  mainProteinGroup: "soy",
  tags: ["no_cook", "breakfast"],
  minutes: 8,
  effort: 1,
  equipment: [],
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
    { key: "tofu", food: "tofu_firm", grams: 150, state: "raw", measure: { unit: "block", quantity: 0.5 }, role: "main_protein", adjust: { kind: "grams", min: 100, max: 300, step: 50 } },
    { key: "green_onion", food: "green_onion", grams: 10, state: "raw", role: "vegetable" },
    { key: "soy_sauce", food: "soy_sauce", grams: 8, state: "as_is", measure: { unit: "tsp", quantity: 1.5 }, role: "seasoning", linkedTo: "tofu" },
    { key: "rice", food: "rice_cooked", grams: 200, state: "as_is", role: "main_carb", adjust: { kind: "grams", min: 120, max: 300, step: 10 } },
  ],
  sides: [],
  steps: [
    {
      key: "prep",
      text: {
        ja: "木綿豆腐をキッチンペーパーで包んで5分置き、水気を切って1.5cm角に切ります。青ねぎは小口切りにします。",
        en: "Wrap the firm tofu in paper towels for 5 minutes to drain, then cut it into 1.5 cm cubes. Thinly slice the green onion.",
        es: "Envuelve el tofu firme en papel de cocina 5 minutos para escurrirlo y córtalo en dados de 1,5 cm. Corta la cebolleta en rodajas finas.",
      },
    },
    {
      key: "mix",
      text: {
        ja: "納豆をよく混ぜ、豆腐、青ねぎ、しょうゆを加えてさっくり和えます。",
        en: "Stir the natto well, then gently fold in the tofu, green onion, and soy sauce.",
        es: "Remueve bien el natto y mezcla con cuidado el tofu, la cebolleta y la salsa de soja.",
      },
    },
    {
      key: "serve",
      text: {
        ja: "ご飯にのせます。",
        en: "Spoon over the rice.",
        es: "Sírvelo sobre el arroz.",
      },
    },
  ],
  safetyNotes: [],
  substitutions: [
    {
      key: "silken_tofu",
      ingredient: "tofu",
      food: "tofu_silken",
      state: "raw",
      ratio: 1,
      note: {
        ja: "絹ごし豆腐にすると、口当たりがやわらかくなります。",
        en: "Silken tofu gives a softer texture.",
        es: "El tofu sedoso da una textura más suave.",
      },
    },
  ],
};
