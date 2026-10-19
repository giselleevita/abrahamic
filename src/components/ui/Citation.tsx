import Link from 'next/link'
import { formatVerseRef, verseReaderHref, type VerseRef } from '@/lib/verse-links'
export function Citation({ sourceSlug, verse, sourceTitle }: { sourceSlug: string; verse: VerseRef; sourceTitle?: string }) {
  return <Link href={verseReaderHref(sourceSlug, verse)} className="editorial-link text-sm">{sourceTitle && `${sourceTitle} · `}{formatVerseRef(verse)}<span className="sr-only"> — read in context</span></Link>
}
