interface ProgressBarProps {
  current: number
  total: number
  label?: string
}

export function ProgressBar({ current, total, label }: ProgressBarProps) {
  const percent = Math.round((current / total) * 100)

  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between text-xs sm:text-sm text-charcoal-500">
        <span>{label ?? `Question ${current} of ${total}`}</span>
        <span>{percent}%</span>
      </div>
      <div
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Assessment progress"
        className="h-2 w-full overflow-hidden rounded-full bg-charcoal-100"
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-rose-300 to-sage-300 transition-all duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}
