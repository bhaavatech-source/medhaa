// data/variants.js
// ============================================================================
// CUSTOMIZATION OPTIONS — lets kids adjust HOW MANY of a part they use,
// HOW BIG it is, and HOW STRONG/advanced a version they pick.
// These multipliers are applied on top of a technology's base metrics
// (see script.js -> computeEvaluation) so every choice has a real,
// visible effect on the final invention score. Purely additive data —
// no other file needs to change to add a new size or strength tier.
// ============================================================================

export const SIZES = [
  { id: "small",  label: "Small",  emoji: "🔹", scale: 0.7,
    weightMult: 0.6, costMult: 0.7, powerMult: 0.7, rangeMult: 0.7, speedMult: 1.1 },
  { id: "medium", label: "Medium", emoji: "🔷", scale: 1.0,
    weightMult: 1.0, costMult: 1.0, powerMult: 1.0, rangeMult: 1.0, speedMult: 1.0 },
  { id: "large",  label: "Large",  emoji: "🔶", scale: 1.45,
    weightMult: 1.6, costMult: 1.5, powerMult: 1.35, rangeMult: 1.3, speedMult: 0.85 }
];

export const STRENGTHS = [
  { id: "basic",    label: "Basic",              emoji: "🟢",
    costMult: 0.65, powerMult: 0.7,  reliabilityMult: 0.95, innovationMult: 0.7,  efficiencyMult: 0.9 },
  { id: "standard", label: "Standard",           emoji: "🔵",
    costMult: 1.0,  powerMult: 1.0,  reliabilityMult: 1.0,  innovationMult: 1.0,  efficiencyMult: 1.0 },
  { id: "advanced", label: "Advanced",           emoji: "🟣",
    costMult: 1.45, powerMult: 1.3,  reliabilityMult: 1.08, innovationMult: 1.3,  efficiencyMult: 1.1 },
  { id: "prototype", label: "Experimental Prototype", emoji: "🟠",
    costMult: 2.0,  powerMult: 1.6,  reliabilityMult: 0.85, innovationMult: 1.8,  efficiencyMult: 1.15 }
];

export function getSizeById(id) { return SIZES.find(s => s.id === id) || SIZES[1]; }
export function getStrengthById(id) { return STRENGTHS.find(s => s.id === id) || STRENGTHS[1]; }
