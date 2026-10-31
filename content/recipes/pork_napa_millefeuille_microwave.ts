import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "pork_napa_millefeuille_microwave",
  texts: {
    name: { ja: "豚もも肉と白菜のミルフィーユ レンジ蒸し", en: "Microwave pork and napa cabbage mille-feuille", es: "Milhojas de cerdo y col china al microondas" },
    summary: {
      ja: "白菜と豚もも薄切り肉を交互に重ねて電子レンジで蒸し、しょうゆとレモンのたれで食べます。ご飯を添えます。",
      en: "Napa cabbage leaves layered with thin slices of lean pork and steamed in the microwave, eaten with a soy sauce and lemon dressing, with rice.",
      es: "Hojas de col china en capas con lonchas finas de cerdo magro, al vapor en el microondas, con un aliño de salsa de soja y limón, con arroz.",
    },
  },
  cuisine: "japanese",
  goals: ["cut"],
  mainProteinGroup: "pork",
  tags: [],
  minutes: 15,
  effort: 1,
  equipment: ["microwave"],
  servings: 1,
  ingredients: [
    {
      key: "pork",
      food: "pork_leg",
      grams: 150,
      state: "raw",
      cooking: "microwave",
      role: "main_protein",
      adjust: { kind: "grams", min: 110, max: 190, step: 20 },
      note: {
        ja: "成分表に電子レンジで加熱した豚もも肉の値がないため、生の値で計算しています。",
        en: "The tables have no value for microwaved pork leg, so the raw value is used.",
        es: "Las tablas no tienen un valor para la pierna de cerdo hecha en el microondas, así que se usa el valor en crudo.",
      },
    },
    {
      key: "napa",
      food: "napa_cabbage",
      grams: 250,
      state: "raw",
      cooking: "microwave",
      role: "vegetable",
      note: {
        ja: "成分表に電子レンジで加熱した白菜の値がないため、生の値で計算しています。",
        en: "The tables have no value for microwaved napa cabbage, so the raw value is used.",
        es: "Las tablas no tienen un valor para la col china hecha en el microondas, así que se usa el valor en crudo.",
      },
    },
    { key: "ginger", food: "ginger", grams: 5, state: "raw", measure: { unit: "knob", quantity: 0.5 }, role: "seasoning" },
    { key: "sake", food: "cooking_sake", grams: 10, state: "as_is", measure: { unit: "tsp", quantity: 2 }, role: "seasoning" },
    { key: "salt", food: "salt", grams: 0.5, state: "as_is", measure: { unit: "pinch", quantity: 1 }, role: "seasoning" },
    { key: "soy_sauce", food: "soy_sauce", grams: 9, state: "as_is", measure: { unit: "tsp", quantity: 1.5 }, role: "seasoning" },
    { key: "lemon", food: "lemon_juice", grams: 10, state: "as_is", measure: { unit: "tsp", quantity: 2 }, role: "seasoning" },
    { key: "green_onion", food: "green_onion", grams: 5, state: "raw", role: "vegetable" },
    { key: "rice", food: "rice_cooked", grams: 180, state: "as_is", role: "main_carb", adjust: { kind: "grams", min: 150, max: 240, step: 30 } },
  ],
  sides: [
    { key: "rice", label: { ja: "ご飯", en: "Rice", es: "Arroz" }, ingredients: ["rice"], solverMayRemove: true },
  ],
  steps: [
    {
      key: "layer",
      text: {
        ja: "白菜の葉と豚もも薄切り肉を交互に重ね、5cm幅に切ります。耐熱の深めの器に、切り口を上にして詰めます。せん切りのしょうがをのせ、料理酒と塩をふります。",
        en: "Layer the napa cabbage leaves and thin slices of pork alternately and cut the stack into 5 cm widths. Pack them into a deep heatproof dish with the cut sides up. Top with thin strips of ginger and sprinkle with the cooking sake and salt.",
        es: "Alterna en capas las hojas de col china y las lonchas finas de cerdo y corta el bloque en trozos de 5 cm de ancho. Colócalos en un recipiente hondo apto para microondas con el corte hacia arriba. Pon encima el jengibre en tiras finas y rocía con el sake de cocina y la sal.",
      },
    },
    {
      key: "steam",
      text: {
        ja: "ふんわりとラップをかけて600Wで7〜8分加熱し、豚肉のピンク色がなくなっていることを確かめます。足りなければ30秒ずつ追加加熱します。",
        en: "Cover loosely with plastic wrap and microwave at 600 W for 7–8 minutes, then check that no pink remains in the pork. If needed, heat in 30-second bursts.",
        es: "Cubre sin apretar con film y calienta a 600 W durante 7-8 minutos; comprueba que no quede nada rosado en el cerdo. Si hace falta, calienta en tandas de 30 segundos.",
      },
    },
    {
      key: "serve",
      text: {
        ja: "しょうゆとレモン果汁を混ぜたたれをかけ、小口切りの青ねぎを散らします。",
        en: "Pour over the soy sauce mixed with the lemon juice and scatter the sliced green onion over.",
        es: "Vierte por encima la salsa de soja mezclada con el zumo de limón y esparce la cebolleta en rodajas.",
      },
    },
    {
      key: "rice",
      side: "rice",
      text: { ja: "ご飯を添えます。", en: "Serve with the rice.", es: "Acompáñalo con el arroz." },
    },
  ],
  safetyNotes: [
    {
      key: "even_heating",
      text: {
        ja: "電子レンジは加熱むらが出やすいので、豚肉の中心まで火が通っているか確かめてください。",
        en: "Microwaves heat unevenly; check that the pork is cooked through.",
        es: "El microondas calienta de forma desigual; comprueba que el cerdo esté bien hecho.",
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
