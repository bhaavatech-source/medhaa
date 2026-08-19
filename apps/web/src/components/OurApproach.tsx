import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/our-approach.css';
import medhaaLogo from '../assets/logo/M_2.png';
import medhaaIcon from '../assets/logo/medhaa-icon.svg';

function ArrowIcon() {
  return <span aria-hidden="true">→</span>;
}

function SparkIcon() {
  return <span className="spark-icon" aria-hidden="true">✦</span>;
}

const foundationCards = [
  { icon: '🎯', title: 'Focus & Attention', text: 'Practice staying with a task, noticing relevant information and working through distractions.' }, //[cite: 3]
  { icon: '🧠', title: 'Memory', text: 'Practice remembering, recalling and connecting information during interactive challenges.' }, //[cite: 3]
  { icon: '🔍', title: 'Critical Thinking', text: 'Question, compare, reason from evidence and make decisions instead of simply accepting an answer.' }, //[cite: 3]
  { icon: '💡', title: 'Creativity & Imagination', text: 'Explore possibilities, generate ideas and approach problems from different directions.' }, //[cite: 3]
  { icon: '🧩', title: 'Logic & Problem Solving', text: 'Recognise patterns, break problems into parts and test possible solutions.' }, //[cite: 3]
  { icon: '⚙️', title: 'Systems & Engineering Thinking', text: 'Understand components, constraints, cause and effect, trade-offs, testing and debugging.' }, //[cite: 3]
];

export function OurApproach() {
  const navigate = useNavigate();
  // State to manage the visibility of foundation texts. Null means all are hidden by default.
  const [activeFoundation, setActiveFoundation] = useState<number | null>(null);

  const toggleFoundation = (index: number) => {
    setActiveFoundation(activeFoundation === index ? null : index);
  };

  return (
    <main className="parent-demo">
      <div className="ambient-orb orb-one" />
      <div className="ambient-orb orb-two" />
      <div className="ambient-orb orb-three" />
      <div className="ambient-grid" />

      <header className="parent-nav">
        <button className="brand-button" type="button" onClick={() => navigate('/')} aria-label="Medhā home">
          <img src={medhaaLogo} className="brand-logo" alt="Medhā" />
        </button>
        <div className="nav-actions">
          <button type="button" className="nav-signup" onClick={() => navigate('/signup/parent')}>Sign up <ArrowIcon /></button>
        </div>
      </header>

      <section className="hero-shell">
        <div className="hero-copy">
          <span className="eyebrow"><SparkIcon /> MEDHĀ FOR FAMILIES</span>
          <h1>More than games.<br /><span>A gateway to learning.</span></h1>
          <p className="hero-lead">
            Children learn more effectively when they can focus, pay attention, remember, imagine, reason and solve problems. Medhā gives them interactive opportunities to practise these foundations while exploring technology, science, mathematics, engineering, creativity and life skills. 
          </p> 
          {/*[cite: 3] */}
          <div className="hero-actions">
            <button type="button" className="primary-hero" onClick={() => document.getElementById('method-heading')?.scrollIntoView({ behavior: 'smooth' })}>See our engine <ArrowIcon /></button>
            <button type="button" className="secondary-hero" onClick={() => navigate('/signup/parent')}>Start 15 days free</button>
          </div>
          <div className="hero-trust">
            <span>✓ Interactive learning</span>
            <span>✓ Hands-on exploration</span>
            <span>✓ Short quizzes & challenges</span>
          </div>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <div className="orbit orbit-a" />
          <div className="orbit orbit-b" />
          <div className="hero-core"><img src={medhaaIcon} alt="" /></div>
          <div className="float-chip chip-memory">🧠 Memory</div>
          <div className="float-chip chip-engineering">⚙️ Engineering</div>
          <div className="float-chip chip-creativity">💡 Creativity</div>
          <div className="float-chip chip-tech">🤖 Technology</div>
        </div>
      </section>

      <section className="foundation-section page-section" aria-labelledby="foundations-heading">
        <div className="section-intro">
          <span className="eyebrow dark"><SparkIcon /> FOUNDATIONS OF LEARNING</span>
          <h2 id="foundations-heading">Build the abilities children use to learn.</h2>
          <p>Medhā games are built around specific thinking processes and learning experiences—not around empty screen time.</p> 
          {/*[cite: 3] */}
          <small className="interaction-hint">Click on a concept below to reveal how we measure it.</small>
        </div>
        
        <div className="foundation-grid">
          {foundationCards.map((card, index) => (
            <article 
              className={`foundation-card interactive-card ${activeFoundation === index ? 'active' : ''}`} 
              key={card.title}
              onClick={() => toggleFoundation(index)}
              role="button"
              tabIndex={0}
            >
              <div className="foundation-icon">{card.icon}</div>
              <h3>{card.title}</h3>
              {/* Text is hidden by default, appears only when clicked, hiding others */}
              <div className={`foundation-text-wrapper ${activeFoundation === index ? 'open' : ''}`}>
                <p>{card.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="learning-method page-section" aria-labelledby="method-heading">
        {/* Side-by-Side Layout implemented for internal process vs external visualization */}
        <div className="method-panel side-by-side-container">
          <div className="internal-view">
            <span className="eyebrow"><SparkIcon /> HOW MEDHĀ WORKS</span>
            <h2 id="method-heading">Explore. Try. Check. Repeat. Apply.</h2> 
            {/*[cite: 3] */}
            <p>Children are not limited to watching an explanation. Interactive experiences let them make choices, see consequences, solve problems and revisit ideas through short questions and challenges.</p>
            {/*[cite: 3] */}
            <div className="method-steps">
              {[
                ['01', 'Explore', 'Meet an idea, system or challenge.'], //[cite: 3]
                ['02', 'Try', 'Make a choice, build, solve or experiment.'], //[cite: 3]
                ['03', 'Check', 'Use quizzes and feedback to revisit concepts.'], //[cite: 3]
                ['04', 'Apply', 'Connect learning with another situation.'], //[cite: 3]
              ].map(([number, title, text]) => (
                <div className="method-step" key={number}>
                  <span>{number}</span>
                  <div>
                    <strong>{title}</strong>
                    <p>{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="external-view" aria-hidden="true">
            <div className="engine-visualization">
              <div className="node node-1">Input</div>
              <div className="node-connection"></div>
              <div className="node node-center">Medhā Engine</div>
              <div className="node-connection"></div>
              <div className="node node-3">Insight</div>
              <div className="pulse-ring"></div>
            </div>
          </div>
        </div>
      </section>

      <section className="wide-domains page-section" aria-labelledby="domains-heading">
        <div className="section-intro centered">
          <span className="eyebrow dark"><SparkIcon /> BEYOND ONE SUBJECT</span>
          <h2 id="domains-heading">Give children a wider window into the world.</h2>
          <p>Children may choose different paths after school. Broad exposure can help them encounter ideas before they have to choose a domain.</p>
          {/*[cite: 3] */}
        </div>
        <div className="domain-pills">
          {['Cognitive Skills', 'Engineering & Technology', 'Science', 'Mathematics', 'Digital Literacy', 'Financial Literacy', 'Life Skills', 'Emotional & Social Learning', 'Music', 'Language', 'Creativity', 'Society & Civics', 'Future Skills'].map((item) => <span key={item}>{item}</span>)}
        </div>
      </section>

      <section className="credibility page-section" aria-labelledby="credibility-heading">
        <div className="credibility-card">
          <div><span className="eyebrow dark"><SparkIcon /> A NOTE FOR PARENTS</span><h2 id="credibility-heading">What we mean by “benefits”</h2></div>
          <p>We describe the skills and learning experiences a game gives children opportunities to practise. We do not use a game alone as proof of a child’s ability, academic performance or future career success. Individual outcomes vary, and meaningful progress should be understood from actual activity and learning over time.</p>
          {/*[cite: 3] */}
        </div>
      </section>

      <footer className="parent-footer">
        <div className="footer-brand"><img src={medhaaIcon} alt="" /><span>Medhā</span><small>Learn beyond limits, domains and enrich life.</small></div> 
        {/*[cite: 3] */}
        <div className="footer-actions">
          <button type="button" className="footer-link" onClick={() => navigate('/signup/parent')}>Sign up</button>
          <button type="button" className="footer-link" onClick={() => navigate('/')}>Home</button>
        </div>
      </footer>
    </main>
  );
}

export default OurApproach;