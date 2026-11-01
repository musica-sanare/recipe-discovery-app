import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "poulet_yassa",
  texts: {
    name: { ja: "プーレ・ヤッサ（鶏もも肉のレモン玉ねぎソース）", en: "Poulet yassa (chicken with lemon and onion sauce)", es: "Poulet yassa (pollo con salsa de limón y cebolla)", fr: "Poulet yassa" },
    summary: {
      ja: "セネガルの家庭料理をヒントに、レモンとマスタードに漬けた皮なしの鶏もも肉をトースターで焼き、漬け汁で煮た玉ねぎのソースをかけます。長粒米のご飯を添えます。",
      en: "Inspired by Senegalese home cooking: skinless chicken thigh marinated in lemon and mustard, grilled in a toaster oven, and served with onions cooked in the marinade, with long-grain rice.",
      es: "Inspirado en la cocina casera senegalesa: muslo de pollo sin piel marinado en limón y mostaza, asado en el horno tostador y servido con cebolla cocinada en la marinada, con arroz largo.",
      fr: "Inspiré de la cuisine familiale sénégalaise : haut de cuisse de poulet sans peau mariné au citron et à la moutarde, grillé au four grille-pain et nappé d'oignons cuits dans la marinade, avec du riz long.",
    },
  },
  cuisine: "west_african",
  goals: ["maintain"],
  mainProteinGroup: "chicken",
  tags: [],
  minutes: 50,
  effort: 2,
  equipment: ["stove", "frying_pan", "oven_toaster"],
  servings: 1,
  ingredients: [
    { key: "chicken", food: "chicken_thigh", grams: 150, state: "grill", role: "main_protein", adjust: { kind: "grams", min: 110, max: 190, step: 20 } },
    { key: "salt", food: "salt", grams: 1.2, state: "as_is", measure: { unit: "pinch", quantity: 2.5 }, role: "seasoning", linkedTo: "chicken" },
    { key: "pepper", food: "black_pepper", grams: 0.2, state: "as_is", measure: { unit: "pinch", quantity: 1 }, role: "seasoning", linkedTo: "chicken" },
    { key: "lemon", food: "lemon_juice", grams: 20, state: "as_is", measure: { unit: "tbsp", quantity: 1.25 }, role: "seasoning" },
    { key: "mustard", food: "dijon_mustard", grams: 6, state: "as_is", measure: { unit: "tsp", quantity: 1 }, role: "seasoning" },
    { key: "garlic", food: "garlic", grams: 5, state: "raw", measure: { unit: "clove", quantity: 1 }, role: "seasoning" },
    { key: "chili", food: "chili_pepper_powder", grams: 0.2, state: "as_is", measure: { unit: "pinch", quantity: 1 }, role: "seasoning" },
    { key: "onion", food: "onion", grams: 120, state: "stir_fry", measure: { unit: "piece", quantity: 0.5 }, role: "vegetable" },
    { key: "oil_onion", food: "vegetable_oil", grams: 5, state: "as_is", measure: { unit: "tsp", quantity: 1.25 }, role: "fat", includedIn: "onion" },
    { key: "rice", food: "indica_rice_cooked", grams: 150, state: "as_is", role: "main_carb", adjust: { kind: "grams", min: 100, max: 250, step: 50 } },
  ],
  sides: [{ key: "rice", label: { ja: "長粒米のご飯", en: "Long-grain rice", es: "Arroz largo", fr: "Riz long" }, ingredients: ["rice"], solverMayRemove: true }],
  steps: [
    {
      key: "marinate",
      text: {
        ja: "玉ねぎは薄切りにし、にんにくはすりおろします。ポリ袋に鶏もも肉、玉ねぎ、レモン果汁、マスタード、にんにく、一味唐辛子、塩、こしょうを入れてもみ込み、冷蔵庫で20分以上漬けます。",
        en: "Thinly slice the onion and grate the garlic. Put the chicken thigh, onion, lemon juice, mustard, garlic, ground chili pepper, salt, and pepper in a food bag, massage well, and marinate in the refrigerator for at least 20 minutes.",
        es: "Corta la cebolla en láminas finas y ralla el ajo. Pon en una bolsa el muslo de pollo, la cebolla, el zumo de limón, la mostaza, el ajo, la guindilla molida, la sal y la pimienta, masajea bien y deja marinar en el refrigerador al menos 20 minutos.",
        fr: "Émincez finement l'oignon et râpez l'ail. Mettez le haut de cuisse de poulet, l'oignon, le jus de citron, la moutarde, l'ail, le piment moulu, le sel et le poivre dans un sachet, massez bien et laissez mariner au moins 20 minutes au réfrigérateur.",
      },
    },
    {
      key: "grill",
      text: {
        ja: "鶏肉を取り出して漬け汁を軽くぬぐい、アルミホイルにのせてトースターで15〜18分焼きます。",
        en: "Take out the chicken, wipe off most of the marinade, place it on foil, and grill in a toaster oven for 15 to 18 minutes.",
        es: "Saca el pollo, retira la mayor parte de la marinada, colócalo sobre papel de aluminio y ásalo en el horno tostador de 15 a 18 minutos.",
        fr: "Sortez le poulet, essuyez l'essentiel de la marinade, posez-le sur du papier aluminium et faites-le griller 15 à 18 minutes au four grille-pain.",
      },
    },
    {
      key: "onions",
      text: {
        ja: "その間に、フライパンに油を中火で熱し、漬け汁ごと玉ねぎを入れて8〜10分、しんなりして汁気がほぼなくなるまで炒めます。",
        en: "Meanwhile, heat the oil in a frying pan over medium heat, add the onion with all the marinade, and stir-fry for 8 to 10 minutes, until soft and the liquid has almost gone.",
        es: "Mientras tanto, calienta el aceite en una sartén a fuego medio, añade la cebolla con toda la marinada y saltéala de 8 a 10 minutos, hasta que esté tierna y casi no quede líquido.",
        fr: "Pendant ce temps, faites chauffer l'huile dans une poêle à feu moyen, ajoutez l'oignon avec toute la marinade et faites revenir 8 à 10 minutes, jusqu'à ce qu'il soit tendre et que le liquide ait presque disparu.",
      },
    },
    {
      key: "serve",
      text: {
        ja: "鶏肉を器に盛り、玉ねぎのソースをかけます。",
        en: "Serve the chicken topped with the onion sauce.",
        es: "Sirve el pollo cubierto con la salsa de cebolla.",
        fr: "Servez le poulet nappé de la sauce aux oignons.",
      },
    },
    { key: "rice", side: "rice", text: { ja: "長粒米のご飯を添えます。", en: "Serve with the long-grain rice.", es: "Acompáñalo con el arroz largo.", fr: "Servez avec le riz long." } },
  ],
  safetyNotes: [
    {
      key: "chicken_doneness",
      text: {
        ja: "鶏肉は中心まで火を通してください。切り口に赤みがなく、肉汁が透明になっていることを確認します。",
        en: "Cook chicken all the way through. Check that the center is no longer pink and the juices run clear.",
        es: "Cocina el pollo completamente. Comprueba que el centro ya no esté rosado y que los jugos salgan transparentes.",
        fr: "Faites cuire le poulet à cœur. Vérifiez que le centre n'est plus rosé et que le jus qui s'écoule est clair.",
      },
    },
    {
      key: "raw_marinade",
      text: {
        ja: "生の鶏肉を漬けている間は冷蔵庫に入れてください。生の鶏肉を漬けた漬け汁と玉ねぎは、十分に加熱してから食べます。",
        en: "Keep the raw chicken in the refrigerator while it marinates. Cook the marinade and the onions that held raw chicken thoroughly before eating.",
        es: "Mantén el pollo crudo en el refrigerador mientras se marina. Cocina bien la marinada y la cebolla que estuvieron con el pollo crudo antes de comerlas.",
        fr: "Gardez le poulet cru au réfrigérateur pendant qu'il marine. Faites bien cuire la marinade et les oignons qui ont été en contact avec le poulet cru avant de les manger.",
      },
    },
  ],
  substitutions: [],
};
