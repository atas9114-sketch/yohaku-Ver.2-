import { useState, useRef, useCallback } from "react"
import Particle from "./Particle.jsx"
import CategoryBadge from "./CategoryBadge.jsx"

const PARTICLE_COLORS = [
  "rgba(180,210,240,0.9)",
  "rgba(240,180,210,0.9)",
  "rgba(255,230,180,0.9)",
  "rgba(200,230,255,0.9)",
  "rgba(220,200,255,0.9)",
]

/**
 * 個々のメモアイテム。
 * 真珠玉ボタンをタップすると光の粒アニメーション＋ハプティクスが発動し、
 * 高さをアニメーションで 0 に縮めてから onComplete を呼びます。
 */
export default function MemoItem({ item, onComplete, onDelete }) {
  const [completing, setCompleting] = useState(false)
  const [particles,  setParticles]  = useState([])
  const [height,     setHeight]     = useState("auto")
  const ref = useRef(null)

  const handleComplete = useCallback(() => {
    if (completing) return
    setCompleting(true)

    // ── ハプティクス ──
    if (navigator.vibrate) navigator.vibrate([30, 20, 30])

    // ── パーティクル生成 ──
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect()
      const cx = rect.left + rect.width  / 2
      const cy = rect.top  + rect.height / 2
      setParticles(Array.from({ length: 16 }, (_, i) => ({
        id: i,
        x: cx + (Math.random() - 0.5) * 80,
        y: cy + (Math.random() - 0.5) * 20,
        color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
      })))
    }

    // ── 高さを 0 に縮める ──
    setTimeout(() => {
      if (ref.current) {
        setHeight(ref.current.scrollHeight + "px")
        setTimeout(() => setHeight("0px"), 50)
      }
    }, 380)

    setTimeout(() => onComplete(item.id), 980)
  }, [completing, item.id, onComplete])

  return (
    <>
      {particles.map(p => (
        <Particle
          key={p.id} x={p.x} y={p.y} color={p.color}
          onDone={() => setParticles(ps => ps.filter(x => x.id !== p.id))}
        />
      ))}

      <div ref={ref} style={{
        height, overflow: "hidden",
        transition: completing
          ? "height 0.5s cubic-bezier(0.4,0,0.2,1), opacity 0.38s ease"
          : "none",
        opacity: completing ? 0 : 1,
        marginBottom: completing ? 0 : 2,
      }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 14,
          padding: "16px 4px",
          borderBottom: "1px solid rgba(180,210,240,0.13)",
        }}>

          {/* 真珠玉チェックボタン */}
          <button
            onClick={handleComplete}
            aria-label={`「${item.text}」を完了する`}
            style={{
              width: 28, height: 28, borderRadius: "50%",
              border: "none", cursor: "pointer", flexShrink: 0,
              background: "radial-gradient(circle at 35% 35%, rgba(255,255,255,0.95) 0%, rgba(210,230,250,0.7) 45%, rgba(180,210,240,0.5) 100%)",
              boxShadow: "inset 0 2px 4px rgba(255,255,255,0.8), inset 0 -2px 4px rgba(140,180,220,0.3), 0 2px 8px rgba(140,180,220,0.22)",
              transition: "transform 0.2s ease",
            }}
            onMouseEnter={e => e.currentTarget.style.transform = "scale(1.12)"}
            onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
          />

          {/* テキスト＋カテゴリバッジ */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontFamily: "'M PLUS Rounded 1c', sans-serif",
              fontSize: 16, color: "#5a8aaa",
              letterSpacing: "0.04em", lineHeight: 1.6, fontWeight: 400,
              marginBottom: item.category && item.category !== "all" ? 5 : 0,
            }}>
              {item.text}
            </div>
            <CategoryBadge catId={item.category} small />
          </div>

          {/* 削除ボタン */}
          <button
            onClick={() => onDelete(item.id)}
            aria-label={`「${item.text}」を削除する`}
            style={{
              background: "none", border: "none",
              color: "rgba(150,190,220,0.38)", fontSize: 18,
              cursor: "pointer", padding: "4px 8px", lineHeight: 1,
              transition: "color 0.2s", flexShrink: 0,
            }}
            onMouseEnter={e => e.currentTarget.style.color = "rgba(220,150,170,0.7)"}
            onMouseLeave={e => e.currentTarget.style.color = "rgba(150,190,220,0.38)"}
          >×</button>
        </div>
      </div>
    </>
  )
}
