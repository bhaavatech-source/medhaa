import React, { useMemo, useState } from "react";
import { speak } from "../speech";
import { HINDI, PLACES, english, englishOrdinal, hindiOrdinal } from "./sankhyaData";
import {
  MAX_SANKHYA, cardinal, ordinal, plainRoman, toIAST, toSanskritWords,
  type NameStyle, type NineStyle, type SankhyaName,
} from "./sankhyaWords";
import "./sankhyah.css";

type Tab = "digits" | "counting" | "large" | "practice";

const TABS: { id: Tab; sa: string; en: string }[] = [
  { id: "digits", sa: "अङ्काः", en: "Digits" },
  { id: "counting", sa: "१ – १००", en: "Counting" },
  { id: "large", sa: "बृहत्संख्याः", en: "Large numbers" },
  { id: "practice", sa: "अभ्यासः", en: "Practice" },
];

const DEV = "०१२३४५६७८९";
const toDev = (s: string) => s.replace(/[0-9]/g, d => DEV[+d]);
const toLatin = (s: string) => s.replace(/[०-९]/g, d => String(DEV.indexOf(d)));
const indian = (n: number) => n.toLocaleString("en-IN");

/** every accepted spelling of a number, for checking answers */
const acceptedForms = (n: number): string[] => {
  if (n === 0) return ["शून्यम्"];
  if (n <= 100) {
    const c = cardinal(n);
    return [c.main, ...c.variants, ...Object.values(c.genders ?? {})];
  }
  const forms = new Set<string>();
  for (const style of ["adhika", "shata"] as NameStyle[]) for (const nine of ["ekona", "nava"] as NineStyle[]) {
    const name = toSanskritWords(n, { style, nine });
    forms.add(name.joined); forms.add(name.readable.replace(/-/g, ""));
  }
  return [...forms];
};
const isCorrect = (answer: string, n: number) => {
  const typed = answer.normalize("NFC").replace(/[\s\-–·]/g, "");
  if (!typed) return false;
  const forms = acceptedForms(n);
  if (/[a-zA-Zāīūṛṃḥśṣṇṭḍñṅ]/.test(typed)) return forms.some(f => plainRoman(toIAST(f)) === plainRoman(typed));
  return forms.some(f => f.replace(/-/g, "") === typed);
};

// ── shared pieces ───────────────────────────────────────────────────────────────
const Listen: React.FC<{ text: string }> = ({ text }) =>
  <button className="sk-listen" onClick={() => speak(text)} aria-label={`Listen: ${text}`}>▶ Listen</button>;

const NameCard: React.FC<{ name: SankhyaName; showParts?: boolean }> = ({ name, showParts = true }) => (
  <div className="sk-name">
    <div className="sk-name__head"><strong>{name.joined}</strong><Listen text={name.joined} /></div>
    <div className="sk-name__iast">{toIAST(name.joined)}</div>
    {showParts && name.parts.length > 1 && <>
      <div className="sk-name__parts">{[...name.parts].reverse().map((p, i, all) => <React.Fragment key={p.value}>
        <span><b>{indian(p.value)}</b>{p.stem}</span>
        {i < all.length - 1 && <i>{i === 0 ? "अधिक" : "उत्तर"}</i>}
      </React.Fragment>)}</div>
      {name.joints.length > 0 && <ul className="sk-name__joints">{name.joints.map((j, i) =>
        <li key={i}>{j.left} + {j.right} → <b>{j.result}</b><small>{j.rule}</small></li>)}</ul>}
    </>}
  </div>
);

// ── अङ्काः · Digits ─────────────────────────────────────────────────────────────
const DigitsTab: React.FC = () => (
  <section className="sk-panel">
    <h2>अङ्काः <span>Digits</span></h2>
    <p className="sk-lead">Devanāgarī has its own ten digits. They are used exactly like 0–9: the same place value, written in the same order. १९८४ is 1984.</p>
    <div className="sk-digits">{[...DEV].map((d, n) => {
      const c = n === 0 ? null : cardinal(n);
      const word = c?.main ?? "शून्यम्";
      return <button key={d} className="sk-digit" onClick={() => speak(word)}>
        <strong>{d}</strong><small className="sk-digit__latin">{n}</small>
        <span className="sk-digit__word">{word}</span><small>{toIAST(word)}</small>
      </button>;
    })}</div>
    <div className="sk-box">
      <h3>One, two, three and four change with gender</h3>
      <table className="sk-table sk-table--compact"><thead><tr><th></th><th>Masculine</th><th>Feminine</th><th>Neuter</th></tr></thead>
        <tbody>{[1, 2, 3, 4].map(n => { const g = cardinal(n).genders!; return <tr key={n}><td>{DEV[n]}</td><td>{g.masculine}</td><td>{g.feminine}</td><td>{g.neuter}</td></tr>; })}</tbody></table>
      <p>एकः बालकः · एका बालिका · एकं फलम्. From पञ्च (5) to नवदश (19) the same form is used for all genders: पञ्च बालकाः, पञ्च बालिकाः, पञ्च फलानि. The cards above show the neuter form.</p>
    </div>
  </section>
);

// ── १–१०० · Counting ────────────────────────────────────────────────────────────
const NUMBERS = Array.from({ length: 100 }, (_, i) => i + 1);

const CountingTab: React.FC = () => {
  const [query, setQuery] = useState("");
  const rows = useMemo(() => {
    const q = toLatin(query.trim().toLowerCase());
    if (!q) return NUMBERS;
    return NUMBERS.filter(n => {
      const c = cardinal(n), o = ordinal(n);
      const words = [c.main, ...c.variants, o.masculine, ...o.variants, HINDI[n], english(n), englishOrdinal(n), toIAST(c.main)].join(" ").toLowerCase();
      return String(n) === q || words.includes(q) || plainRoman(words).includes(plainRoman(q));
    });
  }, [query]);

  return <section className="sk-panel">
    <h2>१ – १०० <span>Counting</span></h2>
    <p className="sk-lead">The names from one to a hundred, with the ordinal (first, second …) beside each.</p>

    <div className="sk-rules">
      <article><h3>11 – 19</h3><p>Unit + दश: एकादश, द्वादश, त्रयोदश … Note द्वा- (12), त्रयो- (13) and षो- (16, षोडश).</p></article>
      <article><h3>The tens</h3><p>विंशतिः 20 · त्रिंशत् 30 · चत्वारिंशत् 40 · पञ्चाशत् 50 · षष्टिः 60 · सप्ततिः 70 · अशीतिः 80 · नवतिः 90 · शतम् 100</p></article>
      <article><h3>21 – 99</h3><p>Unit + ten: एकविंशतिः (21), पञ्चत्रिंशत् (35). A number ending in 9 can also be “one less than” the next ten: एकोनविंशतिः (19).</p></article>
      <article><h3>Ordinals</h3><p>प्रथमः, द्वितीयः, तृतीयः, चतुर्थः, then -मः: पञ्चमः … दशमः. 11–19 end in -दशः. From 20: -तमः (विंशतितमः), or the shorter विंशः.</p></article>
    </div>

    <label className="sk-search"><span aria-hidden>⌕</span><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search: 42, ४२, forty-two, बयालीस, dvācatvāriṃśat…" aria-label="Search numbers" /></label>

    <div className="sk-table-wrap"><table className="sk-table sk-count">
      <thead><tr><th>Number</th><th>Saṃskṛtam</th><th>Ordinal (m · f · n)</th><th>हिन्दी</th><th>English</th></tr></thead>
      <tbody>{rows.map(n => {
        const c = cardinal(n), o = ordinal(n);
        return <tr key={n}>
          <td className="sk-count__num"><strong>{toDev(String(n))}</strong><small>{n}</small></td>
          <td><button className="sk-word" onClick={() => speak(c.main)}>{c.main}</button><small className="sk-iast">{toIAST(c.main)}</small>
            {c.genders && <small className="sk-also">m. {c.genders.masculine} · f. {c.genders.feminine} · n. {c.genders.neuter}</small>}
            {c.variants.length > 0 && <small className="sk-also">also {c.variants.join(", ")}</small>}</td>
          <td>{o.masculine} · {o.feminine} · {o.neuter}{o.variants.length > 0 && <small className="sk-also">also {o.variants.join(", ")}</small>}</td>
          <td>{HINDI[n]}<small className="sk-also">{hindiOrdinal(n)}</small></td>
          <td>{english(n)}<small className="sk-also">{englishOrdinal(n)}</small></td>
        </tr>;
      })}</tbody>
    </table>{rows.length === 0 && <p className="sk-empty">No number matches “{query}”.</p>}</div>

    <p className="sk-foot">Grammar: one to four agree with the noun in gender; five to nineteen have one form for all genders; twenty to ninety-nine are feminine nouns used in the singular (विंशतिः छात्राः or छात्राणां विंशतिः); शतम् is neuter.</p>
  </section>;
};

// ── बृहत्संख्याः · Large numbers ────────────────────────────────────────────────
const EXAMPLES = [108, 365, 1984, 12345, 108000, 12345678];

const LargeTab: React.FC = () => {
  const [input, setInput] = useState("१९८४");
  const [style, setStyle] = useState<NameStyle>("adhika");
  const [nine, setNine] = useState<NineStyle>("ekona");
  const result = useMemo(() => {
    const raw = toLatin(input).replace(/[,\s]/g, "");
    if (!raw) return { error: "Enter a number." };
    if (!/^\d+$/.test(raw)) return { error: "Use the digits 0–9 or ०–९." };
    const value = Number(raw);
    if (!Number.isSafeInteger(value) || value > MAX_SANKHYA) return { error: "Enter up to fifteen digits." };
    return { value, name: toSanskritWords(value, { style, nine }) };
  }, [input, style, nine]);
  const hundredsApply = "value" in result && result.value! >= 1100 && result.value! <= 9999 && Math.floor(result.value! / 100) % 10 !== 0;

  return <section className="sk-panel">
    <h2>बृहत्संख्याः <span>Large numbers</span></h2>
    <p className="sk-lead">A number above a hundred is named as one compound word, built from its parts.</p>

    <h3 className="sk-sub">The places</h3>
    <p>Indian counting groups digits as 1,23,45,678: after the first thousand, digits go in pairs — lakhs, then crores. Each place has a name; the classical list in Bhāskara’s Līlāvatī runs:</p>
    <div className="sk-places">{PLACES.slice(2, 10).map(p => <span key={p.power}><b>{p.sa}</b><small>10{toSup(p.power)}{p.en ? ` · ${p.en}` : ""}</small></span>)}</div>
    <p className="sk-small">The list continues: खर्वम् 10¹⁰, निखर्वम् 10¹¹, महापद्मम् 10¹², शङ्कुः 10¹³, जलधिः 10¹⁴, अन्त्यम् 10¹⁵, मध्यम् 10¹⁶, परार्धम् 10¹⁷. In everyday naming, numbers are built from शतम्, सहस्रम्, लक्षम् and कोटिः.</p>

    <h3 className="sk-sub">Naming a number in four steps</h3>
    <ol className="sk-steps">
      <li><b>Split it into parts.</b> 1984 = 1000 + 900 + 84.</li>
      <li><b>Name each part.</b> सहस्र (1000), नवशत (nine hundreds), चतुरशीति (84). A count is joined to its place: पञ्च + सहस्र → पञ्चसहस्र.</li>
      <li><b>Join from the smallest.</b> The smallest part takes अधिक (“more than”), each further part उत्तर (“above”), and the largest part comes last: चतुरशीति-अधिक · नवशत-उत्तर · सहस्रम्.</li>
      <li><b>Join the sounds.</b> इ + अ → य, अ + उ → ओ: <b>चतुरशीत्यधिकनवशतोत्तरसहस्रम्</b> — “a thousand, plus nine hundred, plus eighty-four”.</li>
    </ol>
    <p className="sk-small">From 1100 to 9999 the hundreds may also be counted as a whole: 1984 = 19 hundreds + 84 → चतुरशीत्यधिकैकोनविंशतिशतम्. Both are correct.</p>

    <div className="sk-tool">
      <h3 className="sk-sub">Name any number</h3>
      <div className="sk-tool__row">
        <input className="sk-input" inputMode="numeric" value={input} onChange={e => setInput(e.target.value)} placeholder="1984 or १९८४" aria-label="Number" />
        <label>Hundreds<select value={style} onChange={e => setStyle(e.target.value as NameStyle)}><option value="adhika">with thousands (general)</option><option value="shata">counted whole (1100–9999)</option></select></label>
        <label>Numbers ending in 9<select value={nine} onChange={e => setNine(e.target.value as NineStyle)}><option value="ekona">एकोनविंशतिः type</option><option value="nava">नवदश type</option></select></label>
      </div>
      {"error" in result ? <p className="sk-error" role="alert">{result.error}</p> : <>
        <div className="sk-figure"><strong>{toDev(indian(result.value!))}</strong><span>{indian(result.value!)}</span></div>
        <NameCard name={result.name!} />
        {style === "shata" && !hundredsApply && <p className="sk-small">Counting whole hundreds applies only from 1100 to 9999 (not 2000, 3000 …); the general form is shown.</p>}
      </>}
    </div>

    <h3 className="sk-sub">Examples</h3>
    <div className="sk-examples">{EXAMPLES.map(n => <article key={n}>
      <div className="sk-examples__num"><strong>{toDev(indian(n))}</strong><span>{indian(n)}</span></div>
      <NameCard name={toSanskritWords(n)} showParts={false} />
      <p className="sk-small">In parts: {toSanskritWords(n).readable}</p>
    </article>)}</div>

    <p className="sk-foot">In a sentence the compound is a noun — neuter when it ends in शतम्, सहस्रम् or लक्षम्, feminine when it ends in कोटिः: सहस्रं जनाः or जनानां सहस्रम्.</p>
  </section>;
};
const toSup = (n: number) => String(n).replace(/\d/g, d => "⁰¹²³⁴⁵⁶⁷⁸⁹"[+d]);

// ── अभ्यासः · Practice ──────────────────────────────────────────────────────────
type Level = "digits" | "upto100" | "large";
const LEVELS: { id: Level; label: string }[] = [
  { id: "digits", label: "Digits ०–९" }, { id: "upto100", label: "१ – १००" }, { id: "large", label: "Three to five digits" },
];
const pickNumber = (level: Level) =>
  level === "digits" ? Math.floor(Math.random() * 10)
    : level === "upto100" ? 1 + Math.floor(Math.random() * 100)
      : Math.floor(100 + Math.random() * 99_900);

const PracticeTab: React.FC = () => {
  const [level, setLevel] = useState<Level>("upto100");
  const [n, setN] = useState(() => pickNumber("upto100"));
  const [answer, setAnswer] = useState("");
  const [state, setState] = useState<"ask" | "right" | "wrong" | "shown">("ask");
  const [score, setScore] = useState({ right: 0, total: 0 });
  const model = n === 0 ? "शून्यम्" : n <= 100 ? cardinal(n).main : toSanskritWords(n).joined;

  const next = (lv = level) => { setN(pickNumber(lv)); setAnswer(""); setState("ask"); };
  const check = () => {
    const ok = isCorrect(answer, n);
    setState(ok ? "right" : "wrong");
    setScore(s => ({ right: s.right + (ok ? 1 : 0), total: s.total + 1 }));
  };

  return <section className="sk-panel">
    <h2>अभ्यासः <span>Practice</span></h2>
    <p className="sk-lead">Write the number in Saṃskṛtam. Type in Devanāgarī, or in Roman letters (diacritics are optional).</p>
    <div className="sk-levels">{LEVELS.map(l => <button key={l.id} className={l.id === level ? "is-on" : ""} onClick={() => { setLevel(l.id); next(l.id); }}>{l.label}</button>)}
      <span className="sk-score">{score.right} / {score.total}</span></div>
    <div className="sk-question"><strong>{toDev(indian(n))}</strong><span>{indian(n)}</span></div>
    <input className="sk-input" value={answer} onChange={e => { setAnswer(e.target.value); if (state === "wrong") setState("ask"); }}
      onKeyDown={e => { if (e.key === "Enter") { if (state === "right" || state === "shown") next(); else if (answer.trim()) check(); } }}
      placeholder="संस्कृतेन लिखत / type here" aria-label="Your answer" autoComplete="off" />
    <div className="sk-actions">
      <button onClick={check} disabled={!answer.trim() || state === "right"}>Check</button>
      <button className="is-soft" onClick={() => setState("shown")}>Show answer</button>
      <button className="is-soft" onClick={() => next()}>Next →</button>
    </div>
    {state === "right" && <div className="sk-feedback is-right">साधु! <span>{model}</span></div>}
    {state === "wrong" && <div className="sk-feedback is-wrong">Not yet — check the spelling and try again.</div>}
    {state === "shown" && <div className="sk-feedback">{n > 100 ? <NameCard name={toSanskritWords(n)} /> : <>
      <span>{model}</span> <small>{toIAST(model)}</small>{acceptedForms(n).length > 1 && <small className="sk-also">Also accepted: {acceptedForms(n).filter(f => f !== model).join(", ")}</small>}</>}</div>}
  </section>;
};

// ── page ────────────────────────────────────────────────────────────────────────
const SankhyahPage: React.FC = () => {
  const [tab, setTab] = useState<Tab>("digits");
  return (
    <main className="sankhyah">
      <header className="sk-hero">
        <h1>संख्याः</h1>
        <p>Numbers in Saṃskṛtam — the digits, counting to a hundred, and naming numbers of any size.</p>
      </header>
      <nav className="sk-tabs" aria-label="Sections">
        {TABS.map(t => <button key={t.id} className={t.id === tab ? "is-on" : ""} onClick={() => setTab(t.id)} aria-current={t.id === tab}>
          <span>{t.sa}</span><small>{t.en}</small></button>)}
      </nav>
      {tab === "digits" && <DigitsTab />}
      {tab === "counting" && <CountingTab />}
      {tab === "large" && <LargeTab />}
      {tab === "practice" && <PracticeTab />}
    </main>
  );
};

export default SankhyahPage;
