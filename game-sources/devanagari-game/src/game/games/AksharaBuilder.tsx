// ═══════════════════════════════════════════════════════════════
//  AksharaBuilder — अक्षरनिर्माणम्
//  Tap or drag pieces into the slots. Works with mouse and touch.
//  On success the pieces fuse: Level 1 → Level 2 → the word.
// ═══════════════════════════════════════════════════════════════
import React, { useEffect, useRef, useState } from "react";
import type { GameApi } from "../GameShell";
import { makeDistractors, type BuilderItem, type BuilderStation } from "../stations";
import { breakdownWord } from "../../varnaVibhaga";
import { shuffle } from "../../devanagariData";
import { speak } from "../../speech";

type Tile = { id: number; text: string };
type Drag = { tile: Tile; from: "tray" | number; x: number; y: number; sx: number; sy: number; moved: boolean };

const COMBINING = /^[ऀ-ःऺ-ॏ॑-ॗॢॣ]/;
export const showPiece = (t: string) => (COMBINING.test(t) ? "◌" + t : t);
const safeSpeak = (t: string) => { try { speak(t); } catch { /* no voice */ } };

let uid = 1;

const AksharaBuilder: React.FC<{ station: BuilderStation; api: GameApi }> = ({ station, api }) => {
  const apiRef = useRef(api); apiRef.current = api;
  const [items] = useState<BuilderItem[]>(() => station.items());
  const [idx, setIdx] = useState(0);
  const item = items[idx];

  const [slots, setSlots] = useState<(Tile | null)[]>([]);
  const [tray, setTray] = useState<Tile[]>([]);
  const [status, setStatus] = useState<"play" | "wrong" | "right" | "timeout">("play");
  const [wrongAt, setWrongAt] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(station.timeLimit ?? 0);
  const [drag, setDrag] = useState<Drag | null>(null);
  const dragRef = useRef<Drag | null>(null);
  const timers = useRef<number[]>([]);
  const later = (f: () => void, ms: number) => { timers.current.push(window.setTimeout(f, ms)); };
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  // ── new round ──
  useEffect(() => {
    if (!item) return;
    const all = [...item.pieces, ...makeDistractors(item.pieces, station.distractors)];
    setTray(shuffle(all.map(text => ({ id: uid++, text }))));
    setSlots(item.pieces.map(() => null));
    setStatus("play"); setWrongAt([]);
    setTimeLeft(station.timeLimit ?? 0);
    apiRef.current.progress(idx, items.length);
    if (!item.ghost) later(() => safeSpeak(item.target), 350);
  }, [idx]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── timer ──
  useEffect(() => {
    if (!station.timeLimit || status !== "play") return;
    const t = window.setInterval(() => setTimeLeft(s => Math.max(0, s - 0.25)), 250);
    return () => clearInterval(t);
  }, [status, idx, station.timeLimit]);
  useEffect(() => {
    if (station.timeLimit && timeLeft <= 0 && status === "play" && slots.length) {
      setStatus("timeout");
      apiRef.current.wrong();
      setSlots(item.pieces.map(text => ({ id: uid++, text })));
      later(next, 1800);
    }
  }, [timeLeft]); // eslint-disable-line react-hooks/exhaustive-deps

  const next = () => {
    if (apiRef.current.isOver()) return;
    if (idx + 1 >= items.length) { apiRef.current.progress(items.length, items.length); apiRef.current.finish(); }
    else setIdx(i => i + 1);
  };

  const check = (filled: Tile[]) => {
    const bad = filled.map((t, i) => (t.text === item.pieces[i] ? -1 : i)).filter(i => i >= 0);
    if (!bad.length) {
      setStatus("right");
      const bonus = station.timeLimit ? Math.round((timeLeft / station.timeLimit) * 5) : 0;
      apiRef.current.correct(10 + bonus);
      later(() => safeSpeak(item.target), 250);
      later(next, 2300);
    } else {
      setStatus("wrong"); setWrongAt(bad);
      apiRef.current.wrong();
      later(() => {
        if (apiRef.current.isOver()) return;
        setSlots(s => s.map((t, i) => (bad.includes(i) ? null : t)));
        setTray(tr => [...tr, ...bad.map(i => filled[i])]);
        setStatus("play"); setWrongAt([]);
      }, 850);
    }
  };

  // ── moves ──
  const placeTile = (tile: Tile, from: "tray" | number, to?: number) => {
    if (status !== "play") return;
    const s = [...slots];
    let tr = tray.filter(t => t.id !== tile.id);
    if (typeof from === "number") s[from] = null;
    const target = to ?? s.findIndex(x => x === null);
    if (target < 0) return;
    const occupant = s[target];
    if (occupant) {
      if (typeof from === "number") s[from] = occupant; else tr = [...tr, occupant];
    }
    s[target] = tile;
    setSlots(s); setTray(tr);
    safeSpeak(tile.text);
    if (s.every(Boolean)) check(s as Tile[]);
  };
  const returnTile = (i: number) => {
    if (status !== "play" || !slots[i]) return;
    const t = slots[i]!;
    setSlots(s => s.map((x, j) => (j === i ? null : x)));
    setTray(tr => [...tr, t]);
  };
  const hint = () => {
    if (status !== "play") return;
    const i = slots.findIndex((t, j) => !t || t.text !== item.pieces[j]);
    if (i < 0) return;
    const s = [...slots]; let tr = [...tray];
    if (s[i]) { tr.push(s[i]!); s[i] = null; }
    let tile = tr.find(t => t.text === item.pieces[i]);
    if (!tile) {
      const j = s.findIndex((t, k) => t && k !== i && t.text === item.pieces[i] && t.text !== item.pieces[k]);
      if (j >= 0) { tile = s[j]!; s[j] = null; }
    } else tr = tr.filter(t => t.id !== tile!.id);
    if (!tile) return;
    s[i] = tile;
    apiRef.current.hint();
    setSlots(s); setTray(tr);
    if (s.every(Boolean)) check(s as Tile[]);
  };
  const clearAll = () => {
    if (status !== "play") return;
    setTray(tr => [...tr, ...(slots.filter(Boolean) as Tile[])]);
    setSlots(s => s.map(() => null));
  };

  // ── pointer drag (mouse + touch) ──
  const down = (e: React.PointerEvent, tile: Tile, from: "tray" | number) => {
    if (status !== "play") return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    const d = { tile, from, x: e.clientX, y: e.clientY, sx: e.clientX, sy: e.clientY, moved: false };
    dragRef.current = d; setDrag(d);
  };
  const move = (e: React.PointerEvent) => {
    const d = dragRef.current; if (!d) return;
    const moved = d.moved || Math.hypot(e.clientX - d.sx, e.clientY - d.sy) > 8;
    const nd = { ...d, x: e.clientX, y: e.clientY, moved };
    dragRef.current = nd; setDrag(nd);
  };
  const up = (e: React.PointerEvent) => {
    const d = dragRef.current; dragRef.current = null; setDrag(null);
    if (!d) return;
    if (!d.moved) { if (d.from === "tray") placeTile(d.tile, "tray"); else returnTile(d.from); return; }
    const el = document.elementFromPoint(e.clientX, e.clientY)?.closest("[data-slot]") as HTMLElement | null;
    if (el) placeTile(d.tile, d.from, Number(el.dataset.slot));
    else if (d.from !== "tray") returnTile(d.from);
  };

  if (!item) return null;
  const fused = status === "right" || status === "timeout";
  const b = fused ? breakdownWord(item.target) : null;
  const pct = station.timeLimit ? (timeLeft / station.timeLimit) * 100 : 0;

  return (
    <div className={`ab ab-${status}`}>
      {station.timeLimit ? (
        <div className={`ab-timer ${pct < 30 ? "ab-timer-low" : ""}`}><div style={{ width: `${pct}%` }} /></div>
      ) : null}

      <div className="ab-prompt">
        <span className="ab-round">{idx + 1} / {items.length}</span>
        {item.sentence ? (
          <div className="ab-sentence">
            {item.sentence.split("___").map((part, i, arr) => (
              <React.Fragment key={i}>{part}{i < arr.length - 1 && <span className="ab-blank">{fused ? item.target : "?"}</span>}</React.Fragment>
            ))}
          </div>
        ) : (
          <div className={`ab-target ${item.ghost || fused ? "" : "ab-target-hidden"}`}>
            {item.ghost || fused ? item.target : "?"}
          </div>
        )}
        <div className="ab-clues">
          <button className="ab-speak" onClick={() => safeSpeak(item.target)} title="Hear it">🔊</button>
          {(item.showRoman || fused) && <span className="ab-roman">{item.roman}</span>}
          {item.showMeaning && item.meaning && <span className="ab-meaning">“{item.meaning}”</span>}
        </div>
        <div className="ab-task">
          {station.level === 1 ? "Place every sound in order — consonants with ्, and अ as its own piece." : "Place the written pieces in order — अ needs no sign."}
        </div>
      </div>

      <div className="ab-slots">
        {slots.map((t, i) => (
          <div key={i} data-slot={i}
            className={`ab-slot ${t ? "ab-slot-full" : ""} ${wrongAt.includes(i) ? "ab-slot-wrong" : ""}`}>
            {t && (
              <button className={`ab-tile ab-in ${drag?.tile.id === t.id && drag.moved ? "ab-dragging" : ""}`}
                onPointerDown={e => down(e, t, i)} onPointerMove={move} onPointerUp={up}>
                {showPiece(t.text)}
              </button>
            )}
          </div>
        ))}
      </div>

      {fused && b && (
        <div className="ab-fusion">
          {station.level === 1 && (
            <>
              <div className="ab-fusion-row">{b.l2.map((p, i) => <span key={i} className="ab-mini" style={{ animationDelay: `${i * 60}ms` }}>{showPiece(p.text)}</span>)}</div>
              <span className="ab-fusion-arrow">→</span>
            </>
          )}
          <span className="ab-fusion-word">{item.target}</span>
          {status === "timeout" && <span className="ab-timeout">⏰ समयः समाप्तः — this is the answer</span>}
        </div>
      )}

      {!fused && (
        <>
          <div className="ab-tray">
            {tray.map(t => (
              <button key={t.id}
                className={`ab-tile ${drag?.tile.id === t.id && drag.moved ? "ab-dragging" : ""}`}
                onPointerDown={e => down(e, t, "tray")} onPointerMove={move} onPointerUp={up}>
                {showPiece(t.text)}
              </button>
            ))}
          </div>
          <div className="ab-actions">
            {station.hints && <button onClick={hint}>💡 Hint <small>−5</small></button>}
            <button onClick={clearAll}>↺ Clear</button>
          </div>
        </>
      )}

      {drag?.moved && (
        <div className="ab-ghost" style={{ left: drag.x, top: drag.y }}>{showPiece(drag.tile.text)}</div>
      )}
    </div>
  );
};

export default AksharaBuilder;
