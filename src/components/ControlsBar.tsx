import { useEffect, useState } from 'react'
import { useGameStore } from '@/store/gameStore'
import clsx from 'clsx'

export function ControlsBar() {
  const {
    shuffleBag, clearRow, submit,
    keyboardOpen, toggleKeyboard,
    candidate, slotMeta,
  } = useGameStore(s => ({
    shuffleBag: s.shuffleBag,
    clearRow: s.clearRow,
    submit: s.submit,
    keyboardOpen: s.keyboardOpen,
    toggleKeyboard: s.toggleKeyboard,
    candidate: s.candidate,
    slotMeta: s.slotMeta,
  }))

  // mobile web detection
  const [isTouch, setIsTouch] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia?.('(pointer: coarse)')
    const upd = () => setIsTouch(!!mq?.matches)
    upd()
    mq?.addEventListener?.('change', upd)
    return () => mq?.removeEventListener?.('change', upd)
  }, [])

  const canSubmit = candidate.length === 5 && slotMeta.every(m => m.source && m.source !== 'error')

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 bg-white/95 backdrop-blur border-t">
      <div className="mx-auto max-w-md px-3 py-3">
        <div className="flex items-center justify-center gap-3">
          {/* Mobile-only keyboard toggle on the far left */}
          {isTouch && (
            <button
              type="button"
              onClick={toggleKeyboard}
              className={clsx(
                'rounded-xl border px-3 h-10 text-sm font-medium shadow-sm',
                keyboardOpen ? 'bg-gray-100' : 'bg-white'
              )}
              aria-label={keyboardOpen ? 'Hide keyboard' : 'Show keyboard'}
            >
              ⌨️ {keyboardOpen ? 'Hide' : 'Keyboard'}
            </button>
          )}

          <button
            type="button"
            onClick={shuffleBag}
            className="rounded-xl border px-4 h-10 text-sm font-medium bg-white shadow-sm"
          >
            Shuffle
          </button>

          <button
            type="button"
            onClick={clearRow}
            className="rounded-xl border px-4 h-10 text-sm font-medium bg-white shadow-sm"
          >
            Clear Row
          </button>

          <button
            type="button"
            onClick={submit}
            disabled={!canSubmit}
            className="rounded-xl px-4 h-10 text-sm font-semibold shadow-sm text-white bg-violet-600 disabled:opacity-40"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  )
}
