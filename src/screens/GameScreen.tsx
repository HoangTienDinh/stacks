import { useEffect } from 'react'

import { BackHomeButton } from '@/components/BackHomeButton'
import { BagCounts } from '@/components/BagCounts'
import { BagGrid } from '@/components/BagGrid'
import { CandidateRow } from '@/components/CandidateRow'
import { FlightLayer } from '@/components/FlightLayer'
import { InlineActions } from '@/components/InlineActions'
import { MobileKeyboard } from '@/components/MobileKeyboard'
import { ResultModal } from '@/components/ResultModal'
import { RollColumn } from '@/components/RollColumn'
import { Toast } from '@/components/Toast'
import { loadDictionaries } from '@/game/dictionary'
import { useGameStore } from '@/store/gameStore'

export function GameScreen() {
  const {
    loadToday,
    error,
    puzzle,
    history,
    currentStack,
    typeLetter,
    popLetter,
    submit,
    candidate,
    slotMeta,
    pickStackPos,
    keyboardOpen,
    timer,
  } = useGameStore((s) => ({
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
    timer: s.timer,
  }))

  const { pauseTimer, resumeTimer } = useGameStore((s) => ({
    pauseTimer: s.pauseTimer,
    resumeTimer: s.resumeTimer,
  }))

  // Load today and dictionaries once per day
  useEffect(() => {
    if (!puzzle.date || puzzle.date === '0000-00-00') {
      loadToday()
    }
    loadDictionaries()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [puzzle.date])

  // Start/resume timer after puzzle has loaded
  useEffect(() => {
    if (puzzle.date && puzzle.date !== '0000-00-00' && !timer.running) {
      resumeTimer()
    }
  }, [puzzle.date, timer.running, resumeTimer])

  // Always pause on unmount (leaving GameScreen)
  useEffect(() => {
    return () => {
      pauseTimer()
    }
  }, [pauseTimer])

  // Pause while backgrounded; resume on focus
  useEffect(() => {
    const onHide = () => pauseTimer()
    const onShow = () => resumeTimer()
    const onVis = () => (document.hidden ? onHide() : onShow())

    document.addEventListener('visibilitychange', onVis)
    window.addEventListener('pagehide', onHide)
    window.addEventListener('blur', onHide)
    window.addEventListener('focus', onShow)
    return () => {
      document.removeEventListener('visibilitychange', onVis)
      window.removeEventListener('pagehide', onHide)
      window.removeEventListener('blur', onHide)
      window.removeEventListener('focus', onShow)
    }
  }, [pauseTimer, resumeTimer])

  // Physical keyboard: letters / backspace / enter
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = e.key

      // letters A-Z
      if (/^[a-z]$/i.test(k)) {
        typeLetter(k)
        return
      }

      if (k === 'Backspace') {
        e.preventDefault()
        popLetter()
        return
      }

      if (k === 'Enter') {
        const full = candidate.length === 5
        const ok = full && slotMeta.every((m) => m.source && m.source !== 'error')
        if (ok) {
          e.preventDefault()
          submit()
        }
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
      <BackHomeButton />

      <div
        className="mx-auto w-full max-w-[680px] px-4"
        style={{
          paddingBottom: keyboardOpen ? 'calc(env(safe-area-inset-bottom, 0px) + 300px)' : '2.5rem',
        }}
      >
        <div className="flex min-h-dvh flex-col">
          <div className="my-auto pb-4 pt-6">
            {/* Stacks timeline + current stack */}
            <div className="mb-3">
              <RollColumn words={rollWords} onPick={pickStackPos} />
            </div>

            {/* Candidate row */}
            <div className="mb-4">
              <CandidateRow />
            </div>

            {/* Bag (or counts when mobile keyboard is open) */}
            <div className="mb-3">{keyboardOpen ? <BagCounts /> : <BagGrid />}</div>

            {/* Inline actions under bag (hidden when keyboard sheet is open) */}
            {!keyboardOpen && <InlineActions />}
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
