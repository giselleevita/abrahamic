import Link from 'next/link'
import prisma from '@/lib/prisma'

/** Questions people ask, each answered by an existing, sourced comparison. Nothing here is generated. */
const QUESTIONS: { question: string; slug: string }[] = [
  { question: 'Why do three traditions share Abraham?', slug: 'abrahams-call' },
  { question: 'Which son did Abraham offer?', slug: 'akedah-which-son' },
  { question: 'What does each tradition say about the covenant?', slug: 'abrahams-covenant' },
  { question: 'Do all three believe in one God?', slug: 'oneness-of-god' },
  { question: 'What happened to Jesus at the end?', slug: 'death-of-jesus' },
  { question: 'What is the Trinity, and why is it debated?', slug: 'the-trinity-debate' },
  { question: 'What is the Messiah?', slug: 'the-messiah-prophecy' },
  { question: 'What do the traditions say about fasting?', slug: 'fasting-across-traditions' },
  { question: 'Is there a rule like “love your neighbour” in each?', slug: 'golden-rule-neighbor' },
  { question: 'What is the Sabbath?', slug: 'sabbath-day-of-rest' },
]

export async function GuidedQuestions() {
  const rows = await prisma.comparison.findMany({
    where: { isPublished: true, slug: { in: QUESTIONS.map((q) => q.slug) } },
    select: { id: true, slug: true, summary: true },
  })
  const by = new Map(rows.map((r) => [r.slug, r]))
  const items = QUESTIONS.filter((q) => by.has(q.slug))
  if (items.length === 0) return null
  return (
    <section aria-labelledby="guided-title" className="mt-10 rounded-3xl border border-[#d7c5ad] bg-white p-5 sm:p-7">
      <h2 id="guided-title" className="font-serif text-2xl text-slate-950">Not sure what to search for? Start with a question</h2>
      <p className="mt-1 text-sm text-slate-700">Each one opens a side-by-side comparison with its sources.</p>
      <ul className="mt-4 grid gap-3 md:grid-cols-2">
        {items.map((q) => {
          const c = by.get(q.slug)!
          return (
            <li key={q.slug}>
              <Link href={`/comparisons/${c.id}`} className="block h-full rounded-2xl border border-[#d7c5ad] bg-[#fbf6ec] p-4 hover:border-[#b7791f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b7791f]">
                <span className="block font-bold text-slate-950">{q.question}</span>
                {c.summary && <span className="mt-1 line-clamp-2 block text-sm leading-6 text-slate-700">{c.summary}</span>}
                <span className="mt-2 block text-sm font-bold text-[#173b68]">See the comparison →</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
