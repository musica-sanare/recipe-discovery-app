import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "shrimp_chawanmushi_rice",
  texts: {
    name: { ja: "えび入り茶碗蒸しとご飯", en: "Chawanmushi (savory steamed egg custard) with shrimp, and rice", es: "Chawanmushi (flan salado de huevo al vapor) con gambas, y arroz", fr: "Chawanmushi (flan salé aux œufs cuit à la vapeur) aux crevettes, et riz" },
    summary: {
      ja: "卵をたっぷり使った大きめの茶碗蒸しに、えびとしいたけを入れて鍋で蒸します。ご飯を添えます。",
      en: "A generous steamed egg custard with shrimp and shiitake, cooked in a pot, with rice.",
      es: "Un flan de huevo al vapor generoso con gambas y shiitake, hecho en una olla, con arroz.",
      fr: "Un généreux flan aux œufs cuit à la vapeur, aux crevettes et aux shiitake, préparé dans une casserole, avec du riz.",
    },
  },
  cuisine: "japanese",
  goals: ["maintain"],
  mainProteinGroup: "egg",
  tags: [],
  minutes: 25,
  effort: 2,
  equipment: ["stove", "pot"],
  servings: 1,
  ingredients: [
    {
      key: "egg",
      food: "egg",
      grams: 150,
      state: "raw",
      cooking: "steam",
      measure: { unit: "piece", quantity: 3 },
      role: "main_protein",
      adjust: { kind: "count", unitGrams: 50, min: 2, max: 4 },
      note: {
        ja: "成分表に蒸した卵の値がないため、生の値で計算しています。",
        en: "The tables have no value for steamed egg, so the raw value is used.",
        es: "Las tablas no tienen un valor para el huevo al vapor, así que se usa el valor en crudo.",
        fr: "Les tables n'ont pas de valeur pour l'œuf cuit à la vapeur ; la valeur à l'état cru est donc utilisée.",
      },
    },
    {
      key: "shrimp",
      food: "shrimp",
      grams: 60,
      state: "raw",
      cooking: "steam",
      role: "main_protein",
      note: {
        ja: "成分表に蒸したえびの値がないため、生の値で計算しています。殻と背わたを除いた重さです。",
        en: "The tables have no value for steamed shrimp, so the raw value is used. Weight after removing the shells and veins.",
        es: "Las tablas no tienen un valor para las gambas al vapor, así que se usa el valor en crudo. Peso sin cáscara ni intestino.",
        fr: "Les tables n'ont pas de valeur pour les crevettes cuites à la vapeur ; la valeur à l'état cru est donc utilisée. Poids après retrait de la carapace et de la veine.",
      },
    },
    { key: "shiitake", food: "shiitake", grams: 20, state: "raw", cooking: "steam", measure: { unit: "piece", quantity: 1 }, role: "vegetable" },
    { key: "soy_sauce", food: "soy_sauce", grams: 6, state: "as_is", measure: { unit: "tsp", quantity: 1 }, role: "seasoning", linkedTo: "egg" },
    { key: "mirin", food: "mirin", grams: 6, state: "as_is", measure: { unit: "tsp", quantity: 1 }, role: "seasoning", linkedTo: "egg" },
    { key: "salt", food: "salt", grams: 0.5, state: "as_is", measure: { unit: "pinch", quantity: 1 }, role: "seasoning", linkedTo: "egg" },
    { key: "green_onion", food: "green_onion", grams: 3, state: "raw", role: "vegetable" },
    { key: "rice", food: "rice_cooked", grams: 200, state: "as_is", role: "main_carb", adjust: { kind: "grams", min: 100, max: 300, step: 10 } },
  ],
  sides: [
    { key: "rice", label: { ja: "ご飯", en: "Rice", es: "Arroz", fr: "Riz" }, ingredients: ["rice"], solverMayRemove: true },
  ],
  steps: [
    {
      key: "prep",
      text: {
        ja: "えびの殻をむいて背わたを取ります。しいたけは軸を取って薄切りにします。",
        en: "Peel and devein the shrimp. Remove the shiitake stem and slice the cap.",
        es: "Pela las gambas y quítales el intestino. Quita el pie del shiitake y lamina el sombrero.",
        fr: "Décortiquez les crevettes et retirez la veine. Retirez le pied du shiitake et émincez le chapeau.",
      },
    },
    {
      key: "custard",
      text: {
        ja: "卵を泡立てないように溶き、水300mL、しょうゆ、みりん、塩を混ぜてこします。耐熱の器にえびとしいたけを入れ、卵液を注いでアルミホイルでふたをします。",
        en: "Beat the eggs without making them frothy, mix in 300 mL of water, the soy sauce, mirin, and salt, and strain. Put the shrimp and shiitake in a heatproof bowl, pour in the egg mixture, and cover with foil.",
        es: "Bate los huevos sin que hagan espuma, mezcla 300 mL de agua, la salsa de soja, el mirin y la sal, y cuélalo. Pon las gambas y el shiitake en un cuenco resistente al calor, vierte la mezcla de huevo y cubre con papel de aluminio.",
        fr: "Battez les œufs sans les faire mousser, incorporez 300 mL d'eau, la sauce soja, le mirin et le sel, et passez au tamis. Mettez les crevettes et le shiitake dans un bol résistant à la chaleur, versez l'appareil et couvrez de papier aluminium.",
      },
    },
    {
      key: "steam",
      text: {
        ja: "鍋に器の高さの3分の1まで湯を沸かして器を入れ、ふたを少しずらして弱火で15〜18分蒸します。竹串を刺して澄んだ汁が出れば蒸し上がりです。",
        en: "Bring water a third of the way up the bowl to a boil in a pot, set the bowl in it, and steam over low heat with the lid slightly ajar for 15–18 minutes. It is done when a skewer comes out with clear liquid.",
        es: "Lleva a ebullición agua en una olla hasta un tercio de la altura del cuenco, coloca el cuenco y cuece al vapor a fuego bajo con la tapa entreabierta 15-18 minutos. Está listo cuando al pinchar con un palillo sale líquido transparente.",
        fr: "Dans une casserole, portez à ébullition de l'eau jusqu'au tiers de la hauteur du bol, posez-y le bol et faites cuire à la vapeur à feu doux, couvercle légèrement entrouvert, pendant 15 à 18 minutes. C'est cuit quand une brochette ressort avec un liquide clair.",
      },
    },
    {
      key: "serve",
      text: {
        ja: "小口切りの青ねぎをのせます。",
        en: "Top with the thinly sliced green onion.",
        es: "Cubre con la cebolleta en rodajas finas.",
        fr: "Parsemez d'oignon vert finement émincé.",
      },
    },
  ],
  safetyNotes: [
    {
      key: "custard_set",
      text: {
        ja: "卵液が固まり、えびの中まで火が通るまで蒸してください。",
        en: "Steam until the custard is set and the shrimp are cooked through.",
        es: "Cuece al vapor hasta que el flan cuaje y las gambas estén bien hechas.",
        fr: "Faites cuire à la vapeur jusqu'à ce que le flan soit pris et que les crevettes soient cuites à cœur.",
      },
    },
    {
      key: "hot_dish",
      text: {
        ja: "蒸し上がった器はとても熱いので、ミトンを使って取り出してください。",
        en: "The steamed bowl is very hot; use oven gloves to take it out.",
        es: "El cuenco sale muy caliente; usa manoplas para sacarlo.",
        fr: "Le bol sort très chaud de la vapeur ; utilisez des maniques pour le sortir.",
      },
    },
  ],
  substitutions: [],
};
