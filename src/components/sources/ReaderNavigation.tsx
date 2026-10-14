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
    <form action={`/sources/${encodeURIComponent(sourceKey)}/read`} method="get" className="editorial-card grid gap-3 p-4 sm:grid-cols-[minmax(0,1fr)_8rem_auto] sm:items-end" aria-label="Choose a passage">
      <label className="grid gap-1 text-sm font-semibold text-stone-800">
        Book
        <select name="book" value={book} onChange={(event) => { setBook(event.target.value); setChapter(1) }} className="editorial-control min-w-0 px-3 py-2.5 font-normal">
          {books.map((item) => <option key={item.book} value={item.book}>{item.book}</option>)}
        </select>
      </label>
      <label className="grid gap-1 text-sm font-semibold text-stone-800">
        Chapter
        <select name="chapter" value={chapters.includes(chapter) ? chapter : chapters[0]} onChange={(event) => setChapter(Number(event.target.value))} className="editorial-control px-3 py-2.5 font-normal">
          {chapters.map((number) => <option key={number} value={number}>{number}</option>)}
        </select>
      </label>
      <button type="submit" className="editorial-button text-sm">Read passage</button>
    </form>
  )
}
