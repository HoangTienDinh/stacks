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

  // Load today's puzzle to get wordOfDay (for the header of the stack list)
  useEffect(() => { loadToday() }, [loadToday])

  // Fetch finished record; if missing, bounce to Landing
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
    <div className="min-h-dvh w-full bg-white text-gray-900">
      {/* fixed back button */}
      <BackHomeButton />

      {/* Same centered column & spacing as GameScreen */}
      <div
        className="mx-auto w-full max-w-[680px] px-4"
        style={{ paddingBottom: '2.5rem' }}
      >
        <div className="min-h-dvh flex flex-col">
          {/* my-auto centers content vertically when there’s extra space */}
          <div className="my-auto pt-6 pb-4">
            {/* header line */}
            <div className="mb-3 text-center text-base sm:text-lg text-gray-600">
              Cleared <span className="font-semibold text-gray-800">{record.stacksCleared}</span>{' '}
              Stacks in{' '}
              <span className="font-semibold text-gray-800">{formatClock(record.durationSec)}</span>
            </div>

            {/* 1) Stacks timeline (read-only) */}
            <div className="mb-3">
              <RollColumn words={words} onPick={() => { /* read-only */ }} />
            </div>

            {/* 2) Spacer where CandidateRow would be */}
            <div className="h-4" />

            {/* 3) Bag grid — fully muted to show that all tiles were spent */}
            <div className="mb-3">
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

            {/* 4) Actions under the bag (aligned with GameScreen InlineActions style) */}
            <div className="flex items-center justify-center gap-3">
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
      </div>
    </div>
  )
}
