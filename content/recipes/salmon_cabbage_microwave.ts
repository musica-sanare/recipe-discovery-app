import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "salmon_cabbage_microwave",
  texts: {
    name: { ja: "サーモンとキャベツのレンジ蒸し", en: "Microwave-steamed salmon and cabbage", es: "Salmón y repollo al vapor en microondas", fr: "Saumon et chou à la vapeur au micro-ondes" },
    summary: {
      ja: "サーモン、キャベツ、しめじを耐熱容器に入れて電子レンジで蒸すだけ。洗い物も少なく済みます。",
      en: "Salmon, cabbage, and shimeji steamed together in the microwave in one dish, with little cleanup.",
      es: "Salmón, repollo y shimeji cocinados al vapor en el microondas en un solo recipiente, con pocos utensilios que lavar.",
      fr: "Saumon, chou et shimeji cuits ensemble à la vapeur au micro-ondes dans un seul plat, avec peu de vaisselle.",
    },
  },
  cuisine: "japanese",
  goals: ["maintain"],
  mainProteinGroup: "fish",
  tags: [],
  minutes: 12,
  effort: 1,
  equipment: ["microwave"],
  servings: 1,
  ingredients: [
    { key: "salmon", food: "salmon", grams: 100, state: "microwave", role: "main_protein", adjust: { kind: "grams", min: 80, max: 160, step: 10 } },
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
        fr: "Les tables n'ont pas de valeur pour le chou cuit au micro-ondes ; la valeur à l'état cru est donc utilisée.",
      },
    },
    { key: "shimeji", food: "shimeji", grams: 50, state: "raw", cooking: "microwave", role: "vegetable" },
    { key: "soy_sauce", food: "soy_sauce", grams: 6, state: "as_is", measure: { unit: "tsp", quantity: 1 }, role: "seasoning", linkedTo: "salmon" },
    { key: "sake", food: "cooking_sake", grams: 10, state: "as_is", measure: { unit: "tsp", quantity: 2 }, role: "seasoning", linkedTo: "salmon" },
    { key: "lemon", food: "lemon_juice", grams: 5, state: "as_is", measure: { unit: "tsp", quantity: 1 }, role: "seasoning", linkedTo: "salmon" },
    { key: "rice", food: "rice_cooked", grams: 150, state: "as_is", role: "main_carb", adjust: { kind: "grams", min: 100, max: 250, step: 10 } },
  ],
  sides: [
    { key: "rice", label: { ja: "ご飯", en: "Rice", es: "Arroz", fr: "Riz" }, ingredients: ["rice"], solverMayRemove: true },
  ],
  steps: [
    {
      key: "prep",
      text: {
        ja: "キャベツをざく切り、しめじを小房に分けて耐熱容器に敷き、その上にサーモンをのせます。",
        en: "Roughly chop the cabbage, separate the shimeji, spread them in a microwave-safe dish, and place the salmon on top.",
        es: "Trocea el repollo, separa las shimeji, colócalos en un recipiente apto para microondas y pon el salmón encima.",
        fr: "Coupez grossièrement le chou, séparez les shimeji, étalez-les dans un plat allant au micro-ondes et posez le saumon dessus.",
      },
    },
    {
      key: "microwave",
      text: {
        ja: "料理酒をふり、ふんわりとラップをかけて600Wで4〜5分加熱します。",
        en: "Sprinkle with cooking sake, cover loosely with plastic wrap, and microwave at 600 W for 4 to 5 minutes.",
        es: "Rocía con el sake de cocina, cubre sin apretar con film y calienta en el microondas a 600 W de 4 a 5 minutos.",
        fr: "Arrosez de saké de cuisine, couvrez sans serrer de film alimentaire et faites chauffer au micro-ondes à 600 W pendant 4 à 5 minutes.",
      },
    },
    {
      key: "season",
      text: {
        ja: "サーモンの中心まで火が通っていることを確かめ、しょうゆとレモン果汁をかけます。",
        en: "Check that the salmon is cooked through, then drizzle with soy sauce and lemon juice.",
        es: "Comprueba que el salmón esté hecho por dentro y rocíalo con la salsa de soja y el zumo de limón.",
        fr: "Vérifiez que le saumon est cuit à cœur, puis arrosez de sauce soja et de jus de citron.",
      },
    },
  ],
  safetyNotes: [
    {
      key: "even_heating",
      text: {
        ja: "電子レンジは加熱むらが出やすいので、サーモンの中心まで火が通っているか確かめ、足りなければ30秒ずつ追加加熱してください。",
        en: "Microwaves heat unevenly. Check that the salmon is cooked in the center and add 30-second bursts if needed.",
        es: "El microondas calienta de forma desigual. Comprueba que el salmón esté hecho en el centro y añade tandas de 30 segundos si hace falta.",
        fr: "Le micro-ondes chauffe de façon inégale. Vérifiez que le saumon est cuit au centre et ajoutez des tranches de 30 secondes si nécessaire.",
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
