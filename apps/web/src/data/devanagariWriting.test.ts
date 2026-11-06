import { describe, expect, it, vi } from 'vitest';
import { CONJUNCT_LETTERS, DOUBLED_LETTERS, CONJUNCT_WRITING } from '../../../../game-sources/devanagari-game/src/likhana/conjunctStrokes';
import { GROUPS } from '../../../../game-sources/devanagari-game/src/likhana/Lekhana';
import { getLetter, loadCorrections, loadReviewed, score, toPts } from '../../../../game-sources/devanagari-game/src/likhana/engine';
import { HEADLINE_Y, STROKES } from '../../../../game-sources/devanagari-game/src/likhana/strokeData';
import { layoutMarkers } from '../../../../game-sources/devanagari-game/src/likhana/markerLayout';

const joined = [...DOUBLED_LETTERS, ...CONJUNCT_LETTERS];

describe('Devanagari joined-letter writing', () => {
  it('keeps every numbered dot separate and inside the pad for all 57 forms', () => {
    for (const data of Object.values(STROKES)) {
      for (const width of [240, 320, 857]) {
        const height = 300;
        const scale = Math.min(width / (data.w + 28), height / 106);
        const x = (width - data.w * scale) / 2;
        const y = (height - 106 * scale) / 2 + 4 * scale;
        const radius = Math.max(9, 3.2 * scale);
        const labels = layoutMarkers(data.strokes.map(s => ({
          x: x + s.pts[0][0] * scale, y: y + s.pts[0][1] * scale,
        })), radius, width, height);
        expect(labels).toHaveLength(data.strokes.length);
        labels.forEach((p, i) => {
          expect(p.x).toBeGreaterThanOrEqual(radius);
          expect(p.x).toBeLessThanOrEqual(width - radius);
          expect(p.y).toBeGreaterThanOrEqual(radius);
          expect(p.y).toBeLessThanOrEqual(height - radius);
          labels.slice(i + 1).forEach(q => {
            expect(Math.hypot(p.x - q.x, p.y - q.y)).toBeGreaterThanOrEqual(radius * 2 + 2.99);
          });
        });
      }
    }
  });

  it('uses the loop-and-bowl ksha form, not the former crossed double-loop guide', () => {
    const data = STROKES['क्ष'];
    const loop = data.strokes[0].pts.slice(6, 20);
    expect(Math.max(...loop.map(([, y]) => y))).toBeLessThan(45);
    expect(Math.min(...loop.map(([, y]) => y))).toBeLessThan(22.3);
    expect(Math.max(...loop.map(([x]) => x))).toBeLessThan(25);
    const headline = data.strokes[data.strokes.length - 1].pts;
    expect(headline[0][0]).toBeGreaterThan(35);
    expect(headline[1][0] - headline[0][0]).toBeLessThan(12);
    expect(data.w).toBeLessThan(60);
    expect(data.strokes.some(s => s.pts.some(([, y]) => y > 76.5))).toBe(true);
  });

  it('writes ksha as a flowing body, downward stem, then headline with two pen lifts', () => {
    const data = getLetter('क्ष', {});
    if (!data) throw new Error('Missing ksha stroke data');
    expect(data.strokes.map(s => s.kind)).toEqual(['body', 'bar', 'shirorekha']);
    const [body, stem, headline] = data.strokes;
    expect(body.pts[0]).toEqual([42, 40.1]);
    expect(body.pts[1][0]).toBeLessThan(body.pts[0][0]);
    const landmarks = [[13.1, 40.6], [14.2, 21], [13.1, 40.6],
      [3, 57.2], [18, 70], [27.2, 60.5], [33.1, 78]];
    let cursor = 0;
    for (const [x, y] of landmarks) {
      const offset = body.pts.slice(cursor).findIndex(p => p[0] === x && p[1] === y);
      expect(offset).toBeGreaterThanOrEqual(0);
      cursor += offset + 1;
    }
    expect(stem.pts[0][1]).toBe(HEADLINE_Y);
    expect(stem.pts.at(-1)![1]).toBeGreaterThan(70);
    expect(headline.pts[0][0]).toBeLessThan(headline.pts[1][0]);
    const trace = data.strokes.map(toPts);
    const correct = score(data.strokes, trace);
    expect(correct.score).toBeGreaterThanOrEqual(90);
    expect(correct.order).toBe(100);
    expect(correct.count).toBe(100);
    expect(score(data.strokes, [trace[1], trace[0], trace[2]]).order).toBeLessThan(correct.order);
  });

  it('invalidates old six-fragment ksha reviews without changing other letter reviews', () => {
    const key = 'lekhana-review-v1';
    const saved = localStorage.getItem(key);
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const legacy = { order: [5, 4, 3, 2, 1, 0], reversed: [3] };
    const other = { order: STROKES['क'].strokes.map((_, i) => i), reversed: [] };
    try {
      expect(getLetter('क्ष', { 'क्ष': legacy })).toBe(STROKES['क्ष']);
      localStorage.setItem(key, JSON.stringify({ 'क्ष': legacy, 'क': other }));
      const corrections = loadCorrections();
      expect(corrections['क्ष']).toBeUndefined();
      expect(corrections['क']).toEqual(other);
      expect(JSON.parse(localStorage.getItem(key)!)['क्ष']).toBeUndefined();
      expect(warn).toHaveBeenCalled();
    } finally {
      if (saved === null) localStorage.removeItem(key);
      else localStorage.setItem(key, saved);
      warn.mockRestore();
    }
  });

  for (const [char, start, landmarks] of [
    ['श्र', [4.1, 52.5], [[14.6, 43.8], [23.1, 23.5], [7.1, 30.6], [14.6, 43.8], [35.6, 51], [11.2, 71.5]]],
    ['त्र', [8, 41.6], [[20.2, 38.4], [36.4, 45.9], [36.2, 52.4], [11.2, 67]]],
    ['ज्ञ', [41.5, 36.4], [[10.6, 36.2], [27.5, 53.4], [17.9, 64], [9.8, 59.8], [17.9, 64], [30.4, 81.5]]],
  ] as const) {
    it(`${char} follows the observed flowing body before the downward stem and headline`, () => {
      const data = STROKES[char];
      expect(data.strokes.map(s => s.kind)).toEqual(['body', 'bar', 'shirorekha']);
      const [body, stem, headline] = data.strokes;
      expect(body.pts[0]).toEqual(start);
      let cursor = 0;
      for (const [x, y] of landmarks) {
        const offset = body.pts.slice(cursor).findIndex(p => p[0] === x && p[1] === y);
        expect(offset).toBeGreaterThanOrEqual(0);
        cursor += offset + 1;
      }
      expect(stem.pts[0][1]).toBe(HEADLINE_Y);
      expect(stem.pts.at(-1)![1]).toBeGreaterThan(70);
      expect(headline.pts[0][0]).toBeLessThan(headline.pts[1][0]);
      expect(CONJUNCT_WRITING[char].body).not.toBe('');
      expect(CONJUNCT_WRITING[char].arrows.every(t => t > 0 && t + 0.07 < 1)).toBe(true);
      const trace = data.strokes.map(toPts);
      const correct = score(data.strokes, trace);
      expect(correct.score).toBeGreaterThanOrEqual(90);
      expect(correct.count).toBe(100);
      expect(correct.order).toBe(100);
      expect(score(data.strokes, [trace[1], trace[0], trace[2]]).order).toBeLessThan(correct.order);
    });
  }

  it('discards old joined-letter overrides and invalidates checked marks once after the model change', () => {
    const keys = ['lekhana-review-v1', 'lekhana-reviewed-v1', 'lekhana-flowing-review-v1'];
    const saved = keys.map(key => localStorage.getItem(key));
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    try {
      const old = { 'श्र': 6, 'त्र': 5, 'ज्ञ': 6 };
      localStorage.setItem(keys[0], JSON.stringify(Object.fromEntries(
        Object.entries(old).map(([ch, n]) => [ch, { order: Array.from({ length: n }, (_, i) => i), reversed: [] }]),
      )));
      expect(loadCorrections()).toEqual({});
      localStorage.setItem(keys[1], JSON.stringify(['क्ष', 'श्र', 'त्र', 'ज्ञ', 'क']));
      localStorage.removeItem(keys[2]);
      expect(loadReviewed()).toEqual(['क']);
      localStorage.setItem(keys[1], JSON.stringify(['क', 'श्र']));
      expect(loadReviewed()).toEqual(['क', 'श्र']);
      expect(warn).toHaveBeenCalled();
    } finally {
      keys.forEach((key, i) => {
        if (saved[i] === null) localStorage.removeItem(key);
        else localStorage.setItem(key, saved[i]!);
      });
      warn.mockRestore();
    }
  });

  it('offers the requested doubled and conjunct letters in distinct groups', () => {
    expect(DOUBLED_LETTERS.map(l => l.char)).toEqual(expect.arrayContaining(['त्त', 'क्क', 'न्न']));
    expect(CONJUNCT_LETTERS.map(l => l.char)).toEqual(expect.arrayContaining(['क्ष', 'त्र', 'ज्ञ']));
    expect(GROUPS.slice(-2).map(g => g.letters)).toEqual([
      DOUBLED_LETTERS.map(l => l.char),
      CONJUNCT_LETTERS.map(l => l.char),
    ]);
    const letters = GROUPS.flatMap(g => g.letters);
    expect(letters).toHaveLength(57);
    expect(new Set(letters).size).toBe(letters.length);
    expect(letters.every(l => STROKES[l]?.strokes.length > 0)).toBe(true);
  });

  for (const letter of joined) {
    describe(letter.char, () => {
      it('has bounded, nondegenerate paths and a single final left-to-right headline', () => {
        const data = getLetter(letter.char, {});
        expect(data).not.toBeNull();
        if (!data) throw new Error(`Missing stroke data for ${letter.char}`);
        expect(Number.isFinite(data.w)).toBe(true);
        expect(data.strokes.filter(s => s.kind === 'shirorekha')).toHaveLength(1);
        const last = data.strokes[data.strokes.length - 1];
        expect(last.kind).toBe('shirorekha');
        expect(last.pts[0][0]).toBeLessThan(last.pts[last.pts.length - 1][0]);
        expect(last.pts.every(([, y]) => y === HEADLINE_Y)).toBe(true);
        for (const stroke of data.strokes) {
          expect(stroke.pts.length).toBeGreaterThanOrEqual(2);
          for (const [x, y] of stroke.pts) {
            expect(Number.isFinite(x) && Number.isFinite(y)).toBe(true);
            expect(x).toBeGreaterThanOrEqual(0);
            expect(x).toBeLessThanOrEqual(data.w);
            expect(y).toBeGreaterThanOrEqual(0);
            expect(y).toBeLessThanOrEqual(100);
          }
        }
        expect(letter.parts.replace(' + ', '')).toBe(letter.char);
        expect(letter.roman).not.toBe('');
        expect(letter.example).toContain(letter.char);
      });

      it('accepts a faithful trace and rejects reversed stroke direction', () => {
        const expected = STROKES[letter.char].strokes;
        const trace = expected.map(toPts);
        expect(score(expected, trace).score).toBeGreaterThanOrEqual(90);
        expect(score(expected, trace, { normalize: true }).score).toBeGreaterThanOrEqual(90);
        expect(score(expected, trace.map(s => [...s].reverse())).score).toBeLessThan(70);
        expect(score(expected, []).score).toBe(0);
      });

      it('supports teacher order/direction corrections without mutating its model', () => {
        const original = STROKES[letter.char];
        const order = original.strokes.map((_, i) => i).reverse();
        const corrected = getLetter(letter.char, { [letter.char]: { order, reversed: [0] } });
        expect(corrected?.strokes[0]).toEqual(original.strokes[order[0]]);
        expect(corrected?.strokes[order.length - 1].pts).toEqual([...original.strokes[0].pts].reverse());
        expect(getLetter(letter.char, {})).toBe(original);
      });
    });
  }
});
