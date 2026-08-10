let db = { parts: [], missions: [], anatomy: [], badges: [], quizzes: [], aircraftTypes: [], levels: [] };
const state = { missionIndex: 0, installed: new Set(), stars: 0, lastResult: null, filter: 'all', anatomySelected: null, mode: 'training' };
let el = {};

const partVisualMap = {
  wing_basic: ['.wing.left', '.wing.right'], wing_long_range: ['.wing.left', '.wing.right'], wing_delta: ['.wing.left', '.wing.right'],
  tail_basic: ['.tail-v', '.tail-h'], tail_twin: ['.tail-v', '.tail-h'],
  engine_prop_basic: ['.engine', '.propeller'], engine_jet_light: ['.engine', '.jet'], engine_turboprop: ['.engine', '.propeller'],
  landing_gear_basic: ['.gear.nose', '.gear.left', '.gear.right'], landing_gear_heavy: ['.gear.nose', '.gear.left', '.gear.right'],
  cargo_bay_light: ['.cargo-box'], radar_basic: ['.radar']
};

const modeExplanations = {
  training: `<strong>Training Mode:</strong> You can install any parts you want. No budget limits. No mission restrictions. This is your free space to learn what each part does and see how a plane comes together.`,
  budget: `<strong>Budget Challenge:</strong> Each mission has a budget. You must choose parts that fit within the money limit. Learn to build smart — expensive is not always better.`,
  mission: `<strong>Mission Mode:</strong> This is the real challenge. Each mission needs specific parts AND must stay within budget. Wrong parts = failed mission. Too expensive = failed mission. Build exactly what the mission asks for!`
};

const $ = id => document.getElementById(id);
const setText = (node, value) => { if (node) node.textContent = value; };
const setHTML = (node, value) => { if (node) node.innerHTML = value; };
const humanize = id => String(id || '').replaceAll('_', ' ');
const currentMission = () => db.missions[state.missionIndex] || null;

// ===== SYNTHESIZED SOUND EFFECTS (LAZY LOAD FIX) =====
let audioCtx; 

const SoundFX = {
  play: (type) => {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    const now = audioCtx.currentTime;

    if (type === 'click') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.1);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
    } 
    else if (type === 'engine') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(45, now);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
      osc.start(now);
      osc.stop(now + 0.6);
    }
    else if (type === 'takeoff') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(100, now);
      osc.frequency.exponentialRampToValueAtTime(900, now + 2);
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.15, now + 0.5);
      gain.gain.linearRampToValueAtTime(0, now + 2);
      osc.start(now);
      osc.stop(now + 2);
    }
  }
};

function cacheDom() {
  el = {
    missionTitle: $('missionTitle'), missionText: $('missionText'), missionBadge: $('missionBadge'), statusBadge: $('statusBadge'), starBadge: $('starBadge'),
    budgetBadge: $('budgetBadge'), requiredBadge: $('requiredBadge'), goalBadge: $('goalBadge'), goalText: $('goalText'),
    partsFilters: $('partsFilters'), partsGrid: $('partsGrid'), faultList: $('faultList'), mentorPrompt: $('mentorPrompt'),
    prevMissionBtn: $('prevMissionBtn'), nextMissionBtn: $('nextMissionBtn'), resetBtn: $('resetBtn'), scanBtn: $('scanBtn'), flyBtn: $('flyBtn'), plane: $('plane'),
    costValue: $('costValue'), safetyValue: $('safetyValue'), missionFitValue: $('missionFitValue'),
    modeBadge: $('modeBadge'), modeExplanation: $('modeExplanation')
  };
}

async function loadData() {
  const files = [
    { key: 'parts', path: './data/parts.json' },
    { key: 'missions', path: './data/missions.json' },
    { key: 'anatomy', path: './data/anatomy.json' },
    { key: 'badges', path: './data/badges.json' },
    { key: 'quizzes', path: './data/quizzes.json' },
    { key: 'aircraftTypes', path: './data/aircraft-types.json' },
    { key: 'levels', path: './data/levels.json' }
  ];
  for (const f of files) {
    try {
      const resp = await fetch(f.path);
      if (!resp.ok) { console.warn(`Missing: ${f.path}`); db[f.key] = []; continue; }
      db[f.key] = await resp.json();
    } catch (err) { console.warn(`Failed: ${f.path}`, err); db[f.key] = []; }
  }
  state.anatomySelected = db.anatomy[0]?.id || null;
}

function renderMode() {
  const modeNames = { training: 'Training Mode', budget: 'Budget Challenge', mission: 'Mission Mode' };
  setText(el.modeBadge, modeNames[state.mode] || 'Training Mode');
  setHTML(el.modeExplanation, modeExplanations[state.mode] || modeExplanations.training);
  document.querySelectorAll('.mode-card').forEach(card => {
    card.classList.toggle('active', card.dataset.mode === state.mode);
  });
}

function bindModeSelector() {
  document.querySelectorAll('.mode-card').forEach(card => {
    card.addEventListener('click', () => {
      SoundFX.play('click'); // Added sound
      state.mode = card.dataset.mode;
      state.installed.clear();
      if (el.plane) el.plane.getAnimations().forEach(a => a.cancel());
      renderMode();
      renderAll();
    });
  });
}

function renderMission() {
  const mission = currentMission();
  if (!mission) return;
  setText(el.missionTitle, mission.title);
  setText(el.missionText, mission.description);
  setText(el.missionBadge, `Mission ${state.missionIndex + 1}`);

  if (state.mode === 'training') {
    setText(el.budgetBadge, 'Budget: Unlimited');
  } else {
    setText(el.budgetBadge, `Budget: ${mission.budget}`);
  }

  if (state.mode === 'mission') {
    setText(el.requiredBadge, `Required: ${mission.required.map(humanize).join(', ')}`);
  } else {
    setText(el.requiredBadge, 'Required: No strict requirements');
  }

  setText(el.goalBadge, `Goal: ${mission.goal}`);
  setText(el.goalText, mission.goal);
  setText(el.starBadge, `Stars ${state.stars}`);
}

function renderFilters() {
  if (!el.partsFilters) return;
  const filters = ['all', ...new Set(db.parts.map(p => p.type))];
  el.partsFilters.innerHTML = '';
  filters.forEach(filter => {
    const btn = document.createElement('button');
    btn.className = 'filter-chip' + (state.filter === filter ? ' active' : '');
    btn.textContent = filter === 'all' ? 'All Parts' : filter[0].toUpperCase() + filter.slice(1);
    btn.addEventListener('click', () => { 
      SoundFX.play('click'); // Added sound
      state.filter = filter; 
      renderFilters(); 
      renderParts(); 
    });
    el.partsFilters.appendChild(btn);
  });
}

function renderParts() {
  if (!el.partsGrid) return;
  const mission = currentMission();
  const filtered = state.filter === 'all' ? db.parts : db.parts.filter(p => p.type === state.filter);
  el.partsGrid.innerHTML = '';
  filtered.forEach(part => {
    const card = document.createElement('article');
    const active = state.installed.has(part.id);
    const isRequired = mission && state.mode === 'mission' && mission.required.includes(part.id);
    const useful = mission ? mission.tags.some(tag => part.tags.includes(tag)) : false;
    let classes = 'part-card';
    if (active) classes += ' active';
    if (isRequired) classes += ' required';
    else if (useful && state.mode !== 'training') classes += ' useful-fit';
    card.className = classes;

    let hint = '';
    if (state.mode === 'training') {
      hint = 'Free to try!';
    } else if (isRequired) {
      hint = 'Needed for this mission!';
    } else if (state.mode === 'budget') {
      hint = `Cost: ${part.cost}`;
    } else {
      hint = useful ? 'Great for this mission!' : 'Optional part';
    }

    card.innerHTML = `<h4>${part.name}</h4><p>${part.description}</p><p>Type: ${part.type} · Cost: ${part.cost}</p><p class="part-hint">${hint}</p><button class="install-btn">${active ? 'Remove Part' : 'Install Part'}</button>`;
    const btn = card.querySelector('button');
    if (btn) btn.addEventListener('click', () => {
      SoundFX.play('click'); // Added sound
      togglePart(part.id);
    });
    el.partsGrid.appendChild(card);
  });
}

function togglePart(id) {
  const part = db.parts.find(p => p.id === id);
  if (!part) return;
  if (state.installed.has(id)) state.installed.delete(id);
  else {
    if (['engine','wing','landing','tail'].includes(part.type)) db.parts.filter(p => p.type === part.type).forEach(p => state.installed.delete(p.id));
    state.installed.add(id);
  }
  renderAll();
}

const liveryOrder = ['livery-cargo','livery-rescue','livery-passenger','livery-long_range','livery-survey','livery-training'];

function renderPlane() {
  if (!el.plane) return;
  Object.values(partVisualMap).flat().forEach(selector => { const node = el.plane.querySelector(selector); if (node) node.style.display = 'none'; });
  [...state.installed].forEach(id => (partVisualMap[id] || []).forEach(selector => { const node = el.plane.querySelector(selector); if (node) node.style.display = 'block'; }));

  const mission = currentMission();
  el.plane.classList.remove(...liveryOrder);
  let tagLabel = '';
  if (mission) {
    const tag = mission.tags[0];
    const liveryClass = 'livery-' + tag;
    if (liveryOrder.includes(liveryClass)) el.plane.classList.add(liveryClass);
    else el.plane.classList.add('livery-training');
    const labels = { cargo: 'CARGO', rescue: 'RESCUE', passenger: 'PASSENGER', long_range: 'LONG RANGE', survey: 'SURVEY', training: 'TRAINING', eco: 'ECO' };
    tagLabel = labels[tag] || tag.toUpperCase();
  }
  let tagEl = el.plane.querySelector('.mission-type-tag');
  if (!tagEl) {
    tagEl = document.createElement('div');
    tagEl.className = 'mission-type-tag';
    el.plane.appendChild(tagEl);
  }
  tagEl.textContent = tagLabel;
}

function evaluateBuild() {
  const mission = currentMission();
  if (!mission) return { failures: [], totalCost: 0, safety: 0, missionFit: 0, canFly: false };
  const selected = db.parts.filter(p => state.installed.has(p.id));
  const ids = new Set(selected.map(p => p.id));
  const totalCost = selected.reduce((sum, p) => sum + p.cost, 0);
  const failures = [];

  if (state.mode === 'mission') {
    const missing = mission.required.filter(id => !ids.has(id));
    if (missing.length) failures.push({ code: 'missing_required_system', data: { missing } });
  }

  if ([...ids].some(id => id.includes('wing')) && ![...ids].some(id => id.includes('tail'))) failures.push({ code: 'balance_problem', data: {} });
  if ([...ids].some(id => id.includes('engine')) && ![...ids].some(id => id.includes('fuel'))) failures.push({ code: 'fuel_problem', data: {} });
  if (![...ids].some(id => id.includes('landing_gear'))) failures.push({ code: 'landing_risk', data: {} });

  if (state.mode === 'mission') {
    if (mission.tags.includes('cargo') && !ids.has('cargo_bay_light') && !ids.has('cargo_bay_heavy')) failures.push({ code: 'cargo_problem', data: {} });
    if (mission.tags.includes('rescue') && ![...ids].some(id => id.includes('radar'))) failures.push({ code: 'safety_problem', data: {} });
    if (mission.tags.includes('passenger') && ![...ids].some(id => id.includes('passenger_seats'))) failures.push({ code: 'comfort_problem', data: {} });
    if (mission.tags.includes('long_range') && !ids.has('wing_long_range')) failures.push({ code: 'range_problem', data: {} });
  }

  if (state.mode !== 'training' && totalCost > mission.budget) failures.push({ code: 'budget_exceeded', data: { totalCost, budget: mission.budget } });

  const safety = Math.max(0, 100 - failures.length * 14);
  const matchedMissionParts = selected.filter(p => mission.tags.some(tag => p.tags.includes(tag))).length;
  const missionFit = Math.min(100, Math.round((matchedMissionParts / Math.max(1, mission.required.length)) * 100));
  return { failures, totalCost, safety, missionFit, canFly: failures.length === 0 };
}

function renderTelemetry(result) { setText(el.costValue, result.totalCost); setText(el.safetyValue, `${result.safety}%`); setText(el.missionFitValue, `${result.missionFit}%`); }

function renderDiagnostics(result) {
  if (!el.faultList) return;
  el.faultList.innerHTML = '';
  if (!result.failures.length) {
    setHTML(el.faultList, `<li class="fault-item good"><strong>Ready for Takeoff</strong><span>Your plane is healthy and ready!</span><em>Press Test Flight to see it fly.</em></li>`);
    const modeMsg = state.mode === 'training' ? 'Great exploring! Try Budget Challenge next.' : 'Flight Doctor says: Excellent build! Ready to fly.';
    setText(el.mentorPrompt, modeMsg);
    setText(el.statusBadge, 'Ready');
    return;
  }

  const map = {
    missing_required_system: ['Important Parts Missing', f => `Your plane still needs: ${f.data.missing.map(humanize).join(', ')}.`, 'Install all required systems before takeoff.'],
    balance_problem: ['Balance Problem', () => 'The plane may wobble.', 'Add a tail system.'],
    fuel_problem: ['Fuel Problem', () => 'Your engine needs fuel support.', 'Install a fuel tank.'],
    landing_risk: ['Landing Risk', () => 'This aircraft may not land safely.', 'Add landing gear.'],
    safety_problem: ['Safety System Needed', () => 'This mission needs guidance.', 'Add radar or guidance systems.'],
    cargo_problem: ['Cargo Space Needed', () => 'This mission needs cargo space.', 'Install a cargo bay.'],
    comfort_problem: ['Passenger Comfort Needed', () => 'This mission needs seats.', 'Add passenger seats.'],
    range_problem: ['Long Flight Upgrade Needed', () => 'This mission needs better wings.', 'Choose long-range wings.'],
    budget_exceeded: ['Budget Too High', f => `Build costs ${f.data.totalCost}, but budget is ${f.data.budget}.`, 'Remove extra parts or choose simpler options.']
  };

  result.failures.forEach(fault => {
    const item = map[fault.code] || ['Needs One More Fix', () => 'One part needs attention.', 'Try one small improvement.'];
    const li = document.createElement('li');
    li.className = 'fault-item';
    li.innerHTML = `<strong>${item[0]}</strong><span>${typeof item[1] === 'function' ? item[1](fault) : item[1]}</span><em>${item[2]}</em>`;
    el.faultList.appendChild(li);
  });
  setText(el.mentorPrompt, 'Flight Doctor says: ' + (el.faultList.querySelector('em')?.textContent || 'Fix one issue and try again.'));
  setText(el.statusBadge, 'Needs Fixing');
}

const anatomyIcons = {
  wing: '🪽', tail: '🪶', fuselage: '✈️', engine: '🚀', propeller: '🚁', spinner: '🌀', nacelle: '🛡️',
  landing_gear: '🛞', fuel_tank: '⛽', apu: '🔋', battery: '🪫', generator: '⚡', ailerons: '🛫',
  elevators: '🛬', rudder: '⛵', flaps: '📐', slats: '📏', spoilers: '🛑', horizontal_stabilizer: '⚖️',
  vertical_stabilizer: '🦈', trim_tabs: '🤏', cockpit: '🧑‍✈️', yoke: '🕹️', rudder_pedals: '🦶',
  throttle: '🎚️', altimeter: '🏔️', airspeed_indicator: '💨', attitude_indicator: '🧭', pitot_tube: '🌡️',
  static_port: '🕳️', windshield: '🪟', radar: '📡', transponder: '📶', comms_radio: '📻',
  flight_data_recorder: '📼', cockpit_voice_recorder: '🎙️', radome: '👃', navigation_lights: '🚦',
  beacon_light: '🚨', landing_lights: '🔦', cargo_bay: '📦', passenger_seats: '💺', overhead_bins: '🧳',
  galley: '☕', lavatory: '🚻', oxygen_system: '🫁', pressurization_system: '🎈',
  environmental_control_system: '❄️', fire_extinguishing_system: '🧯', emergency_exits: '🚪'
};

function renderAnatomy() {
  const btnCloud = document.getElementById('anatomyBtnCloud');
  if (!btnCloud) return;
  
  btnCloud.innerHTML = ''; 
  
  db.anatomy.forEach(item => {
    const btn = document.createElement('button');
    btn.className = 'part-pill' + (state.anatomySelected === item.id ? ' active' : '');
    
    const icon = anatomyIcons[item.id] || '✈️';
    btn.innerHTML = `<span>${icon}</span> ${item.name}`;
    
    btn.addEventListener('click', () => {
      state.anatomySelected = item.id;
      renderAnatomy(); 
      renderAnatomyDetail(); 
      
      if (item.id === 'engine' || item.id === 'nacelle' || item.id === 'propeller') {
        SoundFX.play('engine');
      } else {
        SoundFX.play('click');
      }
    });
    
    btnCloud.appendChild(btn);
  });
}

function renderAnatomyDetail() {
  const detailBox = document.getElementById('anatomyBottomDetail');
  if (!detailBox) return;

  const item = db.anatomy.find(x => x.id === state.anatomySelected);
  
  if (!item) {
    detailBox.classList.add('hidden');
    return;
  }
  
  detailBox.classList.remove('hidden');
  const icon = anatomyIcons[item.id] || '✈️';
  
  const titleEl = document.getElementById('detailBoxTitle');
  const shortEl = document.getElementById('detailBoxShort');
  const functionEl = document.getElementById('detailBoxFunction');
  const missingEl = document.getElementById('detailBoxMissing');
  const lessonEl = document.getElementById('detailBoxLesson');
  
  if (titleEl) titleEl.innerHTML = `<span>${icon}</span> ${item.name}`;
  if (shortEl) shortEl.textContent = item.short;
  if (functionEl) functionEl.textContent = item.function;
  if (missingEl) missingEl.textContent = item.ifMissing;
  if (lessonEl) lessonEl.textContent = item.lesson;
}

function renderAll() {
  renderMode();
  renderMission();
  renderFilters();
  renderParts();
  renderPlane();
  renderAnatomy();
  renderAnatomyDetail();
  const result = evaluateBuild();
  state.lastResult = result;
  renderTelemetry(result);
  renderDiagnostics(result);
}

function bindEvents() {
  if (el.scanBtn) el.scanBtn.addEventListener('click', () => { 
    SoundFX.play('click'); // Added sound
    const result = evaluateBuild(); 
    state.lastResult = result; 
    renderTelemetry(result); 
    renderDiagnostics(result); 
  });
  
  if (el.flyBtn) el.flyBtn.addEventListener('click', () => {
    const result = state.lastResult || evaluateBuild();
    if (result.canFly) {
      SoundFX.play('takeoff');

      state.stars += 1;
      setText(el.starBadge, `Stars ${state.stars}`);
      setText(el.mentorPrompt, 'Flight Doctor says: Mission success! Your plane completed the journey.');
      setText(el.statusBadge, 'Flying');
      if (el.plane) {
        el.plane.getAnimations().forEach(a => a.cancel());
        el.plane.animate([{ transform: 'translate(-50%, -50%) translate(0px,0px)' }, { transform: 'translate(-44%, -66%) translate(12px,-20px)' }, { transform: 'translate(-37%, -82%) translate(30px,-40px)' }], { duration: 1400, easing: 'ease-out', fill: 'forwards' });
      }
    } else {
      SoundFX.play('click'); 
      renderDiagnostics(result);
    }
  });

  if (el.resetBtn) el.resetBtn.addEventListener('click', () => { 
    SoundFX.play('click'); // Added sound
    state.installed.clear(); 
    if (el.plane) el.plane.getAnimations().forEach(a => a.cancel()); 
    renderAll(); 
  });
  
  if (el.nextMissionBtn) el.nextMissionBtn.addEventListener('click', () => { 
    SoundFX.play('click'); // Added sound
    state.missionIndex = (state.missionIndex + 1) % db.missions.length; 
    state.installed.clear(); 
    if (el.plane) el.plane.getAnimations().forEach(a => a.cancel()); 
    renderAll(); 
  });
  
  if (el.prevMissionBtn) el.prevMissionBtn.addEventListener('click', () => { 
    SoundFX.play('click'); // Added sound
    state.missionIndex = (state.missionIndex - 1 + db.missions.length) % db.missions.length; 
    state.installed.clear(); 
    if (el.plane) el.plane.getAnimations().forEach(a => a.cancel()); 
    renderAll(); 
  });
  
  bindModeSelector();

  const tooltip = document.getElementById('anatomyTooltip');
  const hotspots = document.querySelectorAll('.hotspot');

  hotspots.forEach(spot => {
    spot.addEventListener('click', (e) => {
      const partId = e.currentTarget.getAttribute('data-part');
      state.anatomySelected = partId; 
      renderAnatomy(); 
      renderAnatomyDetail(); 
      
      if (partId === 'engine' || partId === 'nacelle' || partId === 'propeller') {
        SoundFX.play('engine');
      } else {
        SoundFX.play('click');
      }
    });

    spot.addEventListener('mouseenter', (e) => {
      const partId = e.currentTarget.getAttribute('data-part');
      const partInfo = db.anatomy.find(p => p.id === partId);
      
      if (partInfo && tooltip) {
        tooltip.innerHTML = `
          <h4>${partInfo.name}</h4>
          <p style="color: var(--accent); font-weight: 700; margin-bottom: 6px;">${partInfo.short}</p>
          <hr style="border: 0; border-top: 1px solid var(--line); margin: 8px 0;">
          <p><strong>Function:</strong> ${partInfo.function}</p>
        `;
        tooltip.style.opacity = '1';
      }
    });

    spot.addEventListener('mousemove', (e) => {
      if (tooltip) {
        tooltip.style.left = (e.pageX + 15) + 'px';
        tooltip.style.top = (e.pageY + 15) + 'px';
      }
    });

    spot.addEventListener('mouseleave', () => {
      if (tooltip) {
        tooltip.style.opacity = '0';
      }
    });
  });
}

async function initGame() {
  cacheDom();
  try { await loadData(); } catch (err) { console.error(err); setText(el.mentorPrompt, 'Could not load game data. Use a local server.'); return; }
  bindEvents();
  renderAll();
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initGame); else initGame();