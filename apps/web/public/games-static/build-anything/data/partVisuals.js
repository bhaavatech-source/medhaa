// data/partVisuals.js
export const PART_SVG = {
  locomotion_wheel: `
    <svg viewBox="0 0 100 100" class="part-svg">
      <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" stroke-width="10"/>
      <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="4 5" opacity="0.7"/>
      <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" stroke-width="3" opacity="0.5"/>
      <circle cx="50" cy="50" r="14" fill="currentColor"/>
      <circle cx="50" cy="50" r="5" fill="var(--bg-card)"/>
      <g stroke="currentColor" stroke-width="3.5">
        <line x1="50" y1="20" x2="50" y2="36"/>
        <line x1="50" y1="64" x2="50" y2="80"/>
        <line x1="20" y1="50" x2="36" y2="50"/>
        <line x1="64" y1="50" x2="80" y2="50"/>
        <line x1="29" y1="29" x2="40" y2="40"/>
        <line x1="71" y1="29" x2="60" y2="40"/>
        <line x1="29" y1="71" x2="40" y2="60"/>
        <line x1="71" y1="71" x2="60" y2="60"/>
      </g>
      <circle cx="50" cy="26" r="2.5" fill="currentColor"/>
      <circle cx="50" cy="74" r="2.5" fill="currentColor"/>
      <circle cx="26" cy="50" r="2.5" fill="currentColor"/>
      <circle cx="74" cy="50" r="2.5" fill="currentColor"/>
    </svg>`,
  locomotion_leg: `
    <svg viewBox="0 0 100 100" class="part-svg">
      <path d="M48 8 L44 42 L62 52 L54 92" fill="none" stroke="currentColor" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M48 8 L44 42 L62 52 L54 92" fill="none" stroke="currentColor" stroke-width="2" opacity="0.4"/>
      <ellipse cx="48" cy="8" rx="8" ry="7" fill="currentColor"/>
      <circle cx="44" cy="42" r="6.5" fill="currentColor"/>
      <circle cx="44" cy="42" r="2.5" fill="var(--bg-card)"/>
      <circle cx="62" cy="52" r="6" fill="currentColor"/>
      <circle cx="62" cy="52" r="2.2" fill="var(--bg-card)"/>
      <path d="M48 90 L60 90 L54 96 Z" fill="currentColor"/>
    </svg>`,
  locomotion_track: `
    <svg viewBox="0 0 100 100" class="part-svg">
      <rect x="8" y="32" width="84" height="36" rx="18" fill="none" stroke="currentColor" stroke-width="7"/>
      <g stroke="currentColor" stroke-width="3" opacity="0.7">
        <line x1="16" y1="32" x2="16" y2="68"/>
        <line x1="26" y1="32" x2="26" y2="68"/>
        <line x1="36" y1="32" x2="36" y2="68"/>
        <line x1="46" y1="32" x2="46" y2="68"/>
        <line x1="56" y1="32" x2="56" y2="68"/>
        <line x1="66" y1="32" x2="66" y2="68"/>
        <line x1="76" y1="32" x2="76" y2="68"/>
        <line x1="86" y1="32" x2="86" y2="68"/>
      </g>
      <circle cx="26" cy="50" r="12" fill="currentColor" opacity="0.9"/>
      <circle cx="50" cy="50" r="12" fill="currentColor" opacity="0.9"/>
      <circle cx="74" cy="50" r="12" fill="currentColor" opacity="0.9"/>
      <circle cx="26" cy="50" r="4" fill="var(--bg-card)"/>
      <circle cx="50" cy="50" r="4" fill="var(--bg-card)"/>
      <circle cx="74" cy="50" r="4" fill="var(--bg-card)"/>
    </svg>`,
  locomotion_prop: `
    <svg viewBox="0 0 100 100" class="part-svg">
      <path d="M50 50 C46 38 40 18 50 8 C60 18 54 38 50 50 Z" fill="currentColor" opacity="0.9"/>
      <path d="M50 50 C62 46 82 40 92 50 C82 60 62 54 50 50 Z" fill="currentColor" opacity="0.9"/>
      <path d="M50 50 C54 62 60 82 50 92 C40 82 46 62 50 50 Z" fill="currentColor" opacity="0.9"/>
      <path d="M50 50 C38 54 18 60 8 50 C18 40 38 46 50 50 Z" fill="currentColor" opacity="0.9"/>
      <circle cx="50" cy="50" r="9" fill="currentColor"/>
      <circle cx="50" cy="50" r="3.5" fill="var(--bg-card)"/>
    </svg>`,
  power: `
    <svg viewBox="0 0 100 100" class="part-svg">
      <rect x="18" y="28" width="64" height="52" rx="5" fill="none" stroke="currentColor" stroke-width="6"/>
      <rect x="38" y="16" width="24" height="14" rx="2" fill="currentColor"/>
      <line x1="18" y1="44" x2="82" y2="44" stroke="currentColor" stroke-width="2" opacity="0.4"/>
      <line x1="18" y1="60" x2="82" y2="60" stroke="currentColor" stroke-width="2" opacity="0.4"/>
      <path d="M56 36 L40 58 L52 58 L44 78 L64 52 L52 52 Z" fill="currentColor"/>
    </svg>`,
  brain: `
    <svg viewBox="0 0 100 100" class="part-svg">
      <rect x="26" y="26" width="48" height="48" rx="5" fill="none" stroke="currentColor" stroke-width="6"/>
      <rect x="38" y="38" width="24" height="24" rx="2" fill="currentColor" opacity="0.85"/>
      <rect x="44" y="44" width="12" height="12" fill="var(--bg-card)"/>
      <g stroke="currentColor" stroke-width="3.5">
        <line x1="34" y1="10" x2="34" y2="26"/>
        <line x1="50" y1="8" x2="50" y2="26"/>
        <line x1="66" y1="10" x2="66" y2="26"/>
        <line x1="34" y1="74" x2="34" y2="90"/>
        <line x1="50" y1="74" x2="50" y2="92"/>
        <line x1="66" y1="74" x2="66" y2="90"/>
        <line x1="10" y1="34" x2="26" y2="34"/>
        <line x1="10" y1="50" x2="26" y2="50"/>
        <line x1="10" y1="66" x2="26" y2="66"/>
        <line x1="74" y1="34" x2="90" y2="34"/>
        <line x1="74" y1="50" x2="90" y2="50"/>
        <line x1="74" y1="66" x2="90" y2="66"/>
      </g>
    </svg>`,
  sensor: `
    <svg viewBox="0 0 100 100" class="part-svg">
      <rect x="20" y="38" width="60" height="30" rx="8" fill="none" stroke="currentColor" stroke-width="5" opacity="0.6"/>
      <circle cx="50" cy="50" r="26" fill="none" stroke="currentColor" stroke-width="6"/>
      <circle cx="50" cy="50" r="16" fill="currentColor" opacity="0.9"/>
      <circle cx="50" cy="50" r="16" fill="none" stroke="var(--bg-card)" stroke-width="1.5"/>
      <circle cx="43" cy="43" r="5" fill="var(--bg-card)" opacity="0.9"/>
      <circle cx="50" cy="24" r="3" fill="currentColor"/>
      <circle cx="50" cy="76" r="3" fill="currentColor"/>
    </svg>`,
  arm: `
    <svg viewBox="0 0 100 100" class="part-svg">
      <circle cx="18" cy="88" r="8" fill="currentColor"/>
      <path d="M18 88 L32 48 L58 42 L74 14" fill="none" stroke="currentColor" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="32" cy="48" r="6.5" fill="currentColor"/>
      <circle cx="32" cy="48" r="2.5" fill="var(--bg-card)"/>
      <circle cx="58" cy="42" r="6" fill="currentColor"/>
      <circle cx="58" cy="42" r="2.2" fill="var(--bg-card)"/>
      <path d="M74 14 L88 6 M74 14 L84 24 M74 14 L70 26" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>
    </svg>`,
  structure: `
    <svg viewBox="0 0 100 100" class="part-svg">
      <rect x="12" y="26" width="76" height="48" rx="4" fill="none" stroke="currentColor" stroke-width="6"/>
      <line x1="12" y1="38" x2="88" y2="38" stroke="currentColor" stroke-width="2" opacity="0.5"/>
      <line x1="12" y1="50" x2="88" y2="50" stroke="currentColor" stroke-width="2" opacity="0.5"/>
      <line x1="12" y1="62" x2="88" y2="62" stroke="currentColor" stroke-width="2" opacity="0.5"/>
      <circle cx="20" cy="32" r="2" fill="currentColor"/>
      <circle cx="80" cy="32" r="2" fill="currentColor"/>
      <circle cx="20" cy="68" r="2" fill="currentColor"/>
      <circle cx="80" cy="68" r="2" fill="currentColor"/>
    </svg>`,
  protection: `
    <svg viewBox="0 0 100 100" class="part-svg">
      <path d="M50 8 L86 22 V54 C86 76 68 90 50 94 C32 90 14 76 14 54 V22 Z" fill="none" stroke="currentColor" stroke-width="6"/>
      <path d="M50 20 L74 30 V54 C74 68 62 78 50 82 C38 78 26 68 26 54 V30 Z" fill="currentColor" opacity="0.25"/>
      <path d="M40 50 L47 58 L62 40" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
  display: `
    <svg viewBox="0 0 100 100" class="part-svg">
      <rect x="14" y="18" width="72" height="50" rx="5" fill="none" stroke="currentColor" stroke-width="6"/>
      <rect x="20" y="24" width="60" height="38" fill="currentColor" opacity="0.15"/>
      <path d="M26 52 L38 38 L48 46 L62 30" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
      <rect x="38" y="72" width="24" height="6" rx="2" fill="currentColor"/>
      <rect x="30" y="80" width="40" height="5" rx="2" fill="currentColor" opacity="0.6"/>
    </svg>`,
  comms: `
    <svg viewBox="0 0 100 100" class="part-svg">
      <line x1="50" y1="30" x2="50" y2="86" stroke="currentColor" stroke-width="6"/>
      <circle cx="50" cy="20" r="9" fill="currentColor"/>
      <circle cx="50" cy="20" r="3" fill="var(--bg-card)"/>
      <path d="M32 42 Q50 22 68 42" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
      <path d="M20 56 Q50 20 80 56" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" opacity="0.7"/>
      <rect x="38" y="86" width="24" height="8" rx="2" fill="currentColor" opacity="0.8"/>
    </svg>`,
  storage: `
    <svg viewBox="0 0 100 100" class="part-svg">
      <ellipse cx="50" cy="24" rx="34" ry="11" fill="none" stroke="currentColor" stroke-width="6"/>
      <path d="M16 24 V50" stroke="currentColor" stroke-width="6"/>
      <path d="M84 24 V50" stroke="currentColor" stroke-width="6"/>
      <ellipse cx="50" cy="50" rx="34" ry="11" fill="none" stroke="currentColor" stroke-width="5" opacity="0.7"/>
      <path d="M16 50 V76" stroke="currentColor" stroke-width="6"/>
      <path d="M84 50 V76" stroke="currentColor" stroke-width="6"/>
      <ellipse cx="50" cy="76" rx="34" ry="11" fill="none" stroke="currentColor" stroke-width="6"/>
      <circle cx="50" cy="24" r="3" fill="currentColor"/>
    </svg>`,
  intelligence: `
    <svg viewBox="0 0 100 100" class="part-svg">
      <rect x="30" y="30" width="40" height="40" rx="6" fill="none" stroke="currentColor" stroke-width="6"/>
      <g stroke="currentColor" stroke-width="3.5">
        <line x1="40" y1="10" x2="40" y2="30"/>
        <line x1="50" y1="8" x2="50" y2="30"/>
        <line x1="60" y1="10" x2="60" y2="30"/>
        <line x1="40" y1="70" x2="40" y2="90"/>
        <line x1="50" y1="70" x2="50" y2="92"/>
        <line x1="60" y1="70" x2="60" y2="90"/>
        <line x1="10" y1="40" x2="30" y2="40"/>
        <line x1="8" y1="50" x2="30" y2="50"/>
        <line x1="10" y1="60" x2="30" y2="60"/>
        <line x1="70" y1="40" x2="90" y2="40"/>
        <line x1="70" y1="50" x2="92" y2="50"/>
        <line x1="70" y1="60" x2="90" y2="60"/>
      </g>
      <circle cx="42" cy="45" r="4" fill="currentColor"/>
      <circle cx="58" cy="45" r="4" fill="currentColor"/>
      <path d="M40 58 Q50 65 60 58" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
    </svg>`,
  misc: `
    <svg viewBox="0 0 100 100" class="part-svg">
      <rect x="25" y="25" width="50" height="50" rx="8" fill="none" stroke="currentColor" stroke-width="6"/>
      <circle cx="50" cy="50" r="8" fill="currentColor" opacity="0.7"/>
    </svg>`
};

export function getLocomotionVariant(tech) {
  const name = (tech.name || "").toLowerCase();
  if (name.includes("leg")) return "locomotion_leg";
  if (name.includes("track")) return "locomotion_track";
  if (name.includes("propeller") || name.includes("jet") || name.includes("rocket") || name.includes("hovercraft")) return "locomotion_prop";
  return "locomotion_wheel";
}

export function getPartSvgKey(role, tech) {
  if (role === "locomotion") return getLocomotionVariant(tech);
  if (PART_SVG[role]) return role;
  return "misc";
}