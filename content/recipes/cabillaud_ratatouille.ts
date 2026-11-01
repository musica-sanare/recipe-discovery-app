import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "cabillaud_ratatouille",
  texts: {
    name: { ja: "たらのロースト、ラタトゥイユ添え", en: "Roast cod with ratatouille", es: "Bacalao asado con ratatouille", fr: "Cabillaud rôti et ratatouille" },
    summary: {
      ja: "プロヴァンスの野菜の煮込みラタトゥイユに、トースターで焼いたたらをのせます。パンを添えます。",
      en: "Provençal ratatouille, a stew of summer vegetables, topped with cod roasted in a toaster oven. With bread.",
      es: "Ratatouille provenzal, un guiso de verduras de verano, con bacalao asado en el horno tostador. Con pan.",
      fr: "Une ratatouille provençale, mijotée de légumes d'été, surmontée de cabillaud rôti au four grille-pain. Avec du pain.",
    },
  },
  cuisine: "french",
  goals: ["cut"],
  mainProteinGroup: "fish",
  tags: [],
  minutes: 30,
  effort: 2,
  equipment: ["stove", "frying_pan", "oven_toaster"],
  servings: 1,
  ingredients: [
    { key: "cod", food: "cod", grams: 120, state: "grill", measure: { unit: "piece", quantity: 1 }, role: "main_protein", adjust: { kind: "grams", min: 80, max: 160, step: 20 } },
    { key: "salt_cod", food: "salt", grams: 0.8, state: "as_is", measure: { unit: "pinch", quantity: 1.5 }, role: "seasoning", linkedTo: "cod" },
    { key: "oil_cod", food: "olive_oil", grams: 3, state: "as_is", measure: { unit: "tsp", quantity: 0.75 }, role: "fat", linkedTo: "cod" },
    { key: "eggplant", food: "eggplant", grams: 70, state: "stir_fry", measure: { unit: "piece", quantity: 1 }, role: "vegetable" },
    { key: "red_pepper", food: "red_pepper", grams: 40, state: "stir_fry", measure: { unit: "piece", quantity: 0.25 }, role: "vegetable" },
    { key: "onion", food: "onion", grams: 40, state: "stir_fry", measure: { unit: "piece", quantity: 0.25 }, role: "vegetable" },
    { key: "oil_vegetables", food: "olive_oil", grams: 8, state: "as_is", measure: { unit: "tsp", quantity: 2 }, role: "fat", includedIn: "eggplant" },
    {
      key: "zucchini",
      food: "zucchini",
      grams: 70,
      state: "raw",
      cooking: "simmer",
      measure: { unit: "piece", quantity: 0.5 },
      role: "vegetable",
      note: {
        ja: "成分表に煮込んだズッキーニの値がないため、生の値で計算しています。",
        en: "The tables have no value for stewed zucchini, so the raw value is used.",
        es: "Las tablas no tienen un valor para el calabacín guisado, así que se usa el valor en crudo.",
        fr: "Les tables n'ont pas de valeur pour la courgette mijotée ; la valeur à l'état cru est donc utilisée.",
      },
    },
    { key: "garlic", food: "garlic", grams: 5, state: "raw", measure: { unit: "clove", quantity: 1 }, role: "seasoning" },
    { key: "tomato_canned", food: "tomato_canned", grams: 120, state: "as_is", measure: { unit: "can", quantity: 0.25 }, role: "vegetable" },
    { key: "thyme", food: "thyme", grams: 0.3, state: "as_is", measure: { unit: "pinch", quantity: 1 }, role: "seasoning" },
    { key: "salt", food: "salt", grams: 0.8, state: "as_is", measure: { unit: "pinch", quantity: 1.5 }, role: "seasoning" },
    { key: "pepper", food: "black_pepper", grams: 0.2, state: "as_is", measure: { unit: "pinch", quantity: 1 }, role: "seasoning" },
    { key: "bread", food: "baguette", grams: 60, state: "as_is", role: "main_carb", adjust: { kind: "grams", min: 40, max: 100, step: 20 } },
  ],
  sides: [{ key: "bread", label: { ja: "フランスパン", en: "Baguette", es: "Pan de barra", fr: "Baguette" }, ingredients: ["bread"], solverMayRemove: true }],
  steps: [
    {
      key: "prep",
      text: {
        ja: "なす、ズッキーニ、パプリカは2cm角、玉ねぎは1cm角に切り、にんにくはつぶします。",
        en: "Cut the eggplant, zucchini, and red pepper into 2 cm pieces and the onion into 1 cm pieces, and crush the garlic.",
        es: "Corta la berenjena, el calabacín y el pimiento rojo en dados de 2 cm y la cebolla en dados de 1 cm, y machaca el ajo.",
        fr: "Coupez l'aubergine, la courgette et le poivron rouge en dés de 2 cm et l'oignon en dés de 1 cm, puis écrasez l'ail.",
      },
    },
    {
      key: "ratatouille",
      text: {
        ja: "フライパンにオリーブオイルとにんにくを入れて中火にかけ、玉ねぎ、なす、パプリカを5分炒めます。ズッキーニ、トマト缶、タイム、塩、こしょうを加え、ふたをして弱めの中火で15分煮ます。",
        en: "Heat the olive oil and garlic in a frying pan over medium heat and stir-fry the onion, eggplant, and red pepper for 5 minutes. Add the zucchini, canned tomatoes, thyme, salt, and pepper, cover, and simmer over medium-low heat for 15 minutes.",
        es: "Calienta el aceite de oliva con el ajo en una sartén a fuego medio y saltea la cebolla, la berenjena y el pimiento rojo 5 minutos. Añade el calabacín, el tomate en lata, el tomillo, la sal y la pimienta, tapa y cuece a fuego medio-bajo 15 minutos.",
        fr: "Faites chauffer l'huile d'olive et l'ail dans une poêle à feu moyen et faites revenir l'oignon, l'aubergine et le poivron rouge 5 minutes. Ajoutez la courgette, les tomates en conserve, le thym, le sel et le poivre, couvrez et laissez mijoter 15 minutes à feu moyen-doux.",
      },
    },
    {
      key: "cod",
      text: {
        ja: "ラタトゥイユを煮ている間に、たらに塩をふってオリーブオイルを塗り、アルミホイルにのせてトースターで10〜12分焼きます。",
        en: "While the ratatouille simmers, salt the cod, brush it with the olive oil, place it on foil, and roast in a toaster oven for 10 to 12 minutes.",
        es: "Mientras se cuece el ratatouille, sala el bacalao, úntalo con el aceite de oliva, colócalo sobre papel de aluminio y ásalo en el horno tostador de 10 a 12 minutos.",
        fr: "Pendant que la ratatouille mijote, salez le cabillaud, badigeonnez-le d'huile d'olive, posez-le sur du papier aluminium et faites-le rôtir 10 à 12 minutes au four grille-pain.",
      },
    },
    {
      key: "serve",
      text: {
        ja: "ラタトゥイユを器に盛り、たらをのせます。",
        en: "Spoon the ratatouille onto a plate and place the cod on top.",
        es: "Sirve el ratatouille en un plato y coloca el bacalao encima.",
        fr: "Dressez la ratatouille dans une assiette et posez le cabillaud dessus.",
      },
    },
    { key: "bread", side: "bread", text: { ja: "フランスパンを添えます。", en: "Serve with the baguette.", es: "Acompáñalo con el pan de barra.", fr: "Servez avec la baguette." } },
  ],
  safetyNotes: [
    {
      key: "cod_doneness",
      text: {
        ja: "たらは中心まで火を通してください。身が白く不透明になり、ほぐれれば焼き上がりです。",
        en: "Cook the cod through; it is done when it is white, opaque, and flakes easily.",
        es: "Cocina el bacalao por completo: está hecho cuando es blanco, opaco y se desmenuza con facilidad.",
        fr: "Faites cuire le cabillaud à cœur ; il est cuit quand sa chair est blanche, opaque et s'effeuille facilement.",
      },
    },
  ],
  substitutions: [],
};
