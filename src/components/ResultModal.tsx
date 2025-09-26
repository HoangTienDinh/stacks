
import { useGameStore } from '@/store/gameStore'

const fmt = (ms:number) => {
  const s = Math.floor(ms/1000); const m = Math.floor(s/60); const ss = (s%60).toString().padStart(2,'0')
  return `${m}:${ss}`
}

export function ResultModal() {
  const { status, history, startedAt, endedAt, loadToday } = useGameStore(s => ({ status: s.status, history: s.history, startedAt: s.startedAt, endedAt: s.endedAt, loadToday: s.loadToday }))
  if (status !== 'cleared' || !startedAt || !endedAt) return null
  const time = fmt(endedAt - startedAt)
  const stacks = history.length
  const text = `Finished in ${stacks} Stacks in ${time}`
  const share = async () => {
    try { await navigator.clipboard.writeText(`Stacks — ${text}`); alert('Copied to clipboard!') } catch { alert(text) }
  }
  return (
    <div className="modal-backdrop">
      <div className="modal-card text-center">
        <div className="text-xl font-bold mb-2">{text}</div>
        <div className="flex gap-2 justify-center mt-2">
          <button className="btn" onClick={share}>Share</button>
          <button className="btn" onClick={() => loadToday()}>Replay</button>
        </div>
      </div>
    </div>
  )
}
