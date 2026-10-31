import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "tofu_egg_champuru",
  texts: {
    name: { ja: "豆腐と卵のチャンプルー", en: "Tofu and egg champuru", es: "Champuru de tofu y huevo", fr: "Champuru de tofu et d'œuf" },
    summary: {
      ja: "沖縄の炒め物。焼き色をつけた木綿豆腐とキャベツ、卵を炒め合わせます。",
      en: "An Okinawan stir-fry of browned firm tofu, cabbage, and egg.",
      es: "Un salteado de Okinawa con tofu firme dorado, repollo y huevo.",
      fr: "Un sauté d'Okinawa de tofu ferme doré, de chou et d'œuf.",
    },
  },
  cuisine: "okinawan",
  goals: ["maintain"],
  mainProteinGroup: "soy",
  tags: [],
  minutes: 20,
  effort: 2,
  equipment: ["stove", "frying_pan", "pot"],
  servings: 1,
  ingredients: [
    {
      key: "tofu",
      food: "tofu_firm",
      grams: 200,
      state: "raw",
      cooking: "stir_fry",
      measure: { unit: "block", quantity: 2 / 3 },
      role: "main_protein",
      adjust: { kind: "grams", min: 150, max: 300, step: 50 },
      note: {
        ja: "成分表に加熱した豆腐の値がないため、加熱前の値で計算しています。",
        en: "The tables have no value for cooked tofu, so the uncooked value is used.",
        es: "Las tablas no tienen un valor para el tofu cocinado, así que se usa el valor sin cocinar.",
        fr: "Les tables n'ont pas de valeur pour le tofu cuit ; la valeur avant cuisson est donc utilisée.",
      },
    },
    { key: "oil_tofu", food: "vegetable_oil", grams: 4, state: "as_is", measure: { unit: "tsp", quantity: 1 }, role: "fat", linkedTo: "tofu" },
    {
      key: "cabbage",
      food: "cabbage",
      grams: 100,
      state: "boil",
      role: "vegetable",
      note: {
        ja: "さっとゆでてから炒め合わせるため、ゆでた値で計算しています。炒め合わせる油は豆腐の油として数えています。",
        en: "The cabbage is blanched before it is tossed in the pan, so the boiled value is used; the oil is counted with the tofu.",
        es: "El repollo se escalda antes de saltearlo, así que se usa el valor hervido; el aceite se cuenta con el tofu.",
        fr: "Le chou est blanchi avant d'être sauté ; la valeur bouillie est donc utilisée. L'huile est comptée avec le tofu.",
      },
    },
    { key: "egg", food: "egg", grams: 50, state: "scramble", measure: { unit: "piece", quantity: 1 }, role: "main_protein", adjust: { kind: "count", unitGrams: 50, min: 1, max: 2 } },
    { key: "oil_egg", food: "vegetable_oil", grams: 3, state: "as_is", role: "fat", linkedTo: "egg", includedIn: "egg" },
    {
      key: "egg_white",
      food: "egg_white",
      grams: 99,
      state: "raw",
      cooking: "scramble",
      measure: { unit: "piece", quantity: 3 },
      role: "main_protein",
      adjust: { kind: "count", unitGrams: 33, min: 1, max: 5 },
      note: {
        ja: "成分表に加熱した卵白の値がないため、生の値で計算しています。残った黄身は別の料理に使えます。市販の液卵白でも作れます。",
        en: "The tables have no value for cooked egg white, so the raw value is used. Use the leftover yolks in another dish, or use liquid egg white from a carton.",
        es: "Las tablas no tienen un valor para la clara cocinada, así que se usa el valor en crudo. Usa las yemas que sobren en otro plato, o usa clara de huevo líquida envasada.",
        fr: "Les tables n'ont pas de valeur pour le blanc d'œuf cuit ; la valeur à l'état cru est donc utilisée. Utilisez les jaunes restants dans un autre plat, ou prenez du blanc d'œuf liquide en brique.",
      },
    },
    { key: "soy_sauce", food: "soy_sauce", grams: 8, state: "as_is", measure: { unit: "tsp", quantity: 1.5 }, role: "seasoning", linkedTo: "tofu" },
    { key: "stock", food: "chinese_stock_granules", grams: 2, state: "as_is", role: "seasoning", linkedTo: "tofu" },
    { key: "pepper", food: "black_pepper", grams: 0.2, state: "as_is", measure: { unit: "pinch", quantity: 1 }, role: "seasoning", linkedTo: "tofu" },
    { key: "rice", food: "rice_cooked", grams: 150, state: "as_is", role: "main_carb", adjust: { kind: "grams", min: 100, max: 250, step: 10 } },
  ],
  sides: [
    { key: "rice", label: { ja: "ご飯", en: "Rice", es: "Arroz", fr: "Riz" }, ingredients: ["rice"], solverMayRemove: true },
  ],
  steps: [
    {
      key: "prep",
      text: {
        ja: "木綿豆腐をキッチンペーパーで包んで10分置き、水気を切ってから手で大きくちぎります。",
        en: "Wrap the firm tofu in paper towels for 10 minutes to drain, then tear it into large pieces.",
        es: "Envuelve el tofu firme en papel de cocina 10 minutos para escurrirlo y luego trocéalo con las manos en trozos grandes.",
        fr: "Enveloppez le tofu ferme dans du papier absorbant pendant 10 minutes pour l'égoutter, puis déchirez-le en gros morceaux.",
      },
    },
    {
      key: "tofu",
      text: {
        ja: "豆腐用の油で豆腐を焼き色がつくまで焼いて取り出します。油はフライパンに残します。",
        en: "Brown the tofu in its oil and set it aside, leaving the oil in the pan.",
        es: "Dora el tofu en su aceite y resérvalo, dejando el aceite en la sartén.",
        fr: "Faites dorer le tofu dans son huile et réservez-le, en laissant l'huile dans la poêle.",
      },
    },
    {
      key: "cabbage",
      text: {
        ja: "ざく切りのキャベツを1分ゆでて水気を切り、残った油で1分炒め、豆腐を戻して、しょうゆ、中華だし、こしょうで味を付けます。",
        en: "Blanch the chopped cabbage for 1 minute, drain it, and stir-fry it in the remaining oil for 1 minute; return the tofu, and season with soy sauce, stock granules, and pepper.",
        es: "Escalda el repollo troceado 1 minuto, escúrrelo y saltéalo en el aceite que queda 1 minuto; devuelve el tofu y sazona con salsa de soja, caldo en gránulos y pimienta.",
        fr: "Blanchissez le chou coupé 1 minute, égouttez-le et faites-le sauter 1 minute dans l'huile restante ; remettez le tofu et assaisonnez de sauce soja, de bouillon en granulés et de poivre.",
      },
    },
    {
      key: "egg",
      text: {
        ja: "卵用の油を足し、卵と卵白を一緒に溶いて流し入れ、白身まで固まるまで大きく混ぜます。",
        en: "Add the oil for the egg, pour in the egg and egg whites beaten together, and fold until the whites are set.",
        es: "Añade el aceite del huevo, vierte el huevo y las claras batidos juntos y remueve hasta que cuajen las claras.",
        fr: "Ajoutez l'huile de l'œuf, versez l'œuf et les blancs d'œufs battus ensemble, et remuez jusqu'à ce que les blancs soient pris.",
      },
    },
  ],
  safetyNotes: [
    {
      key: "egg_set",
      text: {
        ja: "卵は固まるまで加熱してください。",
        en: "Cook the eggs until set.",
        es: "Cocina los huevos hasta que cuajen.",
        fr: "Faites cuire les œufs jusqu'à ce qu'ils soient pris.",
      },
    },
  ],
  substitutions: [],
};
