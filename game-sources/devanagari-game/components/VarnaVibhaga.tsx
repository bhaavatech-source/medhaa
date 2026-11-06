// ═══════════════════════════════════════════════════════════════
//  VarnaVibhaga.tsx — वर्णविच्छेदः
//  1. Explains the three levels with worked examples
//  2. Lets the learner type ANY word and see its three levels
// ═══════════════════════════════════════════════════════════════
import React, { useMemo, useState } from "react";
import { breakdown, isDevanagari, type Piece, type WordBreakdown } from "../varnaVibhaga";
import { speak } from "../speech";
import "./VarnaVibhaga.css";

type Example = { word: string; meaning: string; tag?: string };

const SANSKRIT_EXAMPLES: Example[] = [
  { word: "रामः",     meaning: "Rāma",            tag: "simple" },
  { word: "गुरुः",    meaning: "teacher",          tag: "mātrā" },
  { word: "विद्या",   meaning: "knowledge",        tag: "ि + conjunct" },
  { word: "सूर्यः",   meaning: "sun",              tag: "reph" },
  { word: "कृष्णः",   meaning: "Kṛṣṇa",            tag: "ृ + conjunct" },
  { word: "ज्ञानम्",  meaning: "knowledge",        tag: "ज्ञ + halant" },
  { word: "संस्कृतम्", meaning: "Sanskrit",         tag: "anusvāra" },
  { word: "पृथ्वी",   meaning: "earth",            tag: "conjunct" },
  { word: "श्रीः",    meaning: "prosperity",       tag: "श्र" },
  { word: "क्षत्रियः", meaning: "warrior",          tag: "क्ष, त्र" },
];

const HINDI_EXAMPLES: Example[] = [
  { word: "पानी",     meaning: "water",   tag: "simple" },
  { word: "किताब",    meaning: "book",    tag: "final अ" },
  { word: "हँसना",    meaning: "to laugh", tag: "candrabindu" },
  { word: "पहाड़",    meaning: "mountain", tag: "nukta" },
  { word: "ज़मीन",    meaning: "land",    tag: "nukta" },
  { word: "स्कूल",    meaning: "school",  tag: "conjunct" },
  { word: "धन्यवाद",  meaning: "thank you", tag: "conjunct" },
];

// ── On-screen keyboard ─────────────────────────────────────────
const KB_ROWS: { label: string; keys: string[] }[] = [
  { label: "स्वराः",  keys: ["अ","आ","इ","ई","उ","ऊ","ऋ","ॠ","ऌ","ए","ऐ","ओ","औ"] },
  { label: "मात्राः", keys: ["ा","ि","ी","ु","ू","ृ","ॄ","ॢ","े","ै","ो","ौ"] },
  { label: "चिह्नानि", keys: ["्","ं","ः","ँ","़","ऽ","।"] },
  { label: "कवर्गः", keys: ["क","ख","ग","घ","ङ"] },
  { label: "चवर्गः", keys: ["च","छ","ज","झ","ञ"] },
  { label: "टवर्गः", keys: ["ट","ठ","ड","ढ","ण"] },
  { label: "तवर्गः", keys: ["त","थ","द","ध","न"] },
  { label: "पवर्गः", keys: ["प","फ","ब","भ","म"] },
  { label: "अन्ये",   keys: ["य","र","ल","व","श","ष","स","ह","ळ"] },
];
const COMBINING = new Set(["ा","ि","ी","ु","ू","ृ","ॄ","ॢ","े","ै","ो","ौ","्","ं","ः","ँ","़"]);

const KIND_LABEL: Record<string, string> = {
  vowel: "स्वरः · vowel",
  consonant: "व्यञ्जनम् · consonant (with ्)",
  full: "consonant + अ",
  matra: "मात्रा · vowel sign",
  mark: "ं ः ँ",
  other: "other",
};

const show = (p: Piece) => (p.kind === "matra" || (p.kind === "mark" && COMBINING.has(p.text)) ? "◌" + p.text : p.text);

// ── Sub-components ─────────────────────────────────────────────
const Tile: React.FC<{ p: Piece; i: number }> = ({ p, i }) => (
  <button
    className={`vv-tile vv-k-${p.kind}`}
    style={{ animationDelay: `${i * 45}ms` }}
    onClick={() => speak(p.text)}
    title={`${KIND_LABEL[p.kind]} — tap to hear`}
  >
    <span className="vv-tile-d">{show(p)}</span>
    <span className="vv-tile-r">{p.roman}</span>
  </button>
);

const LevelRow: React.FC<{ n: number; name: string; en: string; pieces: Piece[] }> = ({ n, name, en, pieces }) => (
  <div className="vv-level">
    <div className="vv-level-head">
      <span className="vv-level-num">{n}</span>
      <span className="vv-level-name">{name}</span>
      <span className="vv-level-en">{en}</span>
    </div>
    <div className="vv-tiles">
      {pieces.map((p, i) => <Tile key={i} p={p} i={i} />)}
    </div>
  </div>
);

const WordCard: React.FC<{ b: WordBreakdown; meaning?: string }> = ({ b, meaning }) => (
  <article className="vv-card">
    <LevelRow n={1} name="वर्णाः" en="every sound separately" pieces={b.l1} />
    <div className="vv-arrow">↓ <span>अ joins its consonant · other vowels become signs</span></div>
    <LevelRow n={2} name="लिखितांशाः" en="the written pieces" pieces={b.l2} />
    <div className="vv-arrow">↓ <span>pieces join into aksharas</span></div>
    <div className="vv-level">
      <div className="vv-level-head">
        <span className="vv-level-num">3</span>
        <span className="vv-level-name">पदम्</span>
        <span className="vv-level-en">the joined word</span>
      </div>
      <button className="vv-word" onClick={() => speak(b.l3)} title="Tap to hear">
        <span className="vv-word-d">{b.l3}</span>
        <span className="vv-word-r">{b.roman}{meaning ? ` — ${meaning}` : ""}</span>
      </button>
    </div>

    <details className="vv-steps" open>
      <summary>How each akshara is written</summary>
      <ol>
        {b.steps.map((s, i) => (
          <li key={i}>
            <div className="vv-step-eq">
              <span className="vv-step-from">{s.from}</span>
              <span className="vv-step-arrow">→</span>
              <span className="vv-step-to">{s.to}</span>
            </div>
            <ul>{s.why.map((w, j) => <li key={j}>{w}</li>)}</ul>
          </li>
        ))}
      </ol>
    </details>

    {b.notes.length > 0 && (
      <div className="vv-notes">
        {b.notes.map((n, i) => <p key={i}>💡 {n}</p>)}
      </div>
    )}
  </article>
);

// ── Main ───────────────────────────────────────────────────────
const VarnaVibhaga: React.FC = () => {
  const [text, setText] = useState("सूर्यः");
  const [showKb, setShowKb] = useState(false);
  const all = [...SANSKRIT_EXAMPLES, ...HINDI_EXAMPLES];
  const meaning = all.find(e => e.word === text.trim())?.meaning;

  const result = useMemo(() => (isDevanagari(text) ? breakdown(text) : null), [text]);
  const hasLatin = /[A-Za-z]/.test(text);

  const press = (k: string) => setText(t => t + k);
  const back = () => setText(t => [...t].slice(0, -1).join(""));

  return (
    <div className="vv-root">
      {/* ── 1. How it works ── */}
      <section className="vv-intro">
        <h2 className="vv-title">वर्णविच्छेदः <span>— how a word is built</span></h2>
        <p className="vv-lead">
          Every Devanāgarī word can be seen at three levels. Take <b>सूर्यः</b> (sun):
        </p>
        <div className="vv-trio">
          <div className="vv-trio-card">
            <span className="vv-trio-n">1</span>
            <span className="vv-trio-d">स् ऊ र् य् अ ः</span>
            <span className="vv-trio-t">वर्णाः — each sound alone. Consonants carry ् (halant) because their अ is shown separately.</span>
          </div>
          <div className="vv-trio-card">
            <span className="vv-trio-n">2</span>
            <span className="vv-trio-d">स् ◌ू र् यः</span>
            <span className="vv-trio-t">लिखितांशाः — the pieces you actually write. ऊ after a consonant becomes its sign ू. अ has no sign, so य् + अ is simply य.</span>
          </div>
          <div className="vv-trio-card">
            <span className="vv-trio-n">3</span>
            <span className="vv-trio-d">सूर्यः</span>
            <span className="vv-trio-t">पदम् — the pieces join: स् + ू = सू, and र् sits on top of य as a hook (reph).</span>
          </div>
        </div>

        <div className="vv-rules">
          <div><b>क = क् + अ</b> Every consonant letter already contains अ.</div>
          <div><b>क् (halant ्)</b> removes that अ — a "pure" consonant.</div>
          <div><b>कि की कु कू</b> Other vowels after a consonant are written as signs (मात्राः).</div>
          <div><b>क्य स्व प्र र्म</b> Consonants with no vowel between them join into one conjunct.</div>
        </div>
      </section>

      {/* ── 2. Examples ── */}
      <section className="vv-examples">
        <h3>उदाहरणानि · Examples</h3>
        <div className="vv-ex-group">
          <span className="vv-ex-label">संस्कृतम्</span>
          {SANSKRIT_EXAMPLES.map(e => (
            <button key={e.word} className={`vv-chip ${text === e.word ? "vv-chip-on" : ""}`} onClick={() => setText(e.word)}>
              {e.word}<small>{e.tag}</small>
            </button>
          ))}
        </div>
        <div className="vv-ex-group">
          <span className="vv-ex-label">हिन्दी</span>
          {HINDI_EXAMPLES.map(e => (
            <button key={e.word} className={`vv-chip ${text === e.word ? "vv-chip-on" : ""}`} onClick={() => setText(e.word)}>
              {e.word}<small>{e.tag}</small>
            </button>
          ))}
        </div>
      </section>

      {/* ── 3. Any word ── */}
      <section className="vv-tool">
        <h3>स्वयं परीक्षध्वम् · Try any word</h3>
        <div className="vv-input-row">
          <input
            className="vv-input"
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Type or paste a Devanāgarī word…"
            lang="sa"
            spellCheck={false}
          />
          <button className="vv-btn" onClick={() => setShowKb(s => !s)}>⌨ {showKb ? "Hide" : "Keyboard"}</button>
          <button className="vv-btn" onClick={() => setText("")}>✕ Clear</button>
        </div>

        {showKb && (
          <div className="vv-kb">
            {KB_ROWS.map(r => (
              <div key={r.label} className="vv-kb-row">
                <span className="vv-kb-label">{r.label}</span>
                {r.keys.map(k => (
                  <button key={k} className="vv-key" onClick={() => press(k)}>
                    {COMBINING.has(k) ? "◌" + k : k}
                  </button>
                ))}
              </div>
            ))}
            <div className="vv-kb-row">
              <span className="vv-kb-label" />
              <button className="vv-key vv-key-wide" onClick={() => press(" ")}>space</button>
              <button className="vv-key vv-key-wide" onClick={back}>⌫</button>
            </div>
          </div>
        )}

        {hasLatin && !result && (
          <p className="vv-warn">Please type in Devanāgarī script (use the ⌨ keyboard if your device has none).</p>
        )}

        <div className="vv-legend">
          {(["vowel","consonant","full","matra","mark"] as const).map(k => (
            <span key={k} className={`vv-legend-item vv-k-${k}`}>{KIND_LABEL[k]}</span>
          ))}
        </div>

        {result?.words.map((w, i) => (
          <WordCard key={w.word + i} b={w} meaning={result.words.length === 1 ? meaning : undefined} />
        ))}
      </section>
    </div>
  );
};

export default VarnaVibhaga;
