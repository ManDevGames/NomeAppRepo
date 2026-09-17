import 'server-only'
import { createAdminClient } from '@/lib/supabase/admin'
import { PATTERN_ORDER } from '@/types'
import type { LeadRow, PatternId, PatternScores, ResponseRow, ScoreRow } from '@/types'

export interface DashboardStats {
  totalLeads: number
  completedLeads: number
  completionRate: number
  patternBreakdown: { pattern: PatternId; count: number }[]
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = createAdminClient()

  const [{ count: totalLeads }, { count: completedLeads }, { data: patternsData }] = await Promise.all([
    supabase.from('leads').select('id', { count: 'exact', head: true }),
    supabase.from('leads').select('id', { count: 'exact', head: true }).eq('assessment_completed', true),
    supabase.from('leads').select('primary_pattern').eq('assessment_completed', true),
  ])

  const counts = new Map<PatternId, number>(PATTERN_ORDER.map((id) => [id, 0]))
  for (const row of patternsData ?? []) {
    const pattern = (row as { primary_pattern: PatternId | null }).primary_pattern
    if (pattern) counts.set(pattern, (counts.get(pattern) ?? 0) + 1)
  }

  const total = totalLeads ?? 0
  const completed = completedLeads ?? 0

  return {
    totalLeads: total,
    completedLeads: completed,
    completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
    patternBreakdown: PATTERN_ORDER.map((pattern) => ({ pattern, count: counts.get(pattern) ?? 0 })),
  }
}

export type LeadSortColumn = 'created_at' | 'name' | 'primary_pattern'
export type SortDirection = 'asc' | 'desc'

export interface LeadsPageParams {
  query?: string
  sort?: LeadSortColumn
  dir?: SortDirection
  page?: number
  pageSize?: number
}

export interface LeadsPageResult {
  leads: LeadRow[]
  page: number
  pageSize: number
  totalCount: number
  totalPages: number
}

const VALID_SORT_COLUMNS: LeadSortColumn[] = ['created_at', 'name', 'primary_pattern']

export async function getLeadsPage(params: LeadsPageParams): Promise<LeadsPageResult> {
  const supabase = createAdminClient()

  const page = Math.max(1, params.page ?? 1)
  const pageSize = params.pageSize ?? 25
  const sort = VALID_SORT_COLUMNS.includes(params.sort as LeadSortColumn) ? (params.sort as LeadSortColumn) : 'created_at'
  const dir: SortDirection = params.dir === 'asc' ? 'asc' : 'desc'

  let query = supabase
    .from('leads')
    .select('*', { count: 'exact' })
    .order(sort, { ascending: dir === 'asc' })
    .range((page - 1) * pageSize, page * pageSize - 1)

  const search = params.query?.trim()
  if (search) {
    const escaped = search.replace(/[%_]/g, (m) => `\\${m}`)
    query = query.or(`name.ilike.%${escaped}%,email.ilike.%${escaped}%,whatsapp_number.ilike.%${escaped}%`)
  }

  const { data, count, error } = await query

  if (error) {
    console.error('getLeadsPage failed', error)
    return { leads: [], page, pageSize, totalCount: 0, totalPages: 0 }
  }

  const totalCount = count ?? 0

  return {
    leads: (data ?? []) as LeadRow[],
    page,
    pageSize,
    totalCount,
    totalPages: Math.max(1, Math.ceil(totalCount / pageSize)),
  }
}

export interface LeadDetail {
  lead: LeadRow
  responses: ResponseRow[]
  scores: PatternScores
}

export async function getLeadDetail(leadId: string): Promise<LeadDetail | null> {
  const supabase = createAdminClient()

  const [{ data: lead, error: leadError }, { data: responses }, { data: scoreRows }] = await Promise.all([
    supabase.from('leads').select('*').eq('id', leadId).maybeSingle<LeadRow>(),
    supabase.from('responses').select('*').eq('lead_id', leadId).order('created_at', { ascending: true }),
    supabase.from('scores').select('*').eq('lead_id', leadId),
  ])

  if (leadError || !lead) return null

  const scores: PatternScores = {
    abandonment: 0,
    overthinking: 0,
    selfWorth: 0,
    trustProtection: 0,
    peoplePleasing: 0,
    repeatingPattern: 0,
  }
  for (const row of (scoreRows ?? []) as ScoreRow[]) {
    scores[row.pattern_name] = row.score_value
  }

  return {
    lead,
    responses: (responses ?? []) as ResponseRow[],
    scores,
  }
}
