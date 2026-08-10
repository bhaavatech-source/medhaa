import React, { useState } from 'react';
import './SchoolReport.css';

const subtitles: Record<string, string> = {
  dashboard: 'Student Development Overview · Aug 2026',
  students: 'Manage Student Profiles and Activity',
  classes: 'Class and Section Performance Metrics',
  teachers: 'Manage Faculty Accounts and Assignments',
  growth: 'Long-term Cognitive Growth Analysis',
  reports: 'Export Data and Presentation Materials',
  settings: 'Configuration and Billing Management',
};

export default function SchoolReport() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  return (
    <div className="layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-brand">Medhaa<span> · School</span></div>
        <div className="sidebar-school">Greenwood School</div>
        
        <a className="nav-item" href="/">
          <span className="nav-icon">🏡</span> Home
        </a>
        <button className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
          <span className="nav-icon">🏠</span> Dashboard
        </button>
        <button className={`nav-item ${activeTab === 'students' ? 'active' : ''}`} onClick={() => setActiveTab('students')}>
          <span className="nav-icon">🧑‍🎓</span> Students
        </button>
        <button className={`nav-item ${activeTab === 'classes' ? 'active' : ''}`} onClick={() => setActiveTab('classes')}>
          <span className="nav-icon">🏫</span> Classes
        </button>
        <button className={`nav-item ${activeTab === 'teachers' ? 'active' : ''}`} onClick={() => setActiveTab('teachers')}>
          <span className="nav-icon">👩‍🏫</span> Teachers
        </button>
        <button className={`nav-item ${activeTab === 'growth' ? 'active' : ''}`} onClick={() => setActiveTab('growth')}>
          <span className="nav-icon">📈</span> Growth
        </button>
        <button className={`nav-item ${activeTab === 'reports' ? 'active' : ''}`} onClick={() => setActiveTab('reports')}>
          <span className="nav-icon">📄</span> Reports
        </button>
        <button className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
          <span className="nav-icon">⚙️</span> Settings
        </button>
        
        <div className="sidebar-foot">© 2026 Medhaa Brain Gym<br />School Admin Console</div>
      </aside>

      <main className="content">
        {/* Universal Header */}
        <header className="topbar">
          <div>
            <div className="greeting">Good morning, Greenwood School 👋</div>
            <div className="greeting-sub">{subtitles[activeTab]}</div>
          </div>
          <div className="topbar-right">
            <div className="school-pill">📅 This Academic Year</div>
          </div>
        </header>

        {/* TAB 1: DASHBOARD */}
        <div className={`tab-content ${activeTab === 'dashboard' ? 'active' : ''}`}>
          <div className="stat-row">
            <div className="stat-card"><div className="stat-num">842</div><div className="stat-lbl">Total Students</div></div>
            <div className="stat-card"><div className="stat-num">716</div><div className="stat-lbl">Active This Month</div></div>
            <div className="stat-card"><div className="stat-num">4,382</div><div className="stat-lbl">Play Sessions</div></div>
            <div className="stat-card"><div className="stat-num">+12.4%</div><div className="stat-lbl">Growth vs Last Term</div></div>
          </div>

          <h2 className="sec-title">📊 Development Overview <span className="sec-badge">School-wide average</span></h2>
          <div className="panel">
            <div className="dev-row"><div className="dev-label">Focus</div><div className="dev-bar-wrap"><div className="dev-bar-fill" style={{ width: '78%', background: 'var(--teal)' }}></div></div><div className="dev-pct">78%</div></div>
            <div className="dev-row"><div className="dev-label">Memory</div><div className="dev-bar-wrap"><div className="dev-bar-fill" style={{ width: '71%', background: 'var(--blue)' }}></div></div><div className="dev-pct">71%</div></div>
            <div className="dev-row"><div className="dev-label">Reasoning</div><div className="dev-bar-wrap"><div className="dev-bar-fill" style={{ width: '76%', background: 'var(--amber)' }}></div></div><div className="dev-pct">76%</div></div>
            <div className="dev-row"><div className="dev-label">Strategy</div><div className="dev-bar-wrap"><div className="dev-bar-fill" style={{ width: '64%', background: 'var(--purple)' }}></div></div><div className="dev-pct">64%</div></div>
          </div>

          <div className="cta-box">
            <div className="cta-glow"></div>
            <div style={{ position: 'relative', zIndex: 2 }}>
            </div>
          </div>
        </div>

        {/* TAB 2: STUDENTS */}
        <div className={`tab-content ${activeTab === 'students' ? 'active' : ''}`}>
          <h2 className="sec-title">🧑‍🎓 Student Directory <span className="sec-badge">842 Enrolled</span></h2>
          <div className="panel">
            <table>
              <thead>
                <tr><th>Student Name</th><th>Grade & Section</th><th>Overall Power Score</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                <tr><td>Aarav Krishnan</td><td>Grade 6 - B</td><td>82</td><td><span className="tag active">Active</span></td><td><button className="action-btn">View Profile</button></td></tr>
                <tr><td>Priya Patel</td><td>Grade 6 - A</td><td>76</td><td><span className="tag active">Active</span></td><td><button className="action-btn">View Profile</button></td></tr>
                <tr><td>Rohan Sharma</td><td>Grade 7 - C</td><td>64</td><td><span className="tag warn">Needs Encouragement</span></td><td><button className="action-btn">View Profile</button></td></tr>
                <tr><td>Ananya Desai</td><td>Grade 5 - B</td><td>88</td><td><span className="tag active">Active</span></td><td><button className="action-btn">View Profile</button></td></tr>
                <tr><td>Vikram Singh</td><td>Grade 8 - A</td><td>91</td><td><span className="tag active">Active</span></td><td><button className="action-btn">View Profile</button></td></tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* TAB 3: CLASSES */}
        <div className={`tab-content ${activeTab === 'classes' ? 'active' : ''}`}>
          <h2 className="sec-title">🏫 Class Performance <span className="sec-badge">24 Active Sections</span></h2>
          <div className="grid-3">
            <div className="info-card" style={{ borderTopColor: 'var(--teal)' }}>
              <h4>Grade 6 - Section A</h4>
              <p>Teacher: Mr. Davis</p>
              <span className="highlight">78 Avg Score</span>
            </div>
            <div className="info-card" style={{ borderTopColor: 'var(--blue)' }}>
              <h4>Grade 6 - Section B</h4>
              <p>Teacher: Ms. Reynolds</p>
              <span className="highlight">81 Avg Score</span>
            </div>
            <div className="info-card" style={{ borderTopColor: 'var(--amber)' }}>
              <h4>Grade 7 - Section A</h4>
              <p>Teacher: Mrs. Gupta</p>
              <span className="highlight">74 Avg Score</span>
            </div>
            <div className="info-card" style={{ borderTopColor: 'var(--purple)' }}>
              <h4>Grade 7 - Section B</h4>
              <p>Teacher: Mr. Thompson</p>
              <span className="highlight">85 Avg Score</span>
            </div>
            <div className="info-card" style={{ borderTopColor: 'var(--rose)' }}>
              <h4>Grade 8 - Section A</h4>
              <p>Teacher: Dr. Aris</p>
              <span className="highlight">89 Avg Score</span>
            </div>
          </div>
        </div>

        {/* TAB 4: TEACHERS */}
        <div className={`tab-content ${activeTab === 'teachers' ? 'active' : ''}`}>
          <h2 className="sec-title">👩‍🏫 Teacher Roster <span className="sec-badge">18 Teachers</span></h2>
          <div className="panel">
            <table>
              <thead>
                <tr><th>Teacher Name</th><th>Assigned Classes</th><th>Last Login</th><th>Actions</th></tr>
              </thead>
              <tbody>
                <tr><td>Mr. Davis</td><td>Grade 6 - A, Grade 5 - C</td><td>Today, 08:15 AM</td><td><button className="action-btn">Manage</button></td></tr>
                <tr><td>Ms. Reynolds</td><td>Grade 6 - B</td><td>Today, 09:30 AM</td><td><button className="action-btn">Manage</button></td></tr>
                <tr><td>Mrs. Gupta</td><td>Grade 7 - A, Grade 7 - C</td><td>Yesterday</td><td><button className="action-btn">Manage</button></td></tr>
                <tr><td>Mr. Thompson</td><td>Grade 7 - B</td><td>Aug 08, 2026</td><td><button className="action-btn">Manage</button></td></tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* TAB 5: GROWTH */}
        <div className={`tab-content ${activeTab === 'growth' ? 'active' : ''}`}>
          <h2 className="sec-title">📈 Term-Over-Term Growth <span className="sec-badge">School Average</span></h2>
          <div className="panel">
            <p style={{ fontSize: '14px', color: 'var(--muted)', fontWeight: 600, marginTop: 0 }}>School-wide cognitive quotient averages across all interactive sessions.</p>
            <svg className="trend-svg" viewBox="0 0 560 180" preserveAspectRatio="none">
              <line x1="0" y1="45" x2="560" y2="45" stroke="#e2e8f0" strokeWidth="2" strokeDasharray="4"/>
              <line x1="0" y1="90" x2="560" y2="90" stroke="#e2e8f0" strokeWidth="2" strokeDasharray="4"/>
              <line x1="0" y1="135" x2="560" y2="135" stroke="#e2e8f0" strokeWidth="2" strokeDasharray="4"/>
              <path d="M10,150 L100,120 L200,130 L300,90 L400,60 L500,40" fill="none" stroke="var(--teal)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
              <g fill="#ffffff" stroke="var(--teal)" strokeWidth="3">
                <circle cx="10" cy="150" r="6"/><circle cx="100" cy="120" r="6"/><circle cx="200" cy="130" r="6"/>
                <circle cx="300" cy="90" r="6"/><circle cx="400" cy="60" r="6"/><circle cx="500" cy="40" r="6"/>
              </g>
            </svg>
          </div>
        </div>

        {/* TAB 6: REPORTS */}
        <div className={`tab-content ${activeTab === 'reports' ? 'active' : ''}`}>
          <h2 className="sec-title">📄 Generate Reports <span className="sec-badge">PDF Export</span></h2>
          <div className="grid-3">
            <div className="info-card">
              <h4>🏫 Full School Report</h4>
              <p>Export the complete statistical breakdown of the entire school's progress.</p>
              <button className="action-btn" style={{ marginTop: '14px', width: '100%' }}>Download PDF</button>
            </div>
            <div className="info-card">
              <h4>📊 Class Level Report</h4>
              <p>Select a specific grade and section to export detailed class metrics.</p>
              <button className="action-btn" style={{ marginTop: '14px', width: '100%' }}>Select Class...</button>
            </div>
            <div className="info-card">
              <h4>🧑‍🎓 Student Portfolios</h4>
              <p>Batch download individual student cognitive reports for Parent-Teacher meetings.</p>
              <button className="action-btn" style={{ marginTop: '14px', width: '100%' }}>Configure Batch...</button>
            </div>
          </div>
        </div>

        {/* TAB 7: SETTINGS */}
        <div className={`tab-content ${activeTab === 'settings' ? 'active' : ''}`}>
          <h2 className="sec-title">⚙️ School Settings <span className="sec-badge">Admin Only</span></h2>
          <div className="panel">
            <div className="grid-2">
              <div>
                <div className="form-group">
                  <label>School Name</label>
                  <input type="text" defaultValue="Greenwood School" />
                </div>
                <div className="form-group">
                  <label>Admin Email Contact</label>
                  <input type="email" defaultValue="admin@greenwood.edu" />
                </div>
                <div className="form-group">
                  <label>Current Academic Term</label>
                  <select defaultValue="Fall 2026">
                    <option value="Fall 2026">Fall 2026</option>
                    <option value="Spring 2026">Spring 2026</option>
                  </select>
                </div>
                <button className="btn-primary">Save Changes</button>
              </div>
              <div className="info-card" style={{ borderTopColor: 'var(--amber)' }}>
                <h4>Subscription Status</h4>
                <p><strong>Plan:</strong> Enterprise District Plan</p>
                <p><strong>Renewal Date:</strong> Dec 15, 2026</p>
                <p><strong>Licenses Used:</strong> 842 / 1000</p>
                <button className="action-btn" style={{ marginTop: '10px' }}>Manage Billing</button>
              </div>
            </div>
          </div>
        </div>

<div className="cta-box" style={{ marginTop: '20px' }}>
  <div className="cta-glow"></div>
  <div style={{ position: 'relative', zIndex: 2 }}>
    <span className="cta-badge">🔐 School Login</span>
    <div className="cta-title">Sign Up and Check Your School Children's Score</div>
    <a href="/login/school" className="cta-btn">Sign Up / Log In →</a>
  </div>
</div>

        <footer className="report-foot">© 2026 Medhaa · Empowering schools to nurture every child's potential</footer>
      </main>
    </div>
  );
}