import Link from 'next/link'
import { BIG_LINKS, BIG_NODES, type BigLink, type BigNode } from '@/lib/big-picture'

const FIG_W = 132
const FIG_H = 46
const REL_W = 190
const REL_H = 62

const size = (n: BigNode) => (n.kind === 'religion' ? { w: REL_W, h: REL_H } : { w: FIG_W, h: FIG_H })

function geometry(link: BigLink, byId: Map<string, BigNode>) {
  const a = byId.get(link.from)!
  const b = byId.get(link.to)!
  const sa = size(a)
  const sb = size(b)
  if (Math.abs(a.y - b.y) < 5) {
    const dir = b.x > a.x ? 1 : -1
    const x1 = a.x + (dir * sa.w) / 2
    const x2 = b.x - (dir * sb.w) / 2
    return { d: `M ${x1} ${a.y} H ${x2}`, mx: (x1 + x2) / 2, my: a.y - 8 }
  }
  const x1 = a.x
  const y1 = a.y + sa.h / 2
  const x2 = b.x
  const y2 = b.y - sb.h / 2
  const mid = (y1 + y2) / 2
  return { d: `M ${x1} ${y1} C ${x1} ${mid}, ${x2} ${mid}, ${x2} ${y2}`, mx: (x1 + x2) / 2, my: mid }
}

const KIND_LABEL: Record<BigLink['kind'], string> = {
  recorded: 'Recorded family link',
  tradition: 'A tradition’s own account',
  honoured: 'Honoured by a later tradition',
  gap: 'Generations not drawn',
}

export function BigPictureDiagram() {
  const byId = new Map(BIG_NODES.map((n) => [n.id, n]))
  const drawn = BIG_LINKS.filter((l) => l.kind !== 'honoured')
  const honoured = (religionId: string) =>
    BIG_LINKS.filter((l) => l.kind === 'honoured' && l.to === religionId).map((l) => byId.get(l.from)!.label)

  return (
    <section aria-labelledby="big-picture-title" className="space-y-5">
      <div>
        <p className="editorial-eyebrow">The whole picture</p>
        <h2 id="big-picture-title" className="mt-1 font-serif text-3xl text-primary-950">
          How three traditions grew from shared roots
        </h2>
        <p className="mt-3 max-w-3xl text-base leading-7 text-primary-700">
          All three begin with a shared story: Adam, Noah and then Abraham. From Abraham the
          paths divide. Each tradition tells its own account of how it began, and the same
          people are remembered in more than one of them.
        </p>
      </div>

      <figure className="rounded-3xl border border-[#d7c5ad] bg-gradient-to-b from-[#fbf6ec] to-white p-3 sm:p-6">
        <div className="overflow-x-auto" tabIndex={0} role="region" aria-label="Overview diagram of how the three traditions are connected, scrollable">
          <svg
            role="group"
            aria-label="Diagram: Adam, Noah and Abraham lead to Isaac and Ishmael, and onward to the origins of Judaism, Christianity and Islam. A text list of every connection follows."
            viewBox="0 0 900 860"
            className="mx-auto block h-auto w-full min-w-[720px] max-w-[900px]"
          >
            <defs>
              <marker id="bp-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#8a6a3b" />
              </marker>
            </defs>

            <g fill="none" strokeLinecap="round">
              {drawn.map((l) => {
                const g = geometry(l, byId)
                const style =
                  l.kind === 'recorded'
                    ? { stroke: '#173b68', strokeWidth: 3 }
                    : l.kind === 'tradition'
                      ? { stroke: '#8a6a3b', strokeWidth: 2.5, strokeDasharray: '8 6', markerEnd: 'url(#bp-arrow)' }
                      : { stroke: '#a89d91', strokeWidth: 2, strokeDasharray: '2 7' }
                return <path key={`${l.from}-${l.to}`} d={g.d} {...style} />
              })}
            </g>

            <g fontSize="12" fill="#534841" textAnchor="middle" style={{ paintOrder: 'stroke' }} stroke="#fbf6ec" strokeWidth="4">
              {drawn.filter((l) => l.label).map((l) => {
                const g = geometry(l, byId)
                return (
                  <text key={`t-${l.from}-${l.to}`} x={g.mx} y={g.my + 4}>
                    {l.label}
                  </text>
                )
              })}
            </g>

            {BIG_NODES.map((n) => {
              const { w, h } = size(n)
              const isRel = n.kind === 'religion'
              const body = (
                <g className={n.slug ? 'family-node' : undefined}>
                  <title>{n.slug ? `${n.label} — read about this person` : n.label}</title>
                  <rect
                    x={n.x - w / 2}
                    y={n.y - h / 2}
                    width={w}
                    height={h}
                    rx={isRel ? 20 : 16}
                    fill={isRel ? '#173b68' : '#ffffff'}
                    stroke="#173b68"
                    strokeWidth="2"
                  />
                  <text x={n.x} y={n.y + (n.sub ? -3 : 6)} textAnchor="middle" fontSize={isRel ? 19 : 16} fontWeight="700" fill={isRel ? '#fff9ed' : '#173b68'}>
                    {n.label}
                  </text>
                  {n.sub && (
                    <text x={n.x} y={n.y + 13} textAnchor="middle" fontSize="11" fill={isRel ? '#e2c69e' : '#6e6259'}>
                      {n.sub}
                    </text>
                  )}
                </g>
              )
              return n.slug ? (
                <Link key={n.id} href={`/figures/${n.slug}`} prefetch={false}>
                  {body}
                </Link>
              ) : (
                <g key={n.id}>{body}</g>
              )
            })}

            {BIG_NODES.filter((n) => n.kind === 'religion').map((n) => {
              const names = honoured(n.id)
              if (!names.length) return null
              return (
                <text key={`h-${n.id}`} x={n.x} y={n.y + REL_H / 2 + 20} textAnchor="middle" fontSize="12" fontStyle="italic" fill="#534841">
                  Also honours {names.join(', ')}
                </text>
              )
            })}
          </svg>
        </div>

        <figcaption className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs text-primary-700" aria-label="Key">
          <span className="inline-flex items-center gap-2"><svg width="34" height="6" aria-hidden="true"><line x1="0" y1="3" x2="34" y2="3" stroke="#173b68" strokeWidth="3" /></svg>Recorded family link</span>
          <span className="inline-flex items-center gap-2"><svg width="34" height="6" aria-hidden="true"><line x1="0" y1="3" x2="34" y2="3" stroke="#8a6a3b" strokeWidth="2.5" strokeDasharray="8 6" /></svg>A tradition’s own account</span>
          <span className="inline-flex items-center gap-2"><svg width="34" height="6" aria-hidden="true"><line x1="0" y1="3" x2="34" y2="3" stroke="#a89d91" strokeWidth="2" strokeDasharray="2 7" /></svg>Generations not drawn</span>
        </figcaption>
      </figure>

      <details className="rounded-2xl border border-primary-200 bg-white p-5">
        <summary className="cursor-pointer text-base font-semibold text-primary-900">Read every connection as text, with its source</summary>
        <ul className="mt-4 space-y-3 text-sm leading-6 text-primary-800">
          {BIG_LINKS.map((l) => (
            <li key={`${l.from}-${l.to}`}>
              <span className="font-semibold">{byId.get(l.from)!.label} → {byId.get(l.to)!.label}</span>{' '}
              <span className="rounded-full bg-primary-100 px-2 py-0.5 text-xs">{KIND_LABEL[l.kind]}</span>
              <br />
              {l.source}
            </li>
          ))}
        </ul>
      </details>
    </section>
  )
}
