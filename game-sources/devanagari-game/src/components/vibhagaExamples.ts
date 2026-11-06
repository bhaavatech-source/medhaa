// Example words shown on the वर्णविच्छेदः screen (also used by the audio recorder)
export type Example = { word: string; meaning: string; tag?: string };

export const SANSKRIT_EXAMPLES: Example[] = [
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

export const HINDI_EXAMPLES: Example[] = [
  { word: "पानी",     meaning: "water",   tag: "simple" },
  { word: "किताब",    meaning: "book",    tag: "final अ" },
  { word: "हँसना",    meaning: "to laugh", tag: "candrabindu" },
  { word: "पहाड़",    meaning: "mountain", tag: "nukta" },
  { word: "ज़मीन",    meaning: "land",    tag: "nukta" },
  { word: "स्कूल",    meaning: "school",  tag: "conjunct" },
  { word: "धन्यवाद",  meaning: "thank you", tag: "conjunct" },
];
