import type { PatternCycle as PatternCycleType } from '@/types'

interface PatternCycleProps {
  cycle: PatternCycleType
}

const stages: { key: keyof PatternCycleType; label: string }[] = [
  { key: 'trigger', label: 'Trigger' },
  { key: 'thought', label: 'Thought' },
  { key: 'emotion', label: 'Emotion' },
  { key: 'reaction', label: 'Reaction' },
  { key: 'impact', label: 'Impact' },
  { key: 'repeat', label: 'Repeats' },
]

export function PatternCycle({ cycle }: PatternCycleProps) {
  return (
    <div
      className="flex flex-col gap-0 lg:flex-row lg:items-stretch lg:gap-0"
      role="group"
      aria-label="Your pattern cycle, from trigger through to repeat"
    >
      {stages.map((stage, i) => (
        <div key={stage.key} className="flex flex-col items-stretch lg:flex-1">
          <div className="flex flex-col gap-2 rounded-2xl border border-charcoal-100 bg-cream-50 p-5 shadow-soft h-full animate-fade-in-up">
            <span className="text-xs font-semibold uppercase tracking-wide text-rose-400">{stage.label}</span>
            <p className="text-sm leading-relaxed text-charcoal-700">{cycle[stage.key]}</p>
          </div>
          {i < stages.length - 1 && (
            <div className="flex items-center justify-center py-2 text-charcoal-300 lg:px-2 lg:py-0" aria-hidden="true">
              <span className="lg:hidden text-xl leading-none">↓</span>
              <span className="hidden lg:inline text-xl leading-none">→</span>
            </div>
          )}
        </div>
      ))}
      <p className="mt-4 text-center text-xs text-charcoal-400 lg:mt-3">
        Without a shift, this cycle tends to loop back to the trigger again.
      </p>
    </div>
  )
}
