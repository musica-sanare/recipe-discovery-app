import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "chicken_souvlaki_yogurt",
  texts: {
    name: { ja: "鶏むね肉のスブラキ風 ヨーグルトソース", en: "Souvlaki-style chicken breast with yogurt sauce", es: "Pechuga de pollo al estilo souvlaki con salsa de yogur", fr: "Blanc de poulet façon souvlaki, sauce au yaourt" },
    summary: {
      ja: "ギリシャのスブラキをヒントに、レモンとにんにくで下味をつけた鶏むね肉をトースターで焼き、きゅうり入りのヨーグルトソースと野菜を添えます。ご飯を添えます。",
      en: "Inspired by Greek souvlaki: chicken breast marinated with lemon and garlic, cooked in a toaster oven, with a cucumber yogurt sauce, vegetables, and rice.",
      es: "Inspirado en el souvlaki griego: pechuga de pollo adobada con limón y ajo, asada en el horno tostador, con salsa de yogur y pepino, verduras y arroz.",
      fr: "Inspiré du souvlaki grec : blanc de poulet mariné au citron et à l'ail, cuit au four grille-pain, avec une sauce au yaourt et au concombre, des légumes et du riz.",
    },
  },
  cuisine: "mediterranean",
  goals: ["cut"],
  mainProteinGroup: "chicken",
  tags: [],
  minutes: 20,
  effort: 1,
  equipment: ["oven_toaster"],
  servings: 1,
  ingredients: [
    { key: "chicken", food: "chicken_breast", grams: 180, state: "grill", role: "main_protein", adjust: { kind: "grams", min: 140, max: 220, step: 20 } },
    { key: "oil", food: "olive_oil", grams: 8, state: "as_is", measure: { unit: "tsp", quantity: 2 }, role: "fat", linkedTo: "chicken" },
    { key: "lemon", food: "lemon_juice", grams: 10, state: "as_is", measure: { unit: "tsp", quantity: 2 }, role: "seasoning", linkedTo: "chicken" },
    { key: "garlic", food: "garlic", grams: 3, state: "raw", measure: { unit: "clove", quantity: 0.5 }, role: "seasoning" },
    { key: "salt", food: "salt", grams: 1, state: "as_is", measure: { unit: "pinch", quantity: 2 }, role: "seasoning", linkedTo: "chicken" },
    { key: "yogurt", food: "yogurt_nonfat", grams: 100, state: "as_is", role: "other" },
    { key: "cucumber", food: "cucumber", grams: 50, state: "raw", measure: { unit: "piece", quantity: 0.5 }, role: "vegetable" },
    { key: "tomato", food: "tomato", grams: 80, state: "raw", measure: { unit: "piece", quantity: 0.5 }, role: "vegetable" },
    { key: "onion", food: "onion", grams: 20, state: "raw", role: "vegetable" },
    { key: "lettuce", food: "lettuce", grams: 40, state: "raw", role: "vegetable" },
    { key: "rice", food: "rice_cooked", grams: 150, state: "as_is", role: "main_carb", adjust: { kind: "grams", min: 100, max: 250, step: 50 } },
  ],
  sides: [
    { key: "rice", label: { ja: "ご飯", en: "Rice", es: "Arroz", fr: "Riz" }, ingredients: ["rice"], solverMayRemove: true },
  ],
  steps: [
    {
      key: "marinate",
      text: {
        ja: "鶏むね肉を3cm角に切り、オリーブ油、レモン果汁、すりおろしたにんにく、塩をからめて10分おきます。",
        en: "Cut the chicken breast into 3 cm cubes, toss with the olive oil, lemon juice, grated garlic, and salt, and leave for 10 minutes.",
        es: "Corta la pechuga en dados de 3 cm, mézclala con el aceite de oliva, el zumo de limón, el ajo rallado y la sal, y déjala reposar 10 minutos.",
        fr: "Coupez le blanc de poulet en cubes de 3 cm, mélangez-le avec l'huile d'olive, le jus de citron, l'ail râpé et le sel, et laissez reposer 10 minutes.",
      },
    },
    {
      key: "sauce",
      text: {
        ja: "その間に、きゅうりをすりおろして水気を軽く絞り、ヨーグルトと混ぜます。トマトはくし形切り、玉ねぎは薄切り、レタスはちぎります。",
        en: "Meanwhile, grate the cucumber, squeeze out some of the water, and mix it with the yogurt. Cut the tomato into wedges, slice the onion thinly, and tear the lettuce.",
        es: "Mientras tanto, ralla el pepino, escúrrelo un poco y mézclalo con el yogur. Corta el tomate en gajos, la cebolla en láminas finas y trocea la lechuga con las manos.",
        fr: "Pendant ce temps, râpez le concombre, pressez-le un peu pour retirer de l'eau et mélangez-le avec le yaourt. Coupez la tomate en quartiers, émincez finement l'oignon et déchirez la laitue.",
      },
    },
    {
      key: "grill",
      text: {
        ja: "アルミホイルを敷いたトースターの天板に鶏肉を並べ、12〜15分焼きます。途中で一度裏返します。",
        en: "Spread the chicken on a toaster oven tray lined with aluminum foil and cook for 12–15 minutes, turning once.",
        es: "Coloca el pollo en la bandeja del horno tostador forrada con papel de aluminio y ásalo 12-15 minutos, dándole la vuelta una vez.",
        fr: "Étalez le poulet sur la plaque du four grille-pain recouverte de papier aluminium et faites-le cuire 12 à 15 minutes en le retournant une fois.",
      },
    },
    {
      key: "serve",
      text: {
        ja: "一番大きい1切れを切って中まで火が通っていることを確かめ、野菜と一緒に器に盛り、ヨーグルトソースを添えます。",
        en: "Cut open the largest piece to check that it is cooked through, then plate the chicken with the vegetables and the yogurt sauce.",
        es: "Corta el trozo más grande para comprobar que esté bien hecho y sirve el pollo con las verduras y la salsa de yogur.",
        fr: "Ouvrez le plus gros morceau pour vérifier qu'il est cuit à cœur, puis dressez le poulet avec les légumes et la sauce au yaourt.",
      },
    },
    {
      key: "rice",
      side: "rice",
      text: { ja: "ご飯を添えます。", en: "Serve with the rice.", es: "Acompáñalo con el arroz.", fr: "Servez avec le riz." },
    },
  ],
  safetyNotes: [
    {
      key: "chicken_doneness",
      text: {
        ja: "鶏肉は中心まで火を通してください。大きめの1個を切って、赤みがないことを確認します。",
        en: "Cook chicken all the way through. Cut open the largest piece to check that it is no longer pink.",
        es: "Cocina el pollo completamente. Corta el trozo más grande para comprobar que ya no esté rosado por dentro.",
        fr: "Faites cuire le poulet à cœur. Ouvrez le plus gros morceau pour vérifier qu'il n'est plus rosé.",
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
