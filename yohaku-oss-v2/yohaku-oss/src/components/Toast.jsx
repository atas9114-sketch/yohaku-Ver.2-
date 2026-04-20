import { useState, useEffect } from "react"

/**
 * 完了時に画面下部からふわっと浮かび上がる PSW 共感メッセージ。
 * 表示後 3.7 秒で自動消滅し onDone を呼びます。
 */
export default function Toast({ message, emoji = "✦", onDone }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true),  50)
    const t2 = setTimeout(() => setVisible(false), 3200)
    const t3 = setTimeout(onDone, 3700)
    return () => [t1, t2, t3].forEach(clearTimeout)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{
      position: "fixed", bottom: 90, left: "50%",
      transform: `translateX(-50%) translateY(${visible ? 0 : 20}px)`,
      opacity: visible ? 1 : 0,
      transition: "all 0.5s cubic-bezier(0.34,1.56,0.64,1)",
      background: "rgba(255,255,255,0.88)",
      backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
      border: "1px solid rgba(180,210,240,0.35)",
      borderRadius: 24, padding: "18px 28px",
      maxWidth: 300, width: "80%", textAlign: "center",
      boxShadow: "0 8px 32px rgba(130,180,220,0.18)",
      zIndex: 2000,
      fontFamily: "'M PLUS Rounded 1c', sans-serif",
      fontSize: 14, color: "#7aadcc", lineHeight: 1.8,
      whiteSpace: "pre-line", letterSpacing: "0.03em",
    }}>
      <div style={{ fontSize: 22, marginBottom: 6 }}>{emoji}</div>
      {message}
    </div>
  )
}
