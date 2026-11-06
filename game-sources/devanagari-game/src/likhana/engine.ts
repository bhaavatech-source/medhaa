// ═══════════════════════════════════════════════════════════════
//  likhana/engine.ts — stroke data access, review corrections, scoring
// ═══════════════════════════════════════════════════════════════
import { STROKES, HEADLINE_Y, type LetterStrokes, type Stroke } from "./strokeData";
import { REVIEWED } from "./reviewedCorrections";
import { CONJUNCT_WRITING } from "./conjunctStrokes";

export type Pt = { x: number; y: number; p?: number; t?: number };
export type UserStroke = Pt[];

// ── Review corrections (order / direction), saved in this browser ──
const OV_KEY = "lekhana-review-v1";
export type Correction = { order: number[]; reversed: number[] };

function isCurrentCorrection(ch: string, c: unknown): c is Correction {
  const count = STROKES[ch]?.strokes.length;
  if (!c || typeof c !== "object" || !("order" in c) || !("reversed" in c)
    || !Array.isArray(c.order) || !Array.isArray(c.reversed)) return false;
  return count !== undefined && c.order.length === count
    && new Set(c.order).size === count
    && c.order.every(i => Number.isInteger(i) && i >= 0 && i < count)
    && c.reversed.every(i => Number.isInteger(i) && i >= 0 && i < count);
}

export function loadCorrections(): Record<string, Correction> {
  let corrections: Record<string, Correction>;
  try { corrections = { ...REVIEWED, ...JSON.parse(localStorage.getItem(OV_KEY) || "{}") }; } catch { return { ...REVIEWED }; }
  let changed = false;
  for (const [ch, correction] of Object.entries(corrections)) {
    if (!isCurrentCorrection(ch, correction)) {
      console.warn(`[Lekhana] Discarding obsolete review for ${ch}: it does not match the current stroke model. Please review it again.`);
      delete corrections[ch];
      changed = true;
    }
  }
  if (changed) saveCorrections(corrections);
  return corrections;
}
export function saveCorrections(c: Record<string, Correction>) {
  try { localStorage.setItem(OV_KEY, JSON.stringify(c)); } catch { /* ignore */ }
}

export function loadReviewed(): string[] {
  const key = "lekhana-reviewed-v1", modelKey = "lekhana-flowing-review-v1";
  try {
    const reviewed: string[] = JSON.parse(localStorage.getItem(key) || "[]");
    if (localStorage.getItem(modelKey)) return reviewed;
    const current = reviewed.filter(ch => !CONJUNCT_WRITING[ch]);
    if (current.length !== reviewed.length) {
      console.warn("[Lekhana] The flowing conjunct guides have changed; their previous checked marks were cleared. Please review them again.");
    }
    localStorage.setItem(key, JSON.stringify(current));
    localStorage.setItem(modelKey, "1");
    return current;
  } catch (error) {
    console.warn("[Lekhana] Could not load stroke-review checks.", error);
    return [];
  }
}

export function hasStrokes(ch: string) { return !!STROKES[ch]; }

export function getLetter(ch: string, corrections = loadCorrections()): LetterStrokes | null {
  const base = STROKES[ch];
  if (!base) return null;
  const c = corrections[ch];
  if (!c) return base;
  if (!isCurrentCorrection(ch, c)) {
    console.warn(`[Lekhana] Review for ${ch} does not match the current stroke model; using its default sequence.`);
    return base;
  }
  const strokes: Stroke[] = c.order
    .filter(i => base.strokes[i])
    .map(i => {
      const s = base.strokes[i];
      return c.reversed.includes(i) ? { ...s, pts: [...s.pts].reverse() as [number, number][] } : s;
    });
  return { ...base, strokes };
}

// ── Geometry ───────────────────────────────────────────────────
const d = (a: Pt, b: Pt) => Math.hypot(a.x - b.x, a.y - b.y);
export const toPts = (s: Stroke): Pt[] => s.pts.map(([x, y]) => ({ x, y }));

export function pathLength(p: Pt[]) {
  let L = 0;
  for (let i = 1; i < p.length; i++) L += d(p[i - 1], p[i]);
  return L;
}

export function resample(p: Pt[], n = 32): Pt[] {
  if (p.length === 0) return [];
  if (p.length === 1) return Array.from({ length: n }, () => ({ ...p[0] }));
  const L = pathLength(p), step = L / (n - 1);
  const out: Pt[] = [{ ...p[0] }];
  let acc = 0, prev = p[0];
  for (let i = 1; i < p.length && out.length < n; i++) {
    let cur = p[i];
    let seg = d(prev, cur);
    while (acc + seg >= step && out.length < n) {
      const t = (step - acc) / (seg || 1);
      const q = { x: prev.x + t * (cur.x - prev.x), y: prev.y + t * (cur.y - prev.y) };
      out.push(q); prev = q; seg = d(prev, cur); acc = 0;
    }
    acc += seg; prev = cur;
  }
  while (out.length < n) out.push({ ...p[p.length - 1] });
  return out;
}

/** point along a stroke at fraction t (0..1), for animation */
export function pointAt(p: Pt[], t: number): { pt: Pt; upto: Pt[] } {
  const L = pathLength(p) * Math.max(0, Math.min(1, t));
  const upto: Pt[] = [p[0]];
  let acc = 0;
  for (let i = 1; i < p.length; i++) {
    const seg = d(p[i - 1], p[i]);
    if (acc + seg >= L) {
      const k = (L - acc) / (seg || 1);
      const q = { x: p[i - 1].x + k * (p[i].x - p[i - 1].x), y: p[i - 1].y + k * (p[i].y - p[i - 1].y) };
      upto.push(q);
      return { pt: q, upto };
    }
    acc += seg; upto.push(p[i]);
  }
  return { pt: p[p.length - 1], upto };
}

const meanDist = (a: Pt[], b: Pt[]) => a.reduce((s, p, i) => s + d(p, b[i]), 0) / a.length;

function nearestAvg(A: Pt[], B: Pt[]) {
  if (!A.length || !B.length) return 99;
  let tot = 0;
  for (const a of A) { let best = Infinity; for (const b of B) best = Math.min(best, d(a, b)); tot += best; }
  return tot / A.length;
}

// ── Scoring ────────────────────────────────────────────────────
export type Verdict = {
  score: number;               // 0..100
  shape: number; order: number; direction: number; count: number;
  messages: string[];
  strokeIssues: { index: number; issue: "order" | "direction" | "shape" }[];
};

const clamp = (v: number) => Math.max(0, Math.min(100, v));

function bbox(P: Pt[]) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const p of P) { x0 = Math.min(x0, p.x); y0 = Math.min(y0, p.y); x1 = Math.max(x1, p.x); y1 = Math.max(y1, p.y); }
  return { x0, y0, x1, y1, w: x1 - x0, h: y1 - y0, cx: (x0 + x1) / 2, cy: (y0 + y1) / 2 };
}

export function score(expected: Stroke[], user: UserStroke[], opts: { normalize?: boolean } = {}): Verdict {
  const E = expected.map(s => resample(toPts(s)));
  let U = user.filter(s => s.length > 1 && pathLength(s) > 2).map(s => resample(s));
  const msgs: string[] = [];
  if (opts.normalize && U.length) {
    // freehand: compare the shape, not the exact position on the page
    const be = bbox(E.flat()), bu = bbox(U.flat());
    const k = Math.max(0.6, Math.min(1.7, Math.max(be.h, 1) / Math.max(bu.h, 1)));
    U = U.map(s => s.map(p => ({ ...p, x: be.cx + (p.x - bu.cx) * k, y: be.cy + (p.y - bu.cy) * k })));
    if (bu.h < be.h * 0.6) msgs.push("Write a little bigger — use the space between the red and blue lines.");
    else if (bu.h > be.h * 1.5) msgs.push("Write a little smaller — keep the letter between the red and blue lines.");
    else if (Math.abs(bu.y0 - be.y0) > 12) msgs.push("Start the letter at the red शिरोरेखा line.");
  }
  const issues: Verdict["strokeIssues"] = [];
  if (!U.length) return { score: 0, shape: 0, order: 0, direction: 0, count: 0, messages: ["Nothing written yet — start at dot ①."], strokeIssues: [] };
  const sizeMsgs = msgs.splice(0);

  // shape: how close the whole drawing is to the letter (both ways)
  const allE = E.flat(), allU = U.flat();
  const avg = (nearestAvg(allU, allE) + nearestAvg(allE, allU)) / 2;
  const shape = clamp(100 - (avg - 2.5) * 9);

  // count
  const diff = U.length - E.length;
  const count = clamp(100 - Math.abs(diff) * 25);
  if (diff < 0) msgs.push(`${-diff} stroke${diff === -1 ? " is" : "s are"} missing — this letter has ${E.length} strokes.`);
  if (diff > 0) msgs.push(`You used ${U.length} strokes; this letter needs ${E.length}. Try to draw each stroke in one movement.`);

  // order + direction: match each user stroke to its best expected stroke
  let okOrder = 0, okDir = 0, matched = 0;
  U.forEach((u, i) => {
    let best = -1, bestD = Infinity, rev = false;
    E.forEach((e, j) => {
      const f = meanDist(u, e), r = meanDist([...u].reverse(), e);
      const m = Math.min(f, r);
      if (m < bestD) { bestD = m; best = j; rev = r < f; }
    });
    if (best < 0 || bestD > 14) { issues.push({ index: i, issue: "shape" }); return; }
    matched++;
    if (best === i) okOrder++; else issues.push({ index: best, issue: "order" });
    if (!rev) okDir++; else issues.push({ index: best, issue: "direction" });
  });
  const order = matched ? clamp((okOrder / Math.max(U.length, E.length)) * 100) : 0;
  const direction = matched ? clamp((okDir / matched) * 100) : 0;

  const dirBad = issues.filter(x => x.issue === "direction").map(x => x.index + 1);
  const ordBad = issues.filter(x => x.issue === "order").map(x => x.index + 1);
  if (dirBad.length) msgs.push(`Stroke ${[...new Set(dirBad)].map(circled).join(" ")} went the wrong way — begin at its numbered dot.`);
  if (ordBad.length && !msgs.some(m => m.includes("missing"))) msgs.push(`The strokes were drawn in a different order. Watch again: ${E.map((_, i) => circled(i + 1)).join(" → ")}.`);

  // शिरोरेखा
  const hlIdx = expected.findIndex(s => s.kind === "shirorekha");
  if (hlIdx >= 0) {
    const hasHL = U.some(u => {
      const ys = u.map(p => p.y), xs = u.map(p => p.x);
      return Math.max(...ys) - Math.min(...ys) < 8 && Math.abs(ys.reduce((a, b) => a + b, 0) / ys.length - HEADLINE_Y) < 7 && Math.max(...xs) - Math.min(...xs) > 15;
    });
    if (!hasHL) msgs.push("Don't forget the शिरोरेखा — the straight line on top, drawn last, left to right.");
    else {
      const lastU = U[U.length - 1];
      const ys = lastU.map(p => p.y);
      const lastIsHL = Math.max(...ys) - Math.min(...ys) < 8 && Math.abs(ys[0] - HEADLINE_Y) < 7;
      const signsAbove = expected.slice(hlIdx + 1).length;
      if (!lastIsHL && !signsAbove) msgs.push("The शिरोरेखा comes last — finish the letter first, then draw the top line.");
    }
  }
  if (shape < 55) msgs.push(opts.normalize ? "The shape is not close enough yet — watch the letter again, then write slowly." : "The shape is far from the guide — trace slowly over the grey letter.");
  msgs.push(...sizeMsgs);

  let total = Math.round(shape * 0.45 + order * 0.25 + direction * 0.15 + count * 0.15);
  // the order and direction are the lesson: a wrong one keeps the score below "pass"
  if (ordBad.length) total = Math.min(total, 55);
  else if (dirBad.length) total = Math.min(total, 62);
  if (!msgs.length) msgs.push(total >= 90 ? "उत्तमम्! Beautiful — order, direction and shape are all right." : "Good! Keep your strokes smooth and inside the lines.");
  return { score: total, shape: Math.round(shape), order: Math.round(order), direction: Math.round(direction), count: Math.round(count), messages: msgs, strokeIssues: issues };
}

export const circled = (n: number) => "①②③④⑤⑥⑦⑧⑨⑩"[n - 1] ?? String(n);
