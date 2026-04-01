import Anthropic from '@anthropic-ai/sdk'
import type { VerseLinkType } from '@prisma/client'

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

// ─── 4. Semantic Search ───────────────────────────────────────────────────────
// Computes dot-product similarity between a query embedding and stored claim embeddings.
// Called only as a fallback when keyword search returns <5 results.

export async function getEmbedding(text: string): Promise<number[]> {
  // Use a concise summary passage to get a representative embedding via the messages API
  // We use the model to score relevance rather than a native embedding endpoint
  // for MVP compatibility. Returns a pseudo-embedding via structured scoring.
  //
  // For production, replace with a proper embeddings API call.
  // This lightweight version asks the model to score relevance 0-100 and uses
  // that as a single-dimensional "embedding" for ranking purposes.
  throw new Error('Use semanticRankClaims instead of getEmbedding directly')
}

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
