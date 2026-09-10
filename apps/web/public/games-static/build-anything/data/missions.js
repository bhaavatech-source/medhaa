// data/missions.js
// Optional engineering challenges. Purely descriptive + a set of "suitability" tags
// that the evaluation engine checks against the technologies used, to score "Mission Suitability".
// Add new missions without touching engine code.

export const MISSIONS = [
  {
    id: "help_farmer",
    title: "Help a Farmer",
    description: "Design an invention that helps farmers plant, monitor, or protect crops.",
    idealTags: ["movement-enabler", "sensing", "outdoor", "autonomy"]
  },
  {
    id: "help_elderly",
    title: "Help Elderly People",
    description: "Design an invention that assists elderly people with daily tasks safely.",
    idealTags: ["safety", "manipulation", "communication", "low-complexity"]
  },
  {
    id: "clean_ocean",
    title: "Clean the Ocean",
    description: "Design an invention that removes plastic or pollutants from the ocean.",
    idealTags: ["movement-enabler", "manipulation", "waterproof", "autonomy"]
  },
  {
    id: "rescue_flood",
    title: "Rescue Flood Victims",
    description: "Design an invention that can locate and rescue people in flooded areas.",
    idealTags: ["movement-enabler", "sensing", "communication", "waterproof"]
  },
  {
    id: "explore_mars",
    title: "Explore Mars",
    description: "Design an invention that can explore and survive the Martian surface.",
    idealTags: ["movement-enabler", "power-independent", "protection", "sensing"]
  },
  {
    id: "deliver_medicine",
    title: "Deliver Medicine",
    description: "Design an invention that delivers medical supplies quickly and safely.",
    idealTags: ["movement-enabler", "navigation", "speed", "safety"]
  },
  {
    id: "protect_forests",
    title: "Protect Forests",
    description: "Design an invention that detects fires, illegal logging, or monitors wildlife.",
    idealTags: ["sensing", "movement-enabler", "communication", "autonomy"]
  },
  {
    id: "reduce_pollution",
    title: "Reduce Pollution",
    description: "Design an invention that monitors or reduces air, water, or land pollution.",
    idealTags: ["sensing", "environmental", "processing"]
  }
];

export function getMissionById(id) {
  return MISSIONS.find(m => m.id === id);
}
