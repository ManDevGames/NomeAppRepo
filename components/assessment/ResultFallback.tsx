'use client'

import Link from 'next/link'
import { LanguageToggle } from '@/components/i18n/LanguageToggle'
import { ThemeToggle } from '@/components/providers/ThemeToggle'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import { uiText } from '@/lib/i18n/translations'

interface ResultFallbackProps {
  variant: 'notFound' | 'error'
}

export function ResultFallback({ variant }: ResultFallbackProps) {
  const { language } = useLanguage()
  const copy = uiText[language].result

  return (
    <div className="container-app max-w-lg text-center">
      <div className="mb-8 flex justify-end gap-3">
        <LanguageToggle />
        <ThemeToggle />
      </div>
      <h1 className="text-2xl sm:text-3xl font-semibold text-charcoal-900">
        {variant === 'notFound' ? copy.notFoundTitle : copy.errorTitle}
      </h1>
      <p className="mt-4 text-sm sm:text-base text-charcoal-600">
        {variant === 'notFound' ? copy.notFoundBody : copy.errorBody}
      </p>
      {variant === 'notFound' && (
        <Link
          href="/assessment"
          className="mt-8 inline-flex items-center justify-center rounded-full bg-rose-400 px-6 py-3 text-sm font-medium text-white hover:bg-rose-500"
        >
          {copy.retakeLabel}
        </Link>
      )}
    </div>
  )
}
