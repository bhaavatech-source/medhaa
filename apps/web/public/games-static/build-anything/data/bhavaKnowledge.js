// data/bhavaKnowledge.js
// Guidance for Bhava AI. technologies.js remains the only part catalogue.

export const BHAVA_CAPABILITIES = [
  {
    id: "movement",
    helpsWith: ["move", "walk", "drive", "roll", "fly", "swim", "travel"],
    guidance:
      "A moving machine needs a suitable movement method and a power source.",
    likelyPartIds: [
      "wheels",
      "tracks",
      "walkinglegs",
      "spiderlegs",
      "propellers",
      "jetskipropulsion",
      "hovercraft",
      "electricmotor"
    ],
    caution:
      "Choose one main movement method unless the student specifically wants a hybrid machine."
  },
  {
    id: "power",
    helpsWith: [
      "power",
      "charge",
      "electric",
      "battery",
      "run",
      "portable",
      "solar"
    ],
    guidance:
      "Motors, sensors, processors, and communication parts need an energy source.",
    likelyPartIds: [
      "battery",
      "solarpanels",
      "fuelcells",
      "windturbine",
      "supercapacitors"
    ],
    caution:
      "Solar panels depend on sunlight, while batteries need charging."
  },
  {
    id: "vision",
    helpsWith: [
      "see",
      "look",
      "watch",
      "photo",
      "picture",
      "video",
      "recognize"
    ],
    guidance:
      "Vision lets a machine capture images or recognize objects.",
    likelyPartIds: ["camera", "mlobjectdetection", "gpu", "tpu"],
    caution:
      "A camera captures images; object detection helps a machine identify what it sees."
  },
  {
    id: "obstacle-sensing",
    helpsWith: [
      "avoid",
      "obstacle",
      "wall",
      "collision",
      "nearby",
      "distance",
      "park safely"
    ],
    guidance:
      "To avoid obstacles, use a distance sensor and a controller that can respond.",
    likelyPartIds: [
      "ultrasonicsensor",
      "infraredsensor",
      "lidar",
      "radar",
      "microcontroller",
      "autonomousnavigation",
      "pathplanning"
    ],
    caution:
      "A sensor notices an obstacle; a controller or navigation system decides what to do next."
  },
  {
    id: "balance",
    helpsWith: [
      "balance",
      "steady",
      "upright",
      "stabilize",
      "hover",
      "not fall",
      "tilt"
    ],
    guidance:
      "Balancing machines need orientation sensing and fast control.",
    likelyPartIds: ["gyroscope", "microcontroller"],
    caution:
      "Flying drones and walking robots normally need balance sensing."
  },
  {
    id: "navigation",
    helpsWith: [
      "navigate",
      "find route",
      "map",
      "location",
      "destination",
      "deliver",
      "explore"
    ],
    guidance:
      "Navigation needs location or environment sensing and software that chooses a route.",
    likelyPartIds: [
      "gps",
      "compass",
      "lidar",
      "gyroscope",
      "autonomousnavigation",
      "pathplanning"
    ],
    caution:
      "GPS works best outdoors and can be weak indoors, in tunnels, and near tall buildings."
  },
  {
    id: "manipulation",
    helpsWith: [
      "pick up",
      "carry",
      "hold",
      "grab",
      "lift",
      "sort",
      "move objects"
    ],
    guidance:
      "To handle objects, use an arm or movement mechanism with a suitable gripper.",
    likelyPartIds: [
      "roboticarm",
      "gripper",
      "magneticgripper",
      "suctiongripper",
      "softroboticfingers",
      "electricmotor"
    ],
    caution:
      "Magnetic grippers only hold magnetic metal; suction works best on smooth surfaces."
  },
  {
    id: "communication",
    helpsWith: [
      "send",
      "message",
      "connect",
      "remote",
      "share",
      "wireless",
      "internet",
      "control from phone"
    ],
    guidance:
      "Communication lets a machine exchange data or receive instructions.",
    likelyPartIds: [
      "bluetooth",
      "wifi",
      "nfc",
      "opticalfiber",
      "communicationsatellite"
    ],
    caution:
      "Bluetooth is nearby; Wi-Fi needs a local network; satellites cover very long distances."
  },
  {
    id: "protection",
    helpsWith: [
      "safe",
      "protect",
      "rain",
      "waterproof",
      "drop",
      "heat",
      "cold",
      "survive"
    ],
    guidance:
      "A machine used in harsh conditions may need protection.",
    likelyPartIds: [
      "waterproofing",
      "shockabsorption",
      "heatinsulation",
      "coolingsystems"
    ],
    caution:
      "Choose protection for the environment: waterproofing for rain, insulation for temperature extremes."
  }
];

export const BHAVA_AI_RULES = [
  "Use only IDs found in the approved technology catalogue.",
  "Recommend between 3 and 7 technologies.",
  "Explain every choice in friendly, child-appropriate language.",
  "Include a power source when recommended parts need electricity.",
  "Include a controller when sensors must cause an action.",
  "Use one primary movement technology unless a hybrid design is requested.",
  "Do not recommend weapons, harmful surveillance, or medical-treatment uses.",
  "If the goal is unclear, ask one short, friendly question."
];