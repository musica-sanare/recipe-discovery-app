/** French word list of the free-text conditions parser (`../lexicon.ts`, ADR-039 D1). */
import type { Lexicon } from "../lexicon.ts";

export const fr: Lexicon = {
  locale: "fr",
  outOfScope: {
    allergens: ["allerg", "intoleran", "gluten", "lactose", "coeliaq", "celiaq"],
    targets: ["proteine", "calori", "kcal", "glucide", "lipide", "macros", "seche", "prise de masse", "regime", "maigrir", "perdre du poids"],
    other: ["diabet", "tension arterielle", "cholesterol", "sante", "maladie", "enceinte", "grossesse", "invent", "nouvelle recette", "cree une recette", "ignore", "instruction", "regles"],
  },
  negationPosition: "before",
  negation: ["sans", "sauf", "hormis", "excepte", "pas", "ni", "eviter", "evitez", "evite", "aucun", "aucune", "deteste", "horreur"],
  or: ["ou"],
  clauseBreaks: [],
  minuteUnits: ["minutes", "minute", "min"],
  hourUnits: ["heures", "heure", "h"],
  durations: [
    ["une demi-heure", 30],
    ["demi-heure", 30],
    ["une heure et demie", 90],
    ["une heure", 60],
    ["un quart d'heure", 15],
  ],
  equipment: {
    stove: ["plaque", "gaziniere", "feu", "rechaud"],
    microwave: ["micro-ondes", "micro ondes", "microondes"],
    oven_toaster: ["mini-four", "mini four", "four grille-pain"],
    pot: ["casserole", "marmite", "cocotte", "faitout"],
    frying_pan: ["poele"],
    deep_pan: ["sauteuse", "friteuse", "wok"],
  },
  cuisines: {
    japanese: ["japon"],
    chinese: ["chinois"],
    korean: ["corean", "coreen"],
    western: ["occidental"],
    spanish: ["espagnol", "espagne"],
    okinawan: ["okinawa"],
    latin_american: ["latino-americ", "latinoameric", "mexicain", "peruvien"],
    mediterranean: ["mediterran"],
    southeast_asian: ["asie du sud-est", "thailandais", "thai", "vietnamien"],
    french: ["francais", "france"],
    north_african: ["nord-africain", "afrique du nord", "maghreb", "marocain", "tunisien", "algerien"],
    west_african: ["ouest-africain", "afrique de l'ouest", "afrique occidentale", "senegalais", "ivoirien"],
  },
  groups: {
    chicken: ["poulet", "volaille"],
    pork: ["porc"],
    beef: ["boeuf"],
    fish: ["poisson", "poissons"],
    eggs: ["oeuf", "oeufs"],
    mushrooms: ["champignon", "champignons"],
  },
  notFoods: [],
  keepApart: [
    ["maïs", "maiis"],
    ["où", "ouu"],
  ],
};
