// ═══════════════════════════════════════════════════════════════
//  likhana/WritingPad.tsx — पश्य (watch) · अनुलिख (trace) · लिख (write)
//  Responsive, sharp on any screen, mouse / finger / stylus with pressure.
// ═══════════════════════════════════════════════════════════════
import React, { useCallback, useEffect, useRef, useState } from "react";
import { getLetter, pointAt, score, toPts, circled, type Pt, type UserStroke, type Verdict } from "./engine";
import { HEADLINE_Y, BASELINE_Y } from "./strokeData";
import { layoutMarkers } from "./markerLayout";
import { CONJUNCT_WRITING } from "./conjunctStrokes";

export type PadMode = "watch" | "trace" | "write";
export type GuideStyle = "solid" | "dotted" | "none";
export type PadSettings = {
  guide: GuideStyle; ink: string; pen: number; speed: number;
  numbers: boolean; leftHanded: boolean;
};
export const DEFAULT_SETTINGS: PadSettings = { guide: "solid", ink: "#1d4ed8", pen: 3.2, speed: 1, numbers: true, leftHanded: false };

const PAPER = "#fdfaf2";
const SCORE_OK = 70;

type Props = {
  letter: string;
  mode: PadMode;
  settings: PadSettings;
  version?: number;                         // bump to re-read review corrections
  hideLetter?: boolean;                     // dictation: no guide at all
  onResult?: (v: Verdict) => void;
  onWatched?: () => void;
  maxHeight?: number;                       // css px
};

const WritingPad: React.FC<Props> = ({ letter, mode, settings, version = 0, hideLetter, onResult, onWatched, maxHeight }) => {
  const wrap = useRef<HTMLDivElement>(null);
  const cv = useRef<HTMLCanvasElement>(null);
  const [size, setSize] = useState({ w: 320, h: 300 });
  const data = React.useMemo(() => getLetter(letter), [letter, version]); // eslint-disable-line react-hooks/exhaustive-deps
  const strokes = useRef<UserStroke[]>([]);
  const cur = useRef<UserStroke | null>(null);
  const activeId = useRef<number | null>(null);
  const penSeen = useRef(false);
  const anim = useRef<{ i: number; t: number; raf: number; pause: number } | null>(null);
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const [inkCount, setInkCount] = useState(0);
  const [playing, setPlaying] = useState(false);

  // ── layout: units → pixels ──
  const boxW = (data?.w ?? 80) + 28, boxH = 106;
  const scale = Math.min(size.w / boxW, size.h / boxH);
  const offX = (size.w - (data?.w ?? 80) * scale) / 2;
  const offY = (size.h - boxH * scale) / 2 + 4 * scale;
  const X = (x: number) => offX + x * scale;
  const Y = (y: number) => offY + y * scale;

  useEffect(() => {
    const el = wrap.current; if (!el) return;
    const ro = new ResizeObserver(() => {
      const w = el.clientWidth;
      const ideal = w * (boxH / boxW);
      const cap = maxHeight ?? Math.max(260, window.innerHeight * 0.58);
      setSize({ w, h: Math.round(Math.max(220, Math.min(ideal, cap))) });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [boxW, maxHeight]);

  // ── drawing ──
  const draw = useCallback((partial?: { i: number; t: number }) => {
    const c = cv.current; if (!c || !data) return;
    const dpr = window.devicePixelRatio || 1;
    if (c.width !== Math.round(size.w * dpr)) { c.width = Math.round(size.w * dpr); c.height = Math.round(size.h * dpr); }
    const g = c.getContext("2d")!;
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.fillStyle = PAPER; g.fillRect(0, 0, size.w, size.h);

    // writing lines: top of upper zone, शिरोरेखा, baseline, lower zone
    const line = (y: number, color: string, w: number, dash: number[] = []) => {
      g.beginPath(); g.setLineDash(dash); g.strokeStyle = color; g.lineWidth = w;
      g.moveTo(8, Y(y)); g.lineTo(size.w - 8, Y(y)); g.stroke(); g.setLineDash([]);
    };
    line(2, "rgba(148,163,184,.45)", 1, [4, 6]);
    line(HEADLINE_Y, "rgba(225,29,72,.55)", 1.6);
    line((HEADLINE_Y + BASELINE_Y) / 2, "rgba(148,163,184,.35)", 1, [2, 6]);
    line(BASELINE_Y, "rgba(37,99,235,.55)", 1.6);
    line(95, "rgba(148,163,184,.45)", 1, [4, 6]);

    const path = (pts: Pt[]) => { g.beginPath(); pts.forEach((p, k) => (k ? g.lineTo(X(p.x), Y(p.y)) : g.moveTo(X(p.x), Y(p.y)))); };
    const S = data.strokes.map(toPts);
    const starts = S.map(p => ({ x: X(p[0].x), y: Y(p[0].y) }));
    const labels = layoutMarkers(starts, Math.max(9, 3.2 * scale), size.w, size.h);
    const drawMarker = (index: number, hot: boolean) => {
      const start = starts[index], label = labels[index];
      if (Math.hypot(label.x - start.x, label.y - start.y) > 1) {
        g.beginPath(); g.strokeStyle = "#c2410c"; g.lineWidth = 1.5;
        g.moveTo(start.x, start.y); g.lineTo(label.x, label.y); g.stroke();
        g.beginPath(); g.fillStyle = "#c2410c"; g.arc(start.x, start.y, 2.5, 0, Math.PI * 2); g.fill();
      }
      marker(g, label.x, label.y, index + 1, scale, hot);
    };

    // guide
    const showGuide = !hideLetter && (mode === "watch" || (mode === "trace" && settings.guide !== "none"));
    if (showGuide) {
      g.lineCap = "round"; g.lineJoin = "round";
      S.forEach(p => {
        path(p);
        if (mode === "trace" && settings.guide === "dotted") { g.setLineDash([0.1, 3.2 * scale]); g.lineWidth = 2.4 * scale; g.strokeStyle = "rgba(71,85,105,.6)"; }
        else { g.lineWidth = 8.5 * scale; g.strokeStyle = mode === "watch" ? "rgba(148,163,184,.28)" : "rgba(148,163,184,.42)"; }
        g.stroke(); g.setLineDash([]);
      });
    }

    // animation (watch)
    if (mode === "watch" && partial) {
      g.lineCap = "round"; g.lineJoin = "round";
      S.forEach((p, k) => {
        if (k > partial.i) return;
        const pts = k < partial.i ? p : pointAt(p, partial.t).upto;
        path(pts); g.lineWidth = 3.4 * scale; g.strokeStyle = "#0f172a"; g.stroke();
      });
      if (partial.i < S.length) {
        const tip = pointAt(S[partial.i], partial.t).pt;
        g.setLineDash([]);
        g.beginPath(); g.fillStyle = "#e11d48"; g.arc(X(tip.x), Y(tip.y), Math.max(5, 2.4 * scale), 0, Math.PI * 2); g.fill();
      }
      S.forEach((_, k) => { if (k <= partial.i) drawMarker(k, k === partial.i); });
    }

    // user ink
    g.lineCap = "round"; g.lineJoin = "round"; g.strokeStyle = settings.ink;
    for (const s of strokes.current) inkStroke(g, s, X, Y, settings.pen * scale);

    // numbered start dots + arrows while tracing
    if (mode === "trace" && settings.numbers && !hideLetter) {
      g.globalAlpha = strokes.current.length ? 0.75 : 1;
      S.forEach((p, i) => {
        if (CONJUNCT_WRITING[letter] && data.strokes[i].kind === "body") {
          CONJUNCT_WRITING[letter].arrows.forEach(t => arrowAlong(g, p, X, Y, scale, t));
        } else arrowAlong(g, p, X, Y, scale);
      });
      S.forEach((_, k) => drawMarker(k, false));
      g.globalAlpha = 1;
    }

    // result overlay: highlight strokes that went wrong
    if (verdict && !hideLetter) {
      verdict.strokeIssues.forEach(iss => {
        const p = S[iss.index]; if (!p) return;
        path(p); g.setLineDash([6, 5]); g.lineWidth = 3; g.strokeStyle = iss.issue === "direction" ? "rgba(234,88,12,.9)" : "rgba(220,38,38,.85)"; g.stroke(); g.setLineDash([]);
        drawMarker(iss.index, true);
      });
    }

  }, [data, size, mode, settings, hideLetter, verdict, scale, letter]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (mode === "watch") { if (!anim.current) draw({ i: 999, t: 1 }); }
    else draw();
  }, [draw, inkCount]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── watch animation ──
  const play = useCallback(() => {
    if (!data) return;
    if (anim.current) cancelAnimationFrame(anim.current.raf);
    const S = data.strokes.map(toPts);
    const lens = S.map(p => p.reduce((a, q, k) => (k ? a + Math.hypot(q.x - p[k - 1].x, q.y - p[k - 1].y) : 0), 0));
    let last = performance.now();
    anim.current = { i: 0, t: 0, raf: 0, pause: 0 };
    setPlaying(true);
    const step = (now: number) => {
      const a = anim.current!; const dt = (now - last) / 1000; last = now;
      if (a.pause > 0) { a.pause -= dt; }
      else {
        const unitsPerSec = 55 * settings.speed;
        a.t += (dt * unitsPerSec) / Math.max(lens[a.i], 1);
        if (a.t >= 1) { a.t = 0; a.i += 1; a.pause = 0.35 / settings.speed; }
      }
      if (a.i >= S.length) { draw({ i: S.length, t: 1 }); setPlaying(false); anim.current = null; onWatched?.(); return; }
      draw({ i: a.i, t: a.t });
      a.raf = requestAnimationFrame(step);
    };
    anim.current.raf = requestAnimationFrame(step);
  }, [data, settings.speed, draw, onWatched]);

  useEffect(() => {
    strokes.current = []; setInkCount(0); setVerdict(null);
    if (mode === "watch") { const t = setTimeout(play, 300); return () => { clearTimeout(t); if (anim.current) cancelAnimationFrame(anim.current.raf); }; }
    if (anim.current) { cancelAnimationFrame(anim.current.raf); anim.current = null; setPlaying(false); }
  }, [letter, mode, version]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── input ──
  const toUnits = (e: { clientX: number; clientY: number }) => {
    const r = cv.current!.getBoundingClientRect();
    return { x: (e.clientX - r.left - offX) / scale, y: (e.clientY - r.top - offY) / scale };
  };
  const down = (e: React.PointerEvent) => {
    if (mode === "watch" || verdict) return;
    if (e.pointerType === "pen") penSeen.current = true;
    if (penSeen.current && e.pointerType === "touch") return;        // palm rejection
    if (activeId.current !== null) return;
    e.preventDefault();
    cv.current!.setPointerCapture(e.pointerId);
    activeId.current = e.pointerId;
    const p = { ...toUnits(e), p: e.pointerType === "pen" ? e.pressure || 0.5 : 0.5, t: e.timeStamp };
    cur.current = [p]; strokes.current.push(cur.current);
    draw();
  };
  const move = (e: React.PointerEvent) => {
    if (e.pointerId !== activeId.current || !cur.current) return;
    const evs = (e.nativeEvent as PointerEvent).getCoalescedEvents?.() ?? [e.nativeEvent];
    for (const ev of evs.length ? evs : [e.nativeEvent]) {
      cur.current.push({ ...toUnits(ev), p: ev.pointerType === "pen" ? ev.pressure || 0.5 : 0.5, t: ev.timeStamp });
    }
    draw();
  };
  const up = (e: React.PointerEvent) => {
    if (e.pointerId !== activeId.current) return;
    activeId.current = null; cur.current = null;
    setInkCount(n => n + 1);
  };

  const undo = () => { strokes.current.pop(); setVerdict(null); setInkCount(n => n + 1); };
  const clear = () => { strokes.current = []; setVerdict(null); setInkCount(n => n + 1); };
  const check = () => {
    if (!data) return;
    const v = score(data.strokes, strokes.current, { normalize: mode === "write" || !!hideLetter });
    setVerdict(v); onResult?.(v);
  };

  if (!data) return <div className="wp-missing">Stroke data for “{letter}” is not ready yet.</div>;

  return (
    <div className={`wp ${settings.leftHanded ? "wp-left" : ""}`}>
      <div className="wp-canvas-wrap" ref={wrap} style={{ height: size.h }}>
        <canvas ref={cv} className="wp-canvas" style={{ width: size.w, height: size.h }}
          onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}
          onContextMenu={e => e.preventDefault()} />
        {mode === "watch" && !playing && (
          <button className="wp-replay" onClick={play}>▶ पुनः पश्य · Watch again</button>
        )}
        {mode !== "watch" && !verdict && inkCount === 0 && (
          <span className="wp-hint">{mode === "trace" && !hideLetter ? "Start at ① and follow the arrows" : "Write the letter here"}</span>
        )}
      </div>

      {mode !== "watch" && (
        <div className="wp-tools">
          <button onClick={undo} disabled={!strokes.current.length}>↶ Undo</button>
          <button onClick={clear} disabled={!strokes.current.length}>✕ Clear</button>
          <span className="wp-count">{strokes.current.length} / {data.strokes.length} strokes</span>
          <button className="wp-check" onClick={check} disabled={!strokes.current.length || !!verdict}>✓ परीक्षस्व · Check</button>
        </div>
      )}

      {verdict && (
        <div className={`wp-verdict ${verdict.score >= SCORE_OK ? "wp-good" : "wp-bad"}`}>
          <div className="wp-score" style={{ "--s": verdict.score } as React.CSSProperties}><span>{verdict.score}</span></div>
          <div className="wp-bars">
            {([["Shape", verdict.shape], ["Order", verdict.order], ["Direction", verdict.direction], ["Strokes", verdict.count]] as const).map(([k, v]) => (
              <div key={k} className="wp-bar"><span>{k}</span><i><b style={{ width: `${v}%` }} /></i><em>{v}</em></div>
            ))}
          </div>
          <ul className="wp-msgs">{verdict.messages.map((m, i) => <li key={i}>{m}</li>)}</ul>
          <button className="wp-again" onClick={clear}>↻ पुनः लिख · Write again</button>
        </div>
      )}
    </div>
  );
};

// ── helpers ──
function marker(g: CanvasRenderingContext2D, x: number, y: number, n: number, scale: number, hot: boolean) {
  const r = Math.max(9, 3.2 * scale);
  g.beginPath(); g.fillStyle = hot ? "#e11d48" : "#f97316"; g.arc(x, y, r, 0, Math.PI * 2); g.fill();
  g.lineWidth = 2; g.strokeStyle = "#fff"; g.stroke();
  g.fillStyle = "#fff"; g.font = `700 ${Math.round(r * 1.15)}px Poppins, sans-serif`; g.textAlign = "center"; g.textBaseline = "middle";
  g.fillText(String(n), x, y + 0.5);
}

function arrowAlong(g: CanvasRenderingContext2D, p: Pt[], X: (x: number) => number, Y: (y: number) => number, scale: number, t = 0.55) {
  if (p.length < 2) return;
  const { pt } = pointAt(p, t), { pt: q } = pointAt(p, t + 0.07);
  const a = Math.atan2(Y(q.y) - Y(pt.y), X(q.x) - X(pt.x)), s = Math.max(7, 2.6 * scale);
  g.beginPath(); g.strokeStyle = "rgba(249,115,22,.95)"; g.lineWidth = 2.4;
  g.moveTo(X(q.x) - s * Math.cos(a - 0.5), Y(q.y) - s * Math.sin(a - 0.5));
  g.lineTo(X(q.x), Y(q.y));
  g.lineTo(X(q.x) - s * Math.cos(a + 0.5), Y(q.y) - s * Math.sin(a + 0.5));
  g.stroke();
}

function inkStroke(g: CanvasRenderingContext2D, s: UserStroke, X: (x: number) => number, Y: (y: number) => number, base: number) {
  if (!s.length) return;
  if (s.length === 1) { g.beginPath(); g.fillStyle = g.strokeStyle as string; g.arc(X(s[0].x), Y(s[0].y), base / 2, 0, Math.PI * 2); g.fill(); return; }
  for (let i = 1; i < s.length; i++) {
    const a = s[i - 1], b = s[i];
    g.beginPath(); g.lineWidth = Math.max(1.2, base * (0.55 + (b.p ?? 0.5) * 0.9));
    if (i > 1) {
      const z = s[i - 2];
      g.moveTo(X((z.x + a.x) / 2), Y((z.y + a.y) / 2));
      g.quadraticCurveTo(X(a.x), Y(a.y), X((a.x + b.x) / 2), Y((a.y + b.y) / 2));
    } else { g.moveTo(X(a.x), Y(a.y)); g.lineTo(X(b.x), Y(b.y)); }
    g.stroke();
  }
}

export { circled };
export default WritingPad;
