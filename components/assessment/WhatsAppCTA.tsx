'use client'

import { track } from '@vercel/analytics'

interface WhatsAppCTAProps {
  href: string
  label: string
}

export function WhatsAppCTA({ href, label }: WhatsAppCTAProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      onClick={() => track('whatsapp_clicked')}
      className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-8 py-4 text-base sm:text-lg font-medium text-white shadow-soft transition-all duration-200 hover:shadow-card hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300 focus-visible:ring-offset-2"
    >
      {label}
    </a>
  )
}
