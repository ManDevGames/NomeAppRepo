import 'server-only'
import { createAdminClient } from '@/lib/supabase/admin'
import type { LeadRow, PublicResult } from '@/types'

/**
 * Fetches only the fields the result page (and result PDF) actually need —
 * never the full lead row (no email/WhatsApp number reaches either), per the
 * app's privacy requirements. Uses the service-role client since `leads` has
 * no public RLS policies; a not-found/incomplete lead returns null the same
 * as an invalid id, so this doesn't leak which ids exist.
 */
export async function getPublicResult(leadId: string): Promise<PublicResult | null> {
  // Reject anything that isn't a well-formed UUID before it reaches the
  // database — cheap, and avoids a pointless query for junk input.
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  if (!uuidPattern.test(leadId)) return null

  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('leads')
    .select('name, primary_pattern, secondary_pattern, assessment_completed')
    .eq('id', leadId)
    .maybeSingle<Pick<LeadRow, 'name' | 'primary_pattern' | 'secondary_pattern' | 'assessment_completed'>>()

  if (error || !data || !data.assessment_completed || !data.primary_pattern || !data.secondary_pattern) {
    return null
  }

  return {
    name: data.name,
    primaryPattern: data.primary_pattern,
    secondaryPattern: data.secondary_pattern,
  }
}
