import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "pork_noodle_salad_bun",
  texts: {
    name: { ja: "ゆで豚とビーフンのブン風サラダ", en: "Bún-style boiled pork and rice noodle salad", es: "Ensalada de fideos de arroz con cerdo hervido al estilo bún", fr: "Salade de porc bouilli et vermicelles de riz façon bún" },
    summary: {
      ja: "ベトナムのブンをヒントに、ゆでた豚もも肉とビーフンを生野菜とハーブにのせ、ナンプラーとライムのたれをかけます。",
      en: "Inspired by Vietnamese bún: boiled lean pork and rice noodles over raw vegetables and herbs, dressed with fish sauce and lime.",
      es: "Inspirado en el bún vietnamita: cerdo magro hervido y fideos de arroz sobre verduras crudas y hierbas, aliñados con salsa de pescado y lima.",
      fr: "Inspirée du bún vietnamien : porc maigre bouilli et vermicelles de riz sur des légumes crus et des herbes, assaisonnés de sauce de poisson et de citron vert.",
    },
  },
  cuisine: "southeast_asian",
  goals: ["cut"],
  mainProteinGroup: "pork",
  tags: [],
  minutes: 20,
  effort: 1,
  equipment: ["stove", "pot"],
  servings: 1,
  ingredients: [
    { key: "pork", food: "pork_leg", grams: 140, state: "boil", role: "main_protein", adjust: { kind: "grams", min: 100, max: 180, step: 20 } },
    {
      key: "noodles",
      food: "rice_noodles",
      grams: 80,
      state: "raw",
      cooking: "boil",
      role: "main_carb",
      adjust: { kind: "grams", min: 60, max: 100, step: 10 },
      note: {
        ja: "成分表にゆでたビーフンの値がないため、乾物の値で計算しています。",
        en: "The tables have no value for boiled rice noodles, so the dry value is used.",
        es: "Las tablas no tienen un valor para los fideos de arroz cocidos, así que se usa el valor en seco.",
        fr: "Les tables n'ont pas de valeur pour les vermicelles de riz cuits ; la valeur à l'état sec est donc utilisée.",
      },
    },
    { key: "lettuce", food: "lettuce", grams: 40, state: "raw", role: "vegetable" },
    { key: "cucumber", food: "cucumber", grams: 50, state: "raw", measure: { unit: "piece", quantity: 0.5 }, role: "vegetable" },
    { key: "carrot", food: "carrot", grams: 30, state: "raw", role: "vegetable" },
    { key: "coriander", food: "coriander", grams: 5, state: "raw", role: "vegetable" },
    { key: "basil", food: "basil", grams: 3, state: "raw", role: "vegetable" },
    { key: "fish_sauce", food: "fish_sauce", grams: 12, state: "as_is", measure: { unit: "tsp", quantity: 2 }, role: "seasoning" },
    { key: "lime", food: "lime_juice", grams: 15, state: "as_is", measure: { unit: "tbsp", quantity: 1 }, role: "seasoning" },
    { key: "sugar", food: "sugar", grams: 6, state: "as_is", measure: { unit: "tsp", quantity: 2 }, role: "seasoning" },
    { key: "garlic", food: "garlic", grams: 3, state: "raw", measure: { unit: "clove", quantity: 0.5 }, role: "seasoning" },
  ],
  sides: [],
  steps: [
    {
      key: "dressing",
      text: {
        ja: "ナンプラー、ライム果汁、砂糖、すりおろしたにんにく、水大さじ2を混ぜてたれを作ります。",
        en: "Mix the fish sauce, lime juice, sugar, grated garlic, and 2 tablespoons of water to make the dressing.",
        es: "Mezcla la salsa de pescado, el zumo de lima, el azúcar, el ajo rallado y 2 cucharadas de agua para hacer el aliño.",
        fr: "Mélangez la sauce de poisson, le jus de citron vert, le sucre, l'ail râpé et 2 cuillères à soupe d'eau pour faire la sauce.",
      },
    },
    {
      key: "pork",
      text: {
        ja: "鍋に湯を沸かし、薄切りにした豚もも肉を入れて弱火で、ピンク色が残らなくなるまで3〜4分ゆで、取り出して水気を切ります。",
        en: "Bring a pot of water to a boil, add the thinly sliced pork, and cook over low heat for 3–4 minutes, until no pink remains. Take it out and drain.",
        es: "Lleva a ebullición una olla con agua, añade el cerdo cortado en lonchas finas y cuécelo a fuego bajo 3-4 minutos, hasta que no quede nada rosado. Sácalo y escúrrelo.",
        fr: "Portez une casserole d'eau à ébullition, ajoutez le porc en fines tranches et faites cuire 3 à 4 minutes à feu doux, jusqu'à ce qu'il ne reste plus de rose. Sortez-le et égouttez-le.",
      },
    },
    {
      key: "noodles",
      text: {
        ja: "同じ湯でビーフンを袋の表示時間どおりにゆで、水で洗って水気を切ります。",
        en: "Boil the rice noodles in the same water for the time on the package, rinse them in cold water, and drain.",
        es: "Cuece los fideos de arroz en la misma agua el tiempo que indique el paquete, lávalos con agua fría y escúrrelos.",
        fr: "Faites cuire les vermicelles de riz dans la même eau pendant le temps indiqué sur l'emballage, rincez-les à l'eau froide et égouttez-les.",
      },
    },
    {
      key: "assemble",
      text: {
        ja: "レタスはちぎり、きゅうりとにんじんはせん切りにします。器に野菜とハーブを敷き、ビーフンと豚肉をのせ、たれをかけます。",
        en: "Tear the lettuce and cut the cucumber and carrot into thin strips. Put the vegetables and herbs in a bowl, top with the noodles and pork, and pour the dressing over.",
        es: "Trocea la lechuga y corta el pepino y la zanahoria en tiras finas. Pon las verduras y las hierbas en un cuenco, coloca encima los fideos y el cerdo y vierte el aliño.",
        fr: "Déchirez la laitue et taillez le concombre et la carotte en fines lanières. Mettez les légumes et les herbes dans un bol, ajoutez les vermicelles et le porc, et versez la sauce dessus.",
      },
    },
  ],
  safetyNotes: [
    {
      key: "pork_doneness",
      text: {
        ja: "豚肉はピンク色が残らないよう、完全に色が変わるまで加熱してください。",
        en: "Cook the pork until no pink remains.",
        es: "Cocina el cerdo hasta que no quede nada rosado.",
        fr: "Faites cuire le porc jusqu'à ce qu'il ne reste plus de rose.",
      },
    },
    {
      key: "wash_raw",
      text: {
        ja: "生で食べる野菜とハーブは、流水でよく洗ってください。",
        en: "Wash raw vegetables and herbs well under running water.",
        es: "Lava bien con agua corriente las verduras y hierbas que se comen crudas.",
        fr: "Lavez bien sous l'eau courante les légumes et les herbes consommés crus.",
      },
    },
  ],
  substitutions: [],
};
