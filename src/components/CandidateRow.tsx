
import { useDroppable, DndContext, PointerSensor, useSensors, useSensor, DragEndEvent } from '@dnd-kit/core'
import { useGameStore } from '@/store/gameStore'

function Slot({ index }: { index: number }) {
  const { isOver, setNodeRef } = useDroppable({ id: `slot-${index}`, data: { index } })
  const { candidate, setCandidate } = useGameStore(s => ({ candidate: s.candidate, setCandidate: s.setCandidate }))
  const letter = candidate[index] || ' '
  return (
    <div ref={setNodeRef} className={`tile tile-lg w-16 h-16 sm:w-20 sm:h-20 ${isOver ? 'ring-2 ring-brand-500' : ''}`}>
      {letter.trim()}
    </div>
  )
}

export function CandidateRow() {
  const sensors = useSensors(useSensor(PointerSensor))
  const { candidate, setCandidate } = useGameStore(s => ({ candidate: s.candidate, setCandidate: s.setCandidate }))

  const onDragEnd = (e: DragEndEvent) => {
    const letter = (e.active?.data?.current as any)?.letter as string | undefined
    const overId = (e.over?.id as string | undefined) || undefined
    if (!letter) return
    if (overId && overId.startsWith('slot-')) {
      const idx = parseInt(overId.split('-')[1], 10)
      const arr = candidate.padEnd(5, ' ').slice(0,5).split('')
      arr[idx] = letter.toUpperCase()
      setCandidate(arr.join(''))
    } else {
      const arr = candidate.padEnd(5, ' ').slice(0,5).split('')
      const empty = arr.findIndex(c => c === ' ')
      if (empty !== -1) { arr[empty] = letter.toUpperCase(); setCandidate(arr.join('')) }
    }
  }

  return (
    <DndContext sensors={sensors} onDragEnd={onDragEnd}>
      <div className="flex items-center justify-center gap-3 min-h-[88px]">
        {[0,1,2,3,4].map(i => <Slot key={i} index={i} />)}
      </div>
    </DndContext>
  )
}
