import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "mafe_boeuf",
  texts: {
    name: { ja: "マフェ（牛赤身肉のピーナッツシチュー）", en: "Mafé (lean beef in peanut sauce)", es: "Mafé (ternera magra en salsa de cacahuete)", fr: "Mafé de bœuf" },
    summary: {
      ja: "セネガルやマリの煮込みをヒントに、牛もも肉と野菜をトマトとピーナッツバターのソースで煮込みます。長粒米のご飯を添えます。",
      en: "Inspired by stews from Senegal and Mali: lean beef and vegetables simmered in a tomato and peanut butter sauce, with long-grain rice.",
      es: "Inspirado en los guisos de Senegal y Malí: ternera magra y verduras guisadas en una salsa de tomate y crema de cacahuete, con arroz largo.",
      fr: "Inspiré des plats mijotés du Sénégal et du Mali : bœuf maigre et légumes mijotés dans une sauce à la tomate et au beurre de cacahuète, avec du riz long.",
    },
  },
  cuisine: "west_african",
  goals: ["bulk"],
  mainProteinGroup: "beef",
  tags: ["batch"],
  minutes: 60,
  effort: 2,
  equipment: ["stove", "pot"],
  servings: 1,
  ingredients: [
    { key: "beef", food: "beef_round", grams: 140, state: "boil", role: "main_protein", adjust: { kind: "grams", min: 100, max: 180, step: 20 } },
    { key: "salt", food: "salt", grams: 1, state: "as_is", measure: { unit: "pinch", quantity: 2 }, role: "seasoning", linkedTo: "beef" },
    { key: "oil", food: "vegetable_oil", grams: 4, state: "as_is", measure: { unit: "tsp", quantity: 1 }, role: "fat" },
    { key: "onion", food: "onion", grams: 60, state: "boil", measure: { unit: "piece", quantity: 0.25 }, role: "vegetable" },
    { key: "garlic", food: "garlic", grams: 5, state: "raw", measure: { unit: "clove", quantity: 1 }, role: "seasoning" },
    { key: "tomato_paste", food: "tomato_paste", grams: 15, state: "as_is", measure: { unit: "tbsp", quantity: 1 }, role: "seasoning" },
    { key: "peanut_butter", food: "peanut_butter", grams: 25, state: "as_is", measure: { unit: "tbsp", quantity: 1.5 }, role: "other" },
    { key: "chili", food: "chili_pepper_powder", grams: 0.2, state: "as_is", measure: { unit: "pinch", quantity: 1 }, role: "seasoning" },
    { key: "carrot", food: "carrot", grams: 50, state: "boil", measure: { unit: "piece", quantity: 0.25 }, role: "vegetable" },
    { key: "cabbage", food: "cabbage", grams: 80, state: "boil", role: "vegetable" },
    {
      key: "sweet_potato",
      food: "sweet_potato",
      grams: 60,
      state: "steam",
      cooking: "simmer",
      role: "vegetable",
      note: {
        ja: "成分表に煮込んださつまいもの値がないため、蒸した値で計算しています。",
        en: "The tables have no value for stewed sweet potato, so the steamed value is used.",
        es: "Las tablas no tienen un valor para el boniato guisado, así que se usa el valor al vapor.",
        fr: "Les tables n'ont pas de valeur pour la patate douce mijotée ; la valeur à la vapeur est donc utilisée.",
      },
    },
    { key: "rice", food: "indica_rice_cooked", grams: 150, state: "as_is", role: "main_carb", adjust: { kind: "grams", min: 100, max: 250, step: 50 } },
  ],
  sides: [{ key: "rice", label: { ja: "長粒米のご飯", en: "Long-grain rice", es: "Arroz largo", fr: "Riz long" }, ingredients: ["rice"], solverMayRemove: true }],
  steps: [
    {
      key: "prep",
      text: {
        ja: "牛もも肉を3cm角に切り、塩をまぶします。玉ねぎはみじん切り、にんじんとさつまいもは2cm角、キャベツはざく切りにし、にんにくはすりおろします。",
        en: "Cut the beef into 3 cm cubes and season with the salt. Finely chop the onion, cut the carrot and sweet potato into 2 cm pieces, roughly chop the cabbage, and grate the garlic.",
        es: "Corta la ternera en dados de 3 cm y sálala. Pica finamente la cebolla, corta la zanahoria y el boniato en dados de 2 cm, trocea la col y ralla el ajo.",
        fr: "Coupez le bœuf en cubes de 3 cm et salez-le. Hachez finement l'oignon, coupez la carotte et la patate douce en dés de 2 cm, émincez grossièrement le chou et râpez l'ail.",
      },
    },
    {
      key: "brown",
      text: {
        ja: "鍋に油を強めの中火で熱し、牛肉の表面を焼きます。玉ねぎとにんにくを加えて2分炒め、トマトペーストを加えて1分炒めます。",
        en: "Heat the oil in a pot over medium-high heat and brown the beef. Add the onion and garlic and stir-fry for 2 minutes, then add the tomato paste and stir for 1 minute.",
        es: "Calienta el aceite en una olla a fuego medio-alto y dora la ternera. Añade la cebolla y el ajo y saltea 2 minutos; luego añade el concentrado de tomate y remueve 1 minuto.",
        fr: "Faites chauffer l'huile dans une cocotte à feu moyen-vif et faites dorer le bœuf. Ajoutez l'oignon et l'ail et faites revenir 2 minutes, puis ajoutez le concentré de tomate et remuez 1 minute.",
      },
    },
    {
      key: "simmer",
      text: {
        ja: "水300mlを加えて煮立て、ふたをして弱火で30分煮ます。",
        en: "Add 300 ml of water, bring to a boil, cover, and cook over low heat for 30 minutes.",
        es: "Añade 300 ml de agua, lleva a ebullición, tapa y cuece a fuego bajo 30 minutos.",
        fr: "Ajoutez 300 ml d'eau, portez à ébullition, couvrez et laissez cuire 30 minutes à feu doux.",
      },
    },
    {
      key: "peanut",
      text: {
        ja: "ピーナッツバターを煮汁で溶いて加え、にんじん、さつまいも、キャベツ、一味唐辛子を入れます。ときどき混ぜながら、弱火で15分、野菜がやわらかくなるまで煮ます。",
        en: "Loosen the peanut butter with a little of the cooking liquid and stir it in. Add the carrot, sweet potato, cabbage, and ground chili pepper and cook over low heat for 15 minutes, stirring now and then, until the vegetables are tender.",
        es: "Diluye la crema de cacahuete con un poco del caldo e incorpórala. Añade la zanahoria, el boniato, la col y la guindilla molida y cuece a fuego bajo 15 minutos, removiendo de vez en cuando, hasta que las verduras estén tiernas.",
        fr: "Délayez le beurre de cacahuète avec un peu de bouillon et incorporez-le. Ajoutez la carotte, la patate douce, le chou et le piment moulu et laissez cuire 15 minutes à feu doux en remuant de temps en temps, jusqu'à ce que les légumes soient tendres.",
      },
    },
    { key: "rice", side: "rice", text: { ja: "長粒米のご飯を添えます。", en: "Serve with the long-grain rice.", es: "Acompáñalo con el arroz largo.", fr: "Servez avec le riz long." } },
  ],
  safetyNotes: [
    {
      key: "hot_sauce",
      text: {
        ja: "とろみのついたソースは冷めにくく、底が焦げやすいので、ときどき混ぜてください。熱いのでやけどに注意します。",
        en: "The thick sauce stays hot for a long time and can catch on the bottom; stir now and then and take care not to burn yourself.",
        es: "La salsa espesa tarda en enfriarse y puede pegarse al fondo; remueve de vez en cuando y ten cuidado de no quemarte.",
        fr: "La sauce épaisse reste chaude longtemps et peut attacher au fond ; remuez de temps en temps et faites attention à ne pas vous brûler.",
      },
    },
    {
      key: "cooling",
      text: {
        ja: "作り置きする場合は、浅い容器に移して早めに冷まし、冷蔵庫で保存してください。食べるときは中心まで十分に温め直します。",
        en: "To keep leftovers, transfer them to a shallow container, cool them quickly, and refrigerate. Reheat until piping hot throughout before eating.",
        es: "Si guardas sobras, pásalas a un recipiente poco hondo, enfríalas rápido y guárdalas en el refrigerador. Antes de comer, recaliéntalas hasta que estén bien calientes por dentro.",
        fr: "Pour conserver les restes, mettez-les dans un récipient peu profond, faites-les refroidir rapidement et placez-les au réfrigérateur. Avant de les manger, réchauffez-les jusqu'à ce qu'ils soient bien chauds à cœur.",
      },
    },
  ],
  substitutions: [],
};
