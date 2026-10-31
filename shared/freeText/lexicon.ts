/**
 * Word lists of the free-text conditions parser (ADR-034, revised again), one per locale.
 * They are canonical repository content like the UI catalogs: Claude drafts them, the
 * owner reviews them (ADR-007, ADR-033). Entries are matched after `normalizeForSearch`
 * of their locale, so case, width, kana, and accents do not matter. Food names come from
 * the food dictionary, not from here; only group words are listed.
 */
import type { Cuisine, Equipment, ProteinGroup } from "../content.ts";
import type { Locale } from "../locales.ts";
import type { OutOfScopeTopic } from "../suggestion.ts";

export const FOOD_GROUP_WORDS = ["chicken", "pork", "beef", "fish", "eggs", "mushrooms"] as const;
export type FoodGroupWord = (typeof FOOD_GROUP_WORDS)[number];

/**
 * The dictionary foods a group word covers: a protein group, minus foods that the group
 * word does not name ("fish" is not shellfish, squid, or octopus), or a list of foods.
 */
export const FOOD_GROUPS: Readonly<Record<FoodGroupWord, { readonly proteinGroup: ProteinGroup; readonly except?: readonly string[] } | { readonly foods: readonly string[] }>> = {
  chicken: { proteinGroup: "chicken" },
  pork: { proteinGroup: "pork" },
  beef: { proteinGroup: "beef" },
  fish: { proteinGroup: "fish", except: ["shrimp", "squid", "octopus_boiled"] },
  eggs: { proteinGroup: "egg" },
  mushrooms: { foods: ["shimeji", "shiitake", "eringi"] },
};

export interface Lexicon {
  /**
   * Words of a request the feature declines, by topic, checked in this order. Matched as
   * word prefixes in `en`, `es`, and `fr` ("allerg" covers allergy and allergic).
   */
  readonly outOfScope: Readonly<Record<OutOfScopeTopic, readonly string[]>>;
  /** Where a negation stands relative to the foods it negates in a clause. */
  readonly negationPosition: "before" | "after";
  readonly negation: readonly string[];
  /** Joins alternatives into one any-of item ("lentils or chickpeas"). */
  readonly or: readonly string[];
  /** Words that end a clause, besides punctuation. */
  readonly clauseBreaks: readonly string[];
  /** Units after a number. */
  readonly minuteUnits: readonly string[];
  readonly hourUnits: readonly string[];
  /** Phrases that state a duration without a digit. */
  readonly durations: readonly (readonly [phrase: string, minutes: number])[];
  readonly equipment: Readonly<Record<Equipment, readonly string[]>>;
  /** Word prefixes in `en`, `es`, and `fr` ("japon" covers japonés and japonaise). */
  readonly cuisines: Readonly<Record<Cuisine, readonly string[]>>;
  readonly groups: Readonly<Record<FoodGroupWord, readonly string[]>>;
  /** Phrases that contain a food name but are not foods (晩ごはん is dinner, not rice). */
  readonly notFoods: readonly string[];
  /** Words that accent folding would merge with another word, with a spelling kept apart (maïs and mais). */
  readonly keepApart: readonly (readonly [word: string, kept: string])[];
}

const ja: Lexicon = {
  outOfScope: {
    allergens: ["アレルギー", "あれるぎー", "不耐症", "グルテン", "乳糖", "セリアック"],
    targets: ["タンパク質", "たんぱく質", "蛋白質", "カロリー", "kcal", "キロカロリー", "糖質", "脂質", "炭水化物", "減量", "ダイエット", "増量", "栄養", "pfc"],
    other: ["糖尿病", "血圧", "コレステロール", "病気", "健康", "治療", "妊娠", "持病", "レシピを考え", "新しいレシピ", "レシピを作って", "無視", "ルール", "指示", "プロンプト"],
  },
  negationPosition: "after",
  negation: ["なしで", "なし", "無し", "抜きで", "抜き", "ぬき", "以外", "入れない", "入れず", "使わない", "使わず", "使えない", "使えず", "食べない", "食べられない", "苦手", "嫌い", "きらい", "除いて", "除く", "抜いて", "いらない", "要らない", "避けたい", "避けて"],
  or: ["か", "または", "もしくは", "あるいは"],
  clauseBreaks: ["けど", "けれど", "ただし"],
  minuteUnits: ["分"],
  hourUnits: ["時間"],
  durations: [
    ["半時間", 30],
    ["一時間", 60],
    ["1時間半", 90],
  ],
  equipment: {
    stove: ["コンロ", "ガス", "ih"],
    microwave: ["電子レンジ", "レンジ", "れんじ"],
    oven_toaster: ["オーブントースター", "トースター"],
    pot: ["鍋", "なべ"],
    frying_pan: ["フライパン"],
    deep_pan: ["揚げ鍋", "深鍋", "深めの鍋"],
  },
  cuisines: {
    japanese: ["和食", "和風", "日本料理"],
    chinese: ["中華", "中国料理", "中国風"],
    korean: ["韓国"],
    western: ["洋食", "洋風"],
    spanish: ["スペイン"],
    okinawan: ["沖縄"],
    latin_american: ["中南米", "ラテン", "メキシコ", "ペルー"],
    mediterranean: ["地中海"],
    southeast_asian: ["東南アジア", "タイ料理", "タイ風", "ベトナム", "エスニック"],
  },
  groups: {
    chicken: ["鶏肉", "とりにく", "鶏", "チキン"],
    pork: ["豚肉", "ぶたにく", "豚"],
    beef: ["牛肉", "ぎゅうにく", "牛"],
    fish: ["魚", "さかな", "魚介"],
    eggs: ["卵", "たまご", "玉子"],
    mushrooms: ["きのこ", "茸"],
  },
  notFoods: ["晩ごはん", "晩ご飯", "朝ごはん", "朝ご飯", "昼ごはん", "昼ご飯", "夕ごはん", "夕ご飯", "夜ごはん", "夜ご飯"],
  keepApart: [],
};

const en: Lexicon = {
  outOfScope: {
    allergens: ["allerg", "intoleran", "gluten", "lactose", "celiac", "coeliac", "anaphyla"],
    targets: ["protein", "calori", "kcal", "carb", "macro", "cutting", "bulking", "low-fat", "low fat", "diet", "weight loss", "lose weight"],
    other: ["diabet", "blood pressure", "cholesterol", "health", "disease", "pregnan", "cure", "invent", "new recipe", "create a recipe", "make up a recipe", "ignore", "instruction", "rules", "system prompt"],
  },
  negationPosition: "before",
  negation: ["no", "not", "without", "except", "excluding", "anything but", "everything but", "nothing with", "leave out", "skip", "avoid", "hold the", "don't", "do not", "can't", "cannot", "can not", "dislike", "hate", "none"],
  or: ["or"],
  clauseBreaks: [],
  minuteUnits: ["minutes", "minute", "mins", "min"],
  hourUnits: ["hours", "hour", "hrs", "hr", "h"],
  durations: [
    ["half an hour", 30],
    ["half hour", 30],
    ["an hour and a half", 90],
    ["an hour", 60],
    ["one hour", 60],
    ["quarter of an hour", 15],
  ],
  equipment: {
    stove: ["stove", "hob", "cooktop", "burner", "gas"],
    microwave: ["microwave"],
    oven_toaster: ["toaster oven", "oven toaster"],
    pot: ["pot", "saucepan", "one-pot"],
    frying_pan: ["frying pan", "skillet", "pan"],
    deep_pan: ["deep pan", "wok", "deep fryer"],
  },
  cuisines: {
    japanese: ["japanese"],
    chinese: ["chinese"],
    korean: ["korean"],
    western: ["western"],
    spanish: ["spanish"],
    okinawan: ["okinawa"],
    latin_american: ["latin american", "latin-american", "latino", "mexican", "peruvian"],
    mediterranean: ["mediterranean"],
    southeast_asian: ["southeast asian", "south-east asian", "thai", "vietnamese"],
  },
  groups: {
    chicken: ["chicken", "poultry"],
    pork: ["pork"],
    beef: ["beef"],
    fish: ["fish"],
    eggs: ["egg", "eggs"],
    mushrooms: ["mushroom", "mushrooms"],
  },
  notFoods: [],
  keepApart: [],
};

const es: Lexicon = {
  outOfScope: {
    allergens: ["alergi", "alergic", "intoleran", "gluten", "lactosa", "celiac"],
    targets: ["protein", "calori", "kcal", "carbohidrat", "macros", "deficit", "volumen", "dieta", "adelgaz", "perder peso", "grasa"],
    other: ["diabet", "presion arterial", "tension arterial", "colesterol", "salud", "enfermedad", "embaraz", "invent", "receta nueva", "nueva receta", "crea una receta", "ignora", "instruccion", "reglas"],
  },
  negationPosition: "before",
  negation: ["sin", "menos", "excepto", "salvo", "no", "ni", "nada de", "evitar", "evita", "quitar", "quita", "odio", "detesto"],
  or: ["o", "u"],
  clauseBreaks: [],
  minuteUnits: ["minutos", "minuto", "min"],
  hourUnits: ["horas", "hora", "h"],
  durations: [
    ["media hora", 30],
    ["hora y media", 90],
    ["una hora", 60],
    ["un cuarto de hora", 15],
  ],
  equipment: {
    stove: ["fogon", "hornalla", "estufa", "vitroceramica", "cocina de gas"],
    microwave: ["microondas"],
    oven_toaster: ["horno tostador", "horno electrico pequeno", "tostadora de horno"],
    pot: ["olla", "cacerola", "cazo"],
    frying_pan: ["sarten"],
    deep_pan: ["olla honda", "freidora", "wok"],
  },
  cuisines: {
    japanese: ["japon"],
    chinese: ["chino", "china"],
    korean: ["corean"],
    western: ["occidental"],
    spanish: ["espanol", "espanola", "espana"],
    okinawan: ["okinaw"],
    latin_american: ["latinoameric", "mexican", "peruan"],
    mediterranean: ["mediterran"],
    southeast_asian: ["sudeste asiatic", "tailandes", "vietnamit"],
  },
  groups: {
    chicken: ["pollo", "pollos"],
    pork: ["cerdo", "puerco", "chancho"],
    beef: ["ternera", "res", "carne de res", "vacuno", "carne de vaca"],
    fish: ["pescado", "pescados"],
    eggs: ["huevo", "huevos"],
    mushrooms: ["setas", "hongos", "champinones", "champinon"],
  },
  notFoods: [],
  keepApart: [],
};

const fr: Lexicon = {
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

export const LEXICONS: Readonly<Record<Locale, Lexicon>> = { ja, en, es, fr };
