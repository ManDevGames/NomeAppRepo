import type { UtmParams } from '@/types'

const STORAGE_KEY = 'rpa:utm'

const EMPTY_UTM: UtmParams = {
  utm_source: null,
  utm_medium: null,
  utm_campaign: null,
}

function readSearchParams(search: string): UtmParams {
  const params = new URLSearchParams(search)
  return {
    utm_source: params.get('utm_source'),
    utm_medium: params.get('utm_medium'),
    utm_campaign: params.get('utm_campaign'),
  }
}

function hasAnyValue(utm: UtmParams): boolean {
  return Boolean(utm.utm_source || utm.utm_medium || utm.utm_campaign)
}

/**
 * Captures UTM params from the current URL on first landing and persists
 * them to sessionStorage for the rest of the assessment flow. Deliberately
 * first-touch: if attribution is already stored, later visits within the
 * same session (e.g. a stray UTM-less internal link) never overwrite it.
 * Safe to call on every page — it only ever writes once per session.
 */
export function captureUtm(): void {
  if (typeof window === 'undefined') return

  try {
    if (sessionStorage.getItem(STORAGE_KEY)) return

    const fromUrl = readSearchParams(window.location.search)
    if (hasAnyValue(fromUrl)) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(fromUrl))
    }
  } catch {
    // sessionStorage unavailable (private browsing, etc.) — attribution is
    // simply not captured for this session.
  }
}

export function getStoredUtm(): UtmParams {
  if (typeof window === 'undefined') return EMPTY_UTM

  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as UtmParams) : EMPTY_UTM
  } catch {
    return EMPTY_UTM
  }
}

const UTM_MAX_LENGTH = 100

/**
 * Server-side UTM sanitizer for /api/submit-assessment: coerces each field
 * to either a trimmed, length-capped string or null. A tampered request
 * could otherwise send non-string values (which the `text` columns/params
 * would reject with a DB error) or unreasonably long strings.
 */
export function sanitizeUtm(input: unknown): UtmParams {
  const source = (input ?? {}) as Partial<Record<keyof UtmParams, unknown>>

  const clean = (value: unknown): string | null => {
    if (typeof value !== 'string') return null
    const trimmed = value.trim()
    return trimmed ? trimmed.slice(0, UTM_MAX_LENGTH) : null
  }

  return {
    utm_source: clean(source.utm_source),
    utm_medium: clean(source.utm_medium),
    utm_campaign: clean(source.utm_campaign),
  }
}
