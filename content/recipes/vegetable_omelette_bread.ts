import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "vegetable_omelette_bread",
  texts: {
    name: { ja: "野菜たっぷりオムレツ", en: "Vegetable-packed omelette", es: "Tortilla francesa con muchas verduras", fr: "Omelette garnie de légumes" },
    summary: {
      ja: "ゆでたほうれん草と玉ねぎを卵で包み、トマトとパンを添えた朝食向きの一皿です。",
      en: "Blanched spinach and onion folded into eggs, with tomato and bread: a breakfast plate.",
      es: "Espinacas y cebolla escaldadas envueltas en huevo, con tomate y pan: un plato de desayuno.",
      fr: "Épinards et oignon blanchis enveloppés dans des œufs, avec de la tomate et du pain : une assiette de petit-déjeuner.",
    },
  },
  cuisine: "western",
  goals: ["maintain"],
  mainProteinGroup: "egg",
  tags: ["breakfast"],
  minutes: 15,
  effort: 2,
  equipment: ["stove", "frying_pan", "pot"],
  servings: 1,
  ingredients: [
    { key: "egg", food: "egg", grams: 100, state: "scramble", measure: { unit: "piece", quantity: 2 }, role: "main_protein", adjust: { kind: "count", unitGrams: 50, min: 1, max: 3 } },
    { key: "oil_egg", food: "vegetable_oil", grams: 5, state: "as_is", role: "fat", linkedTo: "egg", includedIn: "egg" },
    {
      key: "egg_white",
      food: "egg_white",
      grams: 99,
      state: "raw",
      cooking: "scramble",
      measure: { unit: "piece", quantity: 3 },
      role: "main_protein",
      adjust: { kind: "count", unitGrams: 33, min: 2, max: 6 },
      note: {
        ja: "成分表に加熱した卵白の値がないため、生の値で計算しています。残った黄身は別の料理に使えます。市販の液卵白でも作れます。",
        en: "The tables have no value for cooked egg white, so the raw value is used. Use the leftover yolks in another dish, or use liquid egg white from a carton.",
        es: "Las tablas no tienen un valor para la clara cocinada, así que se usa el valor en crudo. Usa las yemas que sobren en otro plato, o usa clara de huevo líquida envasada.",
        fr: "Les tables n'ont pas de valeur pour le blanc d'œuf cuit ; la valeur à l'état cru est donc utilisée. Utilisez les jaunes restants dans un autre plat, ou prenez du blanc d'œuf liquide en brique.",
      },
    },
    { key: "oil_egg_white", food: "vegetable_oil", grams: 2, state: "as_is", role: "fat", linkedTo: "egg_white" },
    { key: "spinach", food: "spinach", grams: 60, state: "boil", role: "vegetable" },
    { key: "onion", food: "onion", grams: 40, state: "boil", role: "vegetable" },
    { key: "salt", food: "salt", grams: 1, state: "as_is", measure: { unit: "pinch", quantity: 2 }, role: "seasoning", linkedTo: "egg" },
    { key: "pepper", food: "black_pepper", grams: 0.2, state: "as_is", measure: { unit: "pinch", quantity: 1 }, role: "seasoning", linkedTo: "egg" },
    { key: "tomato", food: "tomato", grams: 80, state: "raw", measure: { unit: "piece", quantity: 0.5 }, role: "vegetable" },
    { key: "bread", food: "bread", grams: 120, state: "as_is", measure: { unit: "slice", quantity: 2 }, role: "main_carb", adjust: { kind: "count", unitGrams: 60, min: 1, max: 3 } },
  ],
  sides: [
    { key: "bread", label: { ja: "パン", en: "Bread", es: "Pan", fr: "Pain" }, ingredients: ["bread"], solverMayRemove: true },
  ],
  steps: [
    {
      key: "prep",
      text: {
        ja: "ほうれん草を3cm長さに切り、玉ねぎは薄切りにします。卵と卵白に塩とこしょうを加えて一緒に溶きほぐします。",
        en: "Cut the spinach into 3 cm lengths and thinly slice the onion. Beat the eggs and egg whites together with the salt and pepper.",
        es: "Corta las espinacas en trozos de 3 cm y la cebolla en láminas finas. Bate los huevos y las claras juntos con la sal y la pimienta.",
        fr: "Coupez les épinards en tronçons de 3 cm et émincez finement l'oignon. Battez ensemble les œufs et les blancs d'œufs avec le sel et le poivre.",
      },
    },
    {
      key: "vegetables",
      text: {
        ja: "鍋に湯を沸かし、玉ねぎを2分、ほうれん草を加えて1分ゆでます。水気をよく切ります。",
        en: "Bring a pot of water to a boil and cook the onion for 2 minutes, then add the spinach for 1 minute. Drain well.",
        es: "Lleva a ebullición una olla con agua y cuece la cebolla 2 minutos; añade las espinacas 1 minuto. Escúrrelas bien.",
        fr: "Portez une casserole d'eau à ébullition et faites cuire l'oignon 2 minutes, puis ajoutez les épinards pour 1 minute. Égouttez bien.",
      },
    },
    {
      key: "omelette",
      text: {
        ja: "フライパンに卵用と卵白用の油を中火で熱して卵液を流し入れ、大きく混ぜて半熟になったら野菜をのせ、半分に折って白身まで固まるまで焼きます。",
        en: "Heat the oil for the eggs and egg whites in a frying pan over medium heat, pour in the egg mixture, and stir in large curds; when half set, add the vegetables, fold in half, and cook until the whites are set.",
        es: "Calienta el aceite de los huevos y las claras en una sartén a fuego medio, vierte la mezcla y remueve en grumos grandes; cuando esté a medio cuajar, pon las verduras, dobla por la mitad y cocina hasta que cuajen las claras.",
        fr: "Faites chauffer l'huile des œufs dans une poêle à feu moyen, versez les œufs battus et remuez en gros morceaux ; quand ils sont à moitié pris, ajoutez les légumes, repliez en deux et faites cuire jusqu'à ce que les blancs soient pris.",
      },
    },
    {
      key: "serve",
      text: {
        ja: "くし形に切ったトマトと一緒に器に盛ります。",
        en: "Plate with the tomato cut into wedges.",
        es: "Sírvelo con el tomate cortado en gajos.",
        fr: "Dressez avec la tomate coupée en quartiers.",
      },
    },
    {
      key: "bread",
      side: "bread",
      text: {
        ja: "パンをトーストして添えます。",
        en: "Toast the bread and serve it alongside.",
        es: "Tuesta el pan y sírvelo al lado.",
        fr: "Faites griller le pain et servez-le à côté.",
      },
    },
  ],
  safetyNotes: [
    {
      key: "egg_set",
      text: {
        ja: "卵は固まるまで加熱してください。",
        en: "Cook the eggs until set.",
        es: "Cocina los huevos hasta que cuajen.",
        fr: "Faites cuire les œufs jusqu'à ce qu'ils soient pris.",
      },
    },
  ],
  substitutions: [],
};
