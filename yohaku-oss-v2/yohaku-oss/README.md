# 🐋 YOHAKU（余白）

> *心にあるものを、そっと置いてください。*  
> *A mental health memo app that gives you space to breathe.*

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![Anthropic](https://img.shields.io/badge/AI-Anthropic%20Claude-blueviolet)](https://anthropic.com)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](./CONTRIBUTING.md)

---

## 📖 アプリについて

**YOHAKU（余白）** は、精神保健福祉士（PSW）の視点をもとに設計されたメンタルヘルス・メモアプリです。

タスクを「こなす」のではなく、頭の中にあることを **書き出す（外在化する）** ことで心を整え、完了するたびに **「自分を認める」体験** を積み重ねていくことができます。

### コアバリュー

| 機能 | 説明 |
|------|------|
| 🫧 **完了の儀式** | 光の粒アニメーション＋ハプティクスで「手放す」体験を演出 |
| 🌊 **AI 心の状態分析** | Anthropic Claude API による PSW 視点のやさしいフィードバック |
| 🏷 **カテゴリ分類** | からだ・こころ・くらし・たのしみ の 4 カテゴリ |
| 💬 **PSW 共感メッセージ** | 完了時にランダムで届く温かい言葉 |
| 💾 **自動保存** | localStorage による永続化（アカウント・サーバー不要） |

---

## 🚀 クイックスタート

### 必要環境

- Node.js 18 以上
- npm 9 以上

### セットアップ

```bash
# 1. クローン
git clone https://github.com/YOUR_USERNAME/yohaku.git
cd yohaku

# 2. 依存インストール
npm install

# 3. 環境変数を設定（AI分析を使う場合）
cp .env.example .env
# .env を開いて VITE_ANTHROPIC_API_KEY を設定

# 4. 開発サーバー起動
npm run dev
```

ブラウザで http://localhost:5173 を開いてください。

### ビルド

```bash
npm run build      # dist/ に出力
npm run preview    # ビルド結果をローカルで確認
```

---

## 🌊 AI 分析機能のセットアップ

AI 心の状態分析には **Anthropic API キー** が必要です。

1. [Anthropic Console](https://console.anthropic.com) でAPIキーを取得
2. `.env.example` をコピーして `.env` を作成：

```bash
cp .env.example .env
```

3. `.env` を編集：

```env
VITE_ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxx
```

> **⚠️ セキュリティ注意**  
> `.env` は `.gitignore` に含まれています。APIキーを絶対にコミットしないでください。  
> 本番環境ではサーバーサイドプロキシ経由でのAPI呼び出しを強く推奨します。

**APIキーなしでも** メモ追加・完了の儀式・カテゴリ・データ保存はすべて動作します。

---

## 📁 ファイル構成

```
yohaku/
├── src/
│   ├── App.jsx                  # メインアプリ・状態管理
│   ├── main.jsx                 # React エントリーポイント
│   ├── constants.js             # PSWメッセージ・カテゴリ・定数
│   ├── storage.js               # localStorage ユーティリティ
│   └── components/
│       ├── MemoItem.jsx         # メモアイテム（完了アニメーション）
│       ├── AddModal.jsx         # メモ追加モーダル
│       ├── AIPanel.jsx          # AI 心の状態分析パネル
│       ├── Toast.jsx            # PSW 共感メッセージトースト
│       ├── Particle.jsx         # 光の粒アニメーション
│       ├── WatercolorBg.jsx     # 水彩背景 + シャボン玉
│       └── CategoryBadge.jsx   # カテゴリバッジ
├── public/
│   └── index.html
├── .env.example                 # 環境変数テンプレート
├── .gitignore
├── vite.config.js
├── package.json
├── LICENSE                      # MIT License
├── CONTRIBUTING.md
└── README.md
```

---

## 🎨 カスタマイズ

すべての設定値は `src/constants.js` に集約されています。

### PSW 共感メッセージを変更する

```js
// src/constants.js
export const PSW_MESSAGES = [
  "一歩進みましたね。\nそれだけで十分です。",
  // ← メッセージを追加・編集
]
```

### カテゴリを追加する

```js
// src/constants.js
export const CATEGORIES = [
  { id: "all",    label: "すべて",   emoji: "✦",  color: "...", bg: "..." },
  { id: "body",   label: "からだ",   emoji: "🌿", color: "...", bg: "..." },
  // ← 新しいカテゴリを追加
  { id: "work",   label: "しごと",   emoji: "💼", color: "rgba(130,160,200,0.8)", bg: "rgba(210,225,245,0.25)" },
]
```

### 水彩背景の色を変える

`src/components/WatercolorBg.jsx` の各 blob の `background` プロパティを編集してください。

---

## ☁️ GitHub Pages へのデプロイ

```bash
# 1. vite.config.js の base をリポジトリ名に変更
#    例: base: '/yohaku/'

# 2. ビルド
npm run build

# 3. gh-pages パッケージでデプロイ
npm install -D gh-pages
npx gh-pages -d dist
```

Settings → Pages → Branch: `gh-pages` に設定すれば完了です。

---

## 🗺 ロードマップ

- [ ] Firebase 連携による複数デバイス同期
- [ ] PWA 対応（オフライン・ホーム画面追加）
- [ ] 週次・月次のふりかえり機能
- [ ] Flutter / React Native によるネイティブアプリ化
- [ ] 支援者（PSW・カウンセラー）との共有モード

---

## 🤝 コントリビュート

プルリクエスト・Issue・フィードバックはいつでも歓迎です！  
詳細は [CONTRIBUTING.md](./CONTRIBUTING.md) をご覧ください。

---

## ⚠️ 免責事項

このアプリは **一般的なウェルネス目的** で設計されており、医療・精神科的診断や治療の代替となるものではありません。

精神的な不調を感じている場合は、専門の医療機関または相談窓口にご相談ください。

- **よりそいホットライン**: 0120-279-338（24時間）
- **こころの健康相談統一ダイヤル**: 0570-064-556

---

## 📄 ライセンス

[MIT License](./LICENSE) © 2025 YOHAKU Contributors

---

<div align="center">
  🐋　<em>余白は、あなたの権利です。</em>
</div>
