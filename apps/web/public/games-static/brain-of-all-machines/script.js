// ===== Safe Runtime State =====
const State = {
  currentSection: 'welcome',
  progress: {},
  badges: {},
  quizIndex: 0,
  quizScore: 0,
  quizAnswered: false,
  welcomeInterval: null,
};

const SectionOrder = [
  'welcome',
  'history',
  'whatis',
  'family',
  'everywhere',
  'flow',
  'factory',
  'future',
  'quiz'
];

const BadgeDefs = [
  {
    id: 'explorer',
    name: 'Chip Explorer',
    desc: 'Visited every main section',
    check: () => SectionOrder.every(section => State.progress[section])
  },
  {
    id: 'historian',
    name: 'Time Traveler',
    desc: 'Explored the history timeline',
    check: () => State.progress['history']
  },
  {
    id: 'collector',
    name: 'Chip Collector',
    desc: 'Opened 10 or more chip detail pages',
    check: () => Object.keys(State.progress).filter(key => key.startsWith('chip_')).length >= 10
  },
  {
    id: 'quizmaster',
    name: 'Quiz Master',
    desc: 'Scored 6 or more in the quiz',
    check: () => State.quizScore >= 6
  },
  {
    id: 'factoryboss',
    name: 'Factory Boss',
    desc: 'Completed the chip factory journey',
    check: () => State.progress['factory_done']
  }
];

function saveState() {
  updateProgressBar();
}

function clearWelcomeInterval() {
  if (State.welcomeInterval) {
    clearInterval(State.welcomeInterval);
    State.welcomeInterval = null;
  }
}

function markVisited(section) {
  State.progress[section] = true;
  saveState();
  checkBadges();
}

function updateProgressBar() {
  const total = SectionOrder.length;
  const done = SectionOrder.filter(section => State.progress[section]).length;
  const bar = document.getElementById('progress-bar');
  if (bar) {
    bar.style.width = `${(done / total) * 100}%`;
  }
}

function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add('show');

  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

function checkBadges() {
  BadgeDefs.forEach(badge => {
    if (!State.badges[badge.id] && badge.check()) {
      State.badges[badge.id] = true;
      showToast(`🏆 Achievement unlocked: ${badge.name}`);
    }
  });

  saveState();
  renderBadgesPanel();
}

function renderBadgesPanel() {
  const list = document.getElementById('badges-list');
  if (!list) return;

  list.innerHTML = '';

  BadgeDefs.forEach(badge => {
    const unlocked = !!State.badges[badge.id];
    const item = document.createElement('div');
    item.className = `badge-item${unlocked ? '' : ' locked'}`;
    item.innerHTML = `
      <span>${unlocked ? '🏆' : '🔒'}</span>
      <div>
        <strong>${badge.name}</strong><br>
        <small>${badge.desc}</small>
      </div>
    `;
    list.appendChild(item);
  });
}

// ===== Navigation =====
function bindGlobalUI() {
  document.querySelectorAll('.nav-btn').forEach(button => {
    button.addEventListener('click', () => goToSection(button.dataset.section));
  });

  const badgesBtn = document.getElementById('badges-btn');
  if (badgesBtn) {
    badgesBtn.addEventListener('click', () => {
      document.getElementById('badges-panel')?.classList.toggle('hidden');
    });
  }

  const closeBadges = document.getElementById('close-badges');
  if (closeBadges) {
    closeBadges.addEventListener('click', () => {
      document.getElementById('badges-panel')?.classList.add('hidden');
    });
  }

  const closeModalBtn = document.getElementById('close-modal');
  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeModal);
  }

  const modal = document.getElementById('chip-modal');
  if (modal) {
    modal.addEventListener('click', event => {
      if (event.target.id === 'chip-modal') closeModal();
    });
  }

  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', event => {
      const query = event.target.value.toLowerCase().trim();
      if (!query) return;

      const chipMatch = Object.keys(ChipsData).find(id =>
        ChipsData[id].name.toLowerCase().includes(query)
      );

      if (chipMatch) {
        openChipModal(chipMatch);
      }
    });
  }
}

function goToSection(section) {
  clearWelcomeInterval();
  State.currentSection = section;

  document.querySelectorAll('.nav-btn').forEach(button => {
    button.classList.toggle('active', button.dataset.section === section);
  });

  markVisited(section);
  renderSection(section);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderSection(section) {
  const stage = document.getElementById('stage');
  if (!stage) return;

  stage.innerHTML = '';

  const renderers = {
    welcome: renderWelcome,
    history: renderHistory,
    whatis: renderWhatIs,
    family: renderFamily,
    everywhere: renderEverywhere,
    flow: renderFlow,
    factory: renderFactory,
    future: renderFuture,
    quiz: renderQuiz
  };

  (renderers[section] || renderWelcome)(stage);
}

// ===== Welcome =====
function renderWelcome(stage) {
  const stages = ['🔲', '🧮', '📱', '🚗', '🤖', '🏭', '🛰️', '🖥️'];

  stage.innerHTML = `
    <div class="welcome-hero">
      <div class="chip-grow" id="grow-icon">🔲</div>
      <div class="evolve-row" id="evolve-row"></div>
      <div class="hero-msg">"One tiny invention changed the world."</div>
      <button class="start-btn" id="begin-mission">🚀 Begin Mission: Chip Explorer</button>
    </div>

    <div class="card" style="margin-top:40px; text-align:center;">
      <h3>The Story So Far...</h3>
      <p style="color:var(--text-dim); margin-top:10px; line-height:1.7;">
        One day, every electronic chip on Earth suddenly disappears. Traffic lights go dark. Phones die.
        Hospitals lose equipment. Vehicles stop. Satellites go silent. Factories freeze.
        You are the <strong>Chip Explorer</strong> — the one person who must discover what chips are,
        why they exist, and how to bring the world back to life.
      </p>
    </div>
  `;

  const row = document.getElementById('evolve-row');

  stages.forEach((symbol, index) => {
    const el = document.createElement('span');
    el.className = 'evolve-item';
    el.style.animationDelay = `${index * 0.28}s`;
    el.textContent = symbol;
    row.appendChild(el);

    if (index < stages.length - 1) {
      const arrow = document.createElement('span');
      arrow.className = 'arrow evolve-item';
      arrow.style.animationDelay = `${index * 0.28 + 0.14}s`;
      arrow.textContent = '→';
      row.appendChild(arrow);
    }
  });

  let current = 0;
  State.welcomeInterval = setInterval(() => {
    const icon = document.getElementById('grow-icon');
    if (!icon) return;
    current = (current + 1) % stages.length;
    icon.textContent = stages[current];
  }, 1400);

  document.getElementById('begin-mission').addEventListener('click', () => {
    goToSection('history');
  });
}

// ===== History =====
function renderHistory(stage) {
  stage.innerHTML = `
    <h2 class="section-title">Chip History: The Long Road to Silicon</h2>
    <p class="section-sub">Click each milestone to reveal the inventor, importance, and world impact.</p>
    <div class="timeline" id="timeline"></div>
  `;

  const timeline = document.getElementById('timeline');

  HistoryData.forEach(item => {
    const block = document.createElement('div');
    block.className = 'tl-item';
    block.innerHTML = `
      <div class="tl-year">${item.year}</div>
      <div class="tl-name">${item.icon} ${item.name}</div>
      <div class="tl-detail">
        <strong>Inventor:</strong> ${item.inventor}<br><br>
        <strong>Why it mattered:</strong> ${item.importance}<br><br>
        <strong>World impact:</strong> ${item.impact}
      </div>
    `;

    block.addEventListener('click', () => {
      block.classList.toggle('open');
      markVisited(`history_${item.id}`);
    });

    timeline.appendChild(block);
  });
}

// ===== What Is A Chip =====
const ZoomLevels = [
  { icon: '🖥️', label: 'Machine — the complete device you use' },
  { icon: '🔌', label: 'Circuit Board — connects all electronic parts together' },
  { icon: '🔲', label: 'Chip — the small package doing the computing work' },
  { icon: '📦', label: 'Package — protective outer shell and connections' },
  { icon: '💎', label: 'Silicon Die — the tiny real chip inside the package' },
  { icon: '🔺', label: 'Transistors — microscopic electronic switches' },
  { icon: '⚛️', label: 'Atomic Scale — where electrons create logic behavior' }
];

function renderWhatIs(stage) {
  stage.innerHTML = `
    <h2 class="section-title">What Is A Chip?</h2>
    <p class="section-sub">Zoom in from a whole machine down to the atomic scale.</p>

    <div class="card">
      <div class="zoom-stage">
        <div class="zoom-level active" id="zoom-icon">🖥️</div>
        <div class="zoom-label" id="zoom-label"></div>
        <div class="zoom-controls">
          <button id="zoom-back">◀ Zoom Out</button>
          <button id="zoom-fwd">Zoom In ▶</button>
        </div>
      </div>
    </div>

    <div class="grid grid-3" style="margin-top:26px;">
      <div class="card">
        <h4>🔬 Semiconductor</h4>
        <p style="color:var(--text-dim); font-size:.92rem; margin-top:8px;">
          A material like silicon that can sometimes conduct electricity and sometimes resist it.
          That controllable behavior makes chips possible.
        </p>
      </div>

      <div class="card">
        <h4>🔺 Transistor</h4>
        <p style="color:var(--text-dim); font-size:.92rem; margin-top:8px;">
          A transistor is a tiny electronic switch. Billions of them work together to perform logic,
          calculations, memory, and control.
        </p>
      </div>

      <div class="card">
        <h4>📦 Packaging and Pins</h4>
        <p style="color:var(--text-dim); font-size:.92rem; margin-top:8px;">
          The outside package protects the silicon die and provides electrical connections to the board.
        </p>
      </div>
    </div>

    <div class="card" style="margin-top:20px;">
      <h4>Why are chips tiny, yet so powerful?</h4>
      <p style="color:var(--text-dim); margin-top:10px; line-height:1.65;">
        Engineers use manufacturing methods such as photolithography to create unimaginably small transistor patterns.
        Because transistors are so tiny, billions can fit inside a small chip, allowing huge computing power in a pocket-sized device.
      </p>
    </div>
  `;

  let zoomIndex = 0;
  const icon = document.getElementById('zoom-icon');
  const label = document.getElementById('zoom-label');

  function updateZoom() {
    icon.textContent = ZoomLevels[zoomIndex].icon;
    label.textContent = ZoomLevels[zoomIndex].label;

    if (zoomIndex === ZoomLevels.length - 1) {
      markVisited('whatis_full_zoom');
    }
  }

  updateZoom();

  document.getElementById('zoom-fwd').addEventListener('click', () => {
    if (zoomIndex < ZoomLevels.length - 1) {
      zoomIndex += 1;
      updateZoom();
    }
  });

  document.getElementById('zoom-back').addEventListener('click', () => {
    if (zoomIndex > 0) {
      zoomIndex -= 1;
      updateZoom();
    }
  });
}

// ===== Chip Family =====
function renderFamily(stage) {
  stage.innerHTML = `
    <h2 class="section-title">The Chip Family</h2>
    <p class="section-sub">Every chip has a specialty. Click any chip card to explore it deeply.</p>
    <div class="grid grid-4" id="chip-grid"></div>
  `;

  const grid = document.getElementById('chip-grid');

  Object.keys(ChipsData).forEach(id => {
    const chip = ChipsData[id];
    const card = document.createElement('div');
    card.className = 'card chip-card';

    const dots = Array.from({ length: 4 }, (_, index) => {
      return `<span class="${index < chip.difficulty ? 'filled' : ''}">●</span>`;
    }).join('');

    card.innerHTML = `
      <div class="icon">${chip.icon}</div>
      <div class="cat">${chip.category}</div>
      <h4>${chip.name}</h4>
      <p style="font-size:.84rem; color:var(--text-dim); line-height:1.5;">
        ${chip.whatItIs.slice(0, 90)}...
      </p>
      <div class="diff-dots">${dots}</div>
    `;

    card.addEventListener('click', () => openChipModal(id));
    grid.appendChild(card);
  });
}

function openChipModal(id) {
  const chip = ChipsData[id];
  if (!chip) return;

  markVisited(`chip_${id}`);

  const content = document.getElementById('modal-content');
  if (!content) return;

  content.className = 'modal-content';
  content.innerHTML = `
    <h2>${chip.icon} ${chip.name}</h2>
    <div class="sub">${chip.category} · Difficulty ${chip.difficulty}/4</div>

    <div class="modal-block">
      <h4>What It Is</h4>
      <p>${chip.whatItIs}</p>
    </div>

    <div class="modal-block">
      <h4>Why Invented</h4>
      <p>${chip.whyInvented}</p>
    </div>

    <div class="modal-block">
      <h4>How It Works</h4>
      <p>${chip.howItWorks}</p>
    </div>

    <div class="modal-block">
      <h4>Main Job</h4>
      <p>${chip.mainJob}</p>
    </div>

    <div class="modal-block">
      <h4>Strengths</h4>
      <ul>${chip.strengths.map(item => `<li>${item}</li>`).join('')}</ul>
    </div>

    <div class="modal-block">
      <h4>Limitations</h4>
      <ul>${chip.limitations.map(item => `<li>${item}</li>`).join('')}</ul>
    </div>

    <div class="modal-block">
      <h4>Versions</h4>
      <div class="tag-list">
        ${chip.versions.map(version => `<span class="tag">${version}</span>`).join('')}
      </div>
    </div>

    <div class="modal-block">
      <h4>Interesting Fact</h4>
      <p>💡 ${chip.funFact}</p>
    </div>

    <div class="modal-block">
      <h4>Where Used</h4>
      <div class="tag-list">
        ${chip.whereUsed.map(deviceId => {
          const device = DevicesData[deviceId];
          return device
            ? `<span class="tag" data-device="${deviceId}">${device.icon} ${device.name}</span>`
            : '';
        }).join('')}
      </div>
    </div>

    <div class="modal-block">
      <h4>Related Chips</h4>
      <div class="tag-list">
        ${chip.related.map(relatedId => {
          const related = ChipsData[relatedId];
          return related
            ? `<span class="tag" data-chip="${relatedId}">${related.icon} ${related.name}</span>`
            : '';
        }).join('')}
      </div>
    </div>
  `;

  content.querySelectorAll('[data-chip]').forEach(el => {
    el.addEventListener('click', () => openChipModal(el.dataset.chip));
  });

  content.querySelectorAll('[data-device]').forEach(el => {
    el.addEventListener('click', () => {
      closeModal();
      goToSection('everywhere');
      setTimeout(() => openDeviceDetail(el.dataset.device), 200);
    });
  });

  document.getElementById('chip-modal')?.classList.remove('hidden');
}

function closeModal() {
  document.getElementById('chip-modal')?.classList.add('hidden');
}

// ===== Chips Everywhere =====
function renderEverywhere(stage) {
  stage.innerHTML = `
    <h2 class="section-title">Chips Everywhere</h2>
    <p class="section-sub">Open a machine to discover the team of chips working inside it.</p>
    <div class="grid grid-4" id="device-grid"></div>
    <div id="device-detail"></div>
  `;

  const grid = document.getElementById('device-grid');

  Object.keys(DevicesData).forEach(id => {
    const device = DevicesData[id];
    const card = document.createElement('div');
    card.className = 'card device-card';
    card.innerHTML = `
      <div class="icon">${device.icon}</div>
      <h4>${device.name}</h4>
    `;
    card.addEventListener('click', () => openDeviceDetail(id));
    grid.appendChild(card);
  });
}

function openDeviceDetail(id) {
  const device = DevicesData[id];
  if (!device) return;

  markVisited(`device_${id}`);

  const detail = document.getElementById('device-detail');
  if (!detail) return;

  detail.innerHTML = `
    <div class="card device-detail">
      <h3>${device.icon} ${device.name}</h3>
      <p style="color:var(--text-dim); margin-top:8px; line-height:1.6;">${device.desc}</p>
      <h4 style="margin-top:16px; color:var(--accent3); font-size:.84rem; text-transform:uppercase; letter-spacing:.07em;">Chips Inside</h4>
      <div class="device-chip-grid">
        ${device.chips.map(chipId => {
          const chip = ChipsData[chipId];
          return chip
            ? `<div class="mini-chip" data-chip="${chipId}">${chip.icon}<br><small>${chip.name}</small></div>`
            : '';
        }).join('')}
      </div>
    </div>
  `;

  detail.querySelectorAll('[data-chip]').forEach(el => {
    el.addEventListener('click', () => openChipModal(el.dataset.chip));
  });

  detail.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ===== Flow =====
const FlowExample = [
  { icon: '📷', name: 'Camera', desc: 'Captures raw light as image data' },
  { icon: '🔧', name: 'ISP', desc: 'Improves and cleans the image signal' },
  { icon: '🧠', name: 'CPU', desc: 'Decides what the system should do next' },
  { icon: '⚡', name: 'Memory', desc: 'Stores the active image data temporarily' },
  { icon: '🎮', name: 'GPU', desc: 'Prepares the image for smooth display output' },
  { icon: '🖼️', name: 'Display', desc: 'Shows the final picture to the user' }
];

function renderFlow(stage) {
  stage.innerHTML = `
    <h2 class="section-title">How Chips Work Together</h2>
    <p class="section-sub">Watch how information flows from one chip to another inside a smart device.</p>

    <div class="card">
      <div class="flow-row" id="flow-row"></div>
      <div style="text-align:center;">
        <button class="start-btn" id="play-flow">▶ Play Animation</button>
      </div>
      <div id="flow-caption" style="text-align:center; margin-top:16px; color:var(--text-dim); min-height:26px;"></div>
    </div>
  `;

  const row = document.getElementById('flow-row');

  FlowExample.forEach((node, index) => {
    const item = document.createElement('div');
    item.className = 'flow-node';
    item.id = `flow-node-${index}`;
    item.innerHTML = `
      <div style="font-size:1.8rem;">${node.icon}</div>
      <div style="font-size:.82rem; margin-top:4px;">${node.name}</div>
    `;
    row.appendChild(item);

    if (index < FlowExample.length - 1) {
      const arrow = document.createElement('div');
      arrow.className = 'flow-arrow';
      arrow.textContent = '→';
      row.appendChild(arrow);
    }
  });

  document.getElementById('play-flow').addEventListener('click', () => {
    let index = 0;
    const caption = document.getElementById('flow-caption');

    document.querySelectorAll('.flow-node').forEach(node => node.classList.remove('active'));

    const timer = setInterval(() => {
      document.querySelectorAll('.flow-node').forEach(node => node.classList.remove('active'));

      const current = document.getElementById(`flow-node-${index}`);
      if (current) current.classList.add('active');

      caption.textContent = `${FlowExample[index].icon} ${FlowExample[index].name}: ${FlowExample[index].desc}`;

      index += 1;
      if (index >= FlowExample.length) {
        clearInterval(timer);
        markVisited('flow_done');
      }
    }, 950);
  });
}

// ===== Factory =====
const FactorySteps = [
  { name: 'Silica Sand', detail: 'Common sand contains silicon dioxide, the raw starting material for chips.' },
  { name: 'Purification', detail: 'The silicon material is purified to an extremely high level so it behaves predictably.' },
  { name: 'Crystal Growth', detail: 'Pure silicon is grown into a large single crystal called an ingot.' },
  { name: 'Wafer Slicing', detail: 'The crystal is sliced into very thin circular wafers and polished smooth.' },
  { name: 'Photolithography', detail: 'Light and masks transfer extremely tiny circuit patterns onto the wafer.' },
  { name: 'Doping', detail: 'Special atoms are added to selected areas so the silicon can control electrical flow.' },
  { name: 'Etching', detail: 'Unwanted material is removed to leave behind the required microscopic structures.' },
  { name: 'Metal Layers', detail: 'Tiny metal paths are added so billions of transistors can connect and communicate.' },
  { name: 'Testing', detail: 'Each chip is checked for defects and correct electrical behavior.' },
  { name: 'Packaging', detail: 'The silicon die is sealed in a protective package with external electrical connections.' },
  { name: 'Finished Chip', detail: 'The completed chip is now ready to be placed inside a machine.' }
];

function renderFactory(stage) {
  stage.innerHTML = `
    <h2 class="section-title">Chip Factory</h2>
    <p class="section-sub">Follow the journey from sand to a powerful finished chip.</p>
    <div class="factory-steps" id="factory-steps"></div>
  `;

  const wrap = document.getElementById('factory-steps');

  FactorySteps.forEach((step, index) => {
    const block = document.createElement('div');
    block.className = 'factory-step';
    block.innerHTML = `
      <div class="num">${index + 1}</div>
      <div style="flex:1;">
        <strong>${step.name}</strong>
        <div class="factory-detail">${step.detail}</div>
      </div>
    `;

    block.addEventListener('click', () => {
      block.classList.toggle('open');
      block.classList.add('done');
      markVisited(`factory_step_${index}`);

      const allDone = FactorySteps.every((_, i) => State.progress[`factory_step_${i}`]);
      if (allDone) {
        markVisited('factory_done');
      }
    });

    wrap.appendChild(block);
  });
}

// ===== Future Chips =====
const FutureChips = [
  {
    name: 'Neuromorphic Chips',
    icon: '🧬',
    status: 'Early research and limited products',
    desc: 'These chips try to imitate some brain-like behavior so AI can run with lower power.'
  },
  {
    name: 'Photonic Chips',
    icon: '💡',
    status: 'Active research and prototypes',
    desc: 'They use light instead of only electrical signals, which may allow faster and cooler computing.'
  },
  {
    name: 'Quantum Chips',
    icon: '⚛️',
    status: 'Experimental',
    desc: 'Quantum chips aim to solve certain kinds of problems in very different ways from normal chips.'
  },
  {
    name: 'Flexible Electronics',
    icon: '🧻',
    status: 'Emerging',
    desc: 'These circuits can bend, opening possibilities for wearable and unusual device shapes.'
  },
  {
    name: 'Bio Chips',
    icon: '🧫',
    status: 'Research stage',
    desc: 'These chips interact with biological systems and may help in diagnosis and health monitoring.'
  },
  {
    name: 'Brain Interfaces',
    icon: '🧠',
    status: 'Very early experimental stage',
    desc: 'They aim to connect electronics more directly with the human nervous system.'
  },
  {
    name: 'Self-Healing Electronics',
    icon: '🩹',
    status: 'Research stage',
    desc: 'These materials may someday repair small forms of damage automatically.'
  }
];

function renderFuture(stage) {
  stage.innerHTML = `
    <h2 class="section-title">Future Chips</h2>
    <p class="section-sub">These are emerging technologies and research directions, not the same as the everyday chips already widely used today.</p>
    <div class="grid grid-3" id="future-grid"></div>
  `;

  const grid = document.getElementById('future-grid');

  FutureChips.forEach(item => {
    const card = document.createElement('div');
    card.className = 'card future-card';
    card.innerHTML = `
      <div class="future-tag">${item.status}</div>
      <h4>${item.icon} ${item.name}</h4>
      <p style="color:var(--text-dim); font-size:.9rem; margin-top:8px; line-height:1.6;">${item.desc}</p>
    `;
    grid.appendChild(card);
  });

  markVisited('future_seen');
}

// ===== Quiz =====
function resetQuiz() {
  State.quizIndex = 0;
  State.quizScore = 0;
  State.quizAnswered = false;
}

function renderQuiz(stage) {
  if (State.quizIndex >= QuizData.length) {
    stage.innerHTML = `
      <h2 class="section-title">Quiz Adventure Complete!</h2>
      <div class="card quiz-box">
        <div class="quiz-score">You scored ${State.quizScore} / ${QuizData.length} 🎉</div>
        <div style="text-align:center; margin-top:20px;">
          <button class="start-btn" id="retry-quiz">🔁 Retry Quiz</button>
        </div>
      </div>
    `;

    checkBadges();

    document.getElementById('retry-quiz').addEventListener('click', () => {
      resetQuiz();
      renderQuiz(stage);
    });

    return;
  }

  const question = QuizData[State.quizIndex];
  State.quizAnswered = false;

  stage.innerHTML = `
    <h2 class="section-title">Quiz Adventure</h2>
    <p class="section-sub">Question ${State.quizIndex + 1} of ${QuizData.length}</p>

    <div class="card quiz-box">
      <div class="quiz-q">${question.q}</div>
      <div id="quiz-opts"></div>
      <div class="quiz-explain" id="quiz-explain">${question.explain}</div>
      <div class="quiz-nav">
        <button id="quiz-next">Next ▶</button>
      </div>
    </div>
  `;

  const optionsWrap = document.getElementById('quiz-opts');

  question.options.forEach((option, index) => {
    const button = document.createElement('button');
    button.className = 'quiz-opt';
    button.textContent = option;

    button.addEventListener('click', () => {
      if (State.quizAnswered) return;
      State.quizAnswered = true;

      document.querySelectorAll('.quiz-opt').forEach((btn, btnIndex) => {
        if (btnIndex === question.answer) btn.classList.add('correct');
        else if (btnIndex === index) btn.classList.add('wrong');
      });

      if (index === question.answer) {
        State.quizScore += 1;
      }

      document.getElementById('quiz-explain').style.display = 'block';
    });

    optionsWrap.appendChild(button);
  });

  document.getElementById('quiz-next').addEventListener('click', () => {
    if (!State.quizAnswered) return;
    State.quizIndex += 1;
    renderQuiz(stage);
  });
}

// ===== Init =====
bindGlobalUI();
renderBadgesPanel();
updateProgressBar();
renderSection('welcome');