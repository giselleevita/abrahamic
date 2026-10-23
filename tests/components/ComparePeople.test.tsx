import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { ComparePeople } from '@/components/people/ComparePeople'

const props = { events: [], claims: [], comparisons: [] }

describe('ComparePeople on a nearly empty database', () => {
  it('renders a message instead of crashing when there are no people', () => {
    expect(renderToStaticMarkup(<ComparePeople figures={[]} {...props} />)).toContain('not enough people')
  })
  it('renders a message when there is only one person', () => {
    const one = [{ id: 1, slug: 'moses', name: 'Moses', aliases: [] }]
    expect(renderToStaticMarkup(<ComparePeople figures={one} {...props} />)).toContain('not enough people')
  })
})
