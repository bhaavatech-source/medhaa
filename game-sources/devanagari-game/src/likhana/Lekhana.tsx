// ═══════════════════════════════════════════════════════════════
//  likhana/Lekhana.tsx — ✍️ लेखनाभ्यासः
// ═══════════════════════════════════════════════════════════════
import React, { useEffect, useState } from "react";
import WritingPad, { DEFAULT_SETTINGS, type PadMode, type PadSettings } from "./WritingPad";
import StrokeReview from "./StrokeReview";
import { getLetter, type Verdict } from "./engine";
import { STROKES } from "./strokeData";
import { DEVANAGARI_LETTERS } from "../devanagariData";
import { CONJUNCT_LETTERS, DOUBLED_LETTERS, CONJUNCT_WRITING } from "./conjunctStrokes";
import { speak } from "../speech";
import "./likhana.css";

export const GROUPS: { name: string; en: string; letters: string[] }[] = [
  { name: "स्वराः",    en: "Vowels",      letters: ["अ","आ","इ","ई","उ","ऊ","ऋ","ए","ऐ","ओ","औ"] },
  { name: "कवर्गः",   en: "k-group",     letters: ["क","ख","ग","घ","ङ"] },
  { name: "चवर्गः",   en: "c-group",     letters: ["च","छ","ज","झ","ञ"] },
  { name: "टवर्गः",   en: "ṭ-group",     letters: ["ट","ठ","ड","ढ","ण"] },
  { name: "तवर्गः",   en: "t-group",     letters: ["त","थ","द","ध","न"] },
  { name: "पवर्गः",   en: "p-group",     letters: ["प","फ","ब","भ","म"] },
  { name: "अन्तःस्थाः", en: "Semivowels",  letters: ["य","र","ल","व"] },
  { name: "ऊष्माणः",  en: "Sibilants",   letters: ["श","ष","स","ह","ळ"] },
  { name: "द्वित्वाक्षराणि", en: "Doubled consonants", letters: DOUBLED_LETTERS.map(l => l.char) },
  { name: "संयुक्ताक्षराणि", en: "Conjunct consonants", letters: CONJUNCT_LETTERS.map(l => l.char) },
];
const ALL = GROUPS.flatMap(g => g.letters);
const JOINED = [...DOUBLED_LETTERS, ...CONJUNCT_LETTERS];
const ROMAN: Record<string, string> = Object.fromEntries([...DEVANAGARI_LETTERS, ...JOINED].map(l => [l.char, l.roman]));
const INKS = ["#1d4ed8", "#0f172a", "#047857", "#b91c1c", "#7c3aed", "#c2410c"];

const PKEY = "lekhana-progress-v1", SKEY = "lekhana-settings-v1";
const load = <T,>(k: string, d: T): T => { try { const v = localStorage.getItem(k); return v ? { ...d, ...JSON.parse(v) } : d; } catch { return d; } };
const save = (k: string, v: unknown) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* ignore */ } };
const stars = (s?: number) => (s === undefined ? 0 : s >= 90 ? 3 : s >= 75 ? 2 : s >= 55 ? 1 : 0);
const say = (t: string) => { try { speak(t); } catch { /* no voice */ } };

const MODES: { id: PadMode; n: string; sa: string; en: string; tip: string }[] = [
  { id: "watch", n: "①", sa: "पश्य", en: "Watch", tip: "See each stroke drawn in order" },
  { id: "trace", n: "②", sa: "अनुलिख", en: "Trace", tip: "Write over the guide, following the numbers" },
  { id: "write", n: "③", sa: "लिख", en: "Write", tip: "Write on your own — only the lines" },
];

const Lekhana: React.FC = () => {
  const [group, setGroup] = useState(0);
  const [letter, setLetter] = useState("अ");
  const [mode, setMode] = useState<PadMode>("watch");
  const [settings, setSettings] = useState<PadSettings>(() => load(SKEY, DEFAULT_SETTINGS));
  const [best, setBest] = useState<Record<string, number>>(() => load(PKEY, {} as Record<string, number>));
  const [showSet, setShowSet] = useState(false);
  const [focus, setFocus] = useState(false);
  const [review, setReview] = useState(false);
  const [version, setVersion] = useState(0);

  useEffect(() => save(SKEY, settings), [settings]);
  useEffect(() => { setMode("watch"); say(letter); }, [letter]);
  useEffect(() => {
    if (!focus) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setFocus(false);
    window.addEventListener("keydown", onKey); document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [focus]);

  const set = <K extends keyof PadSettings>(k: K, v: PadSettings[K]) => setSettings(s => ({ ...s, [k]: v }));
  const onResult = (v: Verdict) => {
    const nb = { ...best, [letter]: Math.max(best[letter] ?? 0, v.score) };
    setBest(nb); save(PKEY, nb);
  };
  const selectLetter = (ch: string) => {
    setGroup(GROUPS.findIndex(g => g.letters.includes(ch)));
    setLetter(ch);
  };
  const next = () => selectLetter(ALL[(ALL.indexOf(letter) + 1) % ALL.length]);
  const prev = () => selectLetter(ALL[(ALL.indexOf(letter) - 1 + ALL.length) % ALL.length]);
  const writingData = getLetter(letter);
  const n = writingData?.strokes.length ?? 0;
  const joined = JOINED.find(l => l.char === letter);

  if (review) return <StrokeReview onClose={() => { setReview(false); setVersion(v => v + 1); }} />;

  const pad = (
    <WritingPad letter={letter} mode={mode} settings={settings} version={version} onResult={onResult}
      onWatched={() => undefined} maxHeight={focus ? window.innerHeight - 190 : undefined} />
  );

  return (
    <div className="lk">
      <div className="lk-top">
        <div>
          <h2 className="lk-title">लेखनाभ्यासः <span>· Writing practice</span></h2>
          <p className="lk-sub">Watch letters, doubled consonants and conjuncts, trace them, then write them yourself — with a finger, mouse or stylus.</p>
        </div>
        <button className="lk-review-btn" onClick={() => setReview(true)} title="For teachers: check and correct stroke order">🧑‍🏫 समीक्षा · Review strokes</button>
      </div>

      <div className="lk-groups">
        {GROUPS.map((g, i) => (
          <button key={g.name} className={`lk-group ${i === group ? "on" : ""}`} onClick={() => selectLetter(g.letters[0])}>
            {g.name}<small>{g.en}</small>
          </button>
        ))}
      </div>
      <div className="lk-letters">
        {GROUPS[group].letters.map(l => (
          <button key={l} className={`lk-letter ${l === letter ? "on" : ""}`} onClick={() => selectLetter(l)}>
            <span>{l}</span>
            <i>{[1, 2, 3].map(k => <b key={k} className={k <= stars(best[l]) ? "y" : ""}>★</b>)}</i>
          </button>
        ))}
      </div>

      {joined && <p className="lk-sub" role="note">
        {joined.parts} → {joined.char} · {joined.roman} · Example: {joined.example}.
        {" "}The first consonant has no inherent अ. Handwritten forms vary; these stroke guides are drafts for teacher review.
      </p>}

      <div className={`lk-main ${focus ? "lk-focus" : ""}`}>
        <div className="lk-head">
          <button className="lk-nav" onClick={prev} aria-label="Previous letter">◀</button>
          <button className="lk-big" onClick={() => say(letter)} title="Hear it">
            {letter}<small>{ROMAN[letter]} · {n} strokes 🔊</small>
          </button>
          <button className="lk-nav" onClick={next} aria-label="Next letter">▶</button>
          <div className="lk-modes">
            {MODES.map(m => (
              <button key={m.id} className={`lk-mode ${mode === m.id ? "on" : ""}`} onClick={() => setMode(m.id)} title={m.tip}>
                <b>{m.n}</b> {m.sa}<small>{m.en}</small>
              </button>
            ))}
          </div>
          <div className="lk-icons">
            <button onClick={() => setShowSet(s => !s)} title="Settings">⚙</button>
            <button onClick={() => setFocus(f => !f)} title={focus ? "Exit focus mode" : "Focus mode — full screen writing"}>{focus ? "✕" : "⛶"}</button>
          </div>
        </div>

        {showSet && (
          <div className="lk-settings">
            <label>Guide
              <select value={settings.guide} onChange={e => set("guide", e.target.value as PadSettings["guide"])}>
                <option value="solid">Solid (grey letter)</option>
                <option value="dotted">Dotted centre line</option>
                <option value="none">None — freehand</option>
              </select>
            </label>
            <label>Speed
              <select value={settings.speed} onChange={e => set("speed", Number(e.target.value))}>
                <option value={0.5}>Slow</option><option value={1}>Normal</option><option value={1.8}>Fast</option>
              </select>
            </label>
            <label>Pen
              <select value={settings.pen} onChange={e => set("pen", Number(e.target.value))}>
                <option value={2.2}>Thin</option><option value={3.2}>Medium</option><option value={4.6}>Thick</option>
              </select>
            </label>
            <div className="lk-inks">Ink
              {INKS.map(c => <button key={c} style={{ background: c }} className={settings.ink === c ? "on" : ""} onClick={() => set("ink", c)} aria-label={`ink ${c}`} />)}
            </div>
            <label className="lk-check"><input type="checkbox" checked={settings.numbers} onChange={e => set("numbers", e.target.checked)} /> Stroke numbers</label>
            <label className="lk-check"><input type="checkbox" checked={settings.leftHanded} onChange={e => set("leftHanded", e.target.checked)} /> Left-handed layout</label>
          </div>
        )}

        <p className="lk-modetip">{MODES.find(m => m.id === mode)!.tip}.{mode === "watch" ? " Then press ② to trace." : ""}</p>
        {CONJUNCT_WRITING[letter] && writingData === STROKES[letter] && (
          <p className="lk-modetip" role="note">
            1: {CONJUNCT_WRITING[letter].body}
            {" "}2: Lift, then draw the right stem downward.
            {" "}3: Lift, then draw the headline left to right.
          </p>
        )}
        {pad}
        {mode === "watch" && <button className="lk-cta" onClick={() => setMode("trace")}>② अनुलिख · Now trace it →</button>}
      </div>

      <details className="lk-tips">
        <summary>✍️ Writing on a screen — how to make it feel like paper</summary>
        <div>
          <p><b>Phone or tablet:</b> a finger works, but a stylus is much closer to a pencil. With an S Pen or Apple Pencil the ink follows your pressure, and the pad ignores your palm once it sees the pen.</p>
          <p><b>Laptop or desktop:</b> a mouse moves from the wrist, not the fingers. A small pen tablet (any USB/Bluetooth drawing pad) gives real pen control.</p>
          <p><b>Posture:</b> hold the stylus like a pencil, rest your hand, and tilt the device slightly like a notebook. On a phone, use ⛶ focus mode and turn it sideways for more room.</p>
          <p><b>The lines:</b> red = शिरोरेखा line, blue = baseline. Most letters sit between them; signs like ि ी े go above, and ु ू ृ go below.</p>
        </div>
      </details>
    </div>
  );
};

export default Lekhana;
