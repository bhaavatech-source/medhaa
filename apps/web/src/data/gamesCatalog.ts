// gamesCatalog.ts
// FINAL MERGED CATALOG — all 60 games across bhaavajaalam.com, verified
// against live source code in Rajeswarbhandaru/bhaavajaalam via GitHub
// (Aug 2026 revision, Phases 1-5). Replaces the original 28-entry file.
//
// Combines:
//   Phase 1 — Focus, Memory & IQ (12 games)
//   Phase 2 — STEM & Engineering (9 games)
//   Phase 3 — Life Skills, Civics & EQ (13 games)
//   Phase 4 — Maths, Logic & Science (17 games)
//   Phase 5 — Language, Arts & Career (9 games)
//
// OPEN ITEMS TO RESOLVE BEFORE SHIPPING:
// 1. "focus-under-distraction" marketing title is "Focus Master" but its
//    own in-game <title> says "Focus Under Distraction" — pick one.
// 2. "grammar-pro" (slug) actually displays "Daily English" in-game —
//    pick one name and use it consistently everywhere.
// 3. "percentile-game" could not be verified from source (not indexed by
//    repo code search) — description is a best-effort placeholder.
// 4. "know-maths" folder contains a stray "grammar" subfolder that looks
//    misplaced — check with your dev team.
// 5. "brain-of-all-machines" folder name has literal spaces on disk
//    ("Brain of All Machines") — recommend renaming to kebab-case to
//    avoid URL-encoding issues.
// 6. Five separate IQ/assessment games exist (IQ Test Level 3, MindScape
//    Pro, MindSpark IQ, Neuro Ascend IQ, Take Test, BCS Lite) — make sure
//    UI copy keeps them clearly distinguishable so users don't think
//    they're duplicates.

export interface CatalogEntry {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  secondary: string;
  skillsBuilt: string[];
  ageMin: number;
  ageMax: number;
  color: string;
  domain: string;
  kind?: 'game' | 'activity';   // ADD THIS LINE
  emoji: string;
}

export const GAMES_CATALOG: Record<string, CatalogEntry> = {
  // ───────────────────────── PHASE 1: FOCUS, MEMORY & IQ ─────────────────────────
  'focus-under-distraction': {
    slug: 'focus-under-distraction', title: 'Focus Master',
    tagline: 'Hold your aim under pressure',
    description: "A wave of look-alike shapes and colours floods the screen alongside one true target — your job is to tap only the real target and ignore everything else. Every wave adds more visual noise, both accuracy and reaction time are scored, and the game rewards calm, selective attention over frantic tapping. (In-game title: 'Focus Under Distraction' — the same skill surgeons, athletes, and exam-takers rely on.)",
    secondary: 'Self-Control', skillsBuilt: ['Selective Attention', 'Self-Control', 'Distraction Resistance'],
    ageMin: 12, ageMax: 17, color: '#dc2626', domain: 'cognitive-focus', emoji: '🎯',
  },
  'iq-test-level-3': {
    slug: 'iq-test-level-3', title: 'IQ Test',
    tagline: 'How sharp is your reasoning today?',
    description: "The hardest tier in Medhā's IQ suite — a senior-level, timed set of reasoning puzzles spanning verbal, numerical, and spatial logic. Answers are scored and converted into a percentile against age peers, with a personalised strengths-and-growth summary at the end (15–25 minutes, high difficulty).",
    secondary: 'Logic', skillsBuilt: ['Logical Reasoning', 'Mixed Cognitive Domains', 'Self-Awareness'],
    ageMin: 12, ageMax: 17, color: '#0f766e', domain: 'cognitive-logic', emoji: '🔬',
  },
  'dharana-arena': {
    slug: 'dharana-arena', title: 'Dhāraṇā Arena',
    tagline: 'Calm your mind, then sharpen your focus',
    description: "A holistic attention trainer that starts with a guided breathing exercise, then moves into real focus challenges: reading short passages under time pressure and picking out precise details from instructions, exactly like following exam rules or a lab safety sheet.",
    secondary: 'Concentration', skillsBuilt: ['Sustained Attention', 'Reading Comprehension', 'Mindfulness'],
    ageMin: 5, ageMax: 17, color: '#302b63', domain: 'cognitive-focus', emoji: '🧘',
  },
  'bhava-math-grid': {
    slug: 'bhava-math-grid', title: 'Apt Number',
    tagline: 'Numbers that train your instincts',
    description: "A grid-based number puzzle where you fill in digits so every row and column adds up to its target total, using each number only once. It's a gentle logic challenge with built-in checks and smart hints, rewarding both accuracy and speed.",
    secondary: 'Quick Thinking', skillsBuilt: ['Numerical Reasoning', 'Logical Deduction', 'Working Memory'],
    ageMin: 11, ageMax: 17, color: '#2fa36f', domain: 'cognitive-math', emoji: '🔢',
  },
  'focus-flash': {
    slug: 'focus-flash', title: 'Focus Flash',
    tagline: 'Catch it before it disappears',
    description: "A shape appears on screen and you must tap it before it vanishes — but only when it matches the current rule, so impulsively tapping everything costs you points. Rounds speed up and the rules shift, training rapid-but-selective attention.",
    secondary: 'Attention Span', skillsBuilt: ['Attention Span', 'Reaction Speed', 'Impulse Control'],
    ageMin: 5, ageMax: 17, color: '#f0a13c', domain: 'cognitive-focus', emoji: '⚡',
  },
  'neuroflash-memory': {
    slug: 'neuroflash-memory', title: 'Flash Memory',
    tagline: 'Blink and remember',
    description: "Watch a sequence of flashes or symbols play out, then reproduce it in the exact order using the on-screen grid — get it right and the sequence grows by one item. A direct workout for working-memory span and sequential recall.",
    secondary: 'Recall Speed', skillsBuilt: ['Working Memory Span', 'Sequential Recall', 'Auditory-Visual Integration'],
    ageMin: 7, ageMax: 17, color: '#7c3aed', domain: 'cognitive-memory', emoji: '⚡',
  },
  'bhava-smriti': {
    slug: 'bhava-smriti', title: 'Medhā-samṛti',
    tagline: 'Match, remember, win',
    description: "A classic card-flip memory match — tap two cards to reveal them, remember what you saw, and find every matching pair before you run out of moves. Grid size and time pressure scale up as visual memory improves.",
    secondary: 'Visual Memory', skillsBuilt: ['Visual Memory', 'Concentration', 'Pattern Recall'],
    ageMin: 5, ageMax: 17, color: '#f0a13c', domain: 'cognitive-memory', emoji: '🃏',
  },
  'memory-match-puzzle': {
    slug: 'memory-match-puzzle', title: 'Memory Match Puzzle',
    tagline: 'Flip, find, remember',
    description: "The foundational memory-match experience — flip picture cards two at a time and find every matching pair before time runs out. Bright and simple, built for early learners (ages 5+, easiest difficulty tier).",
    secondary: 'Visual Memory', skillsBuilt: ['Visual Memory', 'Focus', 'Pattern Recognition'],
    ageMin: 5, ageMax: 17, color: '#01696f', domain: 'cognitive-memory', emoji: '🃏',
  },
  'memory-match-ultimate': {
    slug: 'memory-match-ultimate', title: 'Memory Match Ultimate',
    tagline: 'The advanced memory challenge',
    description: "The harder sibling of Memory Match Puzzle — bigger grids, richer themes, and real time pressure push your visual memory further.",
    secondary: 'Visual Memory', skillsBuilt: ['Visual Memory', 'Speed Under Pressure', 'Focus'],
    ageMin: 5, ageMax: 17, color: '#0891b2', domain: 'cognitive-memory', emoji: '🏆',
  },
  'memory-zoo-puzzle': {
    slug: 'memory-zoo-puzzle', title: 'Memory Zoo Puzzle',
    tagline: 'Rescue every animal pair',
    description: "Animals peek out from behind zoo enclosure doors — tap two doors to see if their animals match, and free every pair to complete the zoo. The gentlest possible entry point into memory training for young children.",
    secondary: 'Working Memory', skillsBuilt: ['Working Memory', 'Visual Attention', 'Object Recognition'],
    ageMin: 5, ageMax: 8, color: '#16a34a', domain: 'cognitive-memory', emoji: '🦒',
  },
  'mental-rotation-game': {
    slug: 'mental-rotation-game', title: 'Mind Rotation',
    tagline: 'Can your brain rotate this?',
    description: "3D shapes spin on screen and you must mentally rotate them to decide if two shapes truly match or are cleverly-disguised mirror images — the same spatial-visualization skill engineers and surgeons rely on.",
    secondary: 'Spatial Reasoning', skillsBuilt: ['Spatial Reasoning', 'Visualization', 'Logical Deduction'],
    ageMin: 12, ageMax: 17, color: '#059669', domain: 'cognitive-logic', emoji: '🔄',
  },
  'visual-difference-detector': {
    slug: 'visual-difference-detector', title: 'Focus Flow',
    tagline: 'Spot subtle changes, calm focus',
    description: "Two nearly-identical images sit side by side and you must spot every small difference before time runs out. A calm, meditative kind of focus training. (In-game title: 'Focus Flow' — distinct from Focus Flash and Focus Master.)",
    secondary: 'Attention to Detail', skillsBuilt: ['Visual Scanning', 'Attention to Detail', 'Patience'],
    ageMin: 5, ageMax: 17, color: '#0f766e', domain: 'cognitive-focus', emoji: '🔍',
  },

  // ───────────────────────── PHASE 2: STEM & ENGINEERING ─────────────────────────
  'bhava-build-device-engineer': {
    slug: 'bhava-build-device-engineer', title: 'Device Engineer',
    tagline: 'Build a phone from scratch',
    description: "A genuine engineering simulator (ages 11-18) where you assemble a smartphone or laptop from real, data-driven components, then test, debug, and optimize your build until it actually works.",
    secondary: 'Problem-Solving', skillsBuilt: ['Systems Thinking', 'Debugging', 'Engineering Trade-offs'],
    ageMin: 11, ageMax: 18, color: '#8e6bd8', domain: 'stem-engineering', emoji: '📱',
  },
  'secret-of-silicon-game': {
    slug: 'secret-of-silicon-game', title: 'Chip Detective',
    tagline: "What's really inside a chip?",
    description: "An interactive discovery game (ages 10-18) that walks you into the microscopic world of a computer chip to see how semiconductors actually work — the real science behind every device you own.",
    secondary: 'Curiosity', skillsBuilt: ['Scientific Curiosity', 'Analytical Thinking', 'Technical Literacy'],
    ageMin: 10, ageMax: 18, color: '#8e6bd8', domain: 'stem-engineering', emoji: '🔍',
  },
  'rocket-build-engineer': {
    slug: 'rocket-build-engineer', title: 'Rocket Engineer',
    tagline: 'Design. Launch. Explore.',
    description: "Design either a sounding rocket or a full two-stage orbital rocket from real components on a fixed mission budget, then launch and watch real trade-offs between thrust, weight, and stage count decide your fate.",
    secondary: 'Systems Thinking', skillsBuilt: ['Systems Thinking', 'Applied Physics', 'Budget-Constrained Design'],
    ageMin: 14, ageMax: 17, color: '#2c3e6b', domain: 'stem-engineering', emoji: '🚀',
  },
  'bhava-space-academy': {
    slug: 'bhava-space-academy', title: 'Medhā Space Academy',
    tagline: 'Explore the ISS in 3D',
    description: "Explore a fully modeled 3D International Space Station module by module, and diagnose real space-station emergencies like gyroscope drift or life-support failures — real space-agency engineering as an explorable 3D world.",
    secondary: 'Systems Thinking', skillsBuilt: ['Scientific Curiosity', 'Systems Diagnosis', 'Real-World Engineering Knowledge'],
    ageMin: 14, ageMax: 17, color: '#2c3e6b', domain: 'stem-engineering', emoji: '🛰️',
  },
  'drone-build-engineer': {
    slug: 'drone-build-engineer', title: 'Drone Engineer',
    tagline: 'Build racing or cinematic drones',
    description: "Choose between building an FPV racing drone or a cinematic camera drone from real parts — frame, flight controller, ESC, motors, propellers, battery — then run a launch sequence and see whether your build actually flies.",
    secondary: 'Spatial Reasoning', skillsBuilt: ['Engineering Design', 'Applied Physics', 'Precision Trade-offs'],
    ageMin: 14, ageMax: 17, color: '#2c3e6b', domain: 'stem-engineering', emoji: '🛸',
  },
  'build-your-car': {
    slug: 'build-your-car', title: 'Car Designer',
    tagline: 'Engineer a real, working car',
    description: "Pick a chassis, engine, gearbox, battery, radiator, and fuel tank, each with real cost, weight, reliability, and heat-load numbers — a genuine engineering trade-off simulator, not just cosmetic styling.",
    secondary: 'Design Thinking', skillsBuilt: ['Engineering Trade-offs', 'Budget Management', 'Systems Thinking'],
    ageMin: 11, ageMax: 17, color: '#8e6bd8', domain: 'stem-engineering', emoji: '🚗',
  },
  'plane-builder': {
    slug: 'plane-builder', title: 'Plane Builder',
    tagline: 'Engineer a real aircraft',
    description: "Assemble an aircraft piece by piece — fuselage, wings, flaps — learning what each part does, with a 'what happens if it's missing' consequence for each, turning abstract aerodynamics into visible cause-and-effect.",
    secondary: 'Precision Thinking', skillsBuilt: ['Applied Physics', 'Systems Thinking', 'Attention to Detail'],
    ageMin: 11, ageMax: 15, color: '#8e6bd8', domain: 'stem-engineering', emoji: '✈️',
  },
  'motorcycle-one-workshop': {
    slug: 'motorcycle-one-workshop', title: 'Bike Builder',
    tagline: 'Explore a real motorcycle, part by part',
    description: "Explore two full motorcycle builds — a Sport bike and a Scooter — labeling and understanding 18 real parts each, right down to the quick-shifter and crash guard.",
    secondary: 'Mechanical Thinking', skillsBuilt: ['Mechanical Thinking', 'Systems Knowledge', 'Attention to Detail'],
    ageMin: 11, ageMax: 17, color: '#8e6bd8', domain: 'stem-engineering', emoji: '🏍️',
  },
  'bhava-tech-build-your-bike': {
    slug: 'bhava-tech-build-your-bike', title: 'Build Cycles',
    tagline: 'Build, diagnose, and upgrade a bicycle',
    description: "Build a bicycle in progressive levels, then face a real diagnostics system — gear skipping, rotor rub, an overweight frame, poor balance — and identify the cause and fix, just like a real bike mechanic.",
    secondary: 'Mechanical Thinking', skillsBuilt: ['Mechanical Thinking', 'Diagnostic Reasoning', 'Sequencing'],
    ageMin: 8, ageMax: 10, color: '#3fa7d6', domain: 'stem-engineering', emoji: '🚲',
  },

  // ─────────────────────── PHASE 3: LIFE SKILLS, CIVICS & EQ ───────────────────────
  'nagarikx-enhanced': {
    slug: 'nagarikx-enhanced', title: 'Future Citizen',
    tagline: 'Real rights, real rules, real life',
    description: "A full civic & legal awareness suite covering six real-world blocks: ID documents, age-based rights, digital safety, police/FIR procedure, RTI and consumer rights, and cross-border basics — each with real quizzes and a completion certificate.",
    secondary: 'Civic Sense', skillsBuilt: ['Civic Sense', 'Legal Literacy', 'Real-World Decision-Making'],
    ageMin: 14, ageMax: 17, color: '#2c3e6b', domain: 'civics', emoji: '🏛️',
  },
  'soccomm-enhanced': {
    slug: 'soccomm-enhanced', title: 'Me & Society',
    tagline: 'Every choice changes the outcome',
    description: "Navigate branching real-life scenes where every response you choose shifts a visible relationship meter up or down — no single correct path, just how tone and word choice change how people respond to you.",
    secondary: 'Responsibility', skillsBuilt: ['Social Responsibility', 'Communication', 'Negotiation'],
    ageMin: 11, ageMax: 17, color: '#8e6bd8', domain: 'civics', emoji: '🤝',
  },
  'good-habits': {
    slug: 'good-habits', title: 'Good Habits',
    tagline: 'Pick the smart choice',
    description: "Quick, playful daily-life scenarios — morning routine, a sudden sneeze, snack time, bedtime — where you pick the smart choice from four options. Built for the youngest learners.",
    secondary: 'Self-Monitoring', skillsBuilt: ['Self-Monitoring', 'Healthy Habits', 'Decision-Making'],
    ageMin: 5, ageMax: 7, color: '#f0a13c', domain: 'emotional-intel', emoji: '🌱',
  },
  'calm-zone': {
    slug: 'calm-zone', title: 'Calm Zone',
    tagline: 'Breathe. Reset. Refocus.',
    description: "A guided breathing exercise — inhale over 4 seconds, hold for 4, exhale over 6. No scoring, no pressure — just a calm space to reset before an exam or after a stressful moment.",
    secondary: 'Mindfulness', skillsBuilt: ['Mindfulness', 'Emotional Regulation', 'Stress Management'],
    ageMin: 5, ageMax: 17, color: '#f0a13c', domain: 'emotional-intel', emoji: '🧘',
  },
  'life-strategist-starter': {
    slug: 'life-strategist-starter', title: 'Life Strategist',
    tagline: 'Real dilemmas, real consequences',
    description: "Work through realistic high-stakes scenarios — like a medical triage decision — scored across multiple life dimensions, with reflection questions on what daily habit could have prevented the problem in the first place.",
    secondary: 'Decision-Making', skillsBuilt: ['Decision-Making', 'Long-Term Planning', 'Reflective Thinking'],
    ageMin: 14, ageMax: 17, color: '#2c3e6b', domain: 'life-skills', emoji: '🎲',
  },
  'finlife-india-quest-enhanced': {
    slug: 'finlife-india-quest-enhanced', title: 'Fin Smart',
    tagline: 'Real Indian money traps, real lessons',
    description: "Work through real Indian financial scenarios — surprise health expenses, insurance as a safety net, the EMI trap on buying a phone in installments — with hints and explanations teaching practical money sense.",
    secondary: 'Decision-Making', skillsBuilt: ['Financial Literacy', 'Delayed Gratification', 'Risk Awareness'],
    ageMin: 14, ageMax: 17, color: '#2c3e6b', domain: 'finance', emoji: '💰',
  },
  'empathy-quest': {
    slug: 'empathy-quest', title: 'Empathy Quest',
    tagline: 'Read the clues, understand the feeling',
    description: "Look at social clues — a quiet body, an empty desk, a classmate not eating — and work out how that person is most likely feeling, then get an empathy lesson explaining the reasoning.",
    secondary: 'Empathy', skillsBuilt: ['Empathy', 'Social Awareness', 'Emotional Reasoning'],
    ageMin: 8, ageMax: 13, color: '#e11d48', domain: 'emotional-intel', emoji: '💞',
  },
  'empathy-conversation': {
    slug: 'empathy-conversation', title: 'Empathy Conversation',
    tagline: 'Repair a real relationship, one reply at a time',
    description: "Navigate an emotionally real conversation with a hurt friend — good responses take responsibility and open honest dialogue, visibly repairing the relationship; dismissive ones deepen the hurt.",
    secondary: 'Communication', skillsBuilt: ['Communication', 'Empathy', 'Conflict Resolution'],
    ageMin: 11, ageMax: 17, color: '#e11d48', domain: 'emotional-intel', emoji: '💬',
  },
  'heart-heroes': {
    slug: 'heart-heroes', title: 'Heart Heroes',
    tagline: 'Match kind actions to feelings',
    description: "Four Heart Hero characters each represent a core value — kindness, courage, honesty, patience — and present challenges where you choose the matching action. Complete all four missions to light up the map.",
    secondary: 'Kindness', skillsBuilt: ['Prosocial Behaviour', 'Values Education', 'Moral Reasoning'],
    ageMin: 5, ageMax: 8, color: '#e11d48', domain: 'emotional-intel', emoji: '💖',
  },
  'ready-for-the-world': {
    slug: 'ready-for-the-world', title: 'Ready for the World',
    tagline: 'A 13-day life-readiness journey',
    description: "Live through 13 real teen scenarios — hosting relatives, running errands, formal dinners, community service — where every choice shifts your discipline, social, organization, and confidence scores.",
    secondary: 'Life Readiness', skillsBuilt: ['Self-Discipline', 'Social Etiquette', 'Practical Responsibility'],
    ageMin: 11, ageMax: 17, color: '#8e6bd8', domain: 'life-skills', emoji: '🌍',
  },
  'day-hero-game': {
    slug: 'day-hero-game', title: 'Day Hero',
    tagline: 'Plan your hero day',
    description: "Plan out a full day as a young hero — juggling time, tasks, and energy across missions so nothing gets missed and you don't burn out. A playful introduction to time management.",
    secondary: 'Time Management', skillsBuilt: ['Time Management', 'Prioritization', 'Planning'],
    ageMin: 5, ageMax: 9, color: '#dc2626', domain: 'life-skills', emoji: '🦸',
  },
  'planet-guardians': {
    slug: 'planet-guardians', title: 'Planet Guardians',
    tagline: 'Solve real eco-challenges',
    description: "Take on environmental challenges requiring real scientific reasoning and teamwork — genuine eco-problem-solving where the right answer depends on understanding cause and effect in ecosystems.",
    secondary: 'Environmental Science', skillsBuilt: ['Scientific Reasoning', 'Environmental Awareness', 'Collaborative Problem-Solving'],
    ageMin: 12, ageMax: 17, color: '#0369a1', domain: 'environment', emoji: '🌍',
  },

  // ─────────────────────── PHASE 4: MATHS, LOGIC & SCIENCE ───────────────────────
  'hidden-maths': {
    slug: 'hidden-maths', title: 'Hidden Maths',
    tagline: 'Maths is hiding all around you',
    description: "A 9-mystery series uncovering real math hiding in everyday things — parabolas in a circus trapeze and car headlights, gear ratios in bicycles and wind turbines, light refraction in eyeglasses and prisms.",
    secondary: 'Observation', skillsBuilt: ['Observation', 'Applied Mathematics', 'Pattern Recognition'],
    ageMin: 14, ageMax: 17, color: '#2c3e6b', domain: 'cognitive-math', emoji: '🔎',
  },
  'intelligent-machines': {
    slug: 'intelligent-machines', title: 'Intelligent Machines',
    tagline: 'From humans to intelligent machines',
    description: "A 4-level progression with mini-games and quizzes tracing how simple human decisions evolve into the step-by-step logic machines use to 'think' — genuine computational thinking as a structured course.",
    secondary: 'Analytical Thinking', skillsBuilt: ['Analytical Thinking', 'Logical Sequencing', 'Computational Curiosity'],
    ageMin: 11, ageMax: 13, color: '#8e6bd8', domain: 'cognitive-math', emoji: '🤖',
  },
  'know-maths': {
    slug: 'know-maths', title: 'Know Maths',
    tagline: 'Understand all about Maths',
    description: "A structured walkthrough of core math concepts explained through interactive visuals rather than textbook formulas — built for the student who wants maths to finally click.",
    secondary: 'Attention', skillsBuilt: ['Attention', 'Conceptual Understanding', 'Mathematical Reasoning'],
    ageMin: 14, ageMax: 17, color: '#2c3e6b', domain: 'cognitive-math', emoji: '📐',
  },
  'number-garden-quest': {
    slug: 'number-garden-quest', title: 'Number Garden',
    tagline: 'Water the right number of plants',
    description: "Grow a garden by watering exactly the right number of plants for each puzzle — a precise, hands-on counting task with instant plant-growth feedback for the youngest learners.",
    secondary: 'Focus', skillsBuilt: ['Number Sense', 'Focus', 'Early Counting Skills'],
    ageMin: 5, ageMax: 8, color: '#16a34a', domain: 'cognitive-math', emoji: '🌱',
  },
  'percentile-game': {
    slug: 'percentile-game', title: 'Percentile',
    tagline: 'Where do you really stand?',
    description: "Work with rankings and score comparisons to understand what a percentile actually means — why an 80th percentile isn't the same as scoring 80 marks. (Flagged: gameplay could not be verified from source code — please confirm before publishing.)",
    secondary: 'Data Reasoning', skillsBuilt: ['Data Reasoning', 'Statistical Thinking', 'Comparative Analysis'],
    ageMin: 11, ageMax: 17, color: '#8e6bd8', domain: 'cognitive-math', emoji: '📊',
  },
  'brain-of-all-machines': {
    slug: 'brain-of-all-machines', title: 'Brain of All Machines',
    tagline: 'The logic behind every machine',
    description: "Explore the hidden logic circuits — AND, OR, IF-THEN — that sit inside every machine from a washing machine to a smartphone. Simple puzzles reveal how machines make 'decisions' using pure logic.",
    secondary: 'Attention', skillsBuilt: ['Attention', 'Logical Reasoning', 'Systems Thinking'],
    ageMin: 11, ageMax: 13, color: '#8e6bd8', domain: 'cognitive-math', emoji: '⚙️',
  },
  'hidden-science': {
    slug: 'hidden-science', title: 'Hidden Science',
    tagline: '20 mysteries hiding in plain sight',
    description: "Investigate 20 real science mysteries — feel materials to learn what conducts electricity, then explore how electrons behave inside atoms. Earn real badges (Lab Master, Master Detective, Atom Explorer) for genuinely completing each experiment.",
    secondary: 'Scientific Curiosity', skillsBuilt: ['Scientific Observation', 'Hands-On Reasoning', 'Curiosity'],
    ageMin: 11, ageMax: 15, color: '#0f766e', domain: 'cognitive-math', emoji: '🔬',
  },
  'math-blitz': {
    slug: 'math-blitz', title: 'Math Blitz',
    tagline: 'Rapid-fire arithmetic under pressure',
    description: "Rapid-fire arithmetic drills that push your mental math speed to the limit — no calculators, no pausing, just quick sums against the clock.",
    secondary: 'Numerical Fluency', skillsBuilt: ['Numerical Fluency', 'Speed Under Pressure', 'Mental Math'],
    ageMin: 12, ageMax: 17, color: '#ea580c', domain: 'cognitive-math', emoji: '🔢',
  },
  'logic-game': {
    slug: 'logic-game', title: 'Logic Game',
    tagline: 'Who sits where? What belongs to whom?',
    description: "Classic deductive-reasoning puzzles — given a set of clues, figure out who sits where and how everything connects. The same style of logic puzzle used in aptitude and competitive exams.",
    secondary: 'Deductive Reasoning', skillsBuilt: ['Deductive Reasoning', 'Logical Thinking', 'Working Memory'],
    ageMin: 12, ageMax: 17, color: '#2563eb', domain: 'cognitive-logic', emoji: '🧩',
  },
  'logic-grid-puzzle': {
    slug: 'logic-grid-puzzle', title: 'Logic Grid Puzzle',
    tagline: 'Grids that grow from simple to fiendish',
    description: "Multi-variable logic grids that scale from a manageable 3×3 up to a genuinely challenging 5×5 — a distinct, harder sibling to Logic Game.",
    secondary: 'Deductive Reasoning', skillsBuilt: ['Deductive Reasoning', 'Systematic Thinking', 'Patience'],
    ageMin: 12, ageMax: 17, color: '#4f46e5', domain: 'cognitive-logic', emoji: '📐',
  },
  'brain-garden': {
    slug: 'brain-garden', title: 'Brain Garden',
    tagline: 'Grow your garden, one mini-game a day',
    description: "Complete a short cognitive mini-game each day and watch your personal brain garden grow — a gentle, low-pressure habit-builder for daily mental exercise.",
    secondary: 'Consistency', skillsBuilt: ['Cognitive Consistency', 'Varied Reasoning', 'Habit Building'],
    ageMin: 8, ageMax: 17, color: '#16a34a', domain: 'cognitive-logic', emoji: '🌻',
  },
  'brain-quest': {
    slug: 'brain-quest', title: 'Brain Quest',
    tagline: 'One quest, three cognitive skills',
    description: "A multi-stage cognitive quest that tests attention, memory, and reasoning back to back within a single session, giving a fuller picture of how these skills work together.",
    secondary: 'Mixed Cognitive Skills', skillsBuilt: ['Attention', 'Memory', 'Reasoning'],
    ageMin: 12, ageMax: 17, color: '#0284c7', domain: 'cognitive-logic', emoji: '🧩',
  },
  'mindscape-pro': {
    slug: 'mindscape-pro', title: 'MindScape Pro',
    tagline: 'Competitive-level abstract reasoning',
    description: "Advanced fluid-reasoning assessment using matrix reasoning, abstract analogies, and number series, converting your performance into a percentile score against Medhā's normative sample.",
    secondary: 'Abstract Reasoning', skillsBuilt: ['Fluid Reasoning', 'Pattern Recognition', 'Abstract Thinking'],
    ageMin: 12, ageMax: 17, color: '#0f766e', domain: 'cognitive-assessment', emoji: '🧠',
  },
  'mindspark-iq': {
    slug: 'mindspark-iq', title: 'MindSpark IQ',
    tagline: 'A full IQ-style battery',
    description: "A structured IQ-style assessment covering pattern, spatial, verbal, and numerical reasoning in one sitting — a rounded snapshot of cognitive strengths across four distinct domains.",
    secondary: 'Mixed Reasoning', skillsBuilt: ['Pattern Recognition', 'Spatial Reasoning', 'Verbal & Numerical Reasoning'],
    ageMin: 12, ageMax: 17, color: '#0e7490', domain: 'cognitive-assessment', emoji: '💡',
  },
  'neuro-ascend-iq': {
    slug: 'neuro-ascend-iq', title: 'Neuro Ascend IQ',
    tagline: 'Climb from basic to advanced reasoning',
    description: "Ascend through escalating cognitive levels, starting with basic processing and climbing toward advanced reasoning challenges, with difficulty ramping up gradually.",
    secondary: 'Progressive Reasoning', skillsBuilt: ['Cognitive Processing Speed', 'Advanced Reasoning', 'Adaptive Thinking'],
    ageMin: 12, ageMax: 17, color: '#1d4ed8', domain: 'cognitive-assessment', emoji: '🚀',
  },
  'neurospark': {
    slug: 'neurospark', title: 'NeuroSpark',
    tagline: 'Two tasks, one brain, real pressure',
    description: "High-speed multi-tasking challenges — like sorting shapes by colour while counting sounds — that push executive function and attention-switching, training the dual-task processing behind real academic multitasking.",
    secondary: 'Executive Function', skillsBuilt: ['Cognitive Flexibility', 'Dual-Task Processing', 'Executive Function'],
    ageMin: 12, ageMax: 17, color: '#f59e0b', domain: 'cognitive-focus', emoji: '✨',
  },
  'take-test': {
    slug: 'take-test', title: 'Take Test',
    tagline: 'Your full Brain Power Test',
    description: "The comprehensive Medhā assessment experience — a full 'Brain Power Test' session covering multiple cognitive domains in one structured sitting, distinct from the shorter single-skill games.",
    secondary: 'Comprehensive Assessment', skillsBuilt: ['Mixed Cognitive Domains', 'Sustained Test-Taking Focus', 'Self-Awareness'],
    ageMin: 11, ageMax: 17, color: '#00d4ff', domain: 'cognitive-assessment', emoji: '🧠',
  },
  'bcs-lite-v3': {
    slug: 'bcs-lite-v3', title: 'BCS Lite',
    tagline: 'A quick Medhā Cognitive Screen',
    description: "A lightweight version of Medhā's cognitive screening — a fast check-in on where you stand, ideal for a quick baseline or repeat check-ins over time without a long session.",
    secondary: 'Quick Screening', skillsBuilt: ['Self-Awareness', 'Baseline Cognitive Screening'],
    ageMin: 11, ageMax: 17, color: '#0d1f35', domain: 'cognitive-assessment', emoji: '🩺',
  },

  // ─────────────────────── PHASE 5: LANGUAGE, ARTS & CAREER ───────────────────────
  'telugu-script-game': {
    slug: 'telugu-script-game', title: 'Telugu Script',
    tagline: 'From vowels to sentences',
    description: "Learn to read and write Telugu script step by step — from individual vowels up to full sentences — through interactive levels, quizzes, and challenges.",
    secondary: 'Mother Tongue Literacy', skillsBuilt: ['Script Recognition', 'Reading Fluency', 'Language Literacy'],
    ageMin: 5, ageMax: 12, color: '#f0a13c', domain: 'language-telugu', emoji: '🅰️',
  },
  'devanagari-game': {
    slug: 'devanagari-game', title: 'Devanagari',
    tagline: 'Learn the Sanskrit script',
    description: "An interactive introduction to Devanagari, the script used to write both Sanskrit and Hindi — recognizing and forming characters through guided practice.",
    secondary: 'Script Literacy', skillsBuilt: ['Script Recognition', 'Visual Memory', 'Language Foundations'],
    ageMin: 5, ageMax: 7, color: '#f0a13c', domain: 'language-hindi', emoji: '🅰️',
  },
  'grammar-galaxy': {
    slug: 'grammar-galaxy', title: 'Grammar Galaxy',
    tagline: 'Become a Galaxy Master',
    description: "A leveled English grammar curriculum — nouns, verbs, adjectives, articles, sentence structure — wrapped in a space theme where completing levels earns you 'Galaxy Master' status.",
    secondary: 'Grammar Foundations', skillsBuilt: ['Grammar Fundamentals', 'Sentence Construction', 'Vocabulary'],
    ageMin: 5, ageMax: 10, color: '#3fa7d6', domain: 'language-english', emoji: '🌌',
  },
  'grammar-pro': {
    slug: 'grammar-pro', title: 'Daily English',
    tagline: 'A fresh grammar challenge every day',
    description: "A live, Firebase-powered daily English challenge covering everything from basic parts of speech up through advanced grammar — active vs. passive voice, conditional sentences. Note: in-game title is 'Daily English,' not 'Grammar Pro' — align the name across your site.",
    secondary: 'Applied Grammar', skillsBuilt: ['Grammar Mastery', 'Sentence Analysis', 'Daily Practice Habit'],
    ageMin: 11, ageMax: 17, color: '#3fa7d6', domain: 'language-english', emoji: '📅',
  },
  'google-search-lab-deep-v2': {
    slug: 'google-search-lab-deep-v2', title: 'Know Google Lab',
    tagline: 'How search engines actually work',
    description: "Follow a search query through the real four-layer pipeline of a modern search engine — crawling, document analysis, inverted indexing, and ranking. Genuine computer-science content, not search tips.",
    secondary: 'Digital Literacy', skillsBuilt: ['Computational Thinking', 'Digital Literacy', 'Systems Understanding'],
    ageMin: 11, ageMax: 17, color: '#2c3e6b', domain: 'digital-literacy', emoji: '🔍',
  },
  'imaginia-quest': {
    slug: 'imaginia-quest', title: 'Imaginia Quest',
    tagline: 'Patterns hidden in a magical story',
    description: "Solve pattern-completion and odd-one-out puzzles where every answer unlocks a whimsical explanation woven into an ongoing fantasy story, blending pattern-recognition with imaginative storytelling.",
    secondary: 'Creativity', skillsBuilt: ['Pattern Recognition', 'Creative Thinking', 'Narrative Reasoning'],
    ageMin: 5, ageMax: 9, color: '#a855f7', domain: 'creativity', emoji: '🪄',
  },
  'nadopaasana': {
    slug: 'nadopaasana', title: 'Nādopāsanā',
    tagline: 'A devotion to sound and music',
    description: "An all-ages exploration of Nādopāsanā — 'worship through sound' rooted in Indian classical music traditions — introducing musical concepts and listening practice for the whole family.",
    secondary: 'Musical Appreciation', skillsBuilt: ['Musical Ear Training', 'Cultural Literacy', 'Focused Listening'],
    ageMin: 5, ageMax: 17, color: '#f0a13c', domain: 'music', emoji: '🪕',
  },
  'bhava-tech-likhwell': {
    slug: 'bhava-tech-likhwell', title: 'Likhwell',
    tagline: 'Practice your handwriting',
    description: "A dedicated handwriting practice tool that tracks your writing history over time, so improvement is visible session over session rather than a one-off worksheet.",
    secondary: 'Handwriting', skillsBuilt: ['Fine Motor Skills', 'Handwriting Fluency', 'Self-Tracking Progress'],
    ageMin: 5, ageMax: 10, color: '#3fa7d6', domain: 'language-english', emoji: '✍️',
  },
  'career-adventure': {
    slug: 'career-adventure', title: 'Career Adventure',
    tagline: 'Real career decisions, honestly explored',
    description: "Explore three real career decision points with grounded advice: think long-term over marks or prestige, talk to real counselors, and be honest about finances — because no career is worth lifelong debt stress.",
    secondary: 'Career Exploration', skillsBuilt: ['Long-Term Planning', 'Financial Awareness', 'Real-World Decision-Making'],
    ageMin: 14, ageMax: 17, color: '#2c3e6b', domain: 'career', emoji: '🗺️',
  },
};

export function getCatalogEntry(slug: string): CatalogEntry | null {
  return GAMES_CATALOG[slug] ?? null;
}
