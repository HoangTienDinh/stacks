import { useEffect } from 'react'
import { useGameStore } from '@/store/gameStore'
import { BagGrid } from '@/components/BagGrid'
import { CandidateRow } from '@/components/CandidateRow'
import { ControlsBar } from '@/components/ControlsBar'
import { ResultModal } from '@/components/ResultModal'
import { Toast } from '@/components/Toast'
import { loadDictionaries } from '@/game/dictionary'
import { RollColumn } from '@/components/RollColumn'
import { FlightLayer } from '@/components/FlightLayer'
import { MobileKeyboard } from '@/components/MobileKeyboard'
import { BagCounts } from '@/components/BagCounts'
import { BackHomeButton } from '@/components/BackHomeButton'

export function GameScreen() {
  const {
    loadToday, error, puzzle, history, currentStack,
    typeLetter, popLetter, submit, candidate, slotMeta, pickStackPos,
    keyboardOpen,
  } = useGameStore(s => ({
    loadToday: s.loadToday,
    error: s.error,
    puzzle: s.puzzle,
    history: s.history,
    currentStack: s.currentStack,
    typeLetter: s.typeLetter,
    popLetter: s.popLetter,
    submit: s.submit,
    candidate: s.candidate,
    slotMeta: s.slotMeta,
    pickStackPos: s.pickStackPos,
    keyboardOpen: s.keyboardOpen,
  }))

  useEffect(() => { loadToday(); loadDictionaries() }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = e.key
      if (/^[a-zA-Z]$/.test(k)) { typeLetter(k); return }
      if (k === 'Backspace') { e.preventDefault(); popLetter(); return }
      if (k === 'Enter') {
        const full = candidate.length === 5
        const ok = full && slotMeta.every(m => m.source && m.source !== 'error')
        if (ok) { e.preventDefault(); submit() }
        return
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [typeLetter, popLetter, submit, candidate, slotMeta])

  const rollWords = [
    { index: 0, word: puzzle.wordOfDay || '' },
    ...history.map((h, i) => ({ index: i+1, word: h.word })),
    { index: history.length, word: currentStack || '' },
  ]

  return (
    <div className="h-[100dvh] flex flex-col">
      <BackHomeButton />

      {/* Top: rolling stacks area (grows), centered */}
      <div className="px-4 pt-4 flex-1 flex flex-col">
        <RollColumn words={rollWords} onPick={pickStackPos} />
        <div className="mt-4">
          <CandidateRow />
        </div>

        {/* Bag or Counts (no scrolling; keep everything visible) */}
        {/* <div className={keyboardOpen ? 'pt-2 pb-48' : 'pt-2 pb-28'}>
          {keyboardOpen ? <BagCounts /> : <BagGrid />}
        </div> */}
        <div
          className="pt-2"
          style={{
            // When keyboard is open, reserve ~300px + safe-area so nothing overlaps
            paddingBottom: keyboardOpen
              ? 'calc(env(safe-area-inset-bottom, 0px) + 300px)'
              : '7rem' // ≈ pb-28
          }}
        >
          {keyboardOpen ? <BagCounts /> : <BagGrid />}
        </div>
      </div>

      {/* Footer + mobile keyboard overlay */}
      <ControlsBar />
      <MobileKeyboard />
      <ResultModal />
      {error && <Toast message={error} />}
      <FlightLayer />
    </div>
  )
}
