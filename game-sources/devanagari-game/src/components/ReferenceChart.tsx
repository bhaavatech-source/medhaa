// ReferenceChart.tsx — v4: Beautiful, clear, educational UI
// Zero changes needed in App.tsx. Same imports as before.

import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  DEVANAGARI_LETTERS, MATRAS, WORDS,
  HALANT_FORMS, CONJUNCTS,
} from "../devanagariData";
import { speak, speakRoman } from "../speech";

/* ================================================================
   DATA
================================================================ */

const VOWELS      = DEVANAGARI_LETTERS.filter(l => l.type === "vowel");

const VOWEL_HEADERS = [
  { dev: "अ",  roman: "a"   }, { dev: "आ",  roman: "ā"   },
  { dev: "इ",  roman: "i"   }, { dev: "ई",  roman: "ī"   },
  { dev: "उ",  roman: "u"   }, { dev: "ऊ",  roman: "ū"   },
  { dev: "ऋ",  roman: "ṛ"   }, { dev: "ॠ",  roman: "ṝ"   },
  { dev: "ऌ",  roman: "ḷ"   },
  { dev: "ए",  roman: "e"   }, { dev: "ऐ",  roman: "ai"  },
  { dev: "ओ",  roman: "o"   }, { dev: "औ",  roman: "au"  },
  { dev: "अं", roman: "aṃ"  }, { dev: "अँ", roman: "am̐"  },
  { dev: "अः", roman: "aḥ"  },
];
const ROMAN_SFX = ["a","ā","i","ī","u","ū","ṛ","ṝ","ḷ","e","ai","o","au","aṃ","am̐","aḥ"];

const BK_ROWS: [string, ...string[]][] = [
  ["k",  "क","का","कि","की","कु","कू","कृ","कॄ","कॢ","के","कै","को","कौ","कं","कँ","कः"],
  ["kh", "ख","खा","खि","खी","खु","खू","खृ","खॄ","खॢ","खे","खै","खो","खौ","खं","खँ","खः"],
  ["g",  "ग","गा","गि","गी","गु","गू","गृ","गॄ","गॢ","गे","गै","गो","गौ","गं","गँ","गः"],
  ["gh", "घ","घा","घि","घी","घु","घू","घृ","घॄ","घॢ","घे","घै","घो","घौ","घं","घँ","घः"],
  ["ṅ",  "ङ","ङा","ङि","ङी","ङु","ङू","ङृ","ङॄ","ङॢ","ङे","ङै","ङो","ङौ","ङं","ङँ","ङः"],
  ["c",  "च","चा","चि","ची","चु","चू","चृ","चॄ","चॢ","चे","चै","चो","चौ","चं","चँ","चः"],
  ["ch", "छ","छा","छि","छी","छु","छू","छृ","छॄ","छॢ","छे","छै","छो","छौ","छं","छँ","छः"],
  ["j",  "ज","जा","जि","जी","जु","जू","जृ","जॄ","जॢ","जे","जै","जो","जौ","जं","जँ","जः"],
  ["jh", "झ","झा","झि","झी","झु","झू","झृ","झॄ","झॢ","झे","झै","झो","झौ","झं","झँ","झः"],
  ["ñ",  "ञ","ञा","ञि","ञी","ञु","ञू","ञृ","ञॄ","ञॢ","ञे","ञै","ञो","ञौ","ञं","ञँ","ञः"],
  ["ṭ",  "ट","टा","टि","टी","टु","टू","टृ","टॄ","टॢ","टे","टै","टो","टौ","टं","टँ","टः"],
  ["ṭh", "ठ","ठा","ठि","ठी","ठु","ठू","ठृ","ठॄ","ठॢ","ठे","ठै","ठो","ठौ","ठं","ठँ","ठः"],
  ["ḍ",  "ड","डा","डि","डी","डु","डू","डृ","डॄ","डॢ","डे","डै","डो","डौ","डं","डँ","डः"],
  ["ḍh", "ढ","ढा","ढि","ढी","ढु","ढू","ढृ","ढॄ","ढॢ","ढे","ढै","ढो","ढौ","ढं","ढँ","ढः"],
  ["ṇ",  "ण","णा","णि","णी","णु","णू","णृ","णॄ","णॢ","णे","णै","णो","णौ","णं","णँ","णः"],
  ["t",  "त","ता","ति","ती","तु","तू","तृ","तॄ","तॢ","ते","तै","तो","तौ","तं","तँ","तः"],
  ["th", "थ","था","थि","थी","थु","थू","थृ","थॄ","थॢ","थे","थै","थो","थौ","थं","थँ","थः"],
  ["d",  "द","दा","दि","दी","दु","दू","दृ","दॄ","दॢ","दे","दै","दो","दौ","दं","दँ","दः"],
  ["dh", "ध","धा","धि","धी","धु","धू","धृ","धॄ","धॢ","धे","धै","धो","धौ","धं","धँ","धः"],
  ["n",  "न","ना","नि","नी","नु","नू","नृ","नॄ","नॢ","ने","नै","नो","नौ","नं","नँ","नः"],
  ["p",  "प","पा","पि","पी","पु","पू","पृ","पॄ","पॢ","पे","पै","पो","पौ","पं","पँ","पः"],
  ["ph", "फ","फा","फि","फी","फु","फू","फृ","फॄ","फॢ","फे","फै","फो","फौ","फं","फँ","फः"],
  ["b",  "ब","बा","बि","बी","बु","बू","बृ","बॄ","बॢ","बे","बै","बो","बौ","बं","बँ","बः"],
  ["bh", "भ","भा","भि","भी","भु","भू","भृ","भॄ","भॢ","भे","भै","भो","भौ","भं","भँ","भः"],
  ["m",  "म","मा","मि","मी","मु","मू","मृ","मॄ","मॢ","मे","मै","मो","मौ","मं","मँ","मः"],
  ["y",  "य","या","यि","यी","यु","यू","यृ","यॄ","यॢ","ये","यै","यो","यौ","यं","यँ","यः"],
  ["r",  "र","रा","रि","री","रु","रू","रृ","रॄ","रॢ","रे","रै","रो","रौ","रं","रँ","रः"],
  ["l",  "ल","ला","लि","ली","लु","लू","लृ","लॄ","लॢ","ले","लै","लो","लौ","लं","लँ","लः"],
  ["ḻ",  "ळ","ळा","ळि","ळी","ळु","ळू","ळृ","ळॄ","ळॢ","ळे","ळै","ळो","ळौ","ळं","ळँ","ळः"],
  ["v",  "व","वा","वि","वी","वु","वू","वृ","वॄ","वॢ","वे","वै","वो","वौ","वं","वँ","वः"],
  ["sh", "श","शा","शि","शी","शु","शू","शृ","शॄ","शॢ","शे","शै","शो","शौ","शं","शँ","शः"],
  ["ss", "ष","षा","षि","षी","षु","षू","षृ","षॄ","षॢ","षे","षै","षो","षौ","षं","षँ","षः"],
  ["s",  "स","सा","सि","सी","सु","सू","सृ","सॄ","सॢ","से","सै","सो","सौ","सं","सँ","सः"],
  ["h",  "ह","हा","हि","ही","हु","हू","हृ","हॄ","हॢ","हे","है","हो","हौ","हं","हँ","हः"],
];

/* ================================================================
   TAB CONFIG — icon emoji, bold label, plain English "what is this"
================================================================ */
type RefTab = "barakhadi" | "vowels" | "matras" | "halant" | "conjuncts" | "words";

const TABS: { key: RefTab; icon: string; sa: string; en: string; what: string; color: string }[] = [
  { key: "vowels",    icon: "🔵", sa: "स्वराः",            en: "Vowels",         what: "Svarāḥ · sounds that stand on their own — अ आ इ ई…",              color: "#006494" },
  { key: "matras",    icon: "🟠", sa: "मात्राः",           en: "Vowel signs",    what: "Mātrāḥ · the sign each vowel takes after a consonant",          color: "#da7101" },
  { key: "halant",    icon: "🔴", sa: "व्यञ्जनानि (हलः)",   en: "Consonants",     what: "Vyañjanāni / Halaḥ · pure consonants, written with ्",          color: "#a13544" },
  { key: "barakhadi", icon: "🟣", sa: "गुणिताक्षराणि",      en: "Syllable chart", what: "Guṇitākṣarāṇi · (बारहखड़ी) every consonant × every vowel",        color: "#7a39bb" },
  { key: "conjuncts", icon: "🟡", sa: "संयुक्ताक्षराणि",    en: "Conjuncts",      what: "Saṃyuktākṣarāṇi · consonants joined with no vowel between",    color: "#d19900" },
  { key: "words",     icon: "📖", sa: "शब्दाः",            en: "Words",          what: "Śabdāḥ · common words to read and hear",                        color: "#7a39bb" },
];

const COLORS = ["#006494","#437a22","#da7101","#7a39bb","#a13544","#d19900","#01696f","#a12c7b"];

/* ================================================================
   SHARED COMPONENTS
================================================================ */

// Generic letter card — large Devanagari, romanization, optional label
const LetterCard: React.FC<{
  dev: string; roman: string; tag?: string; tagColor?: string;
  hint?: string; speakText: string; speakLang?: "dev"|"en";
}> = ({ dev, roman, tag, tagColor, hint, speakText, speakLang = "dev" }) => {
  const [ring, setRing] = useState(false);
  const go = () => {
    if (speakLang === "dev") speak(speakText); else speakRoman(speakText);
    setRing(true);
    setTimeout(() => setRing(false), 700);
  };
  return (
    <button
      className={`lc ${ring ? "lc--ring" : ""}`}
      onClick={go}
      title={"Tap to hear: " + roman}
      style={{ "--lc-color": tagColor || "#01696f" } as React.CSSProperties}
    >
      <span className="lc__dev">{dev}</span>
      <span className="lc__roman">{roman}</span>
      {tag && <span className="lc__tag" style={{ background: tagColor || "#01696f" }}>{tag}</span>}
      {hint && <span className="lc__hint">{hint}</span>}
      <span className="lc__pulse" aria-hidden="true" />
    </button>
  );
};

// Word card — big Devanagari, roman below, English meaning, color stripe
const WordCard: React.FC<{ word: string; roman: string; meaning: string; color: string; index: number }> = ({
  word, roman, meaning, color, index,
}) => {
  const [active, setActive] = useState(false);
  const go = () => { speak(word); setActive(true); setTimeout(() => setActive(false), 800); };
  return (
    <button className={`wc ${active ? "wc--active" : ""}`} onClick={go}
      title={"Hear: " + roman}
      style={{ "--wc-color": color, animationDelay: `${index * 40}ms` } as React.CSSProperties}
    >
      <span className="wc__num">{index + 1}</span>
      <span className="wc__dev">{word}</span>
      <span className="wc__roman">{roman}</span>
      <span className="wc__meaning">{meaning}</span>
      <span className="wc__listen" aria-hidden>{active ? "🔊" : "🔈"}</span>
    </button>
  );
};

/* ================================================================
   MAIN COMPONENT
================================================================ */
const ReferenceChart: React.FC = () => {
  const [tab, setTab]       = useState<RefTab>("vowels");
  const [hl, setHl]         = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [tip, setTip]       = useState<{ text: string; x: number; y: number } | null>(null);
  const [spoken, setSpoken] = useState<{ dev: string; roman: string } | null>(null);
  const tipT = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeTab = TABS.find(t => t.key === tab)!;

  useEffect(() => {
    const noop = () => {};
    window.speechSynthesis?.addEventListener?.("voiceschanged", noop);
    return () => window.speechSynthesis?.removeEventListener?.("voiceschanged", noop);
  }, []);

  const cellClick = useCallback((dev: string, roman: string, e?: React.MouseEvent) => {
    speak(dev);
    setHl(dev);
    setSpoken({ dev, roman });
    if (tipT.current) clearTimeout(tipT.current);
    if (e) {
      setTip({ text: roman, x: e.clientX, y: e.clientY });
      tipT.current = setTimeout(() => setTip(null), 1500);
    }
    setTimeout(() => setHl(null), 700);
  }, []);

  const filteredRows = search.trim()
    ? BK_ROWS.filter(([roman, ...cells]) =>
        roman.toLowerCase().includes(search.toLowerCase()) ||
        cells.some(c => c.includes(search)))
    : BK_ROWS;

  return (
    <div className="rc4">

      {/* == SECTION HEADER — changes per tab ====================== */}
      <div className="rc4__hero" style={{ "--hero-color": activeTab.color } as React.CSSProperties}>
        <div className="rc4__hero-left">
          <span className="rc4__hero-icon">{activeTab.icon}</span>
          <div>
            <h2 className="rc4__hero-title">{activeTab.sa} <span className="rc4__hero-en">· {activeTab.en}</span></h2>
            <p className="rc4__hero-what">{activeTab.what}</p>
          </div>
        </div>
        {spoken && (
          <div className="rc4__spoken">
            <span className="rc4__spoken-dev">{spoken.dev}</span>
            <span className="rc4__spoken-bar">/</span>
            <span className="rc4__spoken-roman">{spoken.roman}</span>
            <span className="rc4__spoken-wave">🔊</span>
          </div>
        )}
      </div>

      {/* == TAB NAV ================================================ */}
      <nav className="rc4__nav" aria-label="Reference sections">
        {TABS.map(t => (
          <button
            key={t.key}
            className={`rc4__nav-btn ${tab === t.key ? "rc4__nav-btn--on" : ""}`}
            onClick={() => { setTab(t.key); setSearch(""); setSpoken(null); }}
            style={{ "--nb-color": t.color } as React.CSSProperties}
            aria-current={tab === t.key ? "page" : undefined}
          >
            <span className="rc4__nav-icon">{t.icon}</span>
            <span className="rc4__nav-label">{t.sa}<small className="rc4__nav-en">{t.en}</small></span>
          </button>
        ))}
      </nav>

      {/* == PANEL ================================================== */}
      <div className="rc4__panel" key={tab}>

        {/* --- VOWELS ------------------------------------------- */}
        {tab === "vowels" && (
          <>
            <div className="rc4__explain">
              <strong>स्वराः (Svarāḥ) · Vowels</strong> are independent letters — they stand alone and make sound on their own.
              In Devanagari, a consonant written with no sign is read with "a" (अ) — the absence of a sign is the sign of अ. Other vowels are added as signs (mātrās).
            </div>
            <div className="lc-grid">
              {VOWELS.map((v, i) => (
                <LetterCard key={v.char}
                  dev={v.char} roman={v.roman}
                  tag="Vowel" tagColor={COLORS[i % COLORS.length]}
                  speakText={v.char}
                />
              ))}
            </div>
            <div className="rc4__explain">
              <strong>ऌ (ḷ)</strong> is one independent vowel, not the sequence <strong>उ + ल</strong>. Its dependent sign is <strong>ॢ</strong>, as in <strong>कॢ</strong>.
            </div>
            <div className="rc4__tip-box">
              <span className="rc4__tip-icon">💡</span>
              <span><strong>How to read:</strong> The big Devanagari character is what you see in text. The small text below (like <em>a, ā, i</em>) is how it sounds. Tap any card to hear it!</span>
            </div>
          </>
        )}

        {/* --- MATRAS ------------------------------------------- */}
        {tab === "matras" && (
          <>
            <div className="rc4__explain">
              <strong>Mātrās (मात्रा)</strong> are <em>not</em> standalone letters — they are vowel signs that attach to a
              consonant to change its vowel sound. Example: <strong>क + ा = का</strong> (ka + aa = kaa).
              Tap any mātrā to hear its vowel sound. For the independent vowel ऌ, the dependent sign is ॢ; the standalone letter remains ऌ.
            </div>
            <div className="matra-grid">
              {MATRAS.map((m, i) => (
                <button
                  key={m.symbol}
                  className="mc"
                  onClick={() => { speak(m.vowel); setSpoken({ dev: m.vowel, roman: m.sound }); }}
                  title={"Hear: " + m.sound}
                  style={{ "--mc-color": COLORS[i % COLORS.length] } as React.CSSProperties}
                >
                  <span className="mc__symbol">{m.symbol}</span>
                  <span className="mc__sound">{m.sound}</span>
                  <span className="mc__vowel">{m.vowel}</span>
                  <span className="mc__example">e.g. {m.example}</span>
                </button>
              ))}
            </div>
            <div className="rc4__tip-box">
              <span className="rc4__tip-icon">💡</span>
              <span>The <strong>mātrā symbol</strong> (top, large) attaches to a consonant. Below it: its <strong>sound</strong>, which vowel it represents, and an example syllable.</span>
            </div>
          </>
        )}

        {/* --- GUṆITĀKṢARĀṆI (formerly Barākhaḍī) ---------------- */}
        {tab === "barakhadi" && (
          <>
            <div className="rc4__explain">
              <strong>गुणिताक्षराणि (Guṇitākṣarāṇi)</strong> — known in Hindi as बारहखड़ी — is the complete syllable chart:
              every consonant combined (गुणितम्) with every vowel. Read left to right: <strong>क का कि की कु कू…</strong> (ka kā ki kī ku kū…).
              Tap any cell to hear it.
            </div>

            <div className="bk4-toolbar">
              <div className="bk4-search-wrap">
                <span className="bk4-search-ico">&#128269;</span>
                <input className="bk4-search" type="text"
                  placeholder="Filter: type k, ग, or dh…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
                {search && <button className="bk4-clear" onClick={() => setSearch("")}>&#10005;</button>}
              </div>
              <div className="bk4-legend">
                <span className="bk4-leg bk4-leg--basic">Common (a–ū)</span>
                <span className="bk4-leg bk4-leg--rare">Vedic rare</span>
                <span className="bk4-leg bk4-leg--nasal">Nasal/Visarga</span>
              </div>
            </div>

            <div className="bk4-scroll">
              <table className="bk4-tbl" cellSpacing={0}>
                <thead>
                  <tr>
                    <th className="bk4-corner bk4-sticky">
                      <span className="bk4-corner-top">का+</span>
                      <span className="bk4-corner-bot">Cons.</span>
                    </th>
                    {VOWEL_HEADERS.map((vh, vi) => (
                      <th key={vh.roman}
                        className={`bk4-vh${vi < 6 ? " bk4-vh--b" : vi <= 8 ? " bk4-vh--r" : vi >= 13 ? " bk4-vh--n" : ""}`}
                        onClick={e => cellClick(vh.dev, vh.roman, e)}
                        title={"Hear vowel: " + vh.roman}
                      >
                        <span className="bk4-vh-d">{vh.dev}</span>
                        <span className="bk4-vh-r">{vh.roman}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredRows.map(([roman, ...cells]) => (
                    <tr key={roman} className="bk4-row">
                      <td className="bk4-rh bk4-sticky"
                        onClick={e => cellClick(cells[0], roman + "-", e)}
                        title={"Hear consonant: " + roman}
                      >
                        <span className="bk4-rh-d">{cells[0]}</span>
                        <span className="bk4-rh-r">{roman}</span>
                      </td>
                      {cells.map((cell, ci) => {
                        const label = roman + ROMAN_SFX[ci];
                        return (
                          <td key={ci}
                            className={[
                              "bk4-cell",
                              hl === cell       ? "bk4-flash"  : "",
                              ci === 0          ? "bk4-c-base" : "",
                              ci >= 7 && ci <=8 ? "bk4-c-rare" : "",
                              ci >= 13          ? "bk4-c-nsl"  : "",
                            ].filter(Boolean).join(" ")}
                            onClick={e => cellClick(cell, label, e)}
                            title={label}
                          >
                            {cell}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="bk4-count">
              {filteredRows.length < BK_ROWS.length
                ? `Showing ${filteredRows.length} / ${BK_ROWS.length} consonants`
                : `${BK_ROWS.length} consonants x 16 vowels = ${BK_ROWS.length * 16} syllables`}
            </p>
          </>
        )}

        {/* --- HALANT ------------------------------------------- */}
        {tab === "halant" && (
          <>
            <div className="rc4__explain">
              <strong>व्यञ्जनानि (हलः) · Consonants.</strong> In Pāṇini's grammar the consonants are called <strong>हल्</strong>
              (the प्रत्याहार from ह to ल्). A consonant by itself has no vowel; in writing this is shown by the
              <strong> हलन्त / virāma sign ्</strong> below it: <strong>क्</strong>. When a vowel follows, the sign goes away —
              <strong> क् + अ = क</strong> (अ takes no sign), <strong>क् + इ = कि</strong>.
            </div>
            <div className="halant4-demo">
              <span className="h4d__part">क</span>
              <span className="h4d__op">+</span>
              <span className="h4d__part">्</span>
              <span className="h4d__op">=</span>
              <span className="h4d__result">क्</span>
              <span className="h4d__label">क without its अ = क् (pure k)</span>
            </div>
            <div className="halant4-grid">
              {HALANT_FORMS.map((h, i) => (
                <button key={h.halant} className="hc4"
                  onClick={() => { speak(h.halant); setSpoken({ dev: h.halant, roman: h.roman }); }}
                  title={"Hear: " + h.roman}
                  style={{ "--hc4-c": COLORS[i % COLORS.length] } as React.CSSProperties}
                >
                  <span className="hc4__base">{h.base}</span>
                  <span className="hc4__arrow">→</span>
                  <span className="hc4__half">{h.halant}</span>
                  <span className="hc4__roman">/{h.roman}/</span>
                </button>
              ))}
            </div>
          </>
        )}

        {/* --- CONJUNCTS ---------------------------------------- */}
        {tab === "conjuncts" && (
          <>
            <div className="rc4__explain">
              <strong>संयुक्ताक्षराणि (Saṃyuktākṣarāṇi) · Conjuncts</strong> are formed when two or more consonants meet with no vowel
              between them. Using virāma, they fuse into a single combined letter.
              Example: <strong>क् + ष = क्ष</strong> (ksha).
            </div>
            <div className="conj4-grid">
              {CONJUNCTS.map((cj, i) => (
                <button key={cj.char} className="cjc4"
                  onClick={() => { speak(cj.char); setSpoken({ dev: cj.char, roman: cj.roman }); }}
                  title={"Hear: " + cj.roman}
                  style={{ "--cjc4-c": COLORS[i % COLORS.length] } as React.CSSProperties}
                >
                  <span className="cjc4__dev">{cj.char}</span>
                  <span className="cjc4__roman">{cj.roman}</span>
                  <span className="cjc4__parts">{cj.components}</span>
                  <span className="cjc4__eg">{cj.example}</span>
                </button>
              ))}
            </div>
          </>
        )}

        {/* --- WORDS -------------------------------------------- */}
        {tab === "words" && (
          <>
            <div className="rc4__explain">
              <strong>शब्दाः (Śabdāḥ) · Words</strong> — each card shows the word in Devanāgarī, its romanization
              and its meaning. Tap to hear it.
            </div>
            <div className="wc4-grid">
              {WORDS.map((w, i) => (
                <WordCard key={w.word}
                  word={w.word} roman={w.roman} meaning={w.meaning}
                  color={COLORS[i % COLORS.length]} index={i}
                />
              ))}
            </div>
          </>
        )}

      </div>{/* end rc4__panel */}

      {/* Floating pronunciation tooltip */}
      {tip && (
        <div className="rc4-tip" style={{ left: tip.x, top: tip.y - 44 }}>
          {tip.text}
        </div>
      )}

    </div>
  );
};

export default ReferenceChart;
