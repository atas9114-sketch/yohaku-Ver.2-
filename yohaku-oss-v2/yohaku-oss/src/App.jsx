import { useState, useEffect, useRef, useCallback } from "react";

// ── Fonts ──────────────────────────────────────────────────────────────────
const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href = "https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@300;400;500;700&display=swap";
document.head.appendChild(fontLink);

// ── Constants ──────────────────────────────────────────────────────────────
const PSW_MESSAGES = [
  "一歩進みましたね。\nそれだけで十分です。",
  "自分を大切にできましたね。\nお疲れ様でした。",
  "小さな一歩が、\n大きな変化を生みます。",
  "よく気づけましたね。\nあなたは頑張っています。",
  "それを手放せた。\n心が少し軽くなりましたね。",
  "完璧じゃなくていい。\n動いた自分を認めましょう。",
  "大丈夫です。\nあなたのペースで十分です。",
];

const PLACEHOLDERS = [
  "今、心にあること…",
  "気になっていること…",
  "やりたいな、と思うこと…",
  "頭の中にあるもの…",
  "自分を大切にできること…",
];

const CATEGORIES = [
  { id: "all",      label: "すべて",   emoji: "✦",  color: "rgba(130,185,220,0.7)",  bg: "rgba(200,230,250,0.25)" },
  { id: "body",     label: "からだ",   emoji: "🌿",  color: "rgba(120,190,150,0.8)",  bg: "rgba(200,240,215,0.25)" },
  { id: "mind",     label: "こころ",   emoji: "🫧",  color: "rgba(170,150,220,0.8)",  bg: "rgba(230,220,255,0.25)" },
  { id: "daily",    label: "くらし",   emoji: "☁️",  color: "rgba(180,160,130,0.8)",  bg: "rgba(245,235,220,0.25)" },
  { id: "joy",      label: "たのしみ", emoji: "🌸",  color: "rgba(220,150,170,0.8)",  bg: "rgba(255,225,235,0.25)" },
];

const STORAGE_KEY = "yohaku_items_v2";
const COMPLETED_KEY = "yohaku_completed_v2";

// ── Helpers ────────────────────────────────────────────────────────────────
function loadItems() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [
      { id: 1, text: "朝、光を浴びる",    category: "body",  createdAt: Date.now() },
      { id: 2, text: "顔を洗う",          category: "body",  createdAt: Date.now() },
      { id: 3, text: "好きな音楽を聴く",  category: "joy",   createdAt: Date.now() },
    ];
  } catch { return []; }
}

function loadCompleted() {
  try {
    const raw = localStorage.getItem(COMPLETED_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveItems(items) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch {}
}

function saveCompleted(items) {
  try { localStorage.setItem(COMPLETED_KEY, JSON.stringify(items)); } catch {}
}

// ── Particle ───────────────────────────────────────────────────────────────
function Particle({ x, y, color, onDone }) {
  const [style, setStyle] = useState({
    position: "fixed", left: x, top: y,
    width: 8, height: 8, borderRadius: "50%",
    background: color, opacity: 1,
    transform: "translate(-50%, -50%) scale(1)",
    transition: "none", pointerEvents: "none",
    zIndex: 1000, boxShadow: `0 0 6px ${color}`,
  });

  useEffect(() => {
    const angle = Math.random() * Math.PI * 2;
    const dist  = 40 + Math.random() * 80;
    const tx    = Math.cos(angle) * dist;
    const ty    = Math.sin(angle) * dist - 30;
    const scale = 0.2 + Math.random() * 0.6;
    requestAnimationFrame(() => {
      setStyle(s => ({
        ...s,
        transition: "all 0.9s cubic-bezier(0.22,1,0.36,1)",
        transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(${scale})`,
        opacity: 0,
      }));
    });
    const t = setTimeout(onDone, 900);
    return () => clearTimeout(t);
  }, []);

  return <div style={style} />;
}

// ── Toast ──────────────────────────────────────────────────────────────────
function Toast({ message, emoji = "✦", onDone }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), 50);
    const t2 = setTimeout(() => setVisible(false), 3200);
    const t3 = setTimeout(onDone, 3700);
    return () => [t1, t2, t3].forEach(clearTimeout);
  }, []);
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
  );
}

// ── Category Badge ─────────────────────────────────────────────────────────
function CategoryBadge({ catId, small = false }) {
  const cat = CATEGORIES.find(c => c.id === catId);
  if (!cat || catId === "all") return null;
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
  );
}

// ── MemoItem ───────────────────────────────────────────────────────────────
function MemoItem({ item, onComplete, onDelete }) {
  const [completing, setCompleting]  = useState(false);
  const [particles,  setParticles]   = useState([]);
  const [height,     setHeight]      = useState("auto");
  const ref = useRef(null);

  const handleComplete = useCallback(() => {
    if (completing) return;
    setCompleting(true);
    if (navigator.vibrate) navigator.vibrate([30, 20, 30]);

    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top  + rect.height / 2;
      const colors = [
        "rgba(180,210,240,0.9)", "rgba(240,180,210,0.9)",
        "rgba(255,230,180,0.9)", "rgba(200,230,255,0.9)",
        "rgba(220,200,255,0.9)",
      ];
      setParticles(Array.from({ length: 16 }, (_, i) => ({
        id: i,
        x: cx + (Math.random() - 0.5) * 80,
        y: cy + (Math.random() - 0.5) * 20,
        color: colors[Math.floor(Math.random() * colors.length)],
      })));
    }
    setTimeout(() => {
      if (ref.current) {
        setHeight(ref.current.scrollHeight + "px");
        setTimeout(() => setHeight("0px"), 50);
      }
    }, 380);
    setTimeout(() => onComplete(item.id), 980);
  }, [completing, item.id, onComplete]);

  return (
    <>
      {particles.map(p => (
        <Particle key={p.id} x={p.x} y={p.y} color={p.color}
          onDone={() => setParticles(ps => ps.filter(x => x.id !== p.id))} />
      ))}
      <div ref={ref} style={{
        height, overflow: "hidden",
        transition: completing ? "height 0.5s cubic-bezier(0.4,0,0.2,1), opacity 0.38s ease" : "none",
        opacity: completing ? 0 : 1,
        marginBottom: completing ? 0 : 2,
      }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 14,
          padding: "16px 4px",
          borderBottom: "1px solid rgba(180,210,240,0.13)",
        }}>
          {/* Pearl button */}
          <button onClick={handleComplete} style={{
            width: 28, height: 28, borderRadius: "50%", border: "none",
            cursor: "pointer", flexShrink: 0,
            background: "radial-gradient(circle at 35% 35%, rgba(255,255,255,0.95) 0%, rgba(210,230,250,0.7) 45%, rgba(180,210,240,0.5) 100%)",
            boxShadow: "inset 0 2px 4px rgba(255,255,255,0.8), inset 0 -2px 4px rgba(140,180,220,0.3), 0 2px 8px rgba(140,180,220,0.22)",
            transition: "transform 0.2s ease",
          }}
            onMouseEnter={e => e.currentTarget.style.transform = "scale(1.12)"}
            onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontFamily: "'M PLUS Rounded 1c', sans-serif",
              fontSize: 16, color: "#5a8aaa",
              letterSpacing: "0.04em", lineHeight: 1.6, fontWeight: 400,
              marginBottom: item.category && item.category !== "all" ? 5 : 0,
            }}>{item.text}</div>
            <CategoryBadge catId={item.category} small />
          </div>
          <button onClick={() => onDelete(item.id)} style={{
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
  );
}

// ── AI Analysis Panel ──────────────────────────────────────────────────────
const AI_KEY_STORAGE = "yohaku_api_key";

function AIPanel({ items, completed, onClose }) {
  const savedKey = (() => { try { return localStorage.getItem(AI_KEY_STORAGE) || ""; } catch { return ""; } })();
  const [phase,    setPhase]   = useState(savedKey ? "idle" : "setup"); // setup | idle | loading | done | error
  const [result,   setResult]  = useState(null);
  const [apiKey,   setApiKey]  = useState(savedKey);
  const [inputKey, setInputKey]= useState("");
  const [showKey,  setShowKey] = useState(false);

  const saveKey = () => {
    const k = inputKey.trim();
    if (!k.startsWith("sk-ant-")) return;
    try { localStorage.setItem(AI_KEY_STORAGE, k); } catch {}
    setApiKey(k);
    setPhase("idle");
  };

  const clearKey = () => {
    try { localStorage.removeItem(AI_KEY_STORAGE); } catch {}
    setApiKey("");
    setInputKey("");
    setPhase("setup");
    setResult(null);
  };

  const analyze = async () => {
    if (!apiKey) { setPhase("setup"); return; }
    setPhase("loading");
    const allTexts  = items.map(i => `・${i.text}`).join("\n");
    const doneTexts = completed.slice(-10).map(i => `・${i.text}`).join("\n");
    const prompt = `あなたは精神保健福祉士（PSW）の視点を持つ、共感的なメンタルヘルスサポーターです。
以下のユーザーのメモから、今の心の状態をやさしく読み解き、JSON形式のみで回答してください。

【今日のメモ（未完了）】
${allTexts || "（なし）"}

【最近完了したこと】
${doneTexts || "（なし）"}

以下のJSON形式のみで返答してください（前後に何も付けないこと）：
{
  "mood": "穏やか|疲れ気味|頑張っている|焦り気味|ほっとしている|揺れている",
  "moodEmoji": "1文字の絵文字",
  "moodColor": "CSSカラー文字列（パステル系）",
  "summary": "今の心の状態を2〜3文で、やさしく共感的に説明",
  "strength": "今日のあなたの強みや良かったことを1文で",
  "advice": "一つだけ、小さくて具体的なセルフケアの提案を1文で",
  "affirmation": "短い肯定的なメッセージ（20文字以内）"
}`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      if (!res.ok) {
        if (res.status === 401) { clearKey(); return; }
        throw new Error("api_error");
      }
      const data = await res.json();
      const text = (data.content || []).map(b => b.text || "").join("").trim();
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setResult(parsed);
      setPhase("done");
    } catch {
      setPhase("error");
    }
  };

  useEffect(() => { if (apiKey && phase === "idle") analyze(); }, [apiKey]);

  const sheet = {
    width: "100%", maxWidth: 420,
    background: "rgba(255,255,255,0.82)",
    backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
    borderRadius: "32px 32px 0 0", padding: "32px 28px 44px",
    boxShadow: "0 -8px 48px rgba(130,180,220,0.18)",
    border: "1px solid rgba(200,225,245,0.5)",
    fontFamily: "'M PLUS Rounded 1c', sans-serif",
    animation: "slideUp 0.45s cubic-bezier(0.34,1.56,0.64,1) both",
    maxHeight: "85vh", overflowY: "auto",
  };
  const handle = (
    <div style={{ width: 40, height: 4, borderRadius: 2,
      background: "rgba(160,200,230,0.3)", margin: "0 auto 24px" }} />
  );
  const closeBtn = (
    <button onClick={onClose} style={{
      display: "block", width: "100%", marginTop: 16,
      padding: "14px", borderRadius: 20, border: "none",
      background: "rgba(200,225,245,0.3)", cursor: "pointer",
      fontFamily: "'M PLUS Rounded 1c', sans-serif",
      fontSize: 14, color: "rgba(130,175,210,0.7)", letterSpacing: "0.06em",
    }}>閉じる</button>
  );

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 3000,
      background: "rgba(220,235,250,0.55)",
      backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)",
      display: "flex", alignItems: "flex-end", justifyContent: "center",
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={sheet}>
        {handle}

        {/* ── APIキー設定画面 ── */}
        {phase === "setup" && (
          <div>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>🔑</div>
              <div style={{ fontSize: 16, color: "#5a8aaa", fontWeight: 500, marginBottom: 8, letterSpacing: "0.04em" }}>
                AIキーを設定する
              </div>
              <p style={{ fontSize: 13, color: "rgba(130,175,210,0.7)", lineHeight: 1.9, margin: 0 }}>
                Anthropic の API キーを入力すると<br />心の状態をAIが分析してくれます。<br />
                キーはこのデバイスにのみ保存されます。
              </p>
            </div>

            {/* キー入力欄 */}
            <div style={{ position: "relative", marginBottom: 12 }}>
              <input
                type={showKey ? "text" : "password"}
                value={inputKey}
                onChange={e => setInputKey(e.target.value)}
                onKeyDown={e => e.key === "Enter" && saveKey()}
                placeholder="sk-ant-xxxxxxxxxxxx"
                style={{
                  width: "100%", boxSizing: "border-box",
                  background: "rgba(240,248,255,0.7)",
                  border: "1.5px solid rgba(160,210,240,0.35)",
                  borderRadius: 16, padding: "13px 48px 13px 18px",
                  fontFamily: "'M PLUS Rounded 1c', sans-serif",
                  fontSize: 14, color: "#5a8aaa", outline: "none",
                  letterSpacing: "0.03em",
                }}
              />
              <button onClick={() => setShowKey(v => !v)} style={{
                position: "absolute", right: 14, top: "50%",
                transform: "translateY(-50%)",
                background: "none", border: "none", cursor: "pointer",
                fontSize: 16, color: "rgba(150,190,220,0.6)", padding: 4,
              }}>{showKey ? "🙈" : "👁"}</button>
            </div>

            {/* バリデーションヒント */}
            {inputKey && !inputKey.trim().startsWith("sk-ant-") && (
              <p style={{ fontSize: 12, color: "rgba(220,150,150,0.8)", margin: "0 0 12px 4px" }}>
                ※ APIキーは sk-ant- から始まります
              </p>
            )}

            {/* 取得リンク */}
            <p style={{ fontSize: 12, color: "rgba(140,185,215,0.6)", textAlign: "center", marginBottom: 20 }}>
              キーは{" "}
              <a href="https://console.anthropic.com" target="_blank" rel="noreferrer"
                style={{ color: "rgba(120,175,220,0.8)" }}>
                console.anthropic.com
              </a>{" "}
              で無料取得できます
            </p>

            <button
              onClick={saveKey}
              disabled={!inputKey.trim().startsWith("sk-ant-")}
              style={{
                display: "block", width: "100%", padding: "15px",
                borderRadius: 22, border: "none",
                cursor: inputKey.trim().startsWith("sk-ant-") ? "pointer" : "default",
                background: inputKey.trim().startsWith("sk-ant-")
                  ? "linear-gradient(135deg, rgba(150,205,240,0.75), rgba(200,175,240,0.6))"
                  : "rgba(200,225,245,0.3)",
                fontFamily: "'M PLUS Rounded 1c', sans-serif",
                fontSize: 16, letterSpacing: "0.08em",
                color: inputKey.trim().startsWith("sk-ant-") ? "white" : "rgba(160,200,230,0.5)",
                transition: "all 0.3s ease",
              }}
            >
              保存して分析する
            </button>
            {closeBtn}
          </div>
        )}

        {/* ── ローディング ── */}
        {phase === "loading" && (
          <div style={{ textAlign: "center", padding: "32px 0" }}>
            <div style={{ fontSize: 40, animation: "shimmer 1.8s ease-in-out infinite", marginBottom: 16 }}>🌊</div>
            <div style={{ color: "#7aadcc", fontSize: 15, letterSpacing: "0.06em", lineHeight: 2 }}>
              今の心の状態を<br />読み解いています…
            </div>
          </div>
        )}

        {/* ── エラー ── */}
        {phase === "error" && (
          <div style={{ textAlign: "center", padding: "24px 0", lineHeight: 2 }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🫧</div>
            <p style={{ color: "rgba(180,140,160,0.8)", fontSize: 14, marginBottom: 16 }}>
              うまく接続できませんでした。<br />少し待ってから試してみてください。
            </p>
            <button onClick={analyze} style={{
              padding: "10px 28px", borderRadius: 20, border: "none", cursor: "pointer",
              background: "rgba(200,225,245,0.4)",
              fontFamily: "'M PLUS Rounded 1c', sans-serif",
              fontSize: 14, color: "rgba(130,175,210,0.8)",
            }}>もう一度試す</button>
            {closeBtn}
          </div>
        )}

        {/* ── 結果 ── */}
        {phase === "done" && result && (
          <div>
            {/* Mood card */}
            <div style={{
              background: `linear-gradient(135deg, ${result.moodColor || "rgba(180,215,245,0.4)"}, rgba(255,235,245,0.3))`,
              borderRadius: 20, padding: "20px 22px", marginBottom: 20,
              border: "1px solid rgba(200,225,245,0.4)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                <span style={{ fontSize: 36 }}>{result.moodEmoji}</span>
                <div>
                  <div style={{ fontSize: 12, color: "rgba(130,175,210,0.7)", letterSpacing: "0.08em" }}>今の気持ち</div>
                  <div style={{ fontSize: 20, color: "#5a8aaa", fontWeight: 500, letterSpacing: "0.06em" }}>{result.mood}</div>
                </div>
              </div>
              <p style={{ fontSize: 14, color: "#6a98b8", lineHeight: 1.9, margin: 0, letterSpacing: "0.03em" }}>
                {result.summary}
              </p>
            </div>

            {/* Strength */}
            <div style={{ marginBottom: 14, padding: "14px 18px", borderRadius: 16,
              background: "rgba(220,240,255,0.3)", border: "1px solid rgba(180,215,245,0.3)" }}>
              <div style={{ fontSize: 11, color: "rgba(130,175,210,0.6)", letterSpacing: "0.08em", marginBottom: 6 }}>✦ 今日の強み</div>
              <p style={{ fontSize: 14, color: "#6a98b8", lineHeight: 1.8, margin: 0, letterSpacing: "0.03em" }}>{result.strength}</p>
            </div>

            {/* Advice */}
            <div style={{ marginBottom: 20, padding: "14px 18px", borderRadius: 16,
              background: "rgba(240,225,255,0.25)", border: "1px solid rgba(210,190,240,0.3)" }}>
              <div style={{ fontSize: 11, color: "rgba(170,150,210,0.6)", letterSpacing: "0.08em", marginBottom: 6 }}>🌿 今日のセルフケア</div>
              <p style={{ fontSize: 14, color: "#8a78b8", lineHeight: 1.8, margin: 0, letterSpacing: "0.03em" }}>{result.advice}</p>
            </div>

            {/* Affirmation */}
            <div style={{ textAlign: "center", padding: "12px 0 4px" }}>
              <div style={{ fontSize: 20, color: "rgba(170,210,240,0.7)", letterSpacing: "0.15em", fontWeight: 300 }}>
                {result.affirmation}
              </div>
            </div>

            {/* キー削除リンク */}
            <div style={{ textAlign: "center", marginTop: 16 }}>
              <button onClick={clearKey} style={{
                background: "none", border: "none", cursor: "pointer",
                fontSize: 11, color: "rgba(160,190,220,0.45)", letterSpacing: "0.06em",
              }}>APIキーを削除する</button>
            </div>

            {closeBtn}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Add Item Modal ─────────────────────────────────────────────────────────
function AddModal({ onAdd, onClose, placeholderIdx }) {
  const [text, setText]     = useState("");
  const [catId, setCatId]   = useState("body");
  const inputRef = useRef(null);

  useEffect(() => { setTimeout(() => inputRef.current?.focus(), 80); }, []);

  const handleSubmit = () => {
    if (!text.trim()) return;
    onAdd(text.trim(), catId);
    onClose();
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 3000,
      background: "rgba(220,235,250,0.5)",
      backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)",
      display: "flex", alignItems: "flex-end", justifyContent: "center",
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        width: "100%", maxWidth: 420,
        background: "rgba(255,255,255,0.88)",
        backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
        borderRadius: "32px 32px 0 0", padding: "28px 24px 44px",
        boxShadow: "0 -8px 40px rgba(130,180,220,0.15)",
        border: "1px solid rgba(200,225,245,0.45)",
        fontFamily: "'M PLUS Rounded 1c', sans-serif",
        animation: "slideUp 0.4s cubic-bezier(0.34,1.56,0.64,1) both",
      }}>
        <div style={{ width: 40, height: 4, borderRadius: 2,
          background: "rgba(160,200,230,0.3)", margin: "0 auto 22px" }} />

        <p style={{ fontSize: 12, color: "rgba(140,185,215,0.6)", letterSpacing: "0.08em",
          textAlign: "center", marginBottom: 18 }}>
          心にあるものを、そっと置いてください。
        </p>

        {/* Text input */}
        <textarea
          ref={inputRef}
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmit(); } }}
          placeholder={PLACEHOLDERS[placeholderIdx]}
          rows={2}
          style={{
            width: "100%", boxSizing: "border-box",
            background: "rgba(240,248,255,0.7)",
            border: "1.5px solid rgba(160,210,240,0.35)",
            borderRadius: 18, padding: "14px 18px",
            fontFamily: "'M PLUS Rounded 1c', sans-serif",
            fontSize: 16, color: "#5a8aaa", letterSpacing: "0.04em",
            lineHeight: 1.7, outline: "none", resize: "none",
            boxShadow: "0 2px 16px rgba(140,195,230,0.1)",
            marginBottom: 18,
          }}
        />

        {/* Category picker */}
        <div style={{ marginBottom: 22 }}>
          <div style={{ fontSize: 11, color: "rgba(140,185,215,0.55)",
            letterSpacing: "0.08em", marginBottom: 10 }}>カテゴリ</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {CATEGORIES.filter(c => c.id !== "all").map(cat => (
              <button key={cat.id} onClick={() => setCatId(cat.id)} style={{
                padding: "6px 14px", borderRadius: 20,
                border: `1.5px solid ${catId === cat.id ? cat.color : "rgba(180,215,245,0.2)"}`,
                background: catId === cat.id ? cat.bg : "transparent",
                color: catId === cat.id ? cat.color : "rgba(160,200,230,0.5)",
                fontFamily: "'M PLUS Rounded 1c', sans-serif",
                fontSize: 13, cursor: "pointer", letterSpacing: "0.04em",
                transition: "all 0.2s ease",
              }}>
                {cat.emoji} {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button onClick={handleSubmit} style={{
          width: "100%", padding: "15px",
          borderRadius: 22, border: "none", cursor: "pointer",
          background: text.trim()
            ? "linear-gradient(135deg, rgba(150,205,240,0.75), rgba(200,175,240,0.6))"
            : "rgba(200,225,245,0.3)",
          fontFamily: "'M PLUS Rounded 1c', sans-serif",
          fontSize: 16, letterSpacing: "0.08em",
          color: text.trim() ? "white" : "rgba(160,200,230,0.5)",
          boxShadow: text.trim() ? "0 6px 24px rgba(140,190,230,0.25)" : "none",
          transition: "all 0.3s ease",
        }}>
          置く
        </button>
      </div>
    </div>
  );
}

// ── Watercolor Bg ──────────────────────────────────────────────────────────
function WatercolorBg() {
  return (
    <div style={{ position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
      <div style={{
        position: "absolute", top: "-20%", left: "-15%", width: "70%", height: "70%",
        borderRadius: "60% 40% 70% 30% / 50% 60% 40% 50%",
        background: "radial-gradient(ellipse, rgba(180,215,245,0.32) 0%, rgba(180,215,245,0.04) 70%)",
        filter: "blur(40px)", animation: "drift1 18s ease-in-out infinite alternate",
      }} />
      <div style={{
        position: "absolute", top: "10%", right: "-20%", width: "65%", height: "60%",
        borderRadius: "40% 60% 30% 70% / 60% 40% 60% 40%",
        background: "radial-gradient(ellipse, rgba(245,190,215,0.25) 0%, rgba(245,190,215,0.03) 70%)",
        filter: "blur(50px)", animation: "drift2 22s ease-in-out infinite alternate",
      }} />
      <div style={{
        position: "absolute", bottom: "-10%", left: "20%", width: "60%", height: "55%",
        borderRadius: "50% 50% 30% 70% / 40% 60% 40% 60%",
        background: "radial-gradient(ellipse, rgba(255,235,180,0.2) 0%, rgba(255,235,180,0.03) 70%)",
        filter: "blur(45px)", animation: "drift3 20s ease-in-out infinite alternate",
      }} />
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
  );
}

function Bubbles() {
  const bs = [
    {size:10, left:"8%",  bottom:"22%", delay:"0s",   dur:"6s"},
    {size:6,  left:"15%", bottom:"30%", delay:"1.5s", dur:"8s"},
    {size:14, left:"80%", bottom:"18%", delay:"0.8s", dur:"7s"},
    {size:8,  left:"88%", bottom:"35%", delay:"2s",   dur:"5s"},
    {size:5,  left:"50%", bottom:"12%", delay:"3s",   dur:"9s"},
  ];
  return <>
    {bs.map((b,i) => (
      <div key={i} style={{
        position:"fixed", left:b.left, bottom:b.bottom,
        width:b.size, height:b.size, borderRadius:"50%",
        background:"radial-gradient(circle at 30% 30%, rgba(255,255,255,0.9), rgba(200,230,255,0.3))",
        boxShadow:"inset 0 1px 2px rgba(255,255,255,0.8), 0 1px 4px rgba(160,200,240,0.3)",
        animation:`bubbleFloat ${b.dur} ${b.delay} ease-in-out infinite`,
        pointerEvents:"none", zIndex:1,
      }} />
    ))}
  </>;
}

// ── Main App ───────────────────────────────────────────────────────────────
export default function Yohaku() {
  const [items,         setItems]         = useState(loadItems);
  const [completed,     setCompleted]     = useState(loadCompleted);
  const [activeFilter,  setActiveFilter]  = useState("all");
  const [placeholderIdx,setPlaceholderIdx]= useState(0);
  const [toast,         setToast]         = useState(null);
  const [showAdd,       setShowAdd]       = useState(false);
  const [showAI,        setShowAI]        = useState(false);
  const nextId = useRef(Date.now());

  // Persist
  useEffect(() => { saveItems(items); }, [items]);
  useEffect(() => { saveCompleted(completed); }, [completed]);

  // Cycle placeholder
  useEffect(() => {
    const t = setInterval(() => setPlaceholderIdx(i => (i + 1) % PLACEHOLDERS.length), 4000);
    return () => clearInterval(t);
  }, []);

  const handleComplete = useCallback((id) => {
    const item = items.find(x => x.id === id);
    if (item) {
      setCompleted(prev => [...prev.slice(-49), { ...item, completedAt: Date.now() }]);
    }
    setItems(prev => prev.filter(x => x.id !== id));
    const msg = PSW_MESSAGES[Math.floor(Math.random() * PSW_MESSAGES.length)];
    setToast({ id: Date.now(), message: msg, emoji: "✦" });
  }, [items]);

  const handleDelete = useCallback((id) => {
    setItems(prev => prev.filter(x => x.id !== id));
  }, []);

  const handleAdd = useCallback((text, catId) => {
    const newItem = { id: nextId.current++, text, category: catId, createdAt: Date.now() };
    setItems(prev => [...prev, newItem]);
    if (navigator.vibrate) navigator.vibrate(20);
  }, []);

  const filtered = activeFilter === "all"
    ? items
    : items.filter(i => i.category === activeFilter);

  const activeCat = CATEGORIES.find(c => c.id === activeFilter);

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(145deg, #f0f7ff 0%, #fdf0f7 50%, #fffff0 100%)",
      fontFamily: "'M PLUS Rounded 1c', sans-serif",
      position: "relative", overflow: "hidden",
    }}>
      <WatercolorBg />
      <Bubbles />

      <div style={{
        position: "relative", zIndex: 10,
        maxWidth: 420, margin: "0 auto",
        minHeight: "100vh", display: "flex",
        flexDirection: "column", paddingBottom: 90,
      }}>
        {/* ── Header ── */}
        <div style={{ padding: "48px 32px 20px", animation: "floatIn 0.8s ease both" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                <h1 style={{ fontSize: 30, fontWeight: 300, color: "#7aadcc",
                  letterSpacing: "0.12em", margin: 0, lineHeight: 1 }}>YOHAKU</h1>
                <span style={{ fontSize: 14, color: "rgba(140,185,215,0.65)",
                  letterSpacing: "0.06em", fontWeight: 400 }}>余白</span>
              </div>
              <p style={{ fontSize: 11, color: "rgba(140,185,215,0.55)",
                letterSpacing: "0.07em", marginTop: 5, fontWeight: 300 }}>
                心にあるものを、そっと置いてください。
              </p>
            </div>

            {/* AI button */}
            <button onClick={() => setShowAI(true)} style={{
              display: "flex", flexDirection: "column", alignItems: "center",
              gap: 3, background: "rgba(255,255,255,0.55)",
              border: "1px solid rgba(180,215,245,0.35)",
              borderRadius: 16, padding: "10px 14px",
              cursor: "pointer", boxShadow: "0 2px 12px rgba(140,195,230,0.1)",
              backdropFilter: "blur(10px)", transition: "all 0.25s ease",
            }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 20px rgba(140,195,230,0.2)"}
              onMouseLeave={e => e.currentTarget.style.boxShadow = "0 2px 12px rgba(140,195,230,0.1)"}
            >
              <span style={{ fontSize: 22 }}>🌊</span>
              <span style={{ fontSize: 9, color: "rgba(130,175,210,0.6)",
                letterSpacing: "0.06em" }}>心の状態</span>
            </button>
          </div>

          {/* Stats chips */}
          {(items.length > 0 || completed.length > 0) && (
            <div style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" }}>
              <div style={{ padding: "4px 12px", borderRadius: 12,
                background: "rgba(200,225,245,0.3)", border: "1px solid rgba(180,215,245,0.25)",
                fontSize: 11, color: "rgba(130,175,210,0.7)", letterSpacing: "0.05em" }}>
                📋 {items.length} 件
              </div>
              {completed.length > 0 && (
                <div style={{ padding: "4px 12px", borderRadius: 12,
                  background: "rgba(220,240,215,0.3)", border: "1px solid rgba(180,230,200,0.3)",
                  fontSize: 11, color: "rgba(120,175,140,0.75)", letterSpacing: "0.05em" }}>
                  ✦ {completed.length} 件完了
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Category Filter ── */}
        <div style={{
          padding: "0 24px 16px",
          animation: "floatIn 0.8s 0.1s ease both", opacity: 0, animationFillMode: "forwards",
        }}>
          <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4,
            scrollbarWidth: "none" }}>
            {CATEGORIES.map(cat => (
              <button key={cat.id} onClick={() => setActiveFilter(cat.id)} style={{
                padding: "7px 14px", borderRadius: 20, flexShrink: 0,
                border: `1.5px solid ${activeFilter === cat.id ? cat.color : "rgba(180,215,245,0.2)"}`,
                background: activeFilter === cat.id ? cat.bg : "transparent",
                color: activeFilter === cat.id ? cat.color : "rgba(160,200,230,0.55)",
                fontFamily: "'M PLUS Rounded 1c', sans-serif",
                fontSize: 12, cursor: "pointer", letterSpacing: "0.04em",
                transition: "all 0.2s ease",
              }}>
                {cat.emoji} {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Memo List ── */}
        <div style={{
          flex: 1, padding: "0 32px",
          animation: "floatIn 0.8s 0.18s ease both", opacity: 0, animationFillMode: "forwards",
        }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "52px 0",
              color: "rgba(160,200,230,0.45)", fontSize: 14,
              letterSpacing: "0.06em", lineHeight: 2.4 }}>
              <div style={{ fontSize: 30, marginBottom: 12, animation: "shimmer 3s infinite" }}>
                {activeCat?.emoji || "✦"}
              </div>
              {items.length === 0
                ? <>心が少し<br />軽くなりましたね。</>
                : <>{activeCat?.label}のメモは<br />まだありません。</>
              }
            </div>
          ) : (
            filtered.map(item => (
              <MemoItem key={item.id} item={item}
                onComplete={handleComplete} onDelete={handleDelete} />
            ))
          )}
          <div style={{ minHeight: Math.max(0, (5 - filtered.length) * 36) }} />
        </div>

        {/* ── FAB (Add button) ── */}
        <button onClick={() => setShowAdd(true)} style={{
          position: "fixed", bottom: 28, right: "calc(50% - 196px)",
          width: 56, height: 56, borderRadius: "50%",
          border: "none", cursor: "pointer", zIndex: 200,
          background: "linear-gradient(135deg, rgba(155,210,245,0.85), rgba(205,178,240,0.75))",
          boxShadow: "0 6px 28px rgba(140,190,230,0.32), inset 0 1px 2px rgba(255,255,255,0.4)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 26, color: "white",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
          animation: "pulse 3s ease-in-out infinite",
        }}
          onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.08)"; e.currentTarget.style.animationPlayState = "paused"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)";   e.currentTarget.style.animationPlayState = "running"; }}
        >+</button>
      </div>

      {/* ── Modals ── */}
      {showAdd && (
        <AddModal
          onAdd={handleAdd}
          onClose={() => setShowAdd(false)}
          placeholderIdx={placeholderIdx}
        />
      )}

      {showAI && (
        <AIPanel
          items={items}
          completed={completed}
          onClose={() => setShowAI(false)}
        />
      )}

      {/* ── Toast ── */}
      {toast && (
        <Toast key={toast.id} message={toast.message} emoji={toast.emoji}
          onDone={() => setToast(null)} />
      )}
    </div>
  );
}
