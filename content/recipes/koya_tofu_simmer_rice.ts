import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "koya_tofu_simmer_rice",
  texts: {
    name: { ja: "高野豆腐と野菜の煮物", en: "Simmered koya-dofu and vegetables", es: "Koya-dofu guisado con verduras", fr: "Koya-dofu et légumes mijotés" },
    summary: {
      ja: "もどした高野豆腐としいたけ、にんじんを甘辛く煮含め、小松菜を添えます。ご飯を添えます。",
      en: "Rehydrated freeze-dried tofu, shiitake, and carrot simmered in a sweet soy broth, with komatsuna and rice.",
      es: "Tofu deshidratado rehidratado, shiitake y zanahoria guisados en un caldo dulce de soja, con komatsuna y arroz.",
      fr: "Tofu lyophilisé réhydraté, shiitake et carotte mijotés dans un bouillon sucré à la sauce soja, avec du komatsuna et du riz.",
    },
  },
  cuisine: "japanese",
  goals: ["maintain"],
  mainProteinGroup: "soy",
  tags: ["batch"],
  minutes: 25,
  effort: 2,
  equipment: ["stove", "pot"],
  servings: 1,
  ingredients: [
    {
      key: "koya_tofu",
      food: "koya_tofu",
      grams: 49.5,
      state: "simmer",
      measure: { unit: "piece", quantity: 3 },
      role: "main_protein",
      adjust: { kind: "count", unitGrams: 16.5, min: 2, max: 5 },
      note: {
        ja: "乾物の重さです（1枚約16.5g）。",
        en: "Dry weight (about 16.5 g per piece).",
        es: "Peso en seco (unos 16,5 g por pieza).",
        fr: "Poids sec (environ 16,5 g par morceau).",
      },
    },
    { key: "shiitake", food: "shiitake", grams: 30, state: "boil", measure: { unit: "piece", quantity: 2 }, role: "vegetable" },
    { key: "carrot", food: "carrot", grams: 40, state: "boil", role: "vegetable" },
    { key: "komatsuna", food: "komatsuna", grams: 50, state: "boil", role: "vegetable" },
    { key: "soy_sauce", food: "soy_sauce", grams: 12, state: "as_is", measure: { unit: "tsp", quantity: 2 }, role: "seasoning", linkedTo: "koya_tofu" },
    { key: "mirin", food: "mirin", grams: 12, state: "as_is", measure: { unit: "tsp", quantity: 2 }, role: "seasoning", linkedTo: "koya_tofu" },
    { key: "sugar", food: "sugar", grams: 3, state: "as_is", measure: { unit: "tsp", quantity: 1 }, role: "seasoning", linkedTo: "koya_tofu" },
    { key: "rice", food: "rice_cooked", grams: 200, state: "as_is", role: "main_carb", adjust: { kind: "grams", min: 100, max: 300, step: 10 } },
  ],
  sides: [
    { key: "rice", label: { ja: "ご飯", en: "Rice", es: "Arroz", fr: "Riz" }, ingredients: ["rice"], solverMayRemove: true },
  ],
  steps: [
    {
      key: "soak",
      text: {
        ja: "高野豆腐を40〜50℃のぬるま湯に5分浸してもどし、両手ではさんで水気を絞り、4等分に切ります。",
        en: "Soak the koya-dofu in lukewarm water (40–50 °C) for 5 minutes, press it between your palms to squeeze out the water, and cut each piece into four.",
        es: "Remoja el koya-dofu en agua tibia (40-50 °C) 5 minutos, apriétalo entre las manos para escurrirlo y corta cada pieza en cuatro.",
        fr: "Faites tremper le koya-dofu 5 minutes dans de l'eau tiède (40 à 50 °C), pressez-le entre vos paumes pour en extraire l'eau et coupez chaque morceau en quatre.",
      },
    },
    {
      key: "prep",
      text: {
        ja: "にんじんは乱切りにし、しいたけは軸を取って半分に切ります。",
        en: "Cut the carrot into chunks, and remove the shiitake stems and halve the caps.",
        es: "Corta la zanahoria en trozos, quita los pies de los shiitake y corta los sombreros por la mitad.",
        fr: "Coupez la carotte en morceaux, retirez le pied des shiitake et coupez les chapeaux en deux.",
      },
    },
    {
      key: "simmer",
      text: {
        ja: "鍋に水250mL、しょうゆ、みりん、砂糖を入れて煮立て、高野豆腐、にんじん、しいたけを入れて落としぶたをし、弱火で12分煮ます。最後の2分で4cm長さに切った小松菜を加えます。",
        en: "Bring 250 mL of water, the soy sauce, mirin, and sugar to a boil in a pot, add the koya-dofu, carrot, and shiitake, cover with a drop lid, and simmer over low heat for 12 minutes. Add the komatsuna, cut into 4 cm lengths, for the last 2 minutes.",
        es: "Lleva a ebullición 250 mL de agua, la salsa de soja, el mirin y el azúcar en una olla, añade el koya-dofu, la zanahoria y los shiitake, cubre con una tapa interior y cuece a fuego bajo 12 minutos. Añade la komatsuna, cortada en trozos de 4 cm, en los últimos 2 minutos.",
        fr: "Portez à ébullition 250 mL d'eau, la sauce soja, le mirin et le sucre dans une casserole, ajoutez le koya-dofu, la carotte et les shiitake, couvrez d'un couvercle posé directement sur les aliments et laissez mijoter 12 minutes à feu doux. Ajoutez le komatsuna, coupé en tronçons de 4 cm, pendant les 2 dernières minutes.",
      },
    },
    {
      key: "serve",
      text: {
        ja: "煮汁ごと器に盛ります。",
        en: "Serve in a bowl with the broth.",
        es: "Sírvelo en un cuenco con el caldo.",
        fr: "Servez dans un bol avec le bouillon.",
      },
    },
  ],
  safetyNotes: [
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
