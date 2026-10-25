import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "pork_fillet_sweet_potato",
  texts: {
    name: { ja: "豚ヒレのソテー 蒸したさつまいも添え", en: "Pork tenderloin with steamed sweet potato", es: "Solomillo de cerdo con boniato al vapor" },
    summary: {
      ja: "豚ヒレ肉を焼いて粒マスタードを添え、蒸したさつまいもとゆでたブロッコリーを合わせます。",
      en: "Pan-fried pork tenderloin with wholegrain mustard, served with steamed sweet potato and boiled broccoli.",
      es: "Solomillo de cerdo a la sartén con mostaza en grano, con boniato al vapor y brócoli hervido.",
    },
  },
  cuisine: "western",
  goals: ["bulk"],
  mainProteinGroup: "pork",
  tags: [],
  minutes: 30,
  effort: 2,
  equipment: ["stove", "frying_pan", "pot"],
  servings: 1,
  ingredients: [
    {
      key: "pork",
      food: "pork_fillet",
      grams: 220,
      state: "grill",
      cooking: "saute",
      role: "main_protein",
      adjust: { kind: "grams", min: 160, max: 280, step: 20 },
      note: {
        ja: "成分表にソテーした豚ヒレ肉の値がないため、焼いた値で計算しています。",
        en: "The tables have no value for sautéed pork tenderloin, so the grilled value is used.",
        es: "Las tablas no tienen un valor para el solomillo de cerdo salteado, así que se usa el valor a la parrilla.",
      },
    },
    { key: "olive_oil", food: "olive_oil", grams: 3, state: "as_is", measure: { unit: "tsp", quantity: 0.75 }, role: "fat", linkedTo: "pork" },
    { key: "salt", food: "salt", grams: 1, state: "as_is", measure: { unit: "pinch", quantity: 2 }, role: "seasoning", linkedTo: "pork" },
    { key: "mustard", food: "grain_mustard", grams: 6, state: "as_is", measure: { unit: "tsp", quantity: 1 }, role: "seasoning" },
    {
      key: "sweet_potato",
      food: "sweet_potato",
      grams: 300,
      state: "steam",
      measure: { unit: "piece", quantity: 1 },
      role: "main_carb",
      adjust: { kind: "grams", min: 200, max: 400, step: 50 },
      note: {
        ja: "皮をむいた重さです。",
        en: "Peeled weight.",
        es: "Peso pelado.",
      },
    },
    { key: "broccoli", food: "broccoli", grams: 80, state: "boil", role: "vegetable" },
  ],
  sides: [
    { key: "sweet_potato", label: { ja: "蒸したさつまいも", en: "Steamed sweet potato", es: "Boniato al vapor" }, ingredients: ["sweet_potato"], solverMayRemove: true },
  ],
  steps: [
    {
      key: "sweet_potato",
      side: "sweet_potato",
      text: {
        ja: "さつまいもの皮をむいて2cm厚さの輪切りにし、鍋に水1cmと一緒に入れます。ふたをして中火で12〜15分、竹串がすっと通るまで蒸し煮にします。",
        en: "Peel the sweet potato, cut it into 2 cm rounds, and put it in a pot with 1 cm of water. Cover and steam over medium heat for 12–15 minutes until a skewer slides in easily.",
        es: "Pela el boniato, córtalo en rodajas de 2 cm y ponlo en una olla con 1 cm de agua. Tapa y cuécelo al vapor a fuego medio 12-15 minutos hasta que un palillo entre con facilidad.",
      },
    },
    {
      key: "broccoli",
      text: {
        ja: "ブロッコリーを小房に分け、沸騰した湯で2分ほどゆでて湯を切ります。",
        en: "Cut the broccoli into florets, boil for about 2 minutes, and drain.",
        es: "Separa el brócoli en ramilletes, hiérvelo unos 2 minutos y escúrrelo.",
      },
    },
    {
      key: "sear",
      text: {
        ja: "豚ヒレ肉を厚さ2cmに切って塩をふります。フライパンにオリーブオイルを中火で熱し、片面3分ずつ焼きます。",
        en: "Cut the pork tenderloin into 2 cm thick slices and season with salt. Heat the olive oil in a frying pan over medium heat and cook for 3 minutes on each side.",
        es: "Corta el solomillo de cerdo en medallones de 2 cm y sálalos. Calienta el aceite de oliva en una sartén a fuego medio y cocínalos 3 minutos por cada lado.",
      },
    },
    {
      key: "serve",
      text: {
        ja: "ブロッコリーと一緒に器に盛り、粒マスタードを添えます。",
        en: "Plate with the broccoli and add the wholegrain mustard on the side.",
        es: "Sírvelo con el brócoli y la mostaza en grano al lado.",
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
  ],
  substitutions: [],
};
