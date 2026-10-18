// Japanese is the default locale and defines the shape of every UI catalog.
export const ja = {
  meta: {
    title: "Recipe Discovery — 栄養目標に合うレシピを見つける",
  },
  app: {
    name: "Recipe Discovery",
    tagline: "栄養目標と条件に合う、まだ知らないレシピを見つけよう。",
  },
  language: {
    label: "言語",
    names: {
      ja: "日本語",
      en: "English",
      es: "Español",
    },
  },
  common: {
    skipToContent: "本文へ移動",
  },
  content: {
    loading: "コンテンツを読み込んでいます…",
    error: "コンテンツを読み込めませんでした。通信状況を確認して、もう一度お試しください。",
    retry: "再読み込み",
    versions: "コンテンツ版 {{content}}・成分表データ {{composition}} 更新",
  },
  home: {
    status: "現在準備中です。",
  },
};

export type Messages = typeof ja;
