'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { CheckCircle2, XCircle, ArrowRight, RotateCcw } from 'lucide-react'
import { TRADITION_BG } from '@/lib/constants'
import { useLearnProgress } from '@/lib/learn/use-progress'
import { selectQuestions } from '@/lib/learn/quiz-select'
import type { QuizQuestionData } from './types'

const TRADITION_LABEL: Record<string, string> = {
  JEWISH: 'Judaism', CHRISTIAN: 'Christianity', ISLAMIC: 'Islam', SHARED: 'Shared',
}

type Props = {
  chapterSlug: string
  questions: QuizQuestionData[]
  questionCount: number
  passPercent: number
  nextChapterHref?: string | null
  nextChapterTitle?: string | null
}

export function QuizRunner({
  chapterSlug, questions, questionCount,
  passPercent, nextChapterHref, nextChapterTitle,
}: Props) {
  const { recordAttempt } = useLearnProgress()

  const [attemptNumber, setAttemptNumber] = useState(0)
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<number[]>([])
  const [revealed, setRevealed] = useState(false)
  const [answers, setAnswers] = useState<{ question: QuizQuestionData; correct: boolean }[]>([])
  const [finished, setFinished] = useState(false)

  // Sampled from the delivered pool, seeded by attempt — stable across
  // re-renders, different on retry, and no Math.random() during render.
  const asked = useMemo(
    () => selectQuestions(questions, questionCount, attemptNumber),
    [questions, questionCount, attemptNumber],
  )

  const question = asked[index]
  const isMulti = question?.format === 'MULTI_SELECT'
  const correctIds = useMemo(
    () => new Set(question?.options.filter((o) => o.isCorrect).map((o) => o.id) ?? []),
    [question],
  )

  if (asked.length === 0) {
    return <p className="text-slate-600">No questions are published for this chapter yet.</p>
  }

  function toggle(optionId: number) {
    if (revealed) return
    setSelected((prev) =>
      isMulti
        ? prev.includes(optionId) ? prev.filter((id) => id !== optionId) : [...prev, optionId]
        : [optionId],
    )
  }

  function submit() {
    if (selected.length === 0 || revealed) return
    const chosen = new Set(selected)
    const isCorrect =
      chosen.size === correctIds.size && [...chosen].every((id) => correctIds.has(id))
    setAnswers((prev) => [...prev, { question, correct: isCorrect }])
    setRevealed(true)
  }

  function next() {
    if (index + 1 < asked.length) {
      setIndex(index + 1)
      setSelected([])
      setRevealed(false)
      return
    }
    const correct = answers.filter((a) => a.correct).length
    const total = asked.length
    recordAttempt(chapterSlug, {
      attemptAt: new Date().toISOString(),
      correct,
      total,
      passed: total > 0 && (correct / total) * 100 >= passPercent,
    })
    setFinished(true)
  }

  function retry() {
    setAttemptNumber((n) => n + 1)
    setIndex(0); setSelected([]); setRevealed(false); setAnswers([]); setFinished(false)
  }

  if (finished) {
    const correct = answers.filter((a) => a.correct).length
    const total = answers.length
    const pct = total > 0 ? Math.round((correct / total) * 100) : 0
    const passed = pct >= passPercent

    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-bold uppercase tracking-[0.14em] text-violet-700">Results</p>
        <h2 className="mt-2 text-3xl font-bold text-slate-950">
          {correct} out of {total}
        </h2>
        <p className={`mt-2 font-semibold ${passed ? 'text-emerald-700' : 'text-amber-700'}`}>
          {passed ? `Passed — ${pct}%` : `${pct}% — ${passPercent}% needed to pass`}
        </p>

        <ol className="mt-6 space-y-3">
          {answers.map(({ question: q, correct: ok }, i) => (
            <li key={q.id} className="flex gap-3 rounded-xl border border-slate-200 p-4">
              {ok
                ? <CheckCircle2 aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                : <XCircle aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-rose-600" />}
              <div className="min-w-0">
                <p className="font-semibold text-slate-900">
                  <span className="sr-only">{ok ? 'Correct: ' : 'Incorrect: '}</span>
                  {i + 1}. {q.prompt}
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-600">{q.explanation}</p>
                {q.citation && (
                  <Link href={q.citation.href} className="mt-1 inline-block text-sm font-semibold text-blue-700 hover:text-blue-900">
                    {q.citation.label}
                  </Link>
                )}
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-7 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={retry}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 font-bold text-slate-800 transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-blue-100"
          >
            <RotateCcw aria-hidden="true" className="h-4 w-4" /> Try again
          </button>
          {nextChapterHref && (
            <Link
              href={nextChapterHref}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-5 py-3 font-bold text-white transition hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-200"
            >
              Next: {nextChapterTitle} <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          )}
        </div>

        <p className="mt-5 text-xs leading-5 text-slate-500">
          Your progress is saved only in this browser — there is no account, and clearing
          site data will reset it.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-semibold text-slate-500">
          Question {index + 1} of {asked.length}
        </p>
        {question.subjectTradition && (
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${TRADITION_BG[question.subjectTradition]}`}>
            {TRADITION_LABEL[question.subjectTradition]}
          </span>
        )}
      </div>

      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-blue-600 transition-all duration-300"
          style={{ width: `${((index + (revealed ? 1 : 0)) / asked.length) * 100}%` }}
        />
      </div>

      <fieldset className="mt-6">
        <legend className="text-xl font-bold leading-8 text-slate-950">{question.prompt}</legend>
        {isMulti && (
          <p className="mt-2 text-sm text-slate-500">Select every option that applies.</p>
        )}

        <div className="mt-5 space-y-2">
          {question.options.map((option) => {
            const isSelected = selected.includes(option.id)
            const showCorrect = revealed && option.isCorrect
            const showWrong = revealed && isSelected && !option.isCorrect

            return (
              <label
                key={option.id}
                className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-all duration-200 motion-reduce:transition-none ${
                  showCorrect ? 'border-emerald-400 bg-emerald-50'
                  : showWrong ? 'border-rose-400 bg-rose-50'
                  : isSelected ? 'border-blue-500 bg-blue-50'
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                } ${revealed ? 'cursor-default' : ''}`}
              >
                <input
                  type={isMulti ? 'checkbox' : 'radio'}
                  name={`q-${question.id}`}
                  checked={isSelected}
                  onChange={() => toggle(option.id)}
                  disabled={revealed}
                  className="mt-1 h-4 w-4 shrink-0 accent-blue-700"
                />
                <span className="min-w-0 flex-1">
                  <span className="font-medium text-slate-900">{option.text}</span>
                  {revealed && option.rationale && !option.isCorrect && (
                    <span className="mt-1 block text-sm leading-6 text-slate-600">{option.rationale}</span>
                  )}
                </span>
                {showCorrect && <CheckCircle2 aria-hidden="true" className="h-5 w-5 shrink-0 text-emerald-600" />}
                {showWrong && <XCircle aria-hidden="true" className="h-5 w-5 shrink-0 text-rose-600" />}
              </label>
            )
          })}
        </div>
      </fieldset>

      {/* Auto-height without JS: 0fr -> 1fr on a grid row. */}
      <div
        aria-live="polite"
        className={`grid transition-[grid-template-rows] duration-300 motion-reduce:transition-none ${
          revealed ? 'mt-5 grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="overflow-hidden">
          {revealed && (
            <div className="rounded-xl border-l-4 border-blue-500 bg-blue-50/70 p-4">
              <p className="text-sm font-bold text-blue-900">
                {answers[answers.length - 1]?.correct ? 'Correct' : 'Not quite'}
              </p>
              <p className="mt-1 leading-7 text-slate-700">{question.explanation}</p>

              {question.verses.length > 0 && (
                <ul className="mt-3 space-y-2">
                  {question.verses.map((v) => (
                    <li key={v.href} className="rounded-lg bg-white/70 px-3 py-2">
                      {v.text && <p className="text-sm italic leading-6 text-slate-700">{v.text}</p>}
                      <Link href={v.href} className="text-xs font-semibold text-blue-700 hover:text-blue-900">
                        {v.reference}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}

              {question.citation && (
                <Link href={question.citation.href} className="mt-3 inline-block text-sm font-semibold text-blue-700 hover:text-blue-900">
                  {question.citation.label}
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        {revealed ? (
          <button
            type="button"
            onClick={next}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-6 py-3 font-bold text-white transition hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-200"
          >
            {index + 1 < asked.length ? 'Next question' : 'See results'}
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={submit}
            disabled={selected.length === 0}
            className="rounded-xl bg-blue-700 px-6 py-3 font-bold text-white transition hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            Check answer
          </button>
        )}
      </div>

      <p className="sr-only" aria-live="polite">
        {revealed ? (answers[answers.length - 1]?.correct ? 'Correct.' : 'Incorrect.') : ''}
      </p>
    </div>
  )
}
