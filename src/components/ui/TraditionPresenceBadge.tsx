import type { TraditionPresence } from '@prisma/client'
import { TRADITION_PRESENCE_LABEL, TRADITION_PRESENCE_STYLE, TRADITION_PRESENCE_ICON } from '@/lib/constants'

export function TraditionPresenceBadge({ presence }: { presence: TraditionPresence }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${TRADITION_PRESENCE_STYLE[presence]}`}>
      <span>{TRADITION_PRESENCE_ICON[presence]}</span>
      <span>{TRADITION_PRESENCE_LABEL[presence]}</span>
    </span>
  )
}
