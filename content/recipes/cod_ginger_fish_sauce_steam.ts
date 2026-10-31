import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "cod_ginger_fish_sauce_steam",
  texts: {
    name: { ja: "たらのしょうがナンプラーレンジ蒸し", en: "Microwave-steamed cod with ginger and fish sauce", es: "Bacalao al vapor en el microondas con jengibre y salsa de pescado" },
    summary: {
      ja: "東南アジアの蒸し魚をヒントに、たらともやしを電子レンジで蒸し、しょうが、ねぎ、パクチー、ナンプラーとライムのたれをかけます。ご飯を添えます。",
      en: "Inspired by Southeast Asian steamed fish: cod and bean sprouts steamed in the microwave, topped with ginger, green onion, cilantro, and a fish sauce and lime dressing, with rice.",
      es: "Inspirado en el pescado al vapor del Sudeste Asiático: bacalao y brotes de soja al vapor en el microondas, con jengibre, cebolleta, cilantro y un aliño de salsa de pescado y lima, con arroz.",
    },
  },
  cuisine: "southeast_asian",
  goals: ["cut"],
  mainProteinGroup: "fish",
  tags: [],
  minutes: 12,
  effort: 1,
  equipment: ["microwave"],
  servings: 1,
  ingredients: [
    {
      key: "cod",
      food: "cod",
      grams: 200,
      state: "raw",
      cooking: "microwave",
      measure: { unit: "piece", quantity: 2 },
      role: "main_protein",
      adjust: { kind: "grams", min: 160, max: 240, step: 20 },
      note: {
        ja: "成分表に電子レンジで加熱したたらの値がないため、生の値で計算しています。",
        en: "The tables have no value for microwaved cod, so the raw value is used.",
        es: "Las tablas no tienen un valor para el bacalao hecho en el microondas, así que se usa el valor en crudo.",
      },
    },
    { key: "ginger", food: "ginger", grams: 10, state: "raw", measure: { unit: "knob", quantity: 1 }, role: "seasoning" },
    { key: "green_onion", food: "green_onion", grams: 15, state: "raw", role: "vegetable" },
    { key: "coriander", food: "coriander", grams: 5, state: "raw", role: "vegetable" },
    { key: "fish_sauce", food: "fish_sauce", grams: 8, state: "as_is", measure: { unit: "tsp", quantity: 1.5 }, role: "seasoning", linkedTo: "cod" },
    { key: "lime", food: "lime_juice", grams: 10, state: "as_is", measure: { unit: "tsp", quantity: 2 }, role: "seasoning" },
    { key: "sugar", food: "sugar", grams: 2, state: "as_is", role: "seasoning" },
    { key: "sesame_oil", food: "sesame_oil", grams: 3, state: "as_is", measure: { unit: "tsp", quantity: 0.75 }, role: "fat" },
    {
      key: "sprouts",
      food: "bean_sprouts",
      grams: 100,
      state: "raw",
      cooking: "microwave",
      role: "vegetable",
      note: {
        ja: "成分表に電子レンジで加熱したもやしの値がないため、生の値で計算しています。",
        en: "The tables have no value for microwaved bean sprouts, so the raw value is used.",
        es: "Las tablas no tienen un valor para los brotes de soja hechos en el microondas, así que se usa el valor en crudo.",
      },
    },
    { key: "rice", food: "rice_cooked", grams: 200, state: "as_is", role: "main_carb", adjust: { kind: "grams", min: 150, max: 250, step: 50 } },
  ],
  sides: [
    { key: "rice", label: { ja: "ご飯", en: "Rice", es: "Arroz" }, ingredients: ["rice"], solverMayRemove: true },
  ],
  steps: [
    {
      key: "steam",
      text: {
        ja: "耐熱皿にもやしを敷き、たらをのせます。しょうがの半量をせん切りにしてのせ、ふんわりとラップをかけて600Wで4〜5分、たらの中まで火が通るまで加熱します。",
        en: "Spread the bean sprouts in a heatproof dish and lay the cod on top. Cut half of the ginger into thin strips and scatter them over. Cover loosely with plastic wrap and microwave at 600 W for 4–5 minutes, until the cod is cooked through.",
        es: "Extiende los brotes de soja en un plato apto para microondas y coloca encima el bacalao. Corta la mitad del jengibre en tiras finas y repártelas por encima. Cubre sin apretar con film y calienta a 600 W durante 4-5 minutos, hasta que el bacalao esté bien hecho.",
      },
    },
    {
      key: "sauce",
      text: {
        ja: "残りのしょうがをすりおろし、ナンプラー、ライム果汁、砂糖と混ぜます。青ねぎとパクチーは刻みます。",
        en: "Grate the rest of the ginger and mix it with the fish sauce, lime juice, and sugar. Chop the green onion and cilantro.",
        es: "Ralla el resto del jengibre y mézclalo con la salsa de pescado, el zumo de lima y el azúcar. Pica la cebolleta y el cilantro.",
      },
    },
    {
      key: "serve",
      text: {
        ja: "たらにたれをかけ、青ねぎとパクチーをのせ、ごま油をかけます。",
        en: "Pour the dressing over the cod, top with the green onion and cilantro, and drizzle with the sesame oil.",
        es: "Vierte el aliño sobre el bacalao, pon por encima la cebolleta y el cilantro y rocía con el aceite de sésamo.",
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
      key: "even_heating",
      text: {
        ja: "電子レンジは加熱むらが出やすいので、たらの中心まで白く不透明になっているか確かめ、足りなければ30秒ずつ追加加熱してください。",
        en: "Microwaves heat unevenly. Check that the cod is white and opaque in the center and add 30-second bursts if needed.",
        es: "El microondas calienta de forma desigual. Comprueba que el bacalao esté blanco y opaco en el centro y añade tandas de 30 segundos si hace falta.",
      },
    },
    {
      key: "steam",
      text: {
        ja: "加熱直後は蒸気でやけどしやすいので、ラップは奥から手前に向かって外してください。",
        en: "Steam can burn right after heating; peel the wrap away from you.",
        es: "El vapor puede quemar justo después de calentar; retira el film en dirección contraria a ti.",
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
