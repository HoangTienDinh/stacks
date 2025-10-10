import { counts } from './counts';
import { hasWord, isBanned } from './dictionary';

import type { GameState } from './models';

export type Validation =
  | { ok: true; need: Record<string, number>; overlap: number }
  | { ok: false; code: ValidationCode; message: string };

export type ValidationCode =
  | 'not-5-letters'
  | 'not-in-dictionary'
  | 'banned-word'
  | 'bad-overlap'
  | 'insufficient-bag';

export const REASONS: Record<ValidationCode, string> = {
  'not-5-letters':     'Word must be 5 letters (A–Z)',
  'not-in-dictionary': 'Not in dictionary',
  'banned-word':       'That word isn’t allowed',
  'bad-overlap':       'Must share 1–4 letters in the same positions',
  'insufficient-bag':  'Not enough letters left in the bag',
};

/**
 * Rules:
 *  - 5 letters A–Z
 *  - must be in allowed list (and not banned)
 *  - positional overlap = 1..4 with current stack
 *  - need[] = letter multiset minus positional matches; bag must have enough
 */
export function validateMove(state: GameState, candidate: string): Validation {
  const w = candidate.toUpperCase();

  if (!/^[A-Z]{5}$/.test(w)) {
    return { ok: false, code: 'not-5-letters', message: REASONS['not-5-letters'] };
  }
  if (!hasWord(w)) {
    return { ok: false, code: 'not-in-dictionary', message: REASONS['not-in-dictionary'] };
  }
  if (isBanned(w)) {
    return { ok: false, code: 'banned-word', message: REASONS['banned-word'] };
  }

  // Positional overlap (exact index matches)
  let overlap = 0;
  const overlapCounts: Record<string, number> = {};
  for (let i = 0; i < 5; i++) {
    const cs = state.currentStack[i];
    const cw = w[i];
    if (cs === cw) {
      overlap++;
      overlapCounts[cw] = (overlapCounts[cw] || 0) + 1;
    }
  }

  if (overlap < 1 || overlap > 4) {
    return { ok: false, code: 'bad-overlap', message: REASONS['bad-overlap'] };
  }

  // Letters needed from the bag = total counts minus positional matches
  const need = counts(w);
  for (const l of Object.keys(need)) {
    need[l] = Math.max(0, need[l] - (overlapCounts[l] || 0));
  }

  // Verify bag availability
  for (const l of Object.keys(need)) {
    const have = state.bagCounts[l] || 0;
    if (have < need[l]) {
      return { ok: false, code: 'insufficient-bag', message: REASONS['insufficient-bag'] };
    }
  }

  return { ok: true, need, overlap };
}
