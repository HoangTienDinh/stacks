import { useGameStore } from '@/store/gameStore'
import { Tile } from './Tile'

export function BagGrid() {
  const { puzzle, usedIndices, previewReserved, pushLetter } = useGameStore(s => ({
    puzzle: s.puzzle,
    usedIndices: s.usedIndices,          // permanently spent (after Submit)
    previewReserved: s.previewReserved,  // temporarily reserved while typing
    pushLetter: s.pushLetter,
  }))

  return (
    <div className="mt-2 mb-6">
      <div
        className="grid justify-center gap-3 md:gap-4"
        style={{ gridTemplateColumns: 'repeat(4, auto)' }} // ⬅️ was 5
      >
        {puzzle.bagList.map((ch, i) => {
          const used = usedIndices.has(i)
          const reserved = previewReserved.has(i)
          const muted = used || reserved

          return (
            <button
              key={i}
              type="button"
              onClick={() => !muted && pushLetter(ch)}
              disabled={muted}
              className={muted ? 'pointer-events-none' : ''}
              aria-label={`Bag tile ${ch}${used ? ', used' : reserved ? ', in use' : ', available'}`}
            >
              {/* intent="bag" gives soft green when NOT muted; muted => gray */}
              <Tile letter={ch} muted={muted} intent="bag" />
            </button>
          )
        })}
      </div>
    </div>
  )
}
