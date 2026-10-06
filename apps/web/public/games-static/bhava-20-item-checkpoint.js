/*
  Medhā 20-item Progress Check
  Load this file AFTER bcs-lite-v3.html's existing script.

  Required content feed:
  window.BHAVA_GAME_BANK = [
    {
      id: 'unique-item-id', gameId: 'exact-source-game-id', gameName: 'Exact game name',
      area: 'logic', skill: 'pattern-recognition', ageMin: 8, ageMax: 17,
      difficulty: 1, prompt: '...', options: ['...','...','...','...'],
      answer: '...', explanation: '...'
    }
  ];

  Add approved, source-mapped items only. Do not label newly written generic items as
  belonging to a game until a curriculum owner has approved that mapping.
*/
(function () {
  'use strict';

  const TOTAL_ITEMS = 20;
  const COOLDOWN_ASSESSMENTS = 3;
  const AREAS = ['logic', 'language', 'numeracy', 'attention', 'real-world'];
  const BLUEPRINT = {
    logic: 4, language: 3, numeracy: 3, attention: 3, 'real-world': 7
  };
  const areaLabels = {
    logic: 'Game Logic & Systems', language: 'Language Concepts', numeracy: 'Numeracy Concepts',
    attention: 'Applied Game Knowledge', 'real-world': 'Real-world Game Knowledge'
  };
  const sourceAliases = {
    'secret-of-silicon': { gameId: 'secret-of-silicon-game', gameName: 'Chip Detective' },
    'chip-detective': { gameId: 'secret-of-silicon-game', gameName: 'Chip Detective' },
    'device-engineer': { gameId: 'bhava-build-device-engineer', gameName: 'Device Engineer' },
    'build-cycles': { gameId: 'bhava-tech-build-your-bike', gameName: 'Build Cycles' },
    'build-your-bike': { gameId: 'bhava-tech-build-your-bike', gameName: 'Build Cycles' },
    'bike-builder': { gameId: 'bhava-tech-build-your-bike', gameName: 'Build Cycles' },
    'rocket-engineer': { gameId: 'rocket-build-engineer', gameName: 'Rocket Engineer' },
    'space-academy': { gameId: 'bhava-space-academy', gameName: 'Bhava Space Academy' },
    'drone-engineer': { gameId: 'drone-build-engineer', gameName: 'Drone Engineer' },
    'car-designer': { gameId: 'build-your-car', gameName: 'Car Designer' },
    'know-google-lab': { gameId: 'google-search-lab-deep-v2', gameName: 'Know Google Lab' },
    'focus-master': { gameId: 'focus-under-distraction', gameName: 'Focus Master' },
    'fin-smart': { gameId: 'finlife-india-quest-enhanced', gameName: 'Fin Smart' }
  };
  const itemSourceAliases = {
    'elec-01': 'secret-of-silicon', 'elec-02': 'secret-of-silicon',
    'elec-03': 'device-engineer', 'elec-04': 'device-engineer', 'elec-05': 'device-engineer',
    'elec-06': 'space-academy', 'elec-07': 'device-engineer', 'elec-08': 'device-engineer',
    'elec-09': 'device-engineer', 'elec-10': 'space-academy'
  };
  const registeredGameIds = new Set([
    'secret-of-silicon-game', 'bhava-build-device-engineer', 'build-your-car',
    'rocket-build-engineer', 'bhava-space-academy', 'drone-build-engineer',
    'plane-builder', 'bhava-tech-build-your-bike', 'google-search-lab-deep-v2',
    'focus-under-distraction', 'finlife-india-quest-enhanced', 'grammar-galaxy',
    'planet-guardians'
  ]);

  let session = { items: [], index: 0, correct: 0, answers: [], startedAt: 0, answered: false };

  function shuffle(list) {
    const result = list.slice();
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  function getStudentKey() {
    const s = window.BCS && BCS.student;
    return s ? [s.schoolid || s.school || 'local', s.rollno || s.name || 'student'].join(':').toLowerCase() : 'anonymous';
  }

  function historyKey() { return 'bhava-checkpoint-history:' + getStudentKey(); }
  function loadHistory() {
    try { return JSON.parse(localStorage.getItem(historyKey())) || []; } catch (_) { return []; }
  }
  function saveHistory(items) {
    const prior = loadHistory();
    prior.push(items.map(item => item.id));
    localStorage.setItem(historyKey(), JSON.stringify(prior.slice(-COOLDOWN_ASSESSMENTS)));
  }

  function bank() {
    const items = Array.isArray(window.BHAVA_GAME_BANK) ? window.BHAVA_GAME_BANK : [];
    return items.map(item => {
      if (!item) return item;
      const alias = sourceAliases[itemSourceAliases[item.id] || item.gameId];
      return alias ? { ...item, ...alias } : item;
    }).filter(item =>
      item && item.id && item.gameId && item.gameName && AREAS.includes(item.area) &&
      item.skill && Number.isFinite(item.difficulty) && item.prompt &&
      Array.isArray(item.options) && item.options.length >= 3 && item.options.includes(item.answer)
    );
  }

  function selectItems() {
    const items = bank();
    const unmappedSources = items.filter(item => !registeredGameIds.has(item.gameId));
    if (unmappedSources.length) {
      throw new Error('Some questions do not map to registered Medhā games: ' + unmappedSources.map(item => item.id).join(', '));
    }
    const age = (window.BCS && BCS.student && BCS.student.age) || 12;
    const usedIds = new Set();
    const usedGames = new Set();
    const selected = [];
    const targetDifficulty = age <= 10 ? 1.8 : 2.5;
    const recent = new Set(loadHistory().flat());
    const agePools = Object.fromEntries(AREAS.map(area => [area, items.filter(item =>
      item.area === area && age >= item.ageMin && age <= item.ageMax
    )]));
    const areaCounts = Object.fromEntries(AREAS.map(area => [area, 0]));

    while (selected.length < TOTAL_ITEMS) {
      const freshAreas = AREAS.filter(area => agePools[area].some(item => !usedIds.has(item.id) && !recent.has(item.id)));
      const preferFresh = freshAreas.length > 0;
      const availableAreas = preferFresh ? freshAreas : AREAS.filter(area => agePools[area].some(item => !usedIds.has(item.id)));
      if (!availableAreas.length) break;
      const activeWeight = availableAreas.reduce((sum, area) => sum + BLUEPRINT[area], 0);
      const area = availableAreas.reduce((best, candidate) => {
        const candidateDeficit = BLUEPRINT[candidate] / activeWeight * (selected.length + 1) - areaCounts[candidate];
        const bestDeficit = BLUEPRINT[best] / activeWeight * (selected.length + 1) - areaCounts[best];
        return candidateDeficit > bestDeficit ? candidate : best;
      });
      const candidates = agePools[area].filter(item => !usedIds.has(item.id) && (!preferFresh || !recent.has(item.id)));
      const distinctGameCandidates = candidates.filter(item => !usedGames.has(item.gameId));
      const pool = shuffle(distinctGameCandidates.length ? distinctGameCandidates : candidates);
      pool.sort((a, b) => Math.abs(a.difficulty - targetDifficulty) - Math.abs(b.difficulty - targetDifficulty));
      const item = pool[0];
      selected.push(item);
      usedIds.add(item.id);
      usedGames.add(item.gameId);
      areaCounts[area]++;
    }
    if (selected.length !== TOTAL_ITEMS) {
      throw new Error('There are not enough age-appropriate questions in the game bank for a complete 20-question check.');
    }
    return shuffle(selected);
  }

  function setText(selector, text) {
    const el = document.querySelector(selector); if (el) el.textContent = text;
  }

  function startCheckpoint() {
    try { session = { items: selectItems(), index: 0, correct: 0, answers: [], startedAt: Date.now(), answered: false }; }
    catch (error) { alert(error.message); return; }
    if (typeof window.showScreen === 'function') showScreen('screen-logic');
    setText('#screen-logic .logo-text h1', 'Game Knowledge Check');
    setText('#screen-logic .logo-text p', 'Answer 20 questions based on topics from Medhā games');
    const label = document.querySelector('.logic-progress');
    if (label) label.innerHTML = 'Question <span id="logic-q-num">1</span> of ' + TOTAL_ITEMS;
    render();
  }

  function render() {
    const item = session.items[session.index];
    session.answered = false;
    setText('#logic-q-num', String(session.index + 1));
    setText('#logic-cat-badge', areaLabels[item.area]);
    setText('#logic-source', 'Source game: ' + item.gameName);
    setText('#logic-score-badge', session.correct + ' / ' + session.index + ' correct');
    const bar = document.getElementById('logic-bar'); if (bar) bar.style.width = (session.index / TOTAL_ITEMS * 100) + '%';
    setText('#logic-q-text', item.prompt);
    const expl = document.getElementById('logic-expl'); if (expl) expl.style.display = 'none';
    const next = document.getElementById('logic-next-btn'); if (next) { next.classList.add('hidden'); next.textContent = session.index === TOTAL_ITEMS - 1 ? 'Finish Check' : 'Next Question'; }
    const options = document.getElementById('logic-options');
    options.innerHTML = '';
    shuffle(item.options).forEach(option => {
      const button = document.createElement('button');
      button.className = 'logic-opt-btn'; button.textContent = option;
      button.addEventListener('click', () => answer(option, button, options));
      options.appendChild(button);
    });
  }

  function answer(choice, button, options) {
    if (session.answered) return;
    session.answered = true;
    const item = session.items[session.index];
    const correct = choice === item.answer;
    if (correct) { session.correct++; button.classList.add('correct'); if (window.flashFeedback) flashFeedback(true); }
    else { button.classList.add('wrong'); if (window.flashFeedback) flashFeedback(false); }
    options.querySelectorAll('button').forEach(btn => {
      btn.style.pointerEvents = 'none';
      if (btn.textContent === item.answer) btn.classList.add('correct');
    });
    session.answers.push({ itemId: item.id, gameId: item.gameId, gameName: item.gameName, area: item.area, skill: item.skill, difficulty: item.difficulty, correct, responseMs: Date.now() - session.startedAt });
    const expl = document.getElementById('logic-expl');
    if (expl) { expl.textContent = item.explanation || 'Response recorded.'; expl.style.display = 'block'; }
    document.getElementById('logic-next-btn').classList.remove('hidden');
  }

  function next() {
    session.index++;
    if (session.index < TOTAL_ITEMS) render(); else finish();
  }

  function finish() {
    saveHistory(session.items);
    const byArea = {};
    AREAS.forEach(area => { byArea[area] = { correct: 0, total: 0 }; });
    session.answers.forEach(answer => { byArea[answer.area].total++; if (answer.correct) byArea[answer.area].correct++; });
    const score = Math.round(session.correct / TOTAL_ITEMS * 20);
    if (window.BCS) {
      BCS.scores.logic = score;
      BCS.rawMetrics.progressCheck = {
        version: 'checkpoint-v1', questionCount: TOTAL_ITEMS, correct: session.correct,
        scoreOutOf20: score, elapsedSeconds: Math.round((Date.now() - session.startedAt) / 1000),
        items: session.answers, byArea
      };
    }
    const bar = document.getElementById('logic-bar'); if (bar) bar.style.width = '100%';
    if (typeof window.showCountdown === 'function' && typeof window.startObservationModule === 'function') {
      showCountdown('Module 5: Observation — Find 3 differences!', startObservationModule);
    } else if (typeof window.showResults === 'function') showResults();
  }

  // Overrides the previous five-question Logic module and its HTML Next button handler.
  window.startLogicModule = startCheckpoint;
  window.nextLogicQuestion = next;

  // Optional diagnostic for administrators.
  window.BhavaCheckpoint = { selectItems, bank, totalItems: TOTAL_ITEMS, blueprint: BLUEPRINT };
})();
