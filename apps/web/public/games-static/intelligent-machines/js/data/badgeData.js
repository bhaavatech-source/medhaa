const BADGES = [
  {
    id: 'first-spark',
    icon: '✨',
    title: 'First Spark',
    description: 'Complete your first quiz.',
    rule: {
      type: 'quiz-count',
      value: 1
    }
  },

  {
    id: 'curious-mind',
    icon: '🔍',
    title: 'Curious Mind',
    description: 'Complete quizzes from 3 different abilities.',
    rule: {
      type: 'unique-abilities',
      value: 3
    }
  },

  {
    id: 'sensor-scout',
    icon: '📡',
    title: 'Sensor Scout',
    description: 'Complete Vision, Hearing, or Touch quizzes.',
    rule: {
      type: 'ability-set',
      abilities: ['vision', 'hearing', 'touch'],
      value: 1
    }
  },

  {
    id: 'smart-thinker',
    icon: '🧠',
    title: 'Smart Thinker',
    description: 'Complete Thinking, Learning, or Decision-Making quizzes.',
    rule: {
      type: 'ability-set',
      abilities: ['thinking', 'learning', 'decision-making'],
      value: 1
    }
  },

  {
    id: 'machine-maker',
    icon: '🤖',
    title: 'Machine Maker',
    description: 'Complete Movement, Hands, or Energy quizzes.',
    rule: {
      type: 'ability-set',
      abilities: ['movement', 'hands', 'energy'],
      value: 1
    }
  },

  {
    id: 'engineering-explorer',
    icon: '🏆',
    title: 'Engineering Explorer',
    description: 'Complete quizzes from 10 different abilities.',
    rule: {
      type: 'unique-abilities',
      value: 10
    }
  }
];  