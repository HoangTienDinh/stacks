import clsx from 'clsx'

import { useGameStore } from '@/store/gameStore'

export function CandidateRow() {
  const { candidate, popLetter, slotMeta } = useGameStore((s) => ({
    candidate: s.candidate,
    popLetter: s.popLetter,
    slotMeta: s.slotMeta,
  }))

  const letters = candidate.padEnd(5, ' ').slice(0, 5).split('')
  const last = candidate.trimEnd().length - 1

  return (
    <div className="flex min-h-[88px] items-center justify-center gap-3">
      {letters.map((ch, i) => {
        const m = slotMeta[i]
        const intent =
          m?.source === 'error' ? 'error'
          : m?.source === 'stack' ? 'stack'
          : m?.source === 'bag' ? 'bag'
          : 'default'
        const key = `${i}-${ch}-${m?.source ?? 'n'}`
        const filled = !!ch.trim()

        return (
          <div
            key={key}
            data-slot-idx={i}
            role="button"
            tabIndex={0}
            onClick={() => {
              if (filled && i === last) popLetter()
            }}
            className={clsx('tile transition-[box-shadow,transform]')}
            data-intent={intent}
            data-size="lg"
          >
            {ch.trim() || ''}
          </div>
        )
      })}
    </div>
  )
}
