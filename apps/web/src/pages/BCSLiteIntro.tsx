import { useNavigate } from 'react-router-dom';
import medhaaIcon from '../assets/logo/medhaa-icon.svg';
import { markPlayed } from '../services/gameExposure';

export default function BCSLiteIntro() {
  const navigate = useNavigate();

  return (
    <main className="my-medhaa-intro">
      <section className="my-medhaa-intro__card" aria-labelledby="my-medhaa-intro-title">
        <div className="my-medhaa-intro__brand">
          <img src={medhaaIcon} alt="Medhā" />
        </div>

        <span className="my-medhaa-intro__kicker">MY MEDHĀ</span>
        <h1 id="my-medhaa-intro-title">Start with a simple check-in.</h1>
        <p className="my-medhaa-intro__lead">
          A short, play-based activity to give you a starting point for your Medhā journey.
          You can repeat it later to see how your progress is developing.
        </p>

        <div className="my-medhaa-intro__points" aria-label="What to expect">
          <span>🎯 Short & game-like</span>
          <span>⏸ Take a break anytime</span>
          <span>📈 Check in again later</span>
        </div>

        <div className="my-medhaa-intro__actions">
          <button
            type="button"
            className="my-medhaa-intro__primary"
            onClick={() => { markPlayed('bcs-lite-v3'); window.location.href = '/games-static/bcs-lite-v3.html'; }}
          >
            Start My Medhā →
          </button>

          <button
            type="button"
            className="my-medhaa-intro__secondary"
            onClick={() => navigate('/student')}
          >
            Back to Student Home
          </button>
        </div>

        <p className="my-medhaa-intro__note">
          Your check-in is free. Detailed results and deeper progress insights are part of My Medhā (Pro).
        </p>
      </section>
    </main>
  );
}
