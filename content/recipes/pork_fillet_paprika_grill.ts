import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "pork_fillet_paprika_grill",
  texts: {
    name: { ja: "豚ヒレのパプリカ焼き", en: "Paprika pork tenderloin", es: "Solomillo de cerdo al pimentón" },
    summary: {
      ja: "スペインのパプリカ風味をヒントに、豚ヒレ肉をにんにくとパプリカで焼きます。じゃがいもとレタスを添えます。",
      en: "Inspired by Spanish paprika flavors: pork tenderloin pan-fried with garlic and paprika, with potatoes and lettuce.",
      es: "Inspirado en el sabor del pimentón español: solomillo de cerdo a la sartén con ajo y pimentón, con patatas y lechuga.",
    },
  },
  cuisine: "spanish",
  goals: ["cut"],
  mainProteinGroup: "pork",
  tags: [],
  minutes: 20,
  effort: 1,
  equipment: ["stove", "frying_pan", "microwave"],
  servings: 1,
  ingredients: [
    {
      key: "pork",
      food: "pork_fillet",
      grams: 180,
      state: "grill",
      cooking: "saute",
      role: "main_protein",
      adjust: { kind: "grams", min: 140, max: 240, step: 10 },
      note: {
        ja: "成分表にソテーした豚ヒレ肉の値がないため、焼いた値で計算しています。",
        en: "The tables have no value for sautéed pork tenderloin, so the grilled value is used.",
        es: "Las tablas no tienen un valor para el solomillo de cerdo salteado, así que se usa el valor a la parrilla.",
      },
    },
    { key: "oil_pork", food: "olive_oil", grams: 3, state: "as_is", measure: { unit: "tsp", quantity: 0.75 }, role: "fat", linkedTo: "pork" },
    { key: "paprika", food: "paprika_powder", grams: 2, state: "as_is", measure: { unit: "tsp", quantity: 1 }, role: "seasoning", linkedTo: "pork" },
    { key: "garlic", food: "garlic", grams: 5, state: "raw", measure: { unit: "clove", quantity: 1 }, role: "seasoning", linkedTo: "pork" },
    { key: "salt", food: "salt", grams: 1, state: "as_is", measure: { unit: "pinch", quantity: 2 }, role: "seasoning", linkedTo: "pork" },
    { key: "lettuce", food: "lettuce", grams: 40, state: "raw", role: "vegetable" },
    { key: "potato", food: "potato", grams: 250, state: "microwave", measure: { unit: "piece", quantity: 2 }, role: "main_carb", adjust: { kind: "grams", min: 100, max: 350, step: 50 } },
  ],
  sides: [
    { key: "potato", label: { ja: "じゃがいも", en: "Potatoes", es: "Patatas" }, ingredients: ["potato"], solverMayRemove: true },
  ],
  steps: [
    {
      key: "prep",
      text: {
        ja: "豚ヒレ肉を厚さ2cmに切り、すりおろしたにんにく、塩、パプリカをまぶして5分置きます。",
        en: "Cut the pork tenderloin into 2 cm thick slices and rub with the grated garlic, salt, and paprika. Leave for 5 minutes.",
        es: "Corta el solomillo de cerdo en medallones de 2 cm y úntalo con el ajo rallado, la sal y el pimentón. Déjalo reposar 5 minutos.",
      },
    },
    {
      key: "sear",
      text: {
        ja: "フライパンにオリーブオイルを中火で熱し、豚肉を片面3分ずつ焼きます。パプリカは焦げやすいので、火が強すぎないようにします。",
        en: "Heat the olive oil in a frying pan over medium heat and cook the pork for 3 minutes on each side. Paprika burns easily, so keep the heat moderate.",
        es: "Calienta el aceite de oliva en una sartén a fuego medio y cocina el cerdo 3 minutos por cada lado. El pimentón se quema con facilidad, así que no subas demasiado el fuego.",
      },
    },
    {
      key: "serve",
      text: {
        ja: "ちぎったレタスと一緒に器に盛ります。",
        en: "Plate with the torn lettuce.",
        es: "Sírvelo con la lechuga troceada.",
      },
    },
    {
      key: "potato",
      side: "potato",
      text: {
        ja: "じゃがいもをよく洗い、皮つきのまま1個ずつラップで包んで600Wで5〜6分、竹串がすっと通るまで加熱します。皮をむいて添えます。",
        en: "Scrub the potatoes, wrap each one in plastic wrap with the skin on, and heat at 600 W for 5–6 minutes until a skewer slides in easily. Peel and serve alongside.",
        es: "Lava bien las patatas, envuelve cada una con piel en film y caliéntalas a 600 W durante 5-6 minutos hasta que un palillo entre con facilidad. Pélalas y sírvelas al lado.",
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
      },
    },
    {
      key: "steam",
      text: {
        ja: "加熱直後は蒸気でやけどしやすいので、ラップは奥から手前に向かって外してください。",
        en: "Steam can burn right after heating; peel the wrap away from you.",
        es: "El vapor puede quemar justo después de calentar; retira el film en dirección contraria a ti.",
      },
    },
  ],
  substitutions: [],
};
