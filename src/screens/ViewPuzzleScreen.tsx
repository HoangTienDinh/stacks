// src/screens/ViewPuzzleScreen.tsx
import { useEffect, useMemo } from 'react'
import { useUIStore } from '@/store/uiStore'
import { useGameStore } from '@/store/gameStore'
import { BackHomeButton } from '@/components/BackHomeButton'
import { Tile } from '@/components/Tile'
import {
  formatClock,
  getRecordByDate,
  makeShare,
  todayKey,
  type LetterSource,
} from '@/stats/stats'

export default function ViewPuzzleScreen() {
  const go = useUIStore(s => s.go)
  const { puzzle, loadToday } = useGameStore(s => ({ puzzle: s.puzzle, loadToday: s.loadToday }))

  useEffect(() => { loadToday() }, [loadToday])

  const record = useMemo(() => getRecordByDate(todayKey()), [])
  useEffect(() => { if (!record) go('landing') }, [record, go])
  if (!record) return null

  const inferSources = (prev: string, curr: string): LetterSource[] =>
    curr.split('').map((c, i) => (prev[i] === c ? 'stack' : 'bag'))

  const playedRows = (() => {
    const rows: { index: number; word: string; sources: LetterSource[] }[] = []
    const start = (puzzle.wordOfDay || '').toUpperCase()
    if (start) rows.push({ index: 0, word: start, sources: Array(5).fill('stack') as LetterSource[] })
    let prev = start
    for (let i = 0; i < record.rows.length; i++) {
      const w = record.rows[i].word.toUpperCase()
      const srcs = (record.rows[i].sources?.length === 5
        ? record.rows[i].sources
        : inferSources(prev, w)) as LetterSource[]
      rows.push({ index: i + 1, word: w, sources: srcs })
      prev = w
    }
    return rows
  })()

  const onShare = async () => {
    const text = makeShare(record)
    try { await navigator.clipboard.writeText(text) }
    catch { window.prompt('Copy your result:', text) }
  }

  return (
    <div className="min-h-dvh w-full bg-white text-gray-900 overflow-hidden">
      <BackHomeButton />

      <div className="mx-auto w-full max-w-[520px] px-4">
        <div className="min-h-dvh flex flex-col">
          <div className="my-auto pt-4 pb-6">
            {/* Rows */}
            <div className="space-y-2 sm:space-y-2.5">
              {playedRows.map(({ index, word, sources }) => (
                <div key={`${index}-${word}`} className="flex justify-center">
                  <div className="relative flex gap-[clamp(6px,1.5vw,10px)]">
                    {/* index anchored to the tile row */}
                    <span className="absolute -left-6 sm:-left-9 top-1/2 -translate-y-1/2 w-6 text-right text-xs text-gray-500 tabular-nums">
                      {index}
                    </span>

                    {word.split('').map((ch, i) => (
                      <Tile
                        key={i}
                        letter={ch}
                        intent={sources[i] === 'stack' ? 'stack' : 'bag'}
                        className="rounded-2xl shadow-sm
                                   w-[clamp(34px,9vw,48px)] h-[clamp(34px,9vw,48px)]
                                   text-[clamp(16px,4.2vw,22px)]"
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Bag */}
            <div className="mt-4 sm:mt-5">
              <div
                className="grid justify-center gap-[clamp(8px,2vw,12px)]"
                style={{ gridTemplateColumns: 'repeat(4, auto)' }}
              >
                {puzzle.bagList.map((ch, i) => (
                  <div key={i} className="pointer-events-none">
                    <Tile
                      letter={ch}
                      muted
                      intent="bag"
                      className="rounded-2xl
                                 w-[clamp(42px,10vw,56px)] h-[clamp(42px,10vw,56px)]
                                 text-[clamp(18px,4.5vw,24px)]"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Result line */}
            <div className="mt-4 text-center text-base sm:text-lg text-gray-700">
              Cleared <span className="font-semibold text-gray-900">{record.stacksCleared}</span>{' '}
              Stacks in <span className="font-semibold text-gray-900">{formatClock(record.durationSec)}</span>
            </div>

            {/* Actions */}
            <div className="mt-3 flex items-center justify-center gap-3">
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
