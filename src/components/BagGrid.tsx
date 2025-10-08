import clsx from 'clsx'
import { useGameStore } from '@/store/gameStore'
import { Tile } from './Tile'

export function BagGrid() {
  const {
    puzzle, usedIndices, previewReserved, pushLetter, currentStack, candidate,
  } = useGameStore(s => ({
    puzzle: s.puzzle,
    usedIndices: s.usedIndices,
    previewReserved: s.previewReserved,
    pushLetter: s.pushLetter,
    currentStack: s.currentStack,
    candidate: s.candidate,
  }))

  const nextIdx = candidate.padEnd(5, ' ').slice(0, 5).indexOf(' ')

  return (
    <div className="mt-2 mb-6">
      <div
        className="mx-auto grid grid-cols-4 place-items-center gap-3 md:gap-4 max-w-[400px]"
      >
        {puzzle.bagList.map((ch, i) => {
          const used = usedIndices.has(i)
          const reserved = previewReserved.has(i)
          const muted = used || reserved
          const isPosHint = !muted && nextIdx !== -1 && currentStack[nextIdx] === ch

          return (
            <button
              key={i}
              type="button"
              onClick={() => !muted && pushLetter(ch)}
              disabled={muted}
              className={clsx(
                'rounded-xl',
                isPosHint && 'ring-2 ring-cyan-300 ring-offset-1'
              )}
              aria-label={`Bag tile ${ch}${used ? ', used' : reserved ? ', in use' : isPosHint ? ', positional match' : ', available'}`}
              title={isPosHint ? 'Positional match — will use from current stack' : undefined}
            >
              {/* Force the same square + type size as CandidateRow */}
              <Tile
                letter={ch}
                muted={muted}
                intent="bag"
                className="w-16 h-16 text-2xl sm:w-20 sm:h-20 sm:text-3xl"
              />
            </button>
          )
        })}
      </div>
    </div>
  )
}
