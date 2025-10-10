// Lightweight, versioned session snapshot for resuming in-progress games.
const SKEY = 'stacks.v1.session'

export type SlotMetaSnap = {
  source: 'bag' | 'stack' | 'error' | null
  bagIndex?: number
  stackPos?: number
}

export type TimerSnap = {
  running: boolean
  startedAt: number | null
  pausedAt: number | null
  accumSec: number
}

// Minimal shape actually used by undo & replay:
// - .word          (string)
// - .spent         (Record<letter, count>)
export type HistoryItemSnap = {
  word: string
  spent: Record<string, number>
}

export type SessionSnapshotV1 = {
  version: 1
  dateKey: string // puzzle key "YYYY-MM-DD"
  puzzle: { wordOfDay: string; bagList: string[] }

  // Progress
  history: HistoryItemSnap[]
  usedIndices: number[] // Set<number> → array for storage
  bagCounts: Record<string, number>
  currentStack: string

  // Typing row state (so the row resumes nicely)
  candidate: string
  slotMeta: SlotMetaSnap[]
  previewReserved: number[]

  // UI / stats helpers
  undoCount: number
  timer: TimerSnap
}

export function saveSession(s: SessionSnapshotV1) {
  try {
    localStorage.setItem(SKEY, JSON.stringify(s))
  } catch (e) {
    console.error(e)
    // e.g., private mode / quota; intentionally ignore
    return
  }
}

export function loadSession(): SessionSnapshotV1 | null {
  try {
    const raw = localStorage.getItem(SKEY)
    if (!raw) return null
    const obj: unknown = JSON.parse(raw)
    if (obj && typeof obj === 'object' && (obj as { version?: unknown }).version === 1) {
      return obj as SessionSnapshotV1
    }
    return null
  } catch {
    return null
  }
}

export function clearSession() {
  try {
    localStorage.removeItem(SKEY)
  } catch (e) {
    console.error(e)
    // ignore storage errors
    return
  }
}
