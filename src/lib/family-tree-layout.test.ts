import { describe, expect, it } from 'vitest'
import { layoutFamilyTrees } from './family-tree-layout'

const fig = (id: number, name: string) => ({ id, canonicalName: name, slug: name.toLowerCase() })
const parent = (from: number, to: number) => ({ fromFigureId: from, toFigureId: to, relationType: 'PARENT' })

describe('layoutFamilyTrees', () => {
  const figures = [fig(1, 'Abraham'), fig(2, 'Ishmael'), fig(3, 'Isaac'), fig(4, 'Hagar'), fig(5, 'Jacob'), fig(6, 'Unrelated')]
  const edges = [parent(1, 2), parent(1, 3), parent(4, 2), parent(3, 5)]

  it('builds one tree per root and ignores figures with no recorded parent edges', () => {
    const trees = layoutFamilyTrees(figures, edges)
    expect(trees.map((t) => t.root.canonicalName)).toEqual(['Abraham'])
  })

  it('places generations on successive rows, with the parent centred over its children', () => {
    const [tree] = layoutFamilyTrees(figures, edges)
    const at = (name: string) => tree.nodes.find((n) => n.canonicalName === name)!
    expect(at('Abraham').generation).toBe(0)
    expect(at('Jacob').generation).toBe(2)
    expect(at('Abraham').x).toBeCloseTo((at('Ishmael').x + at('Isaac').x) / 2)
    expect(at('Isaac').y).toBeGreaterThan(at('Abraham').y)
  })

  it('shows a second recorded parent beside the child without linking it as a spouse', () => {
    const [tree] = layoutFamilyTrees(figures, edges)
    expect(tree.sideParents.map((s) => s.canonicalName)).toEqual(['Hagar'])
    expect(tree.links.some((l) => l.fromId === 4)).toBe(false)
  })

  it('does not hang on circular data', () => {
    const trees = layoutFamilyTrees([fig(1, 'A'), fig(2, 'B')], [parent(1, 2), parent(2, 1)])
    expect(Array.isArray(trees)).toBe(true)
  })

  it('ignores non-PARENT relationships', () => {
    const trees = layoutFamilyTrees(figures, [{ fromFigureId: 1, toFigureId: 2, relationType: 'SPOUSE' }])
    expect(trees).toEqual([])
  })

  it('keeps side parents clear of the next branch, even on a person with children', () => {
    const [tree] = layoutFamilyTrees(
      [...figures, fig(7, 'Kedar')],
      [...edges, parent(2, 7)],
    )
    const ishmael = tree.nodes.find((n) => n.canonicalName === 'Ishmael')!
    const isaac = tree.nodes.find((n) => n.canonicalName === 'Isaac')!
    const hagar = tree.sideParents[0]
    expect(hagar.x + 118).toBeLessThanOrEqual(isaac.x)
    expect(hagar.x).toBeGreaterThanOrEqual(ishmael.x + 150)
  })
})
