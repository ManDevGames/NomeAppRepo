'use client'

import { useLanguage } from '@/lib/i18n/LanguageContext'
import { uiText } from '@/lib/i18n/translations'
import { useTheme } from '@/components/providers/ThemeProvider'

export function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, toggleTheme } = useTheme()
  const { language } = useLanguage()
  const copy = uiText[language]

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`inline-flex items-center gap-1.5 rounded-full border border-charcoal-100 bg-cream-50 px-4 py-2 text-sm font-medium text-charcoal-700 shadow-soft transition-colors hover:border-rose-200 hover:bg-blush-50/50 ${className}`}
    >
      <span aria-hidden="true">{theme === 'dark' ? '☀️' : '🌙'}</span>
      {theme === 'dark' ? copy.themeToggleToLight : copy.themeToggleToDark}
    </button>
  )
}
