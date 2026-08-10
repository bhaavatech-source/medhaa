// gamesCatalog.ts
// Additive content catalog — sourced from the Bhava Tech marketing site copy.
// Maps each game slug to a rich display card (title, tagline, secondary skill,
// age band, and a themed color). Does NOT touch GamesGrid.tsx, GameCard.tsx,
// or any backend file. Pure presentation data for the new Discovery UI.

export interface CatalogEntry {
  slug: string;
  title: string;
  tagline: string;
  secondary: string;
  ageMin: number;
  ageMax: number;
  color: string;
  domain: string;
  emoji: string;
}

export const GAMES_CATALOG: Record<string, CatalogEntry> = {
  'focus-under-distraction': {
    slug: 'focus-under-distraction', title: 'Focus Master',
    tagline: 'Hold your aim under pressure', secondary: 'Self-Control',
    ageMin: 5, ageMax: 17, color: '#f0a13c', domain: 'cognitive-focus',
    emoji: '🎯',
  },
  'iq-test-level-3': {
    slug: 'iq-test-level-3', title: 'IQ Test',
    tagline: 'How sharp is your reasoning today?', secondary: 'Logic',
    ageMin: 11, ageMax: 17, color: '#8e6bd8', domain: 'cognitive-logic',
    emoji: '🧠',
  },
  'dharana-arena': {
    slug: 'dharana-arena', title: 'Dharana Arena',
    tagline: 'A puzzle a day sharpens the mind', secondary: 'Logic',
    ageMin: 5, ageMax: 17, color: '#f0a13c', domain: 'cognitive-logic',
    emoji: '🧩',
  },
  'bhava-math-grid': {
    slug: 'bhava-math-grid', title: 'Apt Number',
    tagline: 'Numbers that train your instincts', secondary: 'Quick Thinking',
    ageMin: 11, ageMax: 17, color: '#8e6bd8', domain: 'cognitive-math',
    emoji: '🔢',
  },
  'focus-flash': {
    slug: 'focus-flash', title: 'Focus Flash',
    tagline: 'Catch it before it disappears', secondary: 'Attention Span',
    ageMin: 5, ageMax: 17, color: '#f0a13c', domain: 'cognitive-focus',
    emoji: '⚡',
  },
  'bhava-smriti': {
    slug: 'bhava-smriti', title: 'Bhava-smriti',
    tagline: 'Match, remember, win', secondary: 'Visual Memory',
    ageMin: 5, ageMax: 17, color: '#f0a13c', domain: 'cognitive-memory',
    emoji: '🃏',
  },
  'neuroflash-memory': {
    slug: 'neuroflash-memory', title: 'Flash Memory',
    tagline: 'Blink and remember', secondary: 'Recall Speed',
    ageMin: 5, ageMax: 17, color: '#f0a13c', domain: 'cognitive-memory',
    emoji: '💭',
  },
  'mental-rotation-game': {
    slug: 'mental-rotation-game', title: 'Mind Rotation',
    tagline: 'Can your brain rotate this?', secondary: 'Spatial Reasoning',
    ageMin: 11, ageMax: 13, color: '#8e6bd8', domain: 'cognitive-logic',
    emoji: '🔄',
  },
  'bhava-build-device-engineer': {
    slug: 'bhava-build-device-engineer', title: 'Device Engineer',
    tagline: 'Build a phone from scratch', secondary: 'Problem-Solving',
    ageMin: 11, ageMax: 13, color: '#8e6bd8', domain: 'stem-engineering',
    emoji: '📱',
  },
  'secret-of-silicon-game': {
    slug: 'secret-of-silicon-game', title: 'Chip Detective',
    tagline: "What's really inside a chip?", secondary: 'Curiosity',
    ageMin: 11, ageMax: 15, color: '#8e6bd8', domain: 'stem-engineering',
    emoji: '🔍',
  },
  'bhava-tech-build-your-bike': {
    slug: 'bhava-tech-build-your-bike', title: 'Build Cycles',
    tagline: 'Your first machine-building step', secondary: 'Mechanical Thinking',
    ageMin: 8, ageMax: 10, color: '#3fa7d6', domain: 'stem-engineering',
    emoji: '🚲',
  },
  'rocket-build-engineer': {
    slug: 'rocket-build-engineer', title: 'Rocket Engineer',
    tagline: 'Design. Launch. Explore.', secondary: 'Systems Thinking',
    ageMin: 14, ageMax: 17, color: '#2c3e6b', domain: 'stem-engineering',
    emoji: '🚀',
  },
  'bhava-space-academy': {
    slug: 'bhava-space-academy', title: 'Bhava Space Academy',
    tagline: 'Learn about the ISS', secondary: 'Astronaut Trainer',
    ageMin: 14, ageMax: 17, color: '#2c3e6b', domain: 'stem-engineering',
    emoji: '🛰️',
  },
  'drone-build-engineer': {
    slug: 'drone-build-engineer', title: 'Drone Engineer',
    tagline: 'Design and fly your own drone', secondary: 'Spatial Reasoning',
    ageMin: 14, ageMax: 17, color: '#2c3e6b', domain: 'stem-engineering',
    emoji: '🛸',
  },
  'build-your-car': {
    slug: 'build-your-car', title: 'Car Designer',
    tagline: 'Blueprint to the road', secondary: 'Creativity',
    ageMin: 11, ageMax: 17, color: '#8e6bd8', domain: 'stem-engineering',
    emoji: '🚗',
  },
  'plane-builder': {
    slug: 'plane-builder', title: 'Plane Builder',
    tagline: 'Blueprint to the skies', secondary: 'Precision Thinking',
    ageMin: 11, ageMax: 15, color: '#8e6bd8', domain: 'stem-engineering',
    emoji: '✈️',
  },
  'motorcycle-one-workshop': {
    slug: 'motorcycle-one-workshop', title: 'Bike Builder',
    tagline: 'Assemble, tune, ride', secondary: 'Mechanical Thinking',
    ageMin: 11, ageMax: 17, color: '#8e6bd8', domain: 'stem-engineering',
    emoji: '🏍️',
  },
  'nagarikx-enhanced': {
    slug: 'nagarikx-enhanced', title: 'Future Citizen',
    tagline: 'Small acts, bigger responsibility', secondary: 'Civic Sense',
    ageMin: 14, ageMax: 17, color: '#2c3e6b', domain: 'civics',
    emoji: '🏛️',
  },
  'soccomm-enhanced': {
    slug: 'soccomm-enhanced', title: 'Me & Society',
    tagline: 'Your voice, your community', secondary: 'Responsibility',
    ageMin: 11, ageMax: 17, color: '#8e6bd8', domain: 'civics',
    emoji: '🤝',
  },
  'good-habits': {
    slug: 'good-habits', title: 'Good Habits',
    tagline: 'Little routines, lasting discipline', secondary: 'Self-Monitoring',
    ageMin: 5, ageMax: 7, color: '#f0a13c', domain: 'emotional-intel',
    emoji: '🌱',
  },
  'calm-zone': {
    slug: 'calm-zone', title: 'Calm Zone',
    tagline: 'Breathe. Reset. Refocus.', secondary: 'Mindfulness',
    ageMin: 5, ageMax: 17, color: '#f0a13c', domain: 'emotional-intel',
    emoji: '🧘',
  },
  'life-strategist-starter': {
    slug: 'life-strategist-starter', title: 'Life Strategist',
    tagline: 'Choose wisely, live well', secondary: 'Focus',
    ageMin: 14, ageMax: 17, color: '#2c3e6b', domain: 'life-skills',
    emoji: '🎲',
  },
  'finlife-india-quest-enhanced': {
    slug: 'finlife-india-quest-enhanced', title: 'Fin Smart',
    tagline: 'Manage money like a pro', secondary: 'Decision-Making',
    ageMin: 14, ageMax: 17, color: '#2c3e6b', domain: 'finance',
    emoji: '💰',
  },
  'hidden-maths': {
    slug: 'hidden-maths', title: 'Hidden Maths',
    tagline: 'Maths is hiding all around you', secondary: 'Observation',
    ageMin: 14, ageMax: 17, color: '#2c3e6b', domain: 'cognitive-math',
    emoji: '🔎',
  },
  'intelligent-machines': {
    slug: 'intelligent-machines', title: 'Intelligent Machines',
    tagline: 'From humans to intelligent machines', secondary: 'Analytical Thinking',
    ageMin: 11, ageMax: 13, color: '#8e6bd8', domain: 'cognitive-math',
    emoji: '🤖',
  },
  'know-maths': {
    slug: 'know-maths', title: 'Know Maths',
    tagline: 'Understand all about Maths', secondary: 'Attention',
    ageMin: 14, ageMax: 17, color: '#2c3e6b', domain: 'cognitive-math',
    emoji: '📐',
  },
  'number-garden-quest': {
    slug: 'number-garden-quest', title: 'Number Garden',
    tagline: 'Grow your love for numbers', secondary: 'Focus',
    ageMin: 5, ageMax: 7, color: '#f0a13c', domain: 'cognitive-math',
    emoji: '🌻',
  },
  'percentile-game': {
    slug: 'percentile-game', title: 'Percentile',
    tagline: 'Where do you really stand?', secondary: 'Data Reasoning',
    ageMin: 11, ageMax: 17, color: '#8e6bd8', domain: 'cognitive-math',
    emoji: '📊',
  },
  'brain-of-all-machines': {
    slug: 'brain-of-all-machines', title: 'Brain of All Machines',
    tagline: 'The logic behind every machine', secondary: 'Attention',
    ageMin: 11, ageMax: 13, color: '#8e6bd8', domain: 'cognitive-math',
    emoji: '⚙️',
  },
};

export function getCatalogEntry(slug: string): CatalogEntry | null {
  return GAMES_CATALOG[slug] ?? null;
}