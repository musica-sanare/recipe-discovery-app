import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "salmon_tempura",
  texts: {
    name: { ja: "サーモンの天ぷら", en: "Salmon tempura", es: "Tempura de salmón", fr: "Tempura de saumon" },
    summary: {
      ja: "サーモンに薄い衣をつけて揚げ、ほうれん草のおひたしとご飯を添えます。揚げ物のため、栄養値は推定の幅が大きくなります。",
      en: "Salmon in a light batter, deep-fried and served with dressed spinach and rice. As a fried dish, its nutrition estimate is less certain.",
      es: "Salmón en un rebozado ligero, frito y servido con espinacas aliñadas y arroz. Al ser una fritura, su estimación nutricional es menos precisa.",
      fr: "Saumon en pâte légère, frit et servi avec des épinards assaisonnés et du riz. Comme c'est un plat frit, son estimation nutritionnelle est moins sûre.",
    },
  },
  cuisine: "japanese",
  goals: ["maintain"],
  mainProteinGroup: "fish",
  tags: [],
  minutes: 25,
  effort: 3,
  equipment: ["stove", "deep_pan", "pot"],
  servings: 1,
  ingredients: [
    { key: "salmon", food: "salmon", grams: 120, state: "tempura", role: "main_protein", adjust: { kind: "grams", min: 100, max: 180, step: 10 } },
    { key: "batter", food: "tempura_flour", grams: 11, state: "as_is", measure: { unit: "tbsp", quantity: 1.5 }, role: "coating", linkedTo: "salmon", includedIn: "salmon" },
    {
      key: "frying_oil",
      food: "vegetable_oil",
      grams: 500,
      state: "as_is",
      role: "fat",
      includedIn: "salmon",
      note: {
        ja: "揚げ油です。吸収される分は天ぷらの値に含まれています。",
        en: "Oil for deep-frying. The absorbed part is included in the tempura value.",
        es: "Aceite para freír. La parte absorbida está incluida en el valor de la tempura.",
        fr: "Huile de friture. La part absorbée est incluse dans la valeur du tempura.",
      },
    },
    { key: "salt", food: "salt", grams: 0.5, state: "as_is", measure: { unit: "pinch", quantity: 1 }, role: "seasoning", linkedTo: "salmon" },
    { key: "spinach", food: "spinach", grams: 80, state: "boil", role: "vegetable" },
    { key: "soy_sauce", food: "soy_sauce", grams: 5, state: "as_is", measure: { unit: "tsp", quantity: 1 }, role: "seasoning" },
    { key: "rice", food: "rice_cooked", grams: 180, state: "as_is", role: "main_carb", adjust: { kind: "grams", min: 100, max: 280, step: 10 } },
  ],
  sides: [
    { key: "rice", label: { ja: "ご飯", en: "Rice", es: "Arroz", fr: "Riz" }, ingredients: ["rice"], solverMayRemove: true },
    { key: "spinach", label: { ja: "ほうれん草のおひたし", en: "Spinach with soy sauce", es: "Espinacas con salsa de soja", fr: "Épinards à la sauce soja" }, ingredients: ["spinach", "soy_sauce"], solverMayRemove: false },
  ],
  steps: [
    {
      key: "prep",
      text: {
        ja: "サーモンをひと口大に切り、水気をしっかり拭きます。",
        en: "Cut the salmon into bite-size pieces and pat dry thoroughly.",
        es: "Corta el salmón en trozos pequeños y sécalo bien.",
        fr: "Coupez le saumon en bouchées et séchez-le soigneusement en tapotant.",
      },
    },
    {
      key: "fry",
      text: {
        ja: "天ぷら粉を冷水で溶き、サーモンにからめて170℃の油で2〜3分揚げます。",
        en: "Mix the tempura flour with cold water, coat the salmon, and deep-fry at 170 °C for 2 to 3 minutes.",
        es: "Mezcla la harina para tempura con agua fría, reboza el salmón y fríelo a 170 °C de 2 a 3 minutos.",
        fr: "Mélangez la farine pour tempura avec de l'eau froide, enrobez-en le saumon et faites frire à 170 °C pendant 2 à 3 minutes.",
      },
    },
    {
      key: "spinach",
      side: "spinach",
      text: {
        ja: "ほうれん草をゆでて水気を絞り、しょうゆをかけておひたしにします。",
        en: "Boil the spinach, squeeze out the water, and dress it with soy sauce.",
        es: "Hierve las espinacas, exprímelas bien y alíñalas con salsa de soja.",
        fr: "Faites bouillir les épinards, pressez-les et assaisonnez-les de sauce soja.",
      },
    },
    {
      key: "serve",
      text: {
        ja: "天ぷらを盛り付け、塩を添えます。",
        en: "Serve the tempura with salt.",
        es: "Sirve la tempura con sal.",
        fr: "Servez le tempura avec du sel.",
      },
    },
  ],
  safetyNotes: [
    {
      key: "hot_oil",
      text: {
        ja: "揚げ油から目を離さないでください。高温の油は発火やけがの原因になります。水気が残っていると油がはねます。",
        en: "Never leave hot oil unattended; it can catch fire or cause burns. Moisture on the food makes the oil spatter.",
        es: "No dejes nunca el aceite caliente sin vigilancia: puede incendiarse o causar quemaduras. La humedad en los alimentos hace que el aceite salpique.",
        fr: "Ne laissez jamais l'huile chaude sans surveillance : elle peut s'enflammer ou provoquer des brûlures. L'humidité des aliments fait gicler l'huile.",
      },
    },
  ],
  substitutions: [],
};
