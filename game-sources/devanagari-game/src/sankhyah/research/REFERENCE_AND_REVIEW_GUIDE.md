# Reference and review guide

## Evidence hierarchy
1. Authoritative dictionaries and grammars published by recognized academic presses, universities, national language bodies or established lexicographic institutions.
2. University teaching materials and peer-reviewed linguistic publications.
3. Unicode CLDR for locale-sensitive number formatting and spellout rules where supplied.
4. Community or general reference pages only as discovery aids, never as the sole authority for a disputed or grammatical form.

## What must be cited
Every individual cardinal form, ordinal form, gender form, spelling variant, transliteration and native numeral system claim needs a source reference. If one source supports a paradigm rather than every item individually, record the exact section/page and explain the rule used to derive each form. Mark derived forms as `rule-derived`, not directly attested.

## Distinguish the data types
- `nativeNumeral`: glyph(s) used to write the numeric value in a locale/script.
- `text`: lexical number word in the language's normal orthography.
- `transliteration`: a representation in another script, never a substitute for native orthography.
- `grammaticalForms`: gender, case, number, classifier, register or other distinctions required by the language.
- `cardinal`: quantity (how many).
- `ordinal`: order/rank (which one in sequence).

## Important language-specific cautions
- Arabic: distinguish forms by grammatical gender and syntactic context; one citation for a bare dictionary form may not support all contexts.
- Chinese: distinguish cardinal number words from financial/uppercase numerals and from ordinal constructions (often involving 第); record simplified-script convention.
- Japanese: record Sino-Japanese and native/Japanese counting readings where relevant, plus counters; do not pretend one reading covers all counting contexts.
- French: preserve orthographic and grammatical behavior in compound numbers and ordinal forms.
- Indian languages: verify colloquial vs formal forms, compound spacing, dialect/variant spellings and ordinal derivation separately.
- Tamil: distinguish modern decimal digits from traditional Tamil numeral signs; do not assume the modern zero-to-nine decimal set is historically identical to all traditional numeral notation.

## Technical baseline references (discovery and notation, not lexical proof by themselves)
- Unicode CLDR, LDML Part 3: Numbers: https://unicode.org/reports/tr35/tr35-numbers.html
- Unicode CLDR Numbers verification charts: https://www.unicode.org/cldr/charts/47/verify/numbers/index.html
- Unicode Standard 16.0, Chapter 22: Numerals: https://www.unicode.org/versions/Unicode16.0.0/core-spec/chapter-22/
- Microsoft Learn, Numeric notation: https://learn.microsoft.com/en-us/globalization/locale/numeric-notation
- Unicode Technical Note 10, Introduction to Indic scripts: https://www.unicode.org/notes/tn10/indic-overview-2.pdf

## Current limitations
The technical references above establish numbering-system and data-model behavior; they do not constitute word-by-word dictionary evidence for all 14 languages. Lexical source research and expert review remain required.
