export const counts = (s: string): Record<string, number> => {
  const m: Record<string, number> = {}
  for (const ch of s.toUpperCase()) m[ch] = (m[ch] || 0) + 1
  return m
}

export const multisetOverlap = (
  a: string,
  b: string
): { overlap: number; overlapCounts: Record<string, number> } => {
  const ca = counts(a)
  const cb = counts(b)
  let overlap = 0
  const oc: Record<string, number> = {}
  for (const l of Object.keys(cb)) {
    const v = Math.min(cb[l] || 0, ca[l] || 0)
    if (v > 0) {
      oc[l] = v
      overlap += v
    }
  }
  return { overlap, overlapCounts: oc }
}
