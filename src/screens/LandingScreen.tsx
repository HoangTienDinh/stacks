import { useMemo, useState } from 'react'
import { useUIStore } from '@/store/uiStore'
import { LogoWordmark } from '@/components/LogoWordmark'
import { HelpModal } from '@/components/HelpModal'
import { ResultModal } from '@/components/ResultModal'
import { hasRecord, todayKey } from '@/stats/stats'

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

  const puzzleNo = 'No. 0001' // placeholder
  const finishedToday = hasRecord(todayKey())

  return (
    <div className="flex h-[100dvh] w-full flex-col overflow-hidden bg-white text-slate-900">
      {/* CONTENT */}
      <main className="flex flex-1 flex-col items-center justify-center px-4">
        <div className="flex w-full max-w-[560px] flex-col items-center gap-6 sm:gap-8">
          <LogoWordmark letters="STACKS" />

          <p className="text-center text-[clamp(22px,6.2vw,40px)] leading-tight tracking-tight text-slate-800">
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
                className="h-[clamp(44px,6vh,40px)] w-[min(60vw,180px)] rounded-full bg-cyan-700 font-semibold text-white shadow-sm transition hover:bg-cyan-600 active:translate-y-[1px]"
              >
                View Puzzle
              </button>
            ) : (
              <button
                type="button"
                onClick={() => go('game')}
                className="h-[clamp(44px,6vh,40px)] w-[min(60vw,180px)] rounded-full bg-emerald-600 font-semibold text-white shadow-sm transition hover:bg-emerald-500 active:translate-y-[1px]"
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
        <div className="tabular-nums">{puzzleNo}</div>
        <div>Created by Hoang Dinh</div>
      </footer>

      <HelpModal open={helpOpen} onClose={() => setHelpOpen(false)} />
      <ResultModal source="landing" open={statsOpen} onClose={() => setStatsOpen(false)} />
    </div>
  )
}
