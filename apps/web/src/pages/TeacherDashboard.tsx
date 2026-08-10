import { useState } from 'react';
import '../styles/teacher-dashboard.css';
import { Link } from 'react-router-dom';


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
  { subject: 'Maths', tip: 'Start each lesson with a 2-minute warm-up puzzle — patterns, sequences, or number games. Wakes up logical thinking without extra prep.' },
  { subject: 'Language', tip: 'Use "story feelings" discussions: ask how a character felt and why. One question per lesson builds empathy naturally.' },
  { subject: 'Science', tip: 'Assign roles in group experiments — observer, recorder, presenter. Rotating roles builds leadership and cooperation together.' },
  { subject: 'Activities', tip: 'Let students design their own rules for a game. Builds social awareness and confidence organically.' },
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
          <span className="teacher-logo">🎓</span>
          <div>
            <h1>Class 4B Dashboard</h1>
            <p>32 students · Bhāva Tech Academy</p>
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
                <div className="capacity-bar-track">
                  <div className="capacity-bar-fill" style={{ width: `${c.value}%`, background: c.color }} />
                </div>
                <div className="capacity-row">
                  <span>{c.key}</span>
                  <strong style={{ color: c.color }}>{c.value}</strong>
                </div>
              </div>
            ))}
          </div>


          <h2 className="t-section-heading">🎯 Needs Attention</h2>
          <div className="focus-list">
            {capacityFocusList.map((f) => (
              <div className="focus-item" key={f.name + f.capacity}>
                <div className="focus-avatar">{f.name.charAt(0)}</div>
                <div className="focus-info">
                  <strong>{f.name}</strong>
                  <span>{f.capacity} · <b className="focus-score">{f.score}</b></span>
                </div>
              </div>
            ))}
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
          <h2 className="t-section-heading">Class-Level Teaching Tips</h2>
          <div className="tips-grid">
            {teachingTips.map((t) => (
              <div className="tip-card" key={t.subject}>
                <span className="tip-subject">{t.subject}</span>
                <p>{t.tip}</p>
              </div>
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
          <h2 className="demo-cta-title">Ready to see your own students&apos; reports?</h2>
          <div className="demo-cta-actions">
            <Link to="/login/teacher" className="demo-cta-primary">
              Sign up to see your students&apos; reports
              <span className="demo-cta-arrow">→</span>
            </Link>
            <Link to="/" className="demo-cta-secondary">Home</Link>
          </div>
        </div>
      </section>
    </div>
  );
}


export default TeacherDashboard;