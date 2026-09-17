import type { MetadataRoute } from 'next'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://pattern.mindurmind.org.in'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/assessment', '/assessment/details'],
      disallow: ['/admin', '/assessment/result', '/api'],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
