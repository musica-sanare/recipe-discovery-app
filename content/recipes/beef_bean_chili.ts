import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "beef_bean_chili",
  texts: {
    name: { ja: "牛もも肉と豆のチリコンカン", en: "Beef and bean chili", es: "Chili con carne y frijoles" },
    summary: {
      ja: "チリコンカンをヒントに、刻んだ牛もも肉と赤いんげん豆をチリパウダーとトマトで煮込みます。ご飯を添えます。",
      en: "Inspired by chili con carne: chopped lean beef and kidney beans simmered with chili powder and tomatoes, with rice.",
      es: "Inspirado en el chili con carne: ternera magra picada y alubias rojas guisadas con chile en polvo y tomate, con arroz.",
    },
  },
  cuisine: "latin_american",
  goals: ["maintain"],
  mainProteinGroup: "beef",
  tags: ["batch"],
  minutes: 35,
  effort: 2,
  equipment: ["stove", "pot"],
  servings: 1,
  ingredients: [
    {
      key: "beef",
      food: "beef_round",
      grams: 140,
      state: "raw",
      cooking: "simmer",
      role: "main_protein",
      adjust: { kind: "grams", min: 100, max: 200, step: 20 },
      note: {
        ja: "成分表に煮込んだ牛もも肉の値がないため、生の値で計算しています。",
        en: "The tables have no value for stewed beef round, so the raw value is used.",
        es: "Las tablas no tienen un valor para la ternera guisada, así que se usa el valor en crudo.",
      },
    },
    { key: "olive_oil", food: "olive_oil", grams: 4, state: "as_is", measure: { unit: "tsp", quantity: 1 }, role: "fat", linkedTo: "beef" },
    { key: "salt", food: "salt", grams: 1, state: "as_is", measure: { unit: "pinch", quantity: 2 }, role: "seasoning", linkedTo: "beef" },
    { key: "chili_powder", food: "chili_powder", grams: 4, state: "as_is", measure: { unit: "tsp", quantity: 2 }, role: "seasoning" },
    { key: "onion", food: "onion", grams: 80, state: "raw", cooking: "simmer", measure: { unit: "piece", quantity: 1 / 3 }, role: "vegetable" },
    { key: "red_pepper", food: "red_pepper", grams: 50, state: "raw", cooking: "simmer", role: "vegetable" },
    { key: "garlic", food: "garlic", grams: 5, state: "raw", measure: { unit: "clove", quantity: 1 }, role: "seasoning" },
    { key: "tomato_canned", food: "tomato_canned", grams: 200, state: "as_is", measure: { unit: "can", quantity: 0.5 }, role: "vegetable" },
    { key: "beans", food: "kidney_beans", grams: 120, state: "as_is", role: "other" },
    { key: "rice", food: "rice_cooked", grams: 150, state: "as_is", role: "main_carb", adjust: { kind: "grams", min: 100, max: 250, step: 25 } },
  ],
  sides: [
    { key: "rice", label: { ja: "ご飯", en: "Rice", es: "Arroz" }, ingredients: ["rice"], solverMayRemove: true },
  ],
  steps: [
    {
      key: "prep",
      text: {
        ja: "牛もも肉を包丁で5mm角程度に細かく刻みます。玉ねぎと赤パプリカは1cm角に切り、にんにくはみじん切りにします。",
        en: "Chop the beef finely with a knife, into pieces of about 5 mm. Cut the onion and red pepper into 1 cm dice and finely chop the garlic.",
        es: "Pica la ternera a cuchillo en trozos de unos 5 mm. Corta la cebolla y el pimiento rojo en dados de 1 cm y pica fino el ajo.",
      },
    },
    {
      key: "brown",
      text: {
        ja: "鍋にオリーブオイルを中火で熱し、玉ねぎとにんにくを2分炒めます。牛肉を加え、ほぐしながら色が変わるまで炒め、塩とチリパウダーを加えます。",
        en: "Heat the olive oil in a pot over medium heat and stir-fry the onion and garlic for 2 minutes. Add the beef and cook, breaking it up, until it changes color, then add the salt and chili powder.",
        es: "Calienta el aceite de oliva en una olla a fuego medio y saltea la cebolla y el ajo 2 minutos. Añade la ternera y cocínala, deshaciéndola, hasta que cambie de color; luego añade la sal y el chile en polvo.",
      },
    },
    {
      key: "simmer",
      text: {
        ja: "赤パプリカ、トマト缶、汁を切った豆、水50mlを加えて煮立て、ふたを少しずらして弱火で20分煮込みます。",
        en: "Add the red pepper, canned tomatoes, drained beans, and 50 ml of water, bring to a boil, and simmer over low heat for 20 minutes with the lid ajar.",
        es: "Añade el pimiento rojo, el tomate en lata, las alubias escurridas y 50 ml de agua, lleva a ebullición y cuece a fuego bajo 20 minutos con la tapa entreabierta.",
      },
    },
    {
      key: "serve",
      text: {
        ja: "器に盛ります。",
        en: "Transfer to a bowl.",
        es: "Sírvelo en un cuenco.",
      },
    },
    {
      key: "rice",
      side: "rice",
      text: {
        ja: "ご飯を添えます。",
        en: "Serve with the rice.",
        es: "Acompáñalo con el arroz.",
      },
    },
  ],
  safetyNotes: [
    {
      key: "mince_doneness",
      text: {
        ja: "細かく刻んだ肉は中心まで火を通してください。ピンク色が残らないよう、ほぐしながら炒めます。",
        en: "Cook finely chopped meat through, breaking it up until no pink remains.",
        es: "Cocina bien la carne picada, deshaciéndola hasta que no quede nada rosado.",
      },
    },
    {
      key: "cooling",
      text: {
        ja: "作り置きする場合は、浅い容器に移して早めに冷まし、冷蔵庫で保存してください。食べるときは中心まで十分に温め直します。",
        en: "To keep leftovers, transfer them to a shallow container, cool them quickly, and refrigerate. Reheat until piping hot throughout before eating.",
        es: "Si guardas sobras, pásalas a un recipiente poco hondo, enfríalas rápido y guárdalas en el refrigerador. Antes de comer, recaliéntalas hasta que estén bien calientes por dentro.",
      },
    },
  ],
  substitutions: [],
};
