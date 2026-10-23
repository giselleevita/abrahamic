export const FAMILY_HOLD = '[EDITORIAL HOLD] '
type Entry = { from: string; to: string; type: string; verseKey?: string; notes?: string }
export const MOTHER_REFERENCES = [
  { from: 'hagar', to: 'ishmael', key: 'hagar-ishmael', book: 'Genesis', chapter: 16, verse: 15, source: 'TORAH' as const, note: 'Mother of Ishmael' },
  { from: 'sarah', to: 'isaac', key: 'sarah-isaac', book: 'Genesis', chapter: 21, verse: 3, source: 'TORAH' as const, note: 'Mother of Isaac' },
  { from: 'rebekah', to: 'jacob', key: 'rebekah-jacob', book: 'Genesis', chapter: 25, verse: 26, source: 'TORAH' as const, note: 'Mother of Jacob' },
  { from: 'rebekah', to: 'esau', key: 'rebekah-esau', book: 'Genesis', chapter: 25, verse: 25, source: 'TORAH' as const, note: 'Mother of Esau' },
  { from: 'mary', to: 'jesus', key: 'mary-jesus', book: 'Luke', chapter: 2, verse: 7, source: 'NEW_TESTAMENT' as const, note: 'Mother' },
]
/** Correct only repository-owned seed definitions; unresolved entries remain stored but withheld. */
export function normalizeFamilyEntry(entry: Entry): Entry {
  const mother = MOTHER_REFERENCES.find((ref) => ref.from === entry.from && ref.to === entry.to && entry.type === 'SPOUSE')
  if (mother) return { ...entry, type: 'PARENT', verseKey: mother.key, notes: mother.note }
  const unresolved = entry.type === 'CHILD'
    || /^\[(Sirah|Hadith|Qur'an 3:144)/.test(entry.notes ?? '')
    || ['zerubbabel-abijah-nt', 'abijah-nt-eliakim', 'jacob-nt-joseph', 'joseph-jesus'].includes(entry.verseKey ?? '')
    || (entry.from === 'jesus' && entry.to === 'james-the-less')
  if (unresolved) return { ...entry, notes: `${FAMILY_HOLD}${entry.notes || 'Identity or source attribution requires verification.'}` }
  if (entry.verseKey === 'ishmael-kedar') return { ...entry, notes: 'Genesis 25:13 records Kedar among the sons of Ishmael.' }
  return entry
}
