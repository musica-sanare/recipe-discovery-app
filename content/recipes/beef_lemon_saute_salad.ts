import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "beef_lemon_saute_salad",
  texts: {
    name: { ja: "牛もものレモンソテーとサラダ", en: "Lemon-sautéed beef round with salad", es: "Ternera magra salteada al limón con ensalada" },
    summary: {
      ja: "赤身の牛もも肉を焼いてレモン汁で仕上げ、レタスとトマトのサラダにのせます。じゃがいもを添えます。",
      en: "Lean beef round seared and finished with lemon juice, served on a lettuce and tomato salad with potatoes.",
      es: "Ternera magra dorada y terminada con zumo de limón, servida sobre una ensalada de lechuga y tomate con patatas.",
    },
  },
  cuisine: "western",
  goals: ["cut"],
  mainProteinGroup: "beef",
  tags: [],
  minutes: 15,
  effort: 2,
  equipment: ["stove", "frying_pan", "microwave"],
  servings: 1,
  ingredients: [
    {
      key: "beef",
      food: "beef_round",
      grams: 180,
      state: "grill",
      cooking: "saute",
      role: "main_protein",
      adjust: { kind: "grams", min: 140, max: 240, step: 10 },
      note: {
        ja: "成分表にソテーした牛もも肉の値がないため、焼いた値で計算しています。",
        en: "The tables have no value for sautéed beef round, so the grilled value is used.",
        es: "Las tablas no tienen un valor para la ternera salteada, así que se usa el valor a la parrilla.",
      },
    },
    { key: "oil_beef", food: "olive_oil", grams: 3, state: "as_is", measure: { unit: "tsp", quantity: 0.75 }, role: "fat", linkedTo: "beef" },
    { key: "salt", food: "salt", grams: 1, state: "as_is", measure: { unit: "pinch", quantity: 2 }, role: "seasoning", linkedTo: "beef" },
    { key: "pepper", food: "black_pepper", grams: 0.2, state: "as_is", measure: { unit: "pinch", quantity: 1 }, role: "seasoning", linkedTo: "beef" },
    { key: "lemon_juice", food: "lemon_juice", grams: 15, state: "as_is", measure: { unit: "tbsp", quantity: 1 }, role: "seasoning" },
    { key: "lettuce", food: "lettuce", grams: 60, state: "raw", role: "vegetable" },
    { key: "tomato", food: "tomato", grams: 80, state: "raw", measure: { unit: "piece", quantity: 0.5 }, role: "vegetable" },
    { key: "potato", food: "potato", grams: 250, state: "microwave", measure: { unit: "piece", quantity: 2 }, role: "main_carb", adjust: { kind: "grams", min: 100, max: 350, step: 50 } },
  ],
  sides: [
    { key: "potato", label: { ja: "じゃがいも", en: "Potatoes", es: "Patatas" }, ingredients: ["potato"], solverMayRemove: true },
  ],
  steps: [
    {
      key: "prep",
      text: {
        ja: "牛肉に塩とこしょうをふります。レタスはちぎり、トマトはくし形に切って器に盛ります。",
        en: "Season the beef with salt and pepper. Tear the lettuce, cut the tomato into wedges, and arrange them on a plate.",
        es: "Salpimienta la ternera. Trocea la lechuga con las manos, corta el tomate en gajos y colócalos en un plato.",
      },
    },
    {
      key: "sear",
      text: {
        ja: "フライパンに牛肉用のオリーブオイルを強めの中火で熱し、牛肉を片面2分ずつ焼きます。火を止めてレモン汁をからめ、2分休ませてから薄切りにします。",
        en: "Heat the olive oil for the beef in a frying pan over medium-high heat and sear the beef for 2 minutes on each side. Turn off the heat, coat it with the lemon juice, rest it for 2 minutes, and slice it thinly.",
        es: "Calienta el aceite de oliva de la ternera en una sartén a fuego medio-alto y dora la ternera 2 minutos por cada lado. Apaga el fuego, báñala con el zumo de limón, déjala reposar 2 minutos y córtala en lonchas finas.",
      },
    },
    {
      key: "serve",
      text: {
        ja: "サラダに牛肉をのせ、フライパンに残った汁をかけます。",
        en: "Lay the beef on the salad and drizzle with the pan juices.",
        es: "Coloca la ternera sobre la ensalada y riega con el jugo de la sartén.",
      },
    },
    {
      key: "potato",
      side: "potato",
      text: {
        ja: "じゃがいもをよく洗い、皮つきのまま1個ずつラップで包んで600Wで5〜6分、竹串がすっと通るまで加熱します。皮をむいて添えます。",
        en: "Scrub the potatoes, wrap each one in plastic wrap with the skin on, and heat at 600 W for 5–6 minutes until a skewer slides in easily. Peel and serve alongside.",
        es: "Lava bien las patatas, envuelve cada una con piel en film y caliéntalas a 600 W durante 5-6 minutos hasta que un palillo entre con facilidad. Pélalas y sírvelas al lado.",
      },
    },
  ],
  safetyNotes: [
    {
      key: "beef_doneness",
      text: {
        ja: "牛肉は表面全体にしっかり焼き色をつけてください。中まで火を通したい場合は、片面の焼き時間を1分ずつ延ばします。",
        en: "Brown the beef well on every surface. To cook it through, add 1 minute to each side.",
        es: "Dora bien la ternera por todas sus caras. Para hacerla por completo, añade 1 minuto por cada lado.",
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
