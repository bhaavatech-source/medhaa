import { useNavigate } from 'react-router-dom';
import './HomePage.css';


export default function HomePage() {
  const navigate = useNavigate();


  return (
    <div className="home-wrap">
      <header className="home-hero">
        <h1 className="home-title">Medhaa</h1>
        <p className="home-sub">Holistic development for curious minds — cognitive games, real insights.</p>
      </header>


      <div className="role-grid">
        <div className="role-card role-admin" onClick={() => navigate('/login/admin')}>
          <div className="role-icon">🛠️</div>
          <h3>Admin</h3>
          <p>Manage students, teachers & classes.</p>
        </div>


        <div className="role-card role-teacher" onClick={() => navigate('/teacher-demo')}>
          <div className="role-icon">🎓</div>
          <h3>Teacher</h3>
          <p>Track class progress & get teaching tips.</p>
        </div>


        <div className="role-card role-parent" onClick={() => navigate('/parent-demo')}>
          <div className="role-icon">👨‍👩‍👧</div>
          <h3>Parent</h3>
          <p>See how your child is growing — cognitively and emotionally.</p>
        </div>


        <div className="role-card role-student" onClick={() => navigate('/student')}>
  <div className="role-icon role-icon-student">
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="20" width="52" height="28" rx="14" fill="url(#controllerGradient)" />
      <circle cx="20" cy="34" r="4" fill="white" opacity="0.9" />
      <circle cx="12" cy="34" r="4" fill="white" opacity="0.9" />
      <circle cx="16" cy="30" r="4" fill="white" opacity="0.9" />
      <circle cx="16" cy="38" r="4" fill="white" opacity="0.9" />
      <circle cx="44" cy="30" r="3.5" fill="white" opacity="0.85" />
      <circle cx="50" cy="34" r="3.5" fill="white" opacity="0.85" />
      <circle cx="44" cy="38" r="3.5" fill="white" opacity="0.85" />
      <circle cx="38" cy="34" r="3.5" fill="white" opacity="0.85" />
      <defs>
        <linearGradient id="controllerGradient" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0d9488" />
          <stop offset="1" stopColor="#06b6d4" />
        </linearGradient>
      </defs>
    </svg>
  </div>
  <h3>Student</h3>
  <p>Play fun games. Learn. Grow. No login needed to start!</p>
</div>
      </div>


      <footer className="home-footer">© 2026 Medhaa · Designed for curious minds</footer>
    </div>
  );
}