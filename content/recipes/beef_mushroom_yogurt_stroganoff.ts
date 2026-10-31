import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "beef_mushroom_yogurt_stroganoff",
  texts: {
    name: { ja: "牛もも肉ときのこのヨーグルトストロガノフ", en: "Lean beef and mushroom stroganoff with yogurt", es: "Stroganoff de ternera y setas con yogur", fr: "Stroganoff de bœuf maigre aux champignons et au yaourt" },
    summary: {
      ja: "ビーフストロガノフを、牛もも肉、しめじ、エリンギで作り、サワークリームの代わりに無脂肪ヨーグルトで仕上げます。ご飯にかけます。作り置きできます。",
      en: "Beef stroganoff made with lean beef, shimeji, and king oyster mushrooms, finished with nonfat yogurt instead of sour cream, over rice. It keeps well.",
      es: "Stroganoff de ternera preparado con ternera magra, setas shimeji y setas de cardo, terminado con yogur desnatado en lugar de nata agria, sobre arroz. Se puede preparar por adelantado.",
      fr: "Un bœuf Stroganoff préparé avec du bœuf maigre, des shimeji et des pleurotes du panicaut, terminé au yaourt 0 % au lieu de la crème aigre, sur du riz. Il se garde bien.",
    },
  },
  cuisine: "western",
  goals: ["bulk"],
  mainProteinGroup: "beef",
  tags: ["batch"],
  minutes: 25,
  effort: 2,
  equipment: ["stove", "frying_pan", "pot"],
  servings: 1,
  ingredients: [
    {
      key: "beef",
      food: "beef_round",
      grams: 190,
      state: "raw",
      cooking: "saute",
      role: "main_protein",
      adjust: { kind: "grams", min: 150, max: 230, step: 20 },
      note: {
        ja: "成分表にフライパンで焼いた牛もも肉の値がないため、生の値で計算しています。",
        en: "The tables have no value for pan-fried beef round, so the raw value is used.",
        es: "Las tablas no tienen un valor para la ternera de pierna hecha en la sartén, así que se usa el valor en crudo.",
        fr: "Les tables n'ont pas de valeur pour la tende de tranche de bœuf poêlée ; la valeur à l'état cru est donc utilisée.",
      },
    },
    { key: "shimeji", food: "shimeji", grams: 80, state: "stir_fry", role: "vegetable" },
    {
      key: "eringi",
      food: "eringi",
      grams: 60,
      state: "raw",
      cooking: "stir_fry",
      measure: { unit: "piece", quantity: 1 },
      role: "vegetable",
      note: {
        ja: "成分表に炒めたエリンギの値がないため、生の値で計算しています。",
        en: "The tables have no value for stir-fried king oyster mushrooms, so the raw value is used.",
        es: "Las tablas no tienen un valor para las setas de cardo salteadas, así que se usa el valor en crudo.",
        fr: "Les tables n'ont pas de valeur pour les pleurotes du panicaut sautés ; la valeur à l'état cru est donc utilisée.",
      },
    },
    { key: "onion", food: "onion", grams: 60, state: "stir_fry", role: "vegetable" },
    { key: "oil_onion", food: "vegetable_oil", grams: 5, state: "as_is", measure: { unit: "tsp", quantity: 1.25 }, role: "fat", includedIn: "onion" },
    { key: "yogurt", food: "yogurt_nonfat", grams: 100, state: "as_is", role: "other" },
    { key: "paprika", food: "paprika_powder", grams: 2, state: "as_is", measure: { unit: "tsp", quantity: 1 }, role: "seasoning" },
    { key: "salt", food: "salt", grams: 1, state: "as_is", measure: { unit: "pinch", quantity: 2 }, role: "seasoning" },
    { key: "rice", food: "rice_cooked", grams: 300, state: "as_is", role: "main_carb", adjust: { kind: "grams", min: 250, max: 350, step: 50 } },
  ],
  sides: [],
  steps: [
    {
      key: "prep",
      text: {
        ja: "牛もも肉を細切りにし、塩の半量をふります。玉ねぎは薄切り、しめじは小房に分け、エリンギは縦に薄切りにします。",
        en: "Cut the beef into thin strips and sprinkle with half of the salt. Slice the onion thinly, break the shimeji into small clusters, and slice the king oyster mushrooms thinly lengthwise.",
        es: "Corta la ternera en tiras finas y échale la mitad de la sal. Corta la cebolla en láminas finas, separa las shimeji en ramitos y corta las setas de cardo en láminas finas a lo largo.",
        fr: "Coupez le bœuf en fines lanières et saupoudrez-le de la moitié du sel. Émincez finement l'oignon, séparez les shimeji en petites touffes et émincez finement les pleurotes dans la longueur.",
      },
    },
    {
      key: "stir_fry",
      text: {
        ja: "フライパンに油を中火で熱し、玉ねぎを3分炒めます。牛肉を加えて色が完全に変わるまで炒め、きのことパプリカパウダーを加えて3分炒めます。",
        en: "Heat the oil in a frying pan over medium heat and sauté the onion for 3 minutes. Add the beef and stir-fry until it has completely changed color, then add the mushrooms and paprika and stir-fry for 3 minutes.",
        es: "Calienta el aceite en una sartén a fuego medio y sofríe la cebolla 3 minutos. Añade la ternera y saltéala hasta que cambie de color por completo; después añade las setas y el pimentón y saltea 3 minutos.",
        fr: "Faites chauffer l'huile dans une poêle à feu moyen et faites revenir l'oignon 3 minutes. Ajoutez le bœuf et faites-le sauter jusqu'à ce qu'il ait complètement changé de couleur, puis ajoutez les champignons et le paprika et faites sauter 3 minutes.",
      },
    },
    {
      key: "sauce",
      text: {
        ja: "水50mLと残りの塩を加えて2分煮ます。火を止めてからヨーグルトを加えて混ぜ、弱火で温めます。煮立てると分離しやすくなります。",
        en: "Add 50 mL of water and the rest of the salt and simmer for 2 minutes. Turn off the heat, stir in the yogurt, and warm it over low heat; boiling makes it separate.",
        es: "Añade 50 mL de agua y el resto de la sal y cuece 2 minutos. Apaga el fuego, añade el yogur, remueve y calienta a fuego bajo; si hierve, se corta.",
        fr: "Ajoutez 50 mL d'eau et le reste du sel et laissez mijoter 2 minutes. Éteignez le feu, incorporez le yaourt et réchauffez à feu doux ; s'il bout, il tranche.",
      },
    },
    {
      key: "serve",
      text: { ja: "ご飯を器に盛り、ストロガノフをかけます。", en: "Put the rice on a plate and spoon the stroganoff over.", es: "Pon el arroz en un plato y sirve el stroganoff por encima.", fr: "Mettez le riz dans une assiette et nappez-le de stroganoff." },
    },
  ],
  safetyNotes: [
    {
      key: "beef_doneness",
      text: {
        ja: "細切りの牛肉は、色が完全に変わるまで炒めてください。",
        en: "Stir-fry the beef strips until they have completely changed color.",
        es: "Saltea las tiras de ternera hasta que cambien de color por completo.",
        fr: "Faites sauter les lanières de bœuf jusqu'à ce qu'elles aient complètement changé de couleur.",
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
