/* ================================================================
   LEVEL 1 — Humans and Intelligent Machines (short intro)
   ================================================================ */

const LEVEL1_EXAMPLES = [
  {name:"Fan", icon:"🌀", type:"basic", note:"Spins using electricity — no thinking involved."},
  {name:"Bicycle", icon:"🚲", type:"basic", note:"Converts pedal force into motion — purely mechanical."},
  {name:"Calculator", icon:"🧮", type:"basic", note:"Follows fixed math rules — fast but not 'smart'."},
  {name:"Car", icon:"🚗", type:"basic", note:"Mostly mechanical, though modern cars add intelligence."},
  {name:"Smartphone", icon:"📱", type:"intelligent", note:"Senses, learns, and adapts to how you use it."},
  {name:"Computer", icon:"💻", type:"intelligent", note:"Processes data and can run learning algorithms."},
  {name:"Drone", icon:"🚁", type:"intelligent", note:"Senses its environment and adjusts flight automatically."},
  {name:"Robot", icon:"🤖", type:"intelligent", note:"Combines sensing, thinking, and acting like a living thing."}
];

function renderLevel1(){
  const root = $('#level1-root');
  if(!root || root.dataset.rendered) return;
  root.dataset.rendered = "1";

  root.innerHTML = `
    <div class="hero-panel glass">
      <h2>What makes a machine "intelligent"?</h2>
      <p>Every machine is built to do something humans already do — just look closer at what's really going on inside.</p>
      <button class="btn" id="l1-cta">Start the comparison journey →</button>
    </div>

    <div class="section-block">
      <h3 class="section-heading">Machine vs Basic Machine vs Intelligent Machine</h3>
      <p class="section-sub">Tap a card to see why it belongs in its category.</p>
      <div class="grid grid-3" id="l1-defs"></div>
    </div>

    <div class="section-block">
      <h3 class="section-heading">Spot the difference</h3>
      <p class="section-sub">Basic machines just do. Intelligent machines sense, think, and adapt.</p>
      <div class="example-strip" id="l1-examples"></div>
    </div>
  `;

  const defs = [
    {title:"Machine", icon:"⚙️", desc:"Anything built by humans that does work using energy — from a simple lever to a spacecraft.", grad:"var(--grad-primary)"},
    {title:"Basic Machine", icon:"🔩", desc:"Does one fixed job with no sensing or decisions — like a fan or a bicycle.", grad:"var(--grad-secondary)"},
    {title:"Intelligent Machine", icon:"🤖", desc:"Senses its surroundings, processes information, and adapts its actions — like a robot or smartphone.", grad:"var(--grad-success)"}
  ];
  const defsRoot = $('#l1-defs', root);
  defs.forEach(d => {
    const card = el('div','card glass', `
      <span class="card-icon">${d.icon}</span>
      <h3>${d.title}</h3>
      <p>${d.desc}</p>
    `);
    card.style.borderTop = `3px solid transparent`;
    card.style.backgroundImage = `linear-gradient(var(--bg-1),var(--bg-1)), ${d.grad}`;
    card.style.backgroundOrigin = 'border-box';
    card.style.backgroundClip = 'padding-box, border-box';
    defsRoot.appendChild(card);
  });

  const exRoot = $('#l1-examples', root);
  LEVEL1_EXAMPLES.forEach(ex => {
    const card = el('div','card glass', `
      <span class="card-icon animate-float">${ex.icon}</span>
      <h3>${ex.name}</h3>
      <span class="tag" style="display:inline-block;margin-bottom:8px;">${ex.type === 'intelligent' ? 'Intelligent' : 'Basic'} machine</span>
      <p>${ex.note}</p>
    `);
    exRoot.appendChild(card);
  });

  $('#l1-cta', root).addEventListener('click', () => {
    document.querySelector('.nav-btn[data-level="2"]').click();
  });
}
