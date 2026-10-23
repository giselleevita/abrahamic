export type DiffWord = { text: string; shared: boolean }

const norm = (w: string) => w.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '')

/**
 * Marks which words of `b` also appear, in order, in `a` (longest common
 * subsequence). A word that is not shared only means it is absent from the
 * other version; it is a prompt to read closely, not a claim that the
 * versions disagree.
 */
export function diffWords(a: string, b: string): { a: DiffWord[]; b: DiffWord[] } {
  const wa = a.split(/\s+/).filter(Boolean)
  const wb = b.split(/\s+/).filter(Boolean)
  const na = wa.map(norm)
  const nb = wb.map(norm)
  const n = wa.length
  const m = wb.length
  // lcs[i][j] = length of the LCS of na[i..] and nb[j..]
  const lcs: number[][] = Array.from({ length: n + 1 }, () => new Array<number>(m + 1).fill(0))
  for (let i = n - 1; i >= 0; i--)
    for (let j = m - 1; j >= 0; j--)
      lcs[i][j] = na[i] && na[i] === nb[j] ? lcs[i + 1][j + 1] + 1 : Math.max(lcs[i + 1][j], lcs[i][j + 1])
  const sa = new Array<boolean>(n).fill(false)
  const sb = new Array<boolean>(m).fill(false)
  let i = 0
  let j = 0
  while (i < n && j < m) {
    if (na[i] && na[i] === nb[j]) { sa[i] = sb[j] = true; i++; j++ }
    else if (lcs[i + 1][j] >= lcs[i][j + 1]) i++
    else j++
  }
  return {
    a: wa.map((text, k) => ({ text, shared: sa[k] })),
    b: wb.map((text, k) => ({ text, shared: sb[k] })),
  }
}
