// import { motion } from 'framer-motion'

// function Row({ index, word, faded=false, depth=0 }: { index: number; word: string; faded?: boolean; depth?: number }) {
//   const scale = faded ? Math.max(0.7, 1 - depth * 0.12) : 1
//   const y = faded ? -depth * 24 : 0
//   const opacity = faded ? Math.max(0.35, 0.9 - depth * 0.12) : 1

//   return (
//     <motion.div
//       initial={{ opacity, scale, y }}
//       animate={{ opacity, scale, y }}
//       className="w-full grid grid-cols-[1fr_auto_1fr] items-center"
//       style={{ transformOrigin: 'center bottom' }}
//     >
//       {/* left spacer with the index, right-aligned */}
//       <div className="pr-2 text-right">
//         <span className={faded ? 'text-xs text-gray-400' : 'text-sm text-gray-900'}>{index}</span>
//       </div>
//       {/* centered word cell */}
//       <div className={faded ? 'tracking-[0.3em] text-gray-400' : 'tracking-[0.3em] text-3xl font-semibold'}>
//         <span style={faded ? { transform: 'perspective(420px) rotateX(18deg)', display: 'inline-block' } : undefined}>
//           {word.split('').join(' ')}
//         </span>
//       </div>
//       {/* right spacer to balance the grid */}
//       <div />
//     </motion.div>
//   )
// }

// export function RollColumn({ words }: { words: { index: number; word: string }[] }) {
//   const older = words.slice(0, -1)
//   const current = words[words.length - 1]

//   return (
//     <div className="relative h-[200px] overflow-hidden flex flex-col justify-end items-stretch">
//       {/* older stacks rolling upward, centered */}
//       <div className="absolute bottom-20 left-0 right-0 flex flex-col gap-1 px-2">
//         {older.map((w, i) => {
//           const depth = older.length - 1 - i
//           return <Row key={i} index={w.index} word={w.word} faded depth={depth} />
//         })}
//       </div>
//       {/* current stack centered */}
//       <div className="px-2">
//         <Row index={current.index} word={current.word} />
//       </div>
//     </div>
//   )
// }

import { motion } from 'framer-motion'

function Row({
  index, word, faded=false, depth=0, markPositions=false
}: { index: number; word: string; faded?: boolean; depth?: number; markPositions?: boolean }) {
  const scale = faded ? Math.max(0.7, 1 - depth * 0.12) : 1
  const y = faded ? -depth * 24 : 0
  const opacity = faded ? Math.max(0.35, 0.9 - depth * 0.12) : 1

  return (
    <motion.div
      initial={{ opacity, scale, y }}
      animate={{ opacity, scale, y }}
      className="w-full grid grid-cols-[1fr_auto_1fr] items-center"
      style={{ transformOrigin: 'center bottom' }}
    >
      <div className="pr-2 text-right">
        <span className={faded ? 'text-xs text-gray-400' : 'text-sm text-gray-900'}>{index}</span>
      </div>
      <div className={faded ? 'tracking-[0.3em] text-gray-400' : 'tracking-[0.3em] text-3xl font-semibold'}>
        {word.split('').map((c, i) => (
          <span
            key={i}
            {...(markPositions ? { 'data-stack-pos': i } : {})}
            style={faded ? { transform: 'perspective(420px) rotateX(18deg)', display: 'inline-block' } : undefined}
          >
            {c}{i < word.length - 1 ? ' ' : ''}
          </span>
        ))}
      </div>
      <div />
    </motion.div>
  )
}

export function RollColumn({ words }: { words: { index: number; word: string }[] }) {
  const older = words.slice(0, -1)
  const current = words[words.length - 1]

  return (
    <div className="relative h-[200px] overflow-hidden flex flex-col justify-end items-stretch">
      <div className="absolute bottom-20 left-0 right-0 flex flex-col gap-1 px-2">
        {older.map((w, i) => {
          const depth = older.length - 1 - i
          return <Row key={i} index={w.index} word={w.word} faded depth={depth} />
        })}
      </div>
      <div className="px-2">
        {/* markPositions=true so flight animation can find per-letter positions */}
        <Row index={current.index} word={current.word} markPositions />
      </div>
    </div>
  )
}
