import { motion } from 'framer-motion'
import { useGameStore } from '@/store/gameStore'
import clsx from 'clsx'

function UndoChip({ onClick }: { onClick: () => void }) {
  // Subtle outlined undo (unchanged size)
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Undo last stack"
      title="Undo last stack"
      className="ml-2 inline-flex h-8 w-8 items-center justify-center rounded-full
                 border border-red-300 bg-red-50 text-red-600
                 hover:bg-red-100 active:scale-[0.98] transition"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 14l-4-4 4-4" />
        <path d="M20 20v-6a4 4 0 0 0-4-4H5" />
      </svg>
    </button>
  )
}

function Row({
  index, word, faded=false, depth=0, markPositions=false, onPick, rightAction,
}: {
  index: number
  word: string
  faded?: boolean
  depth?: number
  markPositions?: boolean
  onPick?: (pos: number) => void
  rightAction?: React.ReactNode
}) {
  const scale = faded ? Math.max(0.7, 1 - depth * 0.12) : 1
  const y = faded ? -depth * 24 : 0
  const opacity = faded ? Math.max(0.35, 0.9 - depth * 0.12) : 1
  const interactive = !!onPick && !faded

  return (
    <motion.div
      initial={{ opacity, scale, y }}
      animate={{ opacity, scale, y }}
      className="w-full grid grid-cols-[1fr_auto_auto_1fr] items-center"
      style={{ transformOrigin: 'center bottom' }}
    >
      <div className="pr-2 text-right">
        <span className={faded ? 'text-xs text-gray-400' : 'text-sm text-gray-900'}>{index}</span>
      </div>

      {/* IMPORTANT: remove letter-spacing when row is interactive so text centers perfectly */}
      <div className={clsx(
        interactive ? 'tracking-normal' : 'tracking-[0.3em]',
        faded ? 'text-gray-400' : 'text-3xl font-semibold'
      )}>
        {word.split('').map((c, i) => {
          const commonProps = markPositions ? { 'data-stack-pos': i } : {}
          if (interactive) {
            // Current stack tiles: centered letter + soft cyan like CandidateRow "from stack"
            return (
              <button
                key={i}
                type="button"
                {...commonProps}
                onClick={() => onPick?.(i)}
                className="mx-[0.15em] inline-flex h-10 w-10 items-center justify-center
                           rounded-xl border border-cyan-300 bg-cyan-50 shadow-sm
                           focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300
                           hover:bg-cyan-100 active:scale-95 transition"
                aria-label={`Use ${c} from stack slot ${i+1}`}
              >
                {/* No extra tracking so the glyph is perfectly centered */}
                <span className="tracking-normal">{c}</span>
              </button>
            )
          }
          // Faded historical rows (non-interactive, keep the subtle "star-wars" style)
          return (
            <span
              key={i}
              {...commonProps}
              style={faded ? { display: 'inline-block', transform: 'perspective(420px) rotateX(18deg)' } : undefined}
            >
              {c}{i < word.length - 1 ? ' ' : ''}
            </span>
          )
        })}
      </div>

      <div className="pl-1">{rightAction}</div>
      <div />
    </motion.div>
  )
}

export function RollColumn({
  words, onPick,
}: {
  words: { index: number; word: string }[]
  onPick?: (pos: number) => void
}) {
  const { history, undo } = useGameStore(s => ({ history: s.history, undo: s.undo }))

  // Current row is always last
  const current = words[words.length - 1]

  // Drop muted duplicate of the current word if present
  const olderRaw = words.slice(0, -1)
  const older =
    olderRaw.length && olderRaw[olderRaw.length - 1].word === current.word
      ? olderRaw.slice(0, -1)
      : olderRaw

  return (
    <div className="relative flex-1 overflow-hidden flex flex-col justify-end items-stretch">
      <div className="absolute bottom-20 left-0 right-0 flex flex-col gap-1 px-2">
        {older.map((w, i) => {
          const depth = older.length - 1 - i
          return (
            <Row
              key={`${w.index}-${w.word}-${i}`}
              index={w.index}
              word={w.word}
              faded
              depth={depth}
            />
          )
        })}
      </div>

      {/* Interactive current row with subtle Undo chip (hide for starter) */}
      <div className="px-2">
        <Row
          index={current.index}
          word={current.word}
          markPositions
          onPick={onPick}
          rightAction={history.length > 0 ? <UndoChip onClick={undo} /> : null}
        />
      </div>
    </div>
  )
}
