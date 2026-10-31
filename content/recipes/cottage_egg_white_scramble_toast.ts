import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "cottage_egg_white_scramble_toast",
  texts: {
    name: { ja: "卵白とカッテージチーズのスクランブル トースト添え", en: "Egg white and cottage cheese scramble with toast", es: "Revuelto de claras y queso cottage con pan tostado", fr: "Brouillade de blancs d'œufs au cottage cheese et pain grillé" },
    summary: {
      ja: "卵白と卵をほうれん草と炒め、カッテージチーズを加えてやわらかい炒り卵にします。トマトとトーストを添えます。",
      en: "Egg whites and an egg scrambled with spinach and finished with cottage cheese, with tomato and toast.",
      es: "Claras y un huevo revueltos con espinacas y terminados con queso cottage, con tomate y pan tostado.",
      fr: "Blancs d'œufs et un œuf brouillés avec des épinards, terminés au cottage cheese, avec de la tomate et du pain grillé.",
    },
  },
  cuisine: "western",
  goals: ["cut"],
  mainProteinGroup: "egg",
  tags: ["breakfast"],
  minutes: 10,
  effort: 1,
  equipment: ["stove", "frying_pan", "oven_toaster"],
  servings: 1,
  ingredients: [
    {
      key: "egg_white",
      food: "egg_white",
      grams: 200,
      state: "raw",
      cooking: "scramble",
      role: "main_protein",
      adjust: { kind: "grams", min: 150, max: 250, step: 50 },
      note: {
        ja: "成分表に炒めた卵白の値がないため、生の値で計算しています。",
        en: "The tables have no value for scrambled egg white, so the raw value is used.",
        es: "Las tablas no tienen un valor para la clara revuelta, así que se usa el valor en crudo.",
        fr: "Les tables n'ont pas de valeur pour le blanc d'œuf brouillé ; la valeur à l'état cru est donc utilisée.",
      },
    },
    { key: "egg", food: "egg", grams: 50, state: "scramble", measure: { unit: "piece", quantity: 1 }, role: "other" },
    { key: "oil", food: "olive_oil", grams: 2, state: "as_is", measure: { unit: "tsp", quantity: 0.5 }, role: "fat", includedIn: "egg" },
    { key: "cottage", food: "cottage_cheese", grams: 60, state: "as_is", measure: { unit: "tbsp", quantity: 4 }, role: "other" },
    {
      key: "spinach",
      food: "spinach",
      grams: 60,
      state: "raw",
      cooking: "saute",
      role: "vegetable",
      note: {
        ja: "成分表に油をほとんど使わずに炒めたほうれん草の値がないため、生の値で計算しています。",
        en: "The tables have no value for spinach cooked with very little oil, so the raw value is used.",
        es: "Las tablas no tienen un valor para las espinacas cocinadas con muy poco aceite, así que se usa el valor en crudo.",
        fr: "Les tables n'ont pas de valeur pour les épinards cuits avec très peu d'huile ; la valeur à l'état cru est donc utilisée.",
      },
    },
    { key: "tomato", food: "tomato", grams: 80, state: "raw", measure: { unit: "piece", quantity: 0.5 }, role: "vegetable" },
    { key: "bread", food: "bread", grams: 90, state: "as_is", measure: { unit: "slice", quantity: 1.5 }, role: "main_carb", adjust: { kind: "grams", min: 60, max: 120, step: 30 } },
  ],
  sides: [
    { key: "toast", label: { ja: "トースト", en: "Toast", es: "Pan tostado", fr: "Pain grillé" }, ingredients: ["bread"], solverMayRemove: true },
  ],
  steps: [
    {
      key: "prep",
      text: {
        ja: "ほうれん草を3cm長さに切ります。卵白と卵をボウルでよく溶きます。トマトはくし形に切ります。",
        en: "Cut the spinach into 3 cm lengths. Beat the egg whites and egg well in a bowl. Cut the tomato into wedges.",
        es: "Corta las espinacas en trozos de 3 cm. Bate bien las claras y el huevo en un bol. Corta el tomate en gajos.",
        fr: "Coupez les épinards en tronçons de 3 cm. Battez bien les blancs d'œufs et l'œuf dans un bol. Coupez la tomate en quartiers.",
      },
    },
    {
      key: "scramble",
      text: {
        ja: "フライパンにオリーブ油を中火で熱し、ほうれん草をしんなりするまで炒めます。卵液を流し入れ、大きく混ぜながら固まるまで炒め、火を止めてカッテージチーズを混ぜます。",
        en: "Heat the olive oil in a frying pan over medium heat and stir-fry the spinach until wilted. Pour in the egg mixture, stir in large strokes until set, turn off the heat, and fold in the cottage cheese.",
        es: "Calienta el aceite de oliva en una sartén a fuego medio y saltea las espinacas hasta que se ablanden. Vierte el huevo batido, remueve con movimientos amplios hasta que cuaje, apaga el fuego y mezcla el queso cottage.",
        fr: "Faites chauffer l'huile d'olive dans une poêle à feu moyen et faites sauter les épinards jusqu'à ce qu'ils tombent. Versez les œufs battus, remuez à grands gestes jusqu'à ce qu'ils soient pris, éteignez le feu et incorporez le cottage cheese.",
      },
    },
    {
      key: "serve",
      text: {
        ja: "トマトと一緒に器に盛ります。",
        en: "Plate it with the tomato.",
        es: "Sírvelo con el tomate.",
        fr: "Dressez avec la tomate.",
      },
    },
    {
      key: "toast",
      side: "toast",
      text: {
        ja: "パンをトースターで焼いて添えます。",
        en: "Toast the bread in the toaster oven and serve it alongside.",
        es: "Tuesta el pan en el horno tostador y sírvelo al lado.",
        fr: "Faites griller le pain au four grille-pain et servez-le à côté.",
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
