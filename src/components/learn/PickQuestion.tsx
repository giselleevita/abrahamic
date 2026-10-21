import Link from 'next/link'

/** Questions a newcomer might ask, each opening the step that answers it. Only steps that exist are offered. */
const QUESTIONS: { chapter: string; question: string }[] = [
  { chapter: 'journey-abraham-meet', question: 'Who is Abraham, and why do three traditions share him?' },
  { chapter: 'journey-abraham-judaism', question: 'What is the Jewish story of Avraham?' },
  { chapter: 'journey-abraham-christianity', question: 'How do Christians remember Abraham?' },
  { chapter: 'journey-abraham-islam', question: 'Who is Ibrahim in Islam?' },
  { chapter: 'journey-abraham-distinct', question: 'Where do the traditions agree, and where do they differ?' },
]

export function PickQuestion({ courseSlug, chapterSlugs }: { courseSlug: string; chapterSlugs: string[] }) {
  const available = QUESTIONS.filter((q) => chapterSlugs.includes(q.chapter))
  if (available.length === 0) return null
  return (
    <section aria-labelledby="pick-question-title" className="mb-8 rounded-3xl border-2 border-[#b7791f] bg-[#fbf6ec] p-5 sm:p-6">
      <h2 id="pick-question-title" className="font-serif text-2xl text-slate-950">Start with your own question</h2>
      <p className="mt-1 text-sm text-slate-700">You do not have to go in order. Choose what you want to know first.</p>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {available.map((q) => (
          <li key={q.chapter}>
            <Link href={`/learn/${courseSlug}/${q.chapter}`} className="flex h-full items-center justify-between gap-3 rounded-2xl border border-[#d7c5ad] bg-white px-4 py-3 font-semibold text-slate-950 hover:border-[#b7791f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b7791f]">
              {q.question}<span aria-hidden="true" className="text-[#173b68]">→</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
