import clsx from 'clsx'

type TileProps = {
  letter: string
  muted?: boolean
  /** visual context */
  intent?: 'default' | 'bag' | 'stack' | 'error'
  className?: string
}

export function Tile({
  letter,
  muted = false,
  intent = 'default',
  className,
}: TileProps) {
  const base =
    'inline-flex items-center justify-center rounded-2xl border ' +
    'font-semibold select-none shadow-sm transition'

  // Order matters: muted overrides everything; otherwise choose by intent.
  const tone = muted
    ? 'bg-gray-50 border-gray-200 text-gray-400'
    : intent === 'bag'
      ? 'bg-emerald-50 border-emerald-300 text-slate-900'
      : intent === 'stack'
        ? 'bg-cyan-50 border-cyan-300 text-slate-900'
        : intent === 'error'
          ? 'bg-red-50 border-red-300 text-slate-900'
          : 'bg-white border-gray-300 text-slate-900'

  return (
    <div className={clsx(base, tone, className)} aria-hidden>
      {letter}
    </div>
  )
}
