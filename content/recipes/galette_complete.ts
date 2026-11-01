import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "galette_complete",
  texts: {
    name: { ja: "ガレット・コンプレット（そば粉のガレット、卵・ハム・チーズ）", en: "Galette complète (buckwheat crêpe with egg, ham, and cheese)", es: "Galette complète (crepe de trigo sarraceno con huevo, jamón y queso)", fr: "Galette complète" },
    summary: {
      ja: "ブルターニュのそば粉のガレットをヒントに、薄く焼いた生地に卵、ハム、エメンタールチーズをのせます。黄身はやわらかく仕上げます。",
      en: "Inspired by the buckwheat galettes of Brittany: a thin buckwheat crêpe topped with eggs, ham, and Emmental; the yolks stay soft.",
      es: "Inspirada en las galettes de trigo sarraceno de Bretaña: una crepe fina de trigo sarraceno con huevos, jamón y emmental; las yemas quedan blandas.",
      fr: "Inspirée des galettes de blé noir bretonnes : une galette fine garnie d'œufs, de jambon et d'emmental ; les jaunes restent coulants.",
    },
  },
  cuisine: "french",
  goals: ["maintain"],
  mainProteinGroup: "egg",
  tags: ["breakfast"],
  minutes: 25,
  effort: 2,
  equipment: ["stove", "frying_pan"],
  servings: 1,
  ingredients: [
    { key: "egg", food: "egg", grams: 50, state: "fry_egg", measure: { unit: "piece", quantity: 1 }, role: "main_protein", adjust: { kind: "count", unitGrams: 50, min: 1, max: 2 } },
    {
      key: "flour",
      food: "buckwheat_flour",
      grams: 80,
      state: "raw",
      cooking: "saute",
      role: "main_carb",
      adjust: { kind: "grams", min: 60, max: 100, step: 20 },
      note: {
        ja: "成分表に焼いた生地の値がないため、そば粉の値で計算しています。",
        en: "The tables have no value for the cooked batter, so the value of the flour is used.",
        es: "Las tablas no tienen un valor para la masa cocinada, así que se usa el valor de la harina.",
        fr: "Les tables n'ont pas de valeur pour la pâte cuite ; la valeur de la farine est donc utilisée.",
      },
    },
    { key: "salt", food: "salt", grams: 0.4, state: "as_is", measure: { unit: "pinch", quantity: 1 }, role: "seasoning", linkedTo: "flour" },
    { key: "oil", food: "vegetable_oil", grams: 3, state: "as_is", measure: { unit: "tsp", quantity: 0.75 }, role: "fat", includedIn: "egg" },
    { key: "ham", food: "ham", grams: 50, state: "as_is", measure: { unit: "slice", quantity: 5 }, role: "other" },
    { key: "cheese", food: "emmental", grams: 8, state: "as_is", role: "other" },
    { key: "pepper", food: "black_pepper", grams: 0.2, state: "as_is", measure: { unit: "pinch", quantity: 1 }, role: "seasoning" },
    { key: "lettuce", food: "lettuce", grams: 30, state: "raw", role: "vegetable" },
  ],
  sides: [],
  steps: [
    {
      key: "batter",
      text: {
        ja: "そば粉と塩をボウルに入れ、水100mlを少しずつ加えてなめらかになるまで混ぜます。10分ほど置きます。",
        en: "Put the buckwheat flour and salt in a bowl and whisk in 100 ml of water a little at a time until smooth. Let it rest for about 10 minutes.",
        es: "Pon la harina de trigo sarraceno y la sal en un bol y añade 100 ml de agua poco a poco, batiendo hasta que quede lisa. Déjala reposar unos 10 minutos.",
        fr: "Mettez la farine de sarrasin et le sel dans un saladier et incorporez 100 ml d'eau petit à petit en fouettant jusqu'à obtenir une pâte lisse. Laissez reposer environ 10 minutes.",
      },
    },
    {
      key: "cook",
      text: {
        ja: "フライパンに油を薄くひいて中火で熱し、生地を流して薄く広げます。表面が乾いたら、中央に卵を割り入れ、まわりにハムとチーズをのせます。",
        en: "Lightly oil a frying pan and heat it over medium heat. Pour in the batter and spread it thinly. When the surface looks dry, crack the eggs into the center and arrange the ham and cheese around it.",
        es: "Unta una sartén con un poco de aceite y caliéntala a fuego medio. Vierte la masa y extiéndela en una capa fina. Cuando la superficie esté seca, casca los huevos en el centro y coloca el jamón y el queso alrededor.",
        fr: "Huilez légèrement une poêle et faites-la chauffer à feu moyen. Versez la pâte et étalez-la finement. Quand la surface semble sèche, cassez les œufs au centre et disposez le jambon et le fromage autour.",
      },
    },
    {
      key: "fold",
      text: {
        ja: "ふたをして弱火で3〜4分、白身が固まるまで焼きます。生地の四辺を内側に折り、こしょうをふります。",
        en: "Cover and cook over low heat for 3 to 4 minutes, until the egg whites are set. Fold the four edges of the crêpe toward the center and season with pepper.",
        es: "Tapa y cocina a fuego bajo de 3 a 4 minutos, hasta que las claras cuajen. Dobla los cuatro bordes de la crepe hacia el centro y añade pimienta.",
        fr: "Couvrez et faites cuire 3 à 4 minutes à feu doux, jusqu'à ce que les blancs soient pris. Rabattez les quatre bords de la galette vers le centre et poivrez.",
      },
    },
    {
      key: "serve",
      text: {
        ja: "ちぎったレタスを添えます。",
        en: "Serve with the torn lettuce.",
        es: "Sírvela con la lechuga troceada.",
        fr: "Servez avec la laitue déchirée.",
      },
    },
  ],
  safetyNotes: [
    {
      key: "buckwheat",
      text: {
        ja: "そばは重いアレルギー症状を起こすことがある食品です。そばを扱った調理器具や湯にも注意してください。",
        en: "Buckwheat can cause severe allergic reactions. Take care with pots, utensils, and water that have been used for soba.",
        es: "El alforfón puede causar reacciones alérgicas graves. Ten cuidado con las ollas, los utensilios y el agua que se hayan usado para la soba.",
        fr: "Le sarrasin peut provoquer des réactions allergiques graves. Faites attention aux casseroles, ustensiles et à l'eau ayant servi pour les soba.",
      },
    },
    {
      key: "white_set",
      text: {
        ja: "白身は完全に固まるまで加熱してください。",
        en: "Cook until the egg whites are completely set.",
        es: "Cocina hasta que las claras cuajen por completo.",
        fr: "Faites cuire jusqu'à ce que les blancs d'œufs soient entièrement pris.",
      },
    },
    {
      key: "soft_yolk",
      text: {
        ja: "黄身がやわらかい卵は、妊娠中の方、乳幼児、高齢の方、体調のすぐれない方には向きません。その場合は黄身まで固まるまで加熱してください。",
        en: "Eggs with runny yolks are not recommended for pregnant people, young children, older adults, or anyone unwell; for them, cook until the yolks are firm.",
        es: "Los huevos con la yema líquida no se recomiendan para embarazadas, niños pequeños, personas mayores o enfermas; en esos casos, cocínalos hasta que la yema esté firme.",
        fr: "Les œufs au jaune coulant sont déconseillés aux femmes enceintes, aux jeunes enfants, aux personnes âgées et aux personnes malades ; pour elles, faites cuire jusqu'à ce que les jaunes soient fermes.",
      },
    },
  ],
  substitutions: [],
};
