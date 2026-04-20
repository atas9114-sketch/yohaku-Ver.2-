/**
 * 水彩画風の揺れるグラデーション背景。
 * 3色のblobが緩やかにアニメーションし、
 * シャボン玉が下から浮かび上がります。
 */
export function WatercolorBg() {
  return (
    <div style={{ position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
      {/* ブルーblog */}
      <div style={{
        position: "absolute", top: "-20%", left: "-15%", width: "70%", height: "70%",
        borderRadius: "60% 40% 70% 30% / 50% 60% 40% 50%",
        background: "radial-gradient(ellipse, rgba(180,215,245,0.32) 0%, rgba(180,215,245,0.04) 70%)",
        filter: "blur(40px)", animation: "drift1 18s ease-in-out infinite alternate",
      }} />
      {/* ピンクblob */}
      <div style={{
        position: "absolute", top: "10%", right: "-20%", width: "65%", height: "60%",
        borderRadius: "40% 60% 30% 70% / 60% 40% 60% 40%",
        background: "radial-gradient(ellipse, rgba(245,190,215,0.25) 0%, rgba(245,190,215,0.03) 70%)",
        filter: "blur(50px)", animation: "drift2 22s ease-in-out infinite alternate",
      }} />
      {/* イエローblob */}
      <div style={{
        position: "absolute", bottom: "-10%", left: "20%", width: "60%", height: "55%",
        borderRadius: "50% 50% 30% 70% / 40% 60% 40% 60%",
        background: "radial-gradient(ellipse, rgba(255,235,180,0.2) 0%, rgba(255,235,180,0.03) 70%)",
        filter: "blur(45px)", animation: "drift3 20s ease-in-out infinite alternate",
      }} />
      {/* 中央グロー */}
      <div style={{
        position: "absolute", top: "30%", left: "25%", width: "50%", height: "40%",
        background: "radial-gradient(ellipse, rgba(230,240,255,0.35) 0%, transparent 70%)",
        filter: "blur(30px)",
      }} />

      <style>{`
        @keyframes drift1 { 0%{transform:translate(0,0) rotate(0deg)} 100%{transform:translate(30px,20px) rotate(8deg)} }
        @keyframes drift2 { 0%{transform:translate(0,0) rotate(0deg)} 100%{transform:translate(-25px,30px) rotate(-6deg)} }
        @keyframes drift3 { 0%{transform:translate(0,0) rotate(0deg)} 100%{transform:translate(20px,-25px) rotate(5deg)} }
        @keyframes floatIn { 0%{opacity:0;transform:translateY(16px)} 100%{opacity:1;transform:translateY(0)} }
        @keyframes shimmer { 0%,100%{opacity:0.5;transform:scale(1)} 50%{opacity:1;transform:scale(1.08)} }
        @keyframes bubbleFloat { 0%{transform:translateY(0) scale(1);opacity:0.3} 50%{opacity:0.55} 100%{transform:translateY(-40px) scale(1.1);opacity:0} }
        @keyframes slideUp { 0%{transform:translateY(60px);opacity:0} 100%{transform:translateY(0);opacity:1} }
        @keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.05)} }
      `}</style>
    </div>
  )
}

const BUBBLES = [
  { size: 10, left: "8%",  bottom: "22%", delay: "0s",   dur: "6s"  },
  { size: 6,  left: "15%", bottom: "30%", delay: "1.5s", dur: "8s"  },
  { size: 14, left: "80%", bottom: "18%", delay: "0.8s", dur: "7s"  },
  { size: 8,  left: "88%", bottom: "35%", delay: "2s",   dur: "5s"  },
  { size: 5,  left: "50%", bottom: "12%", delay: "3s",   dur: "9s"  },
]

/** 画面下部から浮かび上がるシャボン玉 */
export function Bubbles() {
  return (
    <>
      {BUBBLES.map((b, i) => (
        <div key={i} style={{
          position: "fixed", left: b.left, bottom: b.bottom,
          width: b.size, height: b.size, borderRadius: "50%",
          background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.9), rgba(200,230,255,0.3))",
          boxShadow: "inset 0 1px 2px rgba(255,255,255,0.8), 0 1px 4px rgba(160,200,240,0.3)",
          animation: `bubbleFloat ${b.dur} ${b.delay} ease-in-out infinite`,
          pointerEvents: "none", zIndex: 1,
        }} />
      ))}
    </>
  )
}
