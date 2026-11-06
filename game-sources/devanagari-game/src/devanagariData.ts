// ═══════════════════════════════════════════════════════════════
//  devanagariData.ts  —  Enhanced v2
//  Changes: +26 words, +15 sentences, +13 conjuncts, shuffle util,
//           BhavaSession.end() integration point
// ═══════════════════════════════════════════════════════════════

import type {} from "./platform";

export type DevanagariLetter = {
  char: string; roman: string; type: "vowel" | "consonant" | "number";
};
export type Matra = {
  symbol: string; sound: string; vowel: string; example: string;
};
export type DevanagariWord = {
  word: string; meaning: string; roman: string;
};
export type DevanagariSentence = {
  sentence: string; blank: string; meaning: string; options: string[];
};
export type HalantForm = {
  base: string; halant: string; roman: string;
};
export type ConjunctConsonant = {
  char: string; components: string; roman: string; example: string;
};

// ── Shuffle utility (Fisher-Yates) ─────────────────────────────
export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ── BhavaSession score reporter ─────────────────────────────────
export function reportScore(correct: number, total: number, section: string): void {
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
  if (window.BhavaSession) {
    window.BhavaSession.end(pct);
  } else {
    console.warn("[Bhava] Session helper unavailable; result is local only.", section);
  }
  console.log(`[Bhava] ${section}: ${correct}/${total} = ${pct}%`);
}

// ══════════════════════════════════════════════════════════════════
//  LETTERS
// ══════════════════════════════════════════════════════════════════
export const DEVANAGARI_LETTERS: DevanagariLetter[] = [
  { char: "अ", roman: "a",   type: "vowel" },
  { char: "आ", roman: "ā",   type: "vowel" },
  { char: "इ", roman: "i",   type: "vowel" },
  { char: "ई", roman: "ī",   type: "vowel" },
  { char: "उ", roman: "u",   type: "vowel" },
  { char: "ऊ", roman: "ū",   type: "vowel" },
  { char: "ऋ", roman: "ṛ",   type: "vowel" },
  { char: "ॠ", roman: "ṝ",   type: "vowel" },
  { char: "ऌ", roman: "ḷ",   type: "vowel" },
  { char: "ए", roman: "e",   type: "vowel" },
  { char: "ऐ", roman: "ai",  type: "vowel" },
  { char: "ओ", roman: "o",   type: "vowel" },
  { char: "औ", roman: "au",  type: "vowel" },
  { char: "अं", roman: "aṃ", type: "vowel" },
  { char: "अः", roman: "aḥ", type: "vowel" },
  { char: "क", roman: "ka",   type: "consonant" },
  { char: "ख", roman: "kha",  type: "consonant" },
  { char: "ग", roman: "ga",   type: "consonant" },
  { char: "घ", roman: "gha",  type: "consonant" },
  { char: "ङ", roman: "ṅa",   type: "consonant" },
  { char: "च", roman: "ca",   type: "consonant" },
  { char: "छ", roman: "cha",  type: "consonant" },
  { char: "ज", roman: "ja",   type: "consonant" },
  { char: "झ", roman: "jha",  type: "consonant" },
  { char: "ञ", roman: "ña",   type: "consonant" },
  { char: "ट", roman: "ṭa",   type: "consonant" },
  { char: "ठ", roman: "ṭha",  type: "consonant" },
  { char: "ड", roman: "ḍa",   type: "consonant" },
  { char: "ढ", roman: "ḍha",  type: "consonant" },
  { char: "ण", roman: "ṇa",   type: "consonant" },
  { char: "त", roman: "ta",   type: "consonant" },
  { char: "थ", roman: "tha",  type: "consonant" },
  { char: "द", roman: "da",   type: "consonant" },
  { char: "ध", roman: "dha",  type: "consonant" },
  { char: "न", roman: "na",   type: "consonant" },
  { char: "प", roman: "pa",   type: "consonant" },
  { char: "फ", roman: "pha",  type: "consonant" },
  { char: "ब", roman: "ba",   type: "consonant" },
  { char: "भ", roman: "bha",  type: "consonant" },
  { char: "म", roman: "ma",   type: "consonant" },
  { char: "य", roman: "ya",   type: "consonant" },
  { char: "र", roman: "ra",   type: "consonant" },
  { char: "ल", roman: "la",   type: "consonant" },
  { char: "व", roman: "va",   type: "consonant" },
  { char: "श", roman: "śa",   type: "consonant" },
  { char: "ष", roman: "ṣa",   type: "consonant" },
  { char: "स", roman: "sa",   type: "consonant" },
  { char: "ह", roman: "ha",   type: "consonant" },
  { char: "ळ", roman: "ḻa",   type: "consonant" },
  { char: "०", roman: "0",    type: "number" },
  { char: "१", roman: "1",    type: "number" },
  { char: "२", roman: "2",    type: "number" },
  { char: "३", roman: "3",    type: "number" },
  { char: "४", roman: "4",    type: "number" },
  { char: "५", roman: "5",    type: "number" },
  { char: "६", roman: "6",    type: "number" },
  { char: "७", roman: "7",    type: "number" },
  { char: "८", roman: "8",    type: "number" },
  { char: "९", roman: "9",    type: "number" },
];

// ══════════════════════════════════════════════════════════════════
//  MATRAS  (14 → same, kept intact)
// ══════════════════════════════════════════════════════════════════
export const MATRAS: Matra[] = [
  { symbol: "ा",  sound: "ā",                vowel: "आ", example: "क + ा = का"  },
  { symbol: "ि",  sound: "i",                vowel: "इ", example: "क + ि = कि"  },
  { symbol: "ी",  sound: "ī",                vowel: "ई", example: "क + ी = की"  },
  { symbol: "ु",  sound: "u",                vowel: "उ", example: "क + ु = कु"  },
  { symbol: "ू",  sound: "ū",                vowel: "ऊ", example: "क + ू = कू"  },
  { symbol: "ृ",  sound: "ṛ",                vowel: "ऋ", example: "क + ृ = कृ"  },
  { symbol: "ॄ",  sound: "ṝ",                vowel: "ॠ", example: "क + ॄ = कॄ"  },
  { symbol: "े",  sound: "e",                vowel: "ए", example: "क + े = के"  },
  { symbol: "ै",  sound: "ai",               vowel: "ऐ", example: "क + ै = कै"  },
  { symbol: "ो",  sound: "o",                vowel: "ओ", example: "क + ो = को"  },
  { symbol: "ौ",  sound: "au",               vowel: "औ", example: "क + ौ = कौ"  },
  { symbol: "ं",  sound: "ṁ (anusvāra)",     vowel: "अं", example: "अ + ं = अं" },
  { symbol: "ः",  sound: "ḥ (visarga)",      vowel: "अः", example: "अ + ः = अः" },
  { symbol: "ँ",  sound: "ँ (chandrabindu)", vowel: "ँ",  example: "आँ, हाँ"    },
];

// ══════════════════════════════════════════════════════════════════
//  WORDS  (24 → 50)
// ══════════════════════════════════════════════════════════════════
export const WORDS: DevanagariWord[] = [
  // — original 24 —
  { word: "राम",      meaning: "Ram (name)",         roman: "rāma"       },
  { word: "मन",       meaning: "Mind",                roman: "mana"       },
  { word: "जल",       meaning: "Water",               roman: "jala"       },
  { word: "फल",       meaning: "Fruit",               roman: "phala"      },
  { word: "घर",       meaning: "Home",                roman: "ghara"      },
  { word: "माँ",      meaning: "Mother",              roman: "mā"         },
  { word: "पानी",     meaning: "Water (spoken)",      roman: "pānī"       },
  { word: "सूरज",     meaning: "Sun",                 roman: "sūraja"     },
  { word: "चाँद",     meaning: "Moon",                roman: "cānda"      },
  { word: "नदी",      meaning: "River",               roman: "nadī"       },
  { word: "पहाड़",    meaning: "Mountain",            roman: "pahāḍa"     },
  { word: "आकाश",     meaning: "Sky",                 roman: "ākāśa"      },
  { word: "अग्नि",    meaning: "Fire",                roman: "agni"       },
  { word: "वायु",     meaning: "Wind / Air",          roman: "vāyu"       },
  { word: "विद्या",   meaning: "Knowledge",           roman: "vidyā"      },
  { word: "शक्ति",    meaning: "Power / Energy",      roman: "śakti"      },
  { word: "नमस्ते",   meaning: "Greetings",           roman: "namaste"    },
  { word: "धन्यवाद",  meaning: "Thank you",           roman: "dhanyavāda" },
  { word: "गाय",      meaning: "Cow",                 roman: "gāya"       },
  { word: "बच्चा",    meaning: "Child",               roman: "baccā"      },
  { word: "किताब",    meaning: "Book",                roman: "kitāba"     },
  { word: "दूध",      meaning: "Milk",                roman: "dūdha"      },
  { word: "रोटी",     meaning: "Bread / Roti",        roman: "roṭī"       },
  { word: "स्कूल",    meaning: "School",              roman: "skūla"      },
  // — new 26 —
  { word: "पृथ्वी",   meaning: "Earth",               roman: "pṛthvī"     },
  { word: "समुद्र",   meaning: "Ocean / Sea",         roman: "samudra"    },
  { word: "वृक्ष",    meaning: "Tree",                roman: "vṛkṣa"      },
  { word: "पुस्तक",   meaning: "Book (formal)",       roman: "pustaka"    },
  { word: "विद्यालय", meaning: "School (formal)",     roman: "vidyālaya"  },
  { word: "परिवार",   meaning: "Family",              roman: "parivāra"   },
  { word: "मित्र",    meaning: "Friend",              roman: "mitra"      },
  { word: "भोजन",     meaning: "Food / Meal",         roman: "bhojana"    },
  { word: "वस्त्र",   meaning: "Cloth / Garment",     roman: "vastra"     },
  { word: "स्वास्थ्य",meaning: "Health",              roman: "svāsthya"   },
  { word: "आनंद",     meaning: "Joy / Happiness",     roman: "ānanda"     },
  { word: "शांति",    meaning: "Peace",               roman: "śānti"      },
  { word: "सत्य",     meaning: "Truth",               roman: "satya"      },
  { word: "धर्म",     meaning: "Righteousness",       roman: "dharma"     },
  { word: "कर्म",     meaning: "Action / Deed",       roman: "karma"      },
  { word: "योग",      meaning: "Yoga / Union",        roman: "yoga"       },
  { word: "ध्यान",    meaning: "Meditation",          roman: "dhyāna"     },
  { word: "प्रेम",    meaning: "Love",                roman: "prema"      },
  { word: "दर्पण",    meaning: "Mirror",              roman: "darpaṇa"    },
  { word: "संगीत",    meaning: "Music",               roman: "saṃgīta"    },
  { word: "नृत्य",    meaning: "Dance",               roman: "nṛtya"      },
  { word: "चित्र",    meaning: "Picture / Painting",  roman: "citra"      },
  { word: "भाषा",     meaning: "Language",            roman: "bhāṣā"      },
  { word: "लिपि",     meaning: "Script",              roman: "lipi"       },
  { word: "अक्षर",    meaning: "Letter / Character",  roman: "akṣara"     },
  { word: "व्याकरण",  meaning: "Grammar",             roman: "vyākaraṇa"  },
];

// ══════════════════════════════════════════════════════════════════
//  SENTENCES  (10 → 25)
// ══════════════════════════════════════════════════════════════════
export const SENTENCES: DevanagariSentence[] = [
  // — original 10 —
  { sentence: "___ अच्छा है।",           blank: "यह",       meaning: "___ is good.",              options: ["यह", "वह", "कब", "क्यों"]        },
  { sentence: "राम ___ है।",             blank: "अच्छा",    meaning: "Ram is ___.",                options: ["अच्छा", "बुरा", "नमस्ते", "पानी"] },
  { sentence: "___ पानी पीता है।",       blank: "वह",       meaning: "___ drinks water.",          options: ["वह", "क्या", "कहाँ", "कब"]        },
  { sentence: "यह ___ है।",              blank: "फल",       meaning: "This is a ___.",             options: ["फल", "जल", "घर", "नदी"]           },
  { sentence: "सूरज ___ में है।",        blank: "आकाश",     meaning: "The sun is in the ___.",     options: ["आकाश", "नदी", "घर", "फल"]         },
  { sentence: "___ स्कूल जाता है।",      blank: "बच्चा",    meaning: "___ goes to school.",        options: ["बच्चा", "किताब", "दूध", "रोटी"]   },
  { sentence: "माँ ___ बनाती है।",       blank: "रोटी",     meaning: "Mother makes ___.",          options: ["रोटी", "आकाश", "नदी", "वायु"]     },
  { sentence: "गाय ___ देती है।",        blank: "दूध",      meaning: "The cow gives ___.",         options: ["दूध", "फल", "शक्ति", "विद्या"]    },
  { sentence: "नदी ___ में बहती है।",    blank: "पहाड़",    meaning: "The river flows from ___.",  options: ["पहाड़", "घर", "किताब", "बच्चा"]   },
  { sentence: "___ से ज्ञान मिलता है।",  blank: "विद्या",   meaning: "___ gives knowledge.",       options: ["विद्या", "अग्नि", "वायु", "चाँद"]  },
  // — new 15 —
  { sentence: "यह ___ मेरा है।",         blank: "घर",       meaning: "This ___ is mine.",          options: ["घर", "नदी", "आकाश", "वायु"]       },
  { sentence: "___ नीला है।",            blank: "आकाश",     meaning: "___ is blue.",               options: ["आकाश", "दूध", "रोटी", "फल"]        },
  { sentence: "हम ___ बोलते हैं।",       blank: "हिंदी",    meaning: "We speak ___.",              options: ["हिंदी", "पानी", "धर्म", "योग"]     },
  { sentence: "वह ___ पढ़ता है।",        blank: "पुस्तक",   meaning: "He reads a ___.",            options: ["पुस्तक", "भोजन", "संगीत", "नृत्य"] },
  { sentence: "बच्चे ___ खेलते हैं।",    blank: "मैदान",    meaning: "Children play in the ___.",  options: ["मैदान", "किताब", "विद्या", "दर्पण"] },
  { sentence: "___ में तारे हैं।",       blank: "आकाश",     meaning: "There are stars in the ___.",options: ["आकाश", "नदी", "घर", "वृक्ष"]       },
  { sentence: "प्रेम से ___ मिलती है।",  blank: "शांति",    meaning: "Peace comes from love.",     options: ["शांति", "अग्नि", "पानी", "रोटी"]   },
  { sentence: "संगीत से ___ मिलता है।",  blank: "आनंद",     meaning: "Music gives ___.",           options: ["आनंद", "कर्म", "लिपि", "वस्त्र"]  },
  { sentence: "___ भारत की लिपि है।",    blank: "देवनागरी", meaning: "___ is the script of India.",options: ["देवनागरी", "संगीत", "योग", "धर्म"]  },
  { sentence: "सत्य की सदा ___।",        blank: "जय",       meaning: "Truth always ___.",          options: ["जय", "पराजय", "नदी", "वायु"]       },
  { sentence: "योग से ___ अच्छा रहता है।",blank: "स्वास्थ्य",meaning: "___ stays good with yoga.", options: ["स्वास्थ्य", "दर्पण", "चित्र", "वृक्ष"]},
  { sentence: "वृक्ष ___ देते हैं।",     blank: "छाया",     meaning: "Trees give ___.",            options: ["छाया", "भोजन", "लिपि", "कर्म"]    },
  { sentence: "___ एक कला है।",          blank: "नृत्य",    meaning: "___ is an art.",             options: ["नृत्य", "पानी", "घर", "सत्य"]      },
  { sentence: "ध्यान से ___ शांत होता है।",blank: "मन",     meaning: "The ___ calms with meditation.",options: ["मन", "नदी", "आकाश", "पर्वत"]    },
  { sentence: "भाषा ___ का माध्यम है।",  blank: "विचार",    meaning: "Language is a medium of ___.",options: ["विचार", "जल", "फल", "रोटी"]      },
];

// ══════════════════════════════════════════════════════════════════
//  HALANT FORMS  (unchanged — 35 entries)
// ══════════════════════════════════════════════════════════════════
export const HALANT_FORMS: HalantForm[] = [
  { base: "क", halant: "क्", roman: "k"  },
  { base: "ख", halant: "ख्", roman: "kh" },
  { base: "ग", halant: "ग्", roman: "g"  },
  { base: "घ", halant: "घ्", roman: "gh" },
  { base: "ङ", halant: "ङ्", roman: "ṅ"  },
  { base: "च", halant: "च्", roman: "c"  },
  { base: "छ", halant: "छ्", roman: "ch" },
  { base: "ज", halant: "ज्", roman: "j"  },
  { base: "झ", halant: "झ्", roman: "jh" },
  { base: "ञ", halant: "ञ्", roman: "ñ"  },
  { base: "ट", halant: "ट्", roman: "ṭ"  },
  { base: "ठ", halant: "ठ्", roman: "ṭh" },
  { base: "ड", halant: "ड्", roman: "ḍ"  },
  { base: "ढ", halant: "ढ्", roman: "ḍh" },
  { base: "ण", halant: "ण्", roman: "ṇ"  },
  { base: "त", halant: "त्", roman: "t"  },
  { base: "थ", halant: "थ्", roman: "th" },
  { base: "द", halant: "द्", roman: "d"  },
  { base: "ध", halant: "ध्", roman: "dh" },
  { base: "न", halant: "न्", roman: "n"  },
  { base: "प", halant: "प्", roman: "p"  },
  { base: "फ", halant: "फ्", roman: "ph" },
  { base: "ब", halant: "ब्", roman: "b"  },
  { base: "भ", halant: "भ्", roman: "bh" },
  { base: "म", halant: "म्", roman: "m"  },
  { base: "य", halant: "य्", roman: "y"  },
  { base: "र", halant: "र्", roman: "r"  },
  { base: "ल", halant: "ल्", roman: "l"  },
  { base: "व", halant: "व्", roman: "v"  },
  { base: "श", halant: "श्", roman: "ś"  },
  { base: "ष", halant: "ष्", roman: "ṣ"  },
  { base: "स", halant: "स्", roman: "s"  },
  { base: "ह", halant: "ह्", roman: "h"  },
  { base: "ळ", halant: "ळ्", roman: "ḻ"  },
];

// ══════════════════════════════════════════════════════════════════
//  CONJUNCT CONSONANTS  (12 → 25)
// ══════════════════════════════════════════════════════════════════
export const CONJUNCTS: ConjunctConsonant[] = [
  // — original 12 —
  { char: "क्ष", components: "क् + ष", roman: "kṣa",  example: "क्षमा (forgiveness)"   },
  { char: "त्र", components: "त् + र", roman: "tra",  example: "त्रिभुज (triangle)"     },
  { char: "ज्ञ", components: "ज् + ञ", roman: "jña",  example: "ज्ञान (knowledge)"      },
  { char: "श्र", components: "श् + र", roman: "śra",  example: "श्रम (labour)"          },
  { char: "द्ध", components: "द् + ध", roman: "ddha", example: "बुद्ध (Buddha)"         },
  { char: "द्व", components: "द् + व", roman: "dva",  example: "द्वार (door)"           },
  { char: "प्र", components: "प् + र", roman: "pra",  example: "प्रेम (love)"           },
  { char: "स्त", components: "स् + त", roman: "sta",  example: "स्तुति (praise)"        },
  { char: "न्त", components: "न् + त", roman: "nta",  example: "अन्त (end)"             },
  { char: "ष्ट", components: "ष् + ट", roman: "ṣṭa",  example: "स्पष्ट (clear)"        },
  { char: "क्त", components: "क् + त", roman: "kta",  example: "भक्त (devotee)"        },
  { char: "ल्ल", components: "ल् + ल", roman: "lla",  example: "मल्ल (wrestler)"        },
  // — new 13 —
  { char: "स्व", components: "स् + व", roman: "sva",  example: "स्वतंत्र (independent)" },
  { char: "स्न", components: "स् + न", roman: "sna",  example: "स्नान (bath)"           },
  { char: "स्म", components: "स् + म", roman: "sma",  example: "स्मृति (memory)"        },
  { char: "स्र", components: "स् + र", roman: "sra",  example: "स्रोत (source)"         },
  { char: "स्प", components: "स् + प", roman: "spa",  example: "स्पर्श (touch)"         },
  { char: "न्न", components: "न् + न", roman: "nna",  example: "अन्न (grain/food)"      },
  { char: "ग्र", components: "ग् + र", roman: "gra",  example: "ग्राम (village)"        },
  { char: "ग्ध", components: "ग् + ध", roman: "gdha", example: "दग्ध (burnt)"           },
  { char: "त्त", components: "त् + त", roman: "tta",  example: "उत्तर (north/answer)"   },
  { char: "त्व", components: "त् + व", roman: "tva",  example: "सत्व (essence/being)"   },
  { char: "त्म", components: "त् + म", roman: "tma",  example: "आत्मा (soul)"           },
  { char: "ह्र", components: "ह् + र", roman: "hra",  example: "ह्रदय (heart)"          },
  { char: "व्र", components: "व् + र", roman: "vra",  example: "व्रत (vow/fast)"        },
];
