import { describe, expect, it } from 'vitest'
import { traditionsAwaiting } from './queue'

describe('traditionsAwaiting', () => {
  it('lists every required tradition when nothing has been reviewed', () => {
    expect(traditionsAwaiting(['JEWISH', 'CHRISTIAN'], 1, [])).toEqual(['JEWISH', 'CHRISTIAN'])
  })

  it('drops a tradition once the reviewer has recorded a verdict on the current wording', () => {
    expect(traditionsAwaiting(['JEWISH', 'CHRISTIAN'], 1, [{ revision: 1, tradition: 'JEWISH' }])).toEqual(['CHRISTIAN'])
  })

  it('is empty when every required tradition is done', () => {
    expect(traditionsAwaiting(['ISLAMIC'], 3, [{ revision: 3, tradition: 'ISLAMIC' }])).toEqual([])
  })

  it('puts a claim back in the queue after its wording changes', () => {
    expect(traditionsAwaiting(['ISLAMIC'], 2, [{ revision: 1, tradition: 'ISLAMIC' }])).toEqual(['ISLAMIC'])
  })

  it('only offers traditions the reviewer covers', () => {
    expect(traditionsAwaiting(['JEWISH', 'ISLAMIC'], 1, [], ['ISLAMIC'])).toEqual(['ISLAMIC'])
    expect(traditionsAwaiting(['JEWISH'], 1, [], ['ISLAMIC'])).toEqual([])
  })

  it('ignores traditions the claim does not require', () => {
    expect(traditionsAwaiting(['JEWISH'], 1, [])).toEqual(['JEWISH'])
  })

  it('never counts someone else’s review for another tradition as done', () => {
    expect(traditionsAwaiting(['JEWISH', 'ISLAMIC'], 1, [{ revision: 1, tradition: 'ISLAMIC' }])).toEqual(['JEWISH'])
  })
})
