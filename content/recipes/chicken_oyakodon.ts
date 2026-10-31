import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "chicken_oyakodon",
  texts: {
    name: { ja: "鶏むね肉の親子丼", en: "Chicken breast oyakodon (chicken and egg rice bowl)", es: "Oyakodon de pechuga de pollo (bol de arroz con pollo y huevo)", fr: "Oyakodon au blanc de poulet (bol de riz au poulet et à l'œuf)" },
    summary: {
      ja: "甘辛いつゆで鶏むね肉と玉ねぎを煮て、溶き卵でとじてご飯にのせます。",
      en: "Chicken breast and onion simmered in a sweet soy broth, set with beaten egg, and served over rice.",
      es: "Pechuga de pollo y cebolla cocidas en un caldo dulce de soja, cuajadas con huevo batido y servidas sobre arroz.",
      fr: "Blanc de poulet et oignon mijotés dans un bouillon sucré à la sauce soja, liés à l'œuf battu et servis sur du riz.",
    },
  },
  cuisine: "japanese",
  goals: ["bulk"],
  mainProteinGroup: "chicken",
  tags: [],
  minutes: 20,
  effort: 2,
  equipment: ["stove", "frying_pan"],
  servings: 1,
  ingredients: [
    {
      key: "chicken",
      food: "chicken_breast",
      grams: 180,
      state: "raw",
      cooking: "simmer",
      role: "main_protein",
      adjust: { kind: "grams", min: 120, max: 240, step: 20 },
      note: {
        ja: "成分表に煮た鶏むね肉の値がないため、生の値で計算しています。",
        en: "The tables have no value for simmered chicken breast, so the raw value is used.",
        es: "Las tablas no tienen un valor para la pechuga de pollo cocida, así que se usa el valor en crudo.",
        fr: "Les tables n'ont pas de valeur pour le blanc de poulet mijoté ; la valeur à l'état cru est donc utilisée.",
      },
    },
    {
      key: "egg",
      food: "egg",
      grams: 100,
      state: "boil",
      cooking: "simmer",
      measure: { unit: "piece", quantity: 2 },
      role: "main_protein",
      adjust: { kind: "count", unitGrams: 50, min: 1, max: 3 },
      note: {
        ja: "成分表に煮汁でとじた卵の値がないため、ゆで卵の値で計算しています。",
        en: "The tables have no value for egg set in broth, so the boiled-egg value is used.",
        es: "Las tablas no tienen un valor para el huevo cuajado en caldo, así que se usa el valor del huevo cocido.",
        fr: "Les tables n'ont pas de valeur pour l'œuf pris dans un bouillon ; la valeur de l'œuf dur est donc utilisée.",
      },
    },
    { key: "onion", food: "onion", grams: 60, state: "raw", cooking: "simmer", measure: { unit: "piece", quantity: 0.25 }, role: "vegetable" },
    { key: "soy_sauce", food: "soy_sauce", grams: 18, state: "as_is", measure: { unit: "tbsp", quantity: 1 }, role: "seasoning", linkedTo: "chicken" },
    { key: "mirin", food: "mirin", grams: 18, state: "as_is", measure: { unit: "tbsp", quantity: 1 }, role: "seasoning", linkedTo: "chicken" },
    { key: "sugar", food: "sugar", grams: 3, state: "as_is", measure: { unit: "tsp", quantity: 1 }, role: "seasoning", linkedTo: "chicken" },
    { key: "green_onion", food: "green_onion", grams: 5, state: "raw", role: "vegetable" },
    { key: "rice", food: "rice_cooked", grams: 300, state: "as_is", role: "main_carb", adjust: { kind: "grams", min: 200, max: 400, step: 10 } },
  ],
  sides: [],
  steps: [
    {
      key: "prep",
      text: {
        ja: "鶏むね肉をひと口大のそぎ切りにし、玉ねぎは薄切りにします。卵は軽く溶きほぐします。",
        en: "Cut the chicken breast into bite-size slices and thinly slice the onion. Lightly beat the eggs.",
        es: "Corta la pechuga de pollo en lonchas pequeñas y la cebolla en láminas finas. Bate ligeramente los huevos.",
        fr: "Coupez le blanc de poulet en tranches de la taille d'une bouchée et émincez finement l'oignon. Battez légèrement les œufs.",
      },
    },
    {
      key: "simmer",
      text: {
        ja: "フライパンに水80mL、しょうゆ、みりん、砂糖を入れて中火で煮立て、玉ねぎと鶏肉を入れてふたをし、5分煮ます。",
        en: "Bring 80 mL of water, the soy sauce, mirin, and sugar to a boil in a frying pan over medium heat, add the onion and chicken, cover, and simmer for 5 minutes.",
        es: "Lleva a ebullición 80 mL de agua, la salsa de soja, el mirin y el azúcar en una sartén a fuego medio, añade la cebolla y el pollo, tapa y cuece 5 minutos.",
        fr: "Portez à ébullition 80 mL d'eau, la sauce soja, le mirin et le sucre dans une poêle à feu moyen, ajoutez l'oignon et le poulet, couvrez et laissez mijoter 5 minutes.",
      },
    },
    {
      key: "check",
      text: {
        ja: "鶏肉を1切れ切って、中までピンク色がないことを確かめます。",
        en: "Cut one piece of chicken to check that no pink remains inside.",
        es: "Corta un trozo de pollo para comprobar que no queda nada rosado por dentro.",
        fr: "Coupez un morceau de poulet pour vérifier qu'il ne reste plus de rose à l'intérieur.",
      },
    },
    {
      key: "egg",
      text: {
        ja: "溶き卵を回し入れ、ふたをして弱火で1分、卵が好みの固さになるまで加熱します。",
        en: "Pour in the beaten eggs, cover, and cook over low heat for about 1 minute until the eggs are as firm as you like.",
        es: "Vierte los huevos batidos, tapa y cocina a fuego bajo alrededor de 1 minuto hasta que los huevos tengan la firmeza que prefieras.",
        fr: "Versez les œufs battus, couvrez et faites cuire environ 1 minute à feu doux, jusqu'à ce que les œufs aient la consistance souhaitée.",
      },
    },
    {
      key: "serve",
      text: {
        ja: "ご飯にのせ、小口切りの青ねぎを散らします。",
        en: "Slide onto the rice and scatter the thinly sliced green onion.",
        es: "Desliza sobre el arroz y esparce la cebolleta en rodajas finas.",
        fr: "Faites glisser sur le riz et parsemez d'oignon vert finement émincé.",
      },
    },
  ],
  safetyNotes: [
    {
      key: "chicken_doneness",
      text: {
        ja: "鶏肉は中心まで火を通してください。切り口にピンク色が残っていれば、さらに加熱します。",
        en: "Cook chicken through. If any pink remains when you cut it, cook it longer.",
        es: "Cocina bien el pollo. Si queda algo rosado al cortarlo, cocínalo más tiempo.",
        fr: "Faites cuire le poulet à cœur. S'il reste du rose à la découpe, prolongez la cuisson.",
      },
    },
    {
      key: "soft_egg",
      text: {
        ja: "半熟の卵は、妊娠中の方、乳幼児、高齢の方、体調のすぐれない方には向きません。その場合は卵が固まるまで加熱してください。",
        en: "Soft-cooked eggs are not recommended for pregnant people, young children, older adults, or anyone unwell; for them, cook until the eggs are set.",
        es: "Los huevos poco cuajados no se recomiendan para embarazadas, niños pequeños, personas mayores o enfermas; en esos casos, cocínalos hasta que cuajen.",
        fr: "Les œufs peu cuits sont déconseillés aux femmes enceintes, aux jeunes enfants, aux personnes âgées et aux personnes malades ; pour elles, faites cuire les œufs jusqu'à ce qu'ils soient pris.",
      },
    },
  ],
  substitutions: [],
};
