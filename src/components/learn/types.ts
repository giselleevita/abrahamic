import type {
  QuestionFormat,
  QuestionKind,
  Tradition,
  TraditionPresence,
} from '@/generated/prisma/client'

/**
 * Quiz payload delivered to the client.
 *
 * Note the answer key (`isCorrect`) ships to the browser and grading happens
 * client-side. This is deliberate: it is a learning aid, not an exam, there is
 * no score of record, and grading server-side would add a round trip per
 * question plus an anonymous rate-limiting problem for no benefit.
 */
export type QuizOptionData = {
  id: number
  text: string
  isCorrect: boolean
  optionTradition: Tradition | null
  presence: TraditionPresence | null
  rationale: string | null
}

export type QuizCitation = {
  label: string
  href: string
}

export type QuizQuestionData = {
  id: number
  kind: QuestionKind
  format: QuestionFormat
  prompt: string
  explanation: string
  subjectTradition: Tradition | null
  isContested: boolean
  options: QuizOptionData[]
  /** Where the answer comes from — always present, enforced by CHECK. */
  citation: QuizCitation | null
  /** Verse references, already filtered by the public-demo policy. */
  verses: { reference: string; text: string | null; href: string }[]
}
