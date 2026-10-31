import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "salad_chicken_microwave",
  texts: {
    name: { ja: "レンジで作るサラダチキン", en: "Microwave chicken breast salad", es: "Ensalada de pechuga de pollo al microondas", fr: "Blanc de poulet au micro-ondes en salade" },
    summary: {
      ja: "鶏むね肉に塩と砂糖をもみ込んで電子レンジで加熱し、しっとりとしたサラダチキンにします。まとめて作っておけます。野菜とご飯を添えます。",
      en: "Chicken breast rubbed with salt and sugar and cooked in the microwave until moist. Make several at once to keep. With vegetables and rice.",
      es: "Pechuga de pollo frotada con sal y azúcar y hecha en el microondas para que quede jugosa. Puedes preparar varias a la vez. Con verduras y arroz.",
      fr: "Blanc de poulet frotté de sel et de sucre et cuit au micro-ondes pour rester moelleux. Préparez-en plusieurs à la fois pour les garder. Avec des légumes et du riz.",
    },
  },
  cuisine: "japanese",
  goals: ["cut"],
  mainProteinGroup: "chicken",
  tags: ["batch"],
  minutes: 15,
  effort: 1,
  equipment: ["microwave"],
  servings: 1,
  ingredients: [
    {
      key: "chicken",
      food: "chicken_breast",
      grams: 200,
      state: "raw",
      cooking: "microwave",
      role: "main_protein",
      adjust: { kind: "grams", min: 160, max: 260, step: 20 },
      note: {
        ja: "成分表に電子レンジで加熱した鶏むね肉の値がないため、生の値で計算しています。",
        en: "The tables have no value for microwaved chicken breast, so the raw value is used.",
        es: "Las tablas no tienen un valor para la pechuga de pollo hecha en el microondas, así que se usa el valor en crudo.",
        fr: "Les tables n'ont pas de valeur pour le blanc de poulet cuit au micro-ondes ; la valeur à l'état cru est donc utilisée.",
      },
    },
    { key: "salt", food: "salt", grams: 1.5, state: "as_is", measure: { unit: "pinch", quantity: 3 }, role: "seasoning", linkedTo: "chicken" },
    { key: "sugar", food: "sugar", grams: 2, state: "as_is", role: "seasoning", linkedTo: "chicken" },
    { key: "sake", food: "cooking_sake", grams: 10, state: "as_is", measure: { unit: "tsp", quantity: 2 }, role: "seasoning", linkedTo: "chicken" },
    { key: "lettuce", food: "lettuce", grams: 50, state: "raw", role: "vegetable" },
    { key: "tomato", food: "tomato", grams: 80, state: "raw", measure: { unit: "piece", quantity: 0.5 }, role: "vegetable" },
    { key: "cucumber", food: "cucumber", grams: 50, state: "raw", measure: { unit: "piece", quantity: 0.5 }, role: "vegetable" },
    { key: "lemon", food: "lemon_juice", grams: 10, state: "as_is", measure: { unit: "tsp", quantity: 2 }, role: "seasoning" },
    { key: "olive_oil", food: "olive_oil", grams: 4, state: "as_is", measure: { unit: "tsp", quantity: 1 }, role: "fat" },
    { key: "rice", food: "rice_cooked", grams: 150, state: "as_is", role: "main_carb", adjust: { kind: "grams", min: 100, max: 250, step: 25 } },
  ],
  sides: [
    { key: "rice", label: { ja: "ご飯", en: "Rice", es: "Arroz", fr: "Riz" }, ingredients: ["rice"], solverMayRemove: true },
  ],
  steps: [
    {
      key: "rub",
      text: {
        ja: "鶏むね肉の厚い部分に切り込みを入れて厚さをそろえ、塩と砂糖をもみ込んで10分置きます。",
        en: "Cut into the thick part of the chicken breast to even out its thickness, rub in the salt and sugar, and leave for 10 minutes.",
        es: "Haz un corte en la parte gruesa de la pechuga para igualar el grosor, frótala con la sal y el azúcar y déjala reposar 10 minutos.",
        fr: "Entaillez la partie épaisse du blanc de poulet pour égaliser son épaisseur, frottez-le avec le sel et le sucre et laissez reposer 10 minutes.",
      },
    },
    {
      key: "cook",
      text: {
        ja: "耐熱皿にのせて料理酒をふり、ふんわりとラップをかけて600Wで3分加熱します。裏返してさらに2分加熱し、ラップをしたまま5分置きます。",
        en: "Put it in a heatproof dish, sprinkle with the cooking sake, cover loosely with plastic wrap, and microwave at 600 W for 3 minutes. Turn it over, heat for 2 more minutes, and leave covered for 5 minutes.",
        es: "Ponla en un plato apto para microondas, rocíala con el sake de cocina, cubre sin apretar con film y calienta a 600 W durante 3 minutos. Dale la vuelta, calienta 2 minutos más y déjala tapada 5 minutos.",
        fr: "Mettez-le dans un plat résistant à la chaleur, arrosez de saké de cuisine, couvrez sans serrer de film alimentaire et faites chauffer au micro-ondes à 600 W pendant 3 minutes. Retournez-le, prolongez de 2 minutes et laissez reposer 5 minutes à couvert dans la chaleur résiduelle.",
      },
    },
    {
      key: "serve",
      text: {
        ja: "中心まで火が通っていることを確かめて薄切りにし、ちぎったレタス、くし形に切ったトマト、薄切りのきゅうりと盛り合わせ、レモン果汁とオリーブオイルをかけます。",
        en: "Check that the chicken is cooked through, slice it, and arrange it with the torn lettuce, tomato wedges, and sliced cucumber. Dress with the lemon juice and olive oil.",
        es: "Comprueba que el pollo esté bien hecho, córtalo en lonchas y sírvelo con la lechuga troceada, el tomate en gajos y el pepino en rodajas. Aliña con el zumo de limón y el aceite de oliva.",
        fr: "Vérifiez que le poulet est cuit à cœur, tranchez-le et disposez-le avec la laitue déchirée, les quartiers de tomate et le concombre en rondelles. Assaisonnez avec le jus de citron et l'huile d'olive.",
      },
    },
    {
      key: "rice",
      side: "rice",
      text: {
        ja: "ご飯を添えます。",
        en: "Serve with the rice.",
        es: "Acompáñalo con el arroz.",
        fr: "Servez avec le riz.",
      },
    },
  ],
  safetyNotes: [
    {
      key: "chicken_doneness",
      text: {
        ja: "鶏肉は中心まで火を通してください。切り口に赤みがなく、肉汁が透明になっていることを確認します。",
        en: "Cook chicken all the way through. Check that the center is no longer pink and the juices run clear.",
        es: "Cocina el pollo completamente. Comprueba que el centro ya no esté rosado y que los jugos salgan transparentes.",
        fr: "Faites cuire le poulet à cœur. Vérifiez que le centre n'est plus rosé et que le jus qui s'écoule est clair.",
      },
    },
    {
      key: "residual_heat",
      text: {
        ja: "余熱調理では、肉の厚みや量によって火の通りが変わります。中心に赤みが残っていたら、再び加熱してください。",
        en: "When cooking with residual heat, doneness depends on the thickness and amount of meat. If the center is still pink, heat it again.",
        es: "Al cocinar con calor residual, el punto de cocción depende del grosor y la cantidad de carne. Si el centro sigue rosado, vuelve a calentar la carne.",
        fr: "Avec une cuisson à la chaleur résiduelle, le résultat dépend de l'épaisseur et de la quantité de viande. Si le centre est encore rosé, faites-la chauffer à nouveau.",
      },
    },
    {
      key: "steam",
      text: {
        ja: "加熱直後は蒸気でやけどしやすいので、ラップは奥から手前に向かって外してください。",
        en: "Steam can burn right after heating; peel the wrap away from you.",
        es: "El vapor puede quemar justo después de calentar; retira el film en dirección contraria a ti.",
        fr: "La vapeur peut brûler juste après la cuisson ; retirez le film en l'écartant de vous.",
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
    {
      key: "wash_raw",
      text: {
        ja: "生で食べる野菜とハーブは、流水でよく洗ってください。",
        en: "Wash raw vegetables and herbs well under running water.",
        es: "Lava bien con agua corriente las verduras y hierbas que se comen crudas.",
        fr: "Lavez bien sous l'eau courante les légumes et les herbes consommés crus.",
      },
    },
  ],
  substitutions: [],
};
