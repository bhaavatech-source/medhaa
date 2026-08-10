import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/parent-demo.css';

type Band = 'Blossoming' | 'Growing Well' | 'Just Starting';

const bandColor: Record<Band, string> = {
  Blossoming: '#10b981',
  'Growing Well': '#3b82f6',
  'Just Starting': '#f59e0b',
};

const bandPercent: Record<Band, number> = {
  Blossoming: 88,
  'Growing Well': 65,
  'Just Starting': 40,
};

const domainScores: { key: string; label: string; icon: string; band: Band; desc: string }[] = [
  { key: 'cognitive', label: 'Thinking & Focus', icon: '🧠', band: 'Blossoming', desc: 'Solves puzzles and stays focused well for her age.' },
  { key: 'emotional', label: 'Feelings & Friendships', icon: '💛', band: 'Growing Well', desc: "Understands others' feelings, still building confidence." },
  { key: 'social', label: 'Teamwork & Leading', icon: '🤝', band: 'Blossoming', desc: 'Works well with classmates and takes initiative.' },
  { key: 'engineering', label: 'Builder & Maker Skills', icon: '⚙️', band: 'Just Starting', desc: 'Enjoys building but is still learning to plan before building.' },
  { key: 'science', label: 'Curiosity About the World', icon: '🔬', band: 'Growing Well', desc: 'Asks good "why" questions about nature and things around her.' },
  { key: 'life-skills', label: 'Everyday Independence', icon: '🌟', band: 'Growing Well', desc: 'Handles routines well, still learning to problem-solve solo.' },
  { key: 'creativity', label: 'Imagination', icon: '🎨', band: 'Blossoming', desc: 'Comes up with original ideas and stories easily.' },
  { key: 'language', label: 'Words & Expression', icon: '📚', band: 'Blossoming', desc: 'Strong vocabulary and clear expression for grade 4.' },
];

const homeActivities = [
  { domain: 'Builder & Maker Skills', tip: 'Before she builds with blocks or a kit, ask her to describe her plan out loud first — it builds the "think before you build" habit.' },
  { domain: 'Curiosity About the World', tip: 'On your next walk, ask her to spot 3 things that seem "odd" and guess why they happen — turns curiosity into scientific thinking.' },
  { domain: 'Feelings & Friendships', tip: 'After a show or story, ask how a character felt and why — just one question builds empathy over time.' },
];

const bandCounts = domainScores.reduce<Record<Band, number>>(
  (acc, d) => {
    acc[d.band] = (acc[d.band] ?? 0) + 1;
    return acc;
  },
  { Blossoming: 0, 'Growing Well': 0, 'Just Starting': 0 }
);

function ProgressRing({ percent, color, size = 64 }: { percent: number; color: string; size?: number }) {
  const [animatedPercent, setAnimatedPercent] = useState(0);
  const radius = size / 2 - 5;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedPercent / 100) * circumference;

  useEffect(() => {
    const t = setTimeout(() => setAnimatedPercent(percent), 200);
    return () => clearTimeout(t);
  }, [percent]);

  return (
    <svg width={size} height={size} className="progress-ring">
      <circle cx={size / 2} cy={size / 2} r={radius} stroke="#e5e7eb" strokeWidth="5" fill="none" />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={color}
        strokeWidth="5"
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className="progress-ring-fill"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
    </svg>
  );
}

export function ParentDemo() {
  const navigate = useNavigate();

  return (
    <div className="parent-demo">
      <div className="floating-orbs">
        <span className="orb orb-1" />
        <span className="orb orb-2" />
        <span className="orb orb-3" />
      </div>

      <div className="parent-demo-card">
        <span className="parent-badge">✨ Live Scores</span>
        <h1>It's <span className="highlight-name">Aanya Sharma's</span> Report</h1>
      
        <div className="summary-banner">
          <div className="summary-item">
            <span className="summary-count" style={{ color: bandColor.Blossoming }}>{bandCounts.Blossoming}</span>
            <span className="summary-label">Blossoming</span>
          </div>
          <div className="summary-item">
            <span className="summary-count" style={{ color: bandColor['Growing Well'] }}>{bandCounts['Growing Well']}</span>
            <span className="summary-label">Growing Well</span>
          </div>
          <div className="summary-item">
            <span className="summary-count" style={{ color: bandColor['Just Starting'] }}>{bandCounts['Just Starting']}</span>
            <span className="summary-label">Just Starting</span>
          </div>
        </div>

        <p className="summary-note">
          Aanya is thriving in most areas for her age group, with one skill just beginning to bloom.
        </p>

        <h2 className="section-heading">How She's Growing</h2>
        <div className="score-grid">
          {domainScores.map((s, i) => (
            <div
              className="score-card"
              key={s.key}
              style={{ animationDelay: `${i * 0.08}s`, '--band-color': bandColor[s.band] } as React.CSSProperties}
            >
              <div className="score-card-ring-wrap">
                <ProgressRing percent={bandPercent[s.band]} color={bandColor[s.band]} />
                <span className="score-card-icon-overlay">{s.icon}</span>
              </div>
              <h3>{s.label}</h3>
              <span className="band-tag" style={{ background: bandColor[s.band] }}>{s.band}</span>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>

        <h2 className="section-heading">Simple Things You Can Try at Home</h2>
        <div className="activity-list">
          {homeActivities.map((a) => (
            <div className="activity-item" key={a.domain}>
              <span className="activity-domain">{a.domain}</span>
              <p>{a.tip}</p>
            </div>
          ))}
        </div>

        <p className="summary-note">
  This is the kind of insight Medhaa's games reveal — real, age-appropriate growth tracking for your child too.
</p>

 <div className="parent-footer">
  <button className="parent-cta" onClick={() => navigate('/login')}>
    <span className="parent-cta-icon">🚀</span>
    <span className="parent-cta-text">
      <strong>Start My Child's Journey</strong>
      <small>Sign up & get their first report in weeks</small>
    </span>
  </button>
  <a href="/" className="parent-back"> Home</a>
</div>
      </div>
    </div>
  );
}

export default ParentDemo;