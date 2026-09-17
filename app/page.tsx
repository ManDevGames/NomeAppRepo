'use client'

import { SectionHeading } from '@/components/ui/SectionHeading'
import { StartAssessmentButton } from '@/components/StartAssessmentButton'
import { LanguageToggle } from '@/components/i18n/LanguageToggle'
import { ThemeToggle } from '@/components/providers/ThemeToggle'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import { uiText } from '@/lib/i18n/translations'

export default function LandingPage() {
  const { language } = useLanguage()
  const copy = uiText[language].home

  return (
    <main>
      <section className="relative overflow-hidden bg-cream-50">
        <div className="pointer-events-none absolute inset-0 bg-noise opacity-[0.35]" aria-hidden="true" />
        <div className="container-app relative flex justify-end gap-3 pt-6">
          <LanguageToggle />
          <ThemeToggle />
        </div>
        <div className="container-app relative flex flex-col items-center gap-6 py-12 sm:py-20 text-center animate-fade-in-up">
          <span className="eyebrow">{copy.eyebrow}</span>
          <h1 className="max-w-3xl text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.1] text-charcoal-900">
            {copy.heading}
          </h1>
          <p className="max-w-xl text-base sm:text-lg leading-relaxed text-charcoal-600">{copy.subheading}</p>
          <div className="pt-2">
            <StartAssessmentButton label={copy.ctaLabel} />
          </div>
          <p className="text-xs text-charcoal-400">{copy.disclaimer}</p>
        </div>
      </section>

      <section className="section-space bg-cream-100">
        <div className="container-app">
          <SectionHeading eyebrow={copy.discoverEyebrow} title={copy.discoverTitle} />
          <div className="mx-auto mt-10 max-w-2xl">
            <ul className="flex flex-col gap-3">
              {copy.discoverPoints.map((point) => (
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
          <SectionHeading eyebrow={copy.howEyebrow} title={copy.howTitle} />
          <div className="mx-auto mt-10 grid max-w-4xl grid-cols-1 gap-5 sm:grid-cols-2">
            {copy.howItWorks.map((item) => (
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
            <h2 className="text-xl sm:text-2xl font-semibold text-charcoal-900">{copy.noteTitle}</h2>
            <p className="mt-4 text-sm sm:text-base leading-relaxed text-charcoal-600">{copy.noteBody}</p>
            <div className="mt-8">
              <StartAssessmentButton label={copy.ctaLabel} size="md" />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
