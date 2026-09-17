import { NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase/admin'
import { toCsv } from '@/lib/csv'
import type { LeadRow } from '@/types'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const HEADERS = [
  'id',
  'name',
  'whatsapp_number',
  'email',
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'created_at',
  'assessment_completed',
  'primary_pattern',
  'secondary_pattern',
]

export async function GET() {
  const user = await getSessionUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()
  const { data, error } = await supabase.from('leads').select('*').order('created_at', { ascending: false })

  if (error) {
    console.error('export leads failed', error)
    return NextResponse.json({ error: 'Failed to export leads.' }, { status: 500 })
  }

  const leads = (data ?? []) as LeadRow[]
  const rows = leads.map((lead) => [
    lead.id,
    lead.name,
    lead.whatsapp_number,
    lead.email,
    lead.utm_source,
    lead.utm_medium,
    lead.utm_campaign,
    lead.created_at,
    lead.assessment_completed,
    lead.primary_pattern,
    lead.secondary_pattern,
  ])

  const csv = toCsv(HEADERS, rows)
  const filename = `leads-export-${new Date().toISOString().slice(0, 10)}.csv`

  return new NextResponse(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  })
}
