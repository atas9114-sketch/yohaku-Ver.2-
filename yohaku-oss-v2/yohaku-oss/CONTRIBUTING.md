# 🌊 コントリビューションガイド

YOHAKUへの関心をありがとうございます。

## このプロジェクトが大切にしていること

- **シンプルさ** — 機能を増やすより、今ある機能を丁寧に育てる
- **共感** — ユーザーの不安・焦りに寄り添う設計を心がける
- **余白** — UIの情報密度を低く保ち、視覚的な空気感を大切に

## 貢献の方法

### 🐛 バグ報告
[Issues](https://github.com/YOUR_USERNAME/yohaku/issues) からどうぞ。  
OS・ブラウザ・バージョン、再現手順、期待値と実際の動作を含めてください。

### 💡 機能提案
Issues でお聞かせください。  
精神保健・セルフケアの観点からのご意見を特に歓迎します。

### 🔧 コード変更

```bash
# 1. フォーク後クローン
git clone https://github.com/YOUR_USERNAME/yohaku.git && cd yohaku

# 2. 依存インストール
npm install

# 3. ブランチ作成
git checkout -b feat/your-feature   # 機能追加
git checkout -b fix/bug-description # バグ修正

# 4. 開発サーバー起動
npm run dev

# 5. コミット（Conventional Commits 推奨）
git commit -m "feat: ○○を追加"
git commit -m "fix: ○○を修正"
git commit -m "docs: READMEを更新"

# 6. PR 作成
git push origin feat/your-feature
```

## ⚠️ 注意事項

- **PSW共感メッセージの変更は慎重に。** 精神保健に関わる言葉は受け取る人によって影響が異なります
- **APIキーは絶対にコミットしないでください。** `.env` は `.gitignore` に含まれています
- UI変更は「余白」と「やさしさ」を保つよう心がけてください

ご不明な点は Issue でご質問ください 🐋
