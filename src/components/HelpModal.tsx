import clsx from 'clsx'

import { Modal } from '@/components/Modal'
import { BAG_SIZE, PERFECT_STACKS } from '@/game/constants'

export function HelpModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal open={open} onClose={onClose} ariaLabel="How to play Stacks">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-token px-4 py-3 bg-surface">
        <h2 className="text-lg font-semibold text-text">How to Play</h2>
        <button
          type="button"
          onClick={onClose}
          className="btn"
          data-variant="outline"
          data-size="sm"
        >
          Close
        </button>
      </header>

      {/* Scrollable content */}
      <div
        className="space-y-5 overflow-y-auto px-4 py-4 text-sm leading-6 text-text"
        style={{ maxHeight: 'calc(88dvh - 56px - env(safe-area-inset-bottom, 0px))' }}
      >
        {/* Step 1 */}
        <Section
          title="1) Start from the Current Stack"
          caption="Make a new 5-letter word underneath the current stack."
        >
          <Diagram
            labelTop="Current Stack"
            top={['T', 'R', 'E', 'A', 'D']}
            topTone="match" /* blue for stack */
            labelBottom="Your word"
            bottom={['B', 'R', 'E', 'A', 'D']}
            match={[false, true, true, false, false]}
            note="Your word must share 1–4 letters in the SAME positions."
          />
        </Section>

        {/* Step 2 */}
        <Section
          title="2) Spend tiles from the Bag"
          caption="Each move must use at least one tile from the bag. Tiles you pick turn muted until you submit."
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
        <ul className="mt-2 grid gap-2 text-[0.95rem] text-text">
          <li>• Tap letters in the Current Stack to use a positional match.</li>
          <li>• Tap green tiles in the Bag to use them.</li>
          <li>• Shuffle reorders the Bag; Undo reverts the last submitted Stack.</li>
          <li>• On mobile, open the keyboard from the footer to type.</li>
        </ul>

        {/* Invalid example */}
        <div className="mt-3 rounded-xl border border-token bg-surface-muted p-3">
          <p className="mb-2 font-medium text-text">Invalid example</p>
          <Diagram
            labelTop="Current Stack"
            top={['Q', 'U', 'E', 'U', 'E']}
            topTone="match"
            labelBottom="Your word"
            bottom={['R', 'E', 'A', 'C', 'T']}
            match={[false, false, false, false, false]}
            note="This is NOT allowed: it shares 0 letters in the same positions."
            invalid
          />
        </div>
      </div>
    </Modal>
  )
}

/* ---------- helpers / mini “infographic” pieces ---------- */

function MiniTile({
  ch,
  tone = 'default',
}: {
  ch: string
  tone?: 'default' | 'match' | 'bag' | 'muted' | 'invalid'
}) {
  const intent =
    tone === 'match' ? 'stack'
      : tone === 'bag' ? 'bag'
      : tone === 'invalid' ? 'error'
      : 'default'
  const isMuted = tone === 'muted'

  return (
    <span
      className="tile"
      data-size="mini"
      data-intent={intent}
      data-muted={isMuted || undefined}
      aria-hidden
      style={{ marginInline: '2px' }}
    >
      {ch}
    </span>
  )
}

function Diagram({
  labelTop,
  top,
  labelBottom,
  bottom,
  match,
  note,
  invalid = false,
  topTone = 'default',
}: {
  labelTop: string
  top: string[]
  labelBottom: string
  bottom: string[]
  match: boolean[]
  note?: string
  invalid?: boolean
  topTone?: 'default' | 'match' | 'bag' | 'muted' | 'invalid'
}) {
  return (
    <div>
      <p className="label-muted mb-1">{labelTop}</p>
      <div className="mb-2">
        {top.map((c, i) => (
          <MiniTile key={`t-${i}`} ch={c} tone={topTone} />
        ))}
      </div>
      <p className="label-muted mb-1">{labelBottom}</p>
      <div className="mb-2">
        {bottom.map((c, i) => (
          <MiniTile
            key={`b-${i}`}
            ch={c}
            tone={invalid ? 'invalid' : match[i] ? 'match' : 'bag'}
          />
        ))}
      </div>
      {note && <p className="text-xs text-muted">{note}</p>}
    </div>
  )
}

function Legend() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="label-muted">Legend:</span>
      <div className="flex items-center gap-2">
        <MiniTile ch="R" tone="match" />
        <span className="text-xs text-muted">position match</span>
      </div>
      <div className="flex items-center gap-2">
        <MiniTile ch="A" tone="bag" />
        <span className="text-xs text-muted">from bag</span>
      </div>
      <div className="flex items-center gap-2">
        <MiniTile ch="E" tone="muted" />
        <span className="text-xs text-muted">in use / spent</span>
      </div>
    </div>
  )
}

function Section({
  title,
  caption,
  children,
}: {
  title: string
  caption?: string
  children?: React.ReactNode
}) {
  return (
    <section>
      <h3 className="font-medium text-text">{title}</h3>
      {caption && <p className="text-muted">{caption}</p>}
      {children}
    </section>
  )
}
