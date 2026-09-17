export function TriggerChip({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center rounded-full bg-blush-100 px-4 py-2 text-sm text-charcoal-700">
      {children}
    </span>
  )
}
