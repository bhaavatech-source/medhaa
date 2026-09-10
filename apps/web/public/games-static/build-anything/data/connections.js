// data/connections.js
// ============================================================================
// PART-TO-PART CONNECTION SYSTEM
// ----------------------------------------------------------------------------
// A part only counts as "connected" once it snaps exactly onto a matching
// chassis slot (see data/chassis.js). This file provides:
//   - findNearestSlot: snap-lock detection when a part is dropped near a slot
//   - computeConnections: reads all parts and reports which roles are wired
//     into the chassis (locomotion, power, brain...) and whether the build
//     is a complete, movable machine
//   - getConnectionMessage: kid-friendly status text for the UI
// ============================================================================

import { getSlotsForRole } from "./chassis.js";
import { getTechById } from "./technologies.js";

export const SNAP_RADIUS_PCT = 10;

// Called when a part is dropped. Only slots of the matching role are
// considered, and only if that exact slot isn't already taken by another part.
export function findNearestSlot(x, y, role, occupiedSlotIds = []) {
  const candidates = getSlotsForRole(role).filter(s => !occupiedSlotIds.includes(s.id));
  let best = null, bestDist = Infinity;
  candidates.forEach(s => {
    const d = Math.hypot(s.x - x, s.y - y);
    if (d < bestDist) { bestDist = d; best = s; }
  });
  return (best && bestDist <= SNAP_RADIUS_PCT) ? best : null;
}

// Scans every part/unit for a locked-in slotId and reports the machine's
// wiring state: does it have a way to move (locomotion) and a way to power
// that movement (power)? Both are required before it counts as "complete."
export function computeConnections(parts) {
  const occupied = {};
  parts.forEach(part => {
    (part.positions || []).forEach(pos => {
      if (pos.slotId) occupied[pos.slotId] = { partUid: part.uid, role: pos.role };
    });
  });
  const roles = Object.values(occupied).map(o => o.role);
  const hasLocomotion = roles.includes("locomotion");
  const hasPower = roles.includes("power");
  const hasBrain = roles.includes("brain");
  const isComplete = hasLocomotion && hasPower;
  const missing = [];
  if (!hasLocomotion) missing.push("a way to move (wheels, legs, propellers...)");
  if (!hasPower) missing.push("a power source (battery, solar panel...)");
  return { occupied, hasLocomotion, hasPower, hasBrain, isComplete, missing };
}

// Checks that every placed part has all of its required earlier build stages
// present in the invention — e.g. a Wheel (stage 3) needs a structural
// material like Steel (stage 1) already in the build before it can "count."
export function checkBuildOrder(parts) {
  const validParts = parts
    .map(p => ({ part: p, tech: getTechById(p.techId) }))
    .filter(x => x.tech);

  const stagesPresent = new Set(validParts.map(x => x.tech.buildStage));

  const missing = [];
  validParts.forEach(({ tech }) => {
    for (let stage = 1; stage < tech.buildStage; stage++) {
      if (!stagesPresent.has(stage)) {
        missing.push({ partName: tech.name, missingStage: stage });
      }
    }
  });

  // De-duplicate identical warnings (e.g. multiple wheels missing the same stage)
  const uniqueMissing = Array.from(
    new Map(missing.map(m => [`${m.partName}-${m.missingStage}`, m])).values()
  );

  return { isOrdered: uniqueMissing.length === 0, missing: uniqueMissing };
}

const STAGE_NAMES = {
  1: "a structural frame (like Steel or Aluminum)",
  2: "a power source (like Battery or Solar Panels)",
  3: "a core system (like Wheels, Motor, or Camera)",
  4: "a supporting accessory",
  5: "a protective coating",
};

export function getConnectionMessage(connections, buildOrder) {
  if (!connections.isComplete) {
    return `⚠️ Still needs: ${connections.missing.join(" and ")}.`;
  }
  if (buildOrder && !buildOrder.isOrdered) {
    const lines = buildOrder.missing.map(
      m => `${m.partName} needs ${STAGE_NAMES[m.missingStage]} first!`
    );
    return `🔧 Almost there — build order issue:\n${lines.join("\n")}`;
  }
  return "✅ Core systems connected — this machine is ready to move!";
}