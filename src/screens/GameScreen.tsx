import { useEffect } from 'react'
import { useGameStore } from '@/store/gameStore'
import { BagGrid } from '@/components/BagGrid'
import { CandidateRow } from '@/components/CandidateRow'
import { ControlsBar } from '@/components/ControlsBar'
import { ResultModal } from '@/components/ResultModal'
import { Toast } from '@/components/Toast'
import { loadFullDictionary } from '@/game/dictionary'
import { RollColumn } from '@/components/RollColumn'
import { FlightLayer } from '@/components/FlightLayer'

export function GameScreen() {
  const {
    loadToday, error, puzzle, history, currentStack,
    typeLetter, popLetter, submit, candidate, slotMeta
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
  }))

  useEffect(() => { loadToday(); loadFullDictionary() }, [])

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
    <div className="mx-auto max-w-sm sm:max-w-md px-4 pt-4 pb-32">
      <RollColumn words={rollWords} />
      <div className="mt-6"><CandidateRow /></div>
      <BagGrid />
      <ControlsBar />
      <ResultModal />
      {error && <Toast message={error} />}
      <FlightLayer />
    </div>
  )
}
