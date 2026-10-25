import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "salmon_miso_grill",
  texts: {
    name: { ja: "鮭の味噌漬け焼き", en: "Miso-marinated grilled salmon", es: "Salmón asado marinado en miso" },
    summary: {
      ja: "サーモンをみそとみりんに漬けておき、トースターで焼きます。まとめて漬けておけば、食べる日に焼くだけです。ほうれん草のおひたしとご飯を添えます。",
      en: "Salmon marinated in miso and mirin, then cooked in a toaster oven. Marinate several pieces at once and just cook them on the day. With dressed spinach and rice.",
      es: "Salmón marinado en miso y mirin y hecho en el horno tostador. Marina varias piezas a la vez y solo tendrás que asarlas el día que las comas. Con espinacas aliñadas y arroz.",
    },
  },
  cuisine: "japanese",
  goals: ["maintain"],
  mainProteinGroup: "fish",
  tags: ["batch"],
  minutes: 15,
  effort: 1,
  equipment: ["stove", "pot", "oven_toaster"],
  servings: 1,
  ingredients: [
    {
      key: "salmon",
      food: "salmon",
      grams: 120,
      state: "grill",
      role: "main_protein",
      adjust: { kind: "grams", min: 80, max: 160, step: 20 },
      note: {
        ja: "漬けた時間は含みません。前日から漬けておきます。",
        en: "The marinating time is not included; marinate from the day before.",
        es: "No incluye el tiempo de marinado; marínalo desde el día anterior.",
      },
    },
    { key: "miso", food: "miso", grams: 12, state: "as_is", measure: { unit: "tsp", quantity: 2 }, role: "seasoning", linkedTo: "salmon" },
    { key: "mirin", food: "mirin", grams: 6, state: "as_is", measure: { unit: "tsp", quantity: 1 }, role: "seasoning", linkedTo: "salmon" },
    { key: "spinach", food: "spinach", grams: 80, state: "boil", role: "vegetable" },
    { key: "soy_spinach", food: "soy_sauce", grams: 3, state: "as_is", measure: { unit: "tsp", quantity: 0.5 }, role: "seasoning" },
    { key: "rice", food: "rice_cooked", grams: 150, state: "as_is", role: "main_carb", adjust: { kind: "grams", min: 100, max: 250, step: 25 } },
  ],
  sides: [
    { key: "rice", label: { ja: "ご飯", en: "Rice", es: "Arroz" }, ingredients: ["rice"], solverMayRemove: true },
  ],
  steps: [
    {
      key: "marinate",
      text: {
        ja: "前日に、みそとみりんを混ぜてサーモンの両面に塗り、ラップで包んで冷蔵庫に入れます。",
        en: "The day before, mix the miso and mirin, spread it on both sides of the salmon, wrap it in plastic wrap, and refrigerate.",
        es: "El día anterior, mezcla el miso y el mirin, úntalo por ambos lados del salmón, envuélvelo en film y guárdalo en el refrigerador.",
      },
    },
    {
      key: "grill",
      text: {
        ja: "みそを軽くぬぐい、アルミホイルを敷いたトースターの天板にのせて10〜12分焼きます。焦げそうならアルミホイルをかぶせます。",
        en: "Wipe off most of the miso, put the salmon on the foil-lined tray of a toaster oven, and cook for 10–12 minutes. Cover it with foil if it starts to burn.",
        es: "Retira casi todo el miso, pon el salmón en la bandeja del horno tostador cubierta con papel de aluminio y ásalo 10-12 minutos. Cúbrelo con papel de aluminio si empieza a quemarse.",
      },
    },
    {
      key: "spinach",
      text: {
        ja: "その間に、ほうれん草を沸騰した湯で1分ゆでて水にとり、水気を絞って4cm長さに切り、しょうゆをかけます。",
        en: "Meanwhile, boil the spinach for 1 minute, cool it in water, squeeze it dry, cut it into 4 cm lengths, and dress with the soy sauce.",
        es: "Mientras tanto, hierve las espinacas 1 minuto, enfríalas en agua, escúrrelas bien, córtalas en trozos de 4 cm y alíñalas con la salsa de soja.",
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
      key: "salmon_doneness",
      text: {
        ja: "サーモンは中心まで火を通してください。身がほぐれやすく、不透明になっていれば焼き上がりです。",
        en: "Cook the salmon through; it is done when it is opaque and flakes easily.",
        es: "Cocina el salmón por completo: está hecho cuando es opaco y se desmenuza con facilidad.",
      },
    },
    {
      key: "storage",
      text: {
        ja: "みそに漬けた生の魚は冷蔵庫で保存し、早めに焼いてください。",
        en: "Keep the miso-marinated raw fish in the refrigerator and cook it soon.",
        es: "Guarda el pescado crudo marinado en miso en el refrigerador y ásalo pronto.",
      },
    },
  ],
  substitutions: [],
};
