import React, { useMemo, useRef, useState } from 'react';
import './TeacherWorkspace.css';
import MedhaaIcon from '../assets/logo/medhaa-icon.svg';
import MedhaaLogo from '../assets/logo/M_2.png';
import { Link } from 'react-router-dom';

type Tab =
  | 'overview'
  | 'students'
  | 'classes'
  | 'activities'
  | 'participation'
  | 'reports'
  | 'settings';

type Student = {
  id: string;
  name: string;
  grade: string;
  section: string;
  roll?: string;
  parent?: string;
};

type TeacherClass = {
  id: string;
  grade: string;
  section: string;
  subject?: string;
};

type Activity = {
  id: string;
  name: string;
  domain: string;
  duration: string;
  assignedClassIds: string[];
};

const navItems: { id: Tab; label: string; icon: string }[] = [
  { id: 'overview', label: 'Overview', icon: 'grid' },
  { id: 'students', label: 'Students', icon: 'student' },
  { id: 'classes', label: 'Classes', icon: 'class' },
  { id: 'activities', label: 'Activities', icon: 'activity' },
  { id: 'participation', label: 'Participation', icon: 'pulse' },
  { id: 'reports', label: 'Reports', icon: 'report' },
  { id: 'settings', label: 'Settings', icon: 'settings' },
];

const subtitles: Record<Tab, string> = {
  overview: 'A practical workspace for running your classes and activities.',
  students: 'Add, import and organise the students assigned to your classes.',
  classes: 'Create sections you teach and keep them ready for activities.',
  activities: 'Assign Medhā activities to your classes and track what is scheduled.',
  participation: 'See real participation data once activities begin.',
  reports: 'Build class and activity reports from actual data.',
  settings: 'Configure your teacher profile and preferences.',
};

function Icon({ name, size = 19 }: { name: string; size?: number }) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  };

  const paths: Record<string, React.ReactNode> = {
    grid: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="2" />
        <rect x="14" y="3" width="7" height="7" rx="2" />
        <rect x="3" y="14" width="7" height="7" rx="2" />
        <rect x="14" y="14" width="7" height="7" rx="2" />
      </>
    ),
    student: (
      <>
        <path d="M4 20v-1.5A4.5 4.5 0 0 1 8.5 14h3A4.5 4.5 0 0 1 16 18.5V20" />
        <circle cx="10" cy="7" r="3.5" />
        <path d="M17 14.5a4 4 0 0 1 3 3.8V20" />
        <path d="M16.5 4.5a3.3 3.3 0 0 1 0 6.2" />
      </>
    ),
    class: (
      <>
        <path d="M3 5.5 12 3l9 2.5v13L12 21l-9-2.5z" />
        <path d="M12 3v18M3 5.5l9 3 9-3" />
      </>
    ),
    activity: (
      <>
        <path d="M4 19V5" />
        <path d="M4 17c4-4 7 3 10-1s4-6 6-4" />
        <circle cx="18.5" cy="12" r="1.5" />
      </>
    ),
    pulse: <path d="M3 12h4l2-6 4 12 2-6h6" />,
    report: (
      <>
        <path d="M6 3h9l4 4v14H6z" />
        <path d="M14 3v5h5M9 13h6M9 17h6" />
      </>
    ),
    settings: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.8 1.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6V20h-2.6v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1-1.8-1.8.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H6.4v-2.6h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1 1.8-1.8.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.6V4h2.6v.1a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1 1.8 1.8-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.1v2.6h-.1a1.7 1.7 0 0 0-1.6 1Z" />
      </>
    ),
    plus: <path d="M12 5v14M5 12h14" />,
    upload: (
      <>
        <path d="M12 16V4" />
        <path d="m7 9 5-5 5 5" />
        <path d="M5 20h14" />
      </>
    ),
    search: (
      <>
        <circle cx="10.8" cy="10.8" r="6.5" />
        <path d="m16 16 4.5 4.5" />
      </>
    ),
    arrow: (
      <>
        <path d="M5 12h14" />
        <path d="m13 6 6 6-6 6" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    clock: (
      <>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    info: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 11v5M12 8h.01" />
      </>
    ),
  };

  return (
    <svg {...common}>{paths[name] ?? paths.info}</svg>
  );
}

function parseCsv(text: string): string[][] {
  return text
    .split(/\r?\n/)
    .map((line) => line.split(',').map((cell) => cell.trim().replace(/^"|"$/g, '')))
    .filter((row) => row.some(Boolean));
}

export default function TeacherWorkspace() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [teacherName, setTeacherName] = useState('Your Name');
  const [academicYear, setAcademicYear] = useState('2026-27');

  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<TeacherClass[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);

  const [studentSearch, setStudentSearch] = useState('');

  const [showStudentForm, setShowStudentForm] = useState(false);
  const [showClassForm, setShowClassForm] = useState(false);
  const [showActivityForm, setShowActivityForm] = useState(false);

  const studentFileRef = useRef<HTMLInputElement>(null);

  const [studentDraft, setStudentDraft] = useState({ name: '', grade: '', section: '', roll: '', parent: '' });
  const [classDraft, setClassDraft] = useState({ grade: '', section: '', subject: '' });
  const [activityDraft, setActivityDraft] = useState({ name: '', domain: '', duration: '15 min', classId: '' });

  const counts = {
    students: students.length,
    classes: classes.length,
    activities: activities.length,
  };

  const setupSteps = [
    { label: 'Teacher profile', done: teacherName !== 'Your Name' },
    { label: 'Student list', done: students.length > 0 },
    { label: 'Classes / sections', done: classes.length > 0 },
    { label: 'First activity', done: activities.length > 0 },
  ];
  const setupPercent = Math.round(
    (setupSteps.filter((s) => s.done).length / setupSteps.length) * 100,
  );

  const filteredStudents = useMemo(
    () =>
      students.filter((student) =>
        `${student.name} ${student.grade} ${student.section}`
          .toLowerCase()
          .includes(studentSearch.toLowerCase()),
      ),
    [students, studentSearch],
  );

  const go = (tab: Tab) => setActiveTab(tab);

  const addStudent = () => {
    if (!studentDraft.name.trim() || !studentDraft.grade.trim()) return;
    setStudents((current) => [...current, { id: crypto.randomUUID(), ...studentDraft }]);
    setStudentDraft({ name: '', grade: '', section: '', roll: '', parent: '' });
    setShowStudentForm(false);
  };

  const addClass = () => {
    if (!classDraft.grade.trim() || !classDraft.section.trim()) return;
    setClasses((current) => [...current, { id: crypto.randomUUID(), ...classDraft }]);
    setClassDraft({ grade: '', section: '', subject: '' });
    setShowClassForm(false);
  };

  const addActivity = () => {
    if (!activityDraft.name.trim()) return;
    setActivities((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        name: activityDraft.name,
        domain: activityDraft.domain || 'Not specified',
        duration: activityDraft.duration,
        assignedClassIds: activityDraft.classId ? [activityDraft.classId] : [],
      },
    ]);
    setActivityDraft({ name: '', domain: '', duration: '15 min', classId: '' });
    setShowActivityForm(false);
  };

  const importStudents = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const rows = parseCsv(String(reader.result ?? ''));
      if (rows.length < 2) return;
      const header = rows[0].map((h) => h.toLowerCase());
      const find = (row: string[], ...names: string[]) => {
        const index = header.findIndex((h) => names.some((name) => h.includes(name)));
        return index >= 0 ? row[index] ?? '' : '';
      };
      const imported = rows
        .slice(1)
        .map((row) => ({
          id: crypto.randomUUID(),
          name: find(row, 'student name', 'name'),
          grade: find(row, 'grade', 'class'),
          section: find(row, 'section'),
          roll: find(row, 'roll'),
          parent: find(row, 'parent', 'guardian'),
        }))
        .filter((student) => student.name);
      setStudents((current) => [...current, ...imported]);
    };
    reader.readAsText(file);
  };

  const sectionTitle = navItems.find((item) => item.id === activeTab)?.label ?? 'Overview';

  return (
    <div className="teacher-shell">
      <div className="teacher-bg" aria-hidden="true">
        <span className="bg-star star-a" />
        <span className="bg-star star-b" />
        <span className="bg-star star-c" />
        <span className="bg-star star-d" />
        <span className="bg-orbit orbit-a" />
        <span className="bg-orbit orbit-b" />
        <span className="bg-glow glow-a" />
        <span className="bg-glow glow-b" />
        <span className="bg-wave wave-a" />
        <span className="bg-wave wave-b" />
      </div>

      <aside className="teacher-sidebar">
        <div className="brand-area">
          <img src={MedhaaIcon} className="brand-icon" alt="Medhā" />
          <span className="brand-caption">Teacher workspace</span>
        </div>

        <div className="teacher-identity">
          <span className="identity-dot" />
          <div>
            <strong>{teacherName}</strong>
            <small>{academicYear}</small>
          </div>
        </div>

        <nav className="teacher-nav" aria-label="Teacher navigation">
          <Link className="nav-item home-link" to="/">
            <Icon name="arrow" size={18} />
            <span>Home</span>
          </Link>
          <div className="nav-divider" />
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => go(item.id)}
            >
              <span className="nav-icon">
                <Icon name={item.icon} />
              </span>
              <span>{item.label}</span>
              {item.id === 'students' && students.length > 0 && <em>{students.length}</em>}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-note">
            <img src={MedhaaIcon} alt="" />
            <span>Medhā keeps real records first, insights when data exists.</span>
          </div>
          <small>© 2026 Medhā</small>
        </div>
      </aside>

      <main className="teacher-main">
        <header className="teacher-topbar">
          <div>
            <span className="eyebrow">MEDHĀ TEACHER</span>
            <h1>{sectionTitle}</h1>
            <p>{subtitles[activeTab]}</p>
          </div>
          <div className="topbar-actions">
            <span className="academic-pill">
              <Icon name="clock" size={16} />
              {academicYear}
            </span>
            <Link className="profile-pill" to="/settings" title="Account Settings">
              <span className="profile-avatar"><Icon name="settings" size={16} /></span>
              <span>Account</span>
            </Link>
            <button className="profile-pill" type="button" onClick={() => go('settings')}>
              <span className="profile-avatar">
                <img src={MedhaaIcon} alt="" />
              </span>
              <span>{teacherName}</span>
            </button>
          </div>
        </header>

        {activeTab === 'overview' && (
          <section className="page-content">
            <div className="hero-panel">
              <div className="hero-copy">
                <span className="hero-badge">
                  <img src={MedhaaIcon} alt="" />
                  Teacher workspace
                </span>
                <h2>Build your teaching workspace first.</h2>
                <p>
                  Add your real students, classes and activity plans. Medhā will use that
                  information to organise activities and generate useful reports as activity
                  data becomes available.
                </p>
                <div className="hero-actions">
                  <button className="btn-primary" type="button" onClick={() => go('students')}>
                    Add students
                    <Icon name="arrow" size={17} />
                  </button>
                  <button className="btn-secondary" type="button" onClick={() => go('classes')}>
                    Set up classes
                  </button>
                </div>
              </div>
              <div className="hero-mark">
                <img src={MedhaaLogo} alt="Medhā" />
                <span className="sparkle">✦</span>
              </div>
            </div>

            <div className="metric-grid">
              {[
                { id: 'students', value: counts.students, label: 'Students added', icon: 'student' },
                { id: 'classes', value: counts.classes, label: 'Classes created', icon: 'class' },
                { id: 'activities', value: counts.activities, label: 'Activities scheduled', icon: 'activity' },
              ].map(({ id, value, label, icon }) => (
                <button
                  className="metric-card"
                  key={String(id)}
                  type="button"
                  onClick={() => go(id as Tab)}
                >
                  <span className={`metric-icon icon-${icon}`}>
                    <Icon name={String(icon)} />
                  </span>
                  <strong>{value}</strong>
                  <span>{label}</span>
                  <Icon name="arrow" size={15} />
                </button>
              ))}
            </div>

            <div className="two-column">
              <section className="panel setup-panel">
                <div className="panel-heading">
                  <div>
                    <span className="eyebrow">FIRST STEPS</span>
                    <h2>Workspace setup</h2>
                  </div>
                  <strong className="setup-percent">{setupPercent}%</strong>
                </div>
                <div className="setup-track">
                  <span style={{ width: `${setupPercent}%` }} />
                </div>
                <div className="setup-list">
                  {setupSteps.map((step) => (
                    <button
                      key={step.label}
                      type="button"
                      className={`setup-row ${step.done ? 'done' : ''}`}
                      onClick={() => {
                        if (step.label === 'Student list') go('students');
                        if (step.label === 'Classes / sections') go('classes');
                        if (step.label === 'First activity') go('activities');
                        if (step.label === 'Teacher profile') go('settings');
                      }}
                    >
                      <span className="check-circle">
                        <Icon name="check" size={14} />
                      </span>
                      <span>{step.label}</span>
                      <Icon name="arrow" size={14} />
                    </button>
                  ))}
                </div>
              </section>

              <section className="panel action-panel">
                <div className="panel-heading">
                  <div>
                    <span className="eyebrow">ACTION CENTER</span>
                    <h2>What can you do now?</h2>
                  </div>
                </div>
                <div className="action-list">
                  <button type="button" onClick={() => setShowStudentForm(true)}>
                    <span className="action-icon">
                      <Icon name="student" />
                    </span>
                    <span>
                      <strong>Add a student</strong>
                      <small>Create one profile manually</small>
                    </span>
                    <Icon name="arrow" size={15} />
                  </button>
                  <button type="button" onClick={() => studentFileRef.current?.click()}>
                    <span className="action-icon">
                      <Icon name="upload" />
                    </span>
                    <span>
                      <strong>Import student list</strong>
                      <small>CSV with your existing records</small>
                    </span>
                    <Icon name="arrow" size={15} />
                  </button>
                  <button type="button" onClick={() => go('activities')}>
                    <span className="action-icon">
                      <Icon name="activity" />
                    </span>
                    <span>
                      <strong>Plan an activity</strong>
                      <small>Assign an activity to a class</small>
                    </span>
                    <Icon name="arrow" size={15} />
                  </button>
                </div>
              </section>
            </div>

            <section className="empty-insight">
              <div className="empty-visual">
                <span>✦</span>
                <span>◆</span>
                <span>●</span>
              </div>
              <div>
                <span className="eyebrow">INSIGHTS</span>
                <h2>Insights will appear from real activity data.</h2>
                <p>
                  No performance figures are invented here. Once students complete Medhā
                  activities, participation, activity history and progress summaries can be
                  generated from the recorded data.
                </p>
              </div>
            </section>
          </section>
        )}

        {activeTab === 'students' && (
          <section className="page-content">
            <div className="section-toolbar">
              <div>
                <h2>Student directory</h2>
                <p>Keep your class student list organised and ready for activities.</p>
              </div>
              <div className="toolbar-actions">
                <input
                  ref={studentFileRef}
                  className="hidden-file"
                  type="file"
                  accept=".csv,text/csv"
                  onChange={(e) => importStudents(e.target.files?.[0])}
                />
                <button className="btn-secondary" type="button" onClick={() => studentFileRef.current?.click()}>
                  <Icon name="upload" />
                  Import CSV
                </button>
                <button className="btn-primary" type="button" onClick={() => setShowStudentForm((v) => !v)}>
                  <Icon name="plus" />
                  Add student
                </button>
              </div>
            </div>

            {showStudentForm && (
              <div className="form-panel">
                <div className="form-heading">
                  <div>
                    <span className="eyebrow">NEW PROFILE</span>
                    <h3>Add student</h3>
                  </div>
                  <button type="button" onClick={() => setShowStudentForm(false)}>×</button>
                </div>
                <div className="form-grid">
                  <label>
                    Student name
                    <input
                      value={studentDraft.name}
                      onChange={(e) => setStudentDraft({ ...studentDraft, name: e.target.value })}
                      placeholder="Full name"
                    />
                  </label>
                  <label>
                    Grade
                    <input
                      value={studentDraft.grade}
                      onChange={(e) => setStudentDraft({ ...studentDraft, grade: e.target.value })}
                      placeholder="e.g. Grade 6"
                    />
                  </label>
                  <label>
                    Section
                    <input
                      value={studentDraft.section}
                      onChange={(e) => setStudentDraft({ ...studentDraft, section: e.target.value })}
                      placeholder="e.g. A"
                    />
                  </label>
                  <label>
                    Roll number
                    <input
                      value={studentDraft.roll}
                      onChange={(e) => setStudentDraft({ ...studentDraft, roll: e.target.value })}
                      placeholder="Optional"
                    />
                  </label>
                  <label>
                    Parent / guardian
                    <input
                      value={studentDraft.parent}
                      onChange={(e) => setStudentDraft({ ...studentDraft, parent: e.target.value })}
                      placeholder="Optional"
                    />
                  </label>
                </div>
                <button className="btn-primary" type="button" onClick={addStudent}>
                  Save student
                </button>
              </div>
            )}

            <div className="panel table-panel">
              <div className="table-tools">
                <div className="search-box">
                  <Icon name="search" size={17} />
                  <input
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    placeholder="Search students..."
                  />
                </div>
                <span className="record-count">
                  {students.length} student{students.length === 1 ? '' : 's'}
                </span>
              </div>

              {students.length === 0 ? (
                <EmptyState
                  icon="student"
                  title="No students added yet"
                  text="Import your existing student list or add students individually. Your actual class data stays the source of all future reports."
                  primary="Import student CSV"
                  onPrimary={() => studentFileRef.current?.click()}
                  secondary="Add manually"
                  onSecondary={() => setShowStudentForm(true)}
                />
              ) : (
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Student</th>
                        <th>Grade</th>
                        <th>Section</th>
                        <th>Roll</th>
                        <th>Parent / guardian</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStudents.map((student) => (
                        <tr key={student.id}>
                          <td><strong>{student.name}</strong></td>
                          <td>{student.grade || '—'}</td>
                          <td>{student.section || '—'}</td>
                          <td>{student.roll || '—'}</td>
                          <td>{student.parent || '—'}</td>
                          <td>
                            <button
                              className="icon-button"
                              type="button"
                              title="Remove student"
                              onClick={() =>
                                setStudents((current) => current.filter((s) => s.id !== student.id))
                              }
                            >
                              ×
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              <p className="helper-note">
                <Icon name="info" size={15} />
                CSV headers can include Student Name, Grade, Section, Roll Number and
                Parent/Guardian.
              </p>
            </div>
          </section>
        )}

        {activeTab === 'classes' && (
          <section className="page-content">
            <div className="section-toolbar">
              <div>
                <h2>Classes & sections</h2>
                <p>Create the sections you teach and connect students to them.</p>
              </div>
              <button className="btn-primary" type="button" onClick={() => setShowClassForm((v) => !v)}>
                <Icon name="plus" />
                Create class
              </button>
            </div>

            {showClassForm && (
              <div className="form-panel">
                <div className="form-heading">
                  <div>
                    <span className="eyebrow">ACADEMIC STRUCTURE</span>
                    <h3>Create class section</h3>
                  </div>
                  <button type="button" onClick={() => setShowClassForm(false)}>×</button>
                </div>
                <div className="form-grid">
                  <label>
                    Grade
                    <input
                      value={classDraft.grade}
                      onChange={(e) => setClassDraft({ ...classDraft, grade: e.target.value })}
                      placeholder="e.g. Grade 6"
                    />
                  </label>
                  <label>
                    Section
                    <input
                      value={classDraft.section}
                      onChange={(e) => setClassDraft({ ...classDraft, section: e.target.value })}
                      placeholder="e.g. A"
                    />
                  </label>
                  <label>
                    Subject
                    <input
                      value={classDraft.subject}
                      onChange={(e) => setClassDraft({ ...classDraft, subject: e.target.value })}
                      placeholder="Optional"
                    />
                  </label>
                </div>
                <button className="btn-primary" type="button" onClick={addClass}>
                  Create class
                </button>
              </div>
            )}

            {classes.length === 0 ? (
              <div className="panel">
                <EmptyState
                  icon="class"
                  title="No classes created yet"
                  text="Create your grades and sections first. Students can then be organised into the right classes."
                  primary="Create first class"
                  onPrimary={() => setShowClassForm(true)}
                />
              </div>
            ) : (
              <div className="class-grid">
                {classes.map((item) => {
                  const studentCount = students.filter(
                    (s) => s.grade === item.grade && s.section === item.section,
                  ).length;
                  return (
                    <article className="class-card" key={item.id}>
                      <div className="class-art">
                        <Icon name="class" size={24} />
                      </div>
                      <div>
                        <span className="eyebrow">CLASS</span>
                        <h3>{item.grade} · {item.section}</h3>
                        <p>{studentCount} student{studentCount === 1 ? '' : 's'}</p>
                      </div>
                      <div className="class-teacher">
                        <Icon name="student" size={15} />
                        {item.subject || 'Subject not set'}
                      </div>
                      <button
                        className="text-link"
                        type="button"
                        onClick={() =>
                          setClasses((current) => current.filter((c) => c.id !== item.id))
                        }
                      >
                        Remove
                      </button>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {activeTab === 'activities' && (
          <section className="page-content">
            <div className="section-toolbar">
              <div>
                <h2>Activity planning</h2>
                <p>Assign activities to real classes. Participation appears only after students use them.</p>
              </div>
              <button className="btn-primary" type="button" onClick={() => setShowActivityForm((v) => !v)}>
                <Icon name="plus" />
                Plan activity
              </button>
            </div>

            {showActivityForm && (
              <div className="form-panel">
                <div className="form-heading">
                  <div>
                    <span className="eyebrow">NEW ASSIGNMENT</span>
                    <h3>Plan a Medhā activity</h3>
                  </div>
                  <button type="button" onClick={() => setShowActivityForm(false)}>×</button>
                </div>
                <div className="form-grid">
                  <label>
                    Activity name
                    <input
                      value={activityDraft.name}
                      onChange={(e) => setActivityDraft({ ...activityDraft, name: e.target.value })}
                      placeholder="e.g. Pattern Sequence"
                    />
                  </label>
                  <label>
                    Domain
                    <input
                      value={activityDraft.domain}
                      onChange={(e) => setActivityDraft({ ...activityDraft, domain: e.target.value })}
                      placeholder="e.g. Reasoning"
                    />
                  </label>
                  <label>
                    Duration
                    <select
                      value={activityDraft.duration}
                      onChange={(e) => setActivityDraft({ ...activityDraft, duration: e.target.value })}
                    >
                      <option>5 min</option>
                      <option>10 min</option>
                      <option>15 min</option>
                      <option>20 min</option>
                    </select>
                  </label>
                  <label>
                    Assign to
                    <select
                      value={activityDraft.classId}
                      onChange={(e) => setActivityDraft({ ...activityDraft, classId: e.target.value })}
                    >
                      <option value="">Select class</option>
                      {classes.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.grade} {c.section}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <button className="btn-primary" type="button" onClick={addActivity}>
                  Save activity plan
                </button>
              </div>
            )}

            {activities.length === 0 ? (
              <div className="panel">
                <EmptyState
                  icon="activity"
                  title="No activities scheduled"
                  text="Once classes are ready, use this area to assign Medhā activities. No performance claims are shown until real activity data exists."
                  primary="Plan first activity"
                  onPrimary={() => setShowActivityForm(true)}
                />
              </div>
            ) : (
              <div className="activity-grid">
                {activities.map((activity) => (
                  <article className="activity-card" key={activity.id}>
                    <span className="activity-symbol">
                      <Icon name="activity" />
                    </span>
                    <span className="eyebrow">{activity.domain}</span>
                    <h3>{activity.name}</h3>
                    <p>
                      <Icon name="clock" size={14} />
                      {activity.duration}
                    </p>
                    <div className="assigned-label">
                      {activity.assignedClassIds.length
                        ? `${activity.assignedClassIds.length} class assigned`
                        : 'No class assigned'}
                    </div>
                    <button
                      className="text-link"
                      type="button"
                      onClick={() =>
                        setActivities((current) => current.filter((a) => a.id !== activity.id))
                      }
                    >
                      Remove plan
                    </button>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}

        {activeTab === 'participation' && (
          <section className="page-content">
            <div className="section-toolbar">
              <div>
                <h2>Participation</h2>
                <p>Operational data from completed activities will appear here.</p>
              </div>
            </div>
            <div className="empty-insight large-empty">
              <div className="empty-visual">
                <Icon name="pulse" size={34} />
              </div>
              <div>
                <span className="eyebrow">WAITING FOR ACTIVITY DATA</span>
                <h2>No participation data yet.</h2>
                <p>
                  When students begin assigned activities, this area can show completion,
                  attempts, activity time and class participation. It will not invent scores or
                  performance percentages.
                </p>
                <button className="btn-primary" type="button" onClick={() => go('activities')}>
                  Plan an activity
                  <Icon name="arrow" size={17} />
                </button>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'reports' && (
          <section className="page-content">
            <div className="section-toolbar">
              <div>
                <h2>Reports</h2>
                <p>Generate reports from actual class records and Medhā activity data.</p>
              </div>
            </div>
            <div className="report-grid">
              {[
                {
                  title: 'Class activity summary',
                  text: 'Participation, assignments and activity history for the selected period.',
                  label: 'Class',
                },
                {
                  title: 'Student activity history',
                  text: 'A factual record of activities completed by an individual student.',
                  label: 'Student',
                },
                {
                  title: 'Activity coordination report',
                  text: 'Assignments and activity scheduling across your classes.',
                  label: 'Activity',
                },
              ].map(({ title, text, label }) => (
                <article className="report-card" key={title}>
                  <span className="report-icon">
                    <Icon name="report" />
                  </span>
                  <span className="eyebrow">{label} REPORT</span>
                  <h3>{title}</h3>
                  <p>{text}</p>
                  <button className="btn-secondary" type="button" disabled>
                    Available when data exists
                  </button>
                </article>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'settings' && (
          <section className="page-content">
            <div className="section-toolbar">
              <div>
                <h2>Teacher settings</h2>
                <p>Configure your identity and preferences for this teacher workspace.</p>
              </div>
            </div>
            <div className="settings-grid">
              <section className="panel">
                <div className="panel-heading">
                  <div>
                    <span className="eyebrow">TEACHER PROFILE</span>
                    <h2>Basic information</h2>
                  </div>
                </div>
                <div className="form-grid single">
                  <label>
                    Teacher name
                    <input value={teacherName} onChange={(e) => setTeacherName(e.target.value)} />
                  </label>
                  <label>
                    Academic year
                    <input value={academicYear} onChange={(e) => setAcademicYear(e.target.value)} />
                  </label>
                  <label>
                    Contact email
                    <input type="email" placeholder="teacher@school.edu" />
                  </label>
                </div>
              </section>
              <section className="panel permission-panel">
                <div className="panel-heading">
                  <div>
                    <span className="eyebrow">ACCESS</span>
                    <h2>Roles & permissions</h2>
                  </div>
                </div>
                {['Class teacher', 'Subject teacher', 'Activity coordinator'].map((role) => (
                  <div className="permission-row" key={role}>
                    <span>{role}</span>
                    <span className="status-tag">Configure later</span>
                  </div>
                ))}
              </section>
            </div>
          </section>
        )}

        <footer className="teacher-footer">
          <img src={MedhaaIcon} alt="" />
          <span>Medhā Teacher Workspace — Real records first, insights when data is available.</span>
        </footer>
      </main>
    </div>
  );
}

function EmptyState({
  icon,
  title,
  text,
  primary,
  secondary,
  onPrimary,
  onSecondary,
}: {
  icon: string;
  title: string;
  text: string;
  primary: string;
  secondary?: string;
  onPrimary: () => void;
  onSecondary?: () => void;
}) {
  return (
    <div className="empty-state">
      <span className="empty-icon">
        <Icon name={icon} size={28} />
      </span>
      <span className="eyebrow">READY WHEN YOU ARE</span>
      <h3>{title}</h3>
      <p>{text}</p>
      <div className="empty-actions">
        <button className="btn-primary" type="button" onClick={onPrimary}>
          {primary}
          <Icon name="arrow" size={16} />
        </button>
        {secondary && onSecondary && (
          <button className="btn-secondary" type="button" onClick={onSecondary}>
            {secondary}
          </button>
        )}
      </div>
    </div>
  );
}
