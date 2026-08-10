/* ================================================================
   SVG ICONS — small animated inline SVGs for panels (no external assets)
   ================================================================ */

const SVGIcons = {
  eyeHuman: `<svg viewBox="0 0 120 120" fill="none">
    <ellipse cx="60" cy="60" rx="50" ry="28" stroke="#ff8fc2" stroke-width="3"/>
    <g class="animate-blink">
      <circle cx="60" cy="60" r="18" fill="#0f1420" stroke="#ff2d95" stroke-width="2"/>
      <circle cx="60" cy="60" r="9" fill="#ff2d95"/>
      <circle cx="64" cy="56" r="3" fill="#fff"/>
    </g>
  </svg>`,
  eyeMachine: `<svg viewBox="0 0 120 120" fill="none">
    <rect x="20" y="35" width="80" height="50" rx="10" stroke="#7fe9ff" stroke-width="3"/>
    <circle cx="60" cy="60" r="20" stroke="#00e5ff" stroke-width="3" class="animate-spin" style="animation-duration:8s;"/>
    <circle cx="60" cy="60" r="10" fill="#00e5ff" opacity="0.8"/>
    <circle cx="60" cy="60" r="24" stroke="#00e5ff" stroke-width="1" opacity="0.4">
      <animate attributeName="r" values="20;28;20" dur="2s" repeatCount="indefinite"/>
    </circle>
  </svg>`,
  earHuman: `<svg viewBox="0 0 120 120" fill="none">
    <path d="M45 90 Q20 70 30 40 Q40 10 70 15 Q95 20 90 50 Q88 65 70 65 Q58 65 58 78 Q58 90 45 90Z" stroke="#ff8fc2" stroke-width="3"/>
    <path d="M55 55 Q65 50 68 60" stroke="#ff2d95" stroke-width="2"/>
  </svg>`,
  earMachine: `<svg viewBox="0 0 120 120" fill="none">
    <rect x="50" y="20" width="20" height="50" rx="8" stroke="#7fe9ff" stroke-width="3"/>
    <circle cx="60" cy="20" r="8" fill="#00e5ff"/>
    <path d="M30 60 Q60 90 90 60" stroke="#00ffa3" stroke-width="2" opacity="0.7">
      <animate attributeName="d" values="M30 60 Q60 90 90 60;M30 65 Q60 75 90 65;M30 60 Q60 90 90 60" dur="1.6s" repeatCount="indefinite"/>
    </path>
  </svg>`,
  brainHuman: `<svg viewBox="0 0 120 120" fill="none">
    <path d="M30 60 Q20 30 50 25 Q60 15 75 25 Q100 30 90 60 Q100 80 75 90 Q60 100 45 90 Q20 85 30 60Z" stroke="#ff8fc2" stroke-width="3"/>
    <circle cx="45" cy="50" r="3" fill="#ff2d95" class="animate-fire"/>
    <circle cx="65" cy="45" r="3" fill="#ff2d95" class="animate-fire" style="animation-delay:.3s"/>
    <circle cx="75" cy="65" r="3" fill="#ff2d95" class="animate-fire" style="animation-delay:.6s"/>
    <circle cx="50" cy="70" r="3" fill="#ff2d95" class="animate-fire" style="animation-delay:.9s"/>
  </svg>`,
  chipMachine: `<svg viewBox="0 0 120 120" fill="none">
    <rect x="30" y="30" width="60" height="60" rx="6" stroke="#7fe9ff" stroke-width="3"/>
    <rect x="45" y="45" width="30" height="30" rx="3" fill="#00e5ff" opacity="0.5" class="animate-pulse"/>
    <line x1="30" y1="45" x2="15" y2="45" stroke="#00e5ff" stroke-width="2"/>
    <line x1="30" y1="60" x2="15" y2="60" stroke="#00e5ff" stroke-width="2"/>
    <line x1="30" y1="75" x2="15" y2="75" stroke="#00e5ff" stroke-width="2"/>
    <line x1="90" y1="45" x2="105" y2="45" stroke="#00e5ff" stroke-width="2"/>
    <line x1="90" y1="60" x2="105" y2="60" stroke="#00e5ff" stroke-width="2"/>
    <line x1="90" y1="75" x2="105" y2="75" stroke="#00e5ff" stroke-width="2"/>
  </svg>`,
  genericHuman: `<svg viewBox="0 0 120 120" fill="none">
    <circle cx="60" cy="35" r="18" stroke="#ff8fc2" stroke-width="3"/>
    <path d="M30 100 Q30 65 60 65 Q90 65 90 100" stroke="#ff8fc2" stroke-width="3"/>
  </svg>`,
  genericMachine: `<svg viewBox="0 0 120 120" fill="none">
    <rect x="35" y="25" width="50" height="40" rx="8" stroke="#7fe9ff" stroke-width="3"/>
    <rect x="45" y="70" width="30" height="30" rx="6" stroke="#7fe9ff" stroke-width="3"/>
    <circle cx="50" cy="45" r="4" fill="#00e5ff" class="animate-pulse"/>
    <circle cx="70" cy="45" r="4" fill="#00e5ff" class="animate-pulse" style="animation-delay:.4s"/>
  </svg>`
};

function getVisual(abilityId, side){
  const map = {
    vision:{human:'eyeHuman', machine:'eyeMachine'},
    hearing:{human:'earHuman', machine:'earMachine'},
    thinking:{human:'brainHuman', machine:'chipMachine'},
    memory:{human:'brainHuman', machine:'chipMachine'},
    "decision-making":{human:'brainHuman', machine:'chipMachine'},
    learning:{human:'brainHuman', machine:'chipMachine'}
  };
  const key = (map[abilityId] && map[abilityId][side]) || (side === 'human' ? 'genericHuman' : 'genericMachine');
  return SVGIcons[key];
}
