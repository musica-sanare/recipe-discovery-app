import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "beef_broccoli_microwave",
  texts: {
    name: { ja: "牛ももとブロッコリーのレンジ蒸し しょうがじょうゆ", en: "Microwave-steamed beef and broccoli with ginger soy sauce", es: "Ternera y brócoli al vapor en microondas con salsa de soja y jengibre", fr: "Bœuf et brocoli à la vapeur au micro-ondes, sauce soja au gingembre" },
    summary: {
      ja: "電子レンジだけで作る、しょうがじょうゆ味の牛肉とブロッコリー。ご飯を添えます。",
      en: "Lean beef and broccoli in ginger soy sauce, made entirely in the microwave, with rice.",
      es: "Ternera magra y brócoli con salsa de soja y jengibre, hechos solo en el microondas, con arroz.",
      fr: "Bœuf maigre et brocoli à la sauce soja au gingembre, entièrement préparés au micro-ondes, avec du riz.",
    },
  },
  cuisine: "chinese",
  goals: ["cut"],
  mainProteinGroup: "beef",
  tags: [],
  minutes: 12,
  effort: 1,
  equipment: ["microwave"],
  servings: 1,
  ingredients: [
    {
      key: "beef",
      food: "beef_round",
      grams: 150,
      state: "raw",
      cooking: "microwave",
      role: "main_protein",
      adjust: { kind: "grams", min: 120, max: 220, step: 10 },
      note: {
        ja: "成分表に電子レンジで加熱した牛もも肉の値がないため、生の値で計算しています。",
        en: "The tables have no value for microwaved beef round, so the raw value is used.",
        es: "Las tablas no tienen un valor para la ternera al microondas, así que se usa el valor en crudo.",
        fr: "Les tables n'ont pas de valeur pour la tende de tranche de bœuf cuite au micro-ondes ; la valeur à l'état cru est donc utilisée.",
      },
    },
    { key: "starch", food: "potato_starch", grams: 3, state: "as_is", measure: { unit: "tsp", quantity: 1 }, role: "coating", linkedTo: "beef" },
    { key: "soy_sauce", food: "soy_sauce", grams: 12, state: "as_is", measure: { unit: "tsp", quantity: 2 }, role: "seasoning", linkedTo: "beef" },
    { key: "sake", food: "cooking_sake", grams: 10, state: "as_is", measure: { unit: "tsp", quantity: 2 }, role: "seasoning", linkedTo: "beef" },
    { key: "ginger", food: "ginger", grams: 5, state: "raw", measure: { unit: "knob", quantity: 0.5 }, role: "seasoning", linkedTo: "beef" },
    { key: "broccoli", food: "broccoli", grams: 120, state: "microwave", role: "vegetable" },
    { key: "sesame_oil", food: "sesame_oil", grams: 2, state: "as_is", role: "fat" },
    { key: "rice", food: "rice_cooked", grams: 180, state: "as_is", role: "main_carb", adjust: { kind: "grams", min: 100, max: 300, step: 10 } },
  ],
  sides: [
    { key: "rice", label: { ja: "ご飯", en: "Rice", es: "Arroz", fr: "Riz" }, ingredients: ["rice"], solverMayRemove: true },
  ],
  steps: [
    {
      key: "prep",
      text: {
        ja: "牛肉をひと口大に切り、しょうゆ、料理酒、すりおろしたしょうがをもみ込んでから片栗粉をまぶします。ブロッコリーは小房に分けます。",
        en: "Cut the beef into bite-size pieces, rub in the soy sauce, cooking sake, and grated ginger, then coat with the potato starch. Cut the broccoli into florets.",
        es: "Corta la ternera en trozos pequeños, mézclala con la salsa de soja, el sake de cocina y el jengibre rallado y rebózala con la fécula de patata. Separa el brócoli en ramilletes.",
        fr: "Coupez le bœuf en bouchées, frottez-le avec la sauce soja, le saké de cuisine et le gingembre râpé, puis enrobez-le de fécule de pomme de terre. Détaillez le brocoli en fleurettes.",
      },
    },
    {
      key: "heat",
      text: {
        ja: "耐熱皿にブロッコリーを敷き、牛肉を重ならないように広げてのせます。ふんわりとラップをかけ、600Wで3分加熱します。",
        en: "Spread the broccoli on a microwave-safe plate and lay the beef on top without overlapping. Cover loosely with plastic wrap and heat at 600 W for 3 minutes.",
        es: "Extiende el brócoli en un plato apto para microondas y coloca la ternera encima sin que se superponga. Cubre sin apretar con film y calienta a 600 W durante 3 minutos.",
        fr: "Étalez le brocoli sur une assiette allant au micro-ondes et posez le bœuf dessus sans le superposer. Couvrez sans serrer de film alimentaire et faites chauffer 3 minutes à 600 W.",
      },
    },
    {
      key: "check",
      text: {
        ja: "取り出して全体を混ぜ、赤い部分が残っていれば30秒ずつ追加加熱します。",
        en: "Take it out and stir; if any red remains, heat in 30-second bursts.",
        es: "Sácalo y remueve; si queda algo rojo, calienta en tandas de 30 segundos.",
        fr: "Sortez l'assiette et mélangez ; s'il reste du rouge, faites chauffer par tranches de 30 secondes.",
      },
    },
    {
      key: "serve",
      text: {
        ja: "ごま油を回しかけます。",
        en: "Drizzle with the sesame oil.",
        es: "Rocía con el aceite de sésamo.",
        fr: "Arrosez d'huile de sésame.",
      },
    },
  ],
  safetyNotes: [
    {
      key: "even_heating",
      text: {
        ja: "電子レンジは加熱むらが出やすいので、牛肉の赤い部分がなくなるまで加熱してください。",
        en: "Microwaves heat unevenly; heat until no red remains in the beef.",
        es: "El microondas calienta de forma desigual; calienta hasta que no quede nada rojo en la ternera.",
        fr: "Le micro-ondes chauffe de façon inégale ; faites chauffer jusqu'à ce qu'il ne reste plus de rouge dans le bœuf.",
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
