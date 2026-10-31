import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "pork_fillet_tonkatsu",
  texts: {
    name: { ja: "ヒレかつ", en: "Pork tenderloin tonkatsu", es: "Tonkatsu de solomillo de cerdo", fr: "Tonkatsu de filet mignon de porc" },
    summary: {
      ja: "豚ヒレ肉にパン粉の衣をつけて揚げます。揚げ物のため、栄養値は推定の幅が大きくなります。",
      en: "Pork tenderloin coated in panko and deep-fried. As a fried dish, its nutrition estimate is less certain.",
      es: "Solomillo de cerdo empanado con panko y frito. Al ser una fritura, su estimación nutricional es menos precisa.",
      fr: "Filet mignon de porc pané au panko et frit. Comme c'est un plat frit, son estimation nutritionnelle est moins sûre.",
    },
  },
  cuisine: "japanese",
  goals: ["bulk"],
  mainProteinGroup: "pork",
  tags: [],
  minutes: 35,
  effort: 3,
  equipment: ["stove", "deep_pan"],
  servings: 1,
  ingredients: [
    { key: "pork", food: "pork_fillet", grams: 150, state: "tonkatsu", role: "main_protein", adjust: { kind: "grams", min: 120, max: 220, step: 10 } },
    {
      key: "batter",
      food: "tempura_flour",
      grams: 9,
      state: "as_is",
      measure: { unit: "tbsp", quantity: 1 },
      role: "coating",
      linkedTo: "pork",
      includedIn: "pork",
      note: {
        ja: "水で溶いて衣にします。成分表のとんかつも同じ衣を使っています。",
        en: "Mix with water to make the batter. The tables' tonkatsu uses the same coating.",
        es: "Mézclala con agua para hacer el rebozado. El tonkatsu de las tablas usa el mismo rebozado.",
        fr: "Mélangez avec de l'eau pour faire la pâte. Le tonkatsu des tables utilise la même panure.",
      },
    },
    { key: "panko", food: "panko", grams: 16, state: "as_is", measure: { unit: "tbsp", quantity: 5 }, role: "coating", linkedTo: "pork", includedIn: "pork" },
    {
      key: "frying_oil",
      food: "vegetable_oil",
      grams: 600,
      state: "as_is",
      role: "fat",
      includedIn: "pork",
      note: {
        ja: "揚げ油です。吸収される分は、とんかつの値に含まれています。",
        en: "Oil for deep-frying. The absorbed part is included in the tonkatsu value.",
        es: "Aceite para freír. La parte absorbida está incluida en el valor del tonkatsu.",
        fr: "Huile de friture. La part absorbée est incluse dans la valeur du tonkatsu.",
      },
    },
    { key: "cabbage", food: "cabbage", grams: 80, state: "raw", role: "vegetable" },
    { key: "tomato", food: "tomato", grams: 50, state: "raw", role: "vegetable" },
    { key: "mustard", food: "grain_mustard", grams: 5, state: "as_is", measure: { unit: "tsp", quantity: 1 }, role: "seasoning", linkedTo: "pork" },
    { key: "rice", food: "rice_cooked", grams: 220, state: "as_is", role: "main_carb", adjust: { kind: "grams", min: 100, max: 330, step: 10 } },
  ],
  sides: [
    { key: "rice", label: { ja: "ご飯", en: "Rice", es: "Arroz", fr: "Riz" }, ingredients: ["rice"], solverMayRemove: true },
    { key: "cabbage_tomato", label: { ja: "せん切りキャベツとトマト", en: "Shredded cabbage and tomato", es: "Repollo en juliana y tomate", fr: "Chou émincé et tomate" }, ingredients: ["cabbage", "tomato"], solverMayRemove: false },
  ],
  steps: [
    {
      key: "prep",
      text: {
        ja: "豚ヒレ肉を1.5cm厚さに切り、軽くたたいて厚みをそろえます。",
        en: "Cut the pork tenderloin into 1.5 cm slices and pound lightly to an even thickness.",
        es: "Corta el solomillo en filetes de 1,5 cm y golpéalos ligeramente para igualar el grosor.",
        fr: "Coupez le filet mignon en tranches de 1,5 cm et aplatissez-les légèrement pour qu'elles aient une épaisseur régulière.",
      },
    },
    {
      key: "coat",
      text: {
        ja: "天ぷら粉を同量の水で溶き、豚肉にからめてからパン粉をしっかりつけます。",
        en: "Mix the tempura flour with an equal amount of water, dip the pork in it, and press on the panko.",
        es: "Mezcla la harina para tempura con la misma cantidad de agua, pasa el cerdo por ella y cúbrelo bien con el panko.",
        fr: "Mélangez la farine pour tempura avec autant d'eau, trempez-y le porc et enrobez-le de panko en pressant.",
      },
    },
    {
      key: "fry",
      text: {
        ja: "揚げ油を170℃に熱し、4〜5分かけてきつね色に揚げ、油を切ります。",
        en: "Heat the oil to 170 °C and deep-fry for 4 to 5 minutes until golden, then drain.",
        es: "Calienta el aceite a 170 °C y fríe de 4 a 5 minutos hasta que esté dorado; luego escúrrelo.",
        fr: "Chauffez l'huile à 170 °C et faites frire 4 à 5 minutes jusqu'à ce que la panure soit dorée, puis égouttez.",
      },
    },
    {
      key: "cabbage_tomato",
      side: "cabbage_tomato",
      text: {
        ja: "キャベツをせん切りにし、トマトをくし形に切ります。",
        en: "Finely shred the cabbage and cut the tomato into wedges.",
        es: "Corta el repollo en juliana fina y el tomate en gajos.",
        fr: "Émincez finement le chou et coupez la tomate en quartiers.",
      },
    },
    {
      key: "serve",
      text: {
        ja: "切り分けて、粒マスタードを添えます。",
        en: "Slice and serve with the mustard.",
        es: "Córtalo y sírvelo con la mostaza.",
        fr: "Tranchez et servez avec la moutarde.",
      },
    },
  ],
  safetyNotes: [
    {
      key: "hot_oil",
      text: {
        ja: "揚げ油から目を離さないでください。高温の油は発火やけがの原因になります。",
        en: "Never leave hot oil unattended; it can catch fire or cause burns.",
        es: "No dejes nunca el aceite caliente sin vigilancia: puede incendiarse o causar quemaduras.",
        fr: "Ne laissez jamais l'huile chaude sans surveillance : elle peut s'enflammer ou provoquer des brûlures.",
      },
    },
    {
      key: "pork_doneness",
      text: {
        ja: "豚肉は中心まで火を通してください。切り口に赤みがないことを確認します。",
        en: "Cook pork all the way through. Check that the center is no longer pink.",
        es: "Cocina el cerdo completamente. Comprueba que el centro ya no esté rosado.",
        fr: "Faites cuire le porc à cœur. Vérifiez que le centre n'est plus rosé.",
      },
    },
  ],
  substitutions: [],
};
