import clsx from 'clsx'
import { useEffect, useState } from 'react'

import { useGameStore } from '@/store/gameStore'

const TOP = 'QWERTYUIOP'
const MID = 'ASDFGHJKL'
const LOW = 'ZXCVBNM'

export function MobileKeyboard() {
  const {
    keyboardOpen,
    setKeyboardOpen,
    typeLetter,
    popLetter,
    submit,
    candidate,
    slotMeta,
    shuffleBag,
  } = useGameStore((s) => ({
    keyboardOpen: s.keyboardOpen,
    setKeyboardOpen: s.setKeyboardOpen,
    typeLetter: s.typeLetter,
    popLetter: s.popLetter,
    submit: s.submit,
    candidate: s.candidate,
    slotMeta: s.slotMeta,
    shuffleBag: s.shuffleBag,
  }))

  const [isTouch, setIsTouch] = useState(false)
  useEffect(() => {
    const m = window.matchMedia?.('(pointer: coarse)')
    const upd = () => setIsTouch(!!m?.matches)
    upd()
    m?.addEventListener?.('change', upd)
    return () => m?.removeEventListener?.('change', upd)
  }, [])

  if (!isTouch || !keyboardOpen) return null

  const canSubmit = candidate.length === 5
  const looksValid = slotMeta.every((m) => m.source && m.source !== 'error')

  const Key = ({ ch, className = '' }: { ch: string; className?: string }) => (
    <button
      type="button"
      onClick={() => typeLetter(ch)}
      className={`btn w-full ${className}`}
      data-variant="outline"
      data-size="sm"
    >
      {ch}
    </button>
  )

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 sm:hidden">
      {/* Panel is fully constrained to viewport width and safe area */}
      <div className="pointer-events-auto mx-auto w-full max-w-[680px] px-3">
        <div className="rounded-t-2xl border border-token bg-surface p-3 pb-[max(env(safe-area-inset-bottom),8px)] shadow-2xl">
          {/* Row 1: 10 equally-sized keys */}
          <div className="mb-2 grid grid-cols-10 gap-1">
            {TOP.split('').map((ch) => (
              <Key key={ch} ch={ch} />
            ))}
          </div>

          {/* Row 2: letters + Backspace (Backspace gets 2 columns) */}
          <div className="mb-2 grid grid-cols-11 gap-1">
            {MID.split('').map((ch) => (
              <Key key={ch} ch={ch} />
            ))}
            <button
              type="button"
              onClick={popLetter}
              aria-label="Backspace"
              className="btn col-span-2"
              data-variant="outline"
              data-size="sm"
            >
              ⌫
            </button>
          </div>

          {/* Row 3: letters + Enter (Enter is wider) */}
          <div className="mb-2 grid grid-cols-9 gap-1">
            {LOW.split('').map((ch) => (
              <Key key={ch} ch={ch} />
            ))}
            <button
              type="button"
              onClick={() => canSubmit && submit()}
              disabled={!canSubmit}
              className={clsx(
                'col-span-2 h-11 rounded-lg border px-3 text-[15px] font-semibold shadow-sm disabled:opacity-40',
                canSubmit
                  ? (looksValid ? 'bg-cyan-600 text-white hover:bg-cyan-500' : 'bg-gray-900 text-white hover:bg-gray-800')
                  : 'bg-gray-200 text-gray-500'
              )}
            >
              Enter
            </button>
          </div>

          {/* Footer inside sheet: Close + Shuffle (wrap if tight) */}
          <div className="mt-1 flex flex-wrap items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => setKeyboardOpen(false)}
              className="text-sm underline text-text"
              aria-label="Close keyboard"
            >
              Close
            </button>
            <button
              type="button"
              onClick={shuffleBag}
              className="btn"
              data-variant="outline"
              data-size="sm"
              aria-label="Shuffle bag letters"
            >
              Shuffle
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
