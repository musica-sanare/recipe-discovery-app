import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "beef_napa_spicy_soup",
  texts: {
    name: { ja: "牛もも肉と白菜の韓国風ピリ辛スープ", en: "Korean-style spicy beef and napa cabbage soup", es: "Sopa picante de ternera y col china al estilo coreano" },
    summary: {
      ja: "韓国のユッケジャンをヒントに、牛もも肉、白菜、もやし、ねぎを唐辛子とにんにくのスープで煮ます。ご飯を添えます。作り置きできます。",
      en: "Inspired by Korean yukgaejang: lean beef, napa cabbage, bean sprouts, and leek simmered in a chili and garlic broth, with rice. It keeps well.",
      es: "Inspirado en el yukgaejang coreano: ternera magra, col china, brotes de soja y puerro cocidos en un caldo de guindilla y ajo, con arroz. Se puede preparar por adelantado.",
    },
  },
  cuisine: "korean",
  goals: ["cut"],
  mainProteinGroup: "beef",
  tags: ["batch"],
  minutes: 25,
  effort: 2,
  equipment: ["stove", "pot"],
  servings: 1,
  ingredients: [
    { key: "beef", food: "beef_round", grams: 150, state: "boil", role: "main_protein", adjust: { kind: "grams", min: 110, max: 190, step: 20 } },
    { key: "napa", food: "napa_cabbage", grams: 150, state: "boil", role: "vegetable" },
    { key: "sprouts", food: "bean_sprouts", grams: 80, state: "boil", role: "vegetable" },
    { key: "long_onion", food: "long_onion", grams: 30, state: "raw", cooking: "simmer", role: "vegetable" },
    { key: "garlic", food: "garlic", grams: 5, state: "raw", measure: { unit: "clove", quantity: 1 }, role: "seasoning" },
    { key: "chili", food: "chili_pepper_powder", grams: 2, state: "as_is", role: "seasoning" },
    { key: "soy_sauce", food: "soy_sauce", grams: 12, state: "as_is", measure: { unit: "tsp", quantity: 2 }, role: "seasoning", linkedTo: "beef" },
    { key: "sesame_oil", food: "sesame_oil", grams: 3, state: "as_is", measure: { unit: "tsp", quantity: 0.75 }, role: "fat" },
    { key: "salt", food: "salt", grams: 0.5, state: "as_is", measure: { unit: "pinch", quantity: 1 }, role: "seasoning" },
    { key: "rice", food: "rice_cooked", grams: 180, state: "as_is", role: "main_carb", adjust: { kind: "grams", min: 150, max: 240, step: 30 } },
  ],
  sides: [
    { key: "rice", label: { ja: "ご飯", en: "Rice", es: "Arroz" }, ingredients: ["rice"], solverMayRemove: true },
  ],
  steps: [
    {
      key: "prep",
      text: {
        ja: "牛もも肉を細切りにし、しょうゆ、すりおろしたにんにく、一味唐辛子、ごま油をもみ込みます。白菜はざく切り、ねぎは斜め切りにします。",
        en: "Cut the beef into thin strips and rub in the soy sauce, grated garlic, ground chili, and sesame oil. Roughly chop the napa cabbage and slice the leek on the diagonal.",
        es: "Corta la ternera en tiras finas y mézclala con la salsa de soja, el ajo rallado, la guindilla molida y el aceite de sésamo. Trocea la col china y corta el puerro al bies.",
      },
    },
    {
      key: "simmer",
      text: {
        ja: "鍋に水400mLを沸かし、白菜とねぎを入れて中火で5分煮ます。牛肉を調味料ごと加え、もやしを入れて、牛肉の赤い部分がなくなるまで5分ほど煮ます。塩で味を調えます。",
        en: "Bring 400 mL of water to a boil in a pot, add the napa cabbage and leek, and simmer over medium heat for 5 minutes. Add the beef with its seasoning and the bean sprouts, and simmer for about 5 minutes, until no red remains in the beef. Season with the salt.",
        es: "Lleva a ebullición 400 mL de agua en una olla, añade la col china y el puerro y cuece a fuego medio 5 minutos. Añade la ternera con su aliño y los brotes de soja, y cuece unos 5 minutos, hasta que no quede nada rojo en la ternera. Ajusta de sal.",
      },
    },
    {
      key: "serve",
      text: { ja: "器に盛ります。", en: "Serve in a bowl.", es: "Sírvela en un cuenco." },
    },
    {
      key: "rice",
      side: "rice",
      text: { ja: "ご飯を添えます。", en: "Serve with the rice.", es: "Acompáñalo con el arroz." },
    },
  ],
  safetyNotes: [
    {
      key: "beef_doneness",
      text: {
        ja: "牛肉は赤い部分がなくなるまで煮てください。",
        en: "Simmer the beef until no red remains.",
        es: "Cuece la ternera hasta que no quede nada rojo.",
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
