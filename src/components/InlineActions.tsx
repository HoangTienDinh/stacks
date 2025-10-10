import clsx from 'clsx'
import { useEffect, useState } from 'react'

import { useGameStore } from '@/store/gameStore'

function KeyboardIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" {...props}>
      <rect x="3" y="6" width="18" height="12" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
      <path
        d="M6 10h1M9 10h1M12 10h1M15 10h1M18 10h1 M6 13h1M9 13h1M12 13h4M18 13h1"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round"
      />
    </svg>
  )
}

export function InlineActions({ className }: { className?: string }) {
  const { shuffleBag, clearRow, submit, candidate, slotMeta, setKeyboardOpen, keyboardOpen } =
    useGameStore((s) => ({
      shuffleBag: s.shuffleBag,
      clearRow: s.clearRow,
      submit: s.submit,
      candidate: s.candidate,
      slotMeta: s.slotMeta,
      setKeyboardOpen: s.setKeyboardOpen,
      keyboardOpen: s.keyboardOpen,
    }))

  const [isTouch, setIsTouch] = useState(false)
  useEffect(() => {
    const m = window.matchMedia?.('(pointer: coarse)')
    const update = () => setIsTouch(!!m?.matches)
    update()
    m?.addEventListener?.('change', update)
    return () => m?.removeEventListener?.('change', update)
  }, [])

  const canSubmit = candidate.length === 5
  const looksValid = slotMeta.every((m) => m.source && m.source !== 'error')

  return (
    <div className={clsx('flex w-full items-center justify-center gap-2 sm:gap-3', className)}>
      {isTouch && (
        <button
          type="button"
          onClick={() => setKeyboardOpen(!keyboardOpen)}
          aria-label={keyboardOpen ? 'Close keyboard' : 'Open keyboard'}
          title="Keyboard"
          className="btn btn-circle"
          data-variant="outline"
          data-size="sm"
        >
          <KeyboardIcon />
        </button>
      )}

      <button type="button" onClick={shuffleBag} className="btn" data-variant="ghost" data-size="sm">
        Shuffle
      </button>

      <button type="button" onClick={clearRow} className="btn" data-variant="ghost" data-size="sm">
        Clear
      </button>

      <button
        type="button"
        onClick={submit}
        disabled={!canSubmit}
        className={clsx(
          'order-4 h-9 whitespace-nowrap rounded-full px-3 text-[13px] font-semibold transition sm:px-4 sm:text-sm',
          canSubmit
            ? looksValid
              ? 'bg-cyan-600 text-white hover:bg-cyan-500'
              : 'bg-gray-900 text-white/95 hover:bg-gray-800'
            : 'cursor-not-allowed bg-gray-200 text-gray-500'
        )}
      >
        Submit
      </button>
    </div>
  )
}
