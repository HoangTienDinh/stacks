import clsx from 'clsx'

type TileIntent = 'default' | 'bag' | 'stack' | 'error'
type TileHint = 'pos' | undefined

type TileProps = {
  letter: string
  muted?: boolean
  intent?: TileIntent
  emphasis?: boolean
  size?: 'lg' | 'md' | 'sm'
  hint?: TileHint
  className?: string
}

export function Tile({
  letter,
  muted = false,
  intent = 'default',
  emphasis = false,
  size = 'lg',
  hint,
  className,
}: TileProps) {
  return (
    <div
      className={clsx('tile', className)}
      data-intent={intent}
      data-muted={muted || undefined}
      data-emphasis={emphasis || undefined}
      data-size={size}
      data-hint={hint}
      aria-hidden
    >
      {letter}
    </div>
  )
}
