import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "chum_salmon_foil_mushroom",
  texts: {
    name: { ja: "生鮭ときのこのホイル焼き", en: "Chum salmon and mushrooms baked in foil", es: "Salmón keta con setas en papillote de aluminio", fr: "Saumon kéta et champignons en papillote" },
    summary: {
      ja: "生鮭、エリンギ、しめじ、玉ねぎをアルミホイルで包み、トースターで蒸し焼きにします。しょうゆとレモンで食べます。ご飯を添えます。",
      en: "Chum salmon, king oyster mushrooms, shimeji, and onion wrapped in aluminum foil and steamed in a toaster oven, seasoned with soy sauce and lemon, with rice.",
      es: "Salmón keta, setas de cardo, setas shimeji y cebolla envueltos en papel de aluminio y hechos al vapor en el horno tostador, con salsa de soja y limón, con arroz.",
      fr: "Saumon kéta, pleurotes du panicaut, shimeji et oignon enveloppés dans du papier aluminium et cuits à l'étouffée au four grille-pain, assaisonnés de sauce soja et de citron, avec du riz.",
    },
  },
  cuisine: "japanese",
  goals: ["cut"],
  mainProteinGroup: "fish",
  tags: [],
  minutes: 20,
  effort: 1,
  equipment: ["oven_toaster"],
  servings: 1,
  ingredients: [
    {
      key: "salmon",
      food: "chum_salmon",
      grams: 150,
      state: "raw",
      cooking: "steam",
      role: "main_protein",
      adjust: { kind: "grams", min: 110, max: 190, step: 20 },
      note: {
        ja: "成分表に蒸した白鮭の値がないため、生の値で計算しています。",
        en: "The tables have no value for steamed chum salmon, so the raw value is used.",
        es: "Las tablas no tienen un valor para el salmón keta al vapor, así que se usa el valor en crudo.",
        fr: "Les tables n'ont pas de valeur pour le saumon kéta cuit à la vapeur ; la valeur à l'état cru est donc utilisée.",
      },
    },
    {
      key: "eringi",
      food: "eringi",
      grams: 60,
      state: "raw",
      cooking: "steam",
      measure: { unit: "piece", quantity: 1 },
      role: "vegetable",
      note: {
        ja: "成分表に蒸したエリンギの値がないため、生の値で計算しています。",
        en: "The tables have no value for steamed king oyster mushrooms, so the raw value is used.",
        es: "Las tablas no tienen un valor para las setas de cardo al vapor, así que se usa el valor en crudo.",
        fr: "Les tables n'ont pas de valeur pour les pleurotes du panicaut cuits à la vapeur ; la valeur à l'état cru est donc utilisée.",
      },
    },
    { key: "shimeji", food: "shimeji", grams: 50, state: "raw", cooking: "steam", role: "vegetable" },
    { key: "onion", food: "onion", grams: 40, state: "raw", cooking: "steam", role: "vegetable" },
    { key: "soy_sauce", food: "soy_sauce", grams: 6, state: "as_is", measure: { unit: "tsp", quantity: 1 }, role: "seasoning", linkedTo: "salmon" },
    { key: "sake", food: "cooking_sake", grams: 10, state: "as_is", measure: { unit: "tsp", quantity: 2 }, role: "seasoning", linkedTo: "salmon" },
    { key: "lemon", food: "lemon_juice", grams: 5, state: "as_is", measure: { unit: "tsp", quantity: 1 }, role: "seasoning" },
    { key: "rice", food: "rice_cooked", grams: 180, state: "as_is", role: "main_carb", adjust: { kind: "grams", min: 150, max: 240, step: 30 } },
  ],
  sides: [
    { key: "rice", label: { ja: "ご飯", en: "Rice", es: "Arroz", fr: "Riz" }, ingredients: ["rice"], solverMayRemove: true },
  ],
  steps: [
    {
      key: "prep",
      text: {
        ja: "エリンギは縦に薄切り、しめじは小房に分け、玉ねぎは薄切りにします。",
        en: "Slice the king oyster mushrooms thinly lengthwise, break the shimeji into small clusters, and slice the onion thinly.",
        es: "Corta las setas de cardo en láminas finas a lo largo, separa las shimeji en ramitos y corta la cebolla en láminas finas.",
        fr: "Émincez finement les pleurotes dans la longueur, séparez les shimeji en petites touffes et émincez finement l'oignon.",
      },
    },
    {
      key: "wrap",
      text: {
        ja: "アルミホイルを30cmほど広げ、玉ねぎを敷いて鮭をのせ、きのこをのせます。料理酒をふり、口をしっかり閉じて包みます。",
        en: "Spread out about 30 cm of aluminum foil, lay the onion on it, put the salmon on top, and add the mushrooms. Sprinkle with the cooking sake and seal the parcel tightly.",
        es: "Extiende unos 30 cm de papel de aluminio, pon la cebolla, coloca encima el salmón y añade las setas. Rocía con el sake de cocina y cierra bien el paquete.",
        fr: "Étalez environ 30 cm de papier aluminium, posez-y l'oignon, placez le saumon dessus et ajoutez les champignons. Arrosez de saké de cuisine et fermez hermétiquement la papillote.",
      },
    },
    {
      key: "bake",
      text: {
        ja: "トースターで15分ほど焼き、鮭の中まで火が通っていることを確かめます。",
        en: "Cook in the toaster oven for about 15 minutes and check that the salmon is cooked through.",
        es: "Hornéalo en el horno tostador unos 15 minutos y comprueba que el salmón esté bien hecho.",
        fr: "Faites cuire environ 15 minutes au four grille-pain et vérifiez que le saumon est cuit à cœur.",
      },
    },
    {
      key: "serve",
      text: {
        ja: "ホイルごと器にのせ、しょうゆとレモン果汁をかけます。",
        en: "Put the parcel on a plate and pour the soy sauce and lemon juice over.",
        es: "Pon el paquete en un plato y vierte por encima la salsa de soja y el zumo de limón.",
        fr: "Posez la papillote sur une assiette et arrosez de sauce soja et de jus de citron.",
      },
    },
    {
      key: "rice",
      side: "rice",
      text: { ja: "ご飯を添えます。", en: "Serve with the rice.", es: "Acompáñalo con el arroz.", fr: "Servez avec le riz." },
    },
  ],
  safetyNotes: [
    {
      key: "salmon_doneness",
      text: {
        ja: "鮭は中心まで火を通してください。身がほぐれやすく、不透明になっていれば焼き上がりです。",
        en: "Cook the salmon through; it is done when it is opaque and flakes easily.",
        es: "Cocina el salmón por completo: está hecho cuando es opaco y se desmenuza con facilidad.",
        fr: "Faites cuire le saumon à cœur ; il est cuit quand sa chair est opaque et s'effeuille facilement.",
      },
    },
    {
      key: "steam",
      text: {
        ja: "ホイルを開けるときは蒸気でやけどしやすいので、顔を近づけずに奥から手前に向かって開いてください。",
        en: "Steam can burn when you open the foil; keep your face away and open it away from you.",
        es: "El vapor puede quemar al abrir el papel de aluminio; aparta la cara y ábrelo en dirección contraria a ti.",
        fr: "La vapeur peut brûler à l'ouverture de la papillote ; éloignez votre visage et ouvrez-la du côté opposé à vous.",
      },
    },
    {
      key: "fish_bones",
      text: {
        ja: "切り身にも小骨が残っていることがあります。食べるときは骨に注意してください。",
        en: "Fillets may still have small bones; take care when eating.",
        es: "Los filetes pueden tener alguna espina pequeña; ten cuidado al comerlos.",
        fr: "Les filets peuvent encore contenir de petites arêtes ; faites attention en mangeant.",
      },
    },
  ],
  substitutions: [],
};
