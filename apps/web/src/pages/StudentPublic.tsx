import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GamesGrid } from '../components/GamesGrid';
import '../styles/student-public.css';


const API_URL = 'http://localhost:4000/api';
const AGE_STORAGE_KEY = 'medhaa_student_age_group';

type AgeGroup = '5-9' | '10-13' | '14-17';

type AgeTheme = {
  id: AgeGroup;
  label: string;
  title: string;
  subtitle: string;
  description: string;
  accent: string;
  soft: string;
  icon: string;
  floating: string[];
};

const ageThemes: AgeTheme[] = [
  {
    id: '5-9',
    label: '5–9 years',
    title: 'Let’s discover, play & imagine! 🌈',
    subtitle: 'Little explorers • Big ideas',
    description: 'Fun games, stories, simple challenges and playful activities made for curious young minds.',
    accent: '#ff6b4a',
    soft: '#fff2d9',
    icon: '🦋',
    floating: ['⭐', '🫧', '🌼', '🦋', '🍭'],
  },
  {
    id: '10-13',
    label: '10–13 years',
    title: 'Play smarter. Explore more. 🚀',
    subtitle: 'Challenges • Skills • Discovery',
    description: 'Build stronger thinking, study habits, problem-solving and real-world skills through active learning.',
    accent: '#536dfe',
    soft: '#eef3ff',
    icon: '⚡',
    floating: ['⚡', '🧩', '🚀', '🎯', '✨'],
  },
  {
    id: '14-17',
    label: '14–17 years',
    title: 'Think deeper. Build your future. ✨',
    subtitle: 'Independence • Strategy • Creation',
    description: 'Strengthen decision-making, time management, practical knowledge, creativity and future-ready skills.',
    accent: '#5367d9',
    soft: '#e9edff',
    icon: '🌟',
    floating: ['✦', '✧', '◆', '✦', '•'],
  },
];

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
    desc: 'Sharpen logic, memory, focus, and math skills through engaging challenges.',
    match: ['cognitive-assessment', 'cognitive-focus', 'cognitive-logic', 'cognitive-math', 'cognitive-memory'],
  },
  {
    key: 'emotional',
    title: 'Emotional Skills',
    subtitle: 'EQ · Empathy · Calm',
    icon: '💛',
    color: '#ec4899',
    desc: 'Explore empathy, communication and emotional balance through social scenarios.',
    match: ['emotional-intel'],
  },
  {
    key: 'engineering',
    title: 'Engineering',
    subtitle: 'Build & Design',
    icon: '⚙️',
    color: '#f59e0b',
    desc: 'Build, design and discover how machines and systems work.',
    match: ['stem-engineering'],
  },
  {
    key: 'science',
    title: 'Science in Life',
    subtitle: 'Explore & Discover',
    icon: '🔬',
    color: '#10b981',
    desc: 'Connect science with the world around you through interactive exploration.',
    match: ['environment'],
  },
  {
    key: 'life-skills',
    title: 'Life Skills',
    subtitle: 'Everyday Readiness',
    icon: '🌟',
    color: '#8b5cf6',
    desc: 'Practice real-world situations, strategy and everyday problem-solving.',
    match: ['life-skills'],
  },
  {
    key: 'creativity',
    title: 'Creativity & Arts',
    subtitle: 'Imagination · Music',
    icon: '🎨',
    color: '#f472b6',
    desc: 'Create, imagine and explore music and artistic expression.',
    match: ['creativity', 'music'],
  },
  {
    key: 'language',
    title: 'Language',
    subtitle: 'English · Hindi · Telugu',
    icon: '📚',
    color: '#3b82f6',
    desc: 'Build language confidence through vocabulary, grammar and scripts.',
    match: ['language-english', 'language-hindi', 'language-telugu'],
  },
  {
    key: 'career',
    title: 'Career & Life Ready',
    subtitle: 'Civics · Finance · Digital',
    icon: '🚀',
    color: '#0ea5e9',
    desc: 'Discover practical finance, civics, careers and digital-world skills.',
    match: ['career', 'civics', 'finance', 'digital-literacy'],
  },
  {
    key: 'other',
    title: 'More Skills',
    subtitle: 'New & Special',
    icon: '✨',
    color: '#a855f7',
    desc: 'Fresh additions and special games that do not fit one category yet.',
    match: [],
  },
];

const allMatchedDomains = domainShowcase.flatMap((d) => d.match);

const studentTools = [
  {
    key: 'homework',
    icon: '📚',
    title: 'Homework Tracker',
    desc: 'Keep homework, due dates and completion in one simple place.',
    accent: '#ff7a59',
    tag: 'Study',
    route: '/student/homework',
  },
  {
    key: 'time',
    icon: '⏱️',
    title: 'My Time',
    desc: 'Plan your day, start focus sessions and build healthy routines.',
    accent: '#5b6cff',
    tag: 'Time',
    route: '/student/time',
  },
  {
    key: 'math-lab',
    icon: '🧮',
    title: 'Math Lab',
    desc: 'A playful calculator with challenges, conversions and real-life maths.',
    accent: '#10a77a',
    tag: 'Build',
    route: '/student/math-lab',
  },
  {
    key: 'daily',
    icon: '🧩',
    title: 'Daily Challenge',
    desc: 'One small challenge a day to keep your thinking active.',
    accent: '#f2a500',
    tag: 'Daily',
    route: '/student/daily-challenge',
  },
  {
    key: 'planner',
    icon: '🗓️',
    title: 'Study Planner',
    desc: 'Turn upcoming work into small, manageable study steps.',
    accent: '#8b5cf6',
    tag: 'Plan',
    route: '/student/study-planner',
  },
  {
    key: 'real-life',
    icon: '🌍',
    title: 'Real Life Lab',
    desc: 'Explore money, travel, sports, technology and everyday decisions.',
    accent: '#1597d4',
    tag: 'Explore',
    route: '/student/real-life',
  },
  {
    key: 'create',
    icon: '🎨',
    title: 'Create Lab',
    desc: 'Make, compose, design and experiment with creative tools.',
    accent: '#e653a6',
    tag: 'Create',
    route: '/student/create',
  },
  {
    key: 'journey',
    icon: '🏆',
    title: 'My Journey',
    desc: 'See your activity history, goals, achievements and personal milestones.',
    accent: '#f05a67',
    tag: 'My Space',
    route: '/student/progress',
  },
];


function AgeScene({ age }: { age: AgeGroup }) {
  if (age === '5-9') {
    return (
      <div className="age-scene-art scene-kids" aria-hidden="true">
        <div className="scene-sky" />
        <div className="scene-sun" />
        <div className="scene-rainbow">
          <i /><i /><i /><i /><i />
        </div>
        <div className="scene-cloud cloud-one"><b /><b /><b /></div>
        <div className="scene-cloud cloud-two"><b /><b /><b /></div>
        <div className="scene-hill hill-back" />
        <div className="scene-hill hill-front" />
        <div className="scene-mushroom">
          <div className="mushroom-cap"><b /><b /><b /><b /><b /></div>
          <div className="mushroom-stem"><span className="mushroom-door" /><span className="mushroom-window" /></div>
        </div>
        <div className="scene-tree">
          <div className="tree-trunk" />
          <div className="tree-crown"><i /><i /><i /><i /></div>
          <div className="tree-fruit f1" /><div className="tree-fruit f2" /><div className="tree-fruit f3" />
        </div>
        <div className="scene-flower flower-one">✿</div>
        <div className="scene-flower flower-two">✿</div>
        <div className="scene-butterfly">🦋</div>
        <div className="scene-ball ball-one" />
        <div className="scene-gift">🎁</div>
        <div className="scene-bubbles"><i /><i /><i /><i /></div>
        <div className="scene-kite">◇</div>
      </div>
    );
  }

  if (age === '10-13') {
    return (
      <div className="age-scene-art scene-explorer" aria-hidden="true">
        <div className="explorer-sky" />
        <div className="explorer-grid" />
        <div className="explorer-orbit orbit-a" />
        <div className="explorer-orbit orbit-b" />
        <div className="explorer-glow glow-a" />
        <div className="explorer-glow glow-b" />
        <div className="explorer-rocket">
          <span className="rocket-window" />
          <span className="rocket-fin fin-left" />
          <span className="rocket-fin fin-right" />
          <span className="rocket-flame" />
        </div>
        <div className="explorer-card card-one"><span>🧩</span><b>CHALLENGE</b><small>Think it through</small></div>
        <div className="explorer-card card-two"><span>⚡</span><b>FOCUS</b><small>Level up</small></div>
        <div className="explorer-card card-three"><span>🚀</span><b>EXPLORE</b><small>Go further</small></div>
        <div className="explorer-star star-a">✦</div>
        <div className="explorer-star star-b">✦</div>
        <div className="explorer-star star-c">✧</div>
        <div className="explorer-pill pill-a">10 min</div>
        <div className="explorer-pill pill-b">+25 XP</div>
      </div>
    );
  }

  return (
    <div className="age-scene-art scene-future" aria-hidden="true">
      <div className="future-sky" />
      <div className="future-stars" />
      <div className="future-horizon" />
      <div className="future-orbit orbit-a" />
      <div className="future-orbit orbit-b" />
      <div className="future-constellation">
        <i className="node n1" /><i className="node n2" /><i className="node n3" /><i className="node n4" /><i className="node n5" />
      </div>
      <div className="future-panel panel-main">
        <span className="panel-kicker">MY NEXT MOVE</span>
        <strong>Build • Learn • Create</strong>
        <div className="panel-bars"><i /><i /><i /></div>
      </div>
      <div className="future-panel panel-small"><span>⏱</span><b>25:00</b><small>FOCUS</small></div>
      <div className="future-panel panel-small panel-small-two"><span>◈</span><b>+42</b><small>PROGRESS</small></div>
      <div className="future-cube cube-one" />
      <div className="future-cube cube-two" />
      <div className="future-star">✦</div>
    </div>
  );
}

function AgeMiniScene({ age }: { age: AgeGroup }) {
  return <div className={`age-mini-scene mini-${age.replace('-', '')}`} aria-hidden="true"><AgeScene age={age} /></div>;
}

export default function StudentPublic() {
  const [showPopup, setShowPopup] = useState(false);
  const [activeDomain, setActiveDomain] = useState<string | null>(null);
  const [ageGroup, setAgeGroup] = useState<AgeGroup | null>(null);
  const [showAgePicker, setShowAgePicker] = useState(false);
  const [activeSection, setActiveSection] = useState<'tools' | 'games'>('tools');
  const navigate = useNavigate();

  useEffect(() => {
    const saved = window.localStorage.getItem(AGE_STORAGE_KEY) as AgeGroup | null;
    if (saved && ageThemes.some((theme) => theme.id === saved)) {
      setAgeGroup(saved);
    } else {
      setShowAgePicker(true);
    }

    const timer = window.setTimeout(() => setShowPopup(true), 25000);
    return () => window.clearTimeout(timer);
  }, []);

  const activeTheme = useMemo(
    () => ageThemes.find((theme) => theme.id === ageGroup) ?? ageThemes[1],
    [ageGroup],
  );

  const activeItem = domainShowcase.find((d) => d.key === activeDomain) ?? null;
  const domainFilter = activeDomain && activeDomain !== 'other' ? activeItem?.match ?? null : null;
  const excludeDomains = activeDomain === 'other' ? allMatchedDomains : null;

  const chooseAge = (id: AgeGroup) => {
    setAgeGroup(id);
    window.localStorage.setItem(AGE_STORAGE_KEY, id);
    setShowAgePicker(false);
    setActiveDomain(null);
  };

  return (
    <div
      className={`student-public age-${activeTheme.id.replace('-', '')}`}
      style={{ '--age-accent': activeTheme.accent, '--age-soft': activeTheme.soft } as React.CSSProperties}
    >
      <nav className="student-public-nav">
        <button className="brand-button" onClick={() => navigate('/')} aria-label="Go to Medhaa home">
          <span className="brand-mark">M</span>
          <span className="brand-name">Medhā</span>
        </button>

        <div className="student-nav-links">
          <button className="nav-link active" onClick={() => setActiveSection('tools')}>✨ Explore</button>
          <button className="nav-link" onClick={() => setActiveSection('games')}>🎮 Games</button>
          <button className="nav-link" onClick={() => setShowAgePicker(true)}>🎨 Age &amp; Theme</button>
        </div>

        <div className="nav-btn-group">
          <button className="nav-btn nav-btn-login" onClick={() => navigate('/login/student')}>Login</button>
          <button className="nav-btn nav-btn-signup" onClick={() => navigate('/signup/student')}>Start Free</button>
        </div>
      </nav>

      <section className="student-hero">
        <div className="hero-glow hero-glow-one" />
        <div className="hero-glow hero-glow-two" />
        <div className="floating-shapes" aria-hidden="true">
          {activeTheme.floating.map((shape, index) => (
            <span key={`${shape}-${index}`} className={`shape shape-${index + 1}`}>{shape}</span>
          ))}
        </div>

        <div className="hero-copy">
          <span className="age-pill">{activeTheme.icon} {activeTheme.label}</span>
          <h1>{activeTheme.title}</h1>
          <p className="hero-subtitle">{activeTheme.subtitle}</p>
          <p className="hero-description">{activeTheme.description}</p>
          <div className="hero-actions">
            <button className="hero-primary" onClick={() => setActiveSection('games')}>🎮 Explore Games</button>
            <button className="hero-secondary" onClick={() => navigate('/signup/student')}>Create My Medhā →</button>
          </div>
        </div>

        <div className="hero-scene">
          <div className="scene-orbit scene-orbit-one" />
          <div className="scene-orbit scene-orbit-two" />
          <AgeScene age={activeTheme.id} />
          <div className="scene-sparkles" aria-hidden="true"><span>✦</span><span>✧</span><span>✦</span></div>
        </div>
      </section>

      <section className="quick-start-section">
        <div className="section-heading compact-heading">
          <div>
            <span className="section-kicker">YOUR MEDHĀ SPACE</span>
            <h2>What do you feel like doing today?</h2>
            <p>Play, study, plan, explore or create — choose your path.</p>
          </div>
          <button className="age-change-button" onClick={() => setShowAgePicker(true)}>Change age theme</button>
        </div>

        <div className="quick-action-row">
          <button className="quick-action featured" onClick={() => setActiveSection('games')}>
            <span className="quick-icon">🎮</span><span><strong>Play &amp; Think</strong><small>Games &amp; challenges</small></span><span className="arrow">→</span>
          </button>
          <button className="quick-action" onClick={() => navigate('/student/homework')}>
            <span className="quick-icon">📚</span><span><strong>Homework</strong><small>Tasks &amp; due dates</small></span><span className="arrow">→</span>
          </button>
          <button className="quick-action" onClick={() => navigate('/student/time')}>
            <span className="quick-icon">⏱️</span><span><strong>My Time</strong><small>Focus &amp; routines</small></span><span className="arrow">→</span>
          </button>
          <button className="quick-action" onClick={() => navigate('/student/math-lab')}>
            <span className="quick-icon">🧮</span><span><strong>Math Lab</strong><small>Calculate &amp; challenge</small></span><span className="arrow">→</span>
          </button>
        </div>
      </section>

      {activeSection === 'tools' ? (
        <section className="tools-section">
          <div className="section-heading">
            <div>
              <span className="section-kicker">MORE THAN GAMES</span>
              <h2>Tools for school, life &amp; your ideas</h2>
              <p>Useful spaces you can grow into as your Medhā journey grows.</p>
            </div>
          </div>

          <div className="tools-grid">
            {studentTools.map((tool, index) => (
              <button
                key={tool.key}
                className="tool-card"
                style={{ '--tool-accent': tool.accent, animationDelay: `${index * 70}ms` } as React.CSSProperties}
                onClick={() => navigate(tool.route)}
              >
                <span className="tool-card-shine" />
                <span className="tool-icon">{tool.icon}</span>
                <span className="tool-tag">{tool.tag}</span>
                <strong>{tool.title}</strong>
                <span className="tool-description">{tool.desc}</span>
                <span className="tool-open">Explore <span>→</span></span>
              </button>
            ))}
          </div>

          <div className="daily-banner">
            <div className="daily-art" aria-hidden="true"><span>✦</span><span>🧩</span><span>✦</span></div>
            <div>
              <span className="daily-kicker">A LITTLE CHALLENGE, EVERY DAY</span>
              <h3>Keep your curiosity moving.</h3>
              <p>Try a short puzzle, real-life problem or thinking challenge whenever you have a few minutes.</p>
            </div>
            <button onClick={() => navigate('/student/daily-challenge')}>Try today →</button>
          </div>
        </section>
      ) : (
        <section className="games-section">
          <div className="section-heading games-heading">
            <div>
              <span className="section-kicker">PLAY &amp; THINK</span>
              <h2>{activeItem ? `${activeItem.title} Games` : 'Find a game that fits you'}</h2>
              <p>Choose a domain, then explore the activities available for your age group.</p>
            </div>
            {activeDomain && <button className="clear-filter" onClick={() => setActiveDomain(null)}>Show all</button>}
          </div>

          <div className="domain-showcase">
            {domainShowcase.map((d, i) => (
              <button
                key={d.key}
                type="button"
                className={`domain-tile ${activeDomain === d.key ? 'domain-tile-active' : ''}`}
                style={{ animationDelay: `${i * 70}ms`, '--tile-color': d.color } as React.CSSProperties}
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
            <h3 className="games-section-title">{activeItem ? `${activeItem.title} Games` : 'All Games'}</h3>
            <GamesGrid apiUrl={API_URL} domainFilter={domainFilter} excludeDomains={excludeDomains} />
          </div>
        </section>
      )}

      <footer className="student-footer">
        <div><strong>Medhā</strong><span>Play. Learn. Plan. Create. Grow.</span></div>
        <div className="footer-links"><button onClick={() => navigate('/')}>Home</button><button onClick={() => navigate('/login/student')}>Login</button><button onClick={() => navigate('/signup/student')}>Start Free</button></div>
      </footer>

      {showAgePicker && (
        <div className="age-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="age-picker-title">
          <div className="age-modal">
            <button className="age-modal-close" onClick={() => setShowAgePicker(false)} aria-label="Close">×</button>
            <span className="age-modal-spark">✦</span>
            <p className="section-kicker">PERSONALISE YOUR MEDHĀ</p>
            <h2 id="age-picker-title">How old are you?</h2>
            <p>Choose your age group and we’ll shape the look and experience around you.</p>
            <div className="age-choice-grid">
              {ageThemes.map((theme) => (
                <button
                  key={theme.id}
                  className={`age-choice age-choice-${theme.id.replace('-', '')} ${ageGroup === theme.id ? 'selected' : ''}`}
                  onClick={() => chooseAge(theme.id)}
                >
                  <AgeMiniScene age={theme.id} />
                  <span className="age-choice-overlay" />
                  <span className="age-choice-icon">{theme.icon}</span>
                  <strong>{theme.label}</strong>
                  <small>{theme.subtitle}</small>
                </button>
              ))}
            </div>
            <p className="age-modal-note">You can change this anytime from “Age &amp; Theme”.</p>
          </div>
        </div>
      )}

      {showPopup && (
        <div className="login-popup-anim login-popup">
          <button className="popup-close" onClick={() => setShowPopup(false)} aria-label="Close">×</button>
          <span className="popup-icon">✨</span>
          <strong>Want to keep your journey?</strong>
          <p>Sign in to save your activity, progress and achievements.</p>
          <button className="popup-login" onClick={() => navigate('/login/student')}>Login to Medhā →</button>
        </div>
      )}
    </div>
  );
}
