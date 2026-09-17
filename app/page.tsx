import { SectionHeading } from '@/components/ui/SectionHeading'
import { StartAssessmentButton } from '@/components/StartAssessmentButton'

const discoverPoints = [
  'Your primary relationship pattern',
  'A secondary pattern that may also be at play',
  'Common triggers that tend to set it off',
  'The recurring thought → emotion → reaction cycle behind it',
  'Areas you may want to explore more deeply',
]

const howItWorks = [
  { step: '1', title: 'Answer a few honest questions', description: 'One question at a time — there are no right or wrong answers.' },
  { step: '2', title: 'Enter your details', description: 'So we can save and send you your personalised result.' },
  { step: '3', title: 'Get your personalised pattern', description: 'See your primary and secondary relationship patterns.' },
  { step: '4', title: 'Explore what may be driving the cycle', description: 'Understand the trigger, thought, emotion, and reaction behind it.' },
]

export default function LandingPage() {
  return (
    <main>
      <section className="relative overflow-hidden bg-cream-50">
        <div className="pointer-events-none absolute inset-0 bg-noise opacity-[0.35]" aria-hidden="true" />
        <div className="container-app relative flex flex-col items-center gap-6 py-16 sm:py-24 text-center animate-fade-in-up">
          <span className="eyebrow">Free · 5 minutes · No right or wrong answers</span>
          <h1 className="max-w-3xl text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.1] text-charcoal-900">
            Discover Your Relationship Pattern
          </h1>
          <p className="max-w-xl text-base sm:text-lg leading-relaxed text-charcoal-600">
            Understand the patterns that may be shaping the way you think, feel, and respond in relationships —
            with a free 5-minute assessment.
          </p>
          <div className="pt-2">
            <StartAssessmentButton label="Discover My Pattern" />
          </div>
          <p className="text-xs text-charcoal-400">
            This is a self-awareness tool for reflection — not a clinical diagnosis.
          </p>
        </div>
      </section>

      <section className="section-space bg-cream-100">
        <div className="container-app">
          <SectionHeading eyebrow="What you'll discover" title="What the assessment reflects on" />
          <div className="mx-auto mt-10 max-w-2xl">
            <ul className="flex flex-col gap-3">
              {discoverPoints.map((point) => (
                <li
                  key={point}
                  className="flex items-start gap-3 rounded-2xl border border-charcoal-100 bg-cream-50 p-4 sm:p-5 shadow-soft"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-300" aria-hidden="true" />
                  <span className="text-sm sm:text-base text-charcoal-700">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section-space bg-cream-50">
        <div className="container-app">
          <SectionHeading eyebrow="How it works" title="Four simple steps" />
          <div className="mx-auto mt-10 grid max-w-4xl grid-cols-1 gap-5 sm:grid-cols-2">
            {howItWorks.map((item) => (
              <div key={item.step} className="rounded-2xl border border-charcoal-100 bg-cream-100 p-6">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-100 text-sm font-semibold text-rose-500">
                  {item.step}
                </span>
                <h3 className="mt-3 text-base font-semibold text-charcoal-900">{item.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-charcoal-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-space bg-cream-100">
        <div className="container-app">
          <div className="mx-auto max-w-2xl rounded-3xl border border-charcoal-100 bg-cream-50 p-7 sm:p-10 text-center">
            <h2 className="text-xl sm:text-2xl font-semibold text-charcoal-900">A note before you begin</h2>
            <p className="mt-4 text-sm sm:text-base leading-relaxed text-charcoal-600">
              This assessment is a self-awareness and self-reflection tool. It is designed to help you notice
              possible patterns in how you relate to others — it is not a clinical or medical diagnosis, and it
              doesn&rsquo;t label or define you. Your result is a starting point for reflection, not a conclusion.
            </p>
            <div className="mt-8">
              <StartAssessmentButton label="Discover My Pattern" size="md" />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
