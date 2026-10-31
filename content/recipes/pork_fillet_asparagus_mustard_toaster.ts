import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "pork_fillet_asparagus_mustard_toaster",
  texts: {
    name: { ja: "豚ヒレ肉とアスパラの粒マスタード焼き", en: "Toaster-baked pork tenderloin and asparagus with grainy mustard", es: "Solomillo de cerdo y espárragos con mostaza en grano al horno tostador", fr: "Filet mignon de porc et asperges à la moutarde à l'ancienne au four grille-pain" },
    summary: {
      ja: "粒マスタードを塗った豚ヒレ肉とアスパラガスを、トースターで一緒に焼きます。電子レンジで加熱したじゃがいもを添えます。",
      en: "Pork tenderloin spread with grainy mustard and asparagus cooked together in a toaster oven, with microwaved potatoes.",
      es: "Solomillo de cerdo untado con mostaza en grano y espárragos asados juntos en el horno tostador, con patatas hechas en el microondas.",
      fr: "Filet mignon de porc tartiné de moutarde à l'ancienne et asperges cuits ensemble au four grille-pain, avec des pommes de terre au micro-ondes.",
    },
  },
  cuisine: "western",
  goals: ["cut"],
  mainProteinGroup: "pork",
  tags: [],
  minutes: 20,
  effort: 1,
  equipment: ["oven_toaster", "microwave"],
  servings: 1,
  ingredients: [
    { key: "pork", food: "pork_fillet", grams: 160, state: "grill", role: "main_protein", adjust: { kind: "grams", min: 120, max: 200, step: 20 } },
    { key: "mustard", food: "grain_mustard", grams: 10, state: "as_is", measure: { unit: "tsp", quantity: 2 }, role: "seasoning", linkedTo: "pork" },
    { key: "oil", food: "olive_oil", grams: 3, state: "as_is", measure: { unit: "tsp", quantity: 0.75 }, role: "fat" },
    { key: "salt", food: "salt", grams: 0.5, state: "as_is", measure: { unit: "pinch", quantity: 1 }, role: "seasoning", linkedTo: "pork" },
    {
      key: "asparagus",
      food: "asparagus",
      grams: 80,
      state: "raw",
      cooking: "grill",
      measure: { unit: "stalk", quantity: 4 },
      role: "vegetable",
      note: {
        ja: "成分表に焼いたアスパラガスの値がないため、生の値で計算しています。",
        en: "The tables have no value for grilled asparagus, so the raw value is used.",
        es: "Las tablas no tienen un valor para los espárragos asados, así que se usa el valor en crudo.",
        fr: "Les tables n'ont pas de valeur pour les asperges grillées ; la valeur à l'état cru est donc utilisée.",
      },
    },
    { key: "potato", food: "potato", grams: 250, state: "microwave", measure: { unit: "piece", quantity: 2 }, role: "main_carb", adjust: { kind: "grams", min: 150, max: 300, step: 50 } },
  ],
  sides: [
    { key: "potato", label: { ja: "じゃがいも", en: "Potatoes", es: "Patatas", fr: "Pommes de terre" }, ingredients: ["potato"], solverMayRemove: true },
  ],
  steps: [
    {
      key: "prep",
      text: {
        ja: "豚ヒレ肉を1.5cm厚さに切り、塩をふって粒マスタードを塗ります。アスパラガスは根元の硬い部分を落とし、オリーブ油をからめます。",
        en: "Slice the pork tenderloin 1.5 cm thick, sprinkle with the salt, and spread with the grainy mustard. Trim the tough ends of the asparagus and toss with the olive oil.",
        es: "Corta el solomillo en medallones de 1,5 cm, échales la sal y úntalos con la mostaza en grano. Corta la parte dura de los espárragos y mézclalos con el aceite de oliva.",
        fr: "Coupez le filet mignon en tranches de 1,5 cm, salez-le et tartinez-le de moutarde à l'ancienne. Retirez la base dure des asperges et enrobez-les d'huile d'olive.",
      },
    },
    {
      key: "bake",
      text: {
        ja: "アルミホイルを敷いたトースターの天板に豚肉とアスパラガスを並べ、12〜15分焼きます。一番厚い1切れを切って、中まで火が通っていることを確かめます。",
        en: "Arrange the pork and asparagus on a toaster oven tray lined with aluminum foil and cook for 12–15 minutes. Cut the thickest piece to check that it is cooked through.",
        es: "Coloca el cerdo y los espárragos en la bandeja del horno tostador forrada con papel de aluminio y ásalos 12-15 minutos. Corta el trozo más grueso para comprobar que esté bien hecho.",
        fr: "Disposez le porc et les asperges sur la plaque du four grille-pain garnie de papier aluminium et faites cuire 12 à 15 minutes. Coupez le morceau le plus épais pour vérifier qu'il est cuit à cœur.",
      },
    },
    {
      key: "serve",
      text: { ja: "器に盛ります。", en: "Plate them.", es: "Sírvelos en un plato.", fr: "Dressez." },
    },
    {
      key: "potato",
      side: "potato",
      text: {
        ja: "じゃがいもを皮つきのままラップで包み、600Wで4〜5分、竹串がすっと通るまで加熱して添えます。",
        en: "Wrap the potatoes, skin on, in plastic wrap, microwave at 600 W for 4–5 minutes until a skewer goes in easily, and serve alongside.",
        es: "Envuelve las patatas con piel en film, caliéntalas a 600 W durante 4-5 minutos hasta que un palillo entre con facilidad y sírvelas al lado.",
        fr: "Enveloppez les pommes de terre avec la peau dans du film alimentaire, faites-les cuire au micro-ondes à 600 W pendant 4 à 5 minutes, jusqu'à ce qu'une brochette s'y enfonce facilement, et servez-les à côté.",
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
    {
      key: "steam",
      text: {
        ja: "加熱直後は蒸気でやけどしやすいので、ラップは奥から手前に向かって外してください。",
        en: "Steam can burn right after heating; peel the wrap away from you.",
        es: "El vapor puede quemar justo después de calentar; retira el film en dirección contraria a ti.",
        fr: "La vapeur peut brûler juste après la cuisson ; retirez le film en l'écartant de vous.",
      },
    },
  ],
  substitutions: [],
};
