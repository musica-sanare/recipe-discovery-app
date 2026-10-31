import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "horse_mackerel_salt_grill",
  texts: {
    name: { ja: "まあじの塩焼き", en: "Salt-grilled horse mackerel", es: "Jurel a la sal", fr: "Chinchard grillé au sel" },
    summary: {
      ja: "塩をふったまあじをフライパンで焼き、小松菜のおひたしとご飯を添えた和定食です。",
      en: "A Japanese set meal of salted horse mackerel pan-grilled, with blanched komatsuna and rice.",
      es: "Un menú japonés de jurel con sal a la sartén, con komatsuna escaldada y arroz.",
      fr: "Un repas japonais de chinchard salé grillé à la poêle, avec du komatsuna blanchi et du riz.",
    },
  },
  cuisine: "japanese",
  goals: ["cut"],
  mainProteinGroup: "fish",
  tags: [],
  minutes: 20,
  effort: 2,
  equipment: ["stove", "frying_pan", "pot"],
  servings: 1,
  ingredients: [
    {
      key: "fish",
      food: "horse_mackerel",
      grams: 180,
      state: "grill",
      measure: { unit: "piece", quantity: 2 },
      role: "main_protein",
      adjust: { kind: "count", unitGrams: 90, min: 1, max: 3 },
      note: {
        ja: "頭と内臓を除いた1尾の可食部を約90gとしています。焼いてから骨を外して食べる前提です。",
        en: "Assumes about 90 g of edible flesh per fish after removing the head and innards; the bones are removed after cooking.",
        es: "Se consideran unos 90 g de carne comestible por pescado sin cabeza ni vísceras; las espinas se retiran después de cocinar.",
        fr: "On compte environ 90 g de chair comestible par poisson, tête et viscères retirés ; les arêtes sont retirées après la cuisson.",
      },
    },
    { key: "salt", food: "salt", grams: 1, state: "as_is", measure: { unit: "pinch", quantity: 2 }, role: "seasoning", linkedTo: "fish" },
    { key: "komatsuna", food: "komatsuna", grams: 80, state: "boil", role: "vegetable" },
    { key: "soy_sauce", food: "soy_sauce", grams: 4, state: "as_is", measure: { unit: "tsp", quantity: 2 / 3 }, role: "seasoning" },
    { key: "rice", food: "rice_cooked", grams: 180, state: "as_is", role: "main_carb", adjust: { kind: "grams", min: 100, max: 300, step: 10 } },
  ],
  sides: [
    { key: "komatsuna", label: { ja: "小松菜のおひたし", en: "Blanched komatsuna", es: "Komatsuna escaldada", fr: "Komatsuna blanchi" }, ingredients: ["komatsuna", "soy_sauce"], solverMayRemove: false },
    { key: "rice", label: { ja: "ご飯", en: "Rice", es: "Arroz", fr: "Riz" }, ingredients: ["rice"], solverMayRemove: true },
  ],
  steps: [
    {
      key: "prep",
      text: {
        ja: "まあじのぜいごと内臓を取り、水で洗って水気をふきます。両面に塩をふって10分置き、出てきた水分をふき取ります。",
        en: "Remove the scutes and innards of the horse mackerel, rinse, and pat dry. Salt both sides, leave for 10 minutes, and wipe off the moisture that comes out.",
        es: "Quita las escamas duras de la línea lateral y las vísceras del jurel, lávalo y sécalo. Sala ambos lados, déjalo 10 minutos y seca la humedad que suelte.",
        fr: "Retirez les scutelles et les viscères du chinchard, rincez-le et séchez-le en tapotant. Salez les deux faces, laissez reposer 10 minutes et essuyez l'eau qui en sort.",
      },
    },
    {
      key: "grill",
      text: {
        ja: "フライパンにクッキングシートを敷いて中火にかけ、まあじを片面5分ずつ、身が白く不透明になるまで焼きます。",
        en: "Line a frying pan with baking paper, set it over medium heat, and cook the fish for 5 minutes on each side until the flesh is white and opaque.",
        es: "Cubre una sartén con papel de horno, ponla a fuego medio y cocina el pescado 5 minutos por cada lado hasta que la carne esté blanca y opaca.",
        fr: "Garnissez une poêle de papier cuisson, posez-la sur feu moyen et faites cuire le poisson 5 minutes de chaque côté, jusqu'à ce que la chair soit blanche et opaque.",
      },
    },
    {
      key: "serve",
      text: {
        ja: "器に盛ります。",
        en: "Transfer to a plate.",
        es: "Sírvelo en un plato.",
        fr: "Dressez sur une assiette.",
      },
    },
    {
      key: "komatsuna",
      side: "komatsuna",
      text: {
        ja: "小松菜を1分ゆでて水にとり、水気を絞って4cm長さに切り、しょうゆをかけて添えます。",
        en: "Boil the komatsuna for 1 minute, cool it in water, squeeze it dry, cut it into 4 cm lengths, and serve with the soy sauce poured over.",
        es: "Hierve la komatsuna 1 minuto, enfríala en agua, escúrrela bien, córtala en trozos de 4 cm y sírvela con la salsa de soja por encima.",
        fr: "Faites bouillir le komatsuna 1 minute, refroidissez-le dans l'eau, pressez-le, coupez-le en tronçons de 4 cm et servez-le arrosé de sauce soja.",
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
        fr: "Faites cuire le poisson jusqu'à ce qu'il soit blanc et opaque au centre.",
      },
    },
    {
      key: "fish_bones",
      text: {
        ja: "骨が多い魚です。食べるときは骨に注意してください。",
        en: "This fish has many bones; take care when eating.",
        es: "Este pescado tiene muchas espinas; ten cuidado al comerlo.",
        fr: "Ce poisson a beaucoup d'arêtes ; faites attention en mangeant.",
      },
    },
  ],
  substitutions: [],
};
