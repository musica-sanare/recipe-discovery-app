import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "beef_steak_potatoes",
  texts: {
    name: { ja: "牛もも肉のステーキと粉ふきいも", en: "Lean beef steak with fluffy boiled potatoes", es: "Filete de ternera magra con patatas cocidas" },
    summary: {
      ja: "赤身の牛もも肉を焼き、粉ふきいも、ゆでブロッコリー、ご飯を添えます。",
      en: "Lean beef round steak served with fluffy boiled potatoes, boiled broccoli, and rice.",
      es: "Filete de babilla magra con patatas cocidas, brócoli hervido y arroz.",
    },
  },
  cuisine: "western",
  goals: ["bulk"],
  tags: [],
  minutes: 30,
  effort: 2,
  equipment: ["stove", "frying_pan", "pot"],
  servings: 1,
  ingredients: [
    { key: "beef", food: "beef_round", grams: 200, state: "grill", cooking: "saute", role: "main_protein", adjust: { min: 150, max: 260, step: 10 } },
    { key: "oil", food: "olive_oil", grams: 5, state: "as_is", measure: { unit: "tsp", quantity: 1.25 }, role: "fat" },
    { key: "garlic", food: "garlic", grams: 3, state: "raw", measure: { unit: "clove", quantity: 0.5 }, role: "seasoning" },
    { key: "salt", food: "salt", grams: 1.5, state: "as_is", role: "seasoning" },
    { key: "pepper", food: "black_pepper", grams: 0.3, state: "as_is", measure: { unit: "pinch", quantity: 1 }, role: "seasoning" },
    { key: "potato", food: "potato", grams: 250, state: "simmer", measure: { unit: "piece", quantity: 2 }, role: "main_carb", adjust: { min: 150, max: 400, step: 50 } },
    { key: "parsley", food: "parsley", grams: 2, state: "raw", role: "seasoning" },
    { key: "broccoli", food: "broccoli", grams: 80, state: "boil", role: "vegetable" },
    { key: "rice", food: "rice_cooked", grams: 150, state: "as_is", role: "main_carb", adjust: { min: 0, max: 250, step: 10 } },
  ],
  steps: [
    {
      ja: "じゃがいもを皮をむいて4つに切り、水から15分ゆでます。湯を捨て、鍋をゆすりながら水分を飛ばして粉をふかせます。",
      en: "Peel the potatoes, cut them into quarters, and boil from cold water for 15 minutes. Drain, then shake the pot over the heat until the surface turns fluffy.",
      es: "Pela las patatas, córtalas en cuartos y cuécelas desde agua fría 15 minutos. Escúrrelas y agita la olla al fuego hasta que la superficie quede harinosa.",
    },
    {
      ja: "ブロッコリーを小房に分けて2分ゆでます。",
      en: "Cut the broccoli into florets and boil for 2 minutes.",
      es: "Separa el brócoli en ramilletes y hiérvelo 2 minutos.",
    },
    {
      ja: "牛肉を室温に戻して塩とこしょうをふります。フライパンでオリーブ油とつぶしたにんにくを熱し、強めの中火で片面3分ずつ焼きます。",
      en: "Bring the beef to room temperature and season with salt and pepper. Heat the olive oil with crushed garlic and sear over medium-high heat for 3 minutes on each side.",
      es: "Atempera la carne y salpimiéntala. Calienta el aceite de oliva con el ajo machacado y dora la carne a fuego medio-alto 3 minutos por cada lado.",
    },
    {
      ja: "アルミホイルで包んで3分休ませてから切り、粉ふきいも、ブロッコリー、ご飯を添えてパセリを散らします。",
      en: "Rest wrapped in foil for 3 minutes, slice, and serve with the potatoes, broccoli, and rice, sprinkled with parsley.",
      es: "Déjala reposar envuelta en papel de aluminio 3 minutos, córtala y sírvela con las patatas, el brócoli y el arroz, con perejil por encima.",
    },
  ],
  safetyNotes: [
    {
      ja: "牛肉のかたまりは表面をしっかり焼いてください。ひき肉や、筋を切る処理・味付け液の注入をした肉は、中心まで火を通します。",
      en: "Sear whole cuts of beef well on the outside. Minced, tenderized, or injected beef must be cooked through.",
      es: "Dora bien la superficie de las piezas enteras de ternera. La carne picada, ablandada o inyectada debe cocinarse por completo.",
    },
  ],
  substitutions: [],
};
