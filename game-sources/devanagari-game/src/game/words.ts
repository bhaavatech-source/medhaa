// ═══════════════════════════════════════════════════════════════
//  game/words.ts — word bank for the journey
//  WORDS (existing, mixed Hindi/Sanskrit) + Sanskrit nominatives.
//  Every word is graded automatically by difficulty().
// ═══════════════════════════════════════════════════════════════
import { WORDS } from "../devanagariData";
import { difficulty, parseAksharas } from "../varnaVibhaga";

export type BankWord = { word: string; meaning: string; lang: "sa" | "hi" | "both"; d: number; aksharas: number };

const SANSKRIT: [string, string][] = [
  ["रामः", "Rāma"], ["बालकः", "boy"], ["बालिका", "girl"], ["फलम्", "fruit"], ["जलम्", "water"],
  ["गृहम्", "house"], ["वनम्", "forest"], ["नदी", "river"], ["लता", "creeper"], ["माला", "garland"],
  ["गुरुः", "teacher"], ["शिष्यः", "student"], ["सूर्यः", "sun"], ["चन्द्रः", "moon"], ["आकाशः", "sky"],
  ["पृथ्वी", "earth"], ["अग्निः", "fire"], ["वायुः", "wind"], ["वृक्षः", "tree"], ["पुष्पम्", "flower"],
  ["मित्रम्", "friend"], ["धर्मः", "dharma"], ["ज्ञानम्", "knowledge"], ["सत्यम्", "truth"], ["क्षमा", "forgiveness"],
  ["श्रद्धा", "faith"], ["संस्कृतम्", "Sanskrit"], ["प्रकाशः", "light"], ["छात्रः", "pupil"], ["पत्रम्", "leaf / letter"],
  ["नेत्रम्", "eye"], ["हस्तः", "hand"], ["पादः", "foot"], ["मुखम्", "face"], ["कृष्णः", "Kṛṣṇa"],
  ["लक्ष्मीः", "Lakṣmī"], ["सरस्वती", "Sarasvatī"], ["ईश्वरः", "the Lord"], ["ऋषिः", "sage"], ["उद्यानम्", "garden"],
  ["अश्वः", "horse"], ["गजः", "elephant"], ["सिंहः", "lion"], ["व्याघ्रः", "tiger"], ["मत्स्यः", "fish"],
  ["पुस्तकम्", "book"], ["विद्यालयः", "school"], ["कमलम्", "lotus"], ["दीपः", "lamp"], ["मयूरः", "peacock"],
  ["शुकः", "parrot"], ["मेघः", "cloud"], ["समुद्रः", "ocean"], ["पर्वतः", "mountain"], ["क्षेत्रम्", "field"],
  ["आत्मा", "self"], ["विद्या", "learning"], ["शान्तिः", "peace"], ["स्वास्थ्यम्", "health"], ["श्लोकः", "verse"],
];

const HINDI_ONLY = new Set(["माँ", "पानी", "चाँद", "पहाड़", "गाय", "बच्चा", "किताब", "दूध", "रोटी", "स्कूल", "धन्यवाद", "घर", "सूरज"]);

const grade = (word: string, meaning: string, lang: BankWord["lang"]): BankWord => ({
  word, meaning, lang, d: difficulty(word), aksharas: parseAksharas(word).length,
});

export const BANK: BankWord[] = (() => {
  const seen = new Set<string>();
  const out: BankWord[] = [];
  for (const [w, m] of SANSKRIT) { seen.add(w); out.push(grade(w, m, "sa")); }
  for (const w of WORDS) {
    if (seen.has(w.word)) continue;
    seen.add(w.word);
    out.push(grade(w.word, w.meaning, HINDI_ONLY.has(w.word) ? "hi" : "both"));
  }
  return out;
})();

export const EASY   = BANK.filter(w => w.d <= 2 && w.aksharas <= 4);
export const MEDIUM = BANK.filter(w => w.d >= 3 && w.d <= 5);
export const HARD   = BANK.filter(w => w.d >= 5);
export const SANSKRIT_WITH_ENDINGS = BANK.filter(w => w.lang === "sa" && /[ः्]$/.test(w.word));
