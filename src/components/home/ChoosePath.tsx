import Link from 'next/link'

const PATHS = [
  { href: '/learn', icon: '🧭', title: 'I’m new here', text: 'Follow a short guided story, one step at a time.', cta: 'Start the journey' },
  { href: '/family-tree#big-picture-title', icon: '🌳', title: 'Show me the big picture', text: 'See how the three traditions grew from shared roots.', cta: 'Open the diagram' },
  { href: '/figures', icon: '👤', title: 'I’m curious about a person', text: 'Abraham, Moses, Mary, Muhammad and others, in each book.', cta: 'Meet the people' },
  { href: '/comparisons', icon: '⚖️', title: 'I want to compare beliefs', text: 'Side by side, with the source for every claim.', cta: 'Compare' },
  { href: '/kids', icon: '🎈', title: 'I’m here with a child', text: 'Stories, games and a short video for ages 6–12.', cta: 'Visit the kids’ corner' },
]

/** Five clear doors for a first-time visitor, ahead of the long-form sections. */
export function ChoosePath() {
  return (
    <section id="choose-path" aria-labelledby="choose-path-title" className="mx-auto max-w-[1376px] px-6 py-14 sm:px-12">
      <p className="editorial-eyebrow">Where would you like to begin?</p>
      <h2 id="choose-path-title" className="mt-2 font-serif text-3xl text-slate-950 sm:text-4xl">Pick the way in that suits you</h2>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {PATHS.map((p) => (
          <li key={p.href}>
            <Link
              href={p.href}
              className="group flex h-full flex-col rounded-3xl border border-[#d7c5ad] bg-white p-5 transition-transform hover:-translate-y-1 hover:border-[#b7791f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b7791f] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              <span aria-hidden="true" className="text-3xl">{p.icon}</span>
              <span className="mt-3 font-serif text-xl font-bold text-slate-950">{p.title}</span>
              <span className="mt-2 flex-1 text-sm leading-6 text-slate-700">{p.text}</span>
              <span className="mt-4 text-sm font-bold text-[#173b68] group-hover:underline">{p.cta} →</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
