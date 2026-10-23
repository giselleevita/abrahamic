/**
 * Tradition sign-off: pure rules.
 *
 * A claim may become PUBLISHED only when, for each tradition it describes, someone from
 * that tradition has confirmed it is fairly described. The database trigger
 * `claims_require_signoff` is the real enforcement; `unmetSignoffs` mirrors it so the API
 * can explain what is missing. A DB integration test checks the two agree.
 *
 * Honesty rule for labels: a review by the project editor (the administrator standing in
 * until a member of the tradition reviews) satisfies the gate but is NEVER displayed as a
 * review by that tradition.
 */
export type ReviewTradition = 'JEWISH' | 'CHRISTIAN' | 'ISLAMIC'
export type SourceTradition = ReviewTradition | 'SHARED'
export type Verdict = 'ACCURATE' | 'NEEDS_CHANGES' | 'OBJECTS'
export type ReviewerKind = 'TRADITION_MEMBER' | 'PROJECT_EDITOR'

export const REVIEW_TRADITIONS: readonly ReviewTradition[] = ['JEWISH', 'CHRISTIAN', 'ISLAMIC']

export const TRADITION_LABEL: Record<ReviewTradition, string> = {
  JEWISH: 'Judaism',
  CHRISTIAN: 'Christianity',
  ISLAMIC: 'Islam',
}

export type ReviewRow = { tradition: ReviewTradition; kind: ReviewerKind; verdict: Verdict }

/**
 * Which traditions a claim describes. A source of one tradition describes that tradition.
 * SHARED (the Hebrew Bible) is read by both Jews and Christians, so both must confirm.
 * `extra` lets an editor add traditions (for example a Quran claim that characterises a
 * Jewish position); it can only add, never remove.
 */
export function requiredTraditionsFor(
  source: SourceTradition,
  extra: readonly ReviewTradition[] = [],
): ReviewTradition[] {
  const base: ReviewTradition[] = source === 'SHARED' ? ['JEWISH', 'CHRISTIAN'] : [source]
  return REVIEW_TRADITIONS.filter((t) => base.includes(t) || extra.includes(t))
}

export type TraditionState = 'MEMBER' | 'EDITOR' | 'CHANGES' | 'CONTESTED' | 'AWAITING'
export type SignoffSummary = { revision: number; states: Partial<Record<ReviewTradition, TraditionState>> }

const isConcern = (verdict: Verdict) => verdict !== 'ACCURATE'

/** Per-tradition state for ONE revision. Pass only reviews recorded at the current revision. */
export function summarizeSignoff(
  required: readonly ReviewTradition[],
  reviews: readonly ReviewRow[],
  isContested: boolean,
  revision: number,
): SignoffSummary {
  const states: SignoffSummary['states'] = {}
  for (const tradition of required) {
    const own = reviews.filter((review) => review.tradition === tradition)
    if (own.some((review) => isConcern(review.verdict))) {
      states[tradition] = isContested ? 'CONTESTED' : 'CHANGES'
    } else if (own.some((review) => review.verdict === 'ACCURATE' && review.kind === 'TRADITION_MEMBER')) {
      states[tradition] = 'MEMBER'
    } else if (own.some((review) => review.verdict === 'ACCURATE')) {
      states[tradition] = 'EDITOR'
    } else {
      states[tradition] = 'AWAITING'
    }
  }
  return { revision, states }
}

export type SignoffGate = { allowed: boolean; missing: ReviewTradition[]; blockedByConcern: boolean }

/** Mirror of the database publish gate (see claims_require_signoff). */
export function unmetSignoffs(
  required: readonly ReviewTradition[],
  reviews: readonly ReviewRow[],
  isContested: boolean,
): SignoffGate {
  if (required.length === 0) return { allowed: false, missing: [], blockedByConcern: false }
  const missing = required.filter((tradition) => {
    const own = reviews.filter((review) => review.tradition === tradition)
    const accurate = own.some((review) => review.verdict === 'ACCURATE')
    const reviewedAndDisagrees = isContested && own.some((review) => isConcern(review.verdict))
    return !accurate && !reviewedAndDisagrees
  })
  const blockedByConcern = !isContested && reviews.some((review) => isConcern(review.verdict))
  return { allowed: missing.length === 0 && !blockedByConcern, missing, blockedByConcern }
}

export type ReviewActor = {
  /** Administrator session (the environment admin). */
  isAdmin: boolean
  /** Traditions this signed-in contributor is an APPROVED reviewer for. */
  reviewerTraditions: readonly ReviewTradition[]
}

/**
 * Which kind of review the actor may record for a tradition, or null if none.
 * A member reviewer speaks only for their own tradition. The administrator may stand in
 * for any tradition, always recorded as PROJECT_EDITOR. If an administrator is also an
 * approved member for that tradition, the member capacity wins.
 */
export function reviewKindFor(actor: ReviewActor, tradition: ReviewTradition): ReviewerKind | null {
  if (actor.reviewerTraditions.includes(tradition)) return 'TRADITION_MEMBER'
  if (actor.isAdmin) return 'PROJECT_EDITOR'
  return null
}

const STATE_TEXT: Record<TraditionState, (name: string) => string> = {
  MEMBER: (name) => `Reviewed by a ${name} reviewer`,
  EDITOR: (name) => `Checked by the project editor; awaiting a ${name} reviewer`,
  CHANGES: (name) => `${name} review: changes requested`,
  CONTESTED: (name) => `A ${name} reviewer disagrees with this wording`,
  AWAITING: (name) => `Awaiting ${name} review`,
}

export function describeState(tradition: ReviewTradition, state: TraditionState): string {
  return STATE_TEXT[state](TRADITION_LABEL[tradition])
}

/** Reads the cached summary defensively: wrong revision or malformed data means "awaiting". */
export function readSummary(
  required: readonly ReviewTradition[],
  cached: unknown,
  revision: number,
): SignoffSummary {
  const fallback = summarizeSignoff(required, [], false, revision)
  if (!cached || typeof cached !== 'object') return fallback
  const value = cached as Partial<SignoffSummary>
  if (value.revision !== revision || !value.states || typeof value.states !== 'object') return fallback
  const states: SignoffSummary['states'] = {}
  for (const tradition of required) {
    const state = (value.states as Record<string, unknown>)[tradition]
    states[tradition] =
      state === 'MEMBER' || state === 'EDITOR' || state === 'CHANGES' || state === 'CONTESTED' ? state : 'AWAITING'
  }
  return { revision, states }
}
