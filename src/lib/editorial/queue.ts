import { REVIEW_TRADITIONS, type ReviewTradition } from '@/lib/editorial/signoff'

/**
 * Which traditions of a claim are still waiting for THIS reviewer.
 *
 * A reviewer covers some traditions (an administrator standing in as the project editor covers all
 * three). A tradition is "waiting" when the claim requires it, the reviewer covers it, and the
 * reviewer has recorded nothing on the claim's CURRENT revision. A verdict on an older wording does
 * not count, so editing a claim puts it back in the queue.
 */
export function traditionsAwaiting(
  required: readonly string[],
  revision: number,
  myReviews: readonly { revision: number; tradition: string }[],
  covered: readonly ReviewTradition[] = REVIEW_TRADITIONS,
): ReviewTradition[] {
  return covered.filter(
    (tradition) =>
      required.includes(tradition) &&
      !myReviews.some((review) => review.revision === revision && review.tradition === tradition),
  )
}
