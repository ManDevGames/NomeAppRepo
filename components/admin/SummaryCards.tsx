interface SummaryCardsProps {
  totalLeads: number
  completedLeads: number
  completionRate: number
}

export function SummaryCards({ totalLeads, completedLeads, completionRate }: SummaryCardsProps) {
  const cards = [
    { label: 'Total Leads', value: totalLeads },
    { label: 'Assessments Completed', value: completedLeads },
    { label: 'Completion Rate', value: `${completionRate}%` },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {cards.map((card) => (
        <div key={card.label} className="rounded-2xl border border-charcoal-100 bg-white p-5 shadow-soft">
          <p className="text-sm text-charcoal-500">{card.label}</p>
          <p className="mt-1 text-3xl font-semibold text-charcoal-900">{card.value}</p>
        </div>
      ))}
    </div>
  )
}
