import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "chicken_tsukune_okra",
  texts: {
    name: { ja: "鶏むね肉のつくね オクラ添え", en: "Chicken breast tsukune with okra", es: "Tsukune de pechuga de pollo con quimbombó" },
    summary: {
      ja: "細かく刻んだ鶏むね肉にねぎとしょうがを混ぜてつくねにし、フライパンで焼いて甘辛いたれをからめます。ゆでたオクラとご飯を添えます。多めに作って冷蔵できます。",
      en: "Finely chopped chicken breast mixed with leek and ginger, shaped into tsukune patties, pan-fried, and glazed with a sweet soy sauce, with boiled okra and rice. Make extra and refrigerate.",
      es: "Pechuga de pollo picada mezclada con puerro y jengibre, formada en tsukune, hecha en la sartén y glaseada con salsa de soja dulce, con quimbombó hervido y arroz. Puedes hacer de más y guardarlas en el refrigerador.",
    },
  },
  cuisine: "japanese",
  goals: ["maintain"],
  mainProteinGroup: "chicken",
  tags: ["batch"],
  minutes: 30,
  effort: 3,
  equipment: ["stove", "frying_pan", "pot"],
  servings: 1,
  ingredients: [
    {
      key: "chicken",
      food: "chicken_breast",
      grams: 180,
      state: "raw",
      cooking: "saute",
      role: "main_protein",
      adjust: { kind: "grams", min: 140, max: 220, step: 20 },
      note: {
        ja: "成分表にフライパンで焼いた鶏むね肉の値がないため、生の値で計算しています。",
        en: "The tables have no value for pan-fried chicken breast, so the raw value is used.",
        es: "Las tablas no tienen un valor para la pechuga de pollo hecha en la sartén, así que se usa el valor en crudo.",
      },
    },
    { key: "long_onion", food: "long_onion", grams: 20, state: "raw", cooking: "saute", role: "vegetable" },
    { key: "ginger", food: "ginger", grams: 5, state: "raw", measure: { unit: "knob", quantity: 0.5 }, role: "seasoning" },
    { key: "starch", food: "potato_starch", grams: 6, state: "as_is", measure: { unit: "tsp", quantity: 2 }, role: "other" },
    { key: "egg_white", food: "egg_white", grams: 30, state: "raw", cooking: "saute", role: "other" },
    { key: "oil", food: "vegetable_oil", grams: 4, state: "as_is", measure: { unit: "tsp", quantity: 1 }, role: "fat" },
    { key: "soy_sauce", food: "soy_sauce", grams: 12, state: "as_is", measure: { unit: "tsp", quantity: 2 }, role: "seasoning", linkedTo: "chicken" },
    { key: "mirin", food: "mirin", grams: 12, state: "as_is", measure: { unit: "tsp", quantity: 2 }, role: "seasoning", linkedTo: "chicken" },
    { key: "sugar", food: "sugar", grams: 3, state: "as_is", measure: { unit: "tsp", quantity: 1 }, role: "seasoning", linkedTo: "chicken" },
    { key: "okra", food: "okra", grams: 60, state: "boil", measure: { unit: "piece", quantity: 6 }, role: "vegetable" },
    { key: "rice", food: "rice_cooked", grams: 200, state: "as_is", role: "main_carb", adjust: { kind: "grams", min: 150, max: 250, step: 50 } },
  ],
  sides: [
    { key: "rice", label: { ja: "ご飯", en: "Rice", es: "Arroz" }, ingredients: ["rice"], solverMayRemove: true },
  ],
  steps: [
    {
      key: "mix",
      text: {
        ja: "鶏むね肉を包丁で細かく刻みます。みじん切りのねぎ、すりおろしたしょうが、片栗粉、卵白を加え、粘りが出るまでよく混ぜて、6等分の小判形にまとめます。",
        en: "Finely chop the chicken breast with a knife. Add the chopped leek, grated ginger, potato starch, and egg white, mix well until sticky, and shape into 6 oval patties.",
        es: "Pica la pechuga a cuchillo. Añade el puerro picado, el jengibre rallado, la fécula y la clara, mezcla bien hasta que quede pegajoso y forma 6 tortitas ovaladas.",
      },
    },
    {
      key: "okra",
      text: {
        ja: "オクラのがくをむき、熱湯で1〜2分ゆでて水気を切ります。",
        en: "Trim the caps of the okra, boil for 1–2 minutes, and drain.",
        es: "Recorta el extremo del quimbombó, hiérvelo 1-2 minutos y escúrrelo.",
      },
    },
    {
      key: "fry",
      text: {
        ja: "フライパンに油を中火で熱し、つくねを並べて3分焼きます。裏返してふたをし、弱火で4〜5分焼きます。1個を割って中まで火が通っていることを確かめ、しょうゆ、みりん、砂糖を加えて煮からめます。",
        en: "Heat the oil in a frying pan over medium heat and cook the patties for 3 minutes. Turn them, cover, and cook over low heat for 4–5 minutes. Cut one open to check that it is cooked through, then add the soy sauce, mirin, and sugar and toss to glaze.",
        es: "Calienta el aceite en una sartén a fuego medio y haz las tortitas 3 minutos. Dales la vuelta, tapa y cocínalas a fuego bajo 4-5 minutos. Abre una para comprobar que esté bien hecha por dentro, añade la salsa de soja, el mirin y el azúcar y remueve para glasearlas.",
      },
    },
    {
      key: "serve",
      text: { ja: "オクラと一緒に盛ります。", en: "Plate them with the okra.", es: "Sírvelas con el quimbombó." },
    },
    {
      key: "rice",
      side: "rice",
      text: { ja: "ご飯を添えます。", en: "Serve with the rice.", es: "Acompáñalo con el arroz." },
    },
  ],
  safetyNotes: [
    {
      key: "mince_doneness",
      text: {
        ja: "つくねは中心まで火を通してください。1個を割って、中にピンク色が残っていないことを確かめます。",
        en: "Cook the tsukune through. Cut one open and check that no pink remains inside.",
        es: "Cocina bien las tsukune. Abre una y comprueba que no quede nada rosado por dentro.",
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
