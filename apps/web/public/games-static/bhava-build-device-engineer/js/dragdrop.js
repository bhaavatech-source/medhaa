
export class DragDropController {
  constructor({ onDrop, onDragStart, onDragEnd } = {}) {
    this.onDrop = onDrop || (() => {});
    this.onDragStart = onDragStart || (() => {});
    this.onDragEnd = onDragEnd || (() => {});
    this.draggedPayload = null;
  }
  makeDraggable(el, payload) {
    el.setAttribute("draggable", "true");
    const select = () => {
      this.draggedPayload = payload;
      document.querySelectorAll(".palette-item").forEach((p) => p.classList.remove("dragging"));
      el.classList.add("dragging");
      this.onDragStart(payload);
    };
    el.addEventListener("dragstart", (e) => {
      select();
      e.dataTransfer.setData("text/plain", JSON.stringify(payload));
    });
    el.addEventListener("dragend", () => { el.classList.remove("dragging"); this.onDragEnd(payload); });
    el.addEventListener("touchstart", select, { passive: true });
    el.addEventListener("click", select);
  }
  makeDropTarget(el, slotKey) {
    el.addEventListener("dragover", (e) => { e.preventDefault(); el.classList.add("drag-over"); });
    el.addEventListener("dragleave", () => el.classList.remove("drag-over"));
    el.addEventListener("drop", (e) => {
      e.preventDefault();
      el.classList.remove("drag-over");
      let payload = this.draggedPayload;
      try {
        const raw = e.dataTransfer.getData("text/plain");
        if (raw) payload = JSON.parse(raw);
      } catch (_) {}
      if (payload) this.onDrop(slotKey, payload);
      document.querySelectorAll(".palette-item").forEach((p) => p.classList.remove("dragging"));
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
