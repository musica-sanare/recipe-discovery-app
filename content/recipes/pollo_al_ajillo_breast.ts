import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "pollo_al_ajillo_breast",
  texts: {
    name: { ja: "鶏むね肉のポジョ・アル・アヒージョ", en: "Pollo al ajillo with chicken breast", es: "Pollo al ajillo con pechuga", fr: "Pollo al ajillo au blanc de poulet" },
    summary: {
      ja: "スペインのポジョ・アル・アヒージョを、鶏むね肉と控えめのオリーブ油で作ります。にんにくとパセリで仕上げ、トマトのサラダとパンを添えます。",
      en: "Spanish pollo al ajillo made with chicken breast and less olive oil, finished with garlic and parsley, with a tomato salad and bread.",
      es: "Pollo al ajillo preparado con pechuga y menos aceite de oliva, terminado con ajo y perejil, con ensalada de tomate y pan.",
      fr: "Le pollo al ajillo espagnol, préparé avec du blanc de poulet et moins d'huile d'olive, relevé d'ail et de persil, avec une salade de tomates et du pain.",
    },
  },
  cuisine: "spanish",
  goals: ["cut"],
  mainProteinGroup: "chicken",
  tags: [],
  minutes: 15,
  effort: 1,
  equipment: ["stove", "frying_pan"],
  servings: 1,
  ingredients: [
    {
      key: "chicken",
      food: "chicken_breast",
      grams: 180,
      state: "raw",
      cooking: "saute",
      role: "main_protein",
      adjust: { kind: "grams", min: 140, max: 220, step: 20 },
      note: {
        ja: "成分表にソテーした鶏むね肉の値がないため、生の値で計算しています。",
        en: "The tables have no value for sautéed chicken breast, so the raw value is used.",
        es: "Las tablas no tienen un valor para la pechuga de pollo salteada, así que se usa el valor en crudo.",
        fr: "Les tables n'ont pas de valeur pour le blanc de poulet poêlé ; la valeur à l'état cru est donc utilisée.",
      },
    },
    { key: "oil", food: "olive_oil", grams: 6, state: "as_is", measure: { unit: "tsp", quantity: 1.5 }, role: "fat", linkedTo: "chicken" },
    { key: "garlic", food: "garlic", grams: 15, state: "raw", measure: { unit: "clove", quantity: 3 }, role: "seasoning" },
    { key: "chili", food: "chili_pepper_powder", grams: 0.5, state: "as_is", measure: { unit: "pinch", quantity: 1 }, role: "seasoning" },
    { key: "salt", food: "salt", grams: 1, state: "as_is", measure: { unit: "pinch", quantity: 2 }, role: "seasoning", linkedTo: "chicken" },
    { key: "parsley", food: "parsley", grams: 3, state: "raw", role: "seasoning" },
    { key: "lemon", food: "lemon_juice", grams: 5, state: "as_is", measure: { unit: "tsp", quantity: 1 }, role: "seasoning" },
    { key: "tomato", food: "tomato", grams: 80, state: "raw", measure: { unit: "piece", quantity: 0.5 }, role: "vegetable" },
    { key: "lettuce", food: "lettuce", grams: 40, state: "raw", role: "vegetable" },
    { key: "bread", food: "bread", grams: 90, state: "as_is", measure: { unit: "slice", quantity: 1.5 }, role: "main_carb", adjust: { kind: "grams", min: 60, max: 120, step: 30 } },
  ],
  sides: [
    { key: "bread", label: { ja: "パン", en: "Bread", es: "Pan", fr: "Pain" }, ingredients: ["bread"], solverMayRemove: true },
  ],
  steps: [
    {
      key: "prep",
      text: {
        ja: "鶏むね肉をひと口大に切り、塩をふります。にんにくは薄切り、パセリはみじん切りにします。トマトはくし形に切り、レタスはちぎります。",
        en: "Cut the chicken breast into bite-size pieces and sprinkle with the salt. Thinly slice the garlic and finely chop the parsley. Cut the tomato into wedges and tear the lettuce.",
        es: "Corta la pechuga en trozos pequeños y échales la sal. Corta el ajo en láminas finas y pica fino el perejil. Corta el tomate en gajos y trocea la lechuga con las manos.",
        fr: "Coupez le blanc de poulet en bouchées et salez-le. Émincez finement l'ail et hachez finement le persil. Coupez la tomate en quartiers et déchirez la laitue.",
      },
    },
    {
      key: "garlic",
      text: {
        ja: "フライパンにオリーブ油、にんにく、一味唐辛子を入れて弱火にかけ、にんにくが色づき始めたら取り出します。",
        en: "Put the olive oil, garlic, and ground chili in a frying pan over low heat, and take out the garlic when it starts to color.",
        es: "Pon en una sartén el aceite de oliva, el ajo y la guindilla molida a fuego bajo, y saca el ajo cuando empiece a dorarse.",
        fr: "Mettez l'huile d'olive, l'ail et le piment moulu dans une poêle à feu doux, et retirez l'ail quand il commence à colorer.",
      },
    },
    {
      key: "saute",
      text: {
        ja: "同じフライパンを中火にし、鶏肉を5〜6分、全体に焼き色がついて中まで火が通るまで焼きます。にんにくを戻し、レモン果汁とパセリを加えて混ぜます。",
        en: "In the same pan, cook the chicken over medium heat for 5–6 minutes, until browned all over and cooked through. Return the garlic and stir in the lemon juice and parsley.",
        es: "Sube a fuego medio y haz el pollo 5-6 minutos, hasta que esté dorado por todas partes y hecho por dentro. Devuelve el ajo y añade el zumo de limón y el perejil.",
        fr: "Dans la même poêle, faites cuire le poulet à feu moyen 5 à 6 minutes, jusqu'à ce qu'il soit doré de toutes parts et cuit à cœur. Remettez l'ail et incorporez le jus de citron et le persil.",
      },
    },
    {
      key: "serve",
      text: {
        ja: "トマトとレタスと一緒に器に盛ります。",
        en: "Plate it with the tomato and lettuce.",
        es: "Sírvelo con el tomate y la lechuga.",
        fr: "Dressez avec la tomate et la laitue.",
      },
    },
    {
      key: "bread",
      side: "bread",
      text: { ja: "パンを添えます。", en: "Serve with the bread.", es: "Acompáñalo con el pan.", fr: "Servez avec le pain." },
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
