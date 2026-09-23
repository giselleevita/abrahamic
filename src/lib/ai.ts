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
  void text
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

// ─── 5. Quiz Question Candidates ──────────────────────────────────────────────
// Drafts quiz questions for editorial review. Output is ALWAYS a candidate that
// a human approves or rejects — nothing here writes a published question.
//
// The neutrality rule this prompt has to respect: the correct answer must be a
// fact about what a NAMED tradition teaches or what a NAMED text says, never an
// unattributed truth claim. Drafts are additionally run through
// src/lib/learn/neutrality.ts, which blocks on violations, so a bad generation
// is caught even if the prompt is ignored.

export type QuestionSourceContext = {
  sourceType: 'CONCEPT' | 'COMPARISON'
  title: string
  summary: string | null
  /** Per-tradition positions, when the source has them. */
  traditions: { tradition: string; text: string }[]
  /** True for a controversial or CONTRADICTION-tagged comparison. */
  isContested: boolean
}

export type QuestionProposal = {
  kind: 'TRADITION_TEACHING' | 'FIGURE_IDENTITY' | 'SOURCE_TEXT' | 'DIVERGENCE_MAP' | 'TERMINOLOGY'
  prompt: string
  explanation: string
  subjectTradition: 'JEWISH' | 'CHRISTIAN' | 'ISLAMIC' | null
  options: {
    text: string
    isCorrect: boolean
    optionTradition: 'JEWISH' | 'CHRISTIAN' | 'ISLAMIC' | null
    rationale: string | null
  }[]
  aiRationale: string
}

const QUESTION_SYSTEM = `You draft multiple-choice questions for an educational site comparing Judaism, Christianity and Islam.

THE ONE RULE THAT MATTERS: a question's correct answer must be a fact about what a NAMED tradition teaches, or what a NAMED text says. Never write a question whose correct answer asserts a theological truth.

Write:   "What does Islam teach about the crucifixion?"
Never:   "What really happened at the crucifixion?"
Never:   "Which tradition is correct about X?"

Question kinds:
- TRADITION_TEACHING — "What does <tradition> teach about X?" You MUST set subjectTradition, and the prompt text must name that tradition.
- FIGURE_IDENTITY — "In <tradition>, who is X?" You MUST set subjectTradition.
- TERMINOLOGY — "What does the term X refer to?" Definitional only. subjectTradition is null.
- DIVERGENCE_MAP — "What position does each tradition take on X?" Provide exactly one option per tradition (JEWISH, CHRISTIAN, ISLAMIC), each with optionTradition set and isCorrect true, each stating that tradition's actual position. subjectTradition is null.

For contested topics use DIVERGENCE_MAP or TRADITION_TEACHING only. On contested topics EVERY option must either set optionTradition or carry a rationale explaining why it is not that tradition's teaching — never leave a bare wrong answer that implies a tradition is simply mistaken.

Distractors must be plausible and respectful: prefer another tradition's actual position (with optionTradition set) over invented nonsense. Never mock a belief.

"explanation" states why the answer is the answer, in two sentences at most, reporting rather than endorsing.
"aiRationale" is one sentence for the human reviewer on why this question is worth asking.

Respond with a JSON array of 1-3 question objects and nothing else.`

export async function proposeQuestionCandidates(
  context: QuestionSourceContext,
  count = 2,
): Promise<QuestionProposal[]> {
  const traditionLines = context.traditions
    .map((t) => `- ${t.tradition}: ${t.text}`)
    .join('\n')

  const response = await client.messages.create({
    model: 'claude-opus-5',
    max_tokens: 4000,
    system: QUESTION_SYSTEM,
    messages: [
      {
        role: 'user',
        content: `Source (${context.sourceType}): ${context.title}
${context.summary ? `\nSummary: ${context.summary}` : ''}
${traditionLines ? `\nPositions by tradition:\n${traditionLines}` : ''}

This material is ${context.isContested ? 'CONTESTED — restrict yourself to DIVERGENCE_MAP or TRADITION_TEACHING, and attribute every option.' : 'not flagged as contested.'}

Draft ${count} question(s) as a JSON array:`,
      },
    ],
  })

  const block = response.content.find((b) => b.type === 'text')
  if (!block || block.type !== 'text') return []

  let parsed: unknown
  try {
    // Tolerate the model wrapping JSON in prose or a code fence.
    const match = block.text.match(/\[[\s\S]*\]/)
    parsed = JSON.parse(match ? match[0] : block.text.trim())
  } catch {
    return []
  }
  if (!Array.isArray(parsed)) return []

  const KINDS = ['TRADITION_TEACHING', 'FIGURE_IDENTITY', 'SOURCE_TEXT', 'DIVERGENCE_MAP', 'TERMINOLOGY']
  const TRADITIONS = ['JEWISH', 'CHRISTIAN', 'ISLAMIC']

  return parsed
    .filter(
      (p): p is QuestionProposal =>
        typeof p === 'object' && p !== null &&
        KINDS.includes((p as QuestionProposal).kind) &&
        typeof (p as QuestionProposal).prompt === 'string' &&
        typeof (p as QuestionProposal).explanation === 'string' &&
        Array.isArray((p as QuestionProposal).options) &&
        (p as QuestionProposal).options.length >= 2,
    )
    .map((p) => ({
      ...p,
      subjectTradition: TRADITIONS.includes(p.subjectTradition as string)
        ? p.subjectTradition
        : null,
      aiRationale: typeof p.aiRationale === 'string' ? p.aiRationale : 'No rationale given.',
      options: p.options.slice(0, 5).map((o) => ({
        text: String(o.text ?? ''),
        isCorrect: o.isCorrect === true,
        optionTradition: TRADITIONS.includes(o.optionTradition as string) ? o.optionTradition : null,
        rationale: typeof o.rationale === 'string' ? o.rationale : null,
      })),
    }))
    .slice(0, count)
}

// ─── 6. Kids story drafts ─────────────────────────────────────────────────────

export type KidsStoryProposal = {
  title: string
  body: string
  glossary: { term: string; plainDefinition: string }[]
  rationale: string
}

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
  const claimsBlock = claims.map((c, i) =>
    `Claim ${i + 1} [${c.sourceTitle}] (verses: ${c.verseRefs.join(', ')}):\n"${c.statement}"`,
  ).join('\n\n')

  const response = await client.messages.create({
    model: KIDS_STORY_MODEL,
    max_tokens: 1200,
    system: `Write short, neutral retellings for children about what Jewish, Christian, and Islamic scriptures say. Editors review every draft before publication.

Attribute every content statement to a named text. Never narrate religious claims as plain fact. Describe differences warmly and never rank traditions. Do not use evaluative language or second-person religious instruction. Avoid violence, frightening detail, physical descriptions of prophets, and scripture quotations. Use only the supplied claims.

${KIDS_BAND_GUIDANCE[ageBand]}

Return strict JSON only: {"title":"...","body":"...","glossary":[{"term":"...","plainDefinition":"..."}],"rationale":"..."}. If unsuitable return {"insufficient":true,"reason":"..."}.`,
    messages: [{ role: 'user', content: `Write one story based only on these published claims:\n\n${claimsBlock}` }],
  })

  const block = response.content[0]
  const raw = block?.type === 'text' ? block.text.trim() : ''
  const json = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '')
  let parsed: unknown
  try { parsed = JSON.parse(json) } catch {
    return { insufficient: true, reason: 'Model did not return valid JSON.' }
  }
  if (typeof parsed !== 'object' || parsed === null) {
    return { insufficient: true, reason: 'Model returned an unexpected shape.' }
  }
  const obj = parsed as Record<string, unknown>
  if (obj.insufficient === true) {
    return { insufficient: true, reason: typeof obj.reason === 'string' ? obj.reason : 'Claims were unsuitable.' }
  }
  if (typeof obj.title !== 'string' || typeof obj.body !== 'string') {
    return { insufficient: true, reason: 'Model response was missing a title or body.' }
  }
  const glossary = Array.isArray(obj.glossary) ? obj.glossary.flatMap((item) => {
    const entry = item as Record<string, unknown>
    return typeof entry?.term === 'string' && typeof entry?.plainDefinition === 'string'
      ? [{ term: entry.term, plainDefinition: entry.plainDefinition }]
      : []
  }) : []
  return {
    title: obj.title,
    body: obj.body,
    glossary,
    rationale: typeof obj.rationale === 'string' ? obj.rationale : '',
  }
}
