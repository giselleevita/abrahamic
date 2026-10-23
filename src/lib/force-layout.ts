export type FNode = { id: string }
export type FLink = { a: string; b: string; weight?: number }
export type Placed = { id: string; x: number; y: number }

/**
 * A small deterministic force layout: nodes repel, linked nodes attract, and a
 * weak pull keeps everything centred. No randomness, so the same graph always
 * lays out the same way (server and client agree, tests are stable).
 */
export function forceLayout(nodes: FNode[], links: FLink[], width: number, height: number, iterations = 260): Placed[] {
  const n = nodes.length
  if (n === 0) return []
  const cx = width / 2
  const cy = height / 2
  const r0 = Math.min(width, height) * 0.38
  const pos = nodes.map((node, i) => {
    const angle = (i / n) * Math.PI * 2
    return { id: node.id, x: cx + Math.cos(angle) * r0, y: cy + Math.sin(angle) * r0, vx: 0, vy: 0 }
  })
  const index = new Map(pos.map((p, i) => [p.id, i]))
  const edges = links
    .map((l) => ({ a: index.get(l.a), b: index.get(l.b), w: l.weight ?? 1 }))
    .filter((e): e is { a: number; b: number; w: number } => e.a !== undefined && e.b !== undefined && e.a !== e.b)
  const k = Math.sqrt((width * height) / n) * 0.7

  for (let step = 0; step < iterations; step++) {
    const cool = 1 - step / iterations
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        let dx = pos[i].x - pos[j].x
        let dy = pos[i].y - pos[j].y
        let d2 = dx * dx + dy * dy
        if (d2 < 0.01) { dx = (i % 2 ? 1 : -1) * 0.1; dy = (j % 2 ? 1 : -1) * 0.1; d2 = dx * dx + dy * dy }
        const d = Math.sqrt(d2)
        const f = (k * k) / d
        pos[i].vx += (dx / d) * f; pos[i].vy += (dy / d) * f
        pos[j].vx -= (dx / d) * f; pos[j].vy -= (dy / d) * f
      }
    }
    for (const e of edges) {
      const dx = pos[e.b].x - pos[e.a].x
      const dy = pos[e.b].y - pos[e.a].y
      const d = Math.sqrt(dx * dx + dy * dy) || 0.01
      const f = (d * d) / k * Math.min(2, 0.6 + e.w * 0.2)
      pos[e.a].vx += (dx / d) * f; pos[e.a].vy += (dy / d) * f
      pos[e.b].vx -= (dx / d) * f; pos[e.b].vy -= (dy / d) * f
    }
    for (const p of pos) {
      p.vx += (cx - p.x) * 0.02
      p.vy += (cy - p.y) * 0.02
      const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy) || 1
      const limit = 12 * cool + 0.5
      p.x += (p.vx / speed) * Math.min(speed, limit)
      p.y += (p.vy / speed) * Math.min(speed, limit)
      p.x = Math.min(width - 50, Math.max(50, p.x))
      p.y = Math.min(height - 30, Math.max(30, p.y))
      p.vx = 0; p.vy = 0
    }
  }
  return pos.map(({ id, x, y }) => ({ id, x, y }))
}
