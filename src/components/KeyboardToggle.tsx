import { useEffect, useState } from 'react'
import { useGameStore } from '@/store/gameStore'

export function KeyboardToggle() {
  const { keyboardOpen, toggleKeyboard } = useGameStore(s => ({
    keyboardOpen: s.keyboardOpen,
    toggleKeyboard: s.toggleKeyboard,
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

  return (
    <button
      type="button"
      onClick={toggleKeyboard}
      aria-label={keyboardOpen ? 'Hide keyboard' : 'Show keyboard'}
      className="fixed left-4 bottom-28 sm:hidden z-40 rounded-xl border bg-white/90 px-3 py-2 shadow-md backdrop-blur hover:bg-white active:scale-[0.98]"
    >
      <span className="inline-block align-middle mr-2">⌨️</span>
      <span className="align-middle text-sm">{keyboardOpen ? 'Hide' : 'Keyboard'}</span>
    </button>
  )
}
