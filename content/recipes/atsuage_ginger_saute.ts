import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "atsuage_ginger_saute",
  texts: {
    name: { ja: "厚揚げのしょうが焼き", en: "Ginger-glazed atsuage", es: "Atsuage glaseado con jengibre" },
    summary: {
      ja: "厚揚げと玉ねぎを焼き、しょうがの効いた甘辛だれをからめます。キャベツとご飯を添えます。",
      en: "Atsuage and onion pan-fried and glazed in a sweet soy and ginger sauce, with cabbage and rice.",
      es: "Atsuage y cebolla a la sartén, glaseados con una salsa dulce de soja y jengibre, con repollo y arroz.",
    },
  },
  cuisine: "japanese",
  goals: ["bulk"],
  mainProteinGroup: "soy",
  tags: [],
  minutes: 15,
  effort: 2,
  equipment: ["stove", "frying_pan"],
  servings: 1,
  ingredients: [
    {
      key: "atsuage",
      food: "atsuage",
      grams: 200,
      state: "raw",
      cooking: "saute",
      measure: { unit: "block", quantity: 1 },
      role: "main_protein",
      adjust: { kind: "grams", min: 150, max: 300, step: 50 },
      note: {
        ja: "成分表に焼いた厚揚げの値がないため、加熱前の値で計算しています。",
        en: "The tables have no value for pan-fried atsuage, so the uncooked value is used.",
        es: "Las tablas no tienen un valor para el atsuage a la sartén, así que se usa el valor sin cocinar.",
      },
    },
    { key: "onion", food: "onion", grams: 60, state: "stir_fry", measure: { unit: "piece", quantity: 0.25 }, role: "vegetable" },
    { key: "oil_onion", food: "vegetable_oil", grams: 3, state: "as_is", role: "fat", includedIn: "onion" },
    { key: "ginger", food: "ginger", grams: 5, state: "raw", measure: { unit: "knob", quantity: 0.5 }, role: "seasoning", linkedTo: "atsuage" },
    { key: "soy_sauce", food: "soy_sauce", grams: 12, state: "as_is", measure: { unit: "tsp", quantity: 2 }, role: "seasoning", linkedTo: "atsuage" },
    { key: "mirin", food: "mirin", grams: 12, state: "as_is", measure: { unit: "tsp", quantity: 2 }, role: "seasoning", linkedTo: "atsuage" },
    { key: "sake", food: "cooking_sake", grams: 10, state: "as_is", measure: { unit: "tsp", quantity: 2 }, role: "seasoning", linkedTo: "atsuage" },
    { key: "cabbage", food: "cabbage", grams: 50, state: "raw", role: "vegetable" },
    { key: "rice", food: "rice_cooked", grams: 180, state: "as_is", role: "main_carb", adjust: { kind: "grams", min: 100, max: 300, step: 10 } },
  ],
  sides: [
    { key: "cabbage", label: { ja: "せん切りキャベツ", en: "Shredded cabbage", es: "Repollo en tiras" }, ingredients: ["cabbage"], solverMayRemove: false },
    { key: "rice", label: { ja: "ご飯", en: "Rice", es: "Arroz" }, ingredients: ["rice"], solverMayRemove: true },
  ],
  steps: [
    {
      key: "prep",
      text: {
        ja: "厚揚げを熱湯にさっとくぐらせて油を抜き、1cm幅に切ります。玉ねぎは薄切りにし、しょうがはすりおろして、しょうゆ、みりん、料理酒と混ぜます。",
        en: "Dip the atsuage briefly in boiling water to remove excess oil, then cut it into 1 cm slices. Thinly slice the onion. Grate the ginger and mix it with the soy sauce, mirin, and cooking sake.",
        es: "Pasa el atsuage un momento por agua hirviendo para quitar el exceso de aceite y córtalo en lonchas de 1 cm. Corta la cebolla en láminas finas. Ralla el jengibre y mézclalo con la salsa de soja, el mirin y el sake de cocina.",
      },
    },
    {
      key: "cook",
      text: {
        ja: "フライパンに油を中火で熱し、玉ねぎを2分炒めます。厚揚げを加えて両面に焼き色をつけます。",
        en: "Heat the oil in a frying pan over medium heat and stir-fry the onion for 2 minutes. Add the atsuage and brown it on both sides.",
        es: "Calienta el aceite en una sartén a fuego medio y saltea la cebolla 2 minutos. Añade el atsuage y dóralo por ambos lados.",
      },
    },
    {
      key: "glaze",
      text: {
        ja: "たれを加え、とろみがつくまで煮からめます。",
        en: "Add the sauce and cook, turning, until it thickens and coats everything.",
        es: "Añade la salsa y cocina, dando la vuelta, hasta que espese y lo cubra todo.",
      },
    },
    {
      key: "serve",
      text: {
        ja: "器に盛ります。",
        en: "Transfer to a plate.",
        es: "Sírvelo en un plato.",
      },
    },
    {
      key: "cabbage",
      side: "cabbage",
      text: {
        ja: "キャベツはせん切りにして添えます。",
        en: "Shred the cabbage and serve it alongside.",
        es: "Corta el repollo en tiras finas y sírvelo al lado.",
      },
    },
  ],
  safetyNotes: [
    {
      key: "hot_water",
      text: {
        ja: "熱湯を扱うときは、やけどに注意してください。",
        en: "Take care not to scald yourself with the boiling water.",
        es: "Ten cuidado de no quemarte con el agua hirviendo.",
      },
    },
  ],
  substitutions: [
    {
      key: "firm_tofu",
      ingredient: "atsuage",
      food: "tofu_firm",
      state: "raw",
      cooking: "saute",
      ratio: 1,
      stepTexts: [
        {
          step: "prep",
          text: {
            ja: "木綿豆腐をキッチンペーパーで包んで10分置き、水気を切って1cm幅に切ります。玉ねぎは薄切りにし、しょうがはすりおろして、しょうゆ、みりん、料理酒と混ぜます。",
            en: "Wrap the firm tofu in paper towels for 10 minutes to drain, then cut it into 1 cm slices. Thinly slice the onion. Grate the ginger and mix it with the soy sauce, mirin, and cooking sake.",
            es: "Envuelve el tofu firme en papel de cocina 10 minutos para escurrirlo y córtalo en lonchas de 1 cm. Corta la cebolla en láminas finas. Ralla el jengibre y mézclalo con la salsa de soja, el mirin y el sake de cocina.",
          },
        },
      ],
      safetyNotes: { replace: [] },
      note: {
        ja: "厚揚げが手に入らない場合は木綿豆腐で作れます。",
        en: "Firm tofu works if atsuage is hard to find.",
        es: "Si no encuentras atsuage, puedes usar tofu firme.",
      },
    },
  ],
};
