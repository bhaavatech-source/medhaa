/*
  Load AFTER bhava-verified-starter-game-bank-2.js
  and BEFORE bhava-20-item-checkpoint.js.
*/
(function () {
  'use strict';

  // The master bank currently uses BHAVAGAMEBANK, while the checkpoint reads
  // BHAVA_GAME_BANK. Make both names point to the same one source of truth.
  if (!Array.isArray(window.BHAVA_GAME_BANK) && Array.isArray(window.BHAVAGAMEBANK)) {
    window.BHAVA_GAME_BANK = window.BHAVAGAMEBANK;
  }

  // The checkpoint supports these six scoring areas. Convert the bank's
  // unsupported "focus" label into the supported Attention area.
  if (Array.isArray(window.BHAVA_GAME_BANK)) {
    window.BHAVA_GAME_BANK.forEach(function (item) {
      if (item && item.area === 'focus') item.area = 'attention';
    });
  }

  function report(age) {
    const all = Array.isArray(window.BHAVA_GAME_BANK) ? window.BHAVA_GAME_BANK : [];
    const allowed = ['logic', 'language', 'numeracy', 'memory', 'attention', 'real-world'];
    const valid = all.filter(function (q) {
      return q && q.id && q.gameId && q.gameName && allowed.includes(q.area) &&
        q.skill && Number.isFinite(q.difficulty) && q.prompt &&
        Array.isArray(q.options) && q.options.includes(q.answer);
    });
    const usable = valid.filter(function (q) { return age >= q.ageMin && age <= q.ageMax; });
    const byArea = {};
    allowed.forEach(function (area) { byArea[area] = usable.filter(function (q) { return q.area === area; }).length; });
    return { total: all.length, valid: valid.length, usable: usable.length, byArea: byArea };
  }

  window.BhavaGameBankCheck = report;
  console.info('Bhāva game-bank compatibility fix loaded.', report(12));
})();
