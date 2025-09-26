// src/screens/GameScreen.tsx
import { useEffect } from 'react'
import { useGameStore } from '@/store/gameStore'
import { BagGrid } from '@/components/BagGrid'
import { CandidateRow } from '@/components/CandidateRow'
import { ControlsBar } from '@/components/ControlsBar'
import { ResultModal } from '@/components/ResultModal'
import { Toast } from '@/components/Toast'
import { loadFullDictionary } from '@/game/dictionary'
import { RollColumn } from '@/components/RollColumn'

import {
  DndContext,
  DragEndEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'

export function GameScreen() {
  const { loadToday, error, puzzle, history, currentStack, candidate, setCandidate } = useGameStore(s => ({
    loadToday: s.loadToday,
    error: s.error,
    puzzle: s.puzzle,
    history: s.history,
    currentStack: s.currentStack,
    candidate: s.candidate,
    setCandidate: s.setCandidate,
  }))

  useEffect(() => { loadToday(); loadFullDictionary() }, [])

  const sensors = useSensors(
  // Small mouse movement starts drag
  useSensor(MouseSensor, { activationConstraint: { distance: 4 } }),
  // Touch needs a tiny hold + tolerance so scrolling still works
  useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 8 } }),
)

  const onDragEnd = (e: DragEndEvent) => {
    const letter = (e.active?.data?.current as any)?.letter as string | undefined
    if (!letter) return
    const overId = e.over?.id ? String(e.over.id) : undefined
    const arr = candidate.padEnd(5, ' ').slice(0,5).split('')

    if (overId && overId.startsWith('slot-')) {
      const idx = parseInt(overId.split('-')[1], 10)
      arr[idx] = letter.toUpperCase()
    } else {
      const empty = arr.findIndex(c => c === ' ')
      if (empty !== -1) arr[empty] = letter.toUpperCase()
    }
    setCandidate(arr.join(''))
  }

  const rollWords = [
    { index: 0, word: puzzle.wordOfDay || '' },
    ...history.map((h, i) => ({ index: i+1, word: h.word })),
    { index: history.length, word: currentStack || '' },
  ]

  return (
    <div className="mx-auto max-w-sm sm:max-w-md px-4 pt-4 pb-32">
      <RollColumn words={rollWords} />

      <DndContext sensors={sensors} onDragEnd={onDragEnd}>
        <div className="mt-6">
          <CandidateRow />
        </div>
        <BagGrid />
      </DndContext>

      <ControlsBar />
      <ResultModal />
      {error && <Toast message={error} />}
    </div>
  )
}
