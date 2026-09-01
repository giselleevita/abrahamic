/**
 * Editorial neutrality rules for quiz questions.
 *
 * This site compares Judaism, Christianity and Islam and promises that content
 * is "editorially authored and peer-reviewed. No claim is shown without a
 * source citation." A quiz threatens that promise in a way ordinary content
 * does not, because a quiz declares an answer *correct*.
 *
 * The governing rule: **no question may have a correct answer that is not
 * attributed to a named holder.** "What does Islam teach about X" is a
 * checkable fact about a tradition. "What is true about X" is not ours to mark.
 *
 * Enforcement is layered:
 *   1. The schema has no QuestionKind that expresses an unattributed truth
 *      claim, and CHECK constraints back the attribution columns.
 *   2. This lint catches careless authoring in the admin UI and API.
 *   3. A human sets Chapter.neutralityReviewedAt before publish.
 *
 * (2) is a speed bump, not the control — the heuristics below are lexical and
 * fallible. (1) and (3) are the real guarantees.
 */
import type {
  QuestionFormat,
  QuestionKind,
  Tradition,
  TraditionPresence,
} from '@/generated/prisma/client'

export type NeutralityCode =
  | 'MISSING_SUBJECT_TRADITION'
  | 'SUBJECT_TRADITION_SHARED'
  | 'UNATTRIBUTED_STEM'
  | 'TRUTH_LANGUAGE'
  | 'CONTESTED_KIND_NOT_ALLOWED'
  | 'BARE_DISTRACTOR'
  | 'PARTIAL_TRADITION_COVERAGE'
  | 'NO_CORRECT_OPTION'
  | 'MULTIPLE_CORRECT_OPTIONS'
  | 'MISSING_EXPLANATION'
  | 'MISSING_PROVENANCE'

export type NeutralityFlag = {
  code: NeutralityCode
  /** BLOCK cannot be overridden by a reviewer; WARN can, with a written note. */
  severity: 'BLOCK' | 'WARN'
  message: string
}

export type DraftOption = {
  text: string
  isCorrect: boolean
  optionTradition?: Tradition | null
  presence?: TraditionPresence | null
  rationale?: string | null
}

export type QuestionDraft = {
  kind: QuestionKind
  format: QuestionFormat
  prompt: string
  explanation: string
  subjectTradition?: Tradition | null
  isContested: boolean
  options: DraftOption[]
  /** True when at least one provenance FK is set. */
  hasProvenance: boolean
}

/** Kinds whose answer is a fact about one named tradition's teaching. */
export const KINDS_REQUIRING_SUBJECT: QuestionKind[] = ['TRADITION_TEACHING', 'FIGURE_IDENTITY']

/**
 * Kinds permitted when the source material is contested (a controversial or
 * CONTRADICTION-tagged comparison). Contested material is escalated, not
 * excluded — dropping it would quietly avoid everything the site exists to
 * compare, which is its own bias.
 */
export const CONTESTED_ALLOWED_KINDS: QuestionKind[] = [
  'TRADITION_TEACHING',
  'DIVERGENCE_MAP',
  'SOURCE_TEXT',
]

/** The three traditions a DIVERGENCE_MAP question must account for. */
export const MAPPED_TRADITIONS: Tradition[] = ['JEWISH', 'CHRISTIAN', 'ISLAMIC']

/** Words that assert a truth rather than report a teaching. */
const TRUTH_PATTERNS: { pattern: RegExp; label: string }[] = [
  { pattern: /^(what|which)\s+(is|are)\s+(true|correct|right)\b/i, label: '"which is true…"' },
  { pattern: /\bactually\s+(happened|occurred|is|was)\b/i, label: '"actually happened"' },
  { pattern: /\bthe\s+truth\s+(is|about)\b/i, label: '"the truth about"' },
  { pattern: /\bwhich\s+(religion|tradition|faith)\s+is\s+(right|correct|true)\b/i, label: '"which religion is right"' },
  { pattern: /\breally\s+(happened|occurred)\b/i, label: '"really happened"' },
  { pattern: /\bdid\s+.*\s+really\b/i, label: '"did … really"' },
]

/** Adjectives that count as naming a tradition in a stem. */
const TRADITION_WORDS: Record<Tradition, RegExp> = {
  JEWISH: /\b(jewish|judaism|jew|rabbinic|torah)\b/i,
  CHRISTIAN: /\b(christian|christianity|church|gospel)\b/i,
  ISLAMIC: /\b(islamic|islam|muslim|qur'?an(ic)?)\b/i,
  SHARED: /\b(shared|all three)\b/i,
}

export function lintQuestion(draft: QuestionDraft): NeutralityFlag[] {
  const flags: NeutralityFlag[] = []
  const add = (code: NeutralityCode, severity: NeutralityFlag['severity'], message: string) =>
    flags.push({ code, severity, message })

  // ── attribution ────────────────────────────────────────────────────────
  if (KINDS_REQUIRING_SUBJECT.includes(draft.kind) && !draft.subjectTradition) {
    add('MISSING_SUBJECT_TRADITION', 'BLOCK',
      `${draft.kind} asks what a tradition teaches, so it must name which tradition.`)
  }

  if (draft.subjectTradition === 'SHARED') {
    add('SUBJECT_TRADITION_SHARED', 'BLOCK',
      'SHARED is not a teaching holder. Name a specific tradition, or use DIVERGENCE_MAP.')
  }

  for (const { pattern, label } of TRUTH_PATTERNS) {
    if (pattern.test(draft.prompt)) {
      add('TRUTH_LANGUAGE', 'BLOCK',
        `The prompt asserts a truth claim (${label}). Ask what a tradition teaches or what a text says instead.`)
      break
    }
  }

  if (
    draft.kind === 'TRADITION_TEACHING' &&
    draft.subjectTradition &&
    !TRADITION_WORDS[draft.subjectTradition].test(draft.prompt)
  ) {
    // Lexical, so a WARN: a stem can be correctly framed by its surrounding
    // chapter without repeating the adjective.
    add('UNATTRIBUTED_STEM', 'WARN',
      `The prompt does not name ${draft.subjectTradition}. Readers see questions out of context, so state the tradition in the stem.`)
  }

  // ── contested material ─────────────────────────────────────────────────
  if (draft.isContested && !CONTESTED_ALLOWED_KINDS.includes(draft.kind)) {
    add('CONTESTED_KIND_NOT_ALLOWED', 'BLOCK',
      `This draws on contested material, so it must attribute every position. Allowed kinds: ${CONTESTED_ALLOWED_KINDS.join(', ')}.`)
  }

  if (draft.isContested) {
    const bare = draft.options.filter((o) => !o.optionTradition && !o.rationale?.trim())
    if (bare.length > 0) {
      add('BARE_DISTRACTOR', 'BLOCK',
        `On contested material every option must name whose position it is, or explain why it is not that tradition's teaching. ${bare.length} option(s) do neither.`)
    }
  }

  // ── divergence maps ────────────────────────────────────────────────────
  if (draft.kind === 'DIVERGENCE_MAP') {
    const covered = new Set(draft.options.map((o) => o.optionTradition).filter(Boolean))
    const missing = MAPPED_TRADITIONS.filter((t) => !covered.has(t))
    if (missing.length > 0) {
      add('PARTIAL_TRADITION_COVERAGE', 'BLOCK',
        `A divergence map must show every tradition's position, otherwise the omitted one reads as having none. Missing: ${missing.join(', ')}.`)
    }
  }

  // ── answerability ──────────────────────────────────────────────────────
  const correct = draft.options.filter((o) => o.isCorrect)
  if (draft.options.length > 0 && correct.length === 0) {
    add('NO_CORRECT_OPTION', 'BLOCK', 'No option is marked correct.')
  }
  if (draft.format === 'SINGLE_CHOICE' && correct.length > 1) {
    add('MULTIPLE_CORRECT_OPTIONS', 'BLOCK',
      `SINGLE_CHOICE allows one correct option; ${correct.length} are marked correct.`)
  }

  if (!draft.explanation.trim()) {
    add('MISSING_EXPLANATION', 'BLOCK',
      'Every question must say why the answer is the answer; it is shown with the citation after answering.')
  }

  if (!draft.hasProvenance) {
    add('MISSING_PROVENANCE', 'BLOCK',
      'Every question must trace to a claim, concept, comparison or timeline event.')
  }

  return flags
}

/** True when nothing blocks publication (WARNs may be overridden with a note). */
export function isPublishable(flags: NeutralityFlag[]): boolean {
  return !flags.some((f) => f.severity === 'BLOCK')
}
