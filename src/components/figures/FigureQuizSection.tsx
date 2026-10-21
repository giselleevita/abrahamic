import prisma from '@/lib/prisma'
import { buildFigureQuiz } from '@/lib/figure-quiz'
import { FigureQuiz } from '@/components/figures/FigureQuiz'

/** Builds the quiz from names already on the site; renders nothing if there are too few to ask fairly. */
export async function FigureQuizSection({ figure }: { figure: { id: number; canonicalName: string } }) {
  const aliases = await prisma.figureAlias.findMany({ select: { figureId: true, tradition: true, name: true } })
  const questions = buildFigureQuiz(figure, aliases)
  if (questions.length < 2) return null
  return <FigureQuiz name={figure.canonicalName} questions={questions} />
}
