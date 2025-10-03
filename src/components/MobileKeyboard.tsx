import { useEffect, useState } from 'react'
import { useGameStore } from '@/store/gameStore'

const TOP = 'QWERTYUIOP'
const MID = 'ASDFGHJKL'
const LOW = 'ZXCVBNM'

export function MobileKeyboard() {
  const {
    keyboardOpen, setKeyboardOpen, typeLetter, popLetter, submit,
    candidate, slotMeta, shuffleBag,
  } = useGameStore(s => ({
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

  const canSubmit = candidate.length === 5 && slotMeta.every(m => m.source && m.source !== 'error')

  const Key = ({ ch }: { ch: string }) => (
    <button
      type="button"
      onClick={() => typeLetter(ch)}
      className="h-10 min-w-[2.2rem] rounded-lg border bg-gray-50 px-2 text-sm font-medium shadow-sm active:bg-gray-100"
    >
      {ch}
    </button>
  )

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 sm:hidden">
      <div className="mx-auto max-w-md rounded-t-2xl border bg-white p-3 shadow-2xl">
        {/* Row 1 */}
        <div className="mb-2 flex justify-center gap-1">
          {TOP.split('').map(ch => <Key key={ch} ch={ch} />)}
        </div>

        {/* Row 2 with Backspace at the far right (i.e., directly above Enter) */}
        <div className="mb-2 flex justify-center gap-1">
          {MID.split('').map(ch => <Key key={ch} ch={ch} />)}
          <button
            type="button"
            onClick={popLetter}
            aria-label="Backspace"
            className="h-10 min-w-[2.6rem] rounded-lg border bg-gray-50 px-2 text-sm font-medium shadow-sm active:bg-gray-100"
          >
            ⌫
          </button>
        </div>

        {/* Row 3 with Enter at bottom-right */}
        <div className="mb-2 flex justify-center gap-1">
          {LOW.split('').map(ch => <Key key={ch} ch={ch} />)}
          <button
            type="button"
            onClick={() => canSubmit && submit()}
            disabled={!canSubmit}
            className="h-10 min-w-[3.6rem] rounded-lg border bg-violet-600 px-3 text-sm font-semibold text-white shadow-sm disabled:opacity-40"
          >
            Enter
          </button>
        </div>

        {/* Footer inside sheet: Close + Shuffle */}
        <div className="mt-1 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setKeyboardOpen(false)}
            className="text-sm text-gray-700 underline"
          >
            Close
          </button>
          <button
            type="button"
            onClick={shuffleBag}
            className="rounded-lg border bg-white px-3 h-9 text-sm font-medium shadow-sm"
            aria-label="Shuffle bag letters"
          >
            Shuffle
          </button>
        </div>
      </div>
    </div>
  )
}
