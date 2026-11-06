type Point = { x: number; y: number };

export function layoutMarkers(starts: Point[], radius: number, width: number, height: number): Point[] {
  const gap = radius * 2 + 3;
  const placed: Point[] = [];
  return starts.map((start, index) => {
    const available = (p: Point) => p.x >= radius && p.x <= width - radius
      && p.y >= radius && p.y <= height - radius
      && placed.every(q => Math.hypot(p.x - q.x, p.y - q.y) >= gap)
      && starts.every((q, i) => i <= index || Math.hypot(p.x - q.x, p.y - q.y) >= gap);
    for (let ring = 0; ring < 100; ring++) {
      const count = ring === 0 ? 1 : 16;
      for (let step = 0; step < count; step++) {
        const angle = -Math.PI / 2 + step * Math.PI * 2 / count;
        const p = { x: start.x + Math.cos(angle) * gap * ring, y: start.y + Math.sin(angle) * gap * ring };
        if (available(p)) {
          placed.push(p);
          return p;
        }
      }
    }
    throw new Error("Writing guide has insufficient space for its stroke labels.");
  });
}
