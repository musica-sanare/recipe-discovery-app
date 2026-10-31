import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "okinawa_soba_lean_pork",
  texts: {
    name: { ja: "豚もも肉の沖縄そば", en: "Okinawa soba with lean pork", es: "Soba de Okinawa con cerdo magro", fr: "Soba d'Okinawa au porc maigre" },
    summary: {
      ja: "沖縄そばを、三枚肉の代わりに甘辛く煮た豚もも肉で作ります。しょうがと青ねぎをのせます。",
      en: "Okinawa soba made with lean pork leg simmered in a sweet soy sauce instead of pork belly, topped with ginger and green onion.",
      es: "Soba de Okinawa preparada con pierna de cerdo magra cocida en salsa de soja dulce en lugar de panceta, con jengibre y cebolleta.",
      fr: "Soba d'Okinawa préparées avec du jambon de porc maigre mijoté dans une sauce soja sucrée au lieu de la poitrine, garnies de gingembre et d'oignon vert.",
    },
  },
  cuisine: "okinawan",
  goals: ["bulk"],
  mainProteinGroup: "pork",
  tags: [],
  minutes: 25,
  effort: 2,
  equipment: ["stove", "pot"],
  servings: 1,
  ingredients: [
    { key: "pork", food: "pork_leg", grams: 150, state: "boil", role: "main_protein", adjust: { kind: "grams", min: 110, max: 190, step: 20 } },
    { key: "soy_sauce", food: "soy_sauce", grams: 6, state: "as_is", measure: { unit: "tsp", quantity: 1 }, role: "seasoning", linkedTo: "pork" },
    { key: "sugar", food: "sugar", grams: 3, state: "as_is", measure: { unit: "tsp", quantity: 1 }, role: "seasoning", linkedTo: "pork" },
    { key: "ginger", food: "ginger", grams: 5, state: "raw", measure: { unit: "knob", quantity: 0.5 }, role: "seasoning" },
    { key: "stock", food: "chinese_stock_granules", grams: 2, state: "as_is", role: "seasoning" },
    { key: "salt", food: "salt", grams: 0.5, state: "as_is", measure: { unit: "pinch", quantity: 1 }, role: "seasoning" },
    { key: "green_onion", food: "green_onion", grams: 15, state: "raw", role: "vegetable" },
    { key: "soba", food: "okinawa_soba_boiled", grams: 400, state: "as_is", role: "main_carb", adjust: { kind: "grams", min: 300, max: 450, step: 50 } },
  ],
  sides: [],
  steps: [
    {
      key: "pork",
      text: {
        ja: "豚もも肉を1cm厚さに切ります。鍋に水500mLを沸かし、豚肉を入れて弱火で10分ほど、アクを取りながら中まで火が通るまでゆでます。",
        en: "Slice the pork 1 cm thick. Bring 500 mL of water to a boil in a pot, add the pork, and simmer over low heat for about 10 minutes, skimming, until cooked through.",
        es: "Corta el cerdo en lonchas de 1 cm. Lleva a ebullición 500 mL de agua en una olla, añade el cerdo y cuécelo a fuego bajo unos 10 minutos, espumando, hasta que esté bien hecho.",
        fr: "Coupez le porc en tranches de 1 cm. Portez 500 mL d'eau à ébullition dans une casserole, ajoutez le porc et laissez mijoter environ 10 minutes à feu doux en écumant, jusqu'à ce qu'il soit cuit à cœur.",
      },
    },
    {
      key: "glaze",
      text: {
        ja: "豚肉を取り出し、小鍋でしょうゆ、砂糖、水大さじ2と一緒に、汁気がなくなるまで煮からめます。",
        en: "Take out the pork and cook it in a small pan with the soy sauce, sugar, and 2 tablespoons of water until the liquid is gone and the pork is glazed.",
        es: "Saca el cerdo y cuécelo en un cazo pequeño con la salsa de soja, el azúcar y 2 cucharadas de agua hasta que no quede líquido y el cerdo quede glaseado.",
        fr: "Sortez le porc et faites-le cuire dans une petite poêle avec la sauce soja, le sucre et 2 cuillères à soupe d'eau jusqu'à ce que le liquide ait disparu et que le porc soit laqué.",
      },
    },
    {
      key: "soup",
      text: {
        ja: "ゆで汁に中華だしと塩を加えてスープにします。沖縄そばは袋の表示どおりに湯通しして温めます。",
        en: "Add the stock granules and salt to the cooking liquid to make the soup. Warm the Okinawa soba in boiling water as directed on the package.",
        es: "Añade el caldo granulado y la sal al caldo de cocción para hacer la sopa. Calienta la soba de Okinawa en agua hirviendo como indique el paquete.",
        fr: "Ajoutez le bouillon en granulés et le sel au liquide de cuisson pour faire la soupe. Réchauffez les soba d'Okinawa dans l'eau bouillante comme indiqué sur l'emballage.",
      },
    },
    {
      key: "serve",
      text: {
        ja: "器にそばを入れてスープを注ぎ、豚肉、せん切りのしょうが、小口切りの青ねぎをのせます。",
        en: "Put the noodles in a bowl, pour the soup over, and top with the pork, thin strips of ginger, and sliced green onion.",
        es: "Pon los fideos en un cuenco, vierte la sopa y coloca encima el cerdo, el jengibre en tiras finas y la cebolleta en rodajas.",
        fr: "Mettez les nouilles dans un bol, versez la soupe dessus et garnissez du porc, de fines lanières de gingembre et d'oignon vert émincé.",
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
  ],
  substitutions: [],
};
