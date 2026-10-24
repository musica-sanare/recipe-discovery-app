import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "beef_steak_potatoes",
  texts: {
    name: { ja: "牛もも肉のステーキと粉ふきいも", en: "Lean beef steak with fluffy boiled potatoes", es: "Filete de ternera magra con patatas cocidas" },
    summary: {
      ja: "赤身の牛もも肉を焼き、粉ふきいも、ゆでブロッコリー、ご飯を添えます。",
      en: "Lean beef round steak served with fluffy boiled potatoes, boiled broccoli, and rice.",
      es: "Filete de ternera magra con patatas cocidas, brócoli hervido y arroz.",
    },
  },
  cuisine: "western",
  goals: ["bulk"],
  mainProteinGroup: "beef",
  tags: [],
  minutes: 30,
  effort: 2,
  equipment: ["stove", "frying_pan", "pot"],
  servings: 1,
  ingredients: [
    { key: "beef", food: "beef_round", grams: 200, state: "grill", cooking: "saute", role: "main_protein", adjust: { kind: "grams", min: 150, max: 260, step: 10 } },
    { key: "oil", food: "olive_oil", grams: 5, state: "as_is", measure: { unit: "tsp", quantity: 1.25 }, role: "fat", linkedTo: "beef" },
    { key: "garlic", food: "garlic", grams: 3, state: "raw", measure: { unit: "clove", quantity: 0.5 }, role: "seasoning", linkedTo: "beef" },
    { key: "salt", food: "salt", grams: 1.5, state: "as_is", role: "seasoning", linkedTo: "beef" },
    { key: "pepper", food: "black_pepper", grams: 0.3, state: "as_is", measure: { unit: "pinch", quantity: 1 }, role: "seasoning", linkedTo: "beef" },
    { key: "potato", food: "potato", grams: 250, state: "simmer", measure: { unit: "piece", quantity: 2 }, role: "main_carb", adjust: { kind: "grams", min: 100, max: 400, step: 50 } },
    { key: "parsley", food: "parsley", grams: 2, state: "raw", role: "seasoning" },
    { key: "broccoli", food: "broccoli", grams: 80, state: "boil", role: "vegetable" },
    { key: "rice", food: "rice_cooked", grams: 150, state: "as_is", role: "main_carb", adjust: { kind: "grams", min: 100, max: 250, step: 10 } },
  ],
  sides: [
    { key: "potatoes", label: { ja: "粉ふきいも", en: "Fluffy boiled potatoes", es: "Patatas cocidas" }, ingredients: ["potato"], solverMayRemove: true },
    { key: "rice", label: { ja: "ご飯", en: "Rice", es: "Arroz" }, ingredients: ["rice"], solverMayRemove: true },
    { key: "broccoli", label: { ja: "ゆでブロッコリー", en: "Boiled broccoli", es: "Brócoli hervido" }, ingredients: ["broccoli"], solverMayRemove: false },
  ],
  steps: [
    {
      key: "potatoes",
      side: "potatoes",
      text: {
        ja: "じゃがいもを皮をむいて4つに切り、水から15分ゆでます。湯を捨て、鍋をゆすりながら水分を飛ばして粉をふかせます。",
        en: "Peel the potatoes, cut them into quarters, and boil from cold water for 15 minutes. Drain, then shake the pot over the heat until the surface turns fluffy.",
        es: "Pela las patatas, córtalas en cuartos y cuécelas desde agua fría 15 minutos. Escúrrelas y agita la olla al fuego hasta que la superficie quede harinosa.",
      },
    },
    {
      key: "broccoli",
      side: "broccoli",
      text: {
        ja: "ブロッコリーを小房に分けて2分ゆでます。",
        en: "Cut the broccoli into florets and boil for 2 minutes.",
        es: "Separa el brócoli en ramilletes y hiérvelo 2 minutos.",
      },
    },
    {
      key: "cook",
      text: {
        ja: "牛肉を室温に戻して塩とこしょうをふります。フライパンでオリーブ油とつぶしたにんにくを熱し、強めの中火で片面3分ずつ焼きます。",
        en: "Bring the beef to room temperature and season with salt and pepper. Heat the olive oil with crushed garlic and sear over medium-high heat for 3 minutes on each side.",
        es: "Atempera la carne y salpimiéntala. Calienta el aceite de oliva con el ajo machacado y dora la carne a fuego medio-alto 3 minutos por cada lado.",
      },
    },
    {
      key: "serve",
      text: {
        ja: "アルミホイルで包んで3分休ませてから切り、パセリを散らします。",
        en: "Rest wrapped in foil for 3 minutes, slice, and sprinkle with parsley.",
        es: "Déjala reposar envuelta en papel de aluminio 3 minutos, córtala y espolvorea el perejil.",
      },
    },
  ],
  safetyNotes: [
    {
      key: "beef_doneness",
      text: {
        ja: "牛肉のかたまりは表面をしっかり焼いてください。ひき肉や、筋を切る処理・味付け液の注入をした肉は、中心まで火を通します。",
        en: "Sear whole cuts of beef well on the outside. Minced beef, and beef that has been mechanically tenderized or injected with seasoning, must be cooked through.",
        es: "Dora bien la superficie de las piezas enteras de ternera. La carne picada y la carne ablandada mecánicamente o inyectada con adobo deben cocinarse por completo.",
      },
    },
  ],
  substitutions: [],
};
