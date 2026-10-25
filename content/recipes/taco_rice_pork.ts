import type { Recipe } from "../../shared/content.ts";

export const recipe: Recipe = {
  id: "taco_rice_pork",
  texts: {
    name: { ja: "豚もも肉のタコライス", en: "Taco rice with lean pork", es: "Taco rice con cerdo magro" },
    summary: {
      ja: "沖縄のタコライスを、刻んだ豚もも肉で作ります。チリパウダーで炒めた肉と、レタス、トマト、チーズをご飯にのせます。",
      en: "Okinawan taco rice made with chopped lean pork: meat stir-fried with chili powder over rice with lettuce, tomato, and cheese.",
      es: "El taco rice de Okinawa con cerdo magro picado: carne salteada con chile en polvo sobre arroz con lechuga, tomate y queso.",
    },
  },
  cuisine: "okinawan",
  goals: ["maintain"],
  mainProteinGroup: "pork",
  tags: [],
  minutes: 15,
  effort: 1,
  equipment: ["stove", "frying_pan"],
  servings: 1,
  ingredients: [
    {
      key: "pork",
      food: "pork_leg",
      grams: 120,
      state: "raw",
      cooking: "stir_fry",
      role: "main_protein",
      adjust: { kind: "grams", min: 100, max: 180, step: 20 },
      note: {
        ja: "成分表に炒めた豚もも肉の値がないため、生の値で計算しています。",
        en: "The tables have no value for stir-fried pork leg, so the raw value is used.",
        es: "Las tablas no tienen un valor para la pierna de cerdo salteada, así que se usa el valor en crudo.",
      },
    },
    { key: "oil", food: "vegetable_oil", grams: 2, state: "as_is", measure: { unit: "tsp", quantity: 0.5 }, role: "fat", linkedTo: "pork" },
    { key: "chili_powder", food: "chili_powder", grams: 2, state: "as_is", measure: { unit: "tsp", quantity: 1 }, role: "seasoning", linkedTo: "pork" },
    { key: "soy_sauce", food: "soy_sauce", grams: 6, state: "as_is", measure: { unit: "tsp", quantity: 1 }, role: "seasoning", linkedTo: "pork" },
    { key: "onion", food: "onion", grams: 40, state: "stir_fry", role: "vegetable" },
    { key: "oil_onion", food: "vegetable_oil", grams: 2, state: "as_is", measure: { unit: "tsp", quantity: 0.5 }, role: "fat", includedIn: "onion" },
    { key: "tomato_canned", food: "tomato_canned", grams: 50, state: "as_is", role: "vegetable" },
    { key: "lettuce", food: "lettuce", grams: 40, state: "raw", role: "vegetable" },
    { key: "tomato", food: "tomato", grams: 60, state: "raw", measure: { unit: "piece", quantity: 1 / 3 }, role: "vegetable" },
    { key: "cheese", food: "mozzarella", grams: 15, state: "as_is", role: "other" },
    { key: "rice", food: "rice_cooked", grams: 200, state: "as_is", role: "main_carb", adjust: { kind: "grams", min: 150, max: 300, step: 25 } },
  ],
  sides: [],
  steps: [
    {
      key: "prep",
      text: {
        ja: "豚もも肉を包丁で5mm角程度に細かく刻みます。玉ねぎはみじん切り、レタスは細切り、トマトは1cm角に切ります。",
        en: "Chop the pork finely with a knife, into pieces of about 5 mm. Finely chop the onion, shred the lettuce, and cut the tomato into 1 cm dice.",
        es: "Pica el cerdo a cuchillo en trozos de unos 5 mm. Pica fina la cebolla, corta la lechuga en tiras y el tomate en dados de 1 cm.",
      },
    },
    {
      key: "stir_fry",
      text: {
        ja: "フライパンに油を中火で熱し、玉ねぎを2分炒めます。豚肉を加え、ほぐしながら色が変わるまで炒めます。",
        en: "Heat the oil in a frying pan over medium heat and stir-fry the onion for 2 minutes. Add the pork and stir-fry, breaking it up, until it changes color.",
        es: "Calienta el aceite en una sartén a fuego medio y saltea la cebolla 2 minutos. Añade el cerdo y saltéalo, deshaciéndolo, hasta que cambie de color.",
      },
    },
    {
      key: "season",
      text: {
        ja: "チリパウダー、しょうゆ、トマト缶を加え、汁気がほぼなくなるまで3分炒め煮にします。",
        en: "Add the chili powder, soy sauce, and canned tomatoes and cook for 3 minutes until the liquid has almost gone.",
        es: "Añade el chile en polvo, la salsa de soja y el tomate en lata y cocina 3 minutos hasta que casi no quede líquido.",
      },
    },
    {
      key: "serve",
      text: {
        ja: "器にご飯を盛り、レタス、肉、トマト、ちぎったチーズの順にのせます。",
        en: "Put the rice in a bowl and top with the lettuce, the meat, the tomato, and the torn cheese.",
        es: "Pon el arroz en un cuenco y cúbrelo con la lechuga, la carne, el tomate y el queso troceado.",
      },
    },
  ],
  safetyNotes: [
    {
      key: "mince_doneness",
      text: {
        ja: "細かく刻んだ肉は中心まで火を通してください。ピンク色が残らないよう、ほぐしながら炒めます。",
        en: "Cook finely chopped meat through, breaking it up until no pink remains.",
        es: "Cocina bien la carne picada, deshaciéndola hasta que no quede nada rosado.",
      },
    },
    {
      key: "wash_raw",
      text: {
        ja: "生で食べる野菜とハーブは、流水でよく洗ってください。",
        en: "Wash raw vegetables and herbs well under running water.",
        es: "Lava bien con agua corriente las verduras y hierbas que se comen crudas.",
      },
    },
  ],
  substitutions: [],
};
