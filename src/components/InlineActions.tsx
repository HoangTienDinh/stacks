import { useGameStore } from '@/store/gameStore'
import clsx from 'clsx'

export function InlineActions({ className }: { className?: string }) {
  const { shuffleBag, clearRow, submit, candidate, slotMeta } = useGameStore(s => ({
    shuffleBag: s.shuffleBag,
    clearRow: s.clearRow,
    submit: s.submit,
    candidate: s.candidate,
    slotMeta: s.slotMeta,
  }))

  const canSubmit =
    candidate.length === 5 && slotMeta.every(m => m.source && m.source !== 'error')

  return (
    <div className={clsx('flex items-center justify-center gap-3', className)}>
      <button
        type="button"
        onClick={shuffleBag}
        className="h-9 rounded-full border border-emerald-300 bg-white/60 px-4 text-sm font-medium text-emerald-900 hover:bg-emerald-50"
      >
        Shuffle
      </button>
      <button
        type="button"
        onClick={clearRow}
        className="h-9 rounded-full border border-emerald-300 bg-white/60 px-4 text-sm font-medium text-emerald-900 hover:bg-emerald-50"
      >
        Clear Row
      </button>
      <button
        type="button"
        onClick={submit}
        disabled={!canSubmit}
        className={clsx(
          'h-9 rounded-full px-4 text-sm font-semibold transition',
          canSubmit
            ? 'bg-cyan-600 text-white hover:bg-cyan-500'
            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
        )}
      >
        Submit
      </button>
    </div>
  )
}
