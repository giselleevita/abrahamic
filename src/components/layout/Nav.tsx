import Link from 'next/link'
import { SearchBar } from '@/components/layout/SearchBar'
import { MobileMenu } from '@/components/layout/MobileMenu'
import { NavLinks } from '@/components/layout/NavLinks'

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center gap-5 px-5 sm:px-8">
        <Link href="/" className="flex flex-shrink-0 items-center gap-3 text-slate-950">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-700 font-serif text-xl font-bold text-white">A</span>
          <span className="block"><span className="block font-serif text-base font-bold leading-5 sm:text-xl">Abrahamic Texts</span><span className="hidden text-xs font-medium text-slate-500 sm:block">Compare. Read. Understand.</span></span>
        </Link>

        <NavLinks />

        <div className="ml-auto hidden w-full max-w-xs lg:block">
          <SearchBar />
        </div>

        <MobileMenu />
      </div>

    </header>
  )
}
