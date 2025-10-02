import { useEffect } from 'react'
import { useGameStore } from '@/store/gameStore'
import { BagGrid } from '@/components/BagGrid'
import { CandidateRow } from '@/components/CandidateRow'
import { ControlsBar } from '@/components/ControlsBar'
import { ResultModal } from '@/components/ResultModal'
import { Toast } from '@/components/Toast'
import { loadFullDictionary } from '@/game/dictionary'
import { RollColumn } from '@/components/RollColumn'

export function GameScreen() {
  const { loadToday, error, puzzle, history, currentStack } = useGameStore(s => ({
    loadToday: s.loadToday,
    error: s.error,
    puzzle: s.puzzle,
    history: s.history,
    currentStack: s.currentStack,
  }))

  useEffect(() => {
    loadToday()
    loadFullDictionary()
  }, [])

  const rollWords = [
    { index: 0, word: puzzle.wordOfDay || '' },
    ...history.map((h, i) => ({ index: i + 1, word: h.word })),
    { index: history.length, word: currentStack || '' },
  ]

  return (
    <div className="mx-auto max-w-sm sm:max-w-md px-4 pt-4 pb-32">
      <RollColumn words={rollWords} />
      <div className="mt-6">
        <CandidateRow />
      </div>
      <BagGrid />
      <ControlsBar />
      <ResultModal />
      {error && <Toast message={error} />}
    </div>
  )
}
