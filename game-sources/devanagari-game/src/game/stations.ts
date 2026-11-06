// ═══════════════════════════════════════════════════════════════
//  game/stations.ts — the यात्रा (journey): every station, in order
//  बालः → अध्येता → निपुणः. Puzzles are generated fresh on each play.
// ═══════════════════════════════════════════════════════════════
import { DEVANAGARI_LETTERS, MATRAS, HALANT_FORMS, CONJUNCTS, SENTENCES, shuffle } from "../devanagariData";
import { breakdownWord } from "../varnaVibhaga";
import { EASY, MEDIUM, HARD, SANSKRIT_WITH_ENDINGS, type BankWord } from "./words";

export type Region = "BAALA" | "ADHYETA" | "NIPUNA";

export const REGIONS: Record<Region, { name: string; en: string; who: string; color: string }> = {
  BAALA:   { name: "बालः",    en: "Bāla",    who: "First steps — letters, signs, simple words", color: "#f97316" },
  ADHYETA: { name: "अध्येता", en: "Adhyetā", who: "Halant, conjuncts, spelling from sound",       color: "#8b5cf6" },
  NIPUNA:  { name: "निपुणः",  en: "Nipuṇa",  who: "Hard words, against the clock",               color: "#06b6d4" },
};

// ── Puzzle item shapes ─────────────────────────────────────────
export type BuilderItem = {
  target: string;            // what gets built (word / syllable / conjunct)
  pieces: string[];          // correct pieces in order
  meaning?: string;
  roman: string;
  sentence?: string;         // for वाक्यपूरणम्: sentence with ___
  ghost: boolean;            // show the target faintly
  showRoman: boolean;
  showMeaning: boolean;
};
export type MemoryPair = { a: string; b: string; aSub?: string; bSub?: string };
export type BubbleItem = { answer: string; roman: string };

type Base = {
  id: string; region: Region; title: string; en: string; icon: string;
  blurb: string; boss?: boolean; lives: number | null; hints: boolean;
};
export type BuilderStation = Base & {
  kind: "builder"; level: 1 | 2; rounds: number; distractors: number; timeLimit?: number;
  items: () => BuilderItem[];
};
export type MemoryStation = Base & { kind: "memory"; pairs: () => MemoryPair[] };
export type BubbleStation = Base & { kind: "bubble"; rounds: number; speed: number; pool: string[]; romanOf: Record<string, string> };
export type WriteStation = Base & { kind: "write"; rounds: number; pool: string[]; guide: "solid" | "dotted" | "none"; dictation?: boolean; pass: number };
export type Station = BuilderStation | MemoryStation | BubbleStation | WriteStation;

// ── Helpers ────────────────────────────────────────────────────
const take = <T,>(arr: T[], n: number) => shuffle(arr).slice(0, n);
const VOWELS = DEVANAGARI_LETTERS.filter(l => l.type === "vowel" && !["अं", "अः"].includes(l.char));
const CONS = DEVANAGARI_LETTERS.filter(l => l.type === "consonant");
const CONS1 = CONS.slice(0, 15), CONS2 = CONS.slice(15);
const SIGN_MATRAS = MATRAS.filter(m => !["ं", "ः", "ँ"].includes(m.symbol));
const ROMAN: Record<string, string> = Object.fromEntries(DEVANAGARI_LETTERS.map(l => [l.char, l.roman]));

const piecesOf = (word: string, level: 1 | 2) => {
  const b = breakdownWord(word);
  return { pieces: (level === 1 ? b.l1 : b.l2).map(p => p.text), roman: b.roman };
};

const wordItems = (list: BankWord[], n: number, level: 1 | 2, show: { ghost: boolean; roman: boolean; meaning: boolean }): BuilderItem[] =>
  take(list, n).map(w => ({ target: w.word, meaning: w.meaning, ...piecesOf(w.word, level), ghost: show.ghost, showRoman: show.roman, showMeaning: show.meaning }));

const syllableItems = (n: number, level: 1 | 2, show: { ghost: boolean; roman: boolean }): BuilderItem[] =>
  Array.from({ length: n }, () => {
    const c = take(CONS.filter(x => x.char !== "ळ"), 1)[0];
    const m = take(SIGN_MATRAS.filter(x => !["ॄ", "ॢ"].includes(x.symbol)), 1)[0];
    const target = c.char + m.symbol;
    return { target, ...piecesOf(target, level), ghost: show.ghost, showRoman: show.roman, showMeaning: false };
  });

const conjunctItems = (n: number, show: { ghost: boolean; roman: boolean; meaning: boolean }): BuilderItem[] =>
  take(CONJUNCTS, n).map(c => ({ target: c.char, ...piecesOf(c.char, 1), meaning: "e.g. " + c.example, ghost: show.ghost, showRoman: show.roman, showMeaning: show.meaning }));

const sentenceItems = (n: number): BuilderItem[] =>
  take(SENTENCES, n).map(s => ({
    target: s.blank, ...piecesOf(s.blank, 2), sentence: s.sentence, meaning: s.meaning,
    ghost: false, showRoman: true, showMeaning: true,
  }));

const syllablePool = (): { pool: string[]; romanOf: Record<string, string> } => {
  const pool: string[] = []; const romanOf: Record<string, string> = {};
  for (const c of CONS.slice(0, 33)) for (const m of SIGN_MATRAS.filter(x => x.symbol !== "ॄ").slice(0, 10)) {
    const s = c.char + m.symbol; pool.push(s); romanOf[s] = c.roman.slice(0, -1) + m.sound;
  }
  return { pool, romanOf };
};
export const SYL = syllablePool();

// ── The journey ────────────────────────────────────────────────
export const STATIONS: Station[] = [
  // ───────────── बालः ─────────────
  { id: "b1", region: "BAALA", kind: "memory", title: "स्वराः", en: "Vowels", icon: "🌸", lives: null, hints: false,
    blurb: "Flip cards and match each vowel with its sound.",
    pairs: () => take(VOWELS, 6).map(v => ({ a: v.char, b: v.roman })) },
  { id: "b2", region: "BAALA", kind: "bubble", title: "स्वरश्रवणम्", en: "Hear the vowel", icon: "🫧", lives: 3, hints: false,
    blurb: "Listen, then pop the bubble with that vowel before it floats away.",
    rounds: 10, speed: 1, pool: VOWELS.map(v => v.char), romanOf: ROMAN },
  { id: "bw1", region: "BAALA", kind: "write", title: "स्वरलेखनम्", en: "Write vowels", icon: "✍️", lives: 3, hints: false,
    blurb: "Watch the pen write each vowel, then trace it yourself — stroke by stroke.",
    rounds: 4, pool: ["अ", "आ", "इ", "उ", "ए", "ओ"], guide: "solid", pass: 60 },
  { id: "b3", region: "BAALA", kind: "bubble", title: "व्यञ्जनानि १", en: "Consonants क–ण", icon: "🌿", lives: 3, hints: false,
    blurb: "Pop the consonant you hear. Watch out for look-alikes such as ख / ग / घ.",
    rounds: 10, speed: 1, pool: CONS1.map(c => c.char), romanOf: ROMAN },
  { id: "b4", region: "BAALA", kind: "memory", title: "व्यञ्जनानि २", en: "Consonants त–ळ", icon: "🌊", lives: null, hints: false,
    blurb: "Match the consonants त to ळ with their sounds.",
    pairs: () => take(CONS2, 6).map(c => ({ a: c.char, b: c.roman })) },
  { id: "bw2", region: "BAALA", kind: "write", title: "व्यञ्जनलेखनम्", en: "Write consonants", icon: "🖊️", lives: 3, hints: false,
    blurb: "Trace consonants: body first, then the vertical bar, then the शिरोरेखा last.",
    rounds: 5, pool: ["क", "ग", "ज", "त", "न", "प", "म", "र", "व", "स"], guide: "solid", pass: 60 },
  { id: "b5", region: "BAALA", kind: "memory", title: "मात्राः", en: "Vowel signs", icon: "✨", lives: null, hints: false,
    blurb: "Match each vowel with the sign (मात्रा) it becomes after a consonant.",
    pairs: () => take(SIGN_MATRAS.filter(m => !["ॄ"].includes(m.symbol)), 6).map(m => ({ a: m.vowel, b: "◌" + m.symbol, bSub: m.example.split("= ")[1] })) },
  { id: "b6", region: "BAALA", kind: "builder", title: "गुणिताक्षराणि", en: "Build syllables", icon: "🧩", lives: 3, hints: true,
    blurb: "Put the consonant and the vowel sign together: क् + ◌ि → कि.",
    level: 2, rounds: 8, distractors: 2, items: () => syllableItems(8, 2, { ghost: true, roman: true }) },
  { id: "b7", region: "BAALA", kind: "builder", title: "सरलशब्दाः", en: "Simple words", icon: "📖", lives: 3, hints: true,
    blurb: "Break the word into its sounds — put each sound in order.",
    level: 1, rounds: 6, distractors: 2, items: () => wordItems(EASY, 6, 1, { ghost: true, roman: true, meaning: true }) },
  { id: "b8", region: "BAALA", kind: "builder", title: "बाल-परीक्षा", en: "Bāla challenge", icon: "👑", boss: true, lives: 3, hints: true,
    blurb: "No ghost letters now — build from the sound and meaning, against the clock.",
    level: 2, rounds: 8, distractors: 3, timeLimit: 40,
    items: () => shuffle([...syllableItems(3, 2, { ghost: false, roman: true }), ...wordItems(EASY, 5, 2, { ghost: false, roman: true, meaning: true })]) },

  // ───────────── अध्येता ─────────────
  { id: "a1", region: "ADHYETA", kind: "memory", title: "हल्-रूपाणि", en: "Halant forms", icon: "🔗", lives: null, hints: false,
    blurb: "Match each consonant with its halant (vowel-less) form: क ↔ क्.",
    pairs: () => take(HALANT_FORMS, 6).map(h => ({ a: h.base, b: h.halant, bSub: h.roman })) },
  { id: "aw1", region: "ADHYETA", kind: "write", title: "बिन्दुलेखनम्", en: "Write on dots", icon: "✒️", lives: 3, hints: false,
    blurb: "Only a dotted centre line guides you now. Keep the order and direction right.",
    rounds: 5, pool: ["ख", "घ", "च", "छ", "झ", "ठ", "ढ", "थ", "ध", "फ", "भ", "य", "ल", "श", "ष", "ह"], guide: "dotted", pass: 65 },
  { id: "a2", region: "ADHYETA", kind: "builder", title: "संयुक्ताक्षराणि", en: "Build conjuncts", icon: "⚡", lives: 3, hints: true,
    blurb: "Conjuncts are consonants with no vowel between them. Build each one from its sounds.",
    level: 1, rounds: 8, distractors: 2, items: () => conjunctItems(8, { ghost: true, roman: true, meaning: true }) },
  { id: "a3", region: "ADHYETA", kind: "memory", title: "संयुक्त-स्मृतिः", en: "Conjunct pairs", icon: "🃏", lives: null, hints: false,
    blurb: "Match the parts with the conjunct they make: क् + ष ↔ क्ष.",
    pairs: () => take(CONJUNCTS, 6).map(c => ({ a: c.components, b: c.char, bSub: c.roman })) },
  { id: "a4", region: "ADHYETA", kind: "bubble", title: "अक्षरश्रवणम्", en: "Hear the syllable", icon: "👂", lives: 3, hints: false,
    blurb: "Pop the syllable you hear — कि or की? कु or कू? Listen closely.",
    rounds: 10, speed: 1.2, pool: SYL.pool, romanOf: SYL.romanOf },
  { id: "a5", region: "ADHYETA", kind: "builder", title: "शब्दनिर्माणम्", en: "Spell from sound", icon: "🔤", lives: 3, hints: true,
    blurb: "You hear the word and see its meaning — now write it from the written pieces.",
    level: 2, rounds: 6, distractors: 3, items: () => wordItems(MEDIUM, 6, 2, { ghost: false, roman: true, meaning: true }) },
  { id: "a6", region: "ADHYETA", kind: "builder", title: "वाक्यपूरणम्", en: "Complete the sentence", icon: "💬", lives: 3, hints: true,
    blurb: "Build the missing word that completes the Hindi sentence.",
    level: 2, rounds: 6, distractors: 3, items: () => sentenceItems(6) },
  { id: "a7", region: "ADHYETA", kind: "builder", title: "अध्येतृ-परीक्षा", en: "Adhyetā challenge", icon: "👑", boss: true, lives: 3, hints: true,
    blurb: "Harder words, more look-alike pieces, and a timer.",
    level: 2, rounds: 8, distractors: 4, timeLimit: 45,
    items: () => shuffle([...wordItems(MEDIUM, 4, 2, { ghost: false, roman: true, meaning: true }), ...wordItems(HARD, 4, 2, { ghost: false, roman: true, meaning: true })]) },

  // ───────────── निपुणः ─────────────
  { id: "n1", region: "NIPUNA", kind: "builder", title: "कठिनशब्दाः", en: "Hard words by sound", icon: "🎯", lives: 3, hints: true,
    blurb: "Every sound separately — conjuncts, reph and all. Only the meaning and audio help you.",
    level: 1, rounds: 6, distractors: 4, timeLimit: 60, items: () => wordItems(HARD, 6, 1, { ghost: false, roman: false, meaning: true }) },
  { id: "nw1", region: "NIPUNA", kind: "write", title: "श्रुतलेखनम्", en: "Dictation", icon: "🎧", lives: 3, hints: false,
    blurb: "Hear the letter and write it from memory — no guide at all.",
    rounds: 6, pool: ["अ", "इ", "ऋ", "ए", "ओ", "औ", "क", "ङ", "ञ", "ण", "द", "ब", "ळ", "ज", "झ", "ऊ"], guide: "none", dictation: true, pass: 60 },
  { id: "n2", region: "NIPUNA", kind: "bubble", title: "द्रुतश्रवणम्", en: "Fast listening", icon: "🌪️", lives: 3, hints: false,
    blurb: "Faster bubbles, every consonant and sign. One wrong pop costs a life.",
    rounds: 12, speed: 1.7, pool: SYL.pool, romanOf: SYL.romanOf },
  { id: "n3", region: "NIPUNA", kind: "builder", title: "संस्कृतपदानि", en: "Sanskrit forms", icon: "🪔", lives: 3, hints: true,
    blurb: "Sanskrit words ending in visarga or halant. Mind ः and ्.",
    level: 2, rounds: 6, distractors: 4, timeLimit: 45, items: () => wordItems(SANSKRIT_WITH_ENDINGS, 6, 2, { ghost: false, roman: false, meaning: true }) },
  { id: "n4", region: "NIPUNA", kind: "builder", title: "निपुण-परीक्षा", en: "Nipuṇa challenge", icon: "👑", boss: true, lives: 2, hints: false,
    blurb: "The final test: hardest words, every sound, two lives, no hints.",
    level: 1, rounds: 8, distractors: 5, timeLimit: 50, items: () => wordItems(HARD, 8, 1, { ghost: false, roman: false, meaning: true }) },
];

// ── Look-alike pieces (for distractors) ────────────────────────
const GROUPS = [
  "कख", "गघ", "चछ", "जझ", "टठ", "डढ", "तथ", "दध", "पफ", "बभ", "तट", "थठ", "दड", "धढ", "नण", "शषस", "वब", "लळ", "ङञ", "यज", "मभ",
  "अआ", "इई", "उऊ", "एऐ", "ओऔ", "ऋॠ",
  "िी", "ुू", "ेै", "ोौ", "ृॄ",
];
const RAND_CONS = CONS.map(c => c.char);

export function variant(piece: string): string {
  const chars = [...piece];
  // try swapping a look-alike character
  const idx = shuffle(chars.map((_, i) => i)).find(i => GROUPS.some(g => g.includes(chars[i])));
  if (idx !== undefined) {
    const g = GROUPS.filter(g => g.includes(chars[idx]));
    const alt = [...take(g, 1)[0]].filter(c => c !== chars[idx]);
    if (alt.length) { chars[idx] = take(alt, 1)[0]; return chars.join(""); }
  }
  // toggle halant / visarga
  if (piece.endsWith("्")) return piece.slice(0, -1);
  if (piece.endsWith("ः")) return piece.slice(0, -1);
  return take(RAND_CONS, 1)[0] + (Math.random() < 0.5 ? "्" : "");
}

export function makeDistractors(pieces: string[], n: number): string[] {
  const out: string[] = [];
  let guard = 0;
  while (out.length < n && guard++ < 60) {
    const v = variant(take(pieces, 1)[0]);
    if (v && !pieces.includes(v) && !out.includes(v)) out.push(v);
  }
  return out;
}
