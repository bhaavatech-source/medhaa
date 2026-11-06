// ═══════════════════════════════════════════════════════════════
//  BubblePop — श्रवणम्
//  Hear a sound, pop the bubble that carries it. Look-alikes float too.
// ═══════════════════════════════════════════════════════════════
import React, { useEffect, useRef, useState } from "react";
import type { GameApi } from "../GameShell";
import { variant, type BubbleStation } from "../stations";
import { shuffle } from "../../devanagariData";
import { speak } from "../../speech";

type Bubble = { id: number; text: string; left: number; dur: number; delay: number; hue: number; state?: "pop" | "bad" };
const safeSpeak = (t: string) => { try { speak(t); } catch { /* no voice */ } };
let uid = 1;

const BubblePop: React.FC<{ station: BubbleStation; api: GameApi }> = ({ station, api }) => {
  const apiRef = useRef(api); apiRef.current = api;
  const [targets] = useState(() => shuffle(station.pool).slice(0, station.rounds));
  const [round, setRound] = useState(0);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const target = targets[round];
  const lanes = 6;

  const mk = (text: string, lane: number, mid: boolean): Bubble => {
    const dur = (7.5 + Math.random() * 2.5) / station.speed;
    return {
      id: uid++, text, dur, hue: Math.floor(Math.random() * 360),
      left: 4 + lane * (88 / lanes) + Math.random() * 4,
      delay: mid ? -Math.random() * dur * 0.75 : Math.random() * 0.6,
    };
  };

  useEffect(() => {
    if (!target) return;
    const decoys = new Set<string>();
    let guard = 0;
    while (decoys.size < 3 && guard++ < 40) { const v = variant(target); if (v !== target) decoys.add(v); }
    for (const p of shuffle(station.pool)) { if (decoys.size >= lanes - 1) break; if (p !== target) decoys.add(p); }
    const texts = shuffle([target, ...[...decoys].slice(0, lanes - 1)]);
    setBubbles(texts.map((t, i) => mk(t, i, true)));
    apiRef.current.progress(round, targets.length);
    const t = window.setTimeout(() => safeSpeak(target), 300);
    return () => clearTimeout(t);
  }, [round]); // eslint-disable-line react-hooks/exhaustive-deps

  const respawn = (b: Bubble) => {
    if (b.state === "pop") return;
    setBubbles(bs => bs.map(x => (x.id === b.id ? mk(x.text, bs.indexOf(x), false) : x)));
  };

  const tap = (b: Bubble) => {
    if (b.state || apiRef.current.isOver()) return;
    if (b.text === target) {
      setBubbles(bs => bs.map(x => (x.id === b.id ? { ...x, state: "pop" } : x)));
      apiRef.current.correct(10);
      window.setTimeout(() => {
        if (apiRef.current.isOver()) return;
        if (round + 1 >= targets.length) { apiRef.current.progress(targets.length, targets.length); apiRef.current.finish(); }
        else setRound(r => r + 1);
      }, 450);
    } else {
      safeSpeak(b.text);
      setBubbles(bs => bs.map(x => (x.id === b.id ? { ...x, state: "bad" } : x)));
      apiRef.current.wrong();
      window.setTimeout(() => setBubbles(bs => bs.map(x => (x.id === b.id ? { ...x, state: undefined } : x))), 600);
    }
  };

  if (!target) return null;
  return (
    <div className="bp">
      <div className="bp-prompt">
        <button className="bp-speak" onClick={() => safeSpeak(target)}>🔊 शृणु · Listen</button>
        <span className="bp-roman">{station.romanOf[target] ?? ""}</span>
        <span className="bp-round">{round + 1} / {targets.length}</span>
      </div>
      <div className="bp-sky">
        {bubbles.map(b => (
          <button key={b.id}
            className="bp-bubble"
            style={{ left: `${b.left}%`, animationDuration: `${b.dur}s`, animationDelay: `${b.delay}s`, "--h": b.hue } as React.CSSProperties}
            onPointerDown={() => tap(b)}
            onAnimationEnd={e => { if (e.animationName === "bpRise") respawn(b); }}>
            <span className={`bp-ball ${b.state ? "bp-" + b.state : ""}`}>{b.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BubblePop;
