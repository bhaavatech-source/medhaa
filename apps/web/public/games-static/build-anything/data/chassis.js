// data/chassis.js
// ============================================================================
// CHASSIS + SLOT SYSTEM
// ----------------------------------------------------------------------------
// Defines the physical "body" a child assembles a robot onto, plus the fixed
// docking SLOTS a part can snap into. Each slot has a ROLE — the kind of
// technology it accepts — determined by reading each technology's existing
// `tags` array in data/technologies.js (no changes needed there).
//
// Roles map to tag groups:
//   locomotion  -> tags include "movement-enabler"        (wheels, legs, tracks, propellers...)
//   power       -> tags include "power-source"             (battery, solar panels, fuel cells...)
//   brain       -> category === "processing"                (microcontroller, CPU, GPU...)
//   sensor      -> tags include "sensing"                   (camera, LiDAR, ultrasonic...)
//   arm         -> category === "manipulation"               (robotic arm, grippers...)
//
// SLOTS are positioned in percentage coordinates relative to the chassis
// stage, so they scale responsively. Each slot accepts ONE role and can hold
// MULTIPLE units of that role stacked as small satellite icons if a child
// drags in more than fits visually (e.g. 4 wheels -> 4 icons around one slot).
// ============================================================================

export const CHASSIS_SLOTS = [
  { id: "wheel_fl", role: "locomotion", label: "Front-Left Wheel",  x: 22, y: 30 },
  { id: "wheel_fr", role: "locomotion", label: "Front-Right Wheel", x: 78, y: 30 },
  { id: "wheel_rl", role: "locomotion", label: "Rear-Left Wheel",   x: 22, y: 72 },
  { id: "wheel_rr", role: "locomotion", label: "Rear-Right Wheel",  x: 78, y: 72 },
  { id: "power_bay",  role: "power",   label: "Power Bay",    x: 50, y: 78 },
  { id: "brain_bay",  role: "brain",   label: "Control Brain", x: 50, y: 50 },
  { id: "sensor_top", role: "sensor",  label: "Sensor Mount",  x: 50, y: 20 },
  { id: "arm_side",   role: "arm",     label: "Arm Mount",     x: 90, y: 50 },
  { id: "structure_panel", role: "structure", label: "Body Panel", x: 15, y: 50 },
{ id: "protection_shell", role: "protection", label: "Shell", x: 85, y: 20 },
{ id: "display_screen", role: "display", label: "Display", x: 15, y: 20 },
{ id: "comms_antenna", role: "comms", label: "Antenna", x: 90, y: 20 },
{ id: "storage_bay", role: "storage", label: "Storage Bay", x: 90, y: 78 },
{ id: "intelligence_core", role: "intelligence", label: "AI Core", x: 65, y: 50 }
];

// Determine which role a technology fills, purely from its existing tags/category.
export function getTechRole(tech) {
  if (!tech) return "misc";
  const tags = tech.tags || [];
  if (tags.includes("movement-enabler")) return "locomotion";
  if (tags.includes("power-source")) return "power";
  if (tech.category === "processing") return "brain";
  if (tags.includes("sensing")) return "sensor";
  if (tech.category === "manipulation") return "arm";
  if (tech.category === "intelligence") return "intelligence";
  if (tech.category === "communication") return "comms";
  if (tech.category === "display") return "display";
  if (tech.category === "structure") return "structure";
  if (tech.category === "protection") return "protection";
  if (tech.category === "storage") return "storage";
  return "misc";
}

// Slots a given role is allowed to dock into.
export function getSlotsForRole(role) {
  return CHASSIS_SLOTS.filter(s => s.role === role);
}

export function getSlotById(id) {
  return CHASSIS_SLOTS.find(s => s.id === id);
}