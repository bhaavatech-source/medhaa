// data/bodies.js
// ============================================================================
// BODY / CHASSIS CATALOG
// ----------------------------------------------------------------------------
// A "body" is the physical structure everything else gets mounted onto —
// like a bike frame, a phone casing, or a satellite bus. Each body has:
//   - material   (affects weight, cost, durability)
//   - shape      (affects how mount points are laid out visually)
//   - size       (small/medium/large — scales mount point count + capacity)
//   - mountPoints (where parts can attach, each with its own connectorType)
// ============================================================================

export const MATERIALS = {
  fiber:    { label: "Fiber",    weight: 2, cost: 3, durability: 4, emoji: "🧵" },
  aluminum: { label: "Aluminum", weight: 4, cost: 5, durability: 6, emoji: "🔩" },
  steel:    { label: "Steel",    weight: 7, cost: 6, durability: 9, emoji: "⚙️" },
  wood:     { label: "Wood",     weight: 3, cost: 2, durability: 3, emoji: "🪵" },
};

export const SHAPES = {
  flat:     { label: "Flat Panel",   emoji: "▭" },
  curved:   { label: "Curved Shell", emoji: "◠" },
  boxy:     { label: "Boxy Frame",   emoji: "▢" },
  cylinder: { label: "Cylinder",     emoji: "◯" },
};

export const SIZE_SCALE = {
  small:  { label: "Small",  mountMultiplier: 0.7, scale: 0.8 },
  medium: { label: "Medium", mountMultiplier: 1.0, scale: 1.0 },
  large:  { label: "Large",  mountMultiplier: 1.4, scale: 1.3 },
};

// Each mount point declares WHERE it sits (x/y percent on the body),
// WHAT role it accepts (locomotion, power, brain, sensor, arm...),
// and HOW a part must attach (connectorType) — screw / snap / magnetic / plug.
export const BODIES = [
  {
    id: "fiber_small",
    name: "Fiber Shell (Small)",
    material: "fiber",
    shape: "curved",
    size: "small",
    mountPoints: [
      { id: "mp1", x: 20, y: 30, role: "locomotion", connectorType: "snap" },
      { id: "mp2", x: 80, y: 30, role: "locomotion", connectorType: "snap" },
      { id: "mp3", x: 50, y: 60, role: "power",      connectorType: "plug" },
      { id: "mp4", x: 50, y: 20, role: "brain",       connectorType: "magnetic" },
    ],
  },
  {
    id: "aluminum_medium",
    name: "Aluminum Frame (Medium)",
    material: "aluminum",
    shape: "flat",
    size: "medium",
    mountPoints: [
      { id: "mp1", x: 15, y: 70, role: "locomotion", connectorType: "screw" },
      { id: "mp2", x: 85, y: 70, role: "locomotion", connectorType: "screw" },
      { id: "mp3", x: 15, y: 30, role: "locomotion", connectorType: "screw" },
      { id: "mp4", x: 85, y: 30, role: "locomotion", connectorType: "screw" },
      { id: "mp5", x: 50, y: 50, role: "power",      connectorType: "plug" },
      { id: "mp6", x: 50, y: 20, role: "brain",       connectorType: "magnetic" },
    ],
  },
  {
    id: "steel_large",
    name: "Steel Chassis (Large)",
    material: "steel",
    shape: "boxy",
    size: "large",
    mountPoints: [
      { id: "mp1", x: 12, y: 75, role: "locomotion", connectorType: "screw" },
      { id: "mp2", x: 88, y: 75, role: "locomotion", connectorType: "screw" },
      { id: "mp3", x: 12, y: 25, role: "locomotion", connectorType: "screw" },
      { id: "mp4", x: 88, y: 25, role: "locomotion", connectorType: "screw" },
      { id: "mp5", x: 50, y: 50, role: "power",      connectorType: "plug" },
      { id: "mp6", x: 50, y: 15, role: "brain",       connectorType: "magnetic" },
      { id: "mp7", x: 25, y: 50, role: "sensor",      connectorType: "snap" },
      { id: "mp8", x: 75, y: 50, role: "arm",         connectorType: "screw" },
    ],
  },
  {
    id: "wood_medium",
    name: "Wooden Frame (Medium)",
    material: "wood",
    shape: "flat",
    size: "medium",
    mountPoints: [
      { id: "mp1", x: 20, y: 70, role: "locomotion", connectorType: "screw" },
      { id: "mp2", x: 80, y: 70, role: "locomotion", connectorType: "screw" },
      { id: "mp3", x: 50, y: 45, role: "power",      connectorType: "plug" },
      { id: "mp4", x: 50, y: 15, role: "brain",       connectorType: "snap" },
    ],
  },
];

export function getBodyById(id) {
  return BODIES.find(b => b.id === id) || null;
}

export function getMountPoints(bodyId) {
  const body = getBodyById(bodyId);
  return body ? body.mountPoints : [];
}

export function getMaterialInfo(materialId) {
  return MATERIALS[materialId] || null;
}

export function getShapeInfo(shapeId) {
  return SHAPES[shapeId] || null;
}

export function getSizeInfo(sizeId) {
  return SIZE_SCALE[sizeId] || null;
}