/**
 * Build src/assets/allowed5.txt from multiple sources, with fallbacks.
 * Run: node ./scripts/fetch-allowed.mjs
 * Requires: Node 18+ (global fetch)
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const OUT_PATH        = path.resolve(__dirname, '../src/assets/allowed5.txt')
const BANNED_PATH     = path.resolve(__dirname, '../src/assets/banned5.txt')
const LOCAL_FALLBACKS = [
  path.resolve(__dirname, '../src/assets/allowed5-starter.txt'), // optional
]

/** Stable sources */
const SOURCES = [
  // Wordle potential guesses (many non-answers too)
  'https://raw.githubusercontent.com/tabatkins/wordle-list/main/words',
  // Big English list; we will filter to 5 letters A–Z
  'https://raw.githubusercontent.com/dwyl/english-words/master/words_alpha.txt',
]

const onlyFiveAZ = s => /^[A-Z]{5}$/.test(s)
const up = s => s.trim().toUpperCase()

async function fetchText(url) {
  const res = await fetch(url, { cache: 'no-store' })
  if (!res.ok) throw new Error(`Fetch failed ${res.status} for ${url}`)
  return await res.text()
}

async function readIfExists(p) {
  try { return await fs.readFile(p, 'utf8') } catch { return '' }
}

async function main() {
  console.log('Fetching 5-letter lists…')
  const pool = new Set()

  // 1) Remote sources (best-effort)
  for (const url of SOURCES) {
    try {
      const txt = await fetchText(url)
      let add = 0
      for (const line of txt.split(/\r?\n/)) {
        const w = up(line)
        if (onlyFiveAZ(w)) { pool.add(w); add++ }
      }
      console.log(`✔ Fetched ${url} (+${add})`)
    } catch (e) {
      console.warn(`⚠ Skipping ${url}: ${e.message}`)
    }
  }

  // 2) Local fallbacks (optional)
  for (const p of LOCAL_FALLBACKS) {
    const txt = await readIfExists(p)
    if (!txt) continue
    let add = 0
    for (const line of txt.split(/\r?\n/)) {
      const w = up(line)
      if (onlyFiveAZ(w)) { pool.add(w); add++ }
    }
    console.log(`✔ Merged local fallback ${path.basename(p)} (+${add})`)
  }

  // 3) Subtract banned
  const bannedTxt = await readIfExists(BANNED_PATH)
  if (bannedTxt) {
    let sub = 0
    for (const line of bannedTxt.split(/\r?\n/)) {
      const w = up(line)
      if (onlyFiveAZ(w) && pool.delete(w)) sub++
    }
    console.log(`✔ Subtracted banned list (-${sub})`)
  } else {
    console.log('ℹ No banned5.txt found; skipping subtraction')
  }

  const words = Array.from(pool).sort()
  if (words.length < 3000) {
    console.warn(`⚠ Result size is small (${words.length}). Consider adding another source or a bigger local fallback.`)
  }

  await fs.mkdir(path.dirname(OUT_PATH), { recursive: true })
  await fs.writeFile(OUT_PATH, words.join('\n') + '\n', 'utf8')
  console.log(`✅ Wrote ${OUT_PATH} (${words.length} words)`)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
