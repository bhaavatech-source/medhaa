export const DOUBLED_LETTERS = [
  { char: "क्क", roman: "kka", parts: "क् + क", example: "पक्का" },
  { char: "त्त", roman: "tta", parts: "त् + त", example: "पत्ता" },
  { char: "न्न", roman: "nna", parts: "न् + न", example: "अन्न" },
  { char: "प्प", roman: "ppa", parts: "प् + प", example: "चप्पल" },
  { char: "म्म", roman: "mma", parts: "म् + म", example: "सम्मान" },
  { char: "ल्ल", roman: "lla", parts: "ल् + ल", example: "मल्ल" },
];

export const CONJUNCT_LETTERS = [
  { char: "क्ष", roman: "kṣa", parts: "क् + ष", example: "क्षमा" },
  { char: "त्र", roman: "tra", parts: "त् + र", example: "मित्र" },
  { char: "ज्ञ", roman: "jña", parts: "ज् + ञ", example: "ज्ञान" },
  { char: "श्र", roman: "śra", parts: "श् + र", example: "श्रम" },
  { char: "स्त", roman: "sta", parts: "स् + त", example: "नमस्ते" },
  { char: "न्त", roman: "nta", parts: "न् + त", example: "अन्त" },
];

export const CONJUNCT_WRITING: Record<string, { body: string; arrows: number[] }> = {
  "क्ष": {
    body: "Start at the right-hand joining curve, move left into the upper loop, then continue around the lower bowl and finish the hook without lifting.",
    arrows: [0.08, 0.3, 0.55, 0.82],
  },
  "श्र": {
    body: "Start at the lower-left entry, move upward into the loop, continue across to the right, then finish diagonally down-left without lifting.",
    arrows: [0.03, 0.25, 0.57, 0.82],
  },
  "त्र": {
    body: "Start at the left curve, move across to the right, turn downward, then finish diagonally down-left without lifting.",
    arrows: [0.08, 0.4, 0.78],
  },
  "ज्ञ": {
    body: "Start at the right end of the inner horizontal, move left, curve down around the bowl, then finish the lower hook and tail without lifting.",
    arrows: [0.04, 0.33, 0.59, 0.85],
  },
};
