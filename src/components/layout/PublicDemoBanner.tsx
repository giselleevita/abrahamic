import Link from 'next/link'

export function PublicDemoBanner() {
  return (
    <div className="border-b border-blue-100 bg-blue-50 px-4 py-2 text-center text-sm text-blue-950">
      <span className="font-semibold">Reader note:</span> This educational demo uses original-language scripture and project-authored explanations.{' '}
      <Link href="/licensing" className="font-semibold underline underline-offset-2 hover:text-blue-700">
        Learn about the sources
      </Link>
    </div>
  )
}
