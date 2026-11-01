import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "maquereau_braise",
  texts: {
    name: { ja: "さばのブレゼ、トマトと玉ねぎのサルサ添え", en: "Grilled mackerel with tomato and onion salsa", es: "Caballa a la brasa con salsa de tomate y cebolla", fr: "Maquereau braisé, sauce tomate-oignon" },
    summary: {
      ja: "コートジボワールの焼き魚をヒントに、さばをトースターで焼き、トマト、玉ねぎ、ピーマン、しょうが、ライムの生のサルサをかけます。長粒米のご飯を添えます。",
      en: "Inspired by grilled fish from Côte d'Ivoire: mackerel grilled in a toaster oven and topped with a fresh salsa of tomato, onion, green pepper, ginger, and lime, with long-grain rice.",
      es: "Inspirado en el pescado a la brasa de Costa de Marfil: caballa asada en el horno tostador con una salsa fresca de tomate, cebolla, pimiento verde, jengibre y lima, con arroz largo.",
      fr: "Inspiré du poisson braisé ivoirien : maquereau grillé au four grille-pain, nappé d'une sauce crue de tomate, d'oignon, de poivron vert, de gingembre et de citron vert, avec du riz long.",
    },
  },
  cuisine: "west_african",
  goals: ["maintain"],
  mainProteinGroup: "fish",
  tags: [],
  minutes: 25,
  effort: 1,
  equipment: ["oven_toaster"],
  servings: 1,
  ingredients: [
    { key: "mackerel", food: "mackerel", grams: 100, state: "grill", measure: { unit: "piece", quantity: 1 }, role: "main_protein", adjust: { kind: "grams", min: 80, max: 140, step: 20 } },
    { key: "salt_fish", food: "salt", grams: 0.6, state: "as_is", measure: { unit: "pinch", quantity: 1 }, role: "seasoning", linkedTo: "mackerel" },
    { key: "tomato", food: "tomato", grams: 80, state: "raw", measure: { unit: "piece", quantity: 0.5 }, role: "vegetable" },
    { key: "onion", food: "onion", grams: 30, state: "raw", measure: { unit: "piece", quantity: 1 / 6 }, role: "vegetable" },
    { key: "green_pepper", food: "green_pepper", grams: 30, state: "raw", measure: { unit: "piece", quantity: 1 }, role: "vegetable" },
    { key: "ginger", food: "ginger", grams: 3, state: "raw", measure: { unit: "knob", quantity: 0.25 }, role: "seasoning" },
    { key: "garlic", food: "garlic", grams: 2, state: "raw", measure: { unit: "clove", quantity: 0.5 }, role: "seasoning" },
    { key: "lime", food: "lime_juice", grams: 10, state: "as_is", measure: { unit: "tsp", quantity: 2 }, role: "seasoning" },
    { key: "chili", food: "chili_pepper_powder", grams: 0.2, state: "as_is", measure: { unit: "pinch", quantity: 1 }, role: "seasoning" },
    { key: "salt", food: "salt", grams: 0.4, state: "as_is", measure: { unit: "pinch", quantity: 1 }, role: "seasoning" },
    { key: "rice", food: "indica_rice_cooked", grams: 200, state: "as_is", role: "main_carb", adjust: { kind: "grams", min: 100, max: 250, step: 50 } },
  ],
  sides: [{ key: "rice", label: { ja: "長粒米のご飯", en: "Long-grain rice", es: "Arroz largo", fr: "Riz long" }, ingredients: ["rice"], solverMayRemove: true }],
  steps: [
    {
      key: "grill",
      text: {
        ja: "さばに塩をふって10分置き、出てきた水気を拭きます。アルミホイルにのせ、トースターで12〜15分焼きます。",
        en: "Salt the mackerel, leave it for 10 minutes, and pat off the moisture. Place it on foil and grill in a toaster oven for 12 to 15 minutes.",
        es: "Sala la caballa, déjala 10 minutos y sécala. Colócala sobre papel de aluminio y ásala en el horno tostador de 12 a 15 minutos.",
        fr: "Salez le maquereau, laissez-le reposer 10 minutes et épongez-le. Posez-le sur du papier aluminium et faites-le griller 12 à 15 minutes au four grille-pain.",
      },
    },
    {
      key: "salsa",
      text: {
        ja: "トマト、玉ねぎ、ピーマンは5mm角に切り、しょうがとにんにくはすりおろします。ライム果汁、一味唐辛子、塩と混ぜます。",
        en: "Cut the tomato, onion, and green pepper into 5 mm dice and grate the ginger and garlic. Mix with the lime juice, ground chili pepper, and salt.",
        es: "Corta el tomate, la cebolla y el pimiento verde en dados de 5 mm y ralla el jengibre y el ajo. Mézclalos con el zumo de lima, la guindilla molida y la sal.",
        fr: "Coupez la tomate, l'oignon et le poivron vert en dés de 5 mm et râpez le gingembre et l'ail. Mélangez avec le jus de citron vert, le piment moulu et le sel.",
      },
    },
    {
      key: "serve",
      text: {
        ja: "焼いたさばにサルサをかけます。",
        en: "Spoon the salsa over the grilled mackerel.",
        es: "Sirve la caballa asada con la salsa por encima.",
        fr: "Nappez le maquereau grillé de sauce.",
      },
    },
    { key: "rice", side: "rice", text: { ja: "長粒米のご飯を添えます。", en: "Serve with the long-grain rice.", es: "Acompáñalo con el arroz largo.", fr: "Servez avec le riz long." } },
  ],
  safetyNotes: [
    {
      key: "mackerel_doneness",
      text: {
        ja: "さばは中心まで火を通してください。身が不透明になり、骨の近くまでほぐれれば焼き上がりです。",
        en: "Cook the mackerel through; it is done when the flesh is opaque and flakes easily near the bone.",
        es: "Cocina la caballa por completo: está hecha cuando la carne es opaca y se desmenuza con facilidad cerca de la espina.",
        fr: "Faites cuire le maquereau à cœur ; il est cuit quand sa chair est opaque et s'effeuille facilement près de l'arête.",
      },
    },
    {
      key: "fish_bones",
      text: {
        ja: "骨が多い魚です。食べるときは骨に注意してください。",
        en: "This fish has many bones; take care when eating.",
        es: "Este pescado tiene muchas espinas; ten cuidado al comerlo.",
        fr: "Ce poisson a beaucoup d'arêtes ; faites attention en mangeant.",
      },
    },
    {
      key: "wash_raw",
      text: {
        ja: "生で食べる野菜とハーブは、流水でよく洗ってください。",
        en: "Wash raw vegetables and herbs well under running water.",
        es: "Lava bien con agua corriente las verduras y hierbas que se comen crudas.",
        fr: "Lavez bien sous l'eau courante les légumes et les herbes consommés crus.",
      },
    },
  ],
  substitutions: [],
};
