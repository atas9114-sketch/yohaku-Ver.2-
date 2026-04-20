import { useState, useEffect } from "react"

/**
 * 完了アニメーションで飛び散る光の粒。
 * MemoItem から生成され、アニメーション完了後に自己消滅します。
 */
export default function Particle({ x, y, color, onDone }) {
  const [style, setStyle] = useState({
    position: "fixed", left: x, top: y,
    width: 8, height: 8, borderRadius: "50%",
    background: color, opacity: 1,
    transform: "translate(-50%, -50%) scale(1)",
    transition: "none", pointerEvents: "none",
    zIndex: 1000, boxShadow: `0 0 6px ${color}`,
  })

  useEffect(() => {
    const angle = Math.random() * Math.PI * 2
    const dist  = 40 + Math.random() * 80
    const tx    = Math.cos(angle) * dist
    const ty    = Math.sin(angle) * dist - 30
    const scale = 0.2 + Math.random() * 0.6

    requestAnimationFrame(() => {
      setStyle(s => ({
        ...s,
        transition: "all 0.9s cubic-bezier(0.22,1,0.36,1)",
        transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(${scale})`,
        opacity: 0,
      }))
    })

    const t = setTimeout(onDone, 900)
    return () => clearTimeout(t)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return <div style={style} />
}
