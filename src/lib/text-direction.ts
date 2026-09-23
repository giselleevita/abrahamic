/**
 * Script and writing-direction detection for scripture text.
 *
 * The app has always shipped Hebrew and Arabic and never set `dir` anywhere, so
 * right-to-left text was being laid out left-to-right. At 94 verses with short
 * fragments it was easy to miss; it is glaring at corpus scale, and it makes
 * punctuation and mixed-direction lines render in the wrong order.
 *
 * Direction is derived from the text itself rather than from the source's
 * declared language, because one source carries translations in several
 * scripts — the Torah has both Hebrew (RTL) and English reader notes (LTR).
 * Detecting per string also means imported translations work with no metadata
 * migration and no per-publisher configuration.
 */

export type Script = 'hebrew' | 'arabic' | 'greek' | 'latin'
export type Direction = 'rtl' | 'ltr'

// Hebrew: main block plus the alphabetic presentation forms used for ligatures.
const HEBREW = /[֐-׿יִ-ﭏ]/
// Arabic: main block, supplement, extended-A, and presentation forms.
const ARABIC = /[؀-ۿݐ-ݿࢠ-ࣿﭐ-﷿ﹰ-﻿]/
const GREEK = /[Ͱ-Ͽἀ-῿]/

/**
 * The dominant script of a string.
 *
 * Counts characters rather than testing for presence, because a mostly-English
 * reader note that cites one Hebrew word should still read as Latin — and so
 * still lay out left-to-right.
 */
export function detectScript(text: string): Script {
  let hebrew = 0
  let arabic = 0
  let greek = 0
  let latin = 0

  for (const char of text) {
    if (HEBREW.test(char)) hebrew += 1
    else if (ARABIC.test(char)) arabic += 1
    else if (GREEK.test(char)) greek += 1
    else if (/[a-zA-Z]/.test(char)) latin += 1
  }

  const max = Math.max(hebrew, arabic, greek, latin)
  if (max === 0) return 'latin'
  if (max === hebrew) return 'hebrew'
  if (max === arabic) return 'arabic'
  if (max === greek) return 'greek'
  return 'latin'
}

export function directionOf(text: string): Direction {
  const script = detectScript(text)
  return script === 'hebrew' || script === 'arabic' ? 'rtl' : 'ltr'
}

/** BCP-47 tag, so screen readers switch voice and hyphenation follows suit. */
export function langOf(text: string): string {
  switch (detectScript(text)) {
    case 'hebrew': return 'he'
    case 'arabic': return 'ar'
    case 'greek':  return 'el'
    default:       return 'en'
  }
}

/**
 * Everything a rendered scripture string needs.
 *
 * `dir` and `lang` are spread onto the element; the class raises the size of
 * Hebrew and Arabic, whose glyphs read smaller than Latin at the same point
 * size and are genuinely hard to read otherwise.
 */
export function textAttributes(text: string): {
  dir: Direction
  lang: string
  className: string
} {
  const script = detectScript(text)
  const rtl = script === 'hebrew' || script === 'arabic'

  return {
    dir: rtl ? 'rtl' : 'ltr',
    lang: langOf(text),
    className: rtl ? 'text-[1.15em] leading-loose' : '',
  }
}
