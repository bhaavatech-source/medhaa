/* ================================================================
   CURIOSITY MAP DATA
   Links ability categories to suggested engineering domains for Level 4.
   ================================================================ */

const CURIOSITY_MAP = [
  { keyword:"vision", label:"how machines see", abilities:["vision"], suggest:["optics","computer_vision","electronics","semiconductors","ai"], message:"You seem interested in how machines see the world." },
  { keyword:"hearing", label:"how machines hear", abilities:["hearing","speech"], suggest:["electronics","communication","ai","semiconductors"], message:"You seem interested in how machines hear and understand sound." },
  { keyword:"movement", label:"intelligent movement", abilities:["movement","hands","balance","coordination"], suggest:["mechanical","electrical","robotics","control_systems"], message:"You seem interested in intelligent movement and robotics." },
  { keyword:"thinking", label:"machine thinking", abilities:["thinking","decision-making","learning","pattern-recognition"], suggest:["computer_science","ai","semiconductors"], message:"You seem interested in how machines think and learn." },
  { keyword:"communication", label:"communication systems", abilities:["communication","navigation"], suggest:["communication","electronics","physics"], message:"You seem interested in communication systems." },
  { keyword:"chips", label:"chips and electronics", abilities:["memory","storage","speed","accuracy"], suggest:["computer_science","electronics","embedded","semiconductors","vlsi"], message:"You seem fascinated by chips and how they power machines." },
  { keyword:"protection", label:"protection & safety systems", abilities:["protection","reaction","temperature-sensing"], suggest:["materials","control_systems","mechanical"], message:"You seem interested in how machines stay safe and protected." },
  { keyword:"emotion", label:"emotion and creativity", abilities:["emotion-recognition","creativity","attention"], suggest:["ai","biomedical","computer_science"], message:"You seem curious about emotion recognition and machine creativity." },
  { keyword:"energy", label:"powering machines", abilities:["energy"], suggest:["chemical","electrical","materials"], message:"You seem interested in how machines get their power." }
];

if (typeof module !== "undefined") { module.exports = CURIOSITY_MAP; }
