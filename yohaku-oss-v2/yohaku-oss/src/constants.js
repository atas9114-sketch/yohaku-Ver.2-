// ═══════════════════════════════════════════════════════════════
//  YOHAKU — 定数定義
//  PSWメッセージ・カテゴリ・プレースホルダーをここで一元管理。
//  カスタマイズはこのファイルを編集するだけでOKです。
// ═══════════════════════════════════════════════════════════════

/**
 * 完了時にランダム表示される PSW 共感メッセージ。
 * 精神保健福祉士（PSW）の視点から、小さな達成を承認する言葉を集めています。
 * @type {string[]}
 */
export const PSW_MESSAGES = [
  "一歩進みましたね。\nそれだけで十分です。",
  "自分を大切にできましたね。\nお疲れ様でした。",
  "小さな一歩が、\n大きな変化を生みます。",
  "よく気づけましたね。\nあなたは頑張っています。",
  "それを手放せた。\n心が少し軽くなりましたね。",
  "完璧じゃなくていい。\n動いた自分を認めましょう。",
  "大丈夫です。\nあなたのペースで十分です。",
  "今日もよくやりましたね。\n休んでいいんですよ。",
  "気づいて、動けた。\nそれだけで素晴らしいことです。",
]

/**
 * 入力欄のプレースホルダーテキスト（4秒ごとに切り替わります）。
 * 「〜しなければ」という強迫観念を和らげるため、やさしい言葉にしています。
 * @type {string[]}
 */
export const PLACEHOLDERS = [
  "今、心にあること…",
  "気になっていること…",
  "やりたいな、と思うこと…",
  "頭の中にあるもの…",
  "自分を大切にできること…",
]

/**
 * メモのカテゴリ定義。
 * id "all" はフィルター専用で、メモには付与されません。
 * color: テキスト・ボーダー色 / bg: 背景色（いずれも rgba）
 * @type {{ id: string, label: string, emoji: string, color: string, bg: string }[]}
 */
export const CATEGORIES = [
  { id: "all",   label: "すべて",   emoji: "✦",  color: "rgba(130,185,220,0.7)", bg: "rgba(200,230,250,0.25)" },
  { id: "body",  label: "からだ",   emoji: "🌿", color: "rgba(120,190,150,0.8)", bg: "rgba(200,240,215,0.25)" },
  { id: "mind",  label: "こころ",   emoji: "🫧", color: "rgba(170,150,220,0.8)", bg: "rgba(230,220,255,0.25)" },
  { id: "daily", label: "くらし",   emoji: "☁️", color: "rgba(180,160,130,0.8)", bg: "rgba(245,235,220,0.25)" },
  { id: "joy",   label: "たのしみ", emoji: "🌸", color: "rgba(220,150,170,0.8)", bg: "rgba(255,225,235,0.25)" },
]

/** localStorage のキー */
export const STORAGE_KEY    = "yohaku_items_v2"
export const COMPLETED_KEY  = "yohaku_completed_v2"

/** 完了履歴の最大保存件数 */
export const MAX_COMPLETED  = 50

/** 初回起動時のサンプルメモ */
export const DEFAULT_ITEMS = [
  { id: 1, text: "朝、光を浴びる",   category: "body", createdAt: Date.now() },
  { id: 2, text: "顔を洗う",         category: "body", createdAt: Date.now() },
  { id: 3, text: "好きな音楽を聴く", category: "joy",  createdAt: Date.now() },
]
