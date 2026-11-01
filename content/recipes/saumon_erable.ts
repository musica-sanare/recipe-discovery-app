import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "saumon_erable",
  texts: {
    name: { ja: "白鮭のメープルマスタード焼き", en: "Maple-mustard chum salmon", es: "Salmón keta al arce y mostaza", fr: "Saumon kéta à l'érable et à la moutarde" },
    summary: {
      ja: "ケベックの家庭料理をヒントに、メープルシロップとマスタードを塗った白鮭をトースターで焼きます。さやいんげんとゆでたじゃがいもを添えます。",
      en: "Inspired by home cooking in Québec: chum salmon brushed with maple syrup and mustard and grilled in a toaster oven, with green beans and boiled potatoes.",
      es: "Inspirado en la cocina casera de Quebec: salmón keta untado con sirope de arce y mostaza y asado en el horno tostador, con judías verdes y patatas cocidas.",
      fr: "Inspiré de la cuisine familiale québécoise : saumon kéta badigeonné de sirop d'érable et de moutarde, grillé au four grille-pain, avec des haricots verts et des pommes de terre à l'eau.",
    },
  },
  cuisine: "western",
  goals: ["cut"],
  mainProteinGroup: "fish",
  tags: [],
  minutes: 20,
  effort: 1,
  equipment: ["stove", "pot", "oven_toaster"],
  servings: 1,
  ingredients: [
    { key: "salmon", food: "chum_salmon", grams: 140, state: "grill", measure: { unit: "piece", quantity: 1.5 }, role: "main_protein", adjust: { kind: "grams", min: 100, max: 180, step: 20 } },
    { key: "salt", food: "salt", grams: 0.6, state: "as_is", measure: { unit: "pinch", quantity: 1 }, role: "seasoning", linkedTo: "salmon" },
    { key: "maple", food: "maple_syrup", grams: 10, state: "as_is", measure: { unit: "tsp", quantity: 1.5 }, role: "seasoning", linkedTo: "salmon" },
    { key: "mustard", food: "dijon_mustard", grams: 5, state: "as_is", measure: { unit: "tsp", quantity: 1 }, role: "seasoning", linkedTo: "salmon" },
    { key: "pepper", food: "black_pepper", grams: 0.2, state: "as_is", measure: { unit: "pinch", quantity: 1 }, role: "seasoning" },
    { key: "green_beans", food: "green_beans", grams: 80, state: "boil", role: "vegetable" },
    { key: "potato", food: "potato", grams: 250, state: "simmer", measure: { unit: "piece", quantity: 2 }, role: "main_carb", adjust: { kind: "grams", min: 150, max: 350, step: 50 } },
    { key: "parsley", food: "parsley", grams: 2, state: "raw", role: "vegetable" },
  ],
  sides: [{ key: "potato", label: { ja: "ゆでたじゃがいも", en: "Boiled potatoes", es: "Patatas cocidas", fr: "Pommes de terre à l'eau" }, ingredients: ["potato"], solverMayRemove: true }],
  steps: [
    {
      key: "potato",
      side: "potato",
      text: {
        ja: "じゃがいもは皮をむいて4等分にし、鍋に入れて水からやわらかくなるまで15分ほどゆでます。",
        en: "Peel the potatoes, cut them into quarters, and boil them from cold water for about 15 minutes, until tender.",
        es: "Pela las patatas, córtalas en cuartos y cuécelas partiendo de agua fría unos 15 minutos, hasta que estén tiernas.",
        fr: "Pelez les pommes de terre, coupez-les en quatre et faites-les cuire environ 15 minutes en partant d'eau froide, jusqu'à ce qu'elles soient tendres.",
      },
    },
    {
      key: "glaze",
      text: {
        ja: "鮭に塩とこしょうをふり、アルミホイルにのせます。メープルシロップとマスタードを混ぜて鮭に塗ります。",
        en: "Season the salmon with the salt and pepper and place it on foil. Mix the maple syrup and mustard and brush it over the salmon.",
        es: "Salpimienta el salmón y colócalo sobre papel de aluminio. Mezcla el sirope de arce con la mostaza y úntalo sobre el salmón.",
        fr: "Salez et poivrez le saumon et posez-le sur du papier aluminium. Mélangez le sirop d'érable et la moutarde et badigeonnez-en le saumon.",
      },
    },
    {
      key: "grill",
      text: {
        ja: "トースターで10〜12分焼きます。焦げそうなら途中でアルミホイルをかぶせます。",
        en: "Grill in a toaster oven for 10 to 12 minutes. Cover with foil partway through if it starts to burn.",
        es: "Ásalo en el horno tostador de 10 a 12 minutos. Si se tuesta demasiado, cúbrelo con papel de aluminio a mitad de cocción.",
        fr: "Faites griller 10 à 12 minutes au four grille-pain. Couvrez de papier aluminium en cours de cuisson si le dessus colore trop.",
      },
    },
    {
      key: "beans",
      text: {
        ja: "じゃがいもがゆで上がる3分前に、筋を取ったさやいんげんを鍋に加えて一緒にゆで、湯を切ります。鮭に添え、刻んだパセリを散らします。",
        en: "Three minutes before the potatoes are done, add the trimmed green beans to the pot, then drain. Serve with the salmon and sprinkle with the chopped parsley.",
        es: "Tres minutos antes de que las patatas estén hechas, añade las judías verdes limpias a la olla y luego escurre. Sírvelas con el salmón y espolvorea con el perejil picado.",
        fr: "Trois minutes avant la fin de la cuisson des pommes de terre, ajoutez les haricots verts équeutés dans la casserole, puis égouttez. Servez avec le saumon et parsemez de persil haché.",
      },
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
  ],
  substitutions: [],
};
