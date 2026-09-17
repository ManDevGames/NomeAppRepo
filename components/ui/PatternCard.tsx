import type { Pattern } from '@/types'

interface PatternCardProps {
  pattern: Pattern
  variant?: 'primary' | 'secondary'
}

export function PatternCard({ pattern, variant = 'primary' }: PatternCardProps) {
  const isPrimary = variant === 'primary'

  return (
    <div
      className={
        isPrimary
          ? 'rounded-3xl border border-rose-200 bg-rose-50 p-7 sm:p-10'
          : 'rounded-3xl border border-charcoal-100 bg-cream-50 p-6 sm:p-8'
      }
    >
      <span className="eyebrow">{isPrimary ? 'Your Primary Pattern' : 'Your Secondary Pattern'}</span>
      <h2 className={isPrimary ? 'mt-3 text-2xl sm:text-3xl font-semibold text-charcoal-900' : 'mt-3 text-xl font-semibold text-charcoal-900'}>
        {pattern.name}
      </h2>
      <p className="mt-2 font-serif text-lg text-rose-400">{pattern.headline}</p>
      <p className="mt-4 text-sm sm:text-base leading-relaxed text-charcoal-600">{pattern.shortDescription}</p>
    </div>
  )
}
