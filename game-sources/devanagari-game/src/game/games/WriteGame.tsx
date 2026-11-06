// ═══════════════════════════════════════════════════════════════
//  WriteGame — लेखनम् stations in the यात्रा
//  trace: watch → trace each letter · dictation: hear it, write freehand
// ═══════════════════════════════════════════════════════════════
import React, { useRef, useState } from "react";
import type { GameApi } from "../GameShell";
import type { WriteStation } from "../stations";
import WritingPad, { DEFAULT_SETTINGS, type PadMode } from "../../likhana/WritingPad";
import type { Verdict } from "../../likhana/engine";
import { shuffle, DEVANAGARI_LETTERS } from "../../devanagariData";
import { speak } from "../../speech";
import "../../likhana/likhana.css";

const ROMAN: Record<string, string> = Object.fromEntries(DEVANAGARI_LETTERS.map(l => [l.char, l.roman]));
const say = (t: string) => { try { speak(t); } catch { /* no voice */ } };

const WriteGame: React.FC<{ station: WriteStation; api: GameApi }> = ({ station, api }) => {
  const apiRef = useRef(api); apiRef.current = api;
  const [letters] = useState(() => shuffle(station.pool).slice(0, station.rounds));
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState<PadMode>(station.dictation ? "write" : "watch");
  const [passed, setPassed] = useState(false);
  const letter = letters[idx];

  React.useEffect(() => {
    apiRef.current.progress(idx, letters.length);
    setPassed(false);
    setPhase(station.dictation ? "write" : "watch");
    const t = setTimeout(() => say(letter), 300);
    return () => clearTimeout(t);
  }, [idx]); // eslint-disable-line react-hooks/exhaustive-deps

  const onResult = (v: Verdict) => {
    if (v.score >= station.pass) {
      setPassed(true);
      apiRef.current.correct(10 + Math.round((v.score - station.pass) / 5));
      setTimeout(() => {
        if (apiRef.current.isOver()) return;
        if (idx + 1 >= letters.length) { apiRef.current.progress(letters.length, letters.length); apiRef.current.finish(); }
        else setIdx(i => i + 1);
      }, 1800);
    } else apiRef.current.wrong();
  };

  const settings = { ...DEFAULT_SETTINGS, guide: station.guide, numbers: station.guide !== "none" };
  return (
    <div className="wg">
      <div className="ab-prompt">
        <span className="ab-round">{idx + 1} / {letters.length}</span>
        {station.dictation
          ? <div className="ab-target ab-target-hidden">{passed ? letter : "?"}</div>
          : <div className="ab-target ab-target-solid">{letter}</div>}
        <div className="ab-clues">
          <button className="ab-speak" onClick={() => say(letter)} title="Hear it">🔊</button>
          <span className="ab-roman">{ROMAN[letter]}</span>
        </div>
        <div className="ab-task">
          {station.dictation ? `Listen and write the letter — score ${station.pass}+ to pass.`
            : phase === "watch" ? "Watch how it is written…" : `Trace it, then press Check — score ${station.pass}+ to pass.`}
        </div>
      </div>
      <WritingPad key={letter + idx} letter={letter} mode={phase} settings={settings} hideLetter={station.dictation}
        onWatched={() => setTimeout(() => setPhase("trace"), 500)} onResult={onResult} maxHeight={360} />
    </div>
  );
};

export default WriteGame;
