'use client'

import { PatternCard } from '@/components/ui/PatternCard'
import { TriggerChip } from '@/components/ui/TriggerChip'
import { PatternCycle } from '@/components/ui/PatternCycle'
import { WhatsAppCTA } from '@/components/assessment/WhatsAppCTA'
import { LanguageToggle } from '@/components/i18n/LanguageToggle'
import { ThemeToggle } from '@/components/providers/ThemeToggle'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import { uiText } from '@/lib/i18n/translations'
import type { Pattern, PublicResult } from '@/types'

interface ResultViewProps {
  result: PublicResult
  primary: Pattern
  secondary: Pattern
  whatsappUrlEn: string
  whatsappUrlHi: string
  pdfUrlEn: string
  pdfUrlHi: string
}

export function ResultView({
  result,
  primary,
  secondary,
  whatsappUrlEn,
  whatsappUrlHi,
  pdfUrlEn,
  pdfUrlHi,
}: ResultViewProps) {
  const { language } = useLanguage()
  const copy = uiText[language].result
  const isHi = language === 'hi'
  const whatsappUrl = isHi ? whatsappUrlHi : whatsappUrlEn
  const pdfUrl = isHi ? pdfUrlHi : pdfUrlEn

  return (
    <div className="container-app flex flex-col gap-14">
      <div className="mx-auto flex w-full max-w-3xl justify-end gap-3 print:hidden">
        <LanguageToggle />
        <ThemeToggle />
      </div>

      <div className="mx-auto w-full max-w-3xl text-center">
        <span className="eyebrow">{copy.resultOf(result.name)}</span>
        <h1 className="mt-3 text-3xl sm:text-4xl font-semibold text-charcoal-900">{copy.heading}</h1>
      </div>

      <div className="mx-auto flex w-full max-w-3xl flex-col gap-14">
        <PatternCard
          pattern={primary}
          name={isHi ? primary.nameHi : primary.name}
          shortDescription={isHi ? primary.shortDescriptionHi : primary.shortDescription}
          label={copy.primaryLabel}
          variant="primary"
        />
        <PatternCard
          pattern={secondary}
          name={isHi ? secondary.nameHi : secondary.name}
          shortDescription={isHi ? secondary.shortDescriptionHi : secondary.shortDescription}
          label={copy.secondaryLabel}
          variant="secondary"
        />

        <section>
          <h2 className="text-xl sm:text-2xl font-semibold text-charcoal-900">{copy.experienceTitle}</h2>
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {(isHi ? primary.experiencePointsHi : primary.experiencePoints).map((point) => (
              <div key={point} className="rounded-2xl border border-charcoal-100 bg-cream-50 p-4 shadow-soft print:break-inside-avoid">
                <p className="text-sm leading-relaxed text-charcoal-700">{point}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl sm:text-2xl font-semibold text-charcoal-900">{copy.triggersTitle}</h2>
          <div className="mt-5 flex flex-wrap gap-2">
            {(isHi ? primary.triggersHi : primary.triggers).map((trigger) => (
              <TriggerChip key={trigger}>{trigger}</TriggerChip>
            ))}
          </div>
        </section>
      </div>

      {/* Wider than the rest of the page — six cards need more room than the
          reading-width column gives them, see PatternCycle for the fix to
          the layout bug where the trailing note used to squeeze in as a 7th column. */}
      <section className="mx-auto w-full max-w-5xl">
        <h2 className="text-center text-xl sm:text-2xl font-semibold text-charcoal-900">{copy.cycleTitle}</h2>
        <div className="mt-6">
          <PatternCycle
            cycle={isHi ? primary.cycleHi : primary.cycle}
            labels={copy.cycleStages}
            note={copy.cycleNote}
            ariaLabel={copy.cycleTitle}
          />
        </div>
      </section>

      <div className="mx-auto flex w-full max-w-3xl flex-col gap-14">
        <p className="rounded-2xl bg-charcoal-50 p-5 text-center text-sm leading-relaxed text-charcoal-500">
          {copy.disclaimer}
        </p>

        <section className="rounded-3xl border border-charcoal-100 bg-blush-50 p-7 sm:p-10 text-center print:hidden">
          <h2 className="text-xl sm:text-2xl font-semibold text-charcoal-900">{copy.ctaTitle}</h2>
          <p className="mx-auto mt-3 max-w-md text-sm sm:text-base leading-relaxed text-charcoal-600">{copy.ctaBody}</p>
          <div className="mt-7 flex flex-col items-center gap-3">
            <WhatsAppCTA href={whatsappUrl} label={copy.whatsappLabel} />
            <a href={pdfUrl} target="_blank" rel="noreferrer" className="text-sm font-medium text-rose-500 underline underline-offset-2 hover:text-rose-600">
              {copy.downloadPdfLabel}
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
