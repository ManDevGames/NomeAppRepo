interface PatternBreakdownRow {
  name: string
  count: number
}

interface PatternBreakdownChartProps {
  rows: PatternBreakdownRow[]
}

export function PatternBreakdownChart({ rows }: PatternBreakdownChartProps) {
  const max = Math.max(1, ...rows.map((r) => r.count))

  return (
    <div className="rounded-2xl border border-charcoal-100 bg-white p-5 sm:p-6 shadow-soft">
      <h2 className="text-base font-semibold text-charcoal-900">Pattern Breakdown</h2>
      <div className="mt-5 flex flex-col gap-3">
        {rows.map((row) => (
          <div key={row.name} className="grid grid-cols-[1fr_auto] items-center gap-3 sm:grid-cols-[12rem_1fr_auto]">
            <span className="text-sm text-charcoal-700">{row.name}</span>
            <div className="hidden h-3 w-full overflow-hidden rounded-full bg-cream-100 sm:block">
              <div
                className="h-full rounded-full bg-rose-300"
                style={{ width: `${(row.count / max) * 100}%` }}
              />
            </div>
            <span className="text-right text-sm font-medium text-charcoal-900">{row.count}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
