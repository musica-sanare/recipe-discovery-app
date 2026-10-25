import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "mackerel_salt_grill_daikon",
  texts: {
    name: { ja: "さばの塩焼き 大根おろし添え", en: "Salt-grilled mackerel with grated daikon", es: "Caballa asada con sal y daikon rallado" },
    summary: {
      ja: "和食の定番の焼き魚です。塩をふったさばをトースターで焼き、大根おろしとほうれん草のおひたしを添えます。ご飯を添えます。",
      en: "A classic Japanese grilled fish: salted mackerel cooked in a toaster oven, with grated daikon and dressed spinach, and rice.",
      es: "Un pescado asado clásico de la cocina japonesa: caballa con sal al horno tostador, con daikon rallado y espinacas aliñadas, y arroz.",
    },
  },
  cuisine: "japanese",
  goals: ["maintain"],
  mainProteinGroup: "fish",
  tags: [],
  minutes: 20,
  effort: 1,
  equipment: ["stove", "pot", "oven_toaster"],
  servings: 1,
  ingredients: [
    {
      key: "mackerel",
      food: "mackerel",
      grams: 100,
      state: "grill",
      measure: { unit: "piece", quantity: 1 },
      role: "main_protein",
      adjust: { kind: "grams", min: 80, max: 140, step: 20 },
      note: {
        ja: "切り身1切れ約100gです。さばは脂の多い魚なので、脂質が多めになります。",
        en: "One fillet is about 100 g. Mackerel is an oily fish, so the fat is relatively high.",
        es: "Un filete pesa unos 100 g. La caballa es un pescado azul, así que la grasa es relativamente alta.",
      },
    },
    { key: "salt", food: "salt", grams: 1, state: "as_is", measure: { unit: "pinch", quantity: 2 }, role: "seasoning", linkedTo: "mackerel" },
    { key: "daikon", food: "daikon", grams: 80, state: "raw", role: "vegetable" },
    { key: "soy_sauce", food: "soy_sauce", grams: 3, state: "as_is", measure: { unit: "tsp", quantity: 0.5 }, role: "seasoning" },
    { key: "spinach", food: "spinach", grams: 80, state: "boil", role: "vegetable" },
    { key: "soy_spinach", food: "soy_sauce", grams: 3, state: "as_is", measure: { unit: "tsp", quantity: 0.5 }, role: "seasoning" },
    { key: "rice", food: "rice_cooked", grams: 150, state: "as_is", role: "main_carb", adjust: { kind: "grams", min: 100, max: 250, step: 25 } },
  ],
  sides: [
    { key: "rice", label: { ja: "ご飯", en: "Rice", es: "Arroz" }, ingredients: ["rice"], solverMayRemove: true },
  ],
  steps: [
    {
      key: "salt",
      text: {
        ja: "さばの両面に塩をふって10分置き、出てきた水気をキッチンペーパーで拭きます。",
        en: "Salt the mackerel on both sides, leave for 10 minutes, and pat off the liquid with paper towels.",
        es: "Sala la caballa por ambos lados, déjala 10 minutos y seca el líquido con papel de cocina.",
      },
    },
    {
      key: "spinach",
      text: {
        ja: "その間に、ほうれん草を沸騰した湯で1分ゆでて水にとり、水気を絞って4cm長さに切り、しょうゆ小さじ半分をかけます。",
        en: "Meanwhile, boil the spinach for 1 minute, cool it in water, squeeze it dry, cut it into 4 cm lengths, and dress with half a teaspoon of soy sauce.",
        es: "Mientras tanto, hierve las espinacas 1 minuto, enfríalas en agua, escúrrelas bien, córtalas en trozos de 4 cm y alíñalas con media cucharadita de salsa de soja.",
      },
    },
    {
      key: "grill",
      text: {
        ja: "アルミホイルを敷いたトースターの天板にさばを皮を上にしてのせ、12〜15分焼きます。",
        en: "Put the mackerel skin side up on the foil-lined tray of a toaster oven and cook for 12–15 minutes.",
        es: "Pon la caballa con la piel hacia arriba en la bandeja del horno tostador cubierta con papel de aluminio y ásala 12-15 minutos.",
      },
    },
    {
      key: "serve",
      text: {
        ja: "だいこんをすりおろして軽く水気を切り、さばに添えてしょうゆをかけます。おひたしも添えます。",
        en: "Grate the daikon, drain it lightly, and serve it with the mackerel, topped with the soy sauce. Add the spinach on the side.",
        es: "Ralla el daikon, escúrrelo un poco y sírvelo con la caballa con la salsa de soja por encima. Añade las espinacas al lado.",
      },
    },
    {
      key: "rice",
      side: "rice",
      text: {
        ja: "ご飯を添えます。",
        en: "Serve with the rice.",
        es: "Acompáñalo con el arroz.",
      },
    },
  ],
  safetyNotes: [
    {
      key: "fish_doneness",
      text: {
        ja: "魚は中心まで白く不透明になるまで焼いてください。",
        en: "Cook the fish until it is white and opaque in the center.",
        es: "Cocina el pescado hasta que esté blanco y opaco en el centro.",
      },
    },
    {
      key: "fish_bones",
      text: {
        ja: "切り身にも小骨が残っていることがあります。食べるときは骨に注意してください。",
        en: "Fillets may still have small bones; take care when eating.",
        es: "Los filetes pueden tener alguna espina pequeña; ten cuidado al comerlos.",
      },
    },
    {
      key: "wash_raw",
      text: {
        ja: "生で食べる野菜とハーブは、流水でよく洗ってください。",
        en: "Wash raw vegetables and herbs well under running water.",
        es: "Lava bien con agua corriente las verduras y hierbas que se comen crudas.",
      },
    },
  ],
  substitutions: [],
};
