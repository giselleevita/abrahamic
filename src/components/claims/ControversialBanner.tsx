export function ControversialBanner() {
  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 flex gap-3 items-start">
      <span className="text-amber-500 text-base leading-none mt-0.5" aria-hidden>⚠</span>
      <div>
        <p className="text-sm font-medium text-amber-800">Contested interpretation</p>
        <p className="mt-0.5 text-xs text-amber-700 leading-relaxed">
          Scholars and traditions disagree on aspects of this comparison. The tag and framing
          represent one editorial reading; readers are encouraged to consult primary sources directly.
        </p>
      </div>
    </div>
  )
}
