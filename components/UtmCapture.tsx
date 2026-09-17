'use client'

import { useEffect } from 'react'
import { captureUtm } from '@/lib/utm'

/**
 * Fires once per page load to capture utm_source/medium/campaign from the
 * URL into sessionStorage. Mounted in the root layout so it runs no matter
 * which page a visitor lands on first (the landing page in the common
 * case, but a shared /assessment link works too). `captureUtm` itself is
 * idempotent within a session — first-touch attribution is never
 * overwritten by a later, UTM-less navigation.
 */
export function UtmCapture() {
  useEffect(() => {
    captureUtm()
  }, [])

  return null
}
