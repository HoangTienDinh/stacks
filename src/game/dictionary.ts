let ALLOWED = new Set<string>();
let BANNED = new Set<string>();
let READY = false;

// Tiny in-file fallback so local dev never breaks if assets aren’t present.
const DEV_FALLBACK = [
  'QUEUE', 'BRACE', 'CRACK', 'STACK', 'SHORT', 'SHARE', 'START', 'SMART',
  'STONE', 'STORK', 'STAND', 'CRANE', 'CRANK', 'TRACE', 'ABOUT', 'OTHER',
  'WHICH', 'THEIR', 'THERE', 'WORDS', 'SMILE', 'ROAST', 'ALTER', 'CRATE',
  'REACT', 'ROUND', 'SOUND', 'BOUND', 'BRICK', 'CLICK', 'CLOCK', 'SHOCK',
  'SHACK', 'TRACK',
];

function toLines(raw: string): string[] {
  return raw
    .split(/\r?\n/)
    .map((s) => s.trim().toUpperCase())
    .filter((s) => /^[A-Z]{5}$/.test(s));
}

export async function loadDictionaries() {
  if (READY) return { allowed: ALLOWED.size, banned: BANNED.size };

  try {
    // Vite ?raw imports — these must exist in src/assets/ (project root alias @/assets/)
    const allowedMod = await import('@/assets/allowed5.txt?raw');
    const bannedMod  = await import('@/assets/banned5.txt?raw');

    const allowedLines = toLines((allowedMod as { default: string }).default || '');
    const bannedLines  = toLines((bannedMod  as { default: string }).default || '');

    // If allowed file is present but short (e.g., during dev), merge with the fallback.
    ALLOWED = allowedLines.length > 0
      ? new Set(allowedLines)
      : new Set(DEV_FALLBACK);

    BANNED = new Set(bannedLines);
    READY = true;
    return { allowed: ALLOWED.size, banned: BANNED.size };
  } catch (err) {
    // Assets missing? Stay functional for local dev.
    console.warn('[dictionary] using dev fallback (assets missing):', err);
    ALLOWED = new Set(DEV_FALLBACK);
    BANNED = new Set();
    READY = true;
    return { allowed: ALLOWED.size, banned: BANNED.size };
  }
}

export function dictionariesReady() {
  return READY;
}

export function hasWord(w: string) {
  return ALLOWED.has(w.toUpperCase());
}
export function isBanned(w: string) {
  return BANNED.has(w.toUpperCase());
}
