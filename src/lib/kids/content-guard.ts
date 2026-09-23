/**
 * Deterministic safety checks for kids-story drafts.
 *
 * The generation prompt states these rules, but a prompt is a request, not a
 * guarantee. This guard runs on every draft before it is written, so a model
 * that drifts produces a blocked draft with stated reasons rather than a
 * plausible-looking story in the review queue.
 *
 * Pure and dependency-free by design: it is the most testable surface in the
 * kids pipeline, and it must behave identically on the server and in tests.
 */
import { REMOVED_TRANSLATION_NAMES } from '@/lib/public-demo-policy'
import { AGE_BAND_RULES, analyseReadability, type AgeBand } from '@/lib/kids/readability'

export interface GuardResult {
  ok: boolean
  reasons: string[]
  /** Non-blocking observations for the reviewer. */
  warnings: string[]
}

/**
 * Words that adjudicate between traditions or assert a text is factually
 * settled. The platform describes what each text says; these terms editorialise.
 */
const EVALUATIVE_TERMS = [
  'truly', 'actually', 'correctly', 'the real', 'proves', 'proven',
  'superseded', 'fulfilled', 'corrected', 'the true', 'obviously',
  'clearly shows', 'merely', 'just a', 'false', 'wrong', 'right religion',
]

/** Second-person religious instruction — the platform never catechises. */
const INSTRUCTION_PATTERNS: { pattern: RegExp; label: string }[] = [
  { pattern: /\byou (?:should|must|need to|have to) (?:pray|believe|worship|obey|follow|repent)\b/i, label: 'second-person religious instruction' },
  { pattern: /\bwe believe\b/i, label: 'first-person-plural belief claim ("we believe")' },
  { pattern: /\bour (?:faith|religion|prophet|lord)\b/i, label: 'first-person-plural religious possessive' },
  { pattern: /\byou (?:will|shall) be (?:saved|punished|judged)\b/i, label: 'salvation or punishment addressed to the reader' },
]

/**
 * Content unsuitable for the age bands. If source claims concern these, the
 * model is instructed to decline rather than sanitise, so a hit here means the
 * draft went ahead anyway.
 */
const DISTRESSING_TERMS = [
  'kill', 'killed', 'killing', 'slaughter', 'massacre', 'blood',
  'torture', 'burned alive', 'hell', 'damned', 'eternal fire', 'rape',
  'behead', 'crucify', 'crucified', 'stoned to death',
]

/** Figural description of prophets is contested; refer to them by name only. */
const DEPICTION_PATTERN =
  /\b(?:muhammad|the prophet|jesus|moses|abraham)\b[^.!?]{0,40}\b(?:looked like|appearance|face|beard|eyes|hair|tall|handsome|skin)\b/i

function findAll(haystack: string, needles: string[]): string[] {
  const lower = haystack.toLowerCase()
  return needles.filter((n) => lower.includes(n.toLowerCase()))
}

export interface GuardInput {
  title: string
  body: string
  ageBand: AgeBand
}

export function guardKidsStory({ title, body, ageBand }: GuardInput): GuardResult {
  const reasons: string[] = []
  const warnings: string[] = []
  const text = `${title}\n${body}`

  // 1. Licensed translations must never appear, by name or by quotation.
  const licensed = findAll(text, [...REMOVED_TRANSLATION_NAMES])
  if (licensed.length) {
    reasons.push(`References a licensed translation: ${licensed.join(', ')}`)
  }

  // A long double-quoted span is very likely quoted scripture. Short quoted
  // words (a term being defined) are fine.
  const quoted = [...text.matchAll(/["“]([^"”]{40,})["”]/g)]
  if (quoted.length) {
    reasons.push(
      `Contains ${quoted.length} long quoted passage(s); kids stories must refer to passages by reference, not quote them`,
    )
  }

  // 2. Neutrality.
  const evaluative = findAll(text, EVALUATIVE_TERMS)
  if (evaluative.length) {
    reasons.push(`Uses evaluative language: ${evaluative.join(', ')}`)
  }

  for (const { pattern, label } of INSTRUCTION_PATTERNS) {
    if (pattern.test(text)) reasons.push(`Contains ${label}`)
  }

  // 3. Age-appropriateness of subject matter.
  const distressing = findAll(text, DISTRESSING_TERMS)
  if (distressing.length) {
    reasons.push(`Contains distressing content: ${distressing.join(', ')}`)
  }

  if (DEPICTION_PATTERN.test(text)) {
    reasons.push('Describes the physical appearance of a prophet')
  }

  // 4. Attribution — a story that never names a text is narrating as fact.
  if (!/\b(?:torah|bible|quran|gospel|hebrew bible|new testament|these books|the books)\b/i.test(body)) {
    reasons.push('Never attributes the story to a text (e.g. "The Torah tells this story as…")')
  }

  // 5. Reading level for the band.
  const rules = AGE_BAND_RULES[ageBand]
  const stats = analyseReadability(body)

  if (stats.words > rules.maxWords) {
    reasons.push(`Too long for ${rules.label}: ${stats.words} words (max ${rules.maxWords})`)
  }
  if (stats.longestSentenceWords > rules.maxWordsPerSentence) {
    reasons.push(
      `Longest sentence is ${stats.longestSentenceWords} words (max ${rules.maxWordsPerSentence} for ${rules.label})`,
    )
  }
  if (stats.grade > rules.maxGrade) {
    reasons.push(
      `Reading level grade ${stats.grade} is above the ${rules.label} ceiling of ${rules.maxGrade}`,
    )
  }
  // Below-range reading level is not a safety problem, only a fit note.
  if (stats.grade < rules.minGrade) {
    warnings.push(
      `Reading level grade ${stats.grade} is below the usual ${rules.label} range — may read as too simple`,
    )
  }

  return { ok: reasons.length === 0, reasons, warnings }
}
