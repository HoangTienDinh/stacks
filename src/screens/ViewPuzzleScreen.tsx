// src/screens/ViewPuzzleScreen.tsx
import { useEffect, useMemo } from 'react'
import { useUIStore } from '@/store/uiStore'
import { useGameStore } from '@/store/gameStore'
import { BackHomeButton } from '@/components/BackHomeButton'
import { RollColumn } from '@/components/RollColumn'
import { Tile } from '@/components/Tile'
import { formatClock, getRecordByDate, makeShare, todayKey } from '@/stats/stats'

export default function ViewPuzzleScreen() {
  const go = useUIStore(s => s.go)
  const { puzzle, loadToday } = useGameStore(s => ({
    puzzle: s.puzzle,
    loadToday: s.loadToday,
  }))

  // Load today's puzzle data to get wordOfDay + bagList
  useEffect(() => { loadToday() }, [loadToday])

  // Fetch finished record (if somehow missing, bounce home)
  const record = useMemo(() => getRecordByDate(todayKey()), [])
  useEffect(() => { if (!record) go('landing') }, [record, go])

  if (!record) return null

  const words = [
    { index: 0, word: puzzle.wordOfDay || '' },
    ...record.rows.map((r, i) => ({ index: i + 1, word: r.word })),
  ]

  const onShare = async () => {
    const text = makeShare(record)
    try { await navigator.clipboard.writeText(text) }
    catch { window.prompt('Copy your result:', text) }
  }

  return (
    <div className="h-[100dvh] flex flex-col bg-white text-gray-900">
      <BackHomeButton />

      <div className="px-4 pt-4 flex-1 flex flex-col">
        <div className="text-center text-base sm:text-lg text-gray-600 mb-2">
          Cleared <span className="font-semibold text-gray-800">{record.stacksCleared}</span> Stacks in{' '}
          <span className="font-semibold text-gray-800">{formatClock(record.durationSec)}</span>
        </div>

        {/* Stack list (read-only) */}
        <RollColumn words={words} onPick={() => { /* read-only */ }} />

        {/* Spacer where CandidateRow would be */}
        <div className="h-5" />

        {/* Read-only bag: everything muted (spent) */}
        <div className="mt-2 mb-6">
          <div
            className="grid justify-center gap-2 sm:gap-3"
            style={{ gridTemplateColumns: 'repeat(4, auto)' }}
          >
            {puzzle.bagList.map((ch, i) => (
              <div key={i} className="pointer-events-none">
                <Tile letter={ch} muted intent="bag" />
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-auto pb-6 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={onShare}
            className="h-10 px-5 rounded-full bg-cyan-600 text-white font-semibold hover:bg-cyan-500"
          >
            Share
          </button>
          <button
            type="button"
            onClick={() => go('landing')}
            className="h-10 px-5 rounded-full border border-emerald-300 text-emerald-900 bg-white/60"
          >
            Main
          </button>
        </div>
      </div>
    </div>
  )
}
