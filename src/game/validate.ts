
import type { GameState } from './models'
import { counts, multisetOverlap } from './counts'
import { hasWord } from './dictionary'

export type Validation =
  | { ok: true; need: Record<string, number>; overlap: number }
  | { ok: false; reason: string }

export function validateMove(state: GameState, candidate: string): Validation {
  const w = candidate.toUpperCase()
  if (!/^[A-Z]{5}$/.test(w)) return { ok: false, reason: 'Word must be 5 letters (A–Z)' }
  if (!hasWord(w)) return { ok: false, reason: 'Not in dictionary' }

  const { overlap, overlapCounts } = multisetOverlap(state.currentStack, w)
  if (overlap < 1 || overlap > 4) return { ok: false, reason: 'Word must share 1–4 letters with previous' }

  const need = counts(w)
  for (const l of Object.keys(need)) {
    need[l] = Math.max(0, need[l] - (overlapCounts[l] || 0))
  }
  for (const l of Object.keys(need)) {
    if ((state.bagCounts[l] || 0) < need[l]) return { ok: false, reason: `Need ${need[l]}×${l} but bag has ${(state.bagCounts[l] || 0)}×` }
  }
  return { ok: true, need, overlap }
}
