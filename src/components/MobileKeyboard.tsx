import { useEffect, useState } from 'react'
import { useGameStore } from '@/store/gameStore'

const ROWS = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM']

export function MobileKeyboard() {
  const { keyboardOpen, setKeyboardOpen, typeLetter, popLetter, submit, candidate, slotMeta } = useGameStore(s => ({
    keyboardOpen: s.keyboardOpen,
    setKeyboardOpen: s.setKeyboardOpen,
    typeLetter: s.typeLetter,
    popLetter: s.popLetter,
    submit: s.submit,
    candidate: s.candidate,
    slotMeta: s.slotMeta,
  }))

  const [isTouch, setIsTouch] = useState(false)
  useEffect(() => {
    const m = window.matchMedia?.('(pointer: coarse)')
    setIsTouch(!!m?.matches)
    const onChange = () => setIsTouch(!!m?.matches)
    m?.addEventListener?.('change', onChange)
    return () => m?.removeEventListener?.('change', onChange)
  }, [])

  if (!isTouch) return null
  if (!keyboardOpen) return null

  const canSubmit = candidate.length === 5 && slotMeta.every(m => m.source && m.source !== 'error')

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 sm:hidden">
      <div className="mx-auto max-w-md rounded-t-2xl border bg-white p-3 shadow-2xl">
        {ROWS.map((row, ri) => (
          <div key={ri} className="mb-2 flex justify-center gap-1">
            {row.split('').map(ch => (
              <button
                key={ch}
                type="button"
                onClick={() => typeLetter(ch)}
                className="h-10 min-w-[2.2rem] rounded-lg border bg-gray-50 px-2 text-sm font-medium shadow-sm active:bg-gray-100"
              >
                {ch}
              </button>
            ))}
            {ri === ROWS.length - 1 && (
              <>
                <button
                  type="button"
                  onClick={popLetter}
                  className="ml-1 h-10 rounded-lg border bg-gray-50 px-3 text-sm font-medium shadow-sm active:bg-gray-100"
                >
                  ⌫
                </button>
                <button
                  type="button"
                  onClick={() => canSubmit && submit()}
                  disabled={!canSubmit}
                  className="ml-1 h-10 rounded-lg border bg-violet-600 px-3 text-sm font-semibold text-white shadow-sm disabled:opacity-40"
                >
                  Enter
                </button>
              </>
            )}
          </div>
        ))}
        <div className="mt-2 flex justify-center">
          <button
            type="button"
            onClick={() => setKeyboardOpen(false)}
            className="text-sm text-gray-600 underline"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
