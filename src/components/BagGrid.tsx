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

  // First empty slot in the candidate row
  const nextIdx = candidate.padEnd(5, ' ').slice(0, 5).indexOf(' ')

  return (
    <div className="mt-2 mb-6">
      <div
        className="grid justify-center gap-3 md:gap-4"
        style={{ gridTemplateColumns: 'repeat(4, auto)' }}
      >
        {puzzle.bagList.map((ch, i) => {
          const used = usedIndices.has(i)
          const reserved = previewReserved.has(i)
          const muted = used || reserved

          // Positional hint: this bag letter equals the current stack letter
          // at the next empty slot; show the tile as a blue "stack-style" tile.
          const isPosHint = !muted && nextIdx !== -1 && currentStack[nextIdx] === ch

          return (
            <button
              key={i}
              type="button"
              onClick={() => !muted && pushLetter(ch)}
              disabled={muted}
              className={clsx(isPosHint && 'rounded-xl')}
              aria-label={`Bag tile ${ch}${
                used ? ', used'
                : reserved ? ', in use'
                : isPosHint ? ', positional match'
                : ', available'
              }`}
              title={isPosHint ? 'Positional match — will use from current stack' : undefined}
            >
              {/* intent="stack" gives the full blue tile; otherwise green "bag" */}
              <Tile letter={ch} muted={muted} intent={isPosHint ? 'stack' : 'bag'} />
            </button>
          )
        })}
      </div>
    </div>
  )
}
