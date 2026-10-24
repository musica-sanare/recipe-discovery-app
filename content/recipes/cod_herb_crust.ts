import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "cod_herb_crust",
  texts: {
    name: { ja: "たらの香草パン粉焼き", en: "Herb-crusted cod", es: "Bacalao con costra de hierbas" },
    summary: {
      ja: "脂の少ないたらに、パセリとにんにくのパン粉をのせてトースターで焼きます。",
      en: "Lean cod topped with parsley and garlic breadcrumbs, baked in a toaster oven.",
      es: "Bacalao magro cubierto con pan rallado, perejil y ajo, horneado en un horno tostador.",
    },
  },
  cuisine: "western",
  goals: ["cut"],
  mainProteinGroup: "fish",
  tags: [],
  minutes: 20,
  effort: 1,
  equipment: ["oven_toaster", "microwave", "pot"],
  servings: 1,
  ingredients: [
    {
      key: "cod",
      food: "cod",
      grams: 200,
      state: "grill",
      role: "main_protein",
      adjust: { kind: "grams", min: 150, max: 260, step: 10 },
      note: {
        ja: "成分表の値は電気ロースターで焼いたものです。",
        en: "The table value is for cod cooked on an electric roaster.",
        es: "El valor de las tablas corresponde a bacalao asado en un asador eléctrico.",
      },
    },
    { key: "panko", food: "panko", grams: 8, state: "as_is", measure: { unit: "tbsp", quantity: 2.5 }, role: "coating", linkedTo: "cod" },
    { key: "parsley", food: "parsley", grams: 3, state: "raw", role: "seasoning", linkedTo: "cod" },
    { key: "garlic", food: "garlic", grams: 3, state: "raw", measure: { unit: "clove", quantity: 0.5 }, role: "seasoning", linkedTo: "cod" },
    { key: "oil", food: "olive_oil", grams: 6, state: "as_is", measure: { unit: "tsp", quantity: 1.5 }, role: "fat", linkedTo: "cod" },
    { key: "salt", food: "salt", grams: 1, state: "as_is", role: "seasoning", linkedTo: "cod" },
    { key: "potato", food: "potato", grams: 150, state: "microwave", measure: { unit: "piece", quantity: 1 }, role: "main_carb", adjust: { kind: "grams", min: 100, max: 300, step: 50 } },
    { key: "tomato", food: "tomato", grams: 80, state: "raw", role: "vegetable" },
    { key: "broccoli", food: "broccoli", grams: 80, state: "boil", role: "vegetable" },
  ],
  sides: [
    { key: "potato", label: { ja: "レンジ蒸しのじゃがいも", en: "Microwaved potato", es: "Patata al microondas" }, ingredients: ["potato"], solverMayRemove: true },
    { key: "broccoli", label: { ja: "ゆでブロッコリー", en: "Boiled broccoli", es: "Brócoli hervido" }, ingredients: ["broccoli"], solverMayRemove: false },
    { key: "tomato", label: { ja: "トマト", en: "Tomato", es: "Tomate" }, ingredients: ["tomato"], solverMayRemove: false },
  ],
  steps: [
    {
      key: "crumb",
      text: {
        ja: "パン粉、みじん切りのパセリとにんにく、オリーブ油を混ぜます。",
        en: "Mix the panko, chopped parsley and garlic, and olive oil.",
        es: "Mezcla el panko, el perejil y el ajo picados y el aceite de oliva.",
      },
    },
    {
      key: "bake",
      text: {
        ja: "たらに塩をふってアルミホイルにのせ、パン粉をのせてトースターで10〜12分焼きます。",
        en: "Salt the cod, place it on foil, top with the breadcrumb mixture, and bake in a toaster oven for 10 to 12 minutes.",
        es: "Sala el bacalao, colócalo sobre papel de aluminio, cúbrelo con la mezcla de pan rallado y hornéalo en el horno tostador de 10 a 12 minutos.",
      },
    },
    {
      key: "potato",
      side: "potato",
      text: {
        ja: "じゃがいもは皮をむいてラップで包み、600Wで4〜5分加熱します。",
        en: "Peel the potato, wrap it in plastic wrap, and microwave at 600 W for 4 to 5 minutes.",
        es: "Pela la patata, envuélvela en film y caliéntala en el microondas a 600 W de 4 a 5 minutos.",
      },
    },
    {
      key: "broccoli",
      side: "broccoli",
      text: {
        ja: "ブロッコリーを2分ゆでます。",
        en: "Boil the broccoli for 2 minutes.",
        es: "Hierve el brócoli 2 minutos.",
      },
    },
    {
      key: "tomato",
      side: "tomato",
      text: {
        ja: "トマトをくし形に切ります。",
        en: "Cut the tomato into wedges.",
        es: "Corta el tomate en gajos.",
      },
    },
  ],
  safetyNotes: [
    {
      key: "cod_doneness",
      text: {
        ja: "たらは中心まで火を通してください。身が白く不透明になり、ほぐれれば焼き上がりです。",
        en: "Cook the cod through; it is done when it is white, opaque, and flakes easily.",
        es: "Cocina el bacalao por completo: está hecho cuando es blanco, opaco y se desmenuza con facilidad.",
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
