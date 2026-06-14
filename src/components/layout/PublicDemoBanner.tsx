import Link from 'next/link'

export function PublicDemoBanner() {
  return (
    <div className="border-b border-amber-900/50 bg-amber-950/80 px-4 py-2 text-center text-xs text-amber-100">
      <span className="font-medium">Public engineering demo.</span> Scripture display uses original Hebrew/Arabic
      text plus original reader notes written for this project — no licensed translations. Comparisons and
      claims are editorial summaries.{' '}
      <Link href="/licensing" className="underline underline-offset-2 hover:text-amber-50">
        Content policy
      </Link>
    </div>
  )
}
