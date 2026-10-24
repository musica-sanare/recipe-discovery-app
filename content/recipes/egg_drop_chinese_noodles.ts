import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "egg_drop_chinese_noodles",
  texts: {
    name: { ja: "かき玉の中華そば", en: "Egg drop noodle soup", es: "Sopa de fideos con huevo" },
    summary: {
      ja: "しょうゆ味のスープに溶き卵を流し入れて、中華めんともやしにかけます。",
      en: "Beaten eggs swirled into a soy-based broth and poured over wheat noodles and bean sprouts.",
      es: "Huevos batidos vertidos en un caldo de soja y servidos sobre fideos de trigo y brotes de soja.",
    },
  },
  cuisine: "chinese",
  goals: ["maintain"],
  mainProteinGroup: "egg",
  tags: [],
  minutes: 15,
  effort: 2,
  equipment: ["stove", "pot"],
  servings: 1,
  ingredients: [
    {
      key: "egg",
      food: "egg",
      grams: 150,
      state: "boil",
      cooking: "simmer",
      measure: { unit: "piece", quantity: 3 },
      role: "main_protein",
      adjust: { kind: "count", unitGrams: 50, min: 2, max: 4 },
      note: {
        ja: "成分表にスープで加熱した溶き卵の値がないため、ゆで卵の値で計算しています。",
        en: "The tables have no value for egg cooked in soup, so the boiled-egg value is used.",
        es: "Las tablas no tienen un valor para huevo cocinado en sopa, así que se usa el valor del huevo cocido.",
      },
    },
    { key: "noodles", food: "chinese_noodles", grams: 120, state: "boil", measure: { unit: "piece", quantity: 1 }, role: "main_carb", adjust: { kind: "grams", min: 100, max: 200, step: 20 } },
    { key: "bean_sprouts", food: "bean_sprouts", grams: 100, state: "boil", role: "vegetable" },
    { key: "soy_sauce", food: "soy_sauce", grams: 18, state: "as_is", measure: { unit: "tbsp", quantity: 1 }, role: "seasoning" },
    { key: "sake", food: "cooking_sake", grams: 15, state: "as_is", measure: { unit: "tbsp", quantity: 1 }, role: "seasoning" },
    { key: "ginger", food: "ginger", grams: 3, state: "raw", role: "seasoning" },
    { key: "starch", food: "potato_starch", grams: 3, state: "as_is", measure: { unit: "tsp", quantity: 1 }, role: "seasoning" },
    { key: "sesame_oil", food: "sesame_oil", grams: 3, state: "as_is", role: "fat" },
    { key: "green_onion", food: "green_onion", grams: 5, state: "raw", role: "vegetable" },
  ],
  sides: [],
  steps: [
    {
      key: "noodles",
      text: {
        ja: "たっぷりの湯で中華めんを袋の表示どおりにゆで、最後の1分でもやしを加えます。湯を切って器に盛ります。",
        en: "Boil the noodles in plenty of water as directed on the package, adding the bean sprouts for the last minute. Drain and transfer to a bowl.",
        es: "Cuece los fideos en abundante agua según el envase y añade los brotes de soja en el último minuto. Escúrrelos y pásalos a un cuenco.",
      },
    },
    {
      key: "broth",
      text: {
        ja: "別の鍋に水350mL、しょうゆ、料理酒、すりおろしたしょうがを入れて煮立て、同量の水で溶いた片栗粉でとろみをつけます。",
        en: "In another pot, bring 350 mL of water, the soy sauce, cooking sake, and grated ginger to a boil, then thicken with the potato starch mixed with the same amount of water.",
        es: "En otra olla, lleva a ebullición 350 mL de agua, la salsa de soja, el sake de cocina y el jengibre rallado, y espesa con la fécula disuelta en la misma cantidad de agua.",
      },
    },
    {
      key: "egg",
      text: {
        ja: "スープが煮立っているところに溶き卵を少しずつ回し入れ、ふんわり固まるまで30秒ほど加熱します。",
        en: "With the broth at a boil, drizzle in the beaten eggs a little at a time and cook for about 30 seconds until they set into soft ribbons.",
        es: "Con el caldo hirviendo, vierte poco a poco los huevos batidos y cocina unos 30 segundos hasta que cuajen en hebras suaves.",
      },
    },
    {
      key: "serve",
      text: {
        ja: "めんにスープをかけ、ごま油をたらして小口切りの青ねぎを散らします。",
        en: "Pour the broth over the noodles, drizzle with sesame oil, and scatter the thinly sliced green onion.",
        es: "Vierte el caldo sobre los fideos, rocía con aceite de sésamo y esparce la cebolleta en rodajas finas.",
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
      },
    },
  ],
  substitutions: [],
};
