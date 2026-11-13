# संख्याः — Numbers page

## Files

| File | What it does |
|---|---|
| `SankhyahPage.tsx` | The page. It has four tabs: Digits, Counting (1–100), Large numbers, and Practice. |
| `sankhyah.css` | The page styles. |
| `sankhyaWords.ts` | Produces all the Sanskrit forms by rule (see below). |
| `sankhyaData.ts` | Word lists that are not produced by rule: Hindi 1–100 (ordinals are derived from these), English cardinals and ordinals, and the Līlāvatī names of the places. |

`sankhyaWords.ts` provides:
- cardinals 1–100, with the gender forms of 1–4 and the accepted variants;
- ordinals 1–100 in all three genders, with the short forms;
- names for numbers up to 15 digits, joined with अधिक and उत्तर, with sandhi at each joint;
- conversion to IAST.

The page imports `speak` from `../speech`.

## Sources and rules followed

- **Numeral compounds.** द्वा-, त्रयः- and अष्टा- are required below 40 and optional from 40 on. They are never used before अशीति. (Pāṇini 6.3.47–49.)
- **Vowel sandhi at the joints.** 6.1.77, 6.1.87–88, 6.1.101.
- **Ordinals.**
  - The -तम ending (5.2.56).
  - The short forms (5.2.48 डट्, 6.4.142 ति विंशतेर्डिति).
  - षष्टि, सप्तति, अशीति and नवति standing alone take only -तम (5.2.58).
- **Names of the places.** Bhāskara II, *Līlāvatī*, paribhāṣā: अयुत 10⁴, लक्ष 10⁵, प्रयुत 10⁶, कोटि 10⁷, अर्बुद 10⁸, अब्ज 10⁹ … परार्ध 10¹⁷.

## Changes from the earlier folder (2026-11-13)

**Files removed:**

| File | Why |
|---|---|
| `sankhyah.source-data.json` | A transcription of a web article, with many errors. |
| `sankhyah.corrections.json` | Its correction layer; no longer needed. |
| `research/multilingual-number-research.json` | 672 KB of empty slots. |
| `research/sanskrit_numbers_1_to_100_corrected.json` | Its content is now produced by `sankhyaWords.ts`, with the errors below fixed. |
| `research/README.md`, `research/REFERENCE_AND_REVIEW_GUIDE.md` | Belonged to the removed research files. |

**Errors that were in the data and are now fixed:**

*In the web-article data (Sanskrit):*
- 28 अष्टविंशतिः → अष्टाविंशतिः
- 34 चतुर्त्रिंशत् → चतुस्त्रिंशत्
- षष्ठि written for षष्टि (59, 62, 63, 68, 69)
- 72 द्विसंप्ततिः → द्वासप्ततिः
- 82 द्वाशीतिः → द्व्यशीतिः, 83 त्रयाशीतिः → त्र्यशीतिः, 84 चतुराशीतिः → चतुरशीतिः
- ordinals mixed into the list of cardinals; the ordinal of 6 printed as षष्टः instead of षष्ठः
- 102 द्वयधिक → द्व्यधिक, 103 त्रयधिक → त्र्यधिक
- 10⁸ दसकोटिः → दशकोटिः
- the names from 10⁹ upward followed the modern Hindi scale; they are replaced by the Līlāvatī series

*In the web-article data (Hindi):*
- बाइस → बाईस, तेइस → तेईस, तेतीस → तैंतीस, बियालीस → बयालीस, चबालीस → चवालीस, तिरेपन → तिरपन, तिरेसठ → तिरसठ, पिचहत्तर → पचहत्तर, बियासी → बयासी, पिच्चासी → पचासी, पिचानवे → पंचानवे, सतानवे → सत्तानवे, दशवाँ → दसवाँ

*In the research dataset:*
- Ordinals 30–59 were written त्रिंशतत्तमः; corrected to त्रिंशत्तमः.
- Ordinals 60–69 had a visarga inside the word (षष्टिःतमः); corrected to षष्टितमः.
- The IAST for प्रथमा was given as prathamī; corrected to prathamā.
- Ordinals from 20 had no short forms; विंशः, त्रिंशः, एकषष्टः and the rest are now given.
- 19 and the other numbers ending in 9 had no एकोन- forms; these are now given.

**What was left out:** translations into languages other than Hindi and English. The earlier files had empty, unverified placeholders for them. Add a language once its word list has been checked.
