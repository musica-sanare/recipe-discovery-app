import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "salmon_cabbage_microwave",
  texts: {
    name: { ja: "サーモンとキャベツのレンジ蒸し", en: "Microwave-steamed salmon and cabbage", es: "Salmón y repollo al vapor en microondas" },
    summary: {
      ja: "サーモン、キャベツ、しめじを耐熱容器に入れて電子レンジで蒸すだけ。洗い物も少なく済みます。",
      en: "Salmon, cabbage, and shimeji steamed together in the microwave in one dish, with little cleanup.",
      es: "Salmón, repollo y shimeji cocinados al vapor en el microondas en un solo recipiente, con poco que fregar.",
    },
  },
  cuisine: "japanese",
  goals: ["maintain"],
  tags: ["quick"],
  minutes: 12,
  effort: 1,
  equipment: ["microwave"],
  servings: 1,
  ingredients: [
    { key: "salmon", food: "salmon", grams: 100, state: "microwave", role: "main_protein", adjust: { min: 80, max: 160, step: 10 } },
    {
      key: "cabbage",
      food: "cabbage",
      grams: 120,
      state: "raw",
      cooking: "microwave",
      role: "vegetable",
      note: {
        ja: "成分表に電子レンジ調理したキャベツの値がないため、生の値で計算しています。",
        en: "The tables have no value for microwaved cabbage, so the raw value is used.",
        es: "Las tablas no tienen un valor para el repollo cocinado en microondas, así que se usa el valor en crudo.",
      },
    },
    { key: "shimeji", food: "shimeji", grams: 50, state: "raw", cooking: "microwave", role: "vegetable" },
    { key: "soy_sauce", food: "soy_sauce", grams: 6, state: "as_is", measure: { unit: "tsp", quantity: 1 }, role: "seasoning" },
    { key: "sake", food: "cooking_sake", grams: 10, state: "as_is", measure: { unit: "tsp", quantity: 2 }, role: "seasoning" },
    { key: "lemon", food: "lemon_juice", grams: 5, state: "as_is", measure: { unit: "tsp", quantity: 1 }, role: "seasoning" },
    { key: "rice", food: "rice_cooked", grams: 150, state: "as_is", role: "main_carb", adjust: { min: 0, max: 250, step: 10 } },
  ],
  steps: [
    {
      ja: "キャベツをざく切り、しめじを小房に分けて耐熱容器に敷き、その上にサーモンをのせます。",
      en: "Roughly chop the cabbage, separate the shimeji, spread them in a microwave-safe dish, and place the salmon on top.",
      es: "Trocea el repollo, separa las shimeji, colócalos en un recipiente apto para microondas y pon el salmón encima.",
    },
    {
      ja: "料理酒をふり、ふんわりとラップをかけて600Wで4〜5分加熱します。",
      en: "Sprinkle with cooking sake, cover loosely with plastic wrap, and microwave at 600 W for 4 to 5 minutes.",
      es: "Rocía con el sake de cocina, cubre sin apretar con film y calienta en el microondas a 600 W de 4 a 5 minutos.",
    },
    {
      ja: "サーモンの中心まで火が通っていることを確かめ、しょうゆとレモン果汁をかけます。ご飯を添えます。",
      en: "Check that the salmon is cooked through, then drizzle with soy sauce and lemon juice. Serve with rice.",
      es: "Comprueba que el salmón esté hecho por dentro y rocíalo con la salsa de soja y el zumo de limón. Sírvelo con arroz.",
    },
  ],
  safetyNotes: [
    {
      ja: "電子レンジは加熱むらが出やすいので、サーモンの中心まで火が通っているか確かめ、足りなければ30秒ずつ追加加熱してください。",
      en: "Microwaves heat unevenly. Check that the salmon is cooked in the center and add 30-second bursts if needed.",
      es: "El microondas calienta de forma desigual. Comprueba que el salmón esté hecho en el centro y añade tandas de 30 segundos si hace falta.",
    },
    {
      ja: "加熱直後は蒸気でやけどしやすいので、ラップは奥から手前に向かって外してください。",
      en: "Steam can burn right after heating; peel the wrap away from you.",
      es: "El vapor puede quemar justo después de calentar; retira el film en dirección contraria a ti.",
    },
  ],
  substitutions: [],
};
