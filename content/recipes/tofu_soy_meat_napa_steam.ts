import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "tofu_soy_meat_napa_steam",
  texts: {
    name: { ja: "豆腐と大豆ミートの白菜レンジ蒸し", en: "Microwave-steamed tofu, soy mince, and napa cabbage", es: "Tofu, soja texturizada y col china al vapor en el microondas", fr: "Tofu, haché de soja et chou chinois à la vapeur au micro-ondes" },
    summary: {
      ja: "白菜、木綿豆腐、大豆ミートを電子レンジで蒸し、しょうがのきいたとろみのあるオイスターソースのあんをかけます。ご飯を添えます。",
      en: "Napa cabbage, firm tofu, and soy mince steamed in the microwave and topped with a thickened oyster sauce with ginger, with rice.",
      es: "Col china, tofu firme y soja texturizada al vapor en el microondas, con una salsa de ostras espesada con jengibre, con arroz.",
      fr: "Chou chinois, tofu ferme et haché de soja cuits à la vapeur au micro-ondes et nappés d'une sauce d'huître liée au gingembre, avec du riz.",
    },
  },
  cuisine: "chinese",
  goals: ["cut"],
  mainProteinGroup: "soy",
  tags: [],
  minutes: 12,
  effort: 1,
  equipment: ["microwave"],
  servings: 1,
  ingredients: [
    {
      key: "soy_meat",
      food: "soy_meat",
      grams: 50,
      state: "raw",
      cooking: "microwave",
      role: "main_protein",
      adjust: { kind: "grams", min: 30, max: 70, step: 10 },
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
      grams: 150,
      state: "raw",
      cooking: "microwave",
      measure: { unit: "block", quantity: 0.5 },
      role: "main_protein",
      note: {
        ja: "成分表に電子レンジで加熱した豆腐の値がないため、生の値で計算しています。",
        en: "The tables have no value for microwaved tofu, so the raw value is used.",
        es: "Las tablas no tienen un valor para el tofu hecho en el microondas, así que se usa el valor en crudo.",
        fr: "Les tables n'ont pas de valeur pour le tofu cuit au micro-ondes ; la valeur à l'état cru est donc utilisée.",
      },
    },
    {
      key: "napa",
      food: "napa_cabbage",
      grams: 150,
      state: "raw",
      cooking: "microwave",
      role: "vegetable",
      note: {
        ja: "成分表に電子レンジで加熱した白菜の値がないため、生の値で計算しています。",
        en: "The tables have no value for microwaved napa cabbage, so the raw value is used.",
        es: "Las tablas no tienen un valor para la col china hecha en el microondas, así que se usa el valor en crudo.",
        fr: "Les tables n'ont pas de valeur pour le chou chinois cuit au micro-ondes ; la valeur à l'état cru est donc utilisée.",
      },
    },
    { key: "ginger", food: "ginger", grams: 5, state: "raw", measure: { unit: "knob", quantity: 0.5 }, role: "seasoning" },
    { key: "soy_sauce", food: "soy_sauce", grams: 9, state: "as_is", measure: { unit: "tsp", quantity: 1.5 }, role: "seasoning" },
    { key: "oyster", food: "oyster_sauce", grams: 6, state: "as_is", measure: { unit: "tsp", quantity: 1 }, role: "seasoning" },
    { key: "starch", food: "potato_starch", grams: 3, state: "as_is", measure: { unit: "tsp", quantity: 1 }, role: "other" },
    { key: "sesame_oil", food: "sesame_oil", grams: 3, state: "as_is", measure: { unit: "tsp", quantity: 0.75 }, role: "fat" },
    { key: "green_onion", food: "green_onion", grams: 10, state: "raw", role: "vegetable" },
    { key: "rice", food: "rice_cooked", grams: 180, state: "as_is", role: "main_carb", adjust: { kind: "grams", min: 150, max: 240, step: 30 } },
  ],
  sides: [
    { key: "rice", label: { ja: "ご飯", en: "Rice", es: "Arroz", fr: "Riz" }, ingredients: ["rice"], solverMayRemove: true },
  ],
  steps: [
    {
      key: "soak",
      text: {
        ja: "大豆ミートを耐熱容器に入れ、かぶるくらいの水を加えて600Wで2分加熱し、ざるにあけて冷まし、水気をしっかり絞ります。",
        en: "Put the soy mince in a heatproof container, cover it with water, and microwave at 600 W for 2 minutes. Drain it in a sieve, let it cool, and squeeze out the water well.",
        es: "Pon la soja texturizada en un recipiente apto para microondas, cúbrela con agua y caliéntala a 600 W durante 2 minutos. Escúrrela en un colador, deja que se enfríe y exprime bien el agua.",
        fr: "Mettez le haché de soja dans un récipient résistant à la chaleur, couvrez-le d'eau et faites chauffer au micro-ondes à 600 W pendant 2 minutes. Égouttez-le dans une passoire, laissez-le refroidir et pressez-le bien.",
      },
    },
    {
      key: "steam",
      text: {
        ja: "耐熱皿にざく切りの白菜を敷き、2cm厚さに切った豆腐と大豆ミートをのせます。ふんわりとラップをかけて600Wで5〜6分、白菜がしんなりするまで加熱します。",
        en: "Spread the roughly chopped napa cabbage in a heatproof dish and put the tofu, cut 2 cm thick, and the soy mince on top. Cover loosely with plastic wrap and microwave at 600 W for 5–6 minutes, until the cabbage is soft.",
        es: "Extiende la col china troceada en un plato apto para microondas y pon encima el tofu, cortado en trozos de 2 cm, y la soja texturizada. Cubre sin apretar con film y calienta a 600 W durante 5-6 minutos, hasta que la col esté blanda.",
        fr: "Étalez le chou chinois coupé grossièrement dans un plat résistant à la chaleur et posez dessus le tofu, coupé en tranches de 2 cm, et le haché de soja. Couvrez sans serrer de film alimentaire et faites chauffer au micro-ondes à 600 W pendant 5 à 6 minutes, jusqu'à ce que le chou soit tendre.",
      },
    },
    {
      key: "sauce",
      text: {
        ja: "耐熱容器にしょうゆ、オイスターソース、片栗粉、すりおろしたしょうが、水80mLを入れてよく混ぜ、600Wで1分加熱して混ぜ、とろみがつくまでさらに30秒ずつ加熱します。",
        en: "In a heatproof container, mix the soy sauce, oyster sauce, potato starch, grated ginger, and 80 mL of water well. Microwave at 600 W for 1 minute, stir, and heat in 30-second bursts until thickened.",
        es: "En un recipiente apto para microondas, mezcla bien la salsa de soja, la salsa de ostras, la fécula, el jengibre rallado y 80 mL de agua. Calienta a 600 W durante 1 minuto, remueve y calienta en tandas de 30 segundos hasta que espese.",
        fr: "Dans un récipient résistant à la chaleur, mélangez bien la sauce soja, la sauce d'huître, la fécule, le gingembre râpé et 80 mL d'eau. Faites chauffer au micro-ondes à 600 W pendant 1 minute, remuez, puis prolongez par tranches de 30 secondes jusqu'à ce que la sauce épaississe.",
      },
    },
    {
      key: "serve",
      text: {
        ja: "蒸した白菜と豆腐にあんをかけ、ごま油と小口切りの青ねぎをかけます。",
        en: "Pour the sauce over the steamed cabbage and tofu and top with the sesame oil and sliced green onion.",
        es: "Vierte la salsa sobre la col y el tofu al vapor y termina con el aceite de sésamo y la cebolleta en rodajas.",
        fr: "Versez la sauce sur le chou et le tofu cuits à la vapeur, et garnissez d'huile de sésame et d'oignon vert émincé.",
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
      key: "steam",
      text: {
        ja: "加熱直後は蒸気でやけどしやすいので、ラップは奥から手前に向かって外してください。",
        en: "Steam can burn right after heating; peel the wrap away from you.",
        es: "El vapor puede quemar justo después de calentar; retira el film en dirección contraria a ti.",
        fr: "La vapeur peut brûler juste après la cuisson ; retirez le film en l'écartant de vous.",
      },
    },
    {
      key: "hot_sauce",
      text: {
        ja: "とろみのついたあんは冷めにくく、やけどしやすいので注意してください。",
        en: "Thickened sauce stays hot for a long time; take care not to burn yourself.",
        es: "La salsa espesada tarda en enfriarse; ten cuidado de no quemarte.",
        fr: "Une sauce liée reste chaude longtemps ; attention à ne pas vous brûler.",
      },
    },
  ],
  substitutions: [],
};
