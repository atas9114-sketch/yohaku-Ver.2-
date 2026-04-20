import { useState, useEffect } from "react"

const MODEL = "claude-sonnet-4-20250514"
const AI_KEY_STORAGE = "yohaku_api_key"

export default function AIPanel({ items, completed, onClose }) {
  const savedKey = (() => { try { return localStorage.getItem(AI_KEY_STORAGE) || "" } catch { return "" } })()
  const [phase,    setPhase]    = useState(savedKey ? "idle" : "setup")
  const [result,   setResult]   = useState(null)
  const [apiKey,   setApiKey]   = useState(savedKey)
  const [inputKey, setInputKey] = useState("")
  const [showKey,  setShowKey]  = useState(false)

  const saveKey = () => {
    const k = inputKey.trim()
    if (!k.startsWith("sk-ant-")) return
    try { localStorage.setItem(AI_KEY_STORAGE, k) } catch {}
    setApiKey(k); setPhase("idle")
  }

  const clearKey = () => {
    try { localStorage.removeItem(AI_KEY_STORAGE) } catch {}
    setApiKey(""); setInputKey(""); setPhase("setup"); setResult(null)
  }

  const analyze = async () => {
    if (!apiKey) { setPhase("setup"); return }
    setPhase("loading")
    const allTexts  = items.map(i => `・${i.text}`).join("\n") || "（なし）"
    const doneTexts = completed.slice(-10).map(i => `・${i.text}`).join("\n") || "（なし）"
    const prompt = `あなたは精神保健福祉士（PSW）の視点を持つ、共感的なメンタルヘルスサポーターです。以下のユーザーのメモから、今の心の状態をやさしく読み解き、JSON形式のみで回答してください。

【今日のメモ（未完了）】
${allTexts}

【最近完了したこと】
${doneTexts}

以下のJSON形式のみで返答してください（前後に何も付けないこと）：
{"mood":"穏やか|疲れ気味|頑張っている|焦り気味|ほっとしている|揺れている","moodEmoji":"1文字の絵文字","moodColor":"CSSカラー文字列（パステル系のrgba）","summary":"今の心の状態を2〜3文で、やさしく共感的に説明","strength":"今日のあなたの強みや良かったことを1文で","advice":"一つだけ、小さくて具体的なセルフケアの提案を1文で","affirmation":"短い肯定的なメッセージ（20文字以内）"}`
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true" },
        body: JSON.stringify({ model: MODEL, max_tokens: 1000, messages: [{ role: "user", content: prompt }] }),
      })
      if (!res.ok) { if (res.status === 401) { clearKey(); return } throw new Error("api_error") }
      const data = await res.json()
      const text = (data.content || []).map(b => b.text || "").join("").trim()
      setResult(JSON.parse(text.replace(/```json|```/g, "").trim()))
      setPhase("done")
    } catch { setPhase("error") }
  }

  useEffect(() => { if (apiKey && phase === "idle") analyze() }, [apiKey]) // eslint-disable-line

  const sheet = { width:"100%", maxWidth:420, background:"rgba(255,255,255,0.82)", backdropFilter:"blur(24px)", WebkitBackdropFilter:"blur(24px)", borderRadius:"32px 32px 0 0", padding:"32px 28px 44px", boxShadow:"0 -8px 48px rgba(130,180,220,0.18)", border:"1px solid rgba(200,225,245,0.5)", fontFamily:"'M PLUS Rounded 1c', sans-serif", animation:"slideUp 0.45s cubic-bezier(0.34,1.56,0.64,1) both", maxHeight:"85vh", overflowY:"auto" }
  const handle = <div style={{ width:40, height:4, borderRadius:2, background:"rgba(160,200,230,0.3)", margin:"0 auto 24px" }} />
  const closeBtn = <button onClick={onClose} style={{ display:"block", width:"100%", marginTop:16, padding:"14px", borderRadius:20, border:"none", background:"rgba(200,225,245,0.3)", cursor:"pointer", fontFamily:"'M PLUS Rounded 1c', sans-serif", fontSize:14, color:"rgba(130,175,210,0.7)", letterSpacing:"0.06em" }}>閉じる</button>
  const validKey = inputKey.trim().startsWith("sk-ant-")

  return (
    <div role="dialog" aria-modal="true" aria-label="心の状態分析" style={{ position:"fixed", inset:0, zIndex:3000, background:"rgba(220,235,250,0.55)", backdropFilter:"blur(18px)", WebkitBackdropFilter:"blur(18px)", display:"flex", alignItems:"flex-end", justifyContent:"center" }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={sheet}>
        {handle}

        {phase === "setup" && (
          <div>
            <div style={{ textAlign:"center", marginBottom:24 }}>
              <div style={{ fontSize:36, marginBottom:12 }}>🔑</div>
              <div style={{ fontSize:16, color:"#5a8aaa", fontWeight:500, marginBottom:8, letterSpacing:"0.04em" }}>AIキーを設定する</div>
              <p style={{ fontSize:13, color:"rgba(130,175,210,0.7)", lineHeight:1.9, margin:0 }}>Anthropic の API キーを入力すると<br />心の状態をAIが分析してくれます。<br />キーはこのデバイスにのみ保存されます。</p>
            </div>
            <div style={{ position:"relative", marginBottom:12 }}>
              <input type={showKey ? "text" : "password"} value={inputKey} onChange={e => setInputKey(e.target.value)} onKeyDown={e => e.key === "Enter" && saveKey()} placeholder="sk-ant-xxxxxxxxxxxx" style={{ width:"100%", boxSizing:"border-box", background:"rgba(240,248,255,0.7)", border:"1.5px solid rgba(160,210,240,0.35)", borderRadius:16, padding:"13px 48px 13px 18px", fontFamily:"'M PLUS Rounded 1c', sans-serif", fontSize:14, color:"#5a8aaa", outline:"none", letterSpacing:"0.03em" }} />
              <button onClick={() => setShowKey(v => !v)} style={{ position:"absolute", right:14, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", fontSize:16, color:"rgba(150,190,220,0.6)", padding:4 }}>{showKey ? "🙈" : "👁"}</button>
            </div>
            {inputKey && !validKey && <p style={{ fontSize:12, color:"rgba(220,150,150,0.8)", margin:"0 0 12px 4px" }}>※ APIキーは sk-ant- から始まります</p>}
            <p style={{ fontSize:12, color:"rgba(140,185,215,0.6)", textAlign:"center", marginBottom:20 }}>
              キーは <a href="https://console.anthropic.com" target="_blank" rel="noreferrer" style={{ color:"rgba(120,175,220,0.8)" }}>console.anthropic.com</a> で無料取得できます
            </p>
            <button onClick={saveKey} disabled={!validKey} style={{ display:"block", width:"100%", padding:"15px", borderRadius:22, border:"none", cursor:validKey ? "pointer" : "default", background:validKey ? "linear-gradient(135deg, rgba(150,205,240,0.75), rgba(200,175,240,0.6))" : "rgba(200,225,245,0.3)", fontFamily:"'M PLUS Rounded 1c', sans-serif", fontSize:16, letterSpacing:"0.08em", color:validKey ? "white" : "rgba(160,200,230,0.5)", transition:"all 0.3s ease" }}>保存して分析する</button>
            {closeBtn}
          </div>
        )}

        {phase === "loading" && (
          <div style={{ textAlign:"center", padding:"32px 0" }}>
            <div style={{ fontSize:40, animation:"shimmer 1.8s ease-in-out infinite", marginBottom:16 }}>🌊</div>
            <div style={{ color:"#7aadcc", fontSize:15, letterSpacing:"0.06em", lineHeight:2 }}>今の心の状態を<br />読み解いています…</div>
          </div>
        )}

        {phase === "error" && (
          <div style={{ textAlign:"center", padding:"24px 0", lineHeight:2 }}>
            <div style={{ fontSize:32, marginBottom:12 }}>🫧</div>
            <p style={{ color:"rgba(180,140,160,0.8)", fontSize:14, marginBottom:16 }}>うまく接続できませんでした。<br />少し待ってから試してみてください。</p>
            <button onClick={analyze} style={{ padding:"10px 28px", borderRadius:20, border:"none", cursor:"pointer", background:"rgba(200,225,245,0.4)", fontFamily:"'M PLUS Rounded 1c', sans-serif", fontSize:14, color:"rgba(130,175,210,0.8)" }}>もう一度試す</button>
            {closeBtn}
          </div>
        )}

        {phase === "done" && result && (
          <div>
            <div style={{ background:`linear-gradient(135deg, ${result.moodColor || "rgba(180,215,245,0.4)"}, rgba(255,235,245,0.3))`, borderRadius:20, padding:"20px 22px", marginBottom:16, border:"1px solid rgba(200,225,245,0.4)" }}>
              <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:10 }}>
                <span style={{ fontSize:36 }}>{result.moodEmoji}</span>
                <div>
                  <div style={{ fontSize:12, color:"rgba(130,175,210,0.65)", letterSpacing:"0.08em" }}>今の気持ち</div>
                  <div style={{ fontSize:20, color:"#5a8aaa", fontWeight:500 }}>{result.mood}</div>
                </div>
              </div>
              <p style={{ fontSize:14, color:"#6a98b8", lineHeight:1.9, margin:0, letterSpacing:"0.03em" }}>{result.summary}</p>
            </div>
            <div style={{ padding:"14px 18px", borderRadius:16, marginBottom:10, background:"rgba(220,240,255,0.3)", border:"1px solid rgba(180,215,245,0.3)" }}>
              <div style={{ fontSize:11, color:"rgba(130,175,210,0.6)", letterSpacing:"0.08em", marginBottom:6 }}>✦ 今日の強み</div>
              <p style={{ fontSize:14, color:"#6a98b8", lineHeight:1.8, margin:0 }}>{result.strength}</p>
            </div>
            <div style={{ padding:"14px 18px", borderRadius:16, marginBottom:16, background:"rgba(240,225,255,0.25)", border:"1px solid rgba(210,190,240,0.3)" }}>
              <div style={{ fontSize:11, color:"rgba(170,150,210,0.6)", letterSpacing:"0.08em", marginBottom:6 }}>🌿 今日のセルフケア</div>
              <p style={{ fontSize:14, color:"#8a78b8", lineHeight:1.8, margin:0 }}>{result.advice}</p>
            </div>
            <div style={{ textAlign:"center", padding:"10px 0 4px" }}>
              <div style={{ fontSize:20, color:"rgba(160,200,230,0.7)", letterSpacing:"0.15em", fontWeight:300 }}>{result.affirmation}</div>
            </div>
            <div style={{ textAlign:"center", marginTop:16 }}>
              <button onClick={clearKey} style={{ background:"none", border:"none", cursor:"pointer", fontSize:11, color:"rgba(160,190,220,0.45)", letterSpacing:"0.06em" }}>APIキーを削除する</button>
            </div>
            {closeBtn}
          </div>
        )}
      </div>
    </div>
  )
}
