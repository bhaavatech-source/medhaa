import React, { useMemo, useState } from "react";
import data from "./sankhyah.source-data.json";
import "./sankhyah.css";

type LanguageCode = "sa" | "hi" | "en" | "te" | "ta" | "kn" | "ml" | "bn" | "mr" | "gu";
type Entry = { value: number | string; kind: string; sanskrit?: { sourceForms?: string[]; iast?: string | null; genderForms?: { gender: string; form: string }[] | null }; translations?: Record<string, { text: string | null; status: string }>; forms?: Record<string, string>; sanskritSourceForms?: string[]; sourceNote?: string | null; reviewStatus?: string };
const LANGUAGES = data.languages as { code: LanguageCode; name: string; status: string }[];
const CARDINALS = data.cardinals as Entry[];
const ORDINALS = data.ordinals as Entry[];
const LARGER = data.largerNumbers as Entry[];
const toDev = (value: number | string) => String(value).replace(/\\d/g, d => "०१२३४५६७८९"[Number(d)]);
const titleFor = (entry: Entry) => entry.kind === "ordinal" ? `${toDev(entry.value)} · ${entry.value}${Number(entry.value) === 1 ? "st" : Number(entry.value) === 2 ? "nd" : Number(entry.value) === 3 ? "rd" : "th"}` : toDev(entry.value);

const SankhyahPage: React.FC = () => {
  const [query, setQuery] = useState("");
  const [language, setLanguage] = useState<LanguageCode>("hi");
  const [showGender, setShowGender] = useState(false);
  const entries = useMemo(() => [...CARDINALS, ...ORDINALS, ...LARGER], []);
  const filtered = entries.filter(entry => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    const sanskrit = [...(entry.sanskrit?.sourceForms ?? []), ...(entry.sanskritSourceForms ?? []), ...Object.values(entry.forms ?? {})].join(" ").toLowerCase();
    const translated = entry.translations?.[language]?.text?.toLowerCase() ?? "";
    return String(entry.value).includes(q) || toDev(entry.value).includes(q) || sanskrit.includes(q) || translated.includes(q);
  });
  const langName = LANGUAGES.find(l => l.code === language)?.name ?? language;

  return <main className="sankhyah">
    <header className="sankhyah__hero">
      <div className="sankhyah__eyebrow">MEDHĀ · AKṢARĀBHYĀSAḤ</div>
      <h2>संख्याः <span>· Saṅkhyāḥ</span></h2>
      <p>Learn numbers across languages — from १ to महाशङ्खम्.</p>
      <div className="sankhyah__controls">
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search a number or Sanskrit form…" aria-label="Search numbers" />
        <select value={language} onChange={e => setLanguage(e.target.value as LanguageCode)} aria-label="Comparison language">
          {LANGUAGES.filter(l => l.code !== "sa").map(l => <option key={l.code} value={l.code}>{l.name}</option>)}
        </select>
      </div>
      <div className="sankhyah__coverage">100 cardinal numbers · 20 ordinal forms · 22 larger-number entries · 10 language tracks</div>
    </header>
    <div className="sankhyah__notice"><strong>Source status:</strong> Sanskrit, Hindi and English entries below are transcribed from the supplied counting reference. They are not yet linguistically validated. Other language tracks are being populated only after independent verification.</div>
    <div className="sankhyah__list" aria-live="polite">
      {filtered.map((entry, index) => {
        const isOrdinal = entry.kind === "ordinal";
        const sanskritForms = entry.sanskrit?.sourceForms ?? entry.sanskritSourceForms ?? [];
        const translation = entry.translations?.[language];
        return <article className="sankhyah__card" key={entry.kind + "-" + entry.value}>
          <div className="sankhyah__number"><span>{titleFor(entry)}</span><small>{entry.kind === "cardinal" ? "संख्या · Cardinal" : isOrdinal ? "क्रमवाचक · Ordinal" : "बृहद् संख्या · Larger number"}</small></div>
          <div className="sankhyah__content">
            <div className="sankhyah__sanskrit">{isOrdinal ? <>{entry.forms?.masculine} <span>/</span> {entry.forms?.feminine} <span>/</span> {entry.forms?.neuter}</> : sanskritForms.join(" · ")}</div>
            {entry.sanskrit?.iast && <div className="sankhyah__iast">{entry.sanskrit.iast}</div>}
            <div className="sankhyah__translation"><b>{langName}</b>{translation?.text ? <span>{translation.text}</span> : <span className="sankhyah__pending">Translation awaiting independent verification</span>}</div>
            {!isOrdinal && entry.sanskrit?.genderForms?.length ? <button className="sankhyah__gender-toggle" onClick={() => setShowGender(v => !v)}>{showGender ? "Hide" : "Show"} gender forms</button> : null}
            {!isOrdinal && showGender && entry.sanskrit?.genderForms?.length ? <div className="sankhyah__gender">{entry.sanskrit.genderForms.map(g => <span key={g.gender}><b>{g.gender}</b>{g.form}</span>)}</div> : null}
            {entry.sourceNote && <small className="sankhyah__source-note">{entry.sourceNote}</small>}
          </div>
          <div className="sankhyah__index">{String(index + 1).padStart(3, "0")}</div>
        </article>;
      })}
      {!filtered.length && <p className="sankhyah__empty">No matching numbers found.</p>}
    </div>
    <footer className="sankhyah__foot">Source: mycoaching.in Sanskrit counting reference supplied for this project. Source spellings and variants are preserved pending review; they are not presented as a final grammatical authority.</footer>
  </main>;
};
export default SankhyahPage;
