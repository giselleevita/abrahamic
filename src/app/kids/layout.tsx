import Link from 'next/link'
import type { Metadata } from 'next'
import { ClearProgressButton } from '@/components/kids/ClearProgressButton'

export const metadata: Metadata = {
  title: 'For Kids · Abrahamic Texts',
  description:
    'Stories and games about what the Torah, the Bible, and the Quran say — written for children, reviewed by an editor.',
}

/**
 * Kid-facing chrome: larger type, higher contrast, a short nav, and no search
 * box. Deliberately lighter than the main site, which is built for study.
 */
export default function KidsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="kids-theme min-h-screen bg-primary-50">
      <header className="border-b-4 border-gold-500 bg-white">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link
            href="/kids"
            className="font-serif text-2xl font-bold text-primary-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-600"
          >
            Abrahamic <span className="text-gold-700">for Kids</span>
          </Link>

          <nav aria-label="Kids sections" className="flex items-center gap-1 text-base font-semibold">
            <Link
              href="/kids/stories"
              className="rounded-lg px-3 py-2 transition-colors hover:bg-primary-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-600"
            >
              Stories
            </Link>
            <Link
              href="/kids/games"
              className="rounded-lg px-3 py-2 transition-colors hover:bg-primary-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-600"
            >
              Games
            </Link>
            <Link
              href="/"
              className="rounded-lg px-3 py-2 text-sm font-medium text-primary-600 transition-colors hover:bg-primary-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-600"
            >
              For grown-ups
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">{children}</main>

      <footer className="mt-12 border-t border-primary-200 bg-white">
        <div className="mx-auto max-w-5xl space-y-3 px-4 py-8 text-sm text-primary-700 sm:px-6">
          <p className="font-semibold text-primary-900">About this part of the site</p>
          <p className="leading-relaxed">
            These stories describe what the Torah, the Bible, and the Quran each say. They do
            not say which book is right — that is not what this website is for. Every story is
            written from sourced entries on the main site and checked by an editor before it
            appears here.
          </p>
          <p className="leading-relaxed">
            <strong className="font-semibold">This site does not save anything about you.</strong>{' '}
            There are no accounts and no sign-in. Your game scores are kept only on this device,
            and you can erase them at any time.
          </p>
          <ClearProgressButton />
        </div>
      </footer>
    </div>
  )
}
