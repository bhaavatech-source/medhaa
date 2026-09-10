import { TECHNOLOGIES } from './technologies.js';

const GOAL_KEYWORDS = {
  fly: ["movement"],
  flying: ["movement"],
  air: ["movement"],
  drive: ["movement"],
  move: ["movement"],
  swim: ["movement"],
  water: ["movement"],
  power: ["power"],
  energy: ["power"],
  battery: ["storage"],
  store: ["storage"],
  think: ["processing"],
  smart: ["processing", "intelligence"],
  compute: ["processing"],
  see: ["sensors"],
  detect: ["sensors"],
  sense: ["sensors"],
  camera: ["sensors"],
  talk: ["communication"],
  connect: ["communication"],
  signal: ["communication"]
};

export function matchGoalToParts(goalText) {
  const text = goalText.toLowerCase();
  const matchedCategories = new Set();

  Object.keys(GOAL_KEYWORDS).forEach(keyword => {
    if (text.includes(keyword)) {
      GOAL_KEYWORDS[keyword].forEach(cat => matchedCategories.add(cat));
    }
  });

  if (matchedCategories.size === 0) {
    return { matched: false, parts: [], categories: [] };
  }

  const suggestedParts = TECHNOLOGIES.filter(tech =>
    matchedCategories.has(tech.category)
  );

  return {
    matched: true,
    categories: Array.from(matchedCategories),
    parts: suggestedParts.slice(0, 6)
  };
}