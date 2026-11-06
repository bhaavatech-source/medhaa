// ═══════════════════════════════════════════════════════════════
//  likhana/StrokeReview.tsx — समीक्षा: teachers check & correct stroke order
//  Reorder (↑ ↓), reverse direction (⇄), mark as checked, export the result.
// ═══════════════════════════════════════════════════════════════
import React, { useMemo, useState } from "react";
import { STROKES } from "./strokeData";
import { loadCorrections, saveCorrections, loadReviewed, getLetter, toPts, pointAt, type Correction } from "./engine";
import WritingPad, { DEFAULT_SETTINGS } from "./WritingPad";
import { layoutMarkers } from "./markerLayout";
import { CONJUNCT_WRITING } from "./conjunctStrokes";

const LETTERS = Object.keys(STROKES);
const COLORS = ["#e11d48", "#2563eb", "#16a34a", "#d97706", "#7c3aed", "#0891b2", "#db2777", "#65a30d"];
const RKEY = "lekhana-reviewed-v1";

const StrokeReview: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [ch, setCh] = useState(LETTERS[0]);
  const [corr, setCorr] = useState<Record<string, Correction>>(loadCorrections);
  const [reviewed, setReviewed] = useState<string[]>(loadReviewed);
  const [version, setVersion] = useState(0);
  const [showExport, setShowExport] = useState(false);

  const base = STROKES[ch];
  const c: Correction = corr[ch] ?? { order: base.strokes.map((_, i) => i), reversed: [] };
  const letter = useMemo(() => getLetter(ch, corr), [ch, corr]);

  const update = (nc: Correction) => {
    const all = { ...corr, [ch]: nc };
    setCorr(all); saveCorrections(all); setVersion(v => v + 1);
  };
  const moveStroke = (pos: number, dir: -1 | 1) => {
    const o = [...c.order]; const j = pos + dir;
    if (j < 0 || j >= o.length) return;
    [o[pos], o[j]] = [o[j], o[pos]];
    update({ ...c, order: o });
  };
  const flip = (orig: number) => update({ ...c, reversed: c.reversed.includes(orig) ? c.reversed.filter(x => x !== orig) : [...c.reversed, orig] });
  const reset = () => { const all = { ...corr }; delete all[ch]; setCorr(all); saveCorrections(all); setVersion(v => v + 1); };
  const toggleReviewed = () => {
    const r = reviewed.includes(ch) ? reviewed.filter(x => x !== ch) : [...reviewed, ch];
    setReviewed(r); try { localStorage.setItem(RKEY, JSON.stringify(r)); } catch { /* ignore */ }
  };
  const exportText = JSON.stringify({ reviewed, corrections: corr }, null, 1);

  const vb = `-8 -4 ${base.w + 16} 104`;
  const labels = layoutMarkers(
    letter?.strokes.map(s => ({ x: s.pts[0][0] + 8, y: s.pts[0][1] + 4 })) ?? [],
    4, base.w + 16, 104,
  ).map(p => ({ x: p.x - 8, y: p.y - 4 }));
  return (
    <div className="rv">
      <div className="rv-top">
        <div>
          <h2 className="lk-title">समीक्षा <span>· Stroke-order review (for teachers)</span></h2>
          <p className="lk-sub">This order is a draft. Check each letter: move strokes up/down, flip a stroke's direction, then mark it ✓. Changes apply at once in this browser — export them to make them permanent for everyone.</p>
        </div>
        <button className="lk-review-btn" onClick={onClose}>← Back to practice</button>
      </div>

      <div className="rv-grid">
        {LETTERS.map(l => (
          <button key={l} className={`rv-l ${l === ch ? "on" : ""} ${reviewed.includes(l) ? "ok" : ""} ${corr[l] ? "ed" : ""}`} onClick={() => setCh(l)}>
            {l}{reviewed.includes(l) && <i>✓</i>}
          </button>
        ))}
      </div>
      <p className="rv-progress">{reviewed.length} / {LETTERS.length} letters checked · {Object.keys(corr).length} corrected</p>

      <div className="rv-body">
        <div className="rv-svgbox">
          <svg viewBox={vb} className="rv-svg">
            <line x1={-8} x2={base.w + 8} y1={22.3} y2={22.3} stroke="#fda4af" strokeWidth={0.5} />
            <line x1={-8} x2={base.w + 8} y1={76.5} y2={76.5} stroke="#93c5fd" strokeWidth={0.5} />
            {letter?.strokes.map((s, i) => {
              const p = toPts(s); const col = COLORS[i % COLORS.length];
              const arrows = s.kind === "body" ? CONJUNCT_WRITING[ch]?.arrows ?? [0.55] : [0.55];
              return (
                <g key={i}>
                  <polyline points={p.map(q => `${q.x},${q.y}`).join(" ")} fill="none" stroke={col} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
                  {arrows.map(t => {
                    const mid = pointAt(p, t).pt, tip = pointAt(p, t + 0.07).pt;
                    const ang = (Math.atan2(tip.y - mid.y, tip.x - mid.x) * 180) / Math.PI;
                    return <g key={t} transform={`translate(${tip.x},${tip.y}) rotate(${ang})`}><path d="M-3,-2.6 L1.6,0 L-3,2.6" fill="none" stroke="#0f172a" strokeWidth={1.1} /></g>;
                  })}
                </g>
              );
            })}
            {letter?.strokes.map((s, i) => (
              <g key={"m" + i}>
                <line x1={s.pts[0][0]} y1={s.pts[0][1]} x2={labels[i].x} y2={labels[i].y} stroke={COLORS[i % COLORS.length]} strokeWidth={0.6} />
                <circle cx={labels[i].x} cy={labels[i].y} r={4} fill={COLORS[i % COLORS.length]} stroke="#fff" strokeWidth={0.9} />
                <text x={labels[i].x} y={labels[i].y + 1.9} fontSize={5.4} textAnchor="middle" fill="#fff" fontWeight={700} fontFamily="sans-serif">{i + 1}</text>
              </g>
            ))}
          </svg>
        </div>

        <div className="rv-side">
          <div className="rv-list">
            {c.order.map((orig, pos) => {
              const s = base.strokes[orig];
              return (
                <div key={orig} className="rv-row" style={{ "--c": COLORS[pos % COLORS.length] } as React.CSSProperties}>
                  <span className="rv-num">{pos + 1}</span>
                  <span className="rv-kind">{s.kind === "shirorekha" ? "शिरोरेखा" : s.kind === "bar" ? "vertical bar" : s.kind === "above" ? "sign above" : "body stroke"}{c.reversed.includes(orig) ? " · reversed" : ""}</span>
                  <button onClick={() => moveStroke(pos, -1)} disabled={pos === 0} title="Earlier">↑</button>
                  <button onClick={() => moveStroke(pos, 1)} disabled={pos === c.order.length - 1} title="Later">↓</button>
                  <button onClick={() => flip(orig)} title="Reverse direction">⇄</button>
                </div>
              );
            })}
          </div>
          <div className="rv-actions">
            <button className={reviewed.includes(ch) ? "rv-ok on" : "rv-ok"} onClick={toggleReviewed}>{reviewed.includes(ch) ? "✓ Checked" : "Mark as checked ✓"}</button>
            <button onClick={reset} disabled={!corr[ch]}>Reset this letter</button>
            <button onClick={() => setShowExport(s => !s)}>⤓ Export corrections</button>
          </div>
          <div className="rv-preview">
            <WritingPad letter={ch} mode="watch" settings={{ ...DEFAULT_SETTINGS, speed: 1.4 }} version={version} maxHeight={220} />
          </div>
        </div>
      </div>

      {showExport && (
        <div className="rv-export">
          <p>Copy this and send it to the developer (or paste it into the project) to make the corrections permanent for all learners:</p>
          <textarea readOnly value={exportText} onFocus={e => e.currentTarget.select()} />
          <button onClick={() => { try { navigator.clipboard.writeText(exportText); } catch { /* ignore */ } }}>Copy</button>
        </div>
      )}
    </div>
  );
};

export default StrokeReview;
