import Link from 'next/link'
import { SearchBar } from '@/components/layout/SearchBar'
import { MobileMenu } from '@/components/layout/MobileMenu'
import { NavLinks } from '@/components/layout/NavLinks'
import { HorizontalFamilyTree } from '@/components/layout/HorizontalFamilyTree'

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-primary-800 bg-primary-950/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-2.5 sm:px-6">
        <Link href="/" className="flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-serif text-xl font-semibold text-primary-50 tracking-tight">Abrahamic</span>
            <div className="inline-flex gap-1">
              <span className="h-2.5 w-2.5 rounded-full bg-jewish-500" title="Jewish" />
              <span className="h-2.5 w-2.5 rounded-full bg-christian-500" title="Christian" />
              <span className="h-2.5 w-2.5 rounded-full bg-islamic-500" title="Islamic" />
            </div>
          </div>
        </Link>

        <NavLinks />

        <div className="ml-auto w-full max-w-xs">
          <SearchBar />
        </div>

        <MobileMenu />
      </div>

      <div className="border-t border-primary-800 bg-primary-900/50 hidden sm:block">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <HorizontalFamilyTree />
        </div>
      </div>
    </header>
  )
}
