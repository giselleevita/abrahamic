'use client'

import { useEffect, useRef, useState } from 'react'
import { useDeviceStore } from '@/lib/experience/storage'
import { ALBUM_KEY, EMPTY_ALBUM, dayKey, parseAlbum, recordDaily } from '@/lib/album'
import type { FigureQuizQuestion } from '@/lib/figure-quiz'

export function FigureQuiz({ name, questions, kind = 'person', heading }: { name: string; questions: FigureQuizQuestion[]; kind?: 'person' | 'daily'; heading?: string }) {
  const album = useDeviceStore(ALBUM_KEY, EMPTY_ALBUM, parseAlbum)
  const recorded = useRef(false)
  const [index, setIndex] = useState(0)
  const [chosen, setChosen] = useState<number | null>(null)
  const [correct, setCorrect] = useState(0)
  const done = index >= questions.length
  const q = questions[index]

  // Finishing is remembered on this device so the album can award badges.
  useEffect(() => {
    if (!done || recorded.current) return
    recorded.current = true
    const perfect = correct === questions.length
    if (kind === 'daily') album.save(recordDaily(album.value, dayKey(new Date()), perfect))
    else album.save({ ...album.value, quizzes: album.value.quizzes + 1 })
  }, [done, correct, questions.length, kind, album])

  function choose(i: number) {
    if (chosen !== null) return
    setChosen(i)
    if (i === q.answerIndex) setCorrect((c) => c + 1)
  }
  function restart() { recorded.current = true; setIndex(0); setChosen(null); setCorrect(0) }

  return (
    <section aria-labelledby="quiz-title" className="mt-14 rounded-3xl border-2 border-amber-300 bg-gradient-to-br from-amber-50 to-rose-50 p-6 sm:p-8">
      <p className="text-sm font-bold uppercase tracking-wider text-amber-900">{kind === 'daily' ? '📅 Today’s challenge' : '🎯 Test yourself'}</p>
      <h2 id="quiz-title" className="mt-1 font-serif text-2xl text-slate-950">{heading ?? `How well do you know ${name}’s names?`}</h2>

      {done ? (
        <div className="mt-5" role="status">
          <p className="text-4xl" aria-hidden="true">{'⭐'.repeat(Math.max(1, Math.round((correct / questions.length) * 3)))}</p>
          <p className="mt-2 text-xl font-bold text-slate-950">You got {correct} out of {questions.length}.</p>
          <button type="button" onClick={restart} className="mt-4 rounded-xl bg-slate-950 px-5 py-2 font-bold text-white hover:bg-slate-800">Try again</button>
        </div>
      ) : (
        <div className="mt-5">
          <p className="text-sm font-semibold text-slate-700">Question {index + 1} of {questions.length}</p>
          <p className="mt-1 text-lg font-bold text-slate-950">{q.prompt}</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {q.options.map((opt, i) => {
              const revealed = chosen !== null
              const isAnswer = i === q.answerIndex
              const cls = revealed
                ? isAnswer ? 'kids-pop border-green-500 bg-green-50 text-green-900'
                  : i === chosen ? 'kids-wiggle border-rose-400 bg-rose-50 text-rose-900'
                  : 'border-slate-200 bg-white text-slate-500'
                : 'border-amber-300 bg-white text-slate-950 hover:-translate-y-0.5 hover:border-amber-500'
              return (
                <button key={opt} type="button" disabled={revealed} onClick={() => choose(i)} className={`rounded-2xl border-4 px-4 py-3 text-lg font-bold transition-transform focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b7791f] motion-reduce:transition-none ${cls}`}>
                  {opt}{revealed && isAnswer && <span aria-hidden="true"> ✓</span>}
                </button>
              )
            })}
          </div>
          {chosen !== null && (
            <div className="mt-4 flex flex-wrap items-center gap-4" role="status">
              <p className="text-slate-800">{chosen === q.answerIndex ? 'Right! ' : 'Not quite. '}{q.explanation}</p>
              <button type="button" onClick={() => { setIndex(index + 1); setChosen(null) }} className="ml-auto rounded-xl bg-[#173b68] px-5 py-2 font-bold text-white hover:bg-[#102d51]">
                {index + 1 < questions.length ? 'Next' : 'See result'}
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  )
}
