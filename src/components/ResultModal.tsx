import { useMemo, useState, useEffect } from 'react'
import clsx from 'clsx'
import { Modal } from '@/components/Modal'
import { useGameStore } from '@/store/gameStore'
import { useUIStore } from '@/store/uiStore'
import {
  computeStats,
  formatClock,
  loadGames,
  makeShare,
  todayKey,
} from '@/stats/stats'

type ResultModalProps =
  | { source?: 'game' } // default: auto-opens after clear
  | {
      source: 'landing'  // opened from Landing "Stats"
      open: boolean
      onClose: () => void
    }

export function ResultModal(props: ResultModalProps) {
  // ---- hooks must always run, regardless of "open" state ----
  const { status, lastGame, closeResults, goHome } = useGameStore(s => ({
    status: s.status,
    lastGame: s.lastGame,
    closeResults: s.closeResults,
    goHome: s.goHome,
  }))
  const go = useUIStore(s => s.go)

  // Share-state hooks (declare BEFORE any early return)
  const [copied, setCopied] = useState(false)
  useEffect(() => {
    if (!copied) return
    const t = setTimeout(() => setCopied(false), 1500)
    return () => clearTimeout(t)
  }, [copied])

  // ---- aggregate stats (works in both modes) ----
  const overall = useMemo(() => {
    const stored = loadGames()
    const withCurrent =
      lastGame && !stored.some(g => g.dateKey === lastGame.dateKey)
        ? [...stored, lastGame]
        : stored
    return computeStats(withCurrent)
  }, [lastGame?.finishedAt])

  const today = todayKey()
  const todayRecord = useMemo(() => {
    const games = loadGames()
    const r = games.find(g => g.dateKey === today)
    if (!r && lastGame?.dateKey === today) return lastGame
    return r
  }, [today, lastGame?.finishedAt])

  // ---- open/close logic ----
  const isFromLanding = (props as any)?.source === 'landing'
  const open = isFromLanding ? (props as any).open : status === 'cleared' && !!lastGame
  const onClose = isFromLanding ? (props as any).onClose : closeResults

  // Early return AFTER all hooks are declared
  if (!open) return null

  // ---- derived UI strings ----
  const title = isFromLanding ? 'Stats' : 'Results'
  const heading = todayRecord
    ? `Cleared ${todayRecord.stacksCleared} ${todayRecord.stacksCleared === 1 ? 'Stack' : 'Stacks'} in ${formatClock(todayRecord.durationSec)}`
    : `How will you do in today's puzzle?`

  // ---- Share: copy to clipboard + toast text ----
  const onShare = async () => {
    if (!todayRecord) return
    const text = makeShare(todayRecord)
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
    } catch {
      window.prompt('Copy your result:', text)
    }
  }

  // ---- secondary button logic ----
  // Hide when opened from Landing AND today is already cleared
  const hideSecondary = isFromLanding && !!todayRecord
  const secondaryCta = todayRecord ? 'Main' : "Play Today's Puzzle"
  const onSecondary = () => {
    if (todayRecord) {
      closeResults()
      goHome()
    } else {
      onClose()
      go('game')
    }
  }

  return (
    <Modal open={open} onClose={onClose} ariaLabel={title}>
      <header className="flex items-center justify-between px-4 py-3 border-b">
        <h2 className="text-lg font-semibold">{title}</h2>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border px-2 py-1 text-sm hover:bg-gray-50"
        >
          Close
        </button>
      </header>

      <div className="px-4 py-4 space-y-4">
        {/* Heading */}
        <div className="text-center">
          <p className="text-xl font-semibold">{heading}</p>
        </div>

        {/* Overall stats */}
        <div className="grid grid-cols-4 gap-2 text-center">
          <Stat label="Games" value={overall.gamesPlayed} />
          <Stat label="Avg. Stacks" value={overall.avgStacks} />
          <Stat label="Current Streak" value={overall.currentStreak} />
          <Stat label="Max Streak" value={overall.maxStreak} />
        </div>

        {/* Histogram */}
        <div>
          {Object.entries(overall.hist).map(([k, v]) => (
            <Bar
              key={k}
              label={k}
              value={v}
              max={Math.max(...Object.values(overall.hist)) || 1}
            />
          ))}
        </div>

        {/* Actions */}
        <div className={clsx(
          'flex items-center gap-3 pt-2',
          hideSecondary ? 'justify-center' : 'justify-between'
        )}>
          <button
            type="button"
            onClick={onShare}
            disabled={!todayRecord}
            className={clsx(
              'flex-1 h-10 rounded-xl font-semibold',
              todayRecord
                ? 'bg-cyan-600 text-white hover:bg-cyan-500'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            )}
            aria-live="polite"
          >
            Share
          </button>

          {!hideSecondary && (
            <button
              type="button"
              onClick={onSecondary}
              className="flex-1 h-10 rounded-xl border border-emerald-300 text-emerald-900 bg-white/60"
            >
              {secondaryCta}
            </button>
          )}
        </div>

        {/* Copy feedback */}
        <div
          aria-live="polite"
          className={clsx(
            'text-center text-sm transition-opacity duration-200',
            copied ? 'opacity-100' : 'opacity-0'
          )}
        >
          ✅ Copied to clipboard
        </div>
      </div>
    </Modal>
  )
}

/* ---------- stat helpers ---------- */

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
        <div className="h-6 rounded-md border bg-emerald-50 border-emerald-300 relative overflow-hidden">
          <div className="absolute inset-y-0 left-0 bg-emerald-300/70" style={{ width: `${w}%` }} />
        </div>
      </div>
      <div className="w-8 text-right tabular-nums text-sm text-gray-600">{value}</div>
    </div>
  )
}
