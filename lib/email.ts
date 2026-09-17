import 'server-only'
import { Resend } from 'resend'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pattern.mindurmind.org.in'

interface SendResultEmailArgs {
  to: string
  name: string
  leadId: string
  primaryPatternName: string
}

/**
 * Sends the "here's your result" email right after a successful submission.
 * Deliberately silent about configuration: RESEND_API_KEY is optional so the
 * app keeps working (result link still shown/usable in-browser) even before
 * email is set up — the caller in the API route treats this as best-effort
 * and never lets an email failure block the submission response.
 */
export async function sendResultEmail({ to, name, leadId, primaryPatternName }: SendResultEmailArgs) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.warn('sendResultEmail: RESEND_API_KEY not set, skipping email send')
    return
  }

  const from = process.env.RESEND_FROM_EMAIL || 'Relationship Pattern Assessment <onboarding@resend.dev>'
  const resultUrl = `${siteUrl}/assessment/result/${leadId}`

  const resend = new Resend(apiKey)
  const { error } = await resend.emails.send({
    from,
    to,
    subject: 'Your Relationship Pattern result is ready',
    html: renderResultEmailHtml({ name, primaryPatternName, resultUrl }),
  })

  if (error) {
    throw new Error(`Resend error: ${error.message}`)
  }
}

function renderResultEmailHtml({
  name,
  primaryPatternName,
  resultUrl,
}: {
  name: string
  primaryPatternName: string
  resultUrl: string
}) {
  const safeName = escapeHtml(name)
  const safePattern = escapeHtml(primaryPatternName)

  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; color: #332e29;">
      <p style="font-size: 16px; line-height: 1.6;">Hi ${safeName},</p>
      <p style="font-size: 16px; line-height: 1.6;">
        Your Relationship Pattern result is ready. Your primary pattern is
        <strong>${safePattern}</strong>.
      </p>
      <p style="margin: 28px 0;">
        <a
          href="${resultUrl}"
          style="background-color: #b8756a; color: #ffffff; padding: 14px 28px; border-radius: 999px; text-decoration: none; font-weight: 600; display: inline-block;"
        >
          View My Full Result
        </a>
      </p>
      <p style="font-size: 13px; line-height: 1.6; color: #6b6259;">
        This is a self-awareness tool, not a clinical diagnosis. If the button above doesn't work, copy and paste
        this link into your browser:<br />
        <a href="${resultUrl}" style="color: #9c5c52;">${resultUrl}</a>
      </p>
    </div>
  `
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
