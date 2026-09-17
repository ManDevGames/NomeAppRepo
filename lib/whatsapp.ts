import 'server-only'

/**
 * Builds a `wa.me` deep link pre-filled with a message naming the user's
 * primary pattern. Reads `WHATSAPP_BUSINESS_NUMBER` from the server
 * environment (intentionally NOT prefixed with NEXT_PUBLIC_), so this must
 * only be called from server-side code (Server Components, Route Handlers)
 * — never imported into a `"use client"` file. The result page computes the
 * href server-side and passes it as a prop to the small client component
 * that renders the actual link.
 */
export function buildWhatsAppUrl(primaryPatternName: string): string {
  const number = process.env.WHATSAPP_BUSINESS_NUMBER
  if (!number) {
    throw new Error('WHATSAPP_BUSINESS_NUMBER environment variable is not set.')
  }

  const message = `Hi, I just completed my Relationship Pattern Assessment. My result is: ${primaryPatternName}. I'd like to know more.`

  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`
}
