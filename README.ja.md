<!-- source: README.md blob 6b6a9542c9f999167b65941e58282e257975661c -->
[English](README.md) | 日本語

> この文書は[英語版](README.md)の翻訳です。内容が異なる場合は英語版が優先されます。

# Recipe Discovery

Recipe Discovery は、栄養を管理している人（たとえば筋力トレーニングや体組成の目標がある人）が、自分では思いつかなかった料理を見つけるためのアプリです。栄養の目標と実際の条件を設定し、候補のレシピを比べて分量を調整できます。栄養値は、日本食品標準成分表（八訂）増補2023年（文部科学省）と明示された材料の分量から、このアプリが決定論的に計算した推定値です。AI は使っていません。日本語、英語、スペイン語に対応しています。

**状態：** フェーズ 8（買い物リスト）が完了し、リリース 4 を https://recipe-discovery.musica-sanare.workers.dev に公開しています（[Release readiness](docs/working/RELEASE_READINESS.md)、英語のみ）。ライセンス：[MIT](LICENSE)。ただし `data/composition/` にある文部科学省由来のデータは対象外です（[データソース](docs/ja/DATA_SOURCES.md)）。

## クイックスタート

Node.js `>=24.15.0` と npm が必要です。

```bash
npm ci
npm run dev
```

`npm run check` で lint、型チェック、テスト、コンテンツ検証、本番ビルドを実行します。コマンドの一覧：[ローカル開発](docs/ja/DEVELOPMENT.md)。

## ドキュメント

- [ドキュメント索引](docs/ja/README.md)
- [プロダクト仕様](docs/ja/SPEC.md) · [栄養計算](docs/ja/NUTRITION_CALCULATION.md) · [データソースと出典表示](docs/ja/DATA_SOURCES.md)
