/**
 * A speed bump, not the control.
 *
 * Proposals are drafts that a human reads and that tradition reviewers must approve before they
 * can be published, so this check cannot make a claim fair. It only turns away wording that
 * plainly adjudicates between traditions, so editors are not asked to review it at all.
 *
 * It matches multi-word phrases rather than single words on purpose: "false prophet" or "wrong"
 * are legitimate in a claim about what a text says, and a lexical filter that blocked them
 * would punish accurate contributions. The same limits apply as in `learn/neutrality.ts`:
 * lexical rules are fallible, so the human review is the real guarantee.
 */
const ADJUDICATING_PHRASES = [
  'the one true',
  'the only true',
  'true religion',
  'false religion',
  'the real truth',
  'everyone knows',
  'obviously',
  'so-called',
  'clearly proves',
  'proves that',
  'in reality',
  'the correct view',
  'the right religion',
] as const

export type LintResult = { ok: true } | { ok: false; reasons: string[] }

export function lintProposal(statement: string): LintResult {
  const text = statement.toLowerCase().replace(/\s+/g, ' ')
  const hits = ADJUDICATING_PHRASES.filter((phrase) => text.includes(phrase))
  if (hits.length === 0) return { ok: true }
  return {
    ok: false,
    reasons: hits.map(
      (phrase) =>
        `"${phrase}" takes a side. Describe what the text or the tradition says and attribute it (for example "Jewish tradition holds that…").`,
    ),
  }
}
