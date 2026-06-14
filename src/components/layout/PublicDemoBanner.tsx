import Link from 'next/link'

export function PublicDemoBanner() {
  return (
    <div className="border-b border-amber-900/50 bg-amber-950/80 px-4 py-2 text-center text-xs text-amber-100">
      <span className="font-medium">Public engineering demo.</span> Verse text uses public-domain translations
      (JPS 1917, KJV) and original Hebrew/Arabic only. Editorial claims and comparisons are original
      summaries — not a licensed scripture publication.{' '}
      <Link href="/licensing" className="underline underline-offset-2 hover:text-amber-50">
        Licensing
      </Link>
    </div>
  )
}
