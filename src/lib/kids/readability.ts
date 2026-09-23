/**
 * Reading-level statistics for kids stories.
 *
 * Flesch–Kincaid grade level with a syllable heuristic — no dependency, and
 * accurate enough to catch drafts that are plainly wrong for their age band.
 * The reviewer sees the computed grade next to Approve/Reject; it informs a
 * human decision rather than replacing one.
 */

export type AgeBand = 'AGE_6_8' | 'AGE_9_12'

export interface AgeBandRules {
  label: string
  /** Inclusive Flesch–Kincaid grade range. */
  minGrade: number
  maxGrade: number
  maxWordsPerSentence: number
  maxWords: number
}

/**
 * Grade ceilings sit roughly half a grade above the usual targets for each
 * band. Flesch–Kincaid weights syllables per word heavily, and this subject
 * cannot avoid multisyllabic proper nouns — Abraham, Ishmael, Jerusalem — so
 * prose that is genuinely simple in sentence structure still scores high. The
 * sentence-length and word-count limits, which those names do not distort, do
 * the stricter work; the grade is a secondary signal.
 */
export const AGE_BAND_RULES: Record<AgeBand, AgeBandRules> = {
  AGE_6_8: {
    label: 'Ages 6–8 (read together)',
    minGrade: 0,
    maxGrade: 4,
    maxWordsPerSentence: 12,
    maxWords: 180,
  },
  AGE_9_12: {
    label: 'Ages 9–12 (read alone)',
    minGrade: 3,
    maxGrade: 7,
    maxWordsPerSentence: 18,
    maxWords: 350,
  },
}

export interface ReadabilityStats {
  words: number
  sentences: number
  syllables: number
  longestSentenceWords: number
  averageWordsPerSentence: number
  /** Flesch–Kincaid grade level, rounded to one decimal. */
  grade: number
}

function splitSentences(text: string): string[] {
  return text
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter(Boolean)
}

function splitWords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z\s'-]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
}

/**
 * Vowel-group syllable estimate: strip silent trailing "e"/"es"/"ed", then
 * count vowel groups, with a floor of one.
 *
 * `l` sits in the silent-e exclusion class on purpose — it is what keeps the
 * sounded "-le" ending intact, so "candle" and "little" score 2 rather than 1.
 * Adding a separate "-le" adjustment on top would double-count them.
 *
 * Known limitation: adjacent vowels that span a syllable break are counted as
 * one ("creation" scores 2, not 3). Splitting them would break far more common
 * words ("beat", "read"), and the guard only needs to separate simple prose
 * from complex prose, not to be a pronunciation dictionary.
 */
export function countSyllables(word: string): number {
  const w = word.toLowerCase().replace(/[^a-z]/g, '')
  if (!w) return 0
  if (w.length <= 3) return 1

  const working = w.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '').replace(/^y/, '')
  const groups = working.match(/[aeiouy]{1,2}/g)

  return Math.max(1, groups ? groups.length : 0)
}

export function analyseReadability(text: string): ReadabilityStats {
  const sentences = splitSentences(text)
  const words = splitWords(text)
  const syllables = words.reduce((sum, w) => sum + countSyllables(w), 0)

  const sentenceCount = Math.max(1, sentences.length)
  const wordCount = Math.max(1, words.length)

  const longestSentenceWords = sentences.reduce(
    (max, s) => Math.max(max, splitWords(s).length),
    0,
  )

  // Flesch–Kincaid grade level.
  const grade =
    0.39 * (wordCount / sentenceCount) + 11.8 * (syllables / wordCount) - 15.59

  return {
    words: words.length,
    sentences: sentences.length,
    syllables,
    longestSentenceWords,
    averageWordsPerSentence: Math.round((wordCount / sentenceCount) * 10) / 10,
    grade: Math.round(grade * 10) / 10,
  }
}
