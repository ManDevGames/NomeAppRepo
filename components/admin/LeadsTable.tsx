import Link from 'next/link'
import { getPatternById } from '@/lib/patterns'
import type { LeadRow, PatternId } from '@/types'
import type { LeadSortColumn, SortDirection } from '@/lib/admin-data'

interface LeadsTableProps {
  leads: LeadRow[]
  page: number
  totalPages: number
  totalCount: number
  query: string
  sort: LeadSortColumn
  dir: SortDirection
}

function buildHref(base: Record<string, string | number | undefined>) {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(base)) {
    if (value !== undefined && value !== '') params.set(key, String(value))
  }
  const qs = params.toString()
  return qs ? `/admin/dashboard?${qs}` : '/admin/dashboard'
}

function patternLabel(id: PatternId | null): string {
  if (!id) return '—'
  return getPatternById(id)?.name ?? id
}

function SortLink({
  column,
  label,
  query,
  sort,
  dir,
}: {
  column: LeadSortColumn
  label: string
  query: string
  sort: LeadSortColumn
  dir: SortDirection
}) {
  const nextDir: SortDirection = sort === column && dir === 'asc' ? 'desc' : 'asc'
  const isActive = sort === column

  return (
    <Link href={buildHref({ q: query, sort: column, dir: nextDir })} className="inline-flex items-center gap-1">
      {label}
      {isActive && <span aria-hidden="true">{dir === 'asc' ? '↑' : '↓'}</span>}
    </Link>
  )
}

export function LeadsTable({ leads, page, totalPages, totalCount, query, sort, dir }: LeadsTableProps) {
  return (
    <div className="rounded-2xl border border-charcoal-100 bg-white shadow-soft">
      <div className="flex flex-col gap-4 border-b border-charcoal-100 p-5 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-base font-semibold text-charcoal-900">Leads ({totalCount})</h2>
        <form action="/admin/dashboard" method="get" className="flex gap-2">
          <label htmlFor="lead-search" className="sr-only">
            Search leads
          </label>
          <input
            id="lead-search"
            type="search"
            name="q"
            defaultValue={query}
            placeholder="Search name, email, WhatsApp…"
            className="w-full rounded-full border border-charcoal-200 px-4 py-2 text-sm focus:border-rose-300 focus:outline-none sm:w-64"
          />
          <button
            type="submit"
            className="rounded-full bg-charcoal-900 px-4 py-2 text-sm font-medium text-white hover:bg-charcoal-700"
          >
            Search
          </button>
        </form>
      </div>

      {leads.length === 0 ? (
        <p className="p-8 text-center text-sm text-charcoal-500">
          {query ? `No leads match "${query}".` : 'No leads yet — they’ll show up here once the assessment starts getting submissions.'}
        </p>
      ) : (
        <>
          {/* Desktop table */}
          <table className="hidden w-full text-left text-sm sm:table">
            <thead>
              <tr className="border-b border-charcoal-100 text-xs uppercase tracking-wide text-charcoal-400">
                <th className="px-5 py-3 font-medium"><SortLink column="name" label="Name" query={query} sort={sort} dir={dir} /></th>
                <th className="px-5 py-3 font-medium">WhatsApp</th>
                <th className="px-5 py-3 font-medium">Email</th>
                <th className="px-5 py-3 font-medium"><SortLink column="created_at" label="Date" query={query} sort={sort} dir={dir} /></th>
                <th className="px-5 py-3 font-medium"><SortLink column="primary_pattern" label="Primary Pattern" query={query} sort={sort} dir={dir} /></th>
                <th className="px-5 py-3 font-medium">Secondary Pattern</th>
                <th className="px-5 py-3 font-medium">Completed</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id} className="border-b border-charcoal-50 last:border-0 hover:bg-cream-50">
                  <td className="px-5 py-3">
                    <Link href={`/admin/leads/${lead.id}`} className="font-medium text-charcoal-900 hover:text-rose-500">
                      {lead.name}
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-charcoal-600">{lead.whatsapp_number}</td>
                  <td className="px-5 py-3 text-charcoal-600">{lead.email}</td>
                  <td className="px-5 py-3 text-charcoal-600">{new Date(lead.created_at).toLocaleDateString('en-IN')}</td>
                  <td className="px-5 py-3 text-charcoal-600">{patternLabel(lead.primary_pattern)}</td>
                  <td className="px-5 py-3 text-charcoal-600">{patternLabel(lead.secondary_pattern)}</td>
                  <td className="px-5 py-3">
                    {lead.assessment_completed ? (
                      <span className="rounded-full bg-sage-100 px-2.5 py-1 text-xs text-sage-500">Yes</span>
                    ) : (
                      <span className="rounded-full bg-charcoal-100 px-2.5 py-1 text-xs text-charcoal-500">No</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile cards */}
          <div className="flex flex-col divide-y divide-charcoal-50 sm:hidden">
            {leads.map((lead) => (
              <Link
                key={lead.id}
                href={`/admin/leads/${lead.id}`}
                className="flex flex-col gap-1 p-5 hover:bg-cream-50"
              >
                <span className="font-medium text-charcoal-900">{lead.name}</span>
                <span className="text-sm text-charcoal-500">{lead.whatsapp_number} · {lead.email}</span>
                <span className="text-sm text-charcoal-600">{patternLabel(lead.primary_pattern)}</span>
                <span className="text-xs text-charcoal-400">{new Date(lead.created_at).toLocaleDateString('en-IN')}</span>
              </Link>
            ))}
          </div>
        </>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-charcoal-100 p-5 text-sm text-charcoal-600">
          <Link
            href={buildHref({ q: query, sort, dir, page: Math.max(1, page - 1) })}
            aria-disabled={page <= 1}
            className={page <= 1 ? 'pointer-events-none opacity-40' : 'hover:text-rose-500'}
          >
            ← Previous
          </Link>
          <span>
            Page {page} of {totalPages}
          </span>
          <Link
            href={buildHref({ q: query, sort, dir, page: Math.min(totalPages, page + 1) })}
            aria-disabled={page >= totalPages}
            className={page >= totalPages ? 'pointer-events-none opacity-40' : 'hover:text-rose-500'}
          >
            Next →
          </Link>
        </div>
      )}
    </div>
  )
}
