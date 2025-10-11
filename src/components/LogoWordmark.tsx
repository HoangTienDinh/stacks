import clsx from 'clsx'

import { Tile } from '@/components/Tile'

type Props = {
  letters?: string
  className?: string
}

export function LogoWordmark({ letters = 'STACKS', className }: Props) {
  const chars = letters.split('')

  return (
  <div className={clsx('w-full px-3', className)}>
    <div className="mx-auto flex max-w-[560px] items-center justify-center gap-1.5 sm:gap-3">
        {chars.map((ch, i) => (
          <Tile
            key={`${ch}-${i}`}
            letter={ch}
            intent={i % 2 === 0 ? 'stack' : 'bag'}
          size="sm"
          className="h-[clamp(40px,12.5vw,72px)] w-[clamp(40px,12.5vw,72px)] text-[clamp(18px,4.8vw,30px)]"
          />
        ))}
    </div>
    </div>
  )
}
