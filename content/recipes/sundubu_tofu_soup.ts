import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "sundubu_tofu_soup",
  texts: {
    name: { ja: "スンドゥブ風豆腐スープ", en: "Sundubu-style soft tofu soup", es: "Sopa de tofu suave al estilo sundubu", fr: "Soupe de tofu soyeux façon sundubu" },
    summary: {
      ja: "韓国のスンドゥブチゲをヒントに、絹豆腐、豚もも肉、ズッキーニを辛みのあるスープで煮て、卵を落とします。ご飯を添えます。",
      en: "Inspired by Korean sundubu jjigae: silken tofu, lean pork, and zucchini simmered in a spicy broth with an egg cracked in, with rice.",
      es: "Inspirado en el sundubu jjigae coreano: tofu sedoso, cerdo magro y calabacín guisados en un caldo picante con un huevo, con arroz.",
      fr: "Inspirée du sundubu jjigae coréen : tofu soyeux, porc maigre et courgette mijotés dans un bouillon pimenté où l'on casse un œuf, avec du riz.",
    },
  },
  cuisine: "korean",
  goals: ["maintain"],
  mainProteinGroup: "soy",
  tags: [],
  minutes: 20,
  effort: 1,
  equipment: ["stove", "pot"],
  servings: 1,
  ingredients: [
    {
      key: "tofu",
      food: "tofu_silken",
      grams: 300,
      state: "raw",
      cooking: "simmer",
      role: "main_protein",
      adjust: { kind: "grams", min: 200, max: 400, step: 50 },
      note: {
        ja: "成分表に加熱した豆腐の値がないため、加熱前の値で計算しています。",
        en: "The tables have no value for cooked tofu, so the uncooked value is used.",
        es: "Las tablas no tienen un valor para el tofu cocinado, así que se usa el valor sin cocinar.",
        fr: "Les tables n'ont pas de valeur pour le tofu cuit ; la valeur avant cuisson est donc utilisée.",
      },
    },
    {
      key: "pork",
      food: "pork_leg",
      grams: 60,
      state: "raw",
      cooking: "simmer",
      role: "main_protein",
      note: {
        ja: "成分表に煮込んだ豚もも肉の値がないため、生の値で計算しています。",
        en: "The tables have no value for stewed pork leg, so the raw value is used.",
        es: "Las tablas no tienen un valor para la pierna de cerdo guisada, así que se usa el valor en crudo.",
        fr: "Les tables n'ont pas de valeur pour le jambon de porc frais mijoté ; la valeur à l'état cru est donc utilisée.",
      },
    },
    {
      key: "egg",
      food: "egg",
      grams: 50,
      state: "poach",
      measure: { unit: "piece", quantity: 1 },
      role: "main_protein",
      note: {
        ja: "スープの中で黄身まで固めて加熱するため、成分表のポーチドエッグの値で計算しています。",
        en: "The egg is cooked in the soup until the yolk is firm, so the poached egg value is used.",
        es: "El huevo se cocina en la sopa hasta que la yema esté firme, así que se usa el valor del huevo escalfado.",
        fr: "L'œuf cuit dans la soupe jusqu'à ce que le jaune soit ferme ; la valeur de l'œuf poché est donc utilisée.",
      },
    },
    { key: "sesame_oil", food: "sesame_oil", grams: 2, state: "as_is", measure: { unit: "tsp", quantity: 0.5 }, role: "fat" },
    { key: "doubanjiang", food: "doubanjiang", grams: 6, state: "as_is", measure: { unit: "tsp", quantity: 1 }, role: "seasoning" },
    { key: "soy_sauce", food: "soy_sauce", grams: 6, state: "as_is", measure: { unit: "tsp", quantity: 1 }, role: "seasoning" },
    { key: "garlic", food: "garlic", grams: 5, state: "raw", measure: { unit: "clove", quantity: 1 }, role: "seasoning" },
    { key: "zucchini", food: "zucchini", grams: 50, state: "raw", cooking: "simmer", role: "vegetable" },
    { key: "long_onion", food: "long_onion", grams: 20, state: "raw", cooking: "simmer", role: "vegetable" },
    { key: "rice", food: "rice_cooked", grams: 150, state: "as_is", role: "main_carb", adjust: { kind: "grams", min: 100, max: 250, step: 25 } },
  ],
  sides: [
    { key: "rice", label: { ja: "ご飯", en: "Rice", es: "Arroz", fr: "Riz" }, ingredients: ["rice"], solverMayRemove: true },
  ],
  steps: [
    {
      key: "prep",
      text: {
        ja: "豚もも肉を細切り、ズッキーニを1cm幅の半月切り、ねぎを斜め切りにし、にんにくはみじん切りにします。",
        en: "Cut the pork into thin strips, the zucchini into 1 cm half-moons, and the leek on the diagonal, and finely chop the garlic.",
        es: "Corta el cerdo en tiras finas, el calabacín en medias lunas de 1 cm y el puerro al bies, y pica fino el ajo.",
        fr: "Coupez le porc en fines lanières, la courgette en demi-rondelles de 1 cm et le poireau japonais en biais, et hachez finement l'ail.",
      },
    },
    {
      key: "broth",
      text: {
        ja: "鍋にごま油、にんにく、豆板醤を入れて弱火で炒め、香りが出たら豚肉を加えて中火で炒めます。水300ml、しょうゆ、ズッキーニ、ねぎを加えて煮立てます。",
        en: "Put the sesame oil, garlic, and doubanjiang in a pot and stir-fry over low heat until fragrant. Add the pork and stir-fry over medium heat. Add 300 ml of water, the soy sauce, zucchini, and leek and bring to a boil.",
        es: "Pon el aceite de sésamo, el ajo y el doubanjiang en una olla y saltea a fuego bajo hasta que suelten aroma. Añade el cerdo y saltéalo a fuego medio. Añade 300 ml de agua, la salsa de soja, el calabacín y el puerro y lleva a ebullición.",
        fr: "Mettez l'huile de sésame, l'ail et le doubanjiang dans une casserole et faites sauter à feu doux jusqu'à ce qu'ils deviennent parfumés. Ajoutez le porc et faites sauter à feu moyen. Ajoutez 300 mL d'eau, la sauce soja, la courgette et le poireau japonais, et portez à ébullition.",
      },
    },
    {
      key: "tofu",
      text: {
        ja: "豆腐をスプーンで大きくすくって加え、弱めの中火で5分煮ます。",
        en: "Add the tofu in large spoonfuls and simmer over medium-low heat for 5 minutes.",
        es: "Añade el tofu a cucharadas grandes y cuece a fuego medio-bajo 5 minutos.",
        fr: "Ajoutez le tofu par grosses cuillerées et laissez mijoter 5 minutes à feu moyen-doux.",
      },
    },
    {
      key: "egg",
      text: {
        ja: "卵を割り入れ、ふたをして3〜4分、黄身まで固まるまで煮ます。",
        en: "Crack in the egg, cover, and simmer for 3–4 minutes until the yolk is set.",
        es: "Añade el huevo, tapa y cuece 3-4 minutos hasta que la yema cuaje.",
        fr: "Cassez l'œuf dans la soupe, couvrez et laissez mijoter 3 à 4 minutes jusqu'à ce que le jaune soit pris.",
      },
    },
    {
      key: "rice",
      side: "rice",
      text: {
        ja: "ご飯を添えます。",
        en: "Serve with the rice.",
        es: "Acompáñalo con el arroz.",
        fr: "Servez avec le riz.",
      },
    },
  ],
  safetyNotes: [
    {
      key: "pork_doneness",
      text: {
        ja: "豚肉は中心まで火を通してください。切り口に赤みがないことを確認します。",
        en: "Cook the pork through. Check that no pink remains when you cut it.",
        es: "Cocina bien el cerdo. Comprueba que no quede nada rosado al cortarlo.",
        fr: "Faites cuire le porc à cœur. Vérifiez qu'il ne reste pas de rose à la découpe.",
      },
    },
    {
      key: "egg_set",
      text: {
        ja: "卵は黄身まで固まるまで加熱してください。",
        en: "Cook the eggs until the yolk is set too.",
        es: "Cocina los huevos hasta que también la yema cuaje.",
        fr: "Faites cuire les œufs jusqu'à ce que le jaune soit pris lui aussi.",
      },
    },
  ],
  substitutions: [],
};
