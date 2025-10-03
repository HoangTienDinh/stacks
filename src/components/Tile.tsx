import clsx from 'clsx'

type TileProps = {
  letter: string
  muted?: boolean
  /** visual context. "bag" = soft green for unused bag tiles */
  intent?: 'default' | 'bag' | 'error'
  className?: string
}

export function Tile({
  letter,
  muted = false,
  intent = 'default',
  className,
}: TileProps) {
  const base =
    'inline-flex h-16 w-16 items-center justify-center rounded-2xl ' +
    'border text-2xl font-semibold select-none shadow-sm transition'

  const tone = muted
    ? 'bg-gray-50 border-gray-200 text-gray-400'
    : intent === 'bag'
      ? 'bg-emerald-50 border-emerald-300 text-slate-900 hover:bg-emerald-100'
      : intent === 'error'
        ? 'bg-red-50 border-red-300 text-slate-900'
        : 'bg-white border-gray-300 text-slate-900 hover:bg-gray-100'

  return (
    <div className={clsx(base, tone, className)} aria-hidden>
      {letter}
    </div>
  )
}
