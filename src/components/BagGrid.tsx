import { useGameStore } from '@/store/gameStore'

import { Tile } from './Tile'

export function BagGrid() {
  const { puzzle, usedIndices, previewReserved, pushBagIndex, currentStack, candidate } =
    useGameStore((s) => ({
      puzzle: s.puzzle,
      usedIndices: s.usedIndices,
      previewReserved: s.previewReserved,
      pushBagIndex: s.pushBagIndex,
      currentStack: s.currentStack,
      candidate: s.candidate,
    }))

  const nextIdx = candidate.padEnd(5, ' ').slice(0, 5).indexOf(' ')

  return (
    <div className="mb-6 mt-2">
      <div className="grid-bag">
        {puzzle.bagList.map((ch, i) => {
          const used = usedIndices.has(i)
          const reserved = previewReserved.has(i)
          const muted = used || reserved
          const isPosHint = !muted && nextIdx !== -1 && currentStack[nextIdx] === ch

          return (
            <button
              key={i}
              type="button"
              onClick={() => !muted && pushBagIndex(i)}
              disabled={muted}
              className="rounded-xl"
              aria-label={`Bag tile ${ch}${used ? ', used' : reserved ? ', in use' : isPosHint ? ', positional match' : ', available'}`}
              title={isPosHint ? 'Positional match — use this tile' : undefined}
            >
              <Tile
                letter={ch}
                muted={muted}
                intent="bag"
                emphasis={isPosHint}
                hint={isPosHint ? 'pos' : undefined}
                size="lg"
              />
            </button>
          )
        })}
      </div>
    </div>
  )
}
