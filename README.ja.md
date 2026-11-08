<!-- source: README.md blob d28b5c421bde1cfb6172ec62bf98e2bfab522ae6 -->
[English](README.md) | 日本語

> この文書は[英語版](README.md)の翻訳。内容が異なる場合は英語版が優先する。

# Recipe Discovery

Recipe Discovery は、栄養を管理している人（筋力トレーニングや体組成に目標がある人など）が、自分では思いつかない料理に出会うためのアプリだ。栄養の目標と実際の条件を決めると、候補のレシピを比べたり分量を調整したりできる。栄養値は、日本食品標準成分表（八訂）増補2023年（文部科学省）と、明示した材料の分量から、このアプリが決定論的に計算した推定値だ。AI は使わない。日本語、英語、スペイン語、フランス語に対応している。

**状態：** 4 言語・150 レシピのリリース 15 を https://recipe-discovery.apps.musica-sanare.com に公開している（フェーズ 18：UI の見直し。[Release readiness](docs/working/RELEASE_READINESS.md)、英語のみ）。ライセンスは [MIT](LICENSE)。ただし `data/composition/` にある文部科学省由来のデータは除く（[データソース](docs/ja/DATA_SOURCES.md)）。セキュリティの問題は[セキュリティポリシー](SECURITY.md)（英語のみ）に従って報告する。

## クイックスタート

Node.js `>=24.15.0` と npm が必要。

```bash
npm ci
```

```bash
npm run dev
```

`npm run check` は lint、型チェック、ライセンスチェック、テスト、本番ビルドを順に実行する。本番ビルドにはコンテンツ検証も含まれる。コマンドの一覧は[ローカル開発](docs/ja/DEVELOPMENT.md)にある。

## ドキュメント

- [ドキュメント索引](docs/ja/README.md)
- [プロダクト仕様](docs/ja/SPEC.md) · [栄養計算](docs/ja/NUTRITION_CALCULATION.md) · [データソースと出典表示](docs/ja/DATA_SOURCES.md)
