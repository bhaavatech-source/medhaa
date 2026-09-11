
export class DragDropController {
  constructor({ onDrop, onDragStart, onDragEnd } = {}) {
    this.onDrop = onDrop || (() => {});
    this.onDragStart = onDragStart || (() => {});
    this.onDragEnd = onDragEnd || (() => {});
    this.draggedPayload = null;
    this.ghostEl = null;
    this.touchMoved = false;
  }
  #spawnGhost(el, x, y) {
    const ghost = el.cloneNode(true);
    ghost.classList.add("drag-ghost");
    ghost.style.width = el.getBoundingClientRect().width + "px";
    document.body.appendChild(ghost);
    this.ghostEl = ghost;
    this.#moveGhost(x, y);
  }
  #moveGhost(x, y) {
    if (!this.ghostEl) return;
    this.ghostEl.style.left = x + "px";
    this.ghostEl.style.top = y + "px";
  }
  #slotAt(x, y) {
    const target = document.elementFromPoint(x, y);
    return target ? target.closest(".slot") : null;
  }
  #clearSlotHighlight() {
    document.querySelectorAll(".slot.drag-over").forEach((s) => s.classList.remove("drag-over"));
  }
  makeDraggable(el, payload) {
    el.setAttribute("draggable", "true");
    el.addEventListener("dragstart", (e) => {
      this.draggedPayload = payload;
      el.classList.add("dragging");
      e.dataTransfer.setData("text/plain", JSON.stringify(payload));
      this.onDragStart(payload);
    });
    el.addEventListener("dragend", () => { el.classList.remove("dragging"); this.onDragEnd(payload); });
    el.addEventListener("touchstart", (e) => {
      this.draggedPayload = payload;
      this.touchMoved = false;
      document.querySelectorAll(".palette-item").forEach((p) => p.classList.remove("dragging"));
      el.classList.add("dragging");
      this.onDragStart(payload);
      const t = e.touches[0];
      this.#spawnGhost(el, t.clientX, t.clientY);
    }, { passive: true });
    el.addEventListener("touchmove", (e) => {
      if (!this.ghostEl) return;
      this.touchMoved = true;
      const t = e.touches[0];
      this.#moveGhost(t.clientX, t.clientY);
      this.#clearSlotHighlight();
      const slot = this.#slotAt(t.clientX, t.clientY);
      if (slot) slot.classList.add("drag-over");
    }, { passive: true });
    el.addEventListener("touchend", (e) => {
      if (this.ghostEl) { this.ghostEl.remove(); this.ghostEl = null; }
      this.#clearSlotHighlight();
      if (this.touchMoved) {
        const t = e.changedTouches[0];
        const slot = this.#slotAt(t.clientX, t.clientY);
        if (slot && slot.dataset.slot) {
          this.onDrop(slot.dataset.slot, this.draggedPayload);
          el.classList.remove("dragging");
          this.draggedPayload = null;
        }
      }
      this.touchMoved = false;
    });
  }
  makeDropTarget(el, slotKey) {
    el.addEventListener("dragover", (e) => { e.preventDefault(); el.classList.add("drag-over"); });
    el.addEventListener("dragleave", () => el.classList.remove("drag-over"));
    el.addEventListener("drop", (e) => {
      e.preventDefault();
      el.classList.remove("drag-over");
      let payload = this.draggedPayload;
      try { const raw = e.dataTransfer.getData("text/plain"); if (raw) payload = JSON.parse(raw); } catch (_) {}
      if (payload) this.onDrop(slotKey, payload);
      this.draggedPayload = null;
    });
    el.addEventListener("click", () => {
      if (this.draggedPayload) {
        this.onDrop(slotKey, this.draggedPayload);
        document.querySelectorAll(".palette-item").forEach((p) => p.classList.remove("dragging"));
        this.draggedPayload = null;
      }
    });
  }
}
