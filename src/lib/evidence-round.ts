export type Trad = 'JEWISH' | 'CHRISTIAN' | 'ISLAMIC'
export const EVIDENCE_TRADITIONS: Trad[] = ['JEWISH', 'CHRISTIAN', 'ISLAMIC']

/**
 * One round: two statements from each tradition, different every round, and
 * mixed so the traditions do not arrive in column order. Deterministic, so a
 * cached page and a returning player see the same rounds.
 */
export function pickRound<T extends { id: number; tradition: Trad }>(pool: T[], round: number, perTradition = 2): T[] {
  const picked: T[] = []
  for (const t of EVIDENCE_TRADITIONS) {
    const list = pool.filter((c) => c.tradition === t)
    if (list.length === 0) continue
    for (let k = 0; k < Math.min(perTradition, list.length); k++) picked.push(list[(round * perTradition + k) % list.length])
  }
  const unique = picked.filter((c, i) => picked.findIndex((x) => x.id === c.id) === i)
  const shift = (round * 2 + 1) % Math.max(1, unique.length)
  // Stride by a number coprime to the length so the order is a true permutation.
  const n = unique.length
  const stride = [1, 5, 7, 11, 13].find((s) => gcd(s, n) === 1) ?? 1
  return unique.map((_, i) => unique[(i * stride + shift) % n])
}

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b)
}
