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

// --- NEW VISION DATA ---
const visionData = [
  { 
    id: 'ai-era', 
    icon: '🤖', 
    title: 'The AI Era Advantage', 
    text: 'In the era of AI, children need to be smarter and more adaptable. We make relevant efforts to prepare them, paving the way so that all doors remain open to all knowledge systems.' 
  },
  { 
    id: 'training-360', 
    icon: '🔄', 
    title: '360° Training', 
    text: 'During this era, regular classes and standard exams are simply not enough. We train kids in 360 degrees through our expansive interactive games and activities.' 
  },
  { 
    id: 'replace-noise', 
    icon: '🛡️', 
    title: 'Replacing the Noise', 
    text: 'We replace unwanted and unnecessary social platforms with our various games across multiple domains, offering a healthy, enriching environment for active minds.' 
  },
  { 
    id: 'values', 
    icon: '🌱', 
    title: 'Values & Harmony', 
    text: 'Our games are based not only on IQ, Memory, and Engineering, but also deeply rooted in Empathy, Social Harmony, and spiritual and moral values.' 
  },
];

// --- EXISTING DATA ---
const foundationCards = [
  { icon: '🎯', title: 'Focus & Attention', text: 'Practise staying with a task, noticing relevant information and working through distractions.' },
  { icon: '🧠', title: 'Memory', text: 'Practise remembering, recalling and connecting information during interactive challenges.' },
  { icon: '🔍', title: 'Critical Thinking', text: 'Question, compare, reason from evidence and make decisions instead of simply accepting an answer.' },
  { icon: '💡', title: 'Creativity & Imagination', text: 'Explore possibilities, generate ideas and approach problems from different directions.' },
  { icon: '🧩', title: 'Logic & Problem Solving', text: 'Recognise patterns, break problems into parts and test possible solutions.' },
  { icon: '⚙️', title: 'Systems & Engineering Thinking', text: 'Understand components, constraints, cause and effect, trade-offs, testing and debugging.' },
];

const approachStages = [
  { number: '01', title: 'EXPLORE', words: 'Discover · Imagine · Question', text: 'Find ideas, domains, games and possibilities.' },
  { number: '02', title: 'PRACTICE', words: 'Think · Remember · Focus', text: 'Work with ideas through active, repeated experiences.' },
  { number: '03', title: 'APPLY', words: 'Use · Connect · Experiment', text: 'Carry learning into another challenge, context or situation.' },
  { number: '04', title: 'BUILD', words: 'Solve · Create · Innovate', text: 'Gradually build capability through continued experience.' },
];

const medhaaParts = [
  { icon: '🎮', title: 'Play', text: 'Interactive games and challenges across many areas.' },
  { icon: '🧭', title: 'Explore', text: 'Discover ideas beyond a single subject or syllabus.' },
  { icon: '📝', title: 'Check', text: 'Use questions, feedback and My Medhā check-ins.' },
  { icon: '📈', title: 'Progress', text: 'See activity and developing strengths over time.' },
  { icon: '🔁', title: 'Return', text: 'Come back, practise again and keep building experience.' },
  { icon: '✨', title: 'Build', text: 'Turn repeated experiences into a richer learning journey.' },
];

const domains = [
  ['Cognitive Skills', 'Focus · Memory · Reasoning'],
  ['Engineering & Technology', 'Systems · Design · Build'],
  ['Science', 'Observe · Question · Discover'],
  ['Mathematics', 'Patterns · Numbers · Real life'],
  ['Digital Literacy', 'Search · Evaluate · Create'],
  ['Financial Literacy', 'Money · Choices · Planning'],
  ['Life Skills', 'Decide · Communicate · Adapt'],
  ['Emotional & Social Learning', 'Understand · Connect · Respond'],
  ['Music & Language', 'Listen · Express · Create'],
  ['Society & Civics', 'People · Community · Responsibility'],
  ['Creativity', 'Imagine · Make · Experiment'],
  ['Future Skills', 'Explore · Solve · Build'],
];

const benefitCards = [
  { icon: '🌱', title: 'For children', items: ['Active learning instead of passive screen time', 'Many ways to explore and practise', 'Choice, challenge and discovery', 'A personal journey that grows with use'] },
  { icon: '👨‍👩‍👧', title: 'For parents', items: ['A clearer view of what a child explores', 'Structured My Medhā check-ins', 'Activity and progress information', 'A way to notice developing strengths over time'] },
];

export function OurApproach() {
  const navigate = useNavigate();
  const [activeFoundation, setActiveFoundation] = useState<number | null>(null);
  const [activeVision, setActiveVision] = useState<number>(0); // Drives the new interactive section

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
          <button type="button" className="nav-signup" onClick={() => navigate('/signup/parent')}>Get Started <ArrowIcon /></button>
        </div>
      </header>

      <section className="hero-shell approach-hero fade-in-up">
        <div className="hero-copy">
          <span className="eyebrow"><SparkIcon /> OUR APPROACH</span>
          <h1>More than games.<br /><span>A platform for exploring, practising and building.</span></h1>
          <p className="hero-lead">
            Medhā brings together interactive games, activities, short check-ins and progress experiences so children can explore many domains, practise important abilities and use what they learn in new situations.
          </p>
          <div className="hero-actions">
            <button type="button" className="primary-hero" onClick={() => document.getElementById('medhaa-method')?.scrollIntoView({ behavior: 'smooth' })}>Explore the approach <ArrowIcon /></button>
            <button type="button" className="secondary-hero" onClick={() => navigate('/signup/parent')}>Start 15 days free</button>
          </div>
          <div className="hero-trust">
            <span>✓ Games & challenges</span>
            <span>✓ My Medhā check-ins</span>
            <span>✓ Activity & progress</span>
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

      {/* --- NEW VISION 360 SECTION --- */}
      <section className="vision-360-section page-section">
        <div className="section-intro centered">
          <span className="eyebrow dark"><SparkIcon /> BEYOND THE CLASSROOM</span>
          <h2>Prepared for the AI Era. Grounded in Values.</h2>
          <p>We connect kids with the latest technology while nurturing moral and spiritual foundations.</p>
        </div>
        
        <div className="vision-interactive-container">
          <div className="vision-sidebar">
            {visionData.map((item, index) => (
              <button 
                key={item.id}
                className={`vision-trigger ${activeVision === index ? 'active' : ''}`}
                onClick={() => setActiveVision(index)}
                type="button"
              >
                <span className="vision-icon">{item.icon}</span>
                <span className="vision-title">{item.title}</span>
              </button>
            ))}
          </div>
          
          <div className="vision-display-area">
             {visionData.map((item, index) => (
                <div 
                  key={`display-${item.id}`} 
                  className={`vision-content ${activeVision === index ? 'visible' : 'hidden'}`}
                >
                  <div className="vision-content-inner">
                    <span className="vision-display-icon">{item.icon}</span>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </div>
                </div>
             ))}
          </div>
        </div>
      </section>

      <section className="method-summary page-section" id="medhaa-method" aria-labelledby="method-summary-heading">
        <div className="section-intro centered">
          <span className="eyebrow dark"><SparkIcon /> THE MEDHĀ METHOD</span>
          <h2 id="method-summary-heading">Explore. Practice. Apply. Build.</h2>
          <p>Four simple ideas. One continuous learning journey.</p>
        </div>

        <div className="approach-flow">
          {approachStages.map((stage, index) => (
            <div className="approach-stage-wrap" key={stage.title}>
              <article className={`approach-stage approach-stage-${index + 1}`}>
                <span className="stage-number">{stage.number}</span>
                <div className="stage-icon" aria-hidden="true">{['🌟', '🎯', '🔗', '🚀'][index]}</div>
                <h3>{stage.title}</h3>
                <strong>{stage.words}</strong>
                <p>{stage.text}</p>
              </article>
              {index < approachStages.length - 1 && <span className="approach-arrow" aria-hidden="true">→</span>}
            </div>
          ))}
        </div>
      </section>

      <section className="foundation-section page-section" aria-labelledby="foundations-heading">
        <div className="section-intro">
          <span className="eyebrow dark"><SparkIcon /> FOUNDATIONS OF LEARNING</span>
          <h2 id="foundations-heading">Build the abilities children use to learn.</h2>
          <p>Medhā experiences are built around specific thinking processes and learning opportunities—not around empty screen time.</p>
          <small className="interaction-hint">Select a foundation below to see how it works.</small>
        </div>

        <div className="foundation-grid">
          {foundationCards.map((card, index) => (
            <article
              className={`foundation-card interactive-card ${activeFoundation === index ? 'active' : ''}`}
              key={card.title}
              onClick={() => toggleFoundation(index)}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  toggleFoundation(index);
                }
              }}
            >
              <div className="foundation-icon">{card.icon}</div>
              <h3>{card.title}</h3>
              <div className={`foundation-text-wrapper ${activeFoundation === index ? 'open' : ''}`}>
                <p>{card.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="medhaa-system-section page-section" aria-labelledby="system-heading">
        <div className="section-intro centered">
          <span className="eyebrow dark"><SparkIcon /> MORE THAN A GAME LIBRARY</span>
          <h2 id="system-heading">One experience. Many ways to learn.</h2>
          <p>Medhā connects play, exploration, check-ins and progress into one child-friendly journey.</p>
        </div>

        <div className="medhaa-system-grid">
          {medhaaParts.map((part) => (
            <article className="medhaa-system-card" key={part.title}>
              <div className="medhaa-system-icon">{part.icon}</div>
              <div>
                <span>{part.title}</span>
                <p>{part.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="wide-domains page-section" aria-labelledby="domains-heading">
        <div className="section-intro centered">
          <span className="eyebrow dark"><SparkIcon /> BEYOND ONE SUBJECT</span>
          <h2 id="domains-heading">One child. Many directions.</h2>
          <p>Children can meet ideas from different fields before they have to decide where their interests will take them.</p>
        </div>
        <div className="domain-card-grid">
          {domains.map(([title, subtitle]) => (
            <article className="domain-card" key={title}>
              <strong>{title}</strong>
              <span>{subtitle}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="benefits-section page-section" aria-labelledby="benefits-heading">
        <div className="section-intro centered">
          <span className="eyebrow dark"><SparkIcon /> WHAT THE JOURNEY OFFERS</span>
          <h2 id="benefits-heading">Useful for children. Meaningful for families.</h2>
          <p>The aim is to create opportunities for children to practise and explore—and to give families a clearer view of the journey.</p>
        </div>
        <div className="benefits-grid">
          {benefitCards.map((card) => (
            <article className="benefit-card" key={card.title}>
              <div className="benefit-icon">{card.icon}</div>
              <h3>{card.title}</h3>
              <ul>
                {card.items.map((item) => <li key={item}>✓ {item}</li>)}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="results-section page-section" aria-labelledby="results-heading">
        <div className="results-panel">
          <div className="results-copy">
            <span className="eyebrow"><SparkIcon /> RESULTS</span>
            <h2 id="results-heading">See what is developing.</h2>
            <p>
              Medhā can bring together recorded activity and structured My Medhā check-ins to help families see what a child has explored, where evidence is developing and how the journey changes over time.
            </p>
            <div className="results-tags">
              <span>Activity</span>
              <span>Strengths</span>
              <span>Progress</span>
              <span>Insights</span>
            </div>
          </div>
          <div className="results-visual" aria-hidden="true">
            <div className="results-ring ring-one"><span>ACTIVITY</span></div>
            <div className="results-ring ring-two"><span>PROGRESS</span></div>
            <div className="results-core"><span>My Medhā</span><strong>↗</strong></div>
          </div>
        </div>
      </section>

      <section className="difference-section page-section" aria-labelledby="difference-heading">
        <div className="section-intro centered">
          <span className="eyebrow dark"><SparkIcon /> WHAT MAKES MEDHĀ DIFFERENT</span>
          <h2 id="difference-heading">Not just one thing.</h2>
        </div>
        <div className="difference-grid">
          <article><strong>Not just content.</strong><span>Experience.</span></article>
          <article><strong>Not just play.</strong><span>Practice.</span></article>
          <article><strong>Not just one subject.</strong><span>Many domains.</span></article>
          <article><strong>Not just one session.</strong><span>A journey.</span></article>
        </div>
      </section>

      <section className="credibility page-section" aria-labelledby="credibility-heading">
        <div className="credibility-card">
          <div>
            <span className="eyebrow dark"><SparkIcon /> A NOTE FOR FAMILIES</span>
            <h2 id="credibility-heading">Built for learning. Designed with care.</h2>
          </div>
          <div className="credibility-copy">
            <p>
              Medhā is an educational platform designed to give children opportunities to explore, practise and apply skills through interactive experiences. Its scores and insights are platform-derived indicators based on recorded activity and check-ins, not medical diagnoses or standardized psychometric assessments.
            </p>
            <p>
              We describe the skills and learning experiences a child gets opportunities to practise. We do not use a single game or session as proof of a child’s ability, academic performance or future success.
            </p>
          </div>
        </div>
      </section>

      <section className="approach-cta page-section">
        <div className="approach-cta-card">
          <div>
            <span className="eyebrow dark"><SparkIcon /> READY TO EXPLORE?</span>
            <h2>Give children room to discover, practise and build.</h2>
            <p>Start with the games. Return to My Medhā. Let the journey grow with the child.</p>
          </div>
          <div className="cta-actions">
            <button type="button" className="primary-hero" onClick={() => navigate('/signup/parent')}>Start 15 days free <ArrowIcon /></button>
            <button type="button" className="secondary-hero" onClick={() => navigate('/')}>Back to Medhā <ArrowIcon /></button>
          </div>
        </div>
      </section>

      <footer className="parent-footer">
        <div className="footer-brand"><img src={medhaaIcon} alt="" /><span>Medhā</span><small>Learn beyond limits, domains and enrich life.</small></div>
        <div className="footer-actions">
          <button type="button" className="footer-link" onClick={() => navigate('/our-approach')}>Our Approach</button>
          <button type="button" className="footer-link" onClick={() => navigate('/signup/parent')}>Get Started</button>
          <button type="button" className="footer-link" onClick={() => navigate('/')}>Home</button>
        </div>
      </footer>
    </main>
  );
}

export default OurApproach;
