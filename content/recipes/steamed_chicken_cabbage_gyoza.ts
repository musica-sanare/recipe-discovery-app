import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "steamed_chicken_cabbage_gyoza",
  texts: {
    name: { ja: "鶏むね肉とキャベツの蒸しぎょうざ", en: "Steamed chicken and cabbage gyoza", es: "Gyoza al vapor de pollo y col", fr: "Gyoza vapeur au poulet et au chou" },
    summary: {
      ja: "細かく刻んだ鶏むね肉、キャベツ、にらを皮で包み、フライパンで蒸し焼きにします。酢じょうゆで食べます。ご飯を添えます。多めに包んで冷凍できます。",
      en: "Finely chopped chicken breast, cabbage, and garlic chives wrapped in gyoza wrappers and steamed in a frying pan, with a soy sauce and vinegar dip and rice. Make extra and freeze them.",
      es: "Pechuga de pollo picada, col y cebollino chino envueltos en obleas de gyoza y hechos al vapor en la sartén, con una salsa de soja y vinagre y arroz. Puedes hacer de más y congelarlos.",
      fr: "Blanc de poulet haché au couteau, chou et ciboule de Chine enveloppés dans des feuilles pour gyoza et cuits à la vapeur à la poêle, avec une sauce soja vinaigrée et du riz. Préparez-en davantage et congelez-les.",
    },
  },
  cuisine: "chinese",
  goals: ["maintain"],
  mainProteinGroup: "chicken",
  tags: ["batch"],
  minutes: 40,
  effort: 3,
  equipment: ["stove", "frying_pan"],
  servings: 1,
  ingredients: [
    {
      key: "chicken",
      food: "chicken_breast",
      grams: 160,
      state: "raw",
      cooking: "steam",
      role: "main_protein",
      adjust: { kind: "grams", min: 130, max: 190, step: 30 },
      note: {
        ja: "成分表に蒸した鶏むね肉の値がないため、生の値で計算しています。",
        en: "The tables have no value for steamed chicken breast, so the raw value is used.",
        es: "Las tablas no tienen un valor para la pechuga de pollo al vapor, así que se usa el valor en crudo.",
        fr: "Les tables n'ont pas de valeur pour le blanc de poulet cuit à la vapeur ; la valeur à l'état cru est donc utilisée.",
      },
    },
    {
      key: "cabbage",
      food: "cabbage",
      grams: 100,
      state: "raw",
      cooking: "steam",
      role: "vegetable",
      note: {
        ja: "成分表に蒸したキャベツの値がないため、生の値で計算しています。",
        en: "The tables have no value for steamed cabbage, so the raw value is used.",
        es: "Las tablas no tienen un valor para la col al vapor, así que se usa el valor en crudo.",
        fr: "Les tables n'ont pas de valeur pour le chou cuit à la vapeur ; la valeur à l'état cru est donc utilisée.",
      },
    },
    { key: "chives", food: "garlic_chives", grams: 20, state: "raw", cooking: "steam", role: "vegetable" },
    { key: "ginger", food: "ginger", grams: 5, state: "raw", measure: { unit: "knob", quantity: 0.5 }, role: "seasoning" },
    { key: "soy_sauce", food: "soy_sauce", grams: 6, state: "as_is", measure: { unit: "tsp", quantity: 1 }, role: "seasoning", linkedTo: "chicken" },
    { key: "sesame_oil", food: "sesame_oil", grams: 3, state: "as_is", measure: { unit: "tsp", quantity: 0.75 }, role: "fat", linkedTo: "chicken" },
    { key: "starch", food: "potato_starch", grams: 3, state: "as_is", measure: { unit: "tsp", quantity: 1 }, role: "other" },
    {
      key: "wrappers",
      food: "gyoza_wrappers",
      grams: 72,
      state: "raw",
      cooking: "steam",
      measure: { unit: "piece", quantity: 12 },
      role: "other",
      note: {
        ja: "成分表に蒸したぎょうざの皮の値がないため、生の値で計算しています。",
        en: "The tables have no value for steamed gyoza wrappers, so the raw value is used.",
        es: "Las tablas no tienen un valor para las obleas de gyoza al vapor, así que se usa el valor en crudo.",
        fr: "Les tables n'ont pas de valeur pour les feuilles pour gyoza cuites à la vapeur ; la valeur à l'état cru est donc utilisée.",
      },
    },
    { key: "oil", food: "vegetable_oil", grams: 3, state: "as_is", measure: { unit: "tsp", quantity: 0.75 }, role: "fat" },
    { key: "dip_soy", food: "soy_sauce", grams: 6, state: "as_is", measure: { unit: "tsp", quantity: 1 }, role: "seasoning" },
    { key: "vinegar", food: "rice_vinegar", grams: 10, state: "as_is", measure: { unit: "tsp", quantity: 2 }, role: "seasoning" },
    { key: "rice", food: "rice_cooked", grams: 150, state: "as_is", role: "main_carb", adjust: { kind: "grams", min: 100, max: 200, step: 50 } },
  ],
  sides: [
    { key: "rice", label: { ja: "ご飯", en: "Rice", es: "Arroz", fr: "Riz" }, ingredients: ["rice"], solverMayRemove: true },
  ],
  steps: [
    {
      key: "filling",
      text: {
        ja: "鶏むね肉を包丁で細かく刻みます。キャベツとにらはみじん切りにします。ボウルに鶏肉、キャベツ、にら、すりおろしたしょうが、しょうゆ、ごま油、片栗粉を入れて、粘りが出るまで混ぜます。",
        en: "Finely chop the chicken breast with a knife. Finely chop the cabbage and garlic chives. In a bowl, mix the chicken, cabbage, garlic chives, grated ginger, soy sauce, sesame oil, and potato starch until sticky.",
        es: "Pica la pechuga a cuchillo. Pica fino la col y el cebollino chino. En un bol, mezcla el pollo, la col, el cebollino chino, el jengibre rallado, la salsa de soja, el aceite de sésamo y la fécula hasta que la mezcla quede pegajosa.",
        fr: "Hachez finement le blanc de poulet au couteau. Hachez finement le chou et la ciboule de Chine. Dans un bol, mélangez le poulet, le chou, la ciboule de Chine, le gingembre râpé, la sauce soja, l'huile de sésame et la fécule jusqu'à ce que la farce devienne collante.",
      },
    },
    {
      key: "wrap",
      text: {
        ja: "皮の中央に具を1/12ずつのせ、縁に水をつけてひだを寄せながら包みます。",
        en: "Put a twelfth of the filling in the middle of each wrapper, wet the edge with water, and fold it closed with pleats.",
        es: "Pon la duodécima parte del relleno en el centro de cada oblea, moja el borde con agua y ciérrala haciendo pliegues.",
        fr: "Déposez un douzième de la farce au centre de chaque feuille, mouillez le bord avec de l'eau et refermez-la en formant des plis.",
      },
    },
    {
      key: "steam",
      text: {
        ja: "フライパンに油をひいてぎょうざを並べ、中火にかけます。水100mLを加えてふたをし、6〜7分蒸し焼きにします。ふたを取って水気を飛ばし、1個を割って中まで火が通っていることを確かめます。",
        en: "Oil a frying pan, arrange the gyoza in it, and put it over medium heat. Add 100 mL of water, cover, and steam for 6–7 minutes. Uncover, let the remaining water evaporate, and cut one open to check that it is cooked through.",
        es: "Unta una sartén con aceite, coloca los gyoza y ponla a fuego medio. Añade 100 mL de agua, tapa y deja que se hagan al vapor 6-7 minutos. Destapa, deja que se evapore el agua que quede y abre uno para comprobar que esté bien hecho por dentro.",
        fr: "Huilez une poêle, disposez-y les gyoza et posez-la sur feu moyen. Ajoutez 100 mL d'eau, couvrez et faites cuire à la vapeur 6 à 7 minutes. Retirez le couvercle, laissez l'eau restante s'évaporer et ouvrez un gyoza pour vérifier qu'il est cuit à cœur.",
      },
    },
    {
      key: "serve",
      text: {
        ja: "しょうゆと酢を混ぜたたれを添えて器に盛ります。",
        en: "Plate them with a dip of the soy sauce mixed with the vinegar.",
        es: "Sírvelos con una salsa de soja mezclada con el vinagre para mojar.",
        fr: "Dressez avec une sauce faite de sauce soja mélangée au vinaigre.",
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
      key: "mince_doneness",
      text: {
        ja: "ぎょうざの具は中心まで火を通してください。1個を割って、中にピンク色が残っていないことを確かめます。",
        en: "Cook the gyoza filling through. Cut one open and check that no pink remains inside.",
        es: "Cocina bien el relleno de los gyoza. Abre uno y comprueba que no quede nada rosado por dentro.",
        fr: "Faites cuire la farce des gyoza à cœur. Ouvrez-en un et vérifiez qu'il ne reste pas de rose à l'intérieur.",
      },
    },
    {
      key: "freezing",
      text: {
        ja: "包んだぎょうざを冷凍する場合は、生のまま重ならないように並べて冷凍し、凍ったまま蒸し焼きにして中まで十分に加熱してください。",
        en: "To freeze the gyoza, freeze them uncooked in a single layer, and steam them from frozen until cooked through.",
        es: "Para congelar los gyoza, congélalos crudos sin que se toquen y hazlos al vapor directamente congelados hasta que estén bien hechos por dentro.",
        fr: "Pour congeler les gyoza, congelez-les crus en une seule couche, puis faites-les cuire à la vapeur directement surgelés jusqu'à ce qu'ils soient cuits à cœur.",
      },
    },
  ],
  substitutions: [],
};
