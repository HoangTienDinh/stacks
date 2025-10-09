export function Toast({ message }: { message: string }) {
  return (
    <div className="fixed bottom-28 left-1/2 z-50 -translate-x-1/2">
      <div className="rounded-xl bg-gray-900 px-4 py-2 text-sm text-white shadow-lg">{message}</div>
    </div>
  )
}
