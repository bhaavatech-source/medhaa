"""Trace Devanagari letters from a font into centreline segments.

Output (segments.json): for each letter
  { w, headline: [x1, x2] | [], segs: [[ [x,y], ... ], ...] }
in units where 100 = font size, headline y ~ 20, baseline y ~ 80.
"""
import json, os, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFont
from skimage.morphology import skeletonize
from collections import defaultdict

S = 8                      # pixels per unit
FONT = ImageFont.truetype(os.environ.get("STROKE_FONT", "/usr/share/fonts/truetype/freefont/FreeSans.ttf"), 100 * S)
LETTERS = list("अआइईउऊऋएऐओऔकखगघङचछजझञटठडढणतथदधनपफबभमयरलवशषसहळ")


def render(ch):
    W, H = 160 * S, 120 * S
    im = Image.new("L", (W, H), 0)
    d = ImageDraw.Draw(im)
    d.text((10 * S, 80 * S), ch, font=FONT, fill=255, anchor="ls")
    return np.array(im) > 128


def headline(mask):
    """Find the शिरोरेखा band: the topmost long horizontal run in rows 10..35."""
    H, W = mask.shape
    rows = []
    for y in range(17 * S, 30 * S):
        r = mask[y]
        if r.sum() > 18 * S:
            # longest run
            xs = np.where(r)[0]
            runs = np.split(xs, np.where(np.diff(xs) > 1)[0] + 1)
            best = max(runs, key=len)
            if len(best) > 18 * S:
                rows.append((y, best[0], best[-1]))
    if not rows:
        return None
    # contiguous band starting at the first row
    y0 = rows[0][0]
    band = [r for r in rows if r[0] - y0 < 12 * S]
    ys = [r[0] for r in band]
    # keep only rows that are contiguous
    top, bot = ys[0], ys[0]
    for y in ys[1:]:
        if y == bot + 1: bot = y
        else: break
    sel = [r for r in band if top <= r[0] <= bot]
    x1 = int(np.median([r[1] for r in sel])); x2 = int(np.median([r[2] for r in sel]))
    return top, bot, x1, x2


NB = [(-1, -1), (-1, 0), (-1, 1), (0, -1), (0, 1), (1, -1), (1, 0), (1, 1)]


def graph(sk, min_spur=6 * S):
    pts = set(map(tuple, np.argwhere(sk)))
    nb = lambda p: [(p[0] + a, p[1] + b) for a, b in NB if (p[0] + a, p[1] + b) in pts]
    for _ in range(40):
        deg = {p: len(nb(p)) for p in pts}
        junc = {p for p in pts if deg[p] >= 3}
        # cluster junction pixels
        cid = {}; k = 0
        for p in junc:
            if p in cid: continue
            stack = [p]; cid[p] = k
            while stack:
                q = stack.pop()
                for r in nb(q):
                    if r in junc and r not in cid: cid[r] = k; stack.append(r)
            k += 1
        ends = {p for p in pts if deg[p] <= 1}
        node_of = lambda p: ("j", cid[p]) if p in cid else ("e", p) if p in ends else None
        edges = []; used = set()
        starts = list(junc) + list(ends)
        for n in starts:
            for q in nb(n):
                if q in junc or (n, q) in used: continue
                path = [n, q]; prev = n; cur = q
                while node_of(cur) is None:
                    nx = [r for r in nb(cur) if r != prev and r not in path[-4:]]
                    if not nx: break
                    prev, cur = cur, nx[0]; path.append(cur)
                if len(path) > 2: used.add((path[-1], path[-2]))
                used.add((n, q))
                edges.append(path)
        # dedupe edges (each found from both ends)
        uniq = {}
        for e in edges:
            key = frozenset([node_of(e[0]), node_of(e[-1])]), len(e)
            uniq.setdefault(key, e)
        edges = list(uniq.values())
        # prune short spurs
        removed = False
        for e in edges:
            a, b = node_of(e[0]), node_of(e[-1])
            spur = (a and a[0] == "e") != (b and b[0] == "e")
            if spur and len(e) < min_spur:
                for p in e:
                    if p not in junc: pts.discard(p)
                removed = True
        if not removed: break
    # isolated loops
    covered = {p for e in edges for p in e}
    rest = pts - covered
    while rest:
        st = next(iter(rest)); path = [st]; prev = None; cur = st
        while True:
            nx = [r for r in nb(cur) if r != prev and r in rest and r not in path]
            if not nx: break
            prev, cur = cur, nx[0]; path.append(cur)
        rest -= set(path); path.append(st); edges.append(path)
    # merge chains through degree-2 junction clusters
    def key(p): return node_of(p) if p in pts else ("x", p)
    changed = True
    while changed:
        changed = False
        cnt = defaultdict(list)
        for i, e in enumerate(edges):
            cnt[key(e[0])].append((i, 0)); cnt[key(e[-1])].append((i, 1))
        for n, lst in cnt.items():
            if n and n[0] == "j" and len(lst) == 2 and lst[0][0] != lst[1][0]:
                (i, ei), (j, ej) = lst
                A = edges[i] if ei == 1 else edges[i][::-1]
                B = edges[j] if ej == 0 else edges[j][::-1]
                edges[i] = A + B; edges.pop(j); changed = True; break
    return edges


def rdp(pts, eps):
    import sys; sys.setrecursionlimit(10000)
    if len(pts) < 3: return pts
    a, b = np.array(pts[0], float), np.array(pts[-1], float)
    ab = b - a; L = np.hypot(*ab) or 1e-9
    d = [abs(ab[0] * (p[1] - a[1]) - ab[1] * (p[0] - a[0])) / L for p in pts]
    i = int(np.argmax(d))
    if d[i] > eps:
        return rdp(pts[: i + 1], eps)[:-1] + rdp(pts[i:], eps)
    return [pts[0], pts[-1]]


def process(ch):
    m = render(ch)
    hl = headline(m)
    body = m.copy()
    if hl:
        top, bot, x1, x2 = hl
        pad = S // 2
        body[top - pad: bot + pad + 1, x1 - pad: x2 + pad + 1] = False
    sk = skeletonize(body)
    segs = graph(sk)
    segs.sort(key=lambda e: min(p[1] for p in e))
    out = []
    for s in segs:
        if len(s) < 3 * S:      # drop tiny spurs (< 3 units)
            continue
        pts = [(x / S, y / S) for (y, x) in s]
        pts = rdp(pts, 0.35)
        out.append([[round(x, 1), round(y, 1)] for x, y in pts])
    xs = np.where(m.any(0))[0]
    res = {"x0": round(xs[0] / S, 1), "x1": round(xs[-1] / S, 1), "segs": out}
    if hl:
        top, bot, x1, x2 = hl
        res["headline"] = [round(x1 / S, 1), round(x2 / S, 1), round((top + bot) / 2 / S, 1)]
    return res


if __name__ == "__main__":
    data = {ch: process(ch) for ch in LETTERS}
    json.dump(data, open("segments.json", "w"), ensure_ascii=False)
    for ch, v in data.items():
        print(ch, "segs", len(v["segs"]), "headline", v.get("headline"))
