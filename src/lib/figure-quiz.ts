import type { Tradition } from '@/generated/prisma/client'

export type QuizAlias = { figureId: number; tradition: Tradition; name: string }
export type FigureQuizQuestion = {
  prompt: string
  options: string[]
  answerIndex: number
  explanation: string
}

const BOOK: Record<string, string> = {
  JEWISH: 'the Torah and Hebrew Bible',
  CHRISTIAN: 'the Bible',
  ISLAMIC: 'the Quran',
}
const TRADITION_NAME: Record<string, string> = { JEWISH: 'Judaism', CHRISTIAN: 'Christianity', ISLAMIC: 'Islam' }

/** Stable pseudo-shuffle so a cached page renders the same quiz every time. */
function rotate<T>(items: T[], seed: number): T[] {
  if (items.length === 0) return items
  const k = seed % items.length
  return [...items.slice(k), ...items.slice(0, k)]
}

/**
 * "What is X called in ...?" questions built only from names already recorded
 * on the site, so the quiz adds no new claims. Wrong options are real names of
 * other people in the same tradition. Questions need two distinct wrong names
 * and a name that differs from the canonical one, or they are skipped.
 */
export function buildFigureQuiz(
  figure: { id: number; canonicalName: string },
  aliases: QuizAlias[],
  max = 3,
): FigureQuizQuestion[] {
  const own = aliases.filter((a) => a.figureId === figure.id)
  const questions: FigureQuizQuestion[] = []
  for (const tradition of ['ISLAMIC', 'JEWISH', 'CHRISTIAN'] as Tradition[]) {
    const alias = own.find((a) => a.tradition === tradition)
    if (!alias || alias.name.toLowerCase() === figure.canonicalName.toLowerCase()) continue
    const pool = [
      ...new Set(
        aliases
          .filter((a) => a.tradition === tradition && a.figureId !== figure.id && a.name.toLowerCase() !== alias.name.toLowerCase())
          .map((a) => a.name),
      ),
    ].sort()
    const wrong = rotate(pool, figure.id + questions.length).slice(0, 2)
    if (wrong.length < 2) continue
    const options = rotate([alias.name, ...wrong], figure.id + tradition.length)
    questions.push({
      prompt: `What is ${figure.canonicalName} called in ${BOOK[tradition]}?`,
      options,
      answerIndex: options.indexOf(alias.name),
      explanation: `In ${TRADITION_NAME[tradition]}, ${figure.canonicalName} is called ${alias.name}.`,
    })
    if (questions.length >= max) break
  }
  return questions
}
