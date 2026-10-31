import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "tofu_sasami_steamed",
  texts: {
    name: { ja: "豆腐とささみのレンジ蒸し", en: "Microwave-steamed tofu with chicken", es: "Tofu al vapor con pollo en el microondas", fr: "Tofu au poulet cuit à la vapeur au micro-ondes" },
    summary: {
      ja: "中華の蒸し物をヒントに、木綿豆腐にしょうがとねぎを混ぜたささみをのせ、電子レンジで蒸してしょうゆのあんをかけます。ご飯を添えます。",
      en: "Inspired by Chinese steamed dishes: firm tofu topped with chopped chicken tenderloin, ginger, and leek, steamed in the microwave and finished with a soy sauce glaze, with rice.",
      es: "Inspirado en los platos al vapor chinos: tofu firme cubierto con solomillo de pollo picado, jengibre y puerro, hecho al vapor en el microondas y terminado con una salsa espesa de soja, con arroz.",
      fr: "Inspiré des plats vapeur chinois : tofu ferme garni d'aiguillette de poulet hachée, de gingembre et de poireau japonais, cuit à la vapeur au micro-ondes et nappé d'une sauce soja liée, avec du riz.",
    },
  },
  cuisine: "chinese",
  goals: ["maintain"],
  mainProteinGroup: "soy",
  tags: [],
  minutes: 15,
  effort: 1,
  equipment: ["microwave"],
  servings: 1,
  ingredients: [
    {
      key: "tofu",
      food: "tofu_firm",
      grams: 250,
      state: "raw",
      cooking: "microwave",
      role: "main_protein",
      adjust: { kind: "grams", min: 150, max: 350, step: 50 },
      note: {
        ja: "成分表に加熱した豆腐の値がないため、加熱前の値で計算しています。",
        en: "The tables have no value for cooked tofu, so the uncooked value is used.",
        es: "Las tablas no tienen un valor para el tofu cocinado, así que se usa el valor sin cocinar.",
        fr: "Les tables n'ont pas de valeur pour le tofu cuit ; la valeur avant cuisson est donc utilisée.",
      },
    },
    {
      key: "sasami",
      food: "chicken_sasami",
      grams: 60,
      state: "raw",
      cooking: "microwave",
      role: "main_protein",
      note: {
        ja: "成分表に電子レンジで加熱したささみの値がないため、生の値で計算しています。",
        en: "The tables have no value for microwaved chicken tenderloin, so the raw value is used.",
        es: "Las tablas no tienen un valor para el solomillo de pollo hecho en el microondas, así que se usa el valor en crudo.",
        fr: "Les tables n'ont pas de valeur pour l'aiguillette de poulet cuite au micro-ondes ; la valeur à l'état cru est donc utilisée.",
      },
    },
    { key: "ginger", food: "ginger", grams: 3, state: "raw", role: "seasoning" },
    { key: "long_onion", food: "long_onion", grams: 15, state: "raw", role: "vegetable" },
    { key: "soy_sauce", food: "soy_sauce", grams: 6, state: "as_is", measure: { unit: "tsp", quantity: 1 }, role: "seasoning" },
    { key: "starch", food: "potato_starch", grams: 3, state: "as_is", measure: { unit: "tsp", quantity: 1 }, role: "seasoning" },
    { key: "sesame_oil", food: "sesame_oil", grams: 1, state: "as_is", measure: { unit: "tsp", quantity: 0.25 }, role: "fat" },
    { key: "green_onion", food: "green_onion", grams: 3, state: "raw", role: "vegetable" },
    { key: "rice", food: "rice_cooked", grams: 150, state: "as_is", role: "main_carb", adjust: { kind: "grams", min: 100, max: 250, step: 25 } },
  ],
  sides: [
    { key: "rice", label: { ja: "ご飯", en: "Rice", es: "Arroz", fr: "Riz" }, ingredients: ["rice"], solverMayRemove: true },
  ],
  steps: [
    {
      key: "prep",
      text: {
        ja: "豆腐をキッチンペーパーで包んで水気を拭き、4等分に切って耐熱皿に並べます。ささみは筋を除いて包丁で細かくたたき、みじん切りにしたしょうがとねぎを混ぜます。",
        en: "Pat the tofu dry with paper towels, cut it into 4 pieces, and arrange them in a heatproof dish. Remove the tendon from the chicken tenderloin, chop it finely with a knife, and mix with the finely chopped ginger and leek.",
        es: "Seca el tofu con papel de cocina, córtalo en 4 trozos y colócalos en un plato apto para microondas. Quita el tendón del solomillo de pollo, pícalo fino a cuchillo y mézclalo con el jengibre y el puerro picados.",
        fr: "Épongez le tofu avec du papier absorbant, coupez-le en 4 morceaux et disposez-les dans un plat résistant à la chaleur. Retirez le tendon de l'aiguillette de poulet, hachez-la finement au couteau et mélangez-la avec le gingembre et le poireau japonais finement hachés.",
      },
    },
    {
      key: "steam",
      text: {
        ja: "豆腐の上にささみを等分にのせて広げ、ふんわりとラップをかけて600Wで4〜5分加熱します。",
        en: "Spread the chicken evenly over the tofu pieces, cover loosely with plastic wrap, and microwave at 600 W for 4–5 minutes.",
        es: "Reparte el pollo sobre los trozos de tofu, cubre sin apretar con film y calienta a 600 W durante 4-5 minutos.",
        fr: "Étalez le poulet uniformément sur les morceaux de tofu, couvrez sans serrer de film alimentaire et faites chauffer au micro-ondes à 600 W pendant 4 à 5 minutes.",
      },
    },
    {
      key: "sauce",
      text: {
        ja: "耐熱の器にしょうゆ、片栗粉、水大さじ3を混ぜ、600Wで40秒加熱してよく混ぜ、とろみをつけます。ごま油を加えます。",
        en: "In a heatproof cup, mix the soy sauce, potato starch, and 3 tbsp of water, microwave at 600 W for 40 seconds, and stir well until thickened. Add the sesame oil.",
        es: "En un recipiente apto para microondas, mezcla la salsa de soja, la fécula de patata y 3 cucharadas de agua, calienta a 600 W durante 40 segundos y remueve bien hasta que espese. Añade el aceite de sésamo.",
        fr: "Dans une tasse résistant à la chaleur, mélangez la sauce soja, la fécule et 3 cuillères à soupe d'eau, faites chauffer au micro-ondes à 600 W pendant 40 secondes et remuez bien jusqu'à ce que la sauce épaississe. Ajoutez l'huile de sésame.",
      },
    },
    {
      key: "serve",
      text: {
        ja: "ささみの中心まで火が通っていることを確かめ、あんをかけて刻んだ青ねぎを散らします。",
        en: "Check that the chicken is cooked through, pour the sauce over, and sprinkle with the chopped green onion.",
        es: "Comprueba que el pollo esté bien hecho, vierte la salsa por encima y espolvorea la cebolleta picada.",
        fr: "Vérifiez que le poulet est cuit à cœur, nappez de sauce et parsemez d'oignon vert haché.",
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
      key: "mince_doneness",
      text: {
        ja: "細かく刻んだ肉は中心まで火を通してください。ピンク色が残っていれば、さらに加熱します。",
        en: "Cook finely chopped meat through. If any pink remains, heat it longer.",
        es: "Cocina bien la carne picada. Si queda algo rosado, caliéntala más tiempo.",
        fr: "Faites bien cuire la viande hachée. S'il reste du rose, prolongez la cuisson.",
      },
    },
    {
      key: "even_heating",
      text: {
        ja: "電子レンジは加熱むらが出やすいので、ささみの中心まで火が通っているか確かめ、足りなければ30秒ずつ追加加熱してください。",
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
  ],
  substitutions: [],
};
