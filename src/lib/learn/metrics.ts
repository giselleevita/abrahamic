/** Only these published steps may contribute to anonymous aggregate counts. */
export const ABRAHAM_STEP_SLUGS = [
  'journey-abraham-meet',
  'journey-abraham-judaism',
  'journey-abraham-christianity',
  'journey-abraham-islam',
  'journey-abraham-distinct',
  'journey-abraham-review',
] as const

export function isTrackedStep(value: unknown): value is (typeof ABRAHAM_STEP_SLUGS)[number] {
  return typeof value === 'string' && ABRAHAM_STEP_SLUGS.includes(value as (typeof ABRAHAM_STEP_SLUGS)[number])
}

/** Best-effort, anonymous: the server receives no browser or learner ID. */
export function recordJourneyCompletion(chapterSlug: string): void {
  if (!isTrackedStep(chapterSlug)) return
  void fetch('/api/journey-completion', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ chapterSlug }),
    keepalive: true,
  }).catch(() => {
    // Measurement must never interrupt a learner's journey.
  })
}
