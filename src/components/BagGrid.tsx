// import { useGameStore } from '@/store/gameStore'
// import { Tile } from './Tile'

// export function BagGrid() {
//   const { puzzle, usedIndices, pushLetter } = useGameStore(s => ({
//     puzzle: s.puzzle,
//     usedIndices: s.usedIndices,
//     pushLetter: s.pushLetter,
//   }))

//   return (
//     <div className="bag-grid mt-4">
//       {puzzle.bagList.map((ch, i) => {
//         const muted = usedIndices.has(i)
//         return (
//           <button
//             key={i}
//             type="button"
//             onClick={() => !muted && pushLetter(ch)}
//             disabled={muted}
//             className={muted ? 'pointer-events-none' : ''}
//             aria-label={muted ? `Used tile ${ch}` : `Tile ${ch}`}
//           >
//             <Tile letter={ch} muted={muted} />
//           </button>
//         )
//       })}
//     </div>
//   )
// }


import { useGameStore } from '@/store/gameStore'
import { Tile } from './Tile'

export function BagGrid() {
  const { puzzle, usedIndices, previewReserved, pushLetter } = useGameStore(s => ({
    puzzle: s.puzzle,
    usedIndices: s.usedIndices,
    previewReserved: s.previewReserved,
    pushLetter: s.pushLetter,
  }))

  return (
    <div className="bag-grid mt-4 mb-4">
      {puzzle.bagList.map((ch, i) => {
        const muted = usedIndices.has(i) || previewReserved.has(i)
        return (
          <button
            key={i}
            type="button"
            data-bag-idx={i}
            onClick={() => !muted && pushLetter(ch)}
            disabled={muted}
            className={muted ? 'pointer-events-none' : ''}
            aria-label={muted ? `Used tile ${ch}` : `Tile ${ch}`}
          >
            <Tile letter={ch} muted={muted} />
          </button>
        )
      })}
    </div>
  )
}
