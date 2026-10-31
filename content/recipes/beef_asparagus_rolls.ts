import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "beef_asparagus_rolls",
  texts: {
    name: { ja: "牛もも肉のアスパラ巻き照り焼き", en: "Teriyaki beef and asparagus rolls", es: "Rollitos de ternera y espárragos al teriyaki" },
    summary: {
      ja: "ゆでたアスパラガスを薄切りの牛もも肉で巻いて焼き、しょうゆとみりんの照り焼きだれをからめます。ご飯を添えます。",
      en: "Boiled asparagus rolled in thin slices of lean beef, pan-fried and glazed with a soy sauce and mirin teriyaki sauce, with rice.",
      es: "Espárragos hervidos envueltos en lonchas finas de ternera magra, hechos en la sartén y glaseados con una salsa teriyaki de soja y mirin, con arroz.",
    },
  },
  cuisine: "japanese",
  goals: ["cut"],
  mainProteinGroup: "beef",
  tags: [],
  minutes: 15,
  effort: 2,
  equipment: ["stove", "frying_pan", "pot"],
  servings: 1,
  ingredients: [
    {
      key: "beef",
      food: "beef_round",
      grams: 180,
      state: "raw",
      cooking: "saute",
      role: "main_protein",
      adjust: { kind: "grams", min: 140, max: 220, step: 20 },
      note: {
        ja: "成分表にフライパンで焼いた牛もも肉の値がないため、生の値で計算しています。",
        en: "The tables have no value for pan-fried beef round, so the raw value is used.",
        es: "Las tablas no tienen un valor para la ternera de pierna hecha en la sartén, así que se usa el valor en crudo.",
      },
    },
    { key: "asparagus", food: "asparagus", grams: 100, state: "boil", measure: { unit: "stalk", quantity: 5 }, role: "vegetable" },
    { key: "oil", food: "vegetable_oil", grams: 1, state: "as_is", role: "fat" },
    { key: "soy_sauce", food: "soy_sauce", grams: 9, state: "as_is", measure: { unit: "tsp", quantity: 1.5 }, role: "seasoning", linkedTo: "beef" },
    { key: "mirin", food: "mirin", grams: 9, state: "as_is", measure: { unit: "tsp", quantity: 1.5 }, role: "seasoning", linkedTo: "beef" },
    { key: "sugar", food: "sugar", grams: 2, state: "as_is", role: "seasoning", linkedTo: "beef" },
    { key: "rice", food: "rice_cooked", grams: 180, state: "as_is", role: "main_carb", adjust: { kind: "grams", min: 150, max: 240, step: 30 } },
  ],
  sides: [
    { key: "rice", label: { ja: "ご飯", en: "Rice", es: "Arroz" }, ingredients: ["rice"], solverMayRemove: true },
  ],
  steps: [
    {
      key: "asparagus",
      text: {
        ja: "アスパラガスの根元の硬い部分を落とし、熱湯で1分ほどゆでて水気を切り、半分の長さに切ります。",
        en: "Trim the tough ends of the asparagus, boil it for about 1 minute, drain, and cut it in half.",
        es: "Corta la parte dura de los espárragos, hiérvelos aproximadamente 1 minuto, escúrrelos y córtalos por la mitad.",
      },
    },
    {
      key: "roll",
      text: {
        ja: "薄切りの牛もも肉を広げ、アスパラガスを2〜3本ずつのせて巻きます。",
        en: "Spread out the thin slices of beef, put 2–3 pieces of asparagus on each, and roll them up.",
        es: "Extiende las lonchas finas de ternera, pon 2-3 trozos de espárrago en cada una y enróllalas.",
      },
    },
    {
      key: "fry",
      text: {
        ja: "フライパンに油を薄くひいて中火で熱し、巻き終わりを下にして並べ、転がしながら4〜5分、赤い部分がなくなるまで焼きます。しょうゆ、みりん、砂糖を加えて煮からめます。",
        en: "Lightly oil a frying pan, heat it over medium heat, and place the rolls seam side down. Cook for 4–5 minutes, turning them, until no red remains. Add the soy sauce, mirin, and sugar and toss to glaze.",
        es: "Unta ligeramente una sartén con aceite, caliéntala a fuego medio y coloca los rollitos con el cierre hacia abajo. Cocínalos 4-5 minutos, dándoles la vuelta, hasta que no quede nada rojo. Añade la salsa de soja, el mirin y el azúcar y remueve para glasearlos.",
      },
    },
    {
      key: "serve",
      text: { ja: "器に盛ります。", en: "Plate them.", es: "Sírvelos en un plato." },
    },
    {
      key: "rice",
      side: "rice",
      text: { ja: "ご飯を添えます。", en: "Serve with the rice.", es: "Acompáñalo con el arroz." },
    },
  ],
  safetyNotes: [
    {
      key: "beef_doneness",
      text: {
        ja: "薄切りの牛肉は、赤い部分がなくなるまで焼いてください。",
        en: "Cook the beef slices until no red remains.",
        es: "Cocina las lonchas de ternera hasta que no quede nada rojo.",
      },
    },
    {
      key: "hot_water",
      text: {
        ja: "熱湯を扱うときは、やけどに注意してください。",
        en: "Take care not to scald yourself with the boiling water.",
        es: "Ten cuidado de no quemarte con el agua hirviendo.",
      },
    },
  ],
  substitutions: [],
};
