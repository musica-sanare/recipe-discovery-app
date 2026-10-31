import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "soy_milk_udon_tofu",
  texts: {
    name: { ja: "豆腐とほうれん草の豆乳うどん", en: "Soy milk udon with tofu and spinach", es: "Udon en caldo de soja con tofu y espinacas", fr: "Udon au lait de soja, au tofu et aux épinards" },
    summary: {
      ja: "無調整豆乳を使ったまろやかなつゆで、うどんと豆腐、ほうれん草を温めます。",
      en: "Udon, tofu, and spinach warmed in a mellow broth made with unsweetened soy milk.",
      es: "Udon, tofu y espinacas calentados en un caldo suave hecho con bebida de soja sin azúcar.",
      fr: "Udon, tofu et épinards réchauffés dans un bouillon doux à la boisson au soja nature.",
    },
  },
  cuisine: "japanese",
  goals: ["maintain", "bulk"],
  mainProteinGroup: "soy",
  tags: [],
  minutes: 15,
  effort: 1,
  equipment: ["stove", "pot"],
  servings: 1,
  ingredients: [
    {
      key: "tofu",
      food: "tofu_firm",
      grams: 200,
      state: "raw",
      cooking: "simmer",
      measure: { unit: "block", quantity: 2 / 3 },
      role: "main_protein",
      adjust: { kind: "grams", min: 150, max: 300, step: 50 },
      note: {
        ja: "成分表に加熱した豆腐の値がないため、加熱前の値で計算しています。",
        en: "The tables have no value for cooked tofu, so the uncooked value is used.",
        es: "Las tablas no tienen un valor para el tofu cocinado, así que se usa el valor sin cocinar.",
        fr: "Les tables n'ont pas de valeur pour le tofu cuit ; la valeur avant cuisson est donc utilisée.",
      },
    },
    { key: "soy_milk", food: "soy_milk", grams: 300, state: "as_is", role: "main_protein", linkedTo: "tofu" },
    {
      key: "udon",
      food: "udon_boiled",
      grams: 250,
      state: "as_is",
      measure: { unit: "piece", quantity: 1 },
      role: "main_carb",
      adjust: { kind: "grams", min: 200, max: 400, step: 50 },
      note: {
        ja: "ゆでうどん1玉約200〜250gです。",
        en: "One portion of pre-boiled udon is about 200–250 g.",
        es: "Una porción de udon precocido pesa unos 200-250 g.",
        fr: "Une portion d'udon précuites pèse environ 200 à 250 g.",
      },
    },
    { key: "spinach", food: "spinach", grams: 60, state: "boil", role: "vegetable" },
    { key: "soy_sauce", food: "soy_sauce", grams: 18, state: "as_is", measure: { unit: "tbsp", quantity: 1 }, role: "seasoning" },
    { key: "mirin", food: "mirin", grams: 9, state: "as_is", measure: { unit: "tsp", quantity: 1.5 }, role: "seasoning" },
    { key: "green_onion", food: "green_onion", grams: 5, state: "raw", role: "vegetable" },
  ],
  sides: [],
  steps: [
    {
      key: "prep",
      text: {
        ja: "ほうれん草をゆでて水にとり、水気を絞って4cm長さに切ります。木綿豆腐は2cm角に切ります。",
        en: "Boil the spinach, cool it in water, squeeze it dry, and cut it into 4 cm lengths. Cut the firm tofu into 2 cm cubes.",
        es: "Hierve las espinacas, enfríalas en agua, exprímelas bien y córtalas en trozos de 4 cm. Corta el tofu firme en dados de 2 cm.",
        fr: "Faites bouillir les épinards, refroidissez-les dans l'eau, pressez-les et coupez-les en tronçons de 4 cm. Coupez le tofu ferme en cubes de 2 cm.",
      },
    },
    {
      key: "broth",
      text: {
        ja: "鍋に水100mL、しょうゆ、みりんを入れて中火にかけ、煮立ったらうどんと豆腐を入れて2分煮ます。",
        en: "Bring 100 mL of water, the soy sauce, and mirin to a boil in a pot over medium heat, then add the udon and tofu and simmer for 2 minutes.",
        es: "Lleva a ebullición 100 mL de agua, la salsa de soja y el mirin en una olla a fuego medio, añade el udon y el tofu y cuece 2 minutos.",
        fr: "Portez à ébullition 100 mL d'eau, la sauce soja et le mirin dans une casserole à feu moyen, puis ajoutez les udon et le tofu et laissez mijoter 2 minutes.",
      },
    },
    {
      key: "soy_milk",
      text: {
        ja: "弱火にして豆乳を加え、煮立たせないように温めます。",
        en: "Turn to low heat, add the soy milk, and warm it through without letting it boil.",
        es: "Baja a fuego bajo, añade la bebida de soja y caliéntala sin que llegue a hervir.",
        fr: "Passez à feu doux, ajoutez la boisson au soja et réchauffez sans laisser bouillir.",
      },
    },
    {
      key: "serve",
      text: {
        ja: "器に盛り、ほうれん草と小口切りの青ねぎをのせます。",
        en: "Transfer to a bowl and top with the spinach and thinly sliced green onion.",
        es: "Sírvelo en un cuenco y cubre con las espinacas y la cebolleta en rodajas finas.",
        fr: "Servez dans un bol et garnissez d'épinards et d'oignon vert finement émincé.",
      },
    },
  ],
  safetyNotes: [],
  substitutions: [],
};
