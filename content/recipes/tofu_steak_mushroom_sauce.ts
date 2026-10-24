import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "tofu_steak_mushroom_sauce",
  texts: {
    name: { ja: "豆腐ステーキのきのこあんかけ", en: "Tofu steak with mushroom sauce", es: "Filete de tofu con salsa de setas" },
    summary: {
      ja: "水切りした木綿豆腐を香ばしく焼き、しめじのとろみあんをかけます。ブロッコリーとご飯を添えます。",
      en: "Drained firm tofu seared until golden and topped with a glossy shimeji sauce, with broccoli and rice.",
      es: "Tofu firme escurrido y dorado a la sartén, cubierto con una salsa brillante de shimeji, con brócoli y arroz.",
    },
  },
  cuisine: "japanese",
  goals: ["maintain"],
  mainProteinGroup: "soy",
  tags: [],
  minutes: 20,
  effort: 2,
  equipment: ["stove", "frying_pan", "microwave"],
  servings: 1,
  ingredients: [
    {
      key: "tofu",
      food: "tofu_firm",
      grams: 300,
      state: "raw",
      cooking: "saute",
      measure: { unit: "block", quantity: 1 },
      role: "main_protein",
      adjust: { kind: "grams", min: 200, max: 400, step: 50 },
      note: {
        ja: "成分表に焼いた豆腐の値がないため、加熱前の値で計算しています。",
        en: "The tables have no value for pan-fried tofu, so the uncooked value is used.",
        es: "Las tablas no tienen un valor para el tofu a la sartén, así que se usa el valor sin cocinar.",
      },
    },
    { key: "starch_tofu", food: "potato_starch", grams: 6, state: "as_is", measure: { unit: "tsp", quantity: 2 }, role: "coating", linkedTo: "tofu" },
    { key: "oil_tofu", food: "vegetable_oil", grams: 3, state: "as_is", measure: { unit: "tsp", quantity: 0.75 }, role: "fat", linkedTo: "tofu" },
    { key: "shimeji", food: "shimeji", grams: 80, state: "boil", role: "vegetable" },
    { key: "soy_sauce", food: "soy_sauce", grams: 12, state: "as_is", measure: { unit: "tsp", quantity: 2 }, role: "seasoning" },
    { key: "mirin", food: "mirin", grams: 12, state: "as_is", measure: { unit: "tsp", quantity: 2 }, role: "seasoning" },
    { key: "starch_sauce", food: "potato_starch", grams: 3, state: "as_is", measure: { unit: "tsp", quantity: 1 }, role: "seasoning" },
    { key: "broccoli", food: "broccoli", grams: 80, state: "microwave", role: "vegetable" },
    { key: "rice", food: "rice_cooked", grams: 150, state: "as_is", role: "main_carb", adjust: { kind: "grams", min: 100, max: 250, step: 10 } },
  ],
  sides: [
    { key: "broccoli", label: { ja: "ゆでブロッコリー", en: "Steamed broccoli", es: "Brócoli al vapor" }, ingredients: ["broccoli"], solverMayRemove: false },
    { key: "rice", label: { ja: "ご飯", en: "Rice", es: "Arroz" }, ingredients: ["rice"], solverMayRemove: true },
  ],
  steps: [
    {
      key: "prep",
      text: {
        ja: "木綿豆腐をキッチンペーパーで包んで10分置き、水気を切って厚さ半分に切り、片栗粉を薄くまぶします。しめじは小房に分けます。",
        en: "Wrap the firm tofu in paper towels for 10 minutes to drain, slice it in half horizontally, and dust it lightly with potato starch. Separate the shimeji.",
        es: "Envuelve el tofu firme en papel de cocina 10 minutos para escurrirlo, córtalo por la mitad a lo ancho y espolvoréalo ligeramente con fécula de patata. Separa las shimeji.",
      },
    },
    {
      key: "sear",
      text: {
        ja: "フライパンに油を中火で熱し、豆腐を両面3分ずつ焼いて器に盛ります。",
        en: "Heat the oil in a frying pan over medium heat, sear the tofu for 3 minutes on each side, and transfer it to a plate.",
        es: "Calienta el aceite en una sartén a fuego medio, dora el tofu 3 minutos por cada lado y pásalo a un plato.",
      },
    },
    {
      key: "sauce",
      text: {
        ja: "同じフライパンに水100mL、しょうゆ、みりん、しめじを入れて2分煮ます。同量の水で溶いた片栗粉を加えてとろみをつけ、豆腐にかけます。",
        en: "In the same pan, simmer 100 mL of water, the soy sauce, mirin, and shimeji for 2 minutes. Stir in the potato starch mixed with the same amount of water until thickened, then pour over the tofu.",
        es: "En la misma sartén, cuece 100 mL de agua, la salsa de soja, el mirin y las shimeji durante 2 minutos. Añade la fécula disuelta en la misma cantidad de agua, remueve hasta que espese y viértelo sobre el tofu.",
      },
    },
    {
      key: "broccoli",
      side: "broccoli",
      text: {
        ja: "ブロッコリーを小房に分けて耐熱皿にのせ、水大さじ1をふってふんわりとラップをかけ、600Wで2分加熱して添えます。",
        en: "Cut the broccoli into florets, place them on a microwave-safe plate, sprinkle with 1 tbsp of water, cover loosely with plastic wrap, heat at 600 W for 2 minutes, and serve alongside.",
        es: "Separa el brócoli en ramilletes, ponlo en un plato apto para microondas, rocíalo con 1 cucharada de agua, cúbrelo sin apretar con film, caliéntalo a 600 W durante 2 minutos y sírvelo al lado.",
      },
    },
  ],
  safetyNotes: [
    {
      key: "hot_oil",
      text: {
        ja: "水気の残った豆腐を入れると油がはねます。水気をよく切ってから焼いてください。",
        en: "Wet tofu makes the oil spatter. Drain it well before searing.",
        es: "El tofu húmedo hace que el aceite salpique. Escúrrelo bien antes de dorarlo.",
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
