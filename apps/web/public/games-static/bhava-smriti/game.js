const ICONS = {
  animal_safari: ['🦁','🐘','🦒','🐼','🦓','🐒','🦊','🦘','🐅','🐆','🦛','🦏'],
  food_garden: ['🍎','🍌','🍇','🍓','🥕','🌽','🥭','🍍','🍉','🍒','🍑','🍊'],
  space_quest: ['🚀','🪐','⭐','🌕','🛰️','👽','☄️','🌌','🌑','🌟','🛸','🌠'],
  ocean_deep: ['🐠','🐬','🦈','🐙','🪼','🦀','🐢','🌊','🐡','🦞','🐳','🦑'],
  jungle_adventure: ['🐯','🦜','🦍','🦥','🐍','🐆','🦋','🌴','🐊','🦎','🐸','🦚'],
  dinosaur_valley: ['🦖','🦕','🥚','🪨','🌋','🌿','🪶','🦴','🦎','🦇','🌾','🦗'],
  bird_song_garden: ['🐦','🦉','🦅','🦢','🦚','🐧','🐤','🌸','🦜','🦩','🐣','🦤'],
  insect_world: ['🐞','🦋','🐝','🐜','🪲','🦟','🕷️','🌼','🐛','🦗','🪳','🪰'],
  weather_station: ['☀️','🌧️','⛈️','❄️','🌈','🌪️','🌬️','🌡️','☁️','⛅','🌩️','🌨️'],
  plant_kingdom: ['🌱','🌿','🌷','🌻','🌵','🍄','🍀','🌳','🌲','🌴','🌾','🌺'],
  transport_town: ['🚗','🚌','🚲','🚂','✈️','🚢','🛵','🚦','🚁','🚤','🚑','🚒'],
  home_helpers: ['🛏️','🪑','🪟','🧹','🍳','🛁','💡','🧴','🧺','🪞','🧻','🗑️'],
  community_heroes: ['👩‍⚕️','👨‍🚒','👮','👩‍🏫','🧑‍🌾','🧑‍🔧','👷','🏥','🧑‍⚕️','👩‍🚒','👩‍⚖️','👨‍🚀'],
  sports_arena: ['⚽','🏀','🏏','🎾','🏐','🥇','🏆','🏃','🏊','🚴','🏋️','🤸'],
  music_festival: ['🎵','🎸','🥁','🎹','🎺','🎻','🎤','🎧','🎷','🪕','🎼','🥢'],
  science_lab: ['🔬','⚗️','🧪','🧫','📡','🧲','🔋','🧠','🔭','🧬','🦠','🔌'],
  robot_city: ['🤖','🦾','⚙️','🛰️','🚦','🏭','🔌','💻','🦿','🕹️','🦻','🛸'],
  world_landmarks: ['🗽','🗼','🎡','🕌','⛩️','🕍','🏰','🌍','🗿','🎢','🌉','🏛️'],
  number_quest: ['1️⃣','2️⃣','3️⃣','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣','9️⃣','🔟','#️⃣','*️⃣'],
  shape_studio: ['🔺','⬛','⬜','🔵','🟡','🔸','➕','➖','🔷','🟢','🔻','🔘'],
  colour_carnival: ['🔴','🟠','🟡','🟢','🔵','🟣','🩷','🤎','🩵','🩶','🟤','⬛'],
  emotion_match: ['😀','😢','😡','😴','😲','🤩','🥳','😌','😭','😤','😍','🤔'],
  devanagari_adventure: ['अ','आ','इ','ई','उ','ऊ','ए','ओ','क','ख','ग','घ'],
  simple_words: ['ॐ','धर्म','ज्ञान','शान्ति','सत्य','प्रेम','वेद','मन्त्र','आत्मा','ब्रह्म','कर्म','योग']
};

const WORLD_LIST = [
  {id:'animal_safari',title:'Animal Safari',icon:'🦁',desc:'Friendly animal cards inspired by the zoo game style.',goal:'Match animals and remember their places.'},
  {id:'food_garden',title:'Food Garden',icon:'🍎',desc:'Colourful fruits and foods for younger learners.',goal:'Match healthy foods and play with bright colors.'},
  {id:'space_quest',title:'Space Quest',icon:'🚀',desc:'High-energy boards with stronger challenge.',goal:'Explore space-themed memory matches.'},
  {id:'ocean_deep',title:'Ocean Deep',icon:'🌊',desc:'Calmer theme with bright sea creature decks.',goal:'Match sea creatures and ocean items.'},
  {id:'jungle_adventure',title:'Jungle Adventure',icon:'🌴',desc:'A lively jungle journey with wild friends.',goal:'Remember jungle animals and nature.'},
  {id:'dinosaur_valley',title:'Dinosaur Valley',icon:'🦖',desc:'Prehistoric fun with dinosaurs and fossils.',goal:'Match dinosaurs and ancient clues.'},
  {id:'bird_song_garden',title:'Bird Song Garden',icon:'🐦',desc:'A soft sky world filled with birds and flowers.',goal:'Match birds and gentle garden items.'},
  {id:'insect_world',title:'Insect World',icon:'🐞',desc:'Tiny creatures with big memory fun.',goal:'Match insects and flower companions.'},
  {id:'weather_station',title:'Weather Station',icon:'☀️',desc:'Learn the sky and weather patterns.',goal:'Match weather signs and seasons.'},
  {id:'plant_kingdom',title:'Plant Kingdom',icon:'🌱',desc:'A green world about plants and growth.',goal:'Match leaves, seeds, and flowers.'},
  {id:'transport_town',title:'Transport Town',icon:'🚗',desc:'Vehicles, roads, and movement everywhere.',goal:'Match transport and traffic icons.'},
  {id:'home_helpers',title:'Home Helpers',icon:'🧹',desc:'Common objects children see at home.',goal:'Match everyday items and household tools.'},
  {id:'community_heroes',title:'Community Heroes',icon:'👩‍⚕️',desc:'People who help us in daily life.',goal:'Match helpers and public service roles.'},
  {id:'sports_arena',title:'Sports Arena',icon:'⚽',desc:'Energetic sports and awards world.',goal:'Match sports and victory symbols.'},
  {id:'music_festival',title:'Music Festival',icon:'🎵',desc:'Rhythm, instruments, and sound fun.',goal:'Match instruments and music symbols.'},
  {id:'science_lab',title:'Science Lab',icon:'🔬',desc:'Discover tools, atoms, and experiments.',goal:'Match lab tools and science ideas.'},
  {id:'robot_city',title:'Robot City',icon:'🤖',desc:'A future city with smart machines.',goal:'Match robots, gears, and circuits.'},
  {id:'world_landmarks',title:'World Landmarks',icon:'🗽',desc:'Famous places from around the planet.',goal:'Match landmark images and global symbols.'},
  {id:'number_quest',title:'Number Quest',icon:'1️⃣',desc:'A learning world focused on numbers.',goal:'Match digits in simple numerical play.'},
  {id:'shape_studio',title:'Shape Studio',icon:'🔺',desc:'Explore shapes and patterns.',goal:'Match circles, squares, triangles, and symbols.'},
  {id:'colour_carnival',title:'Colour Carnival',icon:'🎨',desc:'A bright rainbow world of colors.',goal:'Match color chips and visual memory.'},
  {id:'emotion_match',title:'Emotion Match',icon:'😀',desc:'A gentle world for feelings and faces.',goal:'Match emotions with expressive icons.'},
  {id:'devanagari_adventure',title:'Devanagari Adventure',icon:'अ',desc:'Letters and learning through memory fun.',goal:'Match Devanagari letters.'},
  {id:'simple_words',title:'Simple Words',icon:'ॐ',desc:'Simple symbols and meaningful words.',goal:'Match sacred words and symbols.'}
];

const state = {
  world: WORLD_LIST[0].id,
  difficulty: 'easy',
  first: null,
  second: null,
  locked: false,
  moves: 0,
  score: 0,
  matched: 0,
  timer: 0,
  timerId: null,
  audioUnlocked: false,
  boardCards: []
};

const settings = { easy: 8, medium: 10, hard: 12 };

const els = {
  worldSelect: document.getElementById('worldSelect'),
  worldGrid: document.getElementById('worldGrid'),
  heroBox: document.getElementById('heroBox'),
  gameArea: document.getElementById('gameArea'),
  board: document.getElementById('board'),
  hudWorld: document.getElementById('hudWorld'),
  hudMoves: document.getElementById('hudMoves'),
  hudTime: document.getElementById('hudTime'),
  hudScore: document.getElementById('hudScore'),
  goalPill: document.getElementById('goalPill'),
  startBtn: document.getElementById('startBtn'),
  backBtn: document.getElementById('backBtn'),
  shuffleBtn: document.getElementById('shuffleBtn'),
  easyBtn: document.getElementById('easyBtn'),
  mediumBtn: document.getElementById('mediumBtn'),
  hardBtn: document.getElementById('hardBtn'),
  soundBtn: document.getElementById('soundBtn'),
  winOverlay: document.getElementById('winOverlay'),
  winText: document.getElementById('winText'),
  nextWorldBtn: document.getElementById('nextWorldBtn'),
  playAgainBtn: document.getElementById('playAgainBtn')
};

function pickTheme(index) {
  const palettes = [
    ['#4b2a7a', '#d65aa6'],
    ['#2d7a5a', '#5ad6a6'],
    ['#7a3a2d', '#d65a5a'],
    ['#2d5a7a', '#5a9ad6'],
    ['#5a2d7a', '#9a5ad6'],
    ['#7a5a2d', '#d6a65a']
  ];
  const p = palettes[index % palettes.length];
  document.documentElement.style.setProperty('--bg1', p[0]);
  document.documentElement.style.setProperty('--bg2', p[1]);
}

function rng(seed) {
  let t = seed % 2147483647;
  return () => {
    t = (t * 16807) % 2147483647;
    return t / 2147483647;
  };
}

function shuffle(arr, seedStr) {
  const seed = seedStr.split('').reduce((a, c) => a + c.charCodeAt(0), 0) || 1;
  const r = rng(seed);
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildDeck(worldId, difficulty) {
  const base = ICONS[worldId] || ['🂠','🂡','🂢','🂣','🂤','🂥','🂦','🂧'];
  const pairs = settings[difficulty] || 8;
  // If not enough unique icons, cycle through the array to fill
  const chosen = [];
  for (let i = 0; i < pairs; i++) {
    chosen.push(base[i % base.length]);
  }
  const deck = [...chosen, ...chosen].map((v, i) => ({ id: i + 1, val: v }));
  return shuffle(deck, `${worldId}-${difficulty}-${Date.now()}`);
}

function stopTimer() {
  if (state.timerId) {
    clearInterval(state.timerId);
    state.timerId = null;
  }
}

function startTimer() {
  stopTimer();
  state.timer = 0;
  els.hudTime.textContent = 'Time: 0s';
  state.timerId = setInterval(() => {
    state.timer++;
    els.hudTime.textContent = `Time: ${state.timer}s`;
  }, 1000);
}

function updateHud() {
  const w = WORLD_LIST.find(x => x.id === state.world);
  els.hudWorld.textContent = `World: ${w.title}`;
  els.hudMoves.textContent = `Moves: ${state.moves}`;
  els.hudScore.textContent = `Score: ${state.score}`;
  els.goalPill.textContent = w.goal;
  pickTheme(WORLD_LIST.findIndex(x => x.id === state.world));
}

function unlockAudio() {
  if (state.audioUnlocked) return;
  state.audioUnlocked = true;
}

function beep(type) {
  if (!state.audioUnlocked) return;
  try {
    const C = window.AudioContext || window.webkitAudioContext;
    if (!C) return;
    if (!beep.ctx) beep.ctx = new C();
    const ctx = beep.ctx;
    if (ctx.state === 'suspended') ctx.resume();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.connect(g);
    g.connect(ctx.destination);
    const map = {
      flip: [320, .06, .04],
      match: [520, .10, .05],
      wrong: [180, .10, .06],
      win: [720, .14, .06]
    };
    const [f, d, v] = map[type] || map.flip;
    o.frequency.value = f;
    o.type = 'triangle';
    g.gain.value = v;
    o.start();
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + d);
    o.stop(ctx.currentTime + d);
  } catch (e) {}
}

function getGridColumns(cardCount) {
  const candidates = [2, 3, 4, 5, 6, 7, 8, 10];
  let best = 4;
  let bestScore = -Infinity;
  for (const c of candidates) {
    if (c > cardCount) continue;
    const rows = cardCount / c;
    const isClean = Number.isInteger(rows);
    const rowPenalty = -rows * 4;
    const widthBonus = c * 0.3;
    const score = (isClean ? 100 : 0) + rowPenalty + widthBonus;
    if (score > bestScore) { bestScore = score; best = c; }
  }
  return best;
}

function celebrate() {
  const overlay = document.createElement('div');
  overlay.className = 'celebrate-overlay';
  document.body.appendChild(overlay);
  
  const colors = ['#ffd34d', '#5dff9a', '#ff7a7a', '#5a9ad6', '#d65aa6', '#ff9a5d', '#ff5d8a', '#5dffa3', '#ffffff', '#ffdd00'];
  const shapes = ['circle', 'square', 'rect'];
  
  for (let i = 0; i < 120; i++) {
    const p = document.createElement('div');
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    p.className = 'particle';
    if (shape === 'square') p.classList.add('square');
    if (shape === 'rect') p.classList.add('rect');
    
    p.style.left = Math.random() * 100 + 'vw';
    p.style.background = colors[Math.floor(Math.random() * colors.length)];
    const size = 6 + Math.random() * 14;
    p.style.width = size + 'px';
    p.style.height = (shape === 'rect' ? size * 2.5 : size) + 'px';
    p.style.animationDuration = (2 + Math.random() * 3.5) + 's';
    p.style.animationDelay = (Math.random() * 2.5) + 's';
    p.style.top = (-5 - Math.random() * 15) + 'vh';
    overlay.appendChild(p);
  }
  
  setTimeout(() => overlay.remove(), 7000);
}

function renderWorlds() {
  els.worldSelect.innerHTML = WORLD_LIST.map(w => `<option value="${w.id}">${w.title}</option>`).join('');
  els.worldGrid.innerHTML = '';
  WORLD_LIST.forEach((w, i) => {
    const d = document.createElement('div');
    d.className = 'world glass';
    d.dataset.id = w.id;
    d.innerHTML = `<div class="icon">${w.icon}</div><h3>${w.title}</h3><p>${w.desc}</p>`;
    d.addEventListener('click', () => {
      state.world = w.id;
      els.worldSelect.value = w.id;
      renderWorlds();
      showGame(false);
    });
    els.worldGrid.appendChild(d);
  });
  highlightWorld();
}

function highlightWorld() {
  document.querySelectorAll('.world').forEach(el => {
    el.classList.toggle('active', el.dataset.id === state.world);
  });
}

function updateDifficultyButtons() {
  [els.easyBtn, els.mediumBtn, els.hardBtn].forEach(btn => {
    btn.classList.remove('active');
  });
  if (state.difficulty === 'easy') els.easyBtn.classList.add('active');
  if (state.difficulty === 'medium') els.mediumBtn.classList.add('active');
  if (state.difficulty === 'hard') els.hardBtn.classList.add('active');
}

function buildBoard() {
  const deck = buildDeck(state.world, state.difficulty);
  state.boardCards = deck;
  state.first = null;
  state.second = null;
  state.locked = false;
  state.matched = 0;
  state.moves = 0;
  state.score = 0;
  updateHud();
  updateDifficultyButtons();

  const cols = getGridColumns(deck.length);
  els.board.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
  els.board.innerHTML = '';

  deck.forEach((c, idx) => {
    const b = document.createElement('button');
    b.className = 'card';
    b.dataset.val = c.val;
    b.dataset.idx = idx;
    b.innerHTML = `<div class="face front"></div><div class="face back">${c.val}</div>`;
    b.addEventListener('click', () => flipCard(b));
    els.board.appendChild(b);
  });
}

function flipCard(card) {
  unlockAudio();
  if (state.locked || card.classList.contains('flipped') || card.classList.contains('matched')) return;
  beep('flip');
  card.classList.add('flipped');
  if (!state.first) {
    state.first = card;
    return;
  }
  state.second = card;
  state.moves++;
  updateHud();
  state.locked = true;

  if (state.first.dataset.val === state.second.dataset.val) {
    state.first.classList.add('matched');
    state.second.classList.add('matched');
    [state.first, state.second].forEach(c => {
      const s = document.createElement('div');
      s.className = 'sparkle';
      c.appendChild(s);
      setTimeout(() => s.remove(), 600);
    });
    state.first.disabled = true;
    state.second.disabled = true;
    state.first = null;
    state.second = null;
    state.locked = false;
    state.matched++;
    state.score += 10;
    updateHud();
    els.hudScore.classList.add('bump');
    setTimeout(() => els.hudScore.classList.remove('bump'), 400);
    beep('match');
    if (state.matched === settings[state.difficulty]) {
      winGame();
    }
  } else {
    beep('wrong');
    setTimeout(() => {
      state.first.classList.remove('flipped');
      state.second.classList.remove('flipped');
      state.first = null;
      state.second = null;
      state.locked = false;
    }, 700);
  }
}

function winGame() {
  stopTimer();
  beep('win');
  celebrate();
  const w = WORLD_LIST.find(x => x.id === state.world);
  els.winText.textContent = `You matched every pair in ${w.title} with ${state.moves} moves and ${state.timer} seconds.`;
  els.winOverlay.classList.add('show');
}

function showGame(show) {
  els.heroBox.classList.toggle('hidden', show);
  els.worldGrid.classList.toggle('hidden', show);
  els.gameArea.classList.toggle('hidden', !show);
  if (show) {
    renderWorlds();
    highlightWorld();
    updateHud();
    buildBoard();
    startTimer();
    els.board.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else {
    stopTimer();
    els.winOverlay.classList.remove('show');
  }
}

function nextWorld() {
  const idx = (WORLD_LIST.findIndex(w => w.id === state.world) + 1) % WORLD_LIST.length;
  state.world = WORLD_LIST[idx].id;
  els.winOverlay.classList.remove('show');
  showGame(true);
  els.worldSelect.value = state.world;
}

function resetCurrent() {
  els.winOverlay.classList.remove('show');
  showGame(true);
}

function setDifficulty(level) {
  state.difficulty = level;
  buildBoard();
  startTimer();
  updateHud();
}

els.worldSelect.addEventListener('change', e => {
  state.world = e.target.value;
  renderWorlds();
  highlightWorld();
});

els.startBtn.addEventListener('click', () => showGame(true));
els.backBtn.addEventListener('click', () => showGame(false));
els.shuffleBtn.addEventListener('click', () => { buildBoard(); startTimer(); });
els.easyBtn.addEventListener('click', () => setDifficulty('easy'));
els.mediumBtn.addEventListener('click', () => setDifficulty('medium'));
els.hardBtn.addEventListener('click', () => setDifficulty('hard'));
els.soundBtn.addEventListener('click', () => {
  unlockAudio();
  beep('flip');
  setTimeout(() => beep('match'), 200);
});
els.nextWorldBtn.addEventListener('click', nextWorld);
els.playAgainBtn.addEventListener('click', resetCurrent);

document.addEventListener('pointerdown', unlockAudio, { once: true });
document.addEventListener('keydown', unlockAudio, { once: true });

renderWorlds();
updateHud();