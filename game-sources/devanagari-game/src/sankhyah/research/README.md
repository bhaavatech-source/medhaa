# Medhā Multilingual Number Knowledge Base

## What this package contains
- `sanskrit_numbers_1_to_100_corrected.json`: the supplied Sanskrit dataset, copied unchanged.
- `multilingual-number-research.json`: research structure for 1–100 cardinal and ordinal forms in 14 languages (Sanskrit + 13 additional languages).
- `REFERENCE_AND_REVIEW_GUIDE.md`: evidence and publication rules.

## Important status
This is a research-ready knowledge base scaffold, not a completed translation dataset.
No unverified translations have been invented. The 13 non-Sanskrit languages have explicit empty research slots for every number and both number types. Sanskrit rows point to the preserved source dataset and are not automatically marked linguistically approved.

## Required evidence for each form
Each form must have one or more `sourceRefs` that resolve to an entry in `referenceRegistry`. Add exact bibliographic details, edition/version, page or dictionary headword, URL, access date, and a short note explaining which form the source supports. A general homepage is insufficient.

## Suggested research sequence
1. English and Hindi.
2. Telugu, Tamil, Kannada, Malayalam, Bengali, Marathi and Gujarati.
3. Arabic, Simplified Chinese, Japanese and French.
4. Cross-check every 1–100 cardinal and ordinal form, including irregular forms and contextual variants.
5. Native-speaker and subject-specialist review before status `approved`.

## Status values
- `not-yet-researched`: no lexical claim has been entered.
- `researched-unverified`: candidate form entered with source; not approved.
- `cross-checked`: corroborated by an independent source.
- `native-speaker-reviewed`: checked by a competent native speaker/reviewer.
- `approved`: approved for display as verified.

Do not show a translation as verified unless its entry is `approved`.
