import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "salade_nicoise",
  texts: {
    name: { ja: "サラダ・ニソワーズ（ツナとゆで卵のニース風サラダ）", en: "Salade niçoise (tuna, egg, and green bean salad)", es: "Salade niçoise (ensalada de atún, huevo y judías verdes)", fr: "Salade niçoise" },
    summary: {
      ja: "ニースのサラダをヒントに、ツナ缶、ゆで卵、さやいんげん、じゃがいも、トマト、オリーブをマスタード風味のドレッシングで和えます。フランスパンを添えます。",
      en: "Inspired by the salad of Nice: canned tuna, boiled egg, green beans, potato, tomato, and olives with a mustard dressing. With baguette.",
      es: "Inspirada en la ensalada de Niza: atún en lata, huevo duro, judías verdes, patata, tomate y aceitunas con un aliño de mostaza. Con pan de barra.",
      fr: "Inspirée de la salade de Nice : thon en conserve, œuf dur, haricots verts, pomme de terre, tomate et olives avec une vinaigrette à la moutarde. Avec de la baguette.",
    },
  },
  cuisine: "french",
  goals: ["cut"],
  mainProteinGroup: "fish",
  tags: [],
  minutes: 20,
  effort: 1,
  equipment: ["stove", "pot"],
  servings: 1,
  ingredients: [
    { key: "tuna", food: "tuna_canned", grams: 140, state: "as_is", measure: { unit: "can", quantity: 2 }, role: "main_protein", adjust: { kind: "count", unitGrams: 70, min: 1, max: 3 } },
    { key: "egg", food: "egg", grams: 50, state: "boil", measure: { unit: "piece", quantity: 1 }, role: "other" },
    { key: "potato", food: "potato", grams: 100, state: "simmer", measure: { unit: "piece", quantity: 1 }, role: "main_carb", adjust: { kind: "grams", min: 50, max: 150, step: 50 } },
    { key: "green_beans", food: "green_beans", grams: 60, state: "boil", role: "vegetable" },
    { key: "tomato", food: "tomato", grams: 80, state: "raw", measure: { unit: "piece", quantity: 0.5 }, role: "vegetable" },
    { key: "lettuce", food: "lettuce", grams: 40, state: "raw", role: "vegetable" },
    { key: "olives", food: "black_olives", grams: 10, state: "as_is", role: "other" },
    { key: "olive_oil", food: "olive_oil", grams: 6, state: "as_is", measure: { unit: "tsp", quantity: 1.5 }, role: "fat" },
    { key: "vinegar", food: "wine_vinegar", grams: 8, state: "as_is", measure: { unit: "tsp", quantity: 1.5 }, role: "seasoning" },
    { key: "mustard", food: "dijon_mustard", grams: 3, state: "as_is", measure: { unit: "tsp", quantity: 0.5 }, role: "seasoning" },
    { key: "salt", food: "salt", grams: 0.5, state: "as_is", measure: { unit: "pinch", quantity: 1 }, role: "seasoning" },
    { key: "pepper", food: "black_pepper", grams: 0.2, state: "as_is", measure: { unit: "pinch", quantity: 1 }, role: "seasoning" },
    { key: "bread", food: "baguette", grams: 40, state: "as_is", role: "main_carb", adjust: { kind: "grams", min: 40, max: 80, step: 20 } },
  ],
  sides: [{ key: "bread", label: { ja: "フランスパン", en: "Baguette", es: "Pan de barra", fr: "Baguette" }, ingredients: ["bread"], solverMayRemove: true }],
  steps: [
    {
      key: "boil",
      text: {
        ja: "じゃがいもは皮をむいて2cm角に切り、卵と一緒に鍋に入れて水からゆでます。沸騰して10分たったら、筋を取ったさやいんげんを加えてさらに3分ゆで、湯を切ります。卵は水にとって殻をむきます。",
        en: "Peel the potato and cut it into 2 cm cubes. Put it in a pot with the egg, cover with cold water, and bring to a boil. After 10 minutes of boiling, add the trimmed green beans and boil for 3 more minutes, then drain. Cool the egg in water and peel it.",
        es: "Pela la patata y córtala en dados de 2 cm. Ponla en una olla con el huevo, cubre con agua fría y lleva a ebullición. Tras 10 minutos de hervor, añade las judías verdes limpias, hierve 3 minutos más y escurre. Enfría el huevo en agua y pélalo.",
        fr: "Pelez la pomme de terre et coupez-la en dés de 2 cm. Mettez-la dans une casserole avec l'œuf, couvrez d'eau froide et portez à ébullition. Après 10 minutes d'ébullition, ajoutez les haricots verts équeutés, faites bouillir encore 3 minutes, puis égouttez. Refroidissez l'œuf dans l'eau et écalez-le.",
      },
    },
    {
      key: "dressing",
      text: {
        ja: "ボウルにマスタード、ぶどう酢、塩、こしょうを混ぜ、オリーブオイルを少しずつ加えて混ぜます。",
        en: "In a bowl, mix the mustard, vinegar, salt, and pepper, then whisk in the olive oil a little at a time.",
        es: "En un bol, mezcla la mostaza, el vinagre, la sal y la pimienta, y añade el aceite de oliva poco a poco sin dejar de batir.",
        fr: "Dans un saladier, mélangez la moutarde, le vinaigre, le sel et le poivre, puis incorporez l'huile d'olive petit à petit en fouettant.",
      },
    },
    {
      key: "assemble",
      text: {
        ja: "レタスをちぎって器に敷き、くし形に切ったトマト、じゃがいも、さやいんげん、汁を切ったツナ、オリーブ、4つに切ったゆで卵をのせ、ドレッシングをかけます。",
        en: "Tear the lettuce onto a plate and arrange the tomato wedges, potato, green beans, drained tuna, olives, and the egg cut into quarters on top. Pour over the dressing.",
        es: "Trocea la lechuga en un plato y coloca encima el tomate en gajos, la patata, las judías verdes, el atún escurrido, las aceitunas y el huevo cortado en cuartos. Riégalo con el aliño.",
        fr: "Déchirez la laitue dans une assiette et disposez dessus les quartiers de tomate, la pomme de terre, les haricots verts, le thon égoutté, les olives et l'œuf coupé en quatre. Arrosez de vinaigrette.",
      },
    },
    { key: "bread", side: "bread", text: { ja: "フランスパンを添えます。", en: "Serve with the baguette.", es: "Acompáñalo con el pan de barra.", fr: "Servez avec la baguette." } },
  ],
  safetyNotes: [
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
      key: "wash_raw",
      text: {
        ja: "生で食べる野菜とハーブは、流水でよく洗ってください。",
        en: "Wash raw vegetables and herbs well under running water.",
        es: "Lava bien con agua corriente las verduras y hierbas que se comen crudas.",
        fr: "Lavez bien sous l'eau courante les légumes et les herbes consommés crus.",
      },
    },
    {
      key: "opened_can",
      text: {
        ja: "開けた缶詰の残りは缶から別の容器に移して冷蔵し、早めに食べてください。",
        en: "Move any leftover canned fish to another container, refrigerate it, and eat it soon.",
        es: "Pasa el pescado en lata que sobre a otro recipiente, guárdalo en el refrigerador y consúmelo pronto.",
        fr: "Transférez le reste du poisson en conserve dans un autre récipient, placez-le au réfrigérateur et consommez-le rapidement.",
      },
    },
  ],
  substitutions: [],
};
