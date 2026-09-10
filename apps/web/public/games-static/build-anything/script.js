// script.js
// ============================================================================
// CORE ENGINE — reads ONLY from data/*.js. No technology-specific logic here.
// Sections: (1) Bootstrapping (2) Library rendering (3) Modal (4) Sandbox
// (customizable parts: quantity, size, strength, free placement)
// (5) Evaluation engine (6) Bring-to-life animation (7) Celebration/certificate
// (8) Persistence (localStorage) (9) Tab/nav wiring
// ============================================================================

import { CATEGORIES, getCategoryById } from "./data/categories.js";
import { TECHNOLOGIES, getTechById, searchTechs } from "./data/technologies.js";
import { MISSIONS, getMissionById } from "./data/missions.js";
import { SIZES, STRENGTHS, getSizeById, getStrengthById } from "./data/variants.js";
import { CHASSIS_SLOTS, getTechRole, getSlotsForRole, getSlotById } from "./data/chassis.js";
import { PART_SVG, getPartSvgKey } from "./data/partVisuals.js";
import { findNearestSlot, computeConnections, getConnectionMessage } from "./data/connections.js";
import { BODIES, getBodyById, getMountPoints, getMaterialInfo, getShapeInfo, getSizeInfo } from "./data/bodies.js";
import { canConnect, findCompatibleMount, getConnectorInfo } from "./data/connectors.js";


// ---------------------------------------------------------------------------
// STATE
// ---------------------------------------------------------------------------
let uidCounter = 1;
function nextUid() { return "part_" + (uidCounter++); }

const state = {
  activeTab: "library",
  activeCategory: "all",
  searchQuery: "",
  showFavoritesOnly: false,
  favorites: new Set(JSON.parse(localStorage.getItem("ba_favorites") || "[]")),
  parts: [], // { uid, techId, qty, size, strength, positions: [{x,y}, ...] }
  activeMission: null,
  deviceName: "",
  lastEvaluation: null
};

function saveFavorites() {
  localStorage.setItem("ba_favorites", JSON.stringify([...state.favorites]));
}

// ---------------------------------------------------------------------------
// TAB NAVIGATION
// ---------------------------------------------------------------------------
function initTabs() {
  const tabButtons = document.querySelectorAll(".tab-btn");
  tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      tabButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      if (btn.dataset.tab === "tech-quiz") {
  document.querySelectorAll(".app-section").forEach(s => s.classList.remove("active"));
  return;
}
      document.querySelectorAll(".app-section").forEach(s => s.classList.remove("active"));
      const target = document.getElementById("section-" + btn.dataset.tab);
      target.classList.add("active");
      state.activeTab = btn.dataset.tab;
      if (btn.dataset.tab === "sandbox") renderPalette();
    });
  });
}

// ---------------------------------------------------------------------------
// SECTION 1: LIBRARY
// ---------------------------------------------------------------------------
function renderCategoryFilter() {
  const el = document.getElementById("categoryFilter");
  el.innerHTML = "";
  const allChip = document.createElement("div");
  allChip.className = "cat-chip" + (state.activeCategory === "all" ? " active" : "");
  allChip.textContent = "All Technologies";
  allChip.addEventListener("click", () => { state.activeCategory = "all"; renderLibrary(); renderCategoryFilter(); });
  el.appendChild(allChip);

  CATEGORIES.forEach(cat => {
    const chip = document.createElement("div");
    chip.className = "cat-chip" + (state.activeCategory === cat.id ? " active" : "");
    chip.textContent = cat.icon + " " + cat.name;
    chip.addEventListener("click", () => { state.activeCategory = cat.id; renderLibrary(); renderCategoryFilter(); });
    el.appendChild(chip);
  });
}

function getFilteredTechs() {
  let list = TECHNOLOGIES;
  if (state.activeCategory !== "all") list = list.filter(t => t.category === state.activeCategory);
  if (state.searchQuery) list = searchTechs(state.searchQuery).filter(t => list.includes(t));
  if (state.showFavoritesOnly) list = list.filter(t => state.favorites.has(t.id));
  return list;
}

function renderLibrary() {
  const grid = document.getElementById("libraryGrid");
  const list = getFilteredTechs();
  grid.innerHTML = "";
  if (list.length === 0) {
    grid.innerHTML = "<p style=\"color:var(--text-secondary)\">No technologies found.</p>";
    return;
  }
  list.forEach(tech => {
    const card = document.createElement("div");
    card.className = "tech-card";
    card.tabIndex = 0;
    const cat = getCategoryById(tech.category);
    card.innerHTML = `
      <button class="fav-star ${state.favorites.has(tech.id) ? "active" : ""}" data-id="${tech.id}">★</button>
      <span class="tech-icon">${tech.icon}</span>
      <span class="tech-cat-tag">${cat ? cat.name : tech.category}</span>
      <h3>${tech.name}</h3>
      <p>${tech.function}</p>
    `;
    card.addEventListener("click", (e) => {
      if (e.target.classList.contains("fav-star")) return;
      openTechModal(tech.id);
    });
    card.querySelector(".fav-star").addEventListener("click", (e) => {
      e.stopPropagation();
      toggleFavorite(tech.id);
    });
    card.addEventListener("keydown", (e) => { if (e.key === "Enter") openTechModal(tech.id); });
    grid.appendChild(card);
  });
}

function toggleFavorite(id) {
  if (state.favorites.has(id)) state.favorites.delete(id);
  else state.favorites.add(id);
  saveFavorites();
  renderLibrary();
}

// ---------------------------------------------------------------------------
// TECHNOLOGY DETAIL MODAL
// ---------------------------------------------------------------------------
function openTechModal(id) {
  const tech = getTechById(id);
  if (!tech) return;
  const modal = document.getElementById("techModal");
  const content = document.getElementById("techModalContent");
  const cat = getCategoryById(tech.category);

  content.innerHTML = `
    <span class="tech-cat-tag">${cat ? cat.name : tech.category}</span>
    <h2>${tech.icon} ${tech.name}</h2>
    <div class="anim-box"><span class="anim-${tech.animation}">${tech.icon}</span></div>
    <div class="modal-section"><h4>Function</h4><p>${tech.function}</p></div>
    <div class="modal-section"><h4>Why It Was Invented</h4><p>${tech.whyInvented}</p></div>
    <div class="modal-section"><h4>Working Principle</h4><p>${tech.workingPrinciple}</p></div>
    <div class="modal-section"><h4>Real-World Uses</h4><ul>${tech.realWorldUses.map(u => `<li>${u}</li>`).join("")}</ul></div>
    <div class="modal-section"><h4>Advantages</h4><ul>${tech.advantages.map(a => `<li>${a}</li>`).join("")}</ul></div>
    <div class="modal-section"><h4>Limitations</h4><ul>${tech.limitations.map(l => `<li>${l}</li>`).join("")}</ul></div>
    ${tech.capacities ? `<div class="modal-section"><h4>Typical Capacities / Versions</h4><ul>${tech.capacities.map(c => `<li>${c}</li>`).join("")}</ul></div>` : ""}
    ${tech.futureReplacements ? `<div class="modal-section"><h4>Future Developments</h4><ul>${tech.futureReplacements.map(f => `<li>${f}</li>`).join("")}</ul></div>` : ""}
    <div class="modal-section"><h4>Interesting Facts</h4><ul>${tech.facts.map(f => `<li>${f}</li>`).join("")}</ul></div>
    <div class="modal-section"><h4>Related Technologies</h4>
      ${tech.relatedTech.map(rid => {
        const rt = getTechById(rid);
        return rt ? `<span class="related-chip" data-id="${rt.id}">${rt.icon} ${rt.name}</span>` : "";
      }).join("")}
    </div>
  `;
  content.querySelectorAll(".related-chip").forEach(chip => {
    chip.addEventListener("click", () => openTechModal(chip.dataset.id));
  });
  modal.classList.remove("hidden");
}

function initModal() {
  document.getElementById("techModalClose").addEventListener("click", () => {
    document.getElementById("techModal").classList.add("hidden");
  });
  document.getElementById("techModal").addEventListener("click", (e) => {
    if (e.target.id === "techModal") e.currentTarget.classList.add("hidden");
  });
}

// ---------------------------------------------------------------------------
// SECTION 2: SANDBOX (drag and drop + full customization)
// ---------------------------------------------------------------------------
function renderPalette() {
  const list = document.getElementById("paletteList");
  list.innerHTML = "";
  TECHNOLOGIES.forEach(tech => {
    const item = document.createElement("div");
    item.className = "palette-item";
    item.draggable = true;
    item.dataset.id = tech.id;
    item.innerHTML = `<span>${tech.icon}</span><span>${tech.name}</span>`;
    item.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", tech.id);
      item.classList.add("dragging");
    });
    item.addEventListener("dragend", () => item.classList.remove("dragging"));
    list.appendChild(item);
  });
}

function addPart(techId) {
  const tech = getTechById(techId);
  const role = getTechRole(tech);
  state.parts.push({
    uid: nextUid(),
    techId,
    qty: 1,
    size: "medium",
    strength: "standard",
    collapsed: true,
    positions: [{ x: null, y: null }]
  });
  renderTray();
  renderWorkspaceChips();
}
// Keep the positions array length in sync with qty whenever it changes,
// preserving existing positions for units that already exist.
function syncPositions(part) {
  const tech = getTechById(part.techId);
  const role = getTechRole(tech);
  while (part.positions.length < part.qty) part.positions.push({ x: null, y: null });
  while (part.positions.length > part.qty) part.positions.pop();
}




function renderTray() {
  const tray = document.getElementById("selectedTray");
  tray.innerHTML = "";
  if (state.parts.length === 0) {
    tray.innerHTML = `<p class="tray-empty-hint">Nothing here yet — drag a technology from the left panel</p>`;
    return;
  }
  state.parts.forEach(part => {
    const tech = getTechById(part.techId);
    if (!tech) return;
    const card = document.createElement("div");
    card.className = "part-card";
    card.dataset.uid = part.uid;

    const sizeOptions = SIZES.map(s => `<option value="${s.id}" ${s.id === part.size ? "selected" : ""}>${s.emoji} ${s.label}</option>`).join("");
    const strengthOptions = STRENGTHS.map(s => `<option value="${s.id}" ${s.id === part.strength ? "selected" : ""}>${s.emoji} ${s.label}</option>`).join("");

    card.classList.toggle("collapsed", part.collapsed !== false);
    card.innerHTML = `
      <div class="part-card-head">
        <span class="part-icon">${tech.icon}</span>
        <span class="part-name">${tech.name}</span>
        <button class="part-collapse-toggle" title="Expand/collapse">${part.collapsed !== false ? "▸" : "▾"}</button>
        <button class="part-remove" title="Remove">✕</button>
      </div>
      <div class="part-controls">
        <label>Qty
          <div class="qty-stepper">
            <button class="qty-minus">−</button>
            <span class="qty-val">${part.qty}</span>
            <button class="qty-plus">+</button>
          </div>
        </label>
        <label>Size
          <select class="size-select">${sizeOptions}</select>
        </label>
        <label>Version
          <select class="strength-select">${strengthOptions}</select>
        </label>
      </div>
    `;

    card.querySelector(".part-collapse-toggle").addEventListener("click", (e) => {
      e.stopPropagation();
      part.collapsed = part.collapsed === false ? true : false;
      renderTray();
    });
    card.querySelector(".part-remove").addEventListener("click", () => {
      state.parts = state.parts.filter(p => p.uid !== part.uid);
      renderTray();
      renderWorkspaceChips();
    });
    card.querySelector(".qty-plus").addEventListener("click", () => {
      part.qty = Math.min(6, part.qty + 1);
      syncPositions(part);
      renderTray();
      renderWorkspaceChips();
    });
    card.querySelector(".qty-minus").addEventListener("click", () => {
      part.qty = Math.max(1, part.qty - 1);
      syncPositions(part);
      renderTray();
      renderWorkspaceChips();
    });
    card.querySelector(".size-select").addEventListener("change", (e) => {
      part.size = e.target.value;
      renderWorkspaceChips();
    });
    card.querySelector(".strength-select").addEventListener("change", (e) => {
      part.strength = e.target.value;
    });

    tray.appendChild(card);
  });
}

function ensureWorkspaceStage() {
  const workspace = document.getElementById("sandboxWorkspace");
  let stage = document.getElementById("workspaceStage");
  if (!stage) {
    stage = document.createElement("div");
    stage.id = "workspaceStage";
    workspace.appendChild(stage);
  }
  return stage;
}

// Draws the chassis outline + dashed slot markers ONCE per render. Slots give
// the child a clear physical structure to build onto (front/rear wheels,
// power bay, brain, sensor mount, arm mount) instead of a blank box.
function renderChassisFrame(stage) {
  const body = getBodyById(state.selectedBodyId);
  if (!body) return;
  const mat = getMaterialInfo(body.material);
  const shape = getShapeInfo(body.shape);

  let frame = stage.querySelector(".chassis-frame");
  if (frame) frame.remove(); // re-draw whenever body changes
  frame = document.createElement("div");
  frame.className = `chassis-frame shape-${body.shape} material-${body.material}`;

  // Shape-specific SVG path/rect so different bodies actually look different.
  let bodySvg = "";
  if (body.shape === "flat") {
    bodySvg = `<rect x="10" y="20" width="80" height="60" rx="6"
                 fill="var(--chassis-fill, rgba(0,217,192,0.12))"
                 stroke="currentColor" stroke-width="1.5" opacity="0.9"/>`;
  } else if (body.shape === "curved") {
    bodySvg = `<rect x="15" y="24" width="70" height="52" rx="26"
                 fill="var(--chassis-fill, rgba(0,217,192,0.12))"
                 stroke="currentColor" stroke-width="1.5" opacity="0.9"/>`;
  } else if (body.shape === "boxy") {
    bodySvg = `<rect x="8" y="15" width="84" height="70" rx="4"
                 fill="var(--chassis-fill, rgba(0,217,192,0.12))"
                 stroke="currentColor" stroke-width="1.5" opacity="0.9"/>`;
  } else if (body.shape === "cylinder") {
    bodySvg = `<ellipse cx="50" cy="50" rx="42" ry="34"
                 fill="var(--chassis-fill, rgba(0,217,192,0.12))"
                 stroke="currentColor" stroke-width="1.5" opacity="0.9"/>`;
  }

  frame.innerHTML = `
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" class="chassis-body-svg">
      ${bodySvg}
    </svg>
    <div class="chassis-label">${mat.emoji} ${body.name}</div>
  `;
  stage.insertBefore(frame, stage.firstChild);

  // Mount point markers, now color-coded + icon-coded by connector type.
  let slotsLayer = stage.querySelector(".chassis-slots");
  if (slotsLayer) slotsLayer.remove();
  slotsLayer = document.createElement("div");
  slotsLayer.className = "chassis-slots";
  getMountPoints(body.id).forEach(mp => {
    const connectorInfo = getConnectorInfo(mp.connectorType);
    const marker = document.createElement("div");
    marker.className = `slot-marker connector-${mp.connectorType}`;
    marker.dataset.slotId = mp.id;
    marker.style.left = `${mp.x}%`;
    marker.style.top = `${mp.y}%`;
    marker.title = `${mp.role} (${connectorInfo.label} ${connectorInfo.emoji})`;
    marker.innerHTML = `<span class="connector-icon">${connectorInfo.emoji}</span>`;
    slotsLayer.appendChild(marker);
  });
  stage.appendChild(slotsLayer);
}

// ---------------------------------------------------------------------------
// Draws a glowing "wire" from the POWER mount point to every other occupied
// mount point, so the machine visually reads as one connected electrical
// system instead of scattered icons pointing at empty space.
// ---------------------------------------------------------------------------
function drawSystemWiring(stage, occupiedMounts) {
  let svg = stage.querySelector(".connector-layer");
  if (!svg) {
    svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "connector-layer");
    svg.setAttribute("viewBox", "0 0 100 100");
    svg.setAttribute("preserveAspectRatio", "none");
    stage.insertBefore(svg, stage.firstChild.nextSibling);
  }
  svg.innerHTML = "";
  const powerMount = occupiedMounts.find(m => m.role === "power");
  if (!powerMount) return;
  occupiedMounts.forEach(m => {
    if (m.slotId === powerMount.slotId) return;
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", powerMount.x);
    line.setAttribute("y1", powerMount.y);
    line.setAttribute("x2", m.x);
    line.setAttribute("y2", m.y);
    line.setAttribute("class", "wire-line");
    svg.appendChild(line);
  });
}

// Renders one real-looking SVG part per unit (respecting quantity), docked
// into its matching chassis slot by role (wheel->wheel slot, battery->power
// bay, microcontroller->brain bay, camera->sensor mount, etc). Extra units
// beyond available slots of that role are placed as satellites just outside
// the chassis so nothing is ever hidden or lost.
function renderWorkspaceChips() {
  const stage = ensureWorkspaceStage();
  const body = getBodyById(state.selectedBodyId);
  renderChassisFrame(stage);
  stage.querySelectorAll(".unit-chip").forEach(el => el.remove());
  const connLayer = stage.querySelector(".connector-layer");
  if (connLayer) connLayer.innerHTML = "";

  const hint = document.getElementById("workspaceHint");
  const validParts = state.parts.filter(p => getTechById(p.techId));
  if (hint) hint.style.display = validParts.length === 0 ? "block" : "none";

  const mountPoints = body ? getMountPoints(body.id) : [];
  const slotOccupancy = {};
  mountPoints.forEach(mp => slotOccupancy[mp.id] = 0);
  let overflowIndex = 0;
  const occupiedMounts = [];

  validParts.forEach(part => {
    syncPositions(part);
    const tech = getTechById(part.techId);
    const role = getTechRole(tech);
    const svgKey = getPartSvgKey(role, tech);
    const size = getSizeById(part.size);

    for (let unitIndex = 0; unitIndex < part.qty; unitIndex++) {
      const chip = document.createElement("div");
      chip.className = `unit-chip role-${role}`;
      chip.style.setProperty("--chip-scale", size.scale);
      chip.dataset.uid = part.uid;
      chip.dataset.unitIndex = unitIndex;
      const unitLabel = part.qty > 1 ? ` #${unitIndex + 1}` : "";
      chip.innerHTML = `${PART_SVG[svgKey]}<span class="chip-label">${tech.name}${unitLabel}</span>`;
      chip.title = `${tech.name}${unitLabel}`;
      chip.classList.add("chip-drop-in");

      const posSlot = part.positions[unitIndex];
      let leftPct, topPct;
      if (posSlot.x !== null && posSlot.y !== null) {
        leftPct = posSlot.x; topPct = posSlot.y;
        if (posSlot.slotId) {
          const mp = mountPoints.find(m => m.id === posSlot.slotId);
          if (mp) occupiedMounts.push({ ...mp, x: leftPct, y: topPct });
        }
      } else {
        const freeMount = findCompatibleMount(tech, role, mountPoints, slotOccupancy);
        if (freeMount) {
          slotOccupancy[freeMount.id]++;
          leftPct = freeMount.x; topPct = freeMount.y;
          part.positions[unitIndex].slotId = freeMount.id;
          part.positions[unitIndex].role = role;
          const connectorInfo = getConnectorInfo(freeMount.connectorType);
          chip.innerHTML += `<span class="connector-tag">${connectorInfo.emoji}</span>`;
          occupiedMounts.push({ ...freeMount, x: leftPct, y: topPct });
        } else {
          const angle = (overflowIndex / 6) * 2 * Math.PI;
          leftPct = 50 + Math.cos(angle) * 44;
          topPct = 50 + Math.sin(angle) * 40;
          overflowIndex++;
          part.positions[unitIndex].slotId = null;
          chip.classList.add("no-connector-match");
          chip.title += " — no matching connector on this body!";
        }
      }
      chip.style.left = `${leftPct}%`;
      chip.style.top = `${topPct}%`;

      makeChipDraggable(chip, part, unitIndex, stage);
      stage.appendChild(chip);
    }
  });

  drawSystemWiring(stage, occupiedMounts);
}
function makeChipDraggable(chip, part, unitIndex, stage) {
  chip.style.cursor = "grab";
  let dragging = false, offsetX = 0, offsetY = 0;
  let moved = false;

  chip.addEventListener("click", () => {
    if (moved) { moved = false; return; }
    part.collapsed = false;
    renderTray();
    const card = document.querySelector(`.part-card[data-uid="${part.uid}"]`);
    if (card) card.scrollIntoView({ behavior: "smooth", block: "center" });
  });

  function onPointerDown(e) {
    dragging = true;
    moved = false;
    chip.classList.add("dragging-chip");
    chip.style.cursor = "grabbing";
    const rect = chip.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    offsetX = clientX - rect.left;
    offsetY = clientY - rect.top;
    e.preventDefault();
    e.stopPropagation();
  }

  function onPointerMove(e) {
    if (!dragging) return;
    const stageRect = stage.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    let leftPx = clientX - stageRect.left - offsetX + (chip.offsetWidth / 2);
    let topPx = clientY - stageRect.top - offsetY + (chip.offsetHeight / 2);
    let leftPct = Math.max(4, Math.min(96, (leftPx / stageRect.width) * 100));
    let topPct = Math.max(4, Math.min(96, (topPx / stageRect.height) * 100));
    chip.style.left = `${leftPct}%`;
    chip.style.top = `${topPct}%`;
        part.positions[unitIndex].x = leftPct;
    part.positions[unitIndex].y = topPct;
    const role = part.positions[unitIndex].role;
    const otherSlots = Array.from(stage.querySelectorAll(".unit-chip"))
      .filter(c => c !== chip).map(c => c.dataset.slotId).filter(Boolean);
    const snapped = findNearestSlot(leftPct, topPct, role, otherSlots);
    part.positions[unitIndex].slotId = snapped ? snapped.id : null;
    if (snapped) { chip.style.left = `${snapped.x}%`; chip.style.top = `${snapped.y}%`; part.positions[unitIndex].x = snapped.x; part.positions[unitIndex].y = snapped.y; }
    moved = true;
  }

  function onPointerUp() {
    dragging = false;
    chip.classList.remove("dragging-chip");
    chip.style.cursor = "grab";
  }

  chip.addEventListener("mousedown", onPointerDown);
  document.addEventListener("mousemove", onPointerMove);
  document.addEventListener("mouseup", onPointerUp);
  chip.addEventListener("touchstart", onPointerDown, { passive: false });
  document.addEventListener("touchmove", onPointerMove, { passive: false });
  document.addEventListener("touchend", onPointerUp);
}

function initSandbox() {
  const workspace = document.getElementById("sandboxWorkspace");
  workspace.addEventListener("dragover", (e) => { e.preventDefault(); workspace.classList.add("drag-over"); });
  workspace.addEventListener("dragleave", () => workspace.classList.remove("drag-over"));
  workspace.addEventListener("drop", (e) => {
    e.preventDefault();
    workspace.classList.remove("drag-over");
    const id = e.dataTransfer.getData("text/plain");
    if (id) addPart(id);
  });

  document.getElementById("clearBtn").addEventListener("click", () => {
    state.parts = [];
    renderTray();
    renderWorkspaceChips();
  });

  document.getElementById("evaluateBtn").addEventListener("click", () => {
    if (state.parts.length === 0) {
      alert("Drag at least one technology into the workspace first!");
      return;
    }
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    document.querySelector('[data-tab="evaluation"]').classList.add("active");
    document.querySelectorAll(".app-section").forEach(s => s.classList.remove("active"));
    document.getElementById("section-evaluation").classList.add("active");
    runEvaluation();
  });

  const missionSelect = document.getElementById("missionSelect");
  missionSelect.innerHTML = `<option value="">No mission — invent freely</option>` +
    MISSIONS.map(m => `<option value="${m.id}">${m.title}</option>`).join("");
  missionSelect.addEventListener("change", () => {
    state.activeMission = missionSelect.value || null;
    const mission = getMissionById(state.activeMission);
    document.getElementById("missionDesc").textContent = mission ? mission.description : "";
  });
}
// ---------------------------------------------------------------------------
// SECTION 3: INTELLIGENT EVALUATION ENGINE
// Combines each part's base tech metrics with its quantity, size, and
// strength/version multipliers (see data/variants.js) before averaging.
// ---------------------------------------------------------------------------
const METRIC_FIELDS = [
  "power","weight","speed","range","efficiency","cost","safety","reliability",
  "environmental","manufacturing","maintainability","autonomy","complexity","innovation"
];

const METRIC_LABELS = {
  power: "Power", weight: "Weight", speed: "Speed", range: "Range",
  efficiency: "Energy Efficiency", cost: "Cost", safety: "Safety",
  reliability: "Reliability", environmental: "Environmental Impact",
  manufacturing: "Ease of Manufacturing", maintainability: "Maintainability",
  autonomy: "Autonomy", complexity: "Complexity", innovation: "Innovation"
};

function computePartMetrics(part) {
  const tech = getTechById(part.techId);
  if (!tech) return null;
  const size = getSizeById(part.size);
  const strength = getStrengthById(part.strength);
  const m = { ...tech.metrics };

  m.weight = Math.min(10, m.weight * size.weightMult);
  m.cost = Math.min(10, m.cost * size.costMult * strength.costMult);
  m.power = Math.min(10, m.power * size.powerMult * strength.powerMult);
  m.range = Math.min(10, m.range * size.rangeMult);
  m.speed = Math.min(10, m.speed * size.speedMult);
  m.reliability = Math.min(10, m.reliability * strength.reliabilityMult);
  m.innovation = Math.min(10, m.innovation * strength.innovationMult);
  m.efficiency = Math.min(10, m.efficiency * strength.efficiencyMult);

  const extra = part.qty - 1;
  if (extra > 0) {
    m.power = Math.min(10, m.power + extra * 0.8);
    m.range = Math.min(10, m.range + extra * 0.5);
    m.speed = Math.min(10, m.speed + extra * 0.4);
    m.weight = Math.min(10, m.weight + extra * 0.7);
    m.cost = Math.min(10, m.cost + extra * 0.6);
    m.complexity = Math.min(10, m.complexity + extra * 0.5);
    m.maintainability = Math.max(0, m.maintainability - extra * 0.3);
  }
  return m;
}

function computeEvaluation() {
  const validParts = state.parts.filter(p => getTechById(p.techId));
  const totals = {};
  METRIC_FIELDS.forEach(f => totals[f] = 0);
  validParts.forEach(part => {
    const m = computePartMetrics(part);
    METRIC_FIELDS.forEach(f => totals[f] += (m[f] || 0));
  });
  const n = Math.max(validParts.length, 1);
  const avg = {};
  METRIC_FIELDS.forEach(f => avg[f] = Math.min(10, totals[f] / n));

  const distinctCount = new Set(validParts.map(p => p.techId)).size;
  avg.complexity = Math.min(10, avg.complexity + Math.max(0, distinctCount - 3) * 0.6);
  avg.cost = Math.min(10, avg.cost + Math.max(0, distinctCount - 3) * 0.4);
  avg.innovation = Math.min(10, avg.innovation + Math.max(0, distinctCount - 2) * 0.5);

  let missionSuitability = null;
  if (state.activeMission) {
    const mission = getMissionById(state.activeMission);
    const allTags = new Set(validParts.flatMap(p => getTechById(p.techId).tags));
    const matched = mission.idealTags.filter(tag => allTags.has(tag));
    missionSuitability = Math.round((matched.length / mission.idealTags.length) * 100);
  }

  const creativityScore = Math.round(Math.min(10, distinctCount * 1.2 + avg.innovation * 0.4) * 10);
  const engineeringScore = Math.round(((avg.reliability + avg.safety + avg.efficiency) / 3) * 10);
  const innovationScore = Math.round(avg.innovation * 10);

  return {
    parts: validParts,
    techs: validParts.map(p => getTechById(p.techId)),
    avg, missionSuitability, creativityScore, engineeringScore, innovationScore
  };
}

function runEvaluation() {
  const evalData = computeEvaluation();
  state.lastEvaluation = evalData;
  const grid = document.getElementById("evalGrid");
  grid.innerHTML = "";
  METRIC_FIELDS.forEach(f => {
    const val = evalData.avg[f];
    const metricDiv = document.createElement("div");
    metricDiv.className = "eval-metric";
    metricDiv.innerHTML = `
      <h4>${METRIC_LABELS[f]}</h4>
      <div class="bar-track"><div class="bar-fill" style="width:${val * 10}%"></div></div>
      <div class="val">${val.toFixed(1)} / 10</div>
    `;
    grid.appendChild(metricDiv);
  });

  const explain = document.getElementById("evalExplain");
  const strengths = METRIC_FIELDS.filter(f => evalData.avg[f] >= 7 && f !== "complexity" && f !== "cost" && f !== "weight");
  const weaknesses = METRIC_FIELDS.filter(f => evalData.avg[f] <= 3 && f !== "complexity" && f !== "cost" && f !== "weight");
  const highCost = evalData.avg.complexity >= 7 || evalData.avg.cost >= 7;

  explain.innerHTML = `
    <h4>Engineering Trade-off Analysis</h4>
    <p><strong>Strengths:</strong> ${strengths.length ? strengths.map(f => METRIC_LABELS[f]).join(", ") : "Balanced but no standout strengths yet — try combining complementary technologies."}</p>
    <p style="margin-top:8px;"><strong>Watch out for:</strong> ${weaknesses.length ? weaknesses.map(f => METRIC_LABELS[f]).join(", ") : "No major weaknesses detected."}</p>
    ${highCost ? '<p style="margin-top:8px;color:var(--accent-4);">This invention is complex and costly to build — real engineers often simplify designs to reduce risk and cost.</p>' : ""}
    ${evalData.missionSuitability !== null ? `<p style="margin-top:8px;"><strong>Mission Suitability:</strong> ${evalData.missionSuitability}% match for "${getMissionById(state.activeMission).title}"</p>` : ""}
  `;
}

// ---------------------------------------------------------------------------
// SECTION 4: BRING TO LIFE — chassis-based free placement stage
// ---------------------------------------------------------------------------
function renderInventionStage() {
  const stage = document.getElementById("inventionStage");
  stage.innerHTML = "";
  const parts = state.parts.filter(p => getTechById(p.techId));
  if (parts.length === 0) {
    stage.innerHTML = "<p style=\"color:var(--text-secondary)\">Build something in the sandbox first!</p>";
    return;
  }

  renderChassisFrame(stage);

  const slotOccupancy = {};
  CHASSIS_SLOTS.forEach(s => slotOccupancy[s.id] = 0);
  let overflowIndex = 0;

  parts.forEach(part => {
    syncPositions(part);
    const tech = getTechById(part.techId);
    const role = getTechRole(tech);
    const roleSlots = getSlotsForRole(role);
    const svgKey = getPartSvgKey(role, tech);
    const size = getSizeById(part.size);
    const strength = getStrengthById(part.strength);

    for (let unitIndex = 0; unitIndex < part.qty; unitIndex++) {
      const badge = document.createElement("div");
      badge.className = `part-badge anim-${tech.animation} role-${role}`;
      badge.style.setProperty("--chip-scale", size.scale);
      badge.dataset.uid = part.uid;
      badge.dataset.unitIndex = unitIndex;
      const unitLabel = part.qty > 1 ? ` #${unitIndex + 1}` : "";
      badge.innerHTML = `${PART_SVG[svgKey]}<span class="badge-label">${tech.name}${unitLabel}</span><span class="badge-strength">${strength.emoji}</span>`;
      badge.title = `${tech.name}${unitLabel}`;

      const posSlot = part.positions[unitIndex];
      let leftPct, topPct;
      if (posSlot.x !== null && posSlot.y !== null) {
        leftPct = posSlot.x; topPct = posSlot.y;
      } else {
      const freeSlot = roleSlots.find(s => slotOccupancy[s.id] === 0);
        if (freeSlot) {
          slotOccupancy[freeSlot.id]++;
          leftPct = freeSlot.x; topPct = freeSlot.y;
          posSlot.slotId = freeSlot.id;
          posSlot.role = role;
        } else {
          const angle = (overflowIndex / 6) * 2 * Math.PI;
          leftPct = 50 + Math.cos(angle) * 44;
          topPct = 50 + Math.sin(angle) * 40;
          overflowIndex++;
        }
      }
      badge.style.left = `${leftPct}%`;
      badge.style.top = `${topPct}%`;

      makeBadgeDraggable(badge, part, unitIndex, stage);
      stage.appendChild(badge);
    }
  });
}

function makeBadgeDraggable(badge, part, unitIndex, stage) {
  badge.style.cursor = "grab";
  let dragging = false, offsetX = 0, offsetY = 0;

  function onPointerDown(e) {
    dragging = true;
    badge.classList.add("dragging-badge");
    badge.style.cursor = "grabbing";
    const rect = badge.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    offsetX = clientX - rect.left;
    offsetY = clientY - rect.top;
    e.preventDefault();
  }
    function onPointerMove(e) {
    if (!dragging) return;
    const stageRect = stage.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    let leftPx = clientX - stageRect.left - offsetX + (badge.offsetWidth / 2);
    let topPx = clientY - stageRect.top - offsetY + (badge.offsetHeight / 2);
    let leftPct = Math.max(4, Math.min(96, (leftPx / stageRect.width) * 100));
    let topPct = Math.max(4, Math.min(96, (topPx / stageRect.height) * 100));
    badge.style.left = `${leftPct}%`;
    badge.style.top = `${topPct}%`;
    part.positions[unitIndex].x = leftPct;
    part.positions[unitIndex].y = topPct;
  }

  function onPointerUp() {
    dragging = false;
    badge.classList.remove("dragging-badge");
    badge.style.cursor = "grab";
  }

  badge.addEventListener("mousedown", onPointerDown);
  document.addEventListener("mousemove", onPointerMove);
  document.addEventListener("mouseup", onPointerUp);
  badge.addEventListener("touchstart", onPointerDown, { passive: false });
  document.addEventListener("touchmove", onPointerMove, { passive: false });
  document.addEventListener("touchend", onPointerUp);
}

// ---------------------------------------------------------------------------
// SECTION: CELEBRATION + CERTIFICATE
// ---------------------------------------------------------------------------
function fireConfetti() {
  const canvas = document.getElementById("confettiCanvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const ctx = canvas.getContext("2d");
  const colors = ["#7c5cff", "#00d9c0", "#ff5c8a", "#ffb020"];
  const particles = Array.from({ length: 150 }, () => ({
    x: Math.random() * canvas.width,
    y: -20 - Math.random() * canvas.height * 0.3,
    r: 3 + Math.random() * 5,
    color: colors[Math.floor(Math.random() * colors.length)],
    vy: 2 + Math.random() * 3,
    vx: -1 + Math.random() * 2,
    rot: Math.random() * 360
  }));
  let frame = 0;
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.y += p.vy; p.x += p.vx; p.rot += 4;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rot * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r);
      ctx.restore();
    });
    frame++;
    if (frame < 150) requestAnimationFrame(draw);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  draw();
}

function showCelebration() {
  const connections = computeConnections(state.parts);
  if (!connections.isComplete) {
    alert(getConnectionMessage(connections));
    return;
    }
  const evalData = state.lastEvaluation || computeEvaluation();
  const overlay = document.getElementById("celebrationOverlay");
  const deviceName = document.getElementById("deviceName").value || "Untitled Invention";
  const partSummary = evalData.parts.map(p => {
    const tech = getTechById(p.techId);
    const size = getSizeById(p.size);
    const strength = getStrengthById(p.strength);
    return `${tech.icon} ${tech.name} (${size.label}, ${strength.label}${p.qty > 1 ? `, ×${p.qty}` : ""})`;
  }).join(", ");
  document.getElementById("certificate").innerHTML = `
    <p><strong>Device Name:</strong> ${deviceName}</p>
    <p><strong>Inventor:</strong> Rajeswara Rao Bhandaru</p>
    <p><strong>Technologies Used:</strong> ${partSummary}</p>
    <p><strong>Innovation Score:</strong> ${evalData.innovationScore}/100</p>
    <p><strong>Creativity Score:</strong> ${evalData.creativityScore}/100</p>
    <p><strong>Engineering Score:</strong> ${evalData.engineeringScore}/100</p>
    ${evalData.missionSuitability !== null ? `<p><strong>Mission Suitability:</strong> ${evalData.missionSuitability}%</p>` : ""}
  `;
  overlay.classList.remove("hidden");
  fireConfetti();
  saveProgress(deviceName, evalData);
}


function saveProgress(deviceName, evalData) {
  const saved = JSON.parse(localStorage.getItem("ba_inventions") || "[]");
  saved.push({
    name: deviceName,
    parts: evalData.parts,
    scores: {
      innovation: evalData.innovationScore,
      creativity: evalData.creativityScore,
      engineering: evalData.engineeringScore
    },
    date: new Date().toISOString()
  });
  localStorage.setItem("ba_inventions", JSON.stringify(saved));
}

// ---------------------------------------------------------------------------
// WIRING
// ---------------------------------------------------------------------------
function initHeader() {
  document.getElementById("globalSearch").addEventListener("input", (e) => {
    state.searchQuery = e.target.value;
    renderLibrary();
  });
  document.getElementById("favToggle").addEventListener("click", (e) => {
    state.showFavoritesOnly = !state.showFavoritesOnly;
    e.target.classList.toggle("active-fav", state.showFavoritesOnly);
    renderLibrary();
  });
}

function initEvaluationToLife() {
  document.getElementById("goLifeBtn").addEventListener("click", () => {
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    document.querySelector('[data-tab="life"]').classList.add("active");
    document.querySelectorAll(".app-section").forEach(s => s.classList.remove("active"));
    document.getElementById("section-life").classList.add("active");
    renderInventionStage();
  });
  document.getElementById("celebrateBtn").addEventListener("click", showCelebration);
  document.getElementById("closeCelebration").addEventListener("click", () => {
    document.getElementById("celebrationOverlay").classList.add("hidden");
  });
}

function init() {
  document.getElementById("section-library").classList.add("active");
  initTabs();
  initModal();
  initHeader();
  initSandbox();
  initEvaluationToLife();
  renderCategoryFilter();
  renderLibrary();
  renderPalette();
  renderTray();
  renderWorkspaceChips();
}

document.addEventListener("DOMContentLoaded", init);

import { generateQuiz, LEVELS } from './data/quizGenerator.js';

const POINTS = {
  easy:   { full: 3, partial: 1.5 },
  medium: { full: 5, partial: 2.5 },
  hard:   { full: 8, partial: 4 },
};

let quizState = { level: null, questions: [], index: 0, score: 0, attempt: 1 };

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
  document.getElementById(id).classList.remove('hidden');
}

function renderLevelSelect() {
  const container = document.getElementById('quiz-level-select');
  container.innerHTML = `
    <h2>🏆 Test Your Technological Knowledge</h2>
    <div class="quiz-levels">
      <div class="quiz-level-card" data-level="easy">🚀 EXPLORER<br>Easy · 30 Qs</div>
      <div class="quiz-level-card" data-level="medium">⚙️ ENGINEER<br>Medium · 25 Qs</div>
      <div class="quiz-level-card" data-level="hard">🧠 INVENTOR<br>Hard · 20 Qs</div>
    </div>`;
  container.querySelectorAll('.quiz-level-card').forEach(card => {
    card.addEventListener('click', () => startQuiz(card.dataset.level));
  });
  showScreen('quiz-level-select');
}

function startQuiz(levelKey) {
  quizState = { level: levelKey, questions: generateQuiz(levelKey), index: 0, score: 0, attempt: 1 };
  renderQuestion();
}

function renderQuestion() {
  const q = quizState.questions[quizState.index];
  const container = document.getElementById('quiz-question-screen');
  container.innerHTML = `
    <p>Question ${quizState.index + 1} of ${quizState.questions.length} · Score: ${quizState.score}</p>
    <h3>${q.question}</h3>
    <div class="quiz-options">
      ${q.options.map(opt => `<button class="quiz-option">${opt}</button>`).join('')}
    </div>
    <div class="quiz-hint hidden"></div>`;

  container.querySelectorAll('.quiz-option').forEach(btn => {
    btn.addEventListener('click', () => handleAnswer(btn, q));
  });
  showScreen('quiz-question-screen');
}

function handleAnswer(btn, q) {
  const points = POINTS[quizState.level];
  const hintBox = document.querySelector('#quiz-question-screen .quiz-hint');

  if (btn.textContent === q.correctAnswer) {
    quizState.score += quizState.attempt === 1 ? points.full : points.partial;
    nextQuestion();
  } else if (quizState.attempt === 1) {
    quizState.attempt = 2;
    btn.disabled = true;
hintBox.textContent = `🔍 Hint: think about this technology's core purpose. Try again!`;
    hintBox.classList.remove('hidden');
  } else {
    hintBox.textContent = `✅ Correct answer: ${q.correctAnswer}`;
    hintBox.classList.remove('hidden');
    setTimeout(nextQuestion, 1800);
  }
}

function nextQuestion() {
  quizState.attempt = 1;
  quizState.index++;
  if (quizState.index < quizState.questions.length) {
    renderQuestion();
  } else {
    renderSummary();
  }
}

function renderSummary() {
  const container = document.getElementById('quiz-summary-screen');
  container.innerHTML = `
    <h2>Quiz Complete! 🎉</h2>
    <p>Score: ${quizState.score}</p>
    <button id="quiz-retry">Try Again</button>
    <button id="quiz-back">Back to Levels</button>`;
  document.getElementById('quiz-retry').addEventListener('click', () => startQuiz(quizState.level));
  document.getElementById('quiz-back').addEventListener('click', renderLevelSelect);
  showScreen('quiz-summary-screen');
}

document.querySelector('[data-tab="tech-quiz"]')
.addEventListener('click', renderLevelSelect);
console.log("Quiz Zone script loaded");

import { matchGoalToParts } from './data/goalMatcher.js';

const BHAVA_API_URL = 'http://localhost:3000/api/bhava';

async function askBhavaAI(goalText) {
  const response = await fetch(BHAVA_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ goal: goalText })
  });
  if (!response.ok) throw new Error('Bhava server error');
  return response.json();
}

function renderGoalCards(techList, message) {
  const resultsDiv = document.getElementById('goalResults');
  if (techList.length === 0) {
    resultsDiv.innerHTML = `<p>🤔 Hmm, I couldn't find matching parts yet. Try mentioning things like "fly", "move", "sense", or "power".</p>`;
    return;
  }
  resultsDiv.innerHTML = `
    <p>${message}</p>
    <div class="quiz-levels">
      ${techList.map(tech => `
        <button class="goal-suggestion-card" type="button" data-tech-id="${tech.id}">
          <span class="goal-card-name">${tech.icon} ${tech.name}</span>
          <span class="goal-card-action">Add to my invention</span>
        </button>
      `).join('')}
    </div>
  `;
  resultsDiv.querySelectorAll('.goal-suggestion-card').forEach(btn => {
    btn.addEventListener('click', () => addPart(btn.dataset.techId));
  });
}

document.getElementById('goalSubmitBtn').addEventListener('click', async () => {
  const goalText = document.getElementById('goalInput').value.trim();
  const resultsDiv = document.getElementById('goalResults');
  if (!goalText) {
    resultsDiv.innerHTML = `<p>Type an idea first, then tap Suggest Parts.</p>`;
    return;
  }
  resultsDiv.innerHTML = `<p>Bhava is thinking…</p>`;

  try {
    const data = await askBhavaAI(goalText);
    const validTechs = data.techIds.map(id => getTechById(id)).filter(Boolean);
    renderGoalCards(validTechs, data.message);
  } catch (err) {
    console.warn('Bhava AI unavailable, using offline matcher:', err.message);
    const result = matchGoalToParts(goalText);
    if (!result.matched) {
      resultsDiv.innerHTML = `<p>🤔 Hmm, I couldn't find matching parts yet. Try mentioning things like "fly", "move", "sense", or "power".</p>`;
      return;
    }
    renderGoalCards(result.parts, `Here's what I found for: <strong>${result.categories.join(', ')}</strong>`);
  }
});
