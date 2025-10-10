import clsx from 'clsx'
import { useMemo } from 'react'

import { useGameStore } from '@/store/gameStore'

export function BagCounts() {
  const { puzzle, bagCounts, previewReserved } = useGameStore((s) => ({
    puzzle: s.puzzle,
    bagCounts: s.bagCounts,
    previewReserved: s.previewReserved,
  }))

  // Preserve first-appearance order
  const lettersInBag = useMemo(() => {
    const seen = new Set<string>()
    const ordered: string[] = []
    for (const ch of puzzle.bagList) {
      if (!seen.has(ch)) {
        seen.add(ch)
        ordered.push(ch)
      }
    }
    return ordered
  }, [puzzle.bagList])

  // Temp reserved deltas for current row
  const previewDelta = useMemo(() => {
    const delta: Record<string, number> = {}
    for (const i of Array.from(previewReserved)) {
      const ch = puzzle.bagList[i]
      delta[ch] = (delta[ch] || 0) + 1
    }
    return delta
  }, [previewReserved, puzzle.bagList])

  return (
    <div className="mx-auto max-w-md px-4 pb-4">
      <div
        className="grid justify-center gap-2"
        style={{ gridTemplateColumns: 'repeat(4, minmax(52px, 1fr))' }}
      >
        {lettersInBag.map((l) => {
          const avail = Math.max(0, (bagCounts[l] || 0) - (previewDelta[l] || 0))
          const zero = avail === 0
          return (
            <div
              key={l}
              className={clsx(
                'flex h-9 select-none items-center justify-center rounded-lg border text-sm',
                zero
                  ? 'border-token bg-surface-muted text-muted'
                  : 'bg-accent50 border-accent300 text-text'
              )}
              aria-label={`${l} available: ${avail}`}
              title={`${l}: ${avail}`}
            >
              <span className="font-mono">{l}</span>
              <span className="ml-1 text-[0.85rem] tabular-nums">{avail}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
