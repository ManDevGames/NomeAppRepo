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
        {stageKeys.map((key, i) => (
          <div key={key} className="flex flex-col items-stretch xl:flex-1">
            <div className="flex flex-col gap-2.5 rounded-2xl border border-charcoal-100 bg-cream-50 p-6 shadow-soft h-full animate-fade-in-up">
              <span className="text-xs font-semibold uppercase tracking-wide text-rose-400 sm:text-sm">
                {labels[key]}
              </span>
              <p className="text-sm leading-relaxed text-charcoal-700 sm:text-base">{cycle[key]}</p>
            </div>
            {i < stageKeys.length - 1 && (
              <div className="flex items-center justify-center py-1 text-charcoal-300 xl:px-2 xl:py-0" aria-hidden="true">
                <span className="xl:hidden text-xl leading-none">↓</span>
                <span className="hidden xl:inline text-xl leading-none">→</span>
              </div>
            )}
          </div>
        ))}
      </div>
      <p className="mt-4 text-center text-xs text-charcoal-400 sm:text-sm xl:mt-3">{note}</p>
    </div>
  )
}
