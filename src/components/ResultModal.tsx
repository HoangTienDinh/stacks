import clsx from 'clsx'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { Modal } from '@/components/Modal'
import { computeStats, formatClock, loadGames, makeShare, todayKey } from '@/stats/stats'
import { useGameStore } from '@/store/gameStore'
import { useUIStore } from '@/store/uiStore'

type ResultModalProps =
  | { source?: 'game' }
  | {
      source: 'landing'
      open: boolean
      onClose: () => void
    }

export function ResultModal(props: ResultModalProps) {
  const { status, lastGame, closeResults } = useGameStore((s) => ({
    status: s.status,
    lastGame: s.lastGame,
    closeResults: s.closeResults,
  }))
  const go = useUIStore((s) => s.go)

  const [copied, setCopied] = useState(false)
  useEffect(() => {
    if (!copied) return
    const t = setTimeout(() => setCopied(false), 1500)
    return () => clearTimeout(t)
  }, [copied])

  const overall = useMemo(() => {
    const stored = loadGames()
    const withCurrent =
      lastGame && !stored.some((g) => g.dateKey === lastGame.dateKey)
        ? [...stored, lastGame]
        : stored
    return computeStats(withCurrent)
  }, [lastGame])

  const today = todayKey()
  const todayRecord = useMemo(() => {
    const games = loadGames()
    const r = games.find((g) => g.dateKey === today)
    if (!r && lastGame?.dateKey === today) return lastGame
    return r
  }, [today, lastGame])

  const isFromLanding = 'open' in props
  const open = isFromLanding ? props.open : status === 'cleared' && !!lastGame

  const handleClose = useCallback(() => {
    if (isFromLanding) {
      props.onClose()
      return
    }
    closeResults()
    queueMicrotask(() => go('view'))
  }, [isFromLanding, props, closeResults, go])

  if (!open) return null

  const title = isFromLanding ? 'Stats' : 'Results'
  const heading = todayRecord
    ? `Cleared ${todayRecord.stacksCleared} ${
        todayRecord.stacksCleared === 1 ? 'Stack' : 'Stacks'
      } in ${formatClock(todayRecord.durationSec)}`
    : `How will you do in today's puzzle?`

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

  const onSecondary = () => {
    if (isFromLanding) {
      props.onClose()
    } else {
      closeResults()
      go('landing')
    }
  }

  return (
    <Modal open={open} onClose={handleClose} ariaLabel={title}>
      <header className="flex items-center justify-between border-b border-token px-4 py-3 bg-surface">
        <h2 className="text-lg font-semibold text-text">{title}</h2>
        <button type="button" onClick={handleClose} className="btn" data-variant="outline" data-size="sm">
          Close
        </button>
      </header>

      <div className="space-y-4 px-4 py-4 text-text">
        {/* Heading */}
        <div className="text-center">
          <p className="text-xl font-semibold">{heading}</p>
        </div>

        {/* Overall stats */}
        <div className="grid grid-cols-4 gap-2 text-center">
          <Stat label="Games Played" value={overall.gamesPlayed} />
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
        <div className={clsx('flex items-center gap-3 pt-2', 'justify-between')}>
          <button
            type="button"
            onClick={onShare}
            disabled={!todayRecord}
            className="btn flex-1"
            data-variant="primary"
            data-size="md"
            aria-live="polite"
          >
            Share
          </button>

          <button
            type="button"
            onClick={onSecondary}
            className="btn flex-1"
            data-variant="outline"
            data-size="md"
          >
            Main
          </button>
        </div>

        {/* Copy feedback */}
        <div
          aria-live="polite"
          className={clsx('text-center text-sm transition-opacity duration-200', copied ? 'opacity-100' : 'opacity-0')}
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
    <div className="rounded-xl border border-token bg-surface-muted py-2">
      <div className="text-lg font-semibold tabular-nums text-text">{value}</div>
      <div className="text-xs text-muted">{label}</div>
    </div>
  )
}

function Bar({ label, value, max }: { label: string; value: number; max: number }) {
  const w = Math.max(8, Math.round((value / max) * 100))
  return (
    <div className="flex items-center gap-3 py-1">
      <div className="w-6 text-right text-sm tabular-nums text-muted">{label}</div>
      <div className="flex-1">
        <div className="relative h-6 overflow-hidden rounded-md border border-accent300 bg-accent50">
          <div className="absolute inset-y-0 left-0 bg-accent300/70" style={{ width: `${w}%` }} />
        </div>
      </div>
      <div className="w-8 text-right text-sm tabular-nums text-muted">{value}</div>
    </div>
  )
}
