// ═══════════════════════════════════════════════════════════════
//  audio/clips.ts — recorded pronunciations
//  • IndexedDB store for the teacher's recordings (this browser)
//  • export: trim + normalise → 16-bit WAV, packed in a zip with manifest.json
//  • runtime: public/audio/manifest.json → played instead of the TTS voice
// ═══════════════════════════════════════════════════════════════

export type Clip = { key: string; blob: Blob; start: number; dur: number; mime: string; at: number };
export type Manifest = { speaker?: string; created?: string; items: Record<string, string> };

// ── keys: one clip per text; lone vowel signs map to their vowel ──
const SIGN_TO_VOWEL: Record<string, string> = {
  "ा": "आ", "ि": "इ", "ी": "ई", "ु": "उ", "ू": "ऊ", "ृ": "ऋ", "ॄ": "ॠ", "ॢ": "ऌ",
  "े": "ए", "ै": "ऐ", "ो": "ओ", "ौ": "औ", "ं": "अं", "ः": "अः",
};
export function clipKey(text: string) {
  const t = text.replace(/◌/g, "").normalize("NFC").trim();
  return SIGN_TO_VOWEL[t] ?? t;
}

// ── IndexedDB ──
const DB = "akshara-audio", STORE = "clips";
function db(): Promise<IDBDatabase> {
  return new Promise((res, rej) => {
    const r = indexedDB.open(DB, 1);
    r.onupgradeneeded = () => r.result.createObjectStore(STORE, { keyPath: "key" });
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  });
}
async function tx<T>(mode: IDBTransactionMode, f: (s: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const d = await db();
  return new Promise((res, rej) => {
    const q = f(d.transaction(STORE, mode).objectStore(STORE));
    q.onsuccess = () => res(q.result);
    q.onerror = () => rej(q.error);
  });
}
export const putClip = (c: Clip) => tx("readwrite", s => s.put(c));
export const deleteClip = (key: string) => tx("readwrite", s => s.delete(key));
export const allClips = () => tx<Clip[]>("readonly", s => s.getAll() as IDBRequest<Clip[]>).catch(() => [] as Clip[]);

// ── decoding / trimming ──
let ctx: AudioContext | null = null;
export const audioCtx = () => (ctx ??= new AudioContext());

export async function decodeClip(c: Pick<Clip, "blob" | "start" | "dur">): Promise<AudioBuffer> {
  const buf = await audioCtx().decodeAudioData(await c.blob.arrayBuffer());
  const sr = buf.sampleRate;
  const a = Math.max(0, Math.floor(c.start * sr));
  const b = Math.min(buf.length, Math.ceil((c.start + c.dur) * sr));
  const out = audioCtx().createBuffer(1, Math.max(1, b - a), sr);
  const src = buf.getChannelData(0), dst = out.getChannelData(0);
  let peak = 0;
  for (let i = a; i < b; i++) peak = Math.max(peak, Math.abs(src[i]));
  const gain = peak > 0.01 ? 0.89 / peak : 1;                  // normalise to about −1 dB
  const fade = Math.min(Math.floor(sr * 0.012), (b - a) >> 2);  // 12 ms fades, no clicks
  for (let i = 0; i < b - a; i++) {
    let g = gain;
    if (i < fade) g *= i / fade;
    if (i > b - a - fade) g *= (b - a - i) / fade;
    dst[i] = src[a + i] * g;
  }
  return out;
}

export function playBuffer(buf: AudioBuffer) {
  const c = audioCtx();
  if (c.state === "suspended") c.resume();
  const s = c.createBufferSource(); s.buffer = buf; s.connect(c.destination); s.start();
  return s;
}

// ── WAV (mono, 16-bit, resampled to 22.05 kHz) ──
export async function toWav(buf: AudioBuffer, rate = 22050): Promise<Uint8Array> {
  const off = new OfflineAudioContext(1, Math.max(1, Math.ceil(buf.duration * rate)), rate);
  const s = off.createBufferSource(); s.buffer = buf; s.connect(off.destination); s.start();
  const r = await off.startRendering();
  const pcm = r.getChannelData(0);
  const out = new DataView(new ArrayBuffer(44 + pcm.length * 2));
  const w = (o: number, t: string) => [...t].forEach((ch, i) => out.setUint8(o + i, ch.charCodeAt(0)));
  w(0, "RIFF"); out.setUint32(4, 36 + pcm.length * 2, true); w(8, "WAVE"); w(12, "fmt ");
  out.setUint32(16, 16, true); out.setUint16(20, 1, true); out.setUint16(22, 1, true);
  out.setUint32(24, rate, true); out.setUint32(28, rate * 2, true); out.setUint16(32, 2, true); out.setUint16(34, 16, true);
  w(36, "data"); out.setUint32(40, pcm.length * 2, true);
  for (let i = 0; i < pcm.length; i++) out.setInt16(44 + i * 2, Math.max(-1, Math.min(1, pcm[i])) * 0x7fff, true);
  return new Uint8Array(out.buffer);
}

// ── zip (stored, no compression — WAV barely compresses anyway) ──
const CRC = (() => { const t = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
const crc32 = (d: Uint8Array) => { let c = 0xffffffff; for (let i = 0; i < d.length; i++) c = CRC[(c ^ d[i]) & 0xff] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };

export function zip(files: { name: string; data: Uint8Array }[]): Blob {
  const enc = new TextEncoder(); const parts: Uint8Array[] = []; const central: Uint8Array[] = []; let offset = 0;
  for (const f of files) {
    const name = enc.encode(f.name), crc = crc32(f.data);
    const h = new DataView(new ArrayBuffer(30));
    h.setUint32(0, 0x04034b50, true); h.setUint16(4, 20, true); h.setUint16(6, 0x0800, true);
    h.setUint32(14, crc, true); h.setUint32(18, f.data.length, true); h.setUint32(22, f.data.length, true); h.setUint16(26, name.length, true);
    parts.push(new Uint8Array(h.buffer), name, f.data);
    const c = new DataView(new ArrayBuffer(46));
    c.setUint32(0, 0x02014b50, true); c.setUint16(4, 20, true); c.setUint16(6, 20, true); c.setUint16(8, 0x0800, true);
    c.setUint32(16, crc, true); c.setUint32(20, f.data.length, true); c.setUint32(24, f.data.length, true); c.setUint16(28, name.length, true);
    c.setUint32(42, offset, true);
    central.push(new Uint8Array(c.buffer), name);
    offset += 30 + name.length + f.data.length;
  }
  const size = central.reduce((a, b) => a + b.length, 0);
  const e = new DataView(new ArrayBuffer(22));
  e.setUint32(0, 0x06054b50, true); e.setUint16(8, files.length, true); e.setUint16(10, files.length, true);
  e.setUint32(12, size, true); e.setUint32(16, offset, true);
  return new Blob([...parts, ...central, new Uint8Array(e.buffer)] as BlobPart[], { type: "application/zip" });
}

// ── runtime: which clips exist ──
const local = new Map<string, Clip>();            // this browser's recordings (teacher preview)
const decoded = new Map<string, AudioBuffer>();
let manifest: Manifest | null = null;
let base = "/";

export async function initAudio() {
  try { base = ((import.meta as unknown as { env?: { BASE_URL?: string } }).env?.BASE_URL) ?? "/"; } catch { /* plain bundle */ }
  try {
    const r = await fetch(`${base}audio/manifest.json`, { cache: "no-cache" });
    if (r.ok) manifest = await r.json();
  } catch { /* no published audio yet */ }
  try { for (const c of await allClips()) local.set(c.key, c); } catch { /* no IndexedDB */ }
}
export function rememberLocal(c: Clip | null, key?: string) {
  if (c) { local.set(c.key, c); decoded.delete(c.key); } else if (key) { local.delete(key); decoded.delete(key); }
}
export const hasClip = (text: string) => { const k = clipKey(text); return local.has(k) || !!manifest?.items[k]; };
export const publishedCount = () => Object.keys(manifest?.items ?? {}).length;

/** Play a recorded clip if there is one. Returns false if none (caller falls back to TTS). */
export function playClip(text: string): boolean {
  const k = clipKey(text);
  const c = local.get(k);
  if (c) {
    const hit = decoded.get(k);
    if (hit) playBuffer(hit);
    else decodeClip(c).then(b => { decoded.set(k, b); playBuffer(b); }).catch(() => undefined);
    return true;
  }
  const f = manifest?.items[k];
  if (f) { const a = new Audio(`${base}audio/${f}`); a.play().catch(() => undefined); return true; }
  return false;
}
