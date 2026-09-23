import { NextRequest, NextResponse } from 'next/server'
import { search } from '@/lib/search'

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get('q')?.trim() ?? ''
  if (query.length < 2) {
    return NextResponse.json({
      verses: [], claims: [], figures: [], themes: [], concepts: [],
      timelineEvents: [], total: 0,
    })
  }

  return NextResponse.json(await search(query))
}
