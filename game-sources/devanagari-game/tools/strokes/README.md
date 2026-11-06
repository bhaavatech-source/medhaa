# Stroke data tools

How `src/likhana/strokeData.ts` was made:

1. `python3 trace.py` — renders each letter from FreeSans, finds the शिरोरेखा, thins the rest to a
   centreline and splits it into segments → `segments.json` (view with `node sheet.js`).
2. `python3 build.py` — joins segments into strokes using `overrides.json`
   (`"ids:Start"`, Start = T/B/L/R end; `"HL"` = शिरोरेखा) → `strokes.json` (view with `node order.js`).
3. The JSON was converted into `strokeData.ts`.

Teacher corrections made in the app (समीक्षा → Export) go into `src/likhana/reviewedCorrections.ts`;
you do not need to re-run these tools for order/direction fixes.

## Joined-letter practice geometry

The 12 added doubled/conjunct guides use `src/likhana/conjunctGeometry.ts`,
not concatenated base-letter strokes or imagined ligatures. The source is
locally shaped Nirmala UI glyphs; no font binary is included.

From the repository root on Windows:

```powershell
python -m pip install -r .\game-sources\devanagari-game\tools\strokes\requirements.txt
python .\game-sources\devanagari-game\tools\strokes\conjuncts.py --font C:\Windows\Fonts\Nirmala.ttc --check
```

Omit `--check` to regenerate the TypeScript data. Add `--sheet <output.png>`
when regenerating for an overlay of glyphs and centreline paths.
RAQM shaping is required so conjuncts are rendered as ligatures, not separate
letters. A shared headline/baseline transform preserves their relative geometry.
The finite skeleton walk avoids the old tracing tool's cycle problem.
The loop caps in ksha and shra are not full headlines; their paths are explicitly
joined and only the short right-hand headline is marked as a headline.
For क्ष, the skeleton fragments are joined into three pen movements, following
the [MeraHindi writing animation](https://merahindi.com/meaning/hindi-consonants/ksha/47):
joining curve right-to-left into the loop, bowl and hook; downward right stem;
left-to-right headline. The paths remain derived from the local font, not copied
from the animation. This sequence is preserved by the generator.
The same visual review found fragment-order errors in
[श्र](https://merahindi.com/meaning/hindi-consonants/shra/49),
[त्र](https://merahindi.com/meaning/hindi-consonants/thra/48) and
[ज्ञ](https://merahindi.com/meaning/hindi-consonants/gna-gya/50).
Each now has one flowing body, a separate downward right stem, and a final
headline. श्र starts at the lower-left entry and rises into its loop before
crossing right and descending left. त्र starts at its left curve. ज्ञ starts
at the right end of the inner horizontal, not at its lower tail.
Numbering, animation, scoring, and review all use these joined paths.

### Remaining joined-form audit

All 12 guides pass the independent font-shape checks, but those checks cannot
decide handwriting order or pen lifts. The eight forms below retain their
existing draft models: no sufficiently specific handwriting-sequence reference
was verified for their particular shaped forms. A teacher must resolve the
listed junctions before their orders are treated as approved.

| Forms | Sequence points requiring teacher review |
| --- | --- |
| क्क | Half/full component order; a short central junction is numbered separately. |
| त्त | The upper joining line and downward bowl are separate; their order/direction needs confirmation. |
| न्न | The shaped form has upper and lower branches; confirm their pen lifts. |
| प्प | The body crosses both bowls before the middle stem; confirm component-by-component flow. |
| म्म | A detached short left tick is numbered separately from the stems and joining lines. |
| ल्ल | Short junction ticks and inter-component curves need explicit grouping. |
| स्त | The half-स junction and following त curve need explicit grouping and order. |
| न्त | The joining line crosses both components before a short left tick; confirm the flow. |

The original 45 base-letter models are unchanged and are still drafts, not
certified classroom handwriting sequences.

Validation compares paths with independently rendered glyph masks: at least 97%
of centreline pixels must be inside the glyph within 1 model unit, and at least
95% of glyph pixels must be within 6 units of a centreline. These geometric
checks do not certify a universal classroom stroke order; teacher review remains
necessary. The older base-letter guides are unchanged.
