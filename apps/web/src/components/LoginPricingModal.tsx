import { useNavigate } from 'react-router-dom';
import '../styles/login-pricing-modal.css';


interface LoginPricingModalProps {
  onClose: () => void;
}


export default function LoginPricingModal({ onClose }: LoginPricingModalProps) {
 const navigate = useNavigate();
 const goLogin = () => {
   onClose();
   navigate('/login/student');
 };
 const goSubscribe = () => {
   onClose();
   navigate('/subscribe');
 };
  return (
    <div className="lpm-overlay">
      <section className="lpm-card" role="dialog" aria-modal="true" aria-labelledby="lpm-title">
        <button className="lpm-close" onClick={onClose} aria-label="Close">✕</button>
        <div className="lpm-content">
          <p className="lpm-eyebrow">Medhā</p>
          <h2 id="lpm-title">Keep playing</h2>
          <p className="lpm-sub">Sign in or explore plans.</p>
          <div className="lpm-actions">
            <button type="button" className="lpm-login-btn" onClick={goLogin}>
              Log in <span aria-hidden="true">→</span>
            </button>
            <button type="button" className="lpm-subscribe-btn" onClick={goSubscribe}>
              Plans and pricing <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
