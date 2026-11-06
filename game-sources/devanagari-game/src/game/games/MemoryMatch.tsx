// ═══════════════════════════════════════════════════════════════
//  MemoryMatch — स्मृतिक्रीडा
//  All cards are shown for a moment, then flipped. Find the pairs.
// ═══════════════════════════════════════════════════════════════
import React, { useEffect, useRef, useState } from "react";
import type { GameApi } from "../GameShell";
import type { MemoryStation } from "../stations";
import { shuffle } from "../../devanagariData";
import { speak } from "../../speech";

type Card = { id: number; pair: number; face: string; sub?: string };
const isDeva = (t: string) => /[ऀ-ॿ]/.test(t);
const safeSpeak = (t: string) => { try { speak(t.replace("◌", "")); } catch { /* no voice */ } };

const MemoryMatch: React.FC<{ station: MemoryStation; api: GameApi }> = ({ station, api }) => {
  const apiRef = useRef(api); apiRef.current = api;
  const [cards] = useState<Card[]>(() => {
    const pairs = station.pairs();
    return shuffle(pairs.flatMap((p, i) => [
      { id: i * 2, pair: i, face: p.a, sub: p.aSub },
      { id: i * 2 + 1, pair: i, face: p.b, sub: p.bSub },
    ]));
  });
  const n = cards.length / 2;
  const [peek, setPeek] = useState(true);
  const [open, setOpen] = useState<number[]>([]);
  const [matched, setMatched] = useState<Set<number>>(new Set());
  const [bad, setBad] = useState<number[]>([]);
  const mistakes = useRef(0);

  useEffect(() => {
    apiRef.current.progress(0, n);
    const t = window.setTimeout(() => setPeek(false), 2200);
    return () => clearTimeout(t);
  }, [n]);

  const flip = (c: Card) => {
    if (peek || open.length === 2 || open.includes(c.id) || matched.has(c.pair)) return;
    if (isDeva(c.face)) safeSpeak(c.face);
    const o = [...open, c.id];
    setOpen(o);
    if (o.length < 2) return;
    const [a, b] = o.map(id => cards.find(x => x.id === id)!);
    if (a.pair === b.pair) {
      const m = new Set(matched); m.add(a.pair);
      window.setTimeout(() => {
        setMatched(m); setOpen([]);
        apiRef.current.correct(10);
        apiRef.current.progress(m.size, n);
        if (m.size === n) {
          const stars = mistakes.current <= n / 2 ? 3 : mistakes.current <= n ? 2 : 1;
          window.setTimeout(() => apiRef.current.finish(stars), 500);
        }
      }, 350);
    } else {
      mistakes.current += 1;
      setBad(o);
      window.setTimeout(() => { apiRef.current.wrong(); setOpen([]); setBad([]); }, 800);
    }
  };

  return (
    <div className="mm">
      <p className="mm-help">{peek ? "👀 Remember where they are…" : "Tap two cards to find a matching pair."}</p>
      <div className="mm-grid">
        {cards.map(c => {
          const up = peek || open.includes(c.id) || matched.has(c.pair);
          return (
            <button key={c.id} onClick={() => flip(c)}
              className={`mm-card ${up ? "mm-up" : ""} ${matched.has(c.pair) ? "mm-done" : ""} ${bad.includes(c.id) ? "mm-bad" : ""}`}>
              <span className="mm-inner">
                <span className="mm-back" aria-hidden>?</span>
                <span className={`mm-front ${isDeva(c.face) ? "mm-deva" : "mm-latin"}`}>
                  {c.face}
                  {c.sub && <small>{c.sub}</small>}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MemoryMatch;
