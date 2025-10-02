import { useGameStore } from '@/store/gameStore'
import clsx from 'clsx'

export function CandidateRow() {
  const { candidate, popLetter, slotMeta } = useGameStore(s => ({
    candidate: s.candidate,
    popLetter: s.popLetter,
    slotMeta: s.slotMeta,
  }))

  const letters = candidate.padEnd(5, ' ').slice(0,5).split('')
  const last = candidate.trimEnd().length - 1

  return (
    <div className="flex items-center justify-center gap-3 min-h-[88px]">
      {letters.map((ch, i) => {
        const m = slotMeta[i]
        const isError   = m?.source === 'error'
        const fromStack = m?.source === 'stack'
        const fromBag   = m?.source === 'bag'
        const key = `${i}-${ch}-${m?.source ?? 'n'}`
        const filled = !!ch.trim()
        return (
          <div
            key={key}
            data-slot-idx={i}
            role="button"
            tabIndex={0}
            onClick={() => { if (filled && i === last) popLetter() }}
            className={clsx(
              'tile tile-lg w-16 h-16 sm:w-20 sm:h-20 transition-[box-shadow,transform]',
              isError && 'tile-error',
              fromStack && 'tile-from-stack',
              fromBag && 'tile-from-bag'
            )}
          >
            {ch.trim() || ''}
          </div>
        )
      })}
    </div>
  )
}
