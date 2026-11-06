// ═══════════════════════════════════════════════════════════════
//  varnaVibhaga.ts — वर्णविच्छेदः engine
//  Breaks any Devanāgarī word into three levels:
//    Level 1 (वर्णाः)        स् ऊ र् य् अ ः   — every sound separately
//    Level 2 (लिखितांशाः)    स् ू र् यः        — written pieces (अ merges)
//    Level 3 (पदम्)          सूर्यः            — the joined word
//  Works for Sanskrit and Hindi, including conjuncts, reph, nukta,
//  anusvāra, visarga, candrabindu and a final halant.
// ═══════════════════════════════════════════════════════════════

export type PieceKind =
  | "vowel"       // independent vowel  अ आ इ …
  | "consonant"   // pure consonant with halant  स्
  | "full"        // consonant carrying inherent अ  य, यः
  | "matra"       // vowel sign  ू ि ा …
  | "mark"        // ं ः ँ
  | "other";      // digits, danda, avagraha, unknown

export type Piece = { text: string; kind: PieceKind; roman: string };

export type AksharaUnit = {
  written: string;        // the akshara as written, e.g. "र्यः"
  cons: string[];         // consonants in the cluster, e.g. ["र","य"]
  vowel: string | null;   // independent-vowel form, "अ" if inherent, null if halant
  marks: string;          // ं ः ँ attached to this akshara
  other?: boolean;
};

export type Breakdown = {
  input: string;
  words: WordBreakdown[];
};

export type WordBreakdown = {
  word: string;
  l1: Piece[];
  l2: Piece[];
  l3: string;
  roman: string;
  units: AksharaUnit[];
  steps: Step[];
  notes: string[];
};

export type Step = { from: string; to: string; why: string[] };

// ── Tables ─────────────────────────────────────────────────────
const VOWEL_TO_MATRA: Record<string, string> = {
  "अ": "", "आ": "ा", "इ": "ि", "ई": "ी", "उ": "ु", "ऊ": "ू",
  "ऋ": "ृ", "ॠ": "ॄ", "ऌ": "ॢ",
  "ए": "े", "ऐ": "ै", "ओ": "ो", "औ": "ौ", "ऑ": "ॉ", "ऍ": "ॅ",
};
const MATRA_TO_VOWEL: Record<string, string> = Object.fromEntries(
  Object.entries(VOWEL_TO_MATRA).filter(([, m]) => m).map(([v, m]) => [m, v])
);

const VOWEL_ROMAN: Record<string, string> = {
  "अ": "a", "आ": "ā", "इ": "i", "ई": "ī", "उ": "u", "ऊ": "ū",
  "ऋ": "ṛ", "ॠ": "ṝ", "ऌ": "ḷ",
  "ए": "e", "ऐ": "ai", "ओ": "o", "औ": "au", "ऑ": "ŏ", "ऍ": "ĕ",
};
const CONS_ROMAN: Record<string, string> = {
  "क": "k", "ख": "kh", "ग": "g", "घ": "gh", "ङ": "ṅ",
  "च": "c", "छ": "ch", "ज": "j", "झ": "jh", "ञ": "ñ",
  "ट": "ṭ", "ठ": "ṭh", "ड": "ḍ", "ढ": "ḍh", "ण": "ṇ",
  "त": "t", "थ": "th", "द": "d", "ध": "dh", "न": "n",
  "प": "p", "फ": "ph", "ब": "b", "भ": "bh", "म": "m",
  "य": "y", "र": "r", "ल": "l", "व": "v",
  "श": "ś", "ष": "ṣ", "स": "s", "ह": "h", "ळ": "ḻ",
  // Hindi nukta letters
  "क़": "q", "ख़": "x", "ग़": "ġ", "ज़": "z", "फ़": "f", "ड़": "ṛ", "ढ़": "ṛh", "य़": "ẏ",
};
const MARK_ROMAN: Record<string, string> = { "ं": "ṃ", "ः": "ḥ", "ँ": "m̐" };
const MARK_NAME: Record<string, string> = {
  "ं": "anusvāra (अनुस्वारः) — a dot above",
  "ः": "visarga (विसर्गः) — two dots after",
  "ँ": "candrabindu (चन्द्रबिन्दुः) — nasal sign above",
};
const OTHER_ROMAN: Record<string, string> = {
  "ऽ": "'", "।": "|", "॥": "||", "०": "0", "१": "1", "२": "2", "३": "3", "४": "4",
  "५": "5", "६": "6", "७": "7", "८": "8", "९": "9",
};
const SPECIAL_CONJUNCTS: Record<string, string> = {
  "क्ष": "क् + ष", "ज्ञ": "ज् + ञ", "त्र": "त् + र", "श्र": "श् + र",
};

const HALANT = "्", NUKTA = "़";
const MARKS = "ंःँ";

const isCons = (c: string) =>
  (c >= "क" && c <= "ह") || (c >= "क़" && c <= "य़") || c === "ळ";

const consRoman = (k: string) => CONS_ROMAN[k] ?? CONS_ROMAN[k.normalize("NFC")] ?? "?";

// ── Parser: text → akshara units ───────────────────────────────
export function parseAksharas(word: string): AksharaUnit[] {
  const s = [...word];
  const units: AksharaUnit[] = [];
  let i = 0;
  while (i < s.length) {
    const c = s[i];
    let cons: string[] = [];
    let vowel: string | null;
    let written = "";
    if (isCons(c)) {
      while (i < s.length && isCons(s[i])) {
        let k = s[i]; i++;
        if (s[i] === NUKTA) { k += NUKTA; i++; }
        cons.push(k);
        if (s[i] === HALANT && i + 1 < s.length && isCons(s[i + 1])) { i++; continue; }
        break;
      }
      vowel = "अ";
      if (s[i] === HALANT) { vowel = null; i++; }
      else if (s[i] && MATRA_TO_VOWEL[s[i]]) { vowel = MATRA_TO_VOWEL[s[i]]; i++; }
    } else if (VOWEL_TO_MATRA[c] !== undefined) {
      vowel = c; i++;
    } else {
      units.push({ written: c, cons: [], vowel: null, marks: "", other: true });
      i++;
      continue;
    }
    let marks = "";
    while (i < s.length && MARKS.includes(s[i])) { marks += s[i]; i++; }
    written = buildWritten(cons, vowel, marks);
    units.push({ written, cons, vowel, marks });
  }
  return units;
}

function buildWritten(cons: string[], vowel: string | null, marks: string) {
  if (!cons.length) return (vowel ?? "") + marks;
  const cluster = cons.join(HALANT);
  if (vowel === null) return cluster + HALANT + marks;
  return cluster + (VOWEL_TO_MATRA[vowel] ?? "") + marks;
}

// ── Levels ─────────────────────────────────────────────────────
function level1(units: AksharaUnit[]): Piece[] {
  const out: Piece[] = [];
  for (const u of units) {
    if (u.other) { out.push({ text: u.written, kind: "other", roman: OTHER_ROMAN[u.written] ?? u.written }); continue; }
    for (const k of u.cons) out.push({ text: k + HALANT, kind: "consonant", roman: consRoman(k) });
    if (u.vowel) out.push({ text: u.vowel, kind: "vowel", roman: VOWEL_ROMAN[u.vowel] ?? "" });
    for (const m of u.marks) out.push({ text: m, kind: "mark", roman: MARK_ROMAN[m] });
  }
  return out;
}

function level2(units: AksharaUnit[]): Piece[] {
  const out: Piece[] = [];
  for (const u of units) {
    if (u.other) { out.push({ text: u.written, kind: "other", roman: OTHER_ROMAN[u.written] ?? u.written }); continue; }
    const mr = [...u.marks].map(m => MARK_ROMAN[m]).join("");
    if (!u.cons.length) {
      out.push({ text: (u.vowel ?? "") + u.marks, kind: "vowel", roman: (VOWEL_ROMAN[u.vowel ?? ""] ?? "") + mr });
      continue;
    }
    u.cons.slice(0, -1).forEach(k => out.push({ text: k + HALANT, kind: "consonant", roman: consRoman(k) }));
    const last = u.cons[u.cons.length - 1];
    if (u.vowel === null) {
      out.push({ text: last + HALANT + u.marks, kind: "consonant", roman: consRoman(last) + mr });
    } else if (u.vowel === "अ") {
      out.push({ text: last + u.marks, kind: "full", roman: consRoman(last) + "a" + mr });
    } else {
      out.push({ text: last + HALANT, kind: "consonant", roman: consRoman(last) });
      out.push({ text: VOWEL_TO_MATRA[u.vowel] + u.marks, kind: "matra", roman: VOWEL_ROMAN[u.vowel] + mr });
    }
  }
  return out;
}

// ── Explanations: how each akshara is written ──────────────────
function explain(u: AksharaUnit, isFirst: boolean, prevWasVowelOnly: boolean): Step | null {
  if (u.other) {
    const why =
      u.written === "ऽ" ? ["ऽ (avagraha) marks an अ that has merged away in sandhi."] :
      u.written === "।" || u.written === "॥" ? ["Daṇḍa marks the end of a sentence (।) or verse (॥)."] :
      /[०-९]/.test(u.written) ? ["Devanāgarī numeral."] : ["Not a Devanāgarī letter — left as is."];
    return { from: u.written, to: u.written, why };
  }
  const parts: string[] = [
    ...u.cons.map(k => k + HALANT),
    ...(u.vowel ? [u.vowel] : []),
    ...[...u.marks],
  ];
  const why: string[] = [];

  if (!u.cons.length) {
    why.push(isFirst || prevWasVowelOnly
      ? `${u.vowel} is a vowel not preceded by a consonant, so it is written in its full form.`
      : `${u.vowel} comes right after a vowel, so it is written in its full form.`);
  } else {
    // conjunct
    if (u.cons.length > 1) {
      const cluster = u.cons.join(HALANT);
      const sp = Object.keys(SPECIAL_CONJUNCTS).find(k => cluster.includes(k));
      if (u.cons[0] === "र") {
        why.push(`र् before another consonant becomes a small hook on top (reph, रेफः): ${"र्" + u.cons.slice(1).join(HALANT)}.`);
      }
      if (!sp && u.cons[u.cons.length - 1] === "र" && u.cons[0] !== "र") {
        why.push(`र after a consonant becomes a small slanting stroke at the foot: ${cluster}.`);
      }
      if (sp) why.push(`${SPECIAL_CONJUNCTS[sp]} has its own special shape: ${sp}.`);
      if (!sp && !(u.cons.length === 2 && (u.cons[0] === "र" || u.cons[1] === "र"))) {
        why.push(`${u.cons.map(k => k + HALANT).join(" + ")} join together into one conjunct (संयुक्ताक्षरम्): the earlier consonants keep no vowel, so they are written as half-forms or stacked.`);
      }
    }
    const last = u.cons[u.cons.length - 1];
    if (last.includes(NUKTA)) why.push(`${last} is ${last[0]} with a nukta dot below — used in Hindi for sounds borrowed from Persian/English.`);

    if (u.vowel === null) {
      why.push(`${last}् has no vowel after it, so the halant (्) stays visible.`);
    } else if (u.vowel === "अ") {
      why.push(`${last}् + अ → ${last}: अ has no sign of its own — it is already built into every consonant letter.`);
    } else {
      const m = VOWEL_TO_MATRA[u.vowel];
      let w = `${last}् + ${u.vowel} → ${last}${m}: after a consonant, ${u.vowel} is written as its sign (मात्रा) ${m}`;
      if (m === "ि") w += " — written BEFORE the letter, though spoken after it";
      if (last === "र" && (m === "ु" || m === "ू")) w += ` — with र the sign joins at the middle: ${last}${m}`;
      why.push(w + ".");
    }
  }
  for (const m of u.marks) why.push(`${m} is ${MARK_NAME[m]}.`);
  return { from: parts.join(" + "), to: u.written, why };
}

// ── Public API ─────────────────────────────────────────────────
export function clean(text: string) {
  return text.normalize("NFC").replace(/[‌‍]/g, "").trim();
}

export function isDevanagari(text: string) {
  return /[ऀ-ॿ]/.test(text);
}

export function breakdownWord(word: string): WordBreakdown {
  const w = clean(word);
  const units = parseAksharas(w);
  const l1 = level1(units);
  const l2 = level2(units);
  const roman = l1.map(p => p.roman).join("");
  const steps: Step[] = [];
  units.forEach((u, idx) => {
    const st = explain(u, idx === 0, idx > 0 && !units[idx - 1].other && units[idx - 1].cons.length === 0);
    if (st) steps.push(st);
  });
  const notes: string[] = [];
  const last = units[units.length - 1];
  if (last && !last.other && last.cons.length && last.vowel === "अ" && !last.marks && units.length > 1) {
    notes.push(`Hindi vs Sanskrit: in Hindi the final अ is usually silent (${roman.replace(/a$/, "")}), but in Sanskrit it is pronounced (${roman}). The spelling is the same.`);
  }
  if (units.some(u => u.cons.some(k => k.includes(NUKTA)))) {
    notes.push("Nukta letters (क़ ख़ ग़ ज़ फ़ ड़ ढ़) are used in Hindi; Sanskrit does not use them.");
  }
  if (units.some(u => u.marks.includes("ं")) && units.length > 1) {
    notes.push("In Sanskrit, ं before a consonant is often written as the nasal of that consonant's group (संगीत → सङ्गीत, शांति → शान्ति). Hindi usually writes ं.");
  }
  return { word: w, l1, l2, l3: w, roman, units, steps, notes };
}

export function breakdown(text: string): Breakdown {
  const input = clean(text);
  const words = input.split(/\s+/).filter(Boolean).map(breakdownWord);
  return { input, words };
}

/** Difficulty score for ordering practice words: 0 = easiest. */
export function difficulty(word: string): number {
  const units = parseAksharas(clean(word));
  let d = 0;
  for (const u of units) {
    if (u.cons.length > 1) d += 3;
    if (u.cons[0] === "र" && u.cons.length > 1) d += 1;
    if (u.vowel && u.vowel !== "अ") d += 1;
    if (u.vowel === null) d += 1;
    d += u.marks.length;
  }
  return d;
}
