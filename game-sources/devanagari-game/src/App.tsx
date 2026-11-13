import React, { useEffect, useState } from "react";
import "./App.css";
import ReferenceChart from "./components/ReferenceChart";
import VarnaVibhaga from "./components/VarnaVibhaga";
import Journey from "./game/Journey";
import Lekhana from "./likhana/Lekhana";
import StrokeReview from "./likhana/StrokeReview";
import Recorder from "./audio/Recorder";
import { initAudio } from "./audio/clips";
import SankhyahPage from "./sankhyah/SankhyahPage";

// ── the game's name, in one place ──
export const APP_NAME = { sa: "अक्षराभ्यासः", en: "Akṣarābhyāsaḥ", tagline: "Learn to read and write Devanāgarī — for Saṃskṛtam and Hindi" };

type View = "game" | "write" | "learn" | "vibhaga" | "sankhyah" | "record" | "review";

const NAV: { v: View; icon: string; sa: string; en: string }[] = [
  { v: "game",    icon: "🗺️", sa: "यात्रा",        en: "Journey" },
  { v: "write",   icon: "✍️", sa: "लेखनाभ्यासः",   en: "Writing" },
  { v: "learn",   icon: "📚", sa: "वर्णमाला",      en: "Alphabet chart" },
  { v: "vibhaga", icon: "🔍", sa: "वर्णविच्छेदः",   en: "Word breakdown" },
  { v: "sankhyah", icon: "🔢", sa: "संख्याः", en: "Numbers" },
];

// faint floating letters behind everything (decorative)
const BG_LETTERS = ["अ", "क", "प", "श्री", "ज्ञ", "म", "ऋ", "त्र", "स", "ई", "ल", "ह", "ध", "ण", "य", "औ"];
const BG_COLORS = ["#f97316", "#ec4899", "#8b5cf6", "#06b6d4", "#10b981", "#eab308"];
const Backdrop: React.FC = () => (
  <>
    <div className="bg-blobs" aria-hidden><i /><i /><i /><i /></div>
    <div className="bg-letters" aria-hidden>
      {BG_LETTERS.map((l, i) => (
        <span key={i} style={{
          left: `${(i * 37 + 7) % 92}%`, top: `${(i * 53 + 11) % 88}%`,
          fontSize: `${3.5 + ((i * 7) % 6)}rem`,
          "--c": BG_COLORS[i % BG_COLORS.length], "--d": `${9 + (i % 5) * 2}s`, "--delay": `${-i * 1.3}s`,
        } as React.CSSProperties}>{l}</span>
      ))}
    </div>
  </>
);

const App: React.FC = () => {
  const [view, setView] = useState<View>("game");

  useEffect(() => {
    initAudio();
  }, []);

  return (
    <div className="app-root">
      <Backdrop />
      <header className="app-header">
        <h1>{APP_NAME.sa}<small>{APP_NAME.en}</small></h1>
        <p>{APP_NAME.tagline}</p>
        <div className="view-switch">
          {NAV.map(n => (
            <button key={n.v} className={`view-btn ${view === n.v ? "view-btn-active" : ""}`} onClick={() => setView(n.v)}>
              <span>{n.icon} {n.sa}</span><small>{n.en}</small>
            </button>
          ))}
        </div>
      </header>

      {view === "game" ? <Journey />
        : view === "write" ? <Lekhana />
        : view === "learn" ? <ReferenceChart />
        : view === "vibhaga" ? <VarnaVibhaga />
        : view === "sankhyah" ? <SankhyahPage />
        : view === "record" ? <Recorder onClose={() => setView("game")} />
        : <StrokeReview onClose={() => setView("write")} />}

      <footer className="app-footer">
        <span>🧑‍🏫 शिक्षकेभ्यः · For teachers:</span>
        <button onClick={() => setView("record")}>🎙️ ध्वनिमुद्रणम् · Record audio</button>
        <button onClick={() => setView("review")}>✏️ समीक्षा · Stroke review</button>
      </footer>
    </div>
  );
};

export default App;
