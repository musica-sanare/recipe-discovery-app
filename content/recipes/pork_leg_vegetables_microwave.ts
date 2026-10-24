import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "pork_leg_vegetables_microwave",
  texts: {
    name: { ja: "豚もも肉と野菜のレンジ蒸し レモンじょうゆ", en: "Microwave-steamed pork and vegetables with lemon soy sauce", es: "Cerdo y verduras al vapor en microondas con salsa de soja y limón" },
    summary: {
      ja: "キャベツとにんじんに豚もも肉を広げて電子レンジで蒸し、レモンじょうゆをかけます。ご飯を添えます。",
      en: "Lean pork spread over cabbage and carrot, steamed in the microwave, and finished with lemon soy sauce, with rice.",
      es: "Cerdo magro sobre repollo y zanahoria, al vapor en el microondas y terminado con salsa de soja y limón, con arroz.",
    },
  },
  cuisine: "japanese",
  goals: ["cut"],
  mainProteinGroup: "pork",
  tags: [],
  minutes: 12,
  effort: 1,
  equipment: ["microwave"],
  servings: 1,
  ingredients: [
    {
      key: "pork",
      food: "pork_leg",
      grams: 160,
      state: "raw",
      cooking: "microwave",
      role: "main_protein",
      adjust: { kind: "grams", min: 120, max: 240, step: 10 },
      note: {
        ja: "成分表に電子レンジで加熱した豚もも肉の値がないため、生の値で計算しています。",
        en: "The tables have no value for microwaved pork leg, so the raw value is used.",
        es: "Las tablas no tienen un valor para la pierna de cerdo al microondas, así que se usa el valor en crudo.",
      },
    },
    { key: "sake", food: "cooking_sake", grams: 15, state: "as_is", measure: { unit: "tbsp", quantity: 1 }, role: "seasoning", linkedTo: "pork" },
    {
      key: "cabbage",
      food: "cabbage",
      grams: 150,
      state: "raw",
      cooking: "microwave",
      role: "vegetable",
      note: {
        ja: "成分表に電子レンジで加熱したキャベツの値がないため、生の値で計算しています。",
        en: "The tables have no value for microwaved cabbage, so the raw value is used.",
        es: "Las tablas no tienen un valor para el repollo al microondas, así que se usa el valor en crudo.",
      },
    },
    { key: "carrot", food: "carrot", grams: 40, state: "raw", cooking: "microwave", role: "vegetable" },
    { key: "soy_sauce", food: "soy_sauce", grams: 12, state: "as_is", measure: { unit: "tsp", quantity: 2 }, role: "seasoning", linkedTo: "pork" },
    { key: "lemon_juice", food: "lemon_juice", grams: 10, state: "as_is", measure: { unit: "tsp", quantity: 2 }, role: "seasoning", linkedTo: "pork" },
    { key: "rice", food: "rice_cooked", grams: 180, state: "as_is", role: "main_carb", adjust: { kind: "grams", min: 100, max: 300, step: 10 } },
  ],
  sides: [
    { key: "rice", label: { ja: "ご飯", en: "Rice", es: "Arroz" }, ingredients: ["rice"], solverMayRemove: true },
  ],
  steps: [
    {
      key: "prep",
      text: {
        ja: "キャベツはざく切り、にんじんは細切りにします。豚肉は薄切りを使い、大きければ半分に切ります。",
        en: "Roughly chop the cabbage and cut the carrot into thin strips. Use thinly sliced pork and halve any large slices.",
        es: "Trocea el repollo y corta la zanahoria en tiras finas. Usa cerdo en lonchas finas y corta por la mitad las más grandes.",
      },
    },
    {
      key: "heat",
      text: {
        ja: "耐熱皿にキャベツとにんじんを敷き、豚肉を重ならないように広げて料理酒をふります。ふんわりとラップをかけ、600Wで4分加熱します。",
        en: "Spread the cabbage and carrot on a microwave-safe plate, lay the pork on top without overlapping, and sprinkle with the cooking sake. Cover loosely with plastic wrap and heat at 600 W for 4 minutes.",
        es: "Extiende el repollo y la zanahoria en un plato apto para microondas, coloca el cerdo encima sin que se superponga y rocía con el sake de cocina. Cubre sin apretar con film y calienta a 600 W durante 4 minutos.",
      },
    },
    {
      key: "check",
      text: {
        ja: "豚肉に赤みが残っていれば、30秒ずつ追加加熱します。",
        en: "If any pink remains in the pork, heat in 30-second bursts.",
        es: "Si queda algo rosado en el cerdo, calienta en tandas de 30 segundos.",
      },
    },
    {
      key: "serve",
      text: {
        ja: "しょうゆとレモン汁を混ぜてかけます。",
        en: "Mix the soy sauce and lemon juice and pour over.",
        es: "Mezcla la salsa de soja y el zumo de limón y viértelo por encima.",
      },
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
