import { useMemo, useState } from 'react'

import { HelpModal } from '@/components/HelpModal'
import { LogoWordmark } from '@/components/LogoWordmark'
import { ResultModal } from '@/components/ResultModal'
import puzzles from '@/puzzles/puzzles.json'
import { hasRecord, todayKey } from '@/stats/stats'
import { useUIStore } from '@/store/uiStore'

// --- helpers ---
function getEarliestPuzzleDateKey(): string {
  // Expecting keys like 'YYYY-MM-DD'
  const keys = Object.keys(puzzles || {}).filter(Boolean).sort()
  // Fallback to the known first date if the file is empty
  return keys[0] ?? '2025-10-08'
}

function dayDiffInclusive(fromDateKey: string, toDateKey: string): number {
  // fromDateKey & toDateKey are calendar dates (in PT via todayKey()).
  // Convert to UTC midnights to compute ordinal difference safely.
  const toUtcMidnight = (k: string) => new Date(`${k}T00:00:00Z`).getTime()
  const diffDays = Math.floor((toUtcMidnight(toDateKey) - toUtcMidnight(fromDateKey)) / 86_400_000)
  return diffDays + 1 // inclusive so the first day is No. 0001
}

export default function LandingScreen() {
  const go = useUIStore((s) => s.go)
  const [helpOpen, setHelpOpen] = useState(false)
  const [statsOpen, setStatsOpen] = useState(false)

  const todayStr = useMemo(() => {
    try {
      return new Date().toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    } catch {
      return new Date().toDateString()
    }
  }, [])

  // ⬇️ NEW: compute "No. 000X" based on earliest puzzle and today's PT date
  const puzzleNumber = useMemo(() => {
    const earliest = getEarliestPuzzleDateKey()
    const today = todayKey() // already uses Pacific Time logic elsewhere in the app
    const ordinal = Math.max(1, dayDiffInclusive(earliest, today))
    return `No. ${String(ordinal).padStart(4, '0')}`
  }, [])

  const finishedToday = hasRecord(todayKey())

  return (
    // <div className="flex h-[100dvh] w-full flex-col overflow-hidden bg-white text-slate-900">
    <div className="flex min-h-screen min-h-[100dvh] w-full flex-col overflow-x-hidden overflow-y-auto bg-white text-slate-900">

      {/* CONTENT */}
      {/* <main className="flex flex-1 flex-col items-center justify-center px-4"> */}
      <main className="flex flex-1 flex-col items-center justify-center px-2 sm:px-4">
        <div className="flex w-full max-w-[560px] flex-col items-center gap-6 sm:gap-8">
          <LogoWordmark letters="STACKS" />

          <p className="text-center text-[clamp(22px,6.2vw,38px)] leading-tight tracking-tight text-slate-800 [text-wrap:balance]">
            Use every tile.
            <br />
            Finish in the fewest <span className="font-semibold">Stacks</span>.
          </p>

          {/* CTA stack */}
          <div className="mt-1 flex w-full flex-col items-center gap-3">
            {finishedToday ? (
              <button
                type="button"
                onClick={() => go('view')}
                className="h-[clamp(40px,6vh,40px)] w-[min(60vw,180px)] rounded-full bg-cyan-700 font-semibold text-white shadow-sm transition hover:bg-cyan-600 active:translate-y-[1px]"
              >
                View Puzzle
              </button>
            ) : (
              <button
                type="button"
                onClick={() => go('game')}
                className="h-[clamp(40px,6vh,40px)] w-[min(60vw,180px)] rounded-full bg-emerald-600 font-semibold text-white shadow-sm transition hover:bg-emerald-500 active:translate-y-[1px]"
              >
                Play
              </button>
            )}

            <button
              type="button"
              onClick={() => setHelpOpen(true)}
              className="h-[clamp(40px,6.5vh,44px)] w-[min(62vw,180px)] rounded-full border border-emerald-300 bg-white/60 text-emerald-900 transition hover:bg-white"
            >
              How To Play
            </button>

            <button
              type="button"
              onClick={() => setStatsOpen(true)}
              className="h-[clamp(40px,6.5vh,44px)] w-[min(62vw,180px)] rounded-full border border-emerald-300 bg-white/60 text-emerald-900 transition hover:bg-white"
            >
              Stats
            </button>

            <button
              type="button"
              disabled
              className="h-[clamp(40px,6.5vh,44px)] w-[min(62vw,180px)] cursor-not-allowed rounded-full border border-emerald-300 bg-white/60 text-emerald-900 opacity-70"
              title="Coming soon"
            >
              Archive
            </button>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer
        className="shrink-0 border-t px-4 py-3 text-center text-xs text-slate-600 sm:py-4 sm:text-sm"
        style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 12px)' }}
      >
        <div>{todayStr}</div>
        <div className="tabular-nums">{puzzleNumber}</div>
        <div>Created by Hoang Dinh</div>
      </footer>

      <HelpModal open={helpOpen} onClose={() => setHelpOpen(false)} />
      <ResultModal source="landing" open={statsOpen} onClose={() => setStatsOpen(false)} />
    </div>
  )
}
