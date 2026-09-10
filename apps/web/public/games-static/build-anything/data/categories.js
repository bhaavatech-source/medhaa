// data/categories.js
// Category definitions used to drive filters, icons, and color accents across the engine.
// Add a new category here and it automatically appears in the library filter and sandbox palette grouping.

export const CATEGORIES = [
  { id: "movement",     name: "Movement",     icon: "🛞", color: "#7c5cff" },
  { id: "power",         name: "Power",         icon: "🔋", color: "#ffb020" },
  { id: "storage",       name: "Storage",       icon: "💾", color: "#00d9c0" },
  { id: "processing",    name: "Processing",    icon: "🧠", color: "#ff5c8a" },
  { id: "sensors",       name: "Sensors",       icon: "📡", color: "#4ecdc4" },
  { id: "communication", name: "Communication", icon: "📶", color: "#5c9dff" },
  { id: "display",       name: "Display",       icon: "🖥️", color: "#ff9f5c" },
  { id: "manipulation",  name: "Manipulation",  icon: "🦾", color: "#c77cff" },
  { id: "structure",     name: "Structure",     icon: "🏗️", color: "#8a8f9c" },
  { id: "protection",    name: "Protection",    icon: "🛡️", color: "#4caf50" },
  { id: "intelligence",  name: "Intelligence",  icon: "🤖", color: "#ff5c5c" }
];

export function getCategoryById(id) {
  return CATEGORIES.find(c => c.id === id);
}