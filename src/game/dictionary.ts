
import { SMALL_SET } from './wordlist'

let WORD_SET: Set<string> = new Set(SMALL_SET)

export async function loadFullDictionary() {
  try {
    const mod = await import('@/assets/words5.txt?raw')
    const txt: string = (mod as any).default
    const lines = txt.split(/\r?\n/).map(s => s.trim().toUpperCase()).filter(Boolean)
    if (lines.length > 100) {
      WORD_SET = new Set(lines)
    } else {
      WORD_SET = new Set(lines.concat(Array.from(SMALL_SET)))
    }
  } catch {}
}

export const hasWord = (w: string) => WORD_SET.has(w.toUpperCase())
