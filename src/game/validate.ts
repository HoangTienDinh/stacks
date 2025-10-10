import { counts } from './counts'
import { hasWord } from './dictionary'

import type { GameState } from './models'

export type Validation =
  | { ok: true; need: Record<string, number>; overlap: number }
  | { ok: false; reason: string }

/**
 * Positional validation:
 * - Word must be 5 letters in dictionary
 * - Overlap = count of positions i where currentStack[i] === candidate[i]
 * - Must have 1–4 positional overlaps
 * - need = letter counts to pull from the bag after subtracting positional overlaps
 */
export function validateMove(state: GameState, candidate: string): Validation {
  const w = candidate.toUpperCase()
  if (!/^[A-Z]{5}$/.test(w)) return { ok: false, reason: 'Word must be 5 letters (A–Z)' }
  if (!hasWord(w)) return { ok: false, reason: 'Not in dictionary' }

  // --- positional overlap (NOT multiset)
  let overlap = 0
  const overlapCounts: Record<string, number> = {}
  for (let i = 0; i < 5; i++) {
    const cs = state.currentStack[i]
    const cw = w[i]
    if (cs === cw) {
      overlap++
      overlapCounts[cw] = (overlapCounts[cw] || 0) + 1
    }
  }

  if (overlap < 1 || overlap > 4) {
    return { ok: false, reason: 'Must share 1–4 letters by position' }
  }

  // Letters required from the bag = total counts minus positional matches
  const need = counts(w)
  for (const l of Object.keys(need)) {
    need[l] = Math.max(0, need[l] - (overlapCounts[l] || 0))
  }

  // Ensure bag has enough for the needed letters
  for (const l of Object.keys(need)) {
    const have = state.bagCounts[l] || 0
    if (have < need[l]) {
      return { ok: false, reason: `Need ${need[l]}×${l} but bag has ${have}×` }
    }
  }

  return { ok: true, need, overlap }
}
