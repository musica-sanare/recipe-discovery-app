import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "boiled_egg_potato_salad",
  texts: {
    name: { ja: "ゆで卵とじゃがいものヨーグルトサラダ", en: "Boiled egg and potato salad with yogurt dressing", es: "Ensalada de huevo cocido y patata con aliño de yogur", fr: "Salade d'œufs durs et de pommes de terre, sauce au yaourt" },
    summary: {
      ja: "マヨネーズの代わりに無糖ヨーグルトで和えた、ゆで卵とじゃがいものサラダ。パンを添えます。",
      en: "Boiled eggs and potato dressed with unsweetened yogurt instead of mayonnaise, with bread.",
      es: "Huevos cocidos y patata aliñados con yogur sin azúcar en lugar de mayonesa, con pan.",
      fr: "Œufs durs et pomme de terre assaisonnés de yaourt sans sucre au lieu de mayonnaise, avec du pain.",
    },
  },
  cuisine: "western",
  goals: ["maintain"],
  mainProteinGroup: "egg",
  tags: ["breakfast"],
  minutes: 20,
  effort: 1,
  equipment: ["stove", "pot", "microwave"],
  servings: 1,
  ingredients: [
    { key: "egg", food: "egg", grams: 150, state: "boil", measure: { unit: "piece", quantity: 3 }, role: "main_protein", adjust: { kind: "count", unitGrams: 50, min: 2, max: 4 } },
    { key: "potato", food: "potato", grams: 200, state: "microwave", measure: { unit: "piece", quantity: 1.5 }, role: "vegetable" },
    { key: "yogurt", food: "yogurt_plain", grams: 60, state: "as_is", measure: { unit: "tbsp", quantity: 4 }, role: "seasoning" },
    { key: "onion", food: "onion", grams: 20, state: "raw", role: "vegetable" },
    { key: "salt", food: "salt", grams: 1, state: "as_is", measure: { unit: "pinch", quantity: 2 }, role: "seasoning" },
    { key: "pepper", food: "black_pepper", grams: 0.2, state: "as_is", measure: { unit: "pinch", quantity: 1 }, role: "seasoning" },
    { key: "lettuce", food: "lettuce", grams: 40, state: "raw", role: "vegetable" },
    { key: "bread", food: "bread", grams: 60, state: "as_is", measure: { unit: "slice", quantity: 1 }, role: "main_carb", adjust: { kind: "count", unitGrams: 60, min: 1, max: 3 } },
  ],
  sides: [
    { key: "bread", label: { ja: "パン", en: "Bread", es: "Pan", fr: "Pain" }, ingredients: ["bread"], solverMayRemove: true },
  ],
  steps: [
    {
      key: "eggs",
      text: {
        ja: "鍋に湯を沸かし、卵をそっと入れて中火で11分ゆでます。水にとって冷まし、殻をむきます。",
        en: "Bring a pot of water to a boil, gently add the eggs, and boil over medium heat for 11 minutes. Cool them in water and peel.",
        es: "Lleva a ebullición una olla con agua, añade los huevos con cuidado y cuécelos a fuego medio 11 minutos. Enfríalos en agua y pélalos.",
        fr: "Portez une casserole d'eau à ébullition, déposez-y délicatement les œufs et faites-les cuire 11 minutes à feu moyen. Refroidissez-les dans l'eau et écalez-les.",
      },
    },
    {
      key: "potato",
      text: {
        ja: "じゃがいもを洗って皮つきのままラップで包み、600Wで4〜5分、竹串がすっと通るまで加熱します。皮をむいて粗くつぶします。",
        en: "Wash the potato, wrap it in plastic wrap with the skin on, and heat at 600 W for 4–5 minutes until a skewer slides in easily. Peel and roughly mash.",
        es: "Lava la patata, envuélvela con piel en film y caliéntala a 600 W durante 4-5 minutos hasta que un palillo entre con facilidad. Pélala y cháfala un poco.",
        fr: "Lavez la pomme de terre, enveloppez-la dans du film alimentaire sans la peler et faites-la cuire 4 à 5 minutes à 600 W, jusqu'à ce qu'une brochette s'y enfonce facilement. Pelez-la et écrasez-la grossièrement.",
      },
    },
    {
      key: "mix",
      text: {
        ja: "玉ねぎはみじん切りにして水にさらし、水気を絞ります。じゃがいもに玉ねぎ、ヨーグルト、塩、こしょうを混ぜ、大きく切ったゆで卵を加えてさっくり和えます。",
        en: "Finely chop the onion, soak it in water, and squeeze it dry. Mix the potato with the onion, yogurt, salt, and pepper, then gently fold in the eggs cut into large pieces.",
        es: "Pica fino la cebolla, déjala en agua y escúrrela bien. Mezcla la patata con la cebolla, el yogur, la sal y la pimienta, y añade con cuidado los huevos cortados en trozos grandes.",
        fr: "Hachez finement l'oignon, faites-le tremper dans l'eau et pressez-le bien. Mélangez la pomme de terre avec l'oignon, le yaourt, le sel et le poivre, puis incorporez délicatement les œufs coupés en gros morceaux.",
      },
    },
    {
      key: "serve",
      text: {
        ja: "レタスを敷いた器に盛ります。",
        en: "Serve on a bed of lettuce.",
        es: "Sírvelo sobre una cama de lechuga.",
        fr: "Servez sur un lit de laitue.",
      },
    },
    {
      key: "bread",
      side: "bread",
      text: {
        ja: "パンを添えます。",
        en: "Serve with the bread.",
        es: "Acompáñalo con el pan.",
        fr: "Servez avec le pain.",
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
    {
      key: "steam",
      text: {
        ja: "加熱直後は蒸気でやけどしやすいので、ラップは奥から手前に向かって外してください。",
        en: "Steam can burn right after heating; peel the wrap away from you.",
        es: "El vapor puede quemar justo después de calentar; retira el film en dirección contraria a ti.",
        fr: "La vapeur peut brûler juste après la cuisson ; retirez le film en l'écartant de vous.",
      },
    },
  ],
  substitutions: [],
};
