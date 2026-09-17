import type { PatternCycle as PatternCycleType } from '@/types'

interface StageLabels {
  trigger: string
  thought: string
  emotion: string
  reaction: string
  impact: string
  repeat: string
}

interface PatternCycleProps {
  cycle: PatternCycleType
  labels: StageLabels
  note: string
  ariaLabel: string
}

const stageKeys: (keyof PatternCycleType)[] = ['trigger', 'thought', 'emotion', 'reaction', 'impact', 'repeat']

export function PatternCycle({ cycle, labels, note, ariaLabel }: PatternCycleProps) {
  return (
    <div>
      <div className="flex flex-col gap-3 xl:flex-row xl:items-stretch xl:gap-0" role="group" aria-label={ariaLabel}>
        {stageKeys.map((key, i) => {
          const isLast = i === stageKeys.length - 1
          return (
            <div key={key} className="flex flex-col items-stretch xl:flex-1">
              <div
                className={`flex h-full flex-col gap-3 rounded-2xl border p-6 shadow-soft transition-shadow duration-200 hover:shadow-card ${
                  isLast ? 'border-rose-200 bg-rose-50' : 'border-charcoal-100 bg-cream-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                      isLast ? 'bg-rose-200 text-rose-500' : 'bg-rose-100 text-rose-500'
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-wide text-rose-400 sm:text-sm">
                    {labels[key]}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-charcoal-700 sm:text-base">{cycle[key]}</p>
              </div>
              {!isLast && (
                <div
                  className="flex items-center justify-center py-1 text-rose-300 xl:px-1 xl:py-0"
                  aria-hidden="true"
                >
                  <span className="xl:hidden text-2xl leading-none">↓</span>
                  <span className="hidden xl:inline text-2xl leading-none">→</span>
                </div>
              )}
            </div>
          )
        })}
      </div>
      <p className="mx-auto mt-5 flex max-w-md items-center justify-center gap-2 rounded-full bg-charcoal-50 px-5 py-2.5 text-center text-xs text-charcoal-500 sm:text-sm xl:mt-4">
        <span aria-hidden="true" className="text-rose-400">
          ↻
        </span>
        {note}
      </p>
    </div>
  )
}
