import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "pork_shabu_salad",
  texts: {
    name: { ja: "豚もも肉の冷しゃぶサラダ", en: "Chilled pork shabu-shabu salad", es: "Ensalada fría de cerdo shabu-shabu" },
    summary: {
      ja: "さっとゆでた豚もも肉を、レタスとトマトにのせて酢じょうゆのたれでいただきます。",
      en: "Quickly boiled lean pork over lettuce and tomato with a soy and vinegar dressing.",
      es: "Cerdo magro escaldado sobre lechuga y tomate con un aliño de soja y vinagre.",
    },
  },
  cuisine: "japanese",
  goals: ["cut"],
  tags: ["quick"],
  minutes: 15,
  effort: 1,
  equipment: ["stove", "pot"],
  servings: 1,
  ingredients: [
    { key: "pork", food: "pork_leg", grams: 150, state: "boil", role: "main_protein", adjust: { min: 120, max: 220, step: 10 } },
    { key: "lettuce", food: "lettuce", grams: 60, state: "raw", role: "vegetable" },
    { key: "tomato", food: "tomato", grams: 100, state: "raw", measure: { unit: "piece", quantity: 0.5 }, role: "vegetable" },
    { key: "green_onion", food: "green_onion", grams: 5, state: "raw", role: "vegetable" },
    { key: "vinegar", food: "rice_vinegar", grams: 10, state: "as_is", measure: { unit: "tsp", quantity: 2 }, role: "seasoning" },
    { key: "soy_sauce", food: "soy_sauce", grams: 10, state: "as_is", measure: { unit: "tsp", quantity: 2 }, role: "seasoning" },
    { key: "sesame_oil", food: "sesame_oil", grams: 4, state: "as_is", measure: { unit: "tsp", quantity: 1 }, role: "fat" },
    { key: "sugar", food: "sugar", grams: 2, state: "as_is", role: "seasoning" },
    { key: "rice", food: "rice_cooked", grams: 150, state: "as_is", role: "main_carb", adjust: { min: 0, max: 250, step: 10 } },
  ],
  steps: [
    {
      ja: "酢、しょうゆ、ごま油、砂糖を混ぜてたれを作ります。レタスはちぎり、トマトはくし形に切ります。",
      en: "Mix the vinegar, soy sauce, sesame oil, and sugar for the dressing. Tear the lettuce and cut the tomato into wedges.",
      es: "Mezcla el vinagre, la salsa de soja, el aceite de sésamo y el azúcar para el aliño. Trocea la lechuga y corta el tomate en gajos.",
    },
    {
      ja: "鍋に湯を沸かして火を弱め、薄切りの豚肉を1枚ずつ入れて、色が完全に変わるまでゆでます。",
      en: "Bring water to a boil, lower the heat, and add the thinly sliced pork one piece at a time. Cook until it has completely changed color.",
      es: "Lleva agua a ebullición, baja el fuego y añade las lonchas finas de cerdo de una en una. Cuécelas hasta que cambien de color por completo.",
    },
    {
      ja: "ざるに上げて水気を切り、粗熱を取ります。",
      en: "Drain in a colander and let cool slightly.",
      es: "Escúrrelas en un colador y déjalas templar.",
    },
    {
      ja: "野菜の上に豚肉をのせ、たれをかけて青ねぎを散らします。ご飯を添えます。",
      en: "Arrange the pork over the vegetables, pour over the dressing, and scatter the green onion. Serve with rice.",
      es: "Coloca el cerdo sobre las verduras, vierte el aliño y esparce la cebolleta. Sírvelo con arroz.",
    },
  ],
  safetyNotes: [
    {
      ja: "豚肉はピンク色が残らないよう、完全に色が変わるまで加熱してください。",
      en: "Cook the pork until no pink remains.",
      es: "Cocina el cerdo hasta que no quede nada rosado.",
    },
  ],
  substitutions: [],
};
