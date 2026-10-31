import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "tofu_soy_meat_jorim",
  texts: {
    name: { ja: "豆腐と大豆ミートの韓国風煮物（トゥブジョリム）", en: "Dubu jorim: Korean-style braised tofu with soy mince", es: "Dubu jorim: tofu guisado al estilo coreano con soja texturizada", fr: "Dubu jorim : tofu braisé à la coréenne au haché de soja" },
    summary: {
      ja: "韓国のトゥブジョリムをヒントに、焼き色をつけた木綿豆腐と大豆ミートを、唐辛子入りの甘辛いしょうゆだれで煮からめます。ご飯を添えます。作り置きできます。",
      en: "Inspired by Korean dubu jorim: browned firm tofu and soy mince braised in a sweet and spicy soy sauce with chili, with rice. It keeps well.",
      es: "Inspirado en el dubu jorim coreano: tofu firme dorado y soja texturizada guisados en una salsa de soja dulce y picante, con arroz. Se puede preparar por adelantado.",
      fr: "Inspiré du dubu jorim coréen : tofu ferme doré et haché de soja braisés dans une sauce soja sucrée et pimentée, avec du riz. Le plat se conserve bien.",
    },
  },
  cuisine: "korean",
  goals: ["maintain"],
  mainProteinGroup: "soy",
  tags: ["batch"],
  minutes: 20,
  effort: 1,
  equipment: ["stove", "frying_pan"],
  servings: 1,
  ingredients: [
    {
      key: "soy_meat",
      food: "soy_meat",
      grams: 40,
      state: "raw",
      cooking: "simmer",
      role: "main_protein",
      adjust: { kind: "grams", min: 20, max: 60, step: 10 },
      note: {
        ja: "成分表に戻して加熱した大豆ミートの値がないため、乾燥品の値で計算しています。",
        en: "The tables have no value for rehydrated, cooked soy mince, so the value of the dry product is used.",
        es: "Las tablas no tienen un valor para la soja texturizada rehidratada y cocinada, así que se usa el valor del producto seco.",
        fr: "Les tables n'ont pas de valeur pour le haché de soja réhydraté et cuit ; la valeur du produit sec est donc utilisée.",
      },
    },
    {
      key: "tofu",
      food: "tofu_firm",
      grams: 200,
      state: "raw",
      cooking: "simmer",
      measure: { unit: "block", quantity: 2 / 3 },
      role: "main_protein",
      note: {
        ja: "成分表に焼いて煮た豆腐の値がないため、生の値で計算しています。",
        en: "The tables have no value for seared and braised tofu, so the raw value is used.",
        es: "Las tablas no tienen un valor para el tofu dorado y guisado, así que se usa el valor en crudo.",
        fr: "Les tables n'ont pas de valeur pour le tofu saisi puis braisé ; la valeur à l'état cru est donc utilisée.",
      },
    },
    { key: "oil", food: "vegetable_oil", grams: 3, state: "as_is", measure: { unit: "tsp", quantity: 0.75 }, role: "fat" },
    { key: "soy_sauce", food: "soy_sauce", grams: 18, state: "as_is", measure: { unit: "tbsp", quantity: 1 }, role: "seasoning" },
    { key: "sugar", food: "sugar", grams: 4, state: "as_is", role: "seasoning" },
    { key: "chili", food: "chili_pepper_powder", grams: 2, state: "as_is", role: "seasoning" },
    { key: "garlic", food: "garlic", grams: 5, state: "raw", measure: { unit: "clove", quantity: 1 }, role: "seasoning" },
    { key: "green_onion", food: "green_onion", grams: 15, state: "raw", role: "vegetable" },
    { key: "sesame_oil", food: "sesame_oil", grams: 2, state: "as_is", measure: { unit: "tsp", quantity: 0.5 }, role: "fat" },
    { key: "rice", food: "rice_cooked", grams: 150, state: "as_is", role: "main_carb", adjust: { kind: "grams", min: 100, max: 200, step: 50 } },
  ],
  sides: [
    { key: "rice", label: { ja: "ご飯", en: "Rice", es: "Arroz", fr: "Riz" }, ingredients: ["rice"], solverMayRemove: true },
  ],
  steps: [
    {
      key: "soak",
      text: {
        ja: "大豆ミートを熱湯に5分ほどつけて戻し、ざるにあけて水気をしっかり絞ります。",
        en: "Soak the soy mince in boiling water for about 5 minutes, drain it in a sieve, and squeeze out the water well.",
        es: "Remoja la soja texturizada en agua hirviendo unos 5 minutos, escúrrela en un colador y exprime bien el agua.",
        fr: "Faites tremper le haché de soja environ 5 minutes dans de l'eau bouillante, égouttez-le dans une passoire et pressez-le bien.",
      },
    },
    {
      key: "prep",
      text: {
        ja: "豆腐の水気をキッチンペーパーで拭き、1.5cm厚さに切ります。しょうゆ、砂糖、一味唐辛子、すりおろしたにんにく、水大さじ4を混ぜてたれを作ります。青ねぎは小口切りにします。",
        en: "Pat the tofu dry with paper towels and cut it into 1.5 cm thick slices. Mix the soy sauce, sugar, ground chili, grated garlic, and 4 tablespoons of water to make the sauce. Slice the green onion thinly.",
        es: "Seca el tofu con papel de cocina y córtalo en lonchas de 1,5 cm. Mezcla la salsa de soja, el azúcar, la guindilla molida, el ajo rallado y 4 cucharadas de agua para hacer la salsa. Corta la cebolleta en rodajas finas.",
        fr: "Épongez le tofu avec du papier absorbant et coupez-le en tranches de 1,5 cm d'épaisseur. Mélangez la sauce soja, le sucre, le piment moulu, l'ail râpé et 4 cuillères à soupe d'eau pour faire la sauce. Émincez finement l'oignon vert.",
      },
    },
    {
      key: "sear",
      text: {
        ja: "フライパンに油を中火で熱し、豆腐の両面に焼き色をつけます。",
        en: "Heat the oil in a frying pan over medium heat and brown the tofu on both sides.",
        es: "Calienta el aceite en una sartén a fuego medio y dora el tofu por los dos lados.",
        fr: "Faites chauffer l'huile dans une poêle à feu moyen et faites dorer le tofu des deux côtés.",
      },
    },
    {
      key: "braise",
      text: {
        ja: "大豆ミートとたれを加え、弱めの中火で5分ほど、ときどき豆腐を返しながら汁気が少なくなるまで煮ます。ごま油を回しかけ、青ねぎを散らします。",
        en: "Add the soy mince and the sauce and simmer over medium-low heat for about 5 minutes, turning the tofu now and then, until the liquid is reduced. Drizzle with the sesame oil and scatter the green onion over.",
        es: "Añade la soja texturizada y la salsa y cuece a fuego medio-bajo unos 5 minutos, dando la vuelta al tofu de vez en cuando, hasta que se reduzca el líquido. Rocía con el aceite de sésamo y esparce la cebolleta.",
        fr: "Ajoutez le haché de soja et la sauce, et laissez mijoter environ 5 minutes à feu moyen-doux en retournant le tofu de temps en temps, jusqu'à ce que le liquide ait réduit. Arrosez d'huile de sésame et parsemez d'oignon vert.",
      },
    },
    {
      key: "rice",
      side: "rice",
      text: { ja: "ご飯を添えます。", en: "Serve with the rice.", es: "Acompáñalo con el arroz.", fr: "Servez avec le riz." },
    },
  ],
  safetyNotes: [
    {
      key: "hot_water",
      text: {
        ja: "熱湯を扱うときは、やけどに注意してください。",
        en: "Take care not to scald yourself with the boiling water.",
        es: "Ten cuidado de no quemarte con el agua hirviendo.",
        fr: "Attention à ne pas vous ébouillanter avec l'eau bouillante.",
      },
    },
    {
      key: "hot_oil",
      text: {
        ja: "水気の残った豆腐を入れると油がはねます。水気をよく切ってから焼いてください。",
        en: "Wet tofu makes the oil spatter. Drain it well before searing.",
        es: "El tofu húmedo hace que el aceite salpique. Escúrrelo bien antes de dorarlo.",
        fr: "Un tofu humide fait gicler l'huile. Égouttez-le bien avant de le saisir.",
      },
    },
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
