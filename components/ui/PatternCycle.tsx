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
      <div className="flex flex-col gap-0 lg:flex-row lg:items-stretch lg:gap-0" role="group" aria-label={ariaLabel}>
        {stageKeys.map((key, i) => (
          <div key={key} className="flex flex-col items-stretch lg:flex-1">
            <div className="flex flex-col gap-2 rounded-2xl border border-charcoal-100 bg-cream-50 p-5 shadow-soft h-full animate-fade-in-up">
              <span className="text-xs font-semibold uppercase tracking-wide text-rose-400">{labels[key]}</span>
              <p className="text-sm leading-relaxed text-charcoal-700">{cycle[key]}</p>
            </div>
            {i < stageKeys.length - 1 && (
              <div className="flex items-center justify-center py-2 text-charcoal-300 lg:px-2 lg:py-0" aria-hidden="true">
                <span className="lg:hidden text-xl leading-none">↓</span>
                <span className="hidden lg:inline text-xl leading-none">→</span>
              </div>
            )}
          </div>
        ))}
      </div>
      <p className="mt-4 text-center text-xs text-charcoal-400 lg:mt-3">{note}</p>
    </div>
  )
}
