import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "feves_au_lard",
  texts: {
    name: { ja: "フェーヴ・オ・ラール（豚もも肉と白いんげん豆のメープル煮）", en: "Fèves au lard (maple beans with lean pork)", es: "Fèves au lard (alubias al arce con cerdo magro)", fr: "Fèves au lard au porc maigre" },
    summary: {
      ja: "ケベックの豆料理をヒントに、本来の塩漬けの豚ばら肉の代わりに豚もも肉を使い、白いんげん豆とメープルシロップ、トマト、マスタードで煮込みます。フランスパンを添えます。",
      en: "Inspired by the bean dish of Québec, made with lean pork leg instead of salt pork: white beans simmered with maple syrup, tomato, and mustard. With baguette.",
      es: "Inspirado en el plato de alubias de Quebec, con pierna de cerdo magra en lugar de panceta salada: alubias blancas guisadas con sirope de arce, tomate y mostaza. Con pan de barra.",
      fr: "Inspirées des fèves au lard québécoises, préparées avec du porc maigre au lieu du lard salé : haricots blancs mijotés au sirop d'érable, à la tomate et à la moutarde. Avec de la baguette.",
    },
  },
  cuisine: "western",
  goals: ["bulk"],
  mainProteinGroup: "pork",
  tags: ["batch"],
  minutes: 60,
  effort: 1,
  equipment: ["stove", "pot"],
  servings: 1,
  ingredients: [
    { key: "pork", food: "pork_leg", grams: 150, state: "boil", role: "main_protein", adjust: { kind: "grams", min: 110, max: 190, step: 20 } },
    { key: "salt", food: "salt", grams: 1, state: "as_is", measure: { unit: "pinch", quantity: 2 }, role: "seasoning", linkedTo: "pork" },
    { key: "pepper", food: "black_pepper", grams: 0.2, state: "as_is", measure: { unit: "pinch", quantity: 1 }, role: "seasoning", linkedTo: "pork" },
    { key: "beans", food: "white_beans", grams: 180, state: "as_is", role: "other" },
    { key: "onion", food: "onion", grams: 50, state: "boil", measure: { unit: "piece", quantity: 0.25 }, role: "vegetable" },
    { key: "maple", food: "maple_syrup", grams: 15, state: "as_is", measure: { unit: "tbsp", quantity: 0.75 }, role: "seasoning" },
    { key: "tomato_paste", food: "tomato_paste", grams: 15, state: "as_is", measure: { unit: "tbsp", quantity: 1 }, role: "seasoning" },
    { key: "mustard", food: "dijon_mustard", grams: 5, state: "as_is", measure: { unit: "tsp", quantity: 1 }, role: "seasoning" },
    { key: "bread", food: "baguette", grams: 60, state: "as_is", role: "main_carb", adjust: { kind: "grams", min: 40, max: 100, step: 20 } },
  ],
  sides: [{ key: "bread", label: { ja: "フランスパン", en: "Baguette", es: "Pan de barra", fr: "Baguette" }, ingredients: ["bread"], solverMayRemove: true }],
  steps: [
    {
      key: "prep",
      text: {
        ja: "豚もも肉を2cm角に切り、塩とこしょうをまぶします。玉ねぎはみじん切りにし、白いんげん豆は汁を切ります。",
        en: "Cut the pork into 2 cm cubes and season with the salt and pepper. Finely chop the onion and drain the beans.",
        es: "Corta el cerdo en dados de 2 cm y salpimiéntalo. Pica finamente la cebolla y escurre las alubias.",
        fr: "Coupez le porc en cubes de 2 cm, salez et poivrez. Hachez finement l'oignon et égouttez les haricots.",
      },
    },
    {
      key: "simmer",
      text: {
        ja: "鍋に豚肉、玉ねぎ、白いんげん豆、メープルシロップ、トマトペースト、マスタード、水250mlを入れて煮立て、アクを取ります。ふたをして弱火で45分、ときどき混ぜながら煮ます。",
        en: "Put the pork, onion, beans, maple syrup, tomato paste, mustard, and 250 ml of water in a pot, bring to a boil, and skim. Cover and cook over low heat for 45 minutes, stirring now and then.",
        es: "Pon en una olla el cerdo, la cebolla, las alubias, el sirope de arce, el concentrado de tomate, la mostaza y 250 ml de agua, lleva a ebullición y espuma. Tapa y cuece a fuego bajo 45 minutos, removiendo de vez en cuando.",
        fr: "Mettez le porc, l'oignon, les haricots, le sirop d'érable, le concentré de tomate, la moutarde et 250 ml d'eau dans une cocotte, portez à ébullition et écumez. Couvrez et laissez cuire 45 minutes à feu doux en remuant de temps en temps.",
      },
    },
    {
      key: "finish",
      text: {
        ja: "ふたを取り、とろりとするまで5分ほど煮詰めます。",
        en: "Uncover and cook for about 5 more minutes, until the sauce thickens.",
        es: "Destapa y cuece unos 5 minutos más, hasta que la salsa espese.",
        fr: "Découvrez et laissez réduire environ 5 minutes, jusqu'à ce que la sauce épaississe.",
      },
    },
    { key: "bread", side: "bread", text: { ja: "フランスパンを添えます。", en: "Serve with the baguette.", es: "Acompáñalo con el pan de barra.", fr: "Servez avec la baguette." } },
  ],
  safetyNotes: [
    {
      key: "pork_doneness",
      text: {
        ja: "豚肉は中心まで火を通してください。切り口に赤みがなく、肉汁が透明になっていることを確認します。",
        en: "Cook pork all the way through. Check that the center is no longer pink and the juices run clear.",
        es: "Cocina el cerdo completamente. Comprueba que el centro ya no esté rosado y que los jugos salgan transparentes.",
        fr: "Faites cuire le porc à cœur. Vérifiez que le centre n'est plus rosé et que le jus qui s'écoule est clair.",
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
