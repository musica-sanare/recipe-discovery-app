import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "tortilla_espanola",
  texts: {
    name: { ja: "トルティージャ（スペイン風オムレツ）", en: "Spanish omelette (tortilla española)", es: "Tortilla española" },
    summary: {
      ja: "じゃがいもと玉ねぎをたっぷりのオリーブ油で揚げ煮にし、卵で厚く焼き固めるスペインの定番料理です。油の吸収量が分からないため、栄養値は推定の幅が大きくなります。",
      en: "A Spanish classic: potatoes and onion gently fried in plenty of olive oil and set in a thick egg omelette. The amount of oil absorbed is unknown, so the nutrition estimate is very uncertain.",
      es: "Un clásico español: patatas y cebolla pochadas en abundante aceite de oliva y cuajadas en una tortilla gruesa. No se sabe cuánto aceite se absorbe, así que la estimación nutricional es muy incierta.",
    },
  },
  cuisine: "spanish",
  goals: ["maintain"],
  tags: ["fried"],
  minutes: 40,
  effort: 3,
  equipment: ["stove", "frying_pan"],
  servings: 2,
  ingredients: [
    {
      key: "potato",
      food: "potato",
      grams: 300,
      state: "deep_fry",
      measure: { unit: "piece", quantity: 2 },
      role: "main_carb",
      note: {
        ja: "成分表の素揚げの値を使っています。低温でじっくり揚げ煮にするこの料理では、実際の吸油量はもっと多い可能性があります。",
        en: "Uses the table value for plain deep-fried potato. Slow frying at a lower temperature, as in this dish, may absorb more oil.",
        es: "Se usa el valor de las tablas para la patata frita sin rebozar. Freírla despacio a menor temperatura, como en este plato, puede absorber más aceite.",
      },
    },
    { key: "onion", food: "onion", grams: 100, state: "stir_fry", measure: { unit: "piece", quantity: 0.5 }, role: "vegetable" },
    {
      key: "frying_oil",
      food: "olive_oil",
      grams: 250,
      state: "as_is",
      role: "fat",
      includedIn: "potato",
      note: {
        ja: "揚げ煮用の油で、使った後は取り除きます。吸収される分はじゃがいもと玉ねぎの値に含まれています。",
        en: "Oil for slow frying, drained afterwards. The absorbed part is included in the potato and onion values.",
        es: "Aceite para pochar, que se escurre después. La parte absorbida está incluida en los valores de la patata y la cebolla.",
      },
    },
    { key: "egg", food: "egg", grams: 250, state: "scramble", measure: { unit: "piece", quantity: 5 }, role: "main_protein" },
    { key: "oil_pan", food: "olive_oil", grams: 8, state: "as_is", measure: { unit: "tsp", quantity: 2 }, role: "fat", includedIn: "egg" },
    { key: "salt", food: "salt", grams: 3, state: "as_is", measure: { unit: "tsp", quantity: 0.5 }, role: "seasoning" },
  ],
  steps: [
    {
      ja: "じゃがいもを薄いいちょう切りに、玉ねぎを薄切りにします。",
      en: "Thinly slice the potatoes into quarter rounds and thinly slice the onion.",
      es: "Corta las patatas en láminas finas de cuarto de luna y la cebolla en juliana.",
    },
    {
      ja: "フライパンにオリーブ油を入れて弱めの中火にかけ、じゃがいもと玉ねぎを15〜20分、やわらかくなるまで揚げ煮にします。ざるに上げて油を切ります。",
      en: "Heat the olive oil in a frying pan over medium-low heat and gently fry the potatoes and onion for 15 to 20 minutes until tender. Drain in a colander.",
      es: "Calienta el aceite en una sartén a fuego medio-bajo y pocha las patatas y la cebolla de 15 a 20 minutos hasta que estén tiernas. Escúrrelas en un colador.",
    },
    {
      ja: "卵を溶いて塩を加え、じゃがいもと玉ねぎを混ぜて5分置きます。",
      en: "Beat the eggs with the salt, mix in the potatoes and onion, and leave for 5 minutes.",
      es: "Bate los huevos con la sal, mezcla las patatas y la cebolla y deja reposar 5 minutos.",
    },
    {
      ja: "フライパンを拭いて焼き用のオリーブ油を熱し、卵液を流し入れて弱火で5分焼きます。皿を使って裏返し、さらに3〜4分、中まで固まるまで焼きます。",
      en: "Wipe the pan, heat the oil for cooking, pour in the mixture, and cook over low heat for 5 minutes. Flip it with a plate and cook for 3 to 4 more minutes until set in the middle.",
      es: "Limpia la sartén, calienta el aceite para cuajar, vierte la mezcla y cocina a fuego bajo 5 minutos. Dale la vuelta con un plato y cocina de 3 a 4 minutos más hasta que cuaje por dentro.",
    },
  ],
  safetyNotes: [
    {
      ja: "大量の油を使うので、火から離れないでください。裏返すときは熱い油や卵液がこぼれないよう注意します。",
      en: "This uses a lot of oil; stay at the stove. Take care not to spill hot oil or egg when flipping.",
      es: "Se usa mucho aceite: no te alejes del fuego. Ten cuidado de no derramar aceite caliente ni huevo al darle la vuelta.",
    },
    {
      ja: "中心まで卵が固まるまで加熱してください。半熟に仕上げる場合も、生の卵が残らないようにします。",
      en: "Cook until the egg is set in the middle; even a softer tortilla should not contain raw egg.",
      es: "Cocina hasta que el huevo cuaje en el centro; incluso una tortilla jugosa no debe tener huevo crudo.",
    },
  ],
  substitutions: [],
};
