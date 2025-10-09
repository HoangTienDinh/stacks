import { useEffect, useState } from 'react'
import { useGameStore } from '@/store/gameStore'
import clsx from 'clsx'

function KeyboardIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" {...props}>
      <rect x="3" y="6" width="18" height="12" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
      {/* keys */}
      <path d="M6 10h1M9 10h1M12 10h1M15 10h1M18 10h1
               M6 13h1M9 13h1M12 13h4M18 13h1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export function InlineActions({ className }: { className?: string }) {
  const {
    shuffleBag, clearRow, submit, candidate, slotMeta, setKeyboardOpen, keyboardOpen,
  } = useGameStore(s => ({
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

  const canSubmit =
    candidate.length === 5 && slotMeta.every(m => m.source && m.source !== 'error')

  // Slightly tighter padding/font on narrow screens so all four fit one line.
  const pill =
    'h-9 rounded-full border border-emerald-300 bg-white/60 px-3 sm:px-4 ' +
    'text-[13px] sm:text-sm font-medium text-emerald-900 hover:bg-emerald-50 whitespace-nowrap'

  return (
    <div className={clsx('flex items-center justify-center gap-2 sm:gap-3 w-full', className)}>
      {isTouch && (
        <button
          type="button"
          onClick={() => setKeyboardOpen(!keyboardOpen)}
          aria-label={keyboardOpen ? 'Close keyboard' : 'Open keyboard'}
          title="Keyboard"
          className="order-1 h-9 w-9 rounded-full border border-emerald-300 bg-white/60
                     text-emerald-900 hover:bg-emerald-50 flex items-center justify-center"
        >
          <KeyboardIcon />
        </button>
      )}

      <button type="button" onClick={shuffleBag} className={clsx(pill, 'order-2')}>
        Shuffle
      </button>

      <button type="button" onClick={clearRow} className={clsx(pill, 'order-3')}>
        Clear
      </button>

      <button
        type="button"
        onClick={submit}
        disabled={!canSubmit}
        className={clsx(
          'order-4 h-9 rounded-full px-3 sm:px-4 text-[13px] sm:text-sm font-semibold transition whitespace-nowrap',
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
