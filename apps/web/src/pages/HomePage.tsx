import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

declare global {
  namespace JSX {
    interface Element extends React.ReactElement<any, any> {}
  }
}

type Role = {
  title: string;
  subtitle: string;
  description: string;
  route: string;
  variant: 'student' | 'parent' | 'teacher' | 'school';
};

type Capability = {
  title: string;
  description: string;
  variant: string;
};

type GamePreview = {
  title: string;
  description: string;
  variant: string;
};

function StudentIcon() {
  return (
    <svg viewBox="0 0 72 72" aria-hidden="true">
      <circle cx="36" cy="36" r="28" fill="currentColor" opacity="0.12" />
      <path d="M25 35c0-7 5-12 11-12s11 5 11 12v12H25V35Z" fill="currentColor" opacity="0.9" />
      <circle cx="31" cy="34" r="2.5" fill="white" />
      <circle cx="41" cy="34" r="2.5" fill="white" />
      <path d="M31 41c3 2 7 2 10 0" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M19 50c4-6 10-9 17-9s13 3 17 9" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" opacity="0.85" />
    </svg>
  );
}

function ParentIcon() {
  return (
    <svg viewBox="0 0 72 72" aria-hidden="true">
      <circle cx="25" cy="27" r="8" fill="currentColor" opacity="0.9" />
      <circle cx="47" cy="27" r="8" fill="currentColor" opacity="0.72" />
      <circle cx="36" cy="45" r="7" fill="currentColor" />
      <path d="M12 53c2-9 7-14 13-14s11 5 13 14" fill="currentColor" opacity="0.8" />
      <path d="M34 53c2-8 7-13 13-13s11 5 13 13" fill="currentColor" opacity="0.62" />
    </svg>
  );
}

function TeacherIcon() {
  return (
    <svg viewBox="0 0 72 72" aria-hidden="true">
      <path d="M15 24h42v29H15z" fill="currentColor" opacity="0.14" stroke="currentColor" strokeWidth="3" />
      <path d="M21 30h30M21 37h23M21 44h17" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="m36 12 18 7-18 7-18-7 18-7Z" fill="currentColor" opacity="0.85" />
      <path d="M52 22v10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function SchoolIcon() {
  return (
    <svg viewBox="0 0 72 72" aria-hidden="true">
      <path d="m36 13 25 12-25 12-25-12 25-12Z" fill="currentColor" opacity="0.9" />
      <path d="M17 33v19h38V33M27 52V38h18v14" fill="none" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" />
      <path d="M15 58h42" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

function CapabilityIcon({ variant }: { variant: string }) {
  const paths: Record<string, JSX.Element> = {
    focus: (
      <>
        <circle cx="36" cy="36" r="18" fill="none" stroke="currentColor" strokeWidth="3" />
        <circle cx="36" cy="36" r="8" fill="currentColor" opacity="0.2" />
        <circle cx="36" cy="36" r="3.5" fill="currentColor" />
      </>
    ),
    memory: (
      <>
        <path d="M25 28c-5 0-8 4-8 9s3 9 8 9h3v6h16v-6h3c5 0 8-4 8-9s-3-9-8-9c-1-6-5-9-11-9s-10 3-11 9Z" fill="none" stroke="currentColor" strokeWidth="3" />
        <path d="M29 34c2-3 4-3 7 0 3-3 5-3 7 0" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </>
    ),
    reasoning: (
      <>
        <path d="M21 23h30v30H21z" fill="none" stroke="currentColor" strokeWidth="3" />
        <path d="m27 38 6 6 13-15" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
    observation: (
      <>
        <path d="M12 36s9-14 24-14 24 14 24 14-9 14-24 14S12 36 12 36Z" fill="none" stroke="currentColor" strokeWidth="3" />
        <circle cx="36" cy="36" r="7" fill="currentColor" opacity="0.25" />
        <circle cx="36" cy="36" r="3" fill="currentColor" />
      </>
    ),
    imagination: (
      <>
        <path d="M36 17c-10 0-17 7-17 16 0 6 3 10 7 13 2 2 3 4 3 7h14c0-3 1-5 3-7 4-3 7-7 7-13 0-9-7-16-17-16Z" fill="none" stroke="currentColor" strokeWidth="3" />
        <path d="M29 58h14M30 52h12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </>
    ),
    strategy: (
      <>
        <path d="M36 16v40M16 36h40M22 22l28 28M50 22 22 50" stroke="currentColor" strokeWidth="2.5" opacity="0.45" />
        <circle cx="36" cy="36" r="15" fill="none" stroke="currentColor" strokeWidth="3" />
        <circle cx="36" cy="36" r="5" fill="currentColor" />
      </>
    ),
  };

  return <svg viewBox="0 0 72 72" aria-hidden="true">{paths[variant]}</svg>;
}

function GameIcon({ variant }: { variant: string }) {
  const icons: Record<string, React.JSX.Element> = {
    pattern: (
      <>
        <rect x="18" y="18" width="14" height="14" rx="3" fill="currentColor" opacity="0.35" />
        <rect x="40" y="18" width="14" height="14" rx="3" fill="currentColor" opacity="0.75" />
        <rect x="18" y="40" width="14" height="14" rx="3" fill="currentColor" opacity="0.75" />
        <rect x="40" y="40" width="14" height="14" rx="3" fill="currentColor" opacity="0.35" />
      </>
    ),
    memory: (
      <>
        <rect x="18" y="18" width="15" height="15" rx="4" fill="currentColor" opacity="0.8" />
        <rect x="39" y="18" width="15" height="15" rx="4" fill="currentColor" opacity="0.25" />
        <rect x="18" y="39" width="15" height="15" rx="4" fill="currentColor" opacity="0.25" />
        <rect x="39" y="39" width="15" height="15" rx="4" fill="currentColor" opacity="0.8" />
      </>
    ),
    focus: (
      <>
        <circle cx="36" cy="36" r="20" fill="none" stroke="currentColor" strokeWidth="4" opacity="0.3" />
        <circle cx="36" cy="36" r="11" fill="none" stroke="currentColor" strokeWidth="4" />
        <circle cx="36" cy="36" r="4" fill="currentColor" />
      </>
    ),
    distraction: (
      <>
        <path d="M18 36h36" stroke="currentColor" strokeWidth="5" strokeLinecap="round" opacity="0.25" />
        <path d="M36 18v36" stroke="currentColor" strokeWidth="5" strokeLinecap="round" opacity="0.25" />
        <circle cx="36" cy="36" r="12" fill="none" stroke="currentColor" strokeWidth="4" />
        <path d="m26 46 20-20" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      </>
    ),
    bhava: (
      <>
        <path d="M19 42c5-10 11-16 17-16s12 6 17 16" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
        <circle cx="25" cy="34" r="3" fill="currentColor" />
        <circle cx="36" cy="27" r="3" fill="currentColor" />
        <circle cx="47" cy="34" r="3" fill="currentColor" />
      </>
    ),
    neuro: (
      <>
        <path d="M28 20c-6 0-10 5-10 11 0 4 2 7 5 9-2 7 3 12 9 12 2 0 4-1 5-2 2 2 4 2 6 2 6 0 11-5 9-12 3-2 5-5 5-9 0-6-4-11-10-11-2-3-5-4-9-4s-7 1-10 4Z" fill="none" stroke="currentColor" strokeWidth="3" />
        <path d="M36 22v26M26 30l10 7 10-7M27 43l9-6 9 6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  };

  return <svg viewBox="0 0 72 72" aria-hidden="true">{icons[variant]}</svg>;
}

const roles: Role[] = [
  {
    title: 'Student',
    subtitle: 'Play • Think • Discover',
    description: 'Explore games, challenges and activities designed to make learning engaging.',
    route: '/login/student',   // ← changed
    variant: 'student',
  },
  {
    title: 'Parent',
    subtitle: 'Understand • Guide',
    description: 'See your child’s learning activity, progress and meaningful insights.',
    route: '/parent-demo',
    variant: 'parent',
  },
  {
    title: 'Teacher',
    subtitle: 'Teach • Analyze',
    description: 'Understand class patterns, identify needs and support every learner.',
    route: '/teacher-demo',
    variant: 'teacher',
  },
  {
    title: 'School',
    subtitle: 'Connect • Grow',
    description: 'Bring students, teachers and parents together through one platform.',
    route: '/school-report',   // ← fixed missing slash
    variant: 'school',
  },
];

const capabilities: Capability[] = [
  { title: 'Focus', description: 'Sustain attention and stay with a task.', variant: 'focus' },
  { title: 'Memory', description: 'Remember, retain and retrieve information.', variant: 'memory' },
  { title: 'Reasoning', description: 'Recognize relationships and solve problems.', variant: 'reasoning' },
  { title: 'Observation', description: 'Notice patterns, details and changes.', variant: 'observation' },
  { title: 'Imagination', description: 'Explore possibilities and create ideas.', variant: 'imagination' },
  { title: 'Strategy', description: 'Plan, adapt and make thoughtful decisions.', variant: 'strategy' },
];

const games: GamePreview[] = [
  { title: 'Pattern Sequence', description: 'Think • Observe • Connect', variant: 'pattern' },
  { title: 'Memory Matrix', description: 'Remember • Recall • Improve', variant: 'memory' },
  { title: 'Focus Master', description: 'Attend • Respond • Persist', variant: 'focus' },
  { title: 'Focus Under Distraction', description: 'Filter • Focus • Perform', variant: 'distraction' },
  { title: 'Bhava Smriti', description: 'Remember • Associate • Recall', variant: 'bhava' },
  { title: 'Neuro Flash', description: 'Observe • Process • Respond', variant: 'neuro' },
];

export default function HomePage() {
  const navigate = useNavigate();

  const go = (route: string) => navigate(route);

  return (
    <main className="home-wrap">
      <header className="home-nav">
        <button className="brand" onClick={() => navigate('/')} aria-label="Medhaa home">
          <span className="brand-mark" aria-hidden="true">
            M
          </span>
          <span className="brand-name">Medhaa</span>
        </button>

        <nav className="nav-links" aria-label="Main navigation">
          <a href="#explore">Explore</a>
          <a href="#capabilities">Capabilities</a>
          <a href="#games">Games</a>
          <a href="#access">Access</a>
        </nav>

        <button className="nav-student-button" onClick={() => go('/student')}>
          Start Exploring
        </button>
      </header>

      <section className="home-hero">
        <div className="hero-glow hero-glow-one" />
        <div className="hero-glow hero-glow-two" />

        <div className="hero-content">
          <span className="eyebrow">A learning experience for curious minds</span>
          <h1>
            Build the abilities
            <span> behind learning.</span>
          </h1>
          <p>
            Interactive games and activities that help children explore how they
            think, focus, remember, reason and create.
          </p>

          <div className="hero-actions">
            <button className="primary-button" onClick={() => go('/student')}>
              Start Exploring
              <span aria-hidden="true">→</span>
            </button>
            <a className="secondary-button" href="#explore">
              See how Medhaa works
            </a>
          </div>

          <div className="hero-trust">
            <span>15 days of complete access</span>
            <i aria-hidden="true" />
            <span>10 games free forever</span>
          </div>
        </div>

        <div className="hero-visual" aria-hidden="true">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="hero-core">
            <div className="core-symbol">M</div>
            <span className="core-dot dot-one" />
            <span className="core-dot dot-two" />
            <span className="core-dot dot-three" />
            <span className="core-dot dot-four" />
          </div>
          <div className="floating-chip chip-one">Focus</div>
          <div className="floating-chip chip-two">Memory</div>
          <div className="floating-chip chip-three">Logic</div>
          <div className="floating-chip chip-four">Create</div>
        </div>
      </section>

      <section className="section explore-section" id="explore">
        <div className="section-heading-wrap">
          <span className="section-kicker">Explore Medhaa</span>
          <h2>One platform. Different perspectives.</h2>
          <p>
            The experience changes with the person using it — joyful for children,
            clear and professional for adults.
          </p>
        </div>

        <div className="role-grid">
          {roles.map((role, index) => {
            const Icon =
              role.variant === 'student'
                ? StudentIcon
                : role.variant === 'parent'
                  ? ParentIcon
                  : role.variant === 'teacher'
                    ? TeacherIcon
                    : SchoolIcon;

            return (
              <button
                key={role.title}
                className={`role-card role-${role.variant}`}
                onClick={() => go(role.route)}
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <span className="role-icon">
                  <Icon />
                </span>
                <span className="role-title">{role.title}</span>
                <span className="role-subtitle">{role.subtitle}</span>
                <span className="role-description">{role.description}</span>
                <span className="role-link">
                  Explore <span aria-hidden="true">→</span>
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="section capabilities-section" id="capabilities">
        <div className="section-heading-wrap centered">
          <span className="section-kicker">What can children develop?</span>
          <h2>Build the abilities behind learning.</h2>
          <p>
            Medhaa uses interactive experiences to give children opportunities to
            practise different ways of thinking.
          </p>
        </div>

        <div className="capability-grid">
          {capabilities.map((item, index) => (
            <article
              className={`capability-card capability-${item.variant}`}
              key={item.title}
              style={{ animationDelay: `${index * 70}ms` }}
            >
              <div className="capability-icon">
                <CapabilityIcon variant={item.variant} />
              </div>
              <div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section games-section" id="games">
        <div className="games-heading">
          <div className="section-heading-wrap">
            <span className="section-kicker">Learn through play</span>
            <h2>Every challenge is an opportunity to think.</h2>
            <p>
              Explore a growing collection of interactive experiences built around
              observation, memory, attention, reasoning and more.
            </p>
          </div>
          <button className="text-button" onClick={() => go('/student')}>
            Explore games <span aria-hidden="true">→</span>
          </button>
        </div>

        <div className="game-grid">
          {games.map((game, index) => (
            <button
              className={`game-card game-${game.variant}`}
              key={game.title}
              onClick={() => go('/student')}
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <span className="game-art">
                <GameIcon variant={game.variant} />
              </span>
              <span className="game-card-content">
                <strong>{game.title}</strong>
                <small>{game.description}</small>
              </span>
              <span className="game-arrow" aria-hidden="true">↗</span>
            </button>
          ))}
        </div>
      </section>

      <section className="perspectives-section">
        <div className="perspectives-inner">
          <div className="perspectives-copy">
            <span className="section-kicker">One child. Connected perspectives.</span>
            <h2>See learning from the right point of view.</h2>
            <p>
              Children explore. Parents understand and guide. Teachers analyse and
              support. Schools connect the whole learning environment.
            </p>
          </div>

          <div className="perspective-list">
            <div className="perspective-item">
              <span className="perspective-number">01</span>
              <div>
                <strong>Student</strong>
                <p>Explore games, challenges, progress and achievements.</p>
              </div>
            </div>
            <div className="perspective-item">
              <span className="perspective-number">02</span>
              <div>
                <strong>Parent</strong>
                <p>Understand activity, progress and meaningful insights.</p>
              </div>
            </div>
            <div className="perspective-item">
              <span className="perspective-number">03</span>
              <div>
                <strong>Teacher</strong>
                <p>Identify patterns, needs and opportunities to support learners.</p>
              </div>
            </div>
            <div className="perspective-item">
              <span className="perspective-number">04</span>
              <div>
                <strong>School</strong>
                <p>Connect students, teachers and parents through one platform.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="trial-section" id="access">
        <div className="trial-card">
          <div className="trial-decoration decoration-one" />
          <div className="trial-decoration decoration-two" />

          <div className="trial-content">
            <span className="trial-badge">Try Medhaa</span>
            <h2>15 days. Everything unlocked.</h2>
            <p>
              Experience the full Medhaa journey before choosing what comes next.
              After the trial, 10 selected games remain free forever.
            </p>

            <div className="trial-points">
              <span>✓ Full access during trial</span>
              <span>✓ 10 games free forever</span>
              <span>✓ No pressure to continue</span>
            </div>

            <button className="primary-button trial-button" onClick={() => go('/student')}>
              Start Free
              <span aria-hidden="true">→</span>
            </button>
          </div>

          <div className="trial-visual" aria-hidden="true">
            <div className="trial-circle">
              <strong>15</strong>
              <span>days</span>
            </div>
            <div className="free-pill">10 free forever</div>
          </div>
        </div>
      </section>

      <section className="devices-section">
        <span className="section-kicker">Wherever your child learns</span>
        <h2>Medhaa across your devices.</h2>
        <p>Web today, with Android and Windows experiences built around the same Medhaa ecosystem.</p>

        <div className="device-list">
          <div className="device-card"><span>⌘</span><strong>Web</strong><small>Browser</small></div>
          <div className="device-card"><span>▣</span><strong>Android</strong><small>App</small></div>
          <div className="device-card"><span>▰</span><strong>Windows</strong><small>Software</small></div>
          <div className="device-card future-device"><span>＋</span><strong>More</strong><small>Coming later</small></div>
        </div>
      </section>

      <section className="final-cta">
        <span className="section-kicker">Begin the journey</span>
        <h2>Let curiosity lead the way.</h2>
        <p>Explore Medhaa and discover a different way to learn through play.</p>
        <button className="primary-button" onClick={() => go('/student')}>
          Start Exploring
          <span aria-hidden="true">→</span>
        </button>
      </section>

      <footer className="home-footer">
        <div className="footer-brand">
          <span className="brand-mark small">M</span>
          <strong>Medhaa</strong>
        </div>
        <span>© 2026 Medhaa · Designed for curious minds</span>
        <span className="footer-note">A Bhāva Tech product</span>
      </footer>
    </main>
  );
}
