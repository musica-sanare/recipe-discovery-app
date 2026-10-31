import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "arroz_con_pollo_beans",
  texts: {
    name: { ja: "鶏むね肉と豆のアロス・コン・ポジョ", en: "Arroz con pollo with kidney beans", es: "Arroz con pollo y frijoles", fr: "Arroz con pollo aux haricots rouges" },
    summary: {
      ja: "中南米の炊き込みご飯をヒントに、鶏むね肉と赤いんげん豆をパプリカ風味のトマトソースで煮て、炊いたご飯と合わせる簡単版です。",
      en: "Inspired by Latin American rice with chicken: a quick version that simmers chicken breast and kidney beans in a paprika tomato sauce and stirs in cooked rice.",
      es: "Inspirado en el arroz con pollo latinoamericano: una versión rápida que guisa pechuga de pollo y alubias rojas en salsa de tomate con pimentón y mezcla arroz ya cocido.",
      fr: "Inspiré du riz au poulet d'Amérique latine : une version rapide où le blanc de poulet et les haricots rouges mijotent dans une sauce tomate au paprika, avant d'y mélanger du riz déjà cuit.",
    },
  },
  cuisine: "latin_american",
  goals: ["bulk"],
  mainProteinGroup: "chicken",
  tags: ["batch"],
  minutes: 30,
  effort: 2,
  equipment: ["stove", "frying_pan"],
  servings: 1,
  ingredients: [
    {
      key: "chicken",
      food: "chicken_breast",
      grams: 200,
      state: "raw",
      cooking: "simmer",
      role: "main_protein",
      adjust: { kind: "grams", min: 160, max: 260, step: 20 },
      note: {
        ja: "成分表に煮込んだ鶏むね肉の値がないため、生の値で計算しています。",
        en: "The tables have no value for stewed chicken breast, so the raw value is used.",
        es: "Las tablas no tienen un valor para la pechuga de pollo guisada, así que se usa el valor en crudo.",
        fr: "Les tables n'ont pas de valeur pour le blanc de poulet mijoté ; la valeur à l'état cru est donc utilisée.",
      },
    },
    { key: "olive_oil", food: "olive_oil", grams: 5, state: "as_is", measure: { unit: "tsp", quantity: 1.25 }, role: "fat", linkedTo: "chicken" },
    { key: "salt", food: "salt", grams: 1.5, state: "as_is", measure: { unit: "pinch", quantity: 3 }, role: "seasoning", linkedTo: "chicken" },
    { key: "paprika", food: "paprika_powder", grams: 2, state: "as_is", measure: { unit: "tsp", quantity: 1 }, role: "seasoning", linkedTo: "chicken" },
    { key: "onion", food: "onion", grams: 60, state: "raw", cooking: "simmer", measure: { unit: "piece", quantity: 0.25 }, role: "vegetable" },
    { key: "red_pepper", food: "red_pepper", grams: 50, state: "raw", cooking: "simmer", role: "vegetable" },
    { key: "garlic", food: "garlic", grams: 5, state: "raw", measure: { unit: "clove", quantity: 1 }, role: "seasoning" },
    { key: "tomato_canned", food: "tomato_canned", grams: 100, state: "as_is", measure: { unit: "can", quantity: 0.25 }, role: "vegetable" },
    { key: "beans", food: "kidney_beans", grams: 80, state: "as_is", role: "other" },
    { key: "rice", food: "rice_cooked", grams: 250, state: "as_is", role: "main_carb", adjust: { kind: "grams", min: 200, max: 350, step: 25 } },
    { key: "parsley", food: "parsley", grams: 2, state: "raw", role: "vegetable" },
  ],
  sides: [],
  steps: [
    {
      key: "prep",
      text: {
        ja: "鶏むね肉をひと口大に切り、塩とパプリカをまぶします。玉ねぎと赤パプリカは1cm角に切り、にんにくはみじん切りにします。",
        en: "Cut the chicken breast into bite-size pieces and coat with the salt and paprika. Cut the onion and red pepper into 1 cm dice and finely chop the garlic.",
        es: "Corta la pechuga de pollo en trozos pequeños y cúbrelos con la sal y el pimentón. Corta la cebolla y el pimiento rojo en dados de 1 cm y pica fino el ajo.",
        fr: "Coupez le blanc de poulet en bouchées et enrobez-le de sel et de paprika. Coupez l'oignon et le poivron rouge en dés de 1 cm et hachez finement l'ail.",
      },
    },
    {
      key: "brown",
      text: {
        ja: "フライパンにオリーブオイルを中火で熱し、鶏肉の表面を焼きます。玉ねぎ、赤パプリカ、にんにくを加えて2分炒めます。",
        en: "Heat the olive oil in a frying pan over medium heat and brown the chicken. Add the onion, red pepper, and garlic and stir-fry for 2 minutes.",
        es: "Calienta el aceite de oliva en una sartén a fuego medio y dora el pollo. Añade la cebolla, el pimiento rojo y el ajo y saltea 2 minutos.",
        fr: "Faites chauffer l'huile d'olive dans une poêle à feu moyen et faites dorer le poulet. Ajoutez l'oignon, le poivron rouge et l'ail et faites sauter 2 minutes.",
      },
    },
    {
      key: "simmer",
      text: {
        ja: "トマト缶、水大さじ3、汁を切った豆を加え、ふたをして弱めの中火で10分煮ます。",
        en: "Add the canned tomatoes, 3 tbsp of water, and the drained beans, cover, and simmer over medium-low heat for 10 minutes.",
        es: "Añade el tomate en lata, 3 cucharadas de agua y las alubias escurridas, tapa y cuece a fuego medio-bajo 10 minutos.",
        fr: "Ajoutez les tomates en conserve, 3 cuillères à soupe d'eau et les haricots égouttés, couvrez et laissez mijoter 10 minutes à feu moyen-doux.",
      },
    },
    {
      key: "rice",
      text: {
        ja: "ご飯を加えて全体を混ぜ、ふたをせずに3分、汁気が少なくなるまで火を通します。刻んだパセリを散らします。",
        en: "Stir in the rice and cook uncovered for 3 minutes until most of the liquid is absorbed. Sprinkle with the chopped parsley.",
        es: "Incorpora el arroz y cocina sin tapa 3 minutos hasta que absorba casi todo el líquido. Espolvorea el perejil picado.",
        fr: "Incorporez le riz et laissez cuire 3 minutes sans couvercle, jusqu'à ce que presque tout le liquide soit absorbé. Parsemez de persil haché.",
      },
    },
  ],
  safetyNotes: [
    {
      key: "chicken_doneness",
      text: {
        ja: "鶏肉は中心まで火を通してください。切り口に赤みがなく、肉汁が透明になっていることを確認します。",
        en: "Cook chicken all the way through. Check that the center is no longer pink and the juices run clear.",
        es: "Cocina el pollo completamente. Comprueba que el centro ya no esté rosado y que los jugos salgan transparentes.",
        fr: "Faites cuire le poulet à cœur. Vérifiez que le centre n'est plus rosé et que le jus qui s'écoule est clair.",
      },
    },
    {
      key: "cooling",
      text: {
        ja: "作り置きする場合は、浅い容器に移して早めに冷まし、冷蔵庫で保存してください。食べるときは中心まで十分に温め直します。",
        en: "To keep leftovers, transfer them to a shallow container, cool them quickly, and refrigerate. Reheat until piping hot throughout before eating.",
        es: "Si guardas sobras, pásalas a un recipiente poco hondo, enfríalas rápido y guárdalas en el refrigerador. Antes de comer, recaliéntalas hasta que estén bien calientes por dentro.",
        fr: "Pour conserver les restes, mettez-les dans un récipient peu profond, faites-les refroidir rapidement et placez-les au réfrigérateur. Avant de les manger, réchauffez-les jusqu'à ce qu'ils soient bien chauds à cœur.",
      },
    },
  ],
  substitutions: [],
};
