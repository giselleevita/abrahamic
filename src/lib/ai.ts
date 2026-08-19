import Anthropic from '@anthropic-ai/sdk'
import type { VerseLinkType } from '@/generated/prisma/client'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

// ─── Types ────────────────────────────────────────────────────────────────────

export type ClaimForSummary = {
  statement: string
  sourceTitle: string
  verseRefs: string[] // referenceKey values
}

export type VerseForLinking = {
  id: number
  referenceKey: string
  sourceTitle: string
  text: string // default translation text
}

export type ThemeOption = {
  id: number
  name: string
  description: string | null
}

// ─── 1. AI Comparison Summary ─────────────────────────────────────────────────
// Generates a neutral, grounded summary for a comparison.
// The returned string cites verse references inline. Never auto-saved.

export async function generateComparisonSummary(
  comparisonTitle: string,
  tag: string,
  claims: ClaimForSummary[]
): Promise<string> {
  const claimsBlock = claims
    .map(
      (c, i) =>
        `Claim ${i + 1} [${c.sourceTitle}] (verses: ${c.verseRefs.join(', ')}):\n"${c.statement}"`
    )
    .join('\n\n')

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 400,
    system: `You are a neutral academic summariser of comparative religious texts.
Rules you must follow:
- Describe only what the provided claims state — do not add theological interpretation not present in the claims
- Cite verse references inline using format [referenceKey] whenever you reference a specific text
- Do not use evaluative language (e.g. "merely", "only", "actually", "truly", "correctly")
- Do not state which tradition is "right" or "more accurate"
- Write in plain academic prose, 2–4 sentences
- If the tag is CONTRADICTION, acknowledge the direct opposition factually without favoring either side`,
    messages: [
      {
        role: 'user',
        content: `Write a neutral 2–4 sentence summary of this comparison titled "${comparisonTitle}" (tag: ${tag}).

The comparison contains these claims:

${claimsBlock}

Summarise what each tradition states and how they relate to each other. Cite verse references inline.`,
      },
    ],
  })

  const text = response.content[0]
  if (text.type !== 'text') throw new Error('Unexpected response type from AI')
  return text.text.trim()
}

// ─── 2. AI Theme Tag Suggestions ─────────────────────────────────────────────
// Suggests up to 3 theme IDs for a claim statement. Editor must confirm.
// Returns empty array on failure (graceful degradation).

export async function suggestThemeTags(
  statement: string,
  themes: ThemeOption[]
): Promise<number[]> {
  const themeList = themes
    .map((t) => `${t.id}: ${t.name}${t.description ? ` — ${t.description}` : ''}`)
    .join('\n')

  try {
    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 80,
      system: `You are a taxonomy assistant. Given a claim statement and a list of themes, return the IDs of the most relevant themes (at most 3).
Respond with ONLY a JSON array of numbers, e.g. [1, 4] or [2]. No explanation.`,
      messages: [
        {
          role: 'user',
          content: `Claim: "${statement}"\n\nAvailable themes:\n${themeList}\n\nReturn JSON array of up to 3 theme IDs:`,
        },
      ],
    })

    const text = response.content[0]
    if (text.type !== 'text') return []
    const ids = JSON.parse(text.text.trim())
    if (!Array.isArray(ids)) return []
    return ids
      .filter((id) => typeof id === 'number' && themes.some((t) => t.id === id))
      .slice(0, 3)
  } catch {
    return []
  }
}

// ─── 3. AI Verse Link Proposals ───────────────────────────────────────────────
// Proposes link types between two verses. Results go to VerseLinkCandidate.
// NEVER surfaced to users until editorially approved.

export type LinkProposal = {
  linkType: VerseLinkType
  rationale: string
}

export async function proposeVerseLinkCandidates(
  verseA: VerseForLinking,
  verseB: VerseForLinking
): Promise<LinkProposal[]> {
  const validTypes: VerseLinkType[] = ['PARALLEL', 'CONTRAST', 'ELABORATION', 'FULFILLMENT_CLAIM']

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 300,
    system: `You are a comparative scripture analyst. Given two verses from different sacred texts, identify meaningful relationships between them.
Link types:
- PARALLEL: the two verses express the same idea or event in very similar terms
- CONTRAST: the two verses make opposing or incompatible claims about the same topic
- ELABORATION: one verse develops or expands on a theme introduced in the other
- FULFILLMENT_CLAIM: one text explicitly claims to fulfill or complete a promise/prophecy in the other

Respond with a JSON array. Each element must have exactly two fields: "linkType" (one of: PARALLEL, CONTRAST, ELABORATION, FULFILLMENT_CLAIM) and "rationale" (one sentence, factual, no theological judgment). Maximum 2 proposals. If no meaningful link exists, return [].`,
    messages: [
      {
        role: 'user',
        content: `Verse A [${verseA.sourceTitle}] (${verseA.referenceKey}):
"${verseA.text}"

Verse B [${verseB.sourceTitle}] (${verseB.referenceKey}):
"${verseB.text}"

Propose 0–2 link types as a JSON array:`,
      },
    ],
  })

  const text = response.content[0]
  if (text.type !== 'text') return []

  const proposals = JSON.parse(text.text.trim())
  if (!Array.isArray(proposals)) return []

  return proposals
    .filter(
      (p) =>
        typeof p === 'object' &&
        validTypes.includes(p.linkType) &&
        typeof p.rationale === 'string'
    )
    .slice(0, 2) as LinkProposal[]
}

// ─── 4. Semantic ranking ──────────────────────────────────────────────────────
// Model-scored relevance ranking over candidate claims. There is no embedding
// store: an earlier `getEmbedding()` stub only ever threw, and the matching
// `Claim.embedding` column was never populated.

export async function semanticRankClaims(
  query: string,
  candidates: { id: number; statement: string }[]
): Promise<number[]> {
  if (candidates.length === 0) return []

  const candidateList = candidates
    .map((c, i) => `${i + 1}. [ID:${c.id}] ${c.statement.slice(0, 150)}`)
    .join('\n')

  try {
    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 150,
      system: `You are a relevance ranker. Given a search query and a list of claim statements, return the IDs of the most relevant claims in order of relevance (most relevant first). Respond with ONLY a JSON array of IDs, e.g. [42, 17, 8]. Include only IDs that are genuinely relevant.`,
      messages: [
        {
          role: 'user',
          content: `Query: "${query}"\n\nClaims:\n${candidateList}\n\nReturn JSON array of relevant claim IDs, most relevant first:`,
        },
      ],
    })

    const text = response.content[0]
    if (text.type !== 'text') return []
    const ids = JSON.parse(text.text.trim())
    if (!Array.isArray(ids)) return []
    return ids.filter((id) => typeof id === 'number')
  } catch {
    return []
  }
}

// ─── 5. Kids story drafts ─────────────────────────────────────────────────────
// Drafts an age-banded retelling from already-published claims, for admin
// review. Never auto-published: the caller stores the result as PENDING, and a
// database CHECK constraint forbids publishing an unapproved row.
//
// SAFETY: this function accepts claim statements and verse *references* only.
// `ClaimForSummary` carries no verse text, so licensed translation text cannot
// reach a kids story even if a caller passes the wrong query result.

export type KidsStoryProposal = {
  title: string
  body: string
  glossary: { term: string; plainDefinition: string }[]
  rationale: string
}

/** Returned when the source claims cannot yield a safe, age-appropriate story. */
export type KidsStoryInsufficient = { insufficient: true; reason: string }

export const KIDS_STORY_MODEL = 'claude-sonnet-4-6'

const KIDS_BAND_GUIDANCE: Record<'AGE_6_8' | 'AGE_9_12', string> = {
  AGE_6_8: `Audience: children aged 6-8, reading with an adult.
- At most 12 words per sentence, and at most 180 words in total.
- Everyday vocabulary. Define any word longer than two syllables in the glossary.
- Introduce at most two names per paragraph.`,
  AGE_9_12: `Audience: children aged 9-12, reading independently.
- At most 18 words per sentence, and at most 350 words in total.
- You may compare the traditions explicitly, as long as you never rank them.`,
}

export async function proposeKidsStory(
  ageBand: 'AGE_6_8' | 'AGE_9_12',
  claims: ClaimForSummary[],
): Promise<KidsStoryProposal | KidsStoryInsufficient> {
  const claimsBlock = claims
    .map(
      (c, i) =>
        `Claim ${i + 1} [${c.sourceTitle}] (verses: ${c.verseRefs.join(', ')}):\n"${c.statement}"`,
    )
    .join('\n\n')

  const response = await client.messages.create({
    model: KIDS_STORY_MODEL,
    max_tokens: 1200,
    system: `You write short, factual, neutral retellings for children about what the Jewish, Christian, and Islamic scriptures say. Your work is reviewed by an editor before any child sees it.

ATTRIBUTION — every statement about content must be attributed to a text:
- Write "The Torah tells this story as...", "The Quran describes...", "These books tell this part differently."
- Never narrate religious events as plain fact. Never write "God said X" as narration; write "The Torah says that God said X".

NEUTRALITY — you describe, you never adjudicate:
- Where the texts differ, say so plainly and warmly: "These books tell this part differently."
- Never say one text is right, older, better, corrected, fulfilled, or superseded by another.
- Never use: truly, actually, correctly, the real, proves, obviously, merely.
- No second-person religious instruction. Never write "you should pray/believe", "we believe", "our faith".

SAFETY:
- No violence, killing, blood, punishment, hell, or frightening detail. If the claims are mainly about such things, decline (see below).
- Do not describe the physical appearance of Muhammad or any prophet; use names only.
- Never quote scripture. Refer to passages by reference only (e.g. "Genesis 21:2").
- Use only what the provided claims state. Do not add any fact that is not in them.

${KIDS_BAND_GUIDANCE[ageBand]}

OUTPUT — strict JSON, no prose outside it, no markdown fence:
{"title": "...", "body": "...", "glossary": [{"term": "...", "plainDefinition": "..."}], "rationale": "why this is faithful to the claims and safe for this age"}

If the claims cannot produce a safe, age-appropriate, neutral story, output instead:
{"insufficient": true, "reason": "..."}`,
    messages: [
      {
        role: 'user',
        content: `Write one short story for this age band, based only on these published claims:\n\n${claimsBlock}`,
      },
    ],
  })

  const block = response.content[0]
  const raw = block?.type === 'text' ? block.text.trim() : ''
  // Tolerate a stray markdown fence even though the prompt forbids one.
  const json = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '')

  let parsed: unknown
  try {
    parsed = JSON.parse(json)
  } catch {
    return { insufficient: true, reason: 'Model did not return valid JSON.' }
  }

  if (typeof parsed !== 'object' || parsed === null) {
    return { insufficient: true, reason: 'Model returned an unexpected shape.' }
  }

  const obj = parsed as Record<string, unknown>
  if (obj.insufficient === true) {
    return {
      insufficient: true,
      reason: typeof obj.reason === 'string' ? obj.reason : 'Claims were unsuitable.',
    }
  }

  if (typeof obj.title !== 'string' || typeof obj.body !== 'string') {
    return { insufficient: true, reason: 'Model response was missing a title or body.' }
  }

  const glossary = Array.isArray(obj.glossary)
    ? obj.glossary.flatMap((g) => {
        const entry = g as Record<string, unknown>
        return typeof entry?.term === 'string' && typeof entry?.plainDefinition === 'string'
          ? [{ term: entry.term, plainDefinition: entry.plainDefinition }]
          : []
      })
    : []

  return {
    title: obj.title,
    body: obj.body,
    glossary,
    rationale: typeof obj.rationale === 'string' ? obj.rationale : '',
  }
}
