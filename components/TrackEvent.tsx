'use client'

import { useEffect } from 'react'
import { track } from '@vercel/analytics'

/** Fires a Vercel Analytics event once when the page it's placed on mounts. */
export function TrackEvent({ event }: { event: string }) {
  useEffect(() => {
    track(event)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}
