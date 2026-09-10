// quizGenerator.js
// Auto-generates quiz question banks directly from technologies.js
// No manual question writing needed — everything is derived from existing data.

import { TECHNOLOGIES } from './technologies.js';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickDistractors(pool, correctValue, count, keyExtractor) {
  const others = pool
    .map(keyExtractor)
    .filter(v => v && v !== correctValue);
  return shuffle([...new Set(others)]).slice(0, count);
}

// ---------- LEVEL CONFIG ----------
const LEVEL_CONFIG = {
  easy:   { count: 30, field: 'workingPrinciple', label: 'Explorer',
            question: t => `How does ${t.name} actually work?` },
  medium: { count: 25, field: 'realWorldUses', label: 'Engineer',
            question: t => `Where would you most likely find ${t.name} being used?` },
  hard:   { count: 20, field: 'limitations', label: 'Inventor',
            question: t => `What is a real limitation of ${t.name} today?` },
};

// Builds the FULL pool of possible questions for a level (usually larger than needed)
function buildPool(levelKey) {
  const cfg = LEVEL_CONFIG[levelKey];
  const pool = [];

  TECHNOLOGIES.forEach(tech => {
    const fieldVal = tech[cfg.field];
    if (!fieldVal) return;

    // realWorldUses/limitations are arrays -> one question per array item
    if (Array.isArray(fieldVal)) {
      fieldVal.forEach(correctAnswer => {
        const distractors = pickDistractors(
          TECHNOLOGIES.filter(t => t.id !== tech.id),
          correctAnswer, 3,
          t => Array.isArray(t[cfg.field]) ? t[cfg.field][0] : t[cfg.field]
        );
        if (distractors.length === 3) {
          pool.push({
            id: `${levelKey}_${tech.id}_${correctAnswer}`.replace(/\s+/g, '_'),
            techId: tech.id,
            level: levelKey,
            question: cfg.question(tech),
            correctAnswer,
            options: shuffle([correctAnswer, ...distractors]),
          });
        }
      });
    } else {
      // workingPrinciple is a single string -> one question per tech
      const distractors = pickDistractors(
        TECHNOLOGIES.filter(t => t.id !== tech.id),
        fieldVal, 3,
        t => t[cfg.field]
      );
      if (distractors.length === 3) {
        pool.push({
          id: `${levelKey}_${tech.id}`,
          techId: tech.id,
          level: levelKey,
          question: cfg.question(tech),
          correctAnswer: fieldVal,
          options: shuffle([fieldVal, ...distractors]),
        });
      }
    }
  });

  return shuffle(pool);
}

// ---------- SESSION-AWARE SELECTION ----------
// Tracks which question IDs have already been shown THIS session (per level).
// Resets automatically when the browser session ends (sessionStorage).
function getSeenIds(levelKey) {
  const raw = sessionStorage.getItem(`quiz_seen_${levelKey}`);
  return raw ? new Set(JSON.parse(raw)) : new Set();
}

function markSeen(levelKey, ids) {
  const seen = getSeenIds(levelKey);
  ids.forEach(id => seen.add(id));
  sessionStorage.setItem(`quiz_seen_${levelKey}`, JSON.stringify([...seen]));
}

// Main export: get a fresh, unique 20/25/30-question quiz for a level
export function generateQuiz(levelKey) {
  const cfg = LEVEL_CONFIG[levelKey];
  const fullPool = buildPool(levelKey);
  const seen = getSeenIds(levelKey);

  let available = fullPool.filter(q => !seen.has(q.id));

  // If pool is exhausted (all questions seen this session), reset and reuse
  if (available.length < cfg.count) {
    sessionStorage.removeItem(`quiz_seen_${levelKey}`);
    available = fullPool;
  }

  const selected = shuffle(available).slice(0, cfg.count).map(q => ({
    ...q,
    options: shuffle(q.options), // re-shuffle options every draw, even on repeat
  }));

  markSeen(levelKey, selected.map(q => q.id));
  return selected;
}

export const LEVELS = LEVEL_CONFIG;
