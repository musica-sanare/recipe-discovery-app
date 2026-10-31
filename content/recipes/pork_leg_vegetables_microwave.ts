import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "pork_leg_vegetables_microwave",
  texts: {
    name: { ja: "豚もも肉と野菜のレンジ蒸し レモンじょうゆ", en: "Microwave-steamed pork and vegetables with lemon soy sauce", es: "Cerdo y verduras al vapor en microondas con salsa de soja y limón", fr: "Porc et légumes à la vapeur au micro-ondes, sauce soja citronnée" },
    summary: {
      ja: "キャベツとにんじんに豚もも肉を広げて電子レンジで蒸し、レモンじょうゆをかけます。ご飯を添えます。",
      en: "Lean pork spread over cabbage and carrot, steamed in the microwave, and finished with lemon soy sauce, with rice.",
      es: "Cerdo magro sobre repollo y zanahoria, al vapor en el microondas y terminado con salsa de soja y limón, con arroz.",
      fr: "Porc maigre étalé sur du chou et de la carotte, cuit à la vapeur au micro-ondes et relevé de sauce soja citronnée, avec du riz.",
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
        fr: "Les tables n'ont pas de valeur pour le jambon de porc frais cuit au micro-ondes ; la valeur à l'état cru est donc utilisée.",
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
        fr: "Les tables n'ont pas de valeur pour le chou cuit au micro-ondes ; la valeur à l'état cru est donc utilisée.",
      },
    },
    { key: "carrot", food: "carrot", grams: 40, state: "raw", cooking: "microwave", role: "vegetable" },
    { key: "soy_sauce", food: "soy_sauce", grams: 12, state: "as_is", measure: { unit: "tsp", quantity: 2 }, role: "seasoning", linkedTo: "pork" },
    { key: "lemon_juice", food: "lemon_juice", grams: 10, state: "as_is", measure: { unit: "tsp", quantity: 2 }, role: "seasoning", linkedTo: "pork" },
    { key: "rice", food: "rice_cooked", grams: 180, state: "as_is", role: "main_carb", adjust: { kind: "grams", min: 100, max: 300, step: 10 } },
  ],
  sides: [
    { key: "rice", label: { ja: "ご飯", en: "Rice", es: "Arroz", fr: "Riz" }, ingredients: ["rice"], solverMayRemove: true },
  ],
  steps: [
    {
      key: "prep",
      text: {
        ja: "キャベツはざく切り、にんじんは細切りにします。豚肉は薄切りを使い、大きければ半分に切ります。",
        en: "Roughly chop the cabbage and cut the carrot into thin strips. Use thinly sliced pork and halve any large slices.",
        es: "Trocea el repollo y corta la zanahoria en tiras finas. Usa cerdo en lonchas finas y corta por la mitad las más grandes.",
        fr: "Coupez grossièrement le chou et taillez la carotte en fines lanières. Utilisez du porc en fines tranches et coupez les grandes tranches en deux.",
      },
    },
    {
      key: "heat",
      text: {
        ja: "耐熱皿にキャベツとにんじんを敷き、豚肉を重ならないように広げて料理酒をふります。ふんわりとラップをかけ、600Wで4分加熱します。",
        en: "Spread the cabbage and carrot on a microwave-safe plate, lay the pork on top without overlapping, and sprinkle with the cooking sake. Cover loosely with plastic wrap and heat at 600 W for 4 minutes.",
        es: "Extiende el repollo y la zanahoria en un plato apto para microondas, coloca el cerdo encima sin que se superponga y rocía con el sake de cocina. Cubre sin apretar con film y calienta a 600 W durante 4 minutos.",
        fr: "Étalez le chou et la carotte sur une assiette allant au micro-ondes, posez le porc dessus sans superposer les tranches et arrosez de saké de cuisine. Couvrez sans serrer de film alimentaire et faites chauffer 4 minutes à 600 W.",
      },
    },
    {
      key: "check",
      text: {
        ja: "豚肉に赤みが残っていれば、30秒ずつ追加加熱します。",
        en: "If any pink remains in the pork, heat in 30-second bursts.",
        es: "Si queda algo rosado en el cerdo, calienta en tandas de 30 segundos.",
        fr: "S'il reste du rose sur le porc, prolongez par tranches de 30 secondes.",
      },
    },
    {
      key: "serve",
      text: {
        ja: "しょうゆとレモン汁を混ぜてかけます。",
        en: "Mix the soy sauce and lemon juice and pour over.",
        es: "Mezcla la salsa de soja y el zumo de limón y viértelo por encima.",
        fr: "Mélangez la sauce soja et le jus de citron et versez sur le plat.",
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
        fr: "Le micro-ondes chauffe de façon inégale ; vérifiez que le porc est cuit à cœur.",
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
