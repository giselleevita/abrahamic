import Link from 'next/link'

export function PublicDemoBanner() {
  return (
    <div className="border-b border-amber-200 bg-amber-50 px-4 py-1.5 text-center text-xs sm:py-2 sm:text-sm text-amber-950">
      <span className="font-semibold">Reader note:</span>{' '}
      <span className="hidden sm:inline">
        This educational demo uses original-language scripture and project-authored explanations.{' '}
      </span>
      <span className="sm:hidden">Original-language texts and project-authored explanations.{' '}</span>
      <Link href="/licensing" className="font-semibold underline underline-offset-2 hover:text-rose-700">
        About the sources
      </Link>
    </div>
  )
}
