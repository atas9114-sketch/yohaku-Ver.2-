import { useState, useRef, useEffect } from "react"
import { CATEGORIES, PLACEHOLDERS } from "../constants.js"

/**
 * メモ追加モーダル（ボトムシート）。
 * テキスト入力＋カテゴリ選択 → 「置く」ボタンで onAdd を呼びます。
 * 背景タップまたは「置く」後に自動でクローズします。
 */
export default function AddModal({ onAdd, onClose, placeholderIdx }) {
  const [text,  setText]  = useState("")
  const [catId, setCatId] = useState("body")
  const inputRef = useRef(null)

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 80)
    return () => clearTimeout(t)
  }, [])

  const handleSubmit = () => {
    if (!text.trim()) return
    onAdd(text.trim(), catId)
    onClose()
  }

  const handleKeyDown = e => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
    if (e.key === "Escape") onClose()
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="メモを追加"
      style={{
        position: "fixed", inset: 0, zIndex: 3000,
        background: "rgba(220,235,250,0.5)",
        backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)",
        display: "flex", alignItems: "flex-end", justifyContent: "center",
      }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: "100%", maxWidth: 420,
          background: "rgba(255,255,255,0.88)",
          backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
          borderRadius: "32px 32px 0 0", padding: "28px 24px 44px",
          boxShadow: "0 -8px 40px rgba(130,180,220,0.15)",
          border: "1px solid rgba(200,225,245,0.45)",
          fontFamily: "'M PLUS Rounded 1c', sans-serif",
          animation: "slideUp 0.4s cubic-bezier(0.34,1.56,0.64,1) both",
        }}
      >
        {/* ハンドル */}
        <div style={{
          width: 40, height: 4, borderRadius: 2,
          background: "rgba(160,200,230,0.3)", margin: "0 auto 22px",
        }} />

        <p style={{
          fontSize: 12, color: "rgba(140,185,215,0.6)",
          letterSpacing: "0.08em", textAlign: "center", marginBottom: 18,
        }}>
          心にあるものを、そっと置いてください。
        </p>

        {/* テキスト入力 */}
        <textarea
          ref={inputRef}
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={PLACEHOLDERS[placeholderIdx]}
          rows={2}
          style={{
            width: "100%", boxSizing: "border-box",
            background: "rgba(240,248,255,0.7)",
            border: "1.5px solid rgba(160,210,240,0.35)",
            borderRadius: 18, padding: "14px 18px",
            fontFamily: "'M PLUS Rounded 1c', sans-serif",
            fontSize: 16, color: "#5a8aaa",
            letterSpacing: "0.04em", lineHeight: 1.7,
            outline: "none", resize: "none",
            boxShadow: "0 2px 16px rgba(140,195,230,0.1)",
            marginBottom: 18,
          }}
        />

        {/* カテゴリ選択 */}
        <div style={{ marginBottom: 22 }}>
          <div style={{
            fontSize: 11, color: "rgba(140,185,215,0.55)",
            letterSpacing: "0.08em", marginBottom: 10,
          }}>
            カテゴリ
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {CATEGORIES.filter(c => c.id !== "all").map(cat => (
              <button
                key={cat.id}
                onClick={() => setCatId(cat.id)}
                style={{
                  padding: "6px 14px", borderRadius: 20,
                  border: `1.5px solid ${catId === cat.id ? cat.color : "rgba(180,215,245,0.2)"}`,
                  background: catId === cat.id ? cat.bg : "transparent",
                  color: catId === cat.id ? cat.color : "rgba(160,200,230,0.5)",
                  fontFamily: "'M PLUS Rounded 1c', sans-serif",
                  fontSize: 13, cursor: "pointer", letterSpacing: "0.04em",
                  transition: "all 0.2s ease",
                }}
              >
                {cat.emoji} {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* 送信ボタン */}
        <button
          onClick={handleSubmit}
          disabled={!text.trim()}
          style={{
            width: "100%", padding: "15px",
            borderRadius: 22, border: "none", cursor: text.trim() ? "pointer" : "default",
            background: text.trim()
              ? "linear-gradient(135deg, rgba(150,205,240,0.75), rgba(200,175,240,0.6))"
              : "rgba(200,225,245,0.3)",
            fontFamily: "'M PLUS Rounded 1c', sans-serif",
            fontSize: 16, letterSpacing: "0.08em",
            color: text.trim() ? "white" : "rgba(160,200,230,0.5)",
            boxShadow: text.trim() ? "0 6px 24px rgba(140,190,230,0.25)" : "none",
            transition: "all 0.3s ease",
          }}
        >
          置く
        </button>
      </div>
    </div>
  )
}
