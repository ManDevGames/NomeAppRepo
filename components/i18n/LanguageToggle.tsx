'use client'

import { useLanguage } from '@/lib/i18n/LanguageContext'
import { uiText } from '@/lib/i18n/translations'

export function LanguageToggle({ className = '' }: { className?: string }) {
  const { language, toggleLanguage } = useLanguage()

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      aria-label={language === 'en' ? 'Switch to Hindi' : 'Switch to English'}
      className={`inline-flex items-center gap-1.5 rounded-full border border-charcoal-100 bg-cream-50 px-4 py-2 text-sm font-medium text-charcoal-700 shadow-soft transition-colors hover:border-rose-200 hover:bg-blush-50/50 ${className}`}
    >
      <span aria-hidden="true">🌐</span>
      {uiText[language].languageToggle}
    </button>
  )
}
