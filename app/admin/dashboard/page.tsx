import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getSessionUser } from '@/lib/auth'
import { getDashboardStats, getLeadsPage } from '@/lib/admin-data'
import { getPatternById } from '@/lib/patterns'
import { SummaryCards } from '@/components/admin/SummaryCards'
import { PatternBreakdownChart } from '@/components/admin/PatternBreakdownChart'
import { LeadsTable } from '@/components/admin/LeadsTable'
import { SignOutButton } from '@/components/admin/SignOutButton'
import type { LeadSortColumn, SortDirection } from '@/lib/admin-data'

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

interface DashboardPageProps {
  searchParams: { q?: string; sort?: string; dir?: string; page?: string }
}

export default async function AdminDashboardPage({ searchParams }: DashboardPageProps) {
  const user = await getSessionUser()
  if (!user) {
    redirect('/admin/login')
  }

  const query = searchParams.q ?? ''
  const sort = (searchParams.sort as LeadSortColumn) ?? 'created_at'
  const dir = (searchParams.dir as SortDirection) ?? 'desc'
  const page = Number(searchParams.page) > 0 ? Number(searchParams.page) : 1

  const [stats, leadsPage] = await Promise.all([
    getDashboardStats(),
    getLeadsPage({ query, sort, dir, page }),
  ])

  const breakdownRows = stats.patternBreakdown.map((row) => ({
    name: getPatternById(row.pattern)?.name ?? row.pattern,
    count: row.count,
  }))

  return (
    <main className="min-h-screen bg-cream-100">
      <div className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-charcoal-900">Admin Dashboard</h1>
            <p className="text-sm text-charcoal-500">Relationship Pattern Assessment™</p>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="/api/admin/export"
              className="rounded-full bg-charcoal-900 px-4 py-2 text-sm font-medium text-white hover:bg-charcoal-700"
            >
              Export CSV
            </a>
            <SignOutButton />
          </div>
        </div>

        <div className="mt-8">
          <SummaryCards
            totalLeads={stats.totalLeads}
            completedLeads={stats.completedLeads}
            completionRate={stats.completionRate}
          />
        </div>

        <div className="mt-6">
          <PatternBreakdownChart rows={breakdownRows} />
        </div>

        <div className="mt-6">
          <LeadsTable
            leads={leadsPage.leads}
            page={leadsPage.page}
            totalPages={leadsPage.totalPages}
            totalCount={leadsPage.totalCount}
            query={query}
            sort={sort}
            dir={dir}
          />
        </div>
      </div>
    </main>
  )
}
