'use client'

import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'

export type Language = 'en' | 'hi'

const STORAGE_KEY = 'rpa:lang'

interface LanguageContextValue {
  language: Language
  toggleLanguage: () => void
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined)

/**
 * Language always renders 'en' on the server and the first client paint, then
 * switches to a stored preference in a useEffect — same hydration-safe
 * pattern as useAssessmentState's `hydrated` flag, just without needing to
 * expose the flag since a one-frame language flip isn't visually jarring.
 *
 * A `?lang=hi`/`?lang=en` URL param takes priority over the stored
 * preference (and isn't persisted) — this is what lets the result PDF route
 * (app/api/result-pdf/[leadId]/route.ts) deep-link a headless browser
 * straight to the Hindi render of the result page.
 */
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en')

  useEffect(() => {
    const urlLang = new URLSearchParams(window.location.search).get('lang')
    if (urlLang === 'en' || urlLang === 'hi') {
      setLanguage(urlLang)
      return
    }
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored === 'en' || stored === 'hi') setLanguage(stored)
    } catch {
      // localStorage unavailable — fall back to the 'en' default.
    }
  }, [])

  // Keeps <html lang> in sync so the html[lang='hi'] font rule in
  // globals.css (Devanagari-capable fonts) applies whenever Hindi is active.
  useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  const toggleLanguage = useCallback(() => {
    setLanguage((prev) => {
      const next: Language = prev === 'en' ? 'hi' : 'en'
      try {
        localStorage.setItem(STORAGE_KEY, next)
      } catch {
        // ignore
      }
      return next
    })
  }, [])

  return <LanguageContext.Provider value={{ language, toggleLanguage }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within a LanguageProvider')
  return ctx
}
