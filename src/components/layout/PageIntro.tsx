import Link from 'next/link'

export function PageIntro({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <header className="relative mb-10 overflow-hidden rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-50 via-white to-violet-50 p-6 shadow-sm sm:p-9">
      <div className="absolute -right-12 -top-14 h-40 w-40 rounded-full bg-rose-200/35 blur-2xl" aria-hidden="true" />
      <div className="absolute -bottom-16 right-24 h-36 w-36 rounded-full bg-blue-200/40 blur-2xl" aria-hidden="true" />
      <div className="relative">
      <nav aria-label="Breadcrumb" className="mb-6 text-sm font-medium text-slate-500">
        <Link href="/" className="hover:text-blue-800">Home</Link><span className="mx-2" aria-hidden="true">/</span><span aria-current="page" className="text-slate-700">{title}</span>
      </nav>
      <p className="text-sm font-bold uppercase tracking-[0.14em] text-violet-700">{eyebrow}</p>
      <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">{title}</h1>
      <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">{description}</p>
      </div>
    </header>
  )
}
