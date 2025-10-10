export function Toast({ message }: { message: string }) {
  return (
    <div className="fixed bottom-28 left-1/2 z-50 -translate-x-1/2 w-[min(92vw,240px)] px-2">
      <div className="toast w-full" data-tone="danger" role="status" aria-live="polite">
        {message}
      </div>
    </div>
  )
}
