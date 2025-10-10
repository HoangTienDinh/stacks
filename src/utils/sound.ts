let ctx: AudioContext | null = null

// Helper to get a constructor that works on Safari (webkitAudioContext)
function audioContextCtor(): typeof AudioContext | null {
  const w = window as unknown as { webkitAudioContext?: typeof AudioContext }
  return window.AudioContext ?? w.webkitAudioContext ?? null
}

export function playErrorTone() {
  try {
    const Ctor = audioContextCtor()
    if (!Ctor) return
    ctx = ctx ?? new Ctor()
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.type = 'sine'
    o.frequency.value = 440 // gentle beep
    g.gain.value = 0.0001
    o.connect(g)
    g.connect(ctx.destination)

    const t = ctx.currentTime
    g.gain.exponentialRampToValueAtTime(0.04, t + 0.01)
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.16)

    o.start(t)
    o.stop(t + 0.17)
  } catch (e) {
    // ignore if audio init blocked
    console.error(e)
    return
  }
}

export function vibrate(ms = 18) {
  try {
    navigator.vibrate?.(ms)
  } catch (e) {
    console.error(e)
    return
  }
}

export function signalError() {
  vibrate(20)
  playErrorTone()
}

function ac() {
  if (ctx) return ctx
  const Ctor = audioContextCtor()
  if (!Ctor) return (ctx = null)
  ctx = new Ctor()
  return ctx
}

function beep(freq: number, dur = 0.08, gain = 0.04) {
  const a = ac()
  if (!a) return
  const o = a.createOscillator()
  const g = a.createGain()
  o.frequency.value = freq
  o.type = 'sine'
  g.gain.value = gain
  o.connect(g).connect(a.destination)
  o.start()
  o.stop(a.currentTime + dur)
}

export function signalBag() {
  beep(520, 0.06, 0.04)
}

export function signalSnap() {
  beep(680, 0.05, 0.04)
  if (navigator.vibrate) navigator.vibrate(8)
}
