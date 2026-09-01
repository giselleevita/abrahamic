import Link from 'next/link'

export function PageIntro({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <header className="mb-10 border-b border-slate-200 pb-8">
      <nav aria-label="Breadcrumb" className="mb-6 text-sm font-medium text-slate-500">
        <Link href="/" className="hover:text-blue-800">Home</Link><span className="mx-2" aria-hidden="true">/</span><span aria-current="page" className="text-slate-700">{title}</span>
      </nav>
      <p className="text-sm font-bold uppercase tracking-[0.14em] text-blue-700">{eyebrow}</p>
      <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">{title}</h1>
      <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">{description}</p>
    </header>
  )
}
