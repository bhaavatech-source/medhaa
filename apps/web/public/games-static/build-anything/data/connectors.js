// data/connectors.js
// ============================================================================
// CONNECTOR RULES
// ----------------------------------------------------------------------------
// Defines which connector types exist, how they look, and the matching logic
// that decides if a given technology part can physically attach to a given
// mount point on the chosen body.
// ============================================================================

export const CONNECTOR_TYPES = {
  screw:    { label: "Screw",    emoji: "🔩", description: "Bolted connection — strong, permanent, used for wheels, arms, heavy parts." },
  snap:     { label: "Snap-fit", emoji: "📎", description: "Click-in connection — quick, used for sensors, small clip-on parts." },
  magnetic: { label: "Magnetic", emoji: "🧲", description: "Magnetic dock — easy attach/detach, used for brains/controllers, quick-swap parts." },
  plug:     { label: "Plug",     emoji: "🔌", description: "Plug-in connection — used for power and data lines, like batteries and cables." },
};

// Default connector compatibility per technology ROLE.
// Used as a fallback when a specific tech doesn't declare its own
// compatibleConnectors array in technologies.js.
export const ROLE_DEFAULT_CONNECTORS = {
  locomotion: ["screw", "snap"],
  power:      ["plug", "screw"],
  brain:      ["magnetic", "snap"],
  sensor:     ["snap", "magnetic"],
  arm:        ["screw"],
};

export function getConnectorInfo(connectorType) {
  return CONNECTOR_TYPES[connectorType] || null;
}

// A part "fits" a mount point only if the part's own compatibleConnectors
// (or its role's default list) includes that mount point's connectorType.
export function canConnect(tech, role, mountPoint) {
  if (!tech || !mountPoint) return false;
  const allowed = tech.compatibleConnectors || ROLE_DEFAULT_CONNECTORS[role] || [];
  return allowed.includes(mountPoint.connectorType);
}

// Finds the first free, role-matching, connector-compatible mount point.
export function findCompatibleMount(tech, role, mountPoints, occupancy) {
  return mountPoints.find(mp =>
    mp.role === role &&
    (occupancy[mp.id] || 0) === 0 &&
    canConnect(tech, role, mp)
  ) || null;
}