import Link from 'next/link'
import { SearchBar } from '@/components/layout/SearchBar'
import { MobileMenu } from '@/components/layout/MobileMenu'
import { NavLinks } from '@/components/layout/NavLinks'
import { HorizontalFamilyTree } from '@/components/layout/HorizontalFamilyTree'

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-stone-800 bg-stone-950/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-2.5 sm:px-6">
        <Link href="/" className="flex-shrink-0 font-semibold tracking-tight text-stone-100">
          <span className="text-base">Abrahamic</span>
          <span className="ml-1 inline-flex gap-0.5">
            <span className="h-3 w-1 rounded-full bg-blue-500" />
            <span className="h-3 w-1 rounded-full bg-red-500" />
            <span className="h-3 w-1 rounded-full bg-green-500" />
          </span>
        </Link>

        <NavLinks />

        <div className="ml-auto w-full max-w-xs">
          <SearchBar />
        </div>

        <MobileMenu />
      </div>

      <div className="border-t border-stone-800 bg-stone-950/50 hidden sm:block">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <HorizontalFamilyTree />
        </div>
      </div>
    </header>
  )
}
