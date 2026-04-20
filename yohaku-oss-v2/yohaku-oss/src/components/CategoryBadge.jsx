import { CATEGORIES } from "../constants.js"

/**
 * カテゴリ名を小さなバッジで表示するコンポーネント。
 * id が "all" または未定義の場合は何も描画しません。
 *
 * @param {{ catId: string, small?: boolean }} props
 */
export default function CategoryBadge({ catId, small = false }) {
  const cat = CATEGORIES.find(c => c.id === catId)
  if (!cat || catId === "all") return null

  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 3,
      padding: small ? "2px 8px" : "3px 10px",
      borderRadius: 20,
      background: cat.bg,
      border: `1px solid ${cat.color}40`,
      fontSize: small ? 11 : 12,
      color: cat.color,
      fontFamily: "'M PLUS Rounded 1c', sans-serif",
      letterSpacing: "0.04em",
      flexShrink: 0,
    }}>
      {cat.emoji} {cat.label}
    </span>
  )
}
