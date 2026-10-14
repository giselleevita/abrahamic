'use client'

import { useState } from 'react'

type BookOption = { book: string; chapters: number[] }

export function ReaderNavigation({ sourceKey, books, currentBook, currentChapter }: {
  sourceKey: string
  books: BookOption[]
  currentBook: string
  currentChapter: number
}) {
  const [book, setBook] = useState(currentBook)
  const [chapter, setChapter] = useState(currentChapter)
  const chapters = books.find((item) => item.book === book)?.chapters ?? []

  return (
    <form action={`/sources/${encodeURIComponent(sourceKey)}/read`} method="get" className="grid gap-3 rounded-2xl border border-amber-200 bg-amber-50/70 p-4 sm:grid-cols-[minmax(0,1fr)_8rem_auto] sm:items-end" aria-label="Choose a passage">
      <label className="grid gap-1 text-sm font-semibold text-stone-800">
        Book
        <select name="book" value={book} onChange={(event) => { setBook(event.target.value); setChapter(1) }} className="min-w-0 rounded-lg border border-stone-300 bg-white px-3 py-2.5 font-normal text-stone-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700">
          {books.map((item) => <option key={item.book} value={item.book}>{item.book}</option>)}
        </select>
      </label>
      <label className="grid gap-1 text-sm font-semibold text-stone-800">
        Chapter
        <select name="chapter" value={chapters.includes(chapter) ? chapter : chapters[0]} onChange={(event) => setChapter(Number(event.target.value))} className="rounded-lg border border-stone-300 bg-white px-3 py-2.5 font-normal text-stone-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700">
          {chapters.map((number) => <option key={number} value={number}>{number}</option>)}
        </select>
      </label>
      <button type="submit" className="rounded-lg bg-stone-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-stone-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700">Read passage</button>
    </form>
  )
}
