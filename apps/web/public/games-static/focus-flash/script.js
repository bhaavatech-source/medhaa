const COLORS = ["#ef4444","#3b82f6","#eab308","#22c55e","#a855f7","#ec4899"];
// Thematic Asset Dictionaries
const THEMES = {
  shapes: ["circle", "square", "triangle", "star"],
  space: ["🚀", "🛰️", "🛸", "🪐", "👨‍🚀"],
  vehicles: ["🚁", "🏎️", "🚜", "🛵", "🚒"],
  chips: ["🔋", "🔌", "💾", "📡", "🖲️"] // Electronic components
};

// Capture Settings Elements
const themeSelect = document.getElementById("themeSelect");
const driftingToggle = document.getElementById("driftingToggle");
const playstyleSelect = document.getElementById("playstyleSelect");
// --- LOAD SAVED SETTINGS ---
// Check if the player has saved settings; if not, use defaults
const savedTheme = localStorage.getItem("focusFlashTheme") || "shapes";
const savedDrifting = localStorage.getItem("focusFlashDrifting") === "true";
const savedPlaystyle = localStorage.getItem("focusFlashPlaystyle") || "standard";

// Apply the saved settings to the visual menu
themeSelect.value = savedTheme;
driftingToggle.checked = savedDrifting;
playstyleSelect.value = savedPlaystyle;

// --- SAVE SETTINGS ON CHANGE ---
// Whenever the player changes a setting, instantly save it to memory
themeSelect.addEventListener("change", () => {
  localStorage.setItem("focusFlashTheme", themeSelect.value);
});

driftingToggle.addEventListener("change", () => {
  localStorage.setItem("focusFlashDrifting", driftingToggle.checked);
});

playstyleSelect.addEventListener("change", () => {
  localStorage.setItem("focusFlashPlaystyle", playstyleSelect.value);
});
const mascotArea = document.getElementById("mascotArea");

// Helper to create visual combo particles
function createParticles(x, y) {
  for (let i = 0; i < 8; i++) {
    const particle = document.createElement("div");
    particle.className = "particle";
    particle.textContent = "✨";
    particle.style.left = x + "px";
    particle.style.top = y + "px";
    particle.style.setProperty('--tx', (Math.random() * 100 - 50) + "px");
    particle.style.setProperty('--ty', (Math.random() * 100 - 50) + "px");
    document.body.appendChild(particle);
    setTimeout(() => particle.remove(), 600);
  }
}
const STORAGE_KEY = "focusFlashHistory";

const START_DIFFICULTY = { easy: 2, medium: 5, hard: 8 };

const MILESTONES_SELECTIVE = [5, 10, 15];
const WINDOW_SIZE = 5;

let state = {};
let sustainedState = {};
let soundOn = true;
let comboStreak = 0;
let currentMode = "selective";

const startScreen = document.getElementById("startScreen");
const gameScreen = document.getElementById("gameScreen");
const sustainedScreen = document.getElementById("sustainedScreen");
const endScreen = document.getElementById("endScreen");
const progressScreen = document.getElementById("progressScreen");

const grid = document.getElementById("grid");
const targetBanner = document.getElementById("targetBanner");
const feedback = document.getElementById("feedback");
const comboPopup = document.getElementById("comboPopup");
const milestonePopup = document.getElementById("milestonePopup");
const difficultyPopup = document.getElementById("difficultyPopup");
const timeWrapper = document.getElementById("timeWrapper");
const progressBar = document.getElementById("progressBar");
const endStars = document.getElementById("endStars");

const sustainedRule = document.getElementById("sustainedRule");
const sustainedShapeWrap = document.getElementById("sustainedShapeWrap");
const tapTargetBtn = document.getElementById("tapTargetBtn");
const sustainedFeedback = document.getElementById("sustainedFeedback");
const sustainedProgressBar = document.getElementById("sustainedProgressBar");

const soundToggle = document.getElementById("soundToggle");
const soundToggleGame = document.getElementById("soundToggleGame");
const soundToggleSustained = document.getElementById("soundToggleSustained");

let audioCtx = null;
function getCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === "suspended") audioCtx.resume();
  return audioCtx;
}
function unlockAudioOnce() {
  getCtx();
  document.removeEventListener("click", unlockAudioOnce);
  document.removeEventListener("touchstart", unlockAudioOnce);
}
document.addEventListener("click", unlockAudioOnce);
document.addEventListener("touchstart", unlockAudioOnce);

function beep(freq, duration, type = "sine", volume = 0.15) {
  if (!soundOn) return;
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.value = volume;
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  osc.stop(ctx.currentTime + duration);
}
function playCorrect() { beep(880, 0.15, "sine", 0.18); setTimeout(() => beep(1180, 0.12, "sine", 0.14), 80); }
function playWrong() { beep(160, 0.25, "sawtooth", 0.15); }
function playRoundStart() { beep(440, 0.12, "triangle", 0.12); }
function playCombo() { [660, 880, 1100].forEach((f, i) => setTimeout(() => beep(f, 0.1, "sine", 0.15), i * 70)); }
function playTick() { beep(300, 0.06, "square", 0.06); }
function playMilestone() { [523, 784].forEach((f, i) => setTimeout(() => beep(f, 0.18, "triangle", 0.16), i * 100)); }
function playGameEnd() { [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => beep(f, 0.2, "sine", 0.15), i * 120)); }
function playLevelUp() { [660, 990].forEach((f, i) => setTimeout(() => beep(f, 0.12, "triangle", 0.14), i * 90)); }
function playLevelDown() { [440, 330].forEach((f, i) => setTimeout(() => beep(f, 0.12, "sine", 0.12), i * 90)); }

function toggleSound() {
  soundOn = !soundOn;
  if (soundOn) getCtx();
  [soundToggle, soundToggleGame, soundToggleSustained].forEach(btn => {
    btn.textContent = soundOn ? "🔊" : "🔇";
    btn.classList.toggle("muted", !soundOn);
  });
}
soundToggle.addEventListener("click", (e) => { e.stopPropagation(); toggleSound(); });
soundToggleGame.addEventListener("click", (e) => { e.stopPropagation(); toggleSound(); });
soundToggleSustained.addEventListener("click", (e) => { e.stopPropagation(); toggleSound(); });

function showScreen(screen) {
  [startScreen, gameScreen, sustainedScreen, endScreen, progressScreen].forEach(s => s.classList.remove("active"));
  screen.classList.add("active");
}

document.querySelectorAll(".mode-tab").forEach(tab => {
  tab.addEventListener("click", () => {
    currentMode = tab.dataset.mode;
    document.querySelectorAll(".mode-tab").forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    document.getElementById("selectiveLevels").classList.toggle("hidden", currentMode !== "selective");
    document.getElementById("sustainedLevels").classList.toggle("hidden", currentMode !== "sustained");
    document.getElementById("modeInstructions").innerHTML = currentMode === "selective"
      ? "Find and tap the <b>target shape</b> before it disappears. Difficulty adapts to you as you play!"
      : "Watch closely! Tap the button <b>only</b> when the target shape appears. Difficulty speeds up as you improve!";
  });
});

document.querySelectorAll(".lvl-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    getCtx();
    if (btn.dataset.mode === "selective") startSelectiveGame(btn.dataset.level);
    else startSustainedGame(btn.dataset.level);
  });
});
document.getElementById("restartBtn").addEventListener("click", () => showScreen(startScreen));
document.getElementById("progressBtn").addEventListener("click", () => renderProgressScreen());
document.getElementById("viewProgressFromEnd").addEventListener("click", () => renderProgressScreen());
document.getElementById("backFromProgress").addEventListener("click", () => showScreen(startScreen));
document.getElementById("clearHistoryBtn").addEventListener("click", () => {
  if (confirm("Clear all saved progress history?")) {
    localStorage.removeItem(STORAGE_KEY);
    renderProgressScreen();
  }
});

function selectiveParamsFromDifficulty(level) {
  level = Math.max(1, Math.min(10, level));
  return {
    totalItems: 20,
    cols: 5,
    roundTime: Math.max(3, 9 - level * 0.5),
    distractorRatio: Math.min(0.75, 0.25 + level * 0.05),
    
    // This ensures the target shape/color changes EVERY single round
    ruleSwitchEvery: 1, 
    
    // This introduces TWO targets to find starting at Level 4 (instead of 8)
    dualTarget: level >= 4 
  };
}


function sustainedParamsFromDifficulty(level) {
  level = Math.max(1, Math.min(10, level));
  return {
    minGap: Math.max(500, 2200 - level * 150),
    maxGap: Math.max(900, 2800 - level * 170),
    targetRatio: Math.max(0.12, 0.35 - level * 0.02),
    nearMiss: level >= 4,
    displayDuration: Math.max(400, 800 - level * 30)
  };
}

function evaluateWindow(windowArr) {
  if (windowArr.length < WINDOW_SIZE) return 0;
  const correct = windowArr.filter(w => w.correct).length;
  const acc = correct / windowArr.length;
  const avgRT = windowArr.filter(w => w.rt != null).reduce((a,b) => a + b.rt, 0) /
                Math.max(1, windowArr.filter(w => w.rt != null).length);

  if (acc >= 0.9 && avgRT > 0 && avgRT < 1200) return 1;
  if (acc <= 0.5) return -1;
  return 0;
}

function showDifficultyPopup(direction) {
  difficultyPopup.textContent = direction > 0 ? "⬆️ Level Up!" : "⬇️ Easing up a bit";
  difficultyPopup.className = "";
  void difficultyPopup.offsetWidth;
  difficultyPopup.classList.add(direction > 0 ? "show-up" : "show-down");
  if (direction > 0) playLevelUp(); else playLevelDown();
}

function startSelectiveGame(levelName) {
  state = {
    mode: "selective", levelName,
    difficulty: START_DIFFICULTY[levelName],
    startDifficulty: START_DIFFICULTY[levelName],
    round: 0, score: 0, hits: 0, misses: 0, wrongTaps: 0,
    totalTargets: 0, reactionTimes: [], target: null, target2: null,
    roundStartTime: 0, timerInterval: null, countdownVal: 0,
    milestonesHit: new Set(), perfWindow: [], totalRounds: 20
  };
  comboStreak = 0;
  document.getElementById("hudDifficulty").textContent = state.difficulty;
  document.getElementById("hudTotalRounds").textContent = state.totalRounds;
  document.getElementById("hudScore").textContent = "0";
  progressBar.style.width = "0%";
  showScreen(gameScreen);
  nextRound();
}

function pickTarget(cfg, prevTarget) {
  let shape, color;
  // Get the array of items for whatever theme is currently selected
  const currentShapes = THEMES[themeSelect.value]; 

  do {
    shape = currentShapes[Math.floor(Math.random() * currentShapes.length)];
    color = COLORS[Math.floor(Math.random() * COLORS.length)];
  } while (prevTarget && shape === prevTarget.shape && color === prevTarget.color);

  const target = { shape, color };
  let target2 = null;
  
  if (cfg.dualTarget) {
    let shape2, color2;
    do {
      shape2 = currentShapes[Math.floor(Math.random() * currentShapes.length)];
      color2 = COLORS[Math.floor(Math.random() * COLORS.length)];
    } while (shape2 === shape && color2 === color);
    target2 = { shape: shape2, color: color2 };
  }
  
  return { target, target2 };
}

function nextRound() {
  state.round++;
  if (state.round > state.totalRounds) { endSelectiveGame(); return; }
  document.getElementById("hudRound").textContent = state.round;
  progressBar.style.width = Math.round((state.round - 1) / state.totalRounds * 100) + "%";

  checkMilestone(state.round - 1);

  const cfg = selectiveParamsFromDifficulty(state.difficulty);
  state.cfg = cfg;

  const switchRule = (state.round - 1) % cfg.ruleSwitchEvery === 0 || !state.target;
  if (switchRule) {
    const picked = pickTarget(cfg, state.target);
    state.target = picked.target;
    state.target2 = picked.target2;
  }

  renderTargetBanner();
  buildGrid();
  startRoundTimer();
  playRoundStart();
  timeWrapper.classList.remove("time-low");
}

function checkMilestone(completedRounds) {
  if (MILESTONES_SELECTIVE.includes(completedRounds) && !state.milestonesHit.has(completedRounds)) {
    state.milestonesHit.add(completedRounds);
    const remaining = state.totalRounds - completedRounds;
    const msgs = {
      5: "🌈 Great start! Keep going!",
      10: "🚀 Halfway there! You're doing awesome!",
      15: `💪 Almost done! ${remaining} rounds left!`
    };
    showMilestone(msgs[completedRounds] || "Nice progress!");
    playMilestone();
  }
}

function colorName(hex) {
  const map = { "#ef4444": "red", "#3b82f6": "blue", "#eab308": "yellow", "#22c55e": "green", "#a855f7": "purple", "#ec4899": "pink" };
  return map[hex] || hex;
}

function renderTargetBanner() {
  const t = state.target;
  let text = `Tap the <b>${t.shape}</b> in <b style="color:${t.color}">${colorName(t.color)}</b>`;
  if (state.target2) {
    text += ` <br>and the <b>${state.target2.shape}</b> in <b style="color:${state.target2.color}">${colorName(state.target2.color)}</b>`;
  }
  targetBanner.innerHTML = text;
}

function isTargetCell(shape, color) {
  const t1 = state.target, t2 = state.target2;
  if (shape === t1.shape && color === t1.color) return true;
  if (t2 && shape === t2.shape && color === t2.color) return true;
  return false;
}

function renderShapeEl(shape, color, sizePercent = 60) {
  const el = document.createElement("div");
  el.style.width = sizePercent + "%";
  el.style.height = sizePercent + "%";
  el.style.margin = "auto";
  el.style.display = "flex";
  el.style.alignItems = "center";
  el.style.justifyContent = "center";
  
  // Apply drifting class if toggled by player
  if (driftingToggle.checked) {
    el.classList.add("drift");
    el.style.animationDelay = (Math.random() * 2) + "s"; // Randomize drift offset
  }

  const currentTheme = themeSelect.value;

  if (currentTheme === "shapes") {
      if (shape === "circle") {
        el.style.background = color;
        el.style.borderRadius = "50%";
      } else if (shape === "square") {
        el.style.background = color;
        el.style.borderRadius = "4px";
      } else if (shape === "triangle") {
        el.style.width = "0"; el.style.height = "0";
        el.style.background = "transparent";
        el.style.borderLeft = "22px solid transparent";
        el.style.borderRight = "22px solid transparent";
        el.style.borderBottom = `40px solid ${color}`;
      } else if (shape === "star") {
        el.style.background = color;
        el.style.clipPath = "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)";
      }
  } else {
      // For Space, Vehicles, and Chips, render the emoji as the shape
      el.style.fontSize = "2.5rem";
      el.style.filter = `drop-shadow(2px 4px 6px ${color})`; // Use color as an aura/glow
      el.textContent = shape;
  }
  return el;
}

function buildGrid() {
  const cfg = state.cfg;
  const totalCells = cfg.totalItems;
  const cols = cfg.cols;

  grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
  grid.style.width = Math.min(cols * 70, 480) + "px";
  grid.innerHTML = "";
  feedback.textContent = "";
  feedback.className = "";

  const targetCount = Math.max(3, Math.round(totalCells * 0.2));
  let target2Count = 0;
  if (state.target2) target2Count = Math.max(2, Math.round(totalCells * 0.15));

  const cells = new Array(totalCells).fill(null);
  const positions = [...Array(totalCells).keys()];
  shuffle(positions);

  let placed = 0;
  for (let i = 0; i < targetCount && placed < totalCells; i++, placed++) {
    cells[positions[placed]] = { shape: state.target.shape, color: state.target.color, isTarget: true };
  }
  if (state.target2) {
    for (let i = 0; i < target2Count && placed < totalCells; i++, placed++) {
      cells[positions[placed]] = { shape: state.target2.shape, color: state.target2.color, isTarget: true };
    }
  }

  // Get the array of items for whatever theme is currently selected
  const currentShapes = THEMES[themeSelect.value];

  while (placed < totalCells) {
    let shape, color;
    do {
      // Use currentShapes instead of the old SHAPES variable
      shape = currentShapes[Math.floor(Math.random() * currentShapes.length)];
      color = COLORS[Math.floor(Math.random() * COLORS.length)];
    } while (isTargetCell(shape, color));
    cells[positions[placed]] = { shape, color, isTarget: false };
    placed++;
  }

  state.totalTargets += targetCount + target2Count;
  state.remainingTargets = targetCount + target2Count;

  cells.forEach((cellData, idx) => {
    const cellEl = document.createElement("div");
    cellEl.style.animationDelay = (idx * 12) + "ms";
    cellEl.className = "cell";
    const shapeEl = renderShapeEl(cellData.shape, cellData.color);
    cellEl.appendChild(shapeEl);
    cellEl.addEventListener("click", () => handleTap(cellEl, cellData));
    grid.appendChild(cellEl);
  });

  state.roundStartTime = performance.now();
}

function showCombo(text) {
  comboPopup.textContent = text;
  comboPopup.classList.remove("show");
  void comboPopup.offsetWidth;
  comboPopup.classList.add("show");
}
function showMilestone(text) {
  milestonePopup.textContent = text;
  milestonePopup.classList.remove("show");
  void milestonePopup.offsetWidth;
  milestonePopup.classList.add("show");
}

function adjustDifficultyIfNeeded(hudEl) {
  const direction = evaluateWindow(state.perfWindow);
  if (direction !== 0) {
    const old = state.difficulty;
    state.difficulty = Math.max(1, Math.min(10, state.difficulty + direction));
    if (state.difficulty !== old) {
      showDifficultyPopup(direction);
      hudEl.textContent = state.difficulty;
    }
    state.perfWindow = [];
  }
}

function handleTap(cellEl, cellData, event) {
  if (cellEl.dataset.done) return;
  cellEl.dataset.done = "1";
  const rt = performance.now() - state.roundStartTime;
  
  const logoEl = document.getElementById("medhaaLogo");
  
  // Reset logo animation state
  logoEl.className = "";
  void logoEl.offsetWidth; // Trigger reflow to restart animations

  if (cellData.isTarget) {
    state.hits++;
    comboStreak++;
    let points = 10;
    
    if (comboStreak >= 5) { 
        points = 20; 
        playCombo(); 
        showCombo("🔥 Combo x" + comboStreak + "!");
        
        const rect = cellEl.getBoundingClientRect();
        createParticles(rect.left + rect.width / 2, rect.top + rect.height / 2);
        
        // Super bounce for combos
        logoEl.classList.add("logo-combo"); 
    }
    else {
        playCorrect();
        // Happy bounce for regular correct taps
        logoEl.classList.add("logo-happy");
    }
    
    state.score += points;
    state.reactionTimes.push(rt);
    state.remainingTargets--;
    cellEl.classList.add("correct-hit");
    cellEl.style.opacity = "0.15";
    feedback.textContent = comboStreak >= 5 ? `Correct! 🔥 x${comboStreak}` : "Correct!";
    feedback.className = "correct";
    state.perfWindow.push({ correct: true, rt });
    
  } else {
    state.wrongTaps++;
    comboStreak = 0;
    
    // Shake animation for wrong taps
    logoEl.classList.add("logo-wrong");
    
    state.score = Math.max(0, state.score - 5);
    cellEl.classList.add("wrong-hit");
    cellEl.style.opacity = "0.15";
    feedback.textContent = "Oops, wrong shape!";
    feedback.className = "wrong";
    playWrong();
    state.perfWindow.push({ correct: false, rt: null });
  }
  
  document.getElementById("hudScore").textContent = state.score;
  adjustDifficultyIfNeeded(document.getElementById("hudDifficulty"));

  if (state.remainingTargets <= 0) {
    clearInterval(state.timerInterval);
    setTimeout(nextRound, 400);
  }
}

function startRoundTimer() {
  state.countdownVal = Math.round(state.cfg.roundTime);
  document.getElementById("hudTime").textContent = state.countdownVal;
  if (state.timerInterval) clearInterval(state.timerInterval);
  state.timerInterval = setInterval(() => {
    state.countdownVal--;
    document.getElementById("hudTime").textContent = Math.max(0, state.countdownVal);
    if (state.countdownVal <= 2 && state.countdownVal > 0) {
      timeWrapper.classList.add("time-low");
      playTick();
    }
    if (state.countdownVal <= 0) {
      clearInterval(state.timerInterval);
      state.misses += state.remainingTargets;
      for (let i = 0; i < state.remainingTargets; i++) state.perfWindow.push({ correct: false, rt: null });
      adjustDifficultyIfNeeded(document.getElementById("hudDifficulty"));
      nextRound();
    }
  }, 1000);
}

function endSelectiveGame() {
  progressBar.style.width = "100%";
  checkMilestone(state.totalRounds);

  const totalAttempts = state.totalTargets;
  const accuracy = totalAttempts > 0 ? Math.round((state.hits / totalAttempts) * 100) : 0;
  const avgRT = state.reactionTimes.length
    ? Math.round(state.reactionTimes.reduce((a,b)=>a+b,0) / state.reactionTimes.length)
    : 0;

  finalizeSession({
    mode: "Selective", level: state.levelName, score: state.score,
    accuracy, avgRT, missed: state.misses + state.wrongTaps,
    startDifficulty: state.startDifficulty, finalDifficulty: state.difficulty
  });
}

function startSustainedGame(levelName) {
  const target = { shape: SHAPES[Math.floor(Math.random() * SHAPES.length)], color: COLORS[Math.floor(Math.random() * COLORS.length)] };

  sustainedState = {
    levelName, target,
    difficulty: START_DIFFICULTY[levelName],
    startDifficulty: START_DIFFICULTY[levelName],
    trial: 0, totalTrials: 40, hits: 0, omissions: 0, falseAlarms: 0,
    reactionTimes: [], score: 0, currentIsTarget: false, stimulusShownAt: 0,
    responded: false, timers: [], perfWindow: []
  };

  document.getElementById("sHudDifficulty").textContent = sustainedState.difficulty;
  document.getElementById("sHudTotalTrials").textContent = sustainedState.totalTrials;
  document.getElementById("sHudTrial").textContent = "0";
  document.getElementById("sHudScore").textContent = "0";
  sustainedProgressBar.style.width = "0%";

  sustainedRule.innerHTML = `Tap the button ONLY when you see a <b>${target.shape}</b> in <b style="color:${target.color}">${colorName(target.color)}</b>`;

  showScreen(sustainedScreen);
  setTimeout(() => runSustainedTrial(), 1200);
}

function runSustainedTrial() {
  sustainedState.trial++;
  if (sustainedState.trial > sustainedState.totalTrials) { endSustainedGame(); return; }

  document.getElementById("sHudTrial").textContent = sustainedState.trial;
  sustainedProgressBar.style.width = Math.round((sustainedState.trial - 1) / sustainedState.totalTrials * 100) + "%";

  const cfg = sustainedParamsFromDifficulty(sustainedState.difficulty);
  sustainedState.cfg = cfg;

  const isTarget = Math.random() < cfg.targetRatio;
  sustainedState.currentIsTarget = isTarget;
  sustainedState.responded = false;

  let shape, color;
  if (isTarget) {
    shape = sustainedState.target.shape;
    color = sustainedState.target.color;
  } else if (cfg.nearMiss && Math.random() < 0.5) {
    if (Math.random() < 0.5) {
      shape = sustainedState.target.shape;
      do { color = COLORS[Math.floor(Math.random() * COLORS.length)]; } while (color === sustainedState.target.color);
    } else {
      color = sustainedState.target.color;
      do { shape = SHAPES[Math.floor(Math.random() * SHAPES.length)]; } while (shape === sustainedState.target.shape);
    }
  } else {
    do {
      shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
      color = COLORS[Math.floor(Math.random() * COLORS.length)];
    } while (shape === sustainedState.target.shape && color === sustainedState.target.color);
  }

  sustainedShapeWrap.innerHTML = "";
  sustainedShapeWrap.classList.remove("animate-in");
  const shapeEl = renderShapeEl(shape, color, 90);
  sustainedShapeWrap.appendChild(shapeEl);
  void sustainedShapeWrap.offsetWidth;
  sustainedShapeWrap.classList.add("animate-in");

  sustainedFeedback.textContent = "";
  sustainedFeedback.className = "";
  sustainedState.stimulusShownAt = performance.now();

  const hideTimer = setTimeout(() => {
    sustainedShapeWrap.innerHTML = "";
    const gap = cfg.minGap + Math.random() * (cfg.maxGap - cfg.minGap);
    const evalTimer = setTimeout(() => {
      if (sustainedState.currentIsTarget && !sustainedState.responded) {
        sustainedState.omissions++;
        sustainedFeedback.textContent = "Missed it!";
        sustainedFeedback.className = "wrong";
        playWrong();
        sustainedState.perfWindow.push({ correct: false, rt: null });
        adjustSustainedDifficulty();
      }
      runSustainedTrial();
    }, gap);
    sustainedState.timers.push(evalTimer);
  }, cfg.displayDuration);
  sustainedState.timers.push(hideTimer);
}

function adjustSustainedDifficulty() {
  const direction = evaluateWindow(sustainedState.perfWindow);
  if (direction !== 0) {
    const old = sustainedState.difficulty;
    sustainedState.difficulty = Math.max(1, Math.min(10, sustainedState.difficulty + direction));
    if (sustainedState.difficulty !== old) {
      showDifficultyPopup(direction);
      document.getElementById("sHudDifficulty").textContent = sustainedState.difficulty;
    }
    sustainedState.perfWindow = [];
  }
}

tapTargetBtn.addEventListener("click", () => {
  if (!sustainedScreen.classList.contains("active")) return;
  if (sustainedState.responded) return;
  sustainedState.responded = true;
  const rt = performance.now() - sustainedState.stimulusShownAt;

  if (sustainedState.currentIsTarget) {
    sustainedState.hits++;
    sustainedState.reactionTimes.push(rt);
    sustainedState.score += 10;
    sustainedFeedback.textContent = "Correct! ✅";
    sustainedFeedback.className = "correct";
    playCorrect();
    sustainedState.perfWindow.push({ correct: true, rt });
  } else {
    sustainedState.falseAlarms++;
    sustainedState.score = Math.max(0, sustainedState.score - 8);
    sustainedFeedback.textContent = "Not the target! ❌";
    sustainedFeedback.className = "wrong";
    playWrong();
    sustainedState.perfWindow.push({ correct: false, rt: null });
  }
  document.getElementById("sHudScore").textContent = sustainedState.score;
  adjustSustainedDifficulty();
});

function endSustainedGame() {
  sustainedProgressBar.style.width = "100%";
  const targetTrialsApprox = Math.round(sustainedState.totalTrials * 0.25);
  const accuracy = targetTrialsApprox > 0
    ? Math.round((sustainedState.hits / targetTrialsApprox) * 100)
    : 0;
  const avgRT = sustainedState.reactionTimes.length
    ? Math.round(sustainedState.reactionTimes.reduce((a,b)=>a+b,0) / sustainedState.reactionTimes.length)
    : 0;

  finalizeSession({
    mode: "Sustained", level: sustainedState.levelName, score: sustainedState.score,
    accuracy: Math.min(100, accuracy), avgRT,
    missed: sustainedState.omissions + sustainedState.falseAlarms,
    startDifficulty: sustainedState.startDifficulty, finalDifficulty: sustainedState.difficulty
  });
}

function finalizeSession(result) {
  document.getElementById("statScore").textContent = result.score;
  document.getElementById("statAccuracy").textContent = result.accuracy + "%";
  document.getElementById("statAvgRT").textContent = result.avgRT + "ms";
  document.getElementById("statFinalDifficulty").textContent = result.finalDifficulty + "/10";

  let starCount = 1;
  let verdict;
  const grew = result.finalDifficulty > result.startDifficulty;
  if (result.accuracy >= 85 && result.avgRT < 1500 && result.avgRT > 0) {
    verdict = grew
      ? "🌟 Excellent focus! You leveled up the difficulty as you played."
      : "🌟 Excellent focus! Your attention control is sharp.";
    starCount = 3;
  } else if (result.accuracy >= 60) {
    verdict = "👍 Good effort! Keep practicing to boost speed and accuracy.";
    starCount = 2;
  } else {
    verdict = "💡 Keep training — attention improves with regular practice!";
    starCount = 1;
  }
  document.getElementById("attentionVerdict").textContent = verdict;
  renderStars(starCount);
  playGameEnd();

  saveSessionToHistory(result);
  showScreen(endScreen);
}

function renderStars(count) {
  endStars.innerHTML = "";
  for (let i = 0; i < 3; i++) {
    const s = document.createElement("span");
    s.textContent = "⭐";
    if (i < count) {
      s.classList.add("lit");
      s.style.animationDelay = (i * 150) + "ms";
    }
    endStars.appendChild(s);
  }
}

function getHistory() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch (e) { return []; }
}

function saveSessionToHistory(result) {
  const history = getHistory();
  history.push({
    date: new Date().toISOString(),
    mode: result.mode,
    level: result.level,
    score: result.score,
    accuracy: result.accuracy,
    avgRT: result.avgRT,
    missed: result.missed,
    startDifficulty: result.startDifficulty,
    finalDifficulty: result.finalDifficulty
  });
  while (history.length > 100) history.shift();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

function renderProgressScreen() {
  const history = getHistory();
  const summary = document.getElementById("progressSummary");
  const tableWrap = document.getElementById("historyTableWrap");
  const canvas = document.getElementById("progressChart");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (history.length === 0) {
    summary.textContent = "No sessions yet — play a round to start tracking your progress!";
    tableWrap.innerHTML = "";
    showScreen(progressScreen);
    return;
  }

  const recent = history.slice(-14);
  const firstAcc = recent[0].accuracy;
  const lastAcc = recent[recent.length - 1].accuracy;
  const trend = lastAcc - firstAcc;
  const avgFinalDiff = Math.round(recent.reduce((a,b) => a + (b.finalDifficulty || 0), 0) / recent.length);
  const trendText = trend > 0
    ? `📈 Improved by ${trend}% accuracy over ${recent.length} sessions! Avg difficulty reached: ${avgFinalDiff}/10`
    : trend < 0
    ? `📉 Accuracy dipped ${Math.abs(trend)}% recently — keep practicing! Avg difficulty: ${avgFinalDiff}/10`
    : `Steady performance across ${recent.length} sessions. Avg difficulty: ${avgFinalDiff}/10`;
  summary.textContent = trendText;

  drawLineChart(ctx, canvas.width, canvas.height, recent);

  let rows = history.slice(-15).reverse().map(h => {
    const d = new Date(h.date);
    const dateStr = d.toLocaleDateString() + " " + d.toLocaleTimeString([], {hour: "2-digit", minute:"2-digit"});
    return `<tr>
      <td>${dateStr}</td><td>${h.mode}</td><td>${h.score}</td>
      <td>${h.accuracy}%</td><td>${h.avgRT}ms</td><td>${h.startDifficulty}→${h.finalDifficulty}</td>
    </tr>`;
  }).join("");

  tableWrap.innerHTML = `
    <table class="history-table">
      <thead><tr><th>Date</th><th>Mode</th><th>Score</th><th>Accuracy</th><th>Avg RT</th><th>Difficulty</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>`;

  showScreen(progressScreen);
}

function drawLineChart(ctx, w, h, data) {
  const padding = 30;
  const chartW = w - padding * 2;
  const chartH = h - padding * 2;

  ctx.strokeStyle = "rgba(255,255,255,0.15)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(padding, padding);
  ctx.lineTo(padding, h - padding);
  ctx.lineTo(w - padding, h - padding);
  ctx.stroke();

  ctx.fillStyle = "#94a3b8";
  ctx.font = "11px Arial";
  ctx.fillText("100%", 2, padding + 4);
  ctx.fillText("0%", 10, h - padding + 4);

  if (data.length < 2) {
    ctx.fillStyle = "#facc15";
    data.forEach((d, i) => {
      const x = padding + (chartW / Math.max(1, data.length - 1)) * i;
      const y = padding + chartH - (d.accuracy / 100) * chartH;
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
    });
    return;
  }

  ctx.strokeStyle = "#facc15";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  data.forEach((d, i) => {
    const x = padding + (chartW / (data.length - 1)) * i;
    const y = padding + chartH - (d.accuracy / 100) * chartH;
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  });
  ctx.stroke();

  ctx.fillStyle = "#facc15";
  data.forEach((d, i) => {
    const x = padding + (chartW / (data.length - 1)) * i;
    const y = padding + chartH - (d.accuracy / 100) * chartH;
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.fillStyle = "#cbd5e1";
  ctx.font = "10px Arial";
  ctx.fillText("Accuracy % trend (last " + data.length + " sessions)", padding, 14);
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}