import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "egg_white_spinach_tamagoyaki",
  texts: {
    name: { ja: "卵白とほうれん草の卵焼き 納豆ご飯添え", en: "Egg white and spinach tamagoyaki with natto and rice", es: "Tamagoyaki de claras y espinacas con natto y arroz" },
    summary: {
      ja: "卵白を多めにした卵液にゆでたほうれん草を巻き込んで、甘めの卵焼きにします。納豆とご飯を添えます。",
      en: "A slightly sweet rolled omelette made mostly with egg whites and rolled around boiled spinach, with natto and rice.",
      es: "Un omelet japonés enrollado, ligeramente dulce, hecho sobre todo con claras y enrollado alrededor de espinacas hervidas, con natto y arroz.",
    },
  },
  cuisine: "japanese",
  goals: ["cut"],
  mainProteinGroup: "egg",
  tags: ["breakfast"],
  minutes: 10,
  effort: 2,
  equipment: ["stove", "frying_pan"],
  servings: 1,
  ingredients: [
    {
      key: "egg_white",
      food: "egg_white",
      grams: 200,
      state: "raw",
      cooking: "scramble",
      role: "main_protein",
      adjust: { kind: "grams", min: 150, max: 250, step: 50 },
      note: {
        ja: "成分表に焼いた卵白の値がないため、生の値で計算しています。",
        en: "The tables have no value for cooked egg white, so the raw value is used.",
        es: "Las tablas no tienen un valor para la clara cocinada, así que se usa el valor en crudo.",
      },
    },
    { key: "egg", food: "egg", grams: 50, state: "scramble", measure: { unit: "piece", quantity: 1 }, role: "main_protein" },
    { key: "oil", food: "vegetable_oil", grams: 2, state: "as_is", measure: { unit: "tsp", quantity: 0.5 }, role: "fat", includedIn: "egg" },
    { key: "spinach", food: "spinach", grams: 40, state: "boil", role: "vegetable" },
    { key: "sugar", food: "sugar", grams: 3, state: "as_is", measure: { unit: "tsp", quantity: 1 }, role: "seasoning" },
    { key: "salt", food: "salt", grams: 0.5, state: "as_is", measure: { unit: "pinch", quantity: 1 }, role: "seasoning" },
    { key: "natto", food: "natto", grams: 40, state: "as_is", measure: { unit: "piece", quantity: 1 }, role: "other" },
    { key: "rice", food: "rice_cooked", grams: 180, state: "as_is", role: "main_carb", adjust: { kind: "grams", min: 150, max: 240, step: 30 } },
  ],
  sides: [
    { key: "rice", label: { ja: "ご飯", en: "Rice", es: "Arroz" }, ingredients: ["rice"], solverMayRemove: true },
  ],
  steps: [
    {
      key: "prep",
      text: {
        ja: "ほうれん草を熱湯で1分ほどゆで、水にとって絞ります。卵白、卵、砂糖、塩をよく混ぜます。",
        en: "Boil the spinach for about 1 minute, cool it in water, and squeeze it. Beat the egg whites, egg, sugar, and salt well.",
        es: "Hierve las espinacas aproximadamente 1 minuto, enfríalas en agua y escúrrelas. Bate bien las claras, el huevo, el azúcar y la sal.",
      },
    },
    {
      key: "roll",
      text: {
        ja: "卵焼き器かフライパンに油をなじませて弱めの中火で熱し、卵液の1/3を流し入れます。半熟になったら、手前にほうれん草をのせて奥から手前に巻きます。残りの卵液を2回に分けて流し入れ、同じように巻きながら中まで固まるまで焼きます。",
        en: "Oil a tamagoyaki pan or frying pan, heat it over medium-low heat, and pour in a third of the egg mixture. When it is half set, lay the spinach along the near edge and roll the omelette up from the far side. Add the rest of the mixture in two parts, rolling the same way each time, and cook until set inside.",
        es: "Unta con aceite una sartén para tamagoyaki o una sartén normal, caliéntala a fuego medio-bajo y vierte un tercio del huevo batido. Cuando esté medio cuajado, coloca las espinacas en el borde cercano y enrolla el omelet desde el lado opuesto. Añade el resto del huevo en dos veces, enrollando igual cada vez, y cocina hasta que cuaje por dentro.",
      },
    },
    {
      key: "serve",
      text: {
        ja: "食べやすく切って、納豆と一緒に盛ります。",
        en: "Cut it into slices and serve with the natto.",
        es: "Córtalo en trozos y sírvelo con el natto.",
      },
    },
    {
      key: "rice",
      side: "rice",
      text: { ja: "ご飯を添えます。", en: "Serve with the rice.", es: "Acompáñalo con el arroz." },
    },
  ],
  safetyNotes: [
    {
      key: "egg_set",
      text: {
        ja: "卵は中まで固まるまで加熱してください。",
        en: "Cook the eggs until set inside.",
        es: "Cocina los huevos hasta que cuajen por dentro.",
      },
    },
  ],
  substitutions: [],
};
