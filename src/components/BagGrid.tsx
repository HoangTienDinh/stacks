
import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors, useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { useGameStore } from '@/store/gameStore'
import { Tile } from './Tile'

export function BagGrid() {
  const { puzzle, usedIndices, pushLetter } = useGameStore(s => ({ puzzle: s.puzzle, usedIndices: s.usedIndices, pushLetter: s.pushLetter }))
  const sensors = useSensors(useSensor(PointerSensor))

  const onDragEnd = (e: DragEndEvent) => {
    const letter = (e.active?.data?.current as any)?.letter as string | undefined
    if (letter) pushLetter(letter)
  }

  return (
    <DndContext sensors={sensors} onDragEnd={onDragEnd}>
      <div className="bag-grid mt-4">
        {puzzle.bagList.map((ch, i) => (
          <DraggableTile key={i} letter={ch} muted={usedIndices.has(i)} />
        ))}
      </div>
    </DndContext>
  )
}

function DraggableTile({ letter, muted }: { letter: string; muted: boolean }) {
  const pushLetter = useGameStore(s => s.pushLetter)
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: `bag-${letter}-${Math.random()}`, data: { letter } })
  const style = transform ? { transform: CSS.Transform.toString(transform) } : undefined
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...(!muted ? listeners : {})} onClick={() => !muted && pushLetter(letter)} className={muted ? 'pointer-events-none' : ''}>
      <Tile letter={letter} muted={muted} />
    </div>
  )
}
