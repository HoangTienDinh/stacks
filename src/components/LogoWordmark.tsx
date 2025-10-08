import { Tile } from '@/components/Tile'
import clsx from 'clsx'

type Props = {
  letters?: string
  className?: string
}

/** Alternates cyan/emerald tiles and scales responsively. */
export function LogoWordmark({ letters = 'STACKS', className }: Props) {
  const chars = letters.split('')

  return (
    <div className={clsx('flex items-center justify-center gap-2 sm:gap-3', className)}>
      {chars.map((ch, i) => (
        <Tile
          key={`${ch}-${i}`}
          letter={ch}
          intent={i % 2 === 0 ? 'stack' : 'bag'}
          className="w-[clamp(52px,14vw,80px)] h-[clamp(52px,14vw,80px)]
                     text-[clamp(20px,5.5vw,34px)]"
        />
      ))}
    </div>
  )
}
