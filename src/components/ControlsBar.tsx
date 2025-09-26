
import { useGameStore } from '@/store/gameStore'

export function ControlsBar() {
  const { clearRow, submit, shuffleBag, undo, status } = useGameStore(s => ({ clearRow: s.clearRow, submit: s.submit, shuffleBag: s.shuffleBag, undo: s.undo, status: s.status }))
  return (
    <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3">
      <div className="grid grid-cols-4 gap-3">
        <button className="btn" onClick={shuffleBag}>Shuffle</button>
        <button className="btn" onClick={clearRow}>Clear Row</button>
        <button className="btn" onClick={undo} disabled={status==='cleared'}>Undo</button>
        <button className="btn btn-primary" onClick={submit} disabled={status==='cleared'}>Submit</button>
      </div>
    </div>
  )
}
