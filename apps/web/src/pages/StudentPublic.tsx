import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GamesGrid } from '../components/GamesGrid';
import '../styles/student-public.css';

const API_URL = 'http://localhost:4000/api';

interface DomainShowcaseItem {
  key: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  desc: string;
  match: string[];
}

const domainShowcase: DomainShowcaseItem[] = [
  {
    key: 'cognitive',
    title: 'Cognitive Skills',
    subtitle: 'Logic · Memory · Focus · Math',
    icon: '🧠',
    color: '#6366f1',
    desc: 'Sharpen logic, memory, focus, and math skills through mind-bending games.',
    match: ['cognitive-assessment', 'cognitive-focus', 'cognitive-logic', 'cognitive-math', 'cognitive-memory'],
  },
  {
    key: 'emotional',
    title: 'Emotional Skills',
    subtitle: 'EQ · Empathy · Calm',
    icon: '💛',
    color: '#ec4899',
    desc: 'Build empathy, communication, and emotional balance through social scenarios.',
    match: ['emotional-intel'],
  },
  {
    key: 'engineering',
    title: 'Engineering',
    subtitle: 'Build & Design',
    icon: '⚙️',
    color: '#f59e0b',
    desc: 'Build drones, rockets, cars, and machines — learn how things work by making them.',
    match: ['stem-engineering'],
  },
  {
    key: 'science',
    title: 'Science in Life',
    subtitle: 'Explore & Discover',
    icon: '🔬',
    color: '#10b981',
    desc: 'Connect science to the real world through ecosystems and planet care.',
    match: ['environment'],
  },
  {
    key: 'life-skills',
    title: 'Life Skills',
    subtitle: 'Everyday Readiness',
    icon: '🌟',
    color: '#8b5cf6',
    desc: 'Practice real-world situations — daily routines, strategy, and problem-solving.',
    match: ['life-skills'],
  },
  {
    key: 'creativity',
    title: 'Creativity & Arts',
    subtitle: 'Imagination · Music',
    icon: '🎨',
    color: '#f472b6',
    desc: 'Unlock imagination through creative quests and musical exploration.',
    match: ['creativity', 'music'],
  },
  {
    key: 'language',
    title: 'Language',
    subtitle: 'English · Hindi · Telugu',
    icon: '📚',
    color: '#3b82f6',
    desc: 'Master grammar, vocabulary, and scripts across three languages.',
    match: ['language-english', 'language-hindi', 'language-telugu'],
  },
  {
    key: 'career',
    title: 'Career & Life Ready',
    subtitle: 'Civics · Finance · Digital',
    icon: '🚀',
    color: '#0ea5e9',
    desc: 'Discover careers, financial literacy, civics, and digital-world skills.',
    match: ['career', 'civics', 'finance', 'digital-literacy'],
  },
  {
    key: 'other',
    title: 'More Skills',
    subtitle: 'New & Special',
    icon: '✨',
    color: '#a855f7',
    desc: "Fresh additions and special games that don't fit a single category yet.",
    match: [],
  },
];

const allMatchedDomains = domainShowcase.flatMap((d) => d.match);

export default function StudentPublic() {
  const [showPopup, setShowPopup] = useState(false);
  const [activeDomain, setActiveDomain] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setShowPopup(true), 25000);
    return () => clearTimeout(timer);
  }, []);

  const activeItem = domainShowcase.find((d) => d.key === activeDomain) ?? null;

  const domainFilter =
    activeDomain && activeDomain !== 'other' ? activeItem?.match ?? null : null;

  const excludeDomains = activeDomain === 'other' ? allMatchedDomains : null;

  return (
    <div className="student-public" style={{ position: 'relative' }}>
      <div className="student-hero">
        <div className="floating-shapes">
          <span className="shape shape-1">⭐</span>
          <span className="shape shape-2">🎮</span>
          <span className="shape shape-3">🚀</span>
          <span className="shape shape-4">🧩</span>
        </div>
        <h1>Let's Play &amp; Learn!</h1>
        <p>Explore fun brain games made just for you. No login needed to start playing.</p>
      </div>

      <div className="domain-showcase">
        {domainShowcase.map((d, i) => (
          <button
            key={d.key}
            type="button"
            className={`domain-tile ${activeDomain === d.key ? 'domain-tile-active' : ''}`}
            style={{ animationDelay: `${i * 0.12}s`, '--tile-color': d.color } as React.CSSProperties}
            onClick={() => setActiveDomain(activeDomain === d.key ? null : d.key)}
          >
            <div className="domain-tile-icon">{d.icon}</div>
            <h3>{d.title}</h3>
            <span className="domain-tile-subtitle">{d.subtitle}</span>
            <p>{d.desc}</p>
          </button>
        ))}
      </div>

      <div className="student-games-wrap">
        <h2 className="games-section-title">
          {activeItem ? `${activeItem.title} Games` : 'Pick a Game to Start'}
        </h2>
        <GamesGrid apiUrl={API_URL} domainFilter={domainFilter} excludeDomains={excludeDomains} />
      </div>

      {showPopup && (
        <div
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            background: '#fff',
            border: '1px solid #ddd',
            borderRadius: 16,
            padding: '18px 22px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            maxWidth: 300,
            zIndex: 100,
          }}
          className="login-popup-anim"
        >
          <button
            onClick={() => setShowPopup(false)}
            style={{
              position: 'absolute',
              top: 8,
              right: 10,
              border: 'none',
              background: 'none',
              fontSize: 16,
              cursor: 'pointer',
            }}
          >
            ×
          </button>
          <p style={{ margin: '0 0 12px', fontSize: 14, color: '#333' }}>
            If you want to check your scores, strengths, and track progress, please login.
          </p>
          <button
            onClick={() => navigate('/login')}
            style={{
              width: '100%',
              padding: 8,
              background: '#01696f',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              cursor: 'pointer',
            }}
          >
            Login
          </button>
        </div>
      )}
    </div>
  );
}