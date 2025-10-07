import clsx from 'clsx'
import { BAG_SIZE, PERFECT_STACKS } from '@/game/constants'

export function HelpModal({
  open, onClose,
}: { open: boolean; onClose: () => void }) {
  if (!open) return null

  return (
    <div role="dialog" aria-modal="true" aria-label="How to play Stacks" className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      {/* Center the card vertically & horizontally; add padding for small screens */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        {/* Card: constrain width + height; overflow scrolls inside the card */}
        <div
          className="w-[min(92vw,560px)] rounded-2xl bg-white shadow-2xl border overflow-hidden"
          style={{
            // Use dynamic viewport height; keep some breathing room
            maxHeight: 'calc(88dvh - env(safe-area-inset-bottom, 0px))',
          }}
        >
          {/* Header stays visible; body scrolls */}
          <header className="flex items-center justify-between px-4 py-3 border-b">
            <h2 className="text-lg font-semibold">How to Play</h2>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border px-2 py-1 text-sm hover:bg-gray-50"
            >
              Close
            </button>
          </header>

          {/* Scrollable content */}
          <div
            className="px-4 py-4 space-y-5 text-sm leading-6 text-gray-700 overflow-y-auto"
            style={{ maxHeight: 'calc(88dvh - 56px - env(safe-area-inset-bottom, 0px))' }}
          >
            {/* Step 1 */}
            <Section
              title="1) Start from the Current Stack"
              caption="Make a new 5-letter word underneath the current stack."
            >
              <Diagram
                labelTop="Current Stack"
                top={['T','R','E','A','D']}
                labelBottom="Your word"
                bottom={['B','R','E','A','D']}
                match={[false,true,true,false,false]}
                note="Your word must share 1–4 letters in the SAME positions."
              />
            </Section>

            {/* Step 2 */}
            <Section
              title="2) Spend tiles from the Bag"
              caption="Each move must use at least one tile from the bag. Tiles you pick turn gray until you submit."
            >
              <Legend />
            </Section>

            {/* Step 3 */}
            <Section
              title="3) Finish when the Bag is empty"
              caption={
                `Use ALL ${BAG_SIZE} tiles in the bag. A perfect game finishes in ${PERFECT_STACKS} Stacks. ` +
                `Your score is how many Stacks it took (e.g., “${PERFECT_STACKS} Stacks”).`
              }
            />

            {/* Quick tips */}
            <ul className="mt-2 grid gap-2 text-[0.95rem]">
              <li>• Tap letters in the Current Stack to use a positional match.</li>
              <li>• Tap green tiles in the Bag to use them.</li>
              <li>• Shuffle reorders the Bag; Undo reverts the last submitted Stack.</li>
              <li>• On mobile, open the keyboard from the footer to type.</li>
            </ul>

            {/* Invalid example */}
            <div className="mt-3 rounded-xl border bg-gray-50 p-3">
              <p className="font-medium mb-2">Invalid example</p>
              <Diagram
                labelTop="Current Stack"
                top={['Q','U','E','U','E']}
                labelBottom="Your word"
                bottom={['R','E','A','C','T']}
                match={[false,false,false,false,false]}
                note="This is NOT allowed: it shares 0 letters in the same positions."
                invalid
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ---------- helpers / mini “infographic” pieces ---------- */

function MiniTile({
  ch, tone='default',
}: { ch: string; tone?: 'default'|'match'|'bag'|'muted'|'invalid' }) {
  const cls = clsx(
    'inline-flex h-8 w-8 items-center justify-center rounded-lg border text-base font-semibold mx-0.5',
    tone === 'match'  && 'bg-cyan-50 border-cyan-300',
    tone === 'bag'    && 'bg-emerald-50 border-emerald-300',
    tone === 'muted'  && 'bg-gray-50 border-gray-200 text-gray-400',
    tone === 'invalid'&& 'bg-red-50 border-red-300',
    tone === 'default'&& 'bg-white border-gray-300'
  )
  return <span className={cls}>{ch}</span>
}

function Diagram({
  labelTop, top, labelBottom, bottom, match, note, invalid=false,
}: {
  labelTop: string
  top: string[]
  labelBottom: string
  bottom: string[]
  match: boolean[]
  note?: string
  invalid?: boolean
}) {
  return (
    <div>
      <p className="text-xs text-gray-500 mb-1">{labelTop}</p>
      <div className="mb-2">
        {top.map((c, i) => <MiniTile key={`t-${i}`} ch={c} tone="default" />)}
      </div>
      <p className="text-xs text-gray-500 mb-1">{labelBottom}</p>
      <div className="mb-2">
        {bottom.map((c, i) => (
          <MiniTile
            key={`b-${i}`}
            ch={c}
            tone={invalid ? 'invalid' : (match[i] ? 'match' : 'bag')}
          />
        ))}
      </div>
      {note && <p className="text-xs text-gray-600">{note}</p>}
    </div>
  )
}

function Legend() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-xs text-gray-500">Legend:</span>
      <div className="flex items-center gap-2">
        <MiniTile ch="R" tone="match" />
        <span className="text-xs text-gray-600">position match</span>
      </div>
      <div className="flex items-center gap-2">
        <MiniTile ch="A" tone="bag" />
        <span className="text-xs text-gray-600">from bag</span>
      </div>
      <div className="flex items-center gap-2">
        <MiniTile ch="E" tone="muted" />
        <span className="text-xs text-gray-600">in use / spent</span>
      </div>
    </div>
  )
}

function Section({
  title, caption, children,
}: { title: string; caption?: string; children?: React.ReactNode }) {
  return (
    <section>
      <h3 className="font-medium">{title}</h3>
      {caption && <p className="text-gray-600">{caption}</p>}
      {children}
    </section>
  )
}
