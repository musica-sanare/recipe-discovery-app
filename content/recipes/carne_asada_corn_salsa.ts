import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "carne_asada_corn_salsa",
  texts: {
    name: { ja: "牛もも肉のカルネ・アサーダ風 コーンと豆のサルサ", en: "Carne asada-style beef with corn and bean salsa", es: "Carne asada con salsa de maíz y alubias" },
    summary: {
      ja: "メキシコのカルネ・アサーダをヒントに、ライムとチリパウダーで下味をつけた牛もも肉をフライパンで焼き、コーン、赤いんげん豆、トマトのサルサを添えます。ご飯を添えます。",
      en: "Inspired by Mexican carne asada: lean beef marinated with lime and chili powder, seared in a frying pan, with a salsa of corn, red kidney beans, and tomato, and rice.",
      es: "Inspirado en la carne asada mexicana: ternera magra adobada con lima y chile en polvo, hecha a la plancha en la sartén, con una salsa de maíz, alubias rojas y tomate, y arroz.",
    },
  },
  cuisine: "latin_american",
  goals: ["cut"],
  mainProteinGroup: "beef",
  tags: [],
  minutes: 20,
  effort: 1,
  equipment: ["stove", "frying_pan", "microwave"],
  servings: 1,
  ingredients: [
    {
      key: "beef",
      food: "beef_round",
      grams: 160,
      state: "raw",
      cooking: "saute",
      role: "main_protein",
      adjust: { kind: "grams", min: 120, max: 200, step: 20 },
      note: {
        ja: "成分表にフライパンで焼いた牛もも肉の値がないため、生の値で計算しています。",
        en: "The tables have no value for pan-seared beef round, so the raw value is used.",
        es: "Las tablas no tienen un valor para la ternera de pierna a la plancha, así que se usa el valor en crudo.",
      },
    },
    { key: "oil", food: "vegetable_oil", grams: 1, state: "as_is", role: "fat", linkedTo: "beef" },
    { key: "lime", food: "lime_juice", grams: 10, state: "as_is", measure: { unit: "tsp", quantity: 2 }, role: "seasoning", linkedTo: "beef" },
    { key: "garlic", food: "garlic", grams: 3, state: "raw", measure: { unit: "clove", quantity: 0.5 }, role: "seasoning" },
    { key: "chili", food: "chili_powder", grams: 2, state: "as_is", role: "seasoning", linkedTo: "beef" },
    { key: "salt", food: "salt", grams: 0.5, state: "as_is", measure: { unit: "pinch", quantity: 1 }, role: "seasoning", linkedTo: "beef" },
    { key: "corn", food: "corn_frozen", grams: 60, state: "boil", cooking: "microwave", role: "vegetable" },
    { key: "beans", food: "kidney_beans", grams: 60, state: "as_is", role: "other" },
    { key: "tomato", food: "tomato", grams: 60, state: "raw", role: "vegetable" },
    { key: "onion", food: "onion", grams: 20, state: "raw", role: "vegetable" },
    { key: "coriander", food: "coriander", grams: 5, state: "raw", role: "vegetable" },
    { key: "lime_salsa", food: "lime_juice", grams: 5, state: "as_is", measure: { unit: "tsp", quantity: 1 }, role: "seasoning" },
    { key: "rice", food: "rice_cooked", grams: 150, state: "as_is", role: "main_carb", adjust: { kind: "grams", min: 100, max: 250, step: 50 } },
  ],
  sides: [
    { key: "rice", label: { ja: "ご飯", en: "Rice", es: "Arroz" }, ingredients: ["rice"], solverMayRemove: true },
  ],
  steps: [
    {
      key: "marinate",
      text: {
        ja: "牛もも肉に、ライム果汁、すりおろしたにんにく、チリパウダー、塩をからめて10分おきます。",
        en: "Coat the beef with the lime juice, grated garlic, chili powder, and salt and leave for 10 minutes.",
        es: "Unta la ternera con el zumo de lima, el ajo rallado, el chile en polvo y la sal y déjala reposar 10 minutos.",
      },
    },
    {
      key: "salsa",
      text: {
        ja: "冷凍コーンを耐熱容器に入れ、600Wで1分加熱して冷まします。トマトは1cm角、玉ねぎとパクチーはみじん切りにし、汁を切った赤いんげん豆、コーン、ライム果汁と混ぜます。",
        en: "Microwave the frozen corn in a heatproof container at 600 W for 1 minute and let it cool. Dice the tomato into 1 cm pieces, finely chop the onion and cilantro, and mix with the drained kidney beans, the corn, and the lime juice.",
        es: "Calienta el maíz congelado en un recipiente apto para microondas a 600 W durante 1 minuto y deja que se enfríe. Corta el tomate en dados de 1 cm, pica fino la cebolla y el cilantro, y mézclalos con las alubias rojas escurridas, el maíz y el zumo de lima.",
      },
    },
    {
      key: "sear",
      text: {
        ja: "フライパンに油を薄くひいて強めの中火で熱し、牛肉を片面3〜4分ずつ焼き、中まで火を通します。5分休ませてから薄切りにします。",
        en: "Lightly oil a frying pan, heat it over medium-high heat, and sear the beef for 3–4 minutes on each side, until cooked through. Rest it for 5 minutes, then slice it thinly.",
        es: "Unta ligeramente una sartén con aceite, caliéntala a fuego medio-alto y haz la ternera 3-4 minutos por cada lado, hasta que esté hecha por dentro. Déjala reposar 5 minutos y córtala en lonchas finas.",
      },
    },
    {
      key: "serve",
      text: {
        ja: "牛肉を器に盛り、サルサをのせます。",
        en: "Plate the beef and spoon the salsa over.",
        es: "Sirve la ternera y pon la salsa por encima.",
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
      key: "beef_doneness",
      text: {
        ja: "牛肉は中まで火を通してください。切り口に赤い部分が残っていれば、さらに焼きます。",
        en: "Cook the beef through. If any red remains when you cut it, cook it longer.",
        es: "Cocina bien la ternera. Si queda algo rojo al cortarla, cocínala más tiempo.",
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
