import { SMALL_SET } from './wordlist'

let ALLOWED = new Set<string>(SMALL_SET) // fallback
let BANNED = new Set<string>() // empty by default
let READY = false

export async function loadDictionaries() {
  try {
    const allowedMod = await import('@/assets/allowed5.txt?raw')
    const bannedMod = await import('@/assets/banned5.txt?raw')

    const toLines = (raw: string) =>
      raw
        .split(/\r?\n/)
        .map((s) => s.trim().toUpperCase())
        .filter((s) => /^[A-Z]{5}$/.test(s))

    const allowedLines = toLines((allowedMod as any).default || '')
    const bannedLines = toLines((bannedMod as any).default || '')

    // Use allowed list if it's reasonably big; otherwise keep SMALL_SET
    if (allowedLines.length >= 2000) {
      ALLOWED = new Set(allowedLines)
    } else {
      // Merge whatever lines you have on top of SMALL_SET
      ALLOWED = new Set([...Array.from(SMALL_SET), ...allowedLines])
    }
    BANNED = new Set(bannedLines)
    READY = true
    return { allowed: ALLOWED.size, banned: BANNED.size }
  } catch (e) {
    // Keep fallbacks
    READY = true
    return { allowed: ALLOWED.size, banned: BANNED.size }
  }
}

export function hasWord(w: string) {
  return ALLOWED.has(w.toUpperCase())
}
export function isBanned(w: string) {
  return BANNED.has(w.toUpperCase())
}

// Useful for guards (optional)
export function dictionariesReady() {
  return READY
}
