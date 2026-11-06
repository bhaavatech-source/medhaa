"""Turn traced segments into ordered strokes.

Default rules (common school order), then per-letter overrides:
  body strokes → small ticks → vertical bars (top→bottom) → शिरोरेखा (left→right)
  → signs above the शिरोरेखा.
Output strokes.json: { ch: { w, strokes: [ {pts:[[x,y]...], kind} ] } }
"""
import json, math, sys

SEG = json.load(open("segments.json"))
HL_Y = 22.3          # शिरोरेखा centre line
OV = json.load(open("overrides.json")) if len(sys.argv) < 2 else {}

dist = math.dist


def length(p):
    return sum(dist(p[i], p[i + 1]) for i in range(len(p) - 1))


def is_vertical(s):
    return abs(s[0][0] - s[-1][0]) < 3.5 and abs(s[0][1] - s[-1][1]) > 6 and all(abs(p[0] - s[0][0]) < 3.5 for p in s)


def direction(p, end):
    """unit vector leaving the chain at `end` (0 = start, 1 = end)."""
    if end == 0: a, b = p[0], p[min(3, len(p) - 1)]
    else: a, b = p[-1], p[max(-4, -len(p))]
    v = (b[0] - a[0], b[1] - a[1]); L = math.hypot(*v) or 1
    return (v[0] / L, v[1] / L)


def chain(segs):
    """Join a list of segments into one polyline, orienting each to connect."""
    segs = [list(s) for s in segs]
    out = segs.pop(0)
    while segs:
        best = None
        for i, s in enumerate(segs):
            for rev in (False, True):
                t = s[::-1] if rev else s
                for flip_out in (False, True):
                    o = out[::-1] if flip_out else out
                    d = dist(o[-1], t[0])
                    if best is None or d < best[0]: best = (d, i, rev, flip_out)
        d, i, rev, flip_out = best
        if flip_out: out = out[::-1]
        t = segs.pop(i); t = t[::-1] if rev else t
        out = out + t[1:]
    return out


def snap(p, hl):
    """extend ends that stop just under the शिरोरेखा up to it."""
    if not hl: return p
    x1, x2, _ = hl
    p = [list(q) for q in p]
    for idx in (0, -1):
        q = p[idx]
        if 25 <= q[1] <= 33 and x1 - 2 <= q[0] <= x2 + 2:
            q[1] = HL_Y
    return p


def orient(p, start):
    a, b = p[0], p[-1]
    pick = {"T": a[1] <= b[1], "B": a[1] >= b[1], "L": a[0] <= b[0], "R": a[0] >= b[0]}[start]
    return p if pick else p[::-1]


def auto(ch, v):
    segs = [s for s in v["segs"] if length(s) >= 4]
    above = [s for s in segs if max(q[1] for q in s) < 20]
    rest = [s for s in segs if s not in above]
    verts = [s for s in rest if is_vertical(s) and length(s) > 8]
    body = [s for s in rest if s not in verts]
    # group verticals into bars by x
    bars = []
    for s in sorted(verts, key=lambda s: s[0][0]):
        if bars and abs(bars[-1][0][0][0] - s[0][0]) < 4: bars[-1].append(s)
        else: bars.append([s])
    bars = [orient(chain(b), "T") for b in bars]
    # merge body segments that continue smoothly
    strokes = [list(s) for s in body]
    merged = True
    while merged and len(strokes) > 1:
        merged = False; best = None
        for i in range(len(strokes)):
            for j in range(len(strokes)):
                if i == j: continue
                for ei in (0, 1):
                    for ej in (0, 1):
                        pi, pj = strokes[i], strokes[j]
                        a = pi[-1] if ei else pi[0]; b = pj[-1] if ej else pj[0]
                        if dist(a, b) > 2.5: continue
                        di = direction(pi, 1 if ei else 0); dj = direction(pj, 1 if ej else 0)
                        # smooth if leaving directions are opposite
                        dot = di[0] * dj[0] + di[1] * dj[1]
                        if dot < -0.75 and (best is None or dot < best[0]): best = (dot, i, j, ei, ej)
        if best:
            _, i, j, ei, ej = best
            A = strokes[i] if ei else strokes[i][::-1]
            B = strokes[j] if not ej else strokes[j][::-1]
            new = A + B[1:]
            strokes = [s for k, s in enumerate(strokes) if k not in (i, j)] + [new]
            merged = True
    big = [orient(s, "T") for s in strokes if length(s) >= 10]
    small = [orient(s, "L") for s in strokes if length(s) < 10]
    big.sort(key=lambda s: (min(q[0] for q in s)))
    return big, small, bars, [orient(s, "L") for s in above]


def build(ch, v):
    hl = v.get("headline")
    ov = OV.get(ch)
    if ov:
        segs = {str(i): sg for i, sg in enumerate(v["segs"])}
        for sid, k in ov.get("split", {}).items():
            sg = v["segs"][int(sid)]
            segs[sid + "a"] = sg[: k + 1]; segs[sid + "b"] = sg[k:]
        out = []
        for spec in ov["strokes"]:
            if spec == "HL":
                out.append({"kind": "shirorekha", "pts": [[hl[0], HL_Y], [hl[1], HL_Y]]}); continue
            ids, start = spec.split(":")
            p = chain([segs[i] for i in ids.split(",")])
            p = orient(snap(p, hl), start)
            kind = "bar" if all(is_vertical(segs[i]) for i in ids.split(",")) else ("above" if max(q[1] for q in p) < 20 else "body")
            out.append({"kind": kind, "pts": p})
        if "HL" not in ov["strokes"] and hl:
            out.append({"kind": "shirorekha", "pts": [[hl[0], HL_Y], [hl[1], HL_Y]]})
    else:
        big, small, bars, above = auto(ch, v)
        out = [{"kind": "body", "pts": snap(s, hl)} for s in big + small]
        out += [{"kind": "bar", "pts": snap(s, hl)} for s in bars]
        if hl: out.append({"kind": "shirorekha", "pts": [[hl[0], HL_Y], [hl[1], HL_Y]]})
        out += [{"kind": "above", "pts": s} for s in above]
    for s in out:
        s["pts"] = [[round(x - 9, 1), round(y, 1)] for x, y in s["pts"]]   # shift so letters start near x=0
    w = round(v["x1"] - 9 + 1, 1)
    return {"w": w, "strokes": out}


if __name__ == "__main__":
    res = {ch: build(ch, v) for ch, v in SEG.items()}
    json.dump(res, open("strokes.json", "w"), ensure_ascii=False)
    for ch, r in res.items():
        print(ch, len(r["strokes"]), [s["kind"][0] for s in r["strokes"]])
