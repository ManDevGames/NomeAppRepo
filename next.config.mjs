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
    // Marking the package external (above) only stops webpack from bundling
    // it — Vercel's separate file-tracing step still needs to be told to
    // include its brotli-compressed Chromium binary, or the deployed
    // function 500s with "the input directory .../bin does not exist"
    // despite building and passing type-check locally. See
    // https://github.com/Sparticuz/chromium#bundler-configuration.
    //
    // The key format here is easy to get wrong (confirmed by tracing
    // Next's own collect-build-traces.js): it's matched against the
    // *normalized app route* — '/app' + the route with its trailing
    // '/route' stripped, e.g. '/app/api/result-pdf/[leadId]' — via
    // picomatch as a glob PATTERN, not a plain string. That means the
    // literal `[leadId]` segment must NOT appear in this key: picomatch
    // parses `[...]` as a character class, so a key containing it never
    // matches. Use a wildcard (`*`) for the dynamic segment instead.
    outputFileTracingIncludes: {
      '/app/api/result-pdf/*': ['./node_modules/@sparticuz/chromium/bin/**'],
    },
  },
}

export default nextConfig
