import { useMemo, useState } from 'react'
import { useUIStore } from '@/store/uiStore'
import { LogoWordmark } from '@/components/LogoWordmark'
import { HelpModal } from '@/components/HelpModal'

export default function LandingScreen() {
  const go = useUIStore(s => s.go)
  const [helpOpen, setHelpOpen] = useState(false)

  const todayStr = useMemo(() => {
    try {
      return new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
    } catch { return new Date().toDateString() }
  }, [])

  const puzzleNo = 'No. 0001' // placeholder

  return (
    <div className="h-[100dvh] w-full overflow-hidden bg-white text-slate-900 flex flex-col">
      {/* CONTENT */}
      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-[560px] flex flex-col items-center gap-6 sm:gap-8">
          <LogoWordmark letters="STACKS" />
          
          {/* Larger on mobile, unchanged vibe on desktop */}
          <p className="text-center leading-tight tracking-tight text-slate-800
                         text-[clamp(22px,6.2vw,40px)]">
            Use every tile.<br />
            Finish in the fewest <span className="font-semibold">Stacks</span>.
          </p>

          {/* CTA stack — slimmer so the logo can dominate */}
          <div className="w-full flex flex-col items-center gap-3 mt-1">
            <button
              type="button"
              onClick={() => go('game')}
              className="w-[min(62vw,180px)] h-[clamp(40px,6.5vh,44px)] rounded-full 
                         bg-emerald-600 text-white font-semibold shadow-sm
                         hover:bg-emerald-500 active:translate-y-[1px] transition"
            >
              Play
            </button>

            <button
              type="button"
              onClick={() => setHelpOpen(true)}
              className="w-[min(62vw,180px)] h-[clamp(40px,6.5vh,44px)] rounded-full 
                         bg-cyan-600 text-white font-semibold shadow-sm
                         hover:bg-cyan-500 active:translate-y-[1px] transition"
            >
              How To Play
            </button>

            <button
              type="button"
              disabled
              className="w-[min(62vw,180px)] h-[clamp(40px,6.5vh,44px)] rounded-full 
                         border border-emerald-300 text-emerald-900 bg-white/60
                         opacity-70 cursor-not-allowed"
              title="Coming soon"
            >
              Stats
            </button>

            <button
              type="button"
              disabled
              className="w-[min(62vw,180px)] h-[clamp(40px,6.5vh,44px)] rounded-full 
                         border border-emerald-300 text-emerald-900 bg-white/60
                         opacity-70 cursor-not-allowed"
              title="Coming soon"
            >
              Archive
            </button>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer
        className="shrink-0 border-t px-4 py-3 sm:py-4 text-center text-xs sm:text-sm text-slate-600"
        style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 12px)' }}
      >
        <div>{todayStr}</div>
        <div className="tabular-nums">{puzzleNo}</div>
        <div>Created by Hoang Dinh</div>
      </footer>

      <HelpModal open={helpOpen} onClose={() => setHelpOpen(false)} />
    </div>
  )
}
