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
    <div className="candidate-row">
      {letters.map((ch, i) => {
        const m = slotMeta[i]
        const isError = m?.source === 'error'
        const fromStack = m?.source === 'stack'
        const fromBag = m?.source === 'bag'
        const key = `${i}-${ch}-${m?.source ?? 'n'}`
        const filled = !!ch.trim()

        // Map meta -> intent semantics
        const intent =
          isError ? 'error' : fromStack ? 'stack' : fromBag ? 'bag' : 'default'

        return (
          <div
            key={key}
            data-slot-idx={i}
            role="button"
            tabIndex={0}
            onClick={() => {
              if (filled && i === last) popLetter()
            }}
            className={clsx('tile')}
            data-intent={intent}
            data-size="lg"
            // emphasis not used for candidate tiles by default
          >
            {ch.trim() || ''}
          </div>
        )
      })}
    </div>
  )
}
