// ═══════════════════════════════════════════════════════════════
//  audio/recordSets.ts — what to record, in order of importance
// ═══════════════════════════════════════════════════════════════
import { DEVANAGARI_LETTERS, HALANT_FORMS, CONJUNCTS, SENTENCES } from "../devanagariData";
import { BANK } from "../game/words";
import { SYL } from "../game/stations";
import { SANSKRIT_EXAMPLES, HINDI_EXAMPLES } from "../components/vibhagaExamples";
import { breakdownWord } from "../varnaVibhaga";

export type RecItem = { text: string; roman: string; note?: string };
export type RecSet = { id: string; sa: string; en: string; why: string; optional?: boolean; items: RecItem[] };

const roman = (t: string) => breakdownWord(t).roman;
const uniq = (xs: RecItem[]) => { const seen = new Set<string>(); return xs.filter(x => !seen.has(x.text) && seen.add(x.text)); };

export const SETS: RecSet[] = [
  { id: "svara", sa: "स्वराः", en: "Vowels", why: "Heard in every vowel station and for every vowel sign.",
    items: DEVANAGARI_LETTERS.filter(l => l.type === "vowel").map(l => ({ text: l.char, roman: l.roman })) },
  { id: "vyanjana", sa: "व्यञ्जनानि", en: "Consonants (with अ)", why: "क ख ग … — say each with its अ: ka, kha, ga.",
    items: DEVANAGARI_LETTERS.filter(l => l.type === "consonant").map(l => ({ text: l.char, roman: l.roman })) },
  { id: "shabda", sa: "शब्दाः", en: "Words", why: "Every word used in the Builder stations and the वर्णविच्छेदः examples.",
    items: uniq([
      ...BANK.map(w => ({ text: w.word, roman: roman(w.word), note: w.meaning })),
      ...[...SANSKRIT_EXAMPLES, ...HINDI_EXAMPLES].map(e => ({ text: e.word, roman: roman(e.word), note: e.meaning })),
      ...SENTENCES.map(s => ({ text: s.blank, roman: roman(s.blank), note: "sentence word" })),
    ]) },
  { id: "samyukta", sa: "संयुक्ताक्षराणि", en: "Conjuncts", why: "Say each with its अ: kṣa, tra, jña …",
    items: CONJUNCTS.map(c => ({ text: c.char, roman: c.roman, note: c.example })) },
  { id: "anka", sa: "अङ्काः", en: "Numbers", why: "Sanskrit number names for the numerals chart.",
    items: ["शून्यम्", "एकम्", "द्वे", "त्रीणि", "चत्वारि", "पञ्च", "षट्", "सप्त", "अष्ट", "नव"].map(t => ({ text: t, roman: roman(t) })) },
  { id: "hal", sa: "हलः", en: "Pure consonants (क्)", why: "Spoken when a learner taps a halant tile. Say the consonant with no vowel: k, kh, g …", optional: true,
    items: HALANT_FORMS.map(h => ({ text: h.halant, roman: h.roman })) },
  { id: "gunita", sa: "गुणिताक्षराणि", en: "Syllables", why: "का कि की … for the listening games. Large — record as time allows.", optional: true,
    items: SYL.pool.map(t => ({ text: t, roman: SYL.romanOf[t] })) },
];

export const TOTAL = SETS.reduce((a, s) => a + s.items.length, 0);
