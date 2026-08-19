import type { ElementType, ReactNode } from 'react'
import { textAttributes } from '@/lib/text-direction'

/**
 * Renders scripture text with the correct writing direction and language.
 *
 * Wrapping it in a component rather than repeating `dir={...}` at each call
 * site means a new render site cannot forget — and there were four such sites
 * before this existed, none of which set direction at all.
 *
 * `quoted` adds typographic quotation marks *outside* the directional run, so
 * the closing mark lands on the correct side of right-to-left text. Writing
 * `"{text}"` inline, as the old code did, puts both marks on the wrong side.
 */
interface ScriptTextProps {
  text: string
  as?: ElementType
  className?: string
  quoted?: boolean
  children?: ReactNode
}

export function ScriptText({
  text,
  as: Tag = 'p',
  className = '',
  quoted = false,
}: ScriptTextProps) {
  const attrs = textAttributes(text)

  return (
    <Tag
      dir={attrs.dir}
      lang={attrs.lang}
      className={`${className} ${attrs.className}`.trim()}
    >
      {quoted ? <>&ldquo;{text}&rdquo;</> : text}
    </Tag>
  )
}
