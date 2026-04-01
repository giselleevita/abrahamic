import type {
  Source,
  Verse,
  VerseTranslation,
  Figure,
  FigureAlias,
  Theme,
  Claim,
  ClaimVerse,
  Comparison,
  ComparisonClaim,
  VerseLink,
  InterpretationScope,
} from '@prisma/client'

export type { InterpretationScope }

export type SourceWithCounts = Source & {
  _count: { verses: number; claims: number }
}

export type VerseWithTranslations = Verse & {
  translations: VerseTranslation[]
  source: Source
}

export type FigureWithAliases = Figure & {
  aliases: FigureAlias[]
  _count: { claims: number }
}

export type ThemeWithCounts = Theme & {
  _count: { claims: number }
}

export type ClaimWithRelations = Claim & {
  source: Source
  verses: (ClaimVerse & { verse: VerseWithTranslations })[]
  figures: { figure: Figure }[]
  themes: { theme: Theme }[]
}

export type ComparisonWithClaims = Comparison & {
  claims: (ComparisonClaim & { claim: ClaimWithRelations })[]
}

export type VerseLinkWithVerses = VerseLink & {
  verseA: VerseWithTranslations
  verseB: VerseWithTranslations
}

export type SearchResults = {
  figures: FigureWithAliases[]
  themes: ThemeWithCounts[]
  claims: ClaimWithRelations[]
  verses: VerseWithTranslations[]
}
