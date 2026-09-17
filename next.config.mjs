/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: false,
  },
  experimental: {
    // puppeteer-core + @sparticuz/chromium (app/api/result-pdf/[leadId]/route.ts)
    // ship native binaries — webpack can't bundle those, so they must run as
    // real Node dependencies instead of being pulled into the server bundle.
    serverComponentsExternalPackages: ['puppeteer-core', '@sparticuz/chromium'],
  },
}

export default nextConfig
