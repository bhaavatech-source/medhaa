/* ================================================================
   QUIZ DATA
   ================================================================ */

const QUIZ_BANK = {
  vision: [
    {
      q: "Which human eye part works most like a camera's CMOS sensor?",
      options: ["Cornea", "Retina", "Eyelid", "Tear duct"],
      answer: 1
    },
    {
      q: "What lets a machine see in the dark far better than a human?",
      options: [
        "Bigger lens",
        "Infrared/night-vision sensor",
        "Louder speaker",
        "Faster CPU"
      ],
      answer: 1
    },
    {
      q: "A telescope mainly extends human vision for...",
      options: [
        "Tasting food",
        "Seeing far-away objects",
        "Hearing sound",
        "Smelling gas"
      ],
      answer: 1
    }
  ],

  hearing: [
    {
      q: "Which part of the ear converts vibration into nerve signals?",
      options: ["Pinna", "Cochlea", "Eyebrow", "Iris"],
      answer: 1
    },
    {
      q: "Ultrasonic sensors can detect sounds that are...",
      options: [
        "Too loud for microphones",
        "Above human hearing range",
        "Only underwater",
        "Only in space"
      ],
      answer: 1
    }
  ],

  speech: [
    {
      q: "What do vocal cords do when we speak?",
      options: [
        "Store memories",
        "Vibrate to create sound",
        "Filter air",
        "Detect light"
      ],
      answer: 1
    },
    {
      q: "A big advantage of machine speech is...",
      options: [
        "Genuine emotion",
        "Instant multilingual output",
        "Better taste",
        "Longer sleep"
      ],
      answer: 1
    }
  ],

  memory: [
    {
      q: "Which machine memory is fastest but temporary?",
      options: ["Hard drive", "Cloud backup", "RAM", "Paper notes"],
      answer: 2
    },
    {
      q: "Human memory is more likely than machine memory to...",
      options: [
        "Recall bit-perfect data",
        "Distort or fade over time",
        "Never forget",
        "Store petabytes"
      ],
      answer: 1
    }
  ],

  thinking: [
    {
      q: "What helps machines think about huge datasets fast?",
      options: [
        "A single neuron",
        "GPUs and parallel processing",
        "A calculator battery",
        "A camera lens"
      ],
      answer: 1
    },
    {
      q: "Humans usually outperform machines at...",
      options: [
        "Massive number crunching",
        "Common-sense reasoning in new situations",
        "Repetitive precise math",
        "Nonstop operation"
      ],
      answer: 1
    }
  ],

  "decision-making": [
    {
      q: "Autonomous cars make braking decisions using...",
      options: [
        "Guesswork",
        "Real-time sensor data and algorithms",
        "Only sound",
        "Random numbers"
      ],
      answer: 1
    },
    {
      q: "A major limitation of machine decision-making is...",
      options: [
        "Too much empathy",
        "Struggling outside its training scenarios",
        "Being too slow",
        "Needing food"
      ],
      answer: 1
    }
  ],

  learning: [
    {
      q: "Machine-learning models usually need...",
      options: [
        "Just one example",
        "Large amounts of training data",
        "No data at all",
        "A microphone only"
      ],
      answer: 1
    },
    {
      q: "Humans are often better than machines at...",
      options: [
        "Learning from very few examples",
        "Processing millions of images per second",
        "Never getting tired",
        "Perfect memory recall"
      ],
      answer: 0
    }
  ],

  movement: [
    {
      q: "What generates force in a robot's movement system?",
      options: ["Motors/actuators", "Cochlea", "Retina", "Taste buds"],
      answer: 0
    },
    {
      q: "Which is true about human movement versus vehicles?",
      options: [
        "Humans are always faster",
        "Vehicles can move much faster than humans on foot",
        "Humans never get tired",
        "Vehicles cannot be controlled"
      ],
      answer: 1
    }
  ],

  hands: [
    {
      q: "What gives human hands excellent grip control?",
      options: [
        "Opposable thumb and touch feedback",
        "Wheels",
        "GPS",
        "Cochlea"
      ],
      answer: 0
    },
    {
      q: "Industrial robot arms are especially good at...",
      options: [
        "Feeling emotions",
        "Lifting heavy loads with consistent precision",
        "Tasting food",
        "Smelling gas leaks"
      ],
      answer: 1
    }
  ],

  touch: [
    {
      q: "What do tactile sensors on robots typically measure?",
      options: [
        "Sound frequency",
        "Pressure and texture",
        "Light color",
        "Air pressure only"
      ],
      answer: 1
    },
    {
      q: "Human skin's biggest natural advantage is...",
      options: [
        "Whole-body natural coverage",
        "Detecting forces humans cannot feel",
        "Perfect memory",
        "GPS tracking"
      ],
      answer: 0
    }
  ],

  smell: [
    {
      q: "An electronic nose is mainly used to detect...",
      options: [
        "Colors",
        "Specific gases and chemicals",
        "Sounds",
        "Temperature only"
      ],
      answer: 1
    },
    {
      q: "Compared to machines, human smell is...",
      options: [
        "More precise in measuring gas ppm",
        "More linked to memory and emotion",
        "Faster at detecting toxins",
        "Unlimited range"
      ],
      answer: 1
    }
  ],

  taste: [
    {
      q: "An electronic tongue is useful for...",
      options: [
        "Detecting music",
        "Measuring chemical composition of food and drink",
        "Seeing in the dark",
        "Balancing robots"
      ],
      answer: 1
    }
  ],

  balance: [
    {
      q: "Which sensor combo helps machines balance like the inner ear?",
      options: [
        "Camera and speaker",
        "Gyroscope and accelerometer (IMU)",
        "Thermometer and battery",
        "Microphone and antenna"
      ],
      answer: 1
    },
    {
      q: "Humans are generally better than machines at...",
      options: [
        "Recovering balance from sudden pushes instinctively",
        "Never wobbling",
        "Measuring exact tilt angles",
        "Working without food"
      ],
      answer: 0
    }
  ],

  communication: [
    {
      q: "What allows machines to communicate across the globe?",
      options: [
        "Radio waves and satellites",
        "Body language",
        "Taste sensors",
        "Muscles"
      ],
      answer: 0
    },
    {
      q: "A human communication strength machines struggle to match is...",
      options: [
        "Speed of data transfer",
        "Emotional nuance and empathy",
        "Global range",
        "Bandwidth"
      ],
      answer: 1
    }
  ],

  energy: [
    {
      q: "What stores electrical energy in portable machines?",
      options: ["Battery", "Cochlea", "Lens", "Gyroscope"],
      answer: 0
    },
    {
      q: "A key human energy limitation is...",
      options: [
        "Needing sleep and food regularly",
        "Needing electricity",
        "Needing sunlight only",
        "Needing Wi-Fi"
      ],
      answer: 0
    }
  ],

  protection: [
    {
      q: "What helps spacecraft survive extreme re-entry heat?",
      options: [
        "A heat shield made of special materials",
        "A regular battery",
        "A microphone",
        "A GPS chip"
      ],
      answer: 0
    },
    {
      q: "A big human advantage in protection is...",
      options: [
        "Self-healing skin after small injuries",
        "Never getting hurt",
        "Cyberattack resistance",
        "Bulletproof skin"
      ],
      answer: 0
    }
  ],

  "temperature-sensing": [
    {
      q: "Infrared thermometers can measure temperature...",
      options: [
        "Only by touching an object",
        "From a distance without contact",
        "Only underwater",
        "Only in the dark"
      ],
      answer: 1
    },
    {
      q: "Human skin can sense hot and cold but cannot usually...",
      options: [
        "Feel temperature",
        "Give an exact numerical reading",
        "React to burns",
        "Sense pain"
      ],
      answer: 1
    }
  ],

  navigation: [
    {
      q: "GPS satellites help machines know their...",
      options: [
        "Exact location on Earth",
        "Body temperature",
        "Favorite color",
        "Heart rate"
      ],
      answer: 0
    },
    {
      q: "Without devices, humans can still navigate using...",
      options: [
        "Memory, landmarks, sun and stars",
        "Wi-Fi only",
        "Bluetooth only",
        "5G towers"
      ],
      answer: 0
    }
  ],

  "emotion-recognition": [
    {
      q: "Emotion-recognition AI mainly works by...",
      options: [
        "Truly feeling emotions",
        "Detecting patterns in faces and voice",
        "Reading minds",
        "Tasting food"
      ],
      answer: 1
    },
    {
      q: "Why must emotion-AI be designed carefully?",
      options: [
        "It is expensive only",
        "It can misread emotions and create unfair outcomes",
        "It uses too much power",
        "It is too fast"
      ],
      answer: 1
    }
  ],

  creativity: [
    {
      q: "Generative AI creates art and music mainly by...",
      options: [
        "Feeling inspired",
        "Recombining patterns from training data",
        "Copying one image exactly",
        "Randomly guessing colors"
      ],
      answer: 1
    },
    {
      q: "A genuine human creative advantage is...",
      options: [
        "Faster variation generation",
        "Real lived experience and intention",
        "Never getting tired",
        "Perfect memory"
      ],
      answer: 1
    }
  ],

  "pattern-recognition": [
    {
      q: "Machine-learning models are especially good at finding patterns in...",
      options: [
        "A single data point",
        "Millions of data points quickly",
        "Nothing without data",
        "Only sound"
      ],
      answer: 1
    }
  ],

  speed: [
    {
      q: "Which is true about reaction time?",
      options: [
        "Human reflexes are faster than machine sensors",
        "Machine sensors can react in microseconds",
        "Machines cannot react",
        "Humans react in nanoseconds"
      ],
      answer: 1
    }
  ],

  accuracy: [
    {
      q: "Why can CNC machines stay precise for hours?",
      options: [
        "They get tired more slowly",
        "They do not suffer fatigue or hand tremors",
        "They eat less",
        "They are lighter"
      ],
      answer: 1
    }
  ],

  storage: [
    {
      q: "Which best matches petabyte-scale storage capacity?",
      options: [
        "Human brain memory only",
        "Cloud data centers",
        "One sticky note",
        "One photograph"
      ],
      answer: 1
    }
  ],

  attention: [
    {
      q: "AI attention mechanisms were inspired by...",
      options: [
        "How humans focus on relevant words and information",
        "How machines print paper",
        "How batteries charge",
        "How cars brake"
      ],
      answer: 0
    }
  ],

  reaction: [
    {
      q: "A car airbag sensor can react in about...",
      options: [
        "30 milliseconds",
        "3 minutes",
        "30 seconds",
        "3 hours"
      ],
      answer: 0
    }
  ],

  coordination: [
    {
      q: "Drone swarm shows demonstrate machine strength in...",
      options: [
        "Tasting food together",
        "Coordinating many components simultaneously",
        "Sleeping in sync",
        "Growing over time"
      ],
      answer: 1
    }
  ]
};

function getFinalChallengeQuestions(count=10){
  const all = [];

  Object.keys(QUIZ_BANK).forEach(key => {
    QUIZ_BANK[key].forEach(question => all.push(question));
  });

  return shuffle(all).slice(0, count);
}