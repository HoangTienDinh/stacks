import { useEffect, useMemo } from 'react'

import { BackHomeButton } from '@/components/BackHomeButton'
import { Tile } from '@/components/Tile'
import { formatClock, getRecordByDate, type LetterSource, makeShare, todayKey } from '@/stats/stats'
import { useGameStore } from '@/store/gameStore'
import { useUIStore } from '@/store/uiStore'

export default function ViewPuzzleScreen() {
  const go = useUIStore((s) => s.go)
  const { puzzle, loadToday } = useGameStore((s) => ({ puzzle: s.puzzle, loadToday: s.loadToday }))

  useEffect(() => {
    loadToday()
  }, [loadToday])

  const record = useMemo(() => getRecordByDate(todayKey()), [])
  useEffect(() => {
    if (!record) go('landing')
  }, [record, go])
  if (!record) return null

  const inferSources = (prev: string, curr: string): LetterSource[] =>
    curr.split('').map((c, i) => (prev[i] === c ? 'stack' : 'bag'))

  const playedRows = (() => {
    const rows: { index: number; word: string; sources: LetterSource[] }[] = []
    const start = (puzzle.wordOfDay || '').toUpperCase()
    if (start)
      rows.push({ index: 0, word: start, sources: Array(5).fill('stack') as LetterSource[] })
    let prev = start
    for (let i = 0; i < record.rows.length; i++) {
      const w = record.rows[i].word.toUpperCase()
      const srcs = (
        record.rows[i].sources?.length === 5 ? record.rows[i].sources : inferSources(prev, w)
      ) as LetterSource[]
      rows.push({ index: i + 1, word: w, sources: srcs })
      prev = w
    }
    return rows
  })()

  const onShare = async () => {
    const text = makeShare(record)
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      window.prompt('Copy your result:', text)
    }
  }

  return (
    <div className="min-h-dvh w-full overflow-hidden bg-white text-gray-900">
      <BackHomeButton />

      <div className="mx-auto w-full max-w-[520px] px-4">
        <div className="flex min-h-dvh flex-col">
          <div className="my-auto pb-6 pt-4">
            {/* Rows */}
            <div className="space-y-[clamp(8px,2vw,12px)]">
              {playedRows.map(({ index, word, sources }) => (
                <div key={`${index}-${word}`} className="relative mx-auto w-fit">
                  <span className="absolute -left-[clamp(22px,5.5vw,40px)] top-1/2 w-[clamp(18px,4.8vw,30px)] -translate-y-1/2 text-right text-[clamp(10px,2.7vw,12px)] tabular-nums text-gray-500">
                    {index}
                  </span>

                  {/* Centered tiles */}
                  <div className="flex gap-[clamp(6px,1.5vw,10px)]">
                    {word.split('').map((ch, i) => (
                      <Tile
                        key={i}
                        letter={ch}
                        intent={sources[i] === 'stack' ? 'stack' : 'bag'}
                        className="h-[clamp(34px,9vw,48px)] w-[clamp(34px,9vw,48px)] rounded-2xl text-[clamp(16px,4.2vw,22px)] shadow-sm"
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
                      className="h-[clamp(42px,10vw,56px)] w-[clamp(42px,10vw,56px)] rounded-2xl text-[clamp(18px,4.5vw,24px)]"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Result line */}
            <div className="mt-4 text-center text-base text-gray-700 sm:text-lg">
              Cleared <span className="font-semibold text-gray-900">{record.stacksCleared}</span>{' '}
              Stacks in{' '}
              <span className="font-semibold text-gray-900">{formatClock(record.durationSec)}</span>
            </div>

            {/* Actions */}
            <div className="mt-3 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={onShare}
                className="h-10 rounded-full bg-cyan-600 px-5 font-semibold text-white hover:bg-cyan-500"
              >
                Share
              </button>
              <button
                type="button"
                onClick={() => go('landing')}
                className="h-10 rounded-full border border-emerald-300 bg-white/60 px-5 text-emerald-900"
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
