import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "somen_champuru_tuna",
  texts: {
    name: { ja: "ツナのソーミンチャンプルー", en: "Somen champuru with tuna", es: "Somen champuru con atún" },
    summary: {
      ja: "沖縄のソーミンチャンプルーを、ツナ缶、キャベツ、にんじん、炒り卵で作ります。ゆでたそうめんを手早く炒め合わせます。",
      en: "Okinawan somen champuru made with canned tuna, cabbage, carrot, and scrambled egg, quickly stir-fried with boiled somen noodles.",
      es: "Somen champuru de Okinawa preparado con atún en lata, col, zanahoria y huevo revuelto, salteado rápidamente con fideos somen cocidos.",
    },
  },
  cuisine: "okinawan",
  goals: ["maintain"],
  mainProteinGroup: "fish",
  tags: [],
  minutes: 10,
  effort: 1,
  equipment: ["stove", "pot", "frying_pan"],
  servings: 1,
  ingredients: [
    { key: "tuna", food: "tuna_canned", grams: 140, state: "as_is", measure: { unit: "can", quantity: 2 }, role: "main_protein", adjust: { kind: "count", unitGrams: 70, min: 1, max: 3 } },
    { key: "somen", food: "somen_boiled", grams: 300, state: "as_is", role: "main_carb", adjust: { kind: "grams", min: 200, max: 350, step: 50 } },
    { key: "cabbage", food: "cabbage", grams: 80, state: "stir_fry", role: "vegetable" },
    { key: "oil_cabbage", food: "vegetable_oil", grams: 4, state: "as_is", measure: { unit: "tsp", quantity: 1 }, role: "fat", includedIn: "cabbage" },
    {
      key: "carrot",
      food: "carrot",
      grams: 20,
      state: "raw",
      cooking: "stir_fry",
      role: "vegetable",
      note: {
        ja: "成分表に炒めたにんじんの値がないため、生の値で計算しています。",
        en: "The tables have no value for stir-fried carrot, so the raw value is used.",
        es: "Las tablas no tienen un valor para la zanahoria salteada, así que se usa el valor en crudo.",
      },
    },
    { key: "oil", food: "vegetable_oil", grams: 4, state: "as_is", measure: { unit: "tsp", quantity: 1 }, role: "fat" },
    { key: "egg", food: "egg", grams: 50, state: "scramble", measure: { unit: "piece", quantity: 1 }, role: "other" },
    { key: "oil_egg", food: "vegetable_oil", grams: 2, state: "as_is", measure: { unit: "tsp", quantity: 0.5 }, role: "fat", includedIn: "egg" },
    { key: "soy_sauce", food: "soy_sauce", grams: 6, state: "as_is", measure: { unit: "tsp", quantity: 1 }, role: "seasoning" },
    { key: "salt", food: "salt", grams: 0.5, state: "as_is", measure: { unit: "pinch", quantity: 1 }, role: "seasoning" },
    { key: "green_onion", food: "green_onion", grams: 10, state: "raw", role: "vegetable" },
  ],
  sides: [],
  steps: [
    {
      key: "somen",
      text: {
        ja: "そうめんを袋の表示どおりにゆでて水で洗い、水気をよく切ります。",
        en: "Boil the somen as directed on the package, rinse in cold water, and drain well.",
        es: "Cuece los somen como indique el paquete, lávalos con agua fría y escúrrelos bien.",
      },
    },
    {
      key: "egg",
      text: {
        ja: "フライパンに卵用の油を中火で熱し、溶いた卵を入れて大きく混ぜ、固まったら取り出します。",
        en: "Heat the oil for the egg in a frying pan over medium heat, add the beaten egg, stir in large strokes, and take it out once set.",
        es: "Calienta en una sartén a fuego medio el aceite del huevo, añade el huevo batido, remueve con movimientos amplios y sácalo cuando cuaje.",
      },
    },
    {
      key: "stir_fry",
      text: {
        ja: "同じフライパンにキャベツ用の油を熱し、ざく切りのキャベツと細切りのにんじんを2分炒めます。残りの油、そうめん、汁を切ったツナを加えて手早く炒め、しょうゆと塩で調味します。卵を戻し、小口切りの青ねぎを散らします。",
        en: "Heat the oil for the cabbage in the same pan and stir-fry the roughly chopped cabbage and carrot strips for 2 minutes. Add the rest of the oil, the somen, and the drained tuna, stir-fry quickly, and season with the soy sauce and salt. Return the egg and scatter the sliced green onion over.",
        es: "Calienta en la misma sartén el aceite de la col y saltea la col troceada y la zanahoria en tiras 2 minutos. Añade el resto del aceite, los somen y el atún escurrido, saltea rápidamente y sazona con la salsa de soja y la sal. Devuelve el huevo y esparce la cebolleta en rodajas.",
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
      },
    },
    {
      key: "hot_water",
      text: {
        ja: "熱湯を扱うときは、やけどに注意してください。",
        en: "Take care not to scald yourself with the boiling water.",
        es: "Ten cuidado de no quemarte con el agua hirviendo.",
      },
    },
    {
      key: "opened_can",
      text: {
        ja: "開けた缶詰の残りは缶から別の容器に移して冷蔵し、早めに食べてください。",
        en: "Move any leftover canned fish to another container, refrigerate it, and eat it soon.",
        es: "Pasa el pescado en lata que sobre a otro recipiente, guárdalo en el refrigerador y consúmelo pronto.",
      },
    },
  ],
  substitutions: [],
};
