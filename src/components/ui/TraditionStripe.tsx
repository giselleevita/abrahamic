/**
 * The three-tradition colour bar.
 *
 * It previously appeared in three places with two different palettes — the
 * hero used `jewish/christian/islamic`, the concept cards used raw
 * `blue-400/red-400/green-400`. Consolidating fixes that inconsistency.
 *
 * Decorative: hidden from assistive tech, since the traditions are always
 * named in adjacent text.
 */
interface TraditionStripeProps {
  /** `bar` is a thin full-width rule; `segments` are separated rounded pills. */
  variant?: 'bar' | 'segments'
  className?: string
}

export function TraditionStripe({ variant = 'bar', className = '' }: TraditionStripeProps) {
  const colors = ['bg-jewish-500', 'bg-christian-500', 'bg-islamic-500']

  if (variant === 'segments') {
    return (
      <div className={`flex gap-1.5 ${className}`} aria-hidden="true">
        {colors.map((c) => (
          <div key={c} className={`h-1.5 w-20 rounded-full ${c}`} />
        ))}
      </div>
    )
  }

  return (
    <div className={`flex h-1 ${className}`} aria-hidden="true">
      {colors.map((c) => (
        <div key={c} className={`flex-1 ${c}`} />
      ))}
    </div>
  )
}
