import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "chicken_coconut_curry",
  texts: {
    name: { ja: "鶏むね肉のココナッツカレー", en: "Chicken curry with coconut milk", es: "Curri de pollo con leche de coco", fr: "Curry de poulet au lait de coco" },
    summary: {
      ja: "東南アジアのカレーをヒントに、鶏むね肉と赤パプリカをカレー粉とナンプラーで煮て、少量のココナッツミルクで仕上げます。ご飯を添えます。",
      en: "Inspired by Southeast Asian curries: chicken breast and red pepper simmered with curry powder and fish sauce, finished with a little coconut milk, with rice.",
      es: "Inspirado en los curris del sudeste asiático: pechuga de pollo y pimiento rojo guisados con curri en polvo y salsa de pescado, terminados con un poco de leche de coco, con arroz.",
      fr: "Inspiré des currys d'Asie du Sud-Est : blanc de poulet et poivron rouge mijotés avec du curry en poudre et de la sauce de poisson, terminés avec un peu de lait de coco, avec du riz.",
    },
  },
  cuisine: "southeast_asian",
  goals: ["bulk"],
  mainProteinGroup: "chicken",
  tags: [],
  minutes: 25,
  effort: 2,
  equipment: ["stove", "pot"],
  servings: 1,
  ingredients: [
    {
      key: "chicken",
      food: "chicken_breast",
      grams: 200,
      state: "raw",
      cooking: "simmer",
      role: "main_protein",
      adjust: { kind: "grams", min: 160, max: 260, step: 20 },
      note: {
        ja: "成分表に煮込んだ鶏むね肉の値がないため、生の値で計算しています。",
        en: "The tables have no value for stewed chicken breast, so the raw value is used.",
        es: "Las tablas no tienen un valor para la pechuga de pollo guisada, así que se usa el valor en crudo.",
        fr: "Les tables n'ont pas de valeur pour le blanc de poulet mijoté ; la valeur à l'état cru est donc utilisée.",
      },
    },
    { key: "oil", food: "vegetable_oil", grams: 4, state: "as_is", measure: { unit: "tsp", quantity: 1 }, role: "fat", linkedTo: "chicken" },
    { key: "curry_powder", food: "curry_powder", grams: 6, state: "as_is", measure: { unit: "tbsp", quantity: 0.5 }, role: "seasoning", linkedTo: "chicken" },
    { key: "fish_sauce", food: "fish_sauce", grams: 8, state: "as_is", measure: { unit: "tsp", quantity: 1.5 }, role: "seasoning", linkedTo: "chicken" },
    { key: "onion", food: "onion", grams: 60, state: "raw", cooking: "simmer", measure: { unit: "piece", quantity: 0.25 }, role: "vegetable" },
    { key: "red_pepper", food: "red_pepper", grams: 50, state: "raw", cooking: "simmer", role: "vegetable" },
    { key: "garlic", food: "garlic", grams: 5, state: "raw", measure: { unit: "clove", quantity: 1 }, role: "seasoning" },
    { key: "ginger", food: "ginger", grams: 5, state: "raw", measure: { unit: "knob", quantity: 0.5 }, role: "seasoning" },
    { key: "coconut_milk", food: "coconut_milk", grams: 50, state: "as_is", role: "other" },
    { key: "sugar", food: "sugar", grams: 2, state: "as_is", role: "seasoning" },
    { key: "coriander", food: "coriander", grams: 2, state: "raw", role: "vegetable" },
    { key: "rice", food: "rice_cooked", grams: 250, state: "as_is", role: "main_carb", adjust: { kind: "grams", min: 150, max: 350, step: 25 } },
  ],
  sides: [
    { key: "rice", label: { ja: "ご飯", en: "Rice", es: "Arroz", fr: "Riz" }, ingredients: ["rice"], solverMayRemove: true },
  ],
  steps: [
    {
      key: "prep",
      text: {
        ja: "鶏むね肉をひと口大に切ります。玉ねぎは薄切り、赤パプリカは細切りにし、にんにくとしょうがはすりおろします。",
        en: "Cut the chicken breast into bite-size pieces. Thinly slice the onion, cut the red pepper into strips, and grate the garlic and ginger.",
        es: "Corta la pechuga de pollo en trozos pequeños. Corta la cebolla en láminas finas y el pimiento rojo en tiras, y ralla el ajo y el jengibre.",
        fr: "Coupez le blanc de poulet en bouchées. Émincez finement l'oignon, coupez le poivron rouge en lanières et râpez l'ail et le gingembre.",
      },
    },
    {
      key: "brown",
      text: {
        ja: "鍋に油を中火で熱し、玉ねぎ、にんにく、しょうがを2分炒めます。鶏肉を加えて表面の色が変わったら、カレー粉を加えて1分炒めます。",
        en: "Heat the oil in a pot over medium heat and stir-fry the onion, garlic, and ginger for 2 minutes. Add the chicken, and when the outside changes color, add the curry powder and stir-fry for 1 minute.",
        es: "Calienta el aceite en una olla a fuego medio y saltea la cebolla, el ajo y el jengibre 2 minutos. Añade el pollo y, cuando cambie de color por fuera, añade el curri en polvo y saltea 1 minuto.",
        fr: "Faites chauffer l'huile dans une casserole à feu moyen et faites sauter l'oignon, l'ail et le gingembre 2 minutes. Ajoutez le poulet et, quand l'extérieur change de couleur, ajoutez le curry en poudre et faites sauter 1 minute.",
      },
    },
    {
      key: "simmer",
      text: {
        ja: "水150ml、赤パプリカ、ナンプラー、砂糖を加えて煮立て、ふたをして弱めの中火で10分煮ます。ココナッツミルクを加えてひと煮立ちさせます。",
        en: "Add 150 ml of water, the red pepper, fish sauce, and sugar, bring to a boil, cover, and simmer over medium-low heat for 10 minutes. Stir in the coconut milk and bring back to a boil.",
        es: "Añade 150 ml de agua, el pimiento rojo, la salsa de pescado y el azúcar, lleva a ebullición, tapa y cuece a fuego medio-bajo 10 minutos. Incorpora la leche de coco y deja que vuelva a hervir.",
        fr: "Ajoutez 150 ml d'eau, le poivron rouge, la sauce de poisson et le sucre, portez à ébullition, couvrez et laissez mijoter 10 minutes à feu moyen-doux. Incorporez le lait de coco et portez de nouveau à ébullition.",
      },
    },
    {
      key: "serve",
      text: {
        ja: "器に盛り、刻んだパクチーをのせます。",
        en: "Serve topped with the chopped cilantro.",
        es: "Sírvelo con el cilantro picado por encima.",
        fr: "Servez parsemé de coriandre hachée.",
      },
    },
    {
      key: "rice",
      side: "rice",
      text: {
        ja: "ご飯を添えます。",
        en: "Serve with the rice.",
        es: "Acompáñalo con el arroz.",
        fr: "Servez avec le riz.",
      },
    },
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
