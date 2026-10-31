import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "beef_shabu_lemon_soy",
  texts: {
    name: { ja: "牛もものしゃぶしゃぶ レモンじょうゆ", en: "Beef round shabu-shabu with lemon soy sauce", es: "Shabu-shabu de ternera magra con salsa de soja y limón", fr: "Shabu-shabu de bœuf maigre, sauce soja au citron" },
    summary: {
      ja: "薄切りの牛もも肉と小松菜をさっとゆでて、レモンじょうゆで食べます。ご飯を添えます。",
      en: "Thinly sliced lean beef and komatsuna briefly boiled and dipped in lemon soy sauce, with rice.",
      es: "Ternera magra en lonchas finas y komatsuna hervidas brevemente, con salsa de soja y limón y arroz.",
      fr: "Fines tranches de bœuf maigre et komatsuna pochés brièvement, à tremper dans une sauce soja au citron, avec du riz.",
    },
  },
  cuisine: "japanese",
  goals: ["cut"],
  mainProteinGroup: "beef",
  tags: [],
  minutes: 15,
  effort: 1,
  equipment: ["stove", "pot"],
  servings: 1,
  ingredients: [
    { key: "beef", food: "beef_round", grams: 160, state: "boil", role: "main_protein", adjust: { kind: "grams", min: 120, max: 240, step: 10 } },
    { key: "komatsuna", food: "komatsuna", grams: 100, state: "boil", role: "vegetable" },
    { key: "soy_sauce", food: "soy_sauce", grams: 12, state: "as_is", measure: { unit: "tsp", quantity: 2 }, role: "seasoning", linkedTo: "beef" },
    { key: "lemon_juice", food: "lemon_juice", grams: 10, state: "as_is", measure: { unit: "tsp", quantity: 2 }, role: "seasoning", linkedTo: "beef" },
    { key: "green_onion", food: "green_onion", grams: 5, state: "raw", role: "vegetable" },
    { key: "rice", food: "rice_cooked", grams: 150, state: "as_is", role: "main_carb", adjust: { kind: "grams", min: 100, max: 300, step: 10 } },
  ],
  sides: [
    { key: "rice", label: { ja: "ご飯", en: "Rice", es: "Arroz", fr: "Riz" }, ingredients: ["rice"], solverMayRemove: true },
  ],
  steps: [
    {
      key: "prep",
      text: {
        ja: "小松菜を5cm長さに切ります。しょうゆとレモン汁を混ぜてたれを作り、小口切りの青ねぎを加えます。",
        en: "Cut the komatsuna into 5 cm lengths. Mix the soy sauce and lemon juice for the dipping sauce and add the thinly sliced green onion.",
        es: "Corta la komatsuna en trozos de 5 cm. Mezcla la salsa de soja y el zumo de limón para la salsa y añade la cebolleta en rodajas finas.",
        fr: "Coupez le komatsuna en tronçons de 5 cm. Mélangez la sauce soja et le jus de citron pour la sauce et ajoutez l'oignon vert finement émincé.",
      },
    },
    {
      key: "komatsuna",
      text: {
        ja: "鍋にたっぷりの湯を沸かし、小松菜を1分ゆでて取り出し、水気を絞ります。",
        en: "Bring plenty of water to a boil in a pot, boil the komatsuna for 1 minute, take it out, and squeeze it dry.",
        es: "Lleva a ebullición abundante agua en una olla, hierve la komatsuna 1 minuto, sácala y escúrrela bien.",
        fr: "Portez une grande quantité d'eau à ébullition dans une casserole, faites-y bouillir le komatsuna 1 minute, retirez-le et pressez-le bien.",
      },
    },
    {
      key: "beef",
      text: {
        ja: "弱めの中火にして、牛肉を1枚ずつ湯に入れ、色が完全に変わるまでゆでて取り出します。",
        en: "Turn to medium-low heat, add the beef slices one at a time, and cook until they have changed color completely, then take them out.",
        es: "Baja a fuego medio-bajo, añade las lonchas de ternera de una en una y cuécelas hasta que cambien de color por completo; después sácalas.",
        fr: "Passez à feu moyen-doux, ajoutez les tranches de bœuf une à une et faites-les cuire jusqu'à ce qu'elles aient complètement changé de couleur, puis retirez-les.",
      },
    },
    {
      key: "serve",
      text: {
        ja: "牛肉と小松菜を器に盛り、たれを添えます。",
        en: "Arrange the beef and komatsuna on a plate and serve with the dipping sauce.",
        es: "Coloca la ternera y la komatsuna en un plato y sírvelas con la salsa.",
        fr: "Disposez le bœuf et le komatsuna sur une assiette et servez avec la sauce.",
      },
    },
  ],
  safetyNotes: [
    {
      key: "beef_doneness",
      text: {
        ja: "薄切りの牛肉は、赤い部分がなくなるまでゆでてください。",
        en: "Cook the beef slices until no red remains.",
        es: "Cuece las lonchas de ternera hasta que no quede nada rojo.",
        fr: "Faites cuire les tranches de bœuf jusqu'à ce qu'il ne reste plus de rouge.",
      },
    },
  ],
  substitutions: [],
};
