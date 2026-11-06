import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  DEVANAGARI_LETTERS, MATRAS, WORDS, SENTENCES,
  HALANT_FORMS, CONJUNCTS,
  shuffle, reportScore,
} from './devanagariData';

import { sfx } from "./sounds";
import "./App.css";
import ReferenceChart from "./components/ReferenceChart";
import VarnaVibhaga from "./components/VarnaVibhaga";

// ─── Levels ──────────────────────────────────────────────────────
const LEVELS = [
  { id: 1, name: "Svaras",      emoji: "🌸", desc: "Vowels",            toPass: 20 },
  { id: 2, name: "Vyañjana I",  emoji: "🌿", desc: "Consonants 1–15",   toPass: 20 },
  { id: 3, name: "Vyañjana II", emoji: "🌊", desc: "Consonants 16–34",  toPass: 20 },
  { id: 4, name: "Mātrās",      emoji: "✨", desc: "Vowel Signs",        toPass: 20 },
  { id: 5, name: "Śabda",       emoji: "📖", desc: "Words",             toPass: 25 },
  { id: 6, name: "Vākya",       emoji: "💬", desc: "Sentences",         toPass: 20 },
  { id: 7, name: "Halant",      emoji: "🔗", desc: "Halant Forms",      toPass: 20 },
  { id: 8, name: "Saṃyukta",    emoji: "⚡", desc: "Conjunct Letters",  toPass: 20 },
];

const STREAK_BONUS = [0, 0, 5, 10, 15, 20];
const POINTS_PER_CORRECT = 10;

const pickRandom = <T,>(arr: T[], n: number): T[] => {
  const copy = [...arr];
  const res: T[] = [];
  for (let i = 0; i < Math.min(n, copy.length); i++) {
    const idx = Math.floor(Math.random() * copy.length);
    res.push(copy.splice(idx, 1)[0]);
  }
  return res;
};

type Choice  = { char: string; label: string; sublabel?: string };
type Question = {
  choices: Choice[];
  answer: string;
  prompt: React.ReactNode;
};
type QueueItem = () => Question;

const VOWELS  = DEVANAGARI_LETTERS.filter(l => l.type === "vowel");
const CONS1   = DEVANAGARI_LETTERS.filter(l => l.type === "consonant").slice(0, 15);
const CONS2   = DEVANAGARI_LETTERS.filter(l => l.type === "consonant").slice(15);
const ALL_LET = DEVANAGARI_LETTERS.filter(l => l.type !== "number");

// ─── Letter question ─────────────────────────────────────────────
const makeLetterQ = (
  forcedPool: typeof DEVANAGARI_LETTERS,
  distractorPool: typeof DEVANAGARI_LETTERS
): Question => {
  const [target] = pickRandom(forcedPool, 1);
  const others = pickRandom(distractorPool.filter(l => l.char !== target.char), 3);
  const choices = shuffle([target, ...others]).map(o => ({
    char: o.char, label: o.char, sublabel: o.roman
  }));
  return {
    choices,
    answer: target.char,
    prompt: (
      <div className="q-prompt">
        <span className="q-label">Which letter makes the sound?</span>
        <span className="q-big-roman">{target.roman}</span>
      </div>
    ),
  };
};

// ─── Word questions (2 types) ─────────────────────────────────────
const makeWordQ = (w: typeof WORDS[0]): Question => {
  const qType = Math.random() > 0.5 ? 0 : 1;
  const others = pickRandom(WORDS.filter(x => x.word !== w.word), 3);
  const choices = shuffle([w, ...others]).map(x => ({
    char: x.word, label: x.word, sublabel: x.roman
  }));
  if (qType === 0) {
    return {
      choices,
      answer: w.word,
      prompt: (
        <div className="q-prompt">
          <span className="q-label">Which word means</span>
          <span className="q-big-roman">{w.meaning}</span>
        </div>
      ),
    };
  } else {
    return {
      choices: shuffle([w, ...others]).map(x => ({
        char: x.word, label: x.word, sublabel: x.meaning
      })),
      answer: w.word,
      prompt: (
        <div className="q-prompt">
          <span className="q-label">Find the Devanagari for</span>
          <span className="q-big-roman">{w.roman}</span>
        </div>
      ),
    };
  }
};

// ─── Halant questions (2 types) ───────────────────────────────────
const makeHalantQ = (h: typeof HALANT_FORMS[0]): Question => {
  const others = pickRandom(HALANT_FORMS.filter(x => x.base !== h.base), 3);
  const qType = Math.random() > 0.5 ? 0 : 1;
  if (qType === 0) {
    return {
      choices: shuffle([h, ...others]).map(x => ({
        char: x.halant, label: x.halant, sublabel: x.roman + "·"
      })),
      answer: h.halant,
      prompt: (
        <div className="q-prompt">
          <span className="q-label">Halant form of</span>
          <span className="q-big-devanagari">{h.base}</span>
        </div>
      ),
    };
  } else {
    return {
      choices: shuffle([h, ...others]).map(x => ({
        char: x.halant, label: x.halant, sublabel: x.base
      })),
      answer: h.halant,
      prompt: (
        <div className="q-prompt">
          <span className="q-label">Halant form for sound</span>
          <span className="q-big-roman">{h.roman}</span>
        </div>
      ),
    };
  }
};

// ─── Conjunct questions (2 types) ────────────────────────────────
const makeConjunctQ = (c: typeof CONJUNCTS[0]): Question => {
  const others = pickRandom(CONJUNCTS.filter(x => x.char !== c.char), 3);
  const qType = Math.random() > 0.5 ? 0 : 1;
  if (qType === 0) {
    return {
      choices: shuffle([c, ...others]).map(x => ({
        char: x.char, label: x.char, sublabel: x.roman
      })),
      answer: c.char,
      prompt: (
        <div className="q-prompt">
          <span className="q-label">Which conjunct is</span>
          <span className="q-big-roman">{c.components}</span>
        </div>
      ),
    };
  } else {
    return {
      choices: shuffle([c, ...others]).map(x => ({
        char: x.char, label: x.char, sublabel: x.roman
      })),
      answer: c.char,
      prompt: (
        <div className="q-prompt">
          <span className="q-label">Word example:</span>
          <span className="q-big-roman">{c.example}</span>
          <span className="q-label">Pick the conjunct</span>
        </div>
      ),
    };
  }
};

const calcStars = (correct: number, attempts: number) => {
  if (!attempts) return 0;
  const acc = correct / attempts;
  return acc >= 0.9 ? 3 : acc >= 0.7 ? 2 : 1;
};

// ─── Build per-level shuffled question queues ─────────────────────
const buildQueue = (levelId: number): QueueItem[] => {
  let items: QueueItem[] = [];
  if (levelId === 1) {
    items = shuffle([...VOWELS]).map(v => () => makeLetterQ([v], ALL_LET));
  } else if (levelId === 2) {
    items = shuffle([...CONS1]).map(c => () => makeLetterQ([c], ALL_LET));
  } else if (levelId === 3) {
    items = shuffle([...CONS2]).map(c => () => makeLetterQ([c], ALL_LET));
  } else if (levelId === 4) {
    items = shuffle([...MATRAS]).map(m => () => {
      const others = pickRandom(MATRAS.filter(x => x.symbol !== m.symbol), 3);
      return {
        choices: shuffle([m, ...others]).map(x => ({
          char: x.symbol, label: x.symbol, sublabel: x.sound
        })),
        answer: m.symbol,
        prompt: (
          <div className="q-prompt">
            <span className="q-label">Mātrā for vowel</span>
            <span className="q-big-roman">{m.vowel} — {m.sound}</span>
            <span className="q-example">{m.example}</span>
          </div>
        ),
      };
    });
  } else if (levelId === 5) {
    items = shuffle([...WORDS]).map(w => () => makeWordQ(w));
  } else if (levelId === 6) {
    items = shuffle([...SENTENCES]).map(s => () => ({
      choices: shuffle(s.options).map(w => ({ char: w, label: w })),
      answer: s.blank,
      prompt: (
        <div className="q-prompt">
          <span className="q-label">Fill the blank</span>
          <span className="q-big-sentence">{s.sentence.replace("___", "____")}</span>
          <span className="q-example">{s.meaning}</span>
        </div>
      ),
    }));
  } else if (levelId === 7) {
    items = shuffle([...HALANT_FORMS]).map(h => () => makeHalantQ(h));
  } else {
    items = shuffle([...CONJUNCTS]).map(c => () => makeConjunctQ(c));
  }
  return shuffle(items);
};

// ─────────────────────────────────────────────────────────────────
const App: React.FC = () => {
  const [levelIdx, setLevelIdx]               = useState(0);
  const [totalXP, setTotalXP]                 = useState(0);
  const [levelCorrect, setLevelCorrect]       = useState(0);
  const [levelAttempts, setLevelAttempts]     = useState(0);
  const [streak, setStreak]                   = useState(0);
  const [feedback, setFeedback]               = useState<"idle"|"correct"|"wrong">("idle");
  const [lastPicked, setLastPicked]           = useState<string|null>(null);
  const [showModal, setShowModal]             = useState(false);
  const [confetti, setConfetti]               = useState(false);
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);
  const [levelStars, setLevelStars]           = useState<Record<number,number>>({});
  const [appView, setAppView]                 = useState<"game"|"learn"|"vibhaga">("game");
  const [queue, setQueue]                     = useState<QueueItem[]>(() => buildQueue(1));
  const [queueIdx, setQueueIdx]               = useState(0);
  const [gameComplete, setGameComplete]       = useState(false);
  const [locked, setLocked]                   = useState(false);

  useEffect(() => {
    try {
      if ((window as any).BhavaSession) {
        (window as any).BhavaSession.start("devanagari-game");
      }
    } catch (_) {}
  }, []);

  const level    = LEVELS[Math.min(levelIdx, LEVELS.length - 1)];
  const toPass   = level.toPass;
  const progress = Math.min((levelCorrect / toPass) * 100, 100);

  const currentQuestion: Question = useMemo(() => {
    const fn = queue[queueIdx % queue.length];
    return fn();
  }, [queue, queueIdx]);

  const advance = useCallback(() => {
    setFeedback("idle");
    setLastPicked(null);
    setLocked(false);
    setQueueIdx(i => {
      const next = i + 1;
      if (next >= queue.length) {
        setQueue(buildQueue(LEVELS[levelIdx].id));
        return 0;
      }
      return next;
    });
  }, [queue, levelIdx]);

  const handleClick = useCallback((char: string) => {
    if (locked || feedback !== "idle") return;
    setLocked(true);
    setLastPicked(char);

    if (char === currentQuestion.answer) {
      const newStreak = streak + 1;
      const bonus = STREAK_BONUS[Math.min(newStreak, STREAK_BONUS.length - 1)];
      setStreak(newStreak);
      setTotalXP(x => x + POINTS_PER_CORRECT + bonus);
      setLevelCorrect(c => c + 1);
      setLevelAttempts(a => a + 1);
      setFeedback("correct");
      if (newStreak >= 3) sfx.streak(); else sfx.correct();

      if (levelCorrect + 1 >= toPass) {
        sfx.levelUp();
        setConfetti(true);
        setCompletedLevels(prev => [...new Set([...prev, levelIdx])]);
        const stars = calcStars(levelCorrect + 1, levelAttempts + 1);
        setLevelStars(prev => ({ ...prev, [levelIdx]: Math.max(prev[levelIdx] ?? 0, stars) }));
        reportScore(levelCorrect + 1, levelAttempts + 1, level.name);
        setTimeout(() => {
          setConfetti(false);
          setShowModal(true);
          setLocked(false);
        }, 1200);
      } else {
        setTimeout(advance, 900);
      }
    } else {
      sfx.wrong();
      setStreak(0);
      setLevelAttempts(a => a + 1);
      setFeedback("wrong");
      setTimeout(advance, 1000);
    }
  }, [locked, feedback, currentQuestion, streak, levelCorrect, levelAttempts, toPass, levelIdx, level.name, advance]);

  const goNextLevel = () => {
    if (levelIdx === LEVELS.length - 1) {
      setShowModal(false);
      setGameComplete(true);
      reportScore(Object.values(levelStars).reduce((a,b)=>a+b,0), LEVELS.length * 3, "full-game");
      return;
    }
    const nextIdx = levelIdx + 1;
    setShowModal(false);
    setLevelCorrect(0); setLevelAttempts(0);
    setStreak(0); setFeedback("idle"); setLastPicked(null);
    setLevelIdx(nextIdx);
    setQueue(buildQueue(LEVELS[nextIdx].id));
    setQueueIdx(0); setLocked(false);
  };

  const restartGame = () => {
    setGameComplete(false); setShowModal(false);
    setLevelIdx(0); setTotalXP(0);
    setLevelCorrect(0); setLevelAttempts(0);
    setStreak(0); setFeedback("idle"); setLastPicked(null);
    setCompletedLevels([]); setLevelStars({});
    setQueue(buildQueue(1)); setQueueIdx(0); setLocked(false);
  };

 const selectLevel = (idx: number) => {
  setLevelIdx(idx);
  setLevelCorrect(0); setLevelAttempts(0);
  setStreak(0); setFeedback("idle"); setLastPicked(null);
  setShowModal(false);
  setQueue(buildQueue(LEVELS[idx].id));
  setQueueIdx(0); setLocked(false);
};

  const isLargeLevel = level.id >= 5;

  return (
    <div className="app-root">
      {confetti && (
        <div className="confetti-wrap" aria-hidden>
          {Array.from({ length: 60 }).map((_, i) => (
            <span key={i} className="confetti-piece" style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 1.2}s`,
              animationDuration: `${1.5 + Math.random()}s`,
              background: `hsl(${Math.floor(Math.random() * 360)},80%,60%)`
            }} />
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-glow" />
            <div className="modal-icon">🎉</div>
            <h2 className="modal-title">Level Complete!</h2>
            <p className="modal-sub">{level.emoji} {level.name}</p>
            <div className="modal-stars">
              {[1,2,3].map(n => (
                <span key={n} className={`mstar ${n <= calcStars(levelCorrect, levelAttempts) ? "mstar-on" : ""}`}>★</span>
              ))}
            </div>
            <div className="modal-xp">+{levelCorrect * POINTS_PER_CORRECT} XP earned</div>
            <button className="modal-btn" onClick={goNextLevel}>
              {levelIdx < LEVELS.length - 1
                ? `Next → ${LEVELS[levelIdx + 1].emoji} ${LEVELS[levelIdx + 1].name}`
                : "🏆 See Final Score!"}
            </button>
          </div>
        </div>
      )}

      {gameComplete && (
        <div className="finale-overlay">
          <div className="finale-box">
            <div className="finale-fireworks">🎆🎇✨🎆🎇</div>
            <h1 className="finale-title">अभिनन्दनम्!</h1>
            <p className="finale-sub">You completed all 8 levels!</p>
            <div className="finale-stats">
              <div className="finale-stat">
                <span className="finale-stat-val">⚡ {totalXP}</span>
                <span className="finale-stat-label">Total XP</span>
              </div>
              <div className="finale-stat">
                <span className="finale-stat-val">
                  {Object.values(levelStars).reduce((a, b) => a + b, 0)}
                  <span style={{ fontSize: "1rem" }}> / 24 ⭐</span>
                </span>
                <span className="finale-stat-label">Stars</span>
              </div>
              <div className="finale-stat">
                <span className="finale-stat-val">🏆 {LEVELS.length}</span>
                <span className="finale-stat-label">Levels</span>
              </div>
            </div>
            <div className="finale-level-stars">
              {LEVELS.map((lv, idx) => (
                <div key={lv.id} className="finale-lv-row">
                  <span>{lv.emoji} {lv.name}</span>
                  <span>
                    {[1,2,3].map(n => <span key={n}>{n <= (levelStars[idx] ?? 0) ? "⭐" : "☆"}</span>)}
                  </span>
                </div>
              ))}
            </div>
            <div className="finale-rank">
              {totalXP >= 700 ? "🥇 Sanskrit Scholar!" :
               totalXP >= 450 ? "🥈 Devanagari Reader!" :
               "🥉 Script Learner!"}
            </div>
            <button className="finale-btn" onClick={restartGame}>🔄 Play Again</button>
          </div>
        </div>
      )}

      <header className="app-header">
        <h1>Devanāgarī Learning Game</h1>
        <p>Tap the correct answer!</p>
        <div className="view-switch">
          <button className={`view-btn ${appView === "game" ? "view-btn-active" : ""}`}
            onClick={() => setAppView("game")}>🎮 Play Game</button>
          <button className={`view-btn ${appView === "learn" ? "view-btn-active" : ""}`}
            onClick={() => setAppView("learn")}>📚 Reference Chart</button>
          <button className={`view-btn ${appView === "vibhaga" ? "view-btn-active" : ""}`}
            onClick={() => setAppView("vibhaga")}>🔍 वर्णविच्छेदः</button>
        </div>
      </header>

      {appView === "vibhaga" ? (
        <VarnaVibhaga />
      ) : appView === "learn" ? (
        <ReferenceChart />
      ) : (
        <>
          <nav className="level-map">
            {LEVELS.map((lv, idx) => {
              const isActive = idx === levelIdx;
              const isDone   = completedLevels.includes(idx);
              const isLocked = false; // All levels always open
              const stars    = levelStars[idx] ?? 0;
              return (
                <button key={lv.id}
                  className={`level-node ${isActive ? "lnode-active" : ""} ${isDone ? "lnode-done" : ""} ${isLocked ? "lnode-locked" : ""}`}
                  onClick={() => selectLevel(idx)}
                >
                  <span className="lnode-icon">{isDone ? "✓" : lv.emoji}</span>
                  <span className="lnode-name">{lv.name}</span>
                  <span className="lnode-desc">{lv.desc}</span>
                  {isDone && (
                    <span className="lnode-stars">
                      {[1,2,3].map(n => <span key={n}>{n <= stars ? "⭐" : "☆"}</span>)}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <section className="level-status">
            <div className="lvl-header-row">
              <span className="lvl-badge">{level.emoji} Level {level.id} — {level.name}</span>
              {streak >= 2 && (
                <span className="streak-badge">
                  🔥 {streak}× streak! +{STREAK_BONUS[Math.min(streak, STREAK_BONUS.length - 1)]} XP bonus
                </span>
              )}
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
              <span className="progress-label">{levelCorrect} / {toPass}</span>
            </div>
            <div className="stats-row">
              <span className="stat-chip">⚡ {totalXP} XP</span>
              <span className="stat-chip">🎯 {levelAttempts > 0 ? Math.round((levelCorrect / levelAttempts) * 100) : 0}%</span>
              <span className="stat-chip">
                {[1,2,3].map(n => <span key={n}>{n <= calcStars(levelCorrect, levelAttempts) ? "⭐" : "☆"}</span>)}
              </span>
            </div>
          </section>

          <main className="game-center">
            <div className={`question-card ${feedback === "correct" ? "q-correct-flash" : ""} ${feedback === "wrong" ? "q-wrong-shake" : ""}`}>
              {currentQuestion.prompt}
            </div>

            <div className={`feedback-banner ${feedback === "correct" ? "fb-correct" : ""} ${feedback === "wrong" ? "fb-wrong" : ""} ${feedback === "idle" ? "fb-hidden" : ""}`}>
              {feedback === "correct" ? "✅ शाबाश! Correct!" : "❌ Try again!"}
            </div>

            <div className={`choices-grid ${isLargeLevel ? "choices-large" : ""}`}>
              {currentQuestion.choices.map((choice, i) => {
                const isCorrect = feedback !== "idle" && choice.char === currentQuestion.answer;
                const isWrong   = feedback === "wrong" && choice.char === lastPicked;
                return (
                  <button
                    key={i}
                    className={`choice-btn
                      ${isCorrect ? "choice-correct" : ""}
                      ${isWrong   ? "choice-wrong"   : ""}
                    `}
                    onClick={() => handleClick(choice.char)}
                    disabled={feedback !== "idle"}
                  >
                    <span className="choice-main">{choice.label}</span>
                    {choice.sublabel && <span className="choice-sub">{choice.sublabel}</span>}
                  </button>
                );
              })}
            </div>
          </main>
        </>
      )}
    </div>
  );
};

export default App;