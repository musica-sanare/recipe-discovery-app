import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "chicken_thigh_karaage",
  texts: {
    name: { ja: "皮なし鶏ももの唐揚げ", en: "Skinless chicken thigh karaage", es: "Karaage de muslo de pollo sin piel" },
    summary: {
      ja: "皮を除いた鶏もも肉にから揚げ粉をまぶして揚げます。揚げ物のため、栄養値は推定の幅が大きくなります。",
      en: "Skinless chicken thigh coated in karaage mix and deep-fried. As a fried dish, its nutrition estimate is less certain.",
      es: "Muslo de pollo sin piel rebozado con mezcla para karaage y frito. Al ser una fritura, su estimación nutricional es menos precisa.",
    },
  },
  cuisine: "japanese",
  goals: ["maintain", "bulk"],
  tags: ["fried"],
  minutes: 30,
  effort: 3,
  equipment: ["stove", "deep_pan"],
  servings: 1,
  ingredients: [
    { key: "chicken", food: "chicken_thigh", grams: 200, state: "karaage", role: "main_protein", adjust: { min: 150, max: 260, step: 10 } },
    {
      key: "coating",
      food: "karaage_flour",
      grams: 31,
      state: "as_is",
      measure: { unit: "tbsp", quantity: 3.5 },
      role: "coating",
      includedIn: "chicken",
    },
    {
      key: "frying_oil",
      food: "vegetable_oil",
      grams: 500,
      state: "as_is",
      role: "fat",
      includedIn: "chicken",
      note: {
        ja: "揚げ油です。吸収される分は鶏肉の揚げた後の値に含まれています。",
        en: "Oil for deep-frying. The absorbed part is included in the fried chicken value.",
        es: "Aceite para freír. La parte absorbida está incluida en el valor del pollo frito.",
      },
    },
    { key: "lemon", food: "lemon_juice", grams: 5, state: "as_is", measure: { unit: "tsp", quantity: 1 }, role: "seasoning" },
    { key: "cabbage", food: "cabbage", grams: 60, state: "raw", role: "vegetable" },
    { key: "rice", food: "rice_cooked", grams: 180, state: "as_is", role: "main_carb", adjust: { min: 0, max: 300, step: 10 } },
  ],
  steps: [
    {
      ja: "鶏もも肉の余分な脂を取り除き、25gほどのひと口大に切ります。",
      en: "Trim excess fat from the chicken thigh and cut it into bite-size pieces of about 25 g.",
      es: "Retira la grasa sobrante del muslo y córtalo en trozos de unos 25 g.",
    },
    {
      ja: "から揚げ粉をまんべんなくまぶします。",
      en: "Coat the pieces evenly with the karaage mix.",
      es: "Reboza los trozos de manera uniforme con la mezcla para karaage.",
    },
    {
      ja: "揚げ油を170℃に熱し、鶏肉を4〜5分揚げて油を切ります。",
      en: "Heat the oil to 170 °C and deep-fry the chicken for 4 to 5 minutes, then drain.",
      es: "Calienta el aceite a 170 °C, fríe el pollo de 4 a 5 minutos y escúrrelo.",
    },
    {
      ja: "レモン果汁をかけ、せん切りキャベツとご飯を添えます。",
      en: "Squeeze over the lemon juice and serve with shredded cabbage and rice.",
      es: "Rocía con el zumo de limón y sírvelo con repollo en juliana y arroz.",
    },
  ],
  safetyNotes: [
    {
      ja: "揚げ油から目を離さないでください。高温の油は発火やけがの原因になります。水気をよく拭いてから入れます。",
      en: "Never leave hot oil unattended; it can catch fire or cause burns. Pat ingredients dry before adding them.",
      es: "No dejes nunca el aceite caliente sin vigilancia: puede prenderse o causar quemaduras. Seca bien los ingredientes antes de echarlos.",
    },
    {
      ja: "鶏肉は中心まで火を通してください。大きめの1個を切って、赤みがないことを確認します。",
      en: "Cook chicken all the way through. Cut open the largest piece to check that it is no longer pink.",
      es: "Cocina el pollo completamente. Abre el trozo más grande para comprobar que ya no esté rosado.",
    },
  ],
  substitutions: [],
};
