import { useGameStore } from '@/store/gameStore'

export function CandidateRow() {
  const { candidate, popLetter } = useGameStore(s => ({
    candidate: s.candidate,
    popLetter: s.popLetter,
  }))

  const letters = candidate.padEnd(5, ' ').slice(0, 5).split('')

  return (
    <div className="flex items-center justify-center gap-3 min-h-[88px]">
      {letters.map((ch, i) => (
        <div
          key={i}
          role="button"
          aria-label={ch.trim() ? `Remove ${ch}` : 'Empty slot'}
          tabIndex={0}
          onClick={() => ch.trim() && popLetter()}
          onKeyDown={(e) => {
            if ((e.key === 'Enter' || e.key === ' ') && ch.trim()) popLetter()
          }}
          className="tile tile-lg w-16 h-16 sm:w-20 sm:h-20"
        >
          {ch.trim() || ''}
        </div>
      ))}
    </div>
  )
}
