import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "chicken_steamed_chinese",
  texts: {
    name: { ja: "鶏むね肉の中華風レンジ蒸し", en: "Chinese-style microwave-steamed chicken", es: "Pollo al vapor al estilo chino en el microondas", fr: "Poulet vapeur à la chinoise au micro-ondes" },
    summary: {
      ja: "中華のよだれ鶏をヒントに、鶏むね肉を電子レンジで蒸し、ねぎとしょうがの香るしょうゆだれをかけます。きゅうりとご飯を添えます。",
      en: "Inspired by Chinese steamed chicken with sauce: chicken breast steamed in the microwave and dressed with a soy sauce with green onion and ginger, with cucumber and rice.",
      es: "Inspirado en el pollo al vapor chino con salsa: pechuga de pollo al vapor en el microondas con una salsa de soja con puerro y jengibre, con pepino y arroz.",
      fr: "Inspiré du poulet vapeur chinois en sauce : blanc de poulet cuit à la vapeur au micro-ondes et nappé d'une sauce soja au poireau et au gingembre, avec du concombre et du riz.",
    },
  },
  cuisine: "chinese",
  goals: ["cut"],
  mainProteinGroup: "chicken",
  tags: [],
  minutes: 10,
  effort: 1,
  equipment: ["microwave"],
  servings: 1,
  ingredients: [
    {
      key: "chicken",
      food: "chicken_breast",
      grams: 180,
      state: "raw",
      cooking: "microwave",
      role: "main_protein",
      adjust: { kind: "grams", min: 140, max: 240, step: 20 },
      note: {
        ja: "成分表に電子レンジで加熱した鶏むね肉の値がないため、生の値で計算しています。",
        en: "The tables have no value for microwaved chicken breast, so the raw value is used.",
        es: "Las tablas no tienen un valor para la pechuga de pollo hecha en el microondas, así que se usa el valor en crudo.",
        fr: "Les tables n'ont pas de valeur pour le blanc de poulet cuit au micro-ondes ; la valeur à l'état cru est donc utilisée.",
      },
    },
    { key: "sake", food: "cooking_sake", grams: 10, state: "as_is", measure: { unit: "tsp", quantity: 2 }, role: "seasoning", linkedTo: "chicken" },
    { key: "salt", food: "salt", grams: 0.5, state: "as_is", measure: { unit: "pinch", quantity: 1 }, role: "seasoning", linkedTo: "chicken" },
    { key: "long_onion", food: "long_onion", grams: 20, state: "raw", role: "vegetable" },
    { key: "ginger", food: "ginger", grams: 5, state: "raw", measure: { unit: "knob", quantity: 0.5 }, role: "seasoning" },
    { key: "soy_sauce", food: "soy_sauce", grams: 6, state: "as_is", measure: { unit: "tsp", quantity: 1 }, role: "seasoning" },
    { key: "vinegar", food: "rice_vinegar", grams: 5, state: "as_is", measure: { unit: "tsp", quantity: 1 }, role: "seasoning" },
    { key: "sesame_oil", food: "sesame_oil", grams: 2, state: "as_is", measure: { unit: "tsp", quantity: 0.5 }, role: "fat" },
    { key: "cucumber", food: "cucumber", grams: 50, state: "raw", measure: { unit: "piece", quantity: 0.5 }, role: "vegetable" },
    { key: "rice", food: "rice_cooked", grams: 150, state: "as_is", role: "main_carb", adjust: { kind: "grams", min: 100, max: 250, step: 25 } },
  ],
  sides: [
    { key: "rice", label: { ja: "ご飯", en: "Rice", es: "Arroz", fr: "Riz" }, ingredients: ["rice"], solverMayRemove: true },
  ],
  steps: [
    {
      key: "steam",
      text: {
        ja: "鶏むね肉を厚さ1cmのそぎ切りにして耐熱皿に重ならないように並べ、塩と料理酒をふります。ふんわりとラップをかけて600Wで3分加熱し、裏返してさらに1〜2分加熱します。",
        en: "Slice the chicken breast at an angle into 1 cm thick pieces, lay them in a single layer in a heatproof dish, and sprinkle with the salt and cooking sake. Cover loosely with plastic wrap, microwave at 600 W for 3 minutes, turn the pieces, and heat for 1–2 more minutes.",
        es: "Corta la pechuga en lonchas al bies de 1 cm, colócalas sin amontonar en un plato apto para microondas y rocíalas con la sal y el sake de cocina. Cubre sin apretar con film, calienta a 600 W durante 3 minutos, dales la vuelta y calienta 1-2 minutos más.",
        fr: "Coupez le blanc de poulet en biais en tranches de 1 cm d'épaisseur, disposez-les en une seule couche dans un plat allant au micro-ondes et arrosez-les de sel et de saké de cuisine. Couvrez sans serrer de film alimentaire, faites chauffer 3 minutes à 600 W, retournez les morceaux et faites chauffer encore 1 à 2 minutes.",
      },
    },
    {
      key: "sauce",
      text: {
        ja: "ねぎとしょうがをみじん切りにし、しょうゆ、酢、ごま油と混ぜます。きゅうりは細切りにします。",
        en: "Finely chop the leek and ginger and mix with the soy sauce, vinegar, and sesame oil. Cut the cucumber into thin strips.",
        es: "Pica fino el puerro y el jengibre y mézclalos con la salsa de soja, el vinagre y el aceite de sésamo. Corta el pepino en tiras finas.",
        fr: "Hachez finement le poireau et le gingembre et mélangez-les avec la sauce soja, le vinaigre et l'huile de sésame. Coupez le concombre en fines lanières.",
      },
    },
    {
      key: "serve",
      text: {
        ja: "鶏肉の中心まで火が通っていることを確かめ、きゅうりと一緒に器に盛ってたれをかけます。",
        en: "Check that the chicken is cooked through, plate it with the cucumber, and pour the sauce over.",
        es: "Comprueba que el pollo esté bien hecho, sírvelo con el pepino y vierte la salsa por encima.",
        fr: "Vérifiez que le poulet est cuit à cœur, dressez-le avec le concombre et nappez de sauce.",
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
      key: "even_heating",
      text: {
        ja: "電子レンジは加熱むらが出やすいので、鶏肉の中心まで火が通っているか確かめ、足りなければ30秒ずつ追加加熱してください。",
        en: "Microwaves heat unevenly. Check that the chicken is cooked in the center and add 30-second bursts if needed.",
        es: "El microondas calienta de forma desigual. Comprueba que el pollo esté hecho en el centro y añade tandas de 30 segundos si hace falta.",
        fr: "Le micro-ondes chauffe de façon inégale. Vérifiez que le poulet est cuit au centre et ajoutez des tranches de 30 secondes si nécessaire.",
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
