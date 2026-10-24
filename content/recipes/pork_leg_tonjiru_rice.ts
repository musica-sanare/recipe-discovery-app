import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "pork_leg_tonjiru_rice",
  texts: {
    name: { ja: "豚もも肉の具だくさん豚汁とご飯", en: "Hearty pork and vegetable miso soup with rice", es: "Sopa de miso con cerdo y verduras, con arroz" },
    summary: {
      ja: "脂の少ない豚もも肉と根菜、きのこをたっぷり入れたみそ汁に、ご飯を添えた一食です。",
      en: "A full meal of miso soup packed with lean pork leg, root vegetables, and mushrooms, served with rice.",
      es: "Una comida completa de sopa de miso con mucha pierna de cerdo magra, tubérculos y setas, con arroz.",
    },
  },
  cuisine: "japanese",
  goals: ["maintain"],
  mainProteinGroup: "pork",
  tags: ["batch"],
  minutes: 25,
  effort: 2,
  equipment: ["stove", "pot"],
  servings: 1,
  ingredients: [
    { key: "pork", food: "pork_leg", grams: 150, state: "boil", role: "main_protein", adjust: { kind: "grams", min: 100, max: 220, step: 10 } },
    { key: "potato", food: "potato", grams: 80, state: "simmer", measure: { unit: "piece", quantity: 0.5 }, role: "vegetable" },
    { key: "carrot", food: "carrot", grams: 30, state: "boil", role: "vegetable" },
    { key: "shiitake", food: "shiitake", grams: 30, state: "boil", measure: { unit: "piece", quantity: 2 }, role: "vegetable" },
    { key: "long_onion", food: "long_onion", grams: 30, state: "raw", cooking: "boil", role: "vegetable" },
    { key: "miso", food: "miso", grams: 18, state: "as_is", measure: { unit: "tbsp", quantity: 1 }, role: "seasoning" },
    { key: "sesame_oil", food: "sesame_oil", grams: 2, state: "as_is", role: "fat" },
    { key: "rice", food: "rice_cooked", grams: 200, state: "as_is", role: "main_carb", adjust: { kind: "grams", min: 100, max: 300, step: 10 } },
  ],
  sides: [
    { key: "rice", label: { ja: "ご飯", en: "Rice", es: "Arroz" }, ingredients: ["rice"], solverMayRemove: true },
  ],
  steps: [
    {
      key: "prep",
      text: {
        ja: "豚肉を食べやすく切ります。じゃがいもは1.5cm角、にんじんは薄いいちょう切り、しいたけは軸を取って薄切り、長ねぎは小口切りにします。",
        en: "Cut the pork into bite-size pieces. Cut the potato into 1.5 cm cubes and the carrot into thin quarter-rounds, remove the shiitake stems and slice the caps, and thinly slice the long onion.",
        es: "Corta el cerdo en trozos pequeños. Corta la patata en dados de 1,5 cm y la zanahoria en cuartos de rodaja finos, quita los pies de los shiitake y lamina los sombreros, y corta el puerro japonés en rodajas finas.",
      },
    },
    {
      key: "simmer",
      text: {
        ja: "鍋に水400mL、じゃがいも、にんじん、しいたけを入れて中火にかけ、煮立ったら豚肉を加えます。アクを取り、弱火で10分煮ます。",
        en: "Put 400 mL of water, the potato, carrot, and shiitake in a pot over medium heat; when it boils, add the pork. Skim off the foam and simmer over low heat for 10 minutes.",
        es: "Pon 400 mL de agua, la patata, la zanahoria y los shiitake en una olla a fuego medio; cuando hierva, añade el cerdo. Retira la espuma y cuece a fuego bajo 10 minutos.",
      },
    },
    {
      key: "miso",
      text: {
        ja: "長ねぎを加え、火を止めてからみそを溶き入れます。ごま油をたらします。",
        en: "Add the long onion, turn off the heat, and dissolve the miso into the soup. Drizzle with the sesame oil.",
        es: "Añade el puerro japonés, apaga el fuego y disuelve el miso en la sopa. Rocía con el aceite de sésamo.",
      },
    },
    {
      key: "serve",
      text: {
        ja: "汁椀に盛ります。",
        en: "Ladle into a bowl.",
        es: "Sírvelo en un cuenco.",
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
      },
    },
    {
      key: "cooling",
      text: {
        ja: "作り置きする場合は、浅い容器に移して早めに冷まし、冷蔵庫で保存してください。食べるときは中心まで十分に温め直します。",
        en: "To keep leftovers, transfer them to a shallow container, cool them quickly, and refrigerate. Reheat until piping hot throughout before eating.",
        es: "Si guardas sobras, pásalas a un recipiente poco hondo, enfríalas rápido y guárdalas en el frigorífico. Antes de comer, recaliéntalas hasta que estén bien calientes por dentro.",
      },
    },
  ],
  substitutions: [],
};
