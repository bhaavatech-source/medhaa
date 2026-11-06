// ═══════════════════════════════════════════════════════════════
//  audio/Recorder.tsx — ध्वनिमुद्रणम् · record the pronunciations
//  Space = record / stop · P = play · Enter or → = next · ← = back
// ═══════════════════════════════════════════════════════════════
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SETS, TOTAL, type RecItem } from "./recordSets";
import { allClips, putClip, deleteClip, decodeClip, playBuffer, toWav, zip, rememberLocal, clipKey, type Clip } from "./clips";
import "./recorder.css";

type Status = { kind: "idle" | "rec" | "saved" | "warn" | "busy"; text: string };
const NAME_KEY = "akshara-audio-speaker";

function pickMime() {
  const opts = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/ogg;codecs=opus"];
  return opts.find(m => typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported?.(m)) ?? "";
}

const Recorder: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [group, setGroup] = useState(0);
  const [idx, setIdx] = useState(0);
  const [clips, setClips] = useState<Map<string, Clip>>(new Map());
  const [mic, setMic] = useState<"off" | "on" | "denied">("off");
  const [level, setLevel] = useState(0);
  const [status, setStatus] = useState<Status>({ kind: "idle", text: "Turn on the microphone to begin." });
  const [handsFree, setHandsFree] = useState(true);
  const [autoNext, setAutoNext] = useState(true);
  const [speaker, setSpeaker] = useState(() => { try { return localStorage.getItem(NAME_KEY) ?? ""; } catch { return ""; } });
  const [exporting, setExporting] = useState<string | null>(null);

  const stream = useRef<MediaStream | null>(null);
  const analyser = useRef<AnalyserNode | null>(null);
  const rec = useRef<{ mr: MediaRecorder; t0: number; onset: number | null; last: number | null; floor: number[]; raf: number; stopAt?: number } | null>(null);
  const meterRaf = useRef(0);

  const set = SETS[group];
  const item: RecItem | undefined = set.items[idx];
  const key = item ? clipKey(item.text) : "";
  const done = (s = set) => s.items.filter(i => clips.has(clipKey(i.text))).length;
  const totalDone = useMemo(() => SETS.reduce((a, s) => a + done(s), 0), [clips]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { allClips().then(cs => setClips(new Map(cs.map(c => [c.key, c])))); }, []);
  useEffect(() => { try { localStorage.setItem(NAME_KEY, speaker); } catch { /* ignore */ } }, [speaker]);
  useEffect(() => () => { stream.current?.getTracks().forEach(t => t.stop()); cancelAnimationFrame(meterRaf.current); }, []);

  // ── microphone ──
  const enableMic = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true } });
      stream.current = s;
      const ac = new AudioContext();
      const an = ac.createAnalyser(); an.fftSize = 1024;
      ac.createMediaStreamSource(s).connect(an);
      analyser.current = an;
      setMic("on");
      setStatus({ kind: "idle", text: "Ready. Press ● (or Space) and say the word clearly." });
      const buf = new Float32Array(an.fftSize);
      const loop = () => { an.getFloatTimeDomainData(buf); setLevel(rms(buf)); meterRaf.current = requestAnimationFrame(loop); };
      loop();
    } catch {
      setMic("denied");
      setStatus({ kind: "warn", text: "The microphone is blocked. Allow it in the browser's address bar, then try again." });
    }
  };

  // ── record ──
  const start = useCallback(() => {
    if (!stream.current || !analyser.current || rec.current || !item) return;
    const mime = pickMime();
    const mr = new MediaRecorder(stream.current, mime ? { mimeType: mime } : undefined);
    const chunks: Blob[] = [];
    mr.ondataavailable = e => e.data.size && chunks.push(e.data);
    const r = { mr, t0: performance.now(), onset: null as number | null, last: null as number | null, floor: [] as number[], raf: 0, stopAt: undefined as number | undefined };
    rec.current = r;
    const target = { key, text: item.text };
    mr.onstop = async () => {
      cancelAnimationFrame(r.raf);
      rec.current = null;
      const end = r.stopAt ?? performance.now();
      if (r.onset === null) { setStatus({ kind: "warn", text: "No voice heard — move closer to the microphone and try again." }); return; }
      const blob = new Blob(chunks, { type: mr.mimeType || mime || "audio/webm" });
      const startS = Math.max(0, (r.onset - r.t0) / 1000 - 0.12);
      const endS = Math.min((end - r.t0) / 1000, ((r.last ?? end) - r.t0) / 1000 + 0.22);
      const clip: Clip = { key: target.key, blob, start: startS, dur: Math.max(0.2, endS - startS), mime: blob.type, at: Date.now() };
      await putClip(clip); rememberLocal(clip);
      setClips(m => new Map(m).set(clip.key, clip));
      setStatus({ kind: "saved", text: `Saved “${target.text}”.` });
      try {
        const b = await decodeClip(clip); playBuffer(b);
        if (autoNext) setTimeout(() => goNext(true), b.duration * 1000 + 450);
      } catch { setStatus({ kind: "warn", text: "Saved, but this browser could not play it back." }); }
    };
    mr.start();
    setStatus({ kind: "rec", text: handsFree ? "Listening… speak now — it stops by itself after a short pause." : "Recording… press ■ (or Space) to stop." });
    const an = analyser.current; const buf = new Float32Array(an.fftSize);
    const tick = () => {
      an.getFloatTimeDomainData(buf);
      const v = rms(buf), t = performance.now();
      if (t - r.t0 < 220) r.floor.push(v);
      const floor = r.floor.length ? r.floor.reduce((a, b) => a + b, 0) / r.floor.length : 0.005;
      const th = Math.max(0.018, floor * 3.2);
      if (t - r.t0 > 120 && v > th) { if (r.onset === null) r.onset = t; r.last = t; }
      const silentFor = r.last ? t - r.last : 0;
      if ((handsFree && r.onset !== null && silentFor > 650) || t - r.t0 > 6000) { stop(); return; }
      r.raf = requestAnimationFrame(tick);
    };
    r.raf = requestAnimationFrame(tick);
  }, [item, key, handsFree, autoNext]); // eslint-disable-line react-hooks/exhaustive-deps

  const stop = () => {
    const r = rec.current; if (!r) return;
    r.stopAt = performance.now();
    cancelAnimationFrame(r.raf);
    if (r.mr.state !== "inactive") r.mr.stop();
  };
  const toggle = () => (rec.current ? stop() : start());

  const play = async () => {
    const c = clips.get(key); if (!c) return;
    try { playBuffer(await decodeClip(c)); } catch { /* ignore */ }
  };
  const remove = async () => {
    if (!clips.has(key)) return;
    await deleteClip(key); rememberLocal(null, key);
    setClips(m => { const n = new Map(m); n.delete(key); return n; });
    setStatus({ kind: "idle", text: "Deleted. Record it again when ready." });
  };

  const clipsRef = useRef(clips); clipsRef.current = clips;
  function goNext(skipDone = false) {
    setIdx(i => {
      let j = i + 1;
      if (skipDone) while (j < set.items.length && clipsRef.current.has(clipKey(set.items[j].text))) j++;
      return Math.min(j, set.items.length - 1);
    });
  }
  const goPrev = () => setIdx(i => Math.max(0, i - 1));

  // ── keyboard ──
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === "INPUT") return;
      if (e.code === "Space") { e.preventDefault(); if (mic === "on") toggle(); }
      else if (e.key === "p" || e.key === "P") play();
      else if (e.key === "Enter" || e.key === "ArrowRight") goNext();
      else if (e.key === "ArrowLeft") goPrev();
      else if (e.key === "Delete") remove();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  // ── export ──
  const exportZip = async () => {
    setExporting("Preparing…");
    try {
      const files: { name: string; data: Uint8Array }[] = [];
      const items: Record<string, string> = {};
      let n = 0;
      for (const s of SETS) {
        let k = 0;
        for (const it of s.items) {
          k++;
          const c = clips.get(clipKey(it.text)); if (!c || items[c.key]) continue;
          const name = `clips/${s.id}-${String(k).padStart(3, "0")}.wav`;
          files.push({ name, data: await toWav(await decodeClip(c)) });
          items[c.key] = name; n++;
          if (n % 10 === 0) setExporting(`Converting ${n} / ${clips.size}…`);
        }
      }
      const manifest = { speaker, created: new Date().toISOString(), items };
      files.unshift({ name: "manifest.json", data: new TextEncoder().encode(JSON.stringify(manifest, null, 1)) });
      const url = URL.createObjectURL(zip(files));
      const a = document.createElement("a"); a.href = url; a.download = "akshara-audio.zip"; a.click();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
      setExporting(`Done — ${n} clips. Unzip into public/audio/ of the project.`);
    } catch (err) {
      setExporting("Export failed: " + (err as Error).message);
    }
  };

  const isRec = status.kind === "rec";
  return (
    <div className="rc">
      <div className="rc-top">
        <div>
          <h2 className="rc-title">ध्वनिमुद्रणम् <span>· Record the pronunciations</span></h2>
          <p className="rc-sub">Record each letter and word once in your voice. The game will play your recordings instead of the synthetic Hindi voice. Recordings are kept in this browser until you export them.</p>
        </div>
        <button className="rc-close" onClick={onClose}>← Back</button>
      </div>

      <div className="rc-bar">
        {mic !== "on"
          ? <button className="rc-mic" onClick={enableMic}>🎙️ Turn on microphone</button>
          : <div className="rc-meter" title="Input level"><i style={{ width: `${Math.min(100, level * 600)}%` }} /></div>}
        <label>Speaker <input value={speaker} onChange={e => setSpeaker(e.target.value)} placeholder="your name" /></label>
        <label className="rc-tick"><input type="checkbox" checked={handsFree} onChange={e => setHandsFree(e.target.checked)} /> Stop automatically after a pause</label>
        <label className="rc-tick"><input type="checkbox" checked={autoNext} onChange={e => setAutoNext(e.target.checked)} /> Go to the next item after saving</label>
        <span className="rc-total">{totalDone} / {TOTAL} recorded</span>
      </div>

      <div className="rc-sets">
        {SETS.map((s, i) => (
          <button key={s.id} className={`rc-set ${i === group ? "on" : ""} ${s.optional ? "opt" : ""}`} onClick={() => { setGroup(i); setIdx(0); }}>
            <b>{s.sa}</b><small>{s.en}{s.optional ? " · optional" : ""}</small>
            <em><i style={{ width: `${(done(s) / s.items.length) * 100}%` }} /></em>
            <span>{done(s)} / {s.items.length}</span>
          </button>
        ))}
      </div>
      <p className="rc-why">{set.why}</p>

      {item && (
        <div className={`rc-card ${isRec ? "rc-recording" : ""} ${clips.has(key) ? "rc-has" : ""}`}>
          <button className="rc-nav" onClick={goPrev} disabled={idx === 0}>◀</button>
          <div className="rc-item">
            <span className="rc-count">{idx + 1} / {set.items.length}</span>
            <span className="rc-text">{item.text}</span>
            <span className="rc-roman">{item.roman}{item.note ? ` · ${item.note}` : ""}</span>
            <div className="rc-btns">
              <button className={`rc-rec ${isRec ? "on" : ""}`} onClick={toggle} disabled={mic !== "on"} title="Space">{isRec ? "■" : "●"}</button>
              <button onClick={play} disabled={!clips.has(key) || isRec} title="P">▶ Play</button>
              <button onClick={remove} disabled={!clips.has(key) || isRec} title="Delete">✕ Delete</button>
            </div>
            <p className={`rc-status rc-${status.kind}`}>{status.text}</p>
          </div>
          <button className="rc-nav" onClick={() => goNext()} disabled={idx >= set.items.length - 1}>▶</button>
        </div>
      )}

      <div className="rc-grid">
        {set.items.map((it, i) => (
          <button key={it.text + i} className={`rc-cell ${i === idx ? "on" : ""} ${clips.has(clipKey(it.text)) ? "ok" : ""}`} onClick={() => setIdx(i)}>{it.text}</button>
        ))}
      </div>

      <div className="rc-export">
        <button onClick={exportZip} disabled={!clips.size || !!(exporting && exporting.startsWith("Conv"))}>⤓ Export all recordings (zip)</button>
        <span>{exporting ?? "The zip has manifest.json + WAV clips. Unzip it into the project's public/audio/ folder — every learner then hears your voice."}</span>
      </div>
      <p className="rc-keys">Keyboard: <kbd>Space</kbd> record/stop · <kbd>P</kbd> play · <kbd>Enter</kbd> next · <kbd>←</kbd> back · <kbd>Delete</kbd> remove</p>
    </div>
  );
};

function rms(b: Float32Array) { let s = 0; for (let i = 0; i < b.length; i++) s += b[i] * b[i]; return Math.sqrt(s / b.length); }

export default Recorder;
