// src/components/ResultModal.tsx
import { useMemo } from 'react'
import { useGameStore } from '@/store/gameStore'
import { computeStats, formatClock, loadGames, makeShare } from '@/stats/stats'
import clsx from 'clsx'

export function ResultModal() {
  const { status, lastGame, closeResults, goHome } = useGameStore(s => ({
    status: s.status,
    lastGame: s.lastGame,      // we’ll set this when we finish a puzzle
    closeResults: s.closeResults,
    goHome: s.goHome,          // UI change back to Landing
  }))

  const open = status === 'cleared' && !!lastGame
  const allGames = loadGames()
  const overall = useMemo(() => computeStats(allGames), [status]) // recompute on win

  if (!open) return null

  const onShare = async () => {
    try {
      await navigator.clipboard.writeText(makeShare(lastGame!))
    } catch {
      // fallback: prompt
      window.prompt('Copy your result:', makeShare(lastGame!))
    }
  }

  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/30" onClick={closeResults} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-[min(92vw,560px)] max-h-[88dvh] overflow-auto rounded-2xl bg-white shadow-2xl border">
          <header className="flex items-center justify-between px-4 py-3 border-b">
            <h2 className="text-lg font-semibold">Results</h2>
            <button
              type="button"
              onClick={closeResults}
              className="rounded-lg border px-2 py-1 text-sm hover:bg-gray-50"
            >
              Close
            </button>
          </header>

          <div className="px-4 py-4 space-y-4">
            {/* This game */}
            <div className="text-center">
              <p className="text-xl font-semibold">
                Cleared {lastGame!.stacksCleared} Stacks in {formatClock(lastGame!.durationSec)}
              </p>
            </div>

            {/* Stats header */}
            <div className="grid grid-cols-4 gap-2 text-center">
              <Stat label="Games" value={overall.gamesPlayed} />
              <Stat label="Avg. Stacks" value={overall.avgStacks} />
              <Stat label="Current Streak" value={overall.currentStreak} />
              <Stat label="Max Streak" value={overall.maxStreak} />
            </div>

            {/* Histogram */}
            <div>
              {Object.entries(overall.hist).map(([k, v]) => (
                <Bar key={k} label={k} value={v} max={Math.max(...Object.values(overall.hist)) || 1} />
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={onShare}
                className="flex-1 h-10 rounded-xl bg-cyan-600 text-white font-semibold hover:bg-cyan-500"
              >
                Share
              </button>
              <button
                type="button"
                onClick={() => { closeResults(); goHome(); }}
                className="flex-1 h-10 rounded-xl border border-emerald-300 text-emerald-900 bg-white/60"
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

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-xl border bg-gray-50 py-2">
      <div className="text-lg font-semibold tabular-nums">{value}</div>
      <div className="text-xs text-gray-600">{label}</div>
    </div>
  )
}

function Bar({ label, value, max }: { label: string; value: number; max: number }) {
  const w = Math.max(8, Math.round((value / max) * 100))
  return (
    <div className="flex items-center gap-3 py-1">
      <div className="w-6 text-right tabular-nums text-sm text-gray-600">{label}</div>
      <div className="flex-1">
        <div className={clsx(
          "h-6 rounded-md border bg-emerald-50 border-emerald-300 relative overflow-hidden"
        )}>
          <div
            className="absolute inset-y-0 left-0 bg-emerald-300/70"
            style={{ width: `${w}%` }}
          />
        </div>
      </div>
      <div className="w-8 text-right tabular-nums text-sm text-gray-600">{value}</div>
    </div>
  )
}
