import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "chum_salmon_breakfast_brown_rice",
  texts: {
    name: { ja: "焼き鮭と玄米の朝ごはん", en: "Grilled chum salmon breakfast with brown rice", es: "Desayuno de salmón keta asado con arroz integral" },
    summary: {
      ja: "和食の朝ごはんを、トースターで焼いた生鮭、玄米ご飯、豆腐とねぎのみそ汁、ほうれん草のおひたしでそろえます。",
      en: "A Japanese breakfast set: chum salmon grilled in a toaster oven, brown rice, miso soup with tofu and green onion, and boiled spinach with soy sauce.",
      es: "Un desayuno japonés: salmón keta asado en el horno tostador, arroz integral, sopa de miso con tofu y cebolleta, y espinacas hervidas con salsa de soja.",
    },
  },
  cuisine: "japanese",
  goals: ["maintain"],
  mainProteinGroup: "fish",
  tags: ["breakfast"],
  minutes: 20,
  effort: 1,
  equipment: ["oven_toaster", "stove", "pot"],
  servings: 1,
  ingredients: [
    { key: "salmon", food: "chum_salmon", grams: 140, state: "grill", role: "main_protein", adjust: { kind: "grams", min: 100, max: 180, step: 20 } },
    { key: "salt", food: "salt", grams: 0.5, state: "as_is", measure: { unit: "pinch", quantity: 1 }, role: "seasoning", linkedTo: "salmon" },
    { key: "rice", food: "brown_rice_cooked", grams: 250, state: "as_is", role: "main_carb", adjust: { kind: "grams", min: 200, max: 300, step: 50 } },
    { key: "miso", food: "miso", grams: 12, state: "as_is", measure: { unit: "tsp", quantity: 2 }, role: "seasoning" },
    {
      key: "tofu",
      food: "tofu_silken",
      grams: 50,
      state: "raw",
      cooking: "simmer",
      role: "other",
      note: {
        ja: "成分表に煮た豆腐の値がないため、生の値で計算しています。",
        en: "The tables have no value for simmered tofu, so the raw value is used.",
        es: "Las tablas no tienen un valor para el tofu cocido, así que se usa el valor en crudo.",
      },
    },
    { key: "green_onion", food: "green_onion", grams: 5, state: "raw", role: "vegetable" },
    { key: "spinach", food: "spinach", grams: 60, state: "boil", role: "vegetable" },
    { key: "soy_sauce", food: "soy_sauce", grams: 3, state: "as_is", measure: { unit: "tsp", quantity: 0.5 }, role: "seasoning" },
  ],
  sides: [],
  steps: [
    {
      key: "salmon",
      text: {
        ja: "生鮭に塩をふって10分おき、水気を拭きます。アルミホイルを敷いたトースターの天板にのせ、10〜12分焼きます。",
        en: "Sprinkle the salmon with the salt, leave for 10 minutes, and pat dry. Put it on a toaster oven tray lined with aluminum foil and cook for 10–12 minutes.",
        es: "Echa la sal al salmón, déjalo 10 minutos y sécalo. Ponlo en la bandeja del horno tostador forrada con papel de aluminio y ásalo 10-12 minutos.",
      },
    },
    {
      key: "spinach",
      text: {
        ja: "ほうれん草を熱湯で1分ほどゆで、水にとって絞り、3cm長さに切ってしょうゆをかけます。",
        en: "Boil the spinach for about 1 minute, cool it in water, squeeze it, cut it into 3 cm lengths, and pour the soy sauce over.",
        es: "Hierve las espinacas aproximadamente 1 minuto, enfríalas en agua, escúrrelas, córtalas en trozos de 3 cm y rocíalas con la salsa de soja.",
      },
    },
    {
      key: "miso_soup",
      text: {
        ja: "小鍋に水200mLを沸かし、さいの目に切った豆腐を入れて温めます。火を弱めてみそを溶き入れ、沸騰させずに火を止め、小口切りの青ねぎを加えます。",
        en: "Bring 200 mL of water to a boil in a small pan, add the diced tofu, and warm it. Lower the heat, dissolve the miso in it, turn off the heat before it boils, and add the sliced green onion.",
        es: "Lleva a ebullición 200 mL de agua en un cazo, añade el tofu en dados y caliéntalo. Baja el fuego, disuelve el miso, apaga el fuego antes de que hierva y añade la cebolleta en rodajas.",
      },
    },
    {
      key: "serve",
      text: {
        ja: "鮭の中まで火が通っていることを確かめ、玄米ご飯、みそ汁、おひたしと一緒に並べます。",
        en: "Check that the salmon is cooked through and serve it with the brown rice, miso soup, and spinach.",
        es: "Comprueba que el salmón esté bien hecho y sírvelo con el arroz integral, la sopa de miso y las espinacas.",
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
      },
    },
    {
      key: "fish_bones",
      text: {
        ja: "切り身にも小骨が残っていることがあります。食べるときは骨に注意してください。",
        en: "Fillets may still have small bones; take care when eating.",
        es: "Los filetes pueden tener alguna espina pequeña; ten cuidado al comerlos.",
      },
    },
  ],
  substitutions: [],
};
