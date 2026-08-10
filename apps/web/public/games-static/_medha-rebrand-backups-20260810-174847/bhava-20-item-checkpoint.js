/*
  Bhava 20-item Progress Check
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
  const AREAS = ['logic', 'language', 'numeracy', 'memory', 'attention', 'real-world'];
  const BLUEPRINT = {
    logic: 4, language: 3, numeracy: 3, memory: 3, attention: 3, 'real-world': 4
  };
  const areaLabels = {
    logic: 'Logic & Reasoning', language: 'Language', numeracy: 'Numeracy & Spatial',
    memory: 'Memory', attention: 'Attention', 'real-world': 'Real-world Learning'
  };

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
    return items.filter(item =>
      item && item.id && item.gameId && item.gameName && AREAS.includes(item.area) &&
      item.skill && Number.isFinite(item.difficulty) && item.prompt &&
      Array.isArray(item.options) && item.options.length >= 3 && item.options.includes(item.answer)
    );
  }

  function eligible(items, area, usedIds, usedGames) {
    const age = (window.BCS && BCS.student && BCS.student.age) || 12;
    const recent = new Set(loadHistory().flat());
    const normal = items.filter(item => item.area === area && age >= item.ageMin && age <= item.ageMax && !usedIds.has(item.id) && !recent.has(item.id));
    const noGameRepeat = normal.filter(item => !usedGames.has(item.gameId));
    return noGameRepeat.length ? noGameRepeat : normal;
  }

  function selectItems() {
    const items = bank();
    const usedIds = new Set();
    const usedGames = new Set();
    const selected = [];
    const targetDifficulty = ((window.BCS && BCS.student && BCS.student.age) || 12) <= 10 ? 1.8 : 2.5;

    Object.entries(BLUEPRINT).forEach(([area, count]) => {
      let pool = eligible(items, area, usedIds, usedGames);
      pool = shuffle(pool).sort((a, b) => Math.abs(a.difficulty - targetDifficulty) - Math.abs(b.difficulty - targetDifficulty));
      for (const item of pool.slice(0, count)) {
        selected.push(item); usedIds.add(item.id); usedGames.add(item.gameId);
      }
    });

    // Fill any blueprint shortfall from other eligible areas while preserving unique item IDs.
    if (selected.length < TOTAL_ITEMS) {
      const remaining = shuffle(items.filter(item => {
        const age = (window.BCS && BCS.student && BCS.student.age) || 12;
        return age >= item.ageMin && age <= item.ageMax && !usedIds.has(item.id) && !new Set(loadHistory().flat()).has(item.id);
      }));
      remaining.forEach(item => {
        if (selected.length < TOTAL_ITEMS) { selected.push(item); usedIds.add(item.id); }
      });
    }
    if (selected.length !== TOTAL_ITEMS) {
      throw new Error('The approved game bank needs more age-appropriate, unused items. Each assessment requires 20 eligible unique questions.');
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
    setText('#screen-logic .logo-text h1', 'Bhāva Progress Check');
    setText('#screen-logic .logo-text p', 'Answer 20 questions from across your learning journey');
    const label = document.querySelector('.logic-progress');
    if (label) label.childNodes[0].nodeValue = 'Question ';
    render();
  }

  function render() {
    const item = session.items[session.index];
    session.answered = false;
    setText('#logic-q-num', String(session.index + 1));
    setText('#logic-cat-badge', areaLabels[item.area]);
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
