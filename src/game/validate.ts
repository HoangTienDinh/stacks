import type { GameState } from './models'
import { counts, multisetOverlap } from './counts'
import { hasWord, isBanned } from './dictionary'

export type Validation =
  | { ok: true; need: Record<string, number>; overlap: number }
  | { ok: false; reason: string }

function positionalOverlap(prev: string, next: string): number {
  let k = 0
  for (let i = 0; i < 5; i++) if (prev[i] === next[i]) k++
  return k
}

export function validateMove(state: GameState, candidate: string): Validation {
  const w = candidate.toUpperCase()
  if (!/^[A-Z]{5}$/.test(w)) return { ok: false, reason: 'Word must be 5 letters (A–Z)' }

  // Ban list first (playful copy)
  if (isBanned(w)) return { ok: false, reason: "That's a naughty word" }

  // Membership (allowed dictionary)
  if (!hasWord(w)) return { ok: false, reason: 'Not in dictionary' }

  // NEW: must match at least one letter in the SAME POSITION as current stack
  const pos = positionalOverlap(state.currentStack, w)
  if (pos < 1) return { ok: false, reason: 'Must have at least one letter from current Stack' }

  // Compute multiset overlap for bag math
  const { overlap, overlapCounts } = multisetOverlap(state.currentStack, w)

  // Must consume at least 1 tile from the bag (prevents exact replays / 5-overlap)
  const need = counts(w)
  let needSum = 0
  for (const l of Object.keys(need)) {
    need[l] = Math.max(0, need[l] - (overlapCounts[l] || 0))
    needSum += need[l]
  }
  if (needSum < 1) return { ok: false, reason: 'Must use at least one tile from the Bag' }

  // Bag availability
  for (const l of Object.keys(need)) {
    if ((state.bagCounts[l] || 0) < need[l]) {
      return {
        ok: false,
        reason: `Need ${need[l]}×${l} but bag has ${(state.bagCounts[l] || 0)}×`,
      }
    }
  }

  return { ok: true, need, overlap }
}
