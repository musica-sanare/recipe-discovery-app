import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "soft_egg_oatmeal_bowl",
  texts: {
    name: { ja: "半熟卵のオートミール雑炊", en: "Savory oatmeal with soft eggs", es: "Avena salada con huevos tiernos" },
    summary: {
      ja: "電子レンジだけで作る和風の雑炊。オートミールとほうれん草に卵を落として加熱します。",
      en: "A Japanese-style savory porridge made in the microwave: oats and spinach with eggs cooked on top.",
      es: "Una gacha salada al estilo japonés hecha en el microondas: avena y espinacas con huevos cocinados encima.",
    },
  },
  cuisine: "japanese",
  goals: ["maintain"],
  mainProteinGroup: "egg",
  tags: ["breakfast"],
  minutes: 8,
  effort: 1,
  equipment: ["microwave"],
  servings: 1,
  ingredients: [
    {
      key: "egg",
      food: "egg",
      grams: 150,
      state: "poach",
      cooking: "microwave",
      measure: { unit: "piece", quantity: 3 },
      role: "main_protein",
      adjust: { kind: "count", unitGrams: 50, min: 2, max: 4 },
      note: {
        ja: "成分表に電子レンジで加熱した卵の値がないため、ポーチドエッグの値で計算しています。",
        en: "The tables have no value for microwaved eggs, so the poached-egg value is used.",
        es: "Las tablas no tienen un valor para huevos al microondas, así que se usa el valor del huevo escalfado.",
      },
    },
    { key: "oatmeal", food: "oatmeal", grams: 40, state: "as_is", role: "main_carb", adjust: { kind: "grams", min: 30, max: 80, step: 10 } },
    { key: "spinach", food: "spinach", grams: 50, state: "raw", cooking: "microwave", role: "vegetable" },
    { key: "soy_sauce", food: "soy_sauce", grams: 6, state: "as_is", measure: { unit: "tsp", quantity: 1 }, role: "seasoning", linkedTo: "oatmeal" },
    { key: "green_onion", food: "green_onion", grams: 5, state: "raw", role: "vegetable" },
  ],
  sides: [],
  steps: [
    {
      key: "oats",
      text: {
        ja: "深めの耐熱どんぶりにオートミール、3cm長さに切ったほうれん草、水150mL、しょうゆを入れて混ぜ、ラップをせずに600Wで1分30秒加熱します。",
        en: "Put the oats, the spinach cut into 3 cm lengths, 150 mL of water, and the soy sauce in a deep microwave-safe bowl, stir, and heat uncovered at 600 W for 1 minute 30 seconds.",
        es: "Pon la avena, las espinacas cortadas en trozos de 3 cm, 150 mL de agua y la salsa de soja en un cuenco hondo apto para microondas, remueve y calienta sin tapar a 600 W durante 1 minuto y 30 segundos.",
      },
    },
    {
      key: "eggs",
      text: {
        ja: "よく混ぜて表面を平らにし、卵を割り入れます。黄身を竹串で3か所ずつ刺し、ふんわりとラップをかけます。",
        en: "Stir well, level the surface, and crack the eggs on top. Pierce each yolk in three places with a skewer and cover loosely with plastic wrap.",
        es: "Remueve bien, alisa la superficie y casca los huevos encima. Pincha cada yema en tres puntos con un palillo y cubre sin apretar con film.",
      },
    },
    {
      key: "heat",
      text: {
        ja: "600Wで1分加熱し、白身がまだ透明なら様子を見ながら20秒ずつ追加加熱します。白身が白くなったら取り出して1分置きます。",
        en: "Heat at 600 W for 1 minute; if the whites are still clear, keep heating in 20-second bursts. Once the whites are opaque, take the bowl out and let it stand for 1 minute.",
        es: "Calienta a 600 W durante 1 minuto; si las claras siguen transparentes, sigue en tandas de 20 segundos. Cuando las claras estén opacas, saca el cuenco y déjalo reposar 1 minuto.",
      },
    },
    {
      key: "serve",
      text: {
        ja: "小口切りの青ねぎを散らします。",
        en: "Scatter the thinly sliced green onion on top.",
        es: "Esparce la cebolleta en rodajas finas por encima.",
      },
    },
  ],
  safetyNotes: [
    {
      key: "egg_burst",
      text: {
        ja: "黄身に穴を開けずに電子レンジで加熱すると、卵が破裂することがあります。殻つきの卵は電子レンジで加熱しないでください。",
        en: "Eggs can burst in the microwave if the yolks are not pierced. Never microwave eggs in their shells.",
        es: "Los huevos pueden estallar en el microondas si no se pinchan las yemas. Nunca calientes huevos con cáscara en el microondas.",
      },
    },
    {
      key: "soft_yolk",
      text: {
        ja: "黄身がやわらかい卵は、妊娠中の方、乳幼児、高齢の方、体調のすぐれない方には向きません。その場合は黄身まで固まるまで加熱してください。",
        en: "Eggs with runny yolks are not recommended for pregnant people, young children, older adults, or anyone unwell; for them, cook until the yolks are firm.",
        es: "Los huevos con la yema líquida no se recomiendan para embarazadas, niños pequeños, personas mayores o enfermas; en esos casos, cocínalos hasta que la yema esté firme.",
      },
    },
    {
      key: "steam",
      text: {
        ja: "加熱直後は蒸気でやけどしやすいので、ラップは奥から手前に向かって外してください。",
        en: "Steam can burn right after heating; peel the wrap away from you.",
        es: "El vapor puede quemar justo después de calentar; retira el film en dirección contraria a ti.",
      },
    },
  ],
  substitutions: [],
};
