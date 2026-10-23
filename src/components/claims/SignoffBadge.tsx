import {
  REVIEW_TRADITIONS,
  describeState,
  readSummary,
  type ReviewTradition,
  type TraditionState,
} from '@/lib/editorial/signoff'

type Props = {
  requiredTraditions: readonly string[]
  signoffSummary: unknown
  revision: number
}

const DOT: Record<TraditionState, string> = {
  MEMBER: 'bg-emerald-500',
  EDITOR: 'bg-sky-400',
  CHANGES: 'bg-amber-500',
  CONTESTED: 'bg-amber-500',
  AWAITING: 'bg-stone-300',
}

/**
 * Per-tradition review status for a claim.
 *
 * Honesty rules, enforced by `describeState` and tested: only a member of a tradition ever
 * produces "Reviewed by a … reviewer"; a check by the project editor is shown as exactly that,
 * and a stale sign-off from an earlier wording is shown as awaiting review.
 */
export function SignoffBadge({ requiredTraditions, signoffSummary, revision }: Props) {
  const required = REVIEW_TRADITIONS.filter((t) => requiredTraditions.includes(t))
  if (required.length === 0) return null

  const { states } = readSummary(required, signoffSummary, revision)
  const entries = required.map((tradition) => [tradition, states[tradition] ?? 'AWAITING'] as [ReviewTradition, TraditionState])

  if (entries.every(([, state]) => state === 'AWAITING')) {
    return (
      <p className="text-xs text-stone-400" data-testid="signoff-badge">
        Awaiting review by members of the {required.length > 1 ? 'traditions' : 'tradition'} described
      </p>
    )
  }

  return (
    <ul className="space-y-1" data-testid="signoff-badge" aria-label="Review status by tradition">
      {entries.map(([tradition, state]) => (
        <li key={tradition} className="flex items-center gap-2 text-xs text-stone-600">
          <span aria-hidden className={`h-2 w-2 shrink-0 rounded-full ${DOT[state]}`} />
          <span className={state === 'CONTESTED' || state === 'CHANGES' ? 'font-medium text-amber-800' : undefined}>
            {describeState(tradition, state)}
          </span>
        </li>
      ))}
    </ul>
  )
}
