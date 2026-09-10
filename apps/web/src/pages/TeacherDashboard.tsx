import { useState } from 'react';
import '../styles/teacher-dashboard.css';
import { Link } from 'react-router-dom';

// assuming this component is located in a sibling folder like src/pages or src/components
import medhaLogo from "../assets/logo/M_2.png";


type Capacity = 'Focus' | 'Attention' | 'Memory' | 'Imagination' | 'Creativity' | 'Self-Awareness';


const capacityAverages: { key: Capacity; value: number; color: string }[] = [
  { key: 'Focus', value: 82, color: '#6366f1' },
  { key: 'Attention', value: 76, color: '#3b82f6' },
  { key: 'Memory', value: 88, color: '#10b981' },
  { key: 'Imagination', value: 91, color: '#f59e0b' },
  { key: 'Creativity', value: 85, color: '#ec4899' },
  { key: 'Self-Awareness', value: 79, color: '#8b5cf6' },
];


const capacityFocusList: { name: string; capacity: Capacity; score: number }[] = [
  { name: 'Rohan Verma', capacity: 'Attention', score: 62 },
  { name: 'Ishita Nair', capacity: 'Self-Awareness', score: 65 },
  { name: 'Kabir Shah', capacity: 'Focus', score: 68 },
  { name: 'Meera Iyer', capacity: 'Attention', score: 70 },
];


const students: { name: string; overall: number; trend: 'up' | 'down' | 'flat' }[] = [
  { name: 'Aanya Sharma', overall: 96, trend: 'up' },
  { name: 'Rohan Verma', overall: 71, trend: 'down' },
  { name: 'Ishita Nair', overall: 78, trend: 'flat' },
  { name: 'Kabir Shah', overall: 74, trend: 'up' },
  { name: 'Meera Iyer', overall: 80, trend: 'flat' },
  { name: 'Dev Patel', overall: 92, trend: 'up' },
];


const domainFocusList: { domain: string; count: number; color: string }[] = [
  { domain: 'Builder & Maker Skills', count: 7, color: '#f59e0b' },
  { domain: 'Everyday Independence', count: 5, color: '#3b82f6' },
  { domain: 'Teamwork & Leading', count: 4, color: '#ec4899' },
];


const teachingTips = [
  { student: 'Rohan Verma', area: 'Attention', subject: 'Maths', task: 'Give one short, timed pattern or sequence problem. Ask him to read the question once, underline the key information, and solve it without switching tasks.', game: 'Try an attention or pattern game for 5 minutes.' },
  { student: 'Ishita Nair', area: 'Self-Awareness', subject: 'Language', task: 'After a short paragraph, ask her to write one sentence: “What was I thinking while I read this?” Then compare it with what the character was thinking.', game: 'Try a reflection, memory or attention game for 5 minutes.' },
  { student: 'Kabir Shah', area: 'Focus', subject: 'Science', task: 'Give him one observation task during an experiment. Ask him to record three observations before discussing the result with classmates.', game: 'Try a focused visual or reasoning game for 5 minutes.' },
  { student: 'Meera Iyer', area: 'Attention', subject: 'Any subject', task: 'Give one instruction containing two steps. Ask her to repeat the steps in her own words before beginning the work.', game: 'Try a short attention-and-memory game for 5 minutes.' },
];


function trendIcon(trend: 'up' | 'down' | 'flat') {
  if (trend === 'up') return <span className="trend trend-up">▲</span>;
  if (trend === 'down') return <span className="trend trend-down">▼</span>;
  return <span className="trend trend-flat">■</span>;
}


export function TeacherDashboard() {
  const [tab, setTab] = useState<'overview' | 'students' | 'tips'>('overview');
  const classAvg = Math.round(capacityAverages.reduce((s, c) => s + c.value, 0) / capacityAverages.length);


  return (
    <div className="teacher-dashboard">
      <div className="teacher-orbs">
        <span className="t-orb t-orb-1" />
        <span className="t-orb t-orb-2" />
      </div>


      <header className="teacher-header">
        <div className="teacher-brand">
          <span className="teacher-logo" aria-hidden="true"><span className="teacher-logo-ring">✦</span><span className="teacher-logo-core">M</span></span>
          <div>
            <h1>Class 4B Dashboard</h1>
            <p>32 students · Medhā Academy</p>
          </div>
        </div>
        <div className="class-avg-pill">
          <span className="class-avg-value">{classAvg}</span>
          <span className="class-avg-label">Class Average</span>
        </div>
      </header>


      <nav className="teacher-tabs">
        <button className={tab === 'overview' ? 'active' : ''} onClick={() => setTab('overview')}>Overview</button>
        <button className={tab === 'students' ? 'active' : ''} onClick={() => setTab('students')}>Students</button>
        <button className={tab === 'tips' ? 'active' : ''} onClick={() => setTab('tips')}>Teaching Tips</button>
      </nav>


      {tab === 'overview' && (
        <section className="teacher-section">
          <h2 className="t-section-heading">Capacity Profile</h2>
          <div className="capacity-grid">
            {capacityAverages.map((c, i) => (
              <div className="capacity-card" key={c.key} style={{ animationDelay: `${i * 0.07}s` }}>
                <div className="capacity-ring" style={{ background: `conic-gradient(${c.color} ${c.value * 3.6}deg, #e8edf5 0deg)` }} aria-label={`${c.key}: ${c.value}`}>
                  <div className="capacity-ring-inner">
                    <strong style={{ color: c.color }}>{c.value}</strong>
                    <span>/100</span>
                  </div>
                </div>
                <div className="capacity-label">{c.key}</div>
              </div>
            ))}
          </div>


          <h2 className="t-section-heading">🎯 Needs Attention</h2>
          <div className="focus-list">
            {capacityFocusList.map((f) => {
              const guidance = teachingTips.find((t) => t.student === f.name);
              return (
                <article className="focus-item" key={f.name + f.capacity}>
                  <div className="focus-avatar">{f.name.charAt(0)}</div>
                  <div className="focus-info">
                    <div className="focus-heading">
                      <strong>{f.name}</strong>
                      <span>{f.capacity} · <b className="focus-score">{f.score}</b></span>
                    </div>
                    {guidance && (
                      <div className="focus-guidance">
                        <strong>{guidance.subject}: </strong>{guidance.task}
                        <span className="focus-game">🎮 {guidance.game}</span>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>


          <h2 className="t-section-heading">Domain Gaps (Below 95)</h2>
          <div className="domain-gap-list">
            {domainFocusList.map((d) => (
              <div className="domain-gap-item" key={d.domain}>
                <span className="domain-gap-dot" style={{ background: d.color }} />
                <span className="domain-gap-name">{d.domain}</span>
                <span className="domain-gap-count">{d.count} students</span>
              </div>
            ))}
          </div>
        </section>
      )}


      {tab === 'students' && (
        <section className="teacher-section">
          <h2 className="t-section-heading">Student Overview</h2>
          <div className="student-table">
            {students.map((s) => (
              <div className="student-row" key={s.name}>
                <div className="student-avatar">{s.name.charAt(0)}</div>
                <span className="student-name">{s.name}</span>
                <span className="student-score">{s.overall}</span>
                {trendIcon(s.trend)}
              </div>
            ))}
          </div>
        </section>
      )}


      {tab === 'tips' && (
        <section className="teacher-section">
          <h2 className="t-section-heading">Student-Specific Guidance</h2>
          <div className="tips-grid">
            {teachingTips.map((t) => (
              <article className="tip-card" key={t.student}>
                <div className="tip-card-top">
                  <span className="tip-subject">{t.subject}</span>
                  <span className="tip-area">{t.area}</span>
                </div>
                <h3>{t.student}</h3>
                <p>{t.task}</p>
                <div className="tip-game">🎮 {t.game}</div>
              </article>
            ))}
          </div>
        </section>
      )}


      <section className="demo-cta">
        <div className="demo-cta-glow" />
        <span className="demo-cta-shape demo-cta-shape-1" />
        <span className="demo-cta-shape demo-cta-shape-2" />
        <span className="demo-cta-shape demo-cta-shape-3" />

        <div className="demo-cta-inner">
          <span className="demo-cta-badge">✨ Live Demo</span>

          <h2 className="demo-cta-title">
            Ready to see your own students&apos; reports?
          </h2>

          <div className="demo-cta-actions">
            <Link to="/signup/teacher" className="demo-cta-primary">
              Sign up to see your students&apos; reports
              <span className="demo-cta-arrow">→</span>
            </Link>

            <Link to="/" className="demo-cta-secondary">
              Home
            </Link>

            <div
              style={{
                display: 'flex',
                gap: '15px',
                alignItems: 'center',
              }}
            >
              <Link
  to="/teacher-workspace"
  className="teacher-workspace"
>
  ✦ Teacher Workspace
</Link>

 {/* Add a container for your links to keep them tidy */}
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            {/* THIS IS THE NEW LINK TO YOUR APPROACH PAGE */}
            <Link to="/our-approach" className="demo-cta-secondary">
              How it Works
            </Link>
			</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}


export default TeacherDashboard;
