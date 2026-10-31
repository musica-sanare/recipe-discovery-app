import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "pork_leg_sprout_garlic",
  texts: {
    name: { ja: "豚もも肉ともやしのにんにく炒め", en: "Garlic pork and bean sprout stir-fry", es: "Salteado de cerdo y brotes de soja al ajo", fr: "Sauté de porc et pousses de soja à l'ail" },
    summary: {
      ja: "脂の少ない豚もも肉ともやしを、にんにくとしょうゆで手早く炒めます。ご飯を添えます。",
      en: "Lean pork leg and bean sprouts quickly stir-fried with garlic and soy sauce, with rice.",
      es: "Pierna de cerdo magra y brotes de soja salteados rápidamente con ajo y salsa de soja, con arroz.",
      fr: "Jambon de porc maigre et pousses de soja sautés rapidement à l'ail et à la sauce soja, avec du riz.",
    },
  },
  cuisine: "chinese",
  goals: ["cut"],
  mainProteinGroup: "pork",
  tags: [],
  minutes: 12,
  effort: 1,
  equipment: ["stove", "frying_pan"],
  servings: 1,
  ingredients: [
    {
      key: "pork",
      food: "pork_leg",
      grams: 160,
      state: "raw",
      cooking: "stir_fry",
      role: "main_protein",
      adjust: { kind: "grams", min: 120, max: 240, step: 10 },
      note: {
        ja: "成分表に炒めた豚もも肉の値がないため、生の値で計算しています。",
        en: "The tables have no value for stir-fried pork leg, so the raw value is used.",
        es: "Las tablas no tienen un valor para la pierna de cerdo salteada, así que se usa el valor en crudo.",
        fr: "Les tables n'ont pas de valeur pour le jambon de porc frais sauté ; la valeur à l'état cru est donc utilisée.",
      },
    },
    { key: "oil_pork", food: "vegetable_oil", grams: 2, state: "as_is", measure: { unit: "tsp", quantity: 0.5 }, role: "fat", linkedTo: "pork" },
    { key: "bean_sprouts", food: "bean_sprouts", grams: 150, state: "stir_fry", role: "vegetable" },
    { key: "oil_sprouts", food: "vegetable_oil", grams: 7.5, state: "as_is", role: "fat", includedIn: "bean_sprouts" },
    { key: "garlic", food: "garlic", grams: 10, state: "raw", measure: { unit: "clove", quantity: 2 }, role: "seasoning", linkedTo: "pork" },
    { key: "soy_sauce", food: "soy_sauce", grams: 12, state: "as_is", measure: { unit: "tsp", quantity: 2 }, role: "seasoning", linkedTo: "pork" },
    { key: "pepper", food: "black_pepper", grams: 0.2, state: "as_is", measure: { unit: "pinch", quantity: 1 }, role: "seasoning", linkedTo: "pork" },
    { key: "green_onion", food: "green_onion", grams: 5, state: "raw", role: "vegetable" },
    { key: "rice", food: "rice_cooked", grams: 180, state: "as_is", role: "main_carb", adjust: { kind: "grams", min: 100, max: 300, step: 10 } },
  ],
  sides: [
    { key: "rice", label: { ja: "ご飯", en: "Rice", es: "Arroz", fr: "Riz" }, ingredients: ["rice"], solverMayRemove: true },
  ],
  steps: [
    {
      key: "prep",
      text: {
        ja: "豚肉を細切りにし、にんにくは薄切りにします。",
        en: "Cut the pork into thin strips and thinly slice the garlic.",
        es: "Corta el cerdo en tiras finas y el ajo en láminas finas.",
        fr: "Coupez le porc en fines lanières et émincez finement l'ail.",
      },
    },
    {
      key: "pork",
      text: {
        ja: "フライパンに豚肉用の油とにんにくを入れて中火にかけ、豚肉を色が完全に変わるまで炒めて取り出します。",
        en: "Put the oil for the pork and the garlic in a frying pan over medium heat, stir-fry the pork until it has changed color completely, and set it aside.",
        es: "Pon el aceite del cerdo y el ajo en una sartén a fuego medio, saltea el cerdo hasta que cambie de color por completo y resérvalo.",
        fr: "Mettez l'huile du porc et l'ail dans une poêle à feu moyen, faites sauter le porc jusqu'à ce qu'il ait complètement changé de couleur et réservez-le.",
      },
    },
    {
      key: "sprouts",
      text: {
        ja: "もやし用の油を足して強めの中火にし、もやしを1分炒めます。豚肉を戻し、しょうゆとこしょうで味を付けます。",
        en: "Add the oil for the bean sprouts, turn to medium-high heat, and stir-fry the sprouts for 1 minute. Return the pork and season with soy sauce and pepper.",
        es: "Añade el aceite de los brotes, sube a fuego medio-alto y saltea los brotes 1 minuto. Devuelve el cerdo y sazona con salsa de soja y pimienta.",
        fr: "Ajoutez l'huile des pousses de soja, passez à feu moyen-vif et faites sauter les pousses 1 minute. Remettez le porc et assaisonnez de sauce soja et de poivre.",
      },
    },
    {
      key: "serve",
      text: {
        ja: "器に盛り、小口切りの青ねぎを散らします。",
        en: "Transfer to a plate and scatter the thinly sliced green onion.",
        es: "Sírvelo en un plato y esparce la cebolleta en rodajas finas.",
        fr: "Dressez sur une assiette et parsemez d'oignon vert finement émincé.",
      },
    },
  ],
  safetyNotes: [
    {
      key: "pork_doneness",
      text: {
        ja: "豚肉は中心まで火を通してください。切り口に赤みがないことを確認します。",
        en: "Cook the pork through. Check that no pink remains when you cut it.",
        es: "Cocina bien el cerdo. Comprueba que no quede nada rosado al cortarlo.",
        fr: "Faites cuire le porc à cœur. Vérifiez qu'il ne reste pas de rose à la découpe.",
      },
    },
  ],
  substitutions: [],
};
