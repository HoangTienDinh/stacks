
export function Toast({ message }: { message: string }) {
  return (
    <div className="fixed left-1/2 -translate-x-1/2 bottom-28 z-50">
      <div className="rounded-xl bg-gray-900 text-white px-4 py-2 text-sm shadow-lg">{message}</div>
    </div>
  )
}
