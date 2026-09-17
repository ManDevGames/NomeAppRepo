import 'server-only'

interface BuildWhatsAppUrlArgs {
  primaryPatternName: string
  pdfUrl: string
  language: 'en' | 'hi'
}

/**
 * Builds a `wa.me` deep link pre-filled with a message naming the user's
 * primary pattern and linking to their result PDF (`GET
 * /api/result-pdf/[leadId]`). WhatsApp's `wa.me` links can only pre-fill
 * message *text* — there's no way to auto-attach a file to the chat — so the
 * PDF is shared as a link in that text instead. Reads
 * `WHATSAPP_BUSINESS_NUMBER` from the server environment (intentionally NOT
 * prefixed with NEXT_PUBLIC_), so this must only be called from server-side
 * code (Server Components, Route Handlers) — never imported into a "use
 * client" file. The result page computes the href server-side and passes it
 * as a prop to the small client component that renders the actual link.
 */
export function buildWhatsAppUrl({ primaryPatternName, pdfUrl, language }: BuildWhatsAppUrlArgs): string {
  const number = process.env.WHATSAPP_BUSINESS_NUMBER
  if (!number) {
    throw new Error('WHATSAPP_BUSINESS_NUMBER environment variable is not set.')
  }

  const message =
    language === 'hi'
      ? `नमस्ते, मैंने अभी अपना रिश्ते का पैटर्न आकलन पूरा किया है। मेरा परिणाम है: ${primaryPatternName}। मैं इस बारे में और जानना चाहता/चाहती हूं।\n\nमेरा पूरा परिणाम (PDF): ${pdfUrl}`
      : `Hi, I just completed my Relationship Pattern Assessment. My result is: ${primaryPatternName}. I'd like to know more.\n\nMy full result (PDF): ${pdfUrl}`

  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`
}
