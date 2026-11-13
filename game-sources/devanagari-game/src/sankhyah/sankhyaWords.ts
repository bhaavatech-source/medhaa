// ═══════════════════════════════════════════════════════════════════════════
//  sankhyaWords.ts — write any whole number (0 … 99,99,99,99,99,999) in Saṃskṛtam
//
//  How a large number is named
//  ───────────────────────────
//  1. Split the number the Indian way:  कोटिः (10⁷) · लक्षम् (10⁵) · सहस्रम् (10³) · शतम् (10²) · 1–99.
//  2. Name each non-zero part: 900 → नवशत, 45 000 → पञ्चचत्वारिंशत्सहस्र, 84 → चतुरशीति.
//  3. Join them from the smallest upwards: the smallest part takes अधिक ("more than"),
//     every later part takes उत्तर ("over and above"), and the largest part closes the
//     compound in the nominative:
//        1984 = 84 + 900 + 1000 → चतुरशीति+अधिक · नवशत+उत्तर · सहस्रम्
//                               → चतुरशीत्यधिक-नवशतोत्तर-सहस्रम्
//  4. The joints follow sandhi: इ+अ → य (इको यणचि), अ+उ → ओ (आद्गुणः), अ+ए → ऐ (वृद्धिरेचि),
//     अ+अ → आ (अकः सवर्णे दीर्घः), त्+vowel → द् (झलां जशोऽन्ते) …  — every joint is reported.
//
//  A second, equally traditional way counts whole hundreds (only for 1 100 – 9 999):
//        1984 = 84 + 19 hundreds → चतुरशीत्यधिकैकोनविंशतिशतम्
// ═══════════════════════════════════════════════════════════════════════════

export type NineStyle = "ekona" | "nava";
export type NameStyle = "adhika" | "shata";
export type Options = { nine?: NineStyle; connector?: "adhika-uttara" | "adhika" };
export type Joint = { left: string; right: string; result: string; rule: string };
export type Part = { value: number; place: string; stem: string; final: string; note?: string };
export type SankhyaName = {
  value: number;
  style: NameStyle;
  joined: string;          // one compound, full sandhi
  readable: string;        // hyphenated at each अधिक / उत्तर, as often printed for learners
  parts: Part[];           // largest first
  joints: Joint[];
  alternatives: string[];  // other accepted forms of the 1–99 part (if any)
};

// ── 1–99: compound stem (prātipadika) and the citation form ────────────────────
// The ā/trayaḥ forms are required below 40 and optional from 40 on (द्व्यष्टनः संख्यायामबहुव्रीह्यशीत्योः 6.3.47,
// त्रेस्त्रयः 6.3.48, विभाषा चत्वारिंशत्प्रभृतौ सर्वेषाम् 6.3.49); never before अशीति.
type Row = { stem: string; nom: string; alts?: string[] };
const R = (stem: string, nom?: string, alts?: string[]): Row => ({ stem, nom: nom ?? stem, alts });

const UNITS: Row[] = [
  R(""), R("एक", "एकम्"), R("द्वि", "द्वे"), R("त्रि", "त्रीणि"), R("चतुर्", "चत्वारि"),
  R("पञ्च"), R("षष्", "षट्"), R("सप्त"), R("अष्ट", "अष्ट", ["अष्टौ"]), R("नव"),
];
const TEENS: Row[] = [
  R("दश"), R("एकादश"), R("द्वादश"), R("त्रयोदश"), R("चतुर्दश"), R("पञ्चदश"),
  R("षोडश"), R("सप्तदश"), R("अष्टादश"), R("नवदश"),
];
// 20 … 99 written out in full: these are where most printed lists go wrong
const TENS: Record<number, Row> = {
  20: R("विंशति", "विंशतिः"), 21: R("एकविंशति", "एकविंशतिः"), 22: R("द्वाविंशति", "द्वाविंशतिः"),
  23: R("त्रयोविंशति", "त्रयोविंशतिः"), 24: R("चतुर्विंशति", "चतुर्विंशतिः"), 25: R("पञ्चविंशति", "पञ्चविंशतिः"),
  26: R("षड्विंशति", "षड्विंशतिः"), 27: R("सप्तविंशति", "सप्तविंशतिः"), 28: R("अष्टाविंशति", "अष्टाविंशतिः"),
  29: R("नवविंशति", "नवविंशतिः"),
  30: R("त्रिंशत्"), 31: R("एकत्रिंशत्"), 32: R("द्वात्रिंशत्"), 33: R("त्रयस्त्रिंशत्"), 34: R("चतुस्त्रिंशत्"),
  35: R("पञ्चत्रिंशत्"), 36: R("षट्त्रिंशत्"), 37: R("सप्तत्रिंशत्"), 38: R("अष्टात्रिंशत्"), 39: R("नवत्रिंशत्"),
  40: R("चत्वारिंशत्"), 41: R("एकचत्वारिंशत्"), 42: R("द्वाचत्वारिंशत्", undefined, ["द्विचत्वारिंशत्"]),
  43: R("त्रयश्चत्वारिंशत्", undefined, ["त्रिचत्वारिंशत्"]), 44: R("चतुश्चत्वारिंशत्"), 45: R("पञ्चचत्वारिंशत्"),
  46: R("षट्चत्वारिंशत्"), 47: R("सप्तचत्वारिंशत्"), 48: R("अष्टाचत्वारिंशत्", undefined, ["अष्टचत्वारिंशत्"]),
  49: R("नवचत्वारिंशत्"),
  50: R("पञ्चाशत्"), 51: R("एकपञ्चाशत्"), 52: R("द्वापञ्चाशत्", undefined, ["द्विपञ्चाशत्"]),
  53: R("त्रयःपञ्चाशत्", undefined, ["त्रिपञ्चाशत्"]), 54: R("चतुःपञ्चाशत्"), 55: R("पञ्चपञ्चाशत्"),
  56: R("षट्पञ्चाशत्"), 57: R("सप्तपञ्चाशत्"), 58: R("अष्टापञ्चाशत्", undefined, ["अष्टपञ्चाशत्"]),
  59: R("नवपञ्चाशत्"),
  60: R("षष्टि", "षष्टिः"), 61: R("एकषष्टि", "एकषष्टिः"), 62: R("द्वाषष्टि", "द्वाषष्टिः", ["द्विषष्टिः"]),
  63: R("त्रयःषष्टि", "त्रयःषष्टिः", ["त्रिषष्टिः"]), 64: R("चतुःषष्टि", "चतुःषष्टिः"), 65: R("पञ्चषष्टि", "पञ्चषष्टिः"),
  66: R("षट्षष्टि", "षट्षष्टिः"), 67: R("सप्तषष्टि", "सप्तषष्टिः"), 68: R("अष्टाषष्टि", "अष्टाषष्टिः", ["अष्टषष्टिः"]),
  69: R("नवषष्टि", "नवषष्टिः"),
  70: R("सप्तति", "सप्ततिः"), 71: R("एकसप्तति", "एकसप्ततिः"), 72: R("द्वासप्तति", "द्वासप्ततिः", ["द्विसप्ततिः"]),
  73: R("त्रयःसप्तति", "त्रयःसप्ततिः", ["त्रिसप्ततिः"]), 74: R("चतुःसप्तति", "चतुःसप्ततिः"), 75: R("पञ्चसप्तति", "पञ्चसप्ततिः"),
  76: R("षट्सप्तति", "षट्सप्ततिः"), 77: R("सप्तसप्तति", "सप्तसप्ततिः"), 78: R("अष्टासप्तति", "अष्टासप्ततिः", ["अष्टसप्ततिः"]),
  79: R("नवसप्तति", "नवसप्ततिः"),
  80: R("अशीति", "अशीतिः"), 81: R("एकाशीति", "एकाशीतिः"), 82: R("द्व्यशीति", "द्व्यशीतिः"), 83: R("त्र्यशीति", "त्र्यशीतिः"),
  84: R("चतुरशीति", "चतुरशीतिः"), 85: R("पञ्चाशीति", "पञ्चाशीतिः"), 86: R("षडशीति", "षडशीतिः"), 87: R("सप्ताशीति", "सप्ताशीतिः"),
  88: R("अष्टाशीति", "अष्टाशीतिः"), 89: R("नवाशीति", "नवाशीतिः"),
  90: R("नवति", "नवतिः"), 91: R("एकनवति", "एकनवतिः"), 92: R("द्वानवति", "द्वानवतिः", ["द्विनवतिः"]),
  93: R("त्रयोनवति", "त्रयोनवतिः", ["त्रिनवतिः"]), 94: R("चतुर्नवति", "चतुर्नवतिः"), 95: R("पञ्चनवति", "पञ्चनवतिः"),
  96: R("षण्णवति", "षण्णवतिः"), 97: R("सप्तनवति", "सप्तनवतिः"), 98: R("अष्टानवति", "अष्टानवतिः", ["अष्टनवतिः"]),
  99: R("नवनवति", "नवनवतिः"),
};
// the "one less than the next ten" names for 19, 29 … 99 (एकोन- / ऊन-)
const EKONA: Record<number, Row> = {
  19: R("एकोनविंशति", "एकोनविंशतिः", ["ऊनविंशतिः"]), 29: R("एकोनत्रिंशत्", undefined, ["ऊनत्रिंशत्"]),
  39: R("एकोनचत्वारिंशत्", undefined, ["ऊनचत्वारिंशत्"]), 49: R("एकोनपञ्चाशत्", undefined, ["ऊनपञ्चाशत्"]),
  59: R("एकोनषष्टि", "एकोनषष्टिः", ["ऊनषष्टिः"]), 69: R("एकोनसप्तति", "एकोनसप्ततिः", ["ऊनसप्ततिः"]),
  79: R("एकोनाशीति", "एकोनाशीतिः", ["ऊनाशीतिः"]), 89: R("एकोननवति", "एकोननवतिः", ["ऊननवतिः"]),
  99: R("एकोनशत", "एकोनशतम्", ["ऊनशतम्"]),
};

/** stem + citation form (+ alternatives) for 1–99 */
export const below100 = (n: number, nine: NineStyle = "ekona"): Row => {
  if (n < 1 || n > 99 || !Number.isInteger(n)) throw new RangeError(`below100: ${n}`);
  if (n < 10) return UNITS[n];
  if (n < 20 && n !== 19) return TEENS[n - 10];
  const main = TENS[n] ?? TEENS[9];
  if (n % 10 !== 9) return main;
  const ek = EKONA[n];
  const other = n === 19 ? TEENS[9] : main;           // नवदश / नवविंशति …
  // 99: नवनवतिः is the usual form; एकोनशतम् is kept as an alternative (inside a compound
  // "एकोनशताधिकशतम्" for 199 is hard to read)
  const [pick, rest] = nine === "ekona" && n !== 99 ? [ek, other] : [other, ek];
  return { ...pick, alts: [...(pick.alts ?? []), rest.nom, ...(rest.alts ?? [])] };
};

// ── sandhi at a compound joint ───────────────────────────────────────────────────
const VIRAMA = "्";
const MATRA: Record<string, string> = { "अ": "", "आ": "ा", "इ": "ि", "ई": "ी", "उ": "ु", "ऊ": "ू", "ऋ": "ृ", "ए": "े", "ऐ": "ै", "ओ": "ो", "औ": "ौ" };
const VOWELS = Object.keys(MATRA);
const MATRA_TO_VOWEL: Record<string, string> = Object.fromEntries(Object.entries(MATRA).filter(([, m]) => m).map(([v, m]) => [m, v]));
const VOICED = new Set([..."गघजझडढदधबभयरव"]);
const NASAL = new Set([..."ङञणनम"]);

/** last vowel sound of a stem: "अ" for a bare consonant, the vowel of its mātrā, or null after a virāma */
const finalVowel = (s: string): string | null => {
  const c = s.at(-1)!;
  if (c === VIRAMA) return null;
  if (MATRA_TO_VOWEL[c]) return MATRA_TO_VOWEL[c];
  if (VOWELS.includes(c)) return c;
  return "अ";
};
const dropFinalVowel = (s: string) => (MATRA_TO_VOWEL[s.at(-1)!] ? s.slice(0, -1) : s);

/** join two compound members with sandhi; returns the joined string and the rule used */
export const join = (a: string, b: string): { out: string; rule: string } => {
  if (!a) return { out: b, rule: "" };
  const v = finalVowel(a);
  const b0 = b[0];
  const bIsVowel = VOWELS.includes(b0);
  const bRest = b.slice(1);
  if (v === null) {
    // a ends in a consonant + virāma
    const base = a.slice(0, -2), c = a.at(-2)!;
    if (c === "त") {
      if (bIsVowel) return { out: base + "द" + MATRA[b0] + bRest, rule: "त् → द् before a vowel (झलां जशोऽन्ते 8.2.39)" };
      if (NASAL.has(b0)) return { out: base + "न्" + b, rule: "त् → न् before a nasal (यरोऽनुनासिकेऽनुनासिको वा 8.4.45)" };
      if (b0 === "ल") return { out: base + "ल्" + b, rule: "त् → ल् before ल (तोर्लि 8.4.60)" };
      if (b0 === "श") return { out: base + "च्छ" + bRest, rule: "त् + श → च्छ (स्तोः श्चुना श्चुः 8.4.40, शश्छोऽटि 8.4.63)" };
      if (b0 === "च" || b0 === "छ") return { out: base + "च्" + b, rule: "त् → च् before च (स्तोः श्चुना श्चुः 8.4.40)" };
      if (VOICED.has(b0)) return { out: base + "द्" + b, rule: "त् → द् before a voiced consonant (झलां जश् झशि 8.4.53)" };
      return { out: a + b, rule: "" };
    }
    if (c === "र") {   // चतुर्
      if (bIsVowel) return { out: base + "र" + MATRA[b0] + bRest, rule: "र् joins the vowel" };
      if (b0 === "क" || b0 === "प") return { out: base + "ष्" + b, rule: "र् → ः → ष् before क/प (इदुदुपधस्य चाप्रत्ययस्य 8.3.41)" };
      if ("शषसतथचछटठ".includes(b0)) return { out: base + "ः" + b, rule: "र् → ः before a voiceless consonant (खरवसानयोर्विसर्जनीयः 8.3.15)" };
      return { out: a + b, rule: "" };
    }
    if (c === "ष") {   // षष्
      if (bIsVowel) return { out: base + "ड" + MATRA[b0] + bRest, rule: "ष् → ड् before a vowel (झलां जशोऽन्ते 8.2.39)" };
      if (NASAL.has(b0)) return { out: base + "ण्" + b, rule: "ष् → ण् before a nasal (8.4.45)" };
      if (VOICED.has(b0) || b0 === "ल") return { out: base + "ड्" + b, rule: "ष् → ड् before a voiced consonant (8.4.53)" };
      return { out: base + "ट्" + b, rule: "ष् → ट् before a voiceless consonant (खरि च 8.4.55)" };
    }
    return { out: a + b, rule: "" };
  }
  if (!bIsVowel) return { out: a + b, rule: "" };
  const stem = dropFinalVowel(a);
  if (v === "इ" || v === "ई") {
    if (b0 === "इ" || b0 === "ई") return { out: stem + "ी" + bRest, rule: "इ + इ → ई (अकः सवर्णे दीर्घः 6.1.101)" };
    return { out: stem + "्य" + MATRA[b0] + bRest, rule: "इ + vowel → य् (इको यणचि 6.1.77)" };
  }
  if (v === "अ" || v === "आ") {
    if (b0 === "अ" || b0 === "आ") return { out: stem + "ा" + bRest, rule: "अ + अ → आ (अकः सवर्णे दीर्घः 6.1.101)" };
    if (b0 === "इ" || b0 === "ई") return { out: stem + "े" + bRest, rule: "अ + इ → ए (आद्गुणः 6.1.87)" };
    if (b0 === "उ" || b0 === "ऊ") return { out: stem + "ो" + bRest, rule: "अ + उ → ओ (आद्गुणः 6.1.87)" };
    if (b0 === "ए" || b0 === "ऐ") return { out: stem + "ै" + bRest, rule: "अ + ए → ऐ (वृद्धिरेचि 6.1.88)" };
    if (b0 === "ओ" || b0 === "औ") return { out: stem + "ौ" + bRest, rule: "अ + ओ → औ (वृद्धिरेचि 6.1.88)" };
  }
  return { out: a + b, rule: "" };
};

// ── place units ───────────────────────────────────────────────────────────────
const UNIT = {
  shata: { stem: "शत", final: "शतम्", place: "शतम् · hundred (10²)" },
  sahasra: { stem: "सहस्र", final: "सहस्रम्", place: "सहस्रम् · thousand (10³)" },
  laksha: { stem: "लक्ष", final: "लक्षम्", place: "लक्षम् · lakh (10⁵)" },
  koti: { stem: "कोटि", final: "कोटिः", place: "कोटिः · crore (10⁷)" },
};

/** stem of any number 1 … 9,99,99,99,999 for use inside a compound (as a multiplier) */
const stemOf = (n: number, nine: NineStyle): string => {
  if (n < 100) return below100(n, nine).stem;
  const name = toSanskritWords(n, { nine });
  return name.joined.replace(/(म्|ः)$/, "");
};

/** k × unit, e.g. 9 × शत → नवशत; 1 × शत → शत */
const multiplied = (k: number, unit: { stem: string; final: string }, nine: NineStyle, joints: Joint[]) => {
  if (k === 1) return { stem: unit.stem, final: unit.final };
  const left = stemOf(k, nine);
  const j1 = join(left, unit.stem), j2 = join(left, unit.final);
  if (j1.rule) joints.push({ left, right: unit.stem, result: j1.out, rule: j1.rule });
  return { stem: j1.out, final: j2.out };
};

export const MAX_SANKHYA = 999_999_999_999_999;   // 9,99,99,99,99,99,999 → up to 9,99,99,999 crores

/**
 * Name a whole number in Saṃskṛtam.
 *  style "adhika" (default): smallest part + अधिक, each larger part + उत्तर, largest closes the compound.
 *  style "shata": count whole hundreds (1 100 – 9 999 with a hundreds count that is not a multiple of 10).
 */
export function toSanskritWords(value: number, opts: Options & { style?: NameStyle } = {}): SankhyaName {
  const nine = opts.nine ?? "ekona";
  const style = opts.style ?? "adhika";
  if (!Number.isSafeInteger(value) || value < 0 || value > MAX_SANKHYA) throw new RangeError(`Out of range: ${value}`);
  const joints: Joint[] = [];
  if (value === 0) return { value, style, joined: "शून्यम्", readable: "शून्यम्", parts: [], joints, alternatives: [] };

  const parts: Part[] = [];
  const rest = value % 100;
  let alternatives: string[] = [];
  if (style === "shata" && value >= 1100 && value <= 9999 && Math.floor(value / 100) % 10 !== 0) {
    const h = Math.floor(value / 100);
    const m = multiplied(h, UNIT.shata, nine, joints);
    parts.push({ value: h * 100, place: `${h} × शतम्`, ...m, note: "whole hundreds counted" });
  } else {
    const crore = Math.floor(value / 1e7), lakh = Math.floor(value / 1e5) % 100, thou = Math.floor(value / 1e3) % 100, hund = Math.floor(value / 100) % 10;
    if (crore) parts.push({ value: crore * 1e7, place: UNIT.koti.place, ...multiplied(crore, UNIT.koti, nine, joints) });
    if (lakh) parts.push({ value: lakh * 1e5, place: UNIT.laksha.place, ...multiplied(lakh, UNIT.laksha, nine, joints) });
    if (thou) parts.push({ value: thou * 1e3, place: UNIT.sahasra.place, ...multiplied(thou, UNIT.sahasra, nine, joints) });
    if (hund) parts.push({ value: hund * 100, place: UNIT.shata.place, ...multiplied(hund, UNIT.shata, nine, joints) });
  }
  if (rest) {
    const r = below100(rest, nine);
    parts.push({ value: rest, place: "1–99", stem: r.stem, final: r.nom });
    // alone, every listed form is valid; inside a compound only stem forms are (अष्टौ is not)
    alternatives = parts.length === 1 ? r.alts ?? [] : (r.alts ?? []).filter(a => a !== "अष्टौ").map(a => a.replace(/(ः|म्)$/, ""));
  }

  if (parts.length === 1) {
    const p = parts[0];
    return { value, style, joined: p.final, readable: p.final, parts, joints, alternatives };
  }

  // smallest + अधिक, then each next part + उत्तर, the largest in the nominative
  const order = [...parts].reverse();              // smallest first
  let joined = "", readable = "";
  const note = (l: string, r: string) => { const j = join(l, r); if (j.rule) joints.push({ left: l, right: r, result: j.out, rule: j.rule }); };
  order.forEach((p, i) => {
    const last = i === order.length - 1;
    const word = last ? p.final : p.stem;
    if (i > 0) {
      note(i === 1 ? "अधिक" : "उत्तर", word);
      joined = join(joined, word).out;
      readable += "-" + word;
    } else {
      joined = word; readable = word;
    }
    if (!last) {
      const conn = i === 0 || opts.connector === "adhika" ? "अधिक" : "उत्तर";
      note(word, conn);
      joined = join(joined, conn).out; readable = join(readable, conn).out;
    }
  });
  return { value, style, joined, readable, parts, joints, alternatives };
}

// ── helpers for the page ────────────────────────────────────────────────────────
const DEV = "०१२३४५६७८९";
export const devanagariDigits = (s: string) => s.replace(/[0-9]/g, d => DEV[+d]);
export const indianGrouping = (n: number) => {
  const s = String(n);
  if (s.length <= 3) return s;
  return s.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + s.slice(-3);
};

// ═══════════════════════════════════════════════════════════════════════════
//  1–100: cardinal and ordinal forms
// ═══════════════════════════════════════════════════════════════════════════
export type Gender = "masculine" | "feminine" | "neuter";
export type Cardinal = { main: string; genders?: Record<Gender, string>; variants: string[]; gender: string };
export type Ordinal = { masculine: string; feminine: string; neuter: string; variants: string[] };

const GENDERED: Record<number, Record<Gender, string>> = {
  1: { masculine: "एकः", feminine: "एका", neuter: "एकम्" },
  2: { masculine: "द्वौ", feminine: "द्वे", neuter: "द्वे" },
  3: { masculine: "त्रयः", feminine: "तिस्रः", neuter: "त्रीणि" },
  4: { masculine: "चत्वारः", feminine: "चतस्रः", neuter: "चत्वारि" },
};

/** cardinal 1–100 in the nominative, with accepted variants and a note on gender */
export const cardinal = (n: number): Cardinal => {
  if (n === 100) return { main: "शतम्", variants: ["एकशतम्"], gender: "neuter noun" };
  const r = below100(n);
  if (GENDERED[n]) return { main: GENDERED[n].neuter, genders: GENDERED[n], variants: [], gender: "agrees with the noun" };
  return {
    main: r.nom, variants: r.alts ?? [],
    gender: n <= 19 ? "same form in all genders" : "feminine noun",
  };
};

const ORD_FIRST: Record<number, [string, string]> = {
  1: ["प्रथम", "प्रथमा"], 2: ["द्वितीय", "द्वितीया"], 3: ["तृतीय", "तृतीया"], 4: ["चतुर्थ", "चतुर्थी"], 5: ["पञ्चम", "पञ्चमी"],
  6: ["षष्ठ", "षष्ठी"], 7: ["सप्तम", "सप्तमी"], 8: ["अष्टम", "अष्टमी"], 9: ["नवम", "नवमी"], 10: ["दशम", "दशमी"],
};
const decline = (stem: string, fem: string) => ({ masculine: stem + "ः", feminine: fem, neuter: stem + "म्" });
/** the short ordinal (डट्): विंशति → विंश, त्रिंशत् → त्रिंश, एकषष्टि → एकषष्ट */
const shortOrdinalStem = (stem: string) =>
  stem.endsWith("विंशति") ? stem.slice(0, -2) : stem.endsWith("त्") ? stem.slice(0, -2) : stem.endsWith("ि") ? stem.slice(0, -1) : stem;

/** ordinal 1–100 (masculine, feminine, neuter nominative) with the other accepted forms */
export const ordinal = (n: number): Ordinal => {
  if (ORD_FIRST[n]) {
    const [m, f] = ORD_FIRST[n];
    return { ...decline(m, f), variants: n === 4 ? ["तुरीयः", "तुर्यः"] : [] };
  }
  if (n === 100) return { ...decline("शततम", "शततमी"), variants: [] };
  if (n < 19) { const s = TEENS[n - 10].stem; return { ...decline(s, s + "ी"), variants: [] }; }
  const stem = below100(n).stem;
  const tama = join(stem, "तम").out;
  const round = n % 10 === 0;
  const variants: string[] = [];
  // 20–59 and the non-round numbers from 61 have a short form beside -तम (5.2.56–58);
  // षष्टि, सप्तति, अशीति, नवति alone take only -तम
  if (!(round && n >= 60)) { const s = shortOrdinalStem(stem); variants.push(s + "ः"); }
  if (n === 19) return { ...decline("एकोनविंश", "एकोनविंशी"), variants: ["एकोनविंशतितमः", "नवदशः"] };   // like 11–18
  if (n % 10 === 9 && n !== 99) variants.push(shortOrdinalStem(below100(n, "nava").stem) + "ः");
  return { ...decline(tama, tama + "ी"), variants: [...new Set(variants)] };
};

// ═══════════════════════════════════════════════════════════════════════════
//  Devanāgarī → IAST
// ═══════════════════════════════════════════════════════════════════════════
const IV: Record<string, string> = { "अ": "a", "आ": "ā", "इ": "i", "ई": "ī", "उ": "u", "ऊ": "ū", "ऋ": "ṛ", "ॠ": "ṝ", "ऌ": "ḷ", "ए": "e", "ऐ": "ai", "ओ": "o", "औ": "au" };
const MV: Record<string, string> = { "ा": "ā", "ि": "i", "ी": "ī", "ु": "u", "ू": "ū", "ृ": "ṛ", "ॄ": "ṝ", "ॢ": "ḷ", "े": "e", "ै": "ai", "ो": "o", "ौ": "au" };
const CO: Record<string, string> = {
  "क": "k", "ख": "kh", "ग": "g", "घ": "gh", "ङ": "ṅ", "च": "c", "छ": "ch", "ज": "j", "झ": "jh", "ञ": "ñ",
  "ट": "ṭ", "ठ": "ṭh", "ड": "ḍ", "ढ": "ḍh", "ण": "ṇ", "त": "t", "थ": "th", "द": "d", "ध": "dh", "न": "n",
  "प": "p", "फ": "ph", "ब": "b", "भ": "bh", "म": "m", "य": "y", "र": "r", "ल": "l", "व": "v",
  "श": "ś", "ष": "ṣ", "स": "s", "ह": "h", "ळ": "ḻ",
};
export const toIAST = (s: string): string => {
  let out = "";
  for (let i = 0; i < s.length; i++) {
    const c = s[i], next = s[i + 1];
    if (CO[c]) {
      out += CO[c];
      if (next === "्") { i++; continue; }
      if (next && MV[next]) { out += MV[next]; i++; continue; }
      out += "a";
    } else if (IV[c]) out += IV[c];
    else if (c === "ं") out += "ṃ";
    else if (c === "ः") out += "ḥ";
    else if (c === "ँ") out += "m̐";
    else if (c === "ऽ") out += "'";
    else out += c;
  }
  return out;
};
/** IAST without diacritics, for checking answers typed on an ordinary keyboard */
export const plainRoman = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z]/g, "");
