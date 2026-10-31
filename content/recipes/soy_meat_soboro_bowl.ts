import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "soy_meat_soboro_bowl",
  texts: {
    name: { ja: "大豆ミートのそぼろ丼", en: "Soy mince soboro rice bowl", es: "Bol de arroz con soboro de soja texturizada", fr: "Bol de riz au soboro de haché de soja" },
    summary: {
      ja: "三色丼をヒントに、甘辛く炒りつけた大豆ミートのそぼろ、炒り卵、ゆでた小松菜をご飯にのせます。そぼろは作り置きできます。",
      en: "Inspired by Japanese three-color rice bowls: soy mince cooked in a sweet soy glaze, scrambled egg, and boiled komatsuna over rice. The soboro keeps well.",
      es: "Inspirado en los boles japoneses de tres colores: soja texturizada glaseada con soja dulce, huevo revuelto y komatsuna hervida sobre arroz. El soboro se puede preparar por adelantado.",
      fr: "Inspiré des bols de riz japonais aux trois couleurs : haché de soja cuit dans une sauce soja sucrée, œuf brouillé et komatsuna bouilli sur du riz. Le soboro se conserve bien.",
    },
  },
  cuisine: "japanese",
  goals: ["bulk"],
  mainProteinGroup: "soy",
  tags: ["batch"],
  minutes: 15,
  effort: 1,
  equipment: ["stove", "frying_pan"],
  servings: 1,
  ingredients: [
    {
      key: "soy_meat",
      food: "soy_meat",
      grams: 80,
      state: "raw",
      cooking: "stir_fry",
      role: "main_protein",
      adjust: { kind: "grams", min: 50, max: 90, step: 10 },
      note: {
        ja: "成分表に戻して加熱した大豆ミートの値がないため、乾燥品の値で計算しています。",
        en: "The tables have no value for rehydrated, cooked soy mince, so the value of the dry product is used.",
        es: "Las tablas no tienen un valor para la soja texturizada rehidratada y cocinada, así que se usa el valor del producto seco.",
        fr: "Les tables n'ont pas de valeur pour le haché de soja réhydraté et cuit ; la valeur du produit sec est donc utilisée.",
      },
    },
    { key: "oil", food: "vegetable_oil", grams: 4, state: "as_is", measure: { unit: "tsp", quantity: 1 }, role: "fat", linkedTo: "soy_meat" },
    { key: "soy_sauce", food: "soy_sauce", grams: 15, state: "as_is", measure: { unit: "tsp", quantity: 2.5 }, role: "seasoning", linkedTo: "soy_meat" },
    { key: "mirin", food: "mirin", grams: 15, state: "as_is", measure: { unit: "tsp", quantity: 2.5 }, role: "seasoning", linkedTo: "soy_meat" },
    { key: "sugar", food: "sugar", grams: 4, state: "as_is", role: "seasoning", linkedTo: "soy_meat" },
    { key: "ginger", food: "ginger", grams: 5, state: "raw", measure: { unit: "knob", quantity: 0.5 }, role: "seasoning" },
    { key: "egg", food: "egg", grams: 50, state: "scramble", measure: { unit: "piece", quantity: 1 }, role: "other" },
    { key: "oil_egg", food: "vegetable_oil", grams: 2, state: "as_is", measure: { unit: "tsp", quantity: 0.5 }, role: "fat", includedIn: "egg" },
    { key: "komatsuna", food: "komatsuna", grams: 80, state: "boil", role: "vegetable" },
    { key: "rice", food: "rice_cooked", grams: 250, state: "as_is", role: "main_carb", adjust: { kind: "grams", min: 200, max: 300, step: 50 } },
  ],
  sides: [],
  steps: [
    {
      key: "soak",
      text: {
        ja: "大豆ミートを熱湯に5分ほどつけて戻し、ざるにあけて水気をしっかり絞ります。",
        en: "Soak the soy mince in boiling water for about 5 minutes, drain it in a sieve, and squeeze out the water well.",
        es: "Remoja la soja texturizada en agua hirviendo unos 5 minutos, escúrrela en un colador y exprime bien el agua.",
        fr: "Faites tremper le haché de soja environ 5 minutes dans de l'eau bouillante, égouttez-le dans une passoire et pressez-le bien.",
      },
    },
    {
      key: "komatsuna",
      text: {
        ja: "小松菜を熱湯で1分ほどゆで、水にとって絞り、3cm長さに切ります。",
        en: "Boil the komatsuna for about 1 minute, cool it in water, squeeze it, and cut it into 3 cm lengths.",
        es: "Hierve la komatsuna aproximadamente 1 minuto, enfríala en agua, escúrrela y córtala en trozos de 3 cm.",
        fr: "Faites bouillir le komatsuna environ 1 minute, refroidissez-le dans l'eau, pressez-le et coupez-le en tronçons de 3 cm.",
      },
    },
    {
      key: "egg",
      text: {
        ja: "フライパンに卵用の油を中火で熱し、溶いた卵を入れて菜箸で混ぜながら、固まるまで炒って取り出します。",
        en: "Heat the oil for the egg in a frying pan over medium heat, add the beaten egg, and stir with chopsticks until it is set in small curds. Take it out.",
        es: "Calienta en una sartén a fuego medio el aceite del huevo, añade el huevo batido y remueve con palillos hasta que cuaje en grumos pequeños. Sácalo.",
        fr: "Faites chauffer l'huile de l'œuf dans une poêle à feu moyen, ajoutez l'œuf battu et remuez avec des baguettes jusqu'à ce qu'il soit pris en petits grains. Retirez-le.",
      },
    },
    {
      key: "soboro",
      text: {
        ja: "同じフライパンに油を熱し、すりおろしたしょうがと大豆ミートを炒めます。しょうゆ、みりん、砂糖を加え、汁気がなくなるまで炒りつけます。",
        en: "Heat the oil in the same pan and stir-fry the grated ginger and soy mince. Add the soy sauce, mirin, and sugar and stir until the liquid is gone.",
        es: "Calienta el aceite en la misma sartén y saltea el jengibre rallado y la soja texturizada. Añade la salsa de soja, el mirin y el azúcar y remueve hasta que no quede líquido.",
        fr: "Faites chauffer l'huile dans la même poêle et faites sauter le gingembre râpé et le haché de soja. Ajoutez la sauce soja, le mirin et le sucre, et remuez jusqu'à ce que le liquide ait disparu.",
      },
    },
    {
      key: "serve",
      text: {
        ja: "ご飯を器に盛り、そぼろ、炒り卵、小松菜をのせます。",
        en: "Put the rice in a bowl and top with the soboro, scrambled egg, and komatsuna.",
        es: "Pon el arroz en un bol y coloca encima el soboro, el huevo revuelto y la komatsuna.",
        fr: "Mettez le riz dans un bol et garnissez-le du soboro, de l'œuf brouillé et du komatsuna.",
      },
    },
  ],
  safetyNotes: [
    {
      key: "hot_water",
      text: {
        ja: "熱湯を扱うときは、やけどに注意してください。",
        en: "Take care not to scald yourself with the boiling water.",
        es: "Ten cuidado de no quemarte con el agua hirviendo.",
        fr: "Attention à ne pas vous ébouillanter avec l'eau bouillante.",
      },
    },
    {
      key: "egg_set",
      text: {
        ja: "卵は固まるまで加熱してください。",
        en: "Cook the eggs until set.",
        es: "Cocina los huevos hasta que cuajen.",
        fr: "Faites cuire les œufs jusqu'à ce qu'ils soient pris.",
      },
    },
    {
      key: "cooling",
      text: {
        ja: "作り置きする場合は、浅い容器に移して早めに冷まし、冷蔵庫で保存してください。食べるときは中心まで十分に温め直します。",
        en: "To keep leftovers, transfer them to a shallow container, cool them quickly, and refrigerate. Reheat until piping hot throughout before eating.",
        es: "Si guardas sobras, pásalas a un recipiente poco hondo, enfríalas rápido y guárdalas en el refrigerador. Antes de comer, recaliéntalas hasta que estén bien calientes por dentro.",
        fr: "Pour conserver les restes, mettez-les dans un récipient peu profond, faites-les refroidir rapidement et placez-les au réfrigérateur. Avant de les manger, réchauffez-les jusqu'à ce qu'ils soient bien chauds à cœur.",
      },
    },
  ],
  substitutions: [],
};
