import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "beef_kabocha_simmer",
  texts: {
    name: { ja: "牛もも肉とかぼちゃの煮物", en: "Simmered lean beef and kabocha", es: "Guiso japonés de ternera magra y calabaza kabocha" },
    summary: {
      ja: "和食の煮物です。牛もも肉、かぼちゃ、玉ねぎを、しょうゆ、みりん、砂糖の甘辛い煮汁で煮ます。まとめて作っておけます。ご飯を添えます。",
      en: "A Japanese simmered dish: lean beef, kabocha, and onion cooked in a sweet soy, mirin, and sugar broth. Make a larger batch to keep. With rice.",
      es: "Un guiso japonés: ternera magra, calabaza kabocha y cebolla cocidas en un caldo dulce de salsa de soja, mirin y azúcar. Puedes preparar más cantidad para guardar. Con arroz.",
    },
  },
  cuisine: "japanese",
  goals: ["bulk"],
  mainProteinGroup: "beef",
  tags: ["batch"],
  minutes: 30,
  effort: 2,
  equipment: ["stove", "pot"],
  servings: 1,
  ingredients: [
    {
      key: "beef",
      food: "beef_round",
      grams: 180,
      state: "raw",
      cooking: "simmer",
      role: "main_protein",
      adjust: { kind: "grams", min: 140, max: 240, step: 20 },
      note: {
        ja: "成分表に煮込んだ牛もも肉の値がないため、生の値で計算しています。",
        en: "The tables have no value for stewed beef round, so the raw value is used.",
        es: "Las tablas no tienen un valor para la ternera guisada, así que se usa el valor en crudo.",
      },
    },
    {
      key: "kabocha",
      food: "kabocha",
      grams: 150,
      state: "boil",
      role: "vegetable",
      note: {
        ja: "わたと種を除いた重さです。煮汁で煮るため、成分表のゆでた値で計算しています。",
        en: "Weight without the seeds and pulp. It is simmered in the broth, so the boiled value is used.",
        es: "Peso sin las semillas ni la pulpa fibrosa. Se cuece en el caldo, así que se usa el valor hervido.",
      },
    },
    { key: "onion", food: "onion", grams: 60, state: "raw", cooking: "simmer", measure: { unit: "piece", quantity: 0.25 }, role: "vegetable" },
    { key: "soy_sauce", food: "soy_sauce", grams: 15, state: "as_is", measure: { unit: "tsp", quantity: 2.5 }, role: "seasoning" },
    { key: "mirin", food: "mirin", grams: 15, state: "as_is", measure: { unit: "tsp", quantity: 2.5 }, role: "seasoning" },
    { key: "sugar", food: "sugar", grams: 3, state: "as_is", measure: { unit: "tsp", quantity: 1 }, role: "seasoning" },
    { key: "rice", food: "rice_cooked", grams: 250, state: "as_is", role: "main_carb", adjust: { kind: "grams", min: 150, max: 350, step: 25 } },
  ],
  sides: [
    { key: "rice", label: { ja: "ご飯", en: "Rice", es: "Arroz" }, ingredients: ["rice"], solverMayRemove: true },
  ],
  steps: [
    {
      key: "prep",
      text: {
        ja: "かぼちゃのわたと種を除いて3cm角に切ります。牛もも肉はひと口大、玉ねぎはくし形に切ります。",
        en: "Remove the seeds and pulp from the kabocha and cut it into 3 cm chunks. Cut the beef into bite-size pieces and the onion into wedges.",
        es: "Quita las semillas y la pulpa fibrosa de la calabaza y córtala en trozos de 3 cm. Corta la ternera en trozos pequeños y la cebolla en gajos.",
      },
    },
    {
      key: "simmer",
      text: {
        ja: "鍋に水200ml、しょうゆ、みりん、砂糖を入れて煮立て、牛肉を加えてアクを取ります。かぼちゃと玉ねぎを加え、ふたをして弱めの中火で12〜15分、かぼちゃがやわらかくなるまで煮ます。",
        en: "Bring 200 ml of water, the soy sauce, mirin, and sugar to a boil in a pot, add the beef, and skim off the foam. Add the kabocha and onion, cover, and simmer over medium-low heat for 12–15 minutes until the kabocha is tender.",
        es: "Lleva a ebullición 200 ml de agua, la salsa de soja, el mirin y el azúcar en una olla, añade la ternera y retira la espuma. Añade la calabaza y la cebolla, tapa y cuece a fuego medio-bajo 12-15 minutos hasta que la calabaza esté tierna.",
      },
    },
    {
      key: "serve",
      text: {
        ja: "器に盛り、煮汁を少しかけます。",
        en: "Serve with a little of the broth.",
        es: "Sírvelo con un poco del caldo.",
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
      key: "beef_doneness",
      text: {
        ja: "牛肉は色が完全に変わるまで煮てください。",
        en: "Simmer the beef until it has completely changed color.",
        es: "Cuece la ternera hasta que cambie de color por completo.",
      },
    },
    {
      key: "cooling",
      text: {
        ja: "作り置きする場合は、浅い容器に移して早めに冷まし、冷蔵庫で保存してください。食べるときは中心まで十分に温め直します。",
        en: "To keep leftovers, transfer them to a shallow container, cool them quickly, and refrigerate. Reheat until piping hot throughout before eating.",
        es: "Si guardas sobras, pásalas a un recipiente poco hondo, enfríalas rápido y guárdalas en el refrigerador. Antes de comer, recaliéntalas hasta que estén bien calientes por dentro.",
      },
    },
  ],
  substitutions: [],
};
