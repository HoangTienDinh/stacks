import clsx from 'clsx'
import { Tile } from '@/components/Tile'

/**
 * Alternates "stack" (cyan) and "bag" (emerald) tile colors,
 * and scales responsively so six tiles always fit on mobile.
 */
export function LogoWordmark({ letters = 'STACKS' }: { letters?: string }) {
  const chars = letters.split('')

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3">
      {chars.map((ch, i) => {
        const isStack = i % 2 === 0 // even = cyan, odd = green
        return (
          <Tile
            key={`${ch}-${i}`}
            letter={ch}
            className={clsx(
              // responsive square + responsive type
              'w-[clamp(44px,12vw,72px)] h-[clamp(44px,12vw,72px)]',
              'text-[clamp(18px,5vw,32px)] rounded-2xl shadow-sm',
              // colorways (override Tile’s default bg/border)
              isStack ? 'bg-cyan-50 border-cyan-300' : 'bg-emerald-50 border-emerald-300'
            )}
          />
        )
      })}
    </div>
  )
}
