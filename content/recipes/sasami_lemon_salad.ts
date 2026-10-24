import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "sasami_lemon_salad",
  texts: {
    name: { ja: "ささみと野菜のゆでサラダ レモンじょうゆ", en: "Poached chicken tenderloin salad with lemon soy sauce", es: "Ensalada de solomillo de pollo hervido con salsa de soja y limón" },
    summary: {
      ja: "ゆでたささみとブロッコリーを、レタスとトマトにのせてレモンじょうゆをかけます。ご飯を添えます。",
      en: "Poached chicken tenderloins and broccoli on lettuce and tomato with lemon soy sauce, with rice.",
      es: "Solomillos de pollo y brócoli hervidos sobre lechuga y tomate con salsa de soja y limón, con arroz.",
    },
  },
  cuisine: "japanese",
  goals: ["cut"],
  mainProteinGroup: "chicken",
  tags: [],
  minutes: 15,
  effort: 1,
  equipment: ["stove", "pot"],
  servings: 1,
  ingredients: [
    {
      key: "chicken",
      food: "chicken_sasami",
      grams: 180,
      state: "boil",
      measure: { unit: "piece", quantity: 4 },
      role: "main_protein",
      adjust: { kind: "grams", min: 120, max: 240, step: 20 },
      note: {
        ja: "筋を除いた重さです（1本約45g）。",
        en: "Weight with the tendons removed (about 45 g each).",
        es: "Peso sin los tendones (unos 45 g cada uno).",
      },
    },
    { key: "broccoli", food: "broccoli", grams: 80, state: "boil", role: "vegetable" },
    { key: "lettuce", food: "lettuce", grams: 60, state: "raw", role: "vegetable" },
    { key: "tomato", food: "tomato", grams: 80, state: "raw", measure: { unit: "piece", quantity: 0.5 }, role: "vegetable" },
    { key: "soy_sauce", food: "soy_sauce", grams: 12, state: "as_is", measure: { unit: "tsp", quantity: 2 }, role: "seasoning", linkedTo: "chicken" },
    { key: "lemon_juice", food: "lemon_juice", grams: 10, state: "as_is", measure: { unit: "tsp", quantity: 2 }, role: "seasoning", linkedTo: "chicken" },
    { key: "sesame_oil", food: "sesame_oil", grams: 2, state: "as_is", role: "fat" },
    { key: "rice", food: "rice_cooked", grams: 150, state: "as_is", role: "main_carb", adjust: { kind: "grams", min: 100, max: 300, step: 10 } },
  ],
  sides: [
    { key: "rice", label: { ja: "ご飯", en: "Rice", es: "Arroz" }, ingredients: ["rice"], solverMayRemove: true },
  ],
  steps: [
    {
      key: "boil",
      text: {
        ja: "鍋に湯を沸かし、小房に分けたブロッコリーを2分ゆでて取り出します。弱火にしてささみを入れ、ふたをして6分ゆでます。火を止めてそのまま5分置きます。",
        en: "Bring a pot of water to a boil, cook the broccoli florets for 2 minutes, and take them out. Turn to low heat, add the chicken tenderloins, cover, and cook for 6 minutes. Turn off the heat and leave them in the water for 5 minutes.",
        es: "Lleva a ebullición una olla con agua, cuece los ramilletes de brócoli 2 minutos y sácalos. Baja a fuego bajo, añade los solomillos de pollo, tapa y cuece 6 minutos. Apaga el fuego y déjalos en el agua 5 minutos.",
      },
    },
    {
      key: "check",
      text: {
        ja: "ささみを1本切って中までピンク色がないことを確かめ、手で裂きます。",
        en: "Cut one tenderloin to check that no pink remains inside, then shred them by hand.",
        es: "Corta un solomillo para comprobar que no queda nada rosado por dentro y desmenúzalos con las manos.",
      },
    },
    {
      key: "serve",
      text: {
        ja: "ちぎったレタスとくし形のトマトを器に盛り、ささみとブロッコリーをのせます。しょうゆ、レモン汁、ごま油を混ぜてかけます。",
        en: "Arrange the torn lettuce and tomato wedges on a plate and top with the chicken and broccoli. Mix the soy sauce, lemon juice, and sesame oil and pour over.",
        es: "Coloca la lechuga troceada y los gajos de tomate en un plato y cubre con el pollo y el brócoli. Mezcla la salsa de soja, el zumo de limón y el aceite de sésamo y viértelo por encima.",
      },
    },
  ],
  safetyNotes: [
    {
      key: "chicken_doneness",
      text: {
        ja: "鶏肉は中心まで火を通してください。切り口にピンク色が残っていれば、さらに加熱します。",
        en: "Cook chicken through. If any pink remains when you cut it, cook it longer.",
        es: "Cocina bien el pollo. Si queda algo rosado al cortarlo, cocínalo más tiempo.",
      },
    },
  ],
  substitutions: [
    {
      key: "breast",
      ingredient: "chicken",
      food: "chicken_breast",
      state: "raw",
      cooking: "boil",
      ratio: 1,
      note: {
        ja: "ささみの代わりに鶏むね肉（皮なし）でも作れます。厚い部分は半分に切ってゆでてください。",
        en: "Skinless chicken breast works instead of tenderloins; halve thick pieces before cooking.",
        es: "Puedes usar pechuga de pollo sin piel en lugar de solomillos; corta por la mitad las piezas gruesas antes de cocerlas.",
      },
    },
  ],
};
