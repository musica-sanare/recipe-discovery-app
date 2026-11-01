import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "papillote_saumon_poireaux",
  texts: {
    name: { ja: "白鮭とリーキの電子レンジ包み蒸し", en: "Chum salmon and leek parcel, microwave", es: "Papillote de salmón keta y puerro al microondas", fr: "Papillote de saumon kéta aux poireaux au micro-ondes" },
    summary: {
      ja: "フランスのパピヨット（包み焼き）をヒントに、白鮭とリーキをクッキングシートで包み、電子レンジで蒸します。ご飯を添えます。",
      en: "Inspired by the French papillote: chum salmon and leek wrapped in baking paper and steamed in the microwave. With rice.",
      es: "Inspirado en la papillote francesa: salmón keta y puerro envueltos en papel de horno y cocidos al vapor en el microondas. Con arroz.",
      fr: "Une papillote de saumon kéta et de poireau en papier cuisson, cuite à la vapeur au micro-ondes. Avec du riz.",
    },
  },
  cuisine: "french",
  goals: ["cut"],
  mainProteinGroup: "fish",
  tags: [],
  minutes: 15,
  effort: 1,
  equipment: ["microwave"],
  servings: 1,
  ingredients: [
    {
      key: "salmon",
      food: "chum_salmon",
      grams: 140,
      state: "simmer",
      cooking: "microwave",
      measure: { unit: "piece", quantity: 1.5 },
      role: "main_protein",
      adjust: { kind: "grams", min: 100, max: 180, step: 20 },
      note: {
        ja: "成分表に電子レンジで加熱した白鮭の値がないため、水煮の値で計算しています。",
        en: "The tables have no value for microwaved chum salmon, so the simmered value is used.",
        es: "Las tablas no tienen un valor para el salmón keta al microondas, así que se usa el valor cocido en agua.",
        fr: "Les tables n'ont pas de valeur pour le saumon kéta cuit au micro-ondes ; la valeur du saumon poché est donc utilisée.",
      },
    },
    { key: "salt", food: "salt", grams: 0.8, state: "as_is", measure: { unit: "pinch", quantity: 1.5 }, role: "seasoning", linkedTo: "salmon" },
    { key: "pepper", food: "black_pepper", grams: 0.2, state: "as_is", measure: { unit: "pinch", quantity: 1 }, role: "seasoning", linkedTo: "salmon" },
    {
      key: "leek",
      food: "leek",
      grams: 80,
      state: "boil",
      cooking: "microwave",
      measure: { unit: "stalk", quantity: 0.5 },
      role: "vegetable",
      note: {
        ja: "成分表に電子レンジで加熱したリーキの値がないため、ゆでた値で計算しています。",
        en: "The tables have no value for microwaved leek, so the boiled value is used.",
        es: "Las tablas no tienen un valor para el puerro al microondas, así que se usa el valor hervido.",
        fr: "Les tables n'ont pas de valeur pour le poireau cuit au micro-ondes ; la valeur du poireau bouilli est donc utilisée.",
      },
    },
    { key: "lemon", food: "lemon_juice", grams: 10, state: "as_is", measure: { unit: "tsp", quantity: 2 }, role: "seasoning" },
    { key: "olive_oil", food: "olive_oil", grams: 3, state: "as_is", measure: { unit: "tsp", quantity: 0.75 }, role: "fat" },
    { key: "thyme", food: "thyme", grams: 0.2, state: "as_is", measure: { unit: "pinch", quantity: 1 }, role: "seasoning" },
    { key: "rice", food: "rice_cooked", grams: 150, state: "as_is", role: "main_carb", adjust: { kind: "grams", min: 100, max: 250, step: 50 } },
  ],
  sides: [{ key: "rice", label: { ja: "ご飯", en: "Rice", es: "Arroz", fr: "Riz" }, ingredients: ["rice"], solverMayRemove: true }],
  steps: [
    {
      key: "prep",
      text: {
        ja: "リーキは縦半分に切って洗い、5mm幅の斜め切りにします。鮭に塩とこしょうをふります。",
        en: "Halve the leek lengthwise, wash it, and slice it diagonally 5 mm thick. Season the salmon with the salt and pepper.",
        es: "Corta el puerro por la mitad a lo largo, lávalo y córtalo en diagonal en rodajas de 5 mm. Salpimienta el salmón.",
        fr: "Coupez le poireau en deux dans la longueur, lavez-le et émincez-le en biais en tranches de 5 mm. Salez et poivrez le saumon.",
      },
    },
    {
      key: "wrap",
      text: {
        ja: "クッキングシートにリーキを敷いて鮭をのせ、レモン果汁、オリーブオイル、タイムをかけます。シートの端をしっかり折って包み、耐熱皿にのせます。",
        en: "Spread the leek on a sheet of baking paper, place the salmon on top, and add the lemon juice, olive oil, and thyme. Fold the edges of the paper tightly to close the parcel and set it on a microwave-safe plate.",
        es: "Extiende el puerro sobre una hoja de papel de horno, coloca el salmón encima y añade el zumo de limón, el aceite de oliva y el tomillo. Dobla bien los bordes para cerrar el paquete y ponlo en un plato apto para microondas.",
        fr: "Étalez le poireau sur une feuille de papier cuisson, posez le saumon dessus et ajoutez le jus de citron, l'huile d'olive et le thym. Repliez bien les bords pour fermer la papillote et posez-la sur une assiette allant au micro-ondes.",
      },
    },
    {
      key: "cook",
      text: {
        ja: "600Wで4分加熱し、そのまま1分置きます。",
        en: "Microwave at 600 W for 4 minutes, then leave it to stand for 1 minute.",
        es: "Calienta en el microondas a 600 W 4 minutos y deja reposar 1 minuto.",
        fr: "Faites cuire 4 minutes au micro-ondes à 600 W, puis laissez reposer 1 minute.",
      },
    },
    { key: "rice", side: "rice", text: { ja: "ご飯を添えます。", en: "Serve with the rice.", es: "Acompáñalo con el arroz.", fr: "Servez avec le riz." } },
  ],
  safetyNotes: [
    {
      key: "even_heating",
      text: {
        ja: "電子レンジは加熱むらが出やすいので、鮭の中心まで火が通っているか確かめ、足りなければ30秒ずつ追加加熱してください。",
        en: "Microwaves heat unevenly. Check that the salmon is cooked in the center and add 30-second bursts if needed.",
        es: "El microondas calienta de forma desigual. Comprueba que el salmón esté hecho en el centro y añade tandas de 30 segundos si hace falta.",
        fr: "Le micro-ondes chauffe de façon inégale. Vérifiez que le saumon est cuit au centre et ajoutez des tranches de 30 secondes si nécessaire.",
      },
    },
    {
      key: "steam",
      text: {
        ja: "加熱直後は蒸気でやけどしやすいので、包みは奥から手前に向かって開いてください。",
        en: "Steam can burn right after heating; open the parcel away from you.",
        es: "El vapor puede quemar justo después de calentar; abre el paquete en dirección contraria a ti.",
        fr: "La vapeur peut brûler juste après la cuisson ; ouvrez la papillote en l'écartant de vous.",
      },
    },
  ],
  substitutions: [],
};
