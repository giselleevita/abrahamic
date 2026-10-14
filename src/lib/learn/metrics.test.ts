import { describe, expect, it } from 'vitest'
import { ABRAHAM_STEP_SLUGS, isTrackedStep } from './metrics'

describe('anonymous journey metric allowlist', () => {
  it('accepts precisely the six Abraham steps', () => {
    expect(ABRAHAM_STEP_SLUGS).toHaveLength(6)
    for (const slug of ABRAHAM_STEP_SLUGS) expect(isTrackedStep(slug)).toBe(true)
  })

  it('rejects arbitrary payloads and other courses', () => {
    for (const value of [null, 42, {}, 'foundations', 'journey-abraham-meet-other']) {
      expect(isTrackedStep(value)).toBe(false)
    }
  })
})
