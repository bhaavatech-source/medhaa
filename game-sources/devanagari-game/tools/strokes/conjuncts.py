"""Rebuild/check joined-letter geometry against an independently shaped font.

Requires a local Devanagari font and Pillow with RAQM; no font is redistributed.
Run from any directory: python conjuncts.py --font C:\\Windows\\Fonts\\Nirmala.ttc
Add --check to validate the checked-in geometry without regenerating it.
Stroke order remains a draft for a teacher to review.
"""
import argparse
import json
import os
from pathlib import Path
import subprocess
import sys
import tempfile

import numpy as np
from PIL import Image, ImageDraw, features
from scipy.ndimage import distance_transform_edt

ROOT = Path(__file__).resolve().parents[2]
OUTPUT = ROOT / "src" / "likhana" / "conjunctGeometry.ts"
LETTERS = [
    "\u0915\u094d\u0915", "\u0924\u094d\u0924", "\u0928\u094d\u0928",
    "\u092a\u094d\u092a", "\u092e\u094d\u092e", "\u0932\u094d\u0932",
    "\u0915\u094d\u0937", "\u0924\u094d\u0930", "\u091c\u094d\u091e",
    "\u0936\u094d\u0930", "\u0938\u094d\u0924", "\u0928\u094d\u0924",
]

def segments_from_skeleton(skeleton):
    pixels = {tuple(p) for p in np.argwhere(skeleton)}
    neighbors = {}
    for y, x in pixels:
        neighbors[y, x] = sorted(
            (y + dy, x + dx) for dy in (-1, 0, 1) for dx in (-1, 0, 1)
            if (dy or dx) and (y + dy, x + dx) in pixels
            and not (dy and dx and ((y + dy, x) in pixels or (y, x + dx) in pixels))
        )
    visited = set()
    paths = []
    starts = sorted(pixels, key=lambda p: (len(neighbors[p]) == 2, p))
    for start in starts:
        for nxt in neighbors[start]:
            edge = frozenset((start, nxt))
            if edge in visited:
                continue
            visited.add(edge)
            path = [start, nxt]
            while len(neighbors[nxt]) == 2:
                other = next(p for p in neighbors[nxt] if p != path[-2])
                edge = frozenset((nxt, other))
                if edge in visited:
                    break
                visited.add(edge)
                path.append(other)
                nxt = other
            if len(path) >= 3:
                paths.append(path)
    return paths

def finish_ligatures(data):
    # These ligatures have a left loop, not a full headline. The generic
    # headline detector mistakes the loop's cap for a top line.
    ksha = data["\u0915\u094d\u0937"]
    # Writing sequence observed at https://merahindi.com/meaning/hindi-consonants/ksha/47:
    # right-to-left joining curve, loop, bowl and hook in one pen movement;
    # lift for the downward stem, then lift for the left-to-right headline.
    ksha["strokes"] = [
        {"kind": "body", "pts": [[42.0,40.1],[36.2,41.1],[31.0,42.8],[25.6,43.2],
         [18.5,42.4],[17.4,40.6],[13.1,40.6],[8.9,35.2],[7.6,29.9],
         [8.5,27.1],[10.4,25.9],[13.1,22.3],[14.2,21.0],[17.8,21.1],
         [22.6,22.4],[23.1,30.6],[22.1,34.2],[18.8,37.9],[17.4,40.6],
         [13.1,40.6],[11.1,43.2],[6.2,47.4],[3.9,51.5],
         [3.0,57.2],[4.4,63.4],[7.0,66.9],[11.5,69.4],[18.0,70.0],[23.6,69.4],
         [24.5,68.6],[24.8,64.9],[27.2,60.5],[24.8,64.9],[24.5,68.6],
         [25.4,69.6],[25.6,71.5],[27.0,74.1],[29.4,77.4],[30.0,78.0],[33.1,78.0]]},
        {"kind": "bar", "pts": [[42.1,22.3],[42.0,40.1],[42.1,73.4]]},
        {"kind": "shirorekha", "pts": [[42.1,22.3],[50.6,22.3]]},
    ]
    shra = data["\u0936\u094d\u0930"]
    # shra/49: lower-left entry rises through the loop, then crosses to the
    # right and descends diagonally left. Stem and headline are separate lifts.
    shra["strokes"] = [
        {"kind": "body", "pts": [[4.1,52.5],[12.9,46.4],[14.6,43.8],
         [21.5,35.9],[22.4,31.1],[23.1,23.5],[15.2,21.5],[12.4,22.3],
         [8.2,27.4],[7.5,28.1],[7.1,30.6],[8.6,37.0],[14.6,43.8],
         [17.0,43.6],[18.6,45.2],[22.8,46.9],[29.1,48.4],[33.2,48.6],
         [35.6,51.0],[35.6,51.2],[33.2,53.6],[32.1,53.9],
         [12.6,69.1],[11.6,70.0],[11.2,71.5]]},
        {"kind": "bar", "pts": [[37.2,22.3],[37.2,49.4],[35.6,51.0],
         [37.2,52.9],[37.2,73.4]]},
        {"kind": "shirorekha", "pts": [[37.2,22.3],[45.8,22.3]]},
    ]
    # thra/48 and gna-gya/50: finish each curved body before the downward
    # right stem and final headline; skeleton junctions are not pen lifts.
    data["\u0924\u094d\u0930"]["strokes"] = [
        {"kind": "body", "pts": [[8.0,41.6],[15.9,38.8],[20.2,38.4],
         [25.6,40.0],[31.9,44.8],[36.4,45.9],[36.2,52.4],
         [31.2,53.6],[11.2,67.0]]},
        {"kind": "bar", "pts": [[36.5,22.3],[36.2,52.4],[36.5,73.2]]},
        {"kind": "shirorekha", "pts": [[0.0,22.3],[47.6,22.3]]},
    ]
    data["\u091c\u094d\u091e"]["strokes"] = [
        {"kind": "body", "pts": [[41.5,36.4],[17.8,36.4],[16.9,37.2],
         [10.6,36.2],[16.9,37.2],[18.6,41.4],[21.6,43.4],[25.2,47.2],
         [26.8,50.0],[27.5,53.4],[27.1,57.9],[26.0,60.1],[23.0,62.5],
         [18.5,63.4],[17.9,64.0],[14.8,63.6],[9.8,59.8],
         [14.8,63.6],[17.9,64.0],[19.2,68.4],[23.0,73.2],[27.4,80.4],[30.4,81.5]]},
        {"kind": "bar", "pts": [[41.6,22.3],[41.5,36.4],[41.6,73.4]]},
        {"kind": "shirorekha", "pts": [[0.0,22.3],[52.8,22.3]]},
    ]


def validate(data, trace):
    results = {}
    for ch in LETTERS:
        expected = trace.render(ch)
        actual = Image.new("1", (expected.shape[1], expected.shape[0]))
        draw = ImageDraw.Draw(actual)
        for stroke in data[ch]["strokes"]:
            points = [((x + 9) * trace.S, y * trace.S) for x, y in stroke["pts"]]
            draw.line(points, fill=1, width=1)
        actual = np.array(actual, dtype=bool)
        to_glyph = distance_transform_edt(~expected)
        to_path = distance_transform_edt(~actual)
        # A centreline must stay inside the glyph (allow 1 unit for simplification).
        precision = float(np.mean(to_glyph[actual] <= trace.S))
        # Every part of the rendered glyph must have a nearby centreline.
        coverage = float(np.mean(to_path[expected] <= 6 * trace.S))
        results[ch] = {"precision": round(precision, 4), "coverage": round(coverage, 4)}
        if precision < 0.97 or coverage < 0.95:
            raise ValueError(f"Geometry mismatch {ascii(ch)}: {results[ch]}")
    print(json.dumps(results, ensure_ascii=True, indent=2))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--font", required=True)
    parser.add_argument("--check", action="store_true")
    parser.add_argument("--sheet", help="Optional PNG comparing shaped glyphs and centreline guides")
    args = parser.parse_args()
    if not features.check_feature("raqm"):
        raise RuntimeError("RAQM shaping is required; unshaped conjuncts are invalid references.")
    os.environ["STROKE_FONT"] = args.font
    import trace

    raw_render = trace.render
    reference = raw_render("\u092a")
    reference_ys = np.where(reference)[0]
    counts = reference.sum(axis=1)
    band = np.where(counts >= counts.max() * 0.98)[0]
    center = (int(band[0]) + int(band[-1])) / 2
    scale = (76.5 - 22.3) * trace.S / (reference_ys.max() - center)

    def normalized_render(ch):
        raw = raw_render(ch)
        ys, xs = np.where(raw)
        crop = Image.fromarray(raw[ys.min():ys.max() + 1, xs.min():xs.max() + 1])
        crop = crop.resize(
            (round(crop.width * scale), round(crop.height * scale)),
            Image.Resampling.NEAREST,
        )
        normalized = Image.new("1", (200 * trace.S, 120 * trace.S))
        normalized.paste(crop, (9 * trace.S, round(22.3 * trace.S - (center - ys.min()) * scale)))
        return np.asarray(normalized.convert("L"), dtype=np.uint8) > 0

    trace.render = normalized_render
    skeletonize = trace.skeletonize
    trace.skeletonize = lambda mask: skeletonize(mask.astype(np.uint8), method="lee")
    trace.graph = segments_from_skeleton

    if args.check:
        text = OUTPUT.read_text(encoding="utf-8")
        data = json.loads(text.split("= ", 1)[1].rstrip(";\n"))
    else:
        segments = {}
        for ch in LETTERS:
            print(f"Tracing {ascii(ch)}", flush=True)
            segments[ch] = trace.process(ch)
        with tempfile.TemporaryDirectory() as work:
            Path(work, "segments.json").write_text(json.dumps(segments), encoding="utf-8")
            subprocess.run(
                [sys.executable, str(Path(__file__).with_name("build.py")), "--automatic"],
                cwd=work, check=True, stdout=subprocess.DEVNULL,
            )
            data = json.loads(Path(work, "strokes.json").read_text(encoding="utf-8"))
        finish_ligatures(data)
        if args.sheet:
            sheet = Image.new("RGB", (1200, 600), "white")
            for i, ch in enumerate(LETTERS):
                glyph = Image.fromarray(np.uint8(trace.render(ch)) * 255).convert("RGB")
                pixels = np.array(glyph)
                pixels[:] = np.where(pixels > 0, 220, 255)
                glyph = Image.fromarray(pixels)
                draw = ImageDraw.Draw(glyph)
                for stroke in data[ch]["strokes"]:
                    draw.line([((x + 9) * trace.S, y * trace.S) for x, y in stroke["pts"]],
                              fill="#1d4ed8", width=2 * trace.S)
                glyph.thumbnail((190, 250))
                sheet.paste(glyph, ((i % 6) * 200, (i // 6) * 300))
                ImageDraw.Draw(sheet).text(((i % 6) * 200, (i // 6) * 300 + 260),
                                          ascii(ch), fill="black")
            sheet.save(args.sheet)
        validate(data, trace)
        OUTPUT.write_text(
            "// Generated from RAQM-shaped Nirmala UI glyphs by tools/strokes/conjuncts.py.\n"
            "// Geometry is font-checked; stroke order is a draft for teacher review.\n"
            'import type { LetterStrokes } from "./strokeData";\n\n'
            "export const CONJUNCT_GEOMETRY: Record<string, LetterStrokes> = "
            + "{\n" + ",\n".join(
                "  " + json.dumps(ch, ensure_ascii=False) + ": "
                + json.dumps(value, ensure_ascii=False, separators=(",", ":"))
                for ch, value in data.items()
            ) + "\n};\n",
            encoding="utf-8",
        )
        return
    validate(data, trace)


if __name__ == "__main__":
    main()
