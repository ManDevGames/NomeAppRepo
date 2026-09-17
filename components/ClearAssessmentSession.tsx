'use client'

import { useEffect } from 'react'

const STORAGE_KEY = 'rpa:assessment-state'

/**
 * Clears the in-progress assessment's sessionStorage once the user has
 * actually reached their result — this is the right moment to reset it
 * (rather than at submit time), so there's no race with the lead-details
 * page's "redirect back to /assessment if incomplete" guard.
 */
export function ClearAssessmentSession() {
  useEffect(() => {
    try {
      sessionStorage.removeItem(STORAGE_KEY)
    } catch {
      // ignore
    }
  }, [])

  return null
}
