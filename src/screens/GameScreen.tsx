import { useEffect } from 'react'
import { useGameStore } from '@/store/gameStore'
import { BagGrid } from '@/components/BagGrid'
import { CandidateRow } from '@/components/CandidateRow'
import { ResultModal } from '@/components/ResultModal'
import { Toast } from '@/components/Toast'
import { loadDictionaries } from '@/game/dictionary'
import { RollColumn } from '@/components/RollColumn'
import { FlightLayer } from '@/components/FlightLayer'
import { MobileKeyboard } from '@/components/MobileKeyboard'
import { BagCounts } from '@/components/BagCounts'
import { BackHomeButton } from '@/components/BackHomeButton'
import { InlineActions } from '@/components/InlineActions'

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

  const { startTimer, pauseTimer, resumeTimer } = useGameStore(s => ({
    startTimer: s.startTimer,
    pauseTimer: s.pauseTimer,
    resumeTimer: s.resumeTimer,
  }))

  // Start when mounted; pause when leaving
  useEffect(() => {
    startTimer()
    return () => pauseTimer()
  }, [startTimer, pauseTimer])

  // Pause/resume on tab visibility
  useEffect(() => {
    const onVis = () => { document.hidden ? pauseTimer() : resumeTimer() }
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [pauseTimer, resumeTimer])

  // Only load once per day (prevents wiping progress when returning)
  useEffect(() => {
    if (!puzzle.date || puzzle.date === '0000-00-00') {
      loadToday()
    }
    loadDictionaries()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [puzzle.date])

  // Keyboard handlers
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = e.key
      if (/^[a-zA-Z]$/.test(k)) { typeLetter(k); return }
      if (k === 'Backspace') { e.preventDefault(); popLetter(); return }
      if (k === 'Enter') {
        const full = candidate.length === 5
        const ok = full && slotMeta.every(m => m.source && m.source !== 'error')
        if (ok) { e.preventDefault(); submit() }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [typeLetter, popLetter, submit, candidate, slotMeta])

  const rollWords = [
    { index: 0, word: puzzle.wordOfDay || '' },
    ...history.map((h, i) => ({ index: i + 1, word: h.word })),
    { index: history.length, word: currentStack || '' },
  ]

  return (
    <div className="min-h-dvh w-full bg-white text-gray-900">
      {/* back button (fixed) */}
      <BackHomeButton />

      {/* Centered column. When there’s extra space, the stack sits roughly mid-screen.
         If content grows, it naturally flows top→bottom and can scroll. */}
      <div
        className="mx-auto w-full max-w-[680px] px-4"
        style={{
          paddingBottom: keyboardOpen
            ? 'calc(env(safe-area-inset-bottom, 0px) + 300px)'
            : '2.5rem',
        }}
      >
        {/* Use a flex column; my-auto centers vertically when there’s slack space */}
        <div className="min-h-dvh flex flex-col">
          <div className="my-auto pt-6 pb-4">
            {/* 1) Submitted stacks + current stack */}
            <div className="mb-3">
              <RollColumn words={rollWords} onPick={pickStackPos} />
            </div>

            {/* 2) Candidate row */}
            <div className="mb-4">
              <CandidateRow />
            </div>

            {/* 3) Bag (or counts when keyboard is open) */}
            <div className="mb-3">
              {keyboardOpen ? <BagCounts /> : <BagGrid />}
            </div>

            {/* 4) Inline actions directly under the bag */}
            <InlineActions />
          </div>
        </div>
      </div>

      {/* Overlays */}
      <MobileKeyboard />
      <ResultModal />
      {error && <Toast message={error} />}
      <FlightLayer />
    </div>
  )
}
