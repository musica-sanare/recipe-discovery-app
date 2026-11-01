import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "croque_monsieur",
  texts: {
    name: { ja: "クロックムッシュ（ハムとチーズのホットサンド）", en: "Croque-monsieur (toasted ham and cheese sandwich)", es: "Croque-monsieur (sándwich caliente de jamón y queso)", fr: "Croque-monsieur" },
    summary: {
      ja: "パリのカフェの定番をヒントに、食パンにハムとエメンタールチーズをはさみ、軽いホワイトソースをのせてトースターで焼きます。",
      en: "Inspired by a Paris café classic: ham and Emmental between slices of bread, topped with a light white sauce and toasted in a toaster oven.",
      es: "Inspirado en un clásico de los cafés de París: jamón y emmental entre rebanadas de pan, con una bechamel ligera por encima y tostado en el horno tostador.",
      fr: "Le classique des cafés parisiens : jambon et emmental entre deux tranches de pain, nappés d'une béchamel légère et dorés au four grille-pain.",
    },
  },
  cuisine: "french",
  goals: ["maintain"],
  mainProteinGroup: "pork",
  tags: ["breakfast"],
  minutes: 15,
  effort: 1,
  equipment: ["microwave", "oven_toaster"],
  servings: 1,
  ingredients: [
    { key: "ham", food: "ham", grams: 60, state: "as_is", measure: { unit: "slice", quantity: 6 }, role: "main_protein", adjust: { kind: "grams", min: 40, max: 100, step: 20 } },
    { key: "bread", food: "bread", grams: 120, state: "as_is", measure: { unit: "slice", quantity: 2 }, role: "main_carb" },
    { key: "cheese", food: "emmental", grams: 15, state: "as_is", role: "other" },
    { key: "mustard", food: "dijon_mustard", grams: 3, state: "as_is", measure: { unit: "tsp", quantity: 0.5 }, role: "seasoning" },
    { key: "milk", food: "milk", grams: 60, state: "as_is", role: "other" },
    { key: "flour", food: "wheat_flour", grams: 5, state: "as_is", measure: { unit: "tsp", quantity: 1.5 }, role: "other" },
    { key: "pepper", food: "black_pepper", grams: 0.2, state: "as_is", measure: { unit: "pinch", quantity: 1 }, role: "seasoning" },
    { key: "lettuce", food: "lettuce", grams: 40, state: "raw", role: "vegetable" },
    { key: "tomato", food: "tomato", grams: 60, state: "raw", measure: { unit: "piece", quantity: 0.5 }, role: "vegetable" },
  ],
  sides: [],
  steps: [
    {
      key: "sauce",
      text: {
        ja: "耐熱容器に薄力粉と牛乳を入れてよく混ぜ、ラップをせずに600Wで40秒加熱して混ぜます。もう一度30秒加熱して混ぜ、とろみをつけます。こしょうをふります。",
        en: "Whisk the flour and milk in a microwave-safe bowl and microwave uncovered at 600 W for 40 seconds, then stir. Heat for 30 more seconds and stir until thickened. Season with pepper.",
        es: "Mezcla bien la harina y la leche en un bol apto para microondas y caliéntalo sin tapar a 600 W 40 segundos; remueve. Calienta 30 segundos más y remueve hasta que espese. Añade pimienta.",
        fr: "Mélangez la farine et le lait dans un bol allant au micro-ondes et faites chauffer 40 secondes à 600 W sans couvrir, puis remuez. Faites chauffer encore 30 secondes et remuez jusqu'à ce que la sauce épaississe. Poivrez.",
      },
    },
    {
      key: "assemble",
      text: {
        ja: "食パン1枚にマスタードを塗り、ハムと半量のチーズをのせて、もう1枚の食パンを重ねます。上にホワイトソースを塗り、残りのチーズを散らします。",
        en: "Spread the mustard on one slice of bread, top it with the ham and half the cheese, and cover with the second slice. Spread the white sauce on top and scatter the rest of the cheese over it.",
        es: "Unta la mostaza en una rebanada de pan, coloca encima el jamón y la mitad del queso y cubre con la otra rebanada. Extiende la bechamel por encima y reparte el resto del queso.",
        fr: "Tartinez une tranche de pain de moutarde, garnissez-la de jambon et de la moitié du fromage, puis couvrez avec la seconde tranche. Nappez de béchamel et parsemez du reste de fromage.",
      },
    },
    {
      key: "toast",
      text: {
        ja: "アルミホイルにのせ、トースターで6〜8分、表面に焼き色がつくまで焼きます。ちぎったレタスと切ったトマトを添えます。",
        en: "Place it on foil and toast in a toaster oven for 6 to 8 minutes, until golden on top. Serve with the torn lettuce and sliced tomato.",
        es: "Colócalo sobre papel de aluminio y tuéstalo en el horno tostador de 6 a 8 minutos, hasta que se dore por encima. Sírvelo con la lechuga troceada y el tomate en rodajas.",
        fr: "Posez-le sur du papier aluminium et faites-le dorer 6 à 8 minutes au four grille-pain. Servez avec la laitue déchirée et la tomate en tranches.",
      },
    },
  ],
  safetyNotes: [
    {
      key: "hot_cheese",
      text: {
        ja: "焼き上がりのチーズとソースはとても熱いので、やけどに注意してください。",
        en: "The melted cheese and sauce are very hot straight from the toaster oven; take care not to burn yourself.",
        es: "El queso fundido y la salsa salen muy calientes del horno tostador; ten cuidado de no quemarte.",
        fr: "Le fromage fondu et la sauce sont très chauds à la sortie du four grille-pain ; attention à ne pas vous brûler.",
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
