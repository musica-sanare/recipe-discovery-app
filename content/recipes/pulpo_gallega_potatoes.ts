import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "pulpo_gallega_potatoes",
  texts: {
    name: { ja: "たことじゃがいものガリシア風（プルポ・ア・ラ・ガジェガ）", en: "Pulpo a la gallega: Galician-style octopus with potatoes", es: "Pulpo a la gallega con patatas", fr: "Pulpo a la gallega : poulpe à la galicienne et pommes de terre" },
    summary: {
      ja: "スペイン・ガリシア地方のプルポ・ア・ラ・ガジェガを、市販のゆでだこと電子レンジで加熱したじゃがいもで作ります。オリーブ油、パプリカ、塩をかけます。パンを添えます。",
      en: "Galician pulpo a la gallega made with store-bought boiled octopus and microwaved potatoes, finished with olive oil, paprika, and salt, with bread.",
      es: "Pulpo a la gallega preparado con pulpo cocido comprado y patatas hechas en el microondas, terminado con aceite de oliva, pimentón y sal, con pan.",
      fr: "Le pulpo a la gallega de Galice, préparé avec du poulpe cuit du commerce et des pommes de terre au micro-ondes, relevé d'huile d'olive, de paprika et de sel, avec du pain.",
    },
  },
  cuisine: "spanish",
  goals: ["maintain"],
  mainProteinGroup: "fish",
  tags: [],
  minutes: 15,
  effort: 1,
  equipment: ["microwave"],
  servings: 1,
  ingredients: [
    { key: "octopus", food: "octopus_boiled", grams: 200, state: "as_is", role: "main_protein", adjust: { kind: "grams", min: 150, max: 250, step: 25 } },
    { key: "potato", food: "potato", grams: 300, state: "microwave", measure: { unit: "piece", quantity: 2 }, role: "main_carb", adjust: { kind: "grams", min: 200, max: 300, step: 50 } },
    { key: "oil", food: "olive_oil", grams: 10, state: "as_is", measure: { unit: "tsp", quantity: 2.5 }, role: "fat" },
    { key: "paprika", food: "paprika_powder", grams: 2, state: "as_is", measure: { unit: "tsp", quantity: 1 }, role: "seasoning" },
    { key: "salt", food: "salt", grams: 1, state: "as_is", measure: { unit: "pinch", quantity: 2 }, role: "seasoning" },
    { key: "bread", food: "bread", grams: 60, state: "as_is", measure: { unit: "slice", quantity: 1 }, role: "main_carb", adjust: { kind: "grams", min: 30, max: 90, step: 30 } },
  ],
  sides: [
    { key: "bread", label: { ja: "パン", en: "Bread", es: "Pan", fr: "Pain" }, ingredients: ["bread"], solverMayRemove: true },
  ],
  steps: [
    {
      key: "potato",
      text: {
        ja: "じゃがいもを皮つきのままラップで包み、600Wで5〜6分、竹串がすっと通るまで加熱します。皮をむいて1cm厚さの輪切りにします。",
        en: "Wrap the potatoes, skin on, in plastic wrap and microwave at 600 W for 5–6 minutes, until a skewer goes in easily. Peel them and slice them into 1 cm rounds.",
        es: "Envuelve las patatas con piel en film y caliéntalas a 600 W durante 5-6 minutos, hasta que un palillo entre con facilidad. Pélalas y córtalas en rodajas de 1 cm.",
        fr: "Enveloppez les pommes de terre avec la peau dans du film alimentaire et faites-les cuire au micro-ondes à 600 W pendant 5 à 6 minutes, jusqu'à ce qu'une brochette s'y enfonce facilement. Pelez-les et coupez-les en rondelles de 1 cm.",
      },
    },
    {
      key: "octopus",
      text: {
        ja: "ゆでだこを5mm厚さに切ります。",
        en: "Slice the boiled octopus 5 mm thick.",
        es: "Corta el pulpo cocido en rodajas de 5 mm.",
        fr: "Coupez le poulpe cuit en tranches de 5 mm.",
      },
    },
    {
      key: "serve",
      text: {
        ja: "皿にじゃがいもを並べ、たこをのせます。オリーブ油を回しかけ、パプリカパウダーと塩をふります。",
        en: "Arrange the potatoes on a plate and lay the octopus on top. Drizzle with the olive oil and sprinkle with the paprika and salt.",
        es: "Coloca las patatas en un plato y pon el pulpo encima. Rocía con el aceite de oliva y espolvorea con el pimentón y la sal.",
        fr: "Disposez les pommes de terre sur une assiette et posez le poulpe dessus. Arrosez d'huile d'olive et saupoudrez de paprika et de sel.",
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
      key: "no_cook",
      text: {
        ja: "たこは加熱しないので、冷蔵で保存されたものを表示の期限内に使い、作ったらすぐに食べてください。",
        en: "The octopus is not heated, so use octopus that has been kept refrigerated and is within the date on the package, and eat the dish straight away.",
        es: "El pulpo no se calienta, así que usa pulpo que se haya conservado en el refrigerador y esté dentro de la fecha del envase, y come el plato enseguida.",
        fr: "Le poulpe n'est pas réchauffé : utilisez du poulpe conservé au réfrigérateur et dont la date indiquée sur l'emballage n'est pas dépassée, et mangez le plat aussitôt.",
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
